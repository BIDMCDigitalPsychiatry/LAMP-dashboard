// Core Imports
import React, { useEffect, useRef, useState } from "react"
import { Typography, Grid, Icon, Card, Box, ButtonBase, makeStyles, Theme, createStyles, Tab } from "@material-ui/core"
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
import VideoMeeting from "../icons/Video.svg"
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
import { extractIdsWithHierarchy } from "./helper"
import { tags_object } from "./data_portal/DataPortalShared"
import { TabContext, TabList, TabPanel } from "@material-ui/lab"

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
    thumbMain: {
      maxWidth: 255,
      position: "relative",
    },
    favstar: {
      position: "absolute",
      top: 24,
      left: 24,
      zIndex: 1,
      color: "#f9d801",
    },
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
    tabPanelMain: {
      paddingLeft: 0,
      paddingRight: 0,
    },
    tabHeader: {
      "& button": {
        fontSize: 15,
        fontWeight: 600,
        minWidth: "auto",
        padding: 0,
        margin: "0 30px",
        "&:first-child": {
          marginLeft: 0,
        },
        "&.Mui-selected": {
          color: "#7599FF",
        },
        [theme.breakpoints.down("xs")]: {
          fontSize: 14,
          margin: "0 12px",
        },
      },
      "& .MuiTabs-indicator": {
        backgroundColor: "#7599FF",
      },
    },
  })
)

export const getActivityEvents = async (participant: any, activityId, moduleStartTime?) => {
  let from: Date
  if (moduleStartTime) {
    from = new Date(moduleStartTime)
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
          from?.getTime(),
          new Date().getTime(),
          null,
          true
        )
  return activityEvents
}

