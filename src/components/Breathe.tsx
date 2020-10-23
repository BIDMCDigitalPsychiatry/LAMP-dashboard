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
  FormControlLabel,
  Checkbox,
} from "@material-ui/core"
import { CheckboxProps } from "@material-ui/core/Checkbox"
import LAMP from "lamp-core"

// Local Imports
import { ReactComponent as Lotus } from "../icons/Lotus.svg"
import { ReactComponent as ThumbsUp } from "../icons/ThumbsUp.svg"
import { ReactComponent as ThumbsDown } from "../icons/ThumbsDown.svg"
import Link from "@material-ui/core/Link"
import classnames from "classnames"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import CircularProgress from "@material-ui/core/CircularProgress"

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
  "@keyframes InhaleText": {
    "0%": { opacity: 0 },
    "15%": { opacity: 1 },
    "40%": { opacity: 1 },
    "50%": { opacity: 0, display: "inline" },
    "75%": { opacity: 0 },
    "100%": { opacity: 0, display: "none" },
  },

  "@keyframes ExhaleText": {
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
    animation: "$InhaleText 10s ease infinite",
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
    animation: "$ExhaleText 10s ease infinite",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    position: "absolute",
    width: "100%",
    bottom: 30,
    textTransform: "capitalize",
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
    cursor: "pointer",
    "& span": { cursor: "pointer" },
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

const PeachCheckbox = withStyles({
  root: {
    color: "#FEAC98",
    "&$checked": {
      color: "#FEAC98",
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color="default" {...props} />)

export default function Breathe({ participant, activity, ...props }) {
  const classes = useStyles()
  const [started, setStarted] = useState(false)
  const [progressValue, setProgressValue] = useState(0)
  const supportsSidebar = useMediaQuery(useTheme().breakpoints.up("md"))
  const [tab, _setTab] = useState(0)
  const [status, setStatus] = useState("Yes")
  const [progress, setProgress] = React.useState(100)
  const [progressLabel, setProgressLabel] = React.useState(4)
  const [isLoading, setIsLoading] = useState(false)
  const [inhale, setInhale] = useState(true)
  const [playMusic, setPlayMusic] = useState(true)
  const [audio, setAudio] = useState(null)

  const tabDirection = (currentTab) => {
    return supportsSidebar ? "up" : "left"
  }
  const handleNext = () => {
    _setTab(tab + 1)
    setIsLoading(true)
    if (audio) {
      audio.loop = true
      playMusic && tab < 1 ? audio.play() : audio.pause()
    }
  }

  const videoLoaded = () => {
    setIsLoading(false)
    setStarted(!started)
    setProgressUpdate()
  }
  const setProgressUpdate = () => {
    let val = progressLabel - 1
    if (val == -1) {
      setProgressLabel(4)
      setProgress(100)
      setInhale(!inhale)
    } else {
      setProgressLabel(val)
    }
  }
  useEffect(() => {
    ;(async () => {
      if (activity.settings.audio) {
        setAudio(new Audio(activity.settings.audio))
      }
    })()
  }, [])
  useEffect(() => {
    if (started) {
      setTimeout(setProgressUpdate, 1000)
      let val = progress - 25 >= 0 ? progress - 25 : 100
      setProgress(val < 0 ? 0 : val)
    }
  }, [progressLabel])

  useEffect(() => {
    if (started) {
      if (progressValue < 100) {
        let val = progressValue + 0.8
        setProgressValue(val > 100 ? 100 : val)
      } else {
        setStarted(!started)
        setPlayMusic(false)
        handleNext()
      }
    }
  }, [progress])

  const handleClickStatus = (statusVal: string) => {
    setStatus(statusVal)
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" style={{ background: "#FBF1EF", boxShadow: "none" }}>
        <Toolbar className={classes.toolbardashboard}>
          <IconButton
            onClick={() => {
              setPlayMusic(false)
              audio && audio.pause()
              setAudio(null)
              props.onComplete()
            }}
            color="default"
            aria-label="Menu"
          >
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
            {isLoading && (
              <Box alignItems="center">
                <Box width={1}>
                  <CircularProgress />
                </Box>
              </Box>
            )}
            {/* //   {isLoading && ( */}
            <Grid item className={classes.videoNav}>
              <video
                src="videos/Lotus.mp4"
                autoPlay={true}
                onLoadedData={() => {
                  videoLoaded()
                }}
                loop
                preload={"metadata"}
                //   onLoadEnd={() =>setIsLoading(false)}
              ></video>
              {started && (
                <Box className={classes.inhale_exhale}>
                  <Typography variant="overline" className={classes.ExhaleContainer}>
                    Exhale
                  </Typography>
                  <Typography variant="overline" className={classes.InhaleContainer}>
                    Inhale
                  </Typography>
                </Box>
              )}
            </Grid>
            {started && (
              <Box style={{ width: "100px", height: "100px" }}>
                {inhale && (
                  <CircularProgressbar
                    value={progress}
                    text={`${progressLabel}`}
                    strokeWidth={8}
                    styles={buildStyles({
                      strokeLinecap: "butt",
                      pathColor: "#E46759",
                      textColor: "#BC453D",
                      trailColor: "#FFAC98",
                      textSize: "45px",
                      pathTransitionDuration: 1,
                    })}
                  />
                )}
                {!inhale && (
                  <CircularProgressbar
                    value={progress}
                    text={`${progressLabel}`}
                    strokeWidth={8}
                    styles={buildStyles({
                      strokeLinecap: "butt",
                      pathColor: "#E46759",
                      textColor: "#BC453D",
                      trailColor: "#FFAC98",
                      textSize: "45px",
                      pathTransitionDuration: 1,
                    })}
                  />
                )}
              </Box>
            )}
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
