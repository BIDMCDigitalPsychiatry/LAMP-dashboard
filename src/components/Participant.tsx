// Core Imports
import React, { useState, useEffect } from "react"
import {
  Box,
  Divider,
  Grid,
  Fab,
  Drawer,
  Icon,
  useTheme,
  useMediaQuery,
  Tooltip,
  BottomNavigationAction,
  Slide,
} from "@material-ui/core"
import { useSnackbar } from "notistack"

// Local Imports
import LAMP, { Participant as ParticipantObj, Activity as ActivityObj } from "lamp-core"
import CareTeam from "./CareTeam"
import Messages from "./Messages"
import Launcher from "./Launcher"
import Survey from "./Survey"
import ResponsiveDialog from "./ResponsiveDialog"
import Breathe from "./Breathe"
import Jewels from "./Jewels"
import { spliceActivity } from "./ActivityList"
import Journal from "./Journal"
import Resources from "./Resources"
import Tips from "./Tips"
import Hopebox from "./Hopebox"
import ParticipantData from "./ParticipantData"

function _hideCareTeam() {
  return (LAMP.Auth._auth.serverAddress || "").includes(".psych.digital")
}
function _patientMode() {
  return LAMP.Auth._type === "participant"
}
function _shouldRestrict() {
  return _patientMode() && _hideCareTeam()
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
          <Survey
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

export default function Participant({ participant, ...props }: { participant: ParticipantObj }) {
  const [activities, setActivities] = useState([])
  const [hiddenEvents, setHiddenEvents] = React.useState([])
  const [visibleActivities, setVisibleActivities] = useState([])
  const [launchedActivity, setLaunchedActivity] = useState<string>()
  const [tab, _setTab] = useState(3)
  const [lastTab, _setLastTab] = useState(3)
  const supportsSidebar = useMediaQuery(useTheme().breakpoints.up("md"))
  const { enqueueSnackbar } = useSnackbar()

  const setTab = (newTab) => {
    _setLastTab(tab)
    _setTab(newTab)
  }
  const tabDirection = (currentTab) => {
    return tab > lastTab && currentTab !== tab ? (supportsSidebar ? "down" : "right") : supportsSidebar ? "up" : "left"
  }

  useEffect(() => {
    LAMP.Activity.allByParticipant(participant.id).then(setActivities)
    getHiddenEvents(participant).then(setHiddenEvents)
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
      temporal_slices: (x || []).map((y) => ({
        item: y !== undefined ? y.item : null,
        value: y !== undefined ? y.value : null,
        type: null,
        level: null,
        duration: 0,
      })),
    }))

    //
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
          <Launcher.Section>
            {!_hideCareTeam() && (
              <Launcher.Button
                favorite
                title="Tips"
                icon={<Icon fontSize="large">flare</Icon>}
                onClick={() => setLaunchedActivity("tips")}
              />
            )}
            {!_hideCareTeam() && (
              <Launcher.Button
                favorite
                title="Resources"
                icon={<Icon fontSize="large">menu_book</Icon>}
                onClick={() => setLaunchedActivity("resources")}
              />
            )}
          </Launcher.Section>
        </Box>
      </Slide>
      <Slide in={tab === 1} direction={tabDirection(1)} mountOnEnter unmountOnExit>
        <Box my={4}>
          <Launcher.Section>
            {[
              ...(activities || [])
                .filter((x) => x.spec === "lamp.group" && (_shouldRestrict() ? x.name.includes("SELF REPORT") : true))
                .map((y) => (
                  <Launcher.Button
                    key={y.name}
                    notification
                    title={y.name}
                    icon={<Icon fontSize="large">menu_open</Icon>}
                    onClick={() =>
                      setVisibleActivities(
                        (activities ?? []).filter((x) => x.spec === "lamp.survey" && y.settings.includes(x.id))
                      )
                    }
                  />
                )),
              ...(activities || [])
                .filter((x) => x.spec === "lamp.survey" && (_shouldRestrict() ? x.name.includes("SELF REPORT") : true))
                .map((y) => (
                  <Launcher.Button
                    key={y.name}
                    favorite
                    title={y.name}
                    icon={<Icon fontSize="large">assignment</Icon>}
                    onClick={() => setVisibleActivities([y])}
                  />
                )),
            ]}
          </Launcher.Section>
        </Box>
      </Slide>
      <Slide in={tab === 2} direction={tabDirection(2)} mountOnEnter unmountOnExit>
        <Box my={4}>
          <Launcher.Section>
            {!_hideCareTeam() && (
              <Launcher.Button
                favorite
                title="Breathe"
                icon={<Icon fontSize="large">spa</Icon>}
                onClick={() => setLaunchedActivity("breathe")}
              />
            )}
            {!_hideCareTeam() && (
              <Launcher.Button
                favorite
                title="Jewels"
                icon={<Icon fontSize="large">videogame_asset</Icon>}
                onClick={() => setLaunchedActivity("jewels")}
              />
            )}
            {!_hideCareTeam() && (
              <Launcher.Button
                favorite
                title="Journal"
                icon={<Icon fontSize="large">import_contacts</Icon>}
                onClick={() => setLaunchedActivity("journal")}
              />
            )}
            {!_hideCareTeam() && (
              <Launcher.Button
                favorite
                title="Hope Box"
                icon={<Icon fontSize="large">launch</Icon>}
                onClick={() => setLaunchedActivity("hopebox")}
              />
            )}
          </Launcher.Section>
        </Box>
      </Slide>
      <Slide in={tab === 3} direction={tabDirection(3)} mountOnEnter unmountOnExit>
        <Box>
          {!_hideCareTeam() && (
            <Box border={1} borderColor="grey.300" borderRadius={4} bgcolor="white" p={2} my={4} displayPrint="none">
              <CareTeam participant={participant} />
            </Box>
          )}
          <ParticipantData
            participant={participant}
            hiddenEvents={hiddenEvents}
            enableEditMode={!_patientMode()}
            onEditAction={(activity, data) =>
              setVisibleActivities([
                {
                  ...activity,
                  prefillData: [
                    data.slice.map(({ item, value }) => ({
                      item,
                      value,
                    })),
                  ],
                  prefillTimestamp: data.x.getTime() /* post-increment later to avoid double-reporting events! */,
                },
              ])
            }
            onCopyAction={(activity, data) =>
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
            }
            onDeleteAction={(activity, data) => hideEvent(data.x.getTime(), activity.id)}
          />
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
            survey: <SurveyInstrument id={participant.id} group={visibleActivities} onComplete={submitSurvey} />,
            breathe: <Breathe onComplete={() => setLaunchedActivity(undefined)} />,
            jewels: <Jewels onComplete={() => setLaunchedActivity(undefined)} />,
            journal: <Journal onComplete={() => setLaunchedActivity(undefined)} />,
            hopebox: <Hopebox onComplete={() => setLaunchedActivity(undefined)} />,
            resources: <Resources onComplete={() => setLaunchedActivity(undefined)} />,
            tips: <Tips onComplete={() => setLaunchedActivity(undefined)} />,
          }[visibleActivities.length > 0 ? "survey" : launchedActivity ?? ""]
        }
      </ResponsiveDialog>
      <Box clone displayPrint="none">
        <Drawer
          open
          anchor={supportsSidebar ? "left" : "bottom"}
          variant="permanent"
          PaperProps={{
            style: {
              flexDirection: supportsSidebar ? "column" : "row",
              justifyContent: !supportsSidebar ? "center" : undefined,
              height: !supportsSidebar ? 56 : undefined,
              width: supportsSidebar ? 80 : undefined,
              transition: "all 500ms ease-in-out",
            },
          }}
        >
          <BottomNavigationAction
            showLabel
            selected={tab === 0}
            label="Learn"
            value={0}
            icon={<Icon>bookmark_border</Icon>}
            onChange={(_, newTab) => setTab(newTab)}
          />
          <BottomNavigationAction
            showLabel
            selected={tab === 1}
            label="Assess"
            value={1}
            icon={<Icon>assessment</Icon>}
            onChange={(_, newTab) => setTab(newTab)}
          />
          <BottomNavigationAction
            showLabel
            selected={tab === 2}
            label="Manage"
            value={2}
            icon={<Icon>create_outlined</Icon>}
            onChange={(_, newTab) => setTab(newTab)}
          />
          <BottomNavigationAction
            showLabel
            selected={tab === 3}
            label="Prevent"
            value={3}
            icon={<Icon>speaker_notes_outlined</Icon>}
            onChange={(_, newTab) => setTab(newTab)}
          />
        </Drawer>
      </Box>
    </React.Fragment>
  )
}
