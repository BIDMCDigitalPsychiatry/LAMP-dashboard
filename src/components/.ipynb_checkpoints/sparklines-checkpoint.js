import React from 'react';
import { Grid } from '@vx/grid';
import { Group } from '@vx/group';
import { range } from 'd3-array';
import {
	Sparkline,
	LineSeries,
	HorizontalReferenceLine,
	VerticalReferenceLine,
	BandLine,
	PatternLines,
	PointSeries,
	WithTooltip } from '@data-ui/sparkline';
import { allColors } from '@data-ui/theme'; // open-color colors
import { XYChart, BarSeries, CrossHair, XAxis, YAxis, LinearGradient } from '@data-ui/xy-chart';

const sparklineProps = {
  ariaLabel: 'This is a Sparkline of...',
  width: 1000,
  height: 200,
  margin: { top: 24, right: 64, bottom: 24, left: 64 },
  valueAccessor: d => d.value,
};

 const shortDateFormat = {
        year: '2-digit', month: '2-digit', day: '2-digit',
 }

const renderTooltip = (
  { datum }, // eslint-disable-line react/prop-types
) => (
  <div>
    {!!datum.date ? <div>{datum.date.toLocaleString('en-US', shortDateFormat)}</div> : <React.Element/>}
    <div>{datum.value >= 0 ? datum.value.toFixed(2) : '--'}</div>
  </div>
);

const renderLabel = d => d.toFixed(2);

export default (props) => {
	let width = props.width
	let height = props.height
	let data = props.data

  return (
	  
        <XYChart
          ariaLabel="Required label"
          xScale={{ type: 'time' }}
          yScale={{ type: 'linear' }}
        >
          <YAxis label="Price ($)" numTicks={4} />
          <LinearGradient id="aqua_lightaqua_gradient" to="#faa2c1" from="#e64980" />
          <BarSeries data={data} fill="url(#aqua_lightaqua_gradient)" />
          <LineSeries data={data} stroke={allColors.indigo[4]} />
          <XAxis label="Time" numTicks={5} />
          <CrossHair />
        </XYChart>


);
};
