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
  Backdrop,
  CircularProgress,
  Container,
  Popover,
  Fab,
  makeStyles,
  Theme,
  createStyles,
} from "@material-ui/core"
// Local Imports
import { CredentialManager } from "./CredentialManager"
import { ResponsiveMargin } from "./Utils"
import LAMP from "lamp-core"
import { useTranslation } from "react-i18next"
import { Service } from "./DBService/DBService"
import { sensorEventUpdate } from "./BottomMenu"
import { useLocation } from "react-router-dom"
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
      "& span": {
        color: "rgba(0, 0, 0, 0.54)",
      },
      [theme.breakpoints.down("xs")]: {
        display: "block",
        float: "right",
      },
    },
    backbtn: {
      [theme.breakpoints.up("md")]: {},
      [theme.breakpoints.down("xs")]: {
        paddingLeft: 0,
      },
    },
    backMain: {
      width: 40,
      height: 40,
      marginTop: -8,
      background: "#fff",
    },
    thumbContainer: {
      maxWidth: 1055,
      left: 0,
      right: 0,
      position: "absolute",
      height: 50,
      "& h5": { fontWeight: "bold", color: "rgba(0, 0, 0, 0.75)", fontSize: 30, padding: "15px 0", background: "#fff" },

      [theme.breakpoints.up("md")]: {
        // paddingLeft: 125,
        width: "80%",
      },
      [theme.breakpoints.up("lg")]: {
        paddingLeft: 15,
      },
    },
    scroll: {
      position: "absolute",
      width: "100%",
      height: "100%",
      overflowY: "auto",
      left: 0,
      top: 0,
      paddingTop: 120,
      paddingBottom: 100,
      [theme.breakpoints.down("sm")]: {
        paddingTop: 94,
      },
    },
    appbarResearcher: { zIndex: 1111, position: "relative", boxShadow: "none", background: "transparent" },
    toolbarResearcher: {
      minHeight: 50,
      width: "100%",
      background: "transparent",
      "& h5": {
        padding: "55px 0 25px",
        [theme.breakpoints.down("sm")]: {
          paddingTop: 38,
          paddingBottom: 20,
        },
      },
    },
    logToolbarResearcher: { marginTop: 50, paddingTop: 0, background: "transparent", "& h5": { paddingTop: 35 } },
    customPopover: { backgroundColor: "rgba(0, 0, 0, 0.4)" },
    customPaper: {
      maxWidth: 380,
      maxHeight: 600,
      marginTop: 25,
      minWidth: 320,
      marginLeft: 15,
      borderRadius: 10,
      padding: "10px 0",
      "& h6": { fontSize: 16, fontWeight: 600 },
      "& li": {
        display: "inline-block",
        width: "100%",
        padding: "15px 30px",
        fontSize: 16,
        fontWeight: 600,
        "&:hover": { backgroundColor: "#ECF4FF" },
      },
      "& *": { cursor: "pointer" },
    },
    researcherAccount: {
      color: "#fff",
      fontSize: 14,
      lineHeight: "38px",
      cursor: "pointer",
      textTransform: "capitalize",
      boxShadow: "none",
      background: "transparent",
      paddingRight: 0,
      "&:hover": { background: "transparent" },
      "&:active": { background: "transparent", boxShadow: "none" },
      "& svg": { marginRight: 10 },
    },
    logResearcherToolbar: {
      background: "#7599FF",
      position: "fixed",
      width: "100%",
      zIndex: 1,
      minHeight: 50,
      justifyContent: "space-between",
      "& $backbtn": { color: "#fff" },
    },
    logResearcherBorder: { paddingTop: 46, top: 50, height: "calc(100% - 50px)" },
    logParticipantBorder: {
      border: "#7599FF solid 5px",
      borderTop: 0,
      paddingTop: 110,
      top: 50,
      height: "calc(100% - 50px)",
    },
    backdrop: {
      zIndex: 111111,
      color: "#fff",
    },
  })
)

