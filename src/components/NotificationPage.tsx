// Core Imports
import React, { useEffect, useState, lazy, Suspense } from "react"
import {
  makeStyles,
  Box,
  Icon,
  Typography,
  Backdrop,
  AppBar,
  Toolbar,
  IconButton,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Button,
} from "@material-ui/core"
import LAMP from "lamp-core"
import { getEvents, getImage } from "./Participant"
import { useTranslation } from "react-i18next"
import { spliceActivity, spliceCTActivity } from "./Researcher/ActivityList/ActivityMethods"
import { Service } from "./DBService/DBService"
import VisualPopup from "./VisualPopup"
import { getActivityWithDeduplication, lazyRetry } from "../helper/functions"
const Streak = lazy(lazyRetry(() => import("./Streak")))
const GroupActivity = lazy(lazyRetry(() => import("./GroupActivity")))
const EmbeddedActivity = lazy(lazyRetry(() => import("./EmbeddedActivity")))

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
  toolbardashboard: {
    minHeight: 65,
    [theme.breakpoints.up("md")]: {
      paddingTop: "0 !important",
      width: "100%",
      maxWidth: "100% !important",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "0 16px !important",
    },
    "& h5": {
      color: "rgba(0, 0, 0, 0.75)",
      textAlign: "center",
      fontWeight: "600",
      fontSize: 18,
      width: "100%",
      textTransform: "capitalize",
    },
  },
  inlineHeader: {
    background: "#FFFFFF",
    boxShadow: "none",
    "& h5": {
      fontSize: 25,
      paddingLeft: 20,
      color: "rgba(0, 0, 0, 0.75)",
      fontWeight: 600,
      lineHeight: "47px",
      textAlign: "left",
      [theme.breakpoints.down("sm")]: {
        paddingLeft: 16,
        lineHeight: "normal",
      },
    },
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

const demoActivities = {
  "lamp.spatial_span": "boxgame",
  "lamp.cats_and_dogs": "catsndogs",
  "Dot Touch": "dottouch",
  "lamp.jewels_a": "jewelspro",
  "lamp.jewels_b": "jewelspro",
  "lamp.fragmented_letters": "fragmentationofletters",
  "lamp.dbt_diary_card": "dbtdiarycard",
  "lamp.balloon_risk": "balloonrisk",
  "lamp.pop_the_bubbles": "popthebubbles",
  "lamp.journal": "journal",
  "lamp.breathe": "breathe",
  "lamp.recording": "voicerecording",
  "lamp.survey": "survey",
  "lamp.scratch_image": "scratchimage",
  "lamp.tips": "tips",
  "lamp.goals": "goals",
  "lamp.medications": "medicationtracker",
  "lamp.memory_game": "memorygame",
  "lamp.spin_wheel": "spin_wheel",
  "lamp.maze_game": "maze_game",
  "lamp.emotion_recognition": "emotion_recognition",
  "lamp.symbol_digit_substitution": "symbol_digit_substitution",
  "lamp.gyroscope": "gyroscope",
  "lamp.dcog": "d-cog",
  "lamp.funny_memory": "funnymemory",
  "lamp.trails_b": "dottouch",
  "lamp.voice_survey": "speechrecording",
  "lamp.digit_span": "digitspan",
}

// In-memory cache for activity HTML fetch promises to prevent duplicate concurrent requests
const activityHTMLFetchCache = new Map<string, Promise<string>>()

// Shared function to fetch activity HTML with deduplication
// Returns cached HTML if available, or fetches and caches it
// Uses promise caching to prevent duplicate concurrent requests
export const fetchActivityHTML = async (activityName: string): Promise<string> => {
  const cacheKey = `activity-html-${activityName}`
  const cacheTimestampKey = `activity-html-${activityName}-timestamp`
  const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

  // Check if already cached and valid
  try {
    const cachedHTML = localStorage.getItem(cacheKey)
    const cachedTimestamp = localStorage.getItem(cacheTimestampKey)

    if (cachedHTML && cachedTimestamp) {
      const cacheAge = Date.now() - parseInt(cachedTimestamp, 10)
      if (cacheAge < CACHE_DURATION) {
        // Already cached and valid, return immediately
        return cachedHTML
      } else {
        // Cache expired, remove it
        localStorage.removeItem(cacheKey)
        localStorage.removeItem(cacheTimestampKey)
      }
    }
  } catch (e) {
    // Continue to fetch if cache check fails
    console.warn("Cache read failed:", e)
  }

  // Check if a fetch is already in progress for this activity
  if (activityHTMLFetchCache.has(activityName)) {
    return activityHTMLFetchCache.get(activityName)!
  }

  // Create fetch promise
  let activityURL = "https://raw.githubusercontent.com/BIDMCDigitalPsychiatry/LAMP-activities/"
  activityURL += process.env.REACT_APP_GIT_SHA === "dev" ? "dist/out" : "latest/out"
  // activityURL += "dist/out"
  const fetchPromise = fetch(`${activityURL}/${activityName}.html.b64`)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch activity: ${response.status}`)
      }
      const base64Text = await response.text()
      const html = atob(base64Text)

      // Cache the result
      try {
        localStorage.setItem(cacheKey, html)
        localStorage.setItem(cacheTimestampKey, Date.now().toString())
      } catch (e) {
        // If localStorage is full, try to clear old cache entries
        console.warn("Cache write failed, clearing old entries:", e)
        try {
          // Clear expired cache entries
          Object.keys(localStorage).forEach((key) => {
            if (key.startsWith("activity-html-") && key.endsWith("-timestamp")) {
              const timestamp = parseInt(localStorage.getItem(key) || "0", 10)
              if (Date.now() - timestamp > CACHE_DURATION) {
                const activityKey = key.replace("-timestamp", "")
                localStorage.removeItem(activityKey)
                localStorage.removeItem(key)
              }
            }
          })
          // Retry caching
          localStorage.setItem(cacheKey, html)
          localStorage.setItem(cacheTimestampKey, Date.now().toString())
        } catch (e2) {
          console.warn("Could not cache activity HTML:", e2)
        }
      }

      return html
    })
    .finally(() => {
      // Remove from cache after fetch completes (success or failure)
      activityHTMLFetchCache.delete(activityName)
    })

  // Store the promise in cache
  activityHTMLFetchCache.set(activityName, fetchPromise)

  return fetchPromise
}

// Prefetch activity HTML to cache it before EmbeddedActivity needs it
// Now uses shared fetchActivityHTML function to prevent duplicate requests
const prefetchActivityHTML = async (activity: any): Promise<void> => {
  try {
    if (!activity || !activity.spec) return

    const activityName = demoActivities[activity.spec]
    if (!activityName) return

    // Use shared fetch function which handles caching and deduplication
    await fetchActivityHTML(activityName)
  } catch (e) {
    // Silently fail - EmbeddedActivity will handle the fetch
  }
}

// Prefetch all activities in a group for instant navigation
const prefetchAllGroupActivities = async (groupData: any) => {
  let activitiesList: string[] = []
  if (Array.isArray(groupData.settings)) {
    activitiesList = groupData.settings
  } else {
    activitiesList = groupData.settings?.activities || []
  }

  if (activitiesList.length === 0) return

  // Prefetch all activities in parallel (don't block UI)
  const prefetchPromises = activitiesList.map((actId: string) => {
    return getActivityWithDeduplication(actId)
      .then((activityData: any) => {
        if (!activityData || !activityData.spec) {
          return null
        }
        // Fetch image in parallel
        return Promise.all([Promise.resolve(activityData), getImage(actId, activityData.spec).catch(() => undefined)])
      })
      .then((result: any) => {
        if (result) {
          const [activityData, tag] = result
          // Cache each activity for instant loading
          const cacheKey = `activity_data_${actId}`
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

          // Also prefetch activity HTML if it's a demo activity
          const activityName = demoActivities[activityData.spec]
          if (activityName) {
            const htmlCacheKey = `activity-html-${activityName}`
            // Check if HTML is already cached
            try {
              const cachedHtml = localStorage.getItem(htmlCacheKey)
              if (!cachedHtml) {
                // Prefetch HTML in background (non-blocking)
                fetchActivityHTML(activityName).catch(() => {
                  // Silently fail, will load when needed
                })
              }
            } catch (e) {
              // Ignore
            }
          }
        }
        return result
      })
      .catch(() => {
        // Silently fail for individual activities - prefetch is optional
        return null
      })
  })

  // Don't wait for all to complete - let them run in background
  Promise.all(prefetchPromises).catch(() => {
    // Silently fail - prefetch is optional
  })
}

export default function NotificationPage({ participant, activityId, mode, tab, ...props }) {
  const classes = useStyles()
  const [activity, setActivity] = useState(null)
  const [id, setId] = useState(activityId)
  const [openComplete, setOpenComplete] = React.useState(false)
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()
  const [response, setResponse] = useState(false)
  const [streakActivity, setStreakActivity] = useState(null)
  const [openNotFound, setOpenNotFound] = useState(false)
  const [tag, setTag] = useState(null)
  const [visualPopup, setVisualPopup] = useState(null)
  const [staticData, setStaticData] = useState(0)
  const [activityTag, setActivityTag] = useState<any>(null)

  // Prefetch chunks immediately on mount to reduce loading delay
  useEffect(() => {
    // Prefetch commonly used chunks right away
    import("./EmbeddedActivity").catch(() => {})
    import("./Streak").catch(() => {})
    import("./GroupActivity").catch(() => {})
  }, [])

  useEffect(() => {
    if (!!activityId) {
      setId(activityId)
    }
  }, [activityId])

  useEffect(() => {
    // Fetch the activity, splice by tags, and prepare UI; handles not-found and session cases
    setLoading(true)
    setResponse(false)
    const sessionValue = sessionStorage.getItem("LAMP.Auth")
    ;(async () => {
      if (!!id && !!LAMP.Auth) {
        // Check cache first for instant loading
        const cacheKey = `activity_data_${id}`
        let cachedData = null
        let cachedTag = null
        let useCache = false

        try {
          const cached = sessionStorage.getItem(cacheKey)
          if (cached) {
            const parsed = JSON.parse(cached)
            const cacheAge = Date.now() - (parsed.timestamp || 0)
            // Use cache if less than 2 minutes old
            if (cacheAge < 2 * 60 * 1000 && parsed.data) {
              cachedData = parsed.data
              cachedTag = parsed.tag
              useCache = true
              // Show cached data immediately for instant UI
              setActivityTag(cachedTag)
              const processedData =
                cachedData.spec === "lamp.survey"
                  ? spliceActivity({ raw: cachedData, tag: cachedTag })
                  : spliceCTActivity({ raw: cachedData, tag: cachedTag })
              setActivity(processedData)
              setLoading(false) // Show UI immediately with cached data
            }
          }
        } catch (e) {
          // If cache read fails, continue with normal fetch
        }

        // Start prefetching chunks immediately (don't wait for API calls)
        const chunkPrefetchPromise = import("./EmbeddedActivity").catch(() => {})
        const groupPrefetchPromise = import("./GroupActivity").catch(() => {})
        const streakPrefetchPromise = import("./Streak").catch(() => {})
        Promise.all([chunkPrefetchPromise, groupPrefetchPromise, streakPrefetchPromise]).catch(() => {})

        // Fetch activity data and image in parallel (optimized)
        const activityPromise = getActivityWithDeduplication(id)

        // Start image fetch immediately (we'll get spec from activity data)
        // But also try common attachment names in parallel for faster loading
        const commonImagePromises = [
          getImage(id, "lamp.survey").catch(() => undefined),
          getImage(id, "lamp.dashboard.activity_details").catch(() => undefined),
        ]

        activityPromise
          .then((data: any) => {
            if (!data) {
              throw new Error("No activity data")
            }

            // Prefetch activity HTML immediately (don't wait)
            prefetchActivityHTML(data).catch(() => {})

            // Get the correct image based on spec
            const imagePromise = data.spec ? getImage(id, data.spec) : Promise.resolve(undefined)

            // Wait for image (use cached common images if available)
            return Promise.all([Promise.resolve(data), imagePromise])
          })
          .then(([data, tag]: [any, any]) => {
            if (!!data) {
              data.spec === "lamp.group" && localStorage.setItem("groupactivityid", id)

              // If this is an activity group, prefetch all activities immediately
              if (data.spec === "lamp.group") {
                prefetchAllGroupActivities(data)
              }

              // Only update if we didn't use cache, or if fresh data is different
              if (!useCache || cachedData?.id !== data.id) {
                // Cache the result for next time
                try {
                  sessionStorage.setItem(
                    cacheKey,
                    JSON.stringify({
                      data,
                      tag,
                      timestamp: Date.now(),
                    })
                  )
                } catch (e) {
                  // Ignore cache write errors
                }

                setActivityTag(tag)
                const processedData =
                  data.spec === "lamp.survey"
                    ? spliceActivity({ raw: data, tag })
                    : spliceCTActivity({ raw: data, tag })
                setActivity(processedData)
                setLoading(false)
              }
              // If we used cache, data is already set, just refresh in background silently
            } else {
              if (!sessionValue) {
                setOpenNotFound(false)
                window.location.href = "/#/"
              } else {
                setOpenNotFound(true)
                setLoading(false)
              }
            }
          })
          .catch((e) => {
            if (!LAMP.Auth) {
              window.location.href = "/#/"
            } else {
              setOpenNotFound(true)
              setLoading(false)
            }
          })
      }
    })()
  }, [id])

  const returnResult = () => {
    const lastActiveTab = localStorage.getItem("lastActiveTab")?.toLocaleLowerCase()
    if (mode === null) setResponse(true)
    else if (!!lastActiveTab) {
      window.location.href = `/#/participant/${participant}/${lastActiveTab}`
      localStorage.removeItem("lastActiveTab")
    } else if (tab === null || typeof tab === "undefined")
      window.location.href = `/#/participant/${participant}/assess `
    else if (!!tab) {
      window.location.href = `/#/participant/${participant}/${tab}`
    }
  }

  useEffect(() => {
    if (streak > 0) {
      setOpenComplete(true)
      setTimeout(() => {
        setOpenComplete(false)
        returnResult()
        setLoading(false)
      }, 5000)
    }
  }, [streak])

  const showStreak = (participant, activity) => {
    setLoading(true)
    setVisualPopup(null)
    // setStreakActivity(activityTag?.streak ?? null)
    setStreakActivity({ ...activityTag?.streak, activity })
    if (
      !!activityTag?.streak?.streak ||
      typeof activityTag?.streak === "undefined" ||
      !!activityTag?.streak?.streakType ||
      typeof activityTag?.streakType !== "undefined"
    ) {
      getEvents(participant, activity.id).then((streak) => {
        setStreak(streak)
      })
    } else {
      returnResult()
      setLoading(false)
    }
  }

  const showVisualPopup = (activity, data) => {
    const isactivityGroupSubmit = localStorage.getItem("fromGroupSurvey") === "true"
    if (!isactivityGroupSubmit) {
      getImage(activity?.id, activity?.spec)
        .then((tag) => {
          if (
            typeof tag?.visualSettings !== "undefined" &&
            tag?.visualSettings != null &&
            tag?.visualSettings?.image !== "" &&
            !!tag?.visualSettings?.checked
          ) {
            setVisualPopup(tag?.visualSettings)
          } else {
            if (
              !!tag?.streak?.streak ||
              typeof tag?.streak !== "undefined" ||
              !!tag?.streak?.streakType ||
              typeof tag?.streakType !== "undefined"
            ) {
              if (!!data?.response?.data?.streak) {
                setStreak(data?.response?.data?.streak)
              } else {
                returnResult()
              }
            } else {
              returnResult()
            }
          }
        })
        .catch(() => {
          // If attachment doesn't exist, just return result
          returnResult()
        })
    } else {
      returnResult()
    }
  }

  return (
    <div style={{ height: "100%" }}>
      {!!response && (
        <Box>
          <AppBar position="static" className={classes.inlineHeader}>
            <Toolbar className={classes.toolbardashboard}>
              <IconButton onClick={() => (window.location.href = "/#/")} color="default" aria-label="Menu">
                <Icon>arrow_back</Icon>
              </IconButton>
            </Toolbar>
          </AppBar>
          <Box textAlign="center" pb={4} className={classes.niceWork}>
            <Typography variant="h5" gutterBottom>
              {`${t("Success.")}` + "!"}
            </Typography>
            <Typography className={classes.ribbonText} component="p">
              {`${t("You have successfully completed your activity.")}`}
            </Typography>
            <Box textAlign="center" className={classes.niceWorkbadge}>
              <Icon>check_circle</Icon>
            </Box>
          </Box>
        </Box>
      )}
      {!response &&
        !loading &&
        (activity?.spec === "lamp.group" ? (
          <Suspense fallback={<div />}>
            <GroupActivity
              activity={activity}
              participant={participant}
              onComplete={(data) => {
                if (!!tag?.streak?.streak || typeof tag?.streak === "undefined") {
                  if (!!data?.response?.data?.streak) setStreak(data?.response?.data?.streak)
                  else returnResult()
                } else returnResult()
              }}
              noBack={false}
              tab={tab}
            />
          </Suspense>
        ) : (
          <Suspense fallback={<div />}>
            <EmbeddedActivity
              name={activity?.name}
              activity={activity}
              participant={participant}
              noBack={false}
              tab={tab}
              onComplete={(data) => {
                setStaticData(data?.static_data ?? {})
                if (data === null) {
                  if (mode === null) window.location.href = "/#/"
                  else history.back()
                } else if (data?.clickBack === true) {
                  if (!!data && !!data?.timestamp) {
                    showVisualPopup(activity, data)
                  } else {
                    if (mode === null) window.location.href = "/#/"
                    else history.back()
                  }
                } else if (!!data && !!data?.timestamp) {
                  showVisualPopup(activity, data)
                }
              }}
            />
          </Suspense>
        ))}
      <Suspense fallback={<div />}>
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
          activity={{ ...activity, ...streakActivity?.activity }}
        />
      </Suspense>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Dialog
        open={openNotFound}
        onClose={() => {
          setOpenNotFound(false)
          window.location.href = "/#/"
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>{t("Some error occured. This activity does not exist.")}</DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setLoading(false)
              setOpenNotFound(false)
              history.back()
            }}
            color="primary"
          >
            {`${t("Ok")}`}
          </Button>
        </DialogActions>
      </Dialog>
      <VisualPopup
        open={visualPopup?.checked ?? false}
        image={visualPopup?.image}
        data={staticData}
        showStreak={() => showStreak(participant, activity)}
      />
    </div>
  )
}
