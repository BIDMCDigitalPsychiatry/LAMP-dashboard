
// Core Imports 
import React from 'react'
import { withRouter } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import MenuItem from '@material-ui/core/MenuItem'
import Badge from '@material-ui/core/Badge'
import Popover from '@material-ui/core/Popover'
import IconButton from '@material-ui/core/IconButton'
import Snackbar from '@material-ui/core/Snackbar'
import Menu from '@material-ui/core/Menu'
import ArrowBack from '@material-ui/icons/ArrowBack'
import AccountCircle from '@material-ui/icons/AccountCircle'
import NotificationsIcon from '@material-ui/icons/Notifications'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogActions from '@material-ui/core/DialogActions'
import LinearProgress from '@material-ui/core/LinearProgress'
import Fade from '@material-ui/core/Fade'
import Button from '@material-ui/core/Button'
import red from '@material-ui/core/colors/red'

// Local Imports 
import { ObjectView } from './DataTable'
import { ResponsiveMargin } from './Utils'

class NavigationLayout extends React.Component {
    state = {
		loaded: 1.0,
        title: "LAMP",
        openProfile: false,
        openPopover: false,
        anchorElement: null,
        logoutConfirm: false,
        me: null,
		snackMessage: null,
    };

    anchorEl = null;
    observer = null;
    timer = null;

    startLoading = () => {
		this.timer = setInterval(() => this.setState({
			loaded: (this.state.loaded === 1.0 ? 0.0 : (this.state.loaded > 0.9 ? this.state.loaded : this.state.loaded + 0.01))
		}), 100)
    }

    stopLoading = () => {
		clearInterval(this.timer)
		this.timer = null
		this.setState({ loaded: 1.0 })
    }

    avatarSelect = (event) => {
        this.setState({
            openPopover: true,
            anchorElement: event.currentTarget,
        });
    }

    avatarClose = () => {
        this.setState({
            openPopover: false,
        });
    };

    openProfile = () => {
        this.setState({
            openProfile: true,
        });
    };

    closeProfile = () => {
        this.setState({
            openProfile: false,
        });
    };

    goLogout = () => {
        this.setState({
            openPopover: false,
            logoutConfirm: true
        })
    }
    confirmLogout = () => {
        this.props.history.replace('/logout')
    }
    cancelLogout = () => {
        this.setState({
            openPopover: true,
            logoutConfirm: false
        })
    }

    render = () =>
    <div>
		{!!this.props.noToolbar ? <React.Fragment/> :
			<AppBar position="static" style={{background: 'transparent', boxShadow: 'none'}}>
				<Toolbar>
					<IconButton
						onClick={this.props.history.goBack}
						color="default"
						aria-label="Menu">
						<ArrowBack/>
						{/*this.props.history.length > 2 ?
                        <ArrowBack /> :
                        <MenuIcon />
                    	*/}
					</IconButton>
					<Typography variant="h6" color="textPrimary" style={{flexGrow: 1}}>
						{this.state.title}
					</Typography>
					<div>
						<IconButton color="default" buttonRef={(node) => {
							this.anchorEl = node
						}}>
							<Badge badgeContent={0} color="secondary">
								<NotificationsIcon/>
							</Badge>
						</IconButton>
						<IconButton
							aria-owns={this.openPopover ? 'menu-appbar' : null}
							aria-haspopup="true"
							onClick={this.avatarSelect}
							color="default">
							<AccountCircle/>
						</IconButton>
						<Menu
							id="menu-appbar"
							anchorEl={this.state.anchorElement}
							anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
							transformOrigin={{horizontal: 'right', vertical: 'top'}}
							open={this.state.openPopover}
							onClose={this.avatarClose}>
							<MenuItem onClick={this.openProfile}>Profile</MenuItem>
							<MenuItem onClick={this.goLogout}>Logout</MenuItem>
						</Menu>
					</div>
				</Toolbar>
			</AppBar>
		}
        <div style={{ marginTop: 0, paddingBottom: 56, width: '100%', overflowY: 'auto' }}>
			<Fade in={this.state.loaded >= 1.0}>
                <ResponsiveMargin style={{ marginTop: 20, marginLeft: 'auto', marginRight: 'auto' }}>
                    {React.Children.map(this.props.children, child =>
                        React.cloneElement(child, { layout: {
                            setTitle: (title) => { document.title = title; this.setState({ title: title }) },
                            pageLoading: (loaded) => { !loaded ? this.startLoading() : this.stopLoading() },
                            showMessage: (message, timeout = 3000) => {
                                this.setState({ snackMessage: message })
                                setTimeout(() => this.setState({ snackMessage: null }), timeout)
                            },
                            showAlert: (message) => this.setState({ alertMessage: message })
                        }})
                    )}
                </ResponsiveMargin>
            </Fade>
			<Fade in={this.state.loaded < 1.0}>
				<div style={{ position: 'absolute', width: '90%', marginLeft: '5%', marginRight: '5%', top: '50%' }}>
					<LinearProgress
                        variant="buffer"
                        value={this.state.loaded * 100.0}
                        valueBuffer={(this.state.loaded * 100.0) + (Math.random() * 5) + 2} />
				</div>
			</Fade>
        </div>
        <Dialog
            open={this.state.openProfile}
            onClose={this.closeProfile}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">

            <DialogTitle id="alert-dialog-title">Profile</DialogTitle>
            <DialogContent>
                <ObjectView value={this.props.profile} />
            </DialogContent>
            <DialogActions>
                <Button onClick={this.closeProfile} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
        <Dialog
            open={this.state.logoutConfirm}
            onClose={this.cancelLogout}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                Are you sure you want to log out of LAMP right now?
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    If you've made some changes, make sure they're saved before you continue to log out.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={this.cancelLogout} color="secondary">
                    Go Back
                </Button>
                <Button onClick={this.confirmLogout} color="primary" autoFocus>
                    Logout
                </Button>
            </DialogActions>
        </Dialog>
        <Dialog
            open={!!this.state.alertMessage}
            onClose={() => this.setState({ alertMessage: undefined })}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
            PaperProps={{style: { backgroundColor: red[900] }}}
        >
            <DialogTitle id="alert-dialog-slide-title">
                <span style={{color: 'white'}}>That action could not be completed. Please try again later. (Error code: -16003.)</span>
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    <span style={{color: 'white'}}>{this.state.alertMessage}</span>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.setState({ alertMessage: undefined })} color="primary">
                  <span style={{color: 'white'}}>OK</span>
              </Button>
            </DialogActions>
        </Dialog>
		<Popover
			open={false}
			anchorEl={this.anchorEl}
			anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
			transformOrigin={{ vertical: 'top', horizontal: 'center' }}>
			<Typography>The content of the Popover.</Typography>
		</Popover>
		<Snackbar
			open={this.state.snackMessage !== null}
			message={this.state.snackMessage || ''}
			anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
			autoHideDuration={3000}
			onRequestClose={() => this.setState({ userMsg: null })} />
    </div>
}

export default withRouter(NavigationLayout)
