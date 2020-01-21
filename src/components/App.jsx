
// Core Imports
import React, { useState, useEffect, useRef } from 'react'
import { HashRouter, Route, Redirect, Switch } from 'react-router-dom'
import { CssBaseline, Fab, Button, Icon, ThemeProvider, createMuiTheme } from '@material-ui/core'
import { blue, red } from '@material-ui/core/colors'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import { SnackbarProvider, useSnackbar } from 'notistack'
import 'typeface-roboto'

// External Imports
import DateFnsUtils from '@date-io/date-fns'
import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'

// Local Imports
import LAMP from '../lamp'
import Login from './Login'
import Root from './Root'
import Researcher from './Researcher'
import Participant from './Participant'
import NavigationLayout from './NavigationLayout'

/* TODO: /researcher/:researcher_id/activity/:activity_id -> editor ui */
/* TODO: /participant/:participant_id/activity/:activity_id -> activity ui */
/* TODO: /participant/:participant_id/messaging -> messaging */

function PageTitle({ children, ...props }) {
    useEffect(() => { document.title = `${typeof children === 'string' ? children : ''}` })
    return <React.Fragment />
}

function AppRouter({ ...props }) {
    const [ deferredPrompt, setDeferredPrompt ] = useState(null)
    const [ state, setState ] = useState({ identity: LAMP.Auth._me, auth: LAMP.Auth._auth })
    const [ store, setStore ] = useState({ researchers: [], participants: [] })
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const storeRef = useRef([])

    useEffect(() => {
        let query = window.location.hash.split('?')
        if (!!query && query.length > 1) {

            // 
            let src = Object.fromEntries(new URLSearchParams(query[1]))['src']
            if (typeof src === 'string' && src.length > 0) {
                enqueueSnackbar(`You're using the "${src}" server to log into mindLAMP.`, { variant: 'info' })
            }

            // 
            let a = Object.fromEntries(new URLSearchParams(query[1]))['a']
            if (a === undefined) return
            let x = atob(a).split(':')

            // 
            reset({ 
                type: ['root', 'admin'].includes(x[0]) ? 'root' : (x[0].includes('@') ? 'researcher' : 'participant'), 
                id: x[0] === 'admin' ? 'root' : x[0],
                password: x[1],
                serverAddress: x[2]
            }).then(x => {
                //props.history.replace('/')
            })
        } else if (!state.identity) {
            LAMP.Auth.refresh_identity().then(x => {
                setState(state => ({ ...state, identity: LAMP.Auth._me, auth: LAMP.Auth._auth }))
            })
        }
    }, [])

    useEffect(() => {
        if (!deferredPrompt) 
            return
        enqueueSnackbar('Add mindLAMP to your home screen?', { 
            variant: 'info', 
            persist: true, 
            action: key =>
                <React.Fragment>
                    <Button onClick={promptInstall}>Install</Button>
                    <Button onClick={() => closeSnackbar(key)}>Dismiss</Button>
                </React.Fragment>
        })
    }, [deferredPrompt])

    useEffect(() => {
        closeSnackbar('admin')
        if (!state.identity || (state.auth.type !== 'root'))
            return
        enqueueSnackbar('Proceed with caution: you are logged in as the administrator.', { 
            key: 'admin',
            variant: 'info',
            persist: true, 
            preventDuplicate: true,
            action: key => <Button style={{ color: '#fff' }} onClick={() => closeSnackbar(key)}>Dismiss</Button>
        })
    }, [state])

    if (window.matchMedia('(display-mode: standalone)').matches)
        console.log('Launched from home screen!')
    window.addEventListener('beforeinstallprompt', (e) => setDeferredPrompt(e))

    let reset = async (identity) => {
        await LAMP.Auth.set_identity(identity)
        if (!!identity)
             setState(state => ({ ...state, identity: LAMP.Auth._me, auth: LAMP.Auth._auth }))
        else setState(state => ({ ...state, identity: null, auth: null }))
    }

    let getResearcher = (id) => {
        if (id === 'me' && state.auth.type === 'researcher')
            id = state.identity.id
        if (!id || id === 'me')
            return null //props.history.replace(`/`)
        if (!!store.researchers[id]) {
            return store.researchers[id]
        } else if (!storeRef.current.includes(id)) {
            LAMP.Researcher.view(id).then(x => setStore({ 
                researchers: { ...store.researchers, [id]: x }, 
                participants: store.participants 
            }))
            storeRef.current = [ ...storeRef.current, id ]
        }
        return null
    }

    let getParticipant = (id) => {
        if (id === 'me' && state.auth.type === 'participant')
            id = state.identity.id
        if (!id || id === 'me')
            return null //props.history.replace(`/`)
        if (!!store.participants[id]) {
            return store.participants[id]
        } else if (!storeRef.current.includes(id)) {
            LAMP.Participant.view(id).then(x => setStore({ 
                researchers: store.researchers,
                participants: { ...store.participants, [id]: x }
            }))
            storeRef.current = [ ...storeRef.current, id ]
        }
        return null
    }

    const promptInstall = () => {
        if (deferredPrompt === null)
            return
        deferredPrompt.prompt()
        deferredPrompt.userChoice.then((c) => {
            if (c.outcome === 'accepted') {
                console.log('App will be installed.')
            } else {
                console.log('App not installed.')
            }
            setDeferredPrompt(null)
        })
    }

    return (
        <Switch>

            {/* Route index => login or home (which redirects based on user type). */}
            <Route exact path="/" render={props =>
                (!(window.location.hash.split('?').length > 1 && !state.identity)) ?
                (!state.identity ?
                    <React.Fragment>
                        <PageTitle>mindLAMP | Login</PageTitle>
                        <NavigationLayout 
                            noToolbar 
                            goBack={props.history.goBack} 
                            onLogout={() => reset()}
                        >
                            <Fab color="primary" aria-label="Back" variant="extended" style={{ position: 'fixed', bottom: 24, right: 24 }} onClick={() => props.history.replace('/api')}>
                                <Icon>memory</Icon>
                                <span style={{ width: 8 }} />
                                API
                            </Fab>
                            <Login setIdentity={async (identity) => await reset(identity) } onComplete={() => props.history.replace('/')} />
                        </NavigationLayout>
                    </React.Fragment> :
                    (state.auth.type === 'root' ?
                        <Redirect to="/researcher" /> :
                    state.auth.type === 'researcher' ?
                        <Redirect to="/researcher/me" /> :
                        <Redirect to="/participant/me" />
                    )
                ) : <React.Fragment />
            } />

            {/* Route authenticated routes. */}
            <Route exact path="/researcher" render={props =>
                !state.identity || (state.auth.type !== 'root') ?
                <React.Fragment>
                    <PageTitle>mindLAMP | Login</PageTitle>
                    <NavigationLayout 
                        noToolbar 
                        goBack={props.history.goBack} 
                        onLogout={() => reset()}
                    >
                        <Fab color="primary" aria-label="Back" variant="extended" style={{ position: 'fixed', bottom: 24, right: 24 }} onClick={() => props.history.replace('/api')}>
                            <Icon>memory</Icon>
                            <span style={{ width: 8 }} />
                            API
                        </Fab>
                        <Login setIdentity={async (identity) => await reset(identity) } onComplete={() => props.history.replace('/')} />
                    </NavigationLayout>
                </React.Fragment> :
                <React.Fragment>
                    <PageTitle>Administrator</PageTitle>
                    <NavigationLayout 
                        title="Administrator" 
                        profile={state.auth.type === 'root' ? {} : state.identity} 
                        goBack={props.history.goBack} 
                        onLogout={() => reset()}
                    >
                        <Root {...props} root={state.identity} />
                    </NavigationLayout>
                </React.Fragment>
            } />
            <Route exact path="/researcher/:id" render={props =>
                !state.identity ? 
                <React.Fragment>
                    <PageTitle>mindLAMP | Login</PageTitle>
                    <NavigationLayout 
                        noToolbar 
                        goBack={props.history.goBack} 
                        onLogout={() => reset()}
                    >
                        <Fab color="primary" aria-label="Back" variant="extended" style={{ position: 'fixed', bottom: 24, right: 24 }} onClick={() => props.history.replace('/api')}>
                            <Icon>memory</Icon>
                            <span style={{ width: 8 }} />
                            API
                        </Fab>
                        <Login setIdentity={async (identity) => await reset(identity) } onComplete={() => props.history.replace('/')} />
                    </NavigationLayout>
                </React.Fragment>:
                !getResearcher(props.match.params.id) ? 
                <React.Fragment /> :
                <React.Fragment>
                    <PageTitle>{`${getResearcher(props.match.params.id).name}`}</PageTitle>
                    <NavigationLayout 
                        id={props.match.params.id}
                        title={`${getResearcher(props.match.params.id).name}`} 
                        profile={state.auth.type === 'root' ? {} : state.identity}
                        goBack={props.history.goBack} 
                        onLogout={() => reset()}
                    >
                        <Researcher researcher={getResearcher(props.match.params.id)} onParticipantSelect={(id) => props.history.push(`/participant/${id}`)} />
                    </NavigationLayout>
                </React.Fragment>
            } />

            <Route exact path="/participant/:id" render={props =>
                !state.identity ? 
                <React.Fragment>
                    <PageTitle>mindLAMP | Login</PageTitle>
                    <NavigationLayout 
                        noToolbar 
                        goBack={props.history.goBack} 
                        onLogout={() => reset()}
                    >
                        <Fab color="primary" aria-label="Back" variant="extended" style={{ position: 'fixed', bottom: 24, right: 24 }} onClick={() => props.history.replace('/api')}>
                            <Icon>memory</Icon>
                            <span style={{ width: 8 }} />
                            API
                        </Fab>
                        <Login setIdentity={async (identity) => await reset(identity) } onComplete={() => props.history.replace('/')} />
                    </NavigationLayout>
                </React.Fragment> : 
                !getParticipant(props.match.params.id) ? 
                <React.Fragment /> :
                <React.Fragment>
                    <PageTitle>{`Patient ${getParticipant(props.match.params.id).id}`}</PageTitle>
                    <NavigationLayout 
                        enableMessaging
                        id={props.match.params.id}
                        title={`Patient ${getParticipant(props.match.params.id).id}`} 
                        profile={state.auth.type === 'root' ? {} : state.identity}
                        goBack={props.history.goBack} 
                        onLogout={() => reset()}
                    >
                        <Participant participant={getParticipant(props.match.params.id)} />
                    </NavigationLayout>
                </React.Fragment>
            } />

            {/* Route API documentation ONLY. */}
            <Route exact path="/api" render={props =>
                <React.Fragment>
                    <PageTitle>LAMP API</PageTitle>
                    <Fab color="primary" aria-label="Back" variant="extended" style={{ position: 'fixed', top: 24, left: 24 }} onClick={() => reset()}>
                        <Icon>arrow_back</Icon>
                        <span style={{ width: 8 }} />
                        Back
                    </Fab>
                    <div style={{ height: 56 }}></div>
                    <SwaggerUI url="https://api.lamp.digital/" docExpansion="list" />
                </React.Fragment>
            } />
        </Switch>
    )
}

export default function App({ ...props }) {
    return (
        <ThemeProvider theme={createMuiTheme({
                typography: {
                useNextVariants: true,
            },
                palette: {
                    primary: blue,
                    secondary: red,
                    background: {
                      default: "#fff"
                    }
                },
                appBar: {
                    height: 48,
                }, 
                ripple: {
                    color: red,
                }
            })}
        >
            <CssBaseline />
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <SnackbarProvider maxSnack={3}>
                    <HashRouter>
                        <AppRouter {...props} />
                    </HashRouter>
                </SnackbarProvider>
            </MuiPickersUtilsProvider>
            <span style={{ position: 'fixed', bottom: 16, left: 16, fontSize: '8', zIndex: -1, opacity: 0.1 }}>{process.env.REACT_APP_GIT_SHA}</span>
        </ThemeProvider>
    )
}
