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
} from "@material-ui/core"
import { useTranslation } from "react-i18next"
import LAMP from "lamp-core"
import { sensorEventUpdate } from "./BottomMenu"

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
}

export default function EmbeddedActivity({ participant, activity, name, onComplete, noBack, tab, ...props }) {
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

  useEffect(() => {
    setCurrentActivity(activity)
    setSaved(true)
    setEmbeddedActivity("")
    setSettings(null)
    setActivityTimestamp(0)
    setIframe(null)
  }, [activity])

  useEffect(() => {
    if (currentActivity !== null && !!currentActivity?.spec) {
      setLoading(true)
      activateEmbeddedActivity(currentActivity)
    }
  }, [currentActivity])

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
          setData(data)
          setEmbeddedActivity(undefined)
          setSettings(null)
        } else {
          setSaved(true)
          onComplete(null)
          setLoading(false)
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
      eventer(messageEvent, handleSaveData, false)
      return () => window.removeEventListener(messageEvent, handleSaveData)
    }
  }, [iFrame])

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
          setCurrentActivity(null)
          LAMP.ActivityEvent.create(participant?.id ?? participant, data)
            .catch((e) => {
              console.dir(e)
            })
            .then((x) => {
              setSaved(true)
              onComplete(data)
              setLoading(false)
            })
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
    try {
      setSaved(false)
      setSettings({
        ...settings,
        activity: currentActivity,
        configuration: { language: i18n.language },
        noBack: noBack,
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

  return (
    <div style={{ display: "flex", width: "100%", height: "100vh", flexDirection: "column", overflow: "hidden" }}>
      {embeddedActivity !== "" && (
        <iframe
          ref={(e) => {
            setIframe(e)
          }}
          style={{ flexGrow: 1, border: "none", margin: 0, padding: 0 }}
          allow="accelerometer; ambient-light-sensor; autoplay; battery; camera; display-capture; geolocation; gyroscope; magnetometer; microphone; oversized-images; sync-xhr; usb; wake-lock;X-Frame-Options"
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
            {t("Ok")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
