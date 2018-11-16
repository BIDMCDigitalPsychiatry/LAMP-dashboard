import React from 'react'
import ReactDOM from 'react-dom'
import Timeline from '../components/timeline.js';
import { withRouter } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import LAMP from '../lamp.js';
import { TransitIcon, HospitalIcon, HomeIcon, OutsideIcon, SchoolIcon, ShoppingIcon, WorkIcon } from '../components/lamp_icons.js'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import FaceIcon from '@material-ui/icons/Face';
import GroupIcon from '@material-ui/icons/Group';
import PublicIcon from '@material-ui/icons/Public';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Document, Page } from 'react-pdf'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import VariableBarGraph from '../components/variable_bar_graph.js'
import Grid from "@material-ui/core/Grid/Grid";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { rangeTo } from '../components/utils'

const hourOnlyDateFormat = {
	weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
	hour: 'numeric', /*minute: 'numeric', second: 'numeric', */
}

// Note the surveys we want to use in the average plot with their initial slot number.
const usableSurveys = {
	'ANXIETY, PSYCHOSIS, AND SOCIAL': 0,
	'MOOD, SLEEP, AND SOCIAL': 16,
	'ANXIETY': 0,
	'PSYCHOSIS AND SOCIAL': 7,
	'MOOD': 16,
	'SLEEP AND SOCIAL': 25,
}

// Note the short-name mappings for the above survey questions.
const surveyMap = {
	"Today I feel anxious": "Anxious",
	"Today I cannot stop worrying": "Constant Worry",
	"Today I am worrying too much about different things": "Many Worries",
	"Today I have trouble relaxing": "Can't Relax",
	"Today I feel so restless it's hard to sit still": "Restless",
	"Today I am easily annoyed or irritable": "Irritable",
	"Today I feel afraid something awful might happen": "Afraid",
	"Today I have heard voices or saw things others cannot": "Voices",
	"Today I have had thoughts racing through my head": "Racing Thoughts",
	"Today I feel I have special powers": "Special Powers",
	"Today I feel people are watching me": "People watching me",
	"Today I feel people are against me": "People against me",
	"Today I feel confused or puzzled": "Confused",
	"Today I feel unable to cope and have difficulty with everyday tasks": "Unable to cope",
	"In the last THREE DAYS, I have had someone to talk to": "Someone to talk to",
	"In the last THREE DAYS, I have felt uneasy with groups of people": "Uneasy in groups",
	"Today I feel little interest or pleasure": "Low interest",
	"Today I feel depressed": "Depressed",
	"Today I had trouble sleeping": "Trouble Sleeping",
	"Today I feel tired or have little energy": "Low Energy",
	"Today I have a poor appetite or am overeating": "Low/High Appetite",
	"Today I feel bad about myself or that I have let others down": "Poor self-esteem",
	"Today I have trouble focusing or concentrating": "Can't focus",
	"Today I feel too slow or too restless": "Feel slow",
	"Today I have thoughts of self-harm": "Self-harm",
	"Last night I had trouble falling asleep": "Can't fall asleep",
	"Last night I have had trouble sleeping": "Trouble sleeping",
	"Last night I had trouble staying asleep": "Can't stay asleep",
	"This morning I was up earlier than I wanted": "Waking up early",
	"In the last THREE DAYS, I have taken my medications as scheduled": "Medication",
	"In the last THREE DAYS, during the daytime I have gone outside my home": "Spent time outside",
	"In the last THREE DAYS, I have preferred to spend time alone": "Prefer to be alone",
	"In the last THREE DAYS, I have had arguments with other people": "Arguments with others"
}

class Participant extends React.Component {
    state = {
        timeline: [],
        attachments: [],
        selected: [],
        avgData: [],

		zoomLevel: 4, // default grid setting for plots!
        ping: null
    }

    cardRefs = {}

    iconMap = {
        location: {
            home: <HomeIcon style={{fontSize: '64px'}} />,
            school: <SchoolIcon style={{fontSize: '64px'}} />,
            work: <WorkIcon style={{fontSize: '64px'}} />,
            hospital: <HospitalIcon style={{fontSize: '64px'}} />,
            outside: <OutsideIcon style={{fontSize: '64px'}} />,
            shopping: <ShoppingIcon style={{fontSize: '64px'}} />,
            transit: <TransitIcon style={{fontSize: '64px'}} />
        },
        social: {
            alone: <FaceIcon style={{fontSize: '64px'}} />,
            friends: <GroupIcon style={{fontSize: '64px'}} />,
            family: <GroupIcon style={{fontSize: '64px'}} />,
            peers: <GroupIcon style={{fontSize: '64px'}} />,
            crowd: <PublicIcon style={{fontSize: '64px'}} />
        }
    }

