// Core Imports
import React, { useState, useEffect } from "react"
import {
  Backdrop,
  CircularProgress,
  makeStyles,
  Theme,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core"
import { useTranslation } from "react-i18next"
import LAMP from "lamp-core"
import { useSnackbar } from "notistack"
import { sensorEventUpdate } from "./BottomMenu"
import { Service } from "./DBService/DBService"
import ResponsiveDialog from "./ResponsiveDialog"
import ModuleActivity from "./ModuleActivity"
import NotificationPage from "./NotificationPage"
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
  })
)
const demoActivities = {
  "lamp.spatial_span": "boxgame",
  "lamp.cats_and_dogs": "catsndogs",
  "Dot Touch": "dottouch",
  "lamp.jewels_a": "jewelspro",
  "lamp.jewels_b": "jewelspro",
  "lamp.fragmented_letters": "fragmentationofletters",
  "lamp.dbt_diary_card": "dbtdiarycard",
  "lamp.balloon_risk": "balloonrisk",
  "lamp.pop_the_bubbles": "popthebubbles",
  "lamp.journal": "journal",
  "lamp.breathe": "breathe",
  "lamp.recording": "voicerecording",
  "lamp.survey": "survey",
  "lamp.scratch_image": "scratchimage",
  "lamp.tips": "tips",
  "lamp.goals": "goals",
  "lamp.medications": "medicationtracker",
  "lamp.memory_game": "memorygame",
  "lamp.spin_wheel": "spin_wheel",
  "lamp.maze_game": "maze_game",
  "lamp.emotion_recognition": "emotion_recognition",
  "lamp.symbol_digit_substitution": "symbol_digit_substitution",
  "lamp.gyroscope": "gyroscope",
  "lamp.dcog": "d-cog",
  "lamp.funny_memory": "funnymemory",
  "lamp.trails_b": "dottouch",
  "lamp.voice_survey": "speechrecording",
  "lamp.digit_span": "digitspan",
}

