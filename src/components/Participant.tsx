// Core Imports
import React, { useState, useEffect } from "react"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import {
  Container,
  Box,
  Divider,
  Grid,
  Fab,
  Drawer,
  Icon,
  useTheme,
  useMediaQuery,
  Tooltip,
  Slide,
  Typography,
  Card,
} from "@material-ui/core"
import { useSnackbar } from "notistack"
// Local Imports
import LAMP, { Participant as ParticipantObj, Activity as ActivityObj } from "lamp-core"
import BottomMenu from "./BottomMenu"
import Messages from "./Messages"
import { Link as RouterLink } from "react-router-dom"
import Link from "@material-ui/core/Link"
import SurveyPage from "./SurveyPage"
import Survey from "./Survey"

import ResponsiveDialog from "./ResponsiveDialog"
import Breathe from "./Breathe"
import Prevent from "./Prevent"

import Jewels from "./Jewels"
import { spliceActivity } from "./ActivityList"
import Journal from "./Journal"
import Resources from "./Resources"
import MoodTipsSection from "./MoodTips"
import SleepTipsSecion from "./SleepTips"
import SocialTips from "./SocialTips"
import Hopebox from "./Hopebox"
import BookRecommendations from "./BookRecommendations"
import Definitions from "./Definitions"
import PhysicalTips from "./PhysicalTips"
import StressTips from "./StressTips"
import Motivation from "./Motivation"
import Welcome from "./Welcome"
import MedicationTracker from "./MedicationTracker"
import { ReactComponent as Book } from "../icons/Book.svg"
import { ReactComponent as MoodTips } from "../icons/MoodTips.svg"
import { ReactComponent as SleepTips } from "../icons/SleepTips.svg"
import { ReactComponent as Chat } from "../icons/Chat.svg"
import { ReactComponent as Wellness } from "../icons/Wellness.svg"
import { ReactComponent as PaperLens } from "../icons/PaperLens.svg"
import { ReactComponent as Info } from "../icons/Info.svg"
import { ReactComponent as Surveys } from "../icons/Surveys.svg"
import { ReactComponent as BreatheIcon } from "../icons/Breathe.svg"
import { ReactComponent as JournalIcon } from "../icons/Journal.svg"
import { ReactComponent as JewelsIcon } from "../icons/Jewels.svg"
import { ReactComponent as Lightning } from "../icons/Lightning.svg"
import { ReactComponent as HopeBoxIcon } from "../icons/HopeBox.svg"
import { ReactComponent as AssessMood } from "../icons/AssessMood.svg"
import { ReactComponent as AssessAnxiety } from "../icons/AssessAnxiety.svg"
import { ReactComponent as AssessNutrition } from "../icons/AssessNutrition.svg"
import { ReactComponent as AssessUsability } from "../icons/AssessUsability.svg"
import { ReactComponent as AssessSocial } from "../icons/AssessSocial.svg"
import { ReactComponent as AssessSleep } from "../icons/AssessSleep.svg"
import { ReactComponent as Medication } from "../icons/Medication.svg"

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
    learn: {
      background: "#FFF9E5",
      padding: "10px 0",
      minHeight: 180,
      textAlign: "center",
      boxShadow: "none",
      borderRadius: 18,
      position: "relative",
    },

    cardlabel: {
      fontSize: 16,

      padding: "0 18px",
      bottom: 15,
      position: "absolute",
      width: "100%",
    },
    preventlabel: {
      fontSize: 16,

      padding: "0 18px",
      marginTop: 5,

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
    manage: {
      background: "#FFEFEC",
      padding: "10px 0",
      minHeight: 180,
      textAlign: "center",
      boxShadow: "none",
      borderRadius: 18,
      position: "relative",
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
  let _hidden = (await LAMP.Type.getAttachment(participant.id, "lamp.dashboard._nancy")) as any
  return !!_hidden.error ? false : (_hidden.data as boolean)
}

// Refresh hidden events list.
async function getHiddenEvents(participant: ParticipantObj): Promise<string[]> {
  let _hidden = (await LAMP.Type.getAttachment(participant.id, "lamp.dashboard.hidden_events")) as any
  return !!_hidden.error ? [] : (_hidden.data as string[])
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

// Splice together all selected activities & their tags.
async function getSplicedSurveys(activities) {
  let res = await Promise.all(activities.map((x) => LAMP.Type.getAttachment(x.id, "lamp.dashboard.survey_description")))
  let spliced = res.map((y: any, idx) =>
    spliceActivity({
      raw: activities[idx],
      tag: !!y.error ? undefined : y.data,
    })
  )
  // Short-circuit the main title & description if there's only one survey.
  const main = {
    name: spliced.length === 1 ? spliced[0].name : "Multi-questionnaire",
    description: spliced.length === 1 ? spliced[0].description : "Please complete all sections below. Thank you.",
  }
  if (spliced.length === 1) spliced[0].name = spliced[0].description = undefined
  return {
    name: main.name,
    description: main.description,
    sections: spliced,
  }
}

function SurveyInstrument({ id, group, onComplete, ...props }) {
  const [survey, setSurvey] = useState<any>()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const supportsSidebar = useMediaQuery(useTheme().breakpoints.up("md"))
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (group.length === 0) return setSurvey(undefined)
    getSplicedSurveys(group).then((spliced) =>
      setSurvey({
        ...spliced,
        prefillData: !_patientMode() ? group[0].prefillData : undefined,
        prefillTimestamp: !_patientMode() ? group[0].prefillTimestamp : undefined,
      })
    )
  }, [group])

  return (
    <Box py={8} px={2}>
      <Grid container direction="row">
        <Grid item style={{ width: "100%" }}>
          <SurveyPage
            validate
            partialValidationOnly
            content={survey}
            prefillData={!!survey ? survey.prefillData : undefined}
            prefillTimestamp={!!survey ? survey.prefillTimestamp : undefined}
            onValidationFailure={() =>
              enqueueSnackbar("Some responses are missing. Please complete all questions before submitting.", {
                variant: "error",
              })
            }
            onResponse={onComplete}
          />
        </Grid>
        {supportsSidebar && !_patientMode() && (
          <Grid item>
            <Drawer anchor="right" variant="temporary" open={!!sidebarOpen} onClose={() => setSidebarOpen(undefined)}>
              <Box flexGrow={1} />
              <Divider />
              <Messages refresh={!!survey} expandHeight privateOnly participant={id} />
            </Drawer>
            <Tooltip title="Patient Notes" placement="left">
              <Fab
                color="primary"
                aria-label="Patient Notes"
                style={{ position: "fixed", bottom: 85, right: 24 }}
                onClick={() => setSidebarOpen(true)}
              >
                <Icon>note_add</Icon>
              </Fab>
            </Tooltip>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}

export default function Participant({ participant, ...props }: { participant: ParticipantObj; activeTab: Function }) {
  const [activities, setActivities] = useState([])
  const [hiddenEvents, setHiddenEvents] = React.useState([])
  const [visibleActivities, setVisibleActivities] = useState([])
  const [launchedActivity, setLaunchedActivity] = useState<string>()
  const [tab, _setTab] = useState(_patientMode() ? 1 : 3)
  const supportsSidebar = useMediaQuery(useTheme().breakpoints.up("md"))
  const { enqueueSnackbar } = useSnackbar()
  const [openDialog, setOpen] = useState(false)
  const [hideCareTeam, setHideCareTeam] = useState(_hideCareTeam())
  const classes = useStyles()

  let activeTab = (newTab?: any) => {
    _setTab(newTab)
    const tabName = getTabName(newTab)
    props.activeTab(tabName)
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
    }
    return tabName
  }
  const tabDirection = (currentTab) => {
    return supportsSidebar ? "up" : "left"
  }

  useEffect(() => {
    const tabName = getTabName(tab)
    props.activeTab(tabName)
    LAMP.Activity.allByParticipant(participant.id).then(setActivities)
    getHiddenEvents(participant).then(setHiddenEvents)
    getShowWelcome(participant).then(setOpen)
    tempHideCareTeam(participant).then(setHideCareTeam)
  }, [])

  const hideEvent = async (timestamp?: number, activity?: string) => {
    if (timestamp === undefined && activity === undefined) {
      setHiddenEvents(hiddenEvents) // trigger a reload for dependent components only
      return
    }
    let result = await addHiddenEvent(participant, timestamp, activity)
    if (!!result) {
      setHiddenEvents(result)
    } else {
      enqueueSnackbar("Failed to hide this event.", { variant: "error" })
    }
  }

  const submitSurvey = (response, overwritingTimestamp) => {
    let events = response.map((x, idx) => ({
      timestamp: !!overwritingTimestamp ? overwritingTimestamp + 1000 /* 1sec */ : new Date().getTime(),
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
      setVisibleActivities([])

      // If a timestamp was provided to overwrite data, hide the original event too.
      if (!!overwritingTimestamp) hideEvent(overwritingTimestamp, visibleActivities[0 /* assumption made here */].id)
      else hideEvent() // trigger a reload of dependent components anyway
    })
  }

  return (
    <React.Fragment>
      <Slide in={tab === 0} direction={tabDirection(0)} mountOnEnter unmountOnExit>
        <Box my={4}>
          <Container>
            <Grid container spacing={2}>
              {!hideCareTeam && (
                <Grid item xs={6} md={4} lg={3} onClick={() => setLaunchedActivity("moodtips")}>
                  <Card className={classes.learn}>
                    <Box mt={2} mb={1}>
                      <MoodTips />
                    </Box>
                    <Typography className={classes.cardlabel}>Mood Tips</Typography>
                  </Card>
                </Grid>
              )}
              {!hideCareTeam && (
                <Grid item xs={6} md={4} lg={3} onClick={() => setLaunchedActivity("sleeptips")}>
                  <Card className={classes.learn}>
                    <Box mt={2} mb={1}>
                      <SleepTips />
                    </Box>
                    <Typography className={classes.cardlabel}>Sleep Tips</Typography>
                  </Card>
                </Grid>
              )}
              {!hideCareTeam && (
                <Grid item xs={6} md={4} lg={3} onClick={() => setLaunchedActivity("socialtips")}>
                  <Card className={classes.learn}>
                    <Box mt={2} mb={1}>
                      <Chat />
                    </Box>
                    <Typography className={classes.cardlabel}>Social Tips</Typography>
                  </Card>
                </Grid>
              )}
              {!hideCareTeam && (
                <Grid item xs={6} md={4} lg={3} onClick={() => setLaunchedActivity("resources")}>
                  <Card className={classes.learn}>
                    <Box mt={1}>
                      <Info />
                    </Box>
                    <Typography className={classes.cardlabel}>Mental Health Resources</Typography>
                  </Card>
                </Grid>
              )}
              {!hideCareTeam && (
                <Grid item xs={6} md={4} lg={3} onClick={() => setLaunchedActivity("physicalwellness")}>
                  <Card className={classes.learn}>
                    <Box mt={2} mb={1}>
                      <Wellness />
                    </Box>
                    <Typography className={classes.cardlabel}>Physical Wellness</Typography>
                  </Card>
                </Grid>
              )}
              {!hideCareTeam && (
                <Grid item xs={6} md={4} lg={3} onClick={() => setLaunchedActivity("bookrecommendations")}>
                  <Card className={classes.learn}>
                    <Box mt={1}>
                      <Book />
                    </Box>
                    <Typography className={classes.cardlabel}>Suggested Reading</Typography>
                  </Card>
                </Grid>
              )}
              {!hideCareTeam && (
                <Grid item xs={6} md={4} lg={3} onClick={() => setLaunchedActivity("motivation")}>
                  <Card className={classes.learn}>
                    <Box mt={2} mb={1}>
                      <PaperLens />
                    </Box>
                    <Typography className={classes.cardlabel}>Motivation</Typography>
                  </Card>
                </Grid>
              )}
              {!hideCareTeam && (
                <Grid item xs={6} md={4} lg={3} onClick={() => setLaunchedActivity("stresstips")}>
                  <Card className={classes.learn}>
                    <Box mt={2} mb={1}>
                      <Lightning />
                    </Box>
                    <Typography className={classes.cardlabel}>Stress Tips</Typography>
                  </Card>
                </Grid>
              )}
            </Grid>
          </Container>
        </Box>
      </Slide>
      <Slide in={tab === 1} direction={tabDirection(1)} mountOnEnter unmountOnExit>
        <Box my={4}>
          <Survey participant={participant} />
          {/* <Container> */}

          {/* <Grid container spacing={2}>
              {[
                ...(activities || [])
                  .filter((x) => x.spec === "lamp.group" && (_shouldRestrict() ? x.name.includes("SELF REPORT") : true))
                  .map((y) => (
                    <Grid item xs={3}>sdf</Grid>
                    //   <Launcher.Button
                    //     key={y.name}
                    //     notification
                    //     title={y.name}
                    //     icon={<Surveys style={{ width: "100%", height: "100%" }} />}
                    //     onClick={() =>
                    //       setVisibleActivities(
                    //         (activities ?? []).filter((x) => x.spec === "lamp.survey" && y.settings.includes(x.id))
                    //       )
                    //     }
                    //   />
                    // sdf</Grid>
                  )),
                ...(activities || [])
                  .filter(
                    (x) => x.spec === "lamp.survey" && (_shouldRestrict() ? x.name.includes("SELF REPORT") : true)
                  )
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
            </Grid> */}
          {/* </Container> */}
        </Box>
      </Slide>
      <Slide in={tab === 2} direction={tabDirection(2)} mountOnEnter unmountOnExit>
        <Box my={4}>
          <Container>
            <Grid container spacing={2}>
              {!hideCareTeam && (
                <Grid item xs={6} md={4} lg={3} onClick={() => setLaunchedActivity("breathe")}>
                  <Card className={classes.manage}>
                    <Box mt={2} mb={1}>
                      <BreatheIcon />
                    </Box>
                    <Typography className={classes.cardlabel}>Mood Tips</Typography>
                  </Card>
                </Grid>
              )}
              {!hideCareTeam && (
                <Grid item xs={6} md={4} lg={3} onClick={() => setLaunchedActivity("jewels")}>
                  <Card className={classes.manage}>
                    <Box mt={2} mb={1}>
                      <JewelsIcon />
                    </Box>
                    <Typography className={classes.cardlabel}>Jewels</Typography>
                  </Card>
                </Grid>
              )}
              {!hideCareTeam && (
                <Grid item xs={6} md={4} lg={3} onClick={() => setLaunchedActivity("journal")}>
                  <Card className={classes.manage}>
                    <Box mt={2} mb={1}>
                      <JournalIcon />
                    </Box>
                    <Typography className={classes.cardlabel}>Journal</Typography>
                  </Card>
                </Grid>
              )}
              {!hideCareTeam && (
                <Grid item xs={6} md={4} lg={3} onClick={() => setLaunchedActivity("hopebox")}>
                  <Card className={classes.manage}>
                    <Box mt={1}>
                      <HopeBoxIcon />
                    </Box>
                    <Typography className={classes.cardlabel}>Hope Box</Typography>
                  </Card>
                </Grid>
              )}
              {!hideCareTeam && (
                <Grid item xs={6} md={4} lg={3} onClick={() => setLaunchedActivity("medicationtracker")}>
                  <Card className={classes.manage}>
                    <Box mt={2} mb={1}>
                      <Medication />
                    </Box>
                    <Typography className={classes.cardlabel}>Medication Tracker</Typography>
                  </Card>
                </Grid>
              )}
            </Grid>
          </Container>
        </Box>
      </Slide>

      <Slide in={tab === 3} direction={tabDirection(3)} mountOnEnter unmountOnExit>
        <Box my={4}>
          <Prevent participant={participant} />
        </Box>
      </Slide>
      <ResponsiveDialog
        transient
        animate
        fullScreen
        open={!!launchedActivity || visibleActivities.length > 0}
        onClose={() => {
          setLaunchedActivity(undefined)
          setVisibleActivities([])
        }}
      >
        {
          {
            // survey: <SurveyInstrument id={participant.id} group={visibleActivities} onComplete={submitSurvey} />,
            breathe: <Breathe onComplete={() => setLaunchedActivity(undefined)} />,
            jewels: <Jewels onComplete={() => setLaunchedActivity(undefined)} />,
            journal: <Journal onComplete={() => setLaunchedActivity(undefined)} />,
            hopebox: <Hopebox onComplete={() => setLaunchedActivity(undefined)} />,
            resources: <Resources onComplete={() => setLaunchedActivity(undefined)} />,
            sleeptips: <SleepTipsSecion onComplete={() => setLaunchedActivity(undefined)} />,
            moodtips: <MoodTipsSection onComplete={() => setLaunchedActivity(undefined)} />,
            socialtips: <SocialTips onComplete={() => setLaunchedActivity(undefined)} />,
            bookrecommendations: <BookRecommendations onComplete={() => setLaunchedActivity(undefined)} />,
            definitions: <Definitions onComplete={() => setLaunchedActivity(undefined)} />,
            physicalwellness: <PhysicalTips onComplete={() => setLaunchedActivity(undefined)} />,
            stresstips: <StressTips onComplete={() => setLaunchedActivity(undefined)} />,
            motivation: <Motivation onComplete={() => setLaunchedActivity(undefined)} />,
            medicationtracker: <MedicationTracker onComplete={() => setLaunchedActivity(undefined)} />,
          }[visibleActivities.length > 0 ? "survey" : launchedActivity ?? ""]
        }
      </ResponsiveDialog>
      <BottomMenu activeTab={activeTab} />
      <ResponsiveDialog open={!!openDialog} transient animate fullScreen>
        <Welcome
          activities={activities}
          onClose={() => {
            setOpen(false)
            setShowWelcome(participant)
          }}
        />
      </ResponsiveDialog>
    </React.Fragment>
  )
}
