import React from 'react'
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import Card from '@material-ui/core/Card';
import LAMP from '../lamp.js';
import DataTable from '../components/datatable.js'
import { ArrayView } from '../components/datatable.js'
import Snackbar from '@material-ui/core/Snackbar'
import Typography from '@material-ui/core/Typography'
import Toolbar from '@material-ui/core/Toolbar';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import CreateIcon from '@material-ui/icons/Create';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AttachmentIcon from '@material-ui/icons/Attachment';
import EventBus from 'eventing-bus'
import { Document, Page } from 'react-pdf'
import { Map, TileLayer, Circle } from 'react-leaflet'

// TODO: Use mapbox://styles/mapbox/light-v9 or mapbox://styles/mapbox/dark-v9

// FIXME: Stubbed code for .flat() which is a new func...
Object.defineProperty(Array.prototype, 'flat', {
    value: function(depth = 1) {
      return this.reduce(function (flat, toFlatten) {
        return flat.concat((Array.isArray(toFlatten) && (depth-1)) ? toFlatten.flat(depth-1) : toFlatten);
      }, []);
    }
});

class Participant extends React.Component {
    state = {
        timeline: [],
        attachment: null,
        selected: [],

        ping: null
    }

    iconMap = {
        spacer: <div />,
        result: <CreateIcon />,
        environment: <LocationOnIcon />,
        fitness: <FavoriteIcon />
    }

    dateFormat = { 
        timeZone: 'America/New_York', 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', 
        hour: 'numeric', minute: 'numeric', second: 'numeric' 
    }

    componentWillMount() {
        const { id } = this.props.match.params
        EventBus.publish("set_title", `Participant ${id}`)

        // Load the Leaflet Maps API's CSS.
        document.loadCSS('https://unpkg.com/leaflet@1.3.4/dist/leaflet.css')

        // Fetch attachments first since they will take the longest.
        LAMP.Participant.get_attachment(id, 'org.bidmc.digitalpsych.lamp.viz1', undefined, { untyped: true }).then(res => {
            var exists = (res.hasOwnProperty('output') && (typeof res.output === 'string'));
            if (res.hasOwnProperty('log'))
                console.error(res.log)
            this.setState({ attachment: exists ? res.output.replace(/\s/g, '') : null })
        })

        // Fetch all participant-related data streams.
        var p1 = LAMP.Activity.all_by_participant(id)
        var p2 = LAMP.Result.all_by_participant(id)
        var p3 = LAMP.EnvironmentEvent.all_by_participant(id)
        var p4 = LAMP.FitnessEvent.all_by_participant(id)
        Promise.all([p1, p2, p3, p4]).then(res => {

            // Flatten all linked activities' names into each Result object.
            var res1 = res[1].map(x => ({
                id: x.id,
                event_type: 'result',
                timestamp: x.start_time,
                duration: x.end_time - x.start_time,
                name: (
                    x.activity === null ? 
                    x.static_data.survey_name :
                   res[0].find(y => x.activity === y.id).name
                ),
                summary: x.activity === null ? null : x.static_data,
                detail: x.temporal_events
            }))

            var res2 = res[2].map(x => {
                x.event_type = 'environment'
                if (!!x.accuracy)
                    x.coordinates = x.coordinates.split(',').map(x => parseFloat(x))
                return x
            })

            // Flatten all fitness samples into individual objects.
            var res3 = res[3].map(x => x.record.map(y => {
                var z = Object.assign({ event_type: 'fitness' }, x)
                delete z.record
                Object.assign(z, y)
                return z
            })).flat()

            // Compute a timeline data stream sorted by timestamp.
            var resT = [].concat(res1, res2, res3)
                             .sort((a, b) => b.timestamp - a.timestamp)
            var timeline = resT.slice()
            var inserted = 0

            for (var i = 1; i <= resT.length - 2; i++) {

                // Calculate number of spacers (by 2h) between two events.
                var diff = resT[i - 1].timestamp - resT[i].timestamp
                var spacers = Math.floor(diff / (2 * 60 * 60 * 1000))

                // Map the spacer count into fake objects.
                var objs = [...Array(spacers).keys()].map(x => ({
                    id: null,
                    event_type: 'spacer',
                    timestamp: null
                }))

                // Splice spacers into the cloned array and keep track of the new index.
                timeline.splice(i + inserted, 0, ...objs)
                inserted += spacers
            }

            // Update state now with the fetched & computed objects.
            this.setState({ timeline: timeline })
        })
    }

