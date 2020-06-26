import React, { useState, useEffect } from "react"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"

import {
  BottomNavigationAction,
  Slide,
  Drawer,
  Card,
  Step,
  Stepper,
  StepLabel,
  Paper,
  Typography,
  CardContent,
  Icon,
  Box,
  IconButton,
  Container,
  Grid,
  StepContent,
  Button,
  useMediaQuery,
  useTheme,
  Toolbar,
  AppBar,
} from "@material-ui/core/"

import { ReactComponent as SadHappy } from "../icons/SadHappy.svg"
import { ReactComponent as Medication } from "../icons/Medicationsm.svg"
import { ReactComponent as PencilPaper } from "../icons/pencil_paper.svg"
import { ReactComponent as SadBoard } from "../icons/SadBoard.svg"
import { ReactComponent as LineGraph } from "../icons/LineGraph.svg"
import { ReactComponent as Learn } from "../icons/learn.svg"
import { ReactComponent as Assess } from "../icons/assess.svg"
import { ReactComponent as Manage } from "../icons/manage.svg"
import { ReactComponent as Prevent } from "../icons/prevent.svg"
import { ReactComponent as Message } from "../icons/message.svg"
import { ReactComponent as User } from "../icons/User.svg"
import WeekView from "./WeekView"
import LAMP from "lamp-core"
import DoneIcon from "@material-ui/icons/Done"
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    customheader: {
      backgroundColor: "white",
      boxShadow: "none",

      "& h5": { color: "#555555", fontFamily: "Inter", fontSize: 25, fontWeight: "bold" },
    },
    button: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    actionsContainer: {
      marginBottom: theme.spacing(0),
    },
    resetContainer: {
      padding: theme.spacing(3),
    },
    learn: {
      background: "#FFF9E5",
      padding: "10px",
      borderRadius: 10,
      border: 0,
    },
    assess: {
      background: "#E7F8F2",
      padding: "10px",
      borderRadius: 10,
      border: 0,
    },
    manage: {
      background: "#FFEFEC",
      padding: "10px",
      borderRadius: 10,
      border: 0,
    },
    prevent: {
      background: "#ECF4FF",
      padding: "10px",
      borderRadius: 10,
      border: 0,
    },
    toolbar: {
      minHeight: 90,
      alignItems: "flex-start",
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
    title: {
      flexGrow: 1,
      alignSelf: "flex-end",
    },
    image: {
      width: 65,
    },
    feedtasks: {
      "& h5": {
        fontSize: 16,
        fontFamily: "inter",
        fontWeight: 600,
        color: "rgba(0, 0, 0, 0.75)",
      },
    },
    smalltext: {
      fontSize: 12,
    },
    stepIcon: {
      color: "white",
      width: 32,
      height: 32,
      border: "3px solid #C6C6C6",
      borderRadius: "50%",
      marginRight: 10,
      "& text": {
        fill: "#FFF",
      },
    },
    stepIconActive: {
      color: "#C6C6C6 !important",
      border: "0px solid #C6C6C6",
      "& text": {
        fill: "#C6C6C6 !important",
      },
    },
    customstepper: {
      position: "relative",
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
  })
)

function getSteps(classes: any) {
  let feedData = [
    { type: "learn", time: "8.30am", title: "Today's tip : Mood", icon: "sad-happy", description: "" },
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
    { type: "learn", time: "8.30am", title: "Today's tip", icon: "sad-happy", description: "" },
  ]
  let stepData = []
  Object.keys(feedData).forEach((key) => {
    stepData.push(
      <Card className={classes[feedData[key].type]} variant="outlined">
        <Grid container spacing={0}>
          <Grid xs container justify="center" direction="column" className={classes.feedtasks} spacing={0}>
            <Box m={1}>
              <Typography variant="body2" color="textSecondary">
                <Box fontStyle="italic" className={classes.smalltext}>
                  {feedData[key].time}
                </Box>
              </Typography>
              <Typography variant="h5">{feedData[key].title}</Typography>
              <Typography className={classes.smalltext} color="textSecondary">
                {feedData[key].description}
              </Typography>
            </Box>
          </Grid>

          <Grid container justify="center" direction="column" className={classes.image}>
            {feedData[key].icon === "sad-happy" && <SadHappy />}
            {feedData[key].icon === "medication" && <Medication />}
            {feedData[key].icon === "pencil" && <PencilPaper />}
            {feedData[key].icon === "board" && <SadBoard />}
            {feedData[key].icon === "linegraph" && <LineGraph />}
          </Grid>
        </Grid>
      </Card>
    )
  })
  return stepData
}

