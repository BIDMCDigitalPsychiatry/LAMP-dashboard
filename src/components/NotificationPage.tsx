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
  Typography,
  Backdrop,
  CircularProgress,
} from "@material-ui/core"
import { URLSearchParams } from "url"
import LAMP from "lamp-core"
import Streak from "./Streak"
import SurveyInstrument from "./SurveyInstrument"
import EmbeddedActivity from "./EmbeddedActivity"
import { getEvents } from "./Participant"
import { ReactComponent as Ribbon } from "../icons/Ribbon.svg"
import { useTranslation } from "react-i18next"
import GroupActivity from "./GroupActivity"
import VoiceRecordingResult from "./VoiceRecordingResult"
import { getImage } from "./Manage"
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

export default function NotificationPage({ participant, activityId, mode, ...props }) {
  const classes = useStyles()
  const [activity, setActivity] = useState(null)
  const [openNotImplemented, setOpenNotImplemented] = useState(false)
  const [openComplete, setOpenComplete] = React.useState(false)
  const [streak, setStreak] = useState(1)
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()
  const [response, setResponse] = useState(false)
  const [openRecordSuccess, setOpenRecordSuccess] = React.useState(false)
  const [streakActivity, setStreakActivity] = useState(null)
  // const [searchParams] = new URLSearchParams();

  useEffect(() => {
    // let url = new URL(window.location.href)
    // var params = new URLSearchParams(url.search);
    ;(async () => {
      LAMP.Activity.view(activityId).then((data) => {
        setActivity(data)
        setLoading(false)
      })
    })()
  }, [])

  const submitSurvey = (response, overwritingTimestamp) => {
    if (!!response) {
      setLoading(true)
      let events = response.map((x, idx) => ({
        timestamp: new Date().getTime(),
        duration: response?.duration,
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
        showStreak(participant, activity)
      })
    } else {
      if (mode === null) window.location.href = "/#/"
      else history.back()
    }
  }

  const returnResult = () => {
    if (mode === null) setResponse(true)
    else history.back()
  }

  const showStreak = (participant, activity) => {
    setLoading(true)
    getImage(activity?.id, activity?.spec).then((tag) => {
      setStreakActivity(tag?.streak ?? null)
      if (!!tag?.streak?.streak || typeof tag?.streak === "undefined") {
        getEvents(participant, activity.id).then((streak) => {
          setStreak(streak)
          setOpenComplete(true)
          setTimeout(() => {
            setOpenComplete(false)
            returnResult()
            setLoading(false)
          }, 6000)
        })
      } else {
        returnResult()
        setLoading(false)
      }
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
        !loading &&
        (activity?.spec === "lamp.survey" ? (
          <SurveyInstrument
            participant={participant}
            type={activity?.name ?? ""}
            fromPrevent={false}
            group={[activity]}
            onComplete={submitSurvey}
            noBack={false}
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
            noBack={false}
            onComplete={(data) => {
              if (data === null) {
                if (mode === null) window.location.href = "/#/"
                else history.back()
              } else {
                if (activity?.spec === "lamp.recording" && !!data && !!data?.timestamp) {
                  if (!!data && !!data?.timestamp) {
                    setOpenRecordSuccess(true)
                    setTimeout(function () {
                      setOpenRecordSuccess(false)
                      showStreak(participant, activity)
                    }, 2000)
                  }
                } else if (!!data && !!data?.timestamp) showStreak(participant, activity)
              }
            }}
          />
        ) : activity?.spec === "lamp.group" ? (
          <GroupActivity
            activity={activity}
            participant={participant}
            submitSurvey={submitSurvey}
            onComplete={() => {
              showStreak(participant, activity)
            }}
            noBack={false}
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
      <VoiceRecordingResult
        open={openRecordSuccess}
        onClose={() => {
          setOpenRecordSuccess(false)
        }}
        setOpenRecordSuccess={setOpenRecordSuccess}
      />
      <Streak
        open={openComplete}
        onClose={() => {
          setOpenComplete(false)
          returnResult()
          setLoading(false)
        }}
        popupClose={() => {
          setOpenComplete(false)
          setLoading(true)
        }}
        streak={streak}
        activity={streakActivity}
      />
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  )
}
