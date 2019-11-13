
// Core Imports
import React from 'react'
import { 
  XYChart, 
  theme, 
  withParentSize,
  withTheme, 
  CrossHair, 
  LineSeries, 
  AreaSeries, 
  WithTooltip, 
  XAxis, 
  YAxis, 
  Brush,
  LinearGradient
} from '@data-ui/xy-chart'

// Local Imports
import { fullDateFormat } from './Utils'

const XYChartWithTheme = withTheme(theme)(XYChart)

class Sparkline extends React.PureComponent {
  rand = Math.random()

  renderTooltip = ({ datum, series }) =>
  <div>
    <div>
      <strong style={{ fontFamily: 'Roboto' }}>{datum.x.toLocaleString('en-US', fullDateFormat)}</strong>
      {(!series || Object.keys(series).length === 0) && <div style={{ fontFamily: 'Roboto' }}>{datum.y}</div>}
    </div>
    <br />
    {[{
      seriesKey: this.props.YAxisLabel || 'Data',
      key: this.props.YAxisLabel || 'Data',
      data: this.props.data.map(x => ({...x, color: this.props.color})),
      stroke: this.props.color,
      strokeDasharray: this.props.lineProps.dashArray || '3 1',
      dashType: this.props.lineProps.dashType || 'dotted',
      strokeLinecap: this.props.lineProps.cap || 'butt'
    }].map(
      ({ seriesKey, stroke: color, dashType }) =>
        series &&
        series[seriesKey] && (
          <div key={seriesKey}>
            <span
              style={{
                color,
                textDecoration:
                  series[seriesKey] === datum
                    ? `underline ${dashType} ${color}`
                    : null,
                fontWeight: series[seriesKey] === datum ? 900 : 500,
                fontFamily: 'Roboto'
              }}
            >
              {`${seriesKey} `}
            </span>
            <span style={{ fontFamily: 'Roboto' }}>{series[seriesKey].y}</span>
          </div>
        ),
    )}
  </div>

  render = () =>
  <WithTooltip renderTooltip={this.renderTooltip}>
    {({ onMouseLeave, onMouseMove, tooltipData }) => (
      <XYChartWithTheme
        ariaLabel="Chart"
        width={Math.max(this.props.minWidth, this.props.parentWidth)}
        height={Math.max(this.props.minHeight, this.props.parentHeight)}
        eventTrigger={'container'}
        eventTriggerRefs={this.eventTriggerRefs}
        margin={{ top: 4, left: 4, 
          right: !!this.props.YAxisLabel ? 64 : 4, 
          bottom: !!this.props.XAxisLabel ? 64 : 4 
        }}
        onClick={({ datum }) => !!this.props.onClick && this.props.onClick(datum)}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        renderTooltip={null}
        snapTooltipToDataX
        tooltipData={tooltipData}
        xScale={{ type: 'time', domain: this.props.data.length <= 1 ? undefined : [
            this.props.startDate || this.props.data.slice(0, 1)[0].x, 
            this.props.data.slice(-1)[0].x
        ]}}
        yScale={{ type: 'linear' }}
      >
        <LinearGradient id={`gradient-${this.rand}`} from={this.props.color} to="#ffffff00" />
        {!this.props.XAxisLabel ? <React.Fragment /> : 
          <XAxis label={this.props.XAxisLabel} numTicks={5} />}
        {!this.props.YAxisLabel ? <React.Fragment /> : 
          <YAxis label={this.props.YAxisLabel} numTicks={4} />}
        {[{
            seriesKey: this.props.YAxisLabel || 'Data',
            key: this.props.YAxisLabel || 'Data',
            data: this.props.data.map(x => ({...x, color: this.props.color})),
            stroke: this.props.color,
            strokeDasharray: this.props.lineProps.dashArray || '3 1',
            dashType: this.props.lineProps.dashType || 'dotted',
            strokeLinecap: this.props.lineProps.cap || 'butt'
          }].map(({ key, ...props }) => (
            <LineSeries 
              {...props}
              key={key}
              showPoints
              strokeWidth={2}
            />
        ))}
        {[{
            seriesKey: this.props.YAxisLabel || 'Data',
            key: this.props.YAxisLabel || 'Data',
            data: this.props.data.map(x => ({...x, color: this.props.color})),
          }].map(({ key, ...props }) => (
            <AreaSeries key={key} data={props.data} fill={`url('#gradient-${this.rand}')`} />
        ))}
        <CrossHair
          fullHeight
          showHorizontalLine={false}
          strokeDasharray=""
          circleSize={d => (d.y === tooltipData.datum.y ? 6 : 4)}
          circleStroke={d => (d.y === tooltipData.datum.y ? '#fff' : d.color)}
          circleStyles={{ strokeWidth: 1.5 }}
          circleFill={d => (d.y === tooltipData.datum.y ? d.color : '#fff')}
          showCircle
        />
        <Brush disableDraggingSelection />
      </XYChartWithTheme>
    )}
  </WithTooltip>
}

export default withParentSize(Sparkline)
