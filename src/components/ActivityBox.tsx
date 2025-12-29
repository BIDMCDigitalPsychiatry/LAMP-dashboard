// Core Imports
import React, { useEffect, useRef, useState } from "react"
import {
  Typography,
  Grid,
  Icon,
  Card,
  Box,
  ButtonBase,
  makeStyles,
  Theme,
  createStyles,
  Tab,
  Backdrop,
  CircularProgress,
} from "@material-ui/core"
import LAMP from "lamp-core"
import BreatheIcon from "../icons/Breathe.svg"
import JournalIcon from "../icons/Goal.svg"
import InfoIcon from "../icons/Info.svg"
import ScratchCard from "../icons/ScratchCard.svg"
import { useTranslation } from "react-i18next"
import ActivityPopup from "./ActivityPopup"
import ReactMarkdown from "react-markdown"
import emoji from "remark-emoji"
import gfm from "remark-gfm"
import { LinkRenderer } from "./ActivityPopup"
import { getSelfHelpActivityEvents } from "./Participant"

export const clearActivityCache = () => {
  try {
    // Clear sessionStorage caches
    const sessionKeysToRemove: string[] = []
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i)
      if (
        key &&
        (key.startsWith("activitybox_cache_") ||
          key.startsWith("activities_cache_") ||
          key.startsWith("activity_data_"))
      ) {
        sessionKeysToRemove.push(key)
      }
    }
    sessionKeysToRemove.forEach((key) => sessionStorage.removeItem(key))

    // Clear localStorage caches for activity data
    const localStorageKeysToRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && (key.startsWith("activity-view-") || key.startsWith("activity-attachment-"))) {
        localStorageKeysToRemove.push(key)
      }
    }
    localStorageKeysToRemove.forEach((key) => localStorage.removeItem(key))

    const totalCleared = sessionKeysToRemove.length + localStorageKeysToRemove.length
    if (totalCleared > 0) {
      console.log(
        `Cleared activity cache: ${sessionKeysToRemove.length} sessionStorage entries, ${localStorageKeysToRemove.length} localStorage entries`
      )
    }
  } catch (e) {
    console.warn("Failed to clear activity cache:", e)
  }
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cardlabel: {
      fontSize: 14,
      padding: "0 18px",
      bottom: 15,
      position: "absolute",
      width: "100%",
      height: "63px",
      overflow: "auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      [theme.breakpoints.down("sm")]: {
        fontSize: 13,
        padding: "0 5px",
        "& p": { marginBottom: "0", lineHeight: "16px" },
      },
      "& p": { margin: "0" },
    },
    scratch: {
      "& h2": {
        textAlign: "center !important",
      },
      "& h6": {
        textAlign: "center !important",
      },
    },
    dialogtitle: { padding: 0 },
    manage: {
      padding: "10px 0",
      minHeight: 180,
      textAlign: "center",
      boxShadow: "none",
      borderRadius: 18,
      position: "relative",
      width: "100%",
      "& svg": {
        [theme.breakpoints.up("lg")]: {
          width: 150,
          height: 150,
        },
      },

      [theme.breakpoints.up("lg")]: {
        minHeight: 240,
      },
    },
    mainIcons: {
      width: 80,
      height: 80,
      [theme.breakpoints.up("lg")]: {
        width: 130,
        height: 130,
      },
      [theme.breakpoints.down("sm")]: {
        width: 75,
        height: 75,
      },
    },
    thumbMain: {
      maxWidth: 255,
      position: "relative",
    },
    favstar: {
      position: "absolute",
      top: 24,
      left: 24,
      zIndex: 1,
      color: "#f9d801",
    },
    fullwidthBtn: { width: "100%" },
    blankMsg: {
      marginBottom: "15px",
      marginTop: "5px",
      "& path": { fill: "#666" },
      "& p": { margin: "2px 5px" },
    },
    assessH: {
      background: "#E7F8F2 !important",
    },
    learnH: {
      background: "#FFF9E5 !important",
    },
    manageH: {
      background: "#FFEFEC !important",
    },
    preventH: {
      background: "#ECF4FF !important",
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
    tabPanelMain: {
      paddingLeft: 0,
      paddingRight: 0,
    },
    tabHeader: {
      "& button": {
        fontSize: 15,
        fontWeight: 600,
        minWidth: "auto",
        padding: 0,
        margin: "0 30px",
        "&:first-child": {
          marginLeft: 0,
        },
        "&.Mui-selected": {
          color: "#7599FF",
        },
        [theme.breakpoints.down("xs")]: {
          fontSize: 14,
          margin: "0 12px",
        },
      },
      "& .MuiTabs-indicator": {
        backgroundColor: "#7599FF",
      },
    },
  })
)

