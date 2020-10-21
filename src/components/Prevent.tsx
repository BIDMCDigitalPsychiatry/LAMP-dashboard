// Core Imports
import React from "react"
import {
  Container,
  Typography,
  Grid,
  Card,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  DialogActions,
  AppBar,
  Toolbar,
  Icon,
  ButtonBase,
  Link,
  Backdrop,
  CircularProgress,
} from "@material-ui/core"
import ResponsiveDialog from "./ResponsiveDialog"
import { ReactComponent as JournalBlue } from "../icons/journal_blue.svg"
import PreventData from "./PreventData"
import { Sparkline, LineSeries, LinearGradient } from "@data-ui/sparkline"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline"
import LAMP, {
  Participant as ParticipantObj,
  Activity as ActivityObj,
  ActivityEvent as ActivityEventObj,
  SensorEvent as SensorEventObj,
} from "lamp-core"
import CloseIcon from "@material-ui/icons/Close"
import MultipleSelect from "./MultipleSelect"
import RadialDonutChart from "./RadialDonutChart"
import Journal from "./Journal"
import PreventGoalData from "./PreventGoalData"
import { ReactComponent as PreventExercise } from "../icons/PreventExercise.svg"
import { ReactComponent as PreventReading } from "../icons/PreventReading.svg"
import { ReactComponent as PreventSleeping } from "../icons/PreventSleeping.svg"
import { ReactComponent as PreventNutrition } from "../icons/PreventNutrition.svg"
import { ReactComponent as PreventMeditation } from "../icons/PreventMeditation.svg"
import { ReactComponent as PreventEmotions } from "../icons/PreventEmotions.svg"
import { ReactComponent as PreventBreatheIcon } from "../icons/PreventBreathe.svg"
import { ReactComponent as PreventSavings } from "../icons/PreventSavings.svg"
import { ReactComponent as PreventWeight } from "../icons/PreventWeight.svg"
import { ReactComponent as PreventCustom } from "../icons/PreventCustom.svg"
import en from "javascript-time-ago/locale/en"
import TimeAgo from "javascript-time-ago"
TimeAgo.addLocale(en)
const timeAgo = new TimeAgo("en-US")

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    inlineHeader: {
      background: "#FFFFFF",
      boxShadow: "none",

      "& h5": { fontSize: 25, color: "rgba(0, 0, 0, 0.75)", fontWeight: 600 },
    },
    toolbardashboard: {
      minHeight: 65,
      padding: "0 10px",
      [theme.breakpoints.down("xs")]: {
        display: "block",
      },
      "& h5": {
        color: "rgba(0, 0, 0, 0.75)",
        textAlign: "left",
        fontWeight: "600",
        fontSize: 25,
        width: "calc(100% - 96px)",
      },
    },
    toolbar: {
      minHeight: 90,
      alignItems: "flex-start",
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
    preventlabel: {
      fontSize: 16,
      minHeight: 48,
      padding: "0 0 0 15px",
      marginTop: 8,
      width: "100%",
      textAlign: "left",
      "& span": { color: "#618EF7" },
    },
    prevent: {
      background: "#ECF4FF",
      padding: "10px 0",
      minHeight: 180,
      textAlign: "center",
      boxShadow: "none",
      borderRadius: 18,
      position: "relative",
      width: "100%",
      "& h6": { color: "#4C66D6", fontSize: 12, position: "absolute", bottom: 10, width: "100%" },
      "& svg": {
        [theme.breakpoints.up("lg")]: {
          width: 150,
          height: 150,
        },
      },

      [theme.breakpoints.up("lg")]: {
        minHeight: 240,
        maxHeight: 240,
      },
    },
    preventFull: {
      background: "#ECF4FF",
      padding: "10px 0",
      minHeight: 180,
      textAlign: "center",
      boxShadow: "none",
      borderRadius: 18,
      position: "relative",
      width: "100%",
      [theme.breakpoints.down("xs")]: {
        minHeight: "auto",
      },
      [theme.breakpoints.up("lg")]: {
        minHeight: 240,
        maxHeight: 240,
      },

      "& h6": {
        color: "#4C66D6",
        fontSize: 12,
        textAlign: "right",
        padding: "0 15px",
        [theme.breakpoints.up("sm")]: {
          position: "absolute",
          bottom: 10,
          right: 10,
        },
      },
    },
    preventlabelFull: {
      minHeight: "auto",
      fontSize: 16,

      padding: "0 0 0 15px",
      marginTop: 8,
      width: "100%",
      textAlign: "left",
      "& span": { color: "#618EF7" },
    },

    addicon: { float: "right", color: "#6083E7" },
    preventHeader: {
      [theme.breakpoints.up("sm")]: {
        flexGrow: "initial",
        paddingRight: 10,
      },
      "& h5": {
        fontWeight: 600,
        fontSize: 18,
        color: "rgba(0, 0, 0, 0.4)",
      },
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    addbtnmain: {
      maxWidth: 24,
      "& button": { padding: 0 },
    },
    sensorhd: {
      margin: "80px 0 15px 0",
      [theme.breakpoints.down("xs")]: {
        marginTop: 50,
      },
    },
    activityhd: {
      margin: "0 0 15px 0",
    },
    maxw150: { maxWidth: 150, marginLeft: "auto", marginRight: "auto" },
    maxw300: {
      maxWidth: 300,
      marginLeft: "auto",
      marginRight: "auto",
      [theme.breakpoints.up("lg")]: {
        maxWidth: "90%",
        marginTop: 40,
      },
    },
    activitydatapop: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    activityContent: {
      maxHeight: "280px",
    },
    thumbContainer: { maxWidth: 1055 },
    fullwidthBtn: { width: "100%" },
    preventGraph: {
      marginTop: -35,
      maxHeight: 100,
      "& svg": {
        [theme.breakpoints.up("lg")]: {
          marginTop: 15,
        },
      },
      "& h2": {
        fontWeight: 600,
        fontSize: 75,
        color: "#4C66D6",
        marginTop: 22,
        [theme.breakpoints.up("lg")]: {
          marginTop: 40,
        },
      },
    },
    preventRightSVG: {
      "& svg": { maxWidth: 40, maxHeight: 40 },
    },
    dialogueCurve: { borderRadius: 10, maxWidth: 400 },
    backbtn: {
      [theme.breakpoints.down("xs")]: {
        paddingLeft: 0,
      },
    },
    linkBlue: { color: "#6083E7", cursor: "pointer" },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
  })
)

