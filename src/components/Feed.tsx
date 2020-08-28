import React, { useEffect, useState } from "react"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"

import {
  Card,
  Step,
  Stepper,
  StepLabel,
  Typography,
  Box,
  Grid,
  StepContent,
  useMediaQuery,
  useTheme,
  StepConnector,
  StepIcon,
} from "@material-ui/core/"
import { DatePicker } from "@material-ui/pickers"
import classnames from "classnames"
import { ReactComponent as SadHappy } from "../icons/SadHappy.svg"
import { ReactComponent as Medication } from "../icons/Medicationsm.svg"
import { ReactComponent as PencilPaper } from "../icons/PencilPaper.svg"
import { ReactComponent as SadBoard } from "../icons/SadBoard.svg"
import { ReactComponent as LineGraph } from "../icons/LineGraph.svg"
import { ReactComponent as Exercise } from "../icons/Exercise.svg"
import { ReactComponent as Reading } from "../icons/Reading.svg"
import { ReactComponent as Sleeping } from "../icons/Sleeping.svg"
import { ReactComponent as Nutrition } from "../icons/Nutrition.svg"
import { ReactComponent as Meditation } from "../icons/Meditation.svg"
import { ReactComponent as Emotions } from "../icons/Emotions.svg"
import { ReactComponent as BreatheIcon } from "../icons/Breathe.svg"
import { ReactComponent as Savings } from "../icons/Savings.svg"
import { ReactComponent as Weight } from "../icons/Weight.svg"
import { ReactComponent as Custom } from "../icons/Custom.svg"
import { ReactComponent as LeftArrow } from "../icons/LeftArrow.svg"
import { ReactComponent as RightArrow } from "../icons/RightArrow.svg"
import ResponsiveDialog from "./ResponsiveDialog"
import WeekView from "./WeekView"
import TipNotification from "./TipNotification"
import LAMP, {
  Participant as ParticipantObj,
  Activity as ActivityObj,
  ActivityEvent as ActivityEventObj,
  SensorEvent as SensorEventObj,
} from "lamp-core"
import { MuiPickersUtilsProvider } from "@material-ui/pickers"
import DateFnsUtils from "@date-io/date-fns"

class LocalizedUtils extends DateFnsUtils {
  getWeekdays() {
    return ["S", "M", "T", "W", "T", "F", "S"]
  }
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    learn: {
      background: "#FFF9E5",
      padding: "8px 10px",
      borderRadius: 10,
      border: "2px solid transparent",
    },
    learnCompleted: {
      border: "2px solid #FFE27A",
      padding: "8px 10px",
      borderRadius: 10,
      "& h5": {
        color: "rgba(0, 0, 0, 0.5) !important",
      },
      "& svg": { opacity: 0.5 },
    },
    assess: {
      background: "#E7F8F2",
      padding: "8px 10px",
      borderRadius: 10,
      border: "2px solid transparent",
    },
    assessCompleted: {
      border: "2px solid #65DEB4",
      padding: "8px 10px",
      borderRadius: 10,
      "& h5": {
        color: "rgba(0, 0, 0, 0.5) !important",
      },
      "& svg": { opacity: 0.5 },
    },
    manage: {
      background: "#FFEFEC",
      padding: "8px 10px",
      borderRadius: 10,
      border: "2px solid transparent",
    },
    manageCompleted: {
      border: "2px solid #FFAC98",
      padding: "8px 10px",
      borderRadius: 10,
      "& h5": {
        color: "rgba(0, 0, 0, 0.5) !important",
      },
      "& svg": { opacity: 0.5 },
    },
    prevent: {
      background: "#ECF4FF",
      padding: "8px 10px",
      borderRadius: 10,
      border: "2px solid transparent",
    },
    preventCompleted: {
      border: "2px solid #7DB2FF",
      padding: "8px 10px",
      borderRadius: 10,
      "& h5": {
        color: "rgba(0, 0, 0, 0.5) !important",
      },
      "& svg": { opacity: 0.5 },
    },
    goal: {
      background: "#FFEFEC",
      padding: "8px 10px",
      borderRadius: 10,
      border: "2px solid transparent",
    },
    goalCompleted: {
      border: "2px solid #FFAC98",
      padding: "8px 10px",
      borderRadius: 10,
      "& h5": {
        color: "rgba(0, 0, 0, 0.5) !important",
      },
      "& svg": { opacity: 0.5 },
    },
    image: {
      width: 65,
      marginRight: "10px",
    },
    feedtasks: {
      "& h5": {
        fontSize: 16,

        fontWeight: 600,
        color: "rgba(0, 0, 0, 0.75)",
      },
    },
    smalltext: {
      fontSize: 12,
      fontStyle: "normal",
    },
    stepIcon: {
      color: "white",
      width: 32,
      height: 32,
      border: "3px solid #FFEFEC",
      borderRadius: "50%",
      marginRight: 10,
      "& text": {
        fill: "#FFF",
      },
    },
    stepActiveIcon: {
      color: "#FFFFFF !important",
      "& text": {
        fill: "#FFFFFF !important",
      },
    },
    manageIcon: {
      border: "3px solid #FE8470",
    },

