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
import VariableBarGraph from '../components/variable_bar_graph.js'
import Grid from "@material-ui/core/Grid/Grid";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { rangeTo } from '../components/utils'
import HorizontalScroll from 'react-scroll-horizontal'
import LongitudinalSurveyGraphNP from '../components/longitudinal_survey_graph_np.js'
import Map from 'pigeon-maps'
import Marker from 'pigeon-marker'
import Overlay from 'pigeon-overlay'


const hourOnlyDateFormat = {
	weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
	hour: 'numeric', /*minute: 'numeric', second: 'numeric', */
}


// Note the surveys we want to use in the average plot with their initial slot number as well as expected length.
const usableSurveys = {
	'ANXIETY, PSYCHOSIS, AND SOCIAL': [0, 16],
	'MOOD, SLEEP, AND SOCIAL': [16, 16],
	'ANXIETY': [0, 7],
	'PSYCHOSIS AND SOCIAL': [7, 9],
	'MOOD': [16, 9],
	'SLEEP AND SOCIAL': [25, 7],
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
	"Last night I have had trouble falling asleep": "Can't fall asleep",
	"Last night I had trouble staying asleep": "Can't stay asleep",
	"This morning I was up earlier than I wanted": "Waking up early",
	"In the last THREE DAYS, I have taken my medications as scheduled": "Medication",
	"In the last THREE DAYS, during the daytime I have gone outside my home": "Spent time outside",
	"In the last THREE DAYS, I have preferred to spend time alone": "Prefer to be alone",
	"In the last THREE DAYS, I have had arguments with other people": "Arguments with others",
    "I trust this app to guide me towards my personal goals" : "Goals",
    "I believe this app's tasks will help me to address my problem" : "Tasks",
    "This app encourages me to accomplish tasks and make progress" : "Encouragement",
    "I agree that the tasks within this app are important for my goals" : "Tasks match goals",
    "This app is easy to use and operate" : "Usability",
    "This app supports me to overcome challenges" : "Support",
    "When I see others who are doing better than I am, I realize it's possible to improve" : "Can improve",
    "When I see others who are doing better than I am, I feel frustrated about my own situation" : "Frustrated",
    "When I see others who are doing worse than I am, I feel fear that my future will be similar to them" : "Similar future",
    "When I see others who are doing worse than I am, I feel relieved about my own situation" : "Relieved"
}

