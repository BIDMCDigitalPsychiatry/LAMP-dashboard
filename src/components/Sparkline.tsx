// Core Imports
import React, { useState, useCallback } from "react"
import { useMediaQuery } from "@material-ui/core"
import { Vega } from "react-vega"
import { Handler } from "vega-tooltip"

export default function Sparkline({ ...props }) {
  const print = useMediaQuery("print")
  const [parentHeight, setParentHeight] = useState(null)
  const [parentWidth, setParentWidth] = useState(null)
  const div = useCallback((node) => {
    if (node !== null) {
      setParentHeight(node.getBoundingClientRect().height)
      setParentWidth(node.getBoundingClientRect().width)
    }
  }, [])

  let details = []
  ;(props.data || []).map((data) => {
    if (typeof data?.x === "string") {
      let propsDate = new Date(data?.x?.replace("at ", ""))
      let timeString = propsDate.toLocaleTimeString()
      let curreDate = propsDate.getDate().toString().padStart(2, "0")
      var curreMonth = (propsDate.getMonth() + 1).toString().padStart(2, "0") //Months are zero based
      var curreYear = propsDate.getFullYear()
      let dateTimeString = curreMonth + "/" + curreDate + "/" + curreYear + ", " + timeString
      data.x = dateTimeString
      details.push(data)
    } else {
      details.push(data)
    }
  })

  const handleClick = (...args) => {
    // console.log(args)
  }
  const signalListeners = { click: handleClick, mouseover: handleClick }

  return (
    <div ref={div}>
      <Vega
        actions={false}
        width={Math.max(props.minWidth, parentWidth + (print ? 128 : 0))}
        height={Math.max(props.minHeight, props.parentHeight ? props.parentHeight : 0)}
        signalListeners={signalListeners}
        logLevel={2}
        tooltip={new Handler().call}
        spec={{
          $schema: "https://vega.github.io/schema/vega-lite/v4.json",
          description: "A basic line chart example.",
          background: "#00000000",
          width: Math.max(props.minWidth, parentWidth + (print ? 128 : 0)),
          height: Math.max(props.minHeight, parentHeight ? parentHeight : 0),
          signals: [
            {
              name: "click",
              value: 0,
              on: [{ events: "*:mousedown", update: "datum" }],
            },
          ],
          config: {
            view: { stroke: "transparent" },
            axisX: {
              orient: "bottom",
              format: "%b %d",
              labelColor: "rgba(0, 0, 0, 0.4)",
              labelFont: "Inter",
              labelFontWeight: 500,
              labelFontSize: 10,
              labelPadding: 4,
              title: null,
              grid: false,
            },
            axisY: {
              orient: "left",
              tickCount: 12,
              labelColor: "rgba(0, 0, 0, 0.4)",
              labelFont: "Inter",
              labelFontWeight: 500,
              labelFontSize: 10,
              labelPadding: 4,
              title: null,
              grid: false,
            },
          },
          mark: {
            type: "area",
            tooltip: true,
            point: { color: "#2196f3", size: 50 },
            line: { color: "#2196f3", strokeDash: [3, 1] },
            color: {
              x1: 1,
              y1: 1,
              x2: 1,
              y2: 0,
              gradient: "linear",
              stops: [
                { offset: 0, color: "#ffffff00" },
                { offset: 1, color: props.color },
              ],
            },
          },
          encoding: {
            x: { field: "x", type: "ordinal", timeUnit: "yearmonthdate" },
            y: { field: "y", type: "quantitative", sort: "ascending" },
            strokeWidth: { value: 2 },
            tooltip: [
              {
                field: "x",
                type: "ordinal",
                timeUnit: "yearmonthdatehoursminutes",
                title: "DATE",
              },
              { field: "y", type: "nominal", title: "SCORE" },
            ],
          },
          data: {
            values: props.values ?? details,
          },
        }}
      />
    </div>
  )
}
