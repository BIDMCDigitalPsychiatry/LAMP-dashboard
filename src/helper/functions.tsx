import LAMP from "lamp-core"
import { clearLocalStorageItems } from "../components/helper"

const LAZY_RETRY_PENDING_PROMISE: Promise<never> = new Promise(() => {
  // Intentionally never resolve to avoid rendering the error boundary before reload
})

export const handleSessionExpired = () => {
  try {
    sessionStorage.clear()
    clearLocalStorageItems()
    window.location.href = "/#/"
  } catch (error) {
    console.error("Error handling session expiry:", error)
  }
}

export const lazyRetry = (componentImport) => {
  let resolved = false
  let retryCount = 0
  const MAX_RETRIES = 2

  return () =>
    componentImport()
      .then((module) => {
        resolved = true
        retryCount = 0 // Reset on success
        return module
      })
      .catch((error) => {
        // Only retry on network/chunk loading errors, not module errors
        const isChunkError =
          error?.message?.includes("Loading chunk") ||
          error?.message?.includes("Failed to fetch") ||
          error?.name === "ChunkLoadError" ||
          (error?.code === "MODULE_NOT_FOUND" && !resolved)

        if (isChunkError && !resolved && retryCount < MAX_RETRIES) {
          retryCount++
          // Wait a bit before retrying to avoid immediate retry loops
          return new Promise((resolve) => {
            setTimeout(() => {
              componentImport()
                .then((module) => {
                  resolved = true
                  retryCount = 0
                  resolve(module)
                })
                .catch((retryError) => {
                  if (retryCount >= MAX_RETRIES && !sessionStorage.getItem("retry-lazy-refreshed")) {
                    sessionStorage.setItem("retry-lazy-refreshed", "true")
                    window.location.reload()
                    return LAZY_RETRY_PENDING_PROMISE
                  }
                  throw retryError
                })
            }, 1000 * retryCount) // Exponential backoff
          })
        }

        // If we've exhausted retries or it's not a chunk error, reload as last resort
        if (!resolved && !sessionStorage.getItem("retry-lazy-refreshed") && retryCount >= MAX_RETRIES) {
          sessionStorage.setItem("retry-lazy-refreshed", "true")
          window.location.reload()
          return LAZY_RETRY_PENDING_PROMISE
        }

        throw error
      })
}

// Request deduplication cache for LAMP.Activity.view calls
// Prevents duplicate API calls for the same activity within a short time window
const activityViewCache = new Map<string, { promise: Promise<any>; timestamp: number }>()
const ACTIVITY_VIEW_CACHE_DURATION = 5000 // 5 seconds - deduplicate requests within this window
const ACTIVITY_LOCALSTORAGE_CACHE_DURATION = 10 * 60 * 1000 // 10 minutes - localStorage cache duration

/**
 * Deduplicated wrapper for LAMP.Activity.view with localStorage caching
 * If the same activity is requested multiple times within 5 seconds, returns the same promise
 * Also checks localStorage for cached activity data (10 minute TTL)
 * This prevents duplicate API calls when multiple components request the same activity
 */
