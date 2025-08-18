// Core Imports
import React from "react"
import {
  Typography,
  makeStyles,
  Box,
  Icon,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@material-ui/core"
import { useTranslation } from "react-i18next"
import ResponsiveDialog from "./ResponsiveDialog"

const useStyles = makeStyles((theme) => ({
  conversationStyle: {
    borderRadius: "10px",
    padding: "12px 20px 17px 20px",
    textAlign: "justify",
    marginBottom: 20,
    "& span": {
      color: "rgba(0, 0, 0, 0.4)",
      fontSize: "12px",
      lineHeight: "40px",
    },
    "& p": { lineHeight: "20px", color: "rgba(0, 0, 0, 0.75)", fontSize: 14 },
    "& h6": { fontSize: 16 },
  },
  innerMessage: {
    padding: "15px 20px 18px 20px",
    marginBottom: 20,
    "& span": {
      color: "rgba(0, 0, 0, 0.4)",
      fontSize: "12px",
      lineHeight: "40px",
    },
    "& p": { lineHeight: "20px", fontSize: 14 },
  },
  composeMsg: {
    padding: "15px 15px 15px 15px",
    background: "#ECF4FF",
    borderRadius: "20px 0 20px 20px",
    float: "right",
    "& textarea": {
      padding: 0,
      height: 35,
      color: "#4C66D6",
      background: "transparent",
      border: "none",
      resize: "none",
      fontFamily: "Roboto, Helvetica, Arial, sans-serif",
      minWidth: 250,
      "&:focus": { border: 0, outline: 0 },
    },
    "& svg": { color: "#4C66D6" },
    "& button": { padding: 0, color: "#4C66D6", marginRight: 0, "&:hover": { backgroundColor: "transparent" } },
  },
  toolbardashboard: {
    minHeight: 65,
    [theme.breakpoints.up("md")]: {
      paddingTop: "0 !important",
      width: "100%",
      maxWidth: "100% !important",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "0 16px !important",
    },
    "& h5": {
      color: "rgba(0, 0, 0, 0.75)",
      textAlign: "center",
      fontWeight: "600",
      fontSize: 18,
      width: "100%",
      textTransform: "capitalize",
    },
  },
  backbtnlink: {
    width: 48,
    height: 48,
    color: "rgba(0, 0, 0, 0.54)",
    padding: 12,
    borderRadius: "50%",
    "&:hover": { background: "rgba(0, 0, 0, 0.04)" },
  },
  conversationtime: { maxWidth: 75, "& p": { color: "rgba(0, 0, 0, 0.4)", fontSize: 12, lineHeight: "28px" } },
  inlineHeader: {
    background: "#fff",
    boxShadow: "none",

    "& h5": {
      fontSize: 25,
      paddingLeft: 20,
      color: "rgba(0, 0, 0, 0.75)",
      fontWeight: 600,
      lineHeight: "47px",
      textAlign: "left",
      [theme.breakpoints.down("sm")]: {
        paddingLeft: 16,
        lineHeight: "normal",
        fontSize: 22,
      },
      [theme.breakpoints.down("xs")]: {
        paddingLeft: 8,
        lineHeight: "normal",
        fontSize: 20,
      },
    },
  },
  containerWidth: {
    maxWidth: 1055,
    paddingTop: 100,
    [theme.breakpoints.down("sm")]: {
      paddingTop: 80,
    },
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
  composeTextarea: { display: "flex", alignItems: "center" },
  paper: {
    maxWidth: 900,
    margin: "0 auto 16px",
    background: "#Fbfbfb",
    padding: 16,
    [theme.breakpoints.down("sm")]: {
      padding: 8,
    },
  },
  notificationImg: {
    width: 64,
    height: 64,
    background: "#ffffff",
    borderRadius: 8,
    [theme.breakpoints.down("sm")]: {
      width: 52,
      height: 52,
    },
    "& img": {
      maxWidth: "100%",
    },
  },
  iconButton: {
    [theme.breakpoints.down("xs")]: {
      padding: 8,
    },
  },
  notificationMain: {
    width: 400,
    borderRadius: 16,
    maxHeight: 400,
    overflow: "auto",
    "& h5": {
      fontSize: "1.3rem",
      display: "flex",
      alignItems: "center",
      fontWeight: "600  ",
    },
    "& .MuiDivider-root": {
      margin: "2px 0",
    },
  },
  notificationList: {
    cursor: "pointer",
    borderRadius: 8,
    "& p": {
      textOverflow: "ellipsis",
      overflow: "hidden",
      whiteSpace: "nowrap",
      width: "100%",
    },
    "& *": {
      cursor: "pointer",
    },
    "&:hover": {
      background: "#f6f6f6",
    },
  },
  loaderWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 150,
  },
  loaderCircle: {
    "& svg": {
      color: "#000 important",
    },
  },
}))
export default function Notifications({
  notifications,
  notificationLoader,
  handleClose,
  ...props
}: {
  notifications?: any
  notificationLoader?: boolean
  handleClose: any
}) {
  const { t } = useTranslation()
  const classes = useStyles()

  const isSmallScreen = useMediaQuery(useTheme().breakpoints.down("sm"))

  const content = (
    <Box p={3} className={classes.notificationMain}>
      <Box pl={isSmallScreen ? 4 : 0}>
        <Typography variant="h5">
          <Icon>notifications</Icon> Notifications
        </Typography>
      </Box>
      {notificationLoader ? (
        <Box p={3} className={classes.loaderWrapper}>
          <CircularProgress className={classes.loaderCircle} />
        </Box>
      ) : (
        <List>
          {notifications?.length === 0 ? (
            <Typography variant="body2" style={{ padding: 16 }}>
              {t("No notifications found.")}
            </Typography>
          ) : (
            notifications?.map((notification: any, index: number) => (
              <React.Fragment key={index}>
                <ListItem alignItems="flex-start" className={classes.notificationList}>
                  <ListItemAvatar>
                    <Avatar alt="Notification" src="/static/images/avatar/1.jpg" />
                  </ListItemAvatar>
                  <ListItemText
                    primary={notification?.text || t("Notification")}
                    secondary={<>{new Date(notification?.date).toLocaleString()}</>}
                  />
                </ListItem>
                {index !== notifications?.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))
          )}
        </List>
      )}
    </Box>
  )

  return isSmallScreen ? (
    <ResponsiveDialog transient open animate fullScreen onClose={() => handleClose()}>
      {content}
    </ResponsiveDialog>
  ) : (
    content
  )
}
