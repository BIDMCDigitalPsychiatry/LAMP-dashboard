// Core Imports
import React, { useState, useEffect } from "react"
import Container from "@material-ui/core/Container"
import Backdrop from "@material-ui/core/Backdrop"
import CircularProgress from "@material-ui/core/CircularProgress"
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles"
import { Participant as ParticipantObj } from "lamp-core"
import ActivityBox from "./ActivityBox"
import { Service } from "./DBService/DBService"

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

export default function Learn({
  participant,
  activities,
  showStreak,
  ...props
}: {
  participant: ParticipantObj
  activities: any
  activeTab: Function
  showStreak: Function
}) {
  const classes = useStyles()
  const [loading, setLoading] = useState(true)
  const [savedActivities, setSavedActivities] = useState([])
  const [tag, setTag] = useState([])

  useEffect(() => {
    let gActivities = activities.filter(
      (x: any) =>
        (x.spec === "lamp.tips" && (typeof x?.category === "undefined" || x?.category === null)) ||
        (!!x?.category && x?.category.includes("learn"))
    )
    setSavedActivities(gActivities)
    if (gActivities.length > 0) {
      Service.getAllTags("activitytags").then((data) => {
        setTag(
          (data || []).filter(
            (x: any) =>
              (x.spec === "lamp.tips" && (typeof x?.category === "undefined" || x?.category === null)) ||
              (!!x?.category && x?.category.includes("learn"))
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
        type="Learn"
      />
    </Container>
  )
}
