import React from 'react'
import LAMP from '../lamp.js'
import { Bar, Line} from '@vx/shape'
import { Group } from '@vx/group'
import { withParentSize } from '@vx/responsive'
import { withTooltip } from '@vx/tooltip'
import { withTheme } from '@material-ui/core'
import { AxisBottom, AxisLeft } from '@vx/axis'
import { scaleBand, scaleLinear } from '@vx/scale'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import { rangeTo } from '../components/utils'
import { Text } from '@vx/text'

// Only one tooltip may be present on-screen at a time; this holds its timeout info.
let tooltipTimeout;

export default withTheme()(withParentSize(withTooltip(props => {
	if (!props.data || props.data.length === 0) return null;
	let data = props.data

	//Change y if trails/jewels
	data = data.map((x, i) => ({
		...x,
		y: x.y == null ? parseInt(x.longTitle) : x.y
	}))	

	// Set the fill color based on the current material UI theme.
	let fillColor = (props.theme.palette.type || 'light') === 'light' ? '#212121' : '#ffffff'

	// If no width or height is manually provided, take the parent element's.
	// Adjust the width and height to support axes and 1% padding.
	let width = props.width || props.parentWidth
	let height = props.height || props.parentHeight
    let originalHeight = height
    height -= 120 + 30
    let originalWidth = width
    width -= 55
    let padding = (0.01 * width)
    width -= ((data.length - 1) * padding)


	// Determine the maximum X and Y values possible in the provided data.
	// Using both, convert them into a scaling value to preserve aspect ratio.
    let maxValue = data.reduce((a, b) => Math.max(a, b.y), 0)
	let totalWidth = data.reduce((a, b) => a + b.x, 0) - 70
	let widthScale = !!width ? (width / totalWidth) : 1.0
	let heightScale = !!height ? (height / maxValue) : 1.0

  const yScale2 = scaleLinear({
    range: [height+20, 0],
    domain: [0, maxValue],
    //domain: [0, Math.max(...data.map(y))],
    nice: true
  });

	maxValue *= heightScale

	// Customize the X and Y positions, adding 0.25 to offset all values.
	data = data.map((x, i) => ({
		...x,
		barWidth: x.x * widthScale,
		barHeight: (x.y + 0.25) * heightScale,
		barX: data.slice(0, i).reduce((a, b) => a + (b.x * widthScale) + (i > 0 ? padding : 0), 0) + 70,
		barY: maxValue - ((x.y + 0.25) * heightScale) + 30
	}))

	return (
		<div style={{ width: '100%', height: '100%' }}>
			<svg width={originalWidth} height={originalHeight}>
				<Group>
					{data.map((x, i) =>
						<Bar
							width={x.barWidth}
							height={x.barHeight}
							x={x.barX}
							y={x.barY}
							fill={fillColor}
							data={x}
							onMouseLeave={data => event => tooltipTimeout = setTimeout(props.hideTooltip, 300)}
							onMouseMove={data => event => {

								// Clear the existing tooltip and recompute the location and show it.
								if (tooltipTimeout)
									clearTimeout(tooltipTimeout)
								let box = event.target.getBoundingClientRect()
								props.showTooltip({
									tooltipData: x,
									tooltipTop: box.y + box.height + 16,
									tooltipLeft: box.x
								})
							}}
						/>
					)}
					<AxisLeft
				          top={10}
				          left={55}
				          scale={yScale2}
				          numTicks={5}
				          stroke={fillColor}
				          tickStroke={fillColor}
				          label={props.yLabel || "Value"}
				          labelProps={{
				            fill: '#333333',
				            textAnchor: 'middle',
				            fontSize: 14,
				            fontFamily: 'Arial'
				          }}
				          tickLabelProps={(value, index) => ({
				            fill: fillColor,
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
						scale={scaleBand({
							rangeRound: [0, width],
							domain: rangeTo(data.length)
						})}
						top={maxValue+30}
						stroke={fillColor}
						tickStroke={fillColor}>
						{tickProps => (data.length >= 0) && (<g>
							{tickProps.ticks.map((tick, i) => {
								const tickX = data.slice(0, i).reduce((a, b) => a + b.barWidth + (i > 0 ? padding : 0), 0) + (data[i].barWidth / 2) + 70
								const tickY = tick.to.y + tickProps.tickLength + 5
								tick.from.x = tickX; tick.to.x = tickX
								return (
									<Group key={`vx-tick-${tick.value}-${i}`}>
										<Line from={tick.from} to={tick.to} stroke={fillColor}/>
										<Text
											transform={`translate(${tick.to.x}, ${tickY}) rotate(${(props.rotateText || false) ? 60 : 0})`}
											fontSize={11}
											textAnchor={"middle"}
											verticalAnchor={"start"}
											width={data[i].barWidth}
											fill={fillColor}
											fontFamily="Roboto">
											{data[i].shortTitle || data[i].longTitle || ''}
										</Text>
									</Group>
								)
							})}
							<text
								textAnchor="middle"
								transform={`translate(${(tickProps.axisToPoint.x - tickProps.axisFromPoint.x) / 2}, 50)`}
								fontSize="8">
								{tickProps.label}
							</text>
						</g>)}
					</AxisBottom>
				</Group>
			</svg>
			{props.tooltipOpen && (
				<Card elevation={20} style={{
					position: 'fixed',
					zIndex: 1,
					top: props.tooltipTop,
					left: props.tooltipLeft,
					padding: '.3rem',
					minWidth: 60
				}}>
					<Typography variant="h6">
						{props.tooltipData.longTitle || ''}
					</Typography>
					<Typography variant="body1">
						{isNaN(parseFloat(props.tooltipData.y)) ?
							(props.tooltipData.y || '') :
							parseFloat(Math.round(props.tooltipData.y * 100) / 100).toFixed(2)}
					</Typography>
				</Card>
			)}
		</div>
	)
})))
