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
  return journals
  // TODO - Week/month wise data
  // let weekdays = getWeekDates()
  // console.log(journals)
  // let weekData = journals.filter((journal:any) => weekdays.indexOf(journal.datetime) > -1).map((journal) => journal)

  // console.log(data)
}

// const getJournals = () => {
//   let data = [
//     {
//       "This Week": [
//         {
//           date: "Fri Jul 04, 08:34am",
//           text:
//             "Feeling generally good; slept well and had a good breakfast. I’m at my full-time job and writing to my Talkspace therapist about not going to the grocery store because I have no idea how to feed myself and the whole thing is overwhelming. I’ve already checked on my cats via security camera twice — no catastrophes yet. I check on them at least every hour, making sure they’re safe, that my apartment didn’t burn down.",
//         },
//         {
//           date: "Wed Jul 05, 10:50am",
//           text:
//             "I’m at my full-time job and writing to my Talkspace therapist about not going to the grocery store because I have no idea how to feed myself and the whole thing is overwhelming. I’ve already checked on my cats via security camera twice — no catastrophes yet. I check on them at least every hour, making sure they’re safe, that my apartment didn’t burn down.",
//         },
//         {
//           date: "Mon Jul 06, 05:30pm",
//           text:
//             "Feeling generally good; slept well and had a good breakfast. Woke up thinking about.I’m at my full-time job and writing to my Talkspace therapist about not going to the grocery store because I have no idea how to feed myself and the whole thing is overwhelming. I’ve already checked on my cats via security camera twice — no catastrophes yet. I check on them at least every hour, making sure they’re safe, that my apartment didn’t burn down.",
//         },
//       ],
//     },
//     {
//       "This Month": [
//         {
//           date: "Fri Jul 04, 08:34am",
//           text:
//             "I’m at my full-time job and writing to my Talkspace therapist about not going to the grocery store because I have no idea how to feed myself and the whole thing is overwhelming. I’ve already checked on my cats via security camera twice — no catastrophes yet. I check on them at least every hour, making sure they’re safe, that my apartment didn’t burn down.",
//         },
//         {
//           date: "Wed Jul 05, 10:50am",
//           text:
//             "I’m at my full-time job and writing to my Talkspace therapist about not going to the grocery store because I have no idea how to feed myself and the whole thing is overwhelming. I’ve already checked on my cats via security camera twice — no catastrophes yet. I check on them at least every hour, making sure they’re safe, that my apartment didn’t burn down.",
//         },
//         {
//           date: "Mon Jul 06, 05:30pm",
//           text:
//             "I’m at my full-time job and writing to my Talkspace therapist about not going to the grocery store because I have no idea how to feed myself and the whole thing is overwhelming. I’ve already checked on my cats via security camera twice — no catastrophes yet. I check on them at least every hour, making sure they’re safe, that my apartment didn’t burn down.",
//         },
//       ],
//     },
//   ]
//   return data
// }

export default function Journals({ participant, ...props }) {
  const classes = useStyles()
  const [journals, setJournals] = useState([])
  const [journal, setJournal] = useState(null)
  const [open, setOpen] = useState(true)

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
      setJournal(
        journals
          .filter((journal: any) => new Date(journal.datetime).toLocaleDateString() === new Date().toLocaleDateString())
          .map((journal) => journal)
      )
      setJournals(journals)
    })()
  }, [])

  const getContent = (date: Date) => {
    setJournal(
      journals
        .filter(
          (journal: any) => new Date(journal.datetime).toLocaleDateString() === new Date(date).toLocaleDateString()
        )
        .map((journal) => journal)
    )
  }

  return (
    <div className={classes.root}>
      <WeekView type="journal" onselect={getContent} />
      <Container className={classes.journalHistory}>
        {journal !== null
          ? journal.map((j) => (
              <Box boxShadow={0}>
                <Grid item>
                  <Box
                    className={classes.journalStyle}
                    // onClick={() => handleOpen(fullText, j.datetime)}
                  >
                    <Typography variant="caption" gutterBottom>
                      {getDateString(j.datetime)}
                    </Typography>
                    <Typography variant="body2" component="p">
                      {j.journalText}...
                    </Typography>
                  </Box>
                </Grid>
              </Box>
            ))
          : null}
      </Container>
    </div>
  )
}
