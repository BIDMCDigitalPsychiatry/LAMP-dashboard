
// Core Imports
import React from 'react'
import { withRouter } from 'react-router-dom'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import blue from '@material-ui/core/colors/blue'

// External Imports 
//import { Document, Page } from 'react-pdf'

// Local Imports
import LAMP from '../lamp'
import MultipleSelect from '../components/MultipleSelect'
import Sparkline from '../components/Sparkline'

// TODO: SensorEvents?

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
    <div>
        <MultipleSelect 
          title="Selected Charts"
          selected={this.state.selectedCharts || []}
          items={(this.state.activities || []).map(x => x.name)}
          onChange={x => this.setState({ selectedCharts: x })}
        />
        {(this.state.selectedCharts || []).length === 0 && 
            <Typography variant="h6" style={{ width: '100%', textAlign: 'center', marginTop: 32 }}>
                No charts selected. Please select a chart above to begin.
            </Typography>
        }
        {(this.state.activities || []).filter(x => (this.state.selectedCharts || []).includes(x.name)).map(activity =>
            <Card key={activity.id} style={{ marginTop: 16, marginBotton: 16 }}>
                <Typography component="h6" variant="h6" style={{ width: '100%', textAlign: 'center' }}>
                    {activity.name}
                </Typography>
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
                              y: d.temporal_events.reduce((prev, curr) => prev + (parseInt(curr.value) || (curr.value === 'Yes' ? 1 : 0)), 0) / 1000
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
    </div>
}

export default withRouter(Participant)
