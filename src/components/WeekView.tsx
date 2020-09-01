import React, { useState } from "react"
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
      "& p": {
        width: 24,
        height: 24,
        margin: "0 auto",

        borderRadius: "50%",
        paddingTop: 5,
      },
    },
    selected: {
      background: "#7599FF",
      borderRadius: "50%",
      color: "rgba(255, 255, 255, 0.5)",
      "& span": { color: "white" },
      "& p": { color: "rgba(255, 255, 255, 0.75)" },
    },
    feedDateview: { color: "#00765C !important", background: "#BCEFDD", fontWeight: "bold" },
    journalDateview: { color: "#4C66D6 !important", background: "#ECF4FF", fontWeight: "bold" },
  })
)

function getDays() {
  return ["M", "T", "W", "T", "F", "S", "S"]
}

function getDates() {
  let week = []
  let first
  let curr = new Date()
  for (let i = 1; i < 7; i++) {
    first = curr.getDate() - curr.getDay() + i
    let day = new Date(curr.setDate(first))
    week.push(day.getDate())
  }
  curr = new Date()
  first = curr.getDate() - curr.getDay() + 7
  let day = new Date(curr.setDate(first))
  week.push(day.getDate())
  return week
}

export default function WeekView({
  type,
  onSelect,
  daysWithdata,
  ...props
}: {
  type: string
  onSelect?: Function
  daysWithdata?: any
}) {
  const classes = useStyles()
  const supportsSidebar = useMediaQuery(useTheme().breakpoints.up("md"))
  const days = getDays()
  const dates = getDates()
  let currentMonth = new Date().getMonth() + 1
  let currentYear = new Date().getFullYear()
  const [selectedDate, setSelectedDate] = useState(type === "feed" ? dates.indexOf(new Date().getDate()) : null)

  return (
    <Box
      style={{
        marginLeft: supportsSidebar ? 64 : undefined,
      }}
    >
      <Grid container spacing={0}>
        {days.map((day, index) => (
          <Grid item xs>
            <Paper
              className={classnames(
                selectedDate !== null && index == selectedDate ? classes.selected : "",
                classes.paper
              )}
              onClick={() => {
                setSelectedDate(index)
                onSelect(new Date(currentMonth + "/" + dates[index] + "/" + currentYear))
              }}
            >
              <Box component="span">{day}</Box>
              <Box
                component="p"
                className={
                  daysWithdata &&
                  daysWithdata.indexOf(
                    new Date(currentMonth + "/" + dates[index] + "/" + currentYear).toLocaleDateString()
                  ) > -1
                    ? type === "feed"
                      ? classes.feedDateview
                      : classes.journalDateview
                    : ""
                }
              >
                {dates[index]}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
