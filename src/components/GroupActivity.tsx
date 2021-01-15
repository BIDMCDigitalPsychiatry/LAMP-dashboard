// Core Imports
import React, { useEffect, useState } from "react"
import {
  makeStyles,
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  Box,
  DialogTitle,
  IconButton,
  Typography,
  Backdrop,
  CircularProgress,
} from "@material-ui/core"
import LAMP from "lamp-core"
import SurveyInstrument from "./SurveyInstrument"
import EmbeddedActivity from "./EmbeddedActivity"
import CloseIcon from "@material-ui/icons/Close"
import { ReactComponent as Ribbon } from "../icons/Ribbon.svg"
import { useTranslation } from "react-i18next"
import JournalEntries from "./JournalEntries"
import Breathe from "./Breathe"
import ScratchImage from "./ScratchImage"
import TipNotification from "./TipNotification"
import { SCALE_CATEGORY_INDEX } from "vega-lite/build/src/scale"

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
  if (!!activityEvents) {
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
  }
  return steak > 0 ? steak : 1
}

export default function GroupActivity({ participant, activity, ...props }) {
  const classes = useStyles()
  const [currentActivity, setCurrentActivity] = useState(null)
  const [groupActivities, setGroupActivities] = useState([])
  const [startTime, setStartTime] = useState(new Date().getTime())
  const [openNotImplemented, setOpenNotImplemented] = useState(false)
  const [openComplete, setOpenComplete] = React.useState(false)
  const [steak, setSteak] = useState(1)
  const [loading, setLoading] = useState(true)
  const [activityDetails, setActivityDetails] = useState(null)
  const [activityId, setActivityId] = useState(null)
  const [activityRun, setActivityRun] = useState(true)
  const { t } = useTranslation()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (groupActivities.length > 0 && index <= groupActivities.length - 1) {
      setLoading(true)
      let actId = groupActivities[index]
      LAMP.Activity.view(actId).then((activity) => {
        setCurrentActivity(activity)
        setLoading(false)
      })
    }
  }, [groupActivities, index])

  useEffect(() => {
    if (currentActivity !== null) {
      setActivityId(currentActivity.id)
      setActivityRun(false)
    }
  }, [currentActivity])

  useEffect(() => {
    setGroupActivities(activity.settings)
  }, [])

  const completeActivity = () => {
    let val = index + 1
    setIndex(val)
    setActivityRun(true)
    if (groupActivities.length === val) {
      LAMP.ActivityEvent.create(participant.id, {
        timestamp: new Date().getTime(),
        duration: new Date().getTime() - startTime,
        activity: activity.id,
        static_data: {},
      })
      props.onComplete()
    }
  }

  const submitSurvey = (response) => {
    setLoading(true)
    if (response === null) {
      getEvents(participant, currentActivity.id).then((steak) => {
        setSteak(steak)
        setOpenComplete(true)
        setLoading(false)
      })
    } else {
      let events = response.map((x, idx) => ({
        timestamp: new Date().getTime(),
        duration: response.duration,
        activity: currentActivity.id,
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
          .map((x) => LAMP.ActivityEvent.create(participant.id, x).catch((e) => console.log(e)))
      ).then((x) => {
        getEvents(participant, currentActivity.id).then((steak) => {
          setSteak(steak)
          setOpenComplete(true)
          setLoading(false)
        })
        setTimeout(() => {
          setOpenComplete(false)
          completeActivity()
        }, 10000)
      })
    }
  }

  useEffect(() => {
    if (activity !== null) {
      ;(async () => {
        let iconData = (await LAMP.Type.getAttachment(activity.id, "lamp.dashboard.activity_details")) as any
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
      setLoading(false)
    }
  }, [activity])

  return (
    <div style={{ height: "100%" }}>
      {!activityRun &&
        (currentActivity?.spec === "lamp.survey" ? (
          <SurveyInstrument
            id={participant}
            type={currentActivity?.name ?? ""}
            fromPrevent={false}
            group={[currentActivity]}
            setVisibleActivities={setCurrentActivity}
            onComplete={submitSurvey}
          />
        ) : currentActivity?.spec === "lamp.cats_and_dogs" ||
          currentActivity?.spec === "lamp.jewels_a" ||
          currentActivity?.spec === "lamp.jewels_b" ||
          currentActivity?.spec === "lamp.spatial_span" ||
          currentActivity?.spec === "lamp.dbt_diary_card" ? (
          <EmbeddedActivity
            name={currentActivity?.name}
            activity={currentActivity}
            participant={participant}
            onComplete={() => completeActivity()}
          />
        ) : currentActivity?.spec === "lamp.journal" ? (
          <JournalEntries
            participant={participant}
            activityId={currentActivity?.id ?? null}
            onComplete={() => completeActivity()}
          />
        ) : currentActivity?.spec === "lamp.scratch_image" ? (
          <ScratchImage
            participant={participant}
            activity={currentActivity ?? []}
            onComplete={() => completeActivity()}
          />
        ) : currentActivity?.spec === "lamp.breathe" ? (
          <Breathe activity={currentActivity} participant={participant} onComplete={() => completeActivity()} />
        ) : currentActivity?.spec === "lamp.tips" ? (
          <TipNotification
            participant={participant}
            title={currentActivity.name}
            details={currentActivity?.settings ?? {}}
            icon={activityDetails?.icon ?? undefined}
            onComplete={() => completeActivity()}
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
              <Button
                onClick={() => {
                  setOpenNotImplemented(false)
                  completeActivity()
                }}
                color="primary"
              >
                {t("Ok")}
              </Button>
            </DialogActions>
          </Dialog>
        ))}
      <Dialog
        open={openComplete}
        onClose={() => {
          setOpenComplete(false)
          completeActivity()
        }}
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
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={() => {
              setOpenComplete(false)
            }}
          >
            <CloseIcon />
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
