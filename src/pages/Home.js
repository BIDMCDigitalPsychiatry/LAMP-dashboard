
// Core Imports
import React from 'react'
import { withRouter } from 'react-router-dom'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Toolbar from '@material-ui/core/Toolbar'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import CssBaseline from '@material-ui/core/CssBaseline'
import ButtonBase from '@material-ui/core/ButtonBase'
import Icon from '@material-ui/core/Icon'
import RestoreIcon from '@material-ui/icons/Restore'
import FavoriteIcon from '@material-ui/icons/Favorite'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Slide from '@material-ui/core/Slide'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

// Local Imports
import Jewels from '../components/Jewels'

function SlideUp(props) { return <Slide direction="up" {...props} /> }
function SlideDown(props) { return <Slide direction="down" {...props} /> }
function SlideLeft(props) { return <Slide direction="left" {...props} /> }
function SlideRight(props) { return <Slide direction="right" {...props} /> }

class Home extends React.Component {
	state = {
		onboarding: true,
		homeOpen: false,
		homeHintOpen: false,
		value: 'assess',
		displayed: undefined,
		helped: undefined,
		presented: undefined,
		contextMenu: undefined,
		notification: false,
		data: {
			learn: [{
				icon: '📚',
				name: 'Articles'
			}], 
			surveys: [{
				icon: '😀',
				name: 'Mood'
			}, {
				icon: '😖',
				name: 'Anxiety'
			}, {
				icon: '😴',
				name: 'Sleep'
			}, {
				icon: '😆',
				name: 'Social'
			}, {
				icon: '👻',
				name: 'Psychosis'
			}], 
			games: [{
				icon: '💎',
				name: 'Jewels'
			}, {
				icon: '📦',
				name: 'Box Game'
			}, {
				icon: '🔐',
				name: 'Crack the Code'
			}, {
				icon: '🐈',
				name: 'Cats and Dogs'
			}, {
				icon: '🎨',
				name: 'Figure Draw'
			}],
			manage: [{
				icon: '🌇',
				name: 'Scratch Card'
			}], 
			prevent: [{
				icon: '🔆',
				name: 'Prize Wheel'
			}]
		}
	}

	theme = createMuiTheme({ 
		palette: {
			type: 'dark',
			background: {
				default: '#1d62f0'
			}
		} 
	})

	componentDidMount() {
		document.addEventListener('contextmenu', event => {
			event.preventDefault()
			this.setState({ 
				menuAnchor: event.target, 
				menuPosition: { left: event.clientX, top: event.clientY}
			})
		})
		setTimeout(() => {
			this.setState({ notification: true })
			setTimeout(() => {
				this.setState({ notification: false })
			}, 5000)
		}, 5000)
	}

