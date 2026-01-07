// Core Imports
import React, { useState, useEffect, lazy, Suspense } from "react"
import {
  Box,
  useTheme,
  useMediaQuery,
  Slide,
  Backdrop,
  CircularProgress,
  makeStyles,
  Theme,
  createStyles,
} from "@material-ui/core"

import BottomMenu from "./BottomMenu"
import ResponsiveDialog from "./ResponsiveDialog"
import Welcome from "./Welcome"
import Feed from "./Feed"
import { Service } from "./DBService/DBService"
import { useTranslation } from "react-i18next"
import Streak from "./Streak"
import VisualPopup from "./VisualPopup"
import NoActivityPopup from "./NoActivityPopup"
import LAMP, {
  Participant as ParticipantObj,
  Activity as ActivityObj,
  ActivityEvent as ActivityEventObj,
  SensorEvent as SensorEventObj,
} from "lamp-core"
import locale_lang from "../locale_map.json"
import { lazyRetry } from "../helper/functions"

const Learn = lazy(lazyRetry(() => import("./Learn")))
const Survey = lazy(lazyRetry(() => import("./Survey")))
const Manage = lazy(lazyRetry(() => import("./Manage")))
const Prevent = lazy(lazyRetry(() => import("./Prevent")))

// Prefetch commonly used chunks in background for better performance
if (typeof window !== "undefined") {
  const prefetchCommonChunks = () => {
    if ("requestIdleCallback" in window) {
      requestIdleCallback(
        () => {
          // Prefetch chunks that are likely to be needed
          import(/* webpackChunkName: "Learn" */ "./Learn").catch(() => {})
          import(/* webpackChunkName: "Survey" */ "./Survey").catch(() => {})
        },
        { timeout: 3000 }
      )
    } else {
      setTimeout(() => {
        import(/* webpackChunkName: "Learn" */ "./Learn").catch(() => {})
        import(/* webpackChunkName: "Survey" */ "./Survey").catch(() => {})
      }, 2000)
    }
  }

  // Prefetch after initial render
  if (typeof requestAnimationFrame !== "undefined") {
    requestAnimationFrame(() => {
      setTimeout(prefetchCommonChunks, 1000)
    })
  } else {
    setTimeout(prefetchCommonChunks, 1000)
  }
}

export async function getImage(activityId: string, spec: string) {
  return [
    await LAMP.Type.getAttachment(
      activityId,
      spec === "lamp.survey" ? "lamp.dashboard.survey_description" : "lamp.dashboard.activity_details"
    ),
  ]?.map((y: any) => (!!y?.error ? undefined : y?.data))[0]
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    scroll: { overflowY: "hidden" },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
    MuiDialogPaperScrollPaper: {
      maxHeight: "100% !important",
    },
  })
)

function _patientMode() {
  return LAMP.Auth._type === "participant"
}

async function setShowWelcome(participant: ParticipantObj): Promise<void> {
  await LAMP.Type.setAttachment(participant.id, "me", "lamp.dashboard.welcome_dismissed", true)
}

async function addHiddenEvent(
  participant: ParticipantObj,
  timestamp: number,
  activityName: string
): Promise<string[] | undefined> {
  let _hidden = (await LAMP.Type.getAttachment(participant.id, "lamp.dashboard.hidden_events")) as any
  let _events = !!_hidden.error ? [] : _hidden.data
  if (_events.includes(`${timestamp}/${activityName}`)) return _events
  let new_events = [..._events, `${timestamp}/${activityName}`]
  let _setEvents = (await LAMP.Type.setAttachment(
    participant.id,
    "me",
    "lamp.dashboard.hidden_events",
    new_events
  )) as any
  if (!!_setEvents.error) return undefined
  return new_events
}

export async function getSelfHelpActivityEvents(activityId: string, from: number, to: number) {
  let result = []
  return await Service.getActivityEventData("activityEvents", activityId).then((res) => {
    if (res) {
      result = res
      if (from != null) {
        result = res?.filter((val) => val.timestamp >= from)
      }
      if (to != null) {
        result = res?.filter((val) => val?.timestamp <= to)
      }
    }
    return result.reverse()
  })
}

