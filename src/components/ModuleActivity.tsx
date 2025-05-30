import React, { useEffect, useState } from "react"
import ActivityAccordian from "./ActivityAccordian"
import LAMP from "lamp-core"
import { getActivityEvents, sortModulesByCompletion } from "./ActivityBox"
import { useTranslation } from "react-i18next"
import ActivityPopup from "./ActivityPopup"
import { makeStyles, Theme, createStyles } from "@material-ui/core"
import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
} from "@mui/material"
import { extractIdsWithHierarchy } from "./helper"
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
    thumbContainer: { maxWidth: 1055, margin: "0 auto", paddingLeft: 8, paddingRight: 5 },
  })
)
const ModuleActivity = ({ ...props }) => {
  const { participant, moduleId } = props
  const classes = useStyles()
  const [activity, setActivity] = useState(null)
  const [open, setOpen] = useState(false)
  const [questionCount, setQuestionCount] = React.useState(0)
  const [moduleData, setModuleData] = useState<any[]>([])
  const [loadingModules, setLoadingModules] = useState(true)
  const { t } = useTranslation()
  const [parentModuleLevel, setParentModuleLevel] = useState(0)
  const [showNotification, setShowNotification] = useState(false)
  const [moduleForNotification, setModuleForNotification] = useState(null)
  const [isParentModuleLoaded, setIsParentModuleLoaded] = useState(false) // Track parent module load
  const moduleDataFromStore = localStorage.getItem("moduleData")
  const [moduleDataLoadedFromStore, setModuleDataLoadedFromStore] = useState(false)
  const [pendingSubModules, setPendingSubModules] = useState(null)

  useEffect(() => {
    console.log("moduleDataFromStore", moduleDataFromStore)
    if (!moduleDataLoadedFromStore) {
      const data = JSON.parse(moduleDataFromStore)
      if (data && data?.length > 0) {
        processActivities(data)
        localStorage.removeItem("moduleData")
        setModuleDataLoadedFromStore(true)
        setLoadingModules(false)
      } else {
        if (participant != null) handleClickOpen({ spec: "lamp.module", id: moduleId })
        localStorage.removeItem("activityFromModule")
      }
    }
  }, [moduleId, participant, moduleDataFromStore])

  useEffect(() => {
    const handleTabClose = (event) => {
      localStorage.setItem("ModuleActivityClosed", "true")
      localStorage.removeItem("activityFromModule")
    }

    window.addEventListener("beforeunload", handleTabClose)
    return () => {
      window.removeEventListener("beforeunload", handleTabClose)
    }
  }, [])

  useEffect(() => {
    if (!!moduleForNotification && isParentModuleLoaded) {
      setTimeout(() => {
        setShowNotification(true)
      }, 300)
    }
  }, [moduleForNotification, isParentModuleLoaded])

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

  const handleClickOpen = (y: any) => {
    LAMP.Activity.view(y.id).then(async (data) => {
      if (y.spec === "lamp.module") {
        const moduleStartTime = await getModuleStartTime(y.id)
        addActivityData(data, 0, moduleStartTime, null, null, false)
      } else {
        localStorage.setItem("activityFromModule", moduleId)
        localStorage.setItem("parentString", y?.parentString)
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

  const handleSubModule = async (activity, level, fromLocalStore = false) => {
    const moduleStartTime = await getModuleStartTime(activity?.id, activity?.startTime)
    LAMP.Activity.view(activity.id).then((data) => {
      addActivityData(data, level, moduleStartTime, activity?.parentModule, activity?.parentString, fromLocalStore)
    })
  }

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
      setPendingSubModules(null)
    }
  }, [moduleData, pendingSubModules])

  async function processActivities(data) {
    setLoadingModules(true)
    const tasks = []
    for (const activity of data) {
      tasks.push(handleClickOpen({ spec: "lamp.module", id: activity.id }))
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
    }
  }

  function processSubModules(subActivities) {
    subActivities
      .filter((item) => item.spec === "lamp.module")
      .forEach(async (sub) => {
        if (sub.spec === "lamp.module") {
          const startTime = new Date(sub.startTime).toString()
          await handleSubModule(
            { id: sub.id, startTime: startTime, parentModule: sub.parentModule },
            sub.level - 1,
            true
          )
        }
        if (sub.subActivities) {
          processSubModules(sub.subActivities)
        }
      })
  }

  const addActivityData = async (data, level, startTime, parent, parentString, fromLocalStore) => {
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
    if (moduleData.length > 0) {
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
    if (!fromLocalStore) {
      scrollToElement(parentString ? parentString + ">" + data.id : data.id)
    } else {
      if (parentString ? parentString + ">" + data.id : data.id === localStorage.getItem("parentString")) {
        scrollToElement(localStorage.getItem("parentString"))
      }
    }
    setLoadingModules(false)
  }

  const scrollToElement = (id) => {
    setTimeout(() => {
      if (document.getElementById(id)) {
        document.getElementById(id).scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
      }
    }, 1000)
  }

  const updateLocalStorage = () => {
    localStorage.setItem("moduleData", JSON.stringify(extractIdsWithHierarchy(moduleData)))
  }

  return (
    <>
      <Backdrop className={classes.backdrop} open={loadingModules}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid container className={classes.thumbContainer}>
        <Grid item xs>
          <ActivityAccordian
            data={moduleData}
            type={null}
            tag={null}
            handleClickOpen={handleClickOpen}
            handleSubModule={handleSubModule}
            participant={participant}
            moduleForNotification={moduleForNotification}
            setIsParentModuleLoaded={setIsParentModuleLoaded}
            updateModuleStartTime={updateModuleStartTime}
          />
          <ActivityPopup
            activity={activity}
            tag={null}
            questionCount={questionCount}
            open={open}
            updateLocalStorage={updateLocalStorage}
            onClose={() => setOpen(false)}
            type={null}
            showStreak={null}
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
                    setIsParentModuleLoaded(false)
                  }}
                  color="primary"
                >
                  {`${t("OK")}`}
                </Button>
              </DialogActions>
            </Dialog>
          )}
        </Grid>
      </Grid>
    </>
  )
}

export default ModuleActivity
