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
  InputAdornment,
  TextField,
  Tooltip,
  InputBase,
} from "@material-ui/core"
import ResponsiveDialog from "./ResponsiveDialog"
import useInterval from "./useInterval"
import LAMP from "lamp-core"
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline"

const useStyles = makeStyles((theme) => ({
  addicon: { float: "left", color: "#E46759" },
  conversationStyle: {
    borderRadius: "10px",
    padding: "12px 20px 17px 20px",
    textAlign: "justify",
    marginTop: 20,

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
    "& input": { padding: 0, color: "#4C66D6" },
    "& svg": { color: "#4C66D6" },
    "& button": { padding: "0px 15px", color: "#4C66D6" },
  },
  toolbardashboard: {
    minHeight: 65,
    "& h5": {
      color: "rgba(0, 0, 0, 0.75)",
      textAlign: "center",
      fontWeight: "600",
      fontSize: 18,
      width: "100%",
    },
  },
  backbtn: { paddingLeft: 0, paddingRight: 0 },
  conversationtime: { maxWidth: 75, "& p": { color: "rgba(0, 0, 0, 0.4)", fontSize: 12, lineHeight: "28px" } },
  inlineHeader: {
    background: "#FFFFFF",
    boxShadow: "none",

    "& h5": { fontSize: 25, paddingLeft: 20, color: "rgba(0, 0, 0, 0.75)", fontWeight: 600 },
  },
}))

const duration = (date: Date) => {
  var delta = Math.abs(date.getTime() - new Date().getTime()) / 1000

  var days = Math.floor(delta / 86400)
  delta -= days * 86400
  if (days > 0) return days + (days > 1 ? " days" : "day")

  var hours = Math.floor(delta / 3600) % 24
  if (hours > 0) return hours + (hours > 1 ? " hrs" : "hr")

  delta -= hours * 3600
  var minutes = Math.floor(delta / 60) % 60
  if (minutes > 0) return minutes + (minutes > 1 ? " mins" : "min")

  delta -= minutes * 60
  var seconds = Math.floor(delta % 60)
  return seconds + (seconds > 1 ? "sec" : "secs")
}

export default function Conversations({
  refresh,
  participant,
  participantOnly,
  privateOnly,
  expandHeight,
  ...props
}: {
  privateOnly?: boolean
  expandHeight?: boolean
  participant?: string
  participantOnly?: boolean
  refresh?: boolean
  style?: any
}) {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [conversations, setConversations] = useState({})
  const [sender, setSender] = useState(null)
  const [lastDate, setLastDate] = useState(null)
  const [currentMessage, setCurrentMessage] = useState<string>()
  const [addMsg, setAddMsg] = useState(false)
  useInterval(
    () => {
      refreshMessages()
    },
    !!refresh ? 10 * 1000 /* 10s */ : null,
    true
  )
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
    console.log(x)
    return !Array.isArray(x) ? [] : x
  }

  const sendMessage = async () => {
    let msg = (currentMessage || "").trim()
    if (msg.length === 0 || !participant) return

    await refreshMessages()
    let all = getMessages()
    all.push({
      from: !!participantOnly ? "participant" : "researcher",
      type: "message",
      date: new Date(),
      text: msg,
    })
    LAMP.Type.setAttachment(participant, "me", "lamp.messaging", all)
    setCurrentMessage(undefined)
    setAddMsg(false)
    setConversations({ ...(conversations || {}), [participant]: all })
  }

  const getDateString = (date: Date) => {
    var weekday = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday")
    var monthname = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec")
    return weekday[date.getDay()] + " " + monthname[date.getMonth()] + ", " + date.getDate()
  }

  return (
    <Container style={{ marginTop: "5%" }}>
      <Box>
        {
          getMessages()
            .filter(
              (x) =>
                (x.type === "message" && !!participantOnly && x.from === "researcher") ||
                (!participantOnly && x.from === "participant")
            )
            .map((x) => (
              <Box
                border={0}
                className={classes.conversationStyle}
                onClick={() => {
                  refreshMessages()
                  setSender(x.from)
                  setLastDate(new Date(x.date || 0))
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
        }
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
            <IconButton onClick={() => setOpen(false)} color="default" className={classes.backbtn} aria-label="Menu">
              <Icon>arrow_back</Icon>
            </IconButton>
          </Toolbar>
          <Typography variant="h5">{sender}</Typography>
        </AppBar>
        <Box px={3} style={{ marginTop: "5%" }}>
          {getMessages()
            .filter(
              (x) => x.type === "message" //&&  x.from === sender - to be replaced with different senders
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
          {/* {lastDate && (
            <Typography variant="caption" style={{ color: "rgba(0, 0, 0, 0.4)" }}>
              {getDateString(lastDate)}
            </Typography>
          )} */}
          {/* <TextField
            label="Send a message"
            style={{ margin: 16, paddingRight: 32 }}
            placeholder="Message..."
            value={currentMessage || ""}
            onChange={(event) => setCurrentMessage(event.target.value)}
            // helperText={`Your ${!!participantOnly ? "clinician" : "patient"} will ${
            //   (messageTab || 0) === 0
            //     ? "be able to see your messages when they log in."
            //     : "not be able to see this message."
            // }`}
            margin="normal"
            variant="outlined"
            multiline
            fullWidth
            rowsMax="15"
            InputProps={{
              endAdornment: [
                <InputAdornment key={"end"} position="end">
                  <Tooltip title="Send Message">
                    <IconButton
                      edge="end"
                      aria-label="send"
                      onClick={sendMessage}
                      onMouseDown={(event) => event.preventDefault()}
                    >
                      <Icon>send</Icon>
                    </IconButton>
                  </Tooltip>
                </InputAdornment>,
              ],
            }}
            InputLabelProps={{ shrink: true }}
          /> */}

          <Box display="flex" className={classes.composeMsg}>
            <Box width="100%">
              <InputBase
                placeholder="text"
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
                onClick={sendMessage}
                onMouseDown={(event) => event.preventDefault()}
              >
                <Icon>send</Icon>
              </IconButton>
            </Box>
            <AddCircleOutlineIcon style={{ display: !addMsg ? "block" : "none" }} onClick={() => setAddMsg(true)} />
          </Box>
        </Box>
      </ResponsiveDialog>
    </Container>
  )
}
