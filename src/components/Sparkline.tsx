// Core Imports
import React, { useState } from "react"
import { Paper, List, ListItem, ListItemText, Box, useMediaQuery, useTheme } from "@material-ui/core"
import {
  XYChart,
  theme,
  withParentSize,
  CrossHair,
  LineSeries,
  AreaSeries,
  PointSeries,
  WithTooltip,
  XAxis,
  YAxis,
  Brush,
  LinearGradient,
  PatternLines,
} from "@data-ui/xy-chart"

function PaperTooltip({ top, left, ...props }) {
  left = window.innerWidth < left + 196 ? left - 196 : left
  return (
    <Box clone displayPrint="none">
      <Paper
        {...props}
        elevation={4}
        style={{
          ...props.style,
          position: "absolute",
          pointerEvents: "none",
          background: "white",
          top,
          left,
          width: 196,
        }}
      />
    </Box>
  )
}

const styles = {
  axis: {
    stroke: "#bdbdbd",
    strokeWidth: 1,
    label: {
      bottom: {
        pointerEvents: "none",
        textAnchor: "middle",
        fontWeight: 700,
        fill: "#616161",
        fontSize: 12,
        letterSpacing: 0.4,
      },
      top: {
        pointerEvents: "none",
        textAnchor: "middle",
        fontWeight: 700,
        fill: "#616161",
        fontSize: 12,
        letterSpacing: 0.4,
      },
      left: {
        pointerEvents: "none",
        textAnchor: "middle",
        fontWeight: 700,
        fill: "#616161",
        fontSize: 12,
        letterSpacing: 0.4,
      },
      right: {
        pointerEvents: "none",
        textAnchor: "middle",
        fontWeight: 700,
        fill: "#616161",
        fontSize: 12,
        letterSpacing: 0.4,
      },
    },
  },
  tick: {
    stroke: "#bdbdbd",
    length: 18,
    label: {
      bottom: {
        pointerEvents: "none",
        textAnchor: "middle",
        fill: "#757575",
        fontSize: "0.9em !important",
        letterSpacing: 0.4,
        dy: "0.25em",
      },
      top: {
        pointerEvents: "none",
        textAnchor: "middle",
        fontWeight: 400,
        fill: "#757575",
        fontSize: 10,
        letterSpacing: 0.4,
        dy: "-0.25em",
      },
      left: {
        pointerEvents: "none",
        textAnchor: "end",
        fontWeight: 400,
        fill: "#757575",
        fontSize: 10,
        letterSpacing: 0.4,
        dx: "-0.25em",
        dy: "0.25em",
      },
      right: {
        pointerEvents: "none",
        textAnchor: "start",
        fontWeight: 400,
        fill: "#757575",
        fontSize: 10,
        letterSpacing: 0.4,
        dx: "0.25em",
        dy: "0.25em",
      },
    },
  },
}

