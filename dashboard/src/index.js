import LAMP from './lamp.js';
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Redirect, Switch } from 'react-router-dom';
import Login from './pages/login.js';
import Register from './pages/register.js';
import Root from './pages/root.js';
import Researcher from './pages/researcher.js';
import Participant from './pages/participant.js';
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
    palette: {
        primary: blue,
        secondary: red,
    },
    appBar: {
        height: 48,
    }, 
    ripple: {
        color: red,
    },
	typography: {
		display4: {
			color: "rgba(0, 0, 0, 0.87)",
			fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
			fontWeight: 300,
			fontSize: "3rem",
			lineHeight: 1,
			letterSpacing: "-0.01562em",
		},
		display3: {
			color: "rgba(0, 0, 0, 0.87)",
			fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
			fontWeight: 300,
			fontSize: "2.5rem",
			lineHeight: 1,
			letterSpacing: "-0.00833em",
		},
		display2: {
			color: "rgba(0, 0, 0, 0.87)",
			fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
			fontWeight: 400,
			fontSize: "2rem",
			lineHeight: 1.17,
			letterSpacing: "0.00735em",
		},
		display1: {
			color: "rgba(0, 0, 0, 0.87)",
			fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
			fontWeight: 400,
			fontSize: "1.5rem",
			lineHeight: 1.33,
			letterSpacing: "0em",
		},
		headline: {
			color: "rgba(0, 0, 0, 0.87)",
			fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
			fontWeight: 400,
			fontSize: "1.25rem",
			lineHeight: 1.6,
			letterSpacing: "0.0075em",
		},
		subheading: {
			color: "rgba(0, 0, 0, 0.87)",
			fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
			fontWeight: 500,
			fontSize: "1rem",
			lineHeight: 1.6,
			letterSpacing: "0.0075em",
		},
	},
};

// Connect to the correct LAMP API server.
LAMP.connect('http://lamp-api.us-east-2.elasticbeanstalk.com').then(() => {

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
                <Route exact path="/participant/:id" render={props =>
                    !LAMP.get_identity() ? 
                    <Redirect to="/login" /> :
                    <NavigationLayout profile={(LAMP.auth || {type: null}).type === 'root' ? {} : LAMP.get_identity()}>
                        <Participant {...props} />
                    </NavigationLayout>
                } />
            </Switch>
        </HashRouter>
    </MuiThemeProvider>
    ), document.body)
})
