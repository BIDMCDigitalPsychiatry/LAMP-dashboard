import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import SchemaForm from 'jsonschema-form-for-material-ui';
import AddIcon from '@material-ui/icons/Add';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, TimePicker } from 'material-ui-pickers';
import DataTable from '../components/datatable'
import React, { Component } from 'react';
import { render } from "react-dom";
import ReactDOMServer from 'react-dom/server';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import MaterialTable from 'material-table'
import MultipleSelect from '../components/multiple_select'
import Grid from '@material-ui/core/Grid';

const defaultSurveys = [
{
	surveyName: "Anxiety (GAD-7)",
	type: "Survey",
	questions: [
		{ 
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
			question: "Today I am easily annoyed or irritableious",
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
		questions: [
		{ 
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
		questions: [
		{ 
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
		}],
		schedule: []
	},
	{
		surveyName: "Psychosis",
		type: "Survey",
		questions: [
		{
			question: "Today I feel anxious",
			answerType: "Likert (0-3)",
			notes: ""
		}
		],
		schedule: []
	},
	{
		surveyName: "Medication",
		type: "Survey",
		questions: [
		{
			question: "In the last THREE DAYS, I have taken my medications as scheduled",
			answerType: "Yes/No",
			notes: ""
		}
		],
		schedule: []
	},
	{ 
		surveyName: "Jewels Trails A",
		type: "Game",
		questions: [
		{
		}
		],
		schedule: [],
		notes: ""
	},
	{ 
		surveyName: "Jewels Trails B",
		type: "Game",
		questions: [
		{
		}
		],
		schedule: []
	},	
	{ 
		surveyName: "Spatial Span",
		type: "Game",
		questions: [
		{
		}
		],
		schedule: []
	},
	{
		surveyName: "Cats and Dogs",
		type: "Game",
		questions: [
		{
		}
		],
		schedule: []
	}
]

export default class SurveyScheduler extends React.Component {
    state = { surveys: [] }
    render = () =>
    <div>
    	<div style={{ flexGrow: 1, marginBottom: 10 }}>
    		<Grid container spacing={24}>
	    		<Grid item xs>
		    		<Typography variant="h6">
		    			To finish creating your study, add some activities (surveys or cognitive tests) below.
		    		</Typography>
	    		</Grid>
	    		<Grid item xs={3}>
			    	<Button 
			    		variant="outlined" 
			    		onClick={() => this.setState({ surveys: [...this.state.surveys, ...defaultSurveys] })}>
			    		Load Preset Activities
					</Button>
				</Grid>
			</Grid>
		</div>
            <MaterialTable 
                columns={[
                	{ title: 'Name', field: 'surveyName', cellStyle: (data, idx) => ({
                		color: this.state.surveys.filter(x => x.surveyName == data).map(x => x.schedule.length).filter(x => x > 0).length > 0 ? 'green' : undefined,
                		fontWeight: this.state.surveys.filter(x => x.surveyName == data).map(x => x.type == 'Game' ? 1 : x.questions.length).filter(x => x > 0).length > 0 ? 'bold' : undefined,
                	}) },
                	{ title: 'Type', field: 'type', lookup: 
                		{ 'Survey': 'Survey', 'Game': 'Game' } },
                	{ title: 'Notes', field: 'notes'
                	}
                ]}
                localization={{
                	body: {
                		emptyDataSourceMessage: 'Press the [+] button to begin adding activities to your study, or press "Load Preset Activities" above to see some examples.',
                		editRow: {
                			deleteText: 'Are you sure you want to delete this activity?'
                		}
                	}
                }}
                data = {this.state.surveys} 
                title = "Activities"
                detailPanel = {
				[
				{
                  	icon: 'settings',
					tooltip: 'Questions',
                	render: rowData => rowData.type === "Survey" ? (
                   
             <div style={{ margin: '0 48px', width: '100%' }}>
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
                data = {rowData.questions}  
                title = "Questions"            
	            editable={{
				    onRowAdd: newData => 
				    	new Promise((resolve, reject) => {
				    	let tempSurveys = this.state.surveys
				    	tempSurveys[rowData.tableData.id].questions.push(newData)
				    	this.setState({ surveys: tempSurveys }, () => resolve())
				    }),
				    onRowUpdate: (newData, oldData) =>
				      new Promise((resolve, reject) => {
				    	let tempSurveys = this.state.surveys
				    	tempSurveys[rowData.tableData.id].questions[oldData.tableData.id] = newData
				    	this.setState({ surveys: tempSurveys }, () => resolve())
				      }),
				    onRowDelete: oldData =>
				      new Promise((resolve, reject) => {
				    	let tempSurveys = this.state.surveys
				    	tempSurveys[rowData.tableData.id].questions.splice(oldData.tableData.id, 1)
				    	this.setState({ surveys: tempSurveys }, () => resolve())
				      }),
				  }}
                options={{
                    actionsColumnIndex: -1,
                    pageSize: 5,
                    pageSizeOptions: [5, 10, 15, 20],
                    maxBodyHeight: 500

                }}
                /></div>

                    ) : (<Typography style={{ margin: '0 48px' }} variant="h6">This activity cannot be customized.</Typography>)
                  }, {
                  	icon: 'calendar_today',
                  	tooltip: 'Schedule',
                	render: rowData => (
                   
             <div style={{ margin: '0 48px' }}>
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
                data = {rowData.schedule}  
                title = "Schedule"            
	            editable={{
				    onRowAdd: newData => 
				    	new Promise((resolve, reject) => {
				    	let tempSurveys = this.state.surveys
				    	tempSurveys[rowData.tableData.id].schedule.push(newData)
				    	this.setState({ surveys: tempSurveys }, () => resolve())
				    }),
				    onRowUpdate: (newData, oldData) =>
				      new Promise((resolve, reject) => {
				    	let tempSurveys = this.state.surveys
				    	tempSurveys[rowData.tableData.id].schedule[oldData.tableData.id] = newData
				    	this.setState({ surveys: tempSurveys }, () => resolve())
				      }),
				    onRowDelete: oldData =>
				      new Promise((resolve, reject) => {
				    	let tempSurveys = this.state.surveys
				    	tempSurveys[rowData.tableData.id].schedule.splice(oldData.tableData.id, 1)
				    	this.setState({ surveys: tempSurveys }, () => resolve())
				      }),
				  }}
                options={{
                    actionsColumnIndex: -1,
                    pageSize: 5,
                    pageSizeOptions: [5, 10, 15, 20],
                    maxBodyHeight: 500

                }}
                /></div>

                    )
                  }]}
                editable={{
				    onRowAdd: async newData => {
				    	let tempSurveys = this.state.surveys
				    	tempSurveys.push({...newData, questions: [], schedule: [], type: "Survey" })
				    	this.setState({ surveys: tempSurveys })
				    },
				    onRowUpdate: async (newData, oldData) => {
				      	console.log(newData, oldData)
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
                    pageSize: 10,
                    pageSizeOptions: [5, 10, 15, 20],
                    maxBodyHeight: 500

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
                variant="raised"
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
    </div>
}