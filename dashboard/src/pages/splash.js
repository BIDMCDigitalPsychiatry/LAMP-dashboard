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

// The editor core
import Editor, { Editable, createEmptyState } from 'ory-editor-core'
import 'ory-editor-core/lib/index.css' // we also want to load the stylesheets

// The default ui components
import { Trash, DisplayModeToggle, Toolbar as Toolbar2 } from 'ory-editor-ui'
import 'ory-editor-ui/lib/index.css'

// The rich text area plugin
import slate from 'ory-editor-plugins-slate'
import 'ory-editor-plugins-slate/lib/index.css'

// The spacer plugin
import spacer from 'ory-editor-plugins-spacer'
import 'ory-editor-plugins-spacer/lib/index.css'

// The image plugin
import { imagePlugin } from 'ory-editor-plugins-image'
import 'ory-editor-plugins-image/lib/index.css'

// The video plugin
import video from 'ory-editor-plugins-video'
import 'ory-editor-plugins-video/lib/index.css'

// The parallax plugin
import parallax from 'ory-editor-plugins-parallax-background'
import 'ory-editor-plugins-parallax-background/lib/index.css'

// The html5-video plugin
import html5video from 'ory-editor-plugins-html5-video'
import 'ory-editor-plugins-html5-video/lib/index.css'

// The native handler plugin
import native from 'ory-editor-plugins-default-native'

// The divider plugin
import divider from 'ory-editor-plugins-divider'

// Renders json state to html, can be used on server and client side
import { HTMLRenderer } from 'ory-editor-renderer'

const fakeImageUploadService = (defaultUrl) => (file, reportProgress) => {
	return new Promise((resolve, reject) => {
		let counter = 0
		const interval = setInterval(() => {
			counter++
			reportProgress(counter * 10);
			if (counter > 9) {
				clearInterval(interval)
				alert('This is a fake image upload service, please provide actual implementation via plugin properties')
				resolve({ url: defaultUrl })
			}
		}, 500)
	})
}

// Define which plugins we want to use. We only have slate and parallax available, so load those.
const plugins = {
	content: [slate(), spacer, imagePlugin({ imageUpload: fakeImageUploadService('/images/react.png') }), video, divider, html5video],
	layout: [
		parallax({ defaultPlugin: slate() }),
	],

	// If you pass the native key the editor will be able to handle native drag and drop events (such as links, text, etc).
	// The native plugin will then be responsible to properly display the data which was dropped onto the editor.
	native
}

// Creates an empty editable
const content = createEmptyState()

// Instantiate the editor
const editor = new Editor({
	plugins,
	defaultPlugin: slate(),
	// pass the content state - you can add multiple editables here
	editables: [content],
})
editor.trigger.mode.edit()


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
		<Card style={{ padding: 20, height: 900, margin: '0vh 10vw 5vh 10vw' }}>
			<div className="ory-ui-editor">
				<Editable editor={editor} id={content.id} />
				<Trash editor={editor}/>
				<DisplayModeToggle editor={editor}/>
				<Toolbar2 editor={editor}/>
			</div>
		</Card>
	</div>
}

export default withRouter(Splash)
