import React from 'react';
import { Bar } from '@vx/shape';
import { Group } from '@vx/group';
import { extent, max } from 'd3-array';
import { AxisBottom, AxisLeft } from '@vx/axis';
import { withParentSize } from '@vx/responsive';

export default withParentSize(props => {
	let width = props.width || props.parentWidth
	let height = props.height || props.parentHeight

	let data = [...Array(10).keys()].map(x => ({
		value: Math.floor(Math.random() * 50) + 25,
		duration: Math.floor(Math.random() * 10000)
	}))
	let padding = (0.01 * width)
	width -= ((data.length - 1) * padding)

	let maxValue = data.reduce((a, b) => Math.max(a, b.value), 0)
	let totalWidth = data.reduce((a, b) => a + b.duration, 0)

	let widthScale = !!width ? (width / totalWidth) : 1.0
	let heightScale = !!height ? (height / maxValue) : 1.0

	data = data.map(x => ({ x: x.duration * widthScale, y: x.value * heightScale }))
	maxValue *= heightScale

	return (
		<svg width="100%" height="100%">
			<Group>
				{data.map((x, i) =>
					<Bar
						width={x.x}
						height={x.y}
						x={data.slice(0, i).reduce((a, b) => a + b.x + (i > 0 ? padding : 0), 0)}
						y={(maxValue - x.y)}
						fill="#000"
						data={x}
						onClick={data => event => {
							alert(`clicked: ${JSON.stringify(data)}`)
						}}
					/>
				)}
			</Group>
		</svg>
	)
})