class NeuroPsychParticipant extends React.Component {
    state = {
        timeline: [],
        attachments: [],
        selected: [],
        avgData: [],
        surveyData: [],
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

    async componentWillMount() {
        this.props.layout.pageLoading(false)

        let { id } = this.props.match.params
        if (id === 'me' && (LAMP.auth || {type: null}).type === 'participant')
            id = LAMP.get_identity().id

        if (!id || id === 'me') {
            this.props.history.replace(`/`)
            return
        }
        this.props.layout.setTitle(`Participant ${id}`)

        // Fetch all participant-related data streams.
        const [activities, result_events, sensor_events] = await Promise.all([
            LAMP.Activity.all_by_participant(id), 
            LAMP.ResultEvent.all_by_participant(id), 
            LAMP.SensorEvent.all_by_participant(id)
        ])

        // Flatten all linked activities' names into each Result object.
        let res1 = result_events.map(x => ({
            event_type: 'result',
            timestamp: x.timestamp,
            duration: x.duration,
            activity_type: (
                    !!x.activity ? null : activities.find(y => {
                        return x.activity === y.id
                    }).spec
            ),
            name: (
                !!x.static_data.survey_name ? 
                x.static_data.survey_name :
               (activities.find(y => x.activity === y.id) || {}).name
            ),
            summary: x.activity === null ? null : x.static_data,
            detail: x.temporal_events
        }))

        let res2 = sensor_events.map(x => {
            x.event_type = 'sensor'
            return x
        })

        // Compute a timeline data stream sorted by timestamp.
        let resT = [].concat(res1, res2)
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

        // Accumulate the uniqued set of questions for every survey for this study.
        // This represents every possible question a participant might have.
        let questions = activities
                            .filter(x => x.spec === 'QWN0aXZpdHlTcGVjOjE~')
                            .map(x => x.settings)
                            .reduce((prev, curr) => prev.concat(curr), [])
                            .map(x => x.text)

        // Accumulate the set of responses to every question in this study.
        // This represents every possible answer a participant may have given.
        let answers = result_events
                        .filter(x => !!x.static_data && !!x.static_data.survey_name)
                        .map(x => x.temporal_events.map(y => ({ ...y, timestamp: x.timestamp })))
                        .reduce((prev, curr) => prev.concat(curr), [])

        // Zip-reduce every answer with its matching question and convert format.
        // This represents the X->Y map with optional bar width.
        let data = questions
                      .reduce((prev, curr) => ({
                          ...prev,
                          [curr]: answers.filter(a => a.item === curr)
                      }), {})

        // Average each question's answer array and convert it to the right format.
        // This produces an average whole-study event for every answer given.
        let avgData = Object.values(data).map(a => ({
            item: a.length > 0 ? a[0].item : '',
            value: a.reduce((a, b) => a + parseInt(b.value), 0) / a.length,
            duration: Math.floor(a.reduce((a, b) => a + b.duration, 0) / a.length)
        }))

        // "Rephrase" the zippered data for the mini sparkline plots.
        let surveyData = Object.entries(data)
                            .map(x => [x[0], x[1]
                                .map(y => ({
                                    category: y.item,
                                    value: parseInt(y.value),
                                    date: new Date(y.timestamp)
                                })
                            )])
                            .reduce((prev, curr) => ({ ...prev, [curr[0]]: curr[1] }), {})

        // Update state now with the new fetched & computed objects.
        this.setState({ 
            timeline: timeline, 
            avgData: this.convertGraphData({ detail: avgData }), 
            surveyData: surveyData 
        })            
        this.props.layout.pageLoading(true)
    }

    handleClick = (event) => {
        if (!this.requiresDetail(event))
            return

        // Toggle the event ID from the state's selected list.
        var array = this.state.selected

        if (!array.includes(event.timestamp))
            array.push(event.timestamp)
        else array = array.filter(x => x !== event.timestamp)        

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

        if (dateArray.length > 0 && !!dateObjects) {
            let startDate = new Date(Math.min(...dateArray))
            let dateObjectsArray = Object.entries(dateObjects)
            let lastDate = dateObjectsArray[0][0]
            let endDate = new Date(lastDate)
            endDate.setDate(endDate.getDate() + 1);
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
            x: x.duration || 0,
            y: (e.activity_type != null ? (parseFloat(x.item) || 0) : x.value),
            longTitle: x.item,
            shortTitle: surveyMap[x.item],
        }) : ({ x: 0, y: 0, longTitle: '', shortTitle: '' }))