export const getActivityWithDeduplication = (activityId: string): Promise<any> => {
  if (!activityId) {
    return Promise.reject(new Error("Activity ID is required"))
  }

  const now = Date.now()
  const localStorageKey = `activity-view-${activityId}`
  const localStorageTimestampKey = `activity-view-${activityId}-timestamp`

  // Check in-memory cache FIRST for concurrent requests (prevents duplicate API calls)
  // This is critical: if ActivityBox is currently fetching, NotificationPage should wait for the same promise
  const cached = activityViewCache.get(activityId)
  if (cached && now - cached.timestamp < ACTIVITY_VIEW_CACHE_DURATION) {
    return cached.promise
  }

  // Check localStorage cache for previously fetched data (persists across page loads)
  try {
    const cachedData = localStorage.getItem(localStorageKey)
    const cachedTimestamp = localStorage.getItem(localStorageTimestampKey)

    if (cachedData && cachedTimestamp) {
      const cacheAge = now - parseInt(cachedTimestamp, 10)
      if (cacheAge < ACTIVITY_LOCALSTORAGE_CACHE_DURATION) {
        // Return cached data from localStorage immediately
        try {
          const parsedData = JSON.parse(cachedData)
          // Also store in in-memory cache for immediate reuse
          const cachedPromise = Promise.resolve(parsedData)
          activityViewCache.set(activityId, { promise: cachedPromise, timestamp: now })
          setTimeout(() => {
            activityViewCache.delete(activityId)
          }, ACTIVITY_VIEW_CACHE_DURATION)
          return cachedPromise
        } catch (e) {
          // If parsing fails, continue to fetch
          console.warn("Failed to parse cached activity data:", e)
        }
      } else {
        // Cache expired, remove it
        localStorage.removeItem(localStorageKey)
        localStorage.removeItem(localStorageTimestampKey)
      }
    }
  } catch (e) {
    // If localStorage access fails, continue to fetch
    console.warn("Failed to read activity cache from localStorage:", e)
  }

  // Create new request and cache it
  const promise = LAMP.Activity.view(activityId)
    .then((result) => {
      // Store in localStorage for future use
      try {
        localStorage.setItem(localStorageKey, JSON.stringify(result))
        localStorage.setItem(localStorageTimestampKey, now.toString())
      } catch (e) {
        // If localStorage is full, try to clear old cache entries
        console.warn("Failed to cache activity in localStorage, clearing old entries:", e)
        try {
          // Clear expired cache entries
          Object.keys(localStorage).forEach((key) => {
            if (key.startsWith("activity-view-") && key.endsWith("-timestamp")) {
              const timestamp = parseInt(localStorage.getItem(key) || "0", 10)
              if (now - timestamp > ACTIVITY_LOCALSTORAGE_CACHE_DURATION) {
                const activityKey = key.replace("-timestamp", "")
                localStorage.removeItem(activityKey)
                localStorage.removeItem(key)
              }
            }
          })
          // Retry caching
          localStorage.setItem(localStorageKey, JSON.stringify(result))
          localStorage.setItem(localStorageTimestampKey, now.toString())
        } catch (e2) {
          console.warn("Could not cache activity data:", e2)
        }
      }

      // Keep result in in-memory cache for a bit longer for immediate reuse
      setTimeout(() => {
        activityViewCache.delete(activityId)
      }, ACTIVITY_VIEW_CACHE_DURATION)
      return result
    })
    .catch((error) => {
      // Remove from cache on error
      activityViewCache.delete(activityId)
      throw error
    })

  activityViewCache.set(activityId, { promise, timestamp: now })
  return promise
}

// Request deduplication cache for LAMP.Activity.allByStudy calls
// Prevents duplicate API calls for the same study within a short time window
const activityAllByStudyCache = new Map<string, { promise: Promise<any>; timestamp: number }>()
const ACTIVITY_ALL_BY_STUDY_CACHE_DURATION = 5000 // 5 seconds - deduplicate requests within this window

/**
 * Deduplicated wrapper for LAMP.Activity.allByStudy with optimized pagination
 * First fetches 50 items, then uses Promise.all to fetch remaining batches in parallel
 * This improves performance by showing initial data quickly while loading the rest
 * @param studyId The study ID
 * @param limit Optional limit for pagination (if provided, returns only that many items)
 * @param offset Optional offset for pagination (if provided, starts from that offset)
 * @returns Promise that resolves to Activity[] (without pagination) or { data: Activity[], total: number } (with pagination)
 */
