import React from 'react';
import { Bar, Line} from '@vx/shape';
import { Group } from '@vx/group';
import { withParentSize } from '@vx/responsive';
import { withTooltip } from '@vx/tooltip';
import { withTheme } from '@material-ui/core';
import { AxisBottom } from '@vx/axis';
import { scaleBand } from '@vx/scale';
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'

// accessors
const x = d => d.item;

let tooltipTimeout;

export default withTheme()(withParentSize(withTooltip(props => {
	let width = props.width || props.parentWidth
	let height = props.height || props.parentHeight

	let originalHeight =height
	height -= 115

    let originalWidth =width
    width -= 50

	let tooltipOpen = props.tooltipOpen
    let tooltipLeft = props.tooltipLeft
    let tooltipTop = props.tooltipTop
    let tooltipData = props.tooltipData
    let hideTooltip = props.hideTooltip
    let showTooltip = props.showTooltip

	let data = props.data.detail || [...Array(10).keys()].map(x => ({
		value: Math.floor(Math.random() * 50) + 25,
		elapsed_time: Math.floor(Math.random() * 10000)
	}))

	let padding = (0.01 * width)
	width -= ((data.length - 1) * padding)

	let maxValue = props.data.activity_type === "game" ? data.reduce((a, b) => Math.max(a, b.item), 0) : data.reduce((a, b) => Math.max(a, b.value), 0)
	let totalWidth = data.reduce((a, b) => a + b.elapsed_time, 0)

	let widthScale = !!width ? (width / totalWidth) : 1.0
	let heightScale = !!height ? (height / maxValue) : 1.0

	data = props.data.activity_type === "game" ? data.map(x => ({ x: x.elapsed_time * widthScale, y: x.item * heightScale })) : data.map(x => ({ x: x.elapsed_time * widthScale, y: (x.value + 0.25) * heightScale }))
	maxValue *= heightScale

    let anxietyLabels = ["Anxious", "Constant Worry", "Many Worries", "Can't Relax", "Restless", "Irritable", "Afraid", "Voices", "Racing Thoughts", "Special Powers", "People watching me", "People against me", "Confused", "Unable to cope", "Someone to talk to", "Uneasy in groups"]
    let moodLabels = ["Low interest", "Depressed", "Trouble Sleeping", "Low Energy", "Low/High Appetite", "Poor self-esteem", "Can't focus", "Feel slow", "Self-harm", "Can't fall asleep", "Can't stay asleep", "Waking up early", "Medication", "Spent time outside", "Prefer to be alone", "Arguments with others"]

	return (
        <div style={{width:'100%', height:'100%'}}>
		<svg width={originalWidth} height={originalHeight}>
			<Group>
				{data.map((x, i) =>
                    <Bar
						width={x.x}
						height={x.y}
						x={data.slice(0, i).reduce((a, b) => a + b.x + (i > 0 ? padding : 0), 0)}
						y={(maxValue - x.y)}
						fill={(props.theme.palette.type || 'light') === 'light' ? '#212121' : '#ffffff'}
						data={x}
						onClick={data => event => {
                            props.data.activity_type === "game" ? alert(`value: ${JSON.stringify(props.data.detail[i].item)}`) : alert(`value: ${JSON.stringify(props.data.detail[i].value)}`)

                        }}
						onMouseLeave={data => event => tooltipTimeout = setTimeout(hideTooltip, 300)}
						onMouseMove={data => event => {
							if (tooltipTimeout) clearTimeout(tooltipTimeout)
                            let box = event.target.getBoundingClientRect()
                            showTooltip({
                                tooltipData: props.data.detail[i].item,
                                tooltipTop: box.y + box.height + 16,
                                tooltipLeft: box.x
                            });
                        }}
					/>
				)}
                <AxisBottom
                    scale={scaleBand({
						rangeRound: [0, width],
						domain: [...Array(props.data.detail.length).keys()]
                    })}
                    top={maxValue}
                    stroke={(props.theme.palette.type || 'light') === 'light' ? '#212121' : '#ffffff'}
                    tickStroke={(props.theme.palette.type || 'light') === 'light' ? '#212121' : '#ffffff'}
				>
                    {tickProps => {
                        const tickLabelSize = 11;
                        const tickRotate = props.data.activity_type === "game" ? 0 : 60;
                        const tickFontFamily = 'Roboto'
                        const tickColor = (props.theme.palette.type || 'light') === 'light' ? '#212121' : '#ffffff';
                        const axisCenter = (tickProps.axisToPoint.x - tickProps.axisFromPoint.x) / 2;
                        return (
                            <g className="my-custom-bottom-axis">
                                {tickProps.ticks.map((tick, i) => {
                                    const tickX = data.slice(0, i).reduce((a, b) => a + b.x + (i > 0 ? padding : 0), 0) + (data[i].x/2)
                                    const tickY = tick.to.y  + tickProps.tickLength + 5;
                                    tick.from.x = tickX
									tick.to.x = tickX
									let str = props.data.detail[i].item
                                    if (props.data.name.toUpperCase() === "ANXIETY, PSYCHOSIS, AND SOCIAL") {
                                        str = anxietyLabels[i]
                                    } else if (props.data.name.toUpperCase() === "MOOD, SLEEP, AND SOCIAL") {
                                        str = moodLabels[i]
                                    }
                                    return (
                                        <Group key={`vx-tick-${tick.value}-${i}`} className={'vx-axis-tick'}>
                                            <Line from={tick.from} to={tick.to} stroke={tickColor} />
                                            <text
                                                transform={`translate(${tickX}, ${tickY}) rotate(${tickRotate})`}
                                                fontSize={tickLabelSize}
                                                textAnchor={props.data.activity_type === "game" ? "middle" : "start"}
                                                fill={tickColor}
												fontFamily={tickFontFamily}
                                            >
                                                {str}
                                            </text>
                                        </Group>
                                    );
                                })}
                                <text textAnchor="middle" transform={`translate(${axisCenter}, 50)`} fontSize="8">
                                    {tickProps.label}
                                </text>
                            </g>
                        );
                    }}
                </AxisBottom>
			</Group>
		</svg>
    {tooltipOpen && (
        <Card elevation={20} style={{position: 'fixed', zIndex: 1, top: tooltipTop, left: tooltipLeft, padding: '.3rem', minWidth: 60 }}>
            <Typography variant="title">
				{tooltipData}
            </Typography>
            <Typography variant="body2">
				{`Target / Question`}
            </Typography>
        </Card>
    )}
		</div>
	)
})))
