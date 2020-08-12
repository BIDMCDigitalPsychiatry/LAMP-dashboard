// Core Imports
import React, { useState } from "react"
import {
  Container,
  Typography,
  Grid,
  Card,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  ButtonBase,
  AppBar,
  Toolbar,
  Icon,
} from "@material-ui/core"
import { Link as RouterLink } from "react-router-dom"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import { Participant as ParticipantObj } from "lamp-core"
import CloseIcon from "@material-ui/icons/Close"
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
import NewGoals from "./NewGoal"

import classnames from "classnames"
import Link from "@material-ui/core/Link"

const demoActivities = {
  "Balloon Risk": "balloonrisk",
  "Box Game": "boxgame",
  "Cats n Dogs": "catsndogs",
  "Dot Touch": "dottouch",
  Jewels: "jewels",
  "Pop The Bubbles": "popthebubbles",
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backbtn: { paddingLeft: 0, paddingRight: 0 },
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
    linkButton: {
      padding: "15px 25px 15px 25px",
    },
    cardlabel: {
      fontSize: 14,

      padding: "0 18px",
      bottom: 8,
      position: "absolute",
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        bottom: 30,
      },
    },

    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    dialogueStyle: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    header: {
      background: "#FFEFEC",
      padding: "25px 20px 10px",
      textAlign: "center",

      "& h2": {
        fontSize: 25,
        fontWeight: 600,
        color: "rgba(0, 0, 0, 0.75)",
        textAlign: "left",
      },
      "& h6": {
        fontSize: "14px",
        fontWeight: "normal",
        textAlign: "left",
      },
    },
    scratch: {
      "& h2": {
        textAlign: "center !important",
      },
      "& h6": {
        textAlign: "center !important",
      },
    },
    btnpeach: {
      background: "#FFAC98",
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
    topicon: {
      minWidth: 120,
    },
    dialogueContent: {
      padding: 20,
      "& h4": { fontSize: 16, fontWeight: "bold", marginBottom: 15 },
    },
    dialogtitle: { padding: 0 },
    manage: {
      background: "#FFEFEC",
      padding: "10px 0",
      minHeight: 105,
      textAlign: "center",
      boxShadow: "none",
      borderRadius: 10,
      position: "relative",
      width: "100%",
      "& svg": {
        [theme.breakpoints.up("lg")]: {
          width: 150,
          height: 150,
          marginTop: 20,
        },
        [theme.breakpoints.down("md")]: {
          width: 130,
          height: 130,
          marginTop: 20,
        },
        [theme.breakpoints.down("xs")]: {
          width: 60,
          height: 60,
          marginTop: 0,
        },
      },

      [theme.breakpoints.up("sm")]: {
        minHeight: 230,
      },
      [theme.breakpoints.up("lg")]: {
        minHeight: 240,
      },
    },
    thumbMain: { maxWidth: 255 },
    thumbContainer: { maxWidth: 1055 },
    fullwidthBtn: { width: "100%" },
    goalHeading: {
      textAlign: "center",
      "& h5": { fontSize: 18, fontWeight: 600, margin: "25px 0 15px", color: "rgba(0, 0, 0, 0.75)" },
      "& h6": {
        fontSize: 14,
        color: "rgba(0, 0, 0, 0.4)",
        marginBottom: 15,
      },
    },
  })
)

