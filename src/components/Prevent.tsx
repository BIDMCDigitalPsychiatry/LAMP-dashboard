// Core Imports
import React from "react"
import {
  Container,
  Typography,
  Grid,
  Card,
  Icon,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  DialogActions,
  AppBar,
  Toolbar,
  ButtonBase,
  Link,
  Backdrop,
  CircularProgress,
  makeStyles,
  Theme,
  createStyles,
} from "@material-ui/core"
import { getImage } from "./Manage"
import LAMP, {
  Participant as ParticipantObj,
  Activity as ActivityObj,
  ActivityEvent as ActivityEventObj,
  SensorEvent as SensorEventObj,
} from "lamp-core"
import ActivityBox from "./ActivityBox"
import PreventSelections from "./PreventSelections"
import { useTranslation } from "react-i18next"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    thumbContainer: {
      maxWidth: 1055,
      width: "80%",
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        paddingBottom: 80,
      },
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
  })
)

// Perform event coalescing/grouping by sensor or activity type.
async function getSensorEvents(participant: ParticipantObj): Promise<{ [groupName: string]: SensorEventObj[] }> {
  let _events = ((await LAMP.SensorEvent.allByParticipant(participant.id)) as any).groupBy("sensor")

  // Perform datetime coalescing to either days or weeks.
  _events["lamp.steps"] = Object.values(
    ((_events || {})["lamp.steps"] || [])
      .map((x) => ({
        ...x,
        timestamp: Math.round(x.timestamp / (24 * 60 * 60 * 1000)) /* days */,
      }))
      .groupBy("timestamp")
  )
    .map((x: any[]) =>
      x.reduce(
        (a, b) =>
          !!a.timestamp
            ? {
                ...a,
                data: {
                  value:
                    (typeof a.data.value !== "number" ? 0 : a.data.value) +
                    (typeof b.data.value !== "number" ? 0 : b.data.value),
                  units: "steps",
                },
              }
            : b,
        {}
      )
    )
    .map((x) => ({
      ...x,
      timestamp: x.timestamp * (24 * 60 * 60 * 1000) /* days */,
    }))
  return _events
}

