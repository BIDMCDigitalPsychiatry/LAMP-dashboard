import React from "react"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import { Paper, Grid, Box, useMediaQuery, useTheme } from "@material-ui/core"
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

function currentDay() {
  let date = new Date()
  return date.getDay()
}

function getDates() {
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

export default function WeekView() {
  const classes = useStyles()
  const supportsSidebar = useMediaQuery(useTheme().breakpoints.up("md"))

  let dateView = () => {
    const days = getDays()
    const dates = getDates()
    let grids = []
    let i = 1
    for (let day of days) {
      i = i === 7 ? 0 : i
      const selectedClass = i === currentDay() ? classes.selected : ""
      let classNameVal = classnames(selectedClass, classes.paper)
      grids.push(
        <Grid item xs>
          <Paper className={classNameVal}>
            <Box component="span">{day}</Box>
            {dates[i]}
          </Paper>
        </Grid>
      )
      i++
    }
    return grids
  }

  return (
    <Box
      mt={2}
      style={{
        marginLeft: supportsSidebar ? 64 : undefined,
      }}
    >
      <Grid container spacing={0}>
        {dateView()}
      </Grid>
    </Box>
  )
}
