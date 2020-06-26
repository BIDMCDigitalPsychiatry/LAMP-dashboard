import React from "react"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import { Paper, Grid, Box } from "@material-ui/core"

import classnames from "classnames"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      textAlign: "center",

      height: 50,
      width: 50,
      background: "transparent",
      boxShadow: "none",
      padding: 9,
      fontSize: 10,
      color: "rgba(0, 0, 0, 0.25)",

      "& span": {
        display: "block",
        fontSize: "12px",
        fontWeight: "600",
        color: "#777777",
      },
    },
    selected: {
      background: "#7599FF",
      borderRadius: "50%",
      color: "rgba(255, 255, 255, 0.5)",

      "& span": { color: "white" },
    },
  })
)

function getDays() {
  return ["M", "T", "W", "T", "F", "S", "S"]
}

function range(start, end) {
  if (start === end) return [start]
  return [start, ...range(start + 1, end)]
}
function currentDay() {
  let date = new Date()
  console.log(date.getDay())
  return date.getDay()
}

function getDates() {
  let date = new Date()
  let day = date.getDay()
  let dateNo = date.getDate()
  return range(dateNo - day + 1, dateNo - day + 8)
}

export default function WeekView() {
  const classes = useStyles()
  const days = getDays()
  const dates = getDates()
  let grids = []
  let i = 1
  for (let day of days) {
    i = i == 7 ? 0 : i
    const selectedClass = i == currentDay() ? classes.selected : ""
    let classNameVal = classnames(selectedClass, classes.paper)
    grids.push(
      <Grid item xs>
        <Paper className={classNameVal}>
          <Box component="span"> {day}</Box>
          {dates[i]}
        </Paper>
      </Grid>
    )
    i++
  }
  return (
    <Box mt={2}>
      <Grid container spacing={0}>
        {grids}
      </Grid>
    </Box>
  )
}
