import React, { Component } from 'react';
import { render } from "react-dom";
import ReactDOMServer from 'react-dom/server';
import { withRouter } from 'react-router-dom';
import { createStyles, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import LAMP from '../lamp.js';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import SchemaForm from 'jsonschema-form-for-material-ui';
import AddIcon from '@material-ui/icons/Add';
import DataTable from '../components/datatable'

const styles = theme => ({
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 400,
    }, 
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
});

const formStyles = theme => createStyles({
  field: {
    paddingLeft: theme.spacing.unit * 4,
  },
  formButtons: {
    order: 2,
  },
  root: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing.unit,
  },
});

const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

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

const getStyles = (name, that) => {
  return {
    fontWeight:
      that.state.editSchedule.day.indexOf(name) === -1
        ? 300
        : 500,
  }
}

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
const initialFormData = {}

class Register extends React.Component {
    state = {
        name: "",
        nameErrText: "",
        email: "",
        emailErrText: "",
        studyName: "",
        surveyForm: false,
        editSchedule : {
            name:"",
            day: [],
            time:"10:00",
        },
        customSchedules: [],
        customSurveys: {},
    }

    componentDidMount() {
        this.props.layout.setTitle('Register')
    }

    validator = {
        name: [{
            test: (val) => val !== "",
            msg: "Name field is required"
        }],
        email: [{
            test: (val) => val !== "",
            msg: "Email field is required"
        }, {
            test: (val) => val.match(/^.+@.+$/) !== null,
            msg: "Must be a valid email"
        }],
        studyName: [{
            test: (val) => true,
            msg: ""
        }],
    }

    validateForm = () => {
        let errored = false
        let errorMsg = ""

        Object.keys(this.validator).forEach((field) => {
            let erroredField = false
            this.validator[field].forEach(({test, msg}) => {
                if (!erroredField && !test(this.state[field])) {
                    this.setState({[field+"ErrText"]: msg})
                    errorMsg = msg
                    erroredField = true
                    errored = true;
                }
            })
        })

        if (errored) {
            this.props.layout.showMessage(errorMsg)
        }

        return !errored
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({[name]: value});
        let errored = false;

        this.validator[name].forEach(({test, msg}) => {
            if (!errored && !test(value)) {
                this.setState({[name+"ErrText"]: msg})
                errored = true;
            }
        })

        if (!this.validateForm()) {
            this.setState({[name+"ErrText"]: ""})
        }
    }

    handleBack = (event) => {
        event.preventDefault()
        this.setState(state => ({ surveyForm: false }))
    }

    handleNext = (event) => {
        event.preventDefault()

        if (!this.validateForm())
            return

        this.setState(state => ({ surveyForm: true }))
    }

