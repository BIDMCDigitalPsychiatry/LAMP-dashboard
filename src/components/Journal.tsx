// Core Imports
import React, { useEffect, useState } from "react"
import { Typography, makeStyles, Box, Grid, Container, useMediaQuery, useTheme, Icon } from "@material-ui/core"
import WeekView from "./WeekView"
import { DatePicker } from "@material-ui/pickers"
import { MuiPickersUtilsProvider } from "@material-ui/pickers"
import DateFnsUtils from "@date-io/date-fns"

class LocalizedUtils extends DateFnsUtils {
  getWeekdays() {
    return ["S", "M", "T", "W", "T", "F", "S"]
  }
}

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
  large_calendar: {
    padding: "20px 0 0 50px",
    "& span": {
      fontSize: 14,
      fontWeight: "bold",
      color: "rgba(0, 0, 0, 0.75)",
      width: 50,
      height: 45,
      display: "block",
      margin: 0,
    },
    "& div.MuiPickersCalendarHeader-switchHeader": { marginBottom: 35, padding: "0 5px" },
    "& div.MuiPickersCalendar-transitionContainer": { minHeight: 300 },
    "& div": { maxWidth: "inherit !important" },
    "& button": {
      width: 24,
      height: 24,
      margin: "0 auto",
      display: "flex",
      padding: 0,
      "& span": { width: "auto", height: "auto" },
    },
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  thumbContainer: { maxWidth: 1055, margin: "0 auto" },
  day: {
    "& p": { fontSize: 10 },
  },
  selectedDay: {
    "& button": {
      width: 24,
      height: 24,
      background: "#CFE3FF",

      display: "block",
      "& p": { fontSize: 10, color: "#618EF7", fontWeight: 700 },
      "&:hover": { background: "#2196f3" },
      "&:hover p": { color: "#fff" },
    },
  },
  currentDay: {
    "& button": {
      width: 24,
      height: 24,
      background: "#7599FF",
      display: "block",
      boxShadow: "0px 10px 15px rgba(134, 182, 255, 0.25)",
      "& p": { fontSize: 10, color: "white  !important" },
    },
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

const getJournals = async (journals: any) => {
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

export default function Journals({ selectedEvents, ...props }) {
  const classes = useStyles()
  const supportsSidebar = useMediaQuery(useTheme().breakpoints.up("md"))
  const [journals, setJournals] = useState([])
  const [allJournals, setAllJournals] = useState(null)
  const [open, setOpen] = useState([])
  const [text, setText] = useState([])
  const [selectedDates, setSelectedDates] = useState(null)
  const [date, setDate] = useState(null)
  const [index, setIndex] = useState(0)
  const [journal, setJournal] = useState(null)

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
    getJournals(selectedEvents).then(setAllJournals)
    setSelectedDates(selectedEvents.map((journal) => new Date(journal.timestamp).toLocaleDateString()))
  }, [])

  useEffect(() => {
    if (allJournals !== null) {
      let textData = []
      Object.keys(allJournals).map((each) => {
        if (allJournals[each].length > 0 && text.length === 0) {
          allJournals[each].map((journal, index) => {
            setOpen({ ...open, [index]: false })
            let jText =
              journal.static_data.text.substring(0, 80).length === journal.static_data.text.length
                ? journal.static_data.text
                : journal.static_data.text
                    .substring(0, 80)
                    .substr(
                      0,
                      Math.min(
                        journal.static_data.text.substring(0, 80).length,
                        journal.static_data.text.substring(0, 80).lastIndexOf(" ")
                      )
                    ) + "..."
            textData[index] = jText
          })
        }
      })
      setText(textData)
    }
  }, [allJournals])

  useEffect(() => {
    if (journal !== null) {
      let jText = !!open[index]
        ? journal.static_data.text
        : journal.static_data.text.substring(0, 80).length === journal.static_data.text.length
        ? journal.static_data.text
        : journal.static_data.text
            .substring(0, 80)
            .substr(
              0,
              Math.min(
                journal.static_data.text.substring(0, 80).length,
                journal.static_data.text.substring(0, 80).lastIndexOf(" ")
              )
            ) + "..."
      setText({ ...text, [index]: jText })
    }
  }, [open])

  const getContent = (date: Date) => {
    setDate(date)
  }

  const handleOpen = (index, journal) => {
    setIndex(index)
    setJournal(journal)
    setOpen({ ...open, [index]: !open[index] })
  }

  return (
    <div className={classes.root}>
      {!supportsSidebar && <WeekView type="journal" onSelect={getContent} daysWithdata={selectedDates} />}
      <Grid container className={classes.thumbContainer}>
        <Grid item xs>
          {date !== null ? (
            <Container>
              <Container className={classes.journalHistory}>
                <Box fontWeight="fontWeightBold" className={classes.journalday}>
                  This date
                </Box>
                {journals.filter(
                  (journal) => new Date(journal.timestamp).toLocaleDateString() === new Date(date).toLocaleDateString()
                ).length > 0 ? (
                  <Box>
                    {journals
                      .filter(
                        (journal) =>
                          new Date(journal.timestamp).toLocaleDateString() === new Date(date).toLocaleDateString()
                      )
                      .map((journal, index) => (
                        <Box boxShadow={0}>
                          <Grid item>
                            <Box className={classes.journalStyle} onClick={() => handleOpen(index, journal)}>
                              <Typography variant="caption" gutterBottom>
                                {getDateString(new Date(journal.timestamp))}
                              </Typography>
                              <Typography variant="body2" component="p">
                                {journal.static_data.text.substring(0, 80).length === journal.static_data.text.length
                                  ? journal.static_data.text
                                  : journal.static_data.text
                                      .substring(0, 80)
                                      .substr(
                                        0,
                                        Math.min(
                                          journal.static_data.text.substring(0, 80).length,
                                          journal.static_data.text.substring(0, 80).lastIndexOf(" ")
                                        )
                                      ) + "..."}
                              </Typography>
                            </Box>
                          </Grid>
                        </Box>
                      ))}
                  </Box>
                ) : (
                  <Box>
                    {" "}
                    <Typography variant="body2" component="p">
                      No data
                    </Typography>
                  </Box>
                )}
              </Container>
            </Container>
          ) : (
            <div>
              {!!allJournals &&
                allJournals !== null &&
                Object.keys(allJournals).map((each) => (
                  <Container>
                    {allJournals[each].length > 0 && (
                      <Container className={classes.journalHistory}>
                        <Box fontWeight="fontWeightBold" className={classes.journalday}>
                          {each}
                        </Box>
                        {allJournals[each].map((journal, index) => (
                          <Box boxShadow={0}>
                            <Grid item>
                              <Box className={classes.journalStyle} onClick={() => handleOpen(index, journal)}>
                                <Typography variant="caption" gutterBottom>
                                  {getDateString(new Date(journal.timestamp))}
                                </Typography>
                                <Typography variant="body2" component="p">
                                  {!!text[index] && !!journal && text[index]}
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
        </Grid>

        <Grid item xs className={classes.large_calendar}>
          <MuiPickersUtilsProvider utils={LocalizedUtils}>
            <DatePicker
              autoOk
              disableToolbar
              orientation="landscape"
              variant="static"
              openTo="date"
              value={date}
              onChange={(d) => setDate(new Date(d))}
              onMonthChange={(e) => {
                // getFeedByDate(new Date(e))
              }}
              renderDay={(date, selectedDate, isInCurrentMonth, dayComponent) => {
                const isSelected =
                  isInCurrentMonth && !!selectedDates && selectedDates.indexOf(date.toLocaleDateString()) > -1
                const isCurrentDay = new Date().getDate() === date.getDate() ? true : false
                const isActiveDate = selectedDate.getDate() === date.getDate() ? true : false
                const view = isSelected ? (
                  <div onClick={() => setDate(date)}>
                    <span className={isCurrentDay || isActiveDate ? classes.currentDay : classes.selectedDay}>
                      {dayComponent}
                    </span>
                  </div>
                ) : isCurrentDay || isActiveDate ? (
                  <span onClick={() => setDate(date)} className={classes.currentDay}>
                    {dayComponent}
                  </span>
                ) : (
                  <span onClick={() => setDate(date)} className={classes.day}>
                    {dayComponent}{" "}
                  </span>
                )
                return view
              }}
              leftArrowIcon={<Icon>chevron_left</Icon>}
              rightArrowIcon={<Icon>chevron_right</Icon>}
            />
          </MuiPickersUtilsProvider>
        </Grid>
      </Grid>
    </div>
  )
}