export default function EmbeddedActivity({
  participant,
  activity,
  name,
  onComplete,
  noBack,
  tab,
  favoriteActivities,
  ...props
}) {
  const classes = useStyles()
  const [embeddedActivity, setEmbeddedActivity] = useState<string>("")
  const [iFrame, setIframe] = useState(null)
  const [settings, setSettings] = useState(null)
  const [saved, setSaved] = useState(false)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const { t, i18n } = useTranslation()
  const [currentActivity, setCurrentActivity] = useState(null)
  const [activityTimestamp, setActivityTimestamp] = useState(0)
  const [timestamp, setTimestamp] = useState(null)
  const [openNotImplemented, setOpenNotImplemented] = useState(false)
  const [warningsDialogState, setWarningsDialogState] = useState(null)
  const [responseActivity, setResponseActivity] = useState(null)
  const [showPopup, setShowPopUp] = useState(false)
  const [secondaryActivity, setSecondaryActivity] = useState(null)
  const [surveyResponse, setSurveyResponse] = useState(null)
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    localStorage.removeItem("lastUrl")
    setCurrentActivity(activity)
    setSaved(true)
    setEmbeddedActivity("")
    setSettings(null)
    setActivityTimestamp(0)
    setIframe(null)
  }, [activity])

  useEffect(() => {
    if (!!responseActivity) {
      LAMP.Activity.view(responseActivity)
        .then((data: any) => {
          if (!!data) {
            setSecondaryActivity(data)
            setShowPopUp(true)
          }
        })
        .catch((e) => {
          console.log("url cannot be opened")
        })
    }
  }, [responseActivity])

  useEffect(() => {
    if (currentActivity !== null && !!currentActivity?.spec) {
      setLoading(true)
      activateEmbeddedActivity(currentActivity)
    }
  }, [currentActivity])

  const handleSubmit = (e) => {
    if (currentActivity?.spec === "lamp.survey" && e?.data && e?.data?.type === "OPEN_ACTIVITY") {
      localStorage.setItem("lastUrl", window.location.href)
      setResponseActivity(e?.data?.activityId)
    } else {
      let skipSaveActivity = false
      localStorage.removeItem("activity-" + demoActivities[currentActivity?.spec] + "-" + currentActivity?.id)
      let warnings = []
      if (e.data !== null) {
        try {
          const data = JSON.parse(e.data)
          if (!!data?.clickBack) {
            const isSurvey = currentActivity?.spec === "lamp.survey"
            const branchingSettings = currentActivity?.branchingSettings
            const totalScore = data?.static_data?.totalScore
            if (isSurvey && branchingSettings) {
              const meetsScoreThreshold = !!totalScore && totalScore >= branchingSettings.total_score
              const hasActivityId = !!branchingSettings.activityId
              if (meetsScoreThreshold && hasActivityId) {
                setResponseActivity(branchingSettings.activityId)
                localStorage.setItem("response", JSON.stringify(e.data))
                setSurveyResponse(e)
                skipSaveActivity = true
              }
            }
            currentActivity.settings.map((setting, index) => {
              if (!!setting.warnings && !!data["temporal_slices"][index]) {
                setting.warnings.map((warning) => {
                  if (warning.answer === data["temporal_slices"][index].value) {
                    warnings.push(warning)
                  }
                })
              }
            })
          }
        } catch {}
      }

      if (warnings.length > 0) {
        setWarningsDialogState({
          warnings,
          activitySubmitEvent: e,
        })
      } else {
        setWarningsDialogState(null)
        if (!skipSaveActivity) {
          handleSaveData(e)
        }
      }
    }
  }

  const handleSaveData = (e) => {
    if (currentActivity !== null && !saved) {
      if (e.data === null) {
        setSaved(true)
        onComplete(null)
        setLoading(false)
      } else if (!saved && currentActivity?.id !== null && currentActivity?.id !== "") {
        let data = JSON.parse(e.data)
        if (!!data["timestamp"]) {
          setLoading(true)
          delete data["activity"]
          delete data["timestamp"]
          data["activity"] = currentActivity.id
          data["timestamp"] = activityTimestamp
          data["duration"] = new Date().getTime() - activityTimestamp
          setData(data)
          if (LAMP.Auth._auth.id === "selfHelp@demo.lamp.digital") {
            Service.addUserDBRow("activityEvents", data)
          }
          setEmbeddedActivity(undefined)
          setSettings(null)
        } else {
          ;(async () => {
            data["activity"] = currentActivity.id
            await updateFavorite(data)
            setSaved(true)
            onComplete({ forward: data.forward, done: data.done, clickBack: data.clickBack })
            setLoading(false)
          })()
        }
      }
    }
  }

  useEffect(() => {
    if (iFrame != null) {
      iFrame.onload = function () {
        iFrame.contentWindow.postMessage(settings, "*")
      }
      var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent"
      var eventer = window[eventMethod]
      var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message"
      // Listen to message from child window
      eventer(messageEvent, handleSubmit, false)
      return () => window.removeEventListener(messageEvent, handleSubmit)
    }
  }, [iFrame])

  const updateFavorite = async (data) => {
    if (typeof data?.static_data?.is_favorite !== undefined) {
      let tag = favoriteActivities
      if (!!data?.static_data?.is_favorite) {
        if ((tag || []).filter((t) => t == data.activity).length === 0) {
          tag.push(data.activity)
        }
      } else if ((tag || []).filter((t) => t == data.activity).length > 0) {
        tag = (tag || []).filter((t) => t !== data.activity)
      }
      await LAMP.Type.setAttachment(participant, "me", "lamp.dashboard.favorite_activities", tag)
      delete data.static_data.is_favorite
    }
    return data
  }

  useEffect(() => {
    try {
      if (embeddedActivity === undefined && data !== null && !saved && !!currentActivity) {
        if (!!activityTimestamp && (activityTimestamp ?? 0) !== timestamp) {
          setTimestamp(activityTimestamp)
          sensorEventUpdate(
            tab?.toLowerCase() ?? null,
            participant?.id ?? participant,
            currentActivity.id,
            activityTimestamp
          )
          const forward = data?.forward
          const done = data?.done
          if (data?.forward) {
            delete data?.forward
          }
          if (data?.done) {
            delete data?.done
          }
          ;(async () => {
            const updated = await updateFavorite(data)
            if (!!updated) {
              LAMP.ActivityEvent.create(participant?.id ?? participant, data)
                .catch((e) => {
                  enqueueSnackbar(`${t("An error occured while saving the results.")}`, {
                    variant: "error",
                  })
                })
                .then((x) => {
                  setCurrentActivity(null)
                  setSecondaryActivity(null)
                  localStorage.setItem(
                    "first-time-" + (participant?.id ?? participant) + "-" + currentActivity.id,
                    "true"
                  )
                  setSaved(true)
                  onComplete(
                    typeof forward != "undefined" ? { ...data, forward: forward, done: done } : { ...data, done: done }
                  )
                  setLoading(false)
                })
            } else {
              setCurrentActivity(null)
              setSecondaryActivity(null)
              localStorage.setItem("first-time-" + (participant?.id ?? participant) + "-" + currentActivity.id, "true")
              setSaved(true)
              onComplete(data)
              setLoading(false)
            }
          })()
        } else {
          onComplete(null)
          setLoading(false)
        }
      } else if (embeddedActivity !== undefined) {
        setActivityTimestamp(new Date().getTime())
        setSaved(false)
        setLoading(false)
      }
    } catch (e) {
      setLoading(false)
      setOpenNotImplemented(true)
    }
  }, [embeddedActivity, data])

  const activateEmbeddedActivity = async (activity) => {
    let response = "about:blank"
    const exist = localStorage.getItem("first-time-" + (participant?.id ?? participant) + "-" + currentActivity?.id)
    try {
      setSaved(false)
      setSettings({
        ...settings,
        activity: currentActivity,
        configuration: { language: i18n.language },
        autoCorrect: !(exist === "true"),
        noBack: noBack,
        forward: props?.forward ?? false,
        is_favorite: (favoriteActivities || []).filter((t) => t == currentActivity.id).length > 0,
      })
      let activitySpec = await LAMP.ActivitySpec.view(currentActivity.spec)
      if (activitySpec?.executable?.startsWith("data:")) {
        response = atob(activitySpec.executable.split(",")[1])
      } else if (activitySpec?.executable?.startsWith("https:")) {
        response = atob(await (await fetch(activitySpec.executable)).text())
      } else {
        response = await loadFallBack()
      }
      setEmbeddedActivity(response)
      setLoading(false)
    } catch (e) {
      response = await loadFallBack()
      setEmbeddedActivity(response)
      setLoading(false)
    }
  }
  const loadFallBack = async () => {
    if (!!demoActivities[currentActivity.spec]) {
      let activityURL = "https://raw.githubusercontent.com/BIDMCDigitalPsychiatry/LAMP-activities/"
      activityURL += process.env.REACT_APP_GIT_SHA === "dev" ? "dist/out" : "latest/out"
      return atob(await (await fetch(`${activityURL}/${demoActivities[currentActivity.spec]}.html.b64`)).text())
    } else {
      return "about:blank"
    }
  }

  const getUniqueWarningTexts = (warnings: any[]): any[] => {
    const warningTexts = warnings?.map((warning) => warning.warningText)
    const warningTextSet = new Set(warningTexts)
    return Array.from(warningTextSet)
  }
  const [open, setOpen] = useState(false)

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100vh",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {embeddedActivity !== "" && (
        <iframe
          ref={(e) => {
            setIframe(e)
          }}
          style={{ flexGrow: 1, border: "none", margin: 0, padding: 0 }}
          allow="accelerometer; ambient-light-sensor; autoplay; battery; camera; display-capture; geolocation; gyroscope; magnetometer; microphone 'src' 'self'; oversized-images; sync-xhr; usb; wake-lock;X-Frame-Options"
          srcDoc={embeddedActivity}
          sandbox="allow-forms allow-same-origin allow-scripts allow-popups allow-top-navigation "
        />
      )}
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Dialog
        open={openNotImplemented}
        onClose={() => setOpenNotImplemented(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>{t("An exception occured. The data could not be submitted.")}</DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setLoading(false)
              setOpenNotImplemented(false)
              history.back()
            }}
            color="primary"
          >
            {`${t("Ok")}`}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={warningsDialogState !== null}>
        {getUniqueWarningTexts(warningsDialogState?.warnings).map((warningText) => (
          <DialogContent>{t(warningText)}</DialogContent>
        ))}
        <DialogActions>
          <Button
            onClick={() => {
              handleSaveData(warningsDialogState.activitySubmitEvent)
            }}
          >
            {t("Ok")}
          </Button>
        </DialogActions>
      </Dialog>
      <ResponsiveDialog
        open={!!open}
        transient={secondaryActivity?.spec === "lamp.module"}
        animate
        fullScreen
        onClose={() => {
          setOpen(false)
          localStorage.removeItem("activityFromModule")
          const response =
            typeof localStorage.getItem("response") != "undefined" ? JSON.parse(localStorage.getItem("response")) : null
          if (response) {
            handleSaveData({ data: response })
          }
        }}
      >
        {secondaryActivity?.spec === "lamp.module" ? (
          <ModuleActivity type="activity" moduleId={responseActivity} participant={participant} />
        ) : (
          <NotificationPage
            participant={participant?.id ?? participant}
            activityId={responseActivity}
            mode={"dashboard"}
            tab={"activity"}
          />
        )}
      </ResponsiveDialog>
      <Dialog
        open={!!showPopup}
        onClose={() => {
          setShowPopUp(false)
          setResponseActivity(null)
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`${t("Activity")}`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`${t(
              "There is an activity based on your response. Would you like to proceed to it or go back to the survey?"
            )}`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowPopUp(false)
              localStorage.setItem("SurveyId", currentActivity?.id)
              if (secondaryActivity.spec === "lamp.module") {
                setOpen(true)
              } else {
                const url = `/#/participant/${participant}/activity/${responseActivity}?mode=responseActivity`
                window.location.href = url
              }
            }}
            color="primary"
            autoFocus
          >
            {`${t("Proceed")}`}
          </Button>
          <Button
            onClick={() => {
              setShowPopUp(false)
              setSecondaryActivity(null)
              setResponseActivity(null)
              if (surveyResponse) {
                handleSaveData(surveyResponse)
              }
            }}
            color="secondary"
          >
            {`${t("Go Back")}`}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
