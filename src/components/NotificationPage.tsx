// Core Imports
import React, { useEffect, useState } from "react"
import {
  makeStyles,
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  Box,
  Icon,
  DialogTitle,
  IconButton,
  Typography,
  Backdrop,
  CircularProgress,
} from "@material-ui/core"
import LAMP from "lamp-core"
import SurveyInstrument from "./SurveyInstrument"
import EmbeddedActivity from "./EmbeddedActivity"
import { ReactComponent as Ribbon } from "../icons/Ribbon.svg"
import { useTranslation } from "react-i18next"
import GroupActivity from "./GroupActivity"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: 20,
  },
  ribbonText: {
    fontSize: "16px",
    color: "rgba(0, 0, 0, 0.75)",
    fontWeight: 600,
    marginBottom: "30px",
    padding: "0 42px",
  },
  niceWork: {
    marginTop: "20%",
    "& h5": { fontSize: 25, fontWeight: 600, color: "rgba(0, 0, 0, 0.75)" },
  },
  dialogueStyle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  dialogueCurve: { borderRadius: 10, maxWidth: 400 },
  MuiDialogPaperScrollPaper: {
    maxHeight: "100% !important",
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  niceWorkbadge: { position: "relative" },
  dayNotification: {
    position: "absolute",
    top: 0,
    width: "100%",
    paddingTop: 50,
    "& h4": { fontSize: 40, fontWeight: 700, color: "#00765C", lineHeight: "38px" },
    "& h6": { color: "#00765C", fontSize: 16, fontWeight: 600 },
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}))

async function getEvents(participantId: string, activityId: string) {
  let activityEvents = await LAMP.ActivityEvent.allByParticipant(participantId, activityId)
  let dates = []
  let steak = 0
  activityEvents.map((activityEvent, i) => {
    let date = new Date(activityEvent.timestamp)
    if (!dates.includes(date.toLocaleDateString())) {
      dates.push(date.toLocaleDateString())
    }
  })
  let currentDate = new Date()
  for (let date of dates) {
    if (date === currentDate.toLocaleDateString()) {
      steak++
    } else {
      break
    }
    currentDate.setDate(currentDate.getDate() - 1)
  }
  return steak > 0 ? steak : 1
}

export default function NotificationPage({ participant, activityId, ...props }) {
  const classes = useStyles()
  const [activity, setActivity] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const [openNotImplemented, setOpenNotImplemented] = useState(false)
  const [openComplete, setOpenComplete] = React.useState(false)
  const [steak, setSteak] = useState(1)
  const [loading, setLoading] = useState(true)
  const [activityDetails, setActivityDetails] = useState(null)
  const { t } = useTranslation()
  const [response, setResponse] = useState(false)

  useEffect(() => {
    ;(async () => {
      LAMP.Activity.view(activityId).then(setActivity)
    })()
  }, [])

  useEffect(() => {
    if (!!activity) {
      ;(async () => {
        let iconData = (await LAMP.Type.getAttachment(activity?.id, "lamp.dashboard.activity_details")) as any
        let activityData = {
          id: activity.id,
          spec: activity.spec,
          name: activity.name,
          settings: activity.settings,
          schedule: activity.schedule,
          icon: iconData.data ? iconData.data.icon : undefined,
        }
        setActivityDetails(activityData)
      })()
      setLoaded(true)
      setLoading(false)
    }
  }, [activity])

  const submitSurvey = (response, overwritingTimestamp) => {
    setLoading(true)
    let events = response.map((x, idx) => ({
      timestamp: new Date().getTime(),
      duration: response.duration,
      activity: activity.id,
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
      getEvents(participant, activity.id).then((steak) => {
        setResponse(true)
        setSteak(steak)
        setOpenComplete(true)
        setLoading(false)
      })
      setTimeout(() => {
        setOpenComplete(false)
      }, 10000)
    })
  }
  return (
    <div style={{ height: "100%" }}>
      {!!response && (
        <Box textAlign="center" pb={4} className={classes.niceWork}>
          <Typography variant="h5" gutterBottom>
            {t("Success") + "!"}
          </Typography>
          <Typography className={classes.ribbonText} component="p">
            {t("You have successfully completed your activity.")}
          </Typography>
          <Box textAlign="center" className={classes.niceWorkbadge}>
            <Icon>check_circle</Icon>
          </Box>
        </Box>
      )}
      {!response &&
        loaded &&
        (activity?.spec === "lamp.survey" ? (
          <SurveyInstrument
            participant={participant}
            type={activity?.name ?? ""}
            fromPrevent={false}
            group={[activity]}
            onComplete={submitSurvey}
          />
        ) : activity?.spec === "lamp.cats_and_dogs" ||
          activity?.spec === "lamp.jewels_a" ||
          activity?.spec === "lamp.jewels_b" ||
          activity?.spec === "lamp.spatial_span" ||
          activity?.spec === "lamp.pop_the_bubbles" ||
          activity?.spec === "lamp.balloon_risk" ||
          activity?.spec === "lamp.dbt_diary_card" ||
          activity?.spec === "lamp.journal" ||
          activity?.spec === "lamp.breathe" ||
          activity?.spec === "lamp.recording" ||
          activity?.spec === "lamp.scratch_image" ||
          activity?.spec === "lamp.tips" ? (
          <EmbeddedActivity
            name={activity?.name}
            activity={activity}
            participant={participant}
            onComplete={() => setResponse(true)}
          />
        ) : activity?.spec === "lamp.group" ? (
          <GroupActivity
            activity={activity}
            participant={participant}
            submitSurvey={submitSurvey}
            onComplete={() => setResponse(true)}
          />
        ) : (
          <Dialog
            open={openNotImplemented}
            onClose={() => setOpenNotImplemented(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent>{t("This activity is not yet available in mindLAMP 2.")}</DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenNotImplemented(false)} color="primary">
                {t("Ok")}
              </Button>
            </DialogActions>
          </Dialog>
        ))}
      <Dialog
        open={openComplete}
        onClose={() => setOpenComplete(false)}
        scroll="paper"
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        classes={{
          root: classes.dialogueStyle,
          paper: classes.dialogueCurve,
          paperScrollPaper: classes.MuiDialogPaperScrollPaper,
        }}
      >
        <DialogTitle>
          <IconButton aria-label="close" className={classes.closeButton} onClick={() => setOpenComplete(false)}>
            <Icon>close</Icon>
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box textAlign="center" pb={4} className={classes.niceWork}>
            <Typography variant="h5" gutterBottom>
              {t("Nice work!")}
            </Typography>
            <Typography className={classes.ribbonText} component="p">
              {t("You’re on a streak, keep it going")}
            </Typography>
            <Box textAlign="center" className={classes.niceWorkbadge}>
              <Ribbon width="170" height="226" />
              <Box className={classes.dayNotification}>
                <Typography variant="h4"> {steak}</Typography>{" "}
                <Typography variant="h6">{steak > 1 ? " " + t("days") : t("day")}</Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  )
}
