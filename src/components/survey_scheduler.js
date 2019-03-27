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

const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const getStyles = (name, that) => {
  return {
    fontWeight:
      that.state.editSchedule.day.indexOf(name) === -1
        ? 300
        : 500,
  }
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

// Using schema form from here: https://github.com/TwoAbove/jsonschema-form-for-material-ui
// TODO: find schema form that supports dependencies

const schema = 
{
  "title": "Create a New Survey",
  "description": "",
  "type": "object",
  "properties": {
    "surveyName": {
        "title": "Survey Name",
        "type": "string"
    },
    "questions": {
      "title": "Questions",
      "type": "array",
      "items": {
      "title": "Question",
      "type": "object",
      "properties": {
        "Question Text": {
          "type": "string"
        },
        "Answer Type": {
          "type": "string",
          "enum": [
            "Likert (0-3)",
            "Scroll Wheel",
            "Date",
            "Yes/No"
          ],
          "default": "Likert (0-3)"
        },
        "Optional Notes": {
          "type": "string",
          "title": "Optional Notes (e.g. if using scroll wheel)"
        }
      },
      "required": [
        "Answer Type"
      ],
      "dependencies": {
        "Answer Type": {
          "oneOf": [
            {
              "properties": {
                "Answer Type": {
                  "enum": [
                    "Likert (0-3)",
                    "Date",
                    "Yes/No"
                  ]
                }
              }
            },
            {
              "properties": {
                "Answer Type": {
                  "enum": [
                    "Scroll Wheel"
                  ]
                },
                "Range": {
                  "type": "string"
                }
              }
            }
          ]
        }
      }
    }
    }
  }
}

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
			question: "Today I feel anxToday I am easily annoyed or irritableious",
			answerType: "Likert (0-3)",
			notes: "" 
		},
		{ 
			question: "Today I feel afraid something awful might happen",
			answerType: "Likert (0-3)",
			notes: "" 
		}
	],
	schedule: {
		day: [],
		time: new Date('2019-03-13T10:00:00')
	}
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
	
		schedule: {
			day: [],
			time: new Date('2019-03-13T10:00:00')
		}
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
		schedule: {
			day: [],
			time: new Date('2019-03-13T10:00:00')
		}
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
		schedule: {
			day: [],
			time: new Date('2019-03-13T10:00:00')
		}
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
		schedule: {
			day: [],
			time: new Date('2019-03-13T10:00:00')
		}
	},
	{ 
		surveyName: "Jewels Trails A",
		type: "Game",
		questions: [
		{
		}
		],
		schedule: {
			day: [],
			time: new Date('2019-03-13T10:00:00')
		},
		notes: ""
	},
	{ 
		surveyName: "Jewels Trails B",
		type: "Game",
		questions: [
		{
		}
		],
		schedule: {
			day: [],
			time: new Date('2019-03-13T10:00:00')
		}
	},	
	{ 
		surveyName: "Spatial Span",
		type: "Game",
		questions: [
		{
		}
		],
		schedule: {
			day: [],
			time: new Date('2019-03-13T10:00:00')
		}
	},
	{
		surveyName: "Cats and Dogs",
		type: "Game",
		questions: [
		{
		}
		],
		schedule: {
			day: [],
			time: new Date('2019-03-13T10:00:00')
		}
	}
]

const uiSchema = {}
const initialFormData = {
	"surveyName": "",
	"questions": [],
}

export default class SurveyScheduler extends React.Component {

    state = {
        editSchedule : {
            name:"",
            day: [],
            time: new Date('2019-03-13T10:00:00'),
        },
        customSchedules: [],
        surveys: defaultSurveys,
        customSurveys: {},
    }

    addToSchedule = (event) => {
        if (this.state.editSchedule.name == "" || this.state.editSchedule.day.length === 0)
            return
        let sched = this.state.editSchedule
        sched.day = sched.day.join(", ")
        sched.time = sched.time.toLocaleTimeString()
        this.setState({
            customSchedules: [...this.state.customSchedules, sched],
            editSchedule: {name:"", day: [], time: new Date('2019-03-13T10:00:00'),}
        })
    }

    render = () =>
    <React.Fragment>
            <MaterialTable 
                columns={[
                	{ title: 'Survey Name', field: 'surveyName' },
                	{ 
                		title: 'Schedule Day(s)',
                		field: 'day',
                		emptyValue: "No Day(s) Scheduled",
                		render: rowData => { return(<MultipleSelect/>) }
                		},
                	{ title: 'Schedule Time', field: 'time', type: 'time', emptyValue: "No Time Scheduled" }
                ]}
                data = {this.state.surveys} 
                title = "Activity Scheduler"
                detailPanel = {
				[
				{
                	render: rowData => rowData.type === "Survey" ? (
                   
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
				{notes: 'Notes', field: 'notes'}

					]}
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
                />

                    ) : (<Typography variant="h5">This activity cannot be customized.</Typography>)
                  }]}
                editable={{
				    onRowAdd: async newData => {
				    	let tempSurveys = this.state.surveys
				    	tempSurveys.push({...newData, questions: [
				    		{
								question: "Sample Question",
								answerType: "Likert (0-3)"
							},
				    		],
				    			type: "Survey"

				    	})
				    	this.setState({ surveys: tempSurveys })
				    },
				    onRowUpdate: async (newData, oldData) => {
				      	console.log(newData, oldData)
				    	let tempSurveys = this.state.surveys
				    	tempSurveys[oldData.tableData.id] = newData
				    	this.setState({ surveys: tempSurveys })
				    },
				    onRowDelete: async oldData => {
				      	console.log(oldData)
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
        {this.state.customSchedules.length > 0 ? 
            <DataTable style={{width: "50%"}} value = {this.state.customSchedules} deleteHandler = {(buttonIds)=>{
                let tmp = this.state.customSchedules
                for (let i=buttonIds.length - 1; i >= 0 ; i--) {
                   tmp.splice(buttonIds[i], 1)
                }
                this.setState({ customSchedules: tmp })
            }

            }/> : 
            <React.Fragment/>
        }
            <Button
                variant="outlined"
                color="default"
                style={{width: '35%'}}
                onClick={this.props.onCancel}>
                Back
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
    </React.Fragment>

}