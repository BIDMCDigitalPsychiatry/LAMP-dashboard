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
  Backdrop,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Button,
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
import EmbeddedActivity from "./EmbeddedActivity"
import LAMP, {
  Participant as ParticipantObj,
  Activity as ActivityObj,
  ActivityEvent as ActivityEventObj,
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
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
  })
)
const games = ["lamp.jewels_a", "lamp.jewels_b", "lamp.spatial_span", "lamp.cats_and_dogs"]

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
  const [show, setShow] = useState(false)
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
  const [events, setEvents] = useState(null)
  const [activityId, setActivityId] = useState(null)
  const [activityName, setActivityName] = useState(null)
  const [loading, setLoading] = React.useState(true)
  const [openNotImplemented, setOpenNotImplemented] = useState(false)

  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  const completeFeed = (index: number) => {
    let feed = currentFeed
    feed[index].completed = true
    //LAMP.Type.setAttachment(participant.id, "me", "lamp.current_feeds", JSON.stringify(feed))
    setCurrentFeed(feed)
    //setCompleted(!completed)
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
    getFeedByDate(new Date())
    ;(async () => {
      await getFeedData()
    })()
  }, [])

  function getDayNumber(date: Date) {
    date = new Date(date)
    return date.getDay()
  }
  function getTimeValue(date: Date) {
    var hours = date.getHours()
    var minute = isNaN(date.getMinutes()) ? 0 : date.getMinutes()
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

  const getEvents = async (date: Date) => {
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)
    let startTime = date.getTime()
    let endTime = startTime + 86400000
    let activityEvents = await LAMP.ActivityEvent.allByParticipant(participant.id, null, startTime, endTime)
    return activityEvents
  }

  const getDetails = () => {
    let currentFeed = []
    let currentDate = new Date(date)
    let startD = new Date(date)
    currentDate.setHours(0)
    currentDate.setMinutes(0)
    currentDate.setSeconds(0)
    let selectedWeekViewDays = []
    let scheduleTime, scheduleStartDate
    let savedData = []
    if (feeds.length > 0) {
      let dayNumber = getDayNumber(date)
      feeds.map((feed) => {
        savedData = events.filter((event) => event.activity === feed.id)
        feed.schedule.map((schedule) => {
          scheduleStartDate = new Date(new Date(schedule.start_date).toLocaleString())
          scheduleStartDate.setHours(0)
          scheduleStartDate.setMinutes(0)
          scheduleStartDate.setSeconds(0)
          if (currentDate.getTime() >= scheduleStartDate.getTime()) {
            scheduleTime = new Date(new Date(schedule.time).toLocaleString())
            let timeVal = getTimeValue(scheduleTime)
            startD.setHours(scheduleTime.getHours())
            startD.setMinutes(scheduleTime.getMinutes())
            startD.setSeconds(0)
            scheduleStartDate = new Date(new Date(schedule.start_date).toLocaleString())
            let scheduledDate = new Date(scheduleStartDate)
            scheduledDate.setHours(scheduleTime.getHours())
            scheduledDate.setMinutes(scheduleTime.getMinutes())
            schedule.icon = feed.name
            schedule.group = feed.spec === "lamp.survey" ? "assess" : feed.spec === "lamp.tips" ? "learn" : "manage"
            schedule.type = feed.spec
            schedule.title = feed.name
            schedule.activityData = JSON.parse(JSON.stringify(feed))

            schedule.clickable =
              new Date().toLocaleDateString() === new Date(date).toLocaleDateString() &&
              startD.getTime() >= new Date().getTime()
                ? true
                : false
            schedule.timeValue = timeVal
            schedule.time = startD.getTime()
            switch (schedule.repeat_interval) {
              case "triweekly":
              case "biweekly":
                schedule.completed = savedData.length > 0 ? true : false
                let type = schedule.repeat_interval === "triweekly" ? triweekly : biweekly
                if (type.indexOf(dayNumber) > -1) {
                  currentFeed.push(schedule)
                  selectedWeekViewDays = selectedWeekViewDays.concat(getDates(type, date))
                }
                break
              case "weekly":
                schedule.completed = savedData.length > 0 ? true : false
                let dayNo = getDayNumber(new Date(scheduleStartDate))
                if (dayNo === dayNumber) {
                  currentFeed.push(schedule)
                  selectedWeekViewDays = selectedWeekViewDays.concat(new Date(date).toLocaleDateString())
                }
                break
              case "daily":
              case "hourly":
              case "every3h":
              case "every6h":
              case "every12h":
                if (schedule.repeat_interval === "daily") {
                  schedule.completed = savedData.length > 0 ? true : false
                  currentFeed.push(schedule)
                } else {
                  let startTime = scheduledDate.getTime()
                  const hourVal =
                    schedule.repeat_interval === "hourly"
                      ? 1 * 60 * 60 * 1000
                      : schedule.repeat_interval === "every3h"
                      ? 3 * 60 * 60 * 1000
                      : schedule.repeat_interval === "every6h"
                      ? 6 * 60 * 60 * 1000
                      : 12 * 60 * 60 * 1000

                  let endTime = currentDate.getTime() + 86400000

                  startTime =
                    currentDate.toLocaleDateString() === new Date(startTime).toLocaleDateString()
                      ? startTime
                      : endTime - ((currentDate.getTime() - startTime) % hourVal) - 86400000

                  let intervalStart, intervalEnd
                  let time
                  let completedVal
                  let clickableVal
                  for (let start = startTime; start <= endTime; start = start + hourVal) {
                    let newDateVal = new Date(start)
                    if (newDateVal.getDate() === date.getDate()) {
                      time = getTimeValue(newDateVal)

                      intervalStart = new Date(start).getTime() - hourVal
                      intervalEnd = new Date(start).getTime()
                      let filteredData = savedData.filter(
                        (item) => item.timestamp >= intervalStart && item.timestamp <= intervalEnd
                      )

                      completedVal = filteredData.length > 0 ? true : false
                      clickableVal =
                        new Date().toLocaleDateString() === new Date(date).toLocaleDateString() &&
                        new Date().getTime() >= intervalStart &&
                        new Date().getTime() <= intervalEnd
                          ? true
                          : false
                      let each = {
                        ...schedule,
                        clickable: clickableVal,
                        completed: completedVal,
                        timeValue: time,
                        time: newDateVal.getTime(),
                      }
                      currentFeed.push(each)
                    }
                  }
                }
                selectedWeekViewDays = selectedWeekViewDays.concat(getDates(daily, date))
                break
              case "custom":
                schedule.custom_time.map((time, index) => {
                  let scheduledDate = new Date(currentDate)
                  scheduledDate.setHours(new Date(time).getHours())
                  scheduledDate.setMinutes(new Date(time).getMinutes())

                  let nextScheduleDate = new Date(currentDate)
                  if (schedule.custom_time.length > 0 && index > 0) {
                    nextScheduleDate.setHours(new Date(schedule.custom_time[index - 1]).getHours())
                    nextScheduleDate.setMinutes(new Date(schedule.custom_time[index - 1]).getMinutes())
                  }

                  let filteredData = savedData.filter(
                    (item) =>
                      item.timestamp <= scheduledDate.getTime() &&
                      (schedule.custom_time.length > 0 && index > 0
                        ? item.timestamp >= nextScheduleDate.getTime()
                        : true)
                  )
                  let completedVal = filteredData.length > 0 ? true : false
                  let each = {
                    ...schedule,
                    clickable:
                      new Date().toLocaleDateString() === new Date(currentDate).toLocaleDateString() &&
                      scheduledDate.getTime() >= new Date().getTime()
                        ? true
                        : false,
                    completed: completedVal,
                    timeValue: getTimeValue(new Date(time)),
                    time: scheduledDate.getTime(),
                  }
                  currentFeed.push(each)
                })
                selectedWeekViewDays = selectedWeekViewDays.concat(new Date(date).toLocaleDateString())
                break
              case "monthly":
                schedule.completed = savedData.length > 0 ? true : false
                if (new Date(date).getDate() === new Date(scheduleStartDate).getDate()) {
                  schedule.timeValue = getTimeValue(scheduleTime)
                  currentFeed.push(schedule)
                }
                selectedWeekViewDays.concat(new Date(scheduleStartDate).toLocaleTimeString())
                break
              case "bimonthly":
                schedule.completed = savedData.length > 0 ? true : false
                if ([10, 20].indexOf(new Date(date).getDate()) > -1) {
                  schedule.timeValue = getTimeValue(scheduleTime)
                  currentFeed.push(schedule)
                  selectedWeekViewDays = selectedWeekViewDays.concat(
                    new Date(new Date().getFullYear + "-" + new Date().getMonth + 1 + "-" + 10).toLocaleDateString()
                  )
                  selectedWeekViewDays = selectedWeekViewDays.concat(
                    new Date(new Date().getFullYear + "-" + new Date().getMonth + 1 + "-" + 20).toLocaleDateString()
                  )
                }
                break
              case "none":
                schedule.completed = savedData.length > 0 ? true : false
                if (new Date(currentDate).toLocaleDateString() === new Date(scheduleStartDate).toLocaleDateString()) {
                  schedule.timeValue = getTimeValue(scheduleTime)
                  currentFeed.push(schedule)
                }
                selectedWeekViewDays = selectedWeekViewDays.concat(new Date(scheduleStartDate).toLocaleDateString())
                break
            }
          }
        })
      })
      //   console.log(tip)
      //  currentFeed.push(tip)
      let goalsFeedData = checkDataForFeed(date, goals, currentFeed, selectedWeekViewDays)
      currentFeed = goalsFeedData.feed
      selectedWeekViewDays = goalsFeedData.weekDays
      let medicationsData = checkDataForFeed(date, medications, currentFeed, selectedWeekViewDays)
      currentFeed = medicationsData.feed
      selectedWeekViewDays = medicationsData.weekDays
      let selectedDays = selectedWeekViewDays.filter((n, i) => selectedWeekViewDays.indexOf(n) === i)
      setSelectedDays(selectedDays)
      currentFeed = currentFeed.sort((x, y) => x.time - y.time)
      return currentFeed
    }
  }

  useEffect(() => {
    if (events !== null) {
      let currentFeeds = getDetails()
      setCurrentFeed(currentFeeds)
      setLoading(false)
    }
  }, [events])

  const getFeedByDate = (date: Date) => {
    let feeds = activities.filter((activity) => (activity?.schedule || [])?.length > 0)
    setFeeds(feeds)
    changeDate(new Date(date))
    ;(async () => {
      await getEvents(date).then(setEvents)
    })()
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
          data[key].time = new Date(data[key].timeValue).getTime()
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
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
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
                  >
                    <Card
                      className={feed.completed ? classes[feed.group + "Completed"] : classes[feed.group]}
                      variant="outlined"
                      onClick={() => {
                        if (!feed.completed && feed.clickable && feed.time >= new Date().getTime()) {
                          setIndex(index)
                          if (feed.group == "assess") {
                            setSurveyName(feed.title)
                            setVisibleActivities([feed.activityData])
                            showFeedDetails(feed.group)
                          }
                          if (feed.group == "learn") {
                            setTitle(feed.data[0].title)
                            setDetails(feed.data[0].text)
                            setIndex(index)
                            setIcon(<SleepTips />)
                            showFeedDetails(feed.group)
                          }
                          if (feed.group == "manage") {
                            if (games.includes(feed.type)) {
                              setActivityName(feed.title)
                              setActivityId(feed.activityData.id)
                              setVisibleActivities(feed.activityData)
                              showFeedDetails("game")
                            } else {
                              setOpenNotImplemented(true)
                            }
                          }
                        } else if (!feed.completed && feed.clickable) {
                          getFeedByDate(date)
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
                          {feed.icon == "Exercise" && feed.group === "goals" ? (
                            <Exercise width="80" height="80" />
                          ) : feed.icon == "Weight" && feed.group === "goals" ? (
                            <Weight width="80" height="80" />
                          ) : feed.icon == "Nutrition" && feed.group === "goals" ? (
                            <Nutrition width="80" height="80" />
                          ) : feed.icon == "Meditation" && feed.group === "goals" ? (
                            <BreatheIcon width="80" height="80" />
                          ) : feed.icon == "Sleep" && feed.group === "goals" ? (
                            <Sleeping width="80" height="80" />
                          ) : feed.icon == "Reading" && feed.group === "goals" ? (
                            <Reading width="80" height="80" />
                          ) : feed.icon == "Finances" && feed.group === "goals" ? (
                            <Savings width="80" height="80" />
                          ) : feed.group === "goals" && feed.icon == "Mood" ? (
                            <Emotions width="80" height="80" />
                          ) : feed.icon == "Medication" && feed.group === "goals" ? (
                            <Medication width="80" height="80" />
                          ) : feed.icon == "Custom" && feed.group === "goals" ? (
                            <Custom width="80" height="80" />
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
                          ) : feed.icon === "Mood" && feed.group === "assess" ? (
                            <AssessMood width="80" height="80" />
                          ) : feed.icon === "Sleep and Social" && feed.group === "assess" ? (
                            <AssessSleep width="80" height="80" />
                          ) : feed.icon === "Anxiety" && feed.group === "assess" ? (
                            <AssessAnxiety width="80" height="80" />
                          ) : feed.icon === "App Usability" && feed.group === "assess" ? (
                            <AssessUsability width="80" height="80" />
                          ) : feed.icon === "Water and Nutrition" && feed.group === "assess" ? (
                            <AssessNutrition width="80" height="80" />
                          ) : feed.icon === "sleep_tip" ? (
                            <SleepTips width="80" height="80" />
                          ) : feed.icon === "Psychosis and Social" && feed.group === "assess" ? (
                            <AssessSocial width="80" height="80" />
                          ) : feed.type === "lamp.jewels_a" || feed.type === "lamp.jewels_b" ? (
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
                // getFeedByDate(new Date(e))
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
            game: (
              <EmbeddedActivity
                name={activityName}
                activity={visibleActivities}
                participant={participant}
                onComplete={() => {
                  completeFeed(index)
                  setLaunchedActivity(undefined)
                }}
              />
            ),
          }[launchedActivity ?? ""]
        }
      </ResponsiveDialog>
      <Dialog
        open={openNotImplemented}
        onClose={() => setOpenNotImplemented(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>This activity is not yet available in mindLAMP 2.</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNotImplemented(false)} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
