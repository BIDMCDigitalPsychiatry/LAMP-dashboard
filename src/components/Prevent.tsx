// Core Imports
import React, { useState } from "react"
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
} from "@material-ui/core"
// import { browserHistory } from 'react-router';

import { Sparkline, LineSeries } from "@data-ui/sparkline"
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
// import PreventData from "./PreventData"
import ResponsiveDialog from "./ResponsiveDialog"
import { Link as RouterLink } from "react-router-dom"
import Link from "@material-ui/core/Link"

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

    preventlabel: {
      fontSize: 16,
      minHeight: 48,
      padding: "0 18px",
      marginTop: 5,
      width: "100%",
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
    activitydatapop: {
      maxHeight: "70vh",
    },
  })
)

function getEnvironmentalContextGroups(gps_events?: SensorEventObj[]) {
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
  _activities: ActivityObj[]
): Promise<{ [groupName: string]: ActivityEventObj[] }> {
  let original = (await LAMP.ActivityEvent.allByParticipant(participant.id))
    .map((x) => ({
      ...x,
      activity: _activities.find((y) => x.activity === y.id),
    }))
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
      sensor_events?.["lamp.gps.contextual"]?.filter((x) => !!x.data?.context?.environment || !!x.data?.context?.social)
        ?.length ?? 0,
    "Step Count": sensor_events?.["lamp.steps"]?.length ?? 0,
  }
}

export default function Prevent({ participant, ...props }: { participant: ParticipantObj }) {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const [dialogueType, setDialogueType] = React.useState(0)
  const [launchSection, setLaunchSection] = useState<string>()

  const handleClickOpen = (type: number) => {
    setDialogueType(type)
    setOpen(true)
  }
  const LinearGradientFill = (stopColor) => {
    return (
      <linearGradient id="gradient" gradientTransform="rotate(90)">
        <stop offset="80%" stopColor="white" stopOpacity="100%" />
        <stop offset="100%" stopColor="white" stopOpacity="0%" />
      </linearGradient>
    )
  }
  const handleClose = () => {
    setOpen(false)
  }

  const [selectedActivities, setSelectedActivities] = React.useState([])
  const [activityCounts, setActivityCounts] = React.useState({})
  const [activities, setActivities] = React.useState([])
  const [sensorEvents, setSensorEvents] = React.useState({})
  const [selectedSensors, setSelectedSensors] = React.useState([])
  const [activityEvents, setActivityEvents] = React.useState({})
  const [sensorCounts, setSensorCounts] = React.useState({})

  React.useEffect(() => {
    ;(async () => {
      let activities = await getActivities(participant)
      setActivities(activities)
      let activityEvents = await getActivityEvents(participant, activities)
      setActivityEvents(activityEvents)
      let activityEventCount = getActivityEventCount(activityEvents)
      setActivityCounts(activityEventCount)
      let sensorEvents = await getSensorEvents(participant)
      setSensorEvents(sensorEvents)
      let sensorEventCount = getSensorEventCount(sensorEvents)
      setSensorCounts(sensorEventCount)
    })()
  }, [])
  return (
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
        <Grid item xs={6} md={4} lg={3}>
          <Link component={RouterLink} to={`/participant/${participant.id}/prevent-data`} underline="none">
            <Card className={classes.prevent}>
              <Typography className={classes.preventlabel}>Mood (23)</Typography>
              <Box mt={3} mb={1} className={classes.maxw150}>
                <Sparkline
                  ariaLabel="Mood "
                  margin={{ top: 5, right: 0, bottom: 5, left: 0 }}
                  width={126}
                  height={70}
                  data={[50, 100, 5, 75, 200, 15]}
                  valueAccessor={(datum) => datum}
                >
                  <svg>
                    <defs>
                      <LinearGradientFill />
                    </defs>
                  </svg>
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
          </Link>
        </Grid>
        <Grid item xs={6} md={4} lg={3}>
          <Link component={RouterLink} to={`/participant/${participant.id}/prevent-data`} underline="none">
            <Card className={classes.prevent}>
              <Typography className={classes.preventlabel}>Sleep & Social (9)</Typography>
              <Box mt={3} mb={1} className={classes.maxw150}>
                <Sparkline
                  ariaLabel="Sleep & Social "
                  margin={{ top: 5, right: 0, bottom: 5, left: 0 }}
                  width={126}
                  height={70}
                  data={[50, 200, 35, 125, 20, 15]}
                  valueAccessor={(datum) => datum}
                >
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
          </Link>
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
        <Grid item xs={6} md={4} lg={3}>
          <Link component={RouterLink} to={`/participant/${participant.id}/prevent-data`} underline="none">
            <Card className={classes.prevent}>
              <Typography className={classes.preventlabel}>Social Context (9)</Typography>
              <Box>
                <RadialDonutChart data={getEnvironmentalContextGroups(sensorEvents?.["lamp.gps.contextual"])} />
              </Box>
            </Card>
          </Link>
        </Grid>
        <Grid item xs={6} md={4} lg={3}>
          <Link component={RouterLink} to={`/participant/${participant.id}/prevent-data`} underline="none">
            <Card className={classes.prevent}>
              <Typography className={classes.preventlabel}>Environmental Context (9)</Typography>
              <Box>
                <RadialDonutChart data={getEnvironmentalContextGroups(sensorEvents?.["lamp.gps.contextual"])} />
              </Box>
            </Card>
          </Link>
        </Grid>
        <Grid item xs={6} md={4} lg={3}>
          <Link component={RouterLink} to={`/participant/${participant.id}/prevent-data`} underline="none">
            <Card className={classes.prevent}>
              <Typography className={classes.preventlabel}>Step Count(5)</Typography>
              <Box mt={3} mb={1} className={classes.maxw150}>
                <Sparkline
                  ariaLabel="Step count"
                  margin={{ top: 5, right: 0, bottom: 5, left: 0 }}
                  width={126}
                  height={70}
                  data={[30, 250, 70, 135, 25, 20, 115]}
                  valueAccessor={(datum) => datum}
                >
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
          </Link>
        </Grid>
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
        <DialogContent dividers={false}>
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
    </Container>
  )
}
