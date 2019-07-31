import React from 'react';
import { withRouter } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import LAMP from '../lamp';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import mindLAMPLogo from '../logo.png'
import Slide from '@material-ui/core/Slide';
import RegistrationForm from '../components/register'
import { createStyles, withStyles } from '@material-ui/core/styles';
import SurveyScheduler from '../components/survey_scheduler'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

const styles = theme => ({
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
    bigAvatar: {
        margin: 20,
        width: 80,
        height: 80,
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

const formStyles = theme => createStyles({});


class Login extends React.Component {
    state = {
        id: "",
        password: "",
        slide: false,
        slideRegister: false,
        name: "",
        nameErrText: "",
        email: "",
        emailErrText: "",
        studyName: "",
        open: false,
        role: 'researcher',
    }

    componentDidMount() {
        this.props.layout.setTitle('Login')
    }

    handleChange = (event) => {
        const target = event.target
        const value = target.type === 'checkbox' ? target.checked : target.value
        const name = target.name
        this.setState({
            [name]: value
        })
    }

    handleSlideLogin = (event) => {
        event.preventDefault()
        this.setState(state => ({ slide: !state.slide }))
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
            this.validator[field].forEach(({ test, msg }) => {
                if (!erroredField && !test(this.state[field])) {
                    this.setState({
                        [field + "ErrText"]: msg
                    })
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

    handleBack = (event) => {
        event.preventDefault()
        this.setState(state => ({ open: false }))
    }

    handleLogin = (event) => {
        event.preventDefault()
        
        //
        if (!!this.state.serverAddress)
            LAMP.connect(this.state.serverAddress, false)

        //
        let type = (this.state.id === 'root' ?
            'root' : (this.state.id.includes('@') ?
                'researcher' : 'participant'))
        LAMP.set_identity({ type: type, id: this.state.id, password: this.state.password}).then(res => {
            this.props.history.replace('/home')
        }).catch(err => {
            console.warn("error with auth request", err)
            this.props.layout.showMessage('' + err.message)
        })
    }

    handleChangeRole = event => {
        this.setState({ role: event.target.value });
    };

    handleRegister = (payload) => {

        let msgContents = JSON.stringify({
            researcher: {
                name: this.state.name,
                email: this.state.email,
                'study name': this.state.studyName
            },
            activities: payload
        }, 0, 4)

        // Sending email to team@digitalpsych.org -> 
        fetch("https://api.lamp.digital/internal/sysmsg", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    subject: "New LAMP Registration",
                    contents: msgContents
                }),
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


    handleNext = (event) => {
        event.preventDefault()

        if (!this.validateForm())
            return

        this.setState(state => ({ open: true }))
    }

    handleSlideRegister = (event) => {
        event.preventDefault()
        this.setState(state => ({ slide: !state.slide }))
        this.setState(state => ({ slideRegister: !state.slideRegister }))
        //this.props.history.push('/register')
    }

    render = () =>
    <React.Fragment>

            <Slide direction="right" in={!this.state.slide} mountOnEnter unmountOnExit appear>

        <Paper square={true} elevation={12} style={{padding: '16px', position:'absolute', width:'25vw', left:'37.5vw'}}>
                <Avatar alt="mindLAMP" src={mindLAMPLogo} className={this.props.bigAvatar} style={{margin: 'auto'}}/>
            <Typography variant="h4" align="center" style={{ fontWeight: 400, paddingBottom: 20, paddingTop: 10 }}>mindLAMP</Typography>
            <Grid container justify="space-evenly" style={{textAlign: "center", height: 250}}>

                <TextField
                    margin="normal"
                    variant="outlined"
                    style={{width: '80%', height: 92}}
                    label="Server Address"
                    placeholder="https://api.lamp.digital"
                    helperText="Don't enter a server location if you're not sure what this option does."
                    value={this.state.serverAddress || ''}
                    onChange={event => this.setState({ serverAddress: event.target.value })}
                />
                <Button
                    variant="contained"
                    color="primary"
                    style={{width: '80%', height: 36}}
                    onClick={this.handleSlideLogin}>
                    Login
                </Button>
                <Button
                    variant="outlined"
                    color="default"
                    style={{width: '80%', height: 36}}
                    onClick={this.handleSlideRegister}>
                    Sign Up
                </Button>
                </Grid>
  
        </Paper>
        </Slide>
        <Slide direction="left" in={this.state.slide && this.state.slideRegister} mountOnEnter unmountOnExit>
                    <Paper square={true} elevation={12} style={{padding: '16px', position:'absolute', width: '33vw', left:'33vw'}}>
                        <Avatar alt="mindLAMP" src={mindLAMPLogo} className={this.props.bigAvatar} style={{margin: 'auto'}}/>

                    <Typography variant="h4" align="center" style={{ fontWeight: 400, paddingBottom: 10}}>Sign Up</Typography>
                    <Typography variant="caption" align="center" style={{ fontWeight: 400, paddingBottom: 10}}>Start customizing your study.</Typography>
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
                        <FormControl component="fieldset" style={{marginTop: 10}}>
                          <FormLabel component="legend">I am a...</FormLabel>
                          <RadioGroup
                            aria-label="Role"
                            name="role1"
                            value={this.state.role}
                            onChange={this.handleChangeRole}
                          >
                            <FormControlLabel value="researcher" control={<Radio />} label="Researcher" />
                            <FormControlLabel value="participant" control={<Radio />} label="Participant" />
                          </RadioGroup>
                        </FormControl>

                        <TextField
                            label="Study Name (Optional)"
                            style={{width: '100%', display: this.state.role === "participant" ? "none" : undefined}}
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
                            onClick={this.handleSlideRegister}>
                            Back
                        </Button>
                        <Button
                            variant="contained"
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
        </Slide>
            <Slide direction="left" in={this.state.slide && !this.state.slideRegister} mountOnEnter unmountOnExit>
            <Paper square={true} elevation={12} style={{padding: '16px', position:'absolute', width: '33vw', left:'33vw'}}>
                <Avatar alt="mindLAMP" src={mindLAMPLogo} className={this.props.bigAvatar} style={{margin:'auto'}} />

            <Typography variant="h4" align="center" style={{ fontWeight: 400, paddingBottom: 20, paddingTop: 10 }}>mindLAMP</Typography>

            <form action="" onSubmit={this.handleLogin}>
            <div >
                <TextField
                    required 
                    name="id"
                    label="ID"
                    margin="normal"
                    variant="outlined"
                    className={styles.textField}
                    style={{width: '100%'}}
                    value={this.state.id}
                    onChange={this.handleChange}
                />
                <TextField
                    required
                    name="password"
                    label="Password"
                    type="password"
                    margin="normal"
                    variant="outlined"
                    className={styles.textField}
                    style={{width: '100%'}}
                    value={this.state.password}
                    onChange={this.handleChange}
                />
                <br />
                <Button
                    variant="outlined"
                    color="default"
                    style={{width: '45%'}}
                    onClick={this.handleSlideLogin}>
                    Back
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    style={{float: 'right', width: '45%'}}
                    onClick={this.handleLogin}>
                    Login
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
            </form>
            </Paper>
                </Slide>
        <Dialog 
                fullWidth={true}
                maxWidth="md"
                open={this.state.open}
                onClose={this.handleClose}
                >
                <DialogContent>
                <SurveyScheduler 
                    onSubmit = {this.handleRegister}
                    onCancel = {this.handleBack}
                    onError = {this.props.layout.showMessage}
                    />
                </DialogContent>
            </Dialog>

            </React.Fragment>
}

export default withStyles(formStyles)(withRouter(Login));