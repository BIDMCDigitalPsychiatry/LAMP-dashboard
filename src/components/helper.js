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
  // Preserve the saved server selection across the wipe. Clearing these on
  // sign-in made the login screen forget the server: the loss only becomes
  // visible after logout, when the login/gateway screens re-mount and read
  // ServerGateway's "selectedServer" and lamp-core's "lastServerSelected".
  const selectedServer = localStorage.getItem("selectedServer")
  const lastServerSelected = localStorage.getItem("lastServerSelected")
  let lockoutTime = null
  if (typeof localStorage.getItem(LOCKOUT_TIME_KEY) != "undefined") {
    lockoutTime = localStorage.getItem(LOCKOUT_TIME_KEY)
  }
  localStorage.clear()
  localStorage.setItem("cachedOptions", cached)
  if (!!selectedServer) {
    localStorage.setItem("selectedServer", selectedServer)
  }
  if (!!lastServerSelected) {
    localStorage.setItem("lastServerSelected", lastServerSelected)
  }
  if (!!lockoutTime) {
    localStorage.setItem(LOCKOUT_TIME_KEY, lockoutTime)
  }
  localStorage.setItem("loginAttempts", loginAttempts)
  sessionStorage.clear()
}
