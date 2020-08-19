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
} from "@material-ui/core"
import { Link as RouterLink } from "react-router-dom"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import { Participant as ParticipantObj } from "lamp-core"
import CloseIcon from "@material-ui/icons/Close"
import { ReactComponent as BreatheIcon } from "../icons/Breathe.svg"
import { ReactComponent as JournalIcon } from "../icons/Journal.svg"
import { ReactComponent as GoalIcon } from "../icons/Goal.svg"
import { ReactComponent as HopeBoxIcon } from "../icons/HopeBox.svg"
import { ReactComponent as MedicationIcon } from "../icons/Medication.svg"
import { ReactComponent as InfoIcon } from "../icons/Info.svg"
import Jewels from "./Jewels"
import ScratchImage from "./ScratchImage"
import MedicationTracker from "./MedicationTracker"
import { ReactComponent as ScratchCard } from "../icons/ScratchCard.svg"
import ResponsiveDialog from "./ResponsiveDialog"
import Resources from "./Resources"
import classnames from "classnames"
import Link from "@material-ui/core/Link"
import JournalEntries from "./JournalEntries"
import Breathe from "./Breathe"
import Goals from "./Goals"
import HopeBoxSelect from "./HopeBoxSelect"
import NewMedication from "./NewMedication"

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
    linkButton: {
      padding: "15px 25px 15px 25px",
    },
    cardlabel: {
      fontSize: 16,

      padding: "0 18px",
      bottom: 15,
      position: "absolute",
      width: "100%",
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
      minWidth: 150,
      minHeight: 150,
      [theme.breakpoints.up("lg")]: {
        width: 150,
        height: 150,
      },
    },
    dialogueContent: {
      padding: 20,
      "& h4": { fontSize: 16, fontWeight: "bold", marginBottom: 15 },
    },
    dialogtitle: { padding: 0 },
    manage: {
      background: "#FFEFEC",
      padding: "10px 0",
      minHeight: 180,
      textAlign: "center",
      boxShadow: "none",
      borderRadius: 18,
      position: "relative",
      width: "100%",
      "& svg": {
        [theme.breakpoints.up("lg")]: {
          width: 150,
          height: 150,
        },
      },

      [theme.breakpoints.up("lg")]: {
        minHeight: 240,
      },
    },
    thumbMain: { maxWidth: 255 },
    thumbContainer: { maxWidth: 1055 },
    fullwidthBtn: { width: "100%" },
    dialogueCurve: { borderRadius: 10 },
  })
)

