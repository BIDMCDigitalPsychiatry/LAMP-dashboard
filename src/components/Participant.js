
// Core Imports
import React, { useState, useEffect } from 'react'
import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import Switch from '@material-ui/core/Switch'
import Icon from '@material-ui/core/Icon'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Dialog from '@material-ui/core/Dialog'
import Slide from '@material-ui/core/Slide'
import blue from '@material-ui/core/colors/blue'

// External Imports 
//import { Document, Page } from 'react-pdf'

// Local Imports
import LAMP from '../lamp'
import ActivityCard from './ActivityCard'
import MultipleSelect from './MultipleSelect'
import Sparkline from './Sparkline'
import MultiPieChart from './MultiPieChart'
import MenuButton from './MenuButton'
import { groupBy } from './Utils'
import Survey from './Survey'

function SlideUp(props) { return <Slide direction="up" {...props} /> }
function _shouldRestrict() { return !['admin', 'root'].includes(LAMP.Auth._auth.id) && !LAMP.Auth._auth.id.includes('@') && (LAMP.Auth._auth.serverAddress || '').includes('.psych.digital') }

// TODO: all SensorEvents?

export default function Participant({ participant, ...props }) {
    const [ state, setState ] = useState({})
    const [ activities, setActivities ] = useState([])
    const [ survey, setSurvey ] = useState()
    const [ submission, setSubmission ] = useState(0)
    const [ hiddenEvents, setHiddenEvents ] = useState([])

    useEffect(() => {
        LAMP.Type.getDynamicAttachment(participant.id, 'lamp.beta_values').then(res => {
            setState({ ...state, attachments: [JSON.parse(res.data)] })
        }).catch(() => {})
    }, [])

    useEffect(() => {
        (async () => {

            // Refresh hidden events list.
            let _hidden = await LAMP.Type.getAttachment(participant.id, 'lamp.dashboard.hidden_events')
            _hidden = !!_hidden.message ? [] : _hidden.data
            setHiddenEvents(_hidden)

            // Perform event coalescing/grouping by sensor or activity type.
            let _activities = await LAMP.Activity.allByParticipant(participant.id)
            let _state = { ...state,  
                activities: _activities, 
                activity_events: groupBy((await LAMP.ResultEvent.allByParticipant(participant.id))
                    .map(x => ({ ...x,
                        activity: _activities.find(y => x.activity === y.id || 
                                      (!!x.static_data.survey_name && 
                                          x.static_data.survey_name.toLowerCase() === y.name.toLowerCase()))
                    }))
                    .filter(x => !!x.activity ? !_hidden.includes(`${x.timestamp}/${x.activity.id}`) : true)
                    .sort((x, y) => x.timestamp - y.timestamp)
                    .map(x => ({ ...x,
                        activity: (x.activity || {name: ''}).name,
                        activity_spec: (x.activity || {spec: ''}).spec || ''
                    })), 'activity'),
                sensor_events: groupBy(await LAMP.SensorEvent.allByParticipant(participant.id), 'sensor'),
            }

            // Perform datetime coalescing to either days or weeks.
            _state.sensor_events['lamp.steps'] = 
                Object.values(groupBy(
                    ((_state.sensor_events || {})['lamp.steps'] || [])
                        .map(x => ({ ...x, timestamp: Math.round(x.timestamp / (24*60*60*1000)) /* days */ })), 
                'timestamp'))
                .map(x => x.reduce((a, b) => !!a.timestamp ? ({ ...a, 
                    data: { value: a.data.value + b.data.value, units: 'steps' } 
                }) : b, {}))
                .map(x => ({ ...x, timestamp: x.timestamp * (24*60*60*1000) /* days */}))

            // Perform count coalescing on processed events grouped by type.
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
        Promise.all(activities.map(x => LAMP.Type.getAttachment(x.id, 'lamp.dashboard.survey_description'))).then(res => {
            res = res.map(y => !!y.message ? undefined : y.data)
            setSurvey({
                name: activities.length === 1 ? activities[0].name : 'Multi-questionnaire',
                description: activities.length === 1 ? (!!res[0] ? res[0].description : undefined) : 'Please complete all sections below. Thank you.',
                sections: activities.map((x, idx) => ({
                    name: activities.length === 1 ? undefined : x.name,
                    description: activities.length === 1 ? undefined : (!!res[idx] ? res[idx].description : undefined),
                    questions: x.settings.map((y, idx2) => ({ ...y, 
                        description: !!res[idx] ? res[idx].settings[idx2] : undefined,
                        options: y.options === null ? null : y.options.map(z => ({ label: z, value: z }))
                    }))
                })),
                prefillData: activities[0].prefillData,
                prefillTimestamp: activities[0].prefillTimestamp
            })
        })
    }, [activities])

    //
    const hideEvent = async (timestamp, activity) => {
        let _hidden = await LAMP.Type.getAttachment(participant.id, 'lamp.dashboard.hidden_events')
        let _events = !!_hidden.message ? [] : _hidden.data
        if (hiddenEvents.includes(`${timestamp}/${activity}`))
            return
        let _setEvents = await LAMP.Type.setAttachment(participant.id, 'me', 'lamp.dashboard.hidden_events', 
                            [..._events, `${timestamp}/${activity}`])
        if (!!_setEvents.message)
            return
        //setHiddenEvents([..._events, `${timestamp}/${activity}`])
        setSubmission(x => x + 1)
    }

    // 
    const submitSurvey = (response, overwritingTimestamp) => {
        setSurvey()

        // 
        let events = response.map((x, idx) => ({
            timestamp: !!overwritingTimestamp ? overwritingTimestamp + 1000 /* 1sec */ : (new Date().getTime()),
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

        // 
        Promise.all(events.filter(x => x.temporal_events.length > 0).map(x => 
            LAMP.ResultEvent.create(participant.id, x).catch(e => console.dir(e))
        )).then(x => { setSubmission(x => x + 1) })

        // If a timestamp was provided to overwrite data, hide the original event too.
        if (!!overwritingTimestamp)
            hideEvent(overwritingTimestamp, activities[0 /* assumption made here */].id)
    }

    const earliestDate = () => {
        return (state.activities || [])
                    .filter(x => (state.selectedCharts || []).includes(x.name))
                    .map(x => ((state.activity_events || {})[x.name] || []))
                    .map(x => x.length === 0 ? 0 : x.slice(0, 1)[0].timestamp)
                    .sort((a, b) => a - b /* min */).slice(0, 1)
                    .map(x => x === 0 ? undefined : new Date(x))[0]
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
                        No Activities are selected. Please select an Activity above to begin.
                    </Typography>
                </Card>
            }
            {(state.activities || []).filter(x => (state.selectedCharts || []).includes(x.name)).map(activity =>
                <Card key={activity.id} style={{ marginTop: 16, marginBotton: 16 }}>
                    <ActivityCard 
                        activity={activity} 
                        events={((state.activity_events || {})[activity.name] || [])} 
                        startDate={earliestDate()}
                        forceDefaultGrid={LAMP.Auth.get_identity().name === 'MAP NET'}
                        onEditAction={activity.spec !== 'lamp.survey' ? undefined : (data) => {
                            setActivities([{ ...activity, 
                                prefillData: [data.slice.map(({ item, value }) => ({ item, value }))], 
                                prefillTimestamp: data.x.getTime() /* post-increment later to avoid double-reporting events! */
                            }])
                        }}
                        onCopyAction={activity.spec !== 'lamp.survey' ? undefined : (data) => {
                            setActivities([{ ...activity, 
                                prefillData: [data.slice.map(({ item, value }) => ({ item, value }))]
                            }])
                        }}
                        onDeleteAction={(x) => hideEvent(x.x.getTime(), activity.id)}
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
                        startDate={earliestDate()}
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
                    { /* eslint-disable-next-line */ }
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
                    title="Administer Survey Instruments" 
                    icon={<Icon>assignment</Icon>}
                    items={(state.activities || []).filter(x => x.spec === 'lamp.survey' && (_shouldRestrict() ? x.name.includes('SELF REPORT') : true)).map(x => x.name)} 
                    onAction={() => setActivities((state.activities || []).filter(x => x.spec === 'lamp.survey' && (_shouldRestrict() ? x.name.includes('SELF REPORT') : true)))}
                    onClick={y => setActivities((state.activities || []).filter(x => x.spec === 'lamp.survey' && (_shouldRestrict() ? x.name.includes('SELF REPORT') : true) && x.name === y))}
                />
            </Box>
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
                <Box py={8} px={2}>
                    <Survey
                        validate
                        partialValidationOnly
                        content={survey} 
                        prefillData={!!survey ? survey.prefillData : undefined}
                        prefillTimestamp={!!survey ? survey.prefillTimestamp : undefined}
                        onValidationFailure={() => props.layout.showAlert('Some responses are missing. Please complete all questions before submitting.')}
                        onResponse={submitSurvey} 
                    />
                </Box>
            </Dialog>
        </React.Fragment>
    )
}
