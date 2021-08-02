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
  Icon,
} from "@material-ui/core/"
import { DatePicker } from "@material-ui/pickers"
import classnames from "classnames"
import InfoIcon from "../icons/Info.svg"
import ResponsiveDialog from "./ResponsiveDialog"
import WeekView from "./WeekView"
import SurveyInstrument from "./SurveyInstrument"
import EmbeddedActivity from "./EmbeddedActivity"
import GroupActivity from "./GroupActivity"
import LAMP, {
  Participant as ParticipantObj,
  Activity as ActivityObj,
  ActivityEvent as ActivityEventObj,
} from "lamp-core"
import { MuiPickersUtilsProvider } from "@material-ui/pickers"
import DateFnsUtils from "@date-io/date-fns"
import { useTranslation } from "react-i18next"

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
      [theme.breakpoints.up("lg")]: {
        width: 85,
      },
      // marginRight: "10px",
      "& div": {
        width: 60,
        height: 60,
        [theme.breakpoints.up("lg")]: {
          width: 80,
          height: 80,
        },
      },
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
      padding: "15px 18px 18px 28px",
      [theme.breakpoints.down("sm")]: {
        paddingTop: 40,
        paddingLeft: 16,
      },
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
      padding: "0px 0 0 50px",
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
    // thumbContainer: { maxWidth: 1055, margin: "0 auto" },
    thumbContainer: {
      maxWidth: 1055,
      width: "80%",
      margin: "0 auto",
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        paddingBottom: 80,
      },
    },
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
    blankMsg: {
      padding: "0 14px",
      "& path": { fill: "#666" },
      "& p": { margin: "2px 5px" },
    },
  })
)
const games = [
  "lamp.jewels_a",
  "lamp.jewels_b",
  "lamp.spatial_span",
  "lamp.cats_and_dogs",
  "lamp.pop_the_bubbles",
  "lamp.balloon_risk",
]

