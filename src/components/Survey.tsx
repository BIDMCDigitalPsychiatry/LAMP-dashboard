// Core Imports
import React, { useState, useEffect } from "react"
import {
  Container,
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
import ActivityPage from "./ActivityPage"
import ActivityPopup from "./ActivityPopup"
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    linkButton: {
      padding: "15px 25px 15px 25px",
    },
    cardlabel: {
      fontSize: 14,
      padding: "0 18px",
      bottom: 15,
      position: "absolute",
      width: "100%",
      [theme.breakpoints.down("sm")]: {
        fontSize: 12,
        padding: "0 5px",
      },
    },
    assess: {
      background: "#E7F8F2",
      padding: "10px 0",
      minHeight: 180,
      textAlign: "center",
      boxShadow: "none",
      borderRadius: 18,
      position: "relative",
      width: "100%",
      "& svg": {
        [theme.breakpoints.up("lg")]: {
          width: 150,
          height: 150,
        },
      },
      [theme.breakpoints.up("lg")]: {
        minHeight: 240,
      },
    },
    MuiDialogPaperScrollPaper: {
      maxHeight: "100% !important",
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    dialogueStyle: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    header: {
      background: "#E7F8F2",
      padding: "35px 40px 10px",
      textAlign: "center",
      [theme.breakpoints.down("lg")]: {
        padding: "35px 20px 10px",
      },
      "& h2": {
        fontSize: 25,
        fontWeight: 600,
        color: "rgba(0, 0, 0, 0.75)",
        textAlign: "left",
        [theme.breakpoints.down("sm")]: {
          fontSize: 18,
        },
      },

      "& h6": {
        fontSize: "14px",
        fontWeight: "normal",
        textAlign: "left",
      },
    },
    btngreen: {
      background: "#92E7CA",
      borderRadius: "40px",
      minWidth: "200px",
      boxShadow: " 0px 10px 15px rgba(146, 231, 202, 0.25)",
      lineHeight: "22px",
      display: "inline-block",
      textTransform: "capitalize",
      fontSize: "16px",
      color: "rgba(0, 0, 0, 0.75)",
      fontWeight: "bold",
      marginBottom: 20,
      cursor: "pointer",
      [theme.breakpoints.down("sm")]: {
        marginBottom: 0,
      },
      "&:hover": {
        boxShadow:
          "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
      },
    },
    topicon: {
      minWidth: 150,
      minHeight: 150,
      [theme.breakpoints.up("lg")]: {
        width: 150,
        height: 150,
      },
      [theme.breakpoints.down("sm")]: {
        minWidth: 105,
        minHeight: 105,
      },
    },
    surveytextarea: {
      padding: "20px 40px 40px",
      "& h4": { fontSize: 16, fontWeight: "bold", marginBottom: 15 },
      [theme.breakpoints.down("lg")]: {
        padding: "20px 20px 10px",
      },
    },
    dialogtitle: { padding: 0 },

    ribbonText: {
      fontSize: "16px",
      color: "rgba(0, 0, 0, 0.75)",
      fontWeight: 600,
      marginBottom: "30px",
      padding: "0 42px",
    },
    thumbMain: { maxWidth: 255 },
    thumbContainer: {
      maxWidth: 1055,
      width: "80%",
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        paddingBottom: 80,
      },
    },
    fullwidthBtn: { width: "100%" },
    dialogueCurve: { borderRadius: 10, maxWidth: 400 },
    niceWork: {
      "& h5": { fontSize: 25, fontWeight: 600, color: "rgba(0, 0, 0, 0.75)" },
    },
    calendatInput: {
      width: "100%",
      "& input": {
        textAlign: "center",
        fontSize: 18,
        fontWeight: 600,
        color: "rgba(0, 0, 0, 0.75)",
      },
    },
    mainIcons: {
      width: 100,
      height: 100,
      [theme.breakpoints.up("lg")]: {
        width: 150,
        height: 150,
      },
    },
    blankMsg: {
      "& path": { fill: "#666" },
      "& p": { margin: "2px 5px" },
    },
    niceWorkbadge: { position: "relative", "& span": { fontSize: "110px", color: "#2F9D7E" } },
    dayNotification: {
      position: "absolute",
      top: 0,
      width: "100%",
      paddingTop: 50,
      "& h4": { fontSize: 40, fontWeight: 700, color: "#00765C", lineHeight: "38px" },
      "& h6": { color: "#00765C", fontSize: 16, fontWeight: 600 },
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

  function LinkRenderer(data: any) {
    return (
      <a href={data.href} target="_blank">
        {data.children}
      </a>
    )
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
          !x?.category) ||
        (!!x?.category && (x?.category[0] || "") === "assess")
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
  // var date = new Date()
  // date.setDate(date.getDate() - 21)

  // const year = date.getFullYear()
  // const month = date.getMonth() + 1
  // const day = date.getDate()
  // const formattedDate = year + "-" + month + "-" + day
  const getActivity = (y: any) => {
    LAMP.Activity.view(y.id).then((data) => {
      setSpec(y.spec)
      setActivity(data)
      y.spec === "lamp.dbt_diary_card"
        ? setQuestionCount(6)
        : games.includes(y.spec)
        ? setQuestionCount(0)
        : setQuestionCount(data.settings?.length ?? 0)
      setVisibleActivities([data])
      handleClickOpen(y.name)
    })
  }

  return (
    <Container className={classes.thumbContainer}>
      <Grid container spacing={2} direction="row" justify="flex-start" alignItems="center">
        {savedActivities.length ? (
          savedActivities.map((y) => (
            <Grid
              item
              xs={6}
              sm={4}
              md={3}
              lg={3}
              onClick={() => {
                getActivity(y)
              }}
              className={classes.thumbMain}
            >
              <ButtonBase focusRipple className={classes.fullwidthBtn}>
                <Card className={classes.assess}>
                  <Box mt={2} mb={1}>
                    <Box
                      className={classes.mainIcons}
                      style={{
                        margin: "auto",
                        background: tag[y?.id]?.photo
                          ? `url(${tag[y?.id]?.photo}) center center/contain no-repeat`
                          : `url(${InfoIcon}) center center/contain no-repeat`,
                      }}
                    ></Box>
                  </Box>
                  <Typography className={classes.cardlabel}>
                    <ReactMarkdown
                      source={t(y.name)}
                      escapeHtml={false}
                      plugins={[gfm, emoji]}
                      renderers={{ link: LinkRenderer }}
                    />
                  </Typography>
                </Card>
              </ButtonBase>
            </Grid>
          ))
        ) : (
          <Box display="flex" className={classes.blankMsg} ml={1}>
            <Icon>info</Icon>
            <p>{t("There are no Survey activities available.")}</p>
          </Box>
        )}
      </Grid>

      <ActivityPopup
        spec={spec}
        activity={activity}
        tag={tag}
        questionCount={questionCount}
        open={open}
        setOpen={setOpen}
        type="Assess"
        setOpenData={setOpenData}
      />
      <ResponsiveDialog
        transient={false}
        animate
        fullScreen
        open={openData}
        onClose={() => {
          setOpenData(false)
        }}
      >
        <ActivityPage
          activity={activity}
          participant={participant}
          setOpenData={setOpenData}
          submitSurvey={submitSurveyType}
          showSteak={showSteak}
        />
      </ResponsiveDialog>
    </Container>
  )
}
