import LAMP from "lamp-core"

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

// True inside the mindLAMP mobile apps, which inject a login bridge into their web views
export function isInMobileApp() {
  return !!(window?.webkit?.messageHandlers?.login || window?.login)
}

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

// The dashboard build stamped by buildEnv.js, e.g. "mindLAMP 2026.08.05.3 · build 3131 (4598084)".
// Builds that aren't on a release tag show "dev" in place of the tag.
export function dashboardVersion() {
  const tag = process.env.REACT_APP_GIT_SHA || "dev"
  const commit = process.env.REACT_APP_GIT_COMMIT
  return `mindLAMP ${tag} · build ${process.env.REACT_APP_GIT_NUM || "?"}${commit ? ` (${commit})` : ""}`
}

// The server this dashboard is logged in to, without the protocol; empty before login
export function serverAddress() {
  return (LAMP.Auth?._auth?.serverAddress || "").replace(/^https?:\/\//, "")
}
