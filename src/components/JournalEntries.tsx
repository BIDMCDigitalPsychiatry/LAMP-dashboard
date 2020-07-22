// Core Imports
import React, { useEffect, useState } from "react"
import {
  Typography,
  makeStyles,
  Box,
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

  journalHeader: {
    "& h5": {
      fontWeight: 600,
      fontSize: 16,
      color: "rgba(0, 0, 0, 0.75)",
      marginLeft: 15,
    },
  },
  addbtnmain: {
    maxWidth: 24,
    "& button": { padding: 0 },
  },
  journalhd: {
    margin: "40px 0 15px 0",
  },
  journalStyle: {
    background: "linear-gradient(0deg, #FBF1EF, #FBF1EF)",
    borderRadius: "10px",
    padding: "0px 20px 20px 20px",
    textAlign: "justify",
    marginBottom: 20,
    "& span": {
      color: "rgba(0, 0, 0, 0.4)",
      fontSize: "12px",
      lineHeight: "40px",
    },
  },
  textAreaControl: {
    width: "100%",
    marginTop: 35,

    borderRadius: 10,
    "& p": { position: "absolute", bottom: 15, right: 0 },
  },
  textArea: {
    borderRadius: "10px",
    "& fieldset": { borderWidth: 0, outline: 0 },
    "& textarea": { lineHeight: "24px" },
  },
  textfieldwrapper: {},
  btnpeach: {
    background: "#FFAC98",
    padding: "15px 25px 15px 25px",
    borderRadius: "40px",
    minWidth: "200px",
    boxShadow: " 0px 10px 15px rgba(255, 172, 152, 0.25)",
    lineHeight: "22px",
    display: "inline-block",
    textTransform: "capitalize",
    fontSize: "16px",
    color: "rgba(0, 0, 0, 0.75)",
    fontWeight: "bold",
    "&:hover": {
      boxShadow:
        "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
    },
  },
  journalday: { color: "rgba(0, 0, 0, 0.4)", marginBottom: 15, marginTop: 25 },
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
  todaydate: { paddingLeft: 13, color: "rgba(0, 0, 0, 0.4)" },
}))

const getJournals = () => {
  let data = [
    {
      "This Week": [
        {
          date: "Fri Jul 04, 08:34am",
          text:
            "Feeling generally good; slept well and had a good breakfast. I’m at my full-time job and writing to my Talkspace therapist about not going to the grocery store because I have no idea how to feed myself and the whole thing is overwhelming. I’ve already checked on my cats via security camera twice — no catastrophes yet. I check on them at least every hour, making sure they’re safe, that my apartment didn’t burn down.",
        },
        {
          date: "Wed Jul 05, 10:50am",
          text:
            "I’m at my full-time job and writing to my Talkspace therapist about not going to the grocery store because I have no idea how to feed myself and the whole thing is overwhelming. I’ve already checked on my cats via security camera twice — no catastrophes yet. I check on them at least every hour, making sure they’re safe, that my apartment didn’t burn down.",
        },
        {
          date: "Mon Jul 06, 05:30pm",
          text:
            "Feeling generally good; slept well and had a good breakfast. Woke up thinking about.I’m at my full-time job and writing to my Talkspace therapist about not going to the grocery store because I have no idea how to feed myself and the whole thing is overwhelming. I’ve already checked on my cats via security camera twice — no catastrophes yet. I check on them at least every hour, making sure they’re safe, that my apartment didn’t burn down.",
        },
      ],
    },
    {
      "This Month": [
        {
          date: "Fri Jul 04, 08:34am",
          text:
            "I’m at my full-time job and writing to my Talkspace therapist about not going to the grocery store because I have no idea how to feed myself and the whole thing is overwhelming. I’ve already checked on my cats via security camera twice — no catastrophes yet. I check on them at least every hour, making sure they’re safe, that my apartment didn’t burn down.",
        },
        {
          date: "Wed Jul 05, 10:50am",
          text:
            "I’m at my full-time job and writing to my Talkspace therapist about not going to the grocery store because I have no idea how to feed myself and the whole thing is overwhelming. I’ve already checked on my cats via security camera twice — no catastrophes yet. I check on them at least every hour, making sure they’re safe, that my apartment didn’t burn down.",
        },
        {
          date: "Mon Jul 06, 05:30pm",
          text:
            "I’m at my full-time job and writing to my Talkspace therapist about not going to the grocery store because I have no idea how to feed myself and the whole thing is overwhelming. I’ve already checked on my cats via security camera twice — no catastrophes yet. I check on them at least every hour, making sure they’re safe, that my apartment didn’t burn down.",
        },
      ],
    },
  ]
  return data
}

