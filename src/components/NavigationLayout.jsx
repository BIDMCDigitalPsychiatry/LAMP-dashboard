// Core Imports
import React, { useState } from "react"
import {
  Box,
  Button,
  AppBar,
  Toolbar,
  Tooltip,
  MenuItem,
  Badge,
  IconButton,
  Menu,
  Icon,
  Dialog,
  DialogTitle,
  useTheme,
  useMediaQuery,
  DialogContent,
  DialogContentText,
  DialogActions,
  colors,
} from "@material-ui/core"

// Local Imports
import CredentialManager from "./CredentialManager"
import { ResponsiveMargin } from "./Utils"

export default function NavigationLayout({
  title,
  id,
  noToolbar,
  goBack,
  onLogout,
  ...props
}) {
  const [showCustomizeMenu, setShowCustomizeMenu] = useState()
  const [confirmLogout, setConfirmLogout] = useState()
  const [passwordChange, setPasswordChange] = useState()
  const supportsSidebar = useMediaQuery(useTheme().breakpoints.up("md"))

  return (
    <div>
      {!!noToolbar ? (
        <React.Fragment />
      ) : (
        <AppBar
          position='static'
          style={{ background: "transparent", boxShadow: "none" }}
        >
          <Toolbar>
            <IconButton
              onClick={goBack}
              color='default'
              aria-label='Menu'
              style={{
                marginLeft:
                  supportsSidebar && title.startsWith("Patient")
                    ? 64
                    : undefined,
              }}
            >
              <Icon>arrow_back</Icon>
            </IconButton>
            <Box flexGrow={1} />
            <div>
              <Tooltip title='Notifications'>
                <IconButton color='default' onClick={() => {}}>
                  <Badge badgeContent={0} color='secondary'>
                    <Icon>notifications</Icon>
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title='Profile & Settings'>
                <IconButton
                  aria-owns={!!showCustomizeMenu ? "menu-appbar" : null}
                  aria-haspopup='true'
                  onClick={(event) => setShowCustomizeMenu(event.currentTarget)}
                  color='default'
                >
                  <Icon>account_circle</Icon>
                </IconButton>
              </Tooltip>
              <Menu
                id='menu-appbar'
                anchorEl={showCustomizeMenu}
                open={!!showCustomizeMenu && !confirmLogout && !passwordChange}
                onClose={() => setShowCustomizeMenu()}
              >
                <MenuItem disabled divider>
                  <b>{title}</b>
                </MenuItem>
                {!!id && (
                  <MenuItem onClick={() => setPasswordChange(true)}>
                    Manage Credentials
                  </MenuItem>
                )}
                <MenuItem divider onClick={() => setConfirmLogout(true)}>
                  Logout
                </MenuItem>
                <MenuItem
                  dense
                  onClick={() => {
                    setShowCustomizeMenu()
                    window.open("https://docs.lamp.digital", "_blank")
                  }}
                >
                  <b style={{ color: colors.grey["600"] }}>Help & Support</b>
                </MenuItem>
                <MenuItem
                  dense
                  onClick={() => {
                    setShowCustomizeMenu()
                    window.open("https://community.lamp.digital", "_blank")
                  }}
                >
                  <b style={{ color: colors.grey["600"] }}>LAMP Community</b>
                </MenuItem>
                <MenuItem
                  dense
                  onClick={() => {
                    setShowCustomizeMenu()
                    window.open("mailto:team@digitalpsych.org", "_blank")
                  }}
                >
                  <b style={{ color: colors.grey["600"] }}>Contact Us</b>
                </MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
      )}
      <div
        style={{
          marginTop: 0,
          paddingBottom: 56,
          width: "100%",
          overflowY: "auto",
        }}
      >
        <ResponsiveMargin
          style={{
            width: "80%",
            marginTop: 20,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {props.children}
        </ResponsiveMargin>
      </div>
      <Dialog
        open={!!confirmLogout}
        onClose={() => setConfirmLogout()}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          Are you sure you want to log out of LAMP right now?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            If you've made some changes, make sure they're saved before you
            continue to log out.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmLogout()} color='secondary'>
            Go Back
          </Button>
          <Button
            onClick={() => onLogout() && setConfirmLogout()}
            color='primary'
            autoFocus
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={!!passwordChange && !!id}
        onClose={() => setPasswordChange()}
      >
        <DialogContent style={{ marginBottom: 12 }}>
          <CredentialManager id={id} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
