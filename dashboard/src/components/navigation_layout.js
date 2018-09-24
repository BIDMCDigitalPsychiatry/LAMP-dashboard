import React from 'react'
import { withRouter } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import MenuIcon from '@material-ui/icons/Menu';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import ArrowBack from '@material-ui/icons/ArrowBack';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { lightBlue900 } from '@material-ui/core/colors';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import {ObjectView} from '../components/datatable.js'
import EventBus from 'eventing-bus'


// TODO: Red = root, Blue = researcher, use app color = participant!


// Quick util function to generate a copyright notice.
function copyright(startYear, authors) {
    var thisYear = new Date().getFullYear()
    var years = (thisYear > startYear ? startYear + '-' + thisYear : startYear)
    return `Copyright © ${years} ${authors}`
}

class NavigationLayout extends React.Component {
    state = {
        title: "LAMP",
        openProfile: false,
        openPopover: false,
        anchorElement: null,
        logoutConfirm: false,
        me: null
    };
    observer = null;

    constructor(props) {
        super(props)
        EventBus.on("set_title", (data) => {
            document.title = data
            this.setState({title: data})
        })
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
        console.log('test')
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
        <AppBar position="static">
            <Toolbar>
                <IconButton 
                    onClick={this.props.history.goBack}
                    color="inherit" 
                    aria-label="Menu">
                    { this.props.history.length > 2 ? 
                        <ArrowBack /> :
                        <MenuIcon />
                    }
                </IconButton>
                <Typography variant="title" color="inherit" style={{flexGrow: 1}}>
                    {this.state.title}
                </Typography>
                <div>
                    <IconButton color="inherit">
                        <Badge badgeContent={0} color="secondary">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                    <IconButton
                        aria-owns={this.openPopover ? 'menu-appbar' : null}
                        aria-haspopup="true"
                        onClick={this.avatarSelect}
                        color="inherit">
                        <AccountCircle />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={this.state.anchorElement}
                        anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                        transformOrigin={{horizontal: 'right', vertical: 'top'}}
                        open={this.state.openPopover}
                        onClose={this.avatarClose} >
                            <MenuItem onClick={this.openProfile}>Profile</MenuItem>
                            <MenuItem onClick={this.goLogout}>Logout</MenuItem>
                    </Menu>
                </div>
            </Toolbar>
        </AppBar>
        <div style={{ marginTop: 56, paddingBottom: 56, width: '100%', overflowY: 'auto' }}>
            {this.props.children}
        </div>
        <Paper square={true} elevation={20} style={{ backgroundColor: lightBlue900, position: 'fixed', bottom: 0, width: '100%' }}>
            <Typography variant="body2" color="textSecondary" style={{ marginLeft: '8px' }}>
                {copyright(2018, "Beth Israel Deaconess Medical Center Division of Digital Psychiatry")}
            </Typography>
        </Paper>
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
            aria-describedby="alert-dialog-description">

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
    </div>
}

export default withRouter(NavigationLayout);
