// Core Imports
import React from "react"
import ReactDOM from "react-dom"
import LAMP from "lamp-core"

// Local Imports
import App from "./components/App"
import {
  getSavedServer,
  saveServer,
  isExternalDashboard,
  buildExternalRedirectUrl,
  KNOWN_SERVERS,
} from "./components/ServerGateway"
import * as serviceWorker from "./serviceWorker"

// External Imports
import "core-js/stable"
import "regenerator-runtime/runtime"
import "url-search-params-polyfill"
import "material-icons"
import "./i18n"

// in index.html: <!DOCTYPE html><html></html>
let root = document.createElement("div")
var css = document.createElement("style")
document.head.appendChild(css)
document.body.appendChild(root)
css.type = "text/css"
css.innerHTML = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');
* {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    cursor: default;
}
input, textarea, .contenteditable, .lamp-editable *, .swagger-ui * {
    -webkit-touch-callout: default;
    -webkit-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
    user-select: text;
    cursor: text;
}`
// IE9+ CustomEvent polyfill.
;(function () {
  if (typeof window.CustomEvent === "function") return false
  function CustomEvent(event, params) {
    params = params || { bubbles: false, cancelable: false, detail: null }
    var evt = document.createEvent("CustomEvent")
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail)
    return evt
  }
  ;(window.CustomEvent as any) = CustomEvent
})()

// Enable lamp-core's dev mode in order to make server requests over http
if (process.env.REACT_APP_USE_HTTPS === "false") {
  LAMP.enableDevMode()
}

// Initialize the demo DB for "Try It" mode.
// Tie-in for the mobile apps.
// Login only if we are a participant.
LAMP.addEventListener("LOGIN", ({ detail }) => {
  // Tie-in for the mobile apps.
  ;(window as any)?.webkit?.messageHandlers?.login?.postMessage?.(detail)
  ;(window as any)?.login?.postMessage?.(JSON.stringify(detail))
})

// Tie-in for the mobile apps.
LAMP.addEventListener("LOGOUT", ({ detail }) => {
  // Only forward real participant logouts to native. Erroneous logouts on load
  // cause the older iOS app to wipe all WKWebView storage (cross-origin),
  // which breaks session/redirect state for other dashboards.
  if (LAMP.Auth?._type !== "participant") return
  ;(window as any)?.webkit?.messageHandlers?.logout?.postMessage?.(detail)
  ;(window as any)?.logout?.postMessage?.(JSON.stringify(detail))
})

// Migration shim: older builds (feature/email-routing) persisted the LevelUp
// redirect choice under "lamp.redirectTarget". Map it to the gateway's saved
// server so those users keep auto-redirecting.
if (localStorage.getItem("lamp.redirectTarget") === "levelup" && !getSavedServer()) {
  const levelUp = KNOWN_SERVERS.find((s) => s.name === "LevelUp")
  if (levelUp) saveServer(levelUp)
  localStorage.removeItem("lamp.redirectTarget")
}

// Sticky redirect: if the user previously chose an external dashboard, send the
// WebView there before mounting the app — App.tsx consumes the ?a= auth-link at
// mount, so redirecting any later would swallow credentials meant for the
// destination. Forward all hash query params (?a= etc.) so the external
// dashboard can restore the session instead of showing a login screen.
const savedServer = getSavedServer()
if (savedServer && isExternalDashboard(savedServer)) {
  window.location.replace(buildExternalRedirectUrl(savedServer))
} else {
  ReactDOM.render(<App />, root)
  serviceWorker.register({
    onUpdate: (registration) => {
      //alert('Updating to the latest available version of mindLAMP.')
      if (registration && registration.waiting) registration.waiting.postMessage({ type: "SKIP_WAITING" })
      window.location.reload()
    },
  })
}