	render = () =>
		<div>
          	<IconButton style={{ position: 'fixed', right: 8, top: 8, background: '#ffffff66', webkitBackdropFilter: 'blur(5px)' }} color="inherit" onClick={() => this.setState({ profileOpen: true })} aria-label="Close">
            	<Icon>settings</Icon>
          	</IconButton>
        	<MuiThemeProvider theme={this.theme}>
			<CssBaseline />
			{this.state.value !== 'assess' ? 
				this.state.data[this.state.value].map((row, index) => (
					<Button variant="outlined" key={index} style={{ margin: '5% 5% 0% 5%', width: '90%', height: '90%', lineHeight: 1, justifyContent: 'left', textTransform: 'none' }} onClick={() => this.setState({ displayed: row })}>
						<span style={{ fontSize: 96 }}>{row.icon}</span>
						<div style={{ width: 32 }} />
						<Typography variant="h6" style={{ fontSize: 32 }}>{row.name}</Typography>
					</Button>
				)) :
		      <Grid container direction="column" alignItems="center">
		      	<Typography variant="h6" style={{ marginTop: 12 }}>Assess</Typography>
		        <Grid container direction="row" item xs={12}>
			        <Grid item xs={6}>
						<Button variant="outlined" style={{ display: 'block', margin: '5%', width: '90%', height: '90%', lineHeight: 1, textTransform: 'none'  }} onClick={() => this.setState({ value: 'surveys' })}>
			          		<span style={{ fontSize: '96px' }}>📝</span><br />
			          		Check-In
		          		</Button>
			        </Grid>
			        <Grid item xs={6}>
						<Button variant="outlined" style={{ display: 'block', margin: '5%', width: '90%', height: '90%', lineHeight: 1, textTransform: 'none'  }} onClick={() => this.setState({ value: 'games' })}>
			          		<span style={{ fontSize: '96px' }}>🎮</span><br />
			          		Brain Games
		          		</Button>
			        </Grid>
		        </Grid>
		      	<Typography variant="h6">Favorites</Typography>
		        <Grid container direction="row" item xs={12}>
			        <Grid item xs={6}>
						<Button variant="outlined" style={{ display: 'block', margin: '5%', width: '90%', height: '90%', lineHeight: 1, textTransform: 'none'  }} onClick={() => this.setState({ displayed: undefined, presented: this.state.data.games[3] })}>
			          		<span style={{ fontSize: '96px' }}>{this.state.data.games[3].icon}</span><br />
			          		{this.state.data.games[3].name}
		          		</Button>
			        </Grid>
			        <Grid item xs={6}>
						<Button variant="outlined" style={{ display: 'block', margin: '5%', width: '90%', height: '90%', lineHeight: 1, textTransform: 'none'  }} onClick={() => this.setState({ displayed: undefined, presented: this.state.data.surveys[2] })}>
			          		<span style={{ fontSize: '96px' }}>{this.state.data.surveys[2].icon}</span><br />
			          		{this.state.data.surveys[2].name}
		          		</Button>
			        </Grid>
		        </Grid>
		      	<Typography variant="h6">Up Next</Typography>
		        <Grid container direction="row" item xs={12}>
			        <Grid item xs={6}>
						<Button variant="outlined" style={{ display: 'block', margin: '5%', width: '90%', height: '90%', lineHeight: 1, textTransform: 'none'  }}>
			          		<Icon style={{ fontSize: '96px' }}>check_circle</Icon><br />
			          		All done for the day!
		          		</Button>
			        </Grid>
			        <Grid item xs={6}>
						<Button variant="outlined" style={{ display: 'block', margin: '5%', width: '90%', height: '90%', lineHeight: 1, textTransform: 'none'  }}>
			          		<Typography style={{ fontSize: '65px' }}>2428</Typography><br />
			          		Step Count
		          		</Button>
			        </Grid>
		        </Grid>
		      </Grid>
			}
			<div style={{ height: 100 }} />
			</MuiThemeProvider>
			<SlideDown in={this.state.notification}>
          	<ButtonBase 
          		style={{ 
		          	position: 'fixed', 
		          	padding: 16, 
		          	top: 32, 
		          	left: 32, 
		          	right: 32, 
		          	borderRadius: 8, 
		          	background: '#ffffff77', 
		          	WebkitBackdropFilter: 'blur(20px)', 
		          	justifyContent: 'left'
          		}} 
          		color="inherit" 
          		onClick={() => this.setState({ homeOpen: true })} 
          		aria-label="Close"
          	>
	            <Typography variant="h6">
	            	📚 There's a new article available for you to read. Check it out!
	            </Typography>
          	</ButtonBase>
          	</SlideDown>
			<div style={{
				position: 'fixed',
				bottom: 0,
				width: '100%'
			}}>
				<Paper elevation={15}>
				    <BottomNavigation value={this.state.value} onChange={(event, value) => this.setState({ value })}>
				        <BottomNavigationAction label="Learn" value="learn" icon={<RestoreIcon />} />
				        <BottomNavigationAction label="Assess" value="assess" icon={<FavoriteIcon />} />
				        <BottomNavigationAction label="Manage" value="manage" icon={<LocationOnIcon />} />
				        <BottomNavigationAction label="Prevent" value="prevent" icon={<Icon>folder</Icon>} />
				    </BottomNavigation>
			    </Paper>
	    	</div>
	        <Dialog
	          open={!!this.state.displayed}
	          onClose={() => this.setState({ displayed: undefined })}
	        >
	            <DialogTitle disableTypography>
			      <Typography variant="h6">{!!this.state.displayed ? (this.state.displayed.icon + ' ' + this.state.displayed.name) : ''}</Typography>
			    </DialogTitle>
	          <DialogContent>
	            <Typography gutterBottom>
	              Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac
	              facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum
	              at eros.
	            </Typography>
	            <Typography gutterBottom>
	              Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
	              lacus vel augue laoreet rutrum faucibus dolor auctor.
	            </Typography>
	          </DialogContent>
	          <DialogActions>
	            <Button variant="outlined" style={{float: 'left'}} onClick={() => this.setState({ helped: this.state.displayed })} color="primary">
	              Help
	            </Button>
	            <Button variant="contained" onClick={() => this.setState({ displayed: undefined, presented: this.state.displayed })} color="primary">
	              Start
	            </Button>
	          </DialogActions>
	        </Dialog>
	        <Dialog
	          fullScreen
	          open={!!this.state.helped}
	          onClose={() => this.setState({ helped: undefined })}
	          TransitionComponent={SlideUp}
	        >
	              <IconButton style={{ position: 'fixed', left: 16, top: 16, background: '#ffffff66', webkitBackdropFilter: 'blur(5px)' }} color="inherit" onClick={() => this.setState({ helped: undefined })} aria-label="Close">
	                <CloseIcon />
	              </IconButton>
	          	<video style={{ objectFit: 'cover' }} autoPlay="true" loop>
                    <source src="https://lamp.digital/images/dashboard_example.mp4" type="video/mp4" />
            	</video>
	        </Dialog>
	        <Dialog
	          fullScreen
	          open={!!this.state.presented}
	          onClose={() => this.setState({ presented: undefined })}
	          TransitionComponent={SlideUp}
	        >
	            <Toolbar>
	              <IconButton color="inherit" onClick={() => this.setState({ presented: undefined })} aria-label="Close">
	                <CloseIcon />
	              </IconButton>
	              <Typography variant="h6" color="inherit">
	                {!!this.state.presented ? (this.state.presented.icon + ' ' + this.state.presented.name) : ''}
	              </Typography>
	            </Toolbar>
	          <Jewels onComplete={(x) => { console.dir(x); this.setState({ presented: undefined }) }} />
	        </Dialog>
	        <Dialog
	          fullScreen
	          open={this.state.onboarding}
	          onClose={() => this.setState({ onboarding: false })}
	          TransitionComponent={SlideRight}
	        >
	          <div style={{ width: '100%', height: '50%', top: '0%' }}>
		          <img style={{ width: 120, height: 120 }} src="https://www.lamp.digital/images/68747470733a2f2f6c68332e676f6f676c6575736572636f6e74656e742e636f6d2f4f48394c75315f7762346a6e61386234797a5a4e437a5f775648594c46576c435736467342323142457971556e526631687836656b746474375047522d4178666f2d4d3d73333630.png"></img>
	              <Typography variant="h6" color="inherit">
	                Welcome to mindLAMP.
	              </Typography>
              </div>
	          <div style={{ width: '100%', height: '50%', top: '50%' }}>
	              <Typography>
	                Some other text here. Some other text here. Some other text here. Some other text here. Some other text here. Some other text here. Some other text here. Some other text here. Some other text here. Some other text here. Some other text here. Some other text here. Some other text here. Some other text here. Some other text here. Some other text here. Some other text here. Some other text here. Some other text here. Some other text here. Some other text here. Some other text here. Some other text here. Some other text here. Some other text here. Some other text here. 
	              </Typography>
              </div>
              <IconButton style={{ position: 'fixed', float: 'left', bottom: 16, left: 16 }} color="inherit" onClick={() => {}} aria-label="Close">
                <Icon>cancel</Icon>
              </IconButton>
              <IconButton style={{ position: 'fixed', float: 'right', bottom: 16, right: 16 }} color="inherit" onClick={() => this.setState({ onboarding: false })} aria-label="Close">
                <Icon>arrow_forward</Icon>
              </IconButton>
	        </Dialog>
	        <Dialog
	          fullScreen
	          open={this.state.profileOpen}
	          onClose={() => this.setState({ profileOpen: false })}
	          TransitionComponent={SlideDown}
	        >
              <IconButton style={{ position: 'fixed', float: 'right', top: 8, right: 8 }} color="inherit" onClick={() => this.setState({ profileOpen: false })} aria-label="Close">
                <CloseIcon />
              </IconButton>
	          <Grid container direction="column" alignItems="center" spacing={8} style={{ marginTop: 16 }}>
	              <Grid item xs={12}>
              		<Typography variant="h6">Participant ID: U4983749270</Typography>
	              </Grid>
	              <Grid item xs={12}>
              		<Button variant="contained">Change my Password</Button>
	              </Grid>
	              <Grid item xs={12}>
              		<Button variant="contained">Logout</Button>
	              </Grid>
	              <Grid item xs={12}>
              		<Button variant="contained">Delete my account</Button>
	              </Grid>
	              <Grid item xs={12}>
              		<Button variant="text">Privacy Policy</Button>
	              </Grid>
              </Grid>
	        </Dialog>
	      <Menu
	        anchorEl={this.state.menuAnchor}
	        anchorReference="anchorPosition"
	        anchorPosition={this.state.menuPosition}
	        keepMounted
	        open={!!this.state.menuAnchor}
	        onClose={() => this.setState({ menuAnchor: undefined })}
	      >
	        <MenuItem onClick={() => this.setState({ menuAnchor: undefined })}>No menu items available.</MenuItem>
	      </Menu>
		</div>
}

export default withRouter(Home)
