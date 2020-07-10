// Core Imports
import React, { useState, useEffect } from "react"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import {
  Container,
  Box,
  Grid, 
  useTheme,
  useMediaQuery,
  Slide,
  Typography,
  Card,
} from "@material-ui/core"
import { useSnackbar } from "notistack"
// Local Imports
import LAMP, { Participant as ParticipantObj} from "lamp-core"
import BottomMenu from "./BottomMenu"
import Survey from "./Survey"

import ResponsiveDialog from "./ResponsiveDialog"
import Breathe from "./Breathe"
import Prevent from "./Prevent"

import Jewels from "./Jewels"
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
import { ReactComponent as BreatheIcon } from "../icons/Breathe.svg"
import { ReactComponent as JournalIcon } from "../icons/Journal.svg"
import { ReactComponent as JewelsIcon } from "../icons/Jewels.svg"
import { ReactComponent as Lightning } from "../icons/Lightning.svg"
import { ReactComponent as HopeBoxIcon } from "../icons/HopeBox.svg"
import { ReactComponent as Medication } from "../icons/Medication.svg"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
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
    manage: {
      background: "#FFEFEC",
      padding: "10px 0",
      minHeight: 180,
      textAlign: "center",
      boxShadow: "none",
      borderRadius: 18,
      position: "relative",
    }
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
  let _hidden = (await LAMP.Type.getAttachment(participant.id, "lamp.dashboard._nancy")) as any
  return !!_hidden.error ? false : (_hidden.data as boolean)
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
}) {
  const [activities, setActivities] = useState([])
  const [visibleActivities, setVisibleActivities] = useState([])
  const [launchedActivity, setLaunchedActivity] = useState<string>()

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
  const classes = useStyles()

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
    }
    return tabName
  }

  useEffect(() => {
    const tabName = getTabName(tab)
    props.activeTab(tabName)
    getShowWelcome(participant).then(setOpen)
    tempHideCareTeam(participant).then(setHideCareTeam)
  }, [])

  const activeTab = (newTab) => {
    _setTab(newTab)
    const tabName = getTabName(newTab)
    props.activeTab(tabName)
  }

  const submitSurvey = (response, overwritingTimestamp) => {
    
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
          <Survey participant={participant} surveyDone={props.surveyDone} submitSurvey={submitSurvey} />
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
      <BottomMenu activeTab={activeTab} tabValue={getTab()} />
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
