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
  useMediaQuery,
  useTheme,
} from "@material-ui/core"
import ResponsiveDialog from "./ResponsiveDialog"
import SurveyQuestions from "./SurveyQuestions"
import BottomMenu from "./BottomMenu"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import LAMP, { Participant as ParticipantObj } from "lamp-core"
import CloseIcon from "@material-ui/icons/Close"
import { ReactComponent as AssessMood } from "../icons/AssessMood.svg"
import { ReactComponent as AssessAnxiety } from "../icons/AssessAnxiety.svg"
import { ReactComponent as AssessNutrition } from "../icons/AssessNutrition.svg"
import { ReactComponent as AssessUsability } from "../icons/AssessUsability.svg"
import { ReactComponent as AssessSocial } from "../icons/AssessSocial.svg"
import { ReactComponent as AssessSleep } from "../icons/AssessSleep.svg"
import { ReactComponent as Ribbon } from "../icons/Ribbon.svg"
import classnames from "classnames"
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
    inlineHeader: {
      background: "#FFFFFF",
      boxShadow: "none",

      "& h5": { fontSize: 25, paddingLeft: 20, color: "rgba(0, 0, 0, 0.75)", fontWeight: 600 },
    },
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
      background: "#E7F8F2",
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
    btngreen: {
      background: "#92E7CA",
      borderRadius: "40px",
      minWidth: "200px",
      boxShadow: " 0px 10px 15px rgba(146, 231, 202, 0.25)",
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
    thumbMain: { maxWidth: 255 },
    thumbContainer: { maxWidth: 1055 },
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

export default function Survey({
  participant,
  ...props
}: {
  participant: ParticipantObj
  submitSurvey: Function
  surveyDone: boolean
  activeTab: Function
}) {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const [openComplete, setOpenComplete] = React.useState(false)
  const [dialogueType, setDialogueType] = React.useState("")
  const [activities, setActivities] = useState([])
  const [openData, setOpenData] = React.useState(false)
  const [surveyType, setSurveyType] = useState(null)
  const [visibleActivities, setVisibleActivities] = useState([])
  const [questionCount, setQuestionCount] = useState(0)
  const supportsSidebar = useMediaQuery(useTheme().breakpoints.up("md"))

  const handleClickOpen = (type: string) => {
    setDialogueType(type)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setOpenComplete(false)
  }

  useEffect(() => {
    LAMP.Activity.allByParticipant(participant.id).then(setActivities)
  }, [])

  const submitSurvey = (response) => {
    let events = response.map((x, idx) => ({
      timestamp: new Date().getTime(),
      duration: 0,
      activity: visibleActivities[idx].id,
      static_data: {},
      temporal_slices: (x || []).map((y) => ({
        item: y !== undefined ? y.item : null,
        value: y !== undefined ? y.value : null,
        type: null,
        level: null,
        duration: 0,
      })),
    }))
    Promise.all(
      events
        .filter((x) => x.temporal_slices.length > 0)
        .map((x) => LAMP.ActivityEvent.create(participant.id, x).catch((e) => console.dir(e)))
    ).then((x) => {
      setOpenData(false)
      setOpenComplete(true)
    })
  }

  return (
    <Container className={classes.thumbContainer}>
      <Grid container spacing={2} direction="row" justify="flex-start" alignItems="center">
        {[
          ...(activities || [])
            .filter((x) => x.spec === "lamp.survey" && (_shouldRestrict() ? x.name.includes("SELF REPORT") : true))
            .map((y) => (
              <Grid
                item
                xs={6}
                sm={4}
                md={3}
                lg={3}
                onClick={() => {
                  setVisibleActivities([y])
                  setQuestionCount(y.settings.length)
                  handleClickOpen(y.name)
                }}
                className={classes.thumbMain}
              >
                <Card className={classes.assess}>
                  <Box mt={1} mb={1}>
                    {y.name === "Mood" && <AssessMood />}
                    {y.name === "Sleep and Social" && <AssessSleep />}
                    {y.name === "Anxiety" && <AssessAnxiety />}
                    {y.name === "App Usability" && <AssessUsability />}
                    {y.name === "Water and Nutrition" && <AssessNutrition />}
                    {y.name === "Psychosis and Social" && <AssessSocial />}
                  </Box>
                  <Typography className={classes.cardlabel}>{y.name}</Typography>
                </Card>
              </Grid>
            )),
        ]}
      </Grid>

      <Dialog
        open={open}
        maxWidth="xs"
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
            {dialogueType === "Mood" && <AssessMood className={classes.topicon} />}
            {dialogueType === "Sleep and Social" && <AssessSleep className={classes.topicon} />}
            {dialogueType === "Anxiety" && <AssessAnxiety className={classes.topicon} />}
            {dialogueType === "App Usability" && <AssessUsability className={classes.topicon} />}
            {dialogueType === "Water and Nutrition" && <AssessNutrition className={classes.topicon} />}
            {dialogueType === "Psychosis and Social" && <AssessSocial className={classes.topicon} />}
            <Typography variant="h6">Survey</Typography>
            <Typography variant="h2">{dialogueType}</Typography>
          </div>
        </DialogTitle>
        <DialogContent className={classes.surveytextarea}>
          <Typography variant="h4" gutterBottom>
            {questionCount} questions (10 mins)
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            The following survey will assess your sleep and social behavior. For each of the statements, rate which is
            true for you.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Box textAlign="center" width={1} mt={1} mb={4}>
            <Link
              onClick={() => {
                setOpenData(true)
                setOpen(false)
                setOpenComplete(false)
                setSurveyType(dialogueType.replace(/\s/g, "_"))
              }}
              underline="none"
              className={classnames(classes.btngreen, classes.linkButton)}
            >
              Start survey
            </Link>
          </Box>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openComplete}
        onClose={handleClose}
        scroll="paper"
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        className={classes.dialogueStyle}
        classes={{ paperScrollPaper: classes.MuiDialogPaperScrollPaper }}
      >
        <DialogTitle>
          <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box textAlign="center">
            <Typography variant="h5" gutterBottom>
              Nice work!
            </Typography>
            <Typography className={classes.ribbonText} component="p">
              You’re on a streak, keep it going
            </Typography>
            <Box textAlign="center">
              <Ribbon />
            </Box>
            <Button className={classes.gotit} onClick={handleClose}>
              Got it
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
      <ResponsiveDialog
        transient={false}
        animate
        fullScreen
        open={openData}
        onClose={() => {
          setOpenData(false)
        }}
        style={{ paddingLeft: supportsSidebar ? "100px" : "" }}
      >
        {supportsSidebar && <BottomMenu activeTab={props.activeTab} tabValue={1} />}
        <SurveyQuestions
          participant={participant}
          type={surveyType}
          onComplete={submitSurvey}
          activities={visibleActivities}
          closeDialog={() => setOpenData(false)}
        />
      </ResponsiveDialog>
    </Container>
  )
}
