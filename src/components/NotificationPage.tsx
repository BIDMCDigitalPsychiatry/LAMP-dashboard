// Core Imports
import React, { useEffect, useState } from "react"
import { Typography, makeStyles, Box } from "@material-ui/core"
import LAMP from "lamp-core"
import SurveyInstrument from "./SurveyInstrument"
import EmbeddedActivity from "./EmbeddedActivity"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: 20,
  },
}))

export default function NotificationPage({ participant, activityId, ...props }) {
  const classes = useStyles()
  const [activity, setActivity] = useState(null)
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    ;(async () => {
      LAMP.Activity.view(activityId).then(setActivity)
    })()
  }, [])
  useEffect(() => {
    if (activity !== null) {
      setLoaded(true)
    }
  }, [activity])

  const submitSurvey = (response, overwritingTimestamp) => {
    let events = response.map((x, idx) => ({
      timestamp: new Date().getTime(),
      duration: response.duration,
      activity: activity.id,
      static_data: {},
      temporal_slices: (x || []).map((y) => ({
        item: y !== undefined ? y.item : null,
        value: y !== undefined ? y.value : null,
        type: null,
        level: null,
        duration: y.duration,
      })),
    }))
    Promise.all(
      events
        .filter((x) => x.temporal_slices.length > 0)
        .map((x) => LAMP.ActivityEvent.create(participant, x).catch((e) => console.dir(e)))
    ).then((x) => {
      window.location.href = "/#/"
    })
  }
  return (
    <div style={{ height: "100%" }}>
      {loaded &&
        (activity?.spec === "lamp.survey" ? (
          <SurveyInstrument
            id={participant}
            type={activity?.name ?? ""}
            fromPrevent={false}
            group={[activity]}
            setVisibleActivities={setActivity}
            onComplete={submitSurvey}
          />
        ) : activity?.spec === "lamp.cats_and_dogs" ||
          activity?.spec === "lamp.jewels_a" ||
          activity?.spec === "lamp.jewels_b" ||
          activity?.spec === "lamp.spatial_span" ? (
          <EmbeddedActivity
            name={activity?.name}
            activities={[activity]}
            participant={participant}
            onComplete={() => {}}
          />
        ) : (
          <Box textAlign="center">
            <Typography variant="h5" style={{ paddingTop: "20%" }}>
              Coming Soon !!
            </Typography>
          </Box>
        ))}
    </div>
  )
}
