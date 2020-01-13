
// Core Imports
import React from 'react'
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
  PatternLines
} from '@data-ui/xy-chart'

// Local Imports
import { fullDateFormat } from './Utils'

// TODO: ***IntervalSeries, (future) BarSeries/Histogram, ViolinPlot

class Sparkline extends React.PureComponent {
  rand = Math.random()

  renderTooltip = ({ datum, series }) =>
  <div>
    <div>
      <strong style={{ fontFamily: 'Roboto' }}>{datum.x.toLocaleString('en-US', fullDateFormat)}</strong>
      {(!series || Object.keys(series).length === 0) && <div style={{ fontFamily: 'Roboto' }}>{datum.y}</div>}
    </div>
    <br />
    {(series && series[this.props.YAxisLabel || 'Data']) && (
      <div key={this.props.YAxisLabel || 'Data'}>
        <span
          style={{
            color: this.props.color,
            textDecoration:
              series[this.props.YAxisLabel || 'Data'] === datum
                ? `underline dotted ${this.props.color}`
                : null,
            fontWeight: series[this.props.YAxisLabel || 'Data'] === datum ? 900 : 500,
            fontFamily: 'Roboto'
          }}
        >
          {`${this.props.YAxisLabel || 'Data'} `}
        </span>
        <span style={{ fontFamily: 'Roboto' }}>{series[this.props.YAxisLabel || 'Data'].y}</span>
      </div>
    )}
  </div>

  render = () =>
  <WithTooltip renderTooltip={this.renderTooltip}>
    {({ onMouseLeave, onMouseMove, tooltipData }) => (
      <XYChart
        theme={theme}
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
        xScale={{ type: 'time', domain: this.props.data.length <= 0 ? undefined : [
            this.props.startDate || this.props.data.slice(0, 1)[0].x, 
            this.props.data.slice(-1)[0].x
        ]}}
        yScale={{ type: 'linear' }}
      > 
        <PatternLines id={`brush-${this.rand}`} height={12} width={12} stroke={this.props.color} strokeWidth={1} orientation={['diagonal']} />
        <LinearGradient id={`gradient-${this.rand}`} from={this.props.color} to="#ffffff00" />
        {this.props.XAxisLabel && 
          <XAxis label={this.props.XAxisLabel} numTicks={5} />
        }
        {this.props.YAxisLabel &&
          <YAxis label={this.props.YAxisLabel} numTicks={4} />
        }
        <LineSeries 
          data={this.props.data} 
          seriesKey={this.props.YAxisLabel || 'Data'} 
          stroke={this.props.color} 
          strokeWidth={2} 
          strokeDasharray="3 1" 
          strokeLinecap="butt" 
          dashType="dotted" 
        />
        <AreaSeries 
          data={this.props.data} 
          seriesKey={this.props.YAxisLabel || 'Data'} 
          fill={`url('#gradient-${this.rand}')`} 
          strokeWidth={0} 
        />
        <PointSeries 
          data={this.props.data} 
          seriesKey={this.props.YAxisLabel || 'Data'} 
          fill={this.props.color} 
          fillOpacity={1} 
          strokeWidth={0} 
        />
        <CrossHair
          fullHeight
          showHorizontalLine={false}
          stroke={this.props.color}
          strokeDasharray="3 1"
          circleSize={d => (d.y === tooltipData.datum.y ? 6 : 4)}
          circleStroke={d => (d.y === tooltipData.datum.y ? '#fff' : this.props.color)}
          circleStyles={{ strokeWidth: 1.5 }}
          circleFill={d => (d.y === tooltipData.datum.y ? this.props.color : '#fff')}
          showCircle
        />
        <Brush selectedBoxStyle={{ fill: `url(#brush-${this.rand})`, stroke: this.props.color }} />
      </XYChart>
    )}
  </WithTooltip>
}

export default withParentSize(Sparkline)
