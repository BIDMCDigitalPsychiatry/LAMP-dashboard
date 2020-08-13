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
  Button,
  DialogActions,
  AppBar,
  Toolbar,
  Icon,
  useMediaQuery,
  useTheme,
  ButtonBase,
} from "@material-ui/core"
import ResponsiveDialog from "./ResponsiveDialog"
import { ReactComponent as JournalBlue } from "../icons/journal_blue.svg"
import { ReactComponent as WaterBlue } from "../icons/WaterBlue.svg"
import PreventData from "./PreventData"
import BottomMenu from "./BottomMenu"
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
    inlineHeader: {
      background: "#FFFFFF",
      boxShadow: "none",

      "& h5": { fontSize: 25, paddingLeft: 16, color: "rgba(0, 0, 0, 0.75)", fontWeight: 600 },
    },
    toolbardashboard: {
      minHeight: 65,
      "& h5": {
        color: "rgba(0, 0, 0, 0.75)",
        textAlign: "center",
        fontWeight: "600",
        fontSize: 18,
        width: "100%",
      },
    },
    backbtn: { paddingLeft: 0, paddingRight: 0 },
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

    preventlabel: {
      fontSize: 16,
      minHeight: 48,
      padding: "0 0 0 15px",
      marginTop: 8,
      width: "100%",
      textAlign: "left",
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
      margin: "25px 0 15px 0",
    },
    activityhd: {
      margin: "0 0 15px 0",
    },
    maxw150: { maxWidth: 150, marginLeft: "auto", marginRight: "auto" },
    maxw300: { maxWidth: 300, marginLeft: "auto", marginRight: "auto" },
    activitydatapop: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    activityContent: {
      maxHeight: "280px",
    },
    thumbMain: {
      // maxWidth: 255
    },
    thumbContainer: { maxWidth: 1055 },
    fullwidthBtn: { width: "100%" },
    preventGraph: {
      marginTop: -35,
      maxHeight: 100,
      "& h2": { fontWeight: 600, fontSize: 75, color: "#4C66D6", marginTop: 22 },
    },
    preventRightSVG: {
      "& svg": { maxWidth: 40, maxHeight: 40 },
    },
  })
)

function _patientMode() {
  return LAMP.Auth._type === "participant"
}

function getSocialContextGroups(gps_events?: SensorEventObj[]) {
  gps_events = gps_events?.filter((x) => !!x.data?.context?.environment || !!x.data?.context?.social) ?? [] // Catch missing data.
  return [
    [
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
    ],
  ]
}