export default function Goals({ ...props }) {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const [dialogueType, setDialogueType] = React.useState("")
  const [launchedActivity, setLaunchedActivity] = useState<string>()
  const [embeddedActivity, setEmbeddedActivity] = useState<string>()
  const [classType, setClassType] = useState("")
  const [goalType, setGoalType] = useState("")

  const handleClickOpen = (type: string) => {
    setGoalType(type)
    setDialogueType(type)
    let classT = type === "Scratch card" ? classnames(classes.header, classes.scratch) : classes.header
    setClassType(classT)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const activateEmbeddedActivity = async (id) => {
    let response = await fetch(
      `https://raw.githubusercontent.com/BIDMCDigitalPsychiatry/LAMP-activities/master/dist/out/${id}.html.b64`
    )
    setEmbeddedActivity(atob(await response.text()))
  }

  return (
    <div>
      <AppBar position="static" style={{ background: "#FBF1EF", boxShadow: "none" }}>
        <Toolbar className={classes.toolbardashboard}>
          <IconButton onClick={props.onComplete} color="default" className={classes.backbtn} aria-label="Menu">
            <Icon>arrow_back</Icon>
          </IconButton>
          <Typography variant="h5">Create goal</Typography>
        </Toolbar>
      </AppBar>
      <Box className={classes.goalHeading}>
        <Typography variant="h5">What type of goal?</Typography>
        <Typography variant="subtitle1">Choose a category</Typography>
      </Box>
      <Container className={classes.thumbContainer}>
        <Grid container spacing={2}>
          <Grid
            item
            xs={4}
            sm={4}
            md={3}
            lg={3}
            onClick={() => handleClickOpen("Exercise")}
            className={classes.thumbMain}
          >
            <ButtonBase focusRipple className={classes.fullwidthBtn}>
              <Card className={classes.manage}>
                <Box>
                  <Exercise />
                </Box>
                <Typography className={classes.cardlabel}>Exercise</Typography>
              </Card>
            </ButtonBase>
          </Grid>
          <Grid
            item
            xs={4}
            sm={4}
            md={3}
            lg={3}
            onClick={() => handleClickOpen("Weight")}
            className={classes.thumbMain}
          >
            <ButtonBase focusRipple className={classes.fullwidthBtn}>
              <Card className={classes.manage}>
                <Box>
                  <Weight />
                </Box>
                <Typography className={classes.cardlabel}>Weight</Typography>
              </Card>
            </ButtonBase>
          </Grid>
          <Grid
            item
            xs={4}
            sm={4}
            md={3}
            lg={3}
            onClick={() => handleClickOpen("Nutrition")}
            className={classes.thumbMain}
          >
            <ButtonBase focusRipple className={classes.fullwidthBtn}>
              <Card className={classes.manage}>
                <Box>
                  <Nutrition />
                </Box>
                <Typography className={classes.cardlabel}>Nutrition</Typography>
              </Card>
            </ButtonBase>
          </Grid>
          <Grid item xs={4} sm={4} md={3} lg={3} onClick={() => handleClickOpen("Sleep")} className={classes.thumbMain}>
            <ButtonBase focusRipple className={classes.fullwidthBtn}>
              <Card className={classes.manage}>
                <Box>
                  <Sleeping />
                </Box>
                <Typography className={classes.cardlabel}>Sleep</Typography>
              </Card>
            </ButtonBase>
          </Grid>
          <Grid
            item
            xs={4}
            sm={4}
            md={3}
            lg={3}
            onClick={() => handleClickOpen("Medication")}
            className={classes.thumbMain}
          >
            <ButtonBase focusRipple className={classes.fullwidthBtn}>
              <Card className={classes.manage}>
                <Box>
                  <BreatheIcon />
                </Box>
                <Typography className={classes.cardlabel}>Medication</Typography>
              </Card>
            </ButtonBase>
          </Grid>
          <Grid
            item
            xs={4}
            sm={4}
            md={3}
            lg={3}
            onClick={() => handleClickOpen("Reading")}
            className={classes.thumbMain}
          >
            <ButtonBase focusRipple className={classes.fullwidthBtn}>
              <Card className={classes.manage}>
                <Box>
                  <Reading />
                </Box>
                <Typography className={classes.cardlabel}>Reading</Typography>
              </Card>
            </ButtonBase>
          </Grid>
          <Grid
            item
            xs={4}
            sm={4}
            md={3}
            lg={3}
            onClick={() => handleClickOpen("Finances")}
            className={classes.thumbMain}
          >
            <ButtonBase focusRipple className={classes.fullwidthBtn}>
              <Card className={classes.manage}>
                <Box>
                  <Savings />
                </Box>
                <Typography className={classes.cardlabel}>Finances</Typography>
              </Card>
            </ButtonBase>
          </Grid>
          <Grid item xs={4} sm={4} md={3} lg={3} onClick={() => handleClickOpen("Mood")} className={classes.thumbMain}>
            <ButtonBase focusRipple className={classes.fullwidthBtn}>
              <Card className={classes.manage}>
                <Box mt={1}>
                  <Emotions />
                </Box>
                <Typography className={classes.cardlabel}>Mood</Typography>
              </Card>
            </ButtonBase>
          </Grid>

          <Grid
            item
            xs={4}
            sm={4}
            md={3}
            lg={3}
            onClick={() => handleClickOpen("Meditation")}
            className={classes.thumbMain}
          >
            <ButtonBase focusRipple className={classes.fullwidthBtn}>
              <Card className={classes.manage}>
                <Box>
                  <Meditation />
                </Box>
                <Typography className={classes.cardlabel}>Meditation</Typography>
              </Card>
            </ButtonBase>
          </Grid>
          <Grid
            item
            xs={4}
            sm={4}
            md={3}
            lg={3}
            onClick={() => handleClickOpen("Custom")}
            className={classes.thumbMain}
          >
            <ButtonBase focusRipple className={classes.fullwidthBtn}>
              <Card className={classes.manage}>
                <Box>
                  <Custom />
                </Box>
                <Typography className={classes.cardlabel}>Custom</Typography>
              </Card>
            </ButtonBase>
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
          <NewGoals
            goalType={goalType}
            onComplete={() => {
              setOpen(false)
            }}
          />
        </ResponsiveDialog>

        {/* <ResponsiveDialog
        transient
        animate
        fullScreen
        open={!!embeddedActivity}
        onClose={() => {
          setEmbeddedActivity(undefined)
        }}
      >
        <div style={{ display: "flex", width: "100%", height: "100%", flexDirection: "column", overflow: "hidden" }}>
          <iframe
            style={{ flexGrow: 1, border: "none", margin: 0, padding: 0 }}
            sandbox="allow-scripts"
            allow="accelerometer; ambient-light-sensor; autoplay; battery; camera; display-capture; geolocation; gyroscope; magnetometer; microphone; oversized-images; sync-xhr; usb; wake-lock;"
            srcDoc={embeddedActivity}
          />
        </div>
      </ResponsiveDialog>
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
            Journals: (
              <JournalEntries
                onComplete={() => {
                  setOpen(false)
                  setLaunchedActivity(undefined)
                }}
              />
            ),
            Scratch_card: (
              <ScratchImage
                onComplete={() => {
                  setOpen(false)
                  setLaunchedActivity(undefined)
                }}
              />
            ),
            Breathe: (
              <Breathe
                onComplete={() => {
                  setOpen(false)
                  setLaunchedActivity(undefined)
                }}
              />
            ),
            jewels: <Jewels onComplete={() => setLaunchedActivity(undefined)} />,
            resources: <Resources onComplete={() => setLaunchedActivity(undefined)} />,
            medicationtracker: <MedicationTracker onComplete={() => setLaunchedActivity(undefined)} />,
          }[launchedActivity ?? ""]
        }
      </ResponsiveDialog>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        className={classes.dialogueStyle}
      >
        <DialogTitle id="alert-dialog-slide-title" className={classes.dialogtitle}>
          <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
          <div className={classType}>
            {dialogueType === "Breathe" && <BreatheIcon className={classes.topicon} />}
            {dialogueType === "Scratch_card" && (
              <Box>
                <ScratchCard className={classes.topicon} />
                <Typography variant="h6">Meditation exercises</Typography>
              </Box>
            )}
            {dialogueType === "Journals" && <JournalIcon className={classes.topicon} />}
            <Typography variant="h2">{dialogueType.replace(/_/g, " ")}</Typography>
          </div>
        </DialogTitle>
        <DialogContent className={classes.dialogueContent}>
          {dialogueType === "Breathe" && (
            <Typography variant="h4" gutterBottom>
              Breathing exercise (2 mins)
            </Typography>
          )}

          {dialogueType === "Scratch_card" && (
            <Box textAlign="center">Swipe your finger around the screen to reveal the image hidden underneath</Box>
          )}
          {dialogueType === "Breathe" && (
            <Typography variant="body2" color="textSecondary" component="p">
              Follow the motion of the lotus flower opening and closing to control your breaths in and out.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Box textAlign="center" width={1} mt={1} mb={4}>
            <Link
              onClick={() => {
                setLaunchedActivity(dialogueType)
              }}
              underline="none"
              className={classnames(classes.btnpeach, classes.linkButton)}
            >
              Begin
            </Link>
          </Box>
        </DialogActions>
      </Dialog> */}
      </Container>
    </div>
  )
}
