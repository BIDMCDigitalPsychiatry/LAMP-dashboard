
// Core Imports 
import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import MenuItem from '@material-ui/core/MenuItem'
import Badge from '@material-ui/core/Badge'
import Popover from '@material-ui/core/Popover'
import IconButton from '@material-ui/core/IconButton'
import Snackbar from '@material-ui/core/Snackbar'
import Menu from '@material-ui/core/Menu'
import Icon from '@material-ui/core/Icon'
import Slide from '@material-ui/core/Slide'
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
import CredentialManager from './CredentialManager'
import Messages from './Messages'
import { ResponsiveDialog, ResponsiveMargin } from './Utils'

export default function NavigationLayout({ title, id, enableMessaging, noToolbar, goBack, onLogout, ...props }) {
    const [state, setState] = useState({})
    const [showCustomizeMenu, setShowCustomizeMenu] = useState()
    const [confirmLogout, setConfirmLogout] = useState()
    const [passwordChange, setPasswordChange] = useState()
    const [showMessaging, setShowMessaging] = useState()
    return (
        <div>
    		{!!noToolbar ? <React.Fragment/> :
    			<AppBar position="static" style={{background: 'transparent', boxShadow: 'none'}}>
    				<Toolbar>
    					<IconButton
    						onClick={goBack} 
    						color="default"
    						aria-label="Menu"
                        >
    						<Icon>arrow_back</Icon>
    					</IconButton>
    					<Typography variant="h6" color="textPrimary" style={{flexGrow: 1}}>
    						{title || ''}
    					</Typography>
    					<div>
                            <Tooltip title="Notifications">
        						<IconButton color="default" onClick={() => {}}>
        							<Badge badgeContent={0} color="secondary">
        								<Icon>notifications</Icon>
        							</Badge>
        						</IconButton>
                            </Tooltip>
                            <Tooltip title="Settings & More">
        						<IconButton
        							aria-owns={!!showCustomizeMenu ? 'menu-appbar' : null}
        							aria-haspopup="true"
        							onClick={event => setShowCustomizeMenu(event.currentTarget)}
        							color="default"
                                >
        							<Icon>account_circle</Icon>
        						</IconButton>
                            </Tooltip>
    						<Menu
    							id="menu-appbar"
    							anchorEl={showCustomizeMenu}
    							anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
    							transformOrigin={{horizontal: 'right', vertical: 'top'}}
    							open={!!showCustomizeMenu && !confirmLogout && !showMessaging && !passwordChange}
    							onClose={() => setShowCustomizeMenu()}>
    							{!!id && <MenuItem onClick={() => setPasswordChange(true)}>Manage Credentials</MenuItem>}
                                {!!enableMessaging && <MenuItem onClick={() => setShowMessaging(true)}>Messaging & Journal</MenuItem>}
    							<MenuItem onClick={() => setConfirmLogout(true)}>Logout</MenuItem>
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
                open={!!confirmLogout}
                onClose={() => setConfirmLogout()}
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
                    <Button onClick={() => setConfirmLogout()} color="secondary">
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
            {!!enableMessaging &&
                <ResponsiveDialog
                    open={!!showMessaging}
                    onClose={() => setShowMessaging()}
                >
                    <DialogContent>
                        <Messages participantOnly participant={id} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowMessaging()} color="primary" autoFocus>
                            Close
                        </Button>
                    </DialogActions>
                </ResponsiveDialog>
            }
            <Dialog
                open={!!passwordChange && !!id}
                onClose={() => setPasswordChange()}
            >
                <DialogContent style={{ marginBottom: 12 }}>
                    <CredentialManager 
                        id={id} 
                        onError={err => setState(state => ({ ...state, alertMessage: err.message }))}
                    />
                </DialogContent>
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
