// Core Imports
import React, { useState, useEffect } from "react"
import {
  Typography,
  makeStyles,
  Box,
  Slide,
  useMediaQuery,
  useTheme,
  Button,
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
} from "@material-ui/core"
// Local Imports
import { ReactComponent as Lotus } from "../icons/Lotus.svg"
import { ReactComponent as ThumbsUp } from "../icons/ThumbsUp.svg"
import { ReactComponent as ThumbsDown } from "../icons/ThumbsDown.svg"
import Link from "@material-ui/core/Link"
import classnames from "classnames"

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
    "& h5": {
      color: "rgba(0, 0, 0, 0.75)",
      textAlign: "center",
      fontWeight: "600",
      fontSize: 18,
      width: "100%",
    },
  },
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
      textDecoration: "none",
    },
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
    margin: "50px auto",
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
  inhale_exhale: { position: "relative", height: 100 },
  InhaleContainer: {
    display: "block",
    animation: "$InhaleText 8s ease infinite",
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
    animation: "$ExhaleText 8s ease infinite",
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
}))

// function CircularProgressWithLabel(props: CircularProgressProps & { value: number }) {
//   return (
//     <Box position="relative" display="inline-flex">
//       <CircularProgress variant="static" {...props} />
//       <Box
//         top={0}
//         left={0}
//         bottom={0}
//         right={0}
//         position="absolute"
//         display="flex"
//         alignItems="center"
//         justifyContent="center"
//       >
//         <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(
//           props.value,
//         )}%`}</Typography>
//       </Box>
//     </Box>
//   );
// }

// function CircularStatic() {
//   const [progress, setProgress] = React.useState(10);

//   React.useEffect(() => {
//     const timer = setInterval(() => {
//       setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));
//     }, 800);
//     return () => {
//       clearInterval(timer);
//     };
//   }, []);

//   return <CircularProgressWithLabel value={progress} />;
// }

export default function Breathe({ ...props }) {
  const classes = useStyles()
  const [started, setStarted] = useState(false)
  const [progressValue, setProgressValue] = useState(0)
  const supportsSidebar = useMediaQuery(useTheme().breakpoints.up("md"))
  const [tab, _setTab] = useState(0)
  const [status, setStatus] = useState("Yes")

  const tabDirection = (currentTab) => {
    return supportsSidebar ? "up" : "left"
  }
  const handleNext = () => {
    setStarted(!started)
    _setTab(tab + 1)
  }

  const setValueUpdate = () => {
    let val = progressValue + 15 //0.8
    setProgressValue(val > 100 ? 100 : val)
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
        handleNext()
      }
    }
  }, [progressValue])

  const handleClickStatus = (statusVal: string) => {
    setStatus(statusVal)
  }
  return (
    <div className={classes.root}>
      <AppBar position="static" style={{ background: "#FBF1EF", boxShadow: "none" }}>
        <Toolbar className={classes.toolbardashboard}>
          <IconButton onClick={props.onComplete} color="default" className={classes.backbtn} aria-label="Menu">
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
                <Button className={classes.btnpeach} onClick={handleNext}>
                  Start
                </Button>
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
            <Grid item>
              <Box className={classes.Face}>
                <Box className={classes.Circle} />
                <Box className={classes.Circle} />
                <Box className={classes.Circle} />
                <Box className={classes.Circle} />
                <Box className={classes.Circle} />
                <Box className={classes.Circle} />
              </Box>
              <Box mt={5} className={classes.inhale_exhale}>
                <Typography variant="overline" className={classes.InhaleContainer}>
                  Inhale
                </Typography>
                <Typography variant="overline" className={classes.ExhaleContainer}>
                  Exhale
                </Typography>
              </Box>
            </Grid>
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
