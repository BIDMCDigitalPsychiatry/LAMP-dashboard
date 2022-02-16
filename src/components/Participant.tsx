// Core Imports
import React, { useState, useEffect } from "react"
import {
  Box,
  useTheme,
  useMediaQuery,
  Slide,
  Backdrop,
  CircularProgress,
  makeStyles,
  Theme,
  createStyles,
} from "@material-ui/core"
import { useSnackbar } from "notistack"
// Local Imports
import { sensorEventUpdate } from "./BottomMenu"
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
import { useTranslation } from "react-i18next"
import Streak from "./Streak"
import { getImage } from "./Manage"

import locale_lang from "../locale_map.json"
import { ShowChart } from "@material-ui/icons"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    scroll: { overflowY: "hidden" },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
    MuiDialogPaperScrollPaper: {
      maxHeight: "100% !important",
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

export async function getEvents(participant: any, activityId: string) {
  let activityEvents = await LAMP.ActivityEvent.allByParticipant(participant?.id ?? participant, activityId)
  let dates = []
  let streak = 0
  activityEvents.map((activityEvent, i) => {
    let date = new Date(activityEvent.timestamp)
    if (!dates.includes(date.toLocaleDateString())) {
      dates.push(date.toLocaleDateString())
    }
  })
  let currentDate = new Date()
  for (let date of dates) {
    if (date === currentDate.toLocaleDateString()) {
      streak++
    } else {
      break
    }
    currentDate.setDate(currentDate.getDate() - 1)
  }
  return streak > 0 ? streak : 1
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
  const [streakActivity, setStreakActivity] = useState(null)
  const getTab = () => {
    return props.tabValue
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
  const [streak, setStreak] = useState(1)
  const { t, i18n } = useTranslation()
  const tabDirection = (currentTab) => {
    return supportsSidebar ? "up" : "left"
  }

  const getSelectedLanguage = () => {
    const matched_codes = Object.keys(locale_lang).filter((code) => code.startsWith(navigator.language))
    const lang = matched_codes.length > 0 ? matched_codes[0] : "en-US"
    return i18n.language ? i18n.language : lang ? lang : "en-US"
  }

  useEffect(() => {
    setLoading(true)
    LAMP.Activity.allByParticipant(participant.id, null, !(LAMP.Auth._auth.serverAddress === "demo.lamp.digital")).then(
      (activities) => {
        setActivities(activities)
        props.activeTab(tab, participant.id)
        let language = !!localStorage.getItem("LAMP_user_" + participant.id)
          ? JSON.parse(localStorage.getItem("LAMP_user_" + participant.id)).language
          : getSelectedLanguage()
          ? getSelectedLanguage()
          : "en-US"
        i18n.changeLanguage(language)
        //  getShowWelcome(participant).then(setOpen)
        setLoading(false)
      }
    )
    getHiddenEvents(participant).then(setHiddenEvents)
    tempHideCareTeam(participant).then(setHideCareTeam)
  }, [])

  const activeTab = (newTab) => {
    props.activeTab(newTab, participant.id)
    _setTab(newTab)
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

  const showStreak = (participant, activity) => {
    getImage(activity?.id, activity?.spec).then((tag) => {
      setStreakActivity(tag?.streak ?? null)
      if (!!tag?.streak?.streak || typeof tag?.streak === "undefined") {
        getEvents(participant, activity.id).then((streak) => {
          setStreak(streak)
          setOpenComplete(true)
          setLoading(false)
        })
      } else {
        setLoading(false)
      }
    })
  }

  return (
    <React.Fragment>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {console.log(tab)}
      {activities !== null && (
        <Box>
          <Slide in={tab === "learn"} direction={tabDirection(0)} mountOnEnter unmountOnExit>
            <Box mt={1} mb={4}>
              <Learn participant={participant} activities={activities} activeTab={activeTab} showStreak={showStreak} />
            </Box>
          </Slide>
          <Slide in={tab === "assess"} direction={tabDirection(1)} mountOnEnter unmountOnExit>
            <Box mt={1} mb={4}>
              <Survey participant={participant} activities={activities} showStreak={showStreak} />
            </Box>
          </Slide>
          <Slide in={tab === "manage"} direction={tabDirection(2)} mountOnEnter unmountOnExit>
            <Box mt={1} mb={4}>
              <Manage participant={participant} activities={activities} activeTab={activeTab} showStreak={showStreak} />
            </Box>
          </Slide>
          <Slide in={tab === "portal"} direction={tabDirection(3)} mountOnEnter unmountOnExit>
            <Box mt={1} mb={4}>
              <Prevent
                participant={participant}
                activeTab={activeTab}
                allActivities={activities}
                hiddenEvents={hiddenEvents}
                enableEditMode={!_patientMode()}
                showStreak={showStreak}
                activitySubmitted={openComplete}
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
          <Slide in={tab === "feed"} direction={tabDirection(3)} mountOnEnter unmountOnExit>
            <Box mt={1} mb={4}>
              <Feed
                participant={participant}
                activeTab={activeTab}
                activities={activities}
                visibleActivities={visibleActivities}
                setVisibleActivities={setVisibleActivities}
                showStreak={showStreak}
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
        </Box>
      )}
      <Streak
        open={openComplete}
        onClose={() => {
          setOpenComplete(false)
        }}
        activity={streakActivity}
        streak={streak}
      />
    </React.Fragment>
  )
}