function _patientMode() {
  return LAMP.Auth._type === "participant"
}

function getSocialContextGroups(gps_events?: SensorEventObj[]) {
  gps_events = gps_events?.filter((x) => !!x.data?.context?.social) ?? [] // Catch missing data.
  let events = [
    {
      label: "Alone",
      value: gps_events.filter((x) => x.data.context.social === "alone").length,
    },
    {
      label: "Friends",
      value: gps_events.filter((x) => x.data.context.social === "friends").length,
    },
    {
      label: "Family",
      value: gps_events.filter((x) => x.data.context.social === "family").length,
    },
    {
      label: "Peers",
      value: gps_events.filter((x) => x.data.context.social === "peers").length,
    },
    {
      label: "Crowd",
      value: gps_events.filter((x) => x.data.context.social === "crowd").length,
    },
  ]
  return events
}

function getEnvironmentalContextGroups(gps_events?: SensorEventObj[]) {
  gps_events = gps_events?.filter((x) => !!x.data?.context?.environment) ?? [] // Catch missing data.
  let events = [
    {
      label: "Home",
      value: gps_events.filter((x) => x.data.context.environment === "home" || x.data.context.environment === null)
        .length,
    },
    {
      label: "School",
      value: gps_events.filter((x) => x.data.context.environment === "school").length,
    },
    {
      label: "Work",
      value: gps_events.filter((x) => x.data.context.environment === "work").length,
    },
    {
      label: "Hospital",
      value: gps_events.filter((x) => x.data.context.environment === "hospital").length,
    },
    {
      label: "Outside",
      value: gps_events.filter((x) => x.data.context.environment === "outside").length,
    },
    {
      label: "Shopping",
      value: gps_events.filter((x) => x.data.context.environment === "shopping").length,
    },
    {
      label: "Transit",
      value: gps_events.filter((x) => x.data.context.environment === "transit").length,
    },
  ]

  return events
}

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
    .sort((x, y) => x.timestamp - y.timestamp)
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
  let original = await LAMP.Activity.allByParticipant(participant.id)
  let custom =
    ((await LAMP.Type.getAttachment(participant.id, "lamp.dashboard.custom_survey_groups")) as any)?.data?.map((x) => ({
      ...x,
      spec: "lamp.dashboard.custom_survey_group",
      schedule: {},
      settings: x.settings.map((y) => ({
        ...y,
        ...original.find((z) => z.name === y.activity)?.settings.find((a) => a.text === y.question),
      })),
    })) ?? [] // original.filter((x) => x.spec !== "lamp.survey")
  return [...original, ...custom]
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

