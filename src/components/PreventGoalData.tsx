// Core Imports
import React, { useEffect, useState } from "react"
import { Typography, makeStyles, Box, Grid, Container, Link, Badge, Icon } from "@material-ui/core"
import { ReactComponent as WaterBlue } from "../icons/WaterBlue.svg"
import { DatePicker } from "@material-ui/pickers"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: 20,
  },
  highlight: {
    background: "#CFE3FF",
    borderRadius: "50%",
  },
  journalHistory: {
    marginTop: 10,
  },
  linkBlue: {
    color: "#6083E7",
    fontSize: 16,
    fontWeight: 600,
    marginTop: 20,
    display: "block",
  },
  preventIcon: {
    "& svg": { width: 80, height: 80 },
  },
  streakDetails: {
    "& h6": { fontSize: 16, fontWeight: 600, whiteSpace: "nowrap", color: "rgba(0, 0, 0, 0.75)" },
    "& h5": { fontSize: 16, fontWeight: 600, color: "#618EF7", lineHeight: 1.6 },
  },
}))

export default function JournalEntries({ ...props }) {
  const classes = useStyles()
  const [date, changeDate] = useState(new Date())
  const [selectedDays, setSelectedDays] = useState([1, 2, 15])

  return (
    <div className={classes.root}>
      <Container className={classes.journalHistory}>
        <Box display="flex">
          <Box flexShrink={1} className={classes.preventIcon}>
            <WaterBlue />
          </Box>
          <Box width="100%" pl={3} pt={1}>
            <Typography variant="h6">80 ounces</Typography>
            <Typography variant="body2">Daily (M, T, W, T, F, S)</Typography>
            <Link underline="none" className={classes.linkBlue}>
              Edit goal
            </Link>
          </Box>
        </Box>
        <Box display="flex" py={5} className={classes.streakDetails}>
          <Box flexShrink={1}>
            <Typography variant="h6">Current streak:</Typography>
          </Box>
          <Box width="100%" pl={1}>
            <Typography variant="h5" color="primary">
              14 days
            </Typography>
          </Box>
        </Box>
        <Box className={classes.streakDetails}>
          <Typography variant="h6">Goal History</Typography>
        </Box>
        <DatePicker
          autoOk
          orientation="landscape"
          variant="static"
          openTo="date"
          value={date}
          onChange={changeDate}
          disableToolbar={true}
          renderDay={(date, selectedDate, isInCurrentMonth, dayComponent) => {
            const isSelected = isInCurrentMonth && selectedDays.includes(date.getDate())
            const view = isSelected ? (
              <div className={classes.highlight}>
                <span> {dayComponent} </span>
              </div>
            ) : (
              <span> {dayComponent} </span>
            )
            return view
          }}
        />
      </Container>
    </div>
  )
}
