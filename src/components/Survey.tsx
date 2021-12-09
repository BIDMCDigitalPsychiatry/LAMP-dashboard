// Core Imports
import React, { useState, useEffect } from "react"
import { Container, Backdrop, CircularProgress, makeStyles, Theme, createStyles } from "@material-ui/core"
import { useTranslation } from "react-i18next"
import ActivityBox from "./ActivityBox"
import { getImage } from "./Manage"
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
    thumbContainer: {
      maxWidth: 1055,
      width: "80%",
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        paddingBottom: 80,
      },
    },
  })
)

export const games = [
  "lamp.jewels_a",
  "lamp.jewels_b",
  "lamp.spatial_span",
  "lamp.cats_and_dogs",
  "lamp.pop_the_bubbles",
  "lamp.balloon_risk",
]

export default function Survey({ participant, activities, onComplete, showSteak, submitSurvey, ...props }) {
  const classes = useStyles()
  const { t } = useTranslation()
  const [tag, setTag] = useState([])
  const [savedActivities, setSavedActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    let gActivities = (activities || []).filter(
      (x) =>
        ((games.includes(x.spec) ||
          x.spec === "lamp.group" ||
          x.spec === "lamp.dbt_diary_card" ||
          x.spec === "lamp.recording" ||
          x.spec === "lamp.survey") &&
          !x?.category) ||
        (!!x?.category && x?.category.includes("assess"))
    )
    setSavedActivities(gActivities)
    if (gActivities.length > 0) {
      let tags = []
      let count = 0
      gActivities.map((activity, index) => {
        getImage(activity.id, activity.spec).then((img) => {
          tags[activity.id] = img
          if (count === gActivities.length - 1) {
            setTag(tags)
            setLoading(false)
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
        type="Assess"
      />
    </Container>
  )
}
