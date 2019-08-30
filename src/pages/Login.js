
// Core Imports
import React, { useState, useEffect } from 'react'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Avatar from '@material-ui/core/Avatar'
import Slide from '@material-ui/core/Slide'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'

// Local Imports
import mindLAMPLogo from '../logo.png'
import SurveyScheduler from '../components/SurveyScheduler'
import { ResponsivePaper, ResponsiveMargin } from '../components/Utils'

export default function Login({ setIdentity, onComplete, ...props }) {
    const [ state, setState ] = useState({
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
    })

    let handleChange = (event) => {
        const target = event.target
        const value = target.type === 'checkbox' ? target.checked : target.value
        const name = target.name
        setState({ ...state,
            [name]: value
        })
    }

    let handleSlideLogin = (event) => {
        event.preventDefault()
        setState({ ...state, slide: !state.slide })
    }

    let validator = {
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

    let validateForm = () => {
        let errored = false
        let errorMsg = ""

        Object.keys(validator).forEach((field) => {
            let erroredField = false
            validator[field].forEach(({ test, msg }) => {
                if (!erroredField && !test(state[field])) {
                    setState({ ...state,
                        [field + "ErrText"]: msg
                    })
                    errorMsg = msg
                    erroredField = true
                    errored = true;
                }
            })
        })

        if (errored) {
            props.layout.showMessage(errorMsg)
        }

        return !errored
    }

    let handleBack = (event) => {
        event.preventDefault()
        setState({ ...state, open: false })
    }

    let handleLogin = (event) => {
        event.preventDefault()
        setIdentity({ 
                type: (state.id === 'root' ?
                        'root' : (state.id.includes('@') ?
                            'researcher' : 'participant')), 
                id: state.id, 
                password: state.password,
                serverAddress: state.serverAddress
            }
        ).then(res => {
            onComplete()
        }).catch(err => {
            console.warn("error with auth request", err)
            props.layout.showMessage('' + err.message)
        })
    }

    let handleChangeRole = event => {
        setState({ ...state, role: event.target.value });
    };

    let handleRegister = (payload) => {

        let msgContents = JSON.stringify({
            researcher: {
                name: state.name,
                email: state.email,
                'study name': state.studyName
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
                props.layout.showMessage("Success! The system will process your request and notify you within 24 hours.")
            })
            .catch(error => {
                console.error(error)
                props.layout.showMessage("The system could not process your request. Please try again later or contact us for help.")
            })


        setState({ ...state, open: false })

    }


    let handleNext = (event) => {
        event.preventDefault()

        if (!validateForm())
            return

        setState({ ...state, open: true })
    }

    let handleSlideRegister = (event) => {
        event.preventDefault()
        setState({ ...state, 
            slide: !state.slide, 
            slideRegister: !state.slideRegister 
        })
    }

    return (
    <React.Fragment>

            <Slide direction="right" in={!state.slide} mountOnEnter unmountOnExit appear>

        <ResponsiveMargin style={{ position: 'absolute', width:'33%', left: 0, right: 0, margin:'0 auto' }}>
        <ResponsivePaper elevation={12} style={{padding: '16px'}}>
                <Avatar alt="mindLAMP" src={mindLAMPLogo} style={{margin: 'auto'}}/>
            <Typography variant="h4" align="center" style={{ fontWeight: 400, paddingBottom: 20, paddingTop: 10 }}>mindLAMP</Typography>
            <Grid container justify="space-evenly" style={{textAlign: "center", height: 250}}>

                <TextField
                    margin="normal"
                    variant="outlined"
                    style={{width: '100%', height: 92}}
                    label="Server Address"
                    placeholder="https://api.lamp.digital"
                    helperText="Don't enter a server location if you're not sure what this option does."
                    value={state.serverAddress || ''}
                    onChange={event => setState({ ...state, serverAddress: event.target.value })}
                />
                <Button
                    variant="contained"
                    color="primary"
                    style={{width: '100%', height: 36}}
                    onClick={handleSlideLogin}>
                    Login
                </Button>
                <Button
                    variant="outlined"
                    color="default"
                    style={{width: '100%', height: 36}}
                    onClick={handleSlideRegister}>
                    Sign Up
                </Button>
                </Grid>
  
        </ResponsivePaper>
        </ResponsiveMargin>
        </Slide>
        <Slide direction="left" in={state.slide && state.slideRegister} mountOnEnter unmountOnExit>
                    <ResponsiveMargin style={{ position:'absolute', width:'33%', left: 0, right: 0, margin:'0 auto' }}>
                    <ResponsivePaper elevation={12} style={{padding: '16px'}}>
                        <Avatar alt="mindLAMP" src={mindLAMPLogo} style={{margin: 'auto'}}/>

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
                            value={state.name}
                            errorText={state.nameErrText}
                            onChange={handleChange}
                            />
                        <TextField
                            required
                            label="Email"
                            style={{width: '100%'}}
                            margin="normal"
                            variant="outlined"
                            name="email"
                            value={state.email}
                            errorText={state.emailErrText}
                            onChange={handleChange}
                            />
                        <FormControl component="fieldset" style={{marginTop: 10}}>
                          <FormLabel component="legend">I am a...</FormLabel>
                          <RadioGroup
                            aria-label="Role"
                            name="role1"
                            value={state.role}
                            onChange={handleChangeRole}
                          >
                            <FormControlLabel value="researcher" control={<Radio />} label="Researcher" />
                            <FormControlLabel value="participant" control={<Radio />} label="Participant" />
                          </RadioGroup>
                        </FormControl>

                        <TextField
                            label="Study Name (Optional)"
                            style={{width: '100%', display: state.role === "participant" ? "none" : undefined}}
                            margin="normal"
                            variant="outlined"
                            name="studyName"
                            value={state.studyName}
                            onChange={handleChange}
                            />
                        <br />
                        <Button
                            variant="outlined"
                            color="default"
                            style={{width: '45%'}}
                            onClick={handleSlideRegister}>
                            Back
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            className="submit"
                            style={{float: 'right', width: '45%'}}
                            onClick={handleNext}>
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
                    </ResponsivePaper>
                    </ResponsiveMargin>
        </Slide>
            <Slide direction="left" in={state.slide && !state.slideRegister} mountOnEnter unmountOnExit>
            <ResponsiveMargin style={{ position:'absolute', width:'33%', left: 0, right: 0, margin:'0 auto' }}>
            <ResponsivePaper elevation={12} style={{padding: '16px'}}>
                <Avatar alt="mindLAMP" src={mindLAMPLogo} style={{margin:'auto'}} />

            <Typography variant="h4" align="center" style={{ fontWeight: 400, paddingBottom: 20, paddingTop: 10 }}>mindLAMP</Typography>

            <form action="" onSubmit={handleLogin}>
            <div >
                <TextField
                    required 
                    name="id"
                    label="ID"
                    margin="normal"
                    variant="outlined"
                    style={{width: '100%'}}
                    value={state.id}
                    onChange={handleChange}
                />
                <TextField
                    required
                    name="password"
                    label="Password"
                    type="password"
                    margin="normal"
                    variant="outlined"
                    style={{width: '100%'}}
                    value={state.password}
                    onChange={handleChange}
                />
                <br />
                <Button
                    variant="outlined"
                    color="default"
                    style={{width: '45%'}}
                    onClick={handleSlideLogin}>
                    Back
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    style={{float: 'right', width: '45%'}}
                    onClick={handleLogin}>
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
            </ResponsivePaper>
            </ResponsiveMargin>
                </Slide>
        <Dialog 
                fullWidth={true}
                maxWidth="md"
                open={state.open || false}
                onClose={handleBack}
                >
                <DialogContent>
                <SurveyScheduler 
                    onSubmit = {handleRegister}
                    onCancel = {handleBack}
                    onError = {props.layout.showMessage}
                    />
                </DialogContent>
            </Dialog>

            </React.Fragment>
    )
}
