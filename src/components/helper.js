export function extractIdsWithHierarchy(data) {
  return data.map((item) => {
    const result = {
      id: item.id,
      spec: item.spec,
      level: item.level,
      startTime: item.startTime,
      parentModule: item.parentModule,
      parentString: item.parentString,
    }
    if (item.subActivities && item.subActivities.length > 0) {
      result.subActivities = extractIdsWithHierarchy(item.subActivities)
    }
    return result
  })
}

const LOGIN_ATTEMPTS_KEY = "loginAttempts"
const LOCKOUT_TIME_KEY = "lockoutTime"

export function clearLocalStorageItems() {
  const cached = localStorage.getItem("cachedOptions")
  const loginAttempts = localStorage.getItem(LOGIN_ATTEMPTS_KEY) || "0"
  let lockoutTime = null
  if (typeof localStorage.getItem(LOCKOUT_TIME_KEY) != "undefined") {
    lockoutTime = localStorage.getItem(LOCKOUT_TIME_KEY)
  }
  localStorage.clear()
  localStorage.setItem("cachedOptions", cached)
  if (!!lockoutTime) {
    localStorage.setItem(LOCKOUT_TIME_KEY, lockoutTime)
  }
  localStorage.setItem("loginAttempts", loginAttempts)
  sessionStorage.clear()
}
