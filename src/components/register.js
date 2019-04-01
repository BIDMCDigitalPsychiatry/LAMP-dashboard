import React, { Component } from 'react';
import { render } from "react-dom";
import { withRouter } from 'react-router-dom';
import { createStyles, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import LAMP from '../lamp.js';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
import SurveyScheduler from '../components/survey_scheduler'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
 
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

class Register extends React.Component {
    state = {
        name: "",
        nameErrText: "",
        email: "",
        emailErrText: "",
        studyName: "",
        open: false,
    }

    componentDidMount() {
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
    }

    handleBack = (event) => {
        event.preventDefault()
        this.setState(state => ({ open: false }))
    }

    handleNext = (event) => {
        event.preventDefault()

        if (!this.validateForm())
            return

        this.setState(state => ({ open: true }))
    }

    handleSubmit = (payload) => {

        let msgContents = JSON.stringify({
            researcher: {
                name: this.state.name,
                email: this.state.email,
                'study name': this.state.studyName
            },
            activities: payload
        }, null, 4)

    // Sending email to team@digitalpsych.org -> 
    fetch("https://api.lamp.digital/internal/sysmsg", {
            method: "POST", 
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                subject: "New LAMP Registration", 
                contents: msgContents}, 0, 4), 
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


    this.setState(state => ({ open: false }))

    }

    handleLogin = (event) => this.props.history.replace('/login')

    handleForms = (event) => this.props.history.replace('/forms')

    render = () => 
                        <Paper square={true} elevation={12} style={{padding: '16px', position: 'absolute'}}>
    <Grid container justify="space-around" direction="column" alignItems="center" spacing={24} style={{marginTop: '48px'}}>
    <Grid item xs={5}>
    <div>
        <Paper square={true} elevation={12} style={{padding: '16px'}}>
            <Typography variant="h4" align="center" style={{ fontWeight: 400, paddingBottom: 10}}>Register</Typography>
                <Typography variant="caption" align="center" style={{ fontWeight: 400, paddingBottom: 10}}>Sign up to start customizing your study.</Typography>
                <form action="" >
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
                        label="Study Name (Optional)"
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
                </form>
        </Paper>
        </div>
    </Grid>
    </Grid>
        <Dialog 
            fullWidth={true}
            maxWidth="md"
            open={this.state.open}
            onClose={this.handleClose}
            >
            <DialogContent>
            <SurveyScheduler 
                onSubmit = {this.handleSubmit}
                onCancel = {this.handleBack}
                onError = {this.props.layout.showMessage}
                />
            </DialogContent>
        </Dialog>
    </Paper>

}

export default withStyles(formStyles)(withRouter(Register));

