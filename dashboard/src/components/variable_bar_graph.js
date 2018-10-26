import React from 'react';
import { Bar } from '@vx/shape';
import { Group } from '@vx/group';
import { scaleBand, scaleLinear, scaleTime } from '@vx/scale';
import { extent, max } from 'd3-array';
import { AxisBottom, AxisLeft } from '@vx/axis';
import { withParentSize } from '@vx/responsive';


// accessors
const x = d => d.item;

export default withParentSize(props => {
	let width = props.width || props.parentWidth
	let height = props.height || props.parentHeight

	let data = props.data.detail || [...Array(10).keys()].map(x => ({
		value: Math.floor(Math.random() * 50) + 25,
		elapsed_time: Math.floor(Math.random() * 10000)
	}))

	let padding = (0.01 * width)
	width -= ((data.length - 1) * padding)

	// At the moment, only games have summaries, so we can use this to differentiate
	let maxValue = props.data.activity_type === "game" ? data.reduce((a, b) => Math.max(a, b.item), 0) : data.reduce((a, b) => Math.max(a, b.value), 0)
	let totalWidth = data.reduce((a, b) => a + b.elapsed_time, 0)

	let widthScale = !!width ? (width / totalWidth) : 1.0
	let heightScale = !!height ? (height / maxValue) : 1.0

	data = props.data.activity_type === "game" ? data.map(x => ({ x: x.elapsed_time * widthScale, y: x.item * heightScale })) : data.map(x => ({ x: x.elapsed_time * widthScale, y: x.value * heightScale }))
	maxValue *= heightScale

    const xScale = scaleBand({
        rangeRound: [0, totalWidth],
        domain: data.map(x),
        padding: 0.2
    });

	return (
		<svg width="100%" height="100%">
			<Group>
				{data.map((x, i) =>
					<Bar
						width={x.x}
						height={x.y}
						x={data.slice(0, i).reduce((a, b) => a + b.x + (i > 0 ? padding : 0), 0)}
						y={(maxValue - x.y)}
						fill="#b7b7b7"
						data={x}
						onClick={data => event => {
							alert(`clicked: ${JSON.stringify(data)}`)
						}}
					/>
				)}
                <AxisBottom
                    scale={xScale}
                    top={maxValue}
                    stroke="#b7b7b7"
                    tickStroke="#b7b7b7"
                    tickLabelProps={(value, index) => ({
                        fill: '#b7b7b7',
                        fontSize: 11,
                        textAnchor: 'middle'
                    })}
                />
			</Group>
		</svg>
	)
})