export default function NavigationLayout({
  title,
  id,
  name,
  authType,
  noToolbar,
  goBack,
  onLogout,
  activeTab,
  sameLineTitle,
  changeResearcherType,
  // participant,
  ...props
}: {
  title?: string
  id?: string
  name?: string
  authType: string
  noToolbar?: boolean
  goBack?: any
  onLogout?: any
  activeTab?: string
  sameLineTitle?: boolean
  changeResearcherType?: Function
  // participant?: Participant
  children?: any
}) {
  const [showCustomizeMenu, setShowCustomizeMenu] = useState<Element>()
  const [confirmLogout, setConfirmLogout] = useState(false)
  const [passwordChange, setPasswordChange] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [conversations, setConversations] = useState({})
  const [msgCount, setMsgCount] = useState(0)
  const [isDeleted, setIsDeleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const supportsSidebar = useMediaQuery(useTheme().breakpoints.up("md"))
  const print = useMediaQuery("print")
  const classes = useStyles()
  const { t } = useTranslation()
  //sameLineTitle
  const dashboardMenus = ["Learn", "Manage", "Assess", "Portal", "Feed", "Researcher"]
  const hideNotifications = ["Researcher", "Administrator"]
  const [sensorData, setSensorData] = useState(null)
  const [researcherId, setResId] = useState(null)
  const [username, setName] = useState(null)
  const location = useLocation()

  useEffect(() => {
    LAMP.Type.getAttachment(id, "lamp.name").then((res: any) => {
      setName(res?.data ?? "")
    })
  }, [location.pathname])

  useEffect(() => {
    let isMounted = true
    if (isMounted) {
      if (
        (authType === "researcher" || authType === "admin") &&
        typeof title != "undefined" &&
        title.startsWith("User") &&
        title !== "User Administrator"
      ) {
        Service.getAll("researcher").then((researcher) => {
          setResId(researcher[0] && researcher[0]["id"] ? researcher[0]["id"] : "")
          setLoading(false)
        })
        Service.getDataByKey("participants", [id], "id").then((data) => {
          setIsDeleted(data[0]?.is_deleted)
        })
      } else {
        setLoading(false)
      }
      if (!!isMounted) {
        refresh()
      }
    }
    return () => {
      isMounted = false
    }
  }, [])

  const refresh = () => {
    if (!!id && id !== "me") {
      if (sensorData === null) {
        ;(async () => {
          let data = await LAMP.SensorEvent.allByParticipant(id, "lamp.analytics")
          data = Array.isArray(data) ? (data || []).filter((d) => d.data.page === "conversations") : null
          setSensorData(!!data ? data[0] : [])
        })()
      }
    }
  }

  useEffect(() => {
    if (sensorData !== null && id !== "me") refreshMessages()
  }, [sensorData])

  useEffect(() => {
    if (sensorData !== null && id !== "me") setMsgCount(getMessageCount())
  }, [conversations])

  const updateAnalytics = async () => {
    setSensorData(null)
    window.location.href = `/#/participant/${id}/messages`
    await sensorEventUpdate("conversations", id, null)
    let data = await LAMP.SensorEvent.allByParticipant(id, "lamp.analytics")
    data = (data || []).filter((d) => d.data.page === "conversations")
    setSensorData(data ? data[0] : [])
  }

  const onDeleteAccount = async () => {
    await LAMP.Type.setAttachment(id, "me", "lamp.is_deleted", true)
    await LAMP.Credential.list(id).then((cred) => {
      cred = cred.filter((c) => c.hasOwnProperty("origin"))
      ;(cred || []).map(async (each) => {
        await LAMP.Credential.delete(id, each["access_key"])
      })
    })
    await LAMP.Type.setAttachment(id, "me", "lamp.name", null)
    Service.updateValue("participants", { participants: [{ is_deleted: true, id: id }] }, "is_deleted", "id")
    if (authType === "researcher" || authType === "admin") {
      participantBack()
    } else {
      onLogout()
    }
  }

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
    return !Array.isArray(x)
      ? 0
      : x.filter((a) => a.from === "researcher" && new Date(a.date).getTime() > (sensorData?.timestamp ?? 0)).length
  }
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const participantBack = () => {
    if (researcherId === null) {
      Service.getAll("researcher").then((researcher) => {
        setResId(researcher[0]["id"])
        window.location.href = `/#/researcher/${researcher[0]["id"]}/users`
        setLoading(false)
      })
    } else {
      window.location.href = `/#/researcher/${researcherId}/users`
    }
  }

  const open = Boolean(anchorEl)
  const idp = open ? "simple-popover" : undefined
  const roles = ["Administrator", "User Administrator", "Practice Lead"]
  return (
    <Box>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {!!noToolbar || !!print ? (
        <React.Fragment />
      ) : (
        <AppBar classes={{ root: classes.appbarResearcher }}>
          {(authType === "researcher" || authType === "admin") && (
            <Toolbar className={classes.logResearcherToolbar}>
              {typeof title != "undefined" && title.startsWith("User") && title !== "User Administrator" ? (
                <Box>
                  <IconButton className={classes.backbtn} onClick={participantBack} color="default" aria-label="Menu">
                    <Icon>arrow_back</Icon>
                  </IconButton>
                  {`${t("Patient View")}`}: {username ? `${username} (${id})` : id}
                </Box>
              ) : (
                <Box>
                  {authType === "admin" && !roles.includes(title) && (
                    <IconButton
                      onClick={() => {
                        window.location.href = `/#/researcher`
                      }}
                      color="default"
                      className={classes.backbtn}
                      aria-label="Menu"
                      style={{
                        marginLeft:
                          supportsSidebar &&
                          typeof title != "undefined" &&
                          title.startsWith("User") &&
                          title !== "User Administrator"
                            ? 0
                            : undefined,
                      }}
                    >
                      <Icon>arrow_back</Icon>
                    </IconButton>
                  )}
                  <Fab
                    aria-describedby={id}
                    variant="extended"
                    className={classes.researcherAccount}
                    onClick={handleClick}
                  >
                    <Icon>account_circle</Icon>
                    {title.startsWith("User") && title !== "User Administrator"
                      ? `${t("User number", { number: title.split(" ")[1] })}`
                      : title}
                    <Icon>arrow_drop_down</Icon>
                  </Fab>
                  <Popover
                    classes={{ root: classes.customPopover, paper: classes.customPaper }}
                    id={idp}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                  >
                    {authType === "admin" && (title === "Administrator" || title === "User Administrator") && (
                      <MenuItem onClick={() => setPasswordChange(true)}>{`${t("Manage Credentials")}`}</MenuItem>
                    )}
                    <MenuItem divider onClick={() => setConfirmLogout(true)}>
                      {`${t("Logout")}`}
                    </MenuItem>
                    <MenuItem
                      dense
                      onClick={() => {
                        setShowCustomizeMenu(undefined)
                        window.open("https://docs.lamp.digital/troubleshooting", "_blank")
                      }}
                    >
                      {`${t("Help & Support")}`}
                    </MenuItem>
                    <MenuItem
                      dense
                      onClick={() => {
                        setShowCustomizeMenu(undefined)
                        window.open("mailto:team@digitalpsych.org", "_blank")
                      }}
                    >
                      {`${t("Contact Us")}`}
                    </MenuItem>
                    <MenuItem
                      dense
                      onClick={() => {
                        setShowCustomizeMenu(undefined)
                        window.open("https://docs.lamp.digital/privacy/", "_blank")
                      }}
                    >
                      <b style={{ color: colors.grey["600"] }}>{`${t("Privacy Policy")}`}</b>
                    </MenuItem>
                  </Popover>
                </Box>
              )}

              {/**Commenting for now
               {(authType === "researcher" || authType === "admin") &&
                title !== "Administrator" &&
                title !== "User Administrator" &&
                title !== "Practice Lead" &&
                !title.startsWith("User") &&
                !!changeResearcherType && (
                  <Box>
                    <ModeToggleButton changeResearcherType={changeResearcherType} />
                  </Box>
                )} */}
            </Toolbar>
          )}
          {((authType !== "researcher" && authType !== "admin") ||
            ((authType === "researcher" || authType === "admin") &&
              title.startsWith("User") &&
              title !== "User Administrator")) && (
            <Toolbar
              classes={{
                root:
                  classes.toolbarResearcher +
                  (authType === "researcher" || authType === "admin" ? " " + classes.logToolbarResearcher : ""),
              }}
            >
              {((authType !== "admin" && dashboardMenus.indexOf(activeTab) < 0) ||
                (title.startsWith("User") && title !== "User Administrator")) && (
                <Container className={classes.thumbContainer}>
                  <Typography
                    variant="h5"
                    style={{
                      marginLeft: supportsSidebar ? 35 : undefined,
                      textTransform: "capitalize",
                    }}
                  >
                    {typeof activeTab === "string" ? `${t(activeTab)}` : ""}
                  </Typography>
                </Container>
              )}
              {((authType !== "admin" && !sameLineTitle && activeTab !== "Studies") ||
                (title.startsWith("User") && title !== "User Administrator")) && (
                <Container className={classes.thumbContainer}>
                  <Typography
                    variant="h5"
                    style={{
                      textTransform: "capitalize",
                      marginLeft:
                        supportsSidebar &&
                        typeof title != "undefined" &&
                        title.startsWith("User") &&
                        title !== "User Administrator"
                          ? 0
                          : undefined,
                    }}
                  >
                    {typeof activeTab === "string" ? t(activeTab?.charAt(0).toUpperCase() + activeTab?.slice(1)) : ""}
                  </Typography>
                </Container>
              )}
              <Box flexGrow={1} />
              {typeof title != "undefined" && title.startsWith("User") && title !== "User Administrator" && (
                // participant?.isMessagingEnabled && (
                // (supportsSidebar || dashboardMenus.indexOf(activeTab) >= 0) &&
                <Box className={classes.headerRight}>
                  {hideNotifications.indexOf(activeTab) < 0 ? (
                    <Tooltip title={`${t("Notifications")}`}>
                      <Badge
                        badgeContent={msgCount > 0 ? msgCount : undefined}
                        color="primary"
                        onClick={() => {
                          localStorage.setItem("lastTab" + id, JSON.stringify(new Date().getTime()))
                          updateAnalytics()
                        }}
                      >
                        <Icon>comment</Icon>
                      </Badge>
                    </Tooltip>
                  ) : (
                    ""
                  )}
                </Box>
              )}
              {typeof title != "undefined" && title.startsWith("User") && title !== "User Administrator" && (
                <Box>
                  <Tooltip title={`${t("Profile & Settings")}`}>
                    <IconButton
                      aria-owns={!!showCustomizeMenu ? "menu-appbar" : null}
                      aria-haspopup="true"
                      onClick={(event) => setShowCustomizeMenu(event.currentTarget)}
                      color="default"
                    >
                      <Icon>account_circle</Icon>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    id="menu-appbar"
                    anchorEl={showCustomizeMenu}
                    open={!!showCustomizeMenu && !confirmLogout && !passwordChange}
                    onClose={() => setShowCustomizeMenu(undefined)}
                  >
                    <MenuItem disabled divider>
                      <b>{`${t("User number", { number: title.split(" ")[1] })}`}</b>
                    </MenuItem>
                    {(isDeleted === null || !isDeleted) && (
                      <MenuItem divider onClick={() => setConfirmDelete(true)}>
                        {`${t("Delete Account")}`}
                      </MenuItem>
                    )}
                    <MenuItem divider onClick={() => setConfirmLogout(true)}>
                      {`${t("Logout")}`}
                    </MenuItem>
                    <MenuItem
                      dense
                      onClick={() => {
                        setShowCustomizeMenu(undefined)
                        window.open("https://docs.lamp.digital/troubleshooting", "_blank")
                      }}
                    >
                      <b style={{ color: colors.grey["600"] }}>{`${t("Help & Support")}`}</b>
                    </MenuItem>
                    <MenuItem
                      dense
                      onClick={() => {
                        setShowCustomizeMenu(undefined)
                        window.open("mailto:team@digitalpsych.org", "_blank")
                      }}
                    >
                      <b style={{ color: colors.grey["600"] }}>{`${t("Contact Us")}`}</b>
                    </MenuItem>
                  </Menu>
                </Box>
              )}
            </Toolbar>
          )}
        </AppBar>
      )}
      <Box
        style={{
          marginTop: 0,
          paddingBottom: 56,
          width: "100%",
          overflowY: "hidden",
          overflow: !!id ? "hidden" : "initial",
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
          <Box
            className={
              classes.scroll +
              ((authType === "researcher" || authType === "admin") &&
              typeof title != "undefined" &&
              title.startsWith("User") &&
              title !== "User Administrator"
                ? " " + classes.logParticipantBorder
                : authType === "researcher" || authType === "admin"
                ? " " + classes.logResearcherBorder
                : " ")
            }
          >
            {props.children}
          </Box>
        </ResponsiveMargin>
      </Box>
      <Dialog
        open={!!confirmLogout || !!confirmDelete}
        onClose={() => {
          setConfirmLogout(false)
          setConfirmDelete(false)
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`${t(
          !!confirmDelete ? "Confirmation" : "Are you sure you want to log out of LAMP right now?"
        )}`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`${t(
              !!confirmDelete
                ? "Are you sure you want to delete account?"
                : "If you've made some changes, make sure they're saved before you continue to log out."
            )}`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {!!confirmLogout && (
            <Button onClick={() => setConfirmLogout(false)} color="secondary">
              {`${t("Go Back")}`}
            </Button>
          )}
          <Button
            onClick={() => {
              if (!!confirmLogout) {
                onLogout()
                setConfirmLogout(false)
              } else {
                onDeleteAccount()
                setConfirmDelete(false)
              }
            }}
            color="primary"
            autoFocus
          >
            {`${t(!!confirmDelete ? "Delete" : "Logout")}`}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!passwordChange} onClose={() => setPasswordChange(false)}>
        <DialogContent style={{ marginBottom: 12 }}>
          <CredentialManager id={!!id ? id : LAMP.Auth._auth.id} type={title} fromParticipant={true} />
        </DialogContent>
      </Dialog>
    </Box>
  )
}
