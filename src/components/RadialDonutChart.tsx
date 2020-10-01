import React from "react"
import { scaleOrdinal } from "@vx/scale"
import { RadialChart, ArcLabel, ArcSeries } from "@data-ui/radial-chart"
import { Box, useMediaQuery, useTheme } from "@material-ui/core"
import { LegendOrdinal } from "@vx/legend"

function percentageCal(l, target) {
  var off =
    target -
    l.reduce(function (acc, x) {
      return acc + Math.round(x)
    }, 0)
  return l.map(function (x, i) {
    return Math.round(x) + Number(off > i) - Number(i >= l.length + off)
  })
}

export default function RadialDonutChart(props) {
  let data = props.data.sort((x, y) => (x.value > y.value ? -1 : 1))
  let total = data
    .map((val) => val.value)
    .reduce((x, val) => {
      return x + val
    })
  let values = data.map((val) => (val.value / total) * 100).sort((x, y) => (x > y ? -1 : 1))
  total = percentageCal(values, 100)

  data = data.map((d, i) => ({
    ...d,
    value: total[i],
  }))
  const supportsSidebar = useMediaQuery(useTheme().breakpoints.up("md"))

  const colorScale =
    props.type.length === 5
      ? scaleOrdinal({
          range: ["#3C5DDD", "#5784EE", "#7DB2FF", "#CFE3FF", "#ECF4FF"],
        })
      : scaleOrdinal({
          range: ["#3C5DDD", "#5784EE", "#7DB2FF", "#CFE3FF", "#ECF4FF", "#F2F7FF", "#f2f6fa"],
        })
  return (
    <Box>
      <Box style={{ float: supportsSidebar && props.detailPage ? "left" : "none" }}>
        <RadialChart
          ariaLabel="This is a radial-chart chart of..."
          width={props.width}
          height={props.height}
          margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
          renderTooltip={({ datum, fraction }) => {
            const { label } = datum
            const style = { color: "#3C5DDD" }

            return (
              <div style={style}>
                <div>
                  <strong>{label}</strong>
                </div>
                <div>{datum.value}%</div>
              </div>
            )
          }}
        >
          <ArcSeries
            data={data}
            pieValue={(d) => d.value}
            fill={(arc) => colorScale(arc.data.label)}
            padAngle={0.03}
            cornerRadius={5}
            stroke="#fff"
            strokeWidth={1}
            label={(arc) => (props.detailPage ? `${arc.data.label} - ${arc.data.value}%` : "")}
            labelComponent={<ArcLabel />}
            innerRadius={(radius) => 0.35 * radius}
            outerRadius={(radius) => 0.6 * radius}
            labelRadius={(radius) => 0.75 * radius}
          />
        </RadialChart>
      </Box>
      {props.detailPage && (
        <Box style={{ paddingTop: supportsSidebar ? "100px" : "0px", paddingLeft: !supportsSidebar ? "80px" : "0px" }}>
          <LegendOrdinal
            direction="column"
            scale={colorScale}
            shape="rect"
            fill={({ datum }) => (props?.type?.indexOf(datum.label) ? colorScale(datum) : "")}
            labelFormat={(label) =>
              `${label} - ${
                data.find(function (item, i) {
                  if (item.label === label) {
                    return data[i]
                  }
                })?.value ?? 0
              }%`
            }
          />
        </Box>
      )}
    </Box>
  )
}
