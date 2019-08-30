
// Core Imports
import React, { useState } from 'react'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Icon from '@material-ui/core/Icon'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Popover from '@material-ui/core/Popover'
import blue from '@material-ui/core/colors/blue'

// Local Imports
import Sparkline from '../components/Sparkline'
import { ArrayView, ResponsiveDialog, groupBy, mediumDateFormat } from '../components/Utils'

const strategies = {
    'lamp.survey': (slices) => slices
        .map(x => (parseInt(x.value) || (['Yes', 'True'].includes(x.value) ? 1 : 0)))
        .reduce((prev, curr) => prev + curr, 0),
    'lamp.jewels_a': (slices) => slices
        .map(x => (parseInt(x.item) || 0))
        .reduce((prev, curr) => (prev > curr ? prev : curr), 0),
}

export default function ActivityCard({ activity, events, ...props }) {
    let freeText = activity.settings.map(x => x.type).filter(x => [null, 'text', 'paragraph'].includes(x)).length

    const [ visibleSlice, setVisibleSlice ] = useState()
    const [ helpAnchor, setHelpAnchor ] = useState()
    const [ showGrid, setShowGrid ] = useState(Boolean(freeText))
    
    return (
        <React.Fragment>
            <Box display="flex" justifyContent="space-between" alignContent="center" m={2}>
                <Tooltip title="Switch Views">
                    <IconButton onClick={event => setShowGrid(!showGrid)}>
                        <Icon fontSize="small">dashboard</Icon>
                    </IconButton>
                </Tooltip>
                <Tooltip title={Boolean(visibleSlice) ? activity.name : `Activity Type`}>
                    <Typography variant="h6" align="center" style={{ marginTop: 6, flexGrow: 1 }}>
                        {!Boolean(visibleSlice) ? activity.name :
                            <React.Fragment>
                                <IconButton onClick={event => setVisibleSlice()} style={{ marginTop: -6 }}>
                                    <Icon fontSize="small">arrow_back</Icon>
                                </IconButton>
                                {visibleSlice.x.toLocaleString('en-US', mediumDateFormat)}
                            </React.Fragment>
                        }
                    </Typography>
                </Tooltip>
                <Tooltip title="Show App Screenshot">
                    <IconButton onClick={event => setHelpAnchor(event.currentTarget)}>
                        <Icon fontSize="small">help</Icon>
                    </IconButton>
                </Tooltip>
            </Box>
            <Divider style={{ marginBottom: 16 }} />
            {Boolean(visibleSlice) ? 
                ((visibleSlice.slice || []).length === 0 ?
                    <Typography variant="subtitle2" style={{ margin: 16 }}>
                        No detail view available.
                    </Typography> :
                    <ArrayView 
                        hiddenKeys={['x']}
                        value={(visibleSlice.slice || []).map(x => ({ 
                            item: x.item, value: x.value, 
                            time_taken: (x.duration / 1000).toFixed(1) + 's' 
                        }))} 
                    />
                ) : (showGrid ?
                    <ArrayView value={
                        Object.values(groupBy(
                            events
                                .map(d => d.temporal_events.map(t => ({ 
                                    item: t.item, [(new Date(d.timestamp)).toLocaleString('en-US', mediumDateFormat)]: t.value 
                                })))
                                .reduce((x, y) => x.concat(y), []),
                            'item'
                        ))
                        .map(v => Object.assign({}, ...v))
                        .reduce((x, y) => x.concat(y), [])
                    } /> :
                    <Sparkline 
                        minWidth={250}
                        minHeight={250}
                        XAxisLabel="Time"
                        YAxisLabel="Score"
                        color={blue[500]}
                        data={events
                              .map(d => ({ 
                                  x: new Date(d.timestamp), 
                                  y: strategies[d.static_data.survey_name !== undefined ? 'lamp.survey' : 'lamp.jewels_a'](d.temporal_events),
                                  slice: d.temporal_events
                              }))}
                        onClick={(datum) => setVisibleSlice(datum)}
                        lineProps={{
                          dashArray: '3 1',
                          dashType: 'dotted',
                          cap: 'butt'
                        }} 
                    />
                )
            }
            <Popover
                open={Boolean(helpAnchor)}
                anchorEl={helpAnchor}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                onClose={event => setHelpAnchor()}
                disableRestoreFocus
            >
                {activity.spec === 'lamp.survey' ? 
                    <img style={{ width: 300, height: 600}} src={`https://lamp-splash.s3.us-east-2.amazonaws.com/sample/survey.png`} /> :
                    <img style={{ width: 300, height: 600}} src={`https://lamp-splash.s3.us-east-2.amazonaws.com/sample/${activity.name.toLowerCase().replace(/[^0-9a-z]/gi, '')}.png`} />
                }
            </Popover>
        </React.Fragment>
    )
}
