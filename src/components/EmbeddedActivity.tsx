// Core Imports
import React, { useState, useEffect } from "react"
import { Backdrop, CircularProgress, makeStyles, Theme, createStyles } from "@material-ui/core"
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
}

export default function EmbeddedActivity({ participant, activity, name, onComplete, noBack, tab, ...props }) {
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
  const [dataSubmitted, setDataSubmitted] = useState(false)
  const [timestamp, setTimestamp] = useState(null)

  useEffect(() => {
    setDataSubmitted(false)
    setCurrentActivity(activity)
  }, [activity])

  useEffect(() => {
    setActivityId(currentActivity?.id ?? null)
    if (currentActivity !== null && !!currentActivity?.spec) {
      setDataSubmitted(false)
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
            onComplete(null)
          } else if (!saved && activityId !== null && activityId !== "") {
            let data = JSON.parse(e.data)
            delete data["activity"]
            data["activity"] = activityId
            setData(data)
            setEmbeddedActivity(undefined)
            setSettings(null)
            setActivityId(null)
          }
        }
      },
      false
    )
  }, [settings])

  useEffect(() => {
    if (embeddedActivity === undefined && data !== null && !saved && !!currentActivity) {
      const activitySpec = currentActivity?.spec ?? ""
      setCurrentActivity(null)
      if (activitySpec === "lamp.survey") {
        onComplete(data.response, data.prefillTimestamp ?? null)
      } else {
        if (!!data?.timestamp && (data?.timestamp ?? 0) !== timestamp) {
          setDataSubmitted(true)
          setTimestamp(data.timestamp)
          sensorEventUpdate(tab?.toLowerCase() ?? null, participant?.id ?? participant, activity.id, data.timestamp)

          LAMP.ActivityEvent.create(participant?.id ?? participant, data)
            .catch((e) => {
              console.dir(e)
            })
            .then((x) => {
              setSaved(true)
              onComplete(data)
            })
        } else {
          onComplete(null)
        }
      }
    }
  }, [embeddedActivity, data])

  const activateEmbeddedActivity = async (activity) => {
    setSaved(false)
    setSettings({ ...settings, activity: activity, configuration: { language: i18n.language }, noBack: noBack })
    let response = "about:blank"
    let activitySpec = await LAMP.ActivitySpec.view(activity.spec)
    if (activitySpec?.executable?.startsWith("data:")) {
      response = atob(activitySpec.executable.split(",")[1])
    } else if (activitySpec?.executable?.startsWith("https:")) {
      response = atob(await (await fetch(activitySpec.executable)).text())
    } else {
      let activityURL = "https://raw.githubusercontent.com/BIDMCDigitalPsychiatry/LAMP-activities/"
      activityURL += process.env.REACT_APP_GIT_SHA === "dev" ? "dist/out" : "latest/out"
      response = atob(await (await fetch(`${activityURL}/${demoActivities[activity.spec]}.html.b64`)).text())
    }
    setEmbeddedActivity(response)
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
          allow="accelerometer; ambient-light-sensor; autoplay; battery; camera; display-capture; geolocation; gyroscope; magnetometer; microphone; oversized-images; sync-xhr; usb; wake-lock;X-Frame-Options"
          srcDoc={embeddedActivity}
          sandbox="allow-forms allow-same-origin allow-scripts allow-popups allow-top-navigation "
        />
      )}
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  )
}
