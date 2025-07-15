import React, { useEffect, useState } from "react"
import ActivityAccordian from "./ActivityAccordian"
import LAMP from "lamp-core"
import { addActivityEventForModule, getActivityEvents, sortModulesByCompletion } from "./ActivityBox"
import { useTranslation } from "react-i18next"
import ActivityPopup from "./ActivityPopup"
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles"
import Backdrop from "@material-ui/core/Backdrop"
import Button from "@material-ui/core/Button"
import CircularProgress from "@material-ui/core/CircularProgress"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import Grid from "@material-ui/core/Grid"
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
  const [pendingSubModules, setPendingSubModules] = useState([])
  const [subModuleProcessCount, setSubModuleProcessCount] = useState(0)
  const [pendingSubModulesReady, setPendingSubModulesReady] = useState(false)

  useEffect(() => {
    if (participant != null) handleClickOpen({ spec: "lamp.module", id: moduleId })
    localStorage.removeItem("activityFromModule")
  }, [moduleId, participant])

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
        let moduleStartTime = await getModuleStartTime(y.id)
        if (!moduleStartTime) {
          moduleStartTime = await addActivityEventForModule(y, participant)
        }
        await addActivityData(data, 0, moduleStartTime, null, null, false)
        setPendingSubModulesReady(true)
      } else {
        localStorage.setItem("activityFromModule", moduleId)
        localStorage.setItem("parentStringForSurvey", y?.parentString)
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

  const handleSubModule = async (activity, level, fromLocalStore = false) => {
    let moduleStartTime = await getModuleStartTime(activity?.id, activity?.startTime)
    if (!moduleStartTime) {
      moduleStartTime = await addActivityEventForModule(activity, participant)
    }
    const data = await LAMP.Activity.view(activity.id)

    await addActivityData(data, level, moduleStartTime, activity?.parentModule, activity?.parentString, fromLocalStore)
  }

  useEffect(() => {
    if (pendingSubModulesReady && pendingSubModules?.length > 0) {
      ;(async () => {
        await processSubModules(pendingSubModules)
      })()
    }
  }, [pendingSubModules, pendingSubModulesReady])

  useEffect(() => {
    if (pendingSubModulesReady && subModuleProcessCount === 0) {
      setLoadingModules(false)
      scrollToElement(localStorage.getItem("parentStringForSurvey"))
    }
  }, [subModuleProcessCount, pendingSubModulesReady])

  async function processSubModules(subActivities) {
    // Process each submodule one by one sequentially
    for (const subModule of subActivities) {
      if (subModule.spec === "lamp.module") {
        const startTime = new Date(subModule.startTime).toString()
        setSubModuleProcessCount((count) => count + 1)

        await handleSubModule(
          {
            id: subModule.id,
            startTime: startTime,
            parentModule: subModule.parentModule,
            parentString: subModule.parentString,
          },
          subModule.level,
          true
        )
        setSubModuleProcessCount((count) => count - 1)
      }
    }
    setPendingSubModules([])
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
        if (
          fetchedData.spec === "lamp.module" &&
          activityEvents.filter((event) => event.activity === fetchedData.id)?.length > 0 &&
          level <= 1 &&
          !fetchedData["isCompleted"]
        ) {
          const updatedModuleData = {
            ...fetchedData,
            level: level + 1,
          }

          setPendingSubModules((prevModules) => [...prevModules, updatedModuleData])
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
      setModuleData((prev) => {
        const updatedData = prev.map((item) => {
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
        return sortModulesByCompletion(sortedData)
      })
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
    if (!fromLocalStore) {
      setLoadingModules(false)
    }
  }

  const scrollToElement = (id) => {
    setTimeout(() => {
      if (document.getElementById(id)) {
        document.getElementById(id).scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
      }
    }, 1000)
  }

  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    ;(async () => {
      let tag =
        [await LAMP.Type.getAttachment(participant.id, "lamp.dashboard.favorite_activities")].map((y: any) =>
          !!y.error ? undefined : y.data
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

  return (
    <>
      <Backdrop className={classes.backdrop} open={loadingModules}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid container className={classes.thumbContainer} style={{ marginTop: 40 }}>
        <Grid item xs>
          <ActivityAccordian
            data={moduleData}
            type={props.type}
            tag={[]}
            favorites={favorites}
            handleClickOpen={handleClickOpen}
            handleSubModule={handleSubModule}
            participant={participant}
            setFavorites={setFavorites}
          />
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
