// Core Imports
import React, { useEffect, useState } from "react"
import { makeStyles, Box, Backdrop, CircularProgress } from "@material-ui/core"
import LAMP from "lamp-core"
import EmbeddedActivity from "./EmbeddedActivity"
import { useTranslation } from "react-i18next"
import { sensorEventUpdate } from "./BottomMenu"
import { spliceActivity } from "./Researcher/ActivityList/ActivityMethods"

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

export default function GroupActivity({ participant, activity, noBack, tab, ...props }) {
  const classes = useStyles()
  const [currentActivity, setCurrentActivity] = useState(null)
  const [groupActivities, setGroupActivities] = useState([])
  const [startTime, setStartTime] = useState(new Date().getTime())
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()
  const [index, setIndex] = useState(-1)
  const [data, setResponse] = useState(null)

  useEffect(() => {
    if (index === 0) {
      sensorEventUpdate(tab?.toLowerCase() ?? null, participant?.id ?? participant, activity.id)
    }
    if ((groupActivities || []).length > 0 && index <= (groupActivities || []).length - 1) {
      setLoading(true)
      let actId = groupActivities[index]
      LAMP.Activity.view(actId).then((activity) => {
        if (activity.spec === "lamp.survey") {
          LAMP.Type.getAttachment(actId, "lamp.dashboard.survey_description").then((tag) => {
            const data = spliceActivity({ raw: activity, tag })
            setCurrentActivity(data)
            setLoading(false)
          })
        } else {
          setCurrentActivity(activity)
          setLoading(false)
        }
      })
    }
  }, [index])

  useEffect(() => {
    if (groupActivities.length > 0) setIndex(0)
  }, [groupActivities])

  useEffect(() => {
    LAMP.Activity.view(activity.id).then((data) => {
      setIndex(-1)
      setGroupActivities(data.settings)
    })
  }, [])

  useEffect(() => {
    if (index >= 0 && currentActivity !== null) {
      setLoading(true)
      iterateActivity()
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

  return (
    <div style={{ height: "100%" }}>
      {!!currentActivity && (
        <Box>
          <EmbeddedActivity
            name={currentActivity?.name}
            activity={currentActivity}
            participant={participant}
            onComplete={(a) => {
              setResponse({})
            }}
            noBack={noBack}
            tab={tab}
          />
        </Box>
      )}
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  )
}