export async function getSelfHelpAllActivityEvents(from?: number, to?: number) {
  let result = []
  return await Service.getAllTags("activityEvents").then((res) => {
    if (res) {
      result = res
      if (from != null) {
        result = res?.filter((val) => val.timestamp >= from)
      }
      if (to != null) {
        result = res?.filter((val) => val?.timestamp <= to)
      }
    }
    return result
  })
}

export async function getEvents(participant: any, activityId: string) {
  let from = new Date()
  from.setMonth(from.getMonth() - 6)
  let activityEvents =
    LAMP.Auth._auth.id === "selfHelp@demo.lamp.digital"
      ? await getSelfHelpActivityEvents(activityId, from.getTime(), new Date().getTime())
      : await LAMP.ActivityEvent.allByParticipant(
          participant?.id ?? participant,
          activityId,
          from.getTime(),
          new Date().getTime(),
          null,
          true
        )
  let dates = []
  let streak = 0
  activityEvents?.map((activityEvent, i) => {
    let date = new Date(activityEvent.timestamp)
    if (!dates.includes(date.toLocaleDateString())) {
      dates.push(date.toLocaleDateString())
    }
  })
  let currentDate = new Date()
  for (let date of dates) {
    if (date === currentDate.toLocaleDateString()) {
      streak++
    } else {
      break
    }
    currentDate.setDate(currentDate.getDate() - 1)
  }
  return streak > 0 ? streak : 1
}

export const games = [
  "lamp.jewels_a",
  "lamp.jewels_b",
  "lamp.spatial_span",
  "lamp.cats_and_dogs",
  "lamp.pop_the_bubbles",
  "lamp.balloon_risk",
  "lamp.spin_wheel",
  "lamp.maze_game",
  "lamp.emotion_recognition",
  "lamp.symbol_digit_substitution",
  "lamp.gyroscope",
  "lamp.dcog",
  "lamp.funny_memory",
  "lamp.trails_b",
  "lamp.voice_survey",
  "lamp.fragmented_letters",
  "lamp.digit_span",
  "lamp.memory_game",
]

