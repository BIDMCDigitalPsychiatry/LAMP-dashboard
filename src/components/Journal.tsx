// Core Imports
import React, { useEffect, useState } from "react"
import { Typography, makeStyles, Box, Grid, Container } from "@material-ui/core"
import WeekView from "./WeekView"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: 20,
  },
  addicon: { float: "left", color: "#E46759" },
  likebtn: {
    fontStyle: "italic",
    padding: 6,
    margin: "0 5px",
    "& label": {
      position: "absolute",
      bottom: -18,
      fontSize: 12,
    },
  },
  dialogtitle: { padding: 0 },
  active: {
    background: "#FFAC98",
  },
  linkButton: {
    padding: "15px 25px 15px 25px",
  },
  journalHeader: {
    "& h5": {
      fontWeight: 600,
      fontSize: 16,
      color: "rgba(0, 0, 0, 0.75)",
      marginLeft: 15,
    },
  },
  dialogueContent: {
    padding: "10px 20px 35px 20px",
    textAlign: "center",
    "& h4": { fontSize: 25, fontWeight: 600, marginBottom: 15 },
    "& p": { fontSize: 16, fontWeight: 600, color: "rgba(0, 0, 0, 0.75)", lineHeight: "19px" },
  },
  dialogueStyle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButton: {
    color: theme.palette.grey[500],
  },
  addbtnmain: {
    maxWidth: 24,
    "& button": { padding: 0 },
  },
  journalhd: {
    margin: "40px 0 15px 0",
  },
  journalStyle: {
    background: "linear-gradient(0deg, #ECF4FF, #ECF4FF)",
    borderRadius: "10px",
    padding: "5px 20px 30px 20px",
    textAlign: "justify",
    marginBottom: 20,
    "& span": {
      color: "rgba(0, 0, 0, 0.4)",
      fontSize: "12px",
      lineHeight: "40px",
    },
  },
  journalday: { color: "rgba(0, 0, 0, 0.4)", marginBottom: 15, marginTop: 25 },
  journalHistory: {
    marginTop: 30,
  },
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
  const [jounalValue, setJounalValue] = useState(null)
  const [open, setOpen] = useState(true)

  const getDateString = (date: Date) => {
    var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    var monthname = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return weekday[date.getDay()] + " " + monthname[date.getMonth()] + ", " + date.getDate()
  }

  const [jounalDate, setJounalDate] = useState(getDateString(new Date()))

  useEffect(() => {
    setJournals(getJournals())
  }, [])

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
    <div className={classes.root}>
      <WeekView type="journal" />
      <Container className={classes.journalHistory}>{getContent()}</Container>
    </div>
  )
}
