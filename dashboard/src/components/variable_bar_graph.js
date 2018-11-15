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

const surveyMap = {
    "Today I feel anxious": "Anxious",
    "Today I cannot stop worrying": "Constant Worry",
    "Today I am worrying too much about different things": "Many Worries",
    "Today I have trouble relaxing": "Can't Relax",
    "Today I feel so restless it's hard to sit still": "Restless",
    "Today I am easily annoyed or irritable": "Irritable",
    "Today I feel afraid something awful might happen": "Afraid",
    "Today I have heard voices or saw things others cannot": "Voices",
    "Today I have had thoughts racing through my head": "Racing Thoughts",
    "Today I feel I have special powers": "Special Powers",
    "Today I feel people are watching me": "People watching me",
    "Today I feel people are against me": "People against me",
    "Today I feel confused or puzzled": "Confused",
    "Today I feel unable to cope and have difficulty with everyday tasks": "Unable to cope",
    "In the last THREE DAYS, I have had someone to talk to": "Someone to talk to",
    "In the last THREE DAYS, I have felt uneasy with groups of people": "Uneasy in groups",
    "Today I feel little interest or pleasure": "Low interest",
    "Today I feel depressed": "Depressed",
    "Today I had trouble sleeping": "Trouble Sleeping",
    "Today I feel tired or have little energy": "Low Energy",
    "Today I have a poor appetite or am overeating": "Low/High Appetite",
    "Today I feel bad about myself or that I have let others down": "Poor self-esteem",
    "Today I have trouble focusing or concentrating": "Can't focus",
    "Today I feel too slow or too restless": "Feel slow",
    "Today I have thoughts of self-harm": "Self-harm",
    "Last night I had trouble falling asleep": "Can't fall asleep",
    "Last night I had trouble staying asleep": "Can't stay asleep",
    "This morning I was up earlier than I wanted": "Waking up early",
    "In the last THREE DAYS, I have taken my medications as scheduled": "Medication",
    "In the last THREE DAYS, during the daytime I have gone outside my home": "Spent time outside",
    "In the last THREE DAYS, I have preferred to spend time alone": "Prefer to be alone",
    "In the last THREE DAYS, I have had arguments with other people": "Arguments with others"
}

// accessors
const x = d => d.item;

let tooltipTimeout;

export default withTheme()(withParentSize(withTooltip(props => {
    let width = props.width || props.parentWidth
    let height = props.height || props.parentHeight

    let originalHeight = height
    height -= 120

    let originalWidth = width
    width -= 55

    let tooltipOpen = props.tooltipOpen
    let tooltipLeft = props.tooltipLeft
    let tooltipTop = props.tooltipTop
    let tooltipData = props.tooltipData
    let hideTooltip = props.hideTooltip
    let showTooltip = props.showTooltip

    let data = (typeof props.data === "undefined") ? [...Array(10).keys()].map(x => ({
            value: Math.floor(Math.random() * 50) + 25,
            elapsed_time: Math.floor(Math.random() * 10000),
            activity_type: "mock"
        })) : props.data.detail

    data.forEach(x => {x.item = isNaN(parseFloat(x.item)) ? x.item : parseInt(x.item)})

    let padding = (0.01 * width)
    width -= ((data.length - 1) * padding)


    let maxValue = props.data.activity_type === "game" ? data.reduce((a, b) => Math.max(a, b.item), 0) : data.reduce((a, b) => Math.max(a, b.value), 0)
	let totalWidth = data.reduce((a, b) => a + b.elapsed_time, 0)

	let widthScale = !!width ? (width / totalWidth) : 1.0
	let heightScale = !!height ? (height / maxValue) : 1.0

	data = props.data.activity_type === "game" ? data.map(x => ({ x: x.elapsed_time * widthScale, y: x.item * heightScale })) : data.map(x => ({ x: x.elapsed_time * widthScale, y: (x.value + 0.25) * heightScale }))
	maxValue *= heightScale


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
						onMouseLeave={data => event => tooltipTimeout = setTimeout(hideTooltip, 300)}
						onMouseMove={data => event => {
							if (tooltipTimeout) clearTimeout(tooltipTimeout)
                            let box = event.target.getBoundingClientRect()
							let detail = props.data.detail[i]
                            showTooltip({
                                tooltipData: {
                                	title: detail.item,
									subtitle: isNaN(parseFloat(detail.value)) ? detail.value : parseFloat(Math.round(detail.value * 100) / 100).toFixed(2)
								},
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
                        const tickRotate = typeof props.data === "undefined" ? 0 : (props.data.activity_type === "game" ? 0 : 60);
                        const tickFontFamily = 'Roboto'
                        const tickColor = (props.theme.palette.type || 'light') === 'light' ? '#212121' : '#ffffff';
                        const axisCenter = (tickProps.axisToPoint.x - tickProps.axisFromPoint.x) / 2;

                        if (data.length === 0) {
                        	return
                        } else {
                        return (
                            <g className="my-custom-bottom-axis">
                                {tickProps.ticks.map((tick, i) => {
                                    const tickX = data.slice(0, i).reduce((a, b) => a + b.x + (i > 0 ? padding : 0), 0) + (data[i].x/2)
                                    const tickY = tick.to.y  + tickProps.tickLength + 5;
                                    tick.from.x = tickX
									tick.to.x = tickX
									let str = props.data.detail[i].item
									str = surveyMap[str] || str

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
                        );}
                    }}
                </AxisBottom>
			</Group>
		</svg>
    {tooltipOpen && (
        <Card elevation={20} style={{position: 'fixed', zIndex: 1, top: tooltipTop, left: tooltipLeft, padding: '.3rem', minWidth: 60 }}>
            <Typography variant="h6">
				{tooltipData.title}
            </Typography>
            <Typography variant="body1">
				{tooltipData.subtitle}
            </Typography>
        </Card>
    )}
		</div>
	)
})))