    handleClick = (event) => {
        if (!this.requiresDetail(event)) 
            return

        // Toggle the event ID from the state's selected list.
        var array = this.state.selected
        if (!array.includes(event.id))
            array.push(event.id)
        else array = array.filter(x => x !== event.id)

        this.setState({ selected: array })
    }

    // These events require a collapsable detail element.
    requiresDetail = (event) => (event.event_type === 'result' && !!event.detail)

    geocode = (address) => {
        if (Array.isArray(address))
            return address

        // Return cached coordinates if available.
        if (!localStorage.geoCoords)
            localStorage.geoCoords = JSON.stringify({})
        var geoCoords = JSON.parse(localStorage.geoCoords)
        if (!!geoCoords[address])
            return geoCoords[address]

        // Request the coordinates from Nominatim/OSM.
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`
        fetch(url).then(x => x.json()).then(result => {

            // Cache and return the coordinates.
            var geoCoords = JSON.parse(localStorage.geoCoords)
            geoCoords[address] = [
                parseFloat(result[0].lat) || 0.0, 
                parseFloat(result[0].lon) || 0.0
            ]
            localStorage.geoCoords = JSON.stringify(geoCoords)
            this.setState({ ping: address })
        })
        return [0, 0]
    }

    render = () =>
    <div>
        <Card style={{ width: '80%', marginTop: 20, marginLeft: 'auto', marginRight: 'auto' }}>
            <Toolbar
                className={(theme) => classNames({paddingRight: theme.spacing.unit})}>
                <Typography variant="title">Visualization</Typography>
            </Toolbar>
            <Divider />
            <div style={{ display: 'flex', justifyContent:'center', alignItems:'center' }}>
                {this.state.attachment !== null ?
                    (<Document 
                        error={<Typography variant="body2">Visualization error occurred.</Typography>}
                        loading={<Typography variant="body2">Loading visualization...</Typography>}
                        file={'data:application/pdf;base64,' + this.state.attachment}>
                        <Page renderMode="svg" pageIndex={0} />
                    </Document>) : 
                    (<Typography variant="body2">No visualization.</Typography>)
                }
            </div>
        </Card>
        <Card style={{ width: '80%', marginTop: 20, marginLeft: 'auto', marginRight: 'auto' }}>
            <Toolbar
                className={(theme) => classNames({paddingRight: theme.spacing.unit})}>
                <Typography variant="title">Timeline</Typography>
            </Toolbar>
            <Divider />
            <List>
                {this.state.timeline.map(event => [
                    <ListItem 
                        button={this.requiresDetail(event)}
                        onClick={() => this.handleClick(event)}>
                        <ListItemIcon>{this.iconMap[event.event_type]}</ListItemIcon>
                        <ListItemText inset 
                            primary={
                                (event.event_type === 'result') ? 
                                'Activity ' + event.name : 
                                (event.event_type === 'environment') ? 
                                'Location ' + event.coordinates : 
                                (event.event_type === 'fitness') ? 
                                event.value + ' ' + event.type : 
                                (' ')
                            } 
                            secondary={
                                !event.timestamp ? ' ' :
                                new Date(event.timestamp).toLocaleString('en-US', this.dateFormat)
                            } />
                            {this.state.selected.includes(event.id) ? 
                                <ExpandLessIcon /> : 
                                this.requiresDetail(event) ? <ExpandMoreIcon /> : <div />
                            }
                    </ListItem>, 

                    (!(event.event_type === 'result' && !!event.detail)) ? null : 
                    <Collapse 
                        style={{ marginLeft: '80px', marginRight: '80px' }}
                        in={this.state.selected.includes(event.id)} 
                        timeout="auto" 
                        unmountOnExit>
                        {event.summary !== null ? 
                            <div style={{ marginTop: '16px', marginBottom: '16px' }}>
                                <Typography variant="body2" align="center">
                                    Summary
                                </Typography>
                                <ArrayView value={[event.summary]} />
                            </div> : <div />
                        }
                        <Typography variant="body2" align="center">
                            Details
                        </Typography>
                        <ArrayView value={event.detail} />
                    </Collapse>, 

                    (event.event_type !== 'environment') ? null : 
                    <div style={{ marginLeft: '80px', marginRight: '80px' }}>
                        <Map 
                            center={(this.geocode(event.coordinates))} 
                            zoom={16} 
                            style={{ height: 196 }}>
                            <TileLayer 
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <Circle 
                                center={(this.geocode(event.coordinates))} 
                                fillColor="blue" 
                                radius={20} />
                        </Map>
                    </div>
                ]).flat().filter(x => x)}
            </List>
        </Card>
    </div>
}

export default withRouter(Participant);
