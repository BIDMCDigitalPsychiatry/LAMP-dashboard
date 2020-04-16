// Core Imports
import React, { useState } from "react"
import { Box, Icon, IconButton, Tooltip, Typography, Divider, Popover } from "@material-ui/core"
import { blue } from "@material-ui/core/colors"

// Local Imports
import Sparkline from "./Sparkline"
import ArrayView from "./ArrayView"

const strategies = {
  "lamp.survey": (slices, activity, scopedItem) =>
    slices
      .filter((x, idx) => (scopedItem !== undefined ? idx === scopedItem : true))
      .map((x, idx) => {
        let question = (Array.isArray(activity.settings) ? activity.settings : []).filter((y) => y.text === x.item)[0]
        if (!!question && question.type === "boolean") return ["Yes", "True"].includes(x.value) ? 1 : 0
        else if (!!question && question.type === "list") return Math.max(question.options.indexOf(x.value), 0)
        else return parseInt(x.value) || 0
      })
      .reduce((prev, curr) => prev + curr, 0),
  "lamp.jewels_a": (slices, activity, scopedItem) =>
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
              value: x.value,
              time_taken: (x.duration / 1000).toFixed(1) + "s",
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
                y: strategies[d.static_data.survey_name !== undefined ? "lamp.survey" : "lamp.jewels_a"](
                  d.temporal_slices,
                  activity,
                  idx
                ),
                slice: d.temporal_slices,
                missing: [null, "NULL"].includes(d.temporal_slices[idx]?.value ?? null), // sometimes the slice itself is missing, not set to null
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
          minHeight={250}
          XAxisLabel="Time"
          YAxisLabel="Score"
          color={blue[500]}
          startDate={startDate}
          data={events.map((d) => ({
            x: new Date(d.timestamp),
            y: strategies[d.static_data.survey_name !== undefined ? "lamp.survey" : "lamp.jewels_a"](
              d.temporal_slices,
              activity,
              undefined
            ),
            slice: d.temporal_slices,
            missing: d.temporal_slices.filter((z) => [null, "NULL"].includes(z.value)).length > 0,
          }))}
          onClick={(datum) => setVisibleSlice(datum)}
        />
      )}
      <Popover
        open={Boolean(helpAnchor)}
        anchorEl={helpAnchor}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={(event) => setHelpAnchor(undefined)}
        disableRestoreFocus
      >
        {activity.spec === "lamp.survey" ? ( // eslint-disable-next-line
          <img
            style={{ width: 300, height: 600 }}
            src={`https://lamp-splash.s3.us-east-2.amazonaws.com/sample/survey.png`}
          /> // eslint-disable-next-line
        ) : (
          <img
            alt="Activity Screenshot from mindLAMP v1.x"
            style={{ width: 300, height: 600 }}
            src={`https://lamp-splash.s3.us-east-2.amazonaws.com/sample/${activity.name
              .toLowerCase()
              .replace(/[^0-9a-z]/gi, "")}.png`}
          />
        )}
      </Popover>
    </React.Fragment>
  )
}