function getStepContent(step: number) {
  switch (step) {
    case 0:
      return (
        <Container>
          <Typography>Focus on the good things Challenging situations and obstacles are a part of life. </Typography>
          <Typography>
            When you’re faced with one, focus on the good things no matter how small or seemingly insignificant they
            seem. If you look for it, you can always find the proverbial silver lining in every cloud — even if it’s not
            immediately obvious. For example, if someone cancels plans, focus on how it frees up time for you to catch
            up on a TV show or other activity you enjoy.
          </Typography>
        </Container>
      )
    case 1:
      return "Exercise has the ability to ease stress, improve mood, and minimize chronic pain. Working out is proven to improve and normalize the neurotransmitter levels in your body. Neurotransmitter levels increased by exercise include serotonin, dopamine, and norepinephrine. This increase in neurotransmitters has a positive impact on your mental health.s."
    case 2:
      return `Try out different ad text to see what brings in the most customers,
              and learn how to enhance your ads using features like ad extensions.
              If you run into any problems with your ads, find out how to tell if
              they're running and how to resolve approval issues.`
    default:
      return "Unknown step"
  }
}
function _patientMode() {
  return LAMP.Auth._type === "participant"
}

export default function Feed() {
  const classes = useStyles()
  const [activeStep, setActiveStep] = React.useState(0)
  const steps = getSteps(classes)
  const [tab, _setTab] = useState(_patientMode() ? 1 : 3)
  const [lastTab, _setLastTab] = useState(_patientMode() ? 1 : 3)
  const supportsSidebar = useMediaQuery(useTheme().breakpoints.up("md"))

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
  }
  const setTab = (newTab) => {
    _setLastTab(tab)
    _setTab(newTab)
  }
  const tabDirection = (currentTab) => {
    return tab > lastTab && currentTab !== tab ? (supportsSidebar ? "down" : "right") : supportsSidebar ? "up" : "left"
  }

  return (
    <div className={classes.root}>
      <AppBar className={classes.customheader}>
        <Toolbar className={classes.toolbar}>
          <Typography className={classes.title} variant="h5" noWrap>
            Feed
          </Typography>
          <IconButton aria-label="search" color="inherit">
            <Message />
          </IconButton>
          <IconButton aria-label="display more actions" edge="end" color="inherit">
            <User />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Toolbar className={classes.toolbar} />

      <WeekView />
      <Stepper activeStep={activeStep} orientation="vertical" className={classes.customstepper}>
        {steps.map((label, index) => (
          <Step>
            <StepLabel
              StepIconProps={{
                classes: { root: classes.stepIcon, active: classes.stepIconActive, completed: classes.stepIconActive },
              }}
            >
              {label}
            </StepLabel>
            <StepContent>
              <Typography>{getStepContent(index)}</Typography>
              <div className={classes.actionsContainer}>
                <div>
                  <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                    Back
                  </Button>
                  <Button variant="contained" color="primary" onClick={handleNext} className={classes.button}>
                    {activeStep === steps.length - 1 ? "Ok" : "Next"}
                  </Button>
                </div>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>

      {activeStep === steps.length && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} className={classes.button}>
            Reset
          </Button>
        </Paper>
      )}

      <Box clone displayPrint="none">
        <Drawer
          open
          anchor={supportsSidebar ? "left" : "bottom"}
          variant="permanent"
          PaperProps={{
            style: {
              flexDirection: supportsSidebar ? "column" : "row",
              justifyContent: !supportsSidebar ? "center" : undefined,
              height: !supportsSidebar ? 56 : undefined,
              width: supportsSidebar ? 80 : undefined,
              transition: "all 500ms ease-in-out",
            },
          }}
        >
          <BottomNavigationAction
            showLabel
            selected={tab === 0}
            label="Learn"
            value={0}
            icon={<Learn />}
            onChange={(_, newTab) => setTab(newTab)}
          />
          <BottomNavigationAction
            showLabel
            selected={tab === 1}
            label="Assess"
            value={1}
            icon={<Assess />}
            onChange={(_, newTab) => setTab(newTab)}
          />
          <BottomNavigationAction
            showLabel
            selected={tab === 2}
            label="Manage"
            value={2}
            icon={<Manage />}
            onChange={(_, newTab) => setTab(newTab)}
          />
          <BottomNavigationAction
            showLabel
            selected={tab === 3}
            label="Prevent"
            value={3}
            icon={<Prevent />}
            onChange={(_, newTab) => setTab(newTab)}
          />
        </Drawer>
      </Box>
    </div>
  )
}
