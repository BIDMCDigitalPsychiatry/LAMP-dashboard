
// Core Imports
import React, { useState, useEffect } from 'react'
import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import Switch from '@material-ui/core/Switch'
import Icon from '@material-ui/core/Icon'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Fab from '@material-ui/core/Fab'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Popover from '@material-ui/core/Popover'
import blue from '@material-ui/core/colors/blue'

// External Imports 
//import { Document, Page } from 'react-pdf'

// Local Imports
import LAMP from '../lamp'
import MultipleSelect from '../components/MultipleSelect'
import Sparkline from '../components/Sparkline'
import MultiPieChart from '../components/MultiPieChart'
import Messages from '../components/Messages'
import { ArrayView } from '../components/DataTable'
import { ResponsiveDialog, groupBy } from '../components/Utils'

// TODO: all SensorEvents?

const strategies = {
    'lamp.survey': (slices) => slices
        .map(x => (parseInt(x.value) || (['Yes', 'True'].includes(x.value) ? 1 : 0)))
        .reduce((prev, curr) => prev + curr, 0),
    'lamp.jewels_a': (slices) => slices
        .map(x => (parseInt(x.item) || 0))
        .reduce((prev, curr) => (prev > curr ? prev : curr), 0),
}

export default function Participant({ ...props }) {
    const [ state, setState ] = useState({})

    useEffect(() => {
        (async () => {
            let { id } = props.match.params
            if (id === 'me' && (props.auth.auth || {type: null}).type === 'participant')
                id = props.auth.identity.id
            if (!id || id === 'me') {
                props.history.replace(`/`)
                return
            }

            //

            props.layout.setTitle(`Participant ${id}`)
            LAMP.Type.getDynamicAttachment(id, 'lamp.beta_values').then(res => {
                setState({ ...state, attachments: [JSON.parse(res.data)] })
            }).catch(() => {})

            // Update state now with the new fetched & computed objects.
            let activities = await LAMP.Activity.allByParticipant(id)
            let _state = { ...state,  
                activities: activities, 
                activity_events: groupBy((await LAMP.ResultEvent.allByParticipant(id)).map(x => ({ ...x,
                    activity: activities.find(y => x.activity === y.id || 
                                  (!!x.static_data.survey_name && 
                                      x.static_data.survey_name.toLowerCase() === y.name.toLowerCase()))
                }))
                .map(x => ({ ...x,
                    activity: (x.activity || {name: ''}).name,
                    activity_spec: (x.activity || {spec: ''}).spec || ''
                })), 'activity'),
                sensor_events: groupBy(await LAMP.SensorEvent.allByParticipant(id), 'sensor'),
            }
            setState({ ..._state, 
                activity_counts: Object.assign({}, ...Object.entries((_state.activity_events || {})).map(([k, v]) => ({ [k]: v.length }))),
                sensor_counts: {
                    'Environmental Context': ((_state.sensor_events || {})['lamp.gps.contextual'] || []).length, 
                    'Step Count': ((_state.sensor_events || {})['lamp.steps'] || []).length
                }
            })
        })()
    }, [])

    return (
        <React.Fragment>   
            <Box border={1} borderColor="grey.300" borderRadius={4} p={2} mx="10%">
                <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle2">
                        Activity
                    </Typography>
                    <Box>
                        <Typography variant="subtitle" color="inherit">
                            Show All
                        </Typography>
                        <Switch 
                            size="small"
                            checked={state.showAll} 
                            onChange={() => setState({ ...state, showAll: !state.showAll, selectedCharts: undefined })} 
                        />
                    </Box>
                </Box>
                <MultipleSelect 
                    selected={state.selectedCharts || []}
                    items={(state.activities || []).filter(x => x.spec === 'lamp.survey' || !!state.showAll).map(x => `${x.name}`)}
                    showZeroBadges={false}
                    badges={state.activity_counts}
                    onChange={x => setState({ ...state, selectedCharts: x })}
                />
                <Divider style={{ margin: '8px -16px 8px -16px' }} />
                <Typography variant="subtitle2">
                    Sensor
                </Typography>
                <MultipleSelect 
                    selected={state.selectedPassive || []}
                    items={[`Environmental Context`, `Step Count`]}
                    showZeroBadges={false}
                    badges={state.sensor_counts}
                    onChange={x => setState({ ...state, selectedPassive: x })}
                />
            </Box>
            {((state.selectedCharts || []).length + (state.selectedPassive || []).length) === 0 && 
                <Card style={{ marginTop: 16, marginBotton: 16, height: 96, backgroundColor: blue[700] }}>
                    <Typography variant="h6" style={{ width: '100%', textAlign: 'center', marginTop: 32, color: '#fff' }}>
                        No charts are selected. Please select a chart above to begin.
                    </Typography>
                </Card>
            }
            {(state.activities || []).filter(x => (state.selectedCharts || []).includes(x.name)).map(activity =>
                <Card key={activity.id} style={{ marginTop: 16, marginBotton: 16 }}>
                    <Box m={2} style={{ display: 'flex', justifyContent: 'space-between', alignContent: 'center' }}>
                        <Typography variant="h6" style={{ width: '100%', textAlign: 'center' }}>
                            {activity.name}
                        </Typography>
                        <IconButton onClick={event => setState({ ...state, helpAnchor: event.currentTarget, helpActivity: activity })}>
                            <Icon>help</Icon>
                        </IconButton>
                    </Box>
                    <Divider style={{ marginBottom: 16 }} />
                    <Sparkline 
                        minWidth={250}
                        minHeight={250}
                        XAxisLabel="Time"
                        YAxisLabel="Score"
                        color={blue[500]}
                        data={((state.activity_events || {})[activity.name] || [])
                              .map(d => ({ 
                                  x: new Date(d.timestamp), 
                                  y: strategies[d.static_data.survey_name !== undefined ? 'lamp.survey' : 'lamp.jewels_a'](d.temporal_events),
                                  slice: d.temporal_events
                              }))}
                        onClick={(datum) => setState({ ...state, visibleSlice: datum.slice })}
                        lineProps={{
                          dashArray: '3 1',
                          dashType: 'dotted',
                          cap: 'butt'
                        }} />
                </Card>
            )}
            {!(state.selectedPassive || []).includes('Environmental Context') ? <React.Fragment /> : 
                <Card style={{ marginTop: 16, marginBotton: 16 }}>
                    <Typography component="h6" variant="h6" style={{ width: '100%', textAlign: 'center', margin: 16 }}>
                        Environmental Context
                    </Typography>
                    <Divider style={{ marginBottom: 16 }} />
                    <MultiPieChart data={
                        [
                            [

                                {
                                    label: 'Alone',
                                    value: ((state.sensor_events || {})['lamp.gps.contextual'] || [])
                                        .filter(x => x.data.context.social === 'alone')
                                        .length
                                },
                                {
                                    label: 'Friends',
                                    value: ((state.sensor_events || {})['lamp.gps.contextual'] || [])
                                        .filter(x => x.data.context.social === 'friends')
                                        .length
                                },
                                {
                                    label: 'Family',
                                    value: ((state.sensor_events || {})['lamp.gps.contextual'] || [])
                                        .filter(x => x.data.context.social === 'family')
                                        .length
                                },
                                {
                                    label: 'Peers',
                                    value: ((state.sensor_events || {})['lamp.gps.contextual'] || [])
                                        .filter(x => x.data.context.social === 'peers')
                                        .length
                                },
                                {
                                    label: 'Crowd',
                                    value: ((state.sensor_events || {})['lamp.gps.contextual'] || [])
                                        .filter(x => x.data.context.social === 'crowd')
                                        .length
                                },
                            ],
                            [
                                {
                                    label: 'Home',
                                    value: ((state.sensor_events || {})['lamp.gps.contextual'] || [])
                                        .filter(x => x.data.context.environment === 'home')
                                        .length
                                },
                                {
                                    label: 'School',
                                    value: ((state.sensor_events || {})['lamp.gps.contextual'] || [])
                                        .filter(x => x.data.context.environment === 'school')
                                        .length
                                },
                                {
                                    label: 'Work',
                                    value: ((state.sensor_events || {})['lamp.gps.contextual'] || [])
                                        .filter(x => x.data.context.environment === 'work')
                                        .length
                                },
                                {
                                    label: 'Hospital',
                                    value: ((state.sensor_events || {})['lamp.gps.contextual'] || [])
                                        .filter(x => x.data.context.environment === 'hospital')
                                        .length
                                },
                                {
                                    label: 'Outside',
                                    value: ((state.sensor_events || {})['lamp.gps.contextual'] || [])
                                        .filter(x => x.data.context.environment === 'outside')
                                        .length
                                },
                                {
                                    label: 'Shopping',
                                    value: ((state.sensor_events || {})['lamp.gps.contextual'] || [])
                                        .filter(x => x.data.context.environment === 'shopping')
                                        .length
                                },
                                {
                                    label: 'Transit',
                                    value: ((state.sensor_events || {})['lamp.gps.contextual'] || [])
                                        .filter(x => x.data.context.environment === 'transit')
                                        .length
                                },
                            ]
                        ]
                    } />
                </Card>
            }
            {!(state.selectedPassive || []).includes('Step Count') ? <React.Fragment /> : 
                <Card style={{ marginTop: 16, marginBotton: 16 }}>
                    <Typography component="h6" variant="h6" style={{ width: '100%', textAlign: 'center', margin: 16 }}>
                        Step Count
                    </Typography>
                    <Divider style={{ marginBottom: 16 }} />
                    <Sparkline 
                        minWidth={250}
                        minHeight={250}
                        XAxisLabel="Time"
                        YAxisLabel="Steps Taken"
                        color={blue[500]}
                        data={((state.sensor_events || {})['lamp.steps'] || [])
                              .map(d => ({ 
                                  x: new Date(d.timestamp), 
                                  y: d.data.value
                              }))}
                        lineProps={{
                          dashArray: '3 1',
                          dashType: 'dotted',
                          cap: 'butt'
                        }} />
                </Card>
            }
            {(state.attachments || []).map(attachment =>
                <Card key={attachment} style={{ padding: '.3rem' }}>
                    <img src={'data:image/png;base64,' + attachment} />
                    {/*
                    <Document
                        file={'data:application/pdf;base64,' + attachment}
                        error={
                            <Typography variant="body1" color="error">
                                Visualization error occurred.
                            </Typography>
                        }
                        loading="">
                        <Page renderMode="svg" pageIndex={0}/>
                    </Document>*/}
                </Card>
            )}
            <Popover
                id="mouse-over-popover"
                open={!!state.helpAnchor}
                anchorEl={state.helpAnchor}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                onClose={event => setState({ ...state, helpAnchor: undefined, helpActivity: undefined })}
                disableRestoreFocus
            >
                {!!state.helpActivity && 
                    (state.helpActivity.spec === 'lamp.survey' ? 
                    <img style={{ width: 300, height: 600}} src={`https://lamp-splash.s3.us-east-2.amazonaws.com/sample/survey.png`} /> :
                    <img style={{ width: 300, height: 600}} src={`https://lamp-splash.s3.us-east-2.amazonaws.com/sample/${state.helpActivity.name.toLowerCase().replace(/[^0-9a-z]/gi, '')}.png`} />)
                }
            </Popover>
            <ResponsiveDialog
                open={!!state.visibleSlice}
                onClose={() => setState({ ...state, visibleSlice: undefined })}
                aria-labelledby="alert-dialog-title2"
                aria-describedby="alert-dialog-description2"
            >
                <DialogContent>
                    {(state.visibleSlice || []).length === 0 ?
                        <Typography variant="subtitle2" style={{ margin: 16 }}>
                            No detail view available.
                        </Typography> :
                        <ArrayView 
                            value={(state.visibleSlice || []).map(x => ({ 
                                item: x.item, value: x.value, 
                                time_taken: (x.duration / 1000).toFixed(1) + 's' 
                            }))} 
                        />
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setState({ ...state, visibleSlice: undefined })} color="primary" autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </ResponsiveDialog>
            <ResponsiveDialog
                open={!!state.openMessaging}
                onClose={() => setState({ ...state, openMessaging: undefined })}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    <Messages participantOnly participant={props.match.params.id} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setState({ ...state, openMessaging: undefined })} color="primary" autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </ResponsiveDialog>
            <Fab 
                color="primary" 
                aria-label="Back" 
                variant="extended" 
                style={{ position: 'fixed', bottom: 24, right: 24 }} 
                onClick={() => setState({ ...state, openMessaging: true })}
            >
                <Icon>chat</Icon>
                Messages
            </Fab>
        </React.Fragment>
    )
}
