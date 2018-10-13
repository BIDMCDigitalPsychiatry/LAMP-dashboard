import React from 'react';
import { withRouter } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import LAMP from '../lamp.js';
import EventBus from 'eventing-bus'
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Card from '@material-ui/core/Card'
import { LAMPSplash, Moth } from '../components/lamp_icons.js'

const inputSubmitStyle = {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0,
}

const styles = theme => ({
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
});

class Transition extends React.Component {
    state = { shouldHide: false }
	componentDidMount() {
		this.setState({ shouldHide: !this.props.in })
	}
	render = () =>
    <Slide
        direction="up"
        onEntering={(x) => this.setState({ shouldHide: false })}
		onExited={(x) => this.setState({ shouldHide: true })}
        style={{ display: this.state.shouldHide ? 'none' : undefined }}
    {...this.props} />
}

class Login extends React.Component {
    state = {
        id: "",
        password: "",
        errorText: "",
        helpOpen: true,
        easterEgg: false
    }

    componentDidMount() {
        document.title = "LAMP"
    }

	componentDidUpdate(prevProps, prevState, snapshot) {
		document.title = this.state.helpOpen ? "LAMP" : "Login"
    }

    handleChange = (event) => {
        const target = event.target
        const value = target.type === 'checkbox' ? target.checked : target.value
        const name = target.name
        this.setState({[name]: value})
        if (this.state.errorText)
            this.setState({errorText: ""})
    }

    handleSubmit = (event) => {
        event.preventDefault()

        let type = (this.state.id === 'root' ?
            'root' : (this.state.id.includes('@') ?
                'researcher' : 'participant'))
        LAMP.set_identity(type, this.state.id, this.state.password).then(res => {
            EventBus.publish("login", res)
            this.props.history.replace('/home')
        }).catch(err => {
            console.warn("error with auth request", err)
            this.setState({
                errorText: `error: ${err.message}`
            })
        })
    }

    handleRegister = (event) => {
        this.props.history.push('/register')
    }

