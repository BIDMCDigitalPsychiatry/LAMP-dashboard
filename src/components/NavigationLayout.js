
// Core Imports 
import React, { useState } from 'react'
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
import { ObjectView, ResponsiveMargin } from './Utils'

export default function NavigationLayout({ title, noToolbar, goBack, onLogout, ...props }) {
    const [state, setState] = useState({})
    return (
        <div>
    		{!!noToolbar ? <React.Fragment/> :
    			<AppBar position="static" style={{background: 'transparent', boxShadow: 'none'}}>
    				<Toolbar>
    					<IconButton
    						onClick={goBack} 
    						color="default"
    						aria-label="Menu">
    						<ArrowBack/>
    					</IconButton>
    					<Typography variant="h6" color="textPrimary" style={{flexGrow: 1}}>
    						{title || ''}
    					</Typography>
    					<div>
    						<IconButton color="default">
    							<Badge badgeContent={0} color="secondary">
    								<NotificationsIcon/>
    							</Badge>
    						</IconButton>
    						<IconButton
    							aria-owns={!!state.openPopover ? 'menu-appbar' : null}
    							aria-haspopup="true"
    							onClick={(event) => setState(state => ({ ...state, openPopover: true, anchorElement: event.currentTarget }))}
    							color="default">
    							<AccountCircle/>
    						</IconButton>
    						<Menu
    							id="menu-appbar"
    							anchorEl={state.anchorElement}
    							anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
    							transformOrigin={{horizontal: 'right', vertical: 'top'}}
    							open={!!state.openPopover}
    							onClose={() => setState(state => ({ ...state, openPopover: false }))}>
    							<MenuItem onClick={() => setState(state => ({ ...state, openProfile: true }))}>Profile</MenuItem>
    							<MenuItem onClick={() => setState(state => ({ ...state, openPopover: false, logoutConfirm: true }))}>Logout</MenuItem>
    						</Menu>
    					</div>
    				</Toolbar>
    			</AppBar>
    		}
            <div style={{ marginTop: 0, paddingBottom: 56, width: '100%', overflowY: 'auto' }}>
                <ResponsiveMargin style={{ width: '80%', marginTop: 20, marginLeft: 'auto', marginRight: 'auto' }}>
                    {React.Children.map(props.children, child =>
                        React.cloneElement(child, { layout: {
                            setTitle: (title) => {  },
                            pageLoading: (loaded) => {},
                            showMessage: (message, timeout = 3000) => {
                                setState(state => ({ ...state, snackMessage: message }))
                                setTimeout(() => setState(state => ({ ...state, snackMessage: null })), timeout)
                            },
                            showAlert: (message) => setState(state => ({ ...state, alertMessage: message }))
                        }})
                    )}
                </ResponsiveMargin>
            </div>
            <Dialog
                open={!!state.openProfile}
                onClose={() => setState(state => ({ ...state, openProfile: false }))}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">Profile</DialogTitle>
                <DialogContent>
                    <ObjectView value={props.profile} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setState(state => ({ ...state, openProfile: false }))} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={!!state.logoutConfirm}
                onClose={() => setState(state => ({ ...state, openPopover: true, logoutConfirm: false }))}
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
                    <Button onClick={() => setState(state => ({ ...state, openPopover: true, logoutConfirm: false }))} color="secondary">
                        Go Back
                    </Button>
                    <Button onClick={onLogout} color="primary" autoFocus>
                        Logout
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={!!state.alertMessage}
                onClose={() => setState(state => ({ ...state, alertMessage: undefined }))}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
                PaperProps={{style: { backgroundColor: red[900] }}}
            >
                <DialogTitle id="alert-dialog-slide-title">
                    <span style={{color: 'white'}}>That action could not be completed. Please try again later. (Error code: -16003.)</span>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        <span style={{color: 'white'}}>{state.alertMessage}</span>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setState(state => ({ ...state, alertMessage: undefined }))} color="primary">
                      <span style={{color: 'white'}}>OK</span>
                  </Button>
                </DialogActions>
            </Dialog>
    		<Snackbar
    			open={!!state.snackMessage}
    			message={state.snackMessage || ''}
    			anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    			autoHideDuration={3000}
    			onClose={() => setState(state => ({ ...state, userMsg: null }))} />
        </div>
    )
}
