import LAMP from './lamp.js';
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Redirect, Switch } from 'react-router-dom';
import Login from './pages/login.js';
import Register from './pages/register.js';
import Forms from './pages/forms.js';
import Root from './pages/root.js';
import Researcher from './pages/researcher.js';
import Participant from './pages/participant.js';
import ParticipantView from './pages/participant_view.js'
import NeuroPsychParticipant from './pages/neuropsych_participant.js'
import NavigationLayout from './components/navigation_layout.js';
import CssBaseline from '@material-ui/core/CssBaseline';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import {blue, red} from '@material-ui/core/colors';

// Synchronously load CSS from a remote URL from within JS.
document.loadCSS = (url) => {
    if (!document.loadedCSS) 
        document.loadedCSS = []
    if (document.loadedCSS.includes(url))
        return

    console.log('Loading CSS: ' + url)
    var element = document.createElement('link')
    element.setAttribute('rel', 'stylesheet')
    element.setAttribute('type', 'text/css')
    element.setAttribute('href', url)

    document.head.appendChild(element)
    document.loadedCSS.push(url)
}

// Configure the UI theme settings.
const theme = {
    typography: {
    useNextVariants: true,
  },
    palette: {
        primary: blue,
        secondary: red,
    },
    appBar: {
        height: 48,
    }, 
    ripple: {
        color: red,
    }
};

// Connect to the correct LAMP API server.
LAMP.connect('https://api.lamp.digital').then(() => {

    // Load the Roboto fonts.
    document.loadCSS('https://fonts.googleapis.com/css?family=Roboto:300,400,500')
    document.title = 'LAMP'

    // Correctly route all pages based on available (LAMP) authorization.
    ReactDOM.render((
    <MuiThemeProvider theme={createMuiTheme(theme)}>
		<CssBaseline />
        <HashRouter>
            <Switch>

                {/* Route index => login or home (which redirects based on user type). */}
                <Route exact path="/" render={() =>
                    !LAMP.get_identity() ?
                    <Redirect to="/login" /> :
                    <Redirect to="/home" />
                } />
                <Route exact path="/home" render={() =>
					(LAMP.auth || {type: null}).type === 'root' ?
                    <Redirect to="/researcher" /> :
                    (LAMP.auth || {type: null}).type === 'researcher' ?
                    <Redirect to="/researcher/me" /> :
                    <Redirect to="/participant/me" />
				} />

                {/* Route login, register, and logout. */}
                <Route exact path="/login" render={props =>
                    !LAMP.get_identity() ?
					<NavigationLayout noToolbar>
						<Login />
					</NavigationLayout> :
                    <Redirect to="/home" />
                } />
                <Route exact path="/register" render={props =>
                    !LAMP.get_identity() ?
					<NavigationLayout noToolbar>
						<Register />
					</NavigationLayout> :
                    <Redirect to="/home" />
                } />
                <Route exact path="/forms" render={props =>
                    !LAMP.get_identity() ?
                    <NavigationLayout noToolbar>
                        <Forms />
                    </NavigationLayout> :
                    <Redirect to="/home" />
                } />
                <Route exact path="/logout" render={() => {
                    LAMP.set_identity()
                    return (<Redirect to="/" />)
                }} />

                {/* Route authenticated routes. */}
				<Route exact path="/researcher" render={props =>
					!LAMP.get_identity() ?
                    <Redirect to="/login" /> :
                    <NavigationLayout profile={(LAMP.auth || {type: null}).type === 'root' ? {} : LAMP.get_identity()}>
                        <Root {...props} />
                    </NavigationLayout>
				} />
                <Route exact path="/researcher/:id" render={props =>
                    !LAMP.get_identity() ?
                    <Redirect to="/login" /> :
                    <NavigationLayout profile={(LAMP.auth || {type: null}).type === 'root' ? {} : LAMP.get_identity()}>
                        <Researcher {...props} />
                    </NavigationLayout>
                } />

                <Route exact path="/researcher/participant/:id" render={props =>
                    !LAMP.get_identity() ?
                    <Redirect to="/login" /> :
                    <NavigationLayout profile={(LAMP.auth || {type: null}).type === 'root' ? {} : LAMP.get_identity()}>
                        <Participant {...props} />
                    </NavigationLayout>
                } />


                <Route exact path="/researcher/neuropsych_participant/:id" render={props =>
                    !LAMP.get_identity() ?
                    <Redirect to="/login" /> :
                    <NavigationLayout profile={(LAMP.auth || {type: null}).type === 'root' ? {} : LAMP.get_identity()}>
                        <NeuroPsychParticipant {...props} />
                    </NavigationLayout>
                } />


                <Route exact path="/participant/:id" render={props =>
                    !LAMP.get_identity() ? 
                    <Redirect to="/login" /> :
                    <NavigationLayout profile={(LAMP.auth || {type: null}).type === 'root' ? {} : LAMP.get_identity()}>
                        <ParticipantView {...props} />
                    </NavigationLayout>
                } />
            </Switch>
        </HashRouter>
    </MuiThemeProvider>
    ), document.getElementById('root'))
})