export default withParentSize(function Sparkline({ ...props }) {
  const [rand] = useState(Math.random())
  const print = useMediaQuery("print")
  const supportsSidebar = useMediaQuery(useTheme().breakpoints.up("md"))

  const renderTooltip = ({ datum, series }) => (
    <List dense>
      <ListItem dense disabled divider={!!series?.[props.YAxisLabel ?? "Data"]}>
        <ListItemText
          primaryTypographyProps={{ variant: "overline", style: { lineHeight: "1.4" } }}
          secondary={!series || Object.keys(series).length === 0 ? datum.y : undefined}
        >
          {datum ? datum?.x?.toLocaleString("en-US", Date.formatStyle("full")) : null}
        </ListItemText>
      </ListItem>
      {series && series[props.YAxisLabel ?? "Data"] && (
        <ListItem>
          <ListItemText
            primaryTypographyProps={{
              variant: "overline",
              style: { lineHeight: "1.4" },
            }}
            secondaryTypographyProps={{
              variant: "overline",
              display: "block",
              style: { color: "#f00", fontWeight: 900, lineHeight: "1.4" },
            }}
            secondary={series[props.YAxisLabel ?? "Data"]?.missing ? "Missing Data" : undefined}
          >
            <span
              style={{
                color: props.color,
                textDecoration: series[props.YAxisLabel ?? "Data"] === datum ? `underline dotted ${props.color}` : null,
                fontWeight: series[props.YAxisLabel ?? "Data"] === datum ? 900 : 500,
              }}
            >{`${props.YAxisLabel ?? "Data"} `}</span>
            <span>{series[props.YAxisLabel ?? "Data"].y}</span>
          </ListItemText>
        </ListItem>
      )}
    </List>
  )

  if (props.data.length === 1) {
    props.data[0].x = new Date(props.data[0].x).toLocaleString()
  }
  return (
    <WithTooltip renderTooltip={renderTooltip} TooltipComponent={PaperTooltip}>
      {({ onMouseLeave, onMouseMove, tooltipData }) => (
        <XYChart
          theme={theme}
          ariaLabel="Chart"
          width={Math.max(props.minWidth, props.parentWidth + (print ? 128 : 0))}
          height={Math.max(props.minHeight, props.parentHeight)}
          eventTrigger={"container"}
          eventTriggerRefs={props.eventTriggerRefs}
          margin={{
            top: 5,
            left: 45,
            right: 20,
            bottom: !!props.XAxisLabel ? 50 : 0,
          }}
          onClick={({ datum }) => !!props.onClick && props.onClick(datum)}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          renderTooltip={null}
          snapTooltipToData={false}
          tooltipData={tooltipData}
          xScale={{
            type: props.data.length === 1 ? "ordinal" : "time",
          }}
          yScale={{ type: "linear" }}
        >
          <PatternLines
            id={`brush-${rand}`}
            height={12}
            width={12}
            stroke={props.color}
            strokeWidth={1}
            orientation={["diagonal"]}
          />
          <LinearGradient id={`gradient-${rand}`} from={props.color} to="#ffffff00" />
          <YAxis
            label={null}
            numTicks={12}
            rangePadding={4}
            axisStyles={styles.axis}
            tickStyles={styles.tick}
            orientation="left"
          />
          {supportsSidebar ? (
            <XAxis
              label={null}
              numTicks={7}
              rangePadding={4}
              axisStyles={styles.axis}
              tickStyles={styles.tick}
              orientation="bottom"
              tickLabelProps={(d, i) => ({
                dy: 0,
                dx: "-1.25em",
                fontSize: 9,
                angle: 0,
              })}
            />
          ) : (
            <XAxis
              label={null}
              tickLabelProps={(d, i) => ({
                scaleToFit: supportsSidebar ? true : false,
                dy: 0,
                fontSize: 9,
                angle: supportsSidebar ? 0 : 90,
              })}
              numTicks={7}
              rangePadding={4}
              axisStyles={styles.axis}
              tickStyles={styles.tick}
              orientation="bottom"
            />
          )}
          <LineSeries
            data={props.data}
            seriesKey={props.YAxisLabel ?? "Data"}
            stroke={props.color}
            strokeWidth={2}
            strokeDasharray="3 1"
            strokeLinecap="butt"
            dashType="dotted"
          />
          <AreaSeries
            data={props.data}
            seriesKey={props.YAxisLabel ?? "Data"}
            fill={`url('#gradient-${rand}')`}
            strokeWidth={0}
          />
          <PointSeries
            data={props.data.filter((x) => !x.missing)}
            seriesKey={props.YAxisLabel ?? "Data"}
            fill={props.color}
            fillOpacity={1}
            strokeWidth={0}
          />
          <PointSeries data={props.data.filter((x) => x.missing)} fill="#ff0000" fillOpacity={1} strokeWidth={0} />
          <CrossHair
            fullHeight
            showHorizontalLine={true}
            stroke={props.color}
            strokeDasharray="3 1"
            circleSize={(d) => (d.y === tooltipData?.datum?.y ? 8 : 4)}
            circleStyles={{ strokeWidth: 0.0 }}
            circleFill={(d) => (d.y === tooltipData?.datum?.y ? (d.missing ? "#f00" : props.color) : "#fff")}
            showCircle
          />
          <Brush
            selectedBoxStyle={{
              fill: `url(#brush-${rand})`,
              stroke: props.color,
            }}
          />
        </XYChart>
      )}
    </WithTooltip>
  )
})
