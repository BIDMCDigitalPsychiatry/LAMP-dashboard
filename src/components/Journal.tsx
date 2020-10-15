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

const getJournals = (journals: any) => {
  let weekdays = getWeekDates()
  let weekData = journals
    .filter(
      (journal: any) =>
        new Date(journal.timestamp).getMonth() === new Date().getMonth() &&
        weekdays.indexOf(new Date(journal.timestamp).getDate()) > -1
    )
    .map((journal) => journal)
  let monthData = journals
    .filter((journal: any) => new Date(journal.timestamp).getMonth() === new Date().getMonth())
    .map((journal) => journal)
  let others = journals
    .filter((journal: any) => new Date(journal.timestamp).getMonth() !== new Date().getMonth())
    .map((journal) => journal)

  let data = {
    "This week": weekData,
    "This month": monthData,
    Others: others,
    All: journals,
  }
  return data
}

export default function Journals({ participant, selectedEvents, ...props }) {
  const classes = useStyles()
  const [journals, setJournals] = useState([])
  const [allJournals, setAllJournals] = useState(null)
  const [open, setOpen] = useState(true)
  const [selectedDates, setSelectedDates] = useState()
  const [date, setDate] = useState(null)
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
    setJournals(selectedEvents)
    setAllJournals(getJournals(selectedEvents))
    setSelectedDates(selectedEvents.map((journal) => new Date(journal.timestamp).toLocaleDateString()))
  }, [])

  const getContent = (date: Date) => {
    setDate(date)
  }

  return (
    <div className={classes.root}>
      <WeekView type="journal" onSelect={getContent} daysWithdata={selectedDates} />
      <Container>
        {date !== null ? (
          <Container>
            <Container className={classes.journalHistory}>
              <Box fontWeight="fontWeightBold" className={classes.journalday}>
                This date
              </Box>
              {journals
                .filter(
                  (journal) => new Date(journal.timestamp).toLocaleDateString() === new Date(date).toLocaleDateString()
                )
                .map((journal) => (
                  <Box boxShadow={0}>
                    <Grid item>
                      <Box
                        className={classes.journalStyle}
                        // onClick={() => handleOpen(fullText, journals[index][key][keyIndex].date)}
                      >
                        <Typography variant="caption" gutterBottom>
                          {getDateString(new Date(journal.timestamp))}
                        </Typography>
                        <Typography variant="body2" component="p">
                          {journal.static_data.journalText.substring(0, 80).length ===
                          journal.static_data.journalText.length
                            ? journal.static_data.journalText
                            : journal.static_data.journalText
                                .substring(0, 80)
                                .substr(
                                  0,
                                  Math.min(
                                    journal.static_data.journalText.substring(0, 80).length,
                                    journal.static_data.journalText.substring(0, 80).lastIndexOf(" ")
                                  )
                                )}
                          ...
                        </Typography>
                      </Box>
                    </Grid>
                  </Box>
                ))}
            </Container>
          </Container>
        ) : (
          <div>
            {allJournals !== null &&
              Object.keys(allJournals).map((each) => (
                <Container>
                  {allJournals[each].length > 0 && (
                    <Container className={classes.journalHistory}>
                      <Box fontWeight="fontWeightBold" className={classes.journalday}>
                        {each}
                      </Box>
                      {allJournals[each].map((journal) => (
                        <Box boxShadow={0}>
                          <Grid item>
                            <Box
                              className={classes.journalStyle}
                              // onClick={() => handleOpen(fullText, journals[index][key][keyIndex].date)}
                            >
                              <Typography variant="caption" gutterBottom>
                                {getDateString(new Date(journal.timestamp))}
                              </Typography>
                              <Typography variant="body2" component="p">
                                {journal.static_data.journalText.substring(0, 80).length ===
                                journal.static_data.journalText.length
                                  ? journal.static_data.journalText
                                  : journal.static_data.journalText
                                      .substring(0, 80)
                                      .substr(
                                        0,
                                        Math.min(
                                          journal.static_data.journalText.substring(0, 80).length,
                                          journal.static_data.journalText.substring(0, 80).lastIndexOf(" ")
                                        )
                                      )}
                                ...
                              </Typography>
                            </Box>
                          </Grid>
                        </Box>
                      ))}
                    </Container>
                  )}
                </Container>
              ))}
          </div>
        )}
      </Container>
    </div>
  )
}
