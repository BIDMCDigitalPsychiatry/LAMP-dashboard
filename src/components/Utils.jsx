// Core Imports
import React from "react"
import { Paper, useTheme, useMediaQuery } from "@material-ui/core"

//
export const ResponsiveMargin = React.forwardRef((props, ref) => {
  let sm = useMediaQuery(useTheme().breakpoints.down("sm"))
  return <div {...props} style={{ ...props.style, width: sm ? "98%" : props.style.width }} ref={ref} />
})

export const ResponsivePaper = React.forwardRef((props, ref) => {
  let sm = useMediaQuery(useTheme().breakpoints.down("sm"))
  return <Paper {...props} elevation={sm ? 0 : props.elevation} ref={ref} />
})

// Stubbed code for .flat() which is an ES7 function...
// eslint-disable-next-line
Object.defineProperty(Array.prototype, "flat", {
  value: function (depth = 1) {
    return this.reduce(function (flat, toFlatten) {
      return flat.concat(Array.isArray(toFlatten) && depth - 1 ? toFlatten.flat(depth - 1) : toFlatten)
    }, [])
  },
})

// Stubbed code for .groupBy()
// eslint-disable-next-line
Object.defineProperty(Array.prototype, "groupBy", {
  value: function (key) {
    return this.reduce(
      (result, item) => ({
        ...result,
        [item[key]]: [...(result[item[key]] || []), item],
      }),
      {}
    )
  },
})

// Produces an array of integers from 0 until the specified max number.
// eslint-disable-next-line
Object.defineProperty(Array, "rangeTo", {
  value: function (max) {
    return [...Array(max).keys()]
  },
})

// An invalid date object returns NaN for getTime() and NaN is the only object not strictly equal to itself.
// eslint-disable-next-line
Date.prototype.isValid = function () {
  return this.getTime() === this.getTime()
}

// Easier Date-string formatting using Date.formatUTC
// eslint-disable-next-line
Object.defineProperty(Date, "formatUTC", {
  value: function (timestampUTC, formatObj) {
    return new Date(timestampUTC).toLocaleString("en-US", Date.formatStyle(formatObj))
  },
})

// Easier Date-string formatting using Date.formatUTC
// eslint-disable-next-line
Object.defineProperty(Date, "formatStyle", {
  value: function (formatObj = {}) {
    if (formatObj === "short") formatObj = { year: "2-digit", month: "2-digit", day: "2-digit" }
    else if (formatObj === "timeOnly") formatObj = { hour: "numeric", minute: "numeric", hour12: true }
    else if (formatObj === "dateOnly") formatObj = { year: "numeric", month: "long", day: "numeric" }
    else if (formatObj === "hourOnly")
      formatObj = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
      }
    else if (formatObj === "medium")
      formatObj = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      }
    else if (formatObj === "full")
      formatObj = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      }
    formatObj.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    return formatObj
  },
})
