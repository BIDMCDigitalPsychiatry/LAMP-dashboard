
// Core Imports
import React, { useState, useEffect } from 'react'
import { Box, Card, Switch, Typography, Divider, Grid } from '@material-ui/core'
import { blue } from '@material-ui/core/colors'
import { useSnackbar } from 'notistack'

// Local Imports
import LAMP from '../lamp'
import ActivityCard from './ActivityCard'
import MultipleSelect from './MultipleSelect'
import CareTeam from './CareTeam'
import Launcher from './Launcher'
import Sparkline from './Sparkline'
import MultiPieChart from './MultiPieChart'
import Survey from './Survey'
import ResponsiveDialog from './ResponsiveDialog'
import Breathe from './Breathe'
import Jewels from './Jewels'
import { spliceActivity } from './ActivityList'

function _hideCareTeam() { return (LAMP.Auth._auth.serverAddress || '').includes('.psych.digital') }
function _patientMode() { return !['admin', 'root'].includes(LAMP.Auth._auth.id) && !LAMP.Auth._auth.id.includes('@') }
function _shouldRestrict() { return _patientMode() && _hideCareTeam() }

// TODO: all SensorEvents?

export default function Participant({ participant, ...props }) {
    const [ state, setState ] = useState({})
    const [ activities, setActivities ] = useState([])
    const [ visualizations, setVisualizations ] = useState({})
    const [ survey, setSurvey ] = useState()
    const [ submission, setSubmission ] = useState(0)
    const [ hiddenEvents, setHiddenEvents ] = useState([])
    const [launchedActivity, setLaunchedActivity] = useState()
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        (async () => {
            let visualizations = {}
            for (let attachmentID of (await LAMP.Type.listAttachments(participant.id)).data) {
                if (!attachmentID.startsWith('lamp.dashboard.experimental'))
                    continue
                visualizations[attachmentID] = (await LAMP.Type.getAttachment(participant.id, attachmentID)).data
            }
            setVisualizations(visualizations)
        })()
    }, [])

    useEffect(() => {
        (async () => {

            // Refresh hidden events list.
            let _hidden = await LAMP.Type.getAttachment(participant.id, 'lamp.dashboard.hidden_events')
            _hidden = !!_hidden.error ? [] : _hidden.data
            setHiddenEvents(_hidden)

            // Perform event coalescing/grouping by sensor or activity type.
            let _activities = await LAMP.Activity.allByParticipant(participant.id)
            let _state = { ...state,  
                activities: _activities, 
                activity_events: (await LAMP.ResultEvent.allByParticipant(participant.id))
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
                    }))
                    .groupBy('activity'),
                sensor_events: (await LAMP.SensorEvent.allByParticipant(participant.id)).groupBy('sensor'),
            }

            // Perform datetime coalescing to either days or weeks.
            _state.sensor_events['lamp.steps'] = 
                Object.values(
                    ((_state.sensor_events || {})['lamp.steps'] || [])
                        .map(x => ({ ...x, timestamp: Math.round(x.timestamp / (24*60*60*1000)) /* days */ }))
                    .groupBy('timestamp'))
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

        // Splice together all selected activities & their tags.
        Promise.all(activities.map(x => LAMP.Type.getAttachment(x.id, 'lamp.dashboard.survey_description'))).then(res => {
            let spliced = res.map((y, idx) => spliceActivity({ raw: activities[idx], tag: !!y.error ? undefined : y.data }))
            
            // Short-circuit the main title & description if there's only one survey.
            const main = {
                name: spliced.length === 1 ? spliced[0].name : 'Multi-questionnaire',
                description: spliced.length === 1 ? spliced[0].description : 'Please complete all sections below. Thank you.'
            }
            if (spliced.length === 1)
                spliced[0].name = spliced[0].description = undefined 

            setSurvey({
                name: main.name,
                description: main.description,
                sections: spliced,
                prefillData: spliced[0].prefillData,
                prefillTimestamp: spliced[0].prefillTimestamp
            })
        })
    }, [activities])

    //
    const hideEvent = async (timestamp, activity) => {
        let _hidden = await LAMP.Type.getAttachment(participant.id, 'lamp.dashboard.hidden_events')
        let _events = !!_hidden.error ? [] : _hidden.data
        if (hiddenEvents.includes(`${timestamp}/${activity}`))
            return
        let _setEvents = await LAMP.Type.setAttachment(participant.id, 'me', 'lamp.dashboard.hidden_events', 
                            [..._events, `${timestamp}/${activity}`])
        if (!!_setEvents.error)
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

    const earliestDate = () => (state.activities || [])
        .filter(x => (state.selectedCharts || []).includes(x.name))
        .map(x => ((state.activity_events || {})[x.name] || []))
        .map(x => x.length === 0 ? 0 : x.slice(0, 1)[0].timestamp)
        .sort((a, b) => a - b /* min */).slice(0, 1)
        .map(x => x === 0 ? undefined : new Date(x))[0]

    return (
        <React.Fragment>
            {!_hideCareTeam() &&
                <Box border={1} borderColor="grey.300" borderRadius={4} bgcolor="#fff" p={2} my={4}>
                    <CareTeam participant={participant} />
                </Box>
            }
            <Box border={1} borderColor="grey.300" borderRadius={4} bgcolor="#fff" my={4}>
                <Launcher.Group>
                    <Launcher.Section title="Learn">
                    </Launcher.Section>
                    <Launcher.Section title="Assess">
                        {[
                            <Launcher.Button key="_-1" 
                                notification title="Administer All Survey Instruments" 
                                onClick={() => setActivities((state.activities || []).filter(x => x.spec === 'lamp.survey' && (_shouldRestrict() ? x.name.includes('SELF REPORT') : true)))} 
                            />,
                            ...(state.activities || []).filter(x => x.spec === 'lamp.survey' && (_shouldRestrict() ? x.name.includes('SELF REPORT') : true)).map(y => (
                                <Launcher.Button key={y.name} 
                                    title={y.name} 
                                    onClick={() => setActivities([y])}
                                />
                            ))
                        ]}
                    </Launcher.Section>
                    <Launcher.Section title="Manage">
                        {!_hideCareTeam() &&
                            <Launcher.Button favorite title="Breathe" onClick={() => setLaunchedActivity('breathe')} />
                        }
                    </Launcher.Section>
                    <Launcher.Section title="Prevent">
                    </Launcher.Section>
                </Launcher.Group>
                <ResponsiveDialog transient animate fullScreen open={!!launchedActivity} onClose={() => setLaunchedActivity()}>
                    {launchedActivity === 'breathe' ?
                        <Breathe onComplete={() => setLaunchedActivity()} /> : 
                        <Jewels onComplete={() => setLaunchedActivity()} />
                    }
                </ResponsiveDialog>
                <ResponsiveDialog transient animate fullScreen open={!!survey} onClose={() => setSurvey()}>
                    <Box py={8} px={2}>
                        <Survey
                            validate
                            partialValidationOnly
                            content={survey} 
                            prefillData={!!survey ? survey.prefillData : undefined}
                            prefillTimestamp={!!survey ? survey.prefillTimestamp : undefined}
                            onValidationFailure={() => enqueueSnackbar('Some responses are missing. Please complete all questions before submitting.', { variant: 'error' })}
                            onResponse={submitSurvey} 
                        />
                    </Box>
                </ResponsiveDialog>
            </Box>
            <Box border={1} borderColor="grey.300" borderRadius={4} bgcolor="#fff" p={2} mx="10%">
                <Box display="flex" justifyContent="space-between">
                    <Typography variant="overline">
                        Activity
                    </Typography>
                    <Box>
                        <Typography variant="overline" color="inherit">
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
                {(!(!!LAMP.Auth._auth.serverAddress && !LAMP.Auth._auth.serverAddress.includes('psych.digital'))) &&
                    <React.Fragment>
                        <Divider style={{ margin: '8px -16px 8px -16px' }} />
                        <Typography variant="overline">
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
                {Object.keys(visualizations).length > 0 &&
                    <React.Fragment>
                        <Divider style={{ margin: '8px -16px 8px -16px' }} />
                        <Typography variant="overline">
                            Automations
                        </Typography>
                        <MultipleSelect 
                            tooltips={{}}
                            defaultTooltip="An experimental visualization generated by an automation you or your clinician have installed."
                            selected={state.selectedExperimental || []}
                            items={Object.keys(visualizations).map(x => x.replace('lamp.dashboard.experimental.', ''))}
                            showZeroBadges={false}
                            badges={Object.keys(visualizations).map(x => x.replace('lamp.dashboard.experimental.', '')).reduce((prev, curr) => ({ ...prev, [curr]: 1 }), {})}
                            onChange={x => setState({ ...state, selectedExperimental: x })}
                        />
                    </React.Fragment>
                }
            </Box>
            {((state.selectedCharts || []).length + (state.selectedPassive || []).length) === 0 && 
                <Box 
                    display="flex" 
                    justifyContent="center" 
                    border={1} 
                    borderColor={blue[700]}
                    borderRadius={4} 
                    bgcolor="grey.100"
                    color={blue[700]}
                    p={2} my={4} mx="10%"
                >
                    <Typography variant="overline" align="center">
                        <b>No Activities are selected. Please select an Activity above to begin.</b>
                    </Typography>
                </Box>
            }
            {(state.activities || []).filter(x => (state.selectedCharts || []).includes(x.name)).map(activity =>
                <Card key={activity.id} style={{ marginTop: 16, marginBotton: 16 }}>
                    <ActivityCard 
                        activity={activity} 
                        events={((state.activity_events || {})[activity.name] || [])} 
                        startDate={earliestDate()}
                        forceDefaultGrid={!!LAMP.Auth._auth.serverAddress && LAMP.Auth._auth.serverAddress.includes('psych.digital')}
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
                    <Typography component="h6" variant="h6" align="center" style={{ width: '100%', margin: 16 }}>
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
                    <Typography component="h6" variant="h6" align="center" style={{ width: '100%', margin: 16 }}>
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
                              }))} />
                </Card>
            }
            {(state.selectedExperimental || []).map(x => (
                <Card key={x} style={{ marginTop: 16, marginBotton: 16 }}>
                    <Typography component="h6" variant="h6" align="center" style={{ width: '100%', margin: 16 }}>
                        {x}
                    </Typography>
                    <Divider style={{ marginBottom: 16 }} />
                    <Grid container justify="center">
                        <img alt="visualization" src={'data:image/svg+xml;base64,' + visualizations['lamp.dashboard.experimental.' + x]} height="85%" width="85%" />
                        {/*<img alt="visualization" src={'data:image/png;base64,' + visualizations['lamp.dashboard.experimental.' + x]} />*/}
                        {/*<Document
                            file={'data:application/pdf;base64,' + visualizations['lamp.dashboard.experimental.' + x]}
                            error={
                                <Typography variant="body1" color="error">
                                    Visualization error occurred.
                                </Typography>
                            }
                            loading="">
                            <Page renderMode="svg" pageIndex={0}/>
                        </Document>*/}
                    </Grid>
                </Card>
            ))}
        </React.Fragment>
    )
}
