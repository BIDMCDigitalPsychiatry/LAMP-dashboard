// Core Imports
import React, { useEffect, useState } from "react"
import {
  Typography,
  makeStyles,
  Box,
  Card,
  Grid,
  IconButton,
  TextField,
  Button,
  FormControl,
  Container,
  AppBar,
  Toolbar,
  Icon,
} from "@material-ui/core"
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline"
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

const getConversations = () => {
  let data = [
    {
      date: "Jul 21, 2020 11:13:00",
      status: 0,
      sender: "Dr. Emily Busch",
      messages: [
        {
          message:
            "I’ve got the results from your recent tests. Please contact the office to schedule a phone consultation and we’ll go over the details.",
          sendType: 0,
        },
        { message: "Thanks so much Dr. Busch. Looking forward to hearing the results", sendType: 1 },
        {
          message:
            "I’ve got the results from your recent tests. Please contact the office to schedule a phone consultation and we’ll go over the details.",
          sendType: 0,
        },
      ],
    },
    {
      date: "Jul 21, 2020 10:10:00",
      status: 0,
      sender: "Beth Jones, PhD",
      messages: [
        {
          message:
            "I’ve got the results from your recent tests. Please contact the office to schedule a phone consultation and we’ll go over the details.",
          sendType: 0,
        },
        { message: "Thanks so much Dr. Busch. Looking forward to hearing the results", sendType: 1 },
      ],
    },
    {
      date: "Jul 20, 2020 11:13:00",
      status: 1,
      sender: "Dr. Frank Zimmerman",
      messages: [
        {
          message: "Hi Margeret, just checking in to see how your week is going? Anything you want to discuss.",
          sendType: 0,
        },
      ],
    },
    {
      date: "Jul 19, 2020 11:13:00",
      status: 1,
      sender: "Joe, Paula, me",
      messages: [{ message: "I’d love to get some fresh air this weekend— hiking sounds great!.", sendType: 0 }],
    },
  ]
  return data
}

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
  var seconds = delta % 60
  return seconds + (seconds > 1 ? "sec" : "secs")
}

export default function Conversations({ ...props }) {
  const classes = useStyles()
  const [conversations, setConversations] = useState([])
  const [open, setOpen] = useState(false)
  const [conversation, setConversation] = useState("")
  const [sender, setSender] = useState(null)
  const [details, setDetails] = useState(null)

  useEffect(() => {
    setConversations(getConversations())
  }, [])

  const getDateString = (date: Date) => {
    var weekday = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday")
    var monthname = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec")
    return weekday[date.getDay()] + " " + monthname[date.getMonth()] + ", " + date.getDate()
  }

  const getDetails = (index: string) => {
    let content = []
    Object.keys(conversations).forEach((key) => {
      if (key == index) {
        Object.keys(conversations[key].messages).forEach((msgIndex) => {
          content.push(
            <Box
              className={classes.innerMessage}
              style={{
                background: conversations[key].messages[msgIndex].sendType === 0 ? "#F6F6F6" : "#5784EE",
                marginLeft: conversations[key].messages[msgIndex].sendType === 0 ? "" : "10%",
                marginRight: conversations[key].messages[msgIndex].sendType === 0 ? "10%" : "",
                borderRadius:
                  conversations[key].messages[msgIndex].sendType === 0 ? "0px 20px 20px 20px" : "20px 0px 20px 20px",
                color: conversations[key].messages[msgIndex].sendType === 0 ? "rgba(0, 0, 0, 0.75)" : "white",
              }}
            >
              <Typography>{conversations[key].messages[msgIndex].message}</Typography>
            </Box>
          )
          setSender(conversations[key].sender)
        })
      }
    })
    setDetails(content)
    setOpen(true)
  }

  const getContent = () => {
    let content = []
    Object.keys(conversations).forEach((key) => {
      const msg = conversations[key].messages[0].message
      content.push(
        <Box
          border={0}
          className={classes.conversationStyle}
          onClick={() => getDetails(key)}
          style={{
            background: conversations[key].status === 0 ? "#F7F7F7" : "#FFFFFF",
            border: conversations[key].status === 0 ? "0" : "1px solid #C6C6C6",
          }}
        >
          <Grid container>
            <Grid item xs>
              <Typography variant="h6" style={{ fontWeight: conversations[key].status === 0 ? "bold" : "normal" }}>
                {conversations[key].sender}
              </Typography>
            </Grid>
            <Grid item xs className={classes.conversationtime} justify="space-between">
              <Typography align="right">{duration(new Date(conversations[key].date))}</Typography>
            </Grid>
          </Grid>
          <Box width={1} pt={1}>
            <Typography>{msg}</Typography>
          </Box>
        </Box>
      )
    })

    return content
  }

  return (
    <Container style={{ marginTop: "5%" }}>
      <Box>{getContent}</Box>
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
          {details}
          <Typography variant="caption" style={{ color: "rgba(0, 0, 0, 0.4)" }}>
            Aug 19: 3:00pm
          </Typography>
        </Box>
      </ResponsiveDialog>
    </Container>
  )
}
