// Core Imports
import React, { useState, useEffect } from "react"
import { Container, Backdrop, CircularProgress, makeStyles, Theme, createStyles } from "@material-ui/core"
import ActivityBox from "./ActivityBox"
import { Service } from "./DBService/DBService"
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
  "lamp.spin_wheel",
  "lamp.maze_game",
]

export default function Survey({ participant, activities, showStreak, ...props }) {
  const classes = useStyles()
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
          (typeof x?.category === "undefined" || x?.category === null)) ||
        (!!x?.category && x?.category.includes("assess"))
    )
    setSavedActivities(gActivities)
    if (gActivities.length > 0) {
      Service.getAllTags("activitytags").then((data) => {
        setTag(
          (data || []).filter(
            (x) =>
              ((games.includes(x.spec) ||
                x.spec === "lamp.group" ||
                x.spec === "lamp.dbt_diary_card" ||
                x.spec === "lamp.recording" ||
                x.spec === "lamp.survey") &&
                (typeof x?.category === "undefined" || x?.category === null)) ||
              (!!x?.category && x?.category.includes("assess"))
          )
        )
        setLoading(false)
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
        showStreak={showStreak}
        type="Assess"
      />
    </Container>
  )
}
