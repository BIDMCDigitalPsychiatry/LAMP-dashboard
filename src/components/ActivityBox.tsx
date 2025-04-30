// Core Imports
import React, { useEffect, useRef, useState } from "react"
import { Typography, Grid, Icon, Card, Box, ButtonBase, makeStyles, Theme, createStyles } from "@material-ui/core"
import LAMP, { Participant as ParticipantObj, Activity as ActivityObj } from "lamp-core"
import { ReactComponent as BreatheIcon } from "../icons/Breathe.svg"
import { ReactComponent as JournalIcon } from "../icons/Goal.svg"
import InfoIcon from "../icons/Info.svg"
import ScratchCard from "../icons/ScratchCard.svg"
import { useTranslation } from "react-i18next"
import ActivityPopup from "./ActivityPopup"
import ReactMarkdown from "react-markdown"
import emoji from "remark-emoji"
import gfm from "remark-gfm"
import { LinkRenderer } from "./ActivityPopup"
import ActivityAccordian from "./ActivityAccordian"
import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material"
import { getSelfHelpActivityEvents } from "./Participant"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cardlabel: {
      fontSize: 14,
      padding: "0 18px",
      bottom: 15,
      position: "absolute",
      width: "100%",
      height: "63px",
      overflow: "auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      [theme.breakpoints.down("sm")]: {
        fontSize: 13,
        padding: "0 5px",
        "& p": { marginBottom: "0", lineHeight: "16px" },
      },
      "& p": { margin: "0" },
    },
    scratch: {
      "& h2": {
        textAlign: "center !important",
      },
      "& h6": {
        textAlign: "center !important",
      },
    },
    dialogtitle: { padding: 0 },
    manage: {
      padding: "10px 0",
      minHeight: 180,
      textAlign: "center",
      boxShadow: "none",
      borderRadius: 18,
      position: "relative",
      width: "100%",
      "& svg": {
        [theme.breakpoints.up("lg")]: {
          width: 150,
          height: 150,
        },
      },

      [theme.breakpoints.up("lg")]: {
        minHeight: 240,
      },
    },
    mainIcons: {
      width: 80,
      height: 80,
      [theme.breakpoints.up("lg")]: {
        width: 130,
        height: 130,
      },
      [theme.breakpoints.down("sm")]: {
        width: 75,
        height: 75,
      },
    },
    thumbMain: { maxWidth: 255 },
    fullwidthBtn: { width: "100%" },
    blankMsg: {
      marginBottom: "15px",
      marginTop: "5px",
      "& path": { fill: "#666" },
      "& p": { margin: "2px 5px" },
    },
    assessH: {
      background: "#E7F8F2 !important",
    },
    learnH: {
      background: "#FFF9E5 !important",
    },
    manageH: {
      background: "#FFEFEC !important",
    },
    preventH: {
      background: "#ECF4FF !important",
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
  })
)

export const getActivityEvents = async (participant: any, activityId, moduleStartTime?) => {
  let from: Date
  if (moduleStartTime) {
    from = moduleStartTime
  } else {
    from = new Date()
    from.setMonth(from.getMonth() - 6)
  }
  let activityEvents =
    LAMP.Auth._auth.id === "selfHelp@demo.lamp.digital"
      ? await getSelfHelpActivityEvents(activityId, from.getTime(), new Date().getTime())
      : await LAMP.ActivityEvent.allByParticipant(
          participant?.id ?? participant,
          activityId,
          from.getTime(),
          new Date().getTime(),
          null,
          true
        )
  return activityEvents
}

const sortModulesByCompletion = (modules) => {
  if (!Array.isArray(modules)) return []
  return modules
    .map((module) => {
      const processedSubActivities = Array.isArray(module.subActivities)
        ? sortModulesByCompletion(module.subActivities)
        : []
      return {
        ...module,
        subActivities: module.sequentialOrdering
          ? module.subActivities // keep original order if sequentialOrdering is true
          : processedSubActivities.sort((a, b) => (a.isCompleted ? 1 : 0) - (b.isCompleted ? 1 : 0)),
      }
    })
    .sort((a, b) => (a.isCompleted ? 1 : 0) - (b.isCompleted ? 1 : 0))
}

