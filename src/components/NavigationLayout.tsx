// Core Imports
import React, { useState, useEffect } from "react"
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
  Container,
} from "@material-ui/core"

// Local Imports
import { CredentialManager } from "./CredentialManager"
import { ResponsiveMargin } from "./Utils"
import { ReactComponent as Message } from "../icons/Message.svg"
import { ReactComponent as User } from "../icons/User.svg"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import classnames from "classnames"
import ResponsiveDialog from "./ResponsiveDialog"
import Messages from "./Messages"
import LAMP from "lamp-core"
import useInterval from "./useInterval"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: {
      paddingLeft: 20,
      paddingRight: 20,
      alignItems: "flex-start",
      paddingTop: 15,
      paddingBottom: theme.spacing(1),
      "& h5": {
        color: "#555555",
        fontSize: 25,
        fontWeight: "bold",
        paddingTop: 15,
        // position: "absolute",
        bottom: 0,
        [theme.breakpoints.down("sm")]: {
          marginTop: 30,
        },
      },
    },
    inlineHeader: {
      background: "#FFFFFF",
      boxShadow: "none",

      "& h5": { fontSize: 25, color: "rgba(0, 0, 0, 0.75)", fontWeight: 600 },
    },
    toolbardashboard: {
      minHeight: 75,
      padding: "15px 10px 0",
      [theme.breakpoints.down("xs")]: {
        display: "block",
        width: "100%",
        padding: "0px 10px 0",
      },
    },
    headerRight: {
      [theme.breakpoints.down("xs")]: {
        display: "block",
        float: "right",
        paddingTop: 10,
      },
    },
    toolbarinner: { minHeight: 95 },
    backbtn: {
      [theme.breakpoints.up("md")]: {},
      [theme.breakpoints.down("xs")]: {
        paddingLeft: 0,
      },
    },
    notification: {
      borderRadius: "50%",
      padding: "8px",
      background: "#CFE4FF",
      display: "inline-block",
    },
    thumbContainer: {
      maxWidth: 1055,
      left: 0,
      right: 0,
      position: "absolute",
      height: 50,

      [theme.breakpoints.up("md")]: {
        paddingLeft: 125,
      },
      [theme.breakpoints.up("lg")]: {
        paddingLeft: 24,
      },
    },
    scroll: { position: "absolute", width: "100%", height: "100%", overflowY: "scroll" },
  })
)

export default function NavigationLayout({
  title,
  id,
  noToolbar,
  goBack,
  onLogout,
  activeTab,
  sameLineTitle,
  ...props
}: {
  title?: string
  id?: string
  noToolbar?: boolean
  goBack?: any
  onLogout?: any
  activeTab?: string
  sameLineTitle?: boolean
  children?: any
}) {
  const [showCustomizeMenu, setShowCustomizeMenu] = useState<Element>()
  const [confirmLogout, setConfirmLogout] = useState(false)
  const [passwordChange, setPasswordChange] = useState(false)
  const [openMessages, setOpenMessages] = useState(false)
  const [conversations, setConversations] = useState({})

  const [msgCount, setMsgCount] = useState(0)
  const supportsSidebar = useMediaQuery(useTheme().breakpoints.up("md"))
  const print = useMediaQuery("print")
  const classes = useStyles()
  //sameLineTitle
  const dashboardMenus = ["Learn", "Manage", "Assess", "Prevent", "Feed", "Researcher"]
  const hideNotifications = ["Researcher"]
  const selectedClass =
    dashboardMenus.indexOf(activeTab) < 0
      ? classnames(classes.toolbar, classes.toolbarinner)
      : classnames(classes.toolbar, classes.toolbardashboard)

  useInterval(
    () => {
      if (!!id) {
        refreshMessages()
      }
    },
    60000,
    true
  )

  useEffect(() => {
    setMsgCount(getMessageCount())
  }, [conversations])

  const refreshMessages = async () => {
    console.log("Fetching messages...")
    setConversations(
      Object.fromEntries(
        (
          await Promise.all(
            [id || ""].map(async (x) => [x, await LAMP.Type.getAttachment(x, "lamp.messaging").catch((e) => [])])
          )
        )
          .filter((x: any) => x[1].message !== "404.object-not-found")
          .map((x: any) => [x[0], x[1].data])
      )
    )
  }

  const getMessageCount = () => {
    let x = (conversations || {})[id || ""] || []
    return !Array.isArray(x) ? 0 : x.filter((a) => a.from === "researcher").length
  }
  return (
    <Box className={classes.scroll}>
      {!!noToolbar || !!print ? (
        <React.Fragment />
      ) : (
        <AppBar position="static" style={{ background: "transparent", boxShadow: "none" }}>
          <Toolbar className={selectedClass}>
            {dashboardMenus.indexOf(activeTab) < 0 && (
              <Container className={classes.thumbContainer}>
                <IconButton
                  onClick={goBack}
                  color="default"
                  className={classes.backbtn}
                  aria-label="Menu"
                  style={{
                    marginLeft:
                      supportsSidebar && typeof title != "undefined" && title.startsWith("Patient") ? 0 : undefined,
                  }}
                >
                  <Icon>arrow_back</Icon>
                </IconButton>

                {sameLineTitle && (
                  <Typography
                    variant="h5"
                    style={{
                      marginLeft: supportsSidebar ? 35 : undefined,
                    }}
                  >
                    {activeTab}
                  </Typography>
                )}
              </Container>
            )}
            {!sameLineTitle && (
              <Container className={classes.thumbContainer}>
                <Typography
                  variant="h5"
                  style={{
                    marginLeft:
                      supportsSidebar && typeof title != "undefined" && title.startsWith("Patient") ? 0 : undefined,
                  }}
                >
                  {activeTab}
                </Typography>
              </Container>
            )}
            <Box flexGrow={1} />
            {(supportsSidebar || dashboardMenus.indexOf(activeTab) >= 0) && (
              <Box className={classes.headerRight}>
                {hideNotifications.indexOf(activeTab) < 0 ? (
                  <Tooltip title="Notifications">
                    <Badge
                      badgeContent={msgCount > 0 ? msgCount : undefined}
                      color="primary"
                      onClick={() => setOpenMessages(true)}
                    >
                      <Message />
                    </Badge>
                  </Tooltip>
                ) : (
                  ""
                )}
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
            )}
          </Toolbar>
        </AppBar>
      )}
      <Box
        style={{
          marginTop: 0,
          paddingBottom: 56,
          width: "100%",
          overflowY: "auto",
          overflow: "hidden",
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

      <ResponsiveDialog
        transient={false}
        animate
        fullScreen
        open={openMessages}
        onClose={() => {
          setOpenMessages(false)
        }}
      >
        <AppBar position="static" className={classes.inlineHeader}>
          <Toolbar className={classes.toolbardashboard}>
            <IconButton
              onClick={() => setOpenMessages(false)}
              color="default"
              className={classes.backbtn}
              aria-label="Menu"
            >
              <Icon>arrow_back</Icon>
            </IconButton>
            <Typography variant="h5">Conversations</Typography>
          </Toolbar>
        </AppBar>
        <Messages
          style={{ margin: "0px -16px -16px -16px" }}
          refresh={true}
          participantOnly={typeof title != "undefined" && title.startsWith("Patient") ? true : false}
          participant={id}
        />
      </ResponsiveDialog>
    </Box>
  )
}
