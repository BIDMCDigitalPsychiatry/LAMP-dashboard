// Core Imports
import React, { useState, useEffect } from "react"
import { Container, Backdrop, CircularProgress, makeStyles, Theme, createStyles } from "@material-ui/core"
import LAMP, { Participant as ParticipantObj, Activity as ActivityObj } from "lamp-core"
import { useTranslation } from "react-i18next"
import ActivityBox from "./ActivityBox"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    thumbContainer: {
      maxWidth: 1055,
      width: "80%",
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        paddingBottom: 80,
      },
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
  })
)

export async function getImage(activityId: string, spec: string) {
  return [
    await LAMP.Type.getAttachment(
      activityId,
      spec === "lamp.survey" ? "lamp.dashboard.survey_description" : "lamp.dashboard.activity_details"
    ),
  ].map((y: any) => (!!y.error ? undefined : y.data))[0]
}

export default function Manage({ participant, activities, showSteak, submitSurvey, ...props }) {
  const classes = useStyles()
  const [tag, setTag] = useState([])
  const [savedActivities, setSavedActivities] = useState([])
  const [loading, setLoading] = useState(true)

  const { t } = useTranslation()
  useEffect(() => {
    setLoading(true)
    let gActivities = activities.filter(
      (x: any) =>
        ((x.spec === "lamp.journal" || x.spec === "lamp.breathe" || x.spec === "lamp.scratch_image") &&
          (!x?.category || (!!x?.category && x?.category.length === 0))) ||
        (!!x?.category && !!x?.category[0] && (x?.category[0] || "") === "manage")
    )
    setSavedActivities(gActivities)
    if (gActivities.length > 0) {
      let tags = []
      let count = 0
      gActivities.map((activity, index) => {
        getImage(activity.id, activity.spec).then((img) => {
          tags[activity.id] = img
          if (count === gActivities.length - 1) {
            setLoading(false)
            setTag(tags)
          }
          count++
        })
      })
    } else {
      setLoading(false)
    }
  }, [])

  return (
    <Container className={classes.thumbContainer}>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <ActivityBox
        participant={participant}
        savedActivities={savedActivities}
        tag={tag}
        showSteak={showSteak}
        submitSurvey={submitSurvey}
        type="Manage"
      />
    </Container>
  )
}
