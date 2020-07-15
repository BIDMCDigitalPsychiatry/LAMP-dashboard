// Core Imports
import React, { useState, useEffect } from "react"
import {
  Container,
  Typography,
  Grid,
  Card,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  DialogActions,
  IconButton,
} from "@material-ui/core"
import { Link as RouterLink } from "react-router-dom"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import LAMP, { Participant as ParticipantObj } from "lamp-core"
import CloseIcon from "@material-ui/icons/Close"
import { ReactComponent as BreatheIcon } from "../icons/Breathe.svg"
import { ReactComponent as JournalIcon } from "../icons/Journal.svg"
import { ReactComponent as JewelsIcon } from "../icons/Jewels.svg"
import { ReactComponent as HopeBoxIcon } from "../icons/HopeBox.svg"
import { ReactComponent as Medication } from "../icons/Medication.svg"
import Jewels from "./Jewels"
import MedicationTracker from "./MedicationTracker"
import Hopebox from "./Hopebox"

import ResponsiveDialog from "./ResponsiveDialog"
import Journal from "./Journal"
import Resources from "./Resources"

import classnames from "classnames"
import Link from "@material-ui/core/Link"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
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
    assess: {
      background: "#E7F8F2",
      padding: "10px 0",
      minHeight: 180,
      textAlign: "center",
      boxShadow: "none",
      borderRadius: 18,
      position: "relative",
    },
    MuiDialogPaperScrollPaper: {
      maxHeight: "100% !important",
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
    surveytextarea: {
      padding: 20,
      "& h4": { fontSize: 16, fontWeight: "bold", marginBottom: 15 },
    },
    dialogtitle: { padding: 0 },
    gotit: {
      color: "#6083E7",
      fontSize: "16px",
      marginTop: "20px",
      padding: "25px",
    },
    ribbonText: {
      fontSize: "16px",
      color: "rgba(0, 0, 0, 0.75)",
      fontWeight: "bold",
      marginBottom: "30px",
    },
    manage: {
      background: "#FFEFEC",
      padding: "10px 0",
      minHeight: 180,
      textAlign: "center",
      boxShadow: "none",
      borderRadius: 18,
      position: "relative",
    },
  })
)

function _hideCareTeam() {
  return (LAMP.Auth._auth.serverAddress || "").includes(".psych.digital")
}
function _patientMode() {
  return LAMP.Auth._type === "participant"
}
function _shouldRestrict() {
  return _patientMode() && _hideCareTeam()
}

export default function Manage({ participant, ...props }: { participant: ParticipantObj }) {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const [dialogueType, setDialogueType] = React.useState("")
  const [launchedActivity, setLaunchedActivity] = useState<string>()

  const handleClickOpen = (type: string) => {
    setDialogueType(type)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={6} md={4} lg={3} onClick={() => handleClickOpen("Breathe")}>
          <Card className={classes.manage}>
            <Box mt={2} mb={1}>
              <BreatheIcon />
            </Box>
            <Typography className={classes.cardlabel}>Breathe</Typography>
          </Card>
        </Grid>
        <Grid item xs={6} md={4} lg={3} onClick={() => handleClickOpen("Jewels")}>
          <Card className={classes.manage}>
            <Box mt={2} mb={1}>
              <JewelsIcon />
            </Box>
            <Typography className={classes.cardlabel}>Jewels</Typography>
          </Card>
        </Grid>
        <Grid item xs={6} md={4} lg={3} onClick={() => handleClickOpen("Journals")}>
          <Card className={classes.manage}>
            <Box mt={2} mb={1}>
              <JournalIcon />
            </Box>
            <Typography className={classes.cardlabel}>Journal</Typography>
          </Card>
        </Grid>
        <Grid item xs={6} md={4} lg={3} onClick={() => handleClickOpen("HopeBox")}>
          <Card className={classes.manage}>
            <Box mt={1}>
              <HopeBoxIcon />
            </Box>
            <Typography className={classes.cardlabel}>Hope Box</Typography>
          </Card>
        </Grid>
        <Grid item xs={6} md={4} lg={3} onClick={() => handleClickOpen("Medication Tracker")}>
          <Card className={classes.manage}>
            <Box mt={2} mb={1}>
              <Medication />
            </Box>
            <Typography className={classes.cardlabel}>Medication Tracker</Typography>
          </Card>
        </Grid>
      </Grid>
      <ResponsiveDialog
        transient
        animate
        fullScreen
        open={!!launchedActivity}
        onClose={() => {
          setLaunchedActivity(undefined)
        }}
      >
        {
          {
            jewels: <Jewels onComplete={() => setLaunchedActivity(undefined)} />,
            journal: <Journal onComplete={() => setLaunchedActivity(undefined)} />,
            hopebox: <Hopebox onComplete={() => setLaunchedActivity(undefined)} />,
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
          <div className={classes.header}>
            {dialogueType == "Breathe" && <BreatheIcon className={classes.topicon} />}
            {dialogueType == "Jewels" && <JewelsIcon className={classes.topicon} />}
            {dialogueType == "Journals" && <JournalIcon className={classes.topicon} />}
            {dialogueType == "HopeBox" && <HopeBoxIcon className={classes.topicon} />}
            {dialogueType == "Medication Tracker" && <Medication className={classes.topicon} />}
            <Typography variant="h6">Games</Typography>
            <Typography variant="h2">{dialogueType}</Typography>
          </div>
        </DialogTitle>
        <DialogContent className={classes.surveytextarea}>
          <Typography variant="h4" gutterBottom>
            Breathing exercise (2 mins)
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Follow the motion of the lotus flower opening and closing to control your breaths in and out.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Box textAlign="center" width={1} mt={1} mb={4}>
            <Link
              component={RouterLink}
              to="/participant/me/breathe"
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
