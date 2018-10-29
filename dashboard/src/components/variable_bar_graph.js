import React from 'react';
import { Bar } from '@vx/shape';
import { Group } from '@vx/group';
import { withParentSize } from '@vx/responsive';
import { withTooltip } from '@vx/tooltip';
import { withTheme } from '@material-ui/core';
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'

// accessors
const x = d => d.item;

let tooltipTimeout;

export default withTheme()(withParentSize(withTooltip(props => {
	let width = props.width || props.parentWidth
	let height = props.height || props.parentHeight

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

	data = props.data.activity_type === "game" ? data.map(x => ({ x: x.elapsed_time * widthScale, y: x.item * heightScale })) : data.map(x => ({ x: x.elapsed_time * widthScale, y: x.value * heightScale }))
	maxValue *= heightScale

	return (
        <div >
		<svg width="100%" height="100%">
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
							alert(`clicked: ${JSON.stringify(data)}`)
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
