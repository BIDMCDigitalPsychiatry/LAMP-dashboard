// Core Imports
import React, { useState, useEffect } from "react"
import {
  Box,
  useTheme,
  useMediaQuery,
  Slide,
  Icon,
  Backdrop,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  makeStyles,
  Theme,
  createStyles,
} from "@material-ui/core"
import { useSnackbar } from "notistack"
// Local Imports

import LAMP, { Participant as ParticipantObj } from "lamp-core"
import BottomMenu from "./BottomMenu"
import Survey from "./Survey"
import ResponsiveDialog from "./ResponsiveDialog"
import Prevent from "./Prevent"
import Manage from "./Manage"
import Welcome from "./Welcome"
import Learn from "./Learn"
import Feed from "./Feed"
import SurveyInstrument from "./SurveyInstrument"
import classes from "*.module.css"
import { ReactComponent as Ribbon } from "../icons/Ribbon.svg"
import { useTranslation } from "react-i18next"
import locale_lang from "../locale_map.json"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    scroll: { overflowY: "hidden" },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
    ribbonText: {
      fontSize: "16px",
      color: "rgba(0, 0, 0, 0.75)",
      fontWeight: 600,
      marginBottom: "30px",
      padding: "0 42px",
    },
    niceWork: {
      paddingBottom: 70,
      "& h5": { fontSize: 25, fontWeight: 600, color: "rgba(0, 0, 0, 0.75)" },
    },
    dialogueStyle: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    dialogueCurve: { borderRadius: 10, maxWidth: 400 },
    MuiDialogPaperScrollPaper: {
      maxHeight: "100% !important",
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    niceWorkbadge: { position: "relative" },
    dayNotification: {
      position: "absolute",
      top: 0,
      width: "100%",
      paddingTop: 50,
      "& h4": { fontSize: 40, fontWeight: 700, color: "#00765C", lineHeight: "38px" },
      "& h6": { color: "#00765C", fontSize: 16, fontWeight: 600 },
    },
  })
)

function _hideCareTeam() {
  return (LAMP.Auth._auth.serverAddress || "").includes(".psych.digital")
}
function _patientMode() {
  return LAMP.Auth._type === "participant"
}
async function getShowWelcome(participant: ParticipantObj): Promise<boolean> {
  if (!_patientMode()) return false
  let _hidden = (await LAMP.Type.getAttachment(participant.id, "lamp.dashboard.welcome_dismissed")) as any
  return !!_hidden.error ? true : !(_hidden.data as boolean)
}
async function setShowWelcome(participant: ParticipantObj): Promise<void> {
  await LAMP.Type.setAttachment(participant.id, "me", "lamp.dashboard.welcome_dismissed", true)
}

async function tempHideCareTeam(participant: ParticipantObj): Promise<boolean> {
  if (_hideCareTeam()) return true
}

async function addHiddenEvent(
  participant: ParticipantObj,
  timestamp: number,
  activityName: string
): Promise<string[] | undefined> {
  let _hidden = (await LAMP.Type.getAttachment(participant.id, "lamp.dashboard.hidden_events")) as any
  let _events = !!_hidden.error ? [] : _hidden.data
  if (_events.includes(`${timestamp}/${activityName}`)) return _events
  let new_events = [..._events, `${timestamp}/${activityName}`]
  let _setEvents = (await LAMP.Type.setAttachment(
    participant.id,
    "me",
    "lamp.dashboard.hidden_events",
    new_events
  )) as any
  if (!!_setEvents.error) return undefined
  return new_events
}
// Refresh hidden events list.
async function getHiddenEvents(participant: ParticipantObj): Promise<string[]> {
  let _hidden = (await LAMP.Type.getAttachment(participant.id, "lamp.dashboard.hidden_events")) as any
  return !!_hidden.error ? [] : (_hidden.data as string[])
}

async function getEvents(participant: ParticipantObj, activityId: string) {
  let activityEvents = await LAMP.ActivityEvent.allByParticipant(participant.id, activityId)
  let dates = []
  let steak = 0
  activityEvents.map((activityEvent, i) => {
    let date = new Date(activityEvent.timestamp)
    if (!dates.includes(date.toLocaleDateString())) {
      dates.push(date.toLocaleDateString())
    }
  })
  let currentDate = new Date()
  for (let date of dates) {
    if (date === currentDate.toLocaleDateString()) {
      steak++
    } else {
      break
    }
    currentDate.setDate(currentDate.getDate() - 1)
  }
  return steak > 0 ? steak : 1
}

