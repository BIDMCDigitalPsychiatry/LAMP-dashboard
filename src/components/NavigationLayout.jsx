
// Core Imports 
import React, { useState } from 'react'
import { 
    Box, Button, AppBar, Toolbar, Tooltip, MenuItem, Badge, 
    IconButton, Menu, Icon, Dialog, DialogTitle, 
    DialogContent, DialogContentText, DialogActions 
} from '@material-ui/core'
import { useSnackbar } from 'notistack'

// Local Imports 
import CredentialManager from './CredentialManager'
import { ResponsiveMargin } from './Utils'

export default function NavigationLayout({ title, id, noToolbar, goBack, onLogout, ...props }) {
    const [showCustomizeMenu, setShowCustomizeMenu] = useState()
    const [confirmLogout, setConfirmLogout] = useState()
    const [passwordChange, setPasswordChange] = useState()
    const { enqueueSnackbar } = useSnackbar()
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
                        <Box flexGrow={1} />
    					<div>
                            <Tooltip title="Notifications">
        						<IconButton color="default" onClick={() => {}}>
        							<Badge badgeContent={0} color="secondary">
        								<Icon>notifications</Icon>
        							</Badge>
        						</IconButton>
                            </Tooltip>
                            <Tooltip title="Profile & Settings">
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
    							open={!!showCustomizeMenu && !confirmLogout && !passwordChange}
    							onClose={() => setShowCustomizeMenu()}
                            >
                                <MenuItem disabled divider><b>{title}</b></MenuItem>
    							{!!id && <MenuItem onClick={() => setPasswordChange(true)}>Manage Credentials</MenuItem>}
    							<MenuItem onClick={() => setConfirmLogout(true)}>Logout</MenuItem>
    						</Menu>
    					</div>
    				</Toolbar>
    			</AppBar>
    		}
            <div style={{ marginTop: 0, paddingBottom: 56, width: '100%', overflowY: 'auto' }}>
                <ResponsiveMargin style={{ width: '80%', marginTop: 20, marginLeft: 'auto', marginRight: 'auto' }}>
                    {props.children}
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
                    <Button onClick={() => onLogout() && setConfirmLogout()} color="primary" autoFocus>
                        Logout
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={!!passwordChange && !!id}
                onClose={() => setPasswordChange()}
            >
                <DialogContent style={{ marginBottom: 12 }}>
                    <CredentialManager 
                        id={id} 
                        onError={err => enqueueSnackbar(err.message)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}
