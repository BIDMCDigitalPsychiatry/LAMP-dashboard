// Core Imports
import React, { useState, useEffect } from "react"
import {
  Container,
  Typography,
  Grid,
  Card,
  Box,
  AppBar,
  Toolbar,
  Icon,
  IconButton,
  ButtonBase,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Backdrop,
  CircularProgress,
  makeStyles,
  Theme,
  createStyles,
  Link,
} from "@material-ui/core"
import LAMP, { Participant as ParticipantObj } from "lamp-core"
import ResponsiveDialog from "./ResponsiveDialog"
import classnames from "classnames"
import { useTranslation } from "react-i18next"
import InfoIcon from "../icons/Info.svg"
import ActivityBox from "./ActivityBox"
import ActivityPopup from "./ActivityPopup"
import { changeCase } from "./App"
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
  showSteak,
  submitSurvey,
  ...props
}: {
  participant: ParticipantObj
  activities: any
  activeTab: Function
  showSteak: Function
  submitSurvey: Function
}) {
  const classes = useStyles()
  const [loading, setLoading] = useState(true)
  const [savedActivities, setSavedActivities] = useState([])
  const [activitiesArray, setActivitiesArray] = useState({})

  const { t } = useTranslation()

  useEffect(() => {
    let gActivities = activities.filter(
      (x: any) =>
        (x.spec === "lamp.tips" && (!x?.category || (!!x?.category && !x?.category[0]))) ||
        (!!x?.category && !!x?.category[0] && (x?.category[0] || "") === "learn")
    )
    if (gActivities.length > 0) {
      ;(async () => {
        let activityResult = await Promise.all(
          gActivities.map(async (activity) => {
            let iconData = (await LAMP.Type.getAttachment(activity.id, "lamp.dashboard.activity_details")) as any
            return {
              id: activity.id,
              spec: activity.spec,
              name: activity.name,
              settings: activity.settings,
              schedule: activity.schedule,
              icon: iconData.data ? iconData.data.photo : InfoIcon,
            }
          })
        )
        setSavedActivities(activityResult)
      })()
    } else {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    ;(async () => {
      let activityData = await savedActivities.reduce(function (r, a) {
        r[a.name] = r[a.name] || []
        r[a.name] = {
          id: a.id,
          name: a.name,
          icon: a.icon,
          spec: a.spec,
        }
        setLoading(false)
        return r
      }, Object.create(null))
      setActivitiesArray(activityData)
    })()
  }, [savedActivities])

  return (
    <Container className={classes.thumbContainer}>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <ActivityBox
        participant={participant}
        savedActivities={savedActivities}
        tag={activitiesArray}
        showSteak={showSteak}
        submitSurvey={submitSurvey}
        type="Learn"
      />
    </Container>
  )
}
