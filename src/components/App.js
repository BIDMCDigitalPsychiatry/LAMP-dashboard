
// Core Imports
import React, { useState, useEffect, useRef } from 'react'
import { HashRouter, Route, Redirect, Switch } from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import {blue, red} from '@material-ui/core/colors'
import Fab from '@material-ui/core/Fab'
import Snackbar from '@material-ui/core/Snackbar'
import Icon from '@material-ui/core/Icon'
import 'typeface-roboto'
import { SnackbarProvider } from 'notistack'

// External Imports
import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'

// Local Imports
import LAMP from '../lamp'
import AppHome from './Home'
import Login from './Login'
import Root from './Root'
import Researcher from './Researcher'
import Participant from './Participant'
import NavigationLayout from './NavigationLayout'
import { PageTitle } from './Utils'

// TODO: If weird button CSS issues (via MuiButtonBase-root) appear, 
//       material-table imports @material-ui/core again so delete it.

export default function App({ ...props }) {
    const [ state, setState ] = useState({})
    const [ store, setStore ] = useState({ researchers: [], participants: [] })
    const storeRef = useRef([])

    useEffect(() => {
        (async () => {
            await LAMP.Auth.refresh_identity()
            setState({ ...state, identity: LAMP.Auth.get_identity(), auth: LAMP.Auth._auth })
        })()
    }, [])

    let reset = async (identity) => {
        await LAMP.Auth.set_identity(identity)
        if (!!identity)
             setState({ ...state, identity: LAMP.Auth.get_identity(), auth: LAMP.Auth._auth })
        else setState({ ...state, identity: undefined, auth: undefined })
    }

    let getResearcher = (id) => {
        if (id === 'me' && (state.auth || {type: null}).type === 'researcher')
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
        if (id === 'me' && (state.auth || {type: null}).type === 'participant')
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

    return (
        <MuiThemeProvider theme={createMuiTheme({
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
            <SnackbarProvider maxSnack={3}>
                <HashRouter>
                    <Switch>

                        {/* Route index => login or home (which redirects based on user type). */}
                        <Route exact path="/" render={() =>
                            !state.identity ?
                            <Redirect to="/login" /> :
                            <Redirect to="/home" />
                        } />
                        <Route exact path="/home" render={() =>
                            (state.auth || {type: null}).type === 'root' ?
                            <Redirect to="/researcher" /> :
                            (state.auth || {type: null}).type === 'researcher' ?
                            <Redirect to="/researcher/me" /> :
                            <Redirect to="/participant/me" />
                        } />

                        {/* Route login, register, and logout. */}
                        <Route exact path="/login" render={props =>
                            !!state.identity ?
                            <Redirect to="/home" /> :
                            <React.Fragment>
                                <PageTitle>mindLAMP | Login</PageTitle>
                                <NavigationLayout 
                                    noToolbar 
                                    goBack={props.history.goBack} 
                                    onLogout={() => props.history.replace('/logout')}
                                >
                                    <Fab color="primary" aria-label="Back" variant="extended" style={{ position: 'fixed', bottom: 24, right: 24 }} onClick={() => props.history.replace('/api')}>
                                        <Icon>memory</Icon>
                                        API
                                    </Fab>
                                    <Login setIdentity={async (identity) => await reset(identity) } onComplete={() => props.history.replace('/home')} />
                                </NavigationLayout>
                            </React.Fragment>
                        } />
                        <Route exact path="/logout" render={() => {
                            reset()
                            return (<Redirect to="/" />)
                        }} />

                        {/* Route authenticated routes. */}
                        <Route exact path="/researcher" render={props =>
                            !state.identity || ((state.auth || {type: null}).type !== 'root') ?
                            <Redirect to="/login" /> :
                            <React.Fragment>
                                <PageTitle>Administrator</PageTitle>
                                <NavigationLayout 
                                    title="Administrator" 
                                    profile={(state.auth || {type: null}).type === 'root' ? {} : state.identity} 
                                    goBack={props.history.goBack} 
                                    onLogout={() => props.history.replace('/logout')}
                                >
                                    <Root {...props} root={state.identity} />
                                    <Snackbar
                                        open
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                        message="Proceed with caution: you are logged in as the administrator."
                                    />
                                </NavigationLayout>
                            </React.Fragment>
                        } />
                        <Route exact path="/researcher/:id" render={props =>
                            !state.identity ? <Redirect to="/login" /> :
                            !getResearcher(props.match.params.id) ? <React.Fragment /> :
                            <React.Fragment>
                                <PageTitle>{`${getResearcher(props.match.params.id).name}`}</PageTitle>
                                <NavigationLayout 
                                    id={props.match.params.id}
                                    title={`${getResearcher(props.match.params.id).name}`} 
                                    profile={(state.auth || {type: null}).type === 'root' ? {} : state.identity}
                                    goBack={props.history.goBack} 
                                    onLogout={() => props.history.replace('/logout')}
                                >
                                    <Researcher researcher={getResearcher(props.match.params.id)} onParticipantSelect={(id) => props.history.push(`/participant/${id}`)} />
                                </NavigationLayout>
                            </React.Fragment>
                        } />

                        <Route exact path="/participant/:id" render={props =>
                            !state.identity ? <Redirect to="/login" /> : 
                            !getParticipant(props.match.params.id) ? <React.Fragment /> :
                            <React.Fragment>
                                <PageTitle>{`Patient ${getParticipant(props.match.params.id).id}`}</PageTitle>
                                <NavigationLayout 
                                    id={props.match.params.id}
                                    title={`Patient ${getParticipant(props.match.params.id).id}`} 
                                    profile={(state.auth || {type: null}).type === 'root' ? {} : state.identity}
                                    goBack={props.history.goBack} 
                                    onLogout={() => props.history.replace('/logout')}
                                >
                                    <Participant participant={getParticipant(props.match.params.id)} />
                                </NavigationLayout>
                            </React.Fragment>
                        } />
                        
                        {/* Route to the app home screen.*/}
                        <Route exact path="/app" render={props =>
                            !state.identity ? 
                            <Redirect to="/login" /> :
                            <React.Fragment>
                                <PageTitle>mindLAMP</PageTitle>
                                <AppHome {...props} 
                                    auth={{ ...state }} 
                                    setIdentity={async (identity) => await reset(identity) } 
                                />
                            </React.Fragment>
                        } />

                        {/* Route API documentation ONLY. */}
                        <Route exact path="/api" render={props =>
                            <React.Fragment>
                                <PageTitle>LAMP API</PageTitle>
                                <Fab color="primary" aria-label="Back" variant="extended" style={{ position: 'fixed', top: 24, left: 24 }} onClick={() => props.history.replace('/')}>
                                    <Icon>arrow_back</Icon>
                                    Back
                                </Fab>
                                <div style={{ height: 56 }}></div>
                                <SwaggerUI url="https://api.lamp.digital/" docExpansion="list" />
                            </React.Fragment>
                        } />
                    </Switch>
                </HashRouter>
            </SnackbarProvider>
        </MuiThemeProvider>
    )
}
