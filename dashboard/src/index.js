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
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import {blue, red} from '@material-ui/core/colors';
import './index.css';
import Splash from "./pages/splash";

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
const theme = createMuiTheme({
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
});

// Connect to the correct LAMP API server.
LAMP.connect('http://lampapi-env.persbissfu.us-east-2.elasticbeanstalk.com').then(() => {

    // Load the Roboto fonts.
    document.loadCSS('https://fonts.googleapis.com/css?family=Roboto:300,400,500')
    document.title = 'LAMP'    

    // Correctly route all pages based on available (LAMP) authorization.
    ReactDOM.render((
    <MuiThemeProvider theme={theme}>
        <HashRouter>
            <Switch>

                {/* Route index => docs or home (which redirects based on user type). */}
                <Route exact path="/" render={() =>
                    !LAMP.get_identity() ?
                    <Redirect to="/docs" /> :
                    <Redirect to="/home" />
                } />
                <Route exact path="/home" render={() =>
					(LAMP.auth || {type: null}).type === null ?
                    <Redirect to="/login" /> :
					(LAMP.auth || {type: null}).type === 'root' ?
                    <Redirect to="/researcher" /> :
                    (LAMP.auth || {type: null}).type === 'researcher' ?
                    <Redirect to="/researcher/me" /> :
                    <Redirect to="/participant/me" />
				} />

                {/* Route /docs/* => dynamically */}
				<Route path="/docs/:path?" render={props =>
					<Splash onExit={() => props.history.push('/home')} />
				} />

                {/* Route login, register, and logout. */}
                <Route exact path="/login" render={props =>
                    !LAMP.get_identity() ?
                    <Login /> :
                    <Redirect to="/home" />
                } />
                <Route exact path="/register" render={props =>
                    !LAMP.get_identity() ?
                    <Register /> :
                    <Redirect to="/home" />
                } />
                <Route exact path="/logout" render={() => {
                    LAMP.set_identity()
                    return (<Redirect to="/login" />)
                }} />

                {/* Route authenticated routes. */}
				<Route exact path="/researcher" render={props =>
					!LAMP.get_identity() ?
                    <Redirect to="/login" /> :
                    <NavigationLayout profile={LAMP.get_identity()}>
                        <Root {...props} />
                    </NavigationLayout>
				} />
                <Route exact path="/researcher/:id" render={props =>
                    !LAMP.get_identity() ?
                    <Redirect to="/login" /> :
                    <NavigationLayout profile={LAMP.get_identity()}>
                        <Researcher {...props} />
                    </NavigationLayout>
                } />
                <Route exact path="/participant/:id" render={props =>
                    !LAMP.get_identity() ? 
                    <Redirect to="/login" /> :
                    <NavigationLayout profile={LAMP.get_identity()}>
                        <Participant {...props} />
                    </NavigationLayout>
                } />
            </Switch>
        </HashRouter>
    </MuiThemeProvider>
    ), document.getElementById('root'))
})