function getEnvironmentalContextGroups(gps_events?: SensorEventObj[]) {
  gps_events = gps_events?.filter((x) => !!x.data?.context?.environment || !!x.data?.context?.social) ?? [] // Catch missing data.
  console.log(gps_events)
  return [
    [
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
    ],
  ]
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
                  value: a.data.value + b.data.value,
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
      activity: (x.activity || { name: "" }).name,
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

function getActivityEventCount(activity_events: { [groupName: string]: ActivityEventObj[] }) {
  return Object.assign(
    {},
    ...Object.entries(activity_events || {}).map(([k, v]: [string, any[]]) => ({
      [k]: v.length,
    }))
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
export default function Prevent({ participant, ...props }: { participant: ParticipantObj; activeTab: Function }) {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const [dialogueType, setDialogueType] = React.useState(0)
  const [openData, setOpenData] = React.useState(false)
  const [activityData, setActivityData] = React.useState(null)
  const [graphType, setGraphType] = React.useState(0)
  const [hiddenEvents, setHiddenEvents] = React.useState([])
  const [eventsData, setEventsData] = React.useState(null)

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
    setEventsData(events)
    setActivityData(data)
    setOpenData(true)
  }

  const hideEvent = async (timestamp?: number, activity?: string) => {
    if (timestamp === undefined && activity === undefined) {
      setHiddenEvents(hiddenEvents) // trigger a reload for dependent components only
      return
    }
    let result = await addHiddenEvent(participant, timestamp, activity)
    if (!!result) {
      setHiddenEvents(result)
    } else {
      //   enqueueSnackbar("Failed to hide this event.", { variant: "error" })
    }
  }
  const [selectedActivities, setSelectedActivities] = React.useState([])
  const [activityCounts, setActivityCounts] = React.useState({})
  const [activities, setActivities] = React.useState([])
  const [sensorEvents, setSensorEvents] = React.useState({})
  const [selectedSensors, setSelectedSensors] = React.useState([])
  const [sensorCounts, setSensorCounts] = React.useState({})
  const [activityEvents, setActivityEvents] = React.useState({})
  const [selectedActivity, setSelectedActivity] = React.useState({})
  const supportsSidebar = useMediaQuery(useTheme().breakpoints.up("md"))
  const [selectedActivityName, setSelectedActivityName] = React.useState(null)

  React.useEffect(() => {
    ;(async () => {
      let activities = await getActivities(participant)
      setActivities(activities)
      let activityEvents = await getActivityEvents(participant, activities, hiddenEvents)
      setActivityEvents(activityEvents)
      let activityEventCount = getActivityEventCount(activityEvents)
      setActivityCounts(activityEventCount)
      let sensorEvents = await getSensorEvents(participant)
      setSensorEvents(sensorEvents)
      let sensorEventCount = getSensorEventCount(sensorEvents)
      setSensorCounts(sensorEventCount)
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
          .map((activity) => (
            <Grid item xs={12} sm={6} md={6} lg={6} className={classes.thumbMain}>
              <ButtonBase focusRipple className={classes.fullwidthBtn}>
                <Card className={classes.preventFull} onClick={() => openDetails(activity, activityEvents, 0)}>
                  <Typography className={classes.preventlabelFull}>
                    {activity.name} ({activityCounts[activity.name]})
                  </Typography>
                  <Box className={classes.maxw300}>
                    <Sparkline
                      ariaLabel={activity.name}
                      margin={{ top: 5, right: 0, bottom: 1, left: 0 }}
                      width={300}
                      height={70}
                      startDate={earliestDate()}
                      data={activityEvents?.[activity.name]?.map((d) => ({
                        x: new Date(d.timestamp),
                        y: d.duration / 1000,
                      }))}
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
                  <Typography variant="h6">this month</Typography>
                </Card>
              </ButtonBase>
            </Grid>
          ))}

        <Grid item xs={6} sm={3} md={3} lg={3} className={classes.thumbMain}>
          <ButtonBase focusRipple className={classes.fullwidthBtn}>
            <Card
              className={classes.prevent}
              onClick={() => {
                setSelectedActivityName("Journal entries")
                setOpenData(true)
              }}
            >
              <Box display="flex">
                <Box flexGrow={1}>
                  <Typography className={classes.preventlabel}>Journal</Typography>
                </Box>
                <Box mr={1} className={classes.preventRightSVG}>
                  <JournalBlue />
                </Box>
              </Box>
              <Box className={classes.preventGraph}>
                <Typography variant="h2">14</Typography>
              </Box>
              <Typography variant="h6">entries this month</Typography>
            </Card>
          </ButtonBase>
        </Grid>

        <Grid item xs={6} sm={3} md={3} lg={3} className={classes.thumbMain}>
          <ButtonBase focusRipple className={classes.fullwidthBtn}>
            <Card
              className={classes.prevent}
              onClick={() => {
                setSelectedActivityName("Goal: Water")
                setOpenData(true)
              }}
            >
              <Box display="flex">
                <Box flexGrow={1}>
                  <Typography className={classes.preventlabel}>Water</Typography>
                </Box>
                <Box mr={1} className={classes.preventRightSVG}>
                  <WaterBlue />
                </Box>
              </Box>
              <Box className={classes.preventGraph}>
                <RadialDonutChart
                  data={getSocialContextGroups(sensorEvents?.["lamp.gps.contextual"])}
                  detailPage={false}
                  width={135}
                  height={135}
                />
              </Box>
              <Typography variant="h6">12/16 this month</Typography>
            </Card>
          </ButtonBase>
        </Grid>
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
        {(selectedSensors || []).includes("Social Context") && (
          <Grid item xs={6} sm={4} md={3} lg={3} className={classes.thumbMain}>
            <ButtonBase focusRipple className={classes.fullwidthBtn}>
              <Card
                className={classes.prevent}
                onClick={() =>
                  openRadialDetails(
                    "Social Context",
                    sensorEvents["lamp.gps.contextual"],
                    getSocialContextGroups(sensorEvents["lamp.gps.contextual"]),
                    1
                  )
                }
              >
                <Typography className={classes.preventlabel}>
                  Social Context ({sensorCounts["Social Context"]})
                </Typography>
                <Box>
                  <RadialDonutChart
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
        {(selectedSensors || []).includes("Environmental Context") && (
          <Grid item xs={6} sm={4} md={3} lg={3} className={classes.thumbMain}>
            <ButtonBase focusRipple className={classes.fullwidthBtn}>
              <Card
                className={classes.prevent}
                onClick={() =>
                  openRadialDetails(
                    "Environmental Context",
                    sensorEvents["lamp.gps.contextual"],
                    getEnvironmentalContextGroups(sensorEvents["lamp.gps.contextual"]),
                    1
                  )
                }
              >
                <Typography className={classes.preventlabel}>
                  Environmental Context ({sensorCounts["Environmental Context"]})
                </Typography>
                <Box>
                  <RadialDonutChart
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

        {(selectedSensors || []).includes("Step Count") && (
          <Grid item xs={6} sm={4} md={3} lg={3} className={classes.thumbMain}>
            <ButtonBase focusRipple className={classes.fullwidthBtn}>
              <Card
                className={classes.prevent}
                onClick={() =>
                  openDetails(
                    "Step Count",
                    sensorEvents?.["lamp.steps"]?.map((d) => ({
                      x: new Date(parseInt(d.timestamp)),
                      y: d.data.value || 0,
                    })) ?? [],
                    2
                  )
                }
              >
                <Typography className={classes.preventlabel}>Step Count({sensorCounts["Step Count"]})</Typography>
                <Box mt={3} mb={1} className={classes.maxw150}>
                  <Sparkline
                    ariaLabel="Step count"
                    margin={{ top: 5, right: 0, bottom: 5, left: 0 }}
                    width={126}
                    height={70}
                    XAxisLabel="Time"
                    YAxisLabel="Steps Taken"
                    startDate={earliestDate()}
                    data={
                      sensorEvents?.["lamp.steps"]?.map((d) => ({
                        x: new Date(parseInt(d.timestamp)),
                        y: d.data.value || 0,
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

      <Dialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        className={classes.activitydatapop}
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
              onChange={(x) => setSelectedActivities(x)}
            />
          ) : (
            <MultipleSelect
              selected={selectedSensors || []}
              items={[`Environmental Context`, `Step Count`, `Social Context`]}
              showZeroBadges={false}
              badges={sensorCounts}
              onChange={(x) => setSelectedSensors(x)}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Box textAlign="center" width={1} mt={1} mb={1}>
            <Button onClick={handleClose} color="primary">
              Done
            </Button>
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
        style={{ paddingLeft: supportsSidebar ? "100px" : "" }}
      >
        <AppBar position="static" className={classes.inlineHeader}>
          <Toolbar className={classes.toolbardashboard}>
            <IconButton
              onClick={() => setOpenData(false)}
              color="default"
              className={classes.backbtn}
              aria-label="Menu"
            >
              <Icon>arrow_back</Icon>
            </IconButton>
          </Toolbar>
          <Typography variant="h5">{selectedActivityName}</Typography>
        </AppBar>
        {supportsSidebar && <BottomMenu activeTab={props.activeTab} tabValue={3} />}

        {selectedActivityName === "Journal entries" ? (
          <Journal />
        ) : selectedActivityName === "Goal: Water" ? (
          <PreventGoalData />
        ) : (
          <PreventData
            participant={participant}
            activity={selectedActivity}
            events={graphType === 0 ? (activityData || {})[selectedActivityName] || [] : activityData}
            graphType={graphType}
            earliestDate={earliestDate}
            enableEditMode={!_patientMode()}
            onEditAction={(activity, data) =>
              setActivities([
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
              setActivities([
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
        )}
      </ResponsiveDialog>
    </Container>
  )
}
