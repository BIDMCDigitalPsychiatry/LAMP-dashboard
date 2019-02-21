import React from 'react';
import { scaleLinear, scaleTime } from '@vx/scale';
import { HeatmapRect } from '@vx/heatmap';
import { max } from 'd3-array';
import { AxisBottom } from '@vx/axis';
import { withTooltip } from '@vx/tooltip';
import { withParentSize } from '@vx/responsive';
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'

// accessors
const y = d => d.bins;
const z = d => d.count;

// mock (default) data
var startDate = new Date("2017-10-01"); //YYYY-MM-DD
var endDate = new Date("2017-10-20"); //YYYY-MM-DD

var defaultDateArray = function(start, end) {
    var arr = new Array();
    var dt = new Date(start);
    while (dt <= end) {
        arr.push(new Date(dt).toLocaleString());
        dt.setDate(dt.getDate() + 1);
    }
    return arr;
}

let tooltipTimeout;

export default withParentSize(withTooltip(({
                                style,
								parentWidth,
                                inputData = [Array.from({length: 20}, (x,i) => i), defaultDateArray(startDate, endDate)],
                                onClick,
                                tooltipOpen,
                                tooltipLeft,
                                tooltipTop,
                                tooltipData,
                                hideTooltip,
                                showTooltip}) => {
    let width = parentWidth

    var timelineData = [[],[]]
    for (var i =0; i < inputData[0].length; i++) {
        timelineData[0][i] = {'bin': i, 'bins': [{'bin': 0, 'count': inputData[0][i]}]}
        timelineData[1][i] = inputData[1][i]
    }

    const xMax = 25*timelineData[0].length;
    const bWidth = 25;
    const yMax = bWidth * 1.2;
	const maxBucketSize = max(timelineData[0], d => y(d).length);
    const colorMax = max(timelineData[0], d => max(y(d), z));

    const xScale = scaleLinear({
        range: [0, xMax],
        domain: [0, timelineData[0].length]
    });
    const xAxisScale = scaleTime({
        rangeRound: [0, xMax],
        domain: [Math.min.apply(null, timelineData[1]), Math.max.apply(null, timelineData[1])],
    });
    const yScale = scaleLinear({
        range: [yMax, 0],
        domain: [0, maxBucketSize]
    });
    const colorScale = scaleLinear({
        range: ['#bfd5ff', '#122549'],
        domain: [0, colorMax]
    });
    const opacityScale = scaleLinear({
        range: [0.5, 5],
        domain: [0, colorMax]
    });

    return (
        <div style={Object.assign({ ...style, position: 'relative', overflow: 'scroll'}, style || {})}>
            <svg width={xMax} height={bWidth * 4}>
                <HeatmapRect style={{cursor: 'pointer'}}
                             data={timelineData[0]}
                             xScale={xScale}
                             yScale={yScale}
                             colorScale={colorScale}
                             opacityScale={opacityScale}
                             binWidth={bWidth}
                             binHeight={bWidth}
                             gap={2}
                             onClick={onClick}
                             onMouseLeave={data => event => tooltipTimeout = setTimeout(hideTooltip, 300)}
                             onMouseMove={data => event => {
                                 if (tooltipTimeout) clearTimeout(tooltipTimeout)
                                 let box = event.target.getBoundingClientRect()
                                 showTooltip({
                                     tooltipData: [timelineData[0][data.datumIndex], timelineData[1][data.datumIndex]],
                                     tooltipTop: box.y + box.height + 16,
                                     tooltipLeft: box.x
                                 });
                             }}
                />
                <AxisBottom
                    scale={xAxisScale}
                    top={yMax + bWidth}
                    stroke="black"
                    tickStroke="black"
                    tickLabelProps={(value, index) => ({
                        fill: 'black',
                        fontSize: 11,
                        textAnchor: 'middle',
                        fontFamily: 'Roboto'
                    })}
                />
            </svg>
            {tooltipOpen && (
                <Card elevation={20} style={{ position: 'fixed', zIndex: 1, top: tooltipTop, left: tooltipLeft, padding: '.3rem', minWidth: 60 }}>
                    <Typography variant="h6">
                        {`Activities Completed: ${tooltipData[0].bins[0]['count']}`}
                    </Typography>
                    <Typography variant="body1">
                        {Date.formatUTC(tooltipData[1], {
                            year: '2-digit', month: '2-digit', day: '2-digit',
                        })}
                    </Typography>
                </Card>
            )}
        </div>
    );
}));