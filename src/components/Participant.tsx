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
// Local Imports
// import LAMP, { Participant as ParticipantObj } from "lamp-core"
import BottomMenu from "./BottomMenu"
import Survey from "./Survey"
import ResponsiveDialog from "./ResponsiveDialog"
import Prevent from "./Prevent"
import Manage from "./Manage"
import Welcome from "./Welcome"
import Learn from "./Learn"
import Feed from "./Feed"
import { Service } from "./DBService/DBService"
import { useTranslation } from "react-i18next"
import Streak from "./Streak"
import locale_lang from "../locale_map.json"
import VisualPopup from "./VisualPopup"
import NoActivityPopup from "./NoActivityPopup"
import LAMP, {
  Participant as ParticipantObj,
  Activity as ActivityObj,
  ActivityEvent as ActivityEventObj,
  SensorEvent as SensorEventObj,
} from "lamp-core"
import { useAuthContext } from "./AuthProvider"

export async function getImage(activityId: string, spec: string) {
  return [
    await LAMP.Type.getAttachment(
      activityId,
      spec === "lamp.survey" ? "lamp.dashboard.survey_description" : "lamp.dashboard.activity_details"
    ),
  ].map((y: any) => (!!y?.error ? undefined : y?.data))[0]
}

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

export async function getSelfHelpActivityEvents(activityId: string, from: number, to: number) {
  let result = []
  return await Service.getActivityEventData("activityEvents", activityId).then((res) => {
    if (res) {
      result = res
      if (from != null) {
        result = res?.filter((val) => val.timestamp >= from)
      }
      if (to != null) {
        result = res?.filter((val) => val?.timestamp <= to)
      }
    }
    return result.reverse()
  })
}

export async function getSelfHelpAllActivityEvents(from?: number, to?: number) {
  let result = []
  return await Service.getAllTags("activityEvents").then((res) => {
    if (res) {
      result = res
      if (from != null) {
        result = res.filter((val) => val.timestamp >= from)
      }
      if (to != null) {
        result = res.filter((val) => val?.timestamp <= to)
      }
    }
    return result
  })
}

