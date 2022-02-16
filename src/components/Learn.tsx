// Core Imports
import React, { useState, useEffect } from "react"
import { Container, Backdrop, CircularProgress, makeStyles, Theme, createStyles, Link } from "@material-ui/core"
import LAMP, { Participant as ParticipantObj } from "lamp-core"
import { useTranslation } from "react-i18next"
import ActivityBox from "./ActivityBox"
import { getImage } from "./Manage"
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

  const { t } = useTranslation()

  useEffect(() => {
    let gActivities = activities.filter(
      (x: any) =>
        (x.spec === "lamp.tips" && (typeof x?.category === "undefined" || x?.category === null)) ||
        (!!x?.category && x?.category.includes("learn"))
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
        showStreak={showStreak}
        type="Learn"
      />
    </Container>
  )
}
