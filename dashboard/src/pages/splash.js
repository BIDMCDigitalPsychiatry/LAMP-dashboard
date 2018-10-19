import React from 'react';
import { withRouter } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
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

class Splash extends React.Component {
	state = { pages: [] }
	async componentDidMount() {
		document.title = "mindLAMP" + (this.docLoc() === '' ? '' : ' > ' + this.docTitle(this.docLoc()))
		this.setState({ pages: await docPages() })
	}

	docLoc = () => this.props.location.pathname.replace(/^\/docs\/?/, '')
	docIsRoot = (x) => x.replace(/[^\/]/g, '').length == 1 && x.startsWith('start')
	docTitle = (x) => x.replace(/\//g, ' > ').replace(/-/g, ' ').replace('.md', '')
	docContents = () => this.state.pages[this.docLoc() !== '' ? this.docLoc() : 'README.md']

	render = () =>
	<div>
		<AppBar position="static" style={{ background: 'transparent', boxShadow: 'none'}}>
			<Toolbar>
				{ this.docLoc() === '' ? Object.keys(this.state.pages).filter(this.docIsRoot).map(x =>
						<Button variant="text" onClick={() => this.props.history.push('/docs/' + x)}>
							{this.docTitle(x).replace('start > ', '')}
						</Button>
					) : [
						<IconButton aria-label="Go Back" style={{ marginRight: 10 }} onClick={() => this.props.history.goBack()}>
							<ArrowBackIcon  />
						</IconButton>,
						<Typography variant="title">
							{this.docLoc().split('/').slice(-1)[0].replace(/-/g, ' ').replace('.md', '') }
						</Typography>
					]
				}
				<div style={{flexGrow: 1}} />
				<Button variant="outlined" onClick={this.props.onExit}>
					Go To Dashboard
				</Button>
			</Toolbar>
		</AppBar>
		<Card style={{ padding: 20, margin: '0vh 10vw 5vh 10vw', overflow: 'scroll' }}>
			<Markdown imageBaseUrl={baseURL} onPageEnter={(x) => this.props.history.push('/docs/' + x)}>
				{this.docContents()}
			</Markdown>
		</Card>
	</div>
}

export default withRouter(Splash)
