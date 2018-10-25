import React from 'react';
import { Group } from '@vx/group';
import { genBins } from '@vx/mock-data';
import { scaleBand, scaleLinear, scaleTime } from '@vx/scale';
import { HeatmapRect } from '@vx/heatmap';
import { max } from 'd3-array';
import { AxisBottom } from '@vx/axis';
import { timeParse, timeFormat } from 'd3-time-format';
import { withTooltip, Tooltip } from '@vx/tooltip';

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

export default withTooltip(({
                                width,
                                inputData = [Array.from({length: 20}, (x,i) => i), defaultDateArray(startDate, endDate)],
                                tooltipOpen,
                                tooltipLeft,
                                tooltipTop,
                                tooltipData,
                                hideTooltip,
                                showTooltip}) => {

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

        <div style={{ position: 'relative', height: '100%' }}>
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
                             onClick={data => event => {
                                 alert(`activities: ${JSON.stringify(data.bin['count'])}`);
                             }}
                             onMouseLeave={data => event => {
                                 tooltipTimeout = setTimeout(() => {
                                     hideTooltip();
                                 }, 300);
                             }}
                             onMouseMove={data => event => {
                                 if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                 const top = event.clientY - 40 - data.height;
                                 const left = xScale(data.datumIndex);
                                 showTooltip({
                                     tooltipData: [timelineData[0][data.datumIndex],timelineData[1][data.datumIndex]],
                                     tooltipTop: -yMax/2,
                                     tooltipLeft: left
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
                <Tooltip
                    top={tooltipTop}
                    left={tooltipLeft}
                    style={{
                        minWidth: 60,
                        backgroundColor: 'rgba(0,0,0,0.9)',
                        color: 'white'
                    }}
                >
                    <div style={{ color: 'white' }}>
                        <strong>{`Activities Completed: ${tooltipData[0].bins[0]['count']}`}</strong>
                    </div>
                    <div>
                        <small>{new Date(tooltipData[1]).toLocaleString('en-US', {
                            timeZone: 'America/New_York', year: '2-digit', month: '2-digit', day: '2-digit',
                        })}</small>
                    </div>
                </Tooltip>
            )}
        </div>
    );
});