// Core Imports
import React, { useEffect, useState } from "react"
import { Typography, makeStyles, Box, Grid, Container } from "@material-ui/core"

import LAMP from "lamp-core"
import SurveyInstrument from "./SurveyInstrument"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: 20,
  },
  
}))

export default function NotificationPage({ participant,surveyId,  ...props }) {
  const classes = useStyles()
  const [activity, setActivity] = useState([])
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    console.log(participant, surveyId)
    ;(async () => {
      console.log(participant, LAMP.Activity.allByParticipant(participant))
      console.log(participant, LAMP.Activity.allByStudy(surveyId))
      LAMP.Activity.allByStudy(surveyId).then(setActivity)     
    })()
  }, [])
  useEffect(() => {
    if(activity.length > 0) {
      setLoaded(true)
    }
  }, [activity])
  
  const submitSurvey = (response, overwritingTimestamp) => {
    console.log(response)
    let events = response.map((x, idx) => ({
      timestamp: new Date().getTime(),
      duration: response.duration,
      activity: activity[idx].id,
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
      window.location.href="/#/"
    })
  }
  return (
    <div className={classes.root}>
      {loaded && activity[0]?.spec === "lamp.survey" && <SurveyInstrument
        id={participant}
        type={activity[0]?.name ?? ""}
        fromPrevent={false}
        group={activity}
        setVisibleActivities={setActivity}
        onComplete={submitSurvey}
      />}
    </div>
  )
}
