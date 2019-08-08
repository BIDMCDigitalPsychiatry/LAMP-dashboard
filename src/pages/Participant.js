
// Core Imports
import React from 'react'
import { withRouter } from 'react-router-dom'
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

class Participant extends React.Component {
    state = {}
    async componentWillMount() {
        this.props.layout.pageLoading(false)

        let { id } = this.props.match.params
        if (id === 'me' && (this.props.auth.auth || {type: null}).type === 'participant')
            id = this.props.auth.identity.id

        if (!id || id === 'me') {
            this.props.history.replace(`/`)
            return
        }
        this.props.layout.setTitle(`Participant ${id}`)

        LAMP.Type.getDynamicAttachment(id, 'lamp.beta_values').then(res => {
            this.setState({ attachments: [JSON.parse(res.data)] })
        }).catch(() => {})

        // Update state now with the new fetched & computed objects.
        let activities = await LAMP.Activity.allByParticipant(id)
        this.setState({ 
            activities: activities, 
            activity_events: groupBy((await LAMP.ResultEvent.allByParticipant(id)).map(x => ({ ...x,
                activity: activities.find(y => x.activity === y.id || 
                              (!!x.static_data.survey_name && 
                                  x.static_data.survey_name.toLowerCase() === y.name.toLowerCase()))
            }))
            .map(x => {
                console.dir(x)
                return x
            })
            .map(x => ({ ...x,
                activity: (x.activity || {name: ''}).name,
                activity_spec: (x.activity || {spec: ''}).spec || ''
            })), 'activity'),
            sensor_events: groupBy(await LAMP.SensorEvent.allByParticipant(id), 'sensor'),
        })
        this.setState({
            activity_counts: Object.assign({}, ...Object.entries((this.state.activity_events || {})).map(([k, v]) => ({ [k]: v.length }))),
            sensor_counts: {
                'Environmental Context': ((this.state.sensor_events || {})['lamp.gps.contextual'] || []).length, 
                'Step Count': ((this.state.sensor_events || {})['lamp.steps'] || []).length
            }
        })
        this.props.layout.pageLoading(true)
    }

