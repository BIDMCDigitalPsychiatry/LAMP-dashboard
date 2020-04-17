// Core Imports
import React from "react"
import { RadialChart, ArcSeries, ArcLabel, multiHueScaleFactory } from "@data-ui/radial-chart"
import { LegendOrdinal } from "@vx/legend"
import { Box, useTheme, useMediaQuery } from "@material-ui/core"

const categoryColorScale = multiHueScaleFactory()

export default function MultiPieChart(props) {
  let sm = useMediaQuery(useTheme().breakpoints.down("sm"))
  return (
    <Box
      style={{
        display: "flex",
        flexDirection: sm ? "column" : "row",
        alignItems: "center",
        justifyContent: "center",
        margin: -50,
      }}
    >
      <RadialChart
        ariaLabel="radial-left"
        width={400}
        height={400}
        margin={{ top: 0, left: 0, bottom: 0, right: 0 }}
        renderTooltip={({ datum, fraction }) => (
          <Box>
            <Box>
              <strong style={{ color: categoryColorScale(datum.label) }}>{datum.label}</strong>
            </Box>
            <Box>{(fraction * 100).toFixed()}%</Box>
          </Box>
        )}
      >
        <ArcSeries
          data={props.data[0]}
          pieValue={(d) => d.value / props.data[0].map((x) => x.value).reduce((a, b) => a + b, 0)}
          label={(arc) => arc.data.label}
          labelComponent={<ArcLabel fill="#fff" fontSize={10} />}
          margin={{ top: 0, left: 0, bottom: 0, right: 0 }}
          innerRadius={(radius) => 0.35 * radius}
          outerRadius={(radius) => 0.6 * radius}
          labelRadius={(radius) => 0.47 * radius}
          stroke={"#fff"}
          strokeWidth={2}
          fill={(arc) => categoryColorScale(arc.data.label)}
          fillOpacity={1.0}
          padAngle={0.03}
          cornerRadius={5}
        />
      </RadialChart>
      <LegendOrdinal
        direction="column"
        scale={categoryColorScale}
        shape="rect"
        fill={({ datum }) => categoryColorScale(datum)}
        labelFormat={(label) => label}
      />
      <RadialChart
        ariaLabel="radial-right"
        width={400}
        height={400}
        margin={{ top: 0, left: 0, bottom: 0, right: 0 }}
        renderTooltip={({ datum, fraction }) => (
          <Box>
            <Box>
              <strong style={{ color: categoryColorScale(datum.label) }}>{datum.label}</strong>
            </Box>
            <Box>{(fraction * 100).toFixed()}%</Box>
          </Box>
        )}
      >
        <ArcSeries
          data={props.data[1]}
          pieValue={(d) => d.value / props.data[1].map((x) => x.value).reduce((a, b) => a + b, 0)}
          label={(arc) => arc.data.label}
          labelComponent={<ArcLabel fill="#fff" fontSize={10} />}
          innerRadius={(radius) => 0.35 * radius}
          outerRadius={(radius) => 0.6 * radius}
          labelRadius={(radius) => 0.47 * radius}
          stroke={"#fff"}
          strokeWidth={2}
          fill={(arc) => categoryColorScale(arc.data.label)}
          fillOpacity={1.0}
          padAngle={0.03}
          cornerRadius={5}
        />
      </RadialChart>
    </Box>
  )
}
