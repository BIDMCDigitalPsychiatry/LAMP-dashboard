import React from 'react';
import { Group } from '@vx/group';
import { genBins } from '@vx/mock-data';
import { scaleBand, scaleLinear, scaleTime } from '@vx/scale';
import { HeatmapRect } from '@vx/heatmap';
import { max } from 'd3-array';
import { AxisBottom } from '@vx/axis';
import { timeParse, timeFormat } from 'd3-time-format';
import { withTooltip, Tooltip } from '@vx/tooltip';
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

    let axisData = timelineData[1].filter((element, index) => {
        return (index % 5 === 0);
    })

    // bounds
    const size = width;
    const xMax = size;
    const maxBucketSize = max(timelineData[0], d => y(d).length);
    const bWidth = xMax / timelineData[0].length;
    const height = bWidth*1.5;
    const yMax = height;
    const colorMax = max(timelineData[0], d => max(y(d), z));

    // scales
    const xScale = scaleLinear({
        range: [0, xMax],
        domain: [0, timelineData[0].length]
    });
    // const xAxisScale = scaleBand({
    //     rangeRound: [0, xMax],
    //     domain: axisData,
    //     padding: 0.2,
    //     tickFormat: () => val => new Date(val).toLocaleString('en-US', {weekday: 'short', day: '2-digit', month: '2-digit'})
    // });

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
        <div style={Object.assign({ ...style, position: 'relative', height: '100%' }, style || {})}>
            <svg width={width} height={'100%'}>
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
                                     tooltipTop: box.y + box.height,
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
                <Card elevation={20} style={{ position: 'absolute', top: tooltipTop, left: tooltipLeft, padding: '.5rem', minWidth: 60 }}>
                    <Typography variant="title">
                        {`Activities Completed: ${tooltipData[0].bins[0]['count']}`}
                    </Typography>
                    <Typography variant="body2">
                        {new Date(tooltipData[1]).toLocaleString('en-US', {
                            timeZone: 'America/New_York', year: '2-digit', month: '2-digit', day: '2-digit',
                        })}
                    </Typography>
                </Card>
            )}
        </div>
    );
}));