export const getActivityEvents = async (participant: any, activityId, moduleStartTime?) => {
  let from: Date
  if (moduleStartTime) {
    from = new Date(moduleStartTime)
  } else {
    from = new Date()
    from.setMonth(from.getMonth() - 6)
  }
  let activityEvents =
    LAMP.Auth._auth.id === "selfHelp@demo.lamp.digital"
      ? await getSelfHelpActivityEvents(activityId, from.getTime(), new Date().getTime())
      : await LAMP.ActivityEvent.allByParticipant(
          participant?.id ?? participant,
          activityId,
          from?.getTime(),
          new Date().getTime(),
          null,
          true
        )
  return activityEvents
}

export const sortModulesByCompletion = (modules) => {
  if (!Array.isArray(modules)) return []
  return modules
    ?.map((module) => {
      const processedSubActivities = Array.isArray(module?.subActivities)
        ? sortModulesByCompletion(module?.subActivities)
        : []
      return {
        ...module,
        subActivities: module?.sequentialOrdering
          ? module?.subActivities // keep original order if sequentialOrdering is true
          : processedSubActivities?.sort((a, b) => (a.isCompleted ? 1 : 0) - (b.isCompleted ? 1 : 0)),
      }
    })
    ?.sort((a, b) => (a.isCompleted ? 1 : 0) - (b.isCompleted ? 1 : 0))
}

const checkIsBegin = async (module, participant) => {
  const activityEvents = await getActivityEvents(participant, module.id, module.startTime)
  return activityEvents?.length === 0
}

export const addActivityEventForModule = async (module, participant) => {
  if ((await checkIsBegin(module, participant)) === true) {
    LAMP.ActivityEvent.create(participant.id ?? participant, {
      timestamp: new Date().getTime(),
      duration: 0,
      activity: module.id,
      static_data: {},
    }).then((a) => {
      return new Date()
    })
  }
}

