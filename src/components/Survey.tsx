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
  IconButton,
  Button,
  DialogActions,
} from "@material-ui/core"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import LAMP, {
  Participant as ParticipantObj,
  Activity as ActivityObj,
  ActivityEvent as ActivityEventObj,
  SensorEvent as SensorEventObj,
} from "lamp-core"
import CloseIcon from "@material-ui/icons/Close"
import { ReactComponent as AssessMood } from "../icons/AssessMood.svg"
import { ReactComponent as AssessAnxiety } from "../icons/AssessAnxiety.svg"
import { ReactComponent as AssessNutrition } from "../icons/AssessNutrition.svg"
import { ReactComponent as AssessUsability } from "../icons/AssessUsability.svg"
import { ReactComponent as AssessSocial } from "../icons/AssessSocial.svg"
import { ReactComponent as AssessSleep } from "../icons/AssessSleep.svg"
import Link from "@material-ui/core/Link"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    customheader: {
      backgroundColor: "white",
      boxShadow: "none",
      "& h5": { color: "#555555", fontSize: 25, fontWeight: "bold" },
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

    preventlabel: {
      fontSize: 16,
      minHeight: 48,
      padding: "0 18px",
      marginTop: 5,
      width: "100%",
    },

    prevent: {
      background: "#ECF4FF",
      padding: "10px 0",
      minHeight: 200,
      textAlign: "center",
      boxShadow: "none",
      borderRadius: 18,
      position: "relative",
    },

    addicon: { float: "right", color: "#6083E7" },
    preventHeader: {
      "& h5": {
        fontWeight: 600,
        fontSize: 18,
        color: "rgba(0, 0, 0, 0.4)",
      },
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    addbtnmain: {
      maxWidth: 24,
      "& button": { padding: 0 },
    },
    sensorhd: {
      margin: "25px 0 15px 0",
    },
    activityhd: {
      margin: "0 0 15px 0",
    },
    maxw150: { maxWidth: 150, marginLeft: "auto", marginRight: "auto" },
    activitydatapop: {
      maxHeight: "70vh",
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
async function getActivities(participant: ParticipantObj) {
  let original = await LAMP.Activity.allByParticipant(participant.id)
  let custom =
    ((await LAMP.Type.getAttachment(participant.id, "lamp.dashboard.custom_survey_groups")) as any)?.data?.map((x) => ({
      ...x,
      spec: "lamp.dashboard.custom_survey_group",
      schedule: {},
      settings: x.settings.map((y) => ({
        ...y,
        ...original.find((z) => z.name === y.activity)?.settings.find((a) => a.text === y.question),
      })),
    })) ?? [] // original.filter((x) => x.spec !== "lamp.survey")
  return [...original, ...custom]
}
// Refresh hidden events list.
async function getHiddenEvents(participant: ParticipantObj): Promise<string[]> {
  let _hidden = (await LAMP.Type.getAttachment(participant.id, "lamp.dashboard.hidden_events")) as any
  return !!_hidden.error ? [] : (_hidden.data as string[])
}

export default function Prevent({ participant, ...props }: { participant: ParticipantObj }) {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const [dialogueType, setDialogueType] = React.useState(0)
  const [activities, setActivities] = useState([])
  const [hiddenEvents, setHiddenEvents] = React.useState([])

  const handleClickOpen = (type: number) => {
    setDialogueType(type)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }
  const [visibleActivities, setVisibleActivities] = useState([])

  useEffect(() => {
    LAMP.Activity.allByParticipant(participant.id).then(setActivities)
    getHiddenEvents(participant).then(setHiddenEvents)
  }, [])

  return (
    <Container>
      <Grid container spacing={2}>
        {[
          ...(activities || [])
            .filter((x) => x.spec === "lamp.survey" && (_shouldRestrict() ? x.name.includes("SELF REPORT") : true))
            .map((y) => (
              // <Link component={RouterLink} to={`/participant/${participant.id}/prevent-data`} underline="none">
              <Grid item xs={6} md={4} lg={3} onClick={() => setVisibleActivities([y])}>
                <Card className={classes.assess}>
                  <Box mt={1} mb={1}>
                    {y.name == "Mood" && <AssessMood />}
                    {y.name == "Sleep and Social" && <AssessSleep />}
                    {y.name == "Anxiety" && <AssessAnxiety />}
                    {y.name == "App Usability" && <AssessUsability />}
                    {y.name == "Water and Nutrition" && <AssessNutrition />}
                    {y.name == "Psychosis and Social" && <AssessSocial />}
                  </Box>
                  <Typography className={classes.cardlabel}>{y.name}</Typography>
                </Card>
              </Grid>
              // </Link>
            )),
        ]}
      </Grid>

      <Dialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        className={classes.activitydatapop}
      >
        <DialogTitle id="alert-dialog-slide-title">
          {dialogueType === 0 ? "Activity data" : "Sensor Data"}
          <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
          <Box mt={2}>
            <Typography>Choose the data you want to see in your dashboard.</Typography>
          </Box>
        </DialogTitle>
        <DialogContent dividers={false}></DialogContent>
        <DialogActions>
          <Box textAlign="center" width={1} mt={1} mb={1}>
            <Button onClick={handleClose} color="primary">
              Done
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
