// Core Imports
import React, { useState, useEffect } from "react"
import {
  Typography,
  makeStyles,
  Box,
  Slide,
  Radio,
  RadioProps,
  RadioGroup,
  FormControl,
  FormControlLabel,
  useMediaQuery,
  useTheme,
  Button,
  Container,
  TextField,
  LinearProgress,
  createStyles,
  withStyles,
  Theme,
  AppBar,
  Icon,
  IconButton,
  Toolbar,
  Grid,
  Slider,
  Step,
  Stepper,
  StepLabel,
  StepContent,
  StepConnector,
  Menu,
  MenuItem,
  ListItemText,
  ListItem,
  List,
} from "@material-ui/core"
// Local Imports
import useInterval from "./useInterval"
import { ReactComponent as Lotus } from "../icons/Lotus.svg"
import { ReactComponent as ThumbsUp } from "../icons/ThumbsUp.svg"
import { ReactComponent as ThumbsDown } from "../icons/ThumbsDown.svg"

const BorderLinearProgress = withStyles((theme: Theme) =>
  createStyles({
    root: {
      height: 5,
      borderRadius: 5,
    },
    colorPrimary: {
      backgroundColor: "#FFAC98",
    },
    bar: {
      borderRadius: 5,
      backgroundColor: "#E56F61",
    },
  })
)(LinearProgress)

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  likebtn: {
    fontStyle: "italic",
    "&:hover": { background: "#FFD645" },

    "& label": {
      position: "absolute",
      bottom: -18,
      fontSize: 12,
    },
  },
  toolbardashboard: { minHeight: 75 },
  backbtn: { paddingLeft: 0, paddingRight: 0 },
  btnpeach: {
    background: "#FFAC98",
    padding: "15px 25px 15px 25px",
    borderRadius: "40px",
    minWidth: "200px",
    boxShadow: " 0px 10px 15px rgba(255, 172, 152, 0.25)",
    lineHeight: "22px",
    display: "inline-block",
    textTransform: "capitalize",
    fontSize: "16px",
    color: "rgba(0, 0, 0, 0.75)",
    fontWeight: "bold",
    "&:hover": {
      boxShadow:
        "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
    },
  },
  lineyellow: {
    background: "#FFD645",
    height: "6px",
  },
  linegreen: {
    background: "#65CEBF",
    height: "6px",
  },
  linered: {
    background: "#FF775B",
    height: "6px",
  },
  lineblue: {
    background: "#86B6FF",
    height: "6px",
  },
  "@keyframes Pulse": {
    "0%": { transform: "scale(.15) rotate(180deg)" },
    "100%": { transform: "scale(1)" },
  },
  "@keyframes Circle1": {
    "0%": { transform: "translate(0, 0)" },
    "100%": { transform: "translate(-35px, -50px)" },
  },
  "@keyframes Circle2": {
    "0%": { transform: "translate(0, 0)" },
    "100%": { transform: "translate(35px, 50px)" },
  },
  "@keyframes Circle3": {
    "0%": { transform: "translate(0, 0)" },
    "100%": { transform: "translate(-60px, 0)" },
  },
  "@keyframes Circle4": {
    "0%": { transform: "translate(0, 0)" },
    "100%": { transform: "translate(60px, 0)" },
  },
  "@keyframes Circle5": {
    "0%": { transform: "translate(0, 0)" },
    "100%": { transform: "translate(-35px, 50px)" },
  },
  "@keyframes Circle6": {
    "0%": { transform: "translate(0, 0)" },
    "100%": { transform: "translate(35px, -50px)" },
  },
  "@keyframes InhaleText": {
    "0%": { opacity: 0 },
    "10%": { opacity: 1, display: "inline" },
    "30%": { opacity: 1 },
    "50%": { opacity: 0, display: "none" },
    "100%": { opacity: 0 },
  },
  "@keyframes ExhaleText": {
    "0%": { opacity: 0 },
    "50%": { opacity: 0 },
    "60%": { opacity: 1, display: "inline" },
    "90%": { opacity: 1 },
    "100%": { opacity: 0, display: "none" },
  },
  Background: {
    background: "#000",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  },
  Face: {
    height: "125px",
    width: "125px",
    animation: "$Pulse 4s cubic-bezier(0.5, 0, 0.5, 1) alternate infinite",
  },
  Circle: {
    height: "125px",
    width: "125px",
    borderRadius: "50%",
    position: "absolute",
    mixBlendMode: "screen",
    transform: "translate(0, 0)",
    animation: "center 6s infinite",

    "&:nth-child(odd)": { background: "#FFAC98" },
    "&:nth-child(even)": { background: "#E56F61" },
    "&:nth-child(1)": { animation: "$Circle1 4s ease alternate infinite" },
    "&:nth-child(2)": { animation: "$Circle2 4s ease alternate infinite" },
    "&:nth-child(3)": { animation: "$Circle3 4s ease alternate infinite" },
    "&:nth-child(4)": { animation: "$Circle4 4s ease alternate infinite" },
    "&:nth-child(5)": { animation: "$Circle5 4s ease alternate infinite" },
    "&:nth-child(6)": { animation: "$Circle6 4s ease alternate infinite" },
  },
  InhaleContainer: {
    display: "block",
    animation: "$InhaleText 8s ease infinite",
  },
  ExhaleContainer: {
    display: "block",
    marginTop: "-2rem",
    animation: "$ExhaleText 8s ease infinite",
  },
}))

export default function Breathe({ ...props }) {
  const classes = useStyles()
  const [started, setStarted] = useState(false)
  const [progressValue, setProgressValue] = useState(0)
  //const [playing, setPlaying] = useAudio('/calm.mp3', true, true)
  //useEffect(() => () => setPlaying(false), [])
  // useInterval(() => navigator.vibrate && navigator.vibrate([25, 400, 75, 400, 25]), 4000, true)
  const supportsSidebar = useMediaQuery(useTheme().breakpoints.up("md"))
  const [tab, _setTab] = useState(0)
  const [timer, setTimer] = useState(null)

  const tabDirection = (currentTab) => {
    return supportsSidebar ? "up" : "left"
  }
  const handleNext = () => {
    setStarted(!started)
    _setTab(tab + 1)
  }

  const setValueUpdate = () => {
    let val = progressValue + 0.8
    setProgressValue(val)
  }

  useEffect(() => {
    if (started) {
      setValueUpdate()
    }
  }, [started])

  useEffect(() => {
    if (started) {
      if (progressValue < 100) {
        setTimeout(setValueUpdate, 1000)
      } else {
        console.log("sdfg")
        handleNext()
      }
    }
  }, [progressValue])

  return (
    <div className={classes.root}>
      <AppBar position="static" style={{ background: "#FBF1EF", boxShadow: "none" }}>
        <Toolbar className={classes.toolbardashboard}>
          <IconButton
            onClick={props.goBack}
            color="default"
            className={classes.backbtn}
            aria-label="Menu"
            style={{
              marginLeft: supportsSidebar ? 64 : undefined,
            }}
          >
            <Icon>arrow_back</Icon>
          </IconButton>

          <Typography
            variant="h5"
            style={{
              marginLeft: supportsSidebar ? 64 : undefined,
              color: "rgba(0, 0, 0, 0.75)",
              textAlign: "center",
              width: "100%",
            }}
          >
            Breathe
          </Typography>
        </Toolbar>
        <BorderLinearProgress variant="determinate" value={progressValue} />
      </AppBar>
      <Container>
        <Slide in={tab === 0} direction={tabDirection(0)} mountOnEnter unmountOnExit>
          <Box my={4}>
            <Box textAlign="center">
              <Lotus />
              <Typography variant="h5">Get ready</Typography>

              <Typography variant="body2" component="p">
                Get yourself comfortable and when you’re ready tap the start button.
              </Typography>
              <Box textAlign="center" width={1} mt={1} mb={4}>
                <Button className={classes.btnpeach} onClick={handleNext}>
                  Start
                </Button>
              </Box>
            </Box>
          </Box>
        </Slide>
        <Slide in={tab === 1} direction={tabDirection(1)} mountOnEnter unmountOnExit>
          <Box my={4}>
            <Box textAlign="center">
              <Box className={classes.Face}>
                <Box className={classes.Circle} />
                <Box className={classes.Circle} />
                <Box className={classes.Circle} />
                <Box className={classes.Circle} />
                <Box className={classes.Circle} />
                <Box className={classes.Circle} />
              </Box>
              <Box style={{ marginTop: 75 }}>
                <Typography variant="overline" className={classes.InhaleContainer}>
                  Inhale
                </Typography>
                <Typography variant="overline" className={classes.ExhaleContainer}>
                  Exhale
                </Typography>
              </Box>
            </Box>
          </Box>
        </Slide>
        <Slide in={tab === 2} direction={tabDirection(2)} mountOnEnter unmountOnExit>
          <Box my={4}>
            <Box textAlign="center">
              <Lotus />
              <Typography variant="h4">Nicely done!</Typography>
              <Grid container spacing={0} style={{ marginBottom: "20px" }}>
                <Grid item xs={2} className={classes.lineyellow}></Grid>
                <Grid item xs={2} className={classes.linegreen}></Grid>
                <Grid item xs={2} className={classes.linered}></Grid>
                <Grid item xs={2} className={classes.lineblue}></Grid>
              </Grid>
              <Box fontStyle="italic" textAlign="center" fontSize={16}>
                Was this helpful today?
              </Box>
              <Box textAlign="center">
                <IconButton className={classes.likebtn}>
                  <ThumbsUp />
                  <label>Yes</label>
                </IconButton>
                <IconButton className={classes.likebtn}>
                  <ThumbsDown />
                  <label>No</label>
                </IconButton>
              </Box>
              <Box textAlign="center">
                <Button variant="contained" color="primary" className={classes.btnpeach}>
                  Done
                </Button>
              </Box>{" "}
            </Box>
          </Box>
        </Slide>
      </Container>
    </div>
  )
}
