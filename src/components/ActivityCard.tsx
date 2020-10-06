// Core Imports
import React, { useState } from "react"
import { Box, Icon, IconButton, Tooltip, Typography, Divider, Popover } from "@material-ui/core"
import { blue } from "@material-ui/core/colors"

// Local Imports
import Sparkline from "./Sparkline"
import ArrayView from "./ArrayView"

export const strategies = {
  "lamp.survey": (slices, activity, scopedItem) =>
    (slices ?? [])
      .filter((x, idx) => (scopedItem !== undefined ? idx === scopedItem : true))
      .map((x, idx) => {
        let question = (Array.isArray(activity.settings) ? activity.settings : []).filter((y) => y.text === x.item)[0]
        if (!!question && question.type === "boolean") return ["Yes", "True"].includes(x.value) ? 1 : 0
        else if (!!question && question.type === "list") return Math.max(question.options.indexOf(x.value), 0)
        else return parseInt(x.value) || 0
      })
      .reduce((prev, curr) => prev + curr, 0),
  "lamp.dashboard.custom_survey_group": (slices, activity, scopedItem) =>
    (slices ?? [])
      .filter((x, idx) => (scopedItem !== undefined ? idx === scopedItem : true))
      .map((x, idx) => {
        let question = (Array.isArray(activity.settings) ? activity.settings : []).filter((y) => y.text === x.item)[0]
        if (!!question && question.type === "boolean") return ["Yes", "True"].includes(x.value) ? 1 : 0
        else if (!!question && question.type === "list") return Math.max(question.options.indexOf(x.value), 0)
        else return parseInt(x.value) || 0
      })
      .reduce((prev, curr) => prev + curr, 0),
  "lamp.jewels_a": (slices, activity, scopedItem) =>
    (parseInt(slices.score ?? 0).toFixed(1) || 0) > 100 ? 100 : parseInt(slices.score ?? 0).toFixed(1) || 0,
  "lamp.jewels_b": (slices, activity, scopedItem) =>
    (parseInt(slices.score ?? 0).toFixed(1) || 0) > 100 ? 100 : parseInt(slices.score ?? 0).toFixed(1) || 0,
  "lamp.spatial_span": (slices, activity, scopedItem) =>
    (parseInt(slices.score ?? 0).toFixed(1) || 0) > 100 ? 100 : parseInt(slices.score ?? 0).toFixed(1) || 0,
  __default__: (slices, activity, scopedItem) =>
    slices.map((x) => parseInt(x.item) || 0).reduce((prev, curr) => (prev > curr ? prev : curr), 0),
}