function CalendarView({ selectedDays, date, changeDate, getFeedByDate, ...props }) {
  const classes = useStyles()
  return (
    <MuiPickersUtilsProvider utils={LocalizedUtils}>
      <DatePicker
        autoOk
        disableToolbar
        orientation="landscape"
        variant="static"
        openTo="date"
        value={date}
        onChange={() => {}}
        onMonthChange={(e) => {
          getFeedByDate(new Date(e))
        }}
        renderDay={(date, selectedDate, isInCurrentMonth, dayComponent) => {
          const isSelected = isInCurrentMonth && selectedDays.includes(date.toLocaleDateString())
          const isActiveDate = selectedDate.getDate() === date.getDate() ? true : false
          const view = isSelected ? (
            <div onClick={() => getFeedByDate(date)}>
              <span className={isActiveDate ? classes.currentDay : classes.selectedDay}>{dayComponent}</span>
            </div>
          ) : isActiveDate ? (
            <span onClick={() => getFeedByDate(date)} className={classes.currentDay}>
              {dayComponent}
            </span>
          ) : (
            <span onClick={() => getFeedByDate(date)} className={classes.day}>
              {dayComponent}
            </span>
          )
          return view
        }}
        leftArrowIcon={<Icon>arrow_back_ios</Icon>}
        rightArrowIcon={<Icon>arrow_forward_ios</Icon>}
      />
    </MuiPickersUtilsProvider>
  )
}
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
  const [feeds, setFeeds] = useState([])
  const [selectedDays, setSelectedDays] = useState([])
  const [launchedActivity, setLaunchedActivity] = useState<string>()
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
  const [activityName, setActivityName] = useState(null)
  const [loading, setLoading] = useState(true)
  const [openNotImplemented, setOpenNotImplemented] = useState(false)
  const [activity, setActivity] = useState(null)
  const { t } = useTranslation()
  const completeFeed = (index: number) => {
    let feed = currentFeed
    feed[index].completed = true
    setCurrentFeed(feed)
  }

  useEffect(() => {
    getFeedByDate(new Date())
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

  const getDates = (type: any, seldate: Date) => {
    var curr = new Date(seldate)
    let month = curr.getMonth()
    let days = []
    if (curr.getTime() <= new Date(date).getTime()) {
      if (curr.getTime() <= new Date(date).getTime() && new Date(date).getMonth() !== month) {
        curr.setDate(1)
      }
      curr.setMonth(new Date(date).getMonth())
      curr.setFullYear(new Date(date).getFullYear())
      while (new Date(curr).getMonth() === new Date(date).getMonth()) {
        if (type === daily) {
          days.push(new Date(curr).toLocaleDateString())
        }
        if (
          (type === triweekly && triweekly.includes(curr.getDay())) ||
          (type === biweekly && biweekly.includes(curr.getDay()))
        ) {
          days.push(new Date(curr).toLocaleDateString())
        }
        curr.setDate(curr.getDate() + 1)
      }
    }
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
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)
    let selectedWeekViewDays = []
    let scheduleTime, scheduleStartDate
    let savedData = []
    if ((feeds || []).length > 0) {
      let dayNumber = getDayNumber(date)
      feeds.map((feed) => {
        let currentDate = new Date(date)
        let startD = new Date(date)
        savedData = events.filter((event) => event.activity === feed.id)
        feed.schedule.map((schedule) => {
          scheduleStartDate = new Date(schedule.start_date)
          scheduleStartDate.setHours(0)
          scheduleStartDate.setMinutes(0)
          scheduleStartDate.setSeconds(0)
          currentDate.setDate(1)
          if (currentDate.getTime() < scheduleStartDate.getTime()) {
            currentDate = new Date(schedule.start_date)
          }
          currentDate.setHours(0)
          currentDate.setMinutes(0)
          currentDate.setSeconds(0)
          let endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
          if (scheduleStartDate.getTime() <= endDate.getTime()) {
            scheduleTime = new Date(schedule.time)
            let timeVal = getTimeValue(scheduleTime)
            startD.setHours(scheduleTime.getHours())
            startD.setMinutes(scheduleTime.getMinutes())
            startD.setSeconds(0)
            let scheduledDate = new Date(scheduleStartDate)
            let scDate = new Date(scheduleStartDate)
            scDate.setHours(0)
            scDate.setMinutes(0)
            scDate.setSeconds(0)
            scheduledDate.setHours(scheduleTime.getHours())
            scheduledDate.setMinutes(scheduleTime.getMinutes())
            schedule.group =
              feed.spec === "lamp.survey" || feed.spec === "lamp.group"
                ? "assess"
                : feed.spec === "lamp.tips"
                ? "learn"
                : "manage"
            schedule.type = feed.spec
            schedule.title = feed.name
            schedule.activityData = JSON.parse(JSON.stringify(feed))
            schedule.clickable =
              new Date().toLocaleDateString() === new Date(date).toLocaleDateString() &&
              startD.getTime() <= new Date().getTime()
                ? true
                : false
            schedule.timeValue = timeVal
            schedule.time = startD.getTime()
            let first = new Date(currentDate)
            first.setHours(0)
            first.setMinutes(0)
            first.setSeconds(0)
            let end = new Date(endDate)
            end.setHours(12)
            let feedCheck = false
            switch (schedule.repeat_interval) {
              case "triweekly":
              case "biweekly":
                schedule.completed = savedData.length > 0 ? true : false
                let type = schedule.repeat_interval === "triweekly" ? triweekly : biweekly
                while (first.getTime() <= end.getTime()) {
                  let dayNum = first.getDay()
                  if (type.indexOf(dayNum) > -1) {
                    feedCheck = type.indexOf(dayNumber) > -1 && date.getTime() >= scDate.getTime() ? true : false
                    selectedWeekViewDays = selectedWeekViewDays.concat(new Date(first).toLocaleDateString())
                  }
                  first.setDate(first.getDate() + 1)
                }
                if (feedCheck) currentFeed.push(schedule)
                break
              case "weekly":
                schedule.completed = savedData.length > 0 ? true : false
                let dayNo = getDayNumber(new Date(scheduleStartDate))
                while (first.getTime() <= end.getTime()) {
                  let dayNum = first.getDay()
                  if (dayNo === dayNum) {
                    feedCheck = dayNo === dayNumber && date.getTime() >= scDate.getTime() ? true : false
                    selectedWeekViewDays = selectedWeekViewDays.concat(new Date(first).toLocaleDateString())
                  }
                  first.setDate(first.getDate() + 1)
                }
                if (feedCheck) currentFeed.push(schedule)
                break
              case "daily":
              case "hourly":
              case "every3h":
              case "every6h":
              case "every12h":
                while (first.getTime() <= end.getTime()) {
                  if (date.toLocaleDateString() === first.toLocaleDateString()) {
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

                      let endTime = date.getTime() + 86400000

                      startTime =
                        date.toLocaleDateString() === new Date(startTime).toLocaleDateString()
                          ? startTime
                          : endTime - ((date.getTime() - startTime) % hourVal) - 86400000
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
                  }
                  selectedWeekViewDays = selectedWeekViewDays.concat(new Date(first).toLocaleDateString())
                  first.setDate(first.getDate() + 1)
                }
                break
              case "custom":
                while (first.getTime() <= end.getTime()) {
                  if (date.toLocaleDateString() === first.toLocaleDateString()) {
                    schedule.custom_time.map((time, index) => {
                      let scheduledDate = new Date(first)
                      scheduledDate.setHours(new Date(time).getHours())
                      scheduledDate.setMinutes(new Date(time).getMinutes())
                      let nextScheduleDate = new Date(first)
                      if (schedule.custom_time.length > 0 && !!schedule.custom_time[index + 1]) {
                        nextScheduleDate.setHours(new Date(schedule.custom_time[index + 1]).getHours())
                        nextScheduleDate.setMinutes(new Date(schedule.custom_time[index + 1]).getMinutes())
                      }

                      let filteredData = savedData.filter(
                        (item) =>
                          item.timestamp >= scheduledDate.getTime() &&
                          (schedule.custom_time.length > 0 && !!schedule.custom_time[index + 1]
                            ? item.timestamp <= nextScheduleDate.getTime()
                            : true)
                      )
                      let completedVal = filteredData.length > 0 ? true : false
                      let each = {
                        ...schedule,
                        clickable:
                          new Date().toLocaleDateString() === new Date(date).toLocaleDateString() &&
                          scheduledDate.getTime() <= new Date().getTime() &&
                          (schedule.custom_time.length > 0 && !!schedule.custom_time[index + 1]
                            ? new Date().getTime() <= nextScheduleDate.getTime()
                            : true),
                        completed: completedVal,
                        timeValue: getTimeValue(new Date(time)),
                        time: scheduledDate.getTime(),
                      }

                      currentFeed.push(each)
                    })
                    selectedWeekViewDays = selectedWeekViewDays.concat(new Date(first).toLocaleDateString())
                  }
                  first.setDate(first.getDate() + 1)
                }
                break
              case "monthly":
                schedule.completed = savedData.length > 0 ? true : false
                while (first.getTime() <= end.getTime()) {
                  if (new Date(first).getDate() === new Date(scheduleStartDate).getDate()) {
                    schedule.timeValue = getTimeValue(scheduleTime)
                    feedCheck =
                      new Date(date).getDate() === new Date(scheduleStartDate).getDate() &&
                      date.getTime() >= scDate.getTime()
                        ? true
                        : false
                    selectedWeekViewDays = selectedWeekViewDays.concat(new Date(first).toLocaleDateString())
                  }
                  first.setDate(first.getDate() + 1)
                }
                if (feedCheck) currentFeed.push(schedule)
                break
              case "bimonthly":
                schedule.completed = savedData.length > 0 ? true : false
                while (first.getTime() <= end.getTime()) {
                  if ([10, 20].indexOf(new Date(first).getDate()) > -1) {
                    schedule.timeValue = getTimeValue(scheduleTime)
                    feedCheck =
                      [10, 20].indexOf(new Date(date).getDate()) > -1 && date.getTime() >= scDate.getTime()
                        ? true
                        : false
                    selectedWeekViewDays = selectedWeekViewDays.concat(
                      new Date(
                        new Date(first).getFullYear + "-" + new Date(first).getMonth + 1 + "-" + 10
                      ).toLocaleDateString()
                    )
                    selectedWeekViewDays = selectedWeekViewDays.concat(
                      new Date(
                        new Date(first).getFullYear + "-" + new Date(first).getMonth + 1 + "-" + 20
                      ).toLocaleDateString()
                    )
                  }
                  first.setDate(first.getDate() + 1)
                }
                if (feedCheck) currentFeed.push(schedule)
                break
              case "none":
                schedule.completed = savedData.length > 0 ? true : false
                while (first.getTime() <= end.getTime()) {
                  if (new Date(first).toLocaleDateString() === new Date(scheduleStartDate).toLocaleDateString()) {
                    schedule.timeValue = getTimeValue(scheduleTime)
                    feedCheck =
                      new Date(date).toLocaleDateString() === new Date(scheduleStartDate).toLocaleDateString()
                        ? true
                        : false
                    selectedWeekViewDays = selectedWeekViewDays.concat(new Date(first).toLocaleDateString())
                  }
                  first.setDate(first.getDate() + 1)
                }
                if (feedCheck) currentFeed.push(schedule)
                break
            }
          }
        })
      })
      setSelectedDays(selectedWeekViewDays)
      currentFeed = currentFeed.sort((x, y) => {
        return x.time > y.time ? 1 : x.time < y.time ? -1 : 0
      })
      return currentFeed
    } else {
      return (currentFeed = [])
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
    setLoading(true)
    let feeds = activities.filter((activity) => (activity?.schedule || [])?.length > 0)
    setFeeds(feeds)
    changeDate(new Date(date))
    getEvents(date).then(setEvents)
  }

  const showFeedDetails = (type) => {
    ;(async () => {
      // let iconData = ((await LAMP.Type.getAttachment(activity.id, "lamp.dashboard.activity_details")) as any) || []
      // setIcon(iconData.data ? iconData.data.icon : undefined)
      setLaunchedActivity(type)
    })()
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
          {loading == false ? (
            currentFeed.length != 0 ? (
              ""
            ) : (
              <Box display="flex" className={classes.blankMsg} ml={1}>
                <Icon>info</Icon>
                <p>{t("There are no scheduled activities available.")}</p>
              </Box>
            )
          ) : (
            " "
          )}
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
                        if (
                          !feed.completed &&
                          feed.clickable &&
                          ((["hourly", "every3h", "every6h", "every12h", "custom"].includes(feed.repeat_interval) &&
                            feed.time >= new Date().getTime()) ||
                            (!["hourly", "every3h", "every6h", "every12h"].includes(feed.repeat_interval) &&
                              feed.time <= new Date().getTime()))
                        ) {
                          setIndex(index)
                          setActivity(feed.activityData)
                          if (feed.type == "lamp.survey") {
                            setSurveyName(feed.title)
                            setVisibleActivities([feed.activityData])
                            showFeedDetails(feed.type)
                          }
                          if (
                            games.includes(feed.type) ||
                            feed.type === "lamp.journal" ||
                            feed.type === "lamp.recording" ||
                            feed.type === "lamp.breathe" ||
                            feed.type === "lamp.dbt_diary_card" ||
                            feed.type === "lamp.scratch_image" ||
                            feed.type === "lamp.tips"
                          ) {
                            setActivityName(feed.title)
                            setVisibleActivities(feed.activityData)
                            showFeedDetails("game")
                          } else {
                            setLaunchedActivity(feed.type)
                          }
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
                            <Typography variant="h5">{t(feed.title)}</Typography>
                            <Typography className={classes.smalltext} color="textSecondary">
                              {feed.spec}
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid container justify="center" direction="column" className={classes.image}>
                          <Box
                            style={{
                              margin: "auto",
                              background: feed.icon
                                ? `url(${feed.icon}) center center/contain no-repeat`
                                : `url(${InfoIcon}) center center/contain no-repeat`,
                            }}
                          ></Box>
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
          <CalendarView selectedDays={selectedDays} date={date} getFeedByDate={getFeedByDate} changeDate={changeDate} />
        </Grid>
      </Grid>
      <ResponsiveDialog
        transient={false}
        animate
        fullScreen
        open={!!launchedActivity}
        onClose={() => {
          setLaunchedActivity(undefined)
        }}
      >
        {
          {
            "lamp.survey": (
              <SurveyInstrument
                participant={participant}
                type={surveyName}
                fromPrevent={false}
                group={visibleActivities}
                onComplete={submitSurvey}
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
            "lamp.group": (
              <GroupActivity
                activity={activity}
                participant={participant}
                submitSurvey={submitSurvey}
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
        <DialogContent>{t("This activity is not yet available in mindLAMP 2.")}</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNotImplemented(false)} color="primary">
            {t("Ok")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