export default function ActivityBox({ type, savedActivities, tag, participant, showStreak, ...props }) {
  const classes = useStyles()
  const [activity, setActivity] = useState(null)
  const [open, setOpen] = useState(false)
  const [questionCount, setQuestionCount] = React.useState(0)
  const [message, setMessage] = useState("")
  // Helper function to get cache key (must be defined before getInitialState)
  const getCacheKey = (participantId: string, tabType: string) => {
    return `activitybox_cache_${participantId}_${tabType.toLowerCase()}`
  }

  // Helper function to check if we have valid data (must be defined before getInitialState)
  const hasValidData = (data?: any) => {
    const checkData = data
    return (
      checkData &&
      typeof checkData === "object" &&
      Object.keys(checkData).length > 0 &&
      (checkData?.modules?.length > 0 || checkData?.otherActivities?.length > 0)
    )
  }

  // Initialize state - check cache immediately on mount to prevent blank screens
  // This is CRITICAL because components unmount/remount when switching tabs (unmountOnExit)
  // Also critical when exiting activities/groups - cache ensures instant loading
  const getInitialState = () => {
    if (!participant?.id) {
      return { activitiesList: {}, favorites: [], hasCache: false }
    }
    const tab = type.toLowerCase() === "portal" ? "prevent" : String(type || "").toLowerCase()
    const cacheKey = getCacheKey(participant.id, tab)
    try {
      const cachedData = sessionStorage.getItem(cacheKey)
      if (cachedData) {
        const parsed = JSON.parse(cachedData)
        const cacheTimestamp = parsed.timestamp || 0
        const cacheAge = Date.now() - cacheTimestamp
        if (cacheAge < 5 * 60 * 1000 && hasValidData(parsed.data)) {
          return {
            activitiesList: parsed.data,
            favorites: parsed.favorites || [],
            hasCache: true,
          }
        }
      }
    } catch (e) {
      // Ignore cache errors on initial load
    }
    return { activitiesList: {}, favorites: [], hasCache: false }
  }

  const initialState = getInitialState()
  const [activitiesList, setActivityList] = useState<any>(initialState.activitiesList)
  const [loadingModules, setLoadingModules] = useState(true)
  const fetchedKeyRef = useRef<string | null>(null)
  const fetchingRef = useRef<boolean>(false)

  const { t } = useTranslation()
  const handleClickOpen = (y: any, isAuto = false) => {
    let totalQuestions = 0
    LAMP.Activity.view(y.id).then(async (data) => {
      if (y.spec === "lamp.survey") totalQuestions = data.settings?.filter((q) => q.type !== "matrix")?.length

      setActivity(data)
      setOpen(true)
      y.spec === "lamp.dbt_diary_card"
        ? setQuestionCount(7)
        : y.spec === "lamp.survey"
        ? setQuestionCount(totalQuestions ?? 0)
        : setQuestionCount(0)
    })
  }

  // Non-demo: fetch at most once per participant+type key with pagination
  useEffect(() => {
    if (!participant?.id) return
    if (LAMP.Auth?._auth?.serverAddress === "demo.lamp.digital") return

    const key = `${participant.id}|${String(type || "").toLowerCase()}`
    const tab = type.toLowerCase() === "portal" ? "prevent" : String(type || "").toLowerCase()
    const cacheKey = getCacheKey(participant.id, tab)

    // CRITICAL: Check sessionStorage cache FIRST and set state IMMEDIATELY
    // This must happen synchronously before any async operations to prevent blank screens
    let cacheUsed = false
    let cachedDataToUse = null
    try {
      const cachedData = sessionStorage.getItem(cacheKey)
      if (cachedData) {
        const parsed = JSON.parse(cachedData)
        const cacheTimestamp = parsed.timestamp || 0
        const cacheAge = Date.now() - cacheTimestamp
        // Use cache if less than 5 minutes old and has valid data
        if (cacheAge < 5 * 60 * 1000 && hasValidData(parsed.data)) {
          cachedDataToUse = parsed.data
          // Set state IMMEDIATELY from cache - don't wait for anything
          setActivityList(parsed.data)
          setLoadingModules(false)
          fetchedKeyRef.current = key
          cacheUsed = true
        } else {
          // Cache expired, remove it
          sessionStorage.removeItem(cacheKey)
        }
      }
    } catch (e) {
      // If cache read fails, continue with normal fetch
      console.warn("Failed to read ActivityBox cache:", e)
      try {
        sessionStorage.removeItem(cacheKey)
      } catch (e2) {
        // Ignore removal errors
      }
    }

    // Check if we already have valid data in state for THIS key
    // Important: Only check hasData if the key matches (don't use data from different tab)
    const hasData = fetchedKeyRef.current === key && hasValidData()

    // If cache was used, fetch fresh data in background and return early
    if (cacheUsed && cachedDataToUse) {
      // Background refresh - fetch fresh data without blocking UI
      ;(async () => {
        try {
          const tab = type.toLowerCase() === "portal" ? "prevent" : String(type || "").toLowerCase()
          const batchSize = 50

          const firstBatchResponse: any = await (async () => {
            const response = await (LAMP.Activity.listActivities as any)(participant.id, tab, null, batchSize, 0)
            if (!response || response.error || !response.data) {
              return null
            }
            return response
          })()

          if (!firstBatchResponse) return

          const firstBatchData = firstBatchResponse.data ?? {}
          const total = firstBatchResponse.total || 0

          // If only one batch, cache it and update state
          if (total <= batchSize) {
            try {
              sessionStorage.setItem(
                cacheKey,
                JSON.stringify({
                  data: firstBatchData,
                  favorites: firstBatchData?.favouriteActivities ?? [],
                  timestamp: Date.now(),
                })
              )
              setActivityList(firstBatchData)
            } catch (e) {
              // Ignore cache errors
            }
            return
          }

          // Fetch remaining batches
          const remainingBatchPromises = Array.from({ length: Math.ceil(total / batchSize) - 1 }, (_, i) =>
            (LAMP.Activity.listActivities as any)(participant.id, tab, null, batchSize, (i + 1) * batchSize)
          )

          const remainingResults: any[] = await Promise.all(remainingBatchPromises)

          // Merge and dedupe
          const merged = remainingResults.reduce(
            (acc, curr) => {
              const d = curr?.data || {}
              return {
                modules: [...(acc.modules || []), ...(d.modules || [])],
                favouriteActivities: [...(acc.favouriteActivities || []), ...(d.favouriteActivities || [])],
                otherActivities: [...(acc.otherActivities || []), ...(d.otherActivities || [])],
              }
            },
            { ...firstBatchData }
          )

          const dedupe = (arr: any[] = []) => {
            const map = new Map()
            arr.forEach((a) => {
              if (a?.id && !map.has(a.id)) map.set(a.id, a)
            })
            return Array.from(map.values())
          }

          const deduped = {
            modules: dedupe(merged.modules),
            favouriteActivities: dedupe(merged.favouriteActivities),
            otherActivities: dedupe(merged.otherActivities),
          }

          // Update cache and state with fresh data
          try {
            sessionStorage.setItem(
              cacheKey,
              JSON.stringify({
                data: deduped,
                favorites: deduped.favouriteActivities ?? [],
                timestamp: Date.now(),
              })
            )
            setActivityList(deduped)
          } catch (e) {
            // Ignore cache errors
          }
        } catch (err) {
          // Silently fail - cached data is already shown
          console.warn("Background refresh failed:", err)
        }
      })()
      return // Exit early - cached data is already shown
    }

    // If we're already fetching the same key, skip (prevent duplicate calls during same mount)
    if (fetchedKeyRef.current === key && fetchingRef.current) return

    // If we already fetched this key AND have valid data, skip
    if (fetchedKeyRef.current === key && hasData) return

    // If cache was used, fetch fresh data in background without blocking UI
    // This ensures data is up-to-date while showing cached data immediately
    if (cacheUsed) {
      return // Exit early - cached data is already shown, background refresh will happen
    }
    // If no cache and no data, show loading indicator immediately
    // This ensures users see feedback when data is being fetched from API
    if (!cacheUsed && !hasData) {
      setLoadingModules(true)
    }

    // If key changed (switching tabs), reset and fetch
    if (fetchedKeyRef.current !== null && fetchedKeyRef.current !== key) {
      fetchingRef.current = false
      // Only clear activitiesList if we don't have cache for the new tab
      // This prevents showing wrong data when switching tabs
      if (!cacheUsed) {
        setActivityList({})
        setLoadingModules(true)
      }
    }

    // If we previously fetched this key but lost data, reset and refetch
    if (fetchedKeyRef.current === key && !hasData) {
      fetchingRef.current = false
      fetchedKeyRef.current = null
      setLoadingModules(true)
    }

    fetchingRef.current = true
    let isActive = true

    // --- Timeout wrapper (prevents silent hangs)
    const withTimeout = (promise: Promise<any>, ms = 10000) => {
      return new Promise((resolve, reject) => {
        const id = setTimeout(() => reject(new Error("timeout")), ms)
        promise.then(
          (res) => {
            clearTimeout(id)
            resolve(res)
          },
          (err) => {
            clearTimeout(id)
            reject(err)
          }
        )
      })
    }

    // --- Helper to normalize SDK errors (many SDKs resolve instead of reject)
    const ensureSuccess = (response: any) => {
      if (!response || response.error || !response.data) {
        throw new Error("network-error")
      }
      return response
    }

    ;(async () => {
      try {
        const tab = type.toLowerCase() === "portal" ? "prevent" : String(type || "").toLowerCase()
        const batchSize = 50

        setLoadingModules(true)
        // --------------------
        // 1. Fetch first batch with timeout + validation
        // --------------------
        const firstBatchResponse: any = ensureSuccess(
          await withTimeout((LAMP.Activity.listActivities as any)(participant.id, tab, null, batchSize, 0))
        )

        if (!isActive) return

        const firstBatchData = firstBatchResponse.data ?? {}
        const total = firstBatchResponse.total || 0

        // Update UI immediately with first batch
        setLoadingModules(false)
        setActivityList(firstBatchData)
        fetchedKeyRef.current = key

        // CRITICAL: Cache first batch IMMEDIATELY for faster remounts
        // This ensures data is available when component remounts on tab switch
        try {
          sessionStorage.setItem(
            cacheKey,
            JSON.stringify({
              data: firstBatchData,
              favorites: firstBatchData?.favouriteActivities ?? [],
              timestamp: Date.now(),
            })
          )
        } catch (e) {
          console.warn("Failed to cache first batch:", e)
        }

        const totalBatches = Math.ceil(total / batchSize)
        if (totalBatches <= 1) {
          fetchingRef.current = false
          return
        }

        // --------------------
        // 2. Fetch remaining batches in parallel
        // --------------------

        const remainingBatchPromises = Array.from({ length: totalBatches - 1 }, (_, i) =>
          withTimeout(
            (LAMP.Activity.listActivities as any)(participant.id, tab, null, batchSize, (i + 1) * batchSize)
          ).then(ensureSuccess)
        )

        const remainingResults: any[] = await Promise.all(remainingBatchPromises)

        if (!isActive) return

        // --------------------
        // 3. Merge + dedupe
        // --------------------
        const merged = remainingResults.reduce(
          (acc, curr) => {
            const d = curr.data
            return {
              otherActivities: [...(acc.otherActivities || []), ...(d.otherActivities || [])],
            }
          },
          { ...firstBatchData }
        )

        const dedupe = (arr: any[] = []) => {
          const map = new Map()
          arr.forEach((a) => {
            if (a?.id && !map.has(a.id)) map.set(a.id, a)
          })
          return Array.from(map.values())
        }

        const deduped = {
          otherActivities: dedupe(merged.otherActivities),
        }

        setActivityList(deduped)
        // Cache in sessionStorage for persistence across remounts
        try {
          sessionStorage.setItem(
            cacheKey,
            JSON.stringify({
              data: deduped,
              timestamp: Date.now(),
            })
          )
        } catch (e) {
          // If cache write fails, continue normally
          console.warn("Failed to cache ActivityBox data:", e)
        }
      } catch (err) {
        console.error("Error fetching activities:", err)

        setLoadingModules(false)

        // Reset refs on error to allow retry
        // Only reset if this was the current key (don't reset if key changed during fetch)
        const currentKey = `${participant.id}|${String(type || "").toLowerCase()}`
        if (fetchedKeyRef.current === currentKey) {
          fetchedKeyRef.current = null
        }
        fetchingRef.current = false
      } finally {
        fetchingRef.current = false
      }
    })()

    return () => {
      isActive = false
      // Reset fetching flag on unmount to allow fresh fetch on remount
      fetchingRef.current = false
    }
  }, [participant?.id, type])

  useEffect(() => {
    localStorage.removeItem("enabledActivities")
    for (let i = localStorage?.length - 1; i >= 0; i--) {
      const key = localStorage.key(i)
      if (key.startsWith("activity-survey-")) {
        localStorage.removeItem(key)
      }
    }
    if (LAMP.Auth?._auth?.serverAddress == "demo.lamp.digital") {
      const dataForSelfHelp = {
        otherActivities: Array.from(savedActivities || [])?.filter((activity: any) => activity?.spec !== "lamp.module"),
      }

      setActivityList(dataForSelfHelp)

      setLoadingModules(false)
    }
  }, [savedActivities])

  useEffect(() => {
    setMessage("There are no " + type + " activities available.")
  }, [type])

  return (
    <Box>
      <Grid container spacing={2}>
        {loadingModules ? (
          <Backdrop className={classes.backdrop} open={loadingModules}>
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : activitiesList?.otherActivities?.length ? (
          activitiesList?.otherActivities?.map((activity) => (
            <Grid
              item
              xs={6}
              sm={4}
              md={3}
              lg={3}
              onClick={() => {
                handleClickOpen(activity)
              }}
              className={classes.thumbMain}
            >
              <ButtonBase focusRipple className={classes.fullwidthBtn}>
                <Card
                  className={
                    classes.manage +
                    " " +
                    (type === "Manage"
                      ? classes.manageH
                      : type === "Assess"
                      ? classes.assessH
                      : type === "Learn"
                      ? classes.learnH
                      : classes.preventH)
                  }
                >
                  <Box mt={2} mb={1}>
                    <Box
                      className={classes.mainIcons}
                      style={{
                        margin: "auto",
                        background: tag?.filter((x) => x.id === activity?.id)[0]?.photo
                          ? `url(${
                              tag?.filter((x) => x.id === activity?.id)[0]?.photo
                            }) center center/contain no-repeat`
                          : activity.spec === "lamp.breathe"
                          ? `url(${BreatheIcon}) center center/contain no-repeat`
                          : activity.spec === "lamp.journal"
                          ? `url(${JournalIcon}) center center/contain no-repeat`
                          : activity.spec === "lamp.scratch_image"
                          ? `url(${ScratchCard}) center center/contain no-repeat`
                          : `url(${InfoIcon}) center center/contain no-repeat`,
                      }}
                    ></Box>
                  </Box>
                  <Typography className={classes.cardlabel}>
                    <ReactMarkdown
                      children={t(activity.name)}
                      skipHtml={false}
                      remarkPlugins={[gfm, emoji]}
                      components={{ link: LinkRenderer }}
                    />
                  </Typography>
                </Card>
              </ButtonBase>
            </Grid>
          ))
        ) : (
          type !== "Portal" && (
            <Box display="flex" className={classes.blankMsg} ml={1}>
              <Icon>info</Icon>
              <p>{`${t(message)}`}</p>
            </Box>
          )
        )}
      </Grid>
      <ActivityPopup
        activity={activity}
        tag={tag}
        questionCount={questionCount}
        open={open}
        onClose={() => setOpen(false)}
        type={type}
        showStreak={showStreak}
        participant={participant}
      />
    </Box>
  )
}