export const sortModulesByCompletion = (modules) => {
  if (!Array.isArray(modules)) return []
  return modules
    .map((module) => {
      const processedSubActivities = Array.isArray(module?.subActivities)
        ? sortModulesByCompletion(module?.subActivities)
        : []
      return {
        ...module,
        subActivities: module?.sequentialOrdering
          ? module?.subActivities // keep original order if sequentialOrdering is true
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
  const [moduleDataLoadedFromStore, setModuleDataLoadedFromStore] = useState(false)
  const [pendingSubModules, setPendingSubModules] = useState(null)
  let moduleDataFromStore = null
  if (localStorage.getItem("lastActiveTab") === type) {
    moduleDataFromStore = localStorage.getItem("moduleData")
  } else {
    localStorage.removeItem("moduleData")
  }

  const handleClickOpen = (y: any, isAuto = false) => {
    LAMP.Activity.view(y.id).then(async (data) => {
      if (y.spec === "lamp.module") {
        if (!isAuto) {
          setShownActivities((prev) => prev.filter((item) => item.id !== y.id))
        }
        const fromActivityList = true
        const moduleStartTime = await getModuleStartTime(y.id)
        const initializeOpenedModule = isAuto ? true : false
        addActivityData(data, 0, moduleStartTime, null, null, initializeOpenedModule, false, fromActivityList)
      } else {
        localStorage.setItem("parentString", y?.parentString)
        localStorage.setItem("lastActiveTab", type)
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

  const handleInitializeOpenedModules = (y: any, isAuto = false) => {
    return LAMP.Activity.view(y.id).then(async (data) => {
      if (y.spec === "lamp.module") {
        if (!isAuto) {
          setShownActivities((prev) => prev.filter((item) => item.id !== y.id))
        }
        const fromActivityList = true
        const moduleStartTime = await getModuleStartTime(y.id)
        const initializeOpenedModule = isAuto ? true : false
        await addActivityData(data, 0, moduleStartTime, null, null, initializeOpenedModule, false, fromActivityList)
      }
    })
  }

  const handleSubModule = async (activity, level, fromLocalStore = false) => {
    const moduleStartTime = await getModuleStartTime(activity?.id, activity?.startTime)
    LAMP.Activity.view(activity.id).then((data) => {
      addActivityData(
        data,
        level,
        moduleStartTime,
        activity?.parentModule,
        activity?.parentString,
        false,
        fromLocalStore
      )
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

  const updateModuleStartTime = (module, startTime) => {
    setLoadingModules(true)
    const updatedData = moduleData.map((item) => {
      if (item.id === module.id && item.parentModule == module.parentModule) {
        return {
          ...item,
          subActivities: updateTime(module, item.subActivities, startTime),
        }
      }
      if (item.subActivities?.length > 0) {
        return {
          ...item,
          subActivities: updateTime(module, item.subActivities, startTime),
        }
      }
      return item
    })
    setModuleData(updatedData)
    setLoadingModules(false)
  }

  const updateTime = (module, subActivities, startTime) => {
    return subActivities.map((itm) => {
      if (itm.parentModule === module.id && itm.spec === "lamp.module") {
        return {
          ...itm,
          startTime: startTime,
        }
      }
      if (itm.subActivities?.length > 0) {
        return {
          ...itm,
          subActivities: updateTime(module, itm.subActivities, startTime),
        }
      }
      return itm
    })
  }
  const addActivityData = async (
    data,
    level,
    startTime,
    parent,
    parentString,
    initializeOpenedModule,
    fromLocalStore,
    fromActivityList = false
  ) => {
    setLoadingModules(true)
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
        const parentsString = parentString ? parentString + ">" + data?.id : data?.id
        fetchedData["parentString"] = parentsString
        fetchedData["parentModule"] = data.id
        const eventCreated =
          fetchedData.spec === "lamp.module" && moduleStarted ? await addModuleActivityEvent(fetchedData) : false
        delete fetchedData.settings

        if (
          (moduleStarted && activityEvents.length > 0 && fetchedData.spec !== "lamp.module") ||
          (fetchedData.spec === "lamp.module" && eventCreated)
        ) {
          fetchedData["isCompleted"] = true
          if (hideOnCompletion) {
            fetchedData["isHidden"] = true
          }
        } else {
          if (sequential && !sequentialActivityAdded) {
            sequentialActivityAdded = true
            if (moduleStarted && fetchedData.spec === "lamp.module" && activityEvents.length === 0) {
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
    const filteredArr = arr.filter((item) => item != null)

    const updateSubActivities = (subActivities, itemLevel) => {
      return subActivities.map((itm) => {
        if (itm.id === moduleActivityData.id && level === itemLevel && itm.parentModule === parent) {
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
        if (item.id === moduleActivityData.id && item.level === level && item.parentModule === parent) {
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
    if (!initializeOpenedModule) {
      if (!fromLocalStore) {
        scrollToElement(parentString ? parentString + ">" + data.id : data.id)
      } else {
        if (parentString ? parentString + ">" + data.id : data.id === localStorage.getItem("parentString")) {
          scrollToElement(localStorage.getItem("parentString"))
        }
      }
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

  function moduleDataIsReady() {
    if (moduleData?.length > 0) {
      return true
    } else {
      return false
    }
  }

  useEffect(() => {
    if (pendingSubModules?.length > 0 && moduleDataIsReady()) {
      processSubModules(pendingSubModules)
      setPendingSubModules(null) // Clear it after processing
    }
  }, [moduleData, pendingSubModules])

  async function processActivities(data) {
    setLoadingModules(true)
    const tasks = []
    for (const activity of data) {
      tasks.push(handleInitializeOpenedModules({ spec: "lamp.module", id: activity.id }, true))
    }
    try {
      await Promise.all(tasks)
    } catch (err) {
      console.error("Error:", err)
    } finally {
      const subModules = data
        .filter((activity) => activity.spec === "lamp.module" && activity?.subActivities?.length > 0)
        .map((activity) => activity.subActivities.filter((item) => item.spec === "lamp.module"))
        .flat()
      setPendingSubModules(subModules)
      setLoadingModules(false)
    }
  }

  function processSubModules(subActivities) {
    subActivities
      .filter((item) => item.spec === "lamp.module")
      .forEach(async (sub) => {
        if (sub.spec === "lamp.module") {
          const startTime = new Date(sub.startTime).toString()
          await handleSubModule(
            { id: sub.id, startTime: startTime, parentModule: sub.parentModule, parentString: sub.parentString },
            sub.level - 1,
            true
          )
        }
        if (sub.subActivities) {
          processSubModules(sub.subActivities)
        }
      })
  }
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    localStorage.removeItem("enabledActivities")
    localStorage.removeItem("SurveyId")
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i)
      if (key.startsWith("activity-survey-")) {
        localStorage.removeItem(key)
      }
    }
    localStorage.removeItem("lastAnsweredIndex")
    ;(async () => {
      let tag =
        [await LAMP.Type.getAttachment(participant.id, "lamp.dashboard.favorite_activities")].map((y: any) =>
          !!y.error ? undefined : y.data
        )[0] ?? []
      setFavorites((savedActivities || []).filter((activity) => tag.includes(activity.id)))
    })()

    const runAsync = async () => {
      const activitiesList = savedActivities
      const initializeOpenedModules = activitiesList.filter(
        (activity) => activity.spec === "lamp.module" && activity?.settings?.initialize_opened
      )

      if (initializeOpenedModules.length > 0) {
        setLoadingModules(true)
        const tasks = []
        for (const activity of initializeOpenedModules) {
          tasks.push(handleInitializeOpenedModules(activity, true))
        }
        try {
          await Promise.all(tasks)
        } catch (err) {
          console.error("Error:", err)
        } finally {
          setLoadingModules(false) // Reset loader
        }
        setShownActivities(savedActivities.filter((a) => !initializeOpenedModules.some((b) => b.id === a.id)))
      } else {
        setShownActivities(savedActivities)
        setLoadingModules(false)
      }
    }

    if (!moduleDataLoadedFromStore && savedActivities && savedActivities.length > 0) {
      if (!moduleDataFromStore) runAsync()
      else {
        const data = JSON.parse(moduleDataFromStore)
        processActivities(data)
        setShownActivities(savedActivities.filter((a) => !data.some((b) => b.id === a.id)))
        setLoadingModules(false)
        localStorage.removeItem("moduleData")
        localStorage.removeItem("parentString")
        setModuleDataLoadedFromStore(true)
      }
    } else if (savedActivities && savedActivities.length === 0) {
      // Handle case when savedActivities is empty
      setShownActivities([])
      setLoadingModules(false)
    }
  }, [savedActivities])

  const scrollToElement = (id) => {
    const el = document.getElementById(id)
    setTimeout(() => {
      if (el) {
        el.style.scrollMarginTop = "100px"
        el.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
      }
    }, 1000)
  }

  useEffect(() => {
    setMessage("There are no " + type + " activities available.")
  }, [type])

  const updateLocalStorage = () => {
    localStorage.setItem("moduleData", JSON.stringify(extractIdsWithHierarchy(moduleData)))
  }

  const [tab, setTab] = useState("modules")

  useEffect(() => {
    if (favorites.length > 0) {
      if (typeof favorites[0]?.id == "undefined") {
        setFavorites(savedActivities.filter((activity) => favorites.includes(activity.id)))
      }
      setTab("favorite")
    } else {
      setTab("modules")
    }
  }, [favorites])

  useEffect(() => {
    if (tab === "favorite") {
      ;(async () => {
        let tag =
          [await LAMP.Type.getAttachment(participant?.id, "lamp.dashboard.favorite_activities")].map((y: any) =>
            !!y.error ? undefined : y.data
          )[0] ?? []
        setFavorites(savedActivities.filter((activity) => tag.includes(activity.id)))
      })()
    }
  }, [tab])
  return (
    <Box>
      <TabContext value={tab}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          {(favorites || []).length > 0 ? (
            <TabList onChange={(e, val) => setTab(val)} className={classes.tabHeader}>
              <Tab label="Favorites" value="favorite" />
              <Tab label="Modules" value="modules" />
              <Tab label="Other Activities" value="other" />
            </TabList>
          ) : (
            <TabList onChange={(e, val) => setTab(val)} className={classes.tabHeader}>
              <Tab label="Modules" value="modules" />
              <Tab label="Other Activities" value="other" />
            </TabList>
          )}
        </Box>
        {(favorites || []).length > 0 && (
          <TabPanel value="favorite" className={classes.tabPanelMain}>
            {((moduleData || []).filter((activity) => (favorites || []).some((fav) => fav?.id === activity?.id)) || [])
              .length ? (
              <ActivityAccordian
                data={(
                  moduleData?.filter((activity) => favorites?.some((fav) => fav?.id === activity?.id)) || []
                ).concat({
                  name: "Other activities",
                  level: 1,
                  subActivities: shownActivities.filter((activity) => favorites.includes(activity)),
                })}
                type={type}
                tag={tag}
                handleClickOpen={handleClickOpen}
                handleSubModule={handleSubModule}
                participant={participant}
                moduleForNotification={moduleForNotification}
                setIsParentModuleLoaded={setIsParentModuleLoaded}
                updateModuleStartTime={updateModuleStartTime}
                favorites={favorites}
                setFavorites={setFavorites}
              />
            ) : (
              <Grid container spacing={2}>
                {(favorites || []).length ? (
                  (favorites || []).map((activity) => (
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
                      <Icon className={classes.favstar}>star_rounded</Icon>
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
                                  : activity?.spec === "lamp.breathe"
                                  ? `url(${BreatheIcon}) center center/contain no-repeat`
                                  : activity?.spec === "lamp.journal"
                                  ? `url(${JournalIcon}) center center/contain no-repeat`
                                  : activity?.spec === "lamp.scratch_image"
                                  ? `url(${ScratchCard}) center center/contain no-repeat`
                                  : activity?.spec === "lamp.zoom_meeting"
                                  ? `url(${VideoMeeting}) center center/contain no-repeat`
                                  : `url(${InfoIcon}) center center/contain no-repeat`,
                              }}
                            ></Box>
                          </Box>
                          <Typography className={classes.cardlabel}>
                            <ReactMarkdown
                              children={t(activity?.name)}
                              skipHtml={false}
                              remarkPlugins={[gfm, emoji]}
                              components={{ link: LinkRenderer }}
                            />
                          </Typography>
                        </Card>
                      </ButtonBase>
                    </Grid>
                  ))
                ) : (
                  <Box display="flex" className={classes.blankMsg} ml={1}>
                    <Icon>info</Icon>
                    <p>{`${t(message)}`}</p>
                  </Box>
                )}
              </Grid>
            )}
          </TabPanel>
        )}
        <TabPanel value="modules" className={classes.tabPanelMain}>
          {(moduleData || []).length > 0 ? (
            <ActivityAccordian
              data={(moduleData || []).concat({
                name: "Unstarted Modules",
                level: 1,
                subActivities: shownActivities.filter((activity) => activity.spec == "lamp.module"),
              })}
              type={type}
              tag={tag}
              handleClickOpen={handleClickOpen}
              handleSubModule={handleSubModule}
              participant={participant}
              setFavorites={setFavorites}
              moduleForNotification={moduleForNotification}
              setIsParentModuleLoaded={setIsParentModuleLoaded}
              updateModuleStartTime={updateModuleStartTime}
              favorites={favorites}
            />
          ) : (
            <Grid container spacing={2}>
              {(savedActivities || []).filter((activity) => activity.spec == "lamp.module").length ? (
                (savedActivities || [])
                  .filter((activity) => activity.spec == "lamp.module")
                  .map((activity) => (
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
                      {favorites?.filter((f) => f?.id == activity?.id)?.length > 0 && (
                        <Icon className={classes.favstar}>star_rounded</Icon>
                      )}

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
              ) : (
                <Box display="flex" className={classes.blankMsg} ml={1}>
                  <Icon>info</Icon>
                  <p>{`${t("No modules available")}`}</p>
                </Box>
              )}
            </Grid>
          )}
        </TabPanel>
        <TabPanel value="other" className={classes.tabPanelMain}>
          <Grid container spacing={2}>
            {(savedActivities || []).filter((activity) => activity.spec != "lamp.module").length ? (
              (savedActivities || [])
                .filter((activity) => activity.spec != "lamp.module")
                .map((activity) => (
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
                    {(favorites || []).filter((f) => f?.id == activity?.id).length > 0 && (
                      <Icon className={classes.favstar}>star_rounded</Icon>
                    )}

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
                                : activity?.spec === "lamp.zoom_meeting"
                                ? `url(${VideoMeeting}) center center/contain no-repeat`
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
            ) : (
              <Box display="flex" className={classes.blankMsg} ml={1}>
                <Icon>info</Icon>
                <p>{`${t(message)}`}</p>
              </Box>
            )}
          </Grid>
        </TabPanel>
      </TabContext>
      {loadingModules && (
        <Backdrop className={classes.backdrop} open={loadingModules}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}

      <ActivityPopup
        activity={activity}
        tag={tag}
        questionCount={questionCount}
        updateLocalStorage={updateLocalStorage}
        open={open}
        onClose={() => setOpen(false)}
        type={type}
        showStreak={showStreak}
        participant={participant}
        setFavorites={setFavorites}
        savedActivities={savedActivities}
        tab={tab}
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
                setIsParentModuleLoaded(false)
              }}
              color="primary"
            >
              {`${t("OK")}`}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  )
}