    manageCompletedIcon: {
      color: "#FE8470 !important",
      border: "0px solid #FE8470",
      "& text": {
        fill: "#FE8470 !important",
      },
    },
    preventIcon: {
      border: "3px solid #7DB2FF",
    },

    preventCompletedIcon: {
      color: "#7DB2FF !important",
      border: "0px solid #7DB2FF",
      "& text": {
        fill: "#7DB2FF !important",
      },
    },
    assessIcon: {
      border: "3px solid #65DEB4",
    },

    assessCompletedIcon: {
      color: "#65DEB4 !important",
      border: "0px solid #65DEB4",
      "& text": {
        fill: "#65DEB4 !important",
      },
    },
    learnIcon: {
      border: "3px solid #FFD645",
    },

    learnCompletedIcon: {
      color: "#FFD645 !important",
      border: 0,
      "& text": {
        fill: "#FFD645 !important",
      },
    },
    goalIcon: {
      border: "3px solid #FE8470",
    },

    goalCompletedIcon: {
      color: "#FE8470 !important",
      border: "0px solid #FE8470",
      "& text": {
        fill: "#FE8470 !important",
      },
    },
    customstepper: {
      position: "relative",
      maxWidth: 500,
      padding: 18,
      "&::after": {
        content: "",
        position: "absolute",
        display: "block",
        width: 30,
        height: 100,
        background: "black",
        top: 100,
      },
    },
    customsteppercontent: {
      marginLeft: 15,
      marginTop: -38,
      paddingTop: 44,
      marginBottom: -38,
      paddingBottom: 52,
      borderLeft: "2px solid #bdbdbd",
    },
    customstepperconnecter: {
      minHeight: 0,
      padding: 0,
      "& span": { minHeight: 0 },
    },

    large_calendar: {
      padding: "5px 0 0 50px",
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
        width: 40,
        height: 40,
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
    calendarCustom: {},
    day: {
      "& p": { fontSize: 10 },
    },
    currentDay: {
      "& button": {
        width: 36,
        height: 36,
        background: "#ECF4FF",
        border: "1px solid #7599FF",
        display: "block",
        "& p": { fontSize: 10, color: "#618EF7" },
      },
    },
    selectedDay: {
      "& button": {
        width: 36,
        height: 36,
        background: "#7599FF",
        display: "block",
        boxShadow: "0px 10px 15px rgba(134, 182, 255, 0.25)",
        "& p": { fontSize: 10, color: "white" },
      },
    },
  })
)

async function getCurrentFeeds(participant: ParticipantObj) {
  return Object.fromEntries(
    (
      await Promise.all(
        [participant.id || ""].map(async (x) => [
          x,
          await LAMP.Type.getAttachment(x, "lamp.current_feeds").catch((e) => []),
        ])
      )
    )
      .filter((x: any) => x[1].message !== "404.object-not-found")
      .map((x: any) => [x[0], x[1].data])
  )[participant.id || ""]
}

async function getActivities(participant: ParticipantObj) {
  let original = await LAMP.Activity.allByParticipant(participant.id)
  return [...original]
}

function _patientMode() {
  return LAMP.Auth._type === "participant"
}

