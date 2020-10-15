// Core Imports
import React, { useEffect, useState } from "react"
import { Typography, makeStyles, Box, Grid, Container } from "@material-ui/core"
import WeekView from "./WeekView"
import LAMP from "lamp-core"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: 20,
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

function getWeekDates() {
  let curr = new Date()
  let week = []
  let first = curr.getDate() - curr.getDay() + 7
  let day = new Date(curr.setDate(first))
  week.push(day.getDate())
  curr = new Date()
  for (let i = 1; i < 7; i++) {
    first = curr.getDate() - curr.getDay() + i
    let day = new Date(curr.setDate(first))
    week.push(day.getDate())
  }
  return week
}

const getJournals = async (participantId) => {
  let journals = (
    await Promise.all(
      [participantId || ""].map(async (x) => [x, await LAMP.Type.getAttachment(x, "lamp.journals").catch((e) => [])])
    )
  )
    .filter((x: any) => x[1].message !== "404.object-not-found")
    .map((x: any) => x[1].data)[0]

  let weekdays = getWeekDates()
  let weekData = journals
    .filter(
      (journal: any) =>
        new Date(journal.datetime).getMonth() === new Date().getMonth() &&
        weekdays.indexOf(new Date(journal.datetime).getDate()) > -1
    )
    .map((journal) => journal)
  let monthData = journals
    .filter((journal: any) => new Date(journal.datetime).getMonth() === new Date().getMonth())
    .map((journal) => journal)
  let others = journals
    .filter((journal: any) => new Date(journal.datetime).getMonth() !== new Date().getMonth())
    .map((journal) => journal)
  let data = [
    {
      "This week": weekData,
      "This month": monthData,
      Others: others,
      All: journals,
    },
  ]
  return data
}

export default function Journals({ participant, ...props }) {
  const classes = useStyles()
  const [journals, setJournals] = useState([])
  const [allJournals, setAllJournals] = useState(null)
  const [open, setOpen] = useState(true)
  const [selectedDates, setSelectedDates] = useState()

  const getDateString = (date: Date) => {
    var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    var monthname = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return (
      weekday[date.getDay()] +
      " " +
      monthname[date.getMonth()] +
      ", " +
      date.getDate() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    )
  }

  useEffect(() => {
    ;(async () => {
      let journals = await getJournals(participant.id)
      setJournals(journals)
      setAllJournals(journals[0]["All"])
      setSelectedDates(journals[0]["All"].map((journal) => new Date(journal.datetime).toLocaleDateString()))
    })()
  }, [])

  const getContent = (date: Date) => {
    let data = allJournals
      .filter((journal: any) => new Date(journal.datetime).toLocaleDateString() == new Date(date).toLocaleDateString())
      .map((journal) => journal)
    setJournals([{ "This date": data }])
  }
  const getData = () => {
    let content = []
    Object.keys(journals).forEach((index) => {
      let eachData = []
      Object.keys(journals[index]).forEach((key) => {
        if (journals[index][key].length > 0 && key !== "All") {
          eachData.push(
            <Box fontWeight="fontWeightBold" className={classes.journalday}>
              {key}
            </Box>
          )
          Object.keys(journals[index][key]).forEach((keyIndex) => {
            let fullText = journals[index][key][keyIndex].journalText
            let text = fullText.substring(0, 80)
            if (text.length != fullText.length) {
              text = text.substr(0, Math.min(text.length, text.lastIndexOf(" ")))
            }
            eachData.push(
              <Grid item>
                <Box
                  className={classes.journalStyle}
                  // onClick={() => handleOpen(fullText, journals[index][key][keyIndex].date)}
                >
                  <Typography variant="caption" gutterBottom>
                    {getDateString(new Date(journals[index][key][keyIndex].datetime))}
                  </Typography>
                  <Typography variant="body2" component="p">
                    {text}...
                  </Typography>
                </Box>
              </Grid>
            )
          })
        }
      })
      content.push(<Box boxShadow={0}>{eachData}</Box>)
    })
    return content
  }
  return (
    <div className={classes.root}>
      <WeekView type="journal" onSelect={getContent} daysWithdata={selectedDates} />
      <Container className={classes.journalHistory}>{getData()}</Container>
    </div>
  )
}
