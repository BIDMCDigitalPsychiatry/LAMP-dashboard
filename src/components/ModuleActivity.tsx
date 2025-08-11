import React, { useEffect, useState } from "react"
import ActivityAccordian from "./ActivityAccordian"
import LAMP from "lamp-core"
import { addActivityEventForModule, getActivityEvents, sortModulesByCompletion } from "./ActivityBox"
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
import ResponsiveDialog from "./ResponsiveDialog"
import ActivityListForModule from "./ActivityListForModule"
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
  const [showNotification, setShowNotification] = useState(false)
  const [moduleForNotification, setModuleForNotification] = useState(null)
  const [isParentModuleLoaded, setIsParentModuleLoaded] = useState(false) // Track parent module load
  const [subModuleInLocalStorage, setSubModuleInLocalStorage] = useState([])
  const [openSubModules, setOpenSubModules] = useState([])
  const [subModuleData, setSubModuleData] = useState(null)
  const [parentString, setParentString] = useState("")
  const [indexToLoad, setIndexToLoad] = useState(-1)

  useEffect(() => {
    const fetchData = async () => {
      if (participant != null) {
        const module = localStorage.getItem("parentStringForSurvey")
        if (module) {
          const splitData = module.split(">")
          await handleClickOpen({ spec: "lamp.module", id: splitData[0] })
          setSubModuleInLocalStorage(splitData.slice(1))
        } else {
          handleClickOpen({ spec: "lamp.module", id: moduleId })
        }
        localStorage.removeItem("activityFromModule")
      }
    }
    fetchData()
    if (props.fromTab) {
      localStorage.setItem("moduleId", moduleId)
    }
  }, [moduleId, participant])

  useEffect(() => {
    const run = async () => {
      if (!!subModuleInLocalStorage && subModuleInLocalStorage?.length > 0 && openSubModules.length > 0) {
        const data = openSubModules[openSubModules.length - 1].subActivities.find(
          (mod) => mod.id === subModuleInLocalStorage[0]
        )
        if (data) {
          await handleSubModule(data)
          setSubModuleInLocalStorage(subModuleInLocalStorage.slice(1))
        }
      }
    }
    run()
  }, [subModuleInLocalStorage, openSubModules])

  useEffect(() => {
    if (!!moduleForNotification && isParentModuleLoaded) {
      setTimeout(() => {
        setShowNotification(true)
      }, 300)
    }
  }, [moduleForNotification, isParentModuleLoaded])

  const handleSubModule = async (activity) => {
    if (activity.name === "Other activities" || activity.name === "Unstarted modules") {
      setSubModuleData(activity)
    } else {
      let moduleStartTime = await getModuleStartTime(activity?.id, activity?.startTime)
      if (!moduleStartTime) {
        moduleStartTime = await addActivityEventForModule(activity, participant)
      }
      setLoadingModules(true)
      const data = await LAMP.Activity.view(activity.id)

      await addSubModuleData(data, moduleStartTime, activity?.parentString)
    }
  }

  const addSubModuleData = async (data, startTime, parentString) => {
    let moduleActivityData = { ...data }
    let moduleStartTime = startTime
    let moduleStarted = moduleStartTime != null
    const ids = data?.settings?.activities || []
    const sequential = data?.settings?.sequential_ordering === true
    const hideOnCompletion = data?.settings?.hide_on_completion === true
    const trackProgress = data?.settings?.track_progress === true
    let sequentialActivityAdded = false
    const parentsString = parentString ? parentString + ">" + data?.id : data?.id
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
        setLoadingModules(false)
      }
    }
    const filteredArr = arr.filter((item) => item != null)
    delete moduleActivityData.settings
    setSubModuleData({
      ...data,
      isHidden: true,
      subActivities: filteredArr,
      sequentialOrdering: sequential,
      trackProgress: trackProgress,
    })
    const splitData = parentsString.split(">")
    if (!!localStorage.getItem("parentStringForSurvey")) {
      if (localStorage.getItem("parentStringForSurvey") === parentsString) {
        localStorage.removeItem("parentStringForSurvey")
        setIndexToLoad(splitData.length - 1)
        setLoadingModules(false)
      }
    } else {
      setLoadingModules(false)
      setIndexToLoad(indexToLoad + 1)
    }
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

  const handleClickOpen = (y: any): Promise<void> => {
    return LAMP.Activity.view(y.id).then(async (data) => {
      if (y.spec === "lamp.module") {
        let moduleStartTime = await getModuleStartTime(y.id)
        if (!moduleStartTime) {
          moduleStartTime = await addActivityEventForModule(y, participant)
        }
        await addActivityData(data, 0, moduleStartTime, null)
      } else {
        if (!props.fromTab) localStorage.setItem("activityFromModule", moduleId)
        setParentString(y?.parentString || "")

        setActivity(data)
        setOpen(true)
        if (y.spec === "lamp.dbt_diary_card") {
          setQuestionCount(7)
        } else if (y.spec === "lamp.survey") {
          setQuestionCount(data.settings?.length ?? 0)
        } else {
          setQuestionCount(0)
        }
      }
    })
  }

  const checkIsModuleCompleted = async (id) => {
    let tag = [await LAMP.Type.getAttachment(null, "lamp.dashboard.completed")].map((y: any) =>
      !!y?.error ? undefined : y?.data
    )[0]
    const isCompleted = (tag || []).filter((t) => t.moduleId === id && t.participants.includes(participant.id))
    return isCompleted.length > 0 ? true : false
  }

  const createCompletedAttachment = async (id) => {
    let tag = [await LAMP.Type.getAttachment(null, "lamp.dashboard.completed")].map((y: any) =>
      !!y?.error ? undefined : y?.data
    )[0]
    let checkIsModule = (tag || []).filter((t) => t.moduleId === id)
    let checkNotModule = (tag || []).filter((t) => t.moduleId !== id)
    if (!checkIsModule.length) {
      checkNotModule.push({ moduleId: id, participants: participant?.id ?? participant })
    } else {
      checkIsModule.forEach((item) => {
        if (!item.participants.includes(participant?.id ?? participant)) {
          item.participants.push(participant?.id ?? participant)
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

  useEffect(() => {
    if (!!subModuleData) {
      setOpenSubModules((prev) => [...prev, subModuleData])
    }
  }, [subModuleData])

  const addActivityData = async (data, level, startTime, parentString) => {
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
        setLoadingModules(false)
      }
    }
    const filteredArr = arr.filter((item) => item != null)
    delete moduleActivityData.settings

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
    setModuleData((prev) => sortModulesByCompletion([...prev, moduleActivityData]))
    setOpenSubModules([moduleActivityData])
    const splitData = localStorage.getItem("parentStringForSurvey")?.split(">")
    if (!splitData || splitData.length <= 1) setIndexToLoad(indexToLoad + 1)
    setLoadingModules(false)
  }

  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    ;(async () => {
      let tag =
        [await LAMP.Type.getAttachment(participant.id, "lamp.dashboard.favorite_activities")].map((y: any) =>
          !!y?.error ? undefined : y?.data
        )[0] ?? []
      setFavorites(moduleData.filter((activity) => tag?.includes(activity.id)))
    })()
  }, [])

  const updateIsCompleted = (subActivityId, parentString) => {
    const updateRecursive = (activities) => {
      return activities.map((activity) => {
        if (activity.id === subActivityId && activity.parentString === parentString) {
          return { ...activity, isCompleted: true }
        }
        if (activity.subActivities && activity.subActivities.length > 0) {
          const updatedSubActivities = updateRecursive(activity.subActivities)
          return { ...activity, subActivities: updatedSubActivities }
        }

        return activity
      })
    }

    const updatedData = updateRecursive(moduleData)
    setModuleData(updatedData)
  }

  const handleClose = () => {
    if (props.fromTab && indexToLoad - 1 < 0) {
      window.location.href = `/#/participant/${participant}/${props.tab}`
    } else {
      const newArr = openSubModules.slice(0, -1)
      setOpenSubModules(newArr)
      setIndexToLoad(indexToLoad - 1)
    }
  }

  const updateLocalStorage = () => {
    if (!!parentString) localStorage.setItem("parentStringForSurvey", parentString)
  }

  return (
    <>
      <Backdrop className={classes.backdrop} open={loadingModules}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid marginTop={5} container className={classes.thumbContainer}>
        <Grid item xs>
          <ActivityPopup
            activity={activity}
            tag={null}
            questionCount={questionCount}
            open={open}
            onClose={() => setOpen(false)}
            type={null}
            showStreak={null}
            participant={participant?.id ?? participant}
            updateIsCompleted={updateIsCompleted}
            updateLocalStorage={updateLocalStorage}
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
                    handleSubModule(moduleForNotification)
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
      {indexToLoad > -1 && !!openSubModules[indexToLoad] && (
        // <ResponsiveDialog transient open animate fullScreen onClose={() => {
        //   console.log("Closing dialog")
        //   handleClose()
        // }}>
        <ActivityListForModule
          type={null}
          tag={null}
          favorites={favorites}
          setFavorites={setFavorites}
          participant={participant?.id ?? participant}
          handleClickOpen={handleClickOpen}
          handleSubModule={handleSubModule}
          classes={classes}
          module={openSubModules[indexToLoad]}
        />
        // </ResponsiveDialog>
      )}
    </>
  )
}

export default ModuleActivity
