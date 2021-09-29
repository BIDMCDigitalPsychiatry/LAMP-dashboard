// Core Imports
import React, { useEffect, useState } from "react"
import {
  makeStyles,
  Dialog,
  Icon,
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
import Steak from "./Steak"
import SurveyInstrument from "./SurveyInstrument"
import EmbeddedActivity from "./EmbeddedActivity"
import { ReactComponent as Ribbon } from "../icons/Ribbon.svg"
import { useTranslation } from "react-i18next"
import { getEvents } from "./Participant"
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
    if ((groupActivities || []).length > 0 && index <= (groupActivities || []).length - 1) {
      setLoading(true)
      let actId = groupActivities[index]
      if (!!actId) {
        LAMP.Activity.view(actId).then((activity) => {
          setCurrentActivity(activity)
          setLoading(false)
        })
      }
    }
  }, [groupActivities, index])

  useEffect(() => {
    if (currentActivity !== null) {
      setActivityId(currentActivity.id)
      setActivityRun(false)
    }
  }, [currentActivity])

  useEffect(() => {
    LAMP.Activity.view(activity.id).then((data) => {
      setGroupActivities(data.settings)
    })
  }, [activity])

  const completeActivity = () => {
    showSteak(participant, currentActivity.id)
  }

  const iterateActivity = () => {
    let val = index + 1
    setCurrentActivity(null)
    setIndex(val)
    setActivityRun(true)
    if (groupActivities.length === val) {
      LAMP.ActivityEvent.create(participant.id ?? participant, {
        timestamp: new Date().getTime(),
        duration: new Date().getTime() - startTime,
        activity: activity.id,
        static_data: {},
      })
      props.onComplete()
    }
  }

  const submitSurvey = (response) => {
    setActivityRun(true)
    setLoading(true)
    const activityId = currentActivity.id
    setCurrentActivity(null)
    if (!!!response || response === null) {
      props.onComplete()
      setLoading(false)
    } else {
      let events = response.map((x, idx) => ({
        timestamp: new Date().getTime(),
        duration: response.duration,
        activity: activityId,
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
        completeActivity()
      })
    }
  }

  const showSteak = (participant, activityId) => {
    getEvents(participant, activityId).then((steak) => {
      setSteak(steak)
      setOpenComplete(true)
      setTimeout(() => {
        setOpenComplete(false)
        iterateActivity()
        setLoading(false)
      }, 5000)
    })
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
      {!activityRun && (
        <Box>
          {currentActivity?.spec === "lamp.survey" ? (
            <SurveyInstrument
              participant={participant}
              type={currentActivity?.name ?? ""}
              fromPrevent={false}
              group={[currentActivity]}
              onComplete={submitSurvey}
            />
          ) : currentActivity?.spec === "lamp.cats_and_dogs" ||
            currentActivity?.spec === "lamp.jewels_a" ||
            currentActivity?.spec === "lamp.jewels_b" ||
            currentActivity?.spec === "lamp.spatial_span" ||
            currentActivity?.spec === "lamp.dbt_diary_card" ||
            currentActivity?.spec === "lamp.journal" ||
            currentActivity?.spec === "lamp.breathe" ||
            currentActivity?.spec === "lamp.pop_the_bubbles" ||
            currentActivity?.spec === "lamp.balloon_risk" ||
            currentActivity?.spec === "lamp.recording" ||
            currentActivity?.spec === "lamp.scratch_image" ||
            currentActivity?.spec === "lamp.tips" ? (
            <EmbeddedActivity
              name={currentActivity?.name}
              activity={currentActivity}
              participant={participant}
              onComplete={() => {
                completeActivity()
              }}
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
          )}
        </Box>
      )}
      <Steak
        open={openComplete}
        onClose={() => {
          setOpenComplete(false)
        }}
        setOpenComplete={setOpenComplete}
        steak={steak}
      />
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  )
}