    render = () =>
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
                        checked={this.state.showAll} 
                        onChange={() => this.setState({ showAll: !this.state.showAll, selectedCharts: undefined })} 
                    />
                </Box>
            </Box>
            <MultipleSelect 
                selected={this.state.selectedCharts || []}
                items={(this.state.activities || []).filter(x => x.spec === 'lamp.survey' || !!this.state.showAll).map(x => `${x.name}`)}
                showZeroBadges={false}
                badges={this.state.activity_counts}
                onChange={x => this.setState({ selectedCharts: x })}
            />
            <Divider style={{ margin: '8px -16px 8px -16px' }} />
            <Typography variant="subtitle2">
                Sensor
            </Typography>
            <MultipleSelect 
                selected={this.state.selectedPassive || []}
                items={[`Environmental Context`, `Step Count`]}
                showZeroBadges={false}
                badges={this.state.sensor_counts}
                onChange={x => this.setState({ selectedPassive: x })}
            />
        </Box>
        {((this.state.selectedCharts || []).length + (this.state.selectedPassive || []).length) === 0 && 
            <Card style={{ marginTop: 16, marginBotton: 16, height: 96, backgroundColor: blue[700] }}>
                <Typography variant="h6" style={{ width: '100%', textAlign: 'center', marginTop: 32, color: '#fff' }}>
                    No charts are selected. Please select a chart above to begin.
                </Typography>
            </Card>
        }
        {(this.state.activities || []).filter(x => (this.state.selectedCharts || []).includes(x.name)).map(activity =>
            <Card key={activity.id} style={{ marginTop: 16, marginBotton: 16 }}>
                <Box m={2} style={{ display: 'flex', justifyContent: 'space-between', alignContent: 'center' }}>
                    <Typography variant="h6" style={{ width: '100%', textAlign: 'center' }}>
                        {activity.name}
                    </Typography>
                    <IconButton onClick={event => this.setState({ helpAnchor: event.currentTarget, helpActivity: activity })}>
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
                    data={((this.state.activity_events || {})[activity.name] || [])
                          .map(d => ({ 
                              x: new Date(d.timestamp), 
                              y: strategies[d.static_data.survey_name !== undefined ? 'lamp.survey' : 'lamp.jewels_a'](d.temporal_events),
                              slice: d.temporal_events
                          }))}
                    onClick={(datum) => this.setState({ visibleSlice: datum.slice })}
                    lineProps={{
                      dashArray: '3 1',
                      dashType: 'dotted',
                      cap: 'butt'
                    }} />
            </Card>
        )}
        {!(this.state.selectedPassive || []).includes('Environmental Context') ? <React.Fragment /> : 
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
                                value: ((this.state.sensor_events || {})['lamp.gps.contextual'] || [])
                                    .filter(x => x.data.context.social === 'alone')
                                    .length
                            },
                            {
                                label: 'Friends',
                                value: ((this.state.sensor_events || {})['lamp.gps.contextual'] || [])
                                    .filter(x => x.data.context.social === 'friends')
                                    .length
                            },
                            {
                                label: 'Family',
                                value: ((this.state.sensor_events || {})['lamp.gps.contextual'] || [])
                                    .filter(x => x.data.context.social === 'family')
                                    .length
                            },
                            {
                                label: 'Peers',
                                value: ((this.state.sensor_events || {})['lamp.gps.contextual'] || [])
                                    .filter(x => x.data.context.social === 'peers')
                                    .length
                            },
                            {
                                label: 'Crowd',
                                value: ((this.state.sensor_events || {})['lamp.gps.contextual'] || [])
                                    .filter(x => x.data.context.social === 'crowd')
                                    .length
                            },
                        ],
                        [
                            {
                                label: 'Home',
                                value: ((this.state.sensor_events || {})['lamp.gps.contextual'] || [])
                                    .filter(x => x.data.context.environment === 'home')
                                    .length
                            },
                            {
                                label: 'School',
                                value: ((this.state.sensor_events || {})['lamp.gps.contextual'] || [])
                                    .filter(x => x.data.context.environment === 'school')
                                    .length
                            },
                            {
                                label: 'Work',
                                value: ((this.state.sensor_events || {})['lamp.gps.contextual'] || [])
                                    .filter(x => x.data.context.environment === 'work')
                                    .length
                            },
                            {
                                label: 'Hospital',
                                value: ((this.state.sensor_events || {})['lamp.gps.contextual'] || [])
                                    .filter(x => x.data.context.environment === 'hospital')
                                    .length
                            },
                            {
                                label: 'Outside',
                                value: ((this.state.sensor_events || {})['lamp.gps.contextual'] || [])
                                    .filter(x => x.data.context.environment === 'outside')
                                    .length
                            },
                            {
                                label: 'Shopping',
                                value: ((this.state.sensor_events || {})['lamp.gps.contextual'] || [])
                                    .filter(x => x.data.context.environment === 'shopping')
                                    .length
                            },
                            {
                                label: 'Transit',
                                value: ((this.state.sensor_events || {})['lamp.gps.contextual'] || [])
                                    .filter(x => x.data.context.environment === 'transit')
                                    .length
                            },
                        ]
                    ]
                } />
            </Card>
        }
        {!(this.state.selectedPassive || []).includes('Step Count') ? <React.Fragment /> : 
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
                    data={((this.state.sensor_events || {})['lamp.steps'] || [])
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
        {(this.state.attachments || []).map(attachment =>
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
            open={!!this.state.helpAnchor}
            anchorEl={this.state.helpAnchor}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            onClose={event => this.setState({ helpAnchor: undefined, helpActivity: undefined })}
            disableRestoreFocus
        >
            {!!this.state.helpActivity && 
                (this.state.helpActivity.spec === 'lamp.survey' ? 
                <img style={{ width: 300, height: 600}} src={`https://lamp-splash.s3.us-east-2.amazonaws.com/sample/survey.png`} /> :
                <img style={{ width: 300, height: 600}} src={`https://lamp-splash.s3.us-east-2.amazonaws.com/sample/${this.state.helpActivity.name.toLowerCase().replace(/[^0-9a-z]/gi, '')}.png`} />)
            }
        </Popover>
        <ResponsiveDialog
            open={!!this.state.visibleSlice}
            onClose={() => this.setState({ visibleSlice: undefined })}
            aria-labelledby="alert-dialog-title2"
            aria-describedby="alert-dialog-description2"
        >
            <DialogContent>
                {(this.state.visibleSlice || []).length === 0 ?
                    <Typography variant="subtitle2" style={{ margin: 16 }}>
                        No detail view available.
                    </Typography> :
                    <ArrayView 
                        value={(this.state.visibleSlice || []).map(x => ({ 
                            item: x.item, value: x.value, 
                            time_taken: (x.duration / 1000).toFixed(1) + 's' 
                        }))} 
                    />
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={() => this.setState({ visibleSlice: undefined })} color="primary" autoFocus>
                    Close
                </Button>
            </DialogActions>
        </ResponsiveDialog>
        <ResponsiveDialog
            open={!!this.state.openMessaging}
            onClose={() => this.setState({ openMessaging: undefined })}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogContent>
                <Messages participantOnly participant={this.props.match.params.id} />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => this.setState({ openMessaging: undefined })} color="primary" autoFocus>
                    Close
                </Button>
            </DialogActions>
        </ResponsiveDialog>
        <Fab 
            color="primary" 
            aria-label="Back" 
            variant="extended" 
            style={{ position: 'fixed', bottom: 24, right: 24 }} 
            onClick={() => this.setState({ openMessaging: true })}
        >
            <Icon>chat</Icon>
            Messages
        </Fab>
    </React.Fragment>
}

export default withRouter(Participant)
