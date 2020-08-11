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
  linkBlue: {
    color: "#6083E7",
  },
}))

export default function JournalEntries({ ...props }) {
  const classes = useStyles()
  const [date, changeDate] = useState(new Date())
  const [selectedDays, setSelectedDays] = useState([1, 2, 15])

  return (
    <div className={classes.root}>
      <Container className={classes.journalHistory}>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <WaterBlue />
          </Grid>
          <Grid item xs={9}>
            <Typography variant="h6">80 ounces</Typography>
            <Typography variant="body2">Daily (M, T, W, T, F, S)</Typography>
            <Link underline="none" className={classes.linkBlue}>
              Edit goal
            </Link>
          </Grid>
        </Grid>

        <Box>
          <Typography variant="h6">Current streak</Typography>
          <Typography variant="h6" color="primary">
            : 14 days
          </Typography>
          <Typography>Goal History</Typography>
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
