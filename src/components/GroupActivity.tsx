// Core Imports
import React, { useEffect, useState } from "react"
import {
  makeStyles,
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  Box,
  Backdrop,
  CircularProgress,
} from "@material-ui/core"
import LAMP from "lamp-core"
import Streak from "./Streak"
import SurveyInstrument from "./SurveyInstrument"
import EmbeddedActivity from "./EmbeddedActivity"
import { ReactComponent as Ribbon } from "../icons/Ribbon.svg"
import { useTranslation } from "react-i18next"
import { getEvents } from "./Participant"
import { getImage } from "./Manage"
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: 20,
  },
  MuiDialogPaperScrollPaper: {
    maxHeight: "100% !important",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}))

export default function GroupActivity({ participant, activity, noBack, ...props }) {
  const classes = useStyles()
  const [currentActivity, setCurrentActivity] = useState(null)
  const [groupActivities, setGroupActivities] = useState([])
  const [startTime, setStartTime] = useState(new Date().getTime())
  const [openNotImplemented, setOpenNotImplemented] = useState(false)
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()
  const [index, setIndex] = useState(-1)
  const [data, setResponse] = useState(null)

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
  }, [index])

  useEffect(() => {
    if (groupActivities.length > 0) setIndex(0)
  }, [groupActivities])

  useEffect(() => {
    LAMP.Activity.view(activity.id).then((data) => {
      setGroupActivities(data.settings)
    })
  }, [])

  useEffect(() => {
    if (index >= 0 && currentActivity !== null) {
      setLoading(true)
      const activityId = currentActivity.id
      setCurrentActivity(null)
      if (
        (currentActivity?.spec === "lamp.survey" && typeof data?.duration === "undefined") ||
        currentActivity?.spec !== "lamp.survey"
      ) {
        iterateActivity()
      } else {
        let events = (data || {}).map((x, idx) => ({
          timestamp: new Date().getTime(),
          duration: data.duration,
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
            .map((x) => LAMP.ActivityEvent.create(participant?.id ?? participant, x).catch((e) => console.log(e)))
        ).then((x) => {
          iterateActivity()
        })
      }
    }
  }, [data])

  const iterateActivity = () => {
    let val = index + 1
    setCurrentActivity(null)
    setIndex(val)
    if (groupActivities.length === val) {
      LAMP.ActivityEvent.create(participant.id ?? participant, {
        timestamp: new Date().getTime(),
        duration: new Date().getTime() - startTime,
        activity: activity.id,
        static_data: {},
      })
      props.onComplete({ timestamp: new Date().getTime() })
    }
  }

  const submitSurvey = (response) => {
    setResponse(!!!response || response === null ? {} : response)
  }

  return (
    <div style={{ height: "100%" }}>
      {!!currentActivity && (
        <Box>
          {currentActivity?.spec === "lamp.survey" ? (
            <SurveyInstrument
              participant={participant}
              type={currentActivity?.name ?? ""}
              fromPrevent={false}
              group={[currentActivity]}
              onComplete={submitSurvey}
              noBack={noBack}
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
              onComplete={(a) => {
                setResponse({})
              }}
              noBack={noBack}
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
                    iterateActivity()
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
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  )
}
