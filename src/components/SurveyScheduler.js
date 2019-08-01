
// Core Imports
import React from 'react'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import ReorderIcon from '@material-ui/icons/Reorder'
import HelpIcon from '@material-ui/icons/Help'
import EditIcon from '@material-ui/icons/Edit'
import CalendarIcon from '@material-ui/icons/CalendarToday'
import SettingsIcon from '@material-ui/icons/Settings'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import AddIcon from '@material-ui/icons/Add'
import MaterialTable from 'material-table'

const defaultSurveys = [{
        surveyName: "Anxiety (GAD-7)",
        type: "Survey",
        flag: "preset",
        questions: [{
                question: "Today I feel anxious",
                answerType: "Likert (0-3)",
                notes: ""
            },
            {
                question: "Today I cannot stop worrying",
                answerType: "Likert (0-3)",
                notes: ""
            },
            {
                question: "Today I am worrying too much about different things",
                answerType: "Likert (0-3)",
                notes: ""
            },
            {
                question: "Today I have trouble relaxing",
                answerType: "Likert (0-3)",
                notes: ""
            },
            {
                question: "Today I feel so restless it's hard to sit still",
                answerType: "Likert (0-3)",
                notes: ""
            },
            {
                question: "Today I am easily annoyed or irritable",
                answerType: "Likert (0-3)",
                notes: ""
            },
            {
                question: "Today I feel afraid something awful might happen",
                answerType: "Likert (0-3)",
                notes: ""
            }
        ],
        schedule: []
    },
    {
        surveyName: "Mood (PHQ-9)",
        type: "Survey",
        flag: "preset",
        questions: [{
                question: "Today I feel little interest or pleasure",
                answerType: "Likert (0-3)",
                notes: ""
            },
            {
                question: "Today I feel depressed",
                answerType: "Likert (0-3)",
                notes: ""
            },
            {
                question: "Today I had trouble sleeping",
                answerType: "Likert (0-3)",
                notes: ""
            },
            {
                question: "Today I feel tired or have little energy",
                answerType: "Likert (0-3)",
                notes: ""
            },
            {
                question: "Today I have a poor appetite or am overeating",
                answerType: "Likert (0-3)",
                notes: ""
            },
            {
                question: "Today I feel bad about myself or that I have let others down",
                answerType: "Likert (0-3)",
                notes: ""
            },
            {
                question: "Today I have trouble focusing or concentrating",
                answerType: "Likert (0-3)",
                notes: ""
            },
            {
                question: "Today I feel too slow or too restless",
                answerType: "Likert (0-3)",
                notes: ""
            },
            {
                question: "Today I have thoughts of self-harm",
                answerType: "Likert (0-3)",
                notes: ""
            }
        ],

        schedule: []
    },
    {
        surveyName: "Sleep",
        type: "Survey",
        flag: "preset",
        questions: [{
                question: "Last night I had troulbe falling asleep",
                answerType: "Likert (0-3)",
                notes: ""
            },
            {
                question: "Last night I had trouble staying asleep",
                answerType: "Likert (0-3)",
                notes: ""
            },
            {
                question: "This morning I was up earlier than I wanted",
                answerType: "Likert (0-3)",
                notes: ""
            }
        ],
        schedule: []
    },
    {
        surveyName: "Psychosis",
        type: "Survey",
        flag: "preset",
        questions: [{
                question: "Today I have heard voices or saw things others cannot",
                answerType: "Likert (0-3)",
                notes: ""
            },
            {
                question: "Today I have had thoughts racing through my head",
                answerType: "Likert (0-3)",
                notes: ""
            },
            {
                question: "Today I feel I have special powers",
                answerType: "Likert (0-3)",
                notes: ""
            },
            {
                question: "Today I feel people are watching me",
                answerType: "Likert (0-3)",
                notes: ""
            },
            {
                question: "Today I feel people are against me",
                answerType: "Likert (0-3)",
                notes: ""
            },
            {
                question: "Today I feel confused or puzzled",
                answerType: "Likert (0-3)",
                notes: ""
            },
            {
                question: "Today I feel unable to cope and have difficulty with everyday tasks",
                answerType: "Likert (0-3)",
                notes: ""
            }
        ],
        schedule: []
    },
    {
        surveyName: "Medication",
        type: "Survey",
        flag: "preset",
        questions: [{
            question: "In the last THREE DAYS, I have taken my medications as scheduled",
            answerType: "Yes/No",
            notes: ""
        }],
        schedule: []
    },
    {
        surveyName: "Jewels Trails A",
        type: "Game",
        flag: "preset",
        questions: [{}],
        schedule: [],
        notes: ""
    },
    {
        surveyName: "Jewels Trails B",
        type: "Game",
        flag: "preset",
        questions: [{}],
        schedule: []
    },
    {
        surveyName: "Spatial Span",
        type: "Game",
        flag: "preset",
        questions: [{}],
        schedule: []
    },
    {
        surveyName: "Cats and Dogs",
        type: "Game",
        flag: "preset",
        questions: [{}],
        schedule: []
    }
]

