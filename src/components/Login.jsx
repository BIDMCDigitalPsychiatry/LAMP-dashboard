
// Core Imports
import React, { useState } from 'react'
import { 
    Typography, TextField, Button, Avatar, Slide, Radio, 
    RadioGroup, FormControlLabel, FormControl, FormLabel 
} from '@material-ui/core'
import { useSnackbar } from 'notistack'

// Local Imports
import mindLAMPLogo from '../logo.png'
import { ResponsivePaper, ResponsiveMargin } from './Utils'

export default function Login({ setIdentity, onComplete, ...props }) {
    const [state, setState] = useState({})
    const { enqueueSnackbar } = useSnackbar()

    let handleChange = event => setState({ ...state, 
        [event.target.name]: (event.target.type === 'checkbox' ? event.target.checked : event.target.value) 
    })

    let handleLogin = (event) => {
        event.preventDefault()
        if (!state.id || !state.password)
            return
        setIdentity({ 
                type: (['root', 'admin'].includes(state.id) ?
                        'root' : (state.id.includes('@') ?
                            'researcher' : 'participant')), 
                id: state.id === 'admin' ? 'root' : state.id, 
                password: state.password,
                serverAddress: state.serverAddress
            }
        ).then(res => {
            onComplete()
        }).catch(err => {
            console.warn("error with auth request", err)
            enqueueSnackbar('' + err.error, { variant: 'error' })
        })
    }

    // Sending email to team@digitalpsych.org -> 
    let handleRegister = (event) => {
        event.preventDefault()
        fetch("https://api.lamp.digital/internal/sysmsg", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    subject: "New LAMP Registration",
                    contents: `${state.name} (${state.email}) would like to register as a ${state.role}.`
                }),
            })
            .then(response => response.json())
            .then(data => {
                console.log(JSON.stringify(data))
                setState(state => ({ ...state, slideRegister: false, name: undefined, email: undefined }))
                enqueueSnackbar("Success! The system will process your request and notify you within 24 hours.", { variant: 'success' })
            })
            .catch(error => {
                console.error(error)
                setState(state => ({ ...state, slideRegister: false, name: undefined, email: undefined }))
                enqueueSnackbar("The system could not process your request. Please try again later or contact us for help.", { variant: 'error' })
            })
    }

    return (
        <React.Fragment>
            <Slide direction="right" in={!state.slideRegister} mountOnEnter unmountOnExit>
                <ResponsiveMargin style={{ position:'absolute', width:'33%', left: 0, right: 0, margin:'0 auto' }}>
                    <ResponsivePaper elevation={12} style={{ padding: '16px' }}>
                        <Avatar alt="mindLAMP" src={mindLAMPLogo} style={{ margin:'auto' }} />
                        <Typography variant="h4" align="center" style={{ fontWeight: 400, paddingBottom: 20, paddingTop: 10 }}>mindLAMP</Typography>
                        <form onSubmit={handleLogin}>
                            <div>
                                <TextField
                                    margin="normal"
                                    name="serverAddress"
                                    variant="outlined"
                                    style={{ width: '100%', height: 76 }}
                                    label="Server Location"
                                    placeholder="api.lamp.digital"
                                    helperText="Don't enter a server location if you're not sure what this option does."
                                    value={state.serverAddress || ''}
                                    onChange={handleChange}
                                />
                                <TextField
                                    required 
                                    name="id"
                                    label="ID"
                                    margin="normal"
                                    variant="outlined"
                                    style={{ width: '100%', height: 76 }}
                                    placeholder="my.email@address.com"
                                    helperText="Use your email address to login."
                                    value={state.id || ''}
                                    onChange={handleChange}
                                />
                                <TextField
                                    required
                                    name="password"
                                    label="Password"
                                    type="password"
                                    margin="normal"
                                    variant="outlined"
                                    style={{ width: '100%', height: 76, marginBottom: 24 }}
                                    placeholder="********"
                                    helperText="Use your password to login."
                                    value={state.password || ''}
                                    onChange={handleChange}
                                />
                                <br />
                                <Button
                                    variant="outlined"
                                    color="default"
                                    style={{ width: '45%' }}
                                    onClick={() => setState(state => ({ ...state, slideRegister: true }))}>
                                    Request Access
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    style={{ float: 'right', width: '45%' }}
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
            <Slide direction="left" in={state.slideRegister} mountOnEnter unmountOnExit>
                <ResponsiveMargin style={{ position:'absolute', width:'33%', left: 0, right: 0, margin:'0 auto' }}>
                    <ResponsivePaper elevation={12} style={{ padding: '16px' }}>
                        <Avatar alt="mindLAMP" src={mindLAMPLogo} style={{ margin: 'auto' }}/>
                        <Typography variant="h4" align="center" style={{ fontWeight: 400, paddingBottom: 10}}>Request Access</Typography>
                        <Typography variant="caption" align="center" style={{ fontWeight: 400, paddingBottom: 10 }}>
                            Request access to mindLAMP by filling out the following form. We'll get back to you within 24 hours.
                        </Typography>
                        <form onSubmit={handleRegister}>
                            <TextField
                                required
                                label="Name"
                                style={{ width: '100%' }}
                                margin="normal"
                                variant="outlined"
                                name="name"
                                value={state.name || ''}
                                onChange={handleChange}
                            />
                            <TextField
                                required
                                label="Email"
                                style={{ width: '100%' }}
                                margin="normal"
                                variant="outlined"
                                name="email"
                                value={state.email || ''}
                                onChange={handleChange}
                            />
                            <FormControl component="fieldset" style={{ marginTop: 10 }}>
                              <FormLabel component="legend">I am a...</FormLabel>
                              <RadioGroup
                                aria-label="Role"
                                name="role1"
                                value={state.role || 'researcher'}
                                onChange={event => setState(state => ({ ...state, role: event.target.value }))}
                              >
                                <FormControlLabel value="researcher" control={<Radio />} label="Researcher" />
                                <FormControlLabel value="participant" control={<Radio />} label="Participant" />
                              </RadioGroup>
                            </FormControl>
                            <br />
                            <Button
                                variant="outlined"
                                color="default"
                                style={{width: '45%'}}
                                onClick={() => setState(state => ({ ...state, slideRegister: false }))}>
                                Back
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                className="submit"
                                style={{ float: 'right', width: '45%' }}
                                onClick={handleRegister}>
                                Request Access
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
        </React.Fragment>
    )
}