    handleSubmit = (event) => {
        event.preventDefault()

        if (!this.validateForm())
            return

        let msgContents = JSON.stringify({
            researcher: {
                name: this.state.name,
                email: this.state.email,
                'study name': this.state.studyName
            },
            surveys: Object.values(this.state.customSurveys),
            schedules: this.state.customSchedules
        }, null, 4)

    // Sending email to team@digitalpsych.org -> 

        fetch("https://api.lamp.digital/internal/sysmsg", {
            method: "POST", 
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                subject: "New LAMP Registration", 
                contents: msgContents}), 
            })
        .then(response => response.json())
        .then(data => {
            console.log(JSON.stringify(data))
            this.props.layout.showMessage("Success! The system will process your request and notify you within 24 hours.")
        })
        .catch(error => {
            console.error(error)
            this.props.layout.showMessage("The system could not process your request. Please try again later or contact us for help.")
        }) 
    }

    onFormCancel = (event) => {}
    onFormSubmit = (event) => {
        this.setState({ customSurveys: {...this.state.customSurveys, [event.formData.surveyName]: event.formData}})
    }
    onFormChanged = (event) => {}

    handleLogin = (event) => this.props.history.replace('/login')

    handleForms = (event) => this.props.history.replace('/forms')

    addToSchedule = (event) => {
        if (this.state.editSchedule.name == "" || this.state.editSchedule.day.length === 0)
            return
        let sched = this.state.editSchedule
        sched.day = sched.day.join(", ")
        this.setState({
            customSchedules: [...this.state.customSchedules, sched],
            editSchedule: {name:"", day: [], time:"10:00",}
        })
    }

    render = () => 
    <Grid container justify="space-around" direction="column" alignItems="center" spacing={24} style={{marginTop: '48px'}}>
    <Grid item xs={5}>
    <div>
        <Paper square={true} elevation={12} style={{padding: '16px'}}>
            <Typography variant="h4" align="center" style={{ fontWeight: 400, paddingBottom: 10}}>Register</Typography>
                <form action="" onSubmit={this.handleNext}>
                    <TextField
                        required
                        label="Name"
                        style={{width: '100%'}}
                        margin="normal"
                        variant="outlined"
                        name="name"
                        value={this.state.name}
                        className={styles.textField}
                        errorText={this.state.nameErrText}
                        onChange={this.handleChange}
                        />
                    <TextField
                        required
                        label="Email"
                        style={{width: '100%'}}
                        margin="normal"
                        variant="outlined"
                        name="email"
                        value={this.state.email}
                        className={styles.textField}
                        errorText={this.state.emailErrText}
                        onChange={this.handleChange}
                        />
                    <TextField
                        label="Study Name"
                        style={{width: '100%'}}
                        margin="normal"
                        variant="outlined"
                        name="studyName"
                        value={this.state.studyName}
                        className={styles.textField}
                        onChange={this.handleChange}
                        />
                    <br />
                    <Button
                        variant="outlined"
                        color="default"
                        style={{width: '45%'}}
                        onClick={this.handleLogin}>
                        Login
                    </Button>
                    <Button
                        variant="raised"
                        color="primary"
                        className="submit"
                        style={{float: 'right', width: '45%'}}
                        onClick={this.handleNext}>
                        Next
                        <input type="submit" style={{
                            cursor: 'pointer',
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            right: 0,
                            left: 0,
                            width: '100%',
                            opacity: 0,
                            marginTop: 20,
                        }}/>
                    </Button>
                    <br />
                    {/*<Button
                        variant="outlined"
                        color="default"
                        style={{width: '100%', marginTop: 20}}
                        onClick={this.handleForms}>
                        Skip Register and Take Me to Forms
                    </Button>*/}
                </form>
        </Paper>
        </div>
    </Grid>
    <Grid container alignItems = "stretch" spacing={24} >
    <Grid item xs={12}>
    <div>
        <Fade in = {this.state.surveyForm}>
            <Paper square={true} elevation={12} style={{padding: '16px'}}>
            <Typography variant="h4" style={{ fontWeight: 400, paddingBottom: 10 }}>
            Study Setup
            </Typography>
            <br />
            <SchemaForm
                classes={this.props.classes}
                schema={schema}
                uiSchema={uiSchema}
                formData={initialFormData}
                onCancel={this.onFormCancel}
                onSubmit={this.onFormSubmit}
                onChange={this.onFormChanged}
            />
            <form action="" onSubmit={this.handleSubmit}>

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

      <TextField
        id="time"
        label="Time"
        type="time"
        value={this.state.editSchedule.time}
        style={{marginLeft: 20}}
        onChange={(event)=>this.setState({editSchedule: {...this.state.editSchedule, time: event.target.value}})}
        className={this.props.textField}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          step: 300, // 5 min
        }}
      />
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
                onClick={this.handleBack}>
                Back
            </Button>
            <Button
                variant="raised"
                color="primary"
                className="submit"
                style={{float: 'right', width: '35%'}}
                onClick={this.handleSubmit}>
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

            </Paper>
        </Fade>
        </div>
        </Grid>
    </Grid>
    </Grid>
}

export default withStyles(formStyles)(withRouter(Register));

