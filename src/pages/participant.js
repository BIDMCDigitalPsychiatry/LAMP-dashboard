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
import {participantTimeline, downloadParticipantEvents, convertGraphData} from '../components/processing_pipeline'

const hourOnlyDateFormat = {
	weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
	hour: 'numeric', /*minute: 'numeric', second: 'numeric', */
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

        // await LAMP.Type.get_dynamic_attachment(id, 'org.bidmc.digitalpsych.lamp.viz1', undefined, { untyped: true }).then(res => {
        //     var exists = (res.hasOwnProperty('output') && (typeof res.output === 'string'));
        //     if (res.hasOwnProperty('log'))
        //         console.error(res.log)
        //     this.setState({ attachment: exists ? res.output.replace(/\s/g, '') : null })
        // })

        const {timeline, avgData, surveyData} = participantTimeline(await downloadParticipantEvents(id))

        // Update state now with the new fetched & computed objects.
        this.setState({ 
            timeline: timeline, 
            avgData: convertGraphData(avgData), 
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

        <div>
            <Card style={{ marginTop: 50, marginBotton: 50, paddingLeft: 25, paddingRight: 25 }}>
                <Typography component="h6" variant="h6" style={{ width: '100%', textAlign: 'center' }}>
                    Average survey responses:
                </Typography>
                <VariableBarGraph
                    rotateText={false}
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
										data={convertGraphData(event.detail)}
										rotateText={false}
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
