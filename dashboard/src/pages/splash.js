import React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import IconButton from '@material-ui/core/IconButton';
import { LAMPSplash } from '../components/lamp_icons';
import Markdown from "../components/markdown";

const rootURL = 'https://api.github.com/repos/BIDMCDigitalPsychiatry/LAMP-Docs/contents'
const baseURL = 'https://raw.githubusercontent.com/BIDMCDigitalPsychiatry/LAMP-docs/master'
const docPages = async () => {
	const fetchIndex = async (path) => await (await fetch(rootURL + (!!path ? '/' + path : ''))).json()
	const fetchPage = async (path) => await (await fetch(baseURL + '/' + path)).text()
	const recursiveFetchIndex = async (path) => (await Promise.all(
		(await fetchIndex(path)).map(async x => {
			if (x.type === 'dir') {
				return await Promise.all(await recursiveFetchIndex(x.path))
			} else if (x.path.endsWith('.md') && x.type === 'file') {
				return [x]
			} else return []
		}).flat(1000)
	)).flat(1000)
	const recursiveFetchPage = async (path) => (await Promise.all(
		(await recursiveFetchIndex(path)).map(async x =>
			[x.path, await fetchPage(x.path)]
		)
	)).reduce((p, c) => {p[c[0]]=c[1];return p;}, {})
	return recursiveFetchPage()
}

export default class Splash extends React.Component {
	state = {
		pages: [],
		pageStack: []
	}
	async componentDidMount() {
		this.setState({
			pages: await docPages(),
			pageStack: [{ path: 'README.md', title: 'Getting Started' }]
		})
	}
	peekPage = () => this.state.pageStack.slice(-1)[0]
	peekPageContents = () => this.state.pages[this.peekPage().path]
	popPage = () => this.setState({ pageStack: this.state.pageStack.slice(0, -1) })
	pushPage = (path) => this.setState({ pageStack: [...this.state.pageStack, { path: path,
		title: path.split('/').slice(-1)[0].replace(/-/g, ' ').replace('.md', '')
	}] })
	
	render = () =>
	<Grid container spacing={40} style={{width: '90vw', marginTop: '5vh', marginLeft: '5vw', marginRight: '5vw'}}>
		<Grid item xs={12} md={12}>
			<Card style={{position: 'relative', overflow: 'hidden', height: '80vmin'}}>
				<div style={{
					position: 'absolute',
					width: '100%', height: '100%',
					background: '#3da1fa',
				}}>
					<div style={{
						transformOrigin: 'bottom right',
						transform: 'perspective(1500) scale(2) skewY(-10deg) rotateX(45deg)',
						background: 'url(' + LAMPSplash().props.src + ')',
						backgroundSize: 'contain',
						backgroundRepeat: 'no-repeat',
						backgroundPosition: 'bottom right',
						width: '100%', height: '100%'
					}}/>
				</div>
				<div style={{position: 'absolute', width: '100%', height: '100%'}}>
					<Typography variant="display2"
								style={{color: '#fff', fontSize: '20vmin', lineHeight: '20vmin'}}>
						mind
					</Typography>
					<Typography variant="display4" style={{
						color: '#fff',
						fontSize: '40vmin',
						lineHeight: '40vmin',
						marginTop: 'calc(-1 * 8vmin)',
						fontWeight: 'bold'
					}}>
						LAMP
					</Typography>
				</div>
				<div style={{position: 'absolute', bottom: 0}}>
					<Typography variant="body2" style={{
						color: '#fff',
						fontSize: '2vmin',
						backgroundColor: '#3da1fa80',
						padding: 20
					}}>
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
				<div style={{position: 'absolute', right: 0, padding: 20}}>
					<Button variant="outlined" style={{color: '#fff', fontSize: '2vmin'}} onClick={this.props.onExit}>
						Go To Dashboard
					</Button>
				</div>
			</Card>
		</Grid>
		<Grid item xs={12} md={3}>
			<Card>
				<Typography variant="title" color="textPrimary" style={{padding: 20}}>
					Learn
				</Typography>
				<Divider/>
				<Typography variant="body2" color="textSecondary" style={{padding: 20}}>
					A key first step in effective illness and wellness management is health awareness.
					LAMP will have built-in an online library of, easy to understand education modules
					that the users have at their fingertips and can interactively navigate and request
					help resources as needed.
				</Typography>
			</Card>
		</Grid>
		<Grid item xs={12} md={3}>
			<Card>
				<Typography variant="title" color="textPrimary" style={{padding: 20}}>
					Assess
				</Typography>
				<Divider/>
				<Typography variant="body2" color="textSecondary" style={{padding: 20}}>
					LAMP gathers several types of clinical data. Through offering surveys and cognitive
					exercises on the phone, LAMP enables real time assessment of mood and thought symptoms.
					LAMP will also integrate with fitness trackers to collect data on sleep and steps.
				</Typography>
			</Card>
		</Grid>
		<Grid item xs={12} md={3}>
			<Card>
				<Typography variant="title" color="textPrimary" style={{padding: 20}}>
					Manage
				</Typography>
				<Divider/>
				<Typography variant="body2" color="textSecondary" style={{padding: 20}}>
					The power of LAMP is not just in data collection that can help better define symptoms
					but also in its ability to offer a resource and tool in real time and on the go. LAMP
					will offer cognitive behavioral therapy exercises, sleep training, healthy reminders,
					and cognitive remediation.
				</Typography>
			</Card>
		</Grid>
		<Grid item xs={12} md={3}>
			<Card>
				<Typography variant="title" color="textPrimary" style={{padding: 20}}>
					Prevent
				</Typography>
				<Divider/>
				<Typography variant="body2" color="textSecondary" style={{padding: 20}}>
					Schizophrenia and other serious mental illnesses are chronic and recurrent relapse
					prevention is key. LAMP will enable users to record early signs and symptoms so that
					they can seek, and clinicians can help prevent episodes of illness much before they
					escalate.
				</Typography>
			</Card>
		</Grid>
		<Grid item xs={12} md={12}>
			<Card style={{ marginBottom: '5vh' }}>
				<Toolbar>
					{ this.state.pageStack.length <= 1 ? <React.Fragment /> :
						<IconButton aria-label="Go Back" style={{ marginRight: 10 }} onClick={() => this.popPage()}>
							<ArrowBackIcon  />
						</IconButton>
					}
					<Typography variant="title">
						{this.state.pageStack.length == 0 ? <React.Fragment /> : this.peekPage().title }
					</Typography>
				</Toolbar>
				<Divider />
				<div style={{ padding: '20px', minHeight: '50vh', overflow: 'scroll' }}>
					{ this.state.pageStack.length == 0 ? <React.Fragment /> :
						<Markdown imageBaseUrl={baseURL} onPageEnter={(x) => this.pushPage(x)}>
							{this.peekPageContents()}
						</Markdown>
					}
				</div>
			</Card>
		</Grid>
	</Grid>
}
