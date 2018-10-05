import React from 'react'
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import Card from '@material-ui/core/Card';
import LAMP from '../lamp.js';
import DataTable from '../components/datatable.js'
import { ArrayView } from '../components/datatable.js'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import Snackbar from '@material-ui/core/Snackbar'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip';
import Toolbar from '@material-ui/core/Toolbar';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import CreateIcon from '@material-ui/icons/Create';
import AttachmentIcon from '@material-ui/icons/Attachment';
import HomeIcon from '@material-ui/icons/Home';
import SchoolIcon from '@material-ui/icons/School';
import WorkIcon from '@material-ui/icons/Work';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import LocationCityIcon from '@material-ui/icons/LocationCity';
import RestaurantIcon from '@material-ui/icons/Restaurant';
import DirectionsCarIcon from '@material-ui/icons/DirectionsCar';
import FaceIcon from '@material-ui/icons/Face';
import GroupIcon from '@material-ui/icons/Group';
import PublicIcon from '@material-ui/icons/Public';
import PersonPinCircleIcon from '@material-ui/icons/PersonPinCircle';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EventBus from 'eventing-bus'
import { Document, Page } from 'react-pdf'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
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
        location: {
            home: <HomeIcon />, 
            school: <SchoolIcon />, 
            work: <WorkIcon />, 
            hospital: <LocalHospitalIcon />, 
            outside: <LocationCityIcon />, 
            shopping: <RestaurantIcon />, 
            transit: <DirectionsCarIcon />
        },
        social: {
            alone: <FaceIcon />, 
            friends: <GroupIcon />, 
            family: <GroupIcon />, 
            peers: <GroupIcon />, 
            crowd: <PublicIcon />
        }
    }

    dateFormat = { 
        timeZone: 'America/New_York', 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', 
        hour: 'numeric', /*minute: 'numeric', second: 'numeric', */
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

            // Create sub-slices into the timeline grouped by environmental context.
            var timeline = []
            for (var i = 1, sliceIdx = 0; i <= resT.length - 2; i++) {
                var diff = resT[i - 1].timestamp - resT[i].timestamp

                // Determine whether this is a new sub-slice point (or the end of the timeline).
                if (Math.floor(diff / (60 * 60 * 1000)) > 0) {
                    timeline.push(resT.slice(sliceIdx, i))
                    sliceIdx = i
                }
                if (i == resT.length - 3)
                    timeline.push(resT.slice(sliceIdx, resT.length))
            }
            console.debug(timeline)

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

    //
    timeOfDayTheme = (timestamp) => [
        {palette: {type: 'dark', background: {paper: '#212121'}}},
        {palette: {type: 'dark', background: {paper: '#303F9F'}}},
        {palette: {type: 'light', background: {paper: '#FFAB00'}}},
        {palette: {type: 'light', background: {paper: '#00E5FF'}}},
        {palette: {type: 'dark', background: {paper: '#FF6D00'}}},
        {palette: {type: 'dark', background: {paper: '#311B92'}}},
    ][Math.floor(new Date(timestamp).getHours() / 4)]

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
                parseFloat((result[0] || {}).lat) || 0.0, 
                parseFloat((result[0] || {}).lon) || 0.0
            ]
            localStorage.geoCoords = JSON.stringify(geoCoords)
            this.setState({ ping: address })
        })
        return [0, 0]
    }

    render = () =>
    <div>
        {!this.state.attachment ? <div /> :
        <Card style={{ width: '80%', marginTop: 20, marginLeft: 'auto', marginRight: 'auto' }}>
            <Toolbar style={{ display: 'flex', justifyContent:'center', alignItems:'center' }}>
                <Typography variant="title">Visualization</Typography>
            </Toolbar>
            <div style={{ display: 'flex', justifyContent:'center', alignItems:'center' }}>
                <Document 
                    file={'data:application/pdf;base64,' + this.state.attachment}
                    error={<Typography variant="body2" color="error">
                        Visualization error occurred.
                    </Typography>}
                    loading="">
                    <Page renderMode="svg" pageIndex={0} />
                </Document>
            </div>
        </Card>}
        {this.state.timeline.filter(x => !!x.find(y => y.event_type === 'result')).map(slice => [
            <MuiThemeProvider theme={createMuiTheme(this.timeOfDayTheme(slice[0].timestamp))}>
            <Card style={{ 
                    display: 'flex', justifyContent: 'space-between', 
                    width: '80%', marginTop: 20, marginLeft: 'auto', marginRight: 'auto' }}>
                {[slice.find(x => x.event_type === 'environment' && x.coordinates !== undefined)].filter(x => x).map(event => 
                    <Map style={{ flex: 1 }}
                        center={(this.geocode(event.coordinates))} zoom={12}>
                        <TileLayer url="https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYXZhaWR5YW0iLCJhIjoiY2ptdXgxYnRsMDBsNjNwczljamFqcGhlbCJ9.i83hpdMr12ylrgJGAWsjWw" />
                        <Marker position={(this.geocode(event.coordinates))} />
                    </Map>
                )}
                <List style={{ flex: 0, marginLeft: 10, marginRight: -16 }}>
                    {[slice.find(x => x.event_type === 'environment' && x.coordinates !== undefined)].filter(x => x).map(event =>
                        <Tooltip title={'' + (event.coordinates || 'no location')}>
                            <ListItem dense disableGutters>
                                <ListItemIcon style={{fontSize: '64px'}}>
                                    <PersonPinCircleIcon />
                                </ListItemIcon>
                            </ListItem>
                        </Tooltip>
                    )}
                    {[slice.find(x => !!x.location_context)].filter(x => x).map(event =>
                        <Tooltip title={event.location_context}>
                            <ListItem dense disableGutters>
                                <ListItemIcon style={{fontSize: '64px'}}>
                                    {this.iconMap.location[event.location_context]}
                                </ListItemIcon>
                            </ListItem>
                        </Tooltip>
                    )}
                    {[slice.find(x => !!x.social_context)].filter(x => x).map(event => 
                        <Tooltip title={event.social_context}>
                            <ListItem dense disableGutters>
                                <ListItemIcon style={{fontSize: '64px'}}>
                                    {this.iconMap.social[event.social_context]}
                                </ListItemIcon>
                            </ListItem>
                        </Tooltip>
                    )}
                </List>
                <List style={{ flex: 2 }}>
                    {[slice.find(x => x.event_type === 'environment')].filter(x => x).map(event => 
                        <ListItem>
                            <ListItemText 
                                primaryTypographyProps={{variant: 'title'}}
                                primary={new Date(event.timestamp).toLocaleString('en-US', this.dateFormat)} 
                                secondary={
                                    slice.filter(x => x.event_type === 'fitness')
                                        .map(fit => fit.type.replace('_', ' ') + ': ' + fit.value)
                                        .join(', ')
                                } />
                        </ListItem>
                    )}
                    {slice.filter(x => x.event_type === 'result').map(event => [
                        <ListItem dense
                            button={this.requiresDetail(event)}
                            onClick={() => this.handleClick(event)}>
                            <ListItemText 
                                primaryTypographyProps={{variant: 'body2'}}
                                primary={event.name} />
                            {
                                this.state.selected.includes(event.id) ? 
                                <ListItemIcon style={{marginRight: 0}}>
                                    <ExpandLessIcon />
                                </ ListItemIcon> : 
                                (!!event.summary || !!event.detail) ? 
                                <ListItemIcon style={{marginRight: 0}}>
                                    <ExpandMoreIcon />
                                </ ListItemIcon>  : 
                                <div />
                            }
                        </ListItem>, 
                        <Collapse 
                            style={{ width: '90%', marginBottom: 10, marginLeft: 'auto', marginRight: 'auto' }}
                            in={this.state.selected.includes(event.id)} 
                            timeout="auto" 
                            unmountOnExit>
                            {
                                (!!event.summary ? 
                                <ArrayView value={[event.summary]} /> : 
                                (!!event.detail ? 
                                <ArrayView value={event.detail} /> :
                                <div />))
                            }
                        </Collapse>, 
                    ]).flat().filter(x => x)}
                </List>
            </Card>
            </MuiThemeProvider>
        ])}
    </div>
}

export default withRouter(Participant);
