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
import { ReactComponent as Emotions } from "../icons/Emotions.svg"
import { ReactComponent as BreatheIcon } from "../icons/Breathe.svg"
import { ReactComponent as Savings } from "../icons/Savings.svg"
import { ReactComponent as Weight } from "../icons/Weight.svg"
import { ReactComponent as Custom } from "../icons/Custom.svg"
import { ReactComponent as LeftArrow } from "../icons/LeftArrow.svg"
import { ReactComponent as RightArrow } from "../icons/RightArrow.svg"
import { ReactComponent as SleepTips } from "../icons/SleepTips.svg"
import { ReactComponent as AssessMood } from "../icons/AssessMood.svg"
import { ReactComponent as AssessAnxiety } from "../icons/AssessAnxiety.svg"
import { ReactComponent as AssessNutrition } from "../icons/AssessNutrition.svg"
import { ReactComponent as AssessUsability } from "../icons/AssessUsability.svg"
import { ReactComponent as AssessSocial } from "../icons/AssessSocial.svg"
import { ReactComponent as AssessSleep } from "../icons/AssessSleep.svg"
import { ReactComponent as Jewels } from "../icons/Jewels.svg"
import { ReactComponent as InfoIcon } from "../icons/Info.svg"

import ResponsiveDialog from "./ResponsiveDialog"
import WeekView from "./WeekView"
import TipNotification from "./TipNotification"
import SurveyInstrument from "./SurveyInstrument"

import LAMP, { Participant as ParticipantObj } from "lamp-core"
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
    selectedDay: {
      "& button": {
        width: 36,
        height: 36,
        background: "#ECF4FF",
        border: "1px solid #7599FF",
        display: "block",
        "& p": { fontSize: 10, color: "#618EF7" },
        "&:hover": { background: "#2196f3" },
        "&:hover p": { color: "#fff" },
      },
    },
    currentDay: {
      "& button": {
        width: 36,
        height: 36,
        background: "#7599FF",
        display: "block",
        boxShadow: "0px 10px 15px rgba(134, 182, 255, 0.25)",
        "& p": { fontSize: 10, color: "white  !important" },
      },
    },
  })
)