export default function ActivityCard({
  activity,
  events,
  startDate,
  forceDefaultGrid,
  onEditAction,
  onCopyAction,
  onDeleteAction,
  ...props
}) {
  let freeText = (Array.isArray(activity.settings) ? activity.settings : [])
    .map((x) => x.type)
    .filter((x) => [null, "text", "paragraph"].includes(x))

  const [visibleSlice, setVisibleSlice] = useState<any>()
  const [helpAnchor, setHelpAnchor] = useState<Element>()
  const [showGrid, setShowGrid] = useState<boolean>(forceDefaultGrid || Boolean(freeText.length))

  return (
    <React.Fragment>
      <Box display="flex" justifyContent="space-between" alignContent="center" p={2}>
        {!Boolean(visibleSlice) ? (
          <Tooltip title="Switch Views">
            <IconButton onClick={(event) => setShowGrid(!showGrid)}>
              <Icon fontSize="small">dashboard</Icon>
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Go Back">
            <IconButton onClick={(event) => setVisibleSlice(undefined)}>
              <Icon fontSize="small">arrow_back</Icon>
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title={Boolean(visibleSlice) ? activity.name : `Activity Type`}>
          <Typography variant="h6" align="center" style={{ marginTop: 6, flexGrow: 1 }}>
            {!Boolean(visibleSlice)
              ? activity.name
              : visibleSlice.x.toLocaleString("en-US", Date.formatStyle("medium"))}
          </Typography>
        </Tooltip>
        <Box>
          {!Boolean(visibleSlice) && (
            <Tooltip title="Show App Screenshot">
              <IconButton onClick={(event) => setHelpAnchor(event.currentTarget)}>
                <Icon fontSize="small">help</Icon>
              </IconButton>
            </Tooltip>
          )}
          {Boolean(visibleSlice) && !!onDeleteAction && (
            <Tooltip title="Delete Entry">
              <IconButton onClick={(event) => onDeleteAction(visibleSlice)}>
                <Icon fontSize="small">delete</Icon>
              </IconButton>
            </Tooltip>
          )}
          {Boolean(visibleSlice) && !!onCopyAction && (
            <Tooltip title="Copy Entry">
              <IconButton onClick={(event) => onCopyAction(visibleSlice)}>
                <Icon fontSize="small">file_copy</Icon>
              </IconButton>
            </Tooltip>
          )}
          {Boolean(visibleSlice) && !!onEditAction && (
            <Tooltip title="Edit Entry">
              <IconButton onClick={(event) => onEditAction(visibleSlice)}>
                <Icon fontSize="small">edit</Icon>
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
      <Divider />
      {Boolean(visibleSlice) ? (
        (visibleSlice.slice || []).length === 0 ? (
          <Typography variant="subtitle2" style={{ margin: 16 }}>
            No detail view available.
          </Typography>
        ) : (
          <ArrayView
            hiddenKeys={["x"]}
            value={(visibleSlice.slice || []).map((x) => ({
              item: x.item,
              value: `${x.value}`.replace("NaN", "-").replace("null", "-").replace(/\"/g, ""),
              time_taken: `${(x.duration / 1000).toFixed(1)}s`.replace("NaN", "0.0"),
            }))}
          />
        )
      ) : showGrid ? (
        <ArrayView
          hiddenKeys={["x"]}
          hasSpanningRowForIndex={
            (idx) =>
              true /* ['boolean', 'list'].includes(((Array.isArray(activity.settings) ? activity.settings : [])[idx] || {}).type) */
          }
          spanningRowForIndex={(idx) => (
            <Sparkline
              minWidth={48}
              minHeight={48}
              color={blue[500]}
              data={events.map((d) => ({
                x: new Date(d.timestamp),
                y: strategies[activity.spec]
                  ? strategies[activity.spec](
                      activity.spec === "lamp.survey" ? d.temporal_slices : d.static_data,
                      activity,
                      idx
                    )
                  : 0,
                slice: d.temporal_slices,
                missing:
                  activity.spec === "lamp.survey"
                    ? [null, "NULL"].includes(d.temporal_slices[idx]?.value ?? null)
                    : false, // sometimes the slice itself is missing, not set to null
              }))}
              onClick={(datum) => setVisibleSlice(datum)}
            />
          )}
          value={Object.values(
            events
              .map((d) =>
                d.temporal_slices.map((t) => ({
                  item: t.item,
                  [new Date(d.timestamp).toLocaleString("en-US", Date.formatStyle("medium"))]: t.value,
                }))
              )
              .reduce((x, y) => x.concat(y), [])
              .groupBy("item")
          )
            .map((v: any) => Object.assign({}, ...v))
            .reduce((x, y) => x.concat(y), [])}
        />
      ) : (
        <Sparkline
          minWidth={250}
          minHeight={350}
          XAxisLabel="Time"
          YAxisLabel="Score"
          color={blue[500]}
          startDate={startDate}
          data={events.map((d) => ({
            x: new Date(d.timestamp),
            y: strategies[activity.spec]
              ? strategies[activity.spec](
                  activity.spec === "lamp.survey" ? d.temporal_slices : d.static_data,
                  activity,
                  undefined
                )
              : 0,
            slice: d.temporal_slices,
            missing:
              activity.spec === "lamp.survey"
                ? d.temporal_slices.filter((z) => [null, "NULL"].includes(z.value)).length > 0
                : false,
          }))}
          onClick={(datum) => setVisibleSlice(datum)}
        />
      )}
    </React.Fragment>
  )
}
