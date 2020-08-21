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
    "&:hover": { background: "#FE8470" },
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
      [theme.breakpoints.up("sm")]: {
        textAlign: "left",
      },
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

  flower: { width: "100%", maxWidth: 375 },
  breatheReview: {
    "& h4": { fontSize: 25, fontWeight: 600, marginBottom: 25, marginTop: -50 },
    "& p": { fontStyle: "italic", color: "rgba(0, 0, 0, 0.5)", margin: 15 },
  },
  progress: {
    color: "#E46759",
  },
  completed: {
    color: "#FFAC98",
  },
  videoNav: {
    marginBottom: 30,
    "& video": {
      [theme.breakpoints.down("xs")]: {
        width: "100%",
      },
      [theme.breakpoints.up("sm")]: {
        maxWidth: 400,
      },
    },
  },
  lineyellow: {
    background: "#FFD645",
    height: "3px",
  },
  linegreen: {
    background: "#65CEBF",
    height: "3px",
  },
  linered: {
    background: "#FF775B",
    height: "3px",
  },
  lineblue: {
    background: "#86B6FF",
    height: "3px",
  },
  colorLine: { maxWidth: 115 },
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
              {supportsSidebar && (
                <Box pt={4}>
                  <Typography variant="h6">Prepare yourself</Typography>
                  <Box textAlign="center" px={4} pt={2}>
                    <Typography variant="body2" component="p">
                      Get yourself comfortable and when you’re ready tap the start button.
                    </Typography>
                    <Lotus className={classes.flower} />
                  </Box>
                </Box>
              )}
              {!supportsSidebar && (
                <Box>
                  <Lotus className={classes.flower} />
                  <Typography variant="h6">Get ready</Typography>
                  <Box textAlign="center" px={4} pt={2} pb={5}>
                    <Typography variant="body2" component="p">
                      Get yourself comfortable and when you’re ready tap the start button.
                    </Typography>
                  </Box>
                </Box>
              )}
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
              <Box mt={4} mb={2}>
                <Grid container direction="row" justify="center" alignItems="center">
                  <Grid container className={classes.colorLine} spacing={0} xs={4} md={4} lg={2}>
                    <Grid item xs={3} className={classes.lineyellow}></Grid>
                    <Grid item xs={3} className={classes.linegreen}></Grid>
                    <Grid item xs={3} className={classes.linered}></Grid>
                    <Grid item xs={3} className={classes.lineblue}></Grid>
                  </Grid>
                </Grid>
              </Box>
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
              <Box textAlign="center" pt={4}>
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
