
// Core Imports
import React from 'react'
import ReactDOM from 'react-dom'

// Local Imports 
import App from './components/App'
import * as serviceWorker from './serviceWorker'

// External Imports
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import 'url-search-params-polyfill'
import 'material-icons'

// in index.html: <!DOCTYPE html><html></html>
let root = document.createElement('div')
var css = document.createElement('style')
document.head.appendChild(css)
document.body.appendChild(root)
css.type = 'text/css'
css.innerHTML = 
`* {
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

ReactDOM.render(<App />, root)
serviceWorker.register({
    onUpdate: registration => {
        //alert('Updating to the latest available version of mindLAMP.')
        if (registration && registration.waiting)
        registration.waiting.postMessage({ type: 'SKIP_WAITING' })
        window.location.reload()
    }
})
