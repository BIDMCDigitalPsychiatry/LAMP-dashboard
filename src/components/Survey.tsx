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
  CardContent,
  Button,
  DialogActions,
} from "@material-ui/core"
import { Link as RouterLink } from "react-router-dom"

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
    MuiDialogPaperScrollPaper: {
      maxHeight: "100% !important",
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
    header: {
      background: "#E7F8F2",
      padding: 20,

      "& h2": {
        fontSize: 25,
        fontWeight: 600,
        color: "rgba(0, 0, 0, 0.75)",
      },
    },
    tipscontentarea: {
      padding: 20,
      "& h3": {
        fontWeight: "bold",
        fontSize: "16px",
        marginBottom: "15px",
      },
      "& p": {
        fontSize: "16px",
        lineheight: "24px",

        color: "rgba(0, 0, 0, 0.75)",
      },
    },
    btngreen: {
      background: "#92E7CA",
      borderRadius: "40px",
      minWidth: "200px",
      boxShadow: " 0px 10px 15px rgba(146, 231, 202, 0.25)",
      lineHeight: "38px",
      marginTop: "15%",

      textTransform: "capitalize",
      fontSize: "16px",
      color: "rgba(0, 0, 0, 0.75)",
      "&:hover": { background: "#cea000" },
    },
    topicon: {
      minWidth: 200,
      minHeight: 200,
      marginLeft: "50px",
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
  const [dialogueType, setDialogueType] = React.useState("")
  const [activities, setActivities] = useState([])

  const handleClickOpen = (type: string) => {
    setDialogueType(type)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    LAMP.Activity.allByParticipant(participant.id).then(setActivities)
  }, [])

  return (
    <Container>
      <Grid container spacing={2}>
        {[
          ...(activities || [])
            .filter((x) => x.spec === "lamp.survey" && (_shouldRestrict() ? x.name.includes("SELF REPORT") : true))
            .map((y) => (
              <Grid item xs={6} md={4} lg={3} onClick={() => handleClickOpen(y.name)}>
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
        classes={{ paperScrollPaper: classes.MuiDialogPaperScrollPaper }}
      >
        <DialogTitle id="alert-dialog-slide-title">
          <div className={classes.header}>
            {dialogueType == "Mood" && <AssessMood className={classes.topicon} />}
            {dialogueType == "Sleep and Social" && <AssessSleep className={classes.topicon} />}
            {dialogueType == "Anxiety" && <AssessAnxiety className={classes.topicon} />}
            {dialogueType == "App Usability" && <AssessUsability className={classes.topicon} />}
            {dialogueType == "Water and Nutrition" && <AssessNutrition className={classes.topicon} />}
            {dialogueType == "Psychosis and Social" && <AssessSocial className={classes.topicon} />}
            <Typography variant="h6">Survey</Typography>
            <Typography variant="h2">{dialogueType}</Typography>
          </div>
        </DialogTitle>
        <DialogContent>
          <Typography variant="h4" gutterBottom>
            12 questions (10 mins)
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            The following survey will assess your sleep and social behavior. For each of the statements, rate which is
            true for you.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Box textAlign="center" width={1} mt={1} mb={1}>
            <Link
              component={RouterLink}
              to={`/participant/me/survey/${dialogueType.replace(/\s/g, "_")}`}
              underline="none"
              className={classes.btngreen}
            >
              Start survey
            </Link>
          </Box>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
