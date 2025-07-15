// Core Imports
import React, { useState, useEffect } from "react"
import Container from "@material-ui/core/Container"
import Backdrop from "@material-ui/core/Backdrop"
import CircularProgress from "@material-ui/core/CircularProgress"
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles"

import { useTranslation } from "react-i18next"
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
export default function Manage({ participant, activities, showStreak, ...props }) {
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
          (typeof x?.category === "undefined" || x?.category === null)) ||
        (!!x?.category && x?.category.includes("manage"))
    )
    setSavedActivities(gActivities)
    if (gActivities.length > 0) {
      Service.getAllTags("activitytags").then((data) => {
        setTag(
          (data || []).filter(
            (x: any) =>
              ((x.spec === "lamp.journal" || x.spec === "lamp.breathe" || x.spec === "lamp.scratch_image") &&
                (typeof x?.category === "undefined" || x?.category === null)) ||
              (!!x?.category && x?.category.includes("manage"))
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
        type="Manage"
      />
    </Container>
  )
}