export default function Participant({
  participant,
  ...props
}: {
  participant: ParticipantObj
  activeTab: Function
  tabValue: string
  surveyDone: boolean
  submitSurvey: Function
  setShowDemoMessage: Function
}) {
  const [activities, setActivities] = useState(null)
  const [visibleActivities, setVisibleActivities] = useState([])
  const [streakActivity, setStreakActivity] = useState(null)
  const getTab = () => {
    return props.tabValue
  }

  const [tab, _setTab] = useState(getTab())
  const supportsSidebar = useMediaQuery(useTheme().breakpoints.up("md"))
  const [openDialog, setOpen] = useState(false)
  const [hideCareTeam, setHideCareTeam] = useState(_hideCareTeam())
  const [hiddenEvents, setHiddenEvents] = React.useState([])
  const classes = useStyles()
  const [loading, setLoading] = useState(true)
  const [openComplete, setOpenComplete] = React.useState(false)
  const [streak, setStreak] = useState(1)
  const [visualPopup, setVisualPopup] = useState(null)
  const [currentActivity, setCurrentActivity] = useState(null)
  const { t, i18n } = useTranslation()
  const [allactivities, setAllActivities] = useState(null)
  const [emptyLearnTab, setEmptyLearnTab] = useState(false)
  const [emptyAssessTab, setEmptyAssessTab] = useState(false)
  const [emptyManageTab, setEmptyManageTab] = useState(false)
  const [emptyPortalTab, setEmptyPortalTab] = useState(false)
  const [allEmpty, setAllEmpty] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [allActivitiesLoaded, setAllActivitiesLoaded] = useState(false)
  // Cache key for activities to avoid refetching on remount
  const activitiesCacheKey = `activities_cache_${participant?.id}`
  const tabDirection = (currentTab) => {
    return supportsSidebar ? "up" : "left"
  }

  const getSelectedLanguage = () => {
    const matched_codes = Object.keys(locale_lang)?.filter((code) => code.startsWith(navigator.language))
    const lang = matched_codes?.length > 0 ? matched_codes[0] : "en-US"
    return i18n.language ? i18n.language : lang ? lang : "en-US"
  }

  function _hideCareTeam() {
    return (LAMP.Auth._auth.serverAddress || "").includes(".psych.digital")
  }

  async function tempHideCareTeam(participant: ParticipantObj): Promise<boolean> {
    if (_hideCareTeam()) return true
  }

  useEffect(() => {
    // Clear cache if participant changed
    const previousCacheKey = sessionStorage.getItem("current_participant_cache_key")
    if (previousCacheKey && previousCacheKey !== activitiesCacheKey) {
      try {
        sessionStorage.removeItem(previousCacheKey)
      } catch (e) {
        // Ignore cache clear errors
      }
    }
    sessionStorage.setItem("current_participant_cache_key", activitiesCacheKey)

    if (allEmpty) {
      _setTab("feed")
      localStorage.setItem("lastActiveTab", "Home")
    }

    if (!!LAMP.Auth) {
      loadData()
      LAMP.Type.getAttachment(participant?.id, "lamp.dashboard.favorite_activities")
        .then((y: any) => {
          const fav = !!y?.error ? [] : y?.data ?? []
          const cleanTag = fav.filter(Boolean)
          localStorage.setItem("favoritesId", JSON.stringify(cleanTag))
        })
        .catch((err) => {
          console.error("Failed to load favorites:", err)
        })
    } else {
      window.location.href = "/#/"
    }
    let language = !!localStorage.getItem("LAMP_user_" + participant.id)
      ? JSON.parse(localStorage.getItem("LAMP_user_" + participant.id)).language
      : getSelectedLanguage()
      ? getSelectedLanguage()
      : "en-US"
    i18n.changeLanguage(language)
    // getHiddenEvents(participant).then(setHiddenEvents)
    tempHideCareTeam(participant).then(setHideCareTeam)
  }, [])

  const loadData = async () => {
    // Check if we already have activities data (from cache or previous load)
    if (allactivities && allactivities.length > 0) {
      setLoading(false)
      setAllActivitiesLoaded(true)
      if (tab !== undefined && tab !== null) {
        setActivities(allactivities)
      }
      return
    }

    // Check sessionStorage cache to avoid refetching on remount
    // This is CRITICAL for instant loading when exiting activities/groups
    try {
      const cachedData = sessionStorage.getItem(activitiesCacheKey)
      if (cachedData) {
        const parsed = JSON.parse(cachedData)
        const cacheTimestamp = parsed.timestamp || 0
        const cacheAge = Date.now() - cacheTimestamp
        // Use cache if less than 5 minutes old
        if (
          cacheAge < 5 * 60 * 1000 &&
          parsed.activities &&
          Array.isArray(parsed.activities) &&
          parsed.activities.length > 0
        ) {
          // Set data IMMEDIATELY - don't wait for anything
          setAllActivities(parsed.activities)
          setAllActivitiesLoaded(true)
          setLoading(false) // Hide loading backdrop immediately
          if (tab !== undefined && tab !== null) {
            setActivities(parsed.activities)
          }
          setLoaded(true)
          // Return early - data is shown, fresh data will load in background if needed
          return
        } else {
          // Cache expired, remove it
          sessionStorage.removeItem(activitiesCacheKey)
        }
      }
    } catch (e) {
      // If cache read fails, continue with normal fetch
      console.warn("Failed to read activities cache:", e)
      try {
        sessionStorage.removeItem(activitiesCacheKey)
      } catch (e2) {
        // Ignore removal errors
      }
    }

    if (!loaded) {
      setLoaded(true)
      const batchSize = 50

      try {
        // First, fetch the first batch to get the total count
        const firstBatchResponse: any = await (LAMP.Activity.allByParticipant as any)(
          participant.id,
          null,
          true,
          batchSize,
          0
        )
        if (!firstBatchResponse) {
          setLoading(false)
          return
        }

        // Extract data and total from response, handling different structures
        // LAMP.Activity.allByParticipant returns { data: Activity[], total: number }
        let firstBatchData: any[] = []
        let total = 0

        if (firstBatchResponse && firstBatchResponse.data && Array.isArray(firstBatchResponse.data)) {
          // Standard format: { data: Activity[], total: number }
          firstBatchData = firstBatchResponse.data
          total = typeof firstBatchResponse?.total === "number" ? firstBatchResponse?.total : firstBatchData.length
        } else if (Array.isArray(firstBatchResponse)) {
          // Fallback: if result is directly an array
          firstBatchData = firstBatchResponse
          total = firstBatchResponse.length
        } else {
          console.error("Unexpected response structure:", firstBatchResponse)
          setLoading(false)
          return
        }

        if (firstBatchData.length === 0) {
          setLoading(false)
          return
        }
        // Set loading to false immediately after first batch arrives
        setLoading(false)

        // Update state with first batch immediately
        setAllActivities(firstBatchData)
        if (tab !== undefined || tab !== null) {
          setActivities(firstBatchData)
        }
        const totalBatches = Math.ceil(total / batchSize)
        // If there's only one batch, we're done
        if (totalBatches <= 1) {
          setAllActivitiesLoaded(true)
          return
        }

        // Create array of promises for remaining batches (batch 2 onwards)
        const remainingBatches = Array.from({ length: totalBatches - 1 }, (_, i) => {
          const offset = (i + 1) * batchSize
          return (LAMP.Activity.allByParticipant as any)(participant.id, null, true, batchSize, offset).catch(
            (error: any) => {
              console.error(`Error fetching batch ${i + 2} (offset ${offset}):`, error)
              return null // Return null on error to prevent Promise.all from failing
            }
          )
        })
        // Fetch all remaining batches in parallel
        const remainingResults: any[] = await Promise.all(remainingBatches)

        // Combine first batch with remaining batches
        // Ensure we extract data arrays from each result safely
        const remainingActivities = remainingResults.flatMap((result: any, index: number) => {
          if (!result) {
            console.warn(`Batch ${index + 2} returned null or undefined`)
            return []
          }

          // Handle { data: Activity[], total: number } structure (from LAMP-js)
          if (result && result.data && Array.isArray(result.data)) {
            return result.data
          }
          // Handle wrapped structure (legacy)
          if (result && result.data && result.data.data && Array.isArray(result.data.data)) {
            return result.data.data
          }
          // Fallback: if result is already an array
          if (Array.isArray(result)) {
            return result
          }
          console.warn(`Batch ${index + 2} has unexpected structure:`, result)
          return []
        })
        const allActivitiesData = [...firstBatchData, ...remainingActivities]

        // Remove duplicates based on activity id
        const uniqueActivitiesMap = new Map<string, any>()
        allActivitiesData.forEach((activity: any) => {
          if (activity && activity.id) {
            // Keep the first occurrence of each activity
            if (!uniqueActivitiesMap.has(activity.id)) {
              uniqueActivitiesMap.set(activity.id, activity)
            }
          }
        })
        const uniqueActivitiesData = Array.from(uniqueActivitiesMap.values())

        setAllActivities(uniqueActivitiesData)
        setAllActivitiesLoaded(true)

        // Cache activities in sessionStorage to avoid refetching on remount
        try {
          sessionStorage.setItem(
            activitiesCacheKey,
            JSON.stringify({
              activities: uniqueActivitiesData,
              timestamp: Date.now(),
            })
          )
        } catch (e) {
          // If cache write fails, continue normally
          console.warn("Failed to cache activities:", e)
        }

        if (tab !== undefined || tab !== null) {
          setActivities(uniqueActivitiesData)
        }
      } catch (error) {
        console.error("Error loading activities:", error)
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    props.activeTab(tab, participant.id)
    if (!allActivitiesLoaded) return
    const loadActivityTags = async () => {
      try {
        // Check existing tags and identify which activities need tags
        const existingTags = await Service.getAllTags("activitytags")
        const existingTagIds = new Set(
          Array.isArray(existingTags) && existingTags?.length > 0
            ? existingTags?.map((tag: any) => tag.id)?.filter(Boolean)
            : []
        )

        // Filter out activities that already have tags
        const activitiesNeedingTags = allactivities?.filter(
          (activity) => activity.id && !existingTagIds.has(activity.id)
        )

        // Early exit if all activities already have tags
        if (activitiesNeedingTags?.length === 0) {
          setLoading(false)
          return
        }

        const batchSize = 30
        const total = activitiesNeedingTags?.length
        const totalBatches = Math.ceil(total / batchSize)

        // Process batches in parallel (with concurrency limit to avoid overwhelming the API)
        const maxConcurrentBatches = 3
        const batchPromises: Promise<void>[] = []

        for (let i = 0; i < totalBatches; i++) {
          const start = i * batchSize
          const end = Math.min(start + batchSize, total)
          const batch = activitiesNeedingTags?.slice(start, end)

          // Create batch processing function
          const processBatch = async () => {
            try {
              // Process all activities in batch in parallel
              const batchData = await Promise.all(
                batch?.map(async (activity) => {
                  try {
                    const img = await getImage(activity.id, activity.spec)
                    return {
                      id: activity.id,
                      category: activity.category,
                      showFeed: img?.showFeed ?? true,
                      spec: activity.spec,
                      description: img?.description ?? "",
                      photo: img?.photo ?? null,
                      streak: img?.streak ?? null,
                      questions: img?.questions ?? null,
                      visualSettings: img?.visualSettings ?? null,
                      branchingSettings: img?.branchingSettings ?? null,
                    }
                  } catch (error) {
                    console.error(`Error fetching image for activity ${activity.id}:`, error)
                    // Return minimal data even if image fetch fails
                    return {
                      id: activity.id,
                      category: activity.category,
                      showFeed: true,
                      spec: activity.spec,
                      description: "",
                      photo: null,
                      streak: null,
                      questions: null,
                      visualSettings: null,
                      branchingSettings: null,
                    }
                  }
                })
              )

              // Save this batch incrementally
              await Service.addUserData("activitytags", batchData, true)
              window.dispatchEvent(new Event("activityTagsUpdated"))
            } catch (error) {
              console.error(`Error processing batch ${i + 1}:`, error)
              // Continue processing other batches even if one fails
            }
          }

          batchPromises.push(processBatch())

          // Limit concurrent batches to avoid overwhelming the API
          if (batchPromises?.length >= maxConcurrentBatches || i === totalBatches - 1) {
            await Promise.all(batchPromises)
            batchPromises.length = 0 // Clear array for next batch group
          }
        }

        // Wait for any remaining batches
        if (batchPromises?.length > 0) {
          await Promise.all(batchPromises)
        }

        setLoading(false)
      } catch (error) {
        console.error("Error creating activity tags:", error)
        setLoading(false)
      }
    }

    loadActivityTags()
  }, [allActivitiesLoaded])

  const activeTab = (newTab) => {
    props.activeTab(newTab, participant.id)
    _setTab(newTab)
    setVisibleActivities([])
  }

  const hideEvent = async (timestamp?: number, activity?: string) => {
    if (timestamp === undefined && activity === undefined) {
      setHiddenEvents(hiddenEvents) // trigger a reload for dependent components only
      return
    }
    let result = await addHiddenEvent(participant, timestamp, activity)
    if (!!result) {
      setHiddenEvents(result)
    }
  }

  const showVisualPopup = (activity) => {
    Service.getUserDataByKey("activitytags", [activity?.id], "id").then((tags) => {
      const tag = tags[0]
      if (typeof tag?.visualSettings === "undefined" || !!tag?.visualSettings) {
        setVisualPopup(tag?.visualSettings)
        setCurrentActivity(activity)
      } else {
        showStreak(participant, activity)
      }
    })
  }

  const showStreak = (participant, activity) => {
    setVisualPopup(null)
    Service.getUserDataByKey("activitytags", [activity?.id], "id").then((tags) => {
      const tag = tags[0]
      setStreakActivity(tag?.streak ?? null)
      if (!!tag?.streak?.streak || typeof tag?.streak === "undefined") {
        getEvents(participant, activity.id).then((streak) => {
          setStreak(streak)
          setOpenComplete(true)
          setLoading(false)
        })
      } else {
        setLoading(false)
      }
    })
  }

  const closePopup = () => {
    setAllEmpty(false)
    setLoading(true)

    if (activities !== null) {
      _setTab("feed")
      setLoading(false)
    }
  }

  return (
    <React.Fragment>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {allEmpty ? (
        <NoActivityPopup
          onClose={closePopup}
          open={allEmpty}
          confirmAction={null}
          confirmationMsg={t("Your administrator has not added any mindLAMP activities for you.")}
        />
      ) : (
        <>
          {activities !== null && !loading && (
            <Box>
              <Slide in={tab === "learn"} direction={tabDirection(0)} mountOnEnter unmountOnExit>
                <Box mt={1} mb={4}>
                  <Suspense fallback={<div />}>
                    <Learn
                      participant={participant}
                      activities={activities}
                      activeTab={activeTab}
                      showStreak={showVisualPopup}
                    />
                  </Suspense>
                </Box>
              </Slide>
              <Slide in={tab === "assess"} direction={tabDirection(1)} mountOnEnter unmountOnExit>
                <Box mt={1} mb={4}>
                  <Suspense fallback={<div />}>
                    <Survey participant={participant} activities={activities} showStreak={showVisualPopup} />
                  </Suspense>
                </Box>
              </Slide>
              <Slide in={tab === "manage"} direction={tabDirection(2)} mountOnEnter unmountOnExit>
                <Box mt={1} mb={4}>
                  <Suspense fallback={<div />}>
                    <Manage
                      participant={participant}
                      activities={activities}
                      activeTab={activeTab}
                      showStreak={showVisualPopup}
                    />
                  </Suspense>
                </Box>
              </Slide>
              <Slide in={tab === "portal"} direction={tabDirection(3)} mountOnEnter unmountOnExit>
                <Box mt={1} mb={4}>
                  <Suspense fallback={<div />}>
                    <Prevent
                      participant={participant}
                      activeTab={activeTab}
                      allActivities={activities}
                      hiddenEvents={hiddenEvents}
                      enableEditMode={!_patientMode()}
                      showStreak={showVisualPopup}
                      activitySubmitted={openComplete}
                      onEditAction={(activity, data) => {
                        setVisibleActivities([
                          {
                            ...activity,
                            prefillData: [
                              data?.slice?.map(({ item, value }) => ({
                                item,
                                value,
                              })),
                            ],
                            prefillTimestamp: new Date(
                              data.x
                            ).getTime() /* post-increment later to avoid double-reporting events! */,
                          },
                        ])
                      }}
                      onCopyAction={(activity, data) => {
                        setVisibleActivities([
                          {
                            ...activity,
                            prefillData: [
                              data?.slice?.map(({ item, value }) => ({
                                item,
                                value,
                              })),
                            ],
                          },
                        ])
                      }}
                      onDeleteAction={(activity, data) => hideEvent(new Date(data.x).getTime(), activity.id)}
                    />
                  </Suspense>
                </Box>
              </Slide>
              <Slide in={tab === "feed"} direction={tabDirection(3)} mountOnEnter unmountOnExit>
                <Box mt={1} mb={4}>
                  <Feed
                    participant={participant}
                    activeTab={activeTab}
                    activities={activities}
                    visibleActivities={visibleActivities}
                    setVisibleActivities={setVisibleActivities}
                    showStreak={showVisualPopup}
                  />
                </Box>
              </Slide>
              <BottomMenu
                activeTab={activeTab}
                tabValue={tab}
                participant={participant}
                showWelcome={openDialog}
                setShowDemoMessage={(val) => props.setShowDemoMessage(val)}
                emptyLearnTab={emptyLearnTab}
                emptyAssessTab={emptyAssessTab}
                emptyManageTab={emptyManageTab}
                emptyPortalTab={emptyPortalTab}
              />
              <ResponsiveDialog open={!!openDialog} transient animate fullScreen>
                <Welcome
                  activities={activities}
                  onClose={() => {
                    setOpen(false)
                    setShowWelcome(participant)
                  }}
                />
              </ResponsiveDialog>
            </Box>
          )}
        </>
      )}
      <Streak
        open={openComplete}
        onClose={() => {
          setOpenComplete(false)
        }}
        activity={streakActivity}
        streak={streak}
      />

      {/* <ConfirmationDialog
        onClose={() => setConfirm(false)}
        open={confirm}
        confirmAction={loadData}
        confirmationMsg={t("Would you like to resume this activity where you left off?")}
      /> */}
      {!!visualPopup?.checked && (
        <VisualPopup
          open={visualPopup?.checked ?? false}
          image={visualPopup?.image}
          showStreak={() => showStreak(participant, currentActivity)}
        />
      )}
    </React.Fragment>
  )
}
