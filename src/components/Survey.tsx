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
  DialogActions,
  IconButton,
  ButtonBase,
} from "@material-ui/core"
import ResponsiveDialog from "./ResponsiveDialog"
import SurveyInstrument from "./SurveyInstrument"
import { makeStyles, Theme, createStyles, createMuiTheme } from "@material-ui/core/styles"
import LAMP from "lamp-core"
import CloseIcon from "@material-ui/icons/Close"
import { ReactComponent as AssessMood } from "../icons/AssessMood.svg"
import { ReactComponent as AssessAnxiety } from "../icons/AssessAnxiety.svg"
import { ReactComponent as AssessNutrition } from "../icons/AssessNutrition.svg"
import { ReactComponent as AssessUsability } from "../icons/AssessUsability.svg"
import { ReactComponent as AssessSocial } from "../icons/AssessSocial.svg"
import { ReactComponent as AssessSleep } from "../icons/AssessSleep.svg"
import { ReactComponent as AssessDbt } from "../icons/AssessDbt.svg"
import classnames from "classnames"
import Link from "@material-ui/core/Link"
import { useSnackbar } from "notistack"
import { useTranslation } from "react-i18next"
import { DatePicker } from "@material-ui/pickers"
import EmbeddedActivity from "./EmbeddedActivity"