    render = () =>
    <div>
        <AppBar style={{ background: '#fafafa' }}>
            <div style={{ padding: '32px 10px 0px 10px', overflow: 'scroll'}}>
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
        <div style={{ marginTop: 100 }} />
        <div>
            <Typography gutterBottom variant="h2">Visualizations</Typography>
            <Card style={{ marginTop: 50, marginBotton: 50, paddingLeft: 25, paddingRight: 25 }}>
                <Typography component="h6" variant="h6" style={{ width: '100%', textAlign: 'center' }}>
                    Average survey responses:
                </Typography>
                <VariableBarGraph
                    rotateText
                    data={this.state.avgData}
                    height={400} />
            </Card>
            {Object.keys(this.state.surveyData).map(cat =>
                <Card style={{ marginTop: 50, marginBotton: 50 }}>
                    <Typography component="h6" variant="h6" style={{ width: '100%', textAlign: 'center' }}>
                        {cat}
                    </Typography>
                    <LongitudinalSurveyGraphNP
                        rotateText
                        data={this.state.surveyData[cat]}
                        width={1000}
                        height={200}
                        margin = {{ left: 70, right: 20, top: 20, bottom: 40 }} />
                </Card>
            )}
        </div>
        <Divider style={{ marginTop: 32, marginBottom: 32 }} />
		<Toolbar>
			<Typography gutterBottom variant="h2">Timeline</Typography>
		</Toolbar>
        {this.state.timeline.filter(x => !!x.find(y => y.event_type === 'result')).map(slice => [
            <MuiThemeProvider theme={createMuiTheme(this.timeOfDayTheme(slice[0].timestamp))}>
            <Card ref={ref => {
				let dateKey = new Date(slice[0].timestamp).toLocaleString('en-US', this.shortDateFormat)
				this.cardRefs[dateKey] = ref
			}}>
				<Grid
					container
					direction="row"
					justify="space-between"
					alignItems="stretch"
					spacing={8}>
					<Grid item xs={3}>
						{[slice.find(x => x.event_type === 'sensor' && x.sensor === 'lamp.gps.contextual')].filter(x => x).map(event =>
                            <Map center={[event.data.latitude, event.data.longitude]} zoom={12}>
                                <Marker anchor={[event.data.latitude, event.data.longitude]} payload={1} onClick={({ event, anchor, payload }) => {} } />
                                    <Overlay anchor={[event.data.latitude, event.data.longitude]} offset={[120, 79]}>
                                      <img src='pigeon.jpg' width={240} height={158} alt='' />
                                    </Overlay>
                            </Map>                   
						)}
                        {!!slice.find(x => x.event_type === 'sensor' && x.sensor === 'lamp.gps.contextual') ? <React.Fragment /> :
                            <Typography variant="h6" style={{ height: '100%', textAlign: 'center' }}>
                                No location available.
                            </Typography>
                        }
					</Grid>
					<Grid container item
						  xs={1}
						  direction="column"
						  justify="space-around"
						  alignItems="stretch"
						  spacing={8}>
						<Grid item xs={6}>
							{[slice.find(x => x.event_type === 'sensor' && x.sensor === 'lamp.gps.contextual')].map(event =>
								<Tooltip title={!event ? 'home' : event.data.context.environment}>
									<ListItemIcon>{this.iconMap.location[!event ? 'home' : event.data.context.environment]}</ListItemIcon>
								</Tooltip>
							)}
						</Grid>
						<Grid item xs={6}>
							{[slice.find(x => x.event_type === 'sensor' && x.sensor === 'lamp.gps.contextual')].map(event =>
								<Tooltip title={!event ? 'alone' : event.data.context.social}>
									<ListItemIcon>{this.iconMap.social[!event ? 'alone' : event.data.context.social]}</ListItemIcon>
								</Tooltip>
							)}
						</Grid>
					</Grid>
					<Grid item xs={8}>
						<List>
							{[slice[0]].map(event =>
								<ListItem>
									<ListItemText
										primaryTypographyProps={{variant: 'title'}}
										primary={(Date.formatUTC(parseInt(event.timestamp), hourOnlyDateFormat))}
										secondary={
											slice.filter(x => !x.sensor === 'lamp.gps.contextual')
												.map(fit => fit.sensor.replace('_', ' ').replace('lamp.', '') + ': ' + fit.data.value)
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
										this.state.selected.includes(event.timestamp) ?
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
									in={this.state.selected.includes(event.timestamp)}
									timeout="auto"
									unmountOnExit>
									<VariableBarGraph
										data={this.convertGraphData(event)}
										rotateText={event.activity_type == null}
										height={400}/>
								</Collapse>,
							]).flat().filter(x => x)}
						</List>
					</Grid>
				</Grid>
            </Card>
            <br />
            </MuiThemeProvider>
        ])}
    </div>
}

export default withRouter(NeuroPsychParticipant)