export default class SurveyScheduler extends React.Component {
    state = {
        surveys: [],
        dialogOpen: false,
        helpDialogOpen: false,
        scheduleDialogOpen: false,
        questionsDialogOpen: false,
        currentRow: {}
    }

    formatAMPM = (date) => {
	  var hours = date.getHours()
	  var minutes = date.getMinutes()
	  var ampm = hours >= 12 ? 'PM' : 'AM'
	  hours = hours % 12
	  hours = hours ? hours : 12 // the hour '0' should be '12'
	  minutes = minutes < 10 ? '0'+minutes : minutes
	  var strTime = hours + ':' + minutes + ' ' + ampm
	  return strTime
	}


    handleDialogOpen = (type) => {
        switch (type) {
            case 'preset':
                return () => this.setState({ dialogOpen: true })
            case 'help':
                return () => this.setState({ helpDialogOpen: true })
            case 'schedule':
                return () => this.setState({ scheduleDialogOpen: true })
            case 'questions':
                return () => this.setState({ questionsDialogOpen: true })
            default:
                return () => this.setState({ dialogOpen: true })
        }
    }

    handleDialogClose = (type) => {
        switch (type) {
            case 'preset':
                return () => this.setState({ dialogOpen: false })
            case 'help':
                return () => this.setState({ helpDialogOpen: false })
            case 'schedule':
                return () => this.setState({ scheduleDialogOpen: false })
            case 'questions':
                return () => this.setState({ questionsDialogOpen: false })
            default:
                return () => this.setState({ dialogOpen: false })
        }
    }

    handleContactUs = () => {
        this.setState({ helpDialogOpen: false })
    }

    render = () =>
        <div>
    	<div style={{ flexGrow: 1, marginBottom: 10 }}>
	    		<Grid container spacing={24} direction='row' justify="flex-end" alignItems="center">
	    		<Grid item>
			    	<Button 
			    		variant="contained" 
			    		size="large"
			    		onClick={() => {
			    			this.setState({ surveys: [...this.state.surveys, ...defaultSurveys] })
			    			this.setState({ dialogOpen: true})
			    		}
			    		}>
			    		Load Preset Surveys and Games  
			    		<ReorderIcon/>
					</Button>
					    <Dialog
				          open={this.state.dialogOpen}
				          onClose={this.handleDialogClose('preset')}
				          aria-labelledby="alert-dialog-title"
				          aria-describedby="alert-dialog-description"
				        >
				          <DialogTitle id="alert-dialog-title">{"Presets loaded"}</DialogTitle>
				          <DialogContent>
				            <DialogContentText id="alert-dialog-description">
				               These surveys and games will appear in the app, but are not yet scheduled. Click <CalendarIcon/> to set up a scheduled day and time.  
				            </DialogContentText>
				          </DialogContent>
				          <DialogActions>
				            <Button onClick={this.handleDialogClose('preset')} color="primary" autoFocus>
				              Okay
				            </Button>
				          </DialogActions>
				        </Dialog>
				        </Grid>
				        <Grid item>
					<Button 
			    		variant="contained" 
			    		size="large"
			    		color="primary"
			    		onClick={() => {
		    				let tempSurveys = this.state.surveys
			    			tempSurveys.unshift({surveyName: 'New Survey', questions: [], schedule: [], type: "Survey", flag: "" })
			    			this.setState({ surveys: tempSurveys })}
			    		}>
			    		Add Custom Survey  
			    		<AddIcon/>
					</Button>
					</Grid>
					<Grid item>
					<IconButton
						onClick = {this.handleDialogOpen('help')} >
					<HelpIcon/>
					</IconButton>
						<Dialog
				          open={this.state.helpDialogOpen}
				          onClose={this.handleDialogClose('help')}
				          aria-labelledby="alert-dialog-title"
				          aria-describedby="alert-dialog-description"
				        >
				          <DialogTitle id="alert-dialog-title">{"Tips for Scheduling Surveys and Games"}</DialogTitle>
				          <DialogContent>
				            <DialogContentText id="alert-dialog-description">
				            	<ol>
				            	<li>
				                 To begin customizing your study, you can click <Button variant="contained" size="large"> Load Preset Surveys and Games <ReorderIcon/> </Button><br/> and/or <br/>
				                  <Button variant="contained" size="large" color="primary"> Add Custom Survey <AddIcon/> </Button><br/>
				                  </li>
				                  <li>
				                 Click <EditIcon/> to change the survey name and <SettingsIcon/> to edit or add new questions. <br/>
				                 </li>
				                 <li>
				                 Click <CalendarIcon/> to set a scheduled day and time for survey notifications to be broadcasted. <br/>
				                 </li>
				                 <li>
				                 Surveys that have been successfully scheduled will be <Typography variant="h6" style={{fontWeight: 'bold', color: 'green'}}>bold and green</Typography>.
				                 </li>
				                 <li>
				                 When you're done, click <Button variant="contained" color="primary">Register</Button>.
				                 </li>
				                 </ol>
				            </DialogContentText>
				          </DialogContent>
				          <DialogActions>
				          	<Button onClick={this.handleContactUs} color="secondary" href="mailto:team@digitalpsych.org">
				              Need more guidance? Contact us!
				            </Button>
				            <Button onClick={this.handleDialogClose('help')} color="primary" autoFocus>
				              Okay
				            </Button>
				          </DialogActions>
				        </Dialog>
				        </Grid>

