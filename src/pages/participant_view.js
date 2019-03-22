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
import LongitudinalSurveyGraph from '../components/longitudinal_survey_graph.js'
import Grid from "@material-ui/core/Grid/Grid";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { rangeTo } from '../components/utils'
import AxisTest from '../components/axis_test.js'

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
const surveyCatMap = {'Today I feel little interest or pleasure':'Mood',
                      'Today I feel depressed':'Mood',
                      'Today I had trouble sleeping':'Mood',
                      'Today I had feel tired or have little energy':'Mood',
                      'Today I have poor appetite or am overeating':'Mood',
                      'Today I feel bad about myself or that I have let others down':'Mood',
                      'Today I have trouble focusing or concentrating':'Mood',
                      'Today I feel too slow or too restless':'Mood',
                      'Today I have thoughts of self-harm':'Mood',
                      'Last night I had trouble staying asleep':'Sleep',
                      'Last night I had trouble falling asleep':'Sleep',
                      'This morning I was up earlier than I wanted':'Sleep',
                      'In the last THREE DAYS, I have taken my medications as scheduled':'Medication',
                      'In the last THREE DAYS, during the daytime I have gone outside my home':'Social_Reverse',
                      'In the last THREE DAYS, I have had someone to talk to':'Social_Reverse',
                      'In the last THREE DAYS, I have preferred to spend time alone':'Social',
                      'In the last THREE DAYS, I have felt uneasy with groups of people':'Social',
                      'In the last THREE DAYS, I have had arguments with other people':'Social',
                      'Today I feel anxious':'Anxiety',
                      'Today I cannot stop worrying':'Anxiety',
                      'Today I am worrying too much about different things':'Anxiety',
                      'Today I have trouble relaxing':'Anxiety',
                      'Today I feel so restless it\'s hard to sit still':'Anxiety',
                      'Today I am easily annoyed or irritable':'Anxiety',
                      'Today I feel afraid something awful might happen':'Anxiety',
                      'Today I have heard voices or saw things others cannot':'Psychosis',
                      'Today I have had thoughts racing through my head':'Psychosis',
                      'Today I feel I have special powers':'Psychosis',
                      'Today I feel people are watching me':'Psychosis',
                      'Today I feel people are against me':'Psychosis',
                      'Today I feel confused or puzzled':'Psychosis',
                      'Today I feel unable to cope and have difficulty with everyday tasks':'Psychosis'}

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
    "When I see others who are doing worse than I am, I feel relieved about my own situation" : "Relieved"}

class ParticipantView extends React.Component {
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

        // Fetch all participant-related data streams.
        var p1 = LAMP.Activity.all_by_participant(id)
        var p2 = LAMP.ResultEvent.all_by_participant(id)
        var p3 = LAMP.SensorEvent.all_by_participant(id)
        Promise.all([p1, p2, p3]).then(res => {
            // Flatten all linked activities' names into each Result object.
            let res1 = res[1].map(x => ({
                id: x.id,
                event_type: 'result',
                timestamp: x.timestamp,
                duration: x.duration,
                activity_type: (
                        !!x.activity ? null : res[0].find(y => {
                            return x.activity === y.id
                        }).spec
                ),
                name: (
                    !x.activity ? 
                    x.static_data.survey_name :
                   (res[0].find(y => x.activity === y.id) || {}).name
                ),
                summary: x.activity === null ? null : x.static_data,
                detail: x.temporal_events
            }))

			let res2 = res[2].map(x => {
                x.event_type = 'sensor'
                if (!!x.accuracy)
                    x.coordinates = x.coordinates.split(',').map(x => parseFloat(x))
				else x.coordinates = [0, 0]
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

            let surveyData = this.surveyLongitudinalPlotData(timeline)

            // Update state now with the fetched & computed objects.
            
            this.setState({ timeline: timeline, surveyData: surveyData})
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

    surveyLongitudinalPlotData = (timeline) => {

        //Split surveys results based on category
        let surveyCategories = Object.values(surveyCatMap).filter((value, index, self) => self.indexOf(value) === index)
        
        let surveyDataDict = {}
        let result_events_slice = timeline.filter(x => !!x.find(y => y.event_type === 'result'))
        for (var i = 0; i < result_events_slice.length; i++) {
            let slice = result_events_slice[i]
            for (var j = 0; j < slice.length; j++) {
                let event = slice[j]
                
                if (event.event_type === "result") {
                    if (!!event.summary.survey_name) {

                        //Create new categories based on individuals questions
                        let eventDataDict = {}
                        event.detail.map(question => {
                            if (question.item in surveyCatMap) {
                                let category = surveyCatMap[question.item]
                                //Flip social score
                                if (category == 'Social_Reverse') { 
                                    question.value = 3 - question.value
                                    category = 'Social'
                                }

                                if (category in eventDataDict) {
                                    eventDataDict[category].push(question) 
                                }
                                else { 
                                    eventDataDict[category] = [question] 
                                }
                            }
                        })

                        Object.keys(eventDataDict).map(surveyCat => {
                            let event_copy = JSON.parse(JSON.stringify(event))
                            event_copy.detail = eventDataDict[surveyCat]
                            event_copy.summary = {survey_name: surveyCat}
                            if (!(surveyCat in surveyDataDict)) {
                                surveyDataDict[surveyCat] = [event_copy]
                            }

                            else {
                                surveyDataDict[surveyCat].push(event_copy)
                            }

                        })
                    } 
                }           
            }
        }
        
        //Sort survey groups by time
        Object.keys(surveyDataDict).map(cat => surveyDataDict[cat].sort(
            function timestamp_compare(res1, res2) {
                if (res1['timestamp'] < res2['timestamp']) {
                    return -1}
                return 1
            })
        )

        let sortedSurveyDataDict = Object.entries(surveyDataDict).reduce((cur, prev) => {
            cur[prev[0]] = []; return cur
        }, {})


        Object.keys(sortedSurveyDataDict).map(cat => surveyDataDict[cat].map(
            event => sortedSurveyDataDict[cat].push(
                {category: cat, date: new Date(event.timestamp), value: event.detail.map(ques => ques.value).reduce((val, total_val) => val + total_val) / event.detail.length}       
                )
            )
        )
        console.log(sortedSurveyDataDict)
        return sortedSurveyDataDict
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

    render = () =>
    <React.Fragment>
    {Object.keys(this.state.surveyData).map(cat =>
        <Card key={cat} style={{ marginBottom: 20, paddingTop: 20 }}>
            <Grid container
                  direction="column"
                  justify="space-around"
                  alignItems="center"
                  spacing={8}>
                <Grid item xs={8}>
                    <Typography variant="h3">
                        {cat}
                    </Typography>
                </Grid>
            </Grid>
            <Grid container
                  direction="row"
                  justify="space-around"
                  alignItems="center"
                  spacing={8}>
                <Grid item>
                        <LongitudinalSurveyGraph
                            rotateText
                            data={this.state.surveyData[cat]}
                            height={400}
                            width={800}
                            margin = {{left: 60, right:60, top:60, bottom:60}} />
                        <p style={{color: 'white'}}>
                        .
                        </p>
                    
                </Grid>
            </Grid>
        </Card>
    )}
    </React.Fragment>
}

export default withRouter(ParticipantView)
