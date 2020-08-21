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
import ResponsiveDialog from "./ResponsiveDialog"
import WeekView from "./WeekView"
import { Participant as ParticipantObj } from "lamp-core"
import TipNotification from "./TipNotification"
import LAMP from "lamp-core"
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
      "& span": {
        fontSize: 14,
        fontWeight: "bold",
        color: "rgba(0, 0, 0, 0.75)",
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

function _patientMode() {
  return LAMP.Auth._type === "participant"
}

export default function Feed({ participant, ...props }: { participant: ParticipantObj; activeTab: Function }) {
  const classes = useStyles()
  const supportsSidebar = useMediaQuery(useTheme().breakpoints.up("md"))
  const [date, changeDate] = useState(new Date())
  const [completed, setCompleted] = useState([])
  const [open, setOpen] = useState(false)
  const [feedData, setFeedData] = useState([])
  const [selectedDays, setSelectedDays] = useState([1, 2, 15])

  const handleNext = (index: number) => {
    setCompleted({ ...completed, [index]: true })
  }

  var feed = [
    { type: "learn", time: "8.30am", title: "Today's tip: Mood", icon: "sad-happy", description: "" },
    {
      type: "manage",
      time: "8.30am",
      title: "Medication: Caplyta",
      icon: "medication",
      description: "Take one capsule (42mg)",
    },
    { type: "manage", time: "8.30am", title: "Daily journal entry", icon: "pencil", description: "" },
    { type: "assess", time: "8.30am", title: "Anxiety survey", icon: "board", description: "10mins" },
    { type: "prevent", time: "8.30am", title: "Review today’s stats", icon: "linegraph", description: "" },
  ]

  useEffect(() => {
    var feedList = []
    var goals = JSON.parse(localStorage.getItem("goals"))
    if (goals != undefined) {
      goals.map((goal) => {
        if (goal.goalName != null && goal.goalName != "" && goal.goalValue != null && goal.goalValue != "") {
          var item = {
            type: "goal",
            time: goal.reminderTime,
            title: "Goal: " + goal.goalName,
            icon: goal.goalType,
            description: goal.goalValue + " " + goal.goalUnit,
          }
          feedList.push(item)
        }
      })
    }
    var medications = JSON.parse(localStorage.getItem("medications"))
    if (medications != undefined) {
      medications.map((medication) => {
        if (medication.medicationName != null && medication.medicationName != "") {
          var item = {
            type: "manage",
            time: medication.reminderTime,
            title: "Medication: " + medication.medicationName,
            icon: "medication",
            description: "test description",
          }
          feedList.push(item)
        }
      })
    }

    feed.map((item) => {
      feedList.push(item)
    })
    setFeedData(feedList)
  }, [])

  const showFeedDetails = (type) => {
    if (type == "learn") {
      setOpen(true)
    }
  }

  return (
    <div className={classes.root}>
      {!supportsSidebar && <WeekView type="feed" />}

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
                  onClick={() => handleNext(index)}
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
                              {label.time}
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
                console.log(selectedDate)
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