function getActivityEventCount(activity_events: { [groupName: string]: ActivityEventObj[] }) {
  return Object.assign(
    {},
    ...Object.entries(activity_events || {}).map(([k, v]: [string, any[]]) => ({
      [k]: v.length,
    }))
  )
}
async function getGoals(participant: ParticipantObj) {
  return Object.fromEntries(
    (
      await Promise.all(
        [participant.id || ""].map(async (x) => [x, await LAMP.Type.getAttachment(x, "lamp.goals").catch((e) => [])])
      )
    )
      .filter((x: any) => x[1].message !== "404.object-not-found")
      .map((x: any) => [x[0], x[1].data])
  )[participant.id || ""]
}

async function getJournalCount(participant: ParticipantObj) {
  return (
    Object.fromEntries(
      (
        await Promise.all(
          [participant.id || ""].map(async (x) => [
            x,
            await LAMP.Type.getAttachment(x, "lamp.journals").catch((e) => []),
          ])
        )
      )
        .filter((x: any) => x[1].message !== "404.object-not-found")
        .map((x: any) => [x[0], x[1].data])
    )[participant.id || ""]?.length ?? 0
  )
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

export const strategies = {
  "lamp.survey": (slices, activity, scopedItem) =>
    (slices ?? [])
      .filter((x, idx) => (scopedItem !== undefined ? idx === scopedItem : true))
      .map((x, idx) => {
        let question = (Array.isArray(activity.settings) ? activity.settings : []).filter((y) => y.text === x.item)[0]
        if (!!question && question.type === "boolean") return ["Yes", "True"].includes(x.value) ? 1 : 0
        else if (!!question && question.type === "list") return Math.max(question.options.indexOf(x.value), 0)
        else return parseInt(x.value) || 0
      })
      .reduce((prev, curr) => prev + curr, 0),
  "lamp.jewels_a": (slices, activity, scopedItem) =>
    (parseInt(slices.score ?? 0).toFixed(1) || 0) > 100 ? 100 : parseInt(slices.score ?? 0).toFixed(1) || 0,
  "lamp.jewels_b": (slices, activity, scopedItem) =>
    (parseInt(slices.score ?? 0).toFixed(1) || 0) > 100 ? 100 : parseInt(slices.score ?? 0).toFixed(1) || 0,
  "lamp.spatial_span": (slices, activity, scopedItem) =>
    (parseInt(slices.score ?? 0).toFixed(1) || 0) > 100 ? 100 : parseInt(slices.score ?? 0).toFixed(1) || 0,
}

export default function Prevent({
  participant,
  activeTab,
  hiddenEvents,
  enableEditMode,
  onEditAction,
  onCopyAction,
  onDeleteAction,
  ...props
}: {
  participant: ParticipantObj
  activeTab: Function
  hiddenEvents: string[]
  enableEditMode: boolean
  onEditAction: (activity: ActivityObj, data: any) => void
  onCopyAction: (activity: ActivityObj, data: any) => void
  onDeleteAction: (activity: ActivityObj, data: any) => void
}) {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const [dialogueType, setDialogueType] = React.useState(0)
  const [openData, setOpenData] = React.useState(false)
  const [activityData, setActivityData] = React.useState(null)
  const [graphType, setGraphType] = React.useState(0)

  const handleClickOpen = (type: number) => {
    setDialogueType(type)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const openDetails = (activity: any, data: any, graphType?: number) => {
    setGraphType(graphType)
    setSelectedActivity(activity)
    if (!graphType) {
      setSelectedActivityName(activity.name)
    } else {
      setSelectedActivityName("")
    }
    setActivityData(data)
    setOpenData(true)
  }

  const openRadialDetails = (activity: any, events: any, data: any, graphType?: number) => {
    setGraphType(graphType)
    setSelectedActivity(activity)
    if (!graphType) {
      setSelectedActivityName(activity.name)
    } else {
      setSelectedActivityName("")
    }
    setActivityData(data)
    setOpenData(true)
  }

  const [selectedActivities, setSelectedActivities] = React.useState([])
  const [activityCounts, setActivityCounts] = React.useState({})
  const [activities, setActivities] = React.useState([])
  const [sensorEvents, setSensorEvents] = React.useState({})
  const [selectedSensors, setSelectedSensors] = React.useState([])
  const [sensorCounts, setSensorCounts] = React.useState({})
  const [activityEvents, setActivityEvents] = React.useState({})
  const [selectedActivity, setSelectedActivity] = React.useState({})
  const [selectedActivityName, setSelectedActivityName] = React.useState(null)
  const [journalCount, setJournalCount] = React.useState(0)
  const [timeSpans, setTimeSpans] = React.useState({})
  const [loading, setLoading] = React.useState(true)
  const [disabledData, setDisabled] = React.useState(true)

  let socialContexts = ["Alone", "Friends", "Family", "Peers", "Crowd"]
  let envContexts = ["Home", "School", "Work", "Hospital", "Outside", "Shopping", "Transit"]

  const goalIcon = (goalType: string) => {
    return goalType == "Exercise" ? (
      <PreventExercise width="40px" height="40px" />
    ) : goalType == "Weight" ? (
      <PreventWeight width="40px" height="40px" />
    ) : goalType == "Nutrition" ? (
      <PreventNutrition width="40px" height="40px" />
    ) : goalType == "Medication" ? (
      <PreventBreatheIcon width="40px" height="40px" />
    ) : goalType == "Sleep" ? (
      <PreventSleeping width="40px" height="40px" />
    ) : goalType == "Reading" ? (
      <PreventReading width="40px" height="40px" />
    ) : goalType == "Finances" ? (
      <PreventSavings />
    ) : goalType == "Mood" ? (
      <PreventEmotions width="40px" height="40px" />
    ) : goalType == "Meditation" ? (
      <PreventMeditation width="40px" height="40px" />
    ) : (
      <PreventCustom width="40px" height="40px" />
    )
  }

  React.useEffect(() => {
    ;(async () => {
      let disabled =
        ((await LAMP.Type.getAttachment(participant.id, "lamp.dashboard.disable_data")) as any)?.data ?? false
      setDisabled(disabled)
      if (!disabled) {
        let selActivities = await getSelectedActivities(participant)
        setSelectedActivities(selActivities)
        let selSensors = await getSelectedSensors(participant)
        let activities = await getActivities(participant)
        // let goals = await getGoals(participant)
        // let groupByType
        // if (typeof goals !== "undefined") {
        //   goals.map((goal) => {
        //     if (activities.filter((it) => it.name == goal.goalType && it.type == "goals").length == 0) {
        //       activities.push({ name: goal.goalType, type: "goals" })
        //     }
        //   })
        // }
        let activityEvents = await getActivityEvents(participant, activities, hiddenEvents)
        let timeSpans = Object.fromEntries(
          Object.entries(activityEvents || {}).map((x) => [x[0], x[1][x[1].length - 1]])
        )

        setActivityEvents(activityEvents)

        let activityEventCount = getActivityEventCount(activityEvents)
        // if (typeof goals !== "undefined") {
        //   groupByType = goals.reduce((goal, it) => {
        //     goal[it.goalType] = goal[it.goalType] + 1 || 1
        //     activityEventCount[it.goalType] = goal[it.goalType]
        //     timeSpans[it.goalType + "-goal"] = { timestamp: new Date().getTime() }
        //     return goal
        //   }, {})
        // }
        setTimeSpans(timeSpans)
        setActivityCounts(activityEventCount)
        activities = activities.filter((activity) => activityEventCount[activity.name] > 0)
        setActivities(activities)
        let sensorEvents = await getSensorEvents(participant)
        let sensorEventCount = getSensorEventCount(sensorEvents)
        setSelectedSensors(selSensors)
        setSensorEvents(sensorEvents)
        setSensorCounts(sensorEventCount)
      }
      setLoading(false)
    })()
  }, [])

  const earliestDate = () =>
    (activities || [])
      .filter((x) => (selectedActivities || []).includes(x.name))
      .map((x) => (activityEvents || {})[x.name] || [])
      .map((x) => (x.length === 0 ? 0 : x.slice(0, 1)[0].timestamp))
      .sort((a, b) => a - b /* min */)
      .slice(0, 1)
      .map((x) => (x === 0 ? undefined : new Date(x)))[0]

  return (
    <Container className={classes.thumbContainer}>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {!disabledData && (
        <Container>
          <Grid container xs={12} spacing={0} className={classes.activityhd}>
            <Grid item xs className={classes.preventHeader}>
              <Typography variant="h5">Activity</Typography>
            </Grid>
            <Grid item xs className={classes.addbtnmain}>
              <IconButton onClick={() => handleClickOpen(0)}>
                <AddCircleOutlineIcon className={classes.addicon} />
              </IconButton>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            {(activities || [])
              .filter((x) => (selectedActivities || []).includes(x.name))
              .map((activity) =>
                activity.spec === "lamp.journal" ? (
                  <Grid item xs={6} sm={3} md={3} lg={3}>
                    <ButtonBase focusRipple className={classes.fullwidthBtn}>
                      <Card
                        className={classes.prevent}
                        onClick={() => {
                          setSelectedActivity(activityEvents?.[activity.name] ?? null)
                          setSelectedActivityName("Journal entries")
                          setOpenData(true)
                        }}
                      >
                        <Box display="flex">
                          <Box flexGrow={1}>
                            <Typography className={classes.preventlabel}>{activity.name}</Typography>
                          </Box>
                          <Box mr={1} className={classes.preventRightSVG}>
                            <JournalBlue />
                          </Box>
                        </Box>
                        <Box className={classes.preventGraph}>
                          <Typography variant="h2">{(activityEvents?.[activity.name] || []).length}</Typography>
                        </Box>
                        <Typography variant="h6">
                          entries {timeAgo.format(timeSpans[activity.name].timestamp)}
                        </Typography>
                      </Card>
                    </ButtonBase>
                  </Grid>
                ) : activity.type === "goals" ? (
                  <Grid item xs={6} sm={3} md={3} lg={3}>
                    <ButtonBase focusRipple className={classes.fullwidthBtn}>
                      <Card
                        className={classes.prevent}
                        // onClick={() => {
                        //   setSelectedActivityName(`Goal: ${activity.name}`)
                        //   setOpenData(true)
                        // }}
                      >
                        <Box display="flex">
                          <Box flexGrow={1}>
                            <Typography className={classes.preventlabel}>{activity.name}</Typography>
                          </Box>
                          <Box mr={1} className={classes.preventRightSVG}>
                            {goalIcon(activity.name)}
                          </Box>
                        </Box>
                        <Box className={classes.preventGraph}>
                          <Typography variant="h2">{activityCounts[activity.name]}</Typography>
                        </Box>
                        <Typography variant="h6">
                          entries {timeAgo.format(timeSpans[activity.name + "-goal"].timestamp)}
                        </Typography>
                      </Card>
                    </ButtonBase>
                  </Grid>
                ) : (
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <ButtonBase focusRipple className={classes.fullwidthBtn}>
                      <Card className={classes.preventFull} onClick={() => openDetails(activity, activityEvents, 0)}>
                        <Typography className={classes.preventlabelFull}>
                          {activity.name} <Box component="span">({activityCounts[activity.name]})</Box>
                        </Typography>
                        <Box className={classes.maxw300}>
                          <Sparkline
                            ariaLabel={activity.name}
                            margin={{ top: 5, right: 0, bottom: 5, left: 0 }}
                            width={300}
                            height={70}
                            startDate={earliestDate()}
                            data={activityEvents?.[activity.name]?.map((d) => ({
                              x: new Date(d.timestamp),
                              y: strategies[activity.spec]
                                ? strategies[activity.spec](
                                    activity.spec === "lamp.survey"
                                      ? d?.temporal_slices ?? d["temporal_slices"]
                                      : d.static_data,
                                    activity,
                                    undefined
                                  )
                                : 0,
                            }))}
                            valueAccessor={(datum) => datum}
                          >
                            <LinearGradient
                              id="gredient"
                              from="#ECF4FF"
                              to="#FFFFFF"
                              fromOffset="30%"
                              fromOpacity="1"
                              toOpacity="1"
                              toOffset="100%"
                              rotate={90}
                            />
                            <LineSeries
                              showArea={true}
                              fill={`url(#gradient)`}
                              stroke="#3C5DDD"
                              strokeWidth={activityEvents?.[activity.name]?.length === 1 ? 4 : 2}
                              strokeLinecap="round"
                            />
                          </Sparkline>
                        </Box>
                        <Typography variant="h6">{timeAgo.format(timeSpans[activity.name].timestamp)}</Typography>
                      </Card>
                    </ButtonBase>
                  </Grid>
                )
              )}
          </Grid>
          <Grid container xs={12} spacing={0} className={classes.sensorhd}>
            <Grid item xs className={classes.preventHeader}>
              <Typography variant="h5">Sensors</Typography>
            </Grid>
            <Grid item xs className={classes.addbtnmain}>
              <IconButton onClick={() => handleClickOpen(1)}>
                <AddCircleOutlineIcon className={classes.addicon} />
              </IconButton>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            {(selectedSensors || []).includes("Social Context") && sensorCounts["Social Context"] > 0 && (
              <Grid item xs={6} sm={4} md={3} lg={3}>
                <ButtonBase focusRipple className={classes.fullwidthBtn}>
                  <Card
                    className={classes.prevent}
                    onClick={() =>
                      openRadialDetails(
                        "Social Context",
                        sensorEvents["lamp.gps.contextual"].filter(
                          (x) => socialContexts.indexOf(x.data.context.environment) >= 0
                        ),
                        getSocialContextGroups(sensorEvents["lamp.gps.contextual"]),
                        1
                      )
                    }
                  >
                    <Typography className={classes.preventlabel}>
                      Social Context <Box component="span">({sensorCounts["Social Context"]})</Box>
                    </Typography>
                    <Box>
                      <RadialDonutChart
                        type={socialContexts}
                        data={getSocialContextGroups(sensorEvents?.["lamp.gps.contextual"])}
                        detailPage={false}
                        width={150}
                        height={150}
                      />
                    </Box>
                  </Card>
                </ButtonBase>
              </Grid>
            )}
            {(selectedSensors || []).includes("Environmental Context") && sensorCounts["Environmental Context"] > 0 && (
              <Grid item xs={6} sm={4} md={3} lg={3}>
                <ButtonBase focusRipple className={classes.fullwidthBtn}>
                  <Card
                    className={classes.prevent}
                    onClick={() =>
                      openRadialDetails(
                        "Environmental Context",
                        sensorEvents["lamp.gps.contextual"].filter(
                          (x) => envContexts.indexOf(x.data.context.environment) >= 0
                        ),
                        getEnvironmentalContextGroups(sensorEvents["lamp.gps.contextual"]),
                        1
                      )
                    }
                  >
                    <Typography className={classes.preventlabel}>
                      Environmental Context <Box component="span">({sensorCounts["Environmental Context"]})</Box>
                    </Typography>
                    <Box>
                      <RadialDonutChart
                        type={envContexts}
                        data={getEnvironmentalContextGroups(sensorEvents?.["lamp.gps.contextual"])}
                        detailPage={false}
                        width={150}
                        height={150}
                      />
                    </Box>
                  </Card>
                </ButtonBase>
              </Grid>
            )}

            {(selectedSensors || []).includes("Step Count") && sensorCounts["Step Count"] > 0 && (
              <Grid item xs={6} sm={4} md={3} lg={3}>
                <ButtonBase focusRipple className={classes.fullwidthBtn}>
                  <Card
                    className={classes.prevent}
                    onClick={() =>
                      openDetails(
                        "Step Count",
                        sensorEvents?.["lamp.steps"]?.map((d) => ({
                          x: new Date(parseInt(d.timestamp)),
                          y: typeof d.data.value !== "number" ? 0 : d.data.value || 0,
                        })) ?? [],
                        2
                      )
                    }
                  >
                    <Typography className={classes.preventlabel}>
                      Step Count <Box component="span">({sensorCounts["Step Count"]})</Box>
                    </Typography>
                    <Box mt={3} mb={1} className={classes.maxw150}>
                      <Sparkline
                        ariaLabel="Step count"
                        margin={{ top: 5, right: 0, bottom: 4, left: 0 }}
                        width={126}
                        height={70}
                        XAxisLabel="Time"
                        YAxisLabel="Steps Taken"
                        startDate={earliestDate()}
                        data={
                          sensorEvents?.["lamp.steps"]?.map((d) => ({
                            x: new Date(parseInt(d.timestamp)),
                            y: typeof d.data.value !== "number" ? 0 : d.data.value || 0,
                          })) ?? []
                        }
                      >
                        <LinearGradient
                          id="gredient"
                          from="#ECF4FF"
                          to="#FFFFFF"
                          fromOffset="30%"
                          fromOpacity="1"
                          toOpacity="1"
                          toOffset="100%"
                          rotate={90}
                        />
                        <LineSeries
                          showArea={true}
                          fill={`url(#gradient)`}
                          stroke="#3C5DDD"
                          strokeWidth={2}
                          strokeLinecap="butt"
                        />
                      </Sparkline>
                    </Box>
                  </Card>
                </ButtonBase>
              </Grid>
            )}
          </Grid>
        </Container>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        classes={{
          root: classes.activitydatapop,
          paper: classes.dialogueCurve,
        }}
      >
        <DialogTitle id="alert-dialog-slide-title">
          {dialogueType === 0 ? "Activity data" : "Sensor Data"}
          <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
          <Box mt={2}>
            <Typography>Choose the data you want to see in your dashboard.</Typography>
          </Box>
        </DialogTitle>
        <DialogContent dividers={false} classes={{ root: classes.activityContent }}>
          {dialogueType === 0 ? (
            <MultipleSelect
              selected={selectedActivities}
              items={(activities || []).map((x) => `${x.name}`)}
              showZeroBadges={false}
              badges={activityCounts}
              onChange={(x) => {
                LAMP.Type.setAttachment(participant.id, "me", "lamp.selectedActivities", x)
                setSelectedActivities(x)
              }}
            />
          ) : (
            <MultipleSelect
              selected={selectedSensors || []}
              items={[`Environmental Context`, `Step Count`, `Social Context`].filter(
                (sensor) => sensorCounts[sensor] > 0
              )}
              showZeroBadges={false}
              badges={sensorCounts}
              onChange={(x) => {
                LAMP.Type.setAttachment(participant.id, "me", "lamp.selectedSensors", x)
                setSelectedSensors(x)
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Box textAlign="center" width={1} mt={3} mb={3}>
            <Link onClick={handleClose} className={classes.linkBlue}>
              Done
            </Link>
          </Box>
        </DialogActions>
      </Dialog>

      <ResponsiveDialog
        transient={false}
        animate
        fullScreen
        open={openData}
        onClose={() => {
          setOpenData(false)
        }}
      >
        <AppBar position="static" className={classes.inlineHeader}>
          <Toolbar className={classes.toolbardashboard}>
            <IconButton
              onClick={() => setOpenData(false)}
              color="default"
              aria-label="Menu"
              className={classes.backbtn}
            >
              <Icon>arrow_back</Icon>
            </IconButton>
            <Typography variant="h5">{selectedActivityName}</Typography>
          </Toolbar>
        </AppBar>

        {selectedActivityName === "Journal entries" ? (
          <Journal participant={participant} selectedEvents={selectedActivity} />
        ) : selectedActivityName === "Goal: Water" ? (
          <PreventGoalData />
        ) : (
          <PreventData
            participant={participant}
            activity={selectedActivity}
            type={graphType === 2 ? (selectedActivity === "Environmental Context" ? envContexts : socialContexts) : []}
            events={graphType === 0 ? (activityData || {})[selectedActivityName] || [] : activityData}
            graphType={graphType}
            earliestDate={earliestDate}
            enableEditMode={!_patientMode()}
            onEditAction={onEditAction}
            onCopyAction={onCopyAction}
            onDeleteAction={onDeleteAction}
          />
        )}
      </ResponsiveDialog>
    </Container>
  )
}