export default function Participant({
  participant,
  ...props
}: {
  participant: ParticipantObj
  activeTab: Function
  tabValue: string
  surveyDone: boolean
  submitSurvey: Function
  setShowDemoMessage: Function
}) {
  const [activities, setActivities] = useState(null)
  const [visibleActivities, setVisibleActivities] = useState([])
  const getTab = () => {
    let tabNum
    switch (props.tabValue) {
      case "Learn":
        tabNum = 0
        break
      case "Assess":
        tabNum = 1
        break
      case "Manage":
        tabNum = 2
        break
      case "Prevent":
        tabNum = 3
        break
      case "Feed":
        tabNum = 4
        break
      default:
        tabNum = _patientMode() ? 1 : 3
        break
    }
    return tabNum
  }

  const [tab, _setTab] = useState(getTab())
  const supportsSidebar = useMediaQuery(useTheme().breakpoints.up("md"))
  const { enqueueSnackbar } = useSnackbar()
  const [openDialog, setOpen] = useState(false)
  const [hideCareTeam, setHideCareTeam] = useState(_hideCareTeam())
  const [hiddenEvents, setHiddenEvents] = React.useState([])
  const [surveyName, setSurveyName] = useState(null)
  const classes = useStyles()
  const [loading, setLoading] = useState(false)
  const [openComplete, setOpenComplete] = React.useState(false)
  const [steak, setSteak] = useState(1)
  const { t, i18n } = useTranslation()

  const tabDirection = (currentTab) => {
    return supportsSidebar ? "up" : "left"
  }

  const getTabName = (newTab: number) => {
    let tabName = ""
    switch (newTab) {
      case 0:
        tabName = "Learn"
        break
      case 1:
        tabName = "Assess"
        break
      case 2:
        tabName = "Manage"
        break
      case 3:
        tabName = "Prevent"
        break
      case 4:
        tabName = "Feed"
        break
    }
    return tabName
  }

  const getSelectedLanguage = () => {
    const matched_codes = Object.keys(locale_lang).filter((code) => code.startsWith(navigator.language))
    const lang = matched_codes.length > 0 ? matched_codes[0] : "en-US"
    return i18n.language ? i18n.language : lang ? lang : "en-US"
  }

  useEffect(() => {
    setLoading(true)
    LAMP.Activity.allByParticipant(participant.id).then((activities) => {
      setActivities(activities)
      const tabName = getTabName(tab)
      props.activeTab(tabName)
      let language = !!localStorage.getItem("LAMP_user_" + participant.id)
        ? JSON.parse(localStorage.getItem("LAMP_user_" + participant.id)).language
        : getSelectedLanguage()
        ? getSelectedLanguage()
        : "en-US"
      i18n.changeLanguage(language)
      //  getShowWelcome(participant).then(setOpen)
      setLoading(false)
    })
    getHiddenEvents(participant).then(setHiddenEvents)
    tempHideCareTeam(participant).then(setHideCareTeam)
  }, [])

  const activeTab = (newTab) => {
    _setTab(newTab)
    const tabName = getTabName(newTab)
    props.activeTab(tabName)
    setVisibleActivities([])
  }

  const hideEvent = async (timestamp?: number, activity?: string) => {
    if (timestamp === undefined && activity === undefined) {
      setHiddenEvents(hiddenEvents) // trigger a reload for dependent components only
      return
    }
    let result = await addHiddenEvent(participant, timestamp, activity)
    if (!!result) {
      setHiddenEvents(result)
    }
  }

  const submitSurvey = (response, overwritingTimestamp) => {
    setLoading(true)
    if (!!!response || response === null) {
      setLoading(false)
      setVisibleActivities([])
    } else {
      let events = response.map((x, idx) => ({
        timestamp: new Date().getTime(),
        duration: response.duration,
        activity: visibleActivities[idx].id,
        static_data: {},
        temporal_slices: (x || []).map((y) => ({
          item: y !== undefined ? y.item : null,
          value: y !== undefined ? y.value : null,
          type: null,
          level: null,
          duration: y.duration,
        })),
      }))
      Promise.all(
        events
          .filter((x) => x.temporal_slices.length > 0)
          .map((x) => LAMP.ActivityEvent.create(participant.id, x).catch((e) => console.dir(e)))
      ).then((x) => {
        getEvents(participant, visibleActivities[0].id).then((steak) => {
          setSteak(steak)
          setOpenComplete(true)
          setLoading(false)
        })
        setVisibleActivities([])
        // If a timestamp was provided to overwrite data, hide the original event too.
        if (!!overwritingTimestamp) hideEvent(overwritingTimestamp, visibleActivities[0 /* assumption made here */].id)
        else hideEvent() // trigger a reload of dependent components anyway
      })
    }
  }

  return (
    <React.Fragment>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {activities !== null && (
        <Box>
          <Slide in={tab === 0} direction={tabDirection(0)} mountOnEnter unmountOnExit>
            <Box mt={1} mb={4}>
              <Learn participant={participant} activities={activities} activeTab={activeTab} />
            </Box>
          </Slide>
          <Slide in={tab === 1} direction={tabDirection(1)} mountOnEnter unmountOnExit>
            <Box mt={1} mb={4}>
              <Survey
                participant={participant}
                activities={activities}
                visibleActivities={visibleActivities}
                onComplete={submitSurvey}
                setVisibleActivities={setVisibleActivities}
              />
            </Box>
          </Slide>
          <Slide in={tab === 2} direction={tabDirection(2)} mountOnEnter unmountOnExit>
            <Box mt={1} mb={4}>
              <Manage participant={participant} activities={activities} activeTab={activeTab} />
            </Box>
          </Slide>
          <Slide in={tab === 3} direction={tabDirection(3)} mountOnEnter unmountOnExit>
            <Box mt={1} mb={4}>
              <Prevent
                participant={participant}
                activeTab={activeTab}
                hiddenEvents={hiddenEvents}
                enableEditMode={!_patientMode()}
                onEditAction={(activity, data) => {
                  setSurveyName(activity.name)
                  setVisibleActivities([
                    {
                      ...activity,
                      prefillData: [
                        data.slice.map(({ item, value }) => ({
                          item,
                          value,
                        })),
                      ],
                      prefillTimestamp: new Date(
                        data.x
                      ).getTime() /* post-increment later to avoid double-reporting events! */,
                    },
                  ])
                }}
                onCopyAction={(activity, data) => {
                  setSurveyName(activity.name)
                  setVisibleActivities([
                    {
                      ...activity,
                      prefillData: [
                        data.slice.map(({ item, value }) => ({
                          item,
                          value,
                        })),
                      ],
                    },
                  ])
                }}
                onDeleteAction={(activity, data) => hideEvent(new Date(data.x).getTime(), activity.id)}
              />
            </Box>
          </Slide>
          <Slide in={tab === 4} direction={tabDirection(3)} mountOnEnter unmountOnExit>
            <Box mt={1} mb={4}>
              <Feed
                participant={participant}
                activeTab={activeTab}
                activities={activities}
                visibleActivities={visibleActivities}
                onComplete={submitSurvey}
                setVisibleActivities={setVisibleActivities}
              />
            </Box>
          </Slide>
          <BottomMenu
            activeTab={activeTab}
            tabValue={tab}
            participant={participant}
            showWelcome={openDialog}
            setShowDemoMessage={(val) => props.setShowDemoMessage(val)}
          />
          <ResponsiveDialog open={!!openDialog} transient animate fullScreen>
            <Welcome
              activities={activities}
              onClose={() => {
                setOpen(false)
                setShowWelcome(participant)
              }}
            />
          </ResponsiveDialog>
          <ResponsiveDialog
            transient
            animate
            fullScreen
            open={tab === 3 && visibleActivities.length > 0}
            onClose={() => {
              setVisibleActivities([])
            }}
          >
            <SurveyInstrument
              participant={participant}
              fromPrevent={true}
              type={surveyName}
              group={visibleActivities}
              onComplete={submitSurvey}
            />
          </ResponsiveDialog>
        </Box>
      )}
      <Dialog
        open={openComplete}
        onClose={() => setOpenComplete(false)}
        scroll="paper"
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        classes={{
          root: classes.dialogueStyle,
          paper: classes.dialogueCurve,
          paperScrollPaper: classes.MuiDialogPaperScrollPaper,
        }}
      >
        <DialogTitle>
          <IconButton aria-label="close" className={classes.closeButton} onClick={() => setOpenComplete(false)}>
            <Icon>close</Icon>
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box textAlign="center" pb={4} className={classes.niceWork}>
            <Typography variant="h5" gutterBottom>
              {t("Nice work!")}
            </Typography>
            <Typography className={classes.ribbonText} component="p">
              {t("You’re on a streak, keep it going")}
            </Typography>
            <Box textAlign="center" className={classes.niceWorkbadge}>
              <Ribbon width="170" height="226" />
              <Box className={classes.dayNotification}>
                <Typography variant="h4"> {steak}</Typography>{" "}
                <Typography variant="h6">{steak > 1 ? " " + t("days") : t("day")}</Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}