export default function ActivityBox({ type, savedActivities, tag, participant, showStreak, ...props }) {
  const classes = useStyles()
  const [activity, setActivity] = useState(null)
  const [open, setOpen] = useState(false)
  const [questionCount, setQuestionCount] = React.useState(0)
  const [message, setMessage] = useState("")
  const [moduleData, setModuleData] = useState<any[]>([])
  const [shownActivities, setShownActivities] = useState([])
  const [loadingModules, setLoadingModules] = useState(true)
  const { t } = useTranslation()
  const [parentModuleLevel, setParentModuleLevel] = useState(0)
  const [showNotification, setShowNotification] = useState(false)
  const [moduleForNotification, setModuleForNotification] = useState(null)
  const [isParentModuleLoaded, setIsParentModuleLoaded] = useState(false) // Track parent module load

  const handleClickOpen = (y: any, isAuto = false) => {
    LAMP.Activity.view(y.id).then(async (data) => {
      if (y.spec === "lamp.module") {
        if (!isAuto) {
          setShownActivities((prev) => prev.filter((item) => item.id !== y.id))
        }
        const fromActivityList = true
        scrollToElement(y.id)
        const moduleStartTime = await getModuleStartTime(y.id)
        addActivityData(data, 0, moduleStartTime, fromActivityList)
      } else {
        setActivity(data)
        setOpen(true)
        y.spec === "lamp.dbt_diary_card"
          ? setQuestionCount(7)
          : y.spec === "lamp.survey"
          ? setQuestionCount(data.settings?.length ?? 0)
          : setQuestionCount(0)
      }
    })
  }

  const handleSubModule = async (activity, level) => {
    LAMP.Activity.view(activity.id).then((data) => {
      addActivityData(data, level, activity?.startTime)
    })
  }

  const checkIsModuleCompleted = async (id) => {
    let tag = [await LAMP.Type.getAttachment(null, "lamp.dashboard.completed")].map((y: any) =>
      !!y.error ? undefined : y.data
    )[0]
    const isCompleted = (tag || []).filter((t) => t.moduleId === id && t.participants.includes(participant.id))
    return isCompleted.length > 0 ? true : false
  }

  const createCompletedAttachment = async (id) => {
    let tag = [await LAMP.Type.getAttachment(null, "lamp.dashboard.completed")].map((y: any) =>
      !!y.error ? undefined : y.data
    )[0]
    let checkIsModule = (tag || []).filter((t) => t.moduleId === id)
    let checkNotModule = (tag || []).filter((t) => t.moduleId !== id)
    if (!checkIsModule.length) {
      checkNotModule.push({ moduleId: id, participants: [participant?.id] })
    } else {
      checkIsModule.forEach((item) => {
        if (!item.participants.includes(participant?.id)) {
          item.participants.push(participant?.id)
        }
      })
    }
    await LAMP.Type.setAttachment(null, "me", "lamp.dashboard.completed", checkNotModule.concat(checkIsModule))
  }

  const getModuleStartTime = async (id, startTime = null) => {
    let moduleStartTime
    await getActivityEvents(participant, id, startTime).then((res) => {
      if (res?.length) {
        const smallestTimestamp = new Date(Math.min(...res.map((event) => new Date(event.timestamp).getTime())))
        moduleStartTime = smallestTimestamp
      } else {
        moduleStartTime = null
      }
    })
    return moduleStartTime
  }

  const addModuleActivityEvent = async (data) => {
    let activityEventCreated = false
    let moduleStartTime = null
    if (data?.startTime) {
      moduleStartTime = await getModuleStartTime(data.id, data?.startTime)
    } else {
      moduleStartTime = await getModuleStartTime(data.id)
    }
    if (moduleStartTime != null) {
      let arr = []
      let ids = data?.settings?.activities || []
      let validIds = []
      for (const id of ids) {
        try {
          const fetchedData = await LAMP.Activity.view(id)
          if (fetchedData != null) {
            validIds.push(id)
          }
          if (fetchedData.spec === "lamp.module") {
            fetchedData["startTime"] = moduleStartTime
          }
          const activityEvents =
            moduleStartTime === null ? [] : await getActivityEvents(participant, id, moduleStartTime)
          if (
            (activityEvents.length > 0 && fetchedData.spec !== "lamp.module") ||
            (fetchedData.spec === "lamp.module" && (await addModuleActivityEvent(fetchedData)))
          ) {
            arr.push(id)
          }
        } catch (error) {
          console.error("Error fetching data for id:", id, error)
        }
      }
      if (arr.length === validIds.length) {
        if (await checkIsModuleCompleted(data.id)) {
          activityEventCreated = true
        } else {
          LAMP.ActivityEvent.create(participant.id ?? participant, {
            timestamp: new Date().getTime(),
            duration: new Date().getTime() - moduleStartTime,
            activity: data.id,
            static_data: {},
          })
          createCompletedAttachment(data.id)
          activityEventCreated = true
        }
      }
    }
    return activityEventCreated
  }

  console.log("moduleData", moduleData)

  const addActivityData = async (data, level, startTime, fromActivityList = false) => {
    let moduleActivityData = { ...data }
    let moduleStartTime = startTime
    let moduleStarted = moduleStartTime != null
    const ids = data?.settings?.activities || []
    const sequential = data?.settings?.sequential_ordering === true
    const hideOnCompletion = data?.settings?.hide_on_completion === true
    const trackProgress = data?.settings?.track_progress === true
    let sequentialActivityAdded = false
    let isModuleCompleted = await addModuleActivityEvent(data)
    const arr = []
    for (const id of ids) {
      try {
        const [activityEvents, fetchedData] = await Promise.all([
          moduleStartTime === null ? [] : getActivityEvents(participant, id, moduleStartTime),
          LAMP.Activity.view(id),
        ])

        if (fetchedData.spec === "lamp.module") {
          fetchedData["startTime"] = moduleStartTime
        }

        const eventCreated =
          fetchedData.spec === "lamp.module" && moduleStarted ? await addModuleActivityEvent(fetchedData) : false
        delete fetchedData.settings

        if (
          (moduleStartTime && activityEvents.length > 0 && fetchedData.spec !== "lamp.module") ||
          (fetchedData.spec === "lamp.module" && eventCreated)
        ) {
          fetchedData["isCompleted"] = true
          if (hideOnCompletion) {
            fetchedData["isHidden"] = true
          }
        } else {
          if (sequential && !sequentialActivityAdded) {
            sequentialActivityAdded = true
            if (fetchedData.spec === "lamp.module" && activityEvents.length === 0) {
              setModuleForNotification(fetchedData)
            }
          } else if (sequential && sequentialActivityAdded) {
            fetchedData["isHidden"] = true
          }
        }

        arr.push(fetchedData)
      } catch (error) {
        console.error("Error fetching data for id:", id, error)
        arr.push(null)
      }
    }
    const filteredArr = arr
    const updateSubActivities = (subActivities, itemLevel) => {
      return subActivities.map((itm) => {
        if (itm.id === moduleActivityData.id && level === itemLevel && !itm.subActivities) {
          setParentModuleLevel(level + 1)
          return {
            ...itm,
            isHidden: true,
            subActivities: filteredArr,
            level: level + 1,
            sequentialOrdering: sequential,
            trackProgress: trackProgress,
          }
        }
        if (itm.subActivities?.length > 0) {
          return {
            ...itm,
            subActivities: updateSubActivities(itm.subActivities, itm.level),
          }
        }
        return itm
      })
    }
    delete moduleActivityData.settings
    if (moduleData.length > 0 && !fromActivityList) {
      const updatedData = moduleData.map((item) => {
        if (!item.subActivities && item.id === moduleActivityData.id && item.level === level) {
          setParentModuleLevel(level + 1)
          return {
            ...item,
            isHidden: true,
            level: level + 1,
            subActivities: filteredArr,
            sequentialOrdering: sequential,
            trackProgress: trackProgress,
          }
        }
        if (item.subActivities?.length > 0) {
          return {
            ...item,
            subActivities: updateSubActivities(item.subActivities, item.level),
          }
        }
        return item
      })
      const sortedData = sortModulesByCompletion(updatedData)
      setModuleData(sortedData)
    } else {
      moduleActivityData.subActivities = filteredArr
      moduleActivityData.level = level + 1
      if (trackProgress) {
        moduleActivityData.trackProgress = trackProgress
      }
      if (isModuleCompleted) {
        moduleActivityData.isCompleted = true
      }
      if (sequential) {
        moduleActivityData.sequentialOrdering = true
      }
      setParentModuleLevel(level + 1)
      setModuleData((prev) => sortModulesByCompletion([...prev, moduleActivityData]))
    }
    setLoadingModules(false)
  }

  useEffect(() => {
    if (!!moduleForNotification && isParentModuleLoaded) {
      setTimeout(() => {
        setShowNotification(true)
      }, 300)
    }
  }, [moduleForNotification, isParentModuleLoaded])

  useEffect(() => {
    const runAsync = async () => {
      setLoadingModules(true)
      const activitiesList = savedActivities
      const initializeOpenedModules = activitiesList.filter(
        (activity) => activity.spec === "lamp.module" && activity?.settings?.initialize_opened
      )

      if (initializeOpenedModules.length > 0) {
        for (const activity of initializeOpenedModules) {
          await handleClickOpen(activity, true)
        }

        setShownActivities(savedActivities.filter((a) => !initializeOpenedModules.some((b) => b.id === a.id)))
      } else {
        setShownActivities(savedActivities)
        setLoadingModules(false)
      }
    }
    runAsync()
  }, [savedActivities])

  const scrollToElement = (id) => {
    setTimeout(() => {
      if (document.getElementById(id)) {
        document.getElementById(id).scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
      }
    }, 4000)
  }

  useEffect(() => {
    setMessage("There are no " + type + " activities available.")
  }, [type])

  return (
    <Box>
      {moduleData.length ? (
        <ActivityAccordian
          data={moduleData.concat({ name: "Other activities", level: 1, subActivities: shownActivities })}
          type={type}
          tag={tag}
          handleClickOpen={handleClickOpen}
          handleSubModule={handleSubModule}
          participant={participant}
          moduleForNotification={moduleForNotification}
          setIsParentModuleLoaded={setIsParentModuleLoaded}
        />
      ) : !loadingModules ? (
        <Grid container spacing={2}>
          {savedActivities.length
            ? savedActivities.map((activity) => (
                <Grid
                  item
                  xs={6}
                  sm={4}
                  md={3}
                  lg={3}
                  onClick={() => {
                    handleClickOpen(activity)
                  }}
                  className={classes.thumbMain}
                >
                  <ButtonBase focusRipple className={classes.fullwidthBtn}>
                    <Card
                      className={
                        classes.manage +
                        " " +
                        (type === "Manage"
                          ? classes.manageH
                          : type === "Assess"
                          ? classes.assessH
                          : type === "Learn"
                          ? classes.learnH
                          : classes.preventH)
                      }
                    >
                      <Box mt={2} mb={1}>
                        <Box
                          className={classes.mainIcons}
                          style={{
                            margin: "auto",
                            background: tag.filter((x) => x.id === activity?.id)[0]?.photo
                              ? `url(${
                                  tag.filter((x) => x.id === activity?.id)[0]?.photo
                                }) center center/contain no-repeat`
                              : activity.spec === "lamp.breathe"
                              ? `url(${BreatheIcon}) center center/contain no-repeat`
                              : activity.spec === "lamp.journal"
                              ? `url(${JournalIcon}) center center/contain no-repeat`
                              : activity.spec === "lamp.scratch_image"
                              ? `url(${ScratchCard}) center center/contain no-repeat`
                              : `url(${InfoIcon}) center center/contain no-repeat`,
                          }}
                        ></Box>
                      </Box>
                      <Typography className={classes.cardlabel}>
                        <ReactMarkdown
                          children={t(activity.name)}
                          skipHtml={false}
                          remarkPlugins={[gfm, emoji]}
                          components={{ link: LinkRenderer }}
                        />
                      </Typography>
                    </Card>
                  </ButtonBase>
                </Grid>
              ))
            : type !== "Portal" && (
                <Box display="flex" className={classes.blankMsg} ml={1}>
                  <Icon>info</Icon>
                  <p>{`${t(message)}`}</p>
                </Box>
              )}
        </Grid>
      ) : (
        <Backdrop className={classes.backdrop} open={loadingModules}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <ActivityPopup
        activity={activity}
        tag={tag}
        questionCount={questionCount}
        open={open}
        onClose={() => setOpen(false)}
        type={type}
        showStreak={showStreak}
        participant={participant}
      />
      {!!moduleForNotification && (
        <Dialog
          open={showNotification}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {`${t("The " + moduleForNotification?.name + " module is now available for you to start.")}`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                handleSubModule(moduleForNotification, parentModuleLevel)
                setShowNotification(false)
                setModuleForNotification(null)
                scrollToElement(moduleForNotification?.id)
                setIsParentModuleLoaded(false)
              }}
              color="primary"
              autoFocus
            >
              {`${t("OK")}`}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  )
}
