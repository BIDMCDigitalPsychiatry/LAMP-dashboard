// Core Imports
import React, { useState, useEffect } from "react"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import { Backdrop, CircularProgress } from "@material-ui/core"

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
  "Balloon Risk": "balloonrisk",
  "lamp.spatial_span": "boxgame",
  "lamp.cats_and_dogs": "catsndogs",
  "Dot Touch": "dottouch",
  "lamp.jewels_a": "jewels",
  "lamp.jewels_b": "jewelspro",
  "Pop The Bubbles": "popthebubbles",
  "lamp.dbt_diary_card": "dbtdiarycard",
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

  useEffect(() => {
    activateEmbeddedActivity(activity)
  }, [])

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
        if (!saved && activityId !== null) {
          let data = JSON.parse(e.data)
          data["activity"] = activityId
          setData(data)
          setEmbeddedActivity(undefined)
          setSettings(null)
          setActivityId(null)
        }
      },
      false
    )
  }, [activityId])

  useEffect(() => {
    if (embeddedActivity === undefined && data !== null && !saved) {
      LAMP.ActivityEvent.create(participant.id, data)
        .catch((e) => console.dir(e))
        .then((x) => {
          setSaved(true)
          onComplete()
        })
    }
  }, [embeddedActivity])

  const activateEmbeddedActivity = async (activity) => {
    setActivityId(activity.id)
    console.log(activity.settings)
    setSettings(activity.settings)
    setSaved(false)
    let response = await fetch(
      `https://raw.githubusercontent.com/BIDMCDigitalPsychiatry/LAMP-activities/master/dist/out/${
        demoActivities[activity.spec]
      }.html.b64`
    )
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
          sandbox="allow-scripts"
          allow="accelerometer; ambient-light-sensor; autoplay; battery; camera; display-capture; geolocation; gyroscope; magnetometer; microphone; oversized-images; sync-xhr; usb; wake-lock;"
          srcDoc={embeddedActivity}
        />
      )}
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  )
}
