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
  DialogTitle,
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

const getActivityEvents = async (participant: any, activityId: string, moduleStartTime?) => {
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
  const [showNotification, setShowNotification] = useState(false)
  const [moduleNameForNotification, setModuleNameForNotification] = useState("")
  const divRef = useRef<HTMLDivElement | null>(null)

  const handleClickOpen = (y: any, isAuto = false) => {
    LAMP.Activity.view(y.id).then(async (data) => {
      if (y.spec === "lamp.module") {
        // Don't remove item if this was triggered by auto-open logic
        if (!isAuto) {
          setShownActivities((prev) => prev.filter((item) => item.id !== y.id))
        }
        const fromActivityList = true
        let moduleStartTime
        await getActivityEvents(participant, y.id).then((res) => {
          if (res?.length) {
            const smallestTimestamp = new Date(Math.min(...res.map((event) => new Date(event.timestamp).getTime())))
            moduleStartTime = smallestTimestamp
          } else {
            moduleStartTime = null
          }
        })
        scrollToElement()
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
    let moduleStartTime
    await getActivityEvents(participant, activity.id).then((res) => {
      if (res?.length) {
        const smallestTimestamp = new Date(Math.min(...res.map((event) => new Date(event.timestamp).getTime())))
        moduleStartTime = smallestTimestamp
      } else {
        moduleStartTime = null
      }
    })
    LAMP.Activity.view(activity.id).then((data) => {
      addActivityData(data, level, moduleStartTime)
    })
  }

  const addModuleActivityEvent = async (data) => {
    let activityEventCreated = false
    let moduleStartTime
    await getActivityEvents(participant, data.id).then((res) => {
      if (res?.length && res.length < 2) {
        const smallestTimestamp = new Date(Math.min(...res.map((event) => new Date(event.timestamp).getTime())))
        moduleStartTime = smallestTimestamp
      } else {
        moduleStartTime = null
      }
    })
    if (moduleStartTime != null) {
      let arr = []
      let ids = data?.settings?.activities || []
      for (const id of ids) {
        try {
          const fetchedData = await LAMP.Activity.view(id)
          const activityEvents =
            moduleStartTime === null ? [] : await getActivityEvents(participant, id, moduleStartTime)
          if (
            (activityEvents.length > 0 && fetchedData.spec !== "lamp.module") ||
            (fetchedData.spec === "lamp.module" && activityEvents.length > 1)
          ) {
            arr.push(id)
          }
        } catch (error) {
          console.error("Error fetching data for id:", id, error)
        }
      }
      if (arr.length === ids.length) {
        LAMP.ActivityEvent.create(participant.id ?? participant, {
          timestamp: new Date().getTime(),
          duration: new Date().getTime() - moduleStartTime,
          activity: data.id,
          static_data: {},
        })
        activityEventCreated = true
      }
    }

    return activityEventCreated
  }

  const addActivityData = async (data, level, moduleStartTime, fromActivityList = false) => {
    let moduleActivityData = { ...data }
    const ids = data?.settings?.activities || []
    const sequential = data?.settings?.sequential_ordering === true
    const hideOnCompletion = data?.settings?.hide_on_completion === true
    const trackProgress = data?.settings?.track_progress === true
    let sequentialActivityAdded = false
    // Fetch activity data
    const arr = []

    for (const id of ids) {
      try {
        const activityEvents = moduleStartTime === null ? [] : await getActivityEvents(participant, id, moduleStartTime)
        const fetchedData = await LAMP.Activity.view(id)
        let eventCreated
        if (fetchedData.spec === "lamp.module") {
          eventCreated = await addModuleActivityEvent(fetchedData)
        }
        delete fetchedData.settings
        if (
          (activityEvents.length > 0 && fetchedData.spec !== "lamp.module") ||
          (fetchedData.spec === "lamp.module" && activityEvents.length > 1)
        ) {
          fetchedData["isCompleted"] = true
          if (hideOnCompletion) {
            fetchedData["isHidden"] = true
          }
        } else if (eventCreated === true) {
          fetchedData["isCompleted"] = true
        } else {
          if (sequential && !sequentialActivityAdded) {
            sequentialActivityAdded = true
            if (fetchedData.spec === "lamp.module" && activityEvents.length === 0) {
              setShowNotification(true)
              setModuleNameForNotification(fetchedData.name)
            }
          } else if (sequential && sequentialActivityAdded) {
            fetchedData["isHidden"] = true
          }
        }

        arr.push(fetchedData)
      } catch (error) {
        console.error("Error fetching data for id:", id, error)
      }
    }
    const updateSubActivities = (subActivities, itemLevel) => {
      return subActivities.map((itm) => {
        if (itm.id === moduleActivityData.id && level === itemLevel && !itm.subActivities) {
          return {
            ...itm,
            isHidden: true,
            subActivities: arr,
            level: level + 1,
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
          return {
            ...item,
            isHidden: true,
            level: level + 1,
            subActivities: arr,
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
      setModuleData(updatedData)
    } else {
      moduleActivityData.subActivities = arr
      moduleActivityData.level = level + 1
      if (trackProgress) {
        moduleActivityData.trackProgress = trackProgress
      }
      setModuleData((prev) => [...prev, moduleActivityData])
    }
    setLoadingModules(false)
  }

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

  const scrollToElement = () => {
    if (divRef.current) {
      divRef.current.scrollIntoView({ behavior: "smooth" })
    }
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
          divRef={divRef}
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
      <Dialog open={showNotification} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`${t("The " + moduleNameForNotification + " module is now available for you to start.")}`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowNotification(false)
              setModuleNameForNotification("")
            }}
            color="primary"
            autoFocus
          >
            {`${t("OK")}`}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