export default function Feed({ participant, ...props }: { participant: ParticipantObj; activeTab: Function }) {
  const classes = useStyles()
  const supportsSidebar = useMediaQuery(useTheme().breakpoints.up("md"))
  const [date, changeDate] = useState(new Date())
  const [completed, setCompleted] = useState(false)
  const [open, setOpen] = useState(false)
  const [feeds, setFeeds] = useState([])
  const [selectedDays, setSelectedDays] = useState([1, 2, 15])
  const [data, setData] = useState({})
  const [medications, setMedications] = useState({})
  const [currentFeed, setCurrentFeed] = useState([])
  const triweekly = [1, 3, 5]
  const biweekly = [2, 4]

  const markCompleted = (event: any, index: number) => {
    let feed = currentFeed
    if (event.target.closest("div").className.indexOf("MuiStep-root") > -1) {
      feed[index].completed = true
      LAMP.Type.setAttachment(participant.id, "me", "lamp.current_feeds", feed)
      setCurrentFeed(feed)
      setCompleted(!completed)
    }
  }

  const getFeedData = async () => {
    console.log(
      Object.fromEntries(
        (
          await Promise.all(
            [participant.id || ""].map(async (x) => [
              x,
              await LAMP.Type.getAttachment(x, "lamp.feed.goals").catch((e) => []),
              await LAMP.Type.getAttachment(x, "lamp.feed.medications").catch((e) => []),
            ])
          )
        )
          .filter((x: any) => x[1].message !== "404.object-not-found")
          .map((x: any) => [x[0], x[1].data])
      )[participant.id || ""] ?? []
    )
    return (
      Object.fromEntries(
        (
          await Promise.all(
            [participant.id || ""].map(async (x) => [
              x,
              await LAMP.Type.getAttachment(x, "lamp.feed.goals").catch((e) => []),
              await LAMP.Type.getAttachment(x, "lamp.feed.medications").catch((e) => []),
            ])
          )
        )
          .filter((x: any) => x[1].message !== "404.object-not-found")
          .map((x: any) => [x[0], x[1].data])
      )[participant.id || ""] ?? []
    )
  }

  useEffect(() => {
    ;(async () => {
      let feedData = await getFeedData()
      setData(feedData)
      let activities = await getActivities(participant)
      let feeds = []
      let schedule
      activities.map((activity) => {
        schedule = activity?.schedule ?? []
        if (schedule.length > 0) {
          feeds.push(activity)
        }
      })
      setFeeds(feeds)
    })()
  }, [])

  useEffect(() => {
    let currentFeed = getFeedByDate(feeds, new Date())
    LAMP.Type.setAttachment(participant.id, "me", "lamp.current_feeds", currentFeed)
    setCurrentFeed(currentFeed)
  }, [feeds])

  function getDayNumber(date: Date) {
    date = new Date(date)
    return date.getDay()
  }
  function getTimeValue(date: Date) {
    var hours = date.getHours()
    var minute = date.getMinutes()
    var ampm = hours >= 12 ? "pm" : "am"
    hours = hours % 12
    hours = hours ? hours : 12 // the hour '0' should be '12'
    var minutes = minute < 10 ? "0" + minute : minute
    var strTime = hours + ":" + minutes + ampm
    return strTime
  }

  const getFeedByDate = (feeds: any, date: Date) => {
    let currentFeed = []
    let dayNumber = getDayNumber(date)
    feeds.map((feed) => {
      feed.schedule.map((schedule) => {
        schedule.icon = feed.spec === "lamp.survey" ? "board" : ""
        schedule.type = feed.spec === "lamp.survey" ? "assess" : "manage"
        schedule.title = feed.name
        schedule.timeValue = getTimeValue(new Date(schedule.time))
        switch (schedule.repeat_interval) {
          case "triweekly":
            if (triweekly.indexOf(dayNumber) > -1) {
              schedule.completed = schedule.completed ?? false
              currentFeed.push(schedule)
            }
            break
          case "biweekly":
            if (biweekly.indexOf(dayNumber) > -1) {
              schedule.completed = schedule.completed ?? false
              currentFeed.push(schedule)
            }
            break
          case "daily":
            schedule.completed = schedule.completed ?? false
            currentFeed.push(schedule)
            break
          case "custom":
            schedule.custom_time.map((time) => {
              if (new Date().toLocaleTimeString() === new Date(time).toLocaleTimeString()) {
                schedule.completed = schedule.completed ?? false
                currentFeed.push(schedule)
              }
            })
            break
          case "hourly":
            if (
              new Date().toLocaleTimeString() ===
              new Date(new Date(schedule.start_date).getTime() + 60 * 60 * 1000).toLocaleTimeString()
            ) {
              schedule.completed = schedule.completed ?? false
              currentFeed.push(schedule)
            }
            break
          case "every3h":
            if (
              new Date().toLocaleTimeString() ===
              new Date(new Date(schedule.start_date).getTime() + 3 * 60 * 60 * 1000).toLocaleTimeString()
            ) {
              schedule.completed = schedule.completed ?? false
              currentFeed.push(schedule)
            }
            break
          case "every6h":
            if (
              new Date().toLocaleTimeString() ===
              new Date(new Date(schedule.start_date).getTime() + 6 * 60 * 60 * 1000).toLocaleTimeString()
            ) {
              schedule.completed = schedule.completed ?? false
              currentFeed.push(schedule)
            }
            break
          case "every12h":
            if (
              new Date().toLocaleTimeString() ===
              new Date(new Date(schedule.start_date).getTime() + 12 * 60 * 60 * 1000).toLocaleTimeString()
            ) {
              schedule.completed = schedule.completed ?? false
              currentFeed.push(schedule)
            }
            break
          case "monthly":
            if (new Date(date).getDate() === new Date(schedule.start_date).getDate()) {
              schedule.completed = schedule.completed ?? false
              currentFeed.push(schedule)
            }
            break
          case "bimonthly":
            if ([10, 20].indexOf(new Date(date).getDate()) > -1) {
              schedule.completed = schedule.completed ?? false
              currentFeed.push(schedule)
            }
            break
          case "none":
            if (new Date(date) === new Date(schedule.start_date)) {
              schedule.completed = schedule.completed ?? false
              currentFeed.push(schedule)
            }
            break
        }
      })
    })
    Object.keys(data).forEach((key) => {
      currentFeed.push(data[key])
    })
    console.log(currentFeed)
    return currentFeed
  }

  const showFeedDetails = (type) => {
    if (type == "learn") {
      setOpen(true)
    }
  }

  return (
    <div className={classes.root}>
      {!supportsSidebar && <WeekView type="feed" onSelect={getFeedByDate} />}

      <Grid container className={classes.thumbContainer}>
        <Grid item xs>
          <Stepper
            orientation="vertical"
            classes={{ root: classes.customstepper }}
            connector={<StepConnector classes={{ root: classes.customstepperconnecter }} />}
          >
            {typeof currentFeed !== "undefined" &&
              currentFeed.map((feed, index) => (
                <Step>
                  <StepLabel
                    StepIconProps={{
                      completed: feed.completed,
                      classes: {
                        root: classnames(classes.stepIcon, classes[feed.type + "Icon"]),
                        active: classes.stepActiveIcon,
                        completed: classes[feed.type + "CompletedIcon"],
                      },
                    }}
                    onClick={(e) => markCompleted(e, index)}
                  >
                    <Card
                      className={feed.completed ? classes[feed.type + "Completed"] : classes[feed.type]}
                      variant="outlined"
                      onClick={() => showFeedDetails(feed.type)}
                    >
                      <Grid container spacing={0}>
                        <Grid
                          xs
                          container
                          justify="center"
                          direction="column"
                          className={classes.feedtasks}
                          spacing={0}
                        >
                          <Box m={1}>
                            <Typography variant="body2" color="textSecondary">
                              <Box fontStyle="italic" className={classes.smalltext}>
                                {feed.timeValue}
                              </Box>
                            </Typography>
                            <Typography variant="h5">{feed.title}</Typography>
                            <Typography className={classes.smalltext} color="textSecondary">
                              {feed.spec}
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid container justify="center" direction="column" className={classes.image}>
                          {feed.type === "goal" &&
                            (feed.icon == "Exercise" ? (
                              <Exercise />
                            ) : feed.icon == "Weight" ? (
                              <Weight />
                            ) : feed.icon == "Nutrition" ? (
                              <Nutrition />
                            ) : feed.icon == "Medication" ? (
                              <BreatheIcon />
                            ) : feed.icon == "Sleep" ? (
                              <Sleeping />
                            ) : feed.icon == "Reading" ? (
                              <Reading />
                            ) : feed.icon == "Finances" ? (
                              <Savings />
                            ) : feed.icon == "Mood" ? (
                              <Emotions />
                            ) : feed.icon == "Meditation" ? (
                              <Meditation />
                            ) : (
                              <Custom />
                            ))}
                          {feed.icon === "sad-happy" && <SadHappy />}
                          {feed.icon === "medication" && <Medication />}
                          {feed.icon === "pencil" && <PencilPaper />}
                          {feed.icon === "board" && <SadBoard />}
                          {feed.icon === "linegraph" && <LineGraph />}
                        </Grid>
                      </Grid>
                    </Card>
                  </StepLabel>
                  {index !== currentFeed.length - 1 && (
                    <StepContent classes={{ root: classes.customsteppercontent }}>
                      <div></div>
                    </StepContent>
                  )}
                </Step>
              ))}
          </Stepper>
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
              onChange={changeDate}
              renderDay={(date, selectedDate, isInCurrentMonth, dayComponent) => {
                const isSelected = isInCurrentMonth && selectedDays.includes(date.getDate())
                const isCurrentDay = new Date().getDate() === date.getDate() ? true : false
                const isActiveDate = selectedDate.getDate() === date.getDate() ? true : false
                const view = isSelected ? (
                  <div>
                    <span className={classes.day}> {dayComponent} </span>
                  </div>
                ) : isCurrentDay ? (
                  <span className={isActiveDate ? classes.selectedDay : classes.currentDay}> {dayComponent} </span>
                ) : isActiveDate ? (
                  <span className={classes.selectedDay}> {dayComponent} </span>
                ) : (
                  <span className={classes.day}> {dayComponent} </span>
                )
                return view
              }}
              leftArrowIcon={<LeftArrow />}
              rightArrowIcon={<RightArrow />}
            />
          </MuiPickersUtilsProvider>
        </Grid>
      </Grid>
      <ResponsiveDialog
        transient={false}
        animate
        fullScreen
        open={open}
        onClose={() => {
          setOpen(false)
        }}
      >
        <TipNotification onClose={() => setOpen(false)} />
      </ResponsiveDialog>
    </div>
  )
}