					</Grid>
		</div>
            <MaterialTable 
                columns={[
                	{ title: 'Name', field: 'surveyName', cellStyle: (data, idx) => ({
                		color: this.state.surveys.filter(x => x.surveyName === data).map(x => x.schedule.length).filter(x => x > 0).length > 0 ? 'green' : undefined,
                		fontWeight: this.state.surveys.filter(x => x.surveyName == data).map(x => x.type === 'Game' ? 1 : x.questions.length).filter(x => x > 0).length > 0 ? 'bold' : undefined,
                	}) },
                	{ title: 'Type', field: 'type', readonly: true},
                	{ title: 'Notes', field: 'notes'},
                	{ title: 'Flag', field: 'flag', hidden: true}
                ]}
                localization={{
                	body: {
                		emptyDataSourceMessage: 'No surveys scheduled. Add surveys by clicking one of the options above.',
                		editRow: {
                			deleteText: 'Are you sure you want to delete this activity?'
                		}
                	}
                }}
                data = {this.state.surveys} 
                title = "Activities"
                actions = {[

                	rowData => ({
                	icon: (rowData.flag === "preset") ? '' : 'playlist_add',
                	tooltip: (rowData.flag === "preset") ? '' : 'Questions',
                	disabled: (rowData.flag === "preset"),
                	onClick: (event, rowData) => {
                		this.setState({currentRow: rowData})
                		this.setState({questionsDialogOpen: true})
                	}
                }),
                	rowData => ({
                	icon: 'calendar_today',
                	tooltip: 'Schedule',
                	disabled: false,
                	onClick: (event, rowData) => {
                		this.setState({currentRow: rowData})
                		this.setState({scheduleDialogOpen: true})
                	}
                })
                	]}
                editable={{
				    onRowUpdate: async (newData, oldData) => {
				    	let tempSurveys = this.state.surveys
				    	tempSurveys[oldData.tableData.id] = newData
				    	this.setState({ surveys: tempSurveys })
				    },
				    onRowDelete: async oldData => {
				    	let tempSurveys = this.state.surveys
				    	tempSurveys.splice(oldData.tableData.id, 1)
				    	this.setState({ surveys: tempSurveys })
				      },
				  }}