    render = () =>
    <div>
		<Transition in={!this.state.helpOpen}>
        <Grid container justify="space-around" alignItems="center" style={{marginTop: '48px'}}><Grid item xs={4}>
            <Paper square={true} elevation={12} style={{padding: '16px'}}>
                <h1 style={{ marginTop: '0.67em', marginBottom: 0 }}>Please log in.</h1>
                <Typography variant="body2" color="primary" style={{ lineHeight: '0.5em', paddingLeft: 0 }}>
                    LAMP Researcher
                </Typography>
                <form action="" onSubmit={this.handleSubmit}>
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
                        onClick={this.handleRegister}>
                        Register
                    </Button>
                    <Button
                        variant="raised"
                        color="primary"
                        type="submit"
                        style={{float: 'right', width: '45%'}}
                        onClick={this.handleSubmit}>
                        Login
                        <input type="submit" style={inputSubmitStyle}/>
                    </Button>
                </form>
                <Snackbar
                    open={this.state.errorText !== ""}
                    message={this.state.errorText}
                    autoHideDuration={2000}
                />
            </Paper>
        </Grid></Grid>
        </Transition>
		<Transition in={this.state.helpOpen}>
			<Grid container spacing={40} style={{ width: '90vw', marginTop: '5vh', marginLeft: '5vw', marginRight: '5vw' }}>
				<Grid item xs={12} md={12}>
                    <Card style={{ position: 'relative', overflow: 'hidden', height: '80vmin' }}>
						<div style={{
						    position: 'absolute',
                            width: '100%', height: '100%',
                            background: this.state.easterEgg ? '#222' : '#3da1fa',
                            cursor: ('url(' + Moth().props.src + '), pointer') ,
						}}>
                            <div style={{
                                transformOrigin: 'bottom right',
                                transform: 'perspective(1500) scale(2) skewY(-10deg) rotateX(45deg)',
                                background: 'url(' + (this.state.easterEgg ? Moth() : LAMPSplash()).props.src + ')',
								backgroundSize: 'contain',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'bottom right',
                                width: '100%', height: '100%'
                            }} />
                        </div>
                        <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
                            <Typography variant="display2" style={{ color: '#fff', fontSize: '20vmin', lineHeight: '20vmin' }}>
                                {this.state.easterEgg ? 'moth' : 'mind'}
                            </Typography>
                            <Typography variant="display4" style={{ color: '#fff', fontSize: '40vmin', lineHeight: '40vmin', marginTop: 'calc(-1 * 8vmin)', fontWeight: 'bold' }}>
                                LAMP
                            </Typography>
                        </div>
						<div style={{ position: 'absolute', bottom: 0 }}>
							<Typography variant="body2" style={{ color: '#fff', fontSize: '2vmin', backgroundColor: this.state.easterEgg ? '#2222' : '#3da1fa80', padding: 20 }}>
								LAMP is a neuropsychiatric research app than runs on smartphones. Designed to help users
								Learn, Assess, Manage, and Prevent, LAMP is a versatile tool that can be customized for
								numerous clinical and research needs. A unique feature of LAMP is its ability to capture
								real time digital fingerprints of cognition and of brain functioning that can be used to
								track progress and monitor for risk. Currently LAMP is being used in several clinical
								studies including those with patients with schizophrenia, depression, and Alzheimer's
								Disease. LAMP is also being used in research partnerships with groups outside of BIDMC
								including Boston University and UC San Diego. We always welcome new partnerships.
							</Typography>
						</div>
						<div style={{ position: 'absolute', right: 0, padding: 20 }}>
							<Button variant="outlined" style={{ color: '#fff', fontSize: '2vmin' }} onClick={() => this.setState({ helpOpen: false })}>
								Getting Started
							</Button>
                            <div style={{ padding: 10 }} />
							<Button variant="outlined" style={{ color: '#fff', fontSize: '2vmin' }} onClick={() => this.setState({ helpOpen: false })}>
								Go To Dashboard
							</Button>
						</div>
                    </Card>
				</Grid>
				<Grid item xs={12} md={3}>
					<Card>
						<Typography variant="title" color="textPrimary"  style={{ padding: 20 }}>
							Learn
						</Typography>
						<Divider />
						<Typography variant="body2" color="textSecondary" style={{ padding: 20 }}>
							A key first step in effective illness and wellness management is health awareness.
                            LAMP will have built-in an online library of, easy to understand education modules
                            that the users have at their fingertips and can interactively navigate and request
                            help resources as needed.
                        </Typography>
					</Card>
				</Grid>
				<Grid item xs={12} md={3}>
					<Card>
						<Typography variant="title" color="textPrimary"  style={{ padding: 20 }}>
							Assess
						</Typography>
                        <Divider />
						<Typography variant="body2" color="textSecondary" style={{ padding: 20 }}>
							LAMP gathers several types of clinical data. Through offering surveys and cognitive
                            exercises on the phone, LAMP enables real time assessment of mood and thought symptoms.
                            LAMP will also integrate with fitness trackers to collect data on sleep and steps.
                        </Typography>
					</Card>
				</Grid>
				<Grid item xs={12} md={3}>
					<Card>
						<Typography variant="title" color="textPrimary"  style={{ padding: 20 }}>
							Manage
						</Typography>
						<Divider />
						<Typography variant="body2" color="textSecondary" style={{ padding: 20 }}>
							The power of LAMP is not just in data collection that can help better define symptoms
                            but also in its ability to offer a resource and tool in real time and on the go. LAMP
                            will offer cognitive behavioral therapy exercises, sleep training, healthy reminders,
                            and cognitive remediation.
                        </Typography>
					</Card>
				</Grid>
				<Grid item xs={12} md={3}>
					<Card>
						<Typography variant="title" color="textPrimary"  style={{ padding: 20 }}>
							Prevent
						</Typography>
						<Divider />
						<Typography variant="body2" color="textSecondary" style={{ padding: 20 }}>
							Schizophrenia and other serious mental illnesses are chronic and recurrent relapse
                            prevention is key. LAMP will enable users to record early signs and symptoms so that
                            they can seek, and clinicians can help prevent episodes of illness much before they
                            escalate.
                        </Typography>
					</Card>
				</Grid>
			</Grid>
		</Transition>
        <div
            onClick={() => {
                this.setState({ easterEgg: true })
                setTimeout(() => {
					this.setState({ easterEgg: false })
                }, 5000)
            }}
            style={{ position: 'absolute', top: 0, width: 4, height: 4, backgroundColor: '#0001' }} />
    </div>
}

export default withRouter(Login);
