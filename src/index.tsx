// Core Imports
import React from "react"
import ReactDOM from "react-dom"
import LAMP from "lamp-core"

// Local Imports
import App from "./components/App"
import * as serviceWorker from "./serviceWorker"
import demo_db from "./demo_db.json"

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
// Initialize the demo DB for "Try It" mode.
LAMP.initializeDemoDB(demo_db)

// Tie-in for the mobile apps.
// Login only if we are a participant.
LAMP.addEventListener("LOGIN", ({ detail }) => {
  // Tie-in for the mobile apps.
  if (LAMP.Auth._type === "participant") {
    ;(window as any)?.webkit?.messageHandlers?.login?.postMessage?.(detail)
    ;(window as any)?.login?.postMessage?.(JSON.stringify(detail))
  }
})

// Tie-in for the mobile apps.
// FIXME: Logout only if we were a participant... right now the app should ignore erroneous logouts.
LAMP.addEventListener("LOGOUT", ({ detail }) => {
  ;(window as any)?.webkit?.messageHandlers?.logout?.postMessage?.(detail)
  ;(window as any)?.logout?.postMessage?.(JSON.stringify(detail))
})

ReactDOM.render(<App />, root)
serviceWorker.register({
  onUpdate: (registration) => {
    //alert('Updating to the latest available version of mindLAMP.')
    if (registration && registration.waiting) registration.waiting.postMessage({ type: "SKIP_WAITING" })
    window.location.reload()
  },
})
