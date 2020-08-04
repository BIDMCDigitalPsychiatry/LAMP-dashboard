// Core Imports
import React, { useState } from "react"
import {
  Avatar,
  Box,
  makeStyles,
  TextField,
  Grid,
  Divider,
  Icon,
  IconButton,
  Tooltip,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Typography,
  AppBar,
  Toolbar,
} from "@material-ui/core"

// Local Imports
import LAMP from "lamp-core"
import useInterval from "./useInterval"
import ResponsiveDialog from "./ResponsiveDialog"
const useStyles = makeStyles((theme) => ({
  addicon: { float: "left", color: "#E46759" },
  conversationStyle: {
    borderRadius: "10px",
    padding: "10px 20px 20px 20px",
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
    padding: "15px 20px 20px 20px",

    marginBottom: 20,

    "& span": {
      color: "rgba(0, 0, 0, 0.4)",
      fontSize: "12px",
      lineHeight: "40px",
    },
    "& p": { lineHeight: "20px", fontSize: 14 },
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

const capitalize = (x) => x.charAt(0).toUpperCase() + x.slice(1)

const duration = (date: Date) => {
  var delta = Math.abs(date.getTime() - new Date().getTime()) / 1000

  var days = Math.floor(delta / 86400)
  delta -= days * 86400
  if (days > 0) return Math.ceil(days) + (days > 1 ? " days" : "day")

  var hours = Math.floor(delta / 3600) % 24
  if (hours > 0) return Math.ceil(hours) + (hours > 1 ? " hrs" : "hr")

  delta -= hours * 3600
  var minutes = Math.floor(delta / 60) % 60
  if (minutes > 0) return Math.ceil(minutes) + (minutes > 1 ? " mins" : "min")

  delta -= minutes * 60
  var seconds = delta % 60
  return Math.ceil(seconds) + (seconds > 1 ? "sec" : "secs")
}

function MessageItem({ from, date, text, flipped, ...props }) {
  const classes = useStyles()
  return (
    <Box
      border={0}
      className={classes.conversationStyle}
      //onClick={() => getDetails(key)} - to be implemented
      style={{
        background: flipped ? "#F7F7F7" : "#FFFFFF",
        border: flipped ? "0" : "1px solid #C6C6C6",
      }}
    >
      <Grid container direction={flipped ? "row" : "row-reverse"} alignItems="flex-end">
        {/* <Grid item xs>
         <Typography variant="h6" style={{ fontWeight: flipped ? "bold" : "normal" }}>
            Sender
          </Typography> 
        </Grid> */}
        <Grid item xs className={classes.conversationtime} justify="space-between">
          <Typography align="right">{duration(new Date(date || 0))}</Typography>
        </Grid>
      </Grid>
      <Box width={1} pt={1}>
        <Typography>{text}</Typography>
      </Box>
    </Box>
  )
}

export default function Messages({
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
  const [messages, setMessages] = useState({})
  const [currentMessage, setCurrentMessage] = useState<string>()
  const [messageTab, setMessageTab] = useState(!!privateOnly ? 1 : 0)
  const theme = useTheme()
  const sm = useMediaQuery(theme.breakpoints.down("sm"))
  const [open, setOpen] = useState(false)
  const classes = useStyles()

  useInterval(
    () => {
      refreshMessages()
    },
    !!refresh ? 10 * 1000 /* 10s */ : null,
    true
  )

  const sendMessage = async () => {
    let msg = (currentMessage || "").trim()
    if (msg.length === 0 || !participant) return

    await refreshMessages()
    let all = getMessages()
    all.push({
      from: !!participantOnly ? "participant" : "researcher",
      type: (messageTab || 0) === 1 ? "note" : "message",
      date: new Date(),
      text: msg,
    })
    LAMP.Type.setAttachment(participant, "me", "lamp.messaging", all)
    setCurrentMessage(undefined)
    setMessages({ ...(messages || {}), [participant]: all })
  }

  const refreshMessages = async () => {
    console.log("Fetching messages...")
    setMessages(
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
    let x = (messages || {})[participant || ""] || []
    console.log(x)
    return !Array.isArray(x) ? [] : x
  }

  // FIXME: don't pass in props ie. functions!
  return (
    <Box {...props}>
      <Grid container direction="column">
        <Grid item>
          <Box>
            {getMessages()
              .filter((x) =>
                (messageTab || 0) === 0
                  ? x.type === "message"
                  : x.type === "note" && x.from === (!!participantOnly ? "participant" : "researcher")
              )
              .map((x) => (
                <MessageItem
                  {...x}
                  flipped={
                    (!!participantOnly && x.from === "researcher") || (!participantOnly && x.from === "participant")
                  }
                  key={JSON.stringify(x)}
                />
              ))}
          </Box>
          <Divider />
        </Grid>
        <Grid item>
          <TextField
            label="Send a message"
            style={{ margin: 16, paddingRight: 32 }}
            placeholder="Message..."
            value={currentMessage || ""}
            onChange={(event) => setCurrentMessage(event.target.value)}
            helperText={`Your ${!!participantOnly ? "clinician" : "patient"} will ${
              (messageTab || 0) === 0
                ? "be able to see your messages when they log in."
                : "not be able to see this message."
            }`}
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
          />
        </Grid>
      </Grid>
      {/* To be implemented - to show message details */}
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
          <Typography variant="h5">Sender</Typography>
        </AppBar>
        <Box px={3} style={{ marginTop: "5%" }}>
          {/* {details} */}
          <Typography variant="caption" style={{ color: "rgba(0, 0, 0, 0.4)" }}>
            Aug 19: 3:00pm
          </Typography>
        </Box>
      </ResponsiveDialog>
    </Box>
  )
}
