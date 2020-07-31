// Core Imports
import React, { useState, useEffect } from "react"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import { Box, useTheme, useMediaQuery, Slide } from "@material-ui/core"
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
    //getShowWelcome(participant).then(setOpen)
    tempHideCareTeam(participant).then(setHideCareTeam)
  }, [])

  const activeTab = (newTab) => {
    _setTab(newTab)
    const tabName = getTabName(newTab)
    props.activeTab(tabName)
  }

  const submitSurvey = (response, overwritingTimestamp) => {}

  return (
    <React.Fragment>
      <Slide in={tab === 0} direction={tabDirection(0)} mountOnEnter unmountOnExit>
        <Box my={4}>
          <Learn participant={participant} activeTab={activeTab} />
        </Box>
      </Slide>
      <Slide in={tab === 1} direction={tabDirection(1)} mountOnEnter unmountOnExit>
        <Box my={4}>
          <Survey
            participant={participant}
            surveyDone={props.surveyDone}
            activeTab={activeTab}
            submitSurvey={submitSurvey}
          />
        </Box>
      </Slide>
      <Slide in={tab === 2} direction={tabDirection(2)} mountOnEnter unmountOnExit>
        <Box my={4}>
          <Manage participant={participant} activeTab={activeTab} />
        </Box>
      </Slide>
      <Slide in={tab === 3} direction={tabDirection(3)} mountOnEnter unmountOnExit>
        <Box my={4}>
          <Prevent participant={participant} activeTab={activeTab} />
        </Box>
      </Slide>
      <BottomMenu activeTab={activeTab} tabValue={tab} />
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