export default function Feed({
  participant,
  onComplete,
  activities,
  visibleActivities,
  setVisibleActivities,
  ...props
}) {
  const classes = useStyles()
  const supportsSidebar = useMediaQuery(useTheme().breakpoints.up("md"))
  const [date, changeDate] = useState(new Date())
  const [completed, setCompleted] = useState(false)
  const [feeds, setFeeds] = useState([])
  const [selectedDays, setSelectedDays] = useState([])
  const [medications, setMedications] = useState({})
  const [launchedActivity, setLaunchedActivity] = useState<string>()
  const [tip, setTip] = useState({})
  const [goals, setGoals] = useState({})
  const [surveyName, setSurveyName] = useState<string>()
  const [currentFeed, setCurrentFeed] = useState([])
  const triweekly = [1, 3, 5]
  const biweekly = [2, 4]
  const daily = [0, 1, 2, 3, 4, 5, 6]
  const [details, setDetails] = useState(null)
  const [title, setTitle] = useState(null)
  const [icon, setIcon] = useState(null)
  const [index, setIndex] = useState(null)
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  const markCompleted = (event: any, index: number) => {
    if (event.target.closest("div").className.indexOf("MuiStep-root") > -1) {
      completeFeed(index)
    }
  }

  const completeFeed = (index: number) => {
    let feed = currentFeed
    feed[index].completed = true
    LAMP.Type.setAttachment(participant.id, "me", "lamp.current_feeds", feed)
    setCurrentFeed(feed)
    setCompleted(!completed)
  }

  const getFeedData = async () => {
    setGoals(
      Object.fromEntries(
        (
          await Promise.all(
            [participant.id || ""].map(async (x) => [
              x,
              await LAMP.Type.getAttachment(x, "lamp.feed.goals").catch((e) => []),
            ])
          )
        )
          .filter((x: any) => x[1].message !== "404.object-not-found")
          .map((x: any) => [x[0], x[1].data])
      )[participant.id || ""] ?? []
    )

    setTip(
      Object.fromEntries(
        (
          await Promise.all(
            [participant.id || ""].map(async (x) => [
              x,
              await LAMP.Type.getAttachment(x, "lamp.feed.todays_tip").catch((e) => []),
            ])
          )
        )
          .filter((x: any) => x[1].message !== "404.object-not-found")
          .map((x: any) => [x[0], x[1].data])
      )[participant.id || ""] ?? []
    )

    setMedications(
      Object.fromEntries(
        (
          await Promise.all(
            [participant.id || ""].map(async (x) => [
              x,
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
      await getFeedData()
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
    getFeedByDate(new Date())
  }, [feeds])

  function getDayNumber(date: Date) {
    date = new Date(date)
    return date.getDay()
  }
  function getTimeValue(date: Date) {
    var hours = date.getHours()
    var minute = date.getMinutes()
    var ampm = hours >= 12 ? " pm" : " am"
    hours = hours % 12
    hours = hours ? hours : 12 // the hour '0' should be '12'
    var minutes = minute < 10 ? "0" + minute : minute
    var strTime = hours + ":" + minutes + ampm
    return strTime
  }

  const getDates = (type: any, date: Date) => {
    var curr = new Date(date)
    let month = curr.getMonth()
    curr.setDate(1)
    let days = []
    type.map((day) => {
      while (curr.getMonth() === month) {
        let each = curr.getDate() - curr.getDay() + day
        days.push(new Date(curr.setDate(each)).toLocaleDateString())
        curr.setDate(curr.getDate() + 7)
      }
      curr.setDate(1)
      curr.setMonth(month)
    })

    return days
  }

  const getFeedByDate = (date: Date) => {
    let currentFeed = []
    let currentDate = new Date(date)
    let selectedWeekViewDays = []
    if (feeds.length > 0) {
      let dayNumber = getDayNumber(date)
      feeds.map((feed) => {
        feed.schedule.map((schedule) => {
          console.log(schedule)
          if (currentDate >= new Date(schedule.start_date)) {
            schedule.icon = feed.spec === "lamp.survey" ? feed.name : ""
            schedule.group = feed.spec === "lamp.survey" ? "assess" : "manage"
            schedule.type = feed.name
            schedule.title = feed.name
            schedule.timeValue = getTimeValue(new Date(schedule.time))
            schedule.activityData = [feed]
            switch (schedule.repeat_interval) {
              case "triweekly":
                if (triweekly.indexOf(dayNumber) > -1) {
                  schedule.completed = schedule.completed ?? false
                  currentFeed.push(schedule)
                }
                selectedWeekViewDays = selectedWeekViewDays.concat(getDates(triweekly, date))
                break
              case "biweekly":
                if (biweekly.indexOf(dayNumber) > -1) {
                  schedule.completed = schedule.completed ?? false
                  currentFeed.push(schedule)
                }
                selectedWeekViewDays = selectedWeekViewDays.concat(getDates(biweekly, date))
                break
              case "daily":
                schedule.completed = schedule.completed ?? false
                currentFeed.push(schedule)
                selectedWeekViewDays = selectedWeekViewDays.concat(getDates(daily, date))
                break
              case "custom":
                schedule.custom_time.map((time) => {
                  if (new Date(date).toLocaleTimeString() === new Date(time).toLocaleTimeString()) {
                    schedule.completed = schedule.completed ?? false
                    currentFeed.push(schedule)
                  }
                  selectedWeekViewDays = selectedWeekViewDays.concat(new Date(time).toLocaleDateString())
                })
                break
              case "hourly":
                if ((new Date(date).getTime() - new Date(schedule.time).getTime()) % (60 * 60 * 1000) === 0) {
                  schedule.completed = schedule.completed ?? false
                  currentFeed.push(schedule)
                }
                selectedWeekViewDays = selectedWeekViewDays.concat(getDates(daily, date))
                break
              case "every3h":
                if ((new Date(date).getTime() - new Date(schedule.time).getTime()) % (3 * 60 * 60 * 1000) === 0) {
                  schedule.completed = schedule.completed ?? false
                  currentFeed.push(schedule)
                }
                selectedWeekViewDays = selectedWeekViewDays.concat(getDates(daily, date))
                break
              case "every6h":
                if ((new Date(date).getTime() - new Date(schedule.time).getTime()) % (6 * 60 * 60 * 1000) === 0) {
                  schedule.completed = schedule.completed ?? false
                  currentFeed.push(schedule)
                }
                selectedWeekViewDays = selectedWeekViewDays.concat(getDates(daily, date))
                break
              case "every12h":
                if (
                  (new Date(date).getTime() - new Date(schedule.time).getTime()) % (12 * 60 * 60 * 1000) ===
                  0
                ) {
                  schedule.completed = schedule.completed ?? false
                  currentFeed.push(schedule)
                }
                selectedWeekViewDays = selectedWeekViewDays.concat(getDates(daily, date))
                break
              case "monthly":
                if (new Date(date).getDate() === new Date(schedule.start_date).getDate()) {
                  schedule.completed = schedule.completed ?? false
                  currentFeed.push(schedule)
                  selectedWeekViewDays.concat(new Date(schedule.start_date).toLocaleTimeString())
                }
                selectedWeekViewDays = selectedWeekViewDays.concat(new Date(schedule.start_date).toLocaleDateString())
                break
              case "bimonthly":
                if ([10, 20].indexOf(new Date(date).getDate()) > -1) {
                  schedule.completed = schedule.completed ?? false
                  currentFeed.push(schedule)
                }
                selectedWeekViewDays = selectedWeekViewDays.concat(
                  new Date(new Date().getFullYear + "-" + new Date().getMonth + 1 + "-" + 10).toLocaleDateString()
                )
                selectedWeekViewDays = selectedWeekViewDays.concat(
                  new Date(new Date().getFullYear + "-" + new Date().getMonth + 1 + "-" + 20).toLocaleDateString()
                )
                break
              case "none":
                if (new Date(date) === new Date(schedule.start_date)) {
                  schedule.completed = schedule.completed ?? false
                  currentFeed.push(schedule)
                }
                selectedWeekViewDays = selectedWeekViewDays.concat(new Date(schedule.start_date).toLocaleDateString())
                break
            }
          }
        })
      })
      currentFeed.push(tip)
      let goalsFeedData = checkDataForFeed(date, goals, currentFeed, selectedWeekViewDays)
      currentFeed = goalsFeedData.feed
      selectedWeekViewDays = goalsFeedData.weekDays
      let medicationsData = checkDataForFeed(date, medications, currentFeed, selectedWeekViewDays)
      currentFeed = medicationsData.feed
      selectedWeekViewDays = medicationsData.weekDays
      LAMP.Type.setAttachment(participant.id, "me", "lamp.current_feeds", currentFeed)
      setCurrentFeed(currentFeed)
      let selectedDays = selectedWeekViewDays.filter((n, i) => selectedWeekViewDays.indexOf(n) === i)
      setSelectedDays(selectedDays)
    }
  }

  const checkDataForFeed = (date: any, data: any, currentFeed: any, selectedWeekViewDays: any) => {
    let currentDate = new Date(date)
    let dates = []
    Object.keys(data).forEach((key) => {
      if (currentDate >= new Date(data[key].startDate) && new Date(data[key].endDate) >= currentDate) {
        data[key].weekdays.map((day) => {
          dates.push(weekdays.indexOf(day))
        })
        selectedWeekViewDays = selectedWeekViewDays.concat(getDates(dates, date))
        if (data[key].weekdays.indexOf(weekdays[new Date(date).getDay()]) > -1) {
          data[key].timeValue = getTimeValue(new Date(data[key].timeValue))
          currentFeed.push(data[key])
        }
      }
      //   switch(data[key].frequency) {
      //     case "hourly":
      //     case "daily":
      //       currentFeed.push(data[key])
      //     case "weekly":
      //       if(data[key].weekdays.indexOf(weekdays[new Date().getDay()]) > -1){
      //         currentFeed.push(data[key])
      //       }
      //       break
      //     case "monthly":
      //       break
      // }
    })
    let result = { weekDays: selectedWeekViewDays, feed: currentFeed }
    return result
  }

  const showFeedDetails = (type) => {
    setLaunchedActivity(type)
  }
  const submitSurvey = (response) => {
    completeFeed(index)
    onComplete(response)
    setLaunchedActivity(undefined)
  }

  return (
    <div className={classes.root}>
      {!supportsSidebar && <WeekView type="feed" onSelect={getFeedByDate} daysWithdata={selectedDays} />}

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
                        root: classnames(classes.stepIcon, classes[feed.group + "Icon"]),
                        active: classes.stepActiveIcon,
                        completed: classes[feed.group + "CompletedIcon"],
                      },
                    }}
                    onClick={(e) => markCompleted(e, index)}
                  >
                    <Card
                      className={feed.completed ? classes[feed.group + "Completed"] : classes[feed.group]}
                      variant="outlined"
                      onClick={() => {
                        setIndex(index)
                        if (feed.group == "assess") {
                          setSurveyName(feed.title)
                          setVisibleActivities(feed.activityData)
                          showFeedDetails(feed.group)
                        }
                        if (feed.group == "learn") {
                          setTitle(feed.data[0].title)
                          setDetails(feed.data[0].text)
                          setIndex(index)
                          setIcon(<SleepTips />)
                          showFeedDetails(feed.type)
                        }
                      }}
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
                          {feed.icon == "Exercise" ? (
                            <Exercise />
                          ) : feed.icon == "Weight" ? (
                            <Weight />
                          ) : feed.icon == "Nutrition" ? (
                            <Nutrition />
                          ) : feed.icon == "Meditation" ? (
                            <BreatheIcon />
                          ) : feed.icon == "Sleep" ? (
                            <Sleeping />
                          ) : feed.icon == "Reading" ? (
                            <Reading />
                          ) : feed.icon == "Finances" ? (
                            <Savings />
                          ) : feed.group === "goals" && feed.icon == "Mood" ? (
                            <Emotions />
                          ) : feed.icon == "Medication" ? (
                            <Medication />
                          ) : feed.icon == "Custom" ? (
                            <Custom />
                          ) : feed.icon === "sad-happy" ? (
                            <SadHappy width="80" height="80" />
                          ) : feed.icon === "medication" ? (
                            <Medication width="80" height="80" />
                          ) : feed.icon === "pencil" ? (
                            <PencilPaper width="80" height="80" />
                          ) : feed.icon === "board" ? (
                            <SadBoard width="80" height="80" />
                          ) : feed.icon === "linegraph" ? (
                            <LineGraph width="80" height="80" />
                          ) : feed.icon === "Mood" ? (
                            <AssessMood width="80" height="80" />
                          ) : feed.icon === "Sleep and Social" ? (
                            <AssessSleep width="80" height="80" />
                          ) : feed.icon === "Anxiety" ? (
                            <AssessAnxiety width="80" height="80" />
                          ) : feed.icon === "App Usability" ? (
                            <AssessUsability width="80" height="80" />
                          ) : feed.icon === "Water and Nutrition" ? (
                            <AssessNutrition width="80" height="80" />
                          ) : feed.icon === "sleep_tip" ? (
                            <SleepTips width="80" height="80" />
                          ) : feed.icon === "Psychosis and Social" ? (
                            <AssessSocial width="80" height="80" />
                          ) : feed.type === "Jewels Trails A" || feed.type === "Jewels Trails B" ? (
                            <Jewels width="80" height="80" />
                          ) : (
                            <InfoIcon width="80" height="80" />
                          )}
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
              onMonthChange={(e) => {
                getFeedByDate(new Date(e))
              }}
              renderDay={(date, selectedDate, isInCurrentMonth, dayComponent) => {
                const isSelected = isInCurrentMonth && selectedDays.indexOf(date.toLocaleDateString()) > -1
                const isCurrentDay = new Date().getDate() === date.getDate() ? true : false
                const isActiveDate = selectedDate.getDate() === date.getDate() ? true : false
                const view = isSelected ? (
                  <div onClick={() => getFeedByDate(date)}>
                    <span className={isCurrentDay || isActiveDate ? classes.currentDay : classes.selectedDay}>
                      {" "}
                      {dayComponent}{" "}
                    </span>
                  </div>
                ) : isCurrentDay || isActiveDate ? (
                  <span onClick={() => getFeedByDate(date)} className={classes.currentDay}>
                    {dayComponent}
                  </span>
                ) : (
                  <span onClick={() => getFeedByDate(date)} className={classes.day}>
                    {dayComponent}{" "}
                  </span>
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
        transient
        animate
        fullScreen
        open={!!launchedActivity}
        onClose={() => {
          setLaunchedActivity(undefined)
        }}
      >
        {
          {
            assess: (
              <SurveyInstrument
                id={participant.id}
                type={surveyName}
                fromPrevent={false}
                group={visibleActivities}
                setVisibleActivities={setVisibleActivities}
                onComplete={submitSurvey}
              />
            ),
            tip: (
              <TipNotification
                participant={participant}
                title={title}
                details={details}
                icon={icon}
                onComplete={() => {
                  setLaunchedActivity(undefined)
                  completeFeed(index)
                }}
              />
            ),
          }[launchedActivity ?? ""]
        }
      </ResponsiveDialog>
    </div>
  )
}
