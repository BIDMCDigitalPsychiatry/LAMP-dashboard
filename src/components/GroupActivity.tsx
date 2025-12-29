// Core Imports
import React, { useEffect, useState, lazy, Suspense } from "react"
import { makeStyles, Box, Backdrop, CircularProgress } from "@material-ui/core"
import LAMP from "lamp-core"
import { useTranslation } from "react-i18next"
import { sensorEventUpdate } from "./BottomMenu"
import { spliceActivity, spliceCTActivity } from "./Researcher/ActivityList/ActivityMethods"
import { Service } from "./DBService/DBService"
import { getActivityWithDeduplication, lazyRetry } from "../helper/functions"
import { getImage } from "./Participant"

const EmbeddedActivity = lazy(lazyRetry(() => import("./EmbeddedActivity")))

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
  const [index, setIndex] = useState(-1)
  const [data, setResponse] = useState(null)
  const [groupActivitySettings, setGroupActivitySettings] = useState({
    track_progress: false,
    sequential_ordering: false,
    hide_sub_activities: false,
    hide_on_completion: false,
    initialize_opened: false,
  })

  useEffect(() => {
    let groupActivity = activity
    if (index === 0) {
      sensorEventUpdate(tab?.toLowerCase() ?? null, participant?.id ?? participant, activity.id)
    }
    if ((groupActivities || [])?.length > 0 && index <= (groupActivities || [])?.length - 1) {
      setLoading(true)
      let actId = groupActivities[index]

      // Check cache first for instant loading (from prefetch)
      const cacheKey = `activity_data_${actId}`
      let useCache = false
      try {
        const cached = sessionStorage.getItem(cacheKey)
        if (cached) {
          const parsed = JSON.parse(cached)
          const cacheAge = Date.now() - (parsed.timestamp || 0)
          // Use cache if less than 2 minutes old
          if (cacheAge < 2 * 60 * 1000 && parsed.data && parsed.tag) {
            const cachedActivity = parsed.data
            const cachedTag = parsed.tag
            // Show cached data immediately - instant navigation!
            const dataActivity =
              cachedActivity.spec === "lamp.survey"
                ? spliceActivity({ raw: cachedActivity, tag: cachedTag, mainactivity: groupActivity })
                : spliceCTActivity({ raw: cachedActivity, tag: cachedTag, mainactivity: groupActivity })
            setCurrentActivity(dataActivity)
            setLoading(false)
            useCache = true
            // Continue fetching fresh data in background (non-blocking)
          }
        }
      } catch (e) {
        // If cache read fails, continue with normal fetch
      }

      // If not using cache, fetch fresh data immediately (don't wait for prefetch)
      // The first activity should display as soon as possible while other activities prefetch in background
      if (!useCache) {
        // Use getActivityWithDeduplication to benefit from caching (localStorage + in-memory)
        // This prevents duplicate API calls when the same activity is opened from ActivityBox and NotificationPage
        getActivityWithDeduplication(actId)
          .then((activityData) => {
            // Use activity.spec instead of data.spec since data might be null
            if (!activityData || !activityData.spec) {
              setLoading(false)
              return
            }
            // Fetch image in parallel (optimized)
            return Promise.all([
              Promise.resolve(activityData),
              getImage(actId, activityData.spec).catch(() => undefined),
            ])
          })
          .then((result) => {
            if (result) {
              const [activityData, tag] = result
              // Cache for next time
              try {
                sessionStorage.setItem(
                  cacheKey,
                  JSON.stringify({
                    data: activityData,
                    tag,
                    timestamp: Date.now(),
                  })
                )
              } catch (e) {
                // Ignore cache write errors
              }
              const dataActivity =
                activityData.spec === "lamp.survey"
                  ? spliceActivity({ raw: activityData, tag, mainactivity: groupActivity })
                  : spliceCTActivity({ raw: activityData, tag, mainactivity: groupActivity })
              setCurrentActivity(dataActivity)
              setLoading(false)
            }
          })
          .catch((error) => {
            console.error("Failed to fetch activity:", error)
            setLoading(false)
          })
      }
    }
  }, [index])

  useEffect(() => {
    if (groupActivities?.length > 0) {
      setIndex(0)
    } else {
      setLoading(false)
    }
  }, [groupActivities])

  useEffect(() => {
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
      iterateActivity()
    }
  }, [data])

  const iterateActivity = () => {
    let val = index + 1
    setCurrentActivity(null)
    if (val >= 0) setIndex(val)
    if (groupActivities?.length === val || val == -1) {
      LAMP.ActivityEvent.create(participant.id ?? participant, {
        timestamp: new Date().getTime(),
        duration: new Date().getTime() - startTime,
        activity: activity.id,
        static_data: {},
      }).then((x) => {
        props.onComplete({ timestamp: new Date().getTime(), response: x })
      })
    }
  }

  return (
    <div style={{ height: "100%" }}>
      {!!currentActivity && (
        <Box>
          {groupActivitySettings && !!groupActivitySettings?.track_progress && (
            <Box className={classes.activityLevel}>
              Activity {index + 1} of {groupActivities?.length}
            </Box>
          )}
          <Suspense fallback={<div />}>
            <EmbeddedActivity
              isFromGroupActivity={true}
              name={currentActivity?.name}
              activity={currentActivity}
              participant={participant}
              onComplete={(a) => {
                setResponse(!a ? {} : a)
              }}
              forward={index < groupActivities?.length}
              noBack={noBack}
              tab={tab}
            />
          </Suspense>
        </Box>
      )}
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  )
}