                options={{
                    actionsColumnIndex: -1,
                    pageSize: 5,
                    pageSizeOptions: [5, 10, 15, 20],
                    maxBodyHeight: 500,
                    search: false

                }}
            />  
        <div style={{marginTop: 20}} />
            <Button
                variant="outlined"
                color="default"
                style={{width: '35%'}}
                onClick={this.props.onCancel}>
                Cancel
            </Button>
            <Button
                variant="contained"
                color="primary"
                className="submit"
                style={{float: 'right', width: '35%'}}
                onClick={() => this.props.onSubmit(this.state)}>
                Register
                <input type="submit" style={{
                    cursor: 'pointer',
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    right: 0,
                    left: 0,
                    width: '100%',
                    opacity: 0,
                }}/>
            </Button>
                        <Dialog
                        	fullWidth={true}
                        	maxWidth={"md"}
				          open={this.state.questionsDialogOpen}
				          onClose={this.handleDialogClose('questions')}
				          aria-labelledby="alert-dialog-title"
				          aria-describedby="alert-dialog-description"
				        >
				          <DialogContent>
				            <DialogContentText id="alert-dialog-description">
             <MaterialTable
				columns={[
					{title: 'Question', field: 'question' }, 
					{title: 'Answer Type', field: 'answerType', lookup: 
					{
						"Likert (0-3)": "Likert (0-3)",
						"Yes/No": "Yes/No",
						"Scroll Wheel": "Scroll Wheel"
					}
				},
				{title: 'Notes', field: 'notes'}

					]}
                localization={{
                	body: {
                		emptyDataSourceMessage: 'Press the [+] button to begin adding questions to this survey.',
                		editRow: {
                			deleteText: 'Are you sure you want to delete this question?'
                		}
                	}
                }}
                data = {this.state.currentRow.questions}  
                title = "Questions"
	            editable={{
				    onRowAdd: newData => 
				    	new Promise((resolve, reject) => {
				    	let tempSurveys = this.state.surveys
				    	tempSurveys[this.state.currentRow.tableData.id].questions.push(newData)
				    	this.setState({ surveys: tempSurveys }, () => resolve())
				    }),
				    onRowUpdate: (newData, oldData) =>
				      new Promise((resolve, reject) => {
				    	let tempSurveys = this.state.surveys
				    	tempSurveys[this.state.currentRow.tableData.id].questions[oldData.tableData.id] = newData
				    	this.setState({ surveys: tempSurveys }, () => resolve())
				      }),
				    onRowDelete: oldData =>
				      new Promise((resolve, reject) => {
				    	let tempSurveys = this.state.surveys
				    	tempSurveys[this.state.currentRow.tableData.id].questions.splice(oldData.tableData.id, 1)
				    	this.setState({ surveys: tempSurveys }, () => resolve())
				      }),
				  }}
                options={{
                    actionsColumnIndex: -1,
                    pageSize: 5,
                    pageSizeOptions: [5, 10, 15, 20],
                    maxBodyHeight: 500,
                    search: false

                }}
                />
  
				     </DialogContentText>
				          </DialogContent>
				          <DialogActions>
				            <Button onClick={this.handleDialogClose('questions')} color="primary" autoFocus>
				              Done
				            </Button>
				          </DialogActions>
				        </Dialog>
				           <Dialog
				            fullWidth={true}
                        	maxWidth={"md"}
				          open={this.state.scheduleDialogOpen}
				          onClose={this.handleDialogClose('schedule')}
				          aria-labelledby="alert-dialog-title"
				          aria-describedby="alert-dialog-description"
				        >
				          <DialogContent>
				            <DialogContentText id="alert-dialog-description">
				                            <MaterialTable
				columns={[
                	{ title: 'Day', field: 'day', lookup: 
						{
							"Sunday": "Sunday",
							"Monday": "Monday",
							"Tuesday": "Tuesday",
							"Wednesday": "Wednesday",
							"Thursday": "Thursday",
							"Friday": "Friday",
							"Saturday": "Saturday"
						}
					},
                	{ title: 'Time', field: 'time', type: 'time' }
				]}
                localization={{
                	body: {
                		emptyDataSourceMessage: 'Press the [+] button to begin scheduling this activity.',
                		editRow: {
                			deleteText: 'Are you sure you want to delete this schedule item?'
                		}
                	}
                }}
                data = {this.state.currentRow.schedule}  
                title = "Schedule"            
	            editable={{
				    onRowAdd: newData => 
				    	new Promise((resolve, reject) => {
				    	let tempSurveys = this.state.surveys
				    	tempSurveys[this.state.currentRow.tableData.id].schedule.push(newData)
				    	this.setState({ surveys: tempSurveys }, () => resolve())
				    }),
				    onRowUpdate: (newData, oldData) =>
				      new Promise((resolve, reject) => {
				    	let tempSurveys = this.state.surveys
				    	tempSurveys[this.state.currentRow.tableData.id].schedule[oldData.tableData.id] = newData
				    	this.setState({ surveys: tempSurveys }, () => resolve())
				      }),
				    onRowDelete: oldData =>
				      new Promise((resolve, reject) => {
				    	let tempSurveys = this.state.surveys
				    	tempSurveys[this.state.currentRow.tableData.id].schedule.splice(oldData.tableData.id, 1)
				    	this.setState({ surveys: tempSurveys }, () => resolve())
				      }),
				  }}
                options={{
                    actionsColumnIndex: -1,
                    pageSize: 5,
                    pageSizeOptions: [5, 10, 15, 20],
                    maxBodyHeight: 500,
                    search: false

                }}
                />
				       </DialogContentText>
				          </DialogContent>
				          <DialogActions>
				            <Button onClick={this.handleDialogClose('schedule')} color="primary" autoFocus>
				              Done
				            </Button>
				          </DialogActions>
				        </Dialog>


    </div>
}