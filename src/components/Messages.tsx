// Core Imports
import React, { useState } from "react"
import {
  Typography,
  makeStyles,
  Box,
  Grid,
  IconButton,
  Container,
  AppBar,
  Toolbar,
  Icon,
  InputBase,
  Divider,
  useTheme,
  useMediaQuery,
} from "@material-ui/core"
import ResponsiveDialog from "./ResponsiveDialog"
import useInterval from "./useInterval"
import LAMP from "lamp-core"
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline"
import { useTranslation } from "react-i18next"
import TextareaAutosize from "@material-ui/core/TextareaAutosize"

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
    },
  },
  conversationtime: { maxWidth: 75, "& p": { color: "rgba(0, 0, 0, 0.4)", fontSize: 12, lineHeight: "28px" } },
  inlineHeader: {
    background: "#FFFFFF",
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
      },
    },
  },
  containerWidth: {
    maxWidth: 1055,
    [theme.breakpoints.down("sm")]: {
      padding: 0,
      marginTop: 30,
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
}))

export default function Messages({
  refresh,
  participant,
  participantOnly,
  privateOnly,
  expandHeight,
  msgOpen,
  ...props
}: {
  privateOnly?: boolean
  expandHeight?: boolean
  participant?: string
  participantOnly?: boolean
  refresh?: boolean
  style?: any
  msgOpen?: boolean
}) {
  const classes = useStyles()
  const [open, setOpen] = useState(msgOpen ?? false)
  const [conversations, setConversations] = useState({})
  const [sender, setSender] = useState(null)
  const [currentMessage, setCurrentMessage] = useState<string>()
  const [addMsg, setAddMsg] = useState(false)
  const supportsSidebar = useMediaQuery(useTheme().breakpoints.up("md"))
  const { t } = useTranslation()

  useInterval(
    () => {
      refreshMessages()
    },
    !!refresh ? 10 * 1000 /* 10s */ : null,
    true
  )
  const duration = (date: Date) => {
    var delta = Math.abs(date.getTime() - new Date().getTime()) / 1000

    var days = Math.floor(delta / 86400)
    delta -= days * 86400
    if (days > 0) return days + (days > 1 ? " " + t("days") : t("day"))

    var hours = Math.floor(delta / 3600) % 24
    if (hours > 0) return hours + (hours > 1 ? " hrs" : "hr")

    delta -= hours * 3600
    var minutes = Math.floor(delta / 60) % 60
    if (minutes > 0) return minutes + (minutes > 1 ? " mins" : "min")

    delta -= minutes * 60
    var seconds = Math.floor(delta % 60)
    return seconds + (seconds > 1 ? "sec" : "secs")
  }
  const refreshMessages = async () => {
    console.log("Fetching messages...")
    setConversations(
      Object.fromEntries(
        (
          await Promise.all(
            [participant || ""].map(async (x) => [
              x,
              await LAMP.Type.getAttachment(x, "lamp.messaging").catch((e) => []),
            ])
          )
        )
          .filter((x: any) => x[1].message !== "404.object-not-found")
          .map((x: any) => [x[0], x[1].data])
      )
    )
  }

  const getMessages = () => {
    let x = (conversations || {})[participant || ""] || []
    return !Array.isArray(x) ? [] : x
  }

  const sendMessage = async (msgOpen: boolean) => {
    let msg = (currentMessage || "").trim()
    if (msg.length === 0 || !participant) return

    await refreshMessages()
    let all = getMessages()
    all.push({
      from: !!participantOnly ? "participant" : "researcher",
      type: msgOpen ? "note" : "message",
      date: new Date(),
      text: msg,
    })
    LAMP.Type.setAttachment(participant, "me", "lamp.messaging", all)
    setCurrentMessage(undefined)
    setAddMsg(false)
    setConversations({ ...(conversations || {}), [participant]: all })
  }

  const messageSection = (type: number) => {
    return (
      <Box>
        {getMessages()
          .filter(
            (x) => (type === 0 && x.type === "note") || (type === 1 && x.type === "message") //&&  x.from === sender - to be replaced with different senders
          )
          .map((x) => (
            <Box
              className={classes.innerMessage}
              style={{
                background:
                  (!!participantOnly && x.from === "researcher") || (!participantOnly && x.from === "participant")
                    ? "#F6F6F6"
                    : "#5784EE",
                marginLeft:
                  (!!participantOnly && x.from === "researcher") || (!participantOnly && x.from === "participant")
                    ? ""
                    : "10%",
                marginRight:
                  (!!participantOnly && x.from === "researcher") || (!participantOnly && x.from === "participant")
                    ? "10%"
                    : "",
                borderRadius:
                  (!!participantOnly && x.from === "researcher") || (!participantOnly && x.from === "participant")
                    ? "0px 20px 20px 20px"
                    : "20px 0px 20px 20px",
                color:
                  (!!participantOnly && x.from === "researcher") || (!participantOnly && x.from === "participant")
                    ? "rgba(0, 0, 0, 0.75)"
                    : "white",
              }}
            >
              <Typography>{x.text}</Typography>
            </Box>
          ))}

        <Divider />
        <Box my={2} display="flex" className={classes.composeMsg}>
          <Box width="100%" className={classes.composeTextarea}>
            <TextareaAutosize
              placeholder={t("text")}
              value={currentMessage || ""}
              onChange={(event) => setCurrentMessage(event.target.value)}
              style={{ display: addMsg ? "block" : "none" }}
            />
          </Box>
          <Box flexShrink={1}>
            <IconButton
              style={{ display: addMsg ? "block" : "none" }}
              edge="end"
              aria-label="send"
              onClick={() => sendMessage(msgOpen)}
              onMouseDown={(event) => event.preventDefault()}
            >
              <Icon>send</Icon>
            </IconButton>
          </Box>
          <AddCircleOutlineIcon style={{ display: !addMsg ? "block" : "none" }} onClick={() => setAddMsg(true)} />
        </Box>
      </Box>
    )
  }

  if (msgOpen) {
    return (
      <Container>
        <Box>{messageSection(0)}</Box>
      </Container>
    )
  } else {
    return (
      <Container className={classes.containerWidth}>
        <Box>
          {getMessages().filter(
            (x) =>
              x.type === "message" &&
              ((!!participantOnly && x.from === "researcher") || (!participantOnly && x.from === "participant"))
          ).length > 0 ? (
            getMessages()
              .filter(
                (x) =>
                  x.type === "message" &&
                  ((!!participantOnly && x.from === "researcher") || (!participantOnly && x.from === "participant"))
              )
              .map((x) => (
                <Box
                  border={0}
                  className={classes.conversationStyle}
                  mx={2}
                  onClick={() => {
                    refreshMessages()
                    setSender(x.from)
                    setOpen(true)
                  }}
                  style={{
                    background: x.status === 0 ? "#F7F7F7" : "#FFFFFF",
                    border: x.status === 0 ? "0" : "1px solid #C6C6C6",
                  }}
                >
                  <Grid container>
                    <Grid item xs>
                      <Typography variant="h6" style={{ fontWeight: x.status === 0 ? "bold" : "normal" }}>
                        {x.from}
                      </Typography>
                    </Grid>
                    <Grid item xs className={classes.conversationtime} justify="space-between">
                      <Typography align="right">{duration(new Date(x.date || 0))}</Typography>
                    </Grid>
                  </Grid>
                  <Box width={1}>
                    <Typography>{x.text}</Typography>
                  </Box>
                </Box>
              ))[0]
          ) : (
            <Box style={{ marginTop: "20px" }}>{messageSection(1)}</Box>
          )}
        </Box>

        <ResponsiveDialog
          transient={false}
          animate
          fullScreen
          open={open}
          onClose={() => {
            setOpen(false)
          }}
        >
          <AppBar position="static" className={classes.inlineHeader}>
            <Toolbar className={classes.toolbardashboard}>
              <Container maxWidth={false} className={classes.thumbContainer}>
                <IconButton onClick={() => setOpen(false)} color="default" aria-label="Menu">
                  <Icon>arrow_back</Icon>
                </IconButton>

                <Typography
                  variant="h5"
                  style={{
                    marginLeft: supportsSidebar ? 0 : undefined,
                  }}
                >
                  {sender}
                </Typography>
              </Container>
            </Toolbar>
          </AppBar>
          <Container className={classes.containerWidth}>
            <Box px={2} style={{ marginTop: "20px" }}>
              {messageSection(1)}
            </Box>
          </Container>
        </ResponsiveDialog>
      </Container>
    )
  }
}
