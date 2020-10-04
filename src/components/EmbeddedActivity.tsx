// Core Imports
import React, { useState, useEffect } from "react"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import { Typography, Box } from "@material-ui/core"

import LAMP from "lamp-core"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    linkButton: {
      padding: "15px 25px 15px 25px",
    },
    cardlabel: {
      fontSize: 16,

      padding: "0 18px",
      bottom: 15,
      position: "absolute",
      width: "100%",
    },

    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    dialogueStyle: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    centerHeader: {
      "& h2": {
        textAlign: "center !important",
      },
    },
    header: {
      background: "#FFEFEC",
      padding: "35px 40px 10px",
      textAlign: "center",

      "& h2": {
        fontSize: 25,
        fontWeight: 600,
        color: "rgba(0, 0, 0, 0.75)",
        textAlign: "left",
      },
      "& h6": {
        fontSize: "14px",
        fontWeight: "normal",
        textAlign: "left",
      },
    },
    scratch: {
      "& h2": {
        textAlign: "center !important",
      },
      "& h6": {
        textAlign: "center !important",
      },
    },
    btnpeach: {
      background: "#FFAC98",
      borderRadius: "40px",
      minWidth: "200px",
      boxShadow: " 0px 10px 15px rgba(255, 172, 152, 0.25)",
      lineHeight: "22px",
      display: "inline-block",
      textTransform: "capitalize",
      fontSize: "16px",
      color: "rgba(0, 0, 0, 0.75)",
      fontWeight: "bold",
      marginBottom: 20,
      cursor: "pointer",
      "& span": { cursor: "pointer" },
      "&:hover": {
        boxShadow:
          "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
      },
    },
    topicon: {
      minWidth: 150,
      minHeight: 150,
      [theme.breakpoints.up("lg")]: {
        width: 150,
        height: 150,
      },
    },
    dialogueContent: {
      padding: "20px 40px 40px",
      "& h4": { fontSize: 16, fontWeight: "bold", marginBottom: 15 },
    },
    dialogtitle: { padding: 0 },
    manage: {
      background: "#FFEFEC",
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
    thumbMain: { maxWidth: 255 },
    thumbContainer: { maxWidth: 1055 },
    fullwidthBtn: { width: "100%" },
    dialogueCurve: { borderRadius: 10, maxWidth: 400 },
  })
)

const demoActivities = {
  "Balloon Risk": "balloonrisk",
  "Spatial Span": "boxgame",
  "Cats and Dogs": "catsndogs",
  "Dot Touch": "dottouch",
  "Jewels Trails A": "jewels",
  "Jewels Trails B": "jewelspro",
  "Pop The Bubbles": "popthebubbles",
}

export default function EmbeddedActivity({ participant, activities, name, onComplete, ...props }) {
  const classes = useStyles()
  const [embeddedActivity, setEmbeddedActivity] = useState<string>("")
  const [iFrame, setIframe] = useState(null)
  const [gameSettings, setGameSettings] = useState(null)
  const [activityId, setActivityId] = useState(null)
  const [saved, setSaved] = useState(false)
  const [data, setData] = useState(null)

  useEffect(() => {
    activateEmbeddedActivity(name)
  }, [])

  useEffect(() => {
    if (iFrame != null) {
      iFrame.onload = function () {
        iFrame.contentWindow.postMessage(gameSettings, "*")
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
          setGameSettings(null)
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

  const activateEmbeddedActivity = async (name) => {
    if (demoActivities[name]) {
      const details = (activities || []).filter((x) => x.name === name).map((y) => [y.id, y.settings])[0] ?? []
      setActivityId(details[0] ?? [])
      setGameSettings(details[1] ?? [])
      setSaved(false)
      let response = await fetch(
        `https://raw.githubusercontent.com/BIDMCDigitalPsychiatry/LAMP-activities/master/dist/out/${demoActivities[name]}.html.b64`
      )
      // let response = await fetch(
      //   `${id}.html.b64`
      // )
      setEmbeddedActivity(atob(await response.text()))
    }
  }

  return (
    <div style={{ display: "flex", width: "100%", height: "100vh", flexDirection: "column", overflow: "hidden" }}>
      {embeddedActivity !== "" ? (
        <iframe
          ref={(e) => {
            setIframe(e)
          }}
          style={{ flexGrow: 1, border: "none", margin: 0, padding: 0 }}
          sandbox="allow-scripts"
          allow="accelerometer; ambient-light-sensor; autoplay; battery; camera; display-capture; geolocation; gyroscope; magnetometer; microphone; oversized-images; sync-xhr; usb; wake-lock;"
          srcDoc={embeddedActivity}
        />
      ) : (
        <Box textAlign="center" alignItems="center">
          <Typography variant="h5" style={{ paddingTop: "20%" }}>
            Coming Soon !!
          </Typography>
        </Box>
      )}
    </div>
  )
}
