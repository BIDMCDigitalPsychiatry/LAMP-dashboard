// Core Imports
import React, { useEffect, useState } from "react"
import { Typography, makeStyles, Box, Divider, Container, Link, Badge, Icon } from "@material-ui/core"
import { Service } from "./DBService/DBService"
import { DatePicker } from "@material-ui/pickers"
import { useTranslation } from "react-i18next"
import { getEvents } from "./Participant"

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
    maxWidth: 750,
    "& div.MuiPickersStaticWrapper-staticWrapperRoot": {
      flexDirection: "inherit",
      justifyContent: "center",
    },
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
  mainIcons: {
    width: 80,
    height: 80,
    [theme.breakpoints.up("lg")]: {
      width: 130,
      height: 130,
    },
    [theme.breakpoints.down("sm")]: {
      width: 75,
      height: 75,
    },
  },
  streakDetails: {
    "& h6": { fontSize: 16, fontWeight: 600, whiteSpace: "nowrap", color: "rgba(0, 0, 0, 0.75)" },
    "& h5": { fontSize: 16, fontWeight: 600, color: "#618EF7", lineHeight: 1.6 },
  },
}))

export default function GoalEntries({ ...props }) {
  const classes = useStyles()
  const [date, changeDate] = useState(new Date())
  const [selectedDays, setSelectedDays] = useState([])
  const [streak, setStreak] = useState(0)
  const [tag, setTag] = useState(null)

  const { t } = useTranslation()
  useEffect(() => {
    let days = []
    Service.getUserDataByKey("activitytags", [props.activity.id], "id").then((tags) => {
      setTag(tags[0])
    })
    ;(props.selectedEvents || []).map((event) => {
      const date = new Date(event.timestamp)
      days.push(date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear())
    })
    getEvents(props.participantId, props.activity?.id).then((streak) => {
      setStreak(streak)
    })
    setSelectedDays(days)
  }, [])

  return (
    <div className={classes.root}>
      <Container className={classes.journalHistory}>
        <Box display="flex" justifyContent="left">
          <Box display="inline-flex">
            <Box flexShrink={1} className={classes.preventIcon}>
              <Box
                className={classes.mainIcons}
                style={{
                  margin: "auto",
                  background: `url(${tag?.photo}) center center/contain no-repeat`,
                }}
              ></Box>
            </Box>
            <Box width="100%" pl={3} pt={1}>
              <Typography variant="h6">{tag?.description}</Typography>
              <Typography variant="h6">
                {props.activity?.settings?.value + " " + props.activity?.settings?.unit}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box display="flex" py={5} className={classes.streakDetails}>
          <Box flexShrink={1}>
            <Typography variant="h6">{`${t("Current streak:")}`}</Typography>
          </Box>
          <Box width="100%" pl={1}>
            <Typography variant="h5" color="primary">
              {streak} {`${t("days")}`}
            </Typography>
          </Box>
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
            const isSelected =
              isInCurrentMonth &&
              selectedDays.includes(date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear())
            const view = isSelected ? (
              <div className={classes.highlight}>
                <span>{dayComponent} </span>
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