export default function Manage({ participant, ...props }: { participant: ParticipantObj; activeTab: Function }) {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const [dialogueType, setDialogueType] = React.useState("")
  const [launchedActivity, setLaunchedActivity] = useState<string>()
  const [embeddedActivity, setEmbeddedActivity] = useState<string>()
  const [classType, setClassType] = useState("")

  const handleClickOpen = (type: string) => {
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
    <Container className={classes.thumbContainer}>
      <Grid container spacing={2}>
        <Grid item xs={6} sm={4} md={3} lg={3} onClick={() => handleClickOpen("Breathe")} className={classes.thumbMain}>
          <ButtonBase focusRipple className={classes.fullwidthBtn}>
            <Card className={classes.manage}>
              <Box mt={2} mb={1}>
                <BreatheIcon />
              </Box>
              <Typography className={classes.cardlabel}>Breathe</Typography>
            </Card>
          </ButtonBase>
        </Grid>
        <Grid
          item
          xs={6}
          sm={4}
          md={3}
          lg={3}
          onClick={() => handleClickOpen("Journals")}
          className={classes.thumbMain}
        >
          <ButtonBase focusRipple className={classes.fullwidthBtn}>
            <Card className={classes.manage}>
              <Box mt={2} mb={1}>
                <JournalIcon />
              </Box>
              <Typography className={classes.cardlabel}>Journal</Typography>
            </Card>
          </ButtonBase>
        </Grid>
        <Grid item xs={6} sm={4} md={3} lg={3} onClick={() => handleClickOpen("Goals")} className={classes.thumbMain}>
          <ButtonBase focusRipple className={classes.fullwidthBtn}>
            <Card className={classes.manage}>
              <Box mt={2} mb={1}>
                <GoalIcon />
              </Box>
              <Typography className={classes.cardlabel}>New goal</Typography>
            </Card>
          </ButtonBase>
        </Grid>
        <Grid item xs={6} sm={4} md={3} lg={3} onClick={() => handleClickOpen("HopeBox")} className={classes.thumbMain}>
          <ButtonBase focusRipple className={classes.fullwidthBtn}>
            {/* <Link
              component={RouterLink}
              to={`/participant/${participant.id}/hopebox`}
              underline="none"
              className={classes.fullwidthBtn}
            > */}
            <Card className={classes.manage}>
              <Box mt={1}>
                <HopeBoxIcon />
              </Box>
              <Typography className={classes.cardlabel}>Hope box</Typography>
            </Card>
            {/* </Link> */}
          </ButtonBase>
        </Grid>
        <Grid
          item
          xs={6}
          sm={4}
          md={3}
          lg={3}
          onClick={() => handleClickOpen("Scratch_card")}
          className={classes.thumbMain}
        >
          <ButtonBase focusRipple className={classes.fullwidthBtn}>
            <Card className={classes.manage}>
              <Box mt={2} mb={1}>
                <ScratchCard width="100" height="100" />
              </Box>
              <Typography className={classes.cardlabel}>Scratch card</Typography>
            </Card>
          </ButtonBase>
        </Grid>
        <Grid
          item
          xs={6}
          sm={4}
          md={3}
          lg={3}
          onClick={() => handleClickOpen("Medication_tracker")}
          className={classes.thumbMain}
        >
          <ButtonBase focusRipple className={classes.fullwidthBtn}>
            <Card className={classes.manage}>
              <Box mt={2} mb={1}>
                <MedicationIcon />
              </Box>
              <Typography className={classes.cardlabel}>Medication tracker</Typography>
            </Card>
          </ButtonBase>
        </Grid>
        {Object.entries(demoActivities).map((entry) => (
          <Grid
            item
            xs={6}
            sm={4}
            md={3}
            lg={3}
            onClick={() => activateEmbeddedActivity(entry[1])}
            className={classes.thumbMain}
          >
            <ButtonBase focusRipple className={classes.fullwidthBtn}>
              <Card className={classes.manage}>
                <Box mt={2} mb={1}>
                  <InfoIcon />
                </Box>
                <Typography className={classes.cardlabel}>{entry[0]}</Typography>
              </Card>
            </ButtonBase>
          </Grid>
        ))}
      </Grid>
      <ResponsiveDialog
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
            Goals: (
              <Goals
                onComplete={() => {
                  setOpen(false)
                  setLaunchedActivity(undefined)
                }}
              />
            ),
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
            HopeBox: (
              <HopeBoxSelect
                onComplete={() => {
                  setOpen(false)
                  setLaunchedActivity(undefined)
                }}
              />
            ),
            jewels: <Jewels onComplete={() => setLaunchedActivity(undefined)} />,
            resources: <Resources onComplete={() => setLaunchedActivity(undefined)} />,
            Medication_tracker: <NewMedication onComplete={() => setLaunchedActivity(undefined)} />,
          }[launchedActivity ?? ""]
        }
      </ResponsiveDialog>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        classes={{
          root: classes.dialogueStyle,
          paper: classes.dialogueCurve,
        }}
      >
        <DialogTitle id="alert-dialog-slide-title" className={classes.dialogtitle}>
          <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
          <div className={classType}>
            <Box mt={2} mb={1}>
              {dialogueType === "Breathe" && <BreatheIcon className={classes.topicon} />}
              {dialogueType === "Goals" && <GoalIcon className={classes.topicon} />}
              {dialogueType === "Scratch_card" && <ScratchCard className={classes.topicon} />}
              {dialogueType === "Journals" && <JournalIcon className={classes.topicon} />}
              {dialogueType === "HopeBox" && <HopeBoxIcon className={classes.topicon} />}
              {dialogueType === "Medication_tracker" && <MedicationIcon className={classes.topicon} />}
            </Box>
            <Typography variant="body2" align="left">
              Games
            </Typography>
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
      </Dialog>
    </Container>
  )
}
