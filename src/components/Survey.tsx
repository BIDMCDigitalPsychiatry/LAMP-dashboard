// Core Imports
import React, { useState, useEffect } from "react"
import {
  Container,
  Backdrop,
  CircularProgress,
  Typography,
  Grid,
  Icon,
  Card,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  ButtonBase,
  makeStyles,
  Theme,
  createStyles,
  Link,
} from "@material-ui/core"
import ResponsiveDialog from "./ResponsiveDialog"
import SurveyInstrument from "./SurveyInstrument"
import LAMP from "lamp-core"
import classnames from "classnames"
import { useSnackbar } from "notistack"
import { useTranslation } from "react-i18next"
import { DatePicker } from "@material-ui/pickers"
import EmbeddedActivity from "./EmbeddedActivity"
import InfoIcon from "../icons/Info.svg"
import GroupActivity from "./GroupActivity"
import ReactMarkdown from "react-markdown"
import emoji from "remark-emoji"
import gfm from "remark-gfm"
import { changeCase } from "./App"
import ActivityBox from "./ActivityBox"

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

async function getDetails(activityId: string, spec: string) {
  return [
    await LAMP.Type.getAttachment(
      activityId,
      spec === "lamp.survey" ? "lamp.dashboard.survey_description" : "lamp.dashboard.activity_details"
    ),
  ].map((y: any) => (!!y.error ? undefined : y.data))[0]
}

export const games = [
  "lamp.jewels_a",
  "lamp.jewels_b",
  "lamp.spatial_span",
  "lamp.cats_and_dogs",
  "lamp.pop_the_bubbles",
  "lamp.balloon_risk",
]

export default function Survey({
  participant,
  activities,
  visibleActivities,
  setVisibleActivities,
  onComplete,
  showSteak,
  ...props
}) {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const [dialogueType, setDialogueType] = React.useState("")
  const [openData, setOpenData] = React.useState(false)
  const [questionCount, setQuestionCount] = useState(0)
  const [openRecordSuccess, setOpenRecordSuccess] = React.useState(false)
  const { t } = useTranslation()
  const [spec, setSpec] = useState(null)
  const [activity, setActivity] = useState(null)
  const [tag, setTag] = useState([])
  const [savedActivities, setSavedActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const handleClickOpen = (type: string) => {
    setDialogueType(type)
    setOpen(true)
  }

  const submitSurveyType = (response) => {
    setOpenData(false)
    onComplete(response, activity.id)
  }

  const submitEmbeddedActivity = (response) => {
    if (spec === "lamp.tips" && !!response) {
      showSteak(participant, activity.id)
      setOpenData(false)
      onComplete(null)
    }
    if (!!response?.clickBack || spec !== "lamp.recording") {
      if (!!response?.timestamp) showSteak(participant, activity.id)
      setOpenData(false)
      onComplete(null)
    } else {
      setOpenRecordSuccess(true)
      setTimeout(function () {
        setOpenRecordSuccess(false)
        if (!!response && !!response?.timestamp) showSteak(participant, activity.id)
        setOpenData(false)
        onComplete(null)
      }, 2000)
    }
  }

  useEffect(() => {
    setLoading(true)
    let gActivities = (activities || []).filter(
      (x) =>
        ((games.includes(x.spec) ||
          x.spec === "lamp.group" ||
          x.spec === "lamp.dbt_diary_card" ||
          x.spec === "lamp.recording" ||
          x.spec === "lamp.survey") &&
          (!x?.category || (!!x?.category && !x?.category[0]))) ||
        (!!x?.category && !!x?.category[0] && (x?.category[0] || "") === "assess")
    )
    setSavedActivities(gActivities)
    if (gActivities.length > 0) {
      let tags = []
      let count = 0
      gActivities.map((activity, index) => {
        getDetails(activity.id, activity.spec).then((img) => {
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
        submitSurvey={submitSurveyType}
        type="Assess"
      />
    </Container>
  )
}