// Perform event coalescing/grouping by sensor or activity type.
async function getActivityEvents(
  participant: ParticipantObj,
  _activities: ActivityObj[],
  _hidden: string[]
): Promise<{ [groupName: string]: ActivityEventObj[] }> {
  let original = (await LAMP.ActivityEvent.allByParticipant(participant.id))
    .map((x) => ({
      ...x,
      activity: _activities.find((y) => x.activity === y.id),
    }))
    .filter((x) => (!!x.activity ? !_hidden.includes(`${x.timestamp}/${x.activity.id}`) : true))
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

async function getActivities(participant: ParticipantObj) {
  let original = await LAMP.Activity.allByParticipant(participant.id, null, true)
  let originalFiltered = original.filter((data) => data.spec !== "lamp.recording")
  return [...originalFiltered]
}

async function getSelectedActivities(participant: ParticipantObj) {
  return (
    Object.fromEntries(
      (
        await Promise.all(
          [participant.id || ""].map(async (x) => [
            x,
            await LAMP.Type.getAttachment(x, "lamp.selectedActivities").catch((e) => []),
          ])
        )
      )
        .filter((x: any) => x[1].message !== "404.object-not-found")
        .map((x: any) => [x[0], x[1].data])
    )[participant.id || ""] ?? []
  )
}
async function getSelectedSensors(participant: ParticipantObj) {
  return (
    Object.fromEntries(
      (
        await Promise.all(
          [participant.id || ""].map(async (x) => [
            x,
            await LAMP.Type.getAttachment(x, "lamp.selectedSensors").catch((e) => []),
          ])
        )
      )
        .filter((x: any) => x[1].message !== "404.object-not-found")
        .map((x: any) => [x[0], x[1].data])
    )[participant.id || ""] ?? []
  )
}

async function getSelectedExperimental(participant: ParticipantObj) {
  return (
    Object.fromEntries(
      (
        await Promise.all(
          [participant.id || ""].map(async (x) => [
            x,
            await LAMP.Type.getAttachment(x, "lamp.selectedExperimental").catch((e) => []),
          ])
        )
      )
        .filter((x: any) => x[1].message !== "404.object-not-found")
        .map((x: any) => [x[0], x[1].data])
    )[participant.id || ""] ?? []
  )
}

function getActivityEventCount(activity_events: { [groupName: string]: ActivityEventObj[] }) {
  return Object.assign(
    {},
    ...Object.entries(activity_events || {}).map(([k, v]: [string, any[]]) => ({
      [k]: v.length,
    }))
  )
}

async function getVisualizations(participant: ParticipantObj) {
  let visualizations = {}
  for (let attachmentID of ((await LAMP.Type.listAttachments(participant.id)) as any).data || []) {
    if (!attachmentID.startsWith("lamp.dashboard.experimental")) continue
    let bstr = ((await LAMP.Type.getAttachment(participant.id, attachmentID)) as any).data
    visualizations[attachmentID] =
      typeof bstr === "object"
        ? bstr
        : typeof bstr === "string" && bstr.startsWith("data:")
        ? bstr
        : `data:image/svg+xml;base64,${bstr}` // defaults
  }
  return visualizations
}

// Perform count coalescing on processed events grouped by type.
function getSensorEventCount(sensor_events: { [groupName: string]: SensorEventObj[] }) {
  return {
    "Environmental Context":
      sensor_events?.["lamp.gps.contextual"]?.filter((x) => !!x.data?.context?.environment)?.length ?? 0,
    "Social Context": sensor_events?.["lamp.gps.contextual"]?.filter((x) => !!x.data?.context?.social)?.length ?? 0,
    "Step Count": sensor_events?.["lamp.steps"]?.length ?? 0,
  }
}

export default function Prevent({
  participant,
  activeTab,
  allActivities,
  hiddenEvents,
  enableEditMode,
  showSteak,
  submitSurvey,
  onEditAction,
  onCopyAction,
  onDeleteAction,
  ...props
}: {
  participant: ParticipantObj
  activeTab: Function
  allActivities: any
  hiddenEvents: string[]
  enableEditMode: boolean
  showSteak: Function
  onEditAction: (activity: ActivityObj, data: any) => void
  onCopyAction: (activity: ActivityObj, data: any) => void
  onDeleteAction: (activity: ActivityObj, data: any) => void
  submitSurvey: Function
}) {
  const classes = useStyles()
  const { t, i18n } = useTranslation()
  const [savedActivities, setSavedActivities] = React.useState([])
  const [tag, setTag] = React.useState([])
  const [disabled, setDisabled] = React.useState(true)
  const [activityCounts, setActivityCounts] = React.useState({})
  const [activities, setActivities] = React.useState([])
  const [sensorEvents, setSensorEvents] = React.useState({})
  const [sensorCounts, setSensorCounts] = React.useState({})
  const [activityEvents, setActivityEvents] = React.useState({})
  const [timeSpans, setTimeSpans] = React.useState({})
  const [loading, setLoading] = React.useState(true)
  const [visualizations, setVisualizations] = React.useState({})
  const [cortex, setCortex] = React.useState({})

  const setTabActivities = () => {
    let gActivities = allActivities.filter(
      (x: any) => !!x?.category && !!x?.category[0] && (x?.category[0] || "") === "prevent"
    )
    ;(async () => {
      let disabled =
        ((await LAMP.Type.getAttachment(participant.id, "lamp.dashboard.disable_data")) as any)?.data ?? false
      setDisabled(disabled)
    })()
    setSavedActivities(gActivities)
    if (gActivities.length > 0) {
      let tags = []
      let count = 0
      gActivities.map((activity, index) => {
        getImage(activity.id, activity.spec).then((img) => {
          tags[activity.id] = img
          if (count === gActivities.length - 1) {
            setLoading(false)
            setTag(tags)
          }
          count++
        })
      })
    } else {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    setTabActivities()
    ;(async () => {
      let disabled =
        ((await LAMP.Type.getAttachment(participant.id, "lamp.dashboard.disable_data")) as any)?.data ?? false
      setDisabled(disabled)
      if (!disabled) {
        let activities = !disabled
          ? allActivities.filter((activity) => activity.spec !== "lamp.recording")
          : allActivities.filter((activity) => activity.spec === "lamp.journal" || activity.spec !== "lamp.recording")
        getActivityEvents(participant, activities, hiddenEvents).then((activityEvents) => {
          let timeSpans = Object.fromEntries(
            Object.entries(activityEvents || {}).map((x) => [x[0], x[1][x[1].length - 1]])
          )
          setActivityEvents(activityEvents)
          let activityEventCount = getActivityEventCount(activityEvents)
          setTimeSpans(timeSpans)
          setActivityCounts(activityEventCount)
          activities = activities.filter(
            (activity) =>
              activityEventCount[activity.name] > 0 && activity.spec !== "lamp.group" && activity.spec !== "lamp.tips"
          )
          setActivities(activities)
          setLoading(false)
          getSensorEvents(participant).then((sensorEvents) => {
            let sensorEventCount = getSensorEventCount(sensorEvents)
            setSensorEvents(sensorEvents)

            getVisualizations(participant).then((data) => {
              setVisualizations(data)
              let visualizationCount = Object.keys(data)
                .map((x) => x.replace("lamp.dashboard.experimental.", ""))
                .reduce((prev, curr) => ({ ...prev, [curr]: 1 }), {})
              setSensorCounts(Object.assign({}, sensorEventCount, visualizationCount))
              setCortex(
                [`Environmental Context`, `Step Count`, `Social Context`]
                  .filter((sensor) => sensorEventCount[sensor] > 0)
                  .concat(Object.keys(data).map((x) => x.replace("lamp.dashboard.experimental.", "")))
              )
            })
          })
        })
      } else {
        getVisualizations(participant).then((data) => {
          setVisualizations(data)
          let visualizationCount = Object.keys(data)
            .map((x) => x.replace("lamp.dashboard.experimental.", ""))
            .reduce((prev, curr) => ({ ...prev, [curr]: 1 }), {})
          setSensorCounts(Object.assign({}, visualizationCount))
        })
        setLoading(false)
      }
    })()
  }, [])

  return (
    <Container className={classes.thumbContainer}>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <ActivityBox
        participant={participant}
        savedActivities={savedActivities}
        tag={tag}
        showSteak={showSteak}
        submitSurvey={submitSurvey}
        type="Prevent"
      />
      {!loading && (
        <PreventSelections
          participant={participant}
          activities={activities}
          activityCounts={activityCounts}
          sensorCounts={sensorCounts}
          visualizations={visualizations}
          cortex={cortex}
          activityEvents={activityEvents}
          timeSpans={timeSpans}
          sensorEvents={sensorEvents}
          onEditAction={onEditAction}
          onCopyAction={onCopyAction}
          onDeleteAction={onDeleteAction}
        />
      )}
    </Container>
  )
}