export const getActivitiesByStudyWithDeduplication = (
  studyId: string,
  limit?: number,
  offset?: number
): Promise<any> => {
  if (!studyId || studyId.trim() === "") {
    // Return appropriate structure based on pagination
    if ((typeof limit === "number" && limit > 0) || (typeof offset === "number" && offset > 0)) {
      return Promise.resolve({ data: [], total: 0 })
    }
    return Promise.resolve([]) // Return empty array for empty study ID instead of rejecting
  }

  // If limit/offset are explicitly provided, use direct pagination (for specific page requests)
  if ((typeof limit === "number" && limit > 0) || (typeof offset === "number" && offset > 0)) {
    const cacheKey = `${studyId}_${limit || ""}_${offset || ""}`
    const now = Date.now()
    const cached = activityAllByStudyCache.get(cacheKey)

    // Return cached promise if it's still valid
    if (cached && now - cached.timestamp < ACTIVITY_ALL_BY_STUDY_CACHE_DURATION) {
      return cached.promise
    }

    // Create new request and cache it
    const promise = (LAMP.Activity.allByStudy as any)(studyId, undefined, true, limit, offset)
      .then((result: any) => {
        // Normalize result: if pagination was used, result is { data, total }, otherwise it's an array
        let normalizedResult: any
        if (Array.isArray(result)) {
          normalizedResult = { data: result, total: result.length }
        } else {
          normalizedResult = result
        }

        // Keep result in cache for a bit longer for immediate reuse
        setTimeout(() => {
          activityAllByStudyCache.delete(cacheKey)
        }, ACTIVITY_ALL_BY_STUDY_CACHE_DURATION)
        return normalizedResult
      })
      .catch((error: any) => {
        // Remove from cache on error
        activityAllByStudyCache.delete(cacheKey)
        throw error
      })

    activityAllByStudyCache.set(cacheKey, { promise, timestamp: now })
    return promise
  }

  // For full fetch (no limit/offset), use optimized batch loading pattern
  const cacheKey = `${studyId}_full`
  const now = Date.now()
  const cached = activityAllByStudyCache.get(cacheKey)

  // Return cached promise if it's still valid
  if (cached && now - cached.timestamp < ACTIVITY_ALL_BY_STUDY_CACHE_DURATION) {
    return cached.promise
  }

  // Create optimized batch loading promise
  const promise = (async () => {
    const batchSize = 50

    try {
      // 1. Fetch first batch (50 items) to get total count and show initial data quickly
      const firstBatchResponse: any = await (LAMP.Activity.allByStudy as any)(studyId, undefined, true, batchSize, 0)

      // Normalize first batch response
      let firstBatchData: any[] = []
      let total = 0

      if (Array.isArray(firstBatchResponse)) {
        firstBatchData = firstBatchResponse
        total = firstBatchResponse.length
      } else if (firstBatchResponse && typeof firstBatchResponse === "object" && "data" in firstBatchResponse) {
        firstBatchData = firstBatchResponse.data || []
        total = firstBatchResponse.total || firstBatchData.length
      }

      // If total is less than or equal to batch size, return immediately
      if (total <= batchSize) {
        return firstBatchData
      }

      // 2. Calculate number of remaining batches
      const totalBatches = Math.ceil(total / batchSize)

      // 3. Fetch remaining batches in parallel using Promise.all
      const remainingBatchPromises = Array.from({ length: totalBatches - 1 }, (_, i) =>
        (LAMP.Activity.allByStudy as any)(studyId, undefined, false, batchSize, (i + 1) * batchSize)
      )

      const remainingResults: any[] = await Promise.all(remainingBatchPromises)

      // 4. Normalize and merge all batches
      const allBatches = [firstBatchData]
      remainingResults.forEach((result) => {
        if (Array.isArray(result)) {
          allBatches.push(result)
        } else if (result && typeof result === "object" && "data" in result) {
          allBatches.push(result.data || [])
        }
      })

      // 5. Flatten and dedupe by activity ID
      const allActivities = allBatches.flat()
      const dedupeMap = new Map<string, any>()
      allActivities.forEach((activity: any) => {
        if (activity?.id && !dedupeMap.has(activity.id)) {
          dedupeMap.set(activity.id, activity)
        }
      })

      return Array.from(dedupeMap.values())
    } catch (error) {
      // Remove from cache on error
      activityAllByStudyCache.delete(cacheKey)
      throw error
    }
  })()

  // Cache the promise
  activityAllByStudyCache.set(cacheKey, { promise, timestamp: now })

  // Clean up cache after duration
  setTimeout(() => {
    activityAllByStudyCache.delete(cacheKey)
  }, ACTIVITY_ALL_BY_STUDY_CACHE_DURATION)

  return promise
}
