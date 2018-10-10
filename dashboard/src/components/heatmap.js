import React from 'react';
import { Group } from '@vx/group';
import { genBins } from '@vx/mock-data';
import { scaleLinear } from '@vx/scale';
import { HeatmapRect } from '@vx/heatmap';
import { max } from 'd3-array';

const data = genBins(32, 1);

// accessors
const x = d => d.bin;
const y = d => d.bins;
const z = d => d.count;

export default ({width}) => {

    // bounds
    const size = width;
    const xMax = size;
    const height = 100;
    const yMax = height;
    const maxBucketSize = max(data, d => y(d).length);
    const bWidth = xMax / data.length;
    const bHeight = yMax / maxBucketSize;
    const colorMax = max(data, d => max(y(d), z));

    // scales
    const xScale = scaleLinear({
        range: [0, xMax],
        domain: [0, data.length]
    });
    const yScale = scaleLinear({
        range: [yMax, 0],
        domain: [0, maxBucketSize]
    });
    const colorScale = scaleLinear({
        range: ['#122549', '#b4fbde'],
        domain: [0, colorMax]
    });
    const opacityScale = scaleLinear({
        range: [0.1, 5],
        domain: [0, colorMax]
    });

    return (
        <svg width={'100%'} height={'100%'}>
                <HeatmapRect
                    data={data}
                    xScale={xScale}
                    yScale={yScale}
                    colorScale={colorScale}
                    opacityScale={opacityScale}
                    binWidth={bWidth}
                    binHeight={bWidth}
                    gap={2}
                    onClick={data => event => {
                        alert(`clicked: ${JSON.stringify(data.bin)}`);
                    }}
                />
        </svg>
    );
};