export async function getEvents(participant: any, activityId: string) {
  let from = new Date()
  from.setMonth(from.getMonth() - 6)
  let activityEvents =
    LAMP.Auth._auth.id === "selfHelp@demo.lamp.digital"
      ? await getSelfHelpActivityEvents(activityId, from.getTime(), new Date().getTime())
      : await LAMP.ActivityEvent.allByParticipant(
          participant?.id ?? participant,
          activityId,
          from.getTime(),
          new Date().getTime(),
          null,
          true
        )
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

export const games = [
  "lamp.jewels_a",
  "lamp.jewels_b",
  "lamp.spatial_span",
  "lamp.cats_and_dogs",
  "lamp.pop_the_bubbles",
  "lamp.balloon_risk",
  "lamp.spin_wheel",
  "lamp.maze_game",
  "lamp.emotion_recognition",
  "lamp.symbol_digit_substitution",
  "lamp.gyroscope",
  "lamp.dcog",
  "lamp.funny_memory",
  "lamp.trails_b",
  "lamp.voice_survey",
  "lamp.fragmented_letters",
  "lamp.digit_span",
  "lamp.memory_game",
]

function getActivityEventCount(activity_events: { [groupName: string]: ActivityEventObj[] }) {
  return Object.assign(
    {},
    ...Object.entries(activity_events || {}).map(([k, v]: [string, any[]]) => ({
      [k]: v.length,
    }))
  )
}

async function getActivityEvents(
  participant: ParticipantObj,
  _activities: ActivityObj[],
  _hidden: string[],
  from: number,
  to: number
): Promise<{ [groupName: string]: ActivityEventObj[] }> {
  let original = (LAMP.Auth._auth.id === "selfHelp@demo.lamp.digital"
    ? await getSelfHelpAllActivityEvents(from, to)
    : await LAMP.ActivityEvent.allByParticipant(participant.id, null, from, to, null, true)
  )
    .map((x) => ({
      ...x,
      activity: _activities.find((y) => x.activity === y.id),
    }))
    .filter((x) => (!!x.activity ? !_hidden?.includes(`${x.timestamp}/${x.activity.id}`) : true))
    .sort((x, y) => (x.timestamp > y.timestamp ? 1 : x.timestamp < y.timestamp ? -1 : 0))
    .map((x) => ({
      ...x,
      activity: (x.activity || { name: "" }).name || x.static_data?.survey_name,
    }))
    .groupBy("activity") as any
  let customEvents = _activities
    .filter((x) => x.spec === "lamp.dashboard.custom_survey_group")
    .map((x) =>
      x?.settings?.map((y, idx) =>
        original?.[y.activity]
          ?.map((z) => ({
            idx: idx,
            timestamp: z.timestamp,
            duration: z.duration,
            activity: x.name,
            slices: z.temporal_slices.find((a) => a.item === y.question),
          }))
          .filter((y) => y.slices !== undefined)
      )
    )
    .filter((x) => x !== undefined)
    .flat(2)
    .groupBy("activity")
  let customGroups = Object.entries(customEvents).map(([k, x]) => [
    k,
    Object.values(x.groupBy("timestamp")).map((z: any) => ({
      timestamp: z?.[0].timestamp,
      duration: z?.[0].duration,
      activity: z?.[0].activity,
      static_data: {},
      temporal_slices: Array.from(
        z?.reduce((prev, curr) => ({ ...prev, [curr.idx]: curr.slices }), {
          length:
            z
              .map((a) => a.idx)
              .sort()
              .slice(-1)[0] + 1,
        })
      ).map((a) => (a === undefined ? {} : a)),
    })),
  ])
  return Object.fromEntries([...Object.entries(original), ...customGroups])
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
  const [openDialog, setOpen] = useState(false)
  const [hideCareTeam, setHideCareTeam] = useState(_hideCareTeam())
  const [hiddenEvents, setHiddenEvents] = React.useState([])
  const classes = useStyles()
  const [loading, setLoading] = useState(true)
  const [openComplete, setOpenComplete] = React.useState(false)
  const [streak, setStreak] = useState(1)
  const [visualPopup, setVisualPopup] = useState(null)
  const [currentActivity, setCurrentActivity] = useState(null)
  const { t, i18n } = useTranslation()

  const [emptyLearnTab, setEmptyLearnTab] = useState(false)
  const [emptyAssessTab, setEmptyAssessTab] = useState(false)
  const [emptyManageTab, setEmptyManageTab] = useState(false)
  const [emptyPortalTab, setEmptyPortalTab] = useState(false)

  const [allEmpty, setAllEmpty] = useState(false)

  let currentDate = new Date()
  let prevDate = new Date()
  let endTime = currentDate.getTime()
  let startTime = prevDate.getTime()
  const [startDate, setStartDate] = React.useState<number>(startTime)
  const [endDate, setEndDate] = React.useState<number>(endTime)
  const { isLoggedIn } = useAuthContext()

  useEffect(() => {
    setLoading(true)
    if (allEmpty) {
      _setTab("feed")
      setLoading(false)
    } else {
      setLoading(false)
    }
  }, [])

  const tabDirection = (currentTab) => {
    return supportsSidebar ? "up" : "left"
  }

  const getSelectedLanguage = () => {
    const matched_codes = Object.keys(locale_lang).filter((code) => code.startsWith(navigator.language))
    const lang = matched_codes.length > 0 ? matched_codes[0] : "en-US"
    return i18n.language ? i18n.language : lang ? lang : "en-US"
  }

  const checkEmptyActivities = (updatedActivities) => {
    const hasLearnActivities = checkLearnActivities(updatedActivities)
    const hasAssessActivities = checkAssessActivities(updatedActivities)
    const hasManageActivities = checkManageActivities(updatedActivities)
    const hasPortalActivities = checkPortalActivities(updatedActivities)
    if (!hasLearnActivities && !hasAssessActivities && !hasManageActivities && !hasPortalActivities) {
      setAllEmpty(true)
    }
  }

  const checkLearnActivities = (updatedActivities) => {
    const hasLearnActivities = updatedActivities.some(
      (x) =>
        (x.spec === "lamp.tips" && (typeof x?.category === "undefined" || x?.category === null)) ||
        (!!x?.category && x?.category.includes("learn"))
    )
    setEmptyLearnTab(!hasLearnActivities)
    return hasLearnActivities
  }
  const checkAssessActivities = (updatedActivities) => {
    const hasAssessActivities = updatedActivities.some(
      (x) =>
        ((games.includes(x.spec) ||
          x.spec === "lamp.group" ||
          x.spec === "lamp.dbt_diary_card" ||
          x.spec === "lamp.recording" ||
          x.spec === "lamp.survey") &&
          (typeof x?.category === "undefined" || x?.category === null)) ||
        (!!x?.category && x?.category.includes("assess"))
    )
    setEmptyAssessTab(!hasAssessActivities)
    return hasAssessActivities
  }
  const checkManageActivities = (updatedActivities) => {
    const hasManageActivities = updatedActivities.some(
      (x: any) =>
        ((x.spec === "lamp.journal" || x.spec === "lamp.breathe" || x.spec === "lamp.scratch_image") &&
          (typeof x?.category === "undefined" || x?.category === null)) ||
        (!!x?.category && x?.category.includes("manage"))
    )
    setEmptyManageTab(!hasManageActivities)
    return hasManageActivities
  }
  const checkPortalActivities = (updatedActivities) => {
    const hasPortalActivities = updatedActivities.some((x: any) => !!x?.category && x?.category.includes("prevent"))
    setEmptyPortalTab(!hasPortalActivities)
    return hasPortalActivities
  }

  useEffect(() => {
    setDisplayTab()
  }, [emptyAssessTab, emptyLearnTab, emptyManageTab, emptyPortalTab, allEmpty])

  const setDisplayTab = () => {
    if (emptyPortalTab && (!emptyAssessTab || !emptyLearnTab || !emptyManageTab)) {
      setEmptyPortalTab(false)
    }
    if (allEmpty) {
      _setTab("feed")
      return
    } else {
      let currentTab = tab === "assess" && emptyAssessTab ? (emptyLearnTab ? "manage" : "learn") : tab
      _setTab(currentTab)
    }
  }

  const loadData = () => {
    setLoading(true)
    LAMP.Activity.allByParticipant(participant.id, null, false).then((activities) => {
      ;(async () => {
        let tag = [await LAMP.Type.getAttachment(null, "lamp.dashboard.hide_activities")].map((y: any) =>
          !!y?.error ? undefined : y?.data
        )[0]
        const hiddenActivities = (tag || []).flatMap((module) => module.activities)
        const updatedActivities = (activities || []).filter((activity) => !hiddenActivities.includes(activity.id))
        if (tab !== undefined || tab !== null) {
          setActivities(updatedActivities)
          checkEmptyActivities(updatedActivities)
          checkLearnActivities(updatedActivities)
          checkAssessActivities(updatedActivities)
          checkManageActivities(updatedActivities)
          checkPortalActivities(updatedActivities)
        }
        if (updatedActivities.length === 0) {
          setLoading(false)
        }
        // props.activeTab(tab, participant.id)
      })()

      let language = !!localStorage.getItem("LAMP_user_" + participant.id)
        ? JSON.parse(localStorage.getItem("LAMP_user_" + participant.id)).language
        : getSelectedLanguage()
        ? getSelectedLanguage()
        : "en-US"
      i18n.changeLanguage(language)
      //  getShowWelcome(participant).then(setOpen)
    })
    getHiddenEvents(participant).then(setHiddenEvents)
    tempHideCareTeam(participant).then(setHideCareTeam)
  }
  useEffect(() => {
    if (isLoggedIn || LAMP.Auth?._auth?.serverAddress == "demo.lamp.digital") {
      loadData()
    } else {
      window.location.href = "/#/"
    }
  }, [isLoggedIn])

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    props.activeTab(tab, participant.id)
    if (activities !== null) {
      Service.getAllTags("activitytags").then((result) => {
        if ((result || []).length == 0) {
          let data = []
          let count = 0
          ;(activities || []).map((activity) => {
            getImage(activity.id, activity.spec).then((img) => {
              data.push({
                id: activity.id,
                category: activity.category,
                showFeed: img?.showFeed ?? true,
                spec: activity.spec,
                description: img?.description ?? "",
                photo: img?.photo ?? null,
                streak: img?.streak ?? null,
                questions: img?.questions ?? null,
                visualSettings: img?.visualSettings ?? null,
                branchingSettings: img?.branchingSettings ?? null,
              })
              if (count === activities.length - 1) {
                Service.addUserData("activitytags", data, true).then(() => {
                  setLoading(false)
                })
              }
              count++
            })
          })
        } else {
          setLoading(false)
        }
      })
    } else {
      // setLoading(false)
    }
  }, [activities])

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

  const showVisualPopup = (activity) => {
    Service.getUserDataByKey("activitytags", [activity?.id], "id").then((tags) => {
      const tag = tags[0]
      if (typeof tag?.visualSettings === "undefined" || !!tag?.visualSettings) {
        setVisualPopup(tag?.visualSettings)
        setCurrentActivity(activity)
      } else {
        showStreak(participant, activity)
      }
    })
  }

  const showStreak = (participant, activity) => {
    setVisualPopup(null)
    Service.getUserDataByKey("activitytags", [activity?.id], "id").then((tags) => {
      const tag = tags[0]
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

  const closePopup = () => {
    setAllEmpty(false)
    setLoading(true)

    if (activities !== null) {
      _setTab("feed")
      setLoading(false)
    }
  }

  return (
    <React.Fragment>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {allEmpty ? (
        <NoActivityPopup
          onClose={closePopup}
          open={allEmpty}
          confirmAction={null}
          confirmationMsg={t("Your administrator has not added any mindLAMP activities for you.")}
        />
      ) : (
        <>
          {activities !== null && !loading && (
            <Box>
              <Slide in={tab === "learn"} direction={tabDirection(0)} mountOnEnter unmountOnExit>
                <Box mt={1} mb={4}>
                  <Learn
                    participant={participant}
                    activities={activities}
                    activeTab={activeTab}
                    showStreak={showVisualPopup}
                  />
                </Box>
              </Slide>
              <Slide in={tab === "assess"} direction={tabDirection(1)} mountOnEnter unmountOnExit>
                <Box mt={1} mb={4}>
                  <Survey participant={participant} activities={activities} showStreak={showVisualPopup} />
                </Box>
              </Slide>
              <Slide in={tab === "manage"} direction={tabDirection(2)} mountOnEnter unmountOnExit>
                <Box mt={1} mb={4}>
                  <Manage
                    participant={participant}
                    activities={activities}
                    activeTab={activeTab}
                    showStreak={showVisualPopup}
                  />
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
                    showStreak={showVisualPopup}
                    activitySubmitted={openComplete}
                    onEditAction={(activity, data) => {
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
                    showStreak={showVisualPopup}
                  />
                </Box>
              </Slide>
              <BottomMenu
                activeTab={activeTab}
                tabValue={tab}
                participant={participant}
                showWelcome={openDialog}
                setShowDemoMessage={(val) => props.setShowDemoMessage(val)}
                emptyLearnTab={emptyLearnTab}
                emptyAssessTab={emptyAssessTab}
                emptyManageTab={emptyManageTab}
                emptyPortalTab={emptyPortalTab}
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
        </>
      )}
      <Streak
        open={openComplete}
        onClose={() => {
          setOpenComplete(false)
        }}
        activity={streakActivity}
        streak={streak}
      />

      {/* <ConfirmationDialog
        onClose={() => setConfirm(false)}
        open={confirm}
        confirmAction={loadData}
        confirmationMsg={t("Would you like to resume this activity where you left off?")}
      /> */}
      {!!visualPopup?.checked && (
        <VisualPopup
          open={visualPopup?.checked ?? false}
          image={visualPopup?.image}
          showStreak={() => showStreak(participant, currentActivity)}
        />
      )}
    </React.Fragment>
  )
}