const theme = createMuiTheme({
  overrides: {
    MuiInput: {
      root: { width: "100%" },
      underline: {
        "&&&:before": {
          borderBottom: "none",
        },
        "&&:after": {
          borderBottom: "none",
        },
      },
    },
    MuiToolbar: {
      root: { backgroundColor: "#38C396 !important" },
    },
    MuiButtonBase: {
      root: {},
    },
  },
})
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
      padding: "35px 40px 10px",
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
      marginBottom: 20,
      cursor: "pointer",
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
    surveytextarea: {
      padding: "20px 40px 40px",
      "& h4": { fontSize: 16, fontWeight: "bold", marginBottom: 15 },
    },
    dialogtitle: { padding: 0 },

    ribbonText: {
      fontSize: "16px",
      color: "rgba(0, 0, 0, 0.75)",
      fontWeight: 600,
      marginBottom: "30px",
      padding: "0 42px",
    },
    thumbMain: { maxWidth: 255 },
    thumbContainer: { maxWidth: 1055 },
    fullwidthBtn: { width: "100%" },
    dialogueCurve: { borderRadius: 10, maxWidth: 400 },
    niceWork: {
      "& h5": { fontSize: 25, fontWeight: 600, color: "rgba(0, 0, 0, 0.75)" },
    },
    calendatInput: {
      width: "100%",
      "& input": { textAlign: "center", fontSize: 18, fontWeight: 600, color: "rgba(0, 0, 0, 0.75)" },
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

async function getDetails(activityId: string) {
  return [await LAMP.Type.getAttachment(activityId, "lamp.dashboard.survey_description")].map((y: any) =>
    !!y.error ? undefined : y.data
  )[0]
}

export default function Survey({
  participant,
  activities,
  visibleActivities,
  setVisibleActivities,
  onComplete,
  ...props
}) {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const [dialogueType, setDialogueType] = React.useState("")
  const [openData, setOpenData] = React.useState(false)
  const [questionCount, setQuestionCount] = useState(0)
  const { t } = useTranslation()
  const [spec, setSpec] = useState(null)
  const [activity, setActivity] = useState(null)
  const [tag, setTag] = useState([])
  const [loading, setLoading] = useState(true)

  const handleClickOpen = (type: string) => {
    setDialogueType(type)
    setOpen(true)
  }

  const submitSurveyType = (response) => {
    setOpenData(false)
    onComplete(response)
  }

  useEffect(() => {
    let savedActivities = (activities || []).filter(
      (x) =>
        x.spec === "lamp.dbt_diary_card" ||
        (x.spec === "lamp.survey" && (_shouldRestrict() ? x.name.includes("SELF REPORT") : true))
    )
    if (savedActivities.length > 0) {
      setLoading(true)
      ;(async () => {
        let tags = []
        let details = await savedActivities.map((activity, index) => {
          ;(async () => {
            tags[activity.id] = await getDetails(activity.id)
            setTag(tags)
            if (index === savedActivities.length - 1) {
              setLoading(false)
              setTag(tags)
              return tags
            }
          })()
        })
        setTag(details)
      })()
    } else {
      setLoading(false)
    }
  }, [])
  // var date = new Date()
  // date.setDate(date.getDate() - 21)

  // const year = date.getFullYear()
  // const month = date.getMonth() + 1
  // const day = date.getDate()
  // const formattedDate = year + "-" + month + "-" + day

  return (
    <Container className={classes.thumbContainer}>
      <Grid container spacing={2} direction="row" justify="flex-start" alignItems="center">
        {[
          ...(activities || [])
            .filter(
              (x) =>
                x.spec === "lamp.dbt_diary_card" ||
                (x.spec === "lamp.survey" && (_shouldRestrict() ? x.name.includes("SELF REPORT") : true))
            )
            .map((y) => (
              <Grid
                item
                xs={6}
                sm={4}
                md={3}
                lg={3}
                onClick={() => {
                  setSpec(y.spec)
                  setActivity(y)
                  console.log(y)
                  y.spec === "lamp.dbt_diary_card" ? setQuestionCount(6) : setQuestionCount(y.settings.length)
                  setVisibleActivities([y])
                  handleClickOpen(y.name)
                }}
                className={classes.thumbMain}
              >
                <ButtonBase focusRipple className={classes.fullwidthBtn}>
                  <Card className={classes.assess}>
                    <Box mt={1} mb={1}>
                      {y.spec === "lamp.dbt_diary_card" && <AssessDbt />}
                      {y.name === "Mood" && <AssessMood />}
                      {y.name === "Sleep and Social" && <AssessSleep />}
                      {y.name === "Anxiety" && <AssessAnxiety />}
                      {y.name === "App Usability" && <AssessUsability />}
                      {y.name === "Water and Nutrition" && <AssessNutrition />}
                      {y.name === "Psychosis and Social" && <AssessSocial />}
                    </Box>
                    <Typography className={classes.cardlabel}>{t(y.name)}</Typography>
                  </Card>
                </ButtonBase>
              </Grid>
            )),
        ]}
      </Grid>

      <Dialog
        open={open}
        maxWidth="xs"
        onClose={() => setOpen(false)}
        scroll="paper"
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        classes={{
          root: classes.dialogueStyle,
          paper: classes.dialogueCurve,
        }}
      >
        <DialogTitle id="alert-dialog-slide-title" className={classes.dialogtitle}>
          <IconButton aria-label="close" className={classes.closeButton} onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
          <div className={classes.header}>
            {spec === "lamp.dbt_diary_card" && <AssessDbt className={classes.topicon} />}
            {dialogueType === "Mood" && <AssessMood className={classes.topicon} />}
            {dialogueType === "Sleep and Social" && <AssessSleep className={classes.topicon} />}
            {dialogueType === "Anxiety" && <AssessAnxiety className={classes.topicon} />}
            {dialogueType === "App Usability" && <AssessUsability className={classes.topicon} />}
            {dialogueType === "Water and Nutrition" && <AssessNutrition className={classes.topicon} />}
            {dialogueType === "Psychosis and Social" && <AssessSocial className={classes.topicon} />}
            <Typography variant="h6">{t("Survey")}</Typography>
            <Typography variant="h2">{t(activity?.name ?? null)}</Typography>
          </div>
        </DialogTitle>
        <DialogContent className={classes.surveytextarea}>
          <Typography variant="h4" gutterBottom>
            {questionCount} {questionCount > 1 ? t("questions") : t("question")} {/* (10 mins) */}
          </Typography>
          <Typography variant="body2" component="p">
            {spec !== "lamp.dbt_diary_card" && t(tag[activity?.id]?.description ?? null)}
            {spec === "lamp.dbt_diary_card" &&
              t("Daily log of events and related feelings. Track target behaviors and use of skills.")}
          </Typography>
          {/* {spec === "lamp.dbt_diary_card" && (
            <Box mt={5}>
              <MuiThemeProvider theme={theme}>
                <React.Fragment>
                  <DatePicker
                    className={classes.calendatInput}
                    autoOk
                    format="MMMM d, yyyy "
                    minDate={formattedDate}
                    disableFuture
                    value={selectedDate}
                    onChange={handleDateChange}
                  />
                </React.Fragment>
              </MuiThemeProvider>
            </Box> 
          )}*/}
        </DialogContent>
        <DialogActions>
          <Box textAlign="center" width={1} mt={1} mb={4}>
            <Link
              onClick={() => {
                setOpenData(true)
                setOpen(false)
              }}
              underline="none"
              className={classnames(classes.btngreen, classes.linkButton)}
            >
              {t("Start survey")}
            </Link>
          </Box>
        </DialogActions>
      </Dialog>
              
      <ResponsiveDialog
        transient
        animate
        fullScreen
        open={openData}
        onClose={() => {
          setOpenData(false)
        }}
      >
        {spec === "lamp.dbt_diary_card" && (
          <EmbeddedActivity
            name={activity?.name ?? ""}
            activity={activity ?? []}
            participant={participant}
            onComplete={() => {
              setOpenData(false)
              onComplete(null)
            }}
          />
        )}

        {spec !== "lamp.dbt_diary_card" && (
          <SurveyInstrument
            id={participant.id}
            type={dialogueType}
            fromPrevent={false}
            group={visibleActivities}
            setVisibleActivities={setVisibleActivities}
            onComplete={submitSurveyType}
          />
        )}
      </ResponsiveDialog>
    </Container>
  )
}
