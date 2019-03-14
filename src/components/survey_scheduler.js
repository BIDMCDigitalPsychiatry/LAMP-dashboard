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
            <Typography variant="h4" style={{ fontWeight: 400, paddingBottom: 10 }}>
            Study Setup
            </Typography>
            <br />
            <SchemaForm
            	submitText="Add Survey"
                classes={this.props.classes}
                schema={schema}
                uiSchema={uiSchema}
                formData={initialFormData}
                onCancel={(event) => {}}
                onSubmit={(event) => {
        			this.setState({ customSurveys: {...this.state.customSurveys, [event.formData.surveyName]: event.formData}})
    			}}
                onChange={(event) => {}}
            />
            <form action="" onSubmit={() => this.props.onSubmit(this.state)}>

        <br />
            <Typography variant="h6" align="left" style={{ fontWeight: 400, paddingBottom: 10}}>
            Survey Scheduling
            </Typography>
            <FormControl className={this.props.formControl}>
            <InputLabel htmlFor="survey-native-helper">Survey Name</InputLabel>
            <NativeSelect
                value={this.state.editSchedule.name}
            onChange={(event)=>this.setState({editSchedule: {...this.state.editSchedule, name: event.target.value}})}
                input={<Input name="survey" id="survey-native-helper" />}
            >
            <option value="" />
            {["PHQ-9", "GAD-7", "Psychosis", "Sleep", ...Object.keys(this.state.customSurveys)].map(x => (
                <option value={x}>{x}</option>
                ))}

          </NativeSelect>
        </FormControl>

        <FormControl className={this.props.formControl}>
          <InputLabel htmlFor="select-multiple" style={{marginLeft: 20}} >Day</InputLabel>
          <Select
            multiple
            value={this.state.editSchedule.day}
            style={{marginLeft: 20}}
            onChange={(event)=>this.setState({editSchedule: {...this.state.editSchedule, day: event.target.value}})}
            input={<Input id="select-multiple" />}
            MenuProps={MenuProps}
          >
            {days.map(day => (
              <MenuItem key={day} value={day} style={getStyles(day, this)}>
                {day}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <TimePicker
        label="Time"
        value={this.state.editSchedule.time}
        style={{marginLeft: 20}}
        onChange={(date)=>this.setState({editSchedule: {...this.state.editSchedule, time: date}})}
        InputLabelProps={{
          shrink: true,
        }}
      />
      </MuiPickersUtilsProvider>
        <Button 
        variant="contained" 
        size="large" 
        color="primary"
        onClick={this.addToSchedule}
        >
          <AddIcon />
        </Button>

        <div style={{marginTop: 20}} />
        {this.state.customSchedules.length > 0 ? 
            <DataTable style={{width: "50%"}} value = {this.state.customSchedules} deleteHandler = {(buttonIds)=>{
                console.log("deleting")
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
                </form>
    </React.Fragment>

}