    shortDateFormat = {
        year: '2-digit', month: '2-digit', day: '2-digit',
    }

    componentWillMount() {
		this.props.layout.pageLoading(false)

        let { id } = this.props.match.params
		if (id === 'me' && (LAMP.auth || {type: null}).type === 'participant')
		    id = LAMP.get_identity().id
		if (!id || id === 'me') {
		    this.props.history.replace(`/`)
			return
		}
        this.props.layout.setTitle(`Participant ${id}`)

        // Load the Leaflet Maps API's CSS.
        document.loadCSS('https://unpkg.com/leaflet@1.3.4/dist/leaflet.css')

        // Fetch attachments first since they will take the longest.
        Promise.all(rangeTo(10).map(async i => {
            let res = await LAMP.Participant.get_attachment(id, 'org.bidmc.digitalpsych.lamp.viz' + (i + 1), undefined, {untyped: true})
            var exists = (res.hasOwnProperty('output') && (typeof res.output === 'string'));
            if (res.hasOwnProperty('log'))
                console.log(res.log)
            return (exists ? res.output.replace(/\s/g, '') : null)
        })).then(res => this.setState({attachments:res}))
            .catch(res => console.error(res))

        // Fetch all participant-related data streams.
        var p1 = LAMP.Activity.all_by_participant(id)
        var p2 = LAMP.Result.all_by_participant(id)
        var p3 = LAMP.EnvironmentEvent.all_by_participant(id)
        var p4 = LAMP.FitnessEvent.all_by_participant(id)
        Promise.all([p1, p2, p3, p4]).then(res => {

            // Flatten all linked activities' names into each Result object.
            let res1 = res[1].map(x => ({
                id: x.id,
                event_type: 'result',
                timestamp: x.start_time,
                duration: x.end_time - x.start_time,
                activity_type: (
                        x.activity === null ? null : res[0].find(y => x.activity === y.id).type
                ),
                name: (
                    x.activity === null ? 
                    x.static_data.survey_name :
                   res[0].find(y => x.activity === y.id).name
                ),
                summary: x.activity === null ? null : x.static_data,
                detail: x.temporal_events
            }))

			let res2 = res[2].map(x => {
                x.event_type = 'environment'
                if (!!x.accuracy)
                    x.coordinates = x.coordinates.split(',').map(x => parseFloat(x))
                return x
            })

            // Flatten all fitness samples into individual objects.
			let res3 = res[3].map(x => x.record.map(y => {
                var z = Object.assign({ event_type: 'fitness' }, x)
                delete z.record
                Object.assign(z, y)
                return z
            })).flat()

            // Compute a timeline data stream sorted by timestamp.
			let resT = [].concat(res1, res2, res3)
                             .sort((a, b) => b.timestamp - a.timestamp)

            // Create sub-slices into the timeline grouped by environmental context.
			let timeline = []
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

            let avgData = this.surveyBarPlotData(timeline) || []

            // Update state now with the fetched & computed objects.
            this.setState({ timeline: timeline, avgData: avgData })
			this.props.layout.pageLoading(true)
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
    timeOfDayTheme = (timestamp) => {
        let hour = Math.floor(new Date(timestamp).getHours())
        if (hour > 8 && hour < 18)
            return {palette: {type: 'light', background: {paper: '#FFFFFF'}}}
        else return {palette: {type: 'dark', background: {paper: '#212121'}}}
    }

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

    surveyBarPlotData = (timeline) => {

    	// Accumulate all survey data into a single object from the timeline.
		let surveyData = []
		timeline.filter(x => !!x.find(y => y.event_type === 'result')).map(slice => [
			slice.filter(x => (x.event_type === 'result' && x.activity_type !== 'game')).map(event => [
				surveyData.push(event)
			])])

		// Iterate over every survey taken and assort into one average list.
		// Ignore the survey if we don't mark it in the usableSurveys list.
		let averageData = rangeTo(32).map(() => [])
		for (let i = 0; i < surveyData.length; i++) {
			let slot = usableSurveys[surveyData[i].name.toUpperCase()]
			if (slot === undefined) continue;

			for (let j = 0; j < surveyData[i].detail.length; j++) {
				averageData[slot + j].push({
					x: surveyData[i].detail[j].elapsed_time,
					y: surveyData[i].detail[j].value,
					z: surveyData[i].detail[j].item
				})
			}
		}

		// Compress the average data arrays (x32) into single event summaries (x32).
		return this.convertGraphData({ detail: averageData.map(a => ({
			elapsed_time: a.reduce((a, b) => a + b.x, 0) / a.length,
			value: a.reduce((a, b) => a + b.y, 0) / a.length,
			item: a.length > 0 ? a[0].z : ''
		}))})
    }

    timelineData = () => {

        var dataArray = []
        var dateArray = []
        var dateObjects = {}

        function addValueToList(key, value) {
            //if the list is already created for the "key", then uses it
            //else creates new list for the "key" to store multiple values in it.
            dateObjects[key] = dateObjects[key] || [];
            if (dateObjects[key] >= 1) {
                dateObjects[key] = dateObjects[key] + value
            } else {
                dateObjects[key] = value
            }
        }

        var getDateArray = function (start, end) {
            var arr = new Array();
            var dt = new Date(start);
            while (dt <= end) {
                arr.push(new Date(dt));
                dt.setDate(dt.getDate() + 1);
            }
            return arr;
        }

        function addToDateArray(date) {
            dateArray.push(date)
        }

        this.state.timeline.filter(x => !!x.find(y => y.event_type === 'result')).map(slice => [
            slice.filter(x => x.event_type === 'result').map(event => [
                addValueToList(new Date(event.timestamp).toLocaleString('en-US', this.shortDateFormat), 1),
                addToDateArray(event.timestamp)
            ])])

        if (dateArray.length > 0) {
            let startDate = new Date(Math.min(...dateArray))
            let endDate = new Date()
            var completeDateArray = getDateArray(startDate, endDate);
            for (var i = 0; i< completeDateArray.length; i++) {
                if (completeDateArray[i].toLocaleString('en-US', this.shortDateFormat) in dateObjects) {
                    dataArray[i] = dateObjects[completeDateArray[i].toLocaleString('en-US', this.shortDateFormat)]
                } else {
                    dataArray[i] = 0
                }
            }
        }

        return [dataArray, completeDateArray]
    }

    // Convert a Result timeline event into a VariableBarGraph object.
    convertGraphData = (e) => !e.detail ? [] : e.detail.map(x => !!x ?
        ({
            x: x.elapsed_time || 0,
            y: (e.activity_type === 'game' ? (parseFloat(x.item) || 0) : x.value),
            longTitle: x.item,
            shortTitle: surveyMap[x.item],
        }) : ({ x: 0, y: 0, longTitle: '', shortTitle: '' }))

    render = () =>
    <div>
        <AppBar style={{ background: '#fafafa' }}>
            <div style={{ padding: '32px 10px 0px 10px' }}>
                <Timeline
                    inputData={this.timelineData()}
                    onClick={data => event => {
                        let dateKey = this.timelineData()[1][data.datumIndex].toLocaleString('en-US', this.shortDateFormat);
                        if (!!this.cardRefs[dateKey]) {
                            let element = ReactDOM.findDOMNode(this.cardRefs[dateKey])

                            // First scroll it into view, then scroll it into the center of the viewport by offset.
							element.scrollIntoView(true)
							var viewportH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
							window.scrollBy(0, (element.getBoundingClientRect().height - viewportH) / 2)
                        }
                    }} />
            </div>
        </AppBar>
        <div style={{marginTop: 60}} />
        <VariableBarGraph
            rotateText
            data={this.state.avgData}
            height={400}/>
		{!this.state.attachments ? <div/> :
			<React.Fragment>
				<Toolbar>
					<Typography gutterBottom variant="h2">Visualizations</Typography>
                    <div style={{ flexGrow: 1 }} />
					<Typography variant="body1" style={{marginRight: 16}}>
						Zoom
					</Typography>
					<ToggleButtonGroup value={this.state.zoomLevel} exclusive onChange={(e, x) => this.setState({ zoomLevel: x })}>
						<ToggleButton value={3}>1</ToggleButton>
						<ToggleButton value={4}>2</ToggleButton>
						<ToggleButton value={6}>3</ToggleButton>
						<ToggleButton value={12}>4</ToggleButton>
					</ToggleButtonGroup>
                </Toolbar>
				<br />
                <Grid
                    container
                    direction="row"
                    justify="space-around"
                    alignItems="stretch"
                    spacing={32}>
                    {!this.state.attachments ? <div/> : this.state.attachments.filter(Boolean).map(attach =>
                        <Grid item xs={this.state.zoomLevel}>
                            <Card style={{ padding: '.3rem' }}>
                                <Document
                                    file={'data:application/pdf;base64,' + attach}
                                    error={
                                        <Typography variant="body1" color="error">
                                            Visualization error occurred.
                                        </Typography>
                                    }
                                    loading="">
                                    <Page renderMode="svg" pageIndex={0}/>
                                </Document>
                            </Card>
                        </Grid>
                    )}
				</ Grid>
			</React.Fragment>
		}
        <Divider style={{ marginTop: 32, marginBottom: 32 }} />
		<Toolbar>
			<Typography gutterBottom variant="h2">Timeline</Typography>
		</Toolbar>
        {this.state.timeline.filter(x => !!x.find(y => y.event_type === 'result')).map(slice => [
            <MuiThemeProvider theme={createMuiTheme(this.timeOfDayTheme(slice[0].timestamp))}>
            <Card
                ref={ref => {
                    let dateKey = new Date(slice[0].timestamp).toLocaleString('en-US', this.shortDateFormat)
                    this.cardRefs[dateKey] = ref
            }   }
                style={{ display: 'flex', justifyContent: 'space-between' }}>
                {[slice.find(x => x.event_type === 'environment' && x.coordinates !== undefined)].filter(x => x).map(event => 
                    <Map style={{ flex: 1, zIndex: 1 }}
                        center={(this.geocode(event.coordinates))}
                        zoom={12}>
                        <TileLayer url="https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYXZhaWR5YW0iLCJhIjoiY2ptdXgxYnRsMDBsNjNwczljamFqcGhlbCJ9.i83hpdMr12ylrgJGAWsjWw" />
                        <Marker position={(this.geocode(event.coordinates))} />
                    </Map>
                )}
                <List style={{ flex: 0, marginLeft: 10, marginRight: -16 }}>
                    {[slice.find(x => !!x.location_context)].map(event =>
                        <Tooltip title={!event ? 'home' : event.location_context}>
                            <ListItem dense disableGutters>
                                <ListItemIcon>{this.iconMap.location[!event ? 'home' : event.location_context]}</ListItemIcon>
                            </ListItem>
                        </Tooltip>
                    )}
                    {[slice.find(x => !!x.social_context)].map(event => 
                        <Tooltip title={!event ? 'alone' : event.social_context}>
                            <ListItem dense disableGutters>
                                <ListItemIcon>{this.iconMap.social[!event ? 'alone' : event.social_context]}</ListItemIcon>
                            </ListItem>
                        </Tooltip>
                    )}
                </List>
                <List style={{ flex: 2 }}>
                    {[slice.find(x => x.event_type === 'environment')].filter(x => x).map(event => 
                        <ListItem>
                            <ListItemText 
                                primaryTypographyProps={{variant: 'title'}}
                                primary={Date.formatUTC(event.timestamp, hourOnlyDateFormat)}
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
                                </ListItemIcon> :
                                (!!event.summary || !!event.detail) ? 
                                <ListItemIcon style={{marginRight: 0}}>
                                    <ExpandMoreIcon />
                                </ListItemIcon>  :
                                <div />
                            }
                        </ListItem>, 
                        <Collapse 
                            style={{ width: '90%', marginBottom: 10, marginLeft: 'auto', marginRight: 'auto' }}
                            in={this.state.selected.includes(event.id)} 
                            timeout="auto" 
                            unmountOnExit>
								<VariableBarGraph
                                    data={this.convertGraphData(event)}
                                    rotateText={event.activity_type !== 'game'}
                                    height={400}/>
                        </Collapse>,
                    ]).flat().filter(x => x)}
                </List>
            </Card>
            <br />
            </MuiThemeProvider>
        ])}
    </div>
}

export default withRouter(Participant)
