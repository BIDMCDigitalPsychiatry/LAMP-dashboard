
// Core Imports
import React, { useState } from 'react'
import { 
  XYChart, theme, withParentSize, CrossHair, LineSeries, 
  AreaSeries, PointSeries, WithTooltip, XAxis, YAxis, 
  Brush, LinearGradient, PatternLines
} from '@data-ui/xy-chart'

// TODO: ***IntervalSeries, (future) BarSeries/Histogram, ViolinPlot

export default withParentSize(function Sparkline({ ...props }) {
  const [rand, setRand] = useState(Math.random())

  const renderTooltip = ({ datum, series }) => (
    <div>
      <div>
        <strong style={{ fontFamily: 'Roboto' }}>{datum.x.toLocaleString('en-US', Date.formatStyle('full'))}</strong>
        {(!series || Object.keys(series).length === 0) && <div style={{ fontFamily: 'Roboto' }}>{datum.y}</div>}
      </div>
      <br />
      {(series && series[props.YAxisLabel || 'Data']) && (
        <div key={props.YAxisLabel || 'Data'}>
          <span
            style={{
              color: props.color,
              textDecoration:
                series[props.YAxisLabel || 'Data'] === datum
                  ? `underline dotted ${props.color}`
                  : null,
              fontWeight: series[props.YAxisLabel || 'Data'] === datum ? 900 : 500,
              fontFamily: 'Roboto'
            }}
          >
            {`${props.YAxisLabel || 'Data'} `}
          </span>
          <span style={{ fontFamily: 'Roboto' }}>{series[props.YAxisLabel || 'Data'].y}</span>
        </div>
      )}
    </div>
  )

  return (
    <WithTooltip renderTooltip={renderTooltip}>
      {({ onMouseLeave, onMouseMove, tooltipData }) => (
        <XYChart
          theme={theme}
          ariaLabel="Chart"
          width={Math.max(props.minWidth, props.parentWidth)}
          height={Math.max(props.minHeight, props.parentHeight)}
          eventTrigger={'container'}
          eventTriggerRefs={props.eventTriggerRefs}
          margin={{ top: 4, left: 4, 
            right: !!props.YAxisLabel ? 64 : 4, 
            bottom: !!props.XAxisLabel ? 64 : 4 
          }}
          onClick={({ datum }) => !!props.onClick && props.onClick(datum)}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          renderTooltip={null}
          snapTooltipToDataX
          tooltipData={tooltipData}
          xScale={{ type: 'time', domain: props.data.length <= 0 ? undefined : [
              props.startDate || props.data.slice(0, 1)[0].x, 
              props.data.slice(-1)[0].x
          ]}}
          yScale={{ type: 'linear' }}
        > 
          <PatternLines id={`brush-${rand}`} height={12} width={12} stroke={props.color} strokeWidth={1} orientation={['diagonal']} />
          <LinearGradient id={`gradient-${rand}`} from={props.color} to="#ffffff00" />
          {props.XAxisLabel && 
            <XAxis label={props.XAxisLabel} numTicks={5} />
          }
          {props.YAxisLabel &&
            <YAxis label={props.YAxisLabel} numTicks={4} />
          }
          <LineSeries 
            data={props.data} 
            seriesKey={props.YAxisLabel || 'Data'} 
            stroke={props.color} 
            strokeWidth={2} 
            strokeDasharray="3 1" 
            strokeLinecap="butt" 
            dashType="dotted" 
          />
          <AreaSeries 
            data={props.data} 
            seriesKey={props.YAxisLabel || 'Data'} 
            fill={`url('#gradient-${rand}')`} 
            strokeWidth={0} 
          />
          <PointSeries 
            data={props.data} 
            seriesKey={props.YAxisLabel || 'Data'} 
            fill={props.color} 
            fillOpacity={1} 
            strokeWidth={0} 
          />
          <CrossHair
            fullHeight
            showHorizontalLine={false}
            stroke={props.color}
            strokeDasharray="3 1"
            circleSize={d => (d.y === tooltipData.datum.y ? 6 : 4)}
            circleStroke={d => (d.y === tooltipData.datum.y ? '#fff' : props.color)}
            circleStyles={{ strokeWidth: 1.5 }}
            circleFill={d => (d.y === tooltipData.datum.y ? props.color : '#fff')}
            showCircle
          />
          <Brush selectedBoxStyle={{ fill: `url(#brush-${rand})`, stroke: props.color }} />
        </XYChart>
      )}
    </WithTooltip>
  )
})
