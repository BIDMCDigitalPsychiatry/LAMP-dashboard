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

// Perform event coalescing/grouping by sensor or activity type.
async function getActivityEvents(
  participant: ParticipantObj,
  _activities: ActivityObj[]
): Promise<{ [groupName: string]: ActivityEventObj[] }> {
  let original = (await LAMP.ActivityEvent.allByParticipant(participant.id))
    .map((x) => ({
      ...x,
      activity: _activities.find((y) => x.activity === y.id),
    }))

    .sort((x, y) => x.timestamp - y.timestamp)
    .map((x) => ({
      ...x,
      activity: (x.activity || { name: "" }).name,
    }))
    .groupBy("activity") as any
  let customEvents = _activities
    .filter((x) => x.spec === "lamp.dashboard.custom_survey_group")
    .map((x) =>
      x?.settings?.map((y, idx) =>
        original?.[y.activity]
          ?.map((z) => ({
            idx: idx,
            timestamp: z.timestamp,
            duration: z.duration,
            activity: x.name,
            slices: z.temporal_slices.find((a) => a.item === y.question),
          }))
          .filter((y) => y.slices !== undefined)
      )
    )
    .filter((x) => x !== undefined)
    .flat(2)
    .groupBy("activity")
  let customGroups = Object.entries(customEvents).map(([k, x]) => [
    k,
    Object.values(x.groupBy("timestamp")).map((z: any) => ({
      timestamp: z?.[0].timestamp,
      duration: z?.[0].duration,
      activity: z?.[0].activity,
      static_data: {},
      temporal_slices: Array.from(
        z?.reduce((prev, curr) => ({ ...prev, [curr.idx]: curr.slices }), {
          length:
            z
              .map((a) => a.idx)
              .sort()
              .slice(-1)[0] + 1,
        })
      ).map((a) => (a === undefined ? {} : a)),
    })),
  ])
  return Object.fromEntries([...Object.entries(original), ...customGroups])
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
  const [completed, setCompleted] = useState([])
  const [open, setOpen] = useState(false)
  const [feeds, setFeeds] = useState([])
  const [selectedDays, setSelectedDays] = useState([1, 2, 15])
  const [data, setData] = useState({})
  const [medications, setMedications] = useState({})
  const [feedData, setFeedData] = useState([])
  const [schedules, setSchedules] = useState({})
  const [activities, setActivities] = React.useState([])
  const [activityEvents, setActivityEvents] = React.useState({})
  const [currentFeed, setCurrentFeed] = React.useState([])
  const triweekly = [1, 3, 5]
  const biweekly = [2, 4]

  const markCompleted = (event: any, index: number) => {
    if (event.target.closest("div").className.indexOf("MuiStep-root") > -1) {
      setCompleted({ ...completed, [index]: true })
    }
  }

  const getFeedData = async (type: string) => {
    setData(
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
      )
    )
  }

  const getFeeds = async () => {
    setFeeds(
      Object.fromEntries(
        (
          await Promise.all(
            [participant.id || ""].map(async (x) => [x, await LAMP.Type.getAttachment(x, "lamp.feed").catch((e) => [])])
          )
        )
          .filter((x: any) => x[1].message !== "404.object-not-found")
          .map((x: any) => [x[0], x[1].data])
      )
    )
  }

  const setInitialData = async () => {
    await getFeedData("lamp.feed.goals")
    await getFeeds()
  }

  useEffect(() => {
    setInitialData()
    ;(async () => {
      let activities = await getActivities(participant)
      setActivities(activities)
      let feeds = []
      let schedule
      activities.map((activity) => {
        schedule = activity?.schedule ?? []
        if (schedule.length > 0) feeds.push(activity)
      })
      setFeeds(feeds)
    })()
  }, [])

  function currentDay() {
    let date = new Date()
    return date.getDay()
  }

  const getFeedByDate = (date: Date) => {
    let currentFeed = []
    // feeds.map((feed) => {
    //   //currentFeed.
    //   feed.schedule.map((s) => {

    //   }
    //   // schedule = activity?.schedule ?? []
    //   // if(schedule.length > 0)
    //   //   feeds.push(activity)
    // })
  }

  const showFeedDetails = (type) => {
    if (type == "learn") {
      setOpen(true)
    }
  }

  return (
    <div className={classes.root}>
      {!supportsSidebar && <WeekView type="feed" onselect={getFeedByDate} />}

      <Grid container className={classes.thumbContainer}>
        <Grid item xs>
          <Stepper
            orientation="vertical"
            classes={{ root: classes.customstepper }}
            connector={<StepConnector classes={{ root: classes.customstepperconnecter }} />}
          >
            {feedData.map((label, index) => (
              <Step>
                <StepLabel
                  StepIconProps={{
                    completed: completed[index],
                    classes: {
                      root: classnames(classes.stepIcon, classes[label.type + "Icon"]),
                      active: classes.stepActiveIcon,
                      completed: classes[label.type + "CompletedIcon"],
                    },
                  }}
                  onClick={(e) => markCompleted(e, index)}
                >
                  <Card
                    className={completed[index] ? classes[label.type + "Completed"] : classes[label.type]}
                    variant="outlined"
                    onClick={() => showFeedDetails(label.type)}
                  >
                    <Grid container spacing={0}>
                      <Grid xs container justify="center" direction="column" className={classes.feedtasks} spacing={0}>
                        <Box m={1}>
                          <Typography variant="body2" color="textSecondary">
                            <Box fontStyle="italic" className={classes.smalltext}>
                              {label.time.getTime()}
                            </Box>
                          </Typography>
                          <Typography variant="h5">{label.title}</Typography>
                          <Typography className={classes.smalltext} color="textSecondary">
                            {label.description}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid container justify="center" direction="column" className={classes.image}>
                        {label.type === "goal" &&
                          (label.icon == "Exercise" ? (
                            <Exercise />
                          ) : label.icon == "Weight" ? (
                            <Weight />
                          ) : label.icon == "Nutrition" ? (
                            <Nutrition />
                          ) : label.icon == "Medication" ? (
                            <BreatheIcon />
                          ) : label.icon == "Sleep" ? (
                            <Sleeping />
                          ) : label.icon == "Reading" ? (
                            <Reading />
                          ) : label.icon == "Finances" ? (
                            <Savings />
                          ) : label.icon == "Mood" ? (
                            <Emotions />
                          ) : label.icon == "Meditation" ? (
                            <Meditation />
                          ) : (
                            <Custom />
                          ))}
                        {label.icon === "sad-happy" && <SadHappy />}
                        {label.icon === "medication" && <Medication />}
                        {label.icon === "pencil" && <PencilPaper />}
                        {label.icon === "board" && <SadBoard />}
                        {label.icon === "linegraph" && <LineGraph />}
                      </Grid>
                    </Grid>
                  </Card>
                </StepLabel>
                {index !== feedData.length - 1 && (
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
