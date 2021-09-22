// Core Imports
import React, { useState, useEffect } from "react"
import { Backdrop, CircularProgress, makeStyles, Theme, createStyles } from "@material-ui/core"
import { useTranslation } from "react-i18next"
import LAMP from "lamp-core"

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
}

export default function EmbeddedActivity({ participant, activity, name, onComplete, ...props }) {
  const classes = useStyles()
  const [embeddedActivity, setEmbeddedActivity] = useState<string>("")
  const [iFrame, setIframe] = useState(null)
  const [settings, setSettings] = useState(null)
  const [activityId, setActivityId] = useState(null)
  const [saved, setSaved] = useState(false)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const { t, i18n } = useTranslation()
  const [currentActivity, setCurrentActivity] = useState(null)

  useEffect(() => {
    setCurrentActivity(activity)
  }, [activity])

  useEffect(() => {
    setActivityId(currentActivity?.id ?? null)
    if (currentActivity !== null && !!currentActivity?.spec) {
      activateEmbeddedActivity(currentActivity)
    }
  }, [currentActivity])

  useEffect(() => {
    if (iFrame != null) {
      iFrame.onload = function () {
        iFrame.contentWindow.postMessage(settings, "*")
      }
    }
  }, [iFrame])

  useEffect(() => {
    var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent"
    var eventer = window[eventMethod]
    var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message"
    // Listen to message from child window
    eventer(
      messageEvent,
      function (e) {
        if (currentActivity !== null && !saved) {
          if (e.data === null) {
            setSaved(true)
            onComplete()
          } else if (!saved && activityId !== null && activityId !== "") {
            let data = JSON.parse(e.data)
            delete data["activity"]
            data["activity"] = activityId
            if (
              ((currentActivity?.spec === "lamp.scratch_image" || currentActivity?.spec === "lamp.tips") &&
                data?.completed) ||
              (currentActivity?.spec !== "lamp.scratch_image" && currentActivity?.spec !== "lamp.tips")
            ) {
              setData(data)
              setEmbeddedActivity(undefined)
              setSettings(null)
              setActivityId(null)
            }
          }
        }
      },
      false
    )
  }, [settings])

  useEffect(() => {
    if (embeddedActivity === undefined && data !== null && !saved) {
      const activitySpec = currentActivity.spec
      if (activitySpec !== "lamp.scratch_image") setCurrentActivity(null)
      if (activitySpec === "lamp.survey") {
        onComplete(data.response, data.prefillTimestamp ?? null)
      } else if (activitySpec === "lamp.scratch_image" && data?.completed) {
        setSaved(true)
        setCurrentActivity(null)
        onComplete()
      } else if (activitySpec === "lamp.tips" && data?.completed) {
        onComplete()
      } else {
        LAMP.ActivityEvent.create(participant?.id ?? participant, data)
          .catch((e) => {
            console.dir(e)
          })
          .then((x) => {
            if (activitySpec !== "lamp.scratch_image" && activitySpec !== "lamp.tips") {
              setSaved(true)
              activitySpec === "lamp.recording" ? onComplete(data) : onComplete()
            }
          })
      }
    }
  }, [embeddedActivity])

  const activateEmbeddedActivity = async (activity) => {
    setSaved(false)
    setSettings({ ...settings, activity: activity, configuration: { language: i18n.language } })
    let activityURL = "https://raw.githubusercontent.com/BIDMCDigitalPsychiatry/LAMP-activities/"
    activityURL += process.env.REACT_APP_GIT_SHA === "dev" ? "dist/out" : "latest/out"
    let response = await fetch(`${activityURL}/${demoActivities[activity.spec]}.html.b64`)
    // let response = await fetch(demoActivities[activity.spec] + ".html.b64")
    setEmbeddedActivity(atob(await response.text()))
    setLoading(false)
  }

  return (
    <div style={{ display: "flex", width: "100%", height: "100vh", flexDirection: "column", overflow: "hidden" }}>
      {embeddedActivity !== "" && (
        <iframe
          ref={(e) => {
            setIframe(e)
          }}
          style={{ flexGrow: 1, border: "none", margin: 0, padding: 0 }}
          allow="accelerometer; ambient-light-sensor; autoplay; battery; camera; display-capture; geolocation; gyroscope; magnetometer; microphone; oversized-images; sync-xhr; usb; wake-lock;"
          srcDoc={embeddedActivity}
          sandbox="allow-same-origin allow-scripts allow-top-navigation"
        />
      )}
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  )
}