export default function JournalEntries({ ...props }) {
  const classes = useStyles()
  const [journals, setJournals] = useState([])
  const [open, setOpen] = useState(false)
  const [journalValue, setJounalValue] = useState("")
  const [jounalDate, setJounalDate] = useState(null)

  useEffect(() => {
    setJournals(getJournals())
  }, [])

  const getDateString = (date: Date) => {
    var weekday = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday")
    var monthname = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec")
    return weekday[date.getDay()] + " " + monthname[date.getMonth()] + ", " + date.getDate()
  }

  const handleOpen = (text: string, date?: string) => {
    if (text) setJounalValue(text)
    date = typeof date == "undefined" ? getDateString(new Date()) : date
    setJounalDate(date)
    setOpen(true)
  }

  const getContent = () => {
    let content = []

    Object.keys(journals).forEach((index) => {
      let eachData = []
      Object.keys(journals[index]).forEach((key) => {
        eachData.push(
          <Box fontWeight="fontWeightBold" className={classes.journalday}>
            {key}
          </Box>
        )
        Object.keys(journals[index][key]).forEach((keyIndex) => {
          let fullText = journals[index][key][keyIndex].text
          let text = fullText.substring(0, 80)
          text = text.substr(0, Math.min(text.length, text.lastIndexOf(" ")))
          eachData.push(
            <Grid item>
              <Box
                className={classes.journalStyle}
                onClick={() => handleOpen(fullText, journals[index][key][keyIndex].date)}
              >
                <Typography variant="caption" gutterBottom>
                  {journals[index][key][keyIndex].date}
                </Typography>
                <Typography variant="body2" component="p">
                  {text}...
                </Typography>
              </Box>
            </Grid>
          )
        })
      })
      content.push(<Box boxShadow={0}>{eachData}</Box>)
    })
    return content
  }

  return (
    <Container>
      <Grid container xs={12} spacing={0} className={classes.journalhd} onClick={() => handleOpen("")}>
        <Grid item xs className={classes.addbtnmain}>
          <IconButton>
            <AddCircleOutlineIcon className={classes.addicon} />
          </IconButton>
        </Grid>
        <Grid item xs className={classes.journalHeader}>
          <Typography variant="h5">Add a new journal entry </Typography>
        </Grid>
      </Grid>
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
        <AppBar position="static" style={{ background: "#FBF1EF", boxShadow: "none" }}>
          <Toolbar className={classes.toolbardashboard}>
            <IconButton onClick={() => setOpen(false)} color="default" className={classes.backbtn} aria-label="Menu">
              <Icon>arrow_back</Icon>
            </IconButton>
            <Typography variant="h5">New journal entry</Typography>
          </Toolbar>
        </AppBar>

        <Box className={classes.textfieldwrapper} px={3}>
          <FormControl
            component="fieldset"
            classes={{
              root: classes.textAreaControl,
            }}
          >
            <Typography variant="caption" className={classes.todaydate}>
              {jounalDate}
            </Typography>
            <TextField
              id="standard-multiline-flexible"
              multiline
              rows={10}
              variant="outlined"
              value={journalValue}
              onChange={(event) => setJounalValue(event.target.value)}
              classes={{ root: classes.textArea }}
            />
            <Box textAlign="center" mt={3}>
              <Button className={classes.btnpeach}>Submit</Button>
            </Box>
          </FormControl>
        </Box>
      </ResponsiveDialog>
    </Container>
  )
}
