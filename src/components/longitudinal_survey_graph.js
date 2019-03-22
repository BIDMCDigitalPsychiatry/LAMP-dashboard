import React from 'react';
import { Grid } from '@vx/grid';
import { Group } from '@vx/group';
import { curveBasis } from '@vx/curve';
import { GradientOrangeRed } from '@vx/gradient';
import { genDateValue } from '@vx/mock-data';
import { AxisLeft, AxisRight, AxisBottom } from '@vx/axis';
import { Area, LinePath, Line } from '@vx/shape';
import { GlyphDot } from '@vx/glyph';
import { scaleTime, scaleLinear } from '@vx/scale';
import { extent } from 'd3-array';
import { curveMonotoneX } from '@vx/curve';
import { withParentSize } from '@vx/responsive'

//standard surveys ranges
const survey_ranges = {
  'Social': 6,
  'Anxiety': 10,
  'Psychosis': 10,
  'Mood': 10,
  'Sleep': 10
}

const survey_colors = {
  'Social': '#a442f4',
  'Anxiety': '#f49841',
  'Psychosis': '#f44141',
  'Mood':'#41f44f',
  'Sleep':'#416df4',
  'Medication':'#dcf441'
}

// accessors
const x = d => d.date;
const y = d => d.value;

// responsive utils for axis ticks
function numTicksForHeight(height) {
  if (height <= 300) return 3;
  if (300 < height && height <= 600) return 5;
  return 10;
}

function numTicksForWidth(width) {
  if (width <= 300) return 2;
  if (300 < width && width <= 400) return 5;
  return 10;
}

export default withParentSize((props) => {
  
  let data = props.data
  // If no width or height is manually provided, take the parent element's.
  // Adjust the width and height to support axes and 1% padding.
  let width = props.width || props.parentWidth
  let height = props.height || props.parentHeight
  let margin = props.margin 


  // bounds
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  // colors
  const primary = '#8921e0';
  const secondary = '#00f2ff';
  const contrast = '#ffffff';

  // scales
  const xScale2 = scaleTime({
    range: [0, xMax],
    domain: [Math.min(...data.map(x)), Math.max(...data.map(x))]
  });

  const yScale2 = scaleLinear({
    range: [yMax, 0],
    domain: [0, 3],
    //domain: [0, Math.max(...data.map(y))],
    nice: true
  });



  return (
    <svg width={width} height={height}>
      
      <Grid
        top={margin.top}
        left={margin.left}
        xScale={xScale2}
        yScale={yScale2}
        stroke="#a6a6a6"
        width={xMax}
        height={yMax}
        numTicksRows={numTicksForHeight(height)}
        numTicksColumns={numTicksForWidth(width)}
      />
      <Group top={margin.top} left={margin.left}>
        <LinePath
          data={data}
          x={x}
          y={y}
          xScale={xScale2}
          yScale={yScale2}
          stroke={survey_colors[data[0].category]}
          strokeWidth={3}
          curve={curveMonotoneX}
        />
        {data.map((d, i) => {
          const cx = xScale2(d.date);
          const cy = yScale2(d.value);
          return (
            <g key={`line-point-${i}`}>
              <GlyphDot cx={cx} cy={cy} r={6} fill={secondary} stroke={primary} strokeWidth={3} />
            </g>
          );
        })}
      </Group>
      <Group left={margin.left}>
        <AxisLeft
          top={margin.top}
          left={0}
          scale={yScale2}
          hideZero
          numTicks={numTicksForHeight(height)}
          label="Mean Question Score"
          labelProps={{
            fill: '#333333',
            textAnchor: 'middle',
            fontSize: 14,
            fontFamily: 'Arial'
          }}
          stroke="#1a1a1a"
          tickStroke="#1a1a1a"
          tickLabelProps={(value, index) => ({
            fill: '#1a1a1a',
            textAnchor: 'end',
            fontSize: 10,
            fontFamily: 'Arial',
            dx: '-0.25em',
            dy: '0.25em'
          })}
          tickComponent={({ formattedValue, ...tickProps }) => (
            <text {...tickProps}>{formattedValue}</text>
          )}
        />
        <AxisBottom
          top={height - margin.bottom}
          left={0}
          scale={xScale2}
          numTicks={numTicksForWidth(width)}
          label="Day"
          labelProps={{
            fill: '#333333',
            textAnchor: 'middle',
            fontSize: 14,
            fontFamily: 'Arial'
          }}
        >
          {axis => {
            const tickLabelSize = 10;
            const tickRotate = 45;
            const tickColor = '#1a1a1a';
            const axisCenter = (axis.axisToPoint.x - axis.axisFromPoint.x) / 2;
            return (
              <g className="my-custom-bottom-axis">
                {axis.ticks.map((tick, i) => {
                  const tickX = tick.to.x;
                  const tickY = tick.to.y + tickLabelSize + axis.tickLength;
                  return (
                    <Group key={`vx-tick-${tick.value}-${i}`} className={'vx-axis-tick'}>
                      <Line from={tick.from} to={tick.to} stroke={tickColor} />
                      <text
                        transform={`translate(${tickX}, ${tickY}) rotate(${tickRotate})`}
                        fontSize={tickLabelSize}
                        textAnchor="middle"
                        fill={tickColor}
                      >
                        {tick.formattedValue}
                      </text>
                      {/*<text textAnchor="middle" transform={`translate(${axisCenter}, 50)`} fontSize="24">
                        {axis.label}
                      </text>*/}
                    </Group>
                  );
                })}

              </g>
            );
          }}
        </AxisBottom>
      </Group>
    </svg>
  );
});