// Core Imports
import React, { useState, useEffect } from "react"
import {
  Typography,
  makeStyles,
  Box,
  Slide,
  useMediaQuery,
  useTheme,
  Container,
  LinearProgress,
  createStyles,
  withStyles,
  Theme,
  AppBar,
  Icon,
  IconButton,
  Toolbar,
  Grid,
  Fab,
} from "@material-ui/core"
// Local Imports
import { ReactComponent as Lotus } from "../icons/Lotus.svg"
import { ReactComponent as ThumbsUp } from "../icons/ThumbsUp.svg"
import { ReactComponent as ThumbsDown } from "../icons/ThumbsDown.svg"
import Link from "@material-ui/core/Link"
import classnames from "classnames"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"

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
    width: 36,
    height: 36,
    padding: 9,
    margin: "0 5px",
    "& label": {
      position: "absolute",
      bottom: -18,
      fontSize: 12,
    },
  },
  active: { background: "#FE8470" },
  toolbardashboard: {
    minHeight: 65,
    padding: "0 10px",
    "& h5": {
      color: "rgba(0, 0, 0, 0.75)",
      textAlign: "center",
      fontWeight: "600",
      fontSize: 18,
      width: "calc(100% - 96px)",
    },
  },  
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
      background: "#FFAC98",
      boxShadow:
        "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
      textDecoration: "none",
    },
  },
  
  "@keyframes ExhaleText": {
    "0%": { opacity: 0 },
    "15%": { opacity: 1 },
    "40%": { opacity: 1 },
    "50%": { opacity: 0, display: "inline" },
    "75%": { opacity: 0 },
    "100%": { opacity: 0, display: "none" },
  },

  "@keyframes InhaleText": {
    "0%": { opacity: 0 },
    "25%": { opacity: 0, display: "none" },
    "50%": { opacity: 0 },
    "65%": { opacity: 1, display: "inline" },
    "80%": { opacity: 1 },
    "100%": { opacity: 0 },
  },  
  inhale_exhale: { position: "relative", height: 50 },
  InhaleContainer: {
    display: "block",
    animation: "$InhaleText 6.135s ease infinite",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    position: "absolute",
    width: "100%",
    bottom: 30,
    textTransform: "capitalize",
  },
  ExhaleContainer: {
    display: "block",
    marginTop: "-2rem",
    animation: "$ExhaleText 6.135s ease infinite",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    position: "absolute",
    width: "100%",
    bottom: 30,
    textTransform: "capitalize",
  },
  flower: { width: "100%", maxWidth: 375 },
  breatheReview: {
    "& h4": { fontSize: 25, fontWeight: 600, marginBottom: 25 },
    "& p": { fontStyle: "italic", color: "rgba(0, 0, 0, 0.5)", margin: 15 },
  },
  progress: {
    color: "#E46759",
  },
  completed: {
    color: "#FFAC98",
  },
  videoNav: {
    "& video": {
      [theme.breakpoints.down("xs")]: {
        width: "100%",
      },
      [theme.breakpoints.up("sm")]: {
        maxWidth: 400,
      },
    },
  },
}))

export default function Breathe({ ...props }) {
  const classes = useStyles()
  const [started, setStarted] = useState(false)
  const [progressValue, setProgressValue] = useState(0)
  const supportsSidebar = useMediaQuery(useTheme().breakpoints.up("md"))
  const [tab, _setTab] = useState(0)
  const [status, setStatus] = useState("Yes")
  const [progress, setProgress] = React.useState(100)
  const [progressLabel, setProgressLabel] = React.useState(120)
  const tabDirection = (currentTab) => {
    return supportsSidebar ? "up" : "left"
  }
  const handleNext = () => {
    setStarted(!started)
    _setTab(tab + 1)
  }
  const setProgressUpdate = () => {
    let val = progressLabel - 1
    setProgressLabel(val)
  }
  useEffect(() => {
    if (started) {
      setProgressUpdate()
    }
  }, [started])

  useEffect(() => {
    let timer
    if (started) {
      if (progressLabel > 0) {
        setTimeout(setProgressUpdate, 1000)
        let val = progress - 0.83
        setProgress(val < 0 ? 0 : val)
      } else {
        handleNext()
      }
    }
  }, [progressLabel])

  useEffect(() => {
    let timer
    if (started) {
      if (progressLabel > 0) {
        let val = progressValue + 0.8
        setProgressValue(val > 100 ? 100 : val)
      }
    }
  }, [progress])

  const handleClickStatus = (statusVal: string) => {
    setStatus(statusVal)
  }
  const percentage = 66
  return (
    <div className={classes.root}>
      <AppBar position="static" style={{ background: "#FBF1EF", boxShadow: "none" }}>
        <Toolbar className={classes.toolbardashboard}>
          <IconButton onClick={props.onComplete} color="default" aria-label="Menu">
            <Icon>arrow_back</Icon>
          </IconButton>
          <Typography variant="h5">Breathe</Typography>
        </Toolbar>
        <BorderLinearProgress variant="determinate" value={progressValue} />
      </AppBar>
      <Container>
        <Slide in={tab === 0} direction={tabDirection(0)} mountOnEnter unmountOnExit>
          <Box my={4}>
            <Box textAlign="center">
              <Lotus className={classes.flower} />
              <Typography variant="h6">Get ready</Typography>
              <Box textAlign="center" px={4} pt={2} pb={5}>
                <Typography variant="body2" component="p">
                  Get yourself comfortable and when you’re ready tap the start button.
                </Typography>
              </Box>
              <Box textAlign="center" mt={1}>
                <Fab className={classes.btnpeach} onClick={handleNext}>
                  Start
                </Fab>
              </Box>
            </Box>
          </Box>
        </Slide>
        <Slide in={tab === 1} direction={tabDirection(1)} mountOnEnter unmountOnExit>
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            style={{ minHeight: "80vh" }}
          >
            <Grid item className={classes.videoNav}>
              <video src="videos/Lotus.mp4" autoPlay={true} loop></video>
              <Box className={classes.inhale_exhale}>
                <Typography variant="overline" className={classes.ExhaleContainer}>
                  Exhale
                </Typography>
                <Typography variant="overline" className={classes.InhaleContainer}>
                  Inhale
                </Typography>
              </Box>
            </Grid>
            <Box style={{ width: "100px", height: "100px" }}>
              <CircularProgressbar
                value={progress}
                text={`${progressLabel}`}
                strokeWidth={8}
                styles={buildStyles({
                  strokeLinecap: "butt",
                  pathColor: "#E46759",
                  textColor: "#BC453D",
                  trailColor: "#FFAC98",
                  textSize: "32px",
                })}
              />
            </Box>
          </Grid>
        </Slide>
        <Slide in={tab === 2} direction={tabDirection(2)} mountOnEnter unmountOnExit>
          <Box my={4}>
            <Box textAlign="center" className={classes.breatheReview}>
              <Lotus className={classes.flower} />
              <Typography variant="h4">Nicely done!</Typography>
              <div
                style={{
                  height: 3,
                  margin: "0% 20%",
                  background:
                    "linear-gradient(90deg, rgba(255,214,69,1) 0%, rgba(255,214,69,1) 25%, rgba(101,206,191,1) 25%, rgba(101,206,191,1) 50%, rgba(255,119,91,1) 50%, rgba(255,119,91,1) 75%, rgba(134,182,255,1) 75%, rgba(134,182,255,1) 100%)",
                }}
              />
              <Typography variant="body2">Was this helpful today?</Typography>
              <Box textAlign="center" mb={5}>
                <IconButton
                  onClick={() => handleClickStatus("Yes")}
                  className={status === "Yes" ? classnames(classes.likebtn, classes.active) : classes.likebtn}
                >
                  <ThumbsUp />
                  <label>Yes</label>
                </IconButton>
                <IconButton
                  onClick={() => handleClickStatus("No")}
                  className={status === "No" ? classnames(classes.likebtn, classes.active) : classes.likebtn}
                >
                  <ThumbsDown />
                  <label>No</label>
                </IconButton>
              </Box>
              <Box textAlign="center">
                <Link href="#" className={classes.btnpeach} onClick={props.onComplete}>
                  Done
                </Link>
              </Box>
            </Box>
          </Box>
        </Slide>
      </Container>
    </div>
  )
}
