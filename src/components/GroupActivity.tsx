// Core Imports
import React, { useEffect, useState } from "react"
import { makeStyles, Box, Backdrop, CircularProgress } from "@material-ui/core"
import LAMP from "lamp-core"
import EmbeddedActivity from "./EmbeddedActivity"
import { useTranslation } from "react-i18next"
import { sensorEventUpdate } from "./BottomMenu"
import { spliceActivity, spliceCTActivity } from "./Researcher/ActivityList/ActivityMethods"
import { Service } from "./DBService/DBService"

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
  activityLevel: {
    position: "absolute",
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.2)",
    borderRadius: "15px 0 0 0",
    padding: "4px 7px",
    color: "#000",
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
  const [groupActivitySettings, setGroupActivitySettings] = useState({
    track_progress: false,
    sequential_ordering: false,
    hide_sub_activities: false,
    hide_on_completion: false,
    initialize_opened: false,
  })
  const [favoriteActivities, setFavoriteActivities] = useState<null | string[]>(null)

  useEffect(() => {
    if (index === 0) {
      sensorEventUpdate(tab?.toLowerCase() ?? null, participant?.id ?? participant, activity.id)
    }

    if (!!favoriteActivities && (groupActivities || []).length > 0 && index <= (groupActivities || []).length - 1) {
      setLoading(true)
      let actId = groupActivities[index]
      LAMP.Activity.view(actId).then((activity) => {
        Service.getUserDataByKey("activitytags", [activity?.id], "id").then((data) => {
          const tag = data[0]
          const dataActivity =
            activity.spec === "lamp.survey"
              ? spliceActivity({ raw: activity, tag })
              : spliceCTActivity({ raw: activity, tag })
          setCurrentActivity(dataActivity)
          setLoading(false)
        })
      })
    }
  }, [index, favoriteActivities])

  useEffect(() => {
    if (groupActivities.length > 0) setIndex(0)
  }, [groupActivities])

  useEffect(() => {
    ;(async () => {
      let tag =
        [await LAMP.Type.getAttachment(participant, "lamp.dashboard.favorite_activities")].map((y: any) =>
          !!y.error ? undefined : y.data
        )[0] ?? []
      setFavoriteActivities(tag)
    })()
    LAMP.Activity.view(activity.id).then((data) => {
      setIndex(-1)
      if (Array.isArray(data.settings)) {
        setGroupActivities(data.settings)
      } else {
        setGroupActivities(data.settings?.activities)
        let { activities, ...settings } = data.settings
        setGroupActivitySettings(settings)
      }
    })
  }, [])

  useEffect(() => {
    if (index >= 0 && currentActivity !== null) {
      setLoading(true)
      iterateActivity(data?.forward)
    }
  }, [data])

  const iterateActivity = (forward?: boolean | undefined) => {
    console.log(forward)
    let val = typeof forward == "undefined" || !!forward ? index + 1 : index - 1
    setCurrentActivity(null)
    if (val >= 0) setIndex(val)
    if (groupActivities.length === val || val == -1) {
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
          {groupActivitySettings && !!groupActivitySettings?.track_progress && (
            <Box className={classes.activityLevel}>
              Activity {index + 1} of {groupActivities.length}
            </Box>
          )}
          <EmbeddedActivity
            name={currentActivity?.name}
            activity={currentActivity}
            participant={participant}
            favoriteActivities={favoriteActivities}
            onComplete={(a) => {
              setResponse(a)
            }}
            forward={index < groupActivities.length}
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
