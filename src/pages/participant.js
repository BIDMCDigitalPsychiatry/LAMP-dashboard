
// Core Imports
import React from 'react'
import { withRouter } from 'react-router-dom'
import Card from '@material-ui/core/Card'
import Icon from '@material-ui/core/Icon'
import Button from '@material-ui/core/Button'
import Fab from '@material-ui/core/Fab'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogActions from '@material-ui/core/DialogActions'
import blue from '@material-ui/core/colors/blue'

// External Imports 
//import { Document, Page } from 'react-pdf'

// Local Imports
import LAMP from '../lamp'
import MultipleSelect from '../components/MultipleSelect'
import Sparkline from '../components/Sparkline'
import MultiPieChart from '../components/MultiPieChart'
import Messages from '../components/Messages'
import { ResponsiveDialog } from '../components/Utils'

// TODO: SensorEvents?
// ActivityEvents as a heatmap thing (another bubble)

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
        this.setState({ 
            activities: await LAMP.Activity.allByParticipant(id), 
            activity_events: await LAMP.ResultEvent.allByParticipant(id), 
            sensor_events: await LAMP.SensorEvent.allByParticipant(id),
        })
        this.props.layout.pageLoading(true)
    }

    render = () =>
    <React.Fragment>   
        <div style={{ margin: '0% 10%' }}>
            <MultipleSelect 
              selected={this.state.selectedCharts || []}
              items={(this.state.activities || []).map(x => x.name)}
              onChange={x => this.setState({ selectedCharts: x })}
            />
        </div>
        {(this.state.selectedCharts || []).length === 0 && 
            <Typography variant="h6" style={{ width: '100%', textAlign: 'center', marginTop: 32 }}>
                No charts are selected. Please select a chart above to begin.
            </Typography>
        }
        {(this.state.activities || []).filter(x => (this.state.selectedCharts || []).includes(x.name)).map(activity =>
            <Card key={activity.id} style={{ marginTop: 16, marginBotton: 16 }}>
                <Typography component="h6" variant="h6" style={{ width: '100%', textAlign: 'center', margin: 16 }}>
                    {activity.name}
                </Typography>
                <Divider style={{ marginBottom: 16 }} />
                <Sparkline 
                    minWidth={250}
                    minHeight={250}
                    XAxisLabel="Time"
                    YAxisLabel="Score"
                    color={blue[500]}
                    data={(this.state.activity_events || [])
                          .filter(x => x.activity === activity.id || 
                              (!!x.static_data.survey_name && 
                                  x.static_data.survey_name.toLowerCase() === activity.name.toLowerCase()))
                          .map(d => ({ 
                              x: new Date(d.timestamp), 
                              y: d.temporal_events.reduce((prev, curr) => prev + (parseInt(curr.value) || (curr.value === 'Yes' ? 1 : 0)), 0)
                          }))}
                    lineProps={{
                      dashArray: '3 1',
                      dashType: 'dotted',
                      cap: 'butt'
                    }} />
            </Card>
        )}
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
                            value: (this.state.sensor_events || [])
                                .filter(x => x.sensor === 'lamp.gps.contextual' && x.data.context.social === 'alone')
                                .length
                        },
                        {
                            label: 'Friends',
                            value: (this.state.sensor_events || [])
                                .filter(x => x.sensor === 'lamp.gps.contextual' && x.data.context.social === 'friends')
                                .length
                        },
                        {
                            label: 'Family',
                            value: (this.state.sensor_events || [])
                                .filter(x => x.sensor === 'lamp.gps.contextual' && x.data.context.social === 'family')
                                .length
                        },
                        {
                            label: 'Peers',
                            value: (this.state.sensor_events || [])
                                .filter(x => x.sensor === 'lamp.gps.contextual' && x.data.context.social === 'peers')
                                .length
                        },
                        {
                            label: 'Crowd',
                            value: (this.state.sensor_events || [])
                                .filter(x => x.sensor === 'lamp.gps.contextual' && x.data.context.social === 'crowd')
                                .length
                        },
                    ],
                    [
                        {
                            label: 'Home',
                            value: (this.state.sensor_events || [])
                                .filter(x => x.sensor === 'lamp.gps.contextual' && x.data.context.environment === 'home')
                                .length
                        },
                        {
                            label: 'School',
                            value: (this.state.sensor_events || [])
                                .filter(x => x.sensor === 'lamp.gps.contextual' && x.data.context.environment === 'school')
                                .length
                        },
                        {
                            label: 'Work',
                            value: (this.state.sensor_events || [])
                                .filter(x => x.sensor === 'lamp.gps.contextual' && x.data.context.environment === 'work')
                                .length
                        },
                        {
                            label: 'Hospital',
                            value: (this.state.sensor_events || [])
                                .filter(x => x.sensor === 'lamp.gps.contextual' && x.data.context.environment === 'hospital')
                                .length
                        },
                        {
                            label: 'Outside',
                            value: (this.state.sensor_events || [])
                                .filter(x => x.sensor === 'lamp.gps.contextual' && x.data.context.environment === 'outside')
                                .length
                        },
                        {
                            label: 'Shopping',
                            value: (this.state.sensor_events || [])
                                .filter(x => x.sensor === 'lamp.gps.contextual' && x.data.context.environment === 'shopping')
                                .length
                        },
                        {
                            label: 'Transit',
                            value: (this.state.sensor_events || [])
                                .filter(x => x.sensor === 'lamp.gps.contextual' && x.data.context.environment === 'transit')
                                .length
                        },
                    ]
                ]
            } />
        </Card>
        {/*<Card style={{ marginTop: 16, marginBotton: 16 }}>
            <Typography component="h6" variant="h6" style={{ width: '100%', textAlign: 'center', margin: 16 }}>
                Step Count
            </Typography>
            <Divider style={{ marginBottom: 16 }} />
            {console.dir((this.state.sensor_events || []))}
            <Sparkline 
                minWidth={250}
                minHeight={250}
                XAxisLabel="Time"
                YAxisLabel="Steps Taken"
                color={blue[500]}
                data={(this.state.sensor_events || [])
                      .filter(x => x.sensor === 'lamp.steps')
                      .map(d => ({ 
                          x: new Date(d.timestamp), 
                          y: d.data.value
                      }))}
                lineProps={{
                  dashArray: '3 1',
                  dashType: 'dotted',
                  cap: 'butt'
                }} />
        </Card>*/}
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
