
// Core Imports
import React, { useState, useEffect, useRef } from 'react'
import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import Switch from '@material-ui/core/Switch'
import Icon from '@material-ui/core/Icon'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Fab from '@material-ui/core/Fab'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Popover from '@material-ui/core/Popover'
import Slide from '@material-ui/core/Slide'
import blue from '@material-ui/core/colors/blue'

// External Imports 
//import { Document, Page } from 'react-pdf'

// Local Imports
import LAMP from '../lamp'
import ActivityCard from '../components/ActivityCard'
import MultipleSelect from '../components/MultipleSelect'
import Sparkline from '../components/Sparkline'
import MultiPieChart from '../components/MultiPieChart'
import Messages from '../components/Messages'
import MenuButton from '../components/MenuButton'
import { ResponsiveDialog, groupBy } from '../components/Utils'
import Survey from '../components/Survey'

function SlideUp(props) { return <Slide direction="up" {...props} /> }

// TODO: all SensorEvents?

export default function Participant({ participant, ...props }) {
    const [ state, setState ] = useState({})
    const [ activities, setActivities ] = useState([])
    const [ survey, setSurvey ] = useState()
    const [ submission, setSubmission ] = useState(0)

    useEffect(() => {
        LAMP.Type.getDynamicAttachment(participant.id, 'lamp.beta_values').then(res => {
            setState({ ...state, attachments: [JSON.parse(res.data)] })
        }).catch(() => {})
    }, [])

    useEffect(() => {
        (async () => {
            let _activities = await LAMP.Activity.allByParticipant(participant.id)
            let _state = { ...state,  
                activities: _activities, 
                activity_events: groupBy((await LAMP.ResultEvent.allByParticipant(participant.id)).map(x => ({ ...x,
                    activity: _activities.find(y => x.activity === y.id || 
                                  (!!x.static_data.survey_name && 
                                      x.static_data.survey_name.toLowerCase() === y.name.toLowerCase()))
                }))
                .map(x => ({ ...x,
                    activity: (x.activity || {name: ''}).name,
                    activity_spec: (x.activity || {spec: ''}).spec || ''
                })), 'activity'),
                sensor_events: groupBy(await LAMP.SensorEvent.allByParticipant(participant.id), 'sensor'),
            }
            setState({ ..._state, 
                activity_counts: Object.assign({}, ...Object.entries((_state.activity_events || {})).map(([k, v]) => ({ [k]: v.length }))),
                sensor_counts: {
                    'Environmental Context': ((_state.sensor_events || {})['lamp.gps.contextual'] || []).length, 
                    'Step Count': ((_state.sensor_events || {})['lamp.steps'] || []).length
                }
            })
        })()
    }, [submission])

    // 
    useEffect(() => {
        if (activities.length === 0)
            return setSurvey()
        setSurvey({
            name: activities.length === 1 ? activities[0].name : 'Multi-questionnaire',
            description: 'Please complete all sections below. Thank you.',
            sections: activities.map(x => ({
                banner: activities.length === 1 ? undefined : x.name,
                questions: x.settings.map(y => ({ ...y, 
                    options: y.options === null ? null : y.options.map(z => ({ label: z, value: z }))
                }))
            }))
        })
    }, [activities])

    // 
    const submitSurvey = (response) => {
        setSurvey()
        let events = response.map((x, idx) => ({
            timestamp: (new Date().getTime()),
            duration: 0,
            activity: activities[idx].id,
            static_data: { survey_name: activities[idx].name },
            temporal_events: (x || []).map(y => ({
                item: y !== undefined ? y.item : null,
                value: y !== undefined ? y.value : null,
                type: null,
                level: null,
                duration: 0,
            })),
        }))
        LAMP.ResultEvent.create(participant.id, events[0])
            .then(x => {
                setSubmission(submission + 1)
            })
            .catch(e => console.dir(e))
    }

    return (
        <React.Fragment>   
            <Box border={1} borderColor="grey.300" borderRadius={4} p={2} mx="10%">
                <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle2">
                        Activity
                    </Typography>
                    <Box>
                        <Typography variant="inherit" color="inherit">
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
                {LAMP.Auth.get_identity().name !== 'MAP NET' &&
                    <React.Fragment>
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
                    </React.Fragment>
                }
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
                    <ActivityCard 
                        activity={activity} 
                        events={((state.activity_events || {})[activity.name] || [])} 
                        forceDefaultGrid={LAMP.Auth.get_identity().name === 'MAP NET'}
                    />
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
                                  x: new Date(parseInt(d.timestamp)), 
                                  y: d.data.value || 0
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
            <Box display="flex" p={4} justifyContent="center">
                <MenuButton 
                    style={{ margin: 'auto 0' }}
                    title="Add Survey Response" 
                    items={(state.activities || []).filter(x => x.spec === 'lamp.survey').map(x => x.name)} 
                    onClick={y => setActivities((state.activities || []).filter(x => x.name === y))}
                />
            </Box>
            <ResponsiveDialog
                open={!!state.openMessaging}
                onClose={() => setState({ ...state, openMessaging: undefined })}
            >
                <DialogContent>
                    <Messages participantOnly participant={participant.id} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setState({ ...state, openMessaging: undefined })} color="primary" autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </ResponsiveDialog>
            <Dialog
                fullScreen
                open={!!survey}
                onClose={() => setSurvey()}
                TransitionComponent={SlideUp}
            >
                <IconButton 
                    style={{ 
                        position: 'fixed', 
                        left: 16, 
                        top: 16, 
                        background: '#ffffff66', 
                        WebkitBackdropFilter: 'blur(5px)' 
                    }} 
                    color="inherit" 
                    onClick={() => setSurvey()} 
                    aria-label="Close"
                >
                    <Icon>close</Icon>
                </IconButton>
                <Box py={8} px={4}>
                    <Survey
                        validate
                        content={survey} 
                        onValidationFailure={() => props.layout.showAlert('Some responses are missing. Please complete all questions before submitting.')}
                        onResponse={submitSurvey} 
                    />
                </Box>
            </Dialog>
            <Fab 
                color="primary" 
                aria-label="Messages" 
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
