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
  Typography,
  colors,
} from "@material-ui/core"

// Local Imports
import { CredentialManager } from "./CredentialManager"
import { ResponsiveMargin } from "./Utils"
import { ReactComponent as Message } from "../icons/Message.svg"
import { ReactComponent as User } from "../icons/User.svg"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import classnames from "classnames"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: {
      paddingLeft: 20,
      paddingRight: 20,
      alignItems: "flex-start",
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      "& h5": {
        color: "#555555",
        fontSize: 25,
        fontWeight: "bold",
        position: "absolute",
        bottom: 0,
      },
    },
    toolbardashboard: { minHeight: 75 },
    toolbarinner: { minHeight: 95 },
    backbtn: { paddingLeft: 0, paddingRight: 0 },
  })
)
export default function NavigationLayout({
  title,
  id,
  noToolbar,
  goBack,
  onLogout,
  activeTab,
  ...props
}: {
  title?: string
  id?: string
  noToolbar?: boolean
  goBack?: any
  onLogout?: any
  activeTab?: string
  children?: any
}) {
  const [showCustomizeMenu, setShowCustomizeMenu] = useState<Element>()
  const [confirmLogout, setConfirmLogout] = useState(false)
  const [passwordChange, setPasswordChange] = useState(false)
  const supportsSidebar = useMediaQuery(useTheme().breakpoints.up("md"))
  const print = useMediaQuery("print")
  const classes = useStyles()

  const dashboardMenus = ["Learn", "Manage", "Assess", "Prevent"]
  const selectedClass =
    dashboardMenus.indexOf(activeTab) < 0
      ? classnames(classes.toolbar, classes.toolbarinner)
      : classnames(classes.toolbar, classes.toolbardashboard)
  return (
    <Box>
      {!!noToolbar || !!print ? (
        <React.Fragment />
      ) : (
        <AppBar position="static" style={{ background: "transparent", boxShadow: "none" }}>
          <Toolbar className={selectedClass}>
            {dashboardMenus.indexOf(activeTab) < 0 && (
              <IconButton
                onClick={goBack}
                color="default"
                className={classes.backbtn}
                aria-label="Menu"
                style={{
                  marginLeft: supportsSidebar && title.startsWith("Patient") ? 64 : undefined,
                }}
              >
                <Icon>arrow_back</Icon>
              </IconButton>
            )}
            <Typography
              variant="h5"
              style={{
                marginLeft: supportsSidebar && title.startsWith("Patient") ? 64 : undefined,
              }}
            >
              {activeTab}
            </Typography>
            <Box flexGrow={1} />
            <Box>
              <Tooltip title="Notifications">
                <IconButton color="default" onClick={() => {}}>
                  <Badge badgeContent={0} color="secondary">
                    <Message />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title="Profile & Settings">
                <IconButton
                  aria-owns={!!showCustomizeMenu ? "menu-appbar" : null}
                  aria-haspopup="true"
                  onClick={(event) => setShowCustomizeMenu(event.currentTarget)}
                  color="default"
                >
                  <User />
                </IconButton>
              </Tooltip>
              <Menu
                id="menu-appbar"
                anchorEl={showCustomizeMenu}
                open={!!showCustomizeMenu && !confirmLogout && !passwordChange}
                onClose={() => setShowCustomizeMenu(undefined)}
              >
                <MenuItem disabled divider>
                  <b>{title}</b>
                </MenuItem>
                {!!id && <MenuItem onClick={() => setPasswordChange(true)}>Manage Credentials</MenuItem>}
                <MenuItem divider onClick={() => setConfirmLogout(true)}>
                  Logout
                </MenuItem>
                <MenuItem
                  dense
                  onClick={() => {
                    setShowCustomizeMenu(undefined)
                    window.open("https://docs.lamp.digital", "_blank")
                  }}
                >
                  <b style={{ color: colors.grey["600"] }}>Help & Support</b>
                </MenuItem>
                <MenuItem
                  dense
                  onClick={() => {
                    setShowCustomizeMenu(undefined)
                    window.open("https://community.lamp.digital", "_blank")
                  }}
                >
                  <b style={{ color: colors.grey["600"] }}>LAMP Community</b>
                </MenuItem>
                <MenuItem
                  dense
                  onClick={() => {
                    setShowCustomizeMenu(undefined)
                    window.open("mailto:team@digitalpsych.org", "_blank")
                  }}
                >
                  <b style={{ color: colors.grey["600"] }}>Contact Us</b>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
      )}
      <Box
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
      </Box>
      <Dialog
        open={!!confirmLogout}
        onClose={() => setConfirmLogout(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Are you sure you want to log out of LAMP right now?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            If you've made some changes, make sure they're saved before you continue to log out.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmLogout(false)} color="secondary">
            Go Back
          </Button>
          <Button
            onClick={() => {
              onLogout()
              setConfirmLogout(false)
            }}
            color="primary"
            autoFocus
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={!!passwordChange && !!id} onClose={() => setPasswordChange(false)}>
        <DialogContent style={{ marginBottom: 12 }}>
          <CredentialManager id={id} />
        </DialogContent>
      </Dialog>
    </Box>
  )
}
