import * as React from "react"
import { Box, Card, Switch, Typography, Divider, Grid, colors, useMediaQuery } from "@material-ui/core"
import LAMP, {
  Participant as ParticipantObj,
  Activity as ActivityObj,
  ActivityEvent as ActivityEventObj,
  SensorEvent as SensorEventObj,
} from "lamp-core"
import { useSnackbar } from "notistack"
import ActivityCard from "./ActivityCard"
import MultipleSelect from "./MultipleSelect"
import Sparkline from "./Sparkline"
import MultiPieChart from "./MultiPieChart"

// TODO: all SensorEvents?

function _hideExperimental() {
  return (LAMP.Auth._auth.serverAddress || "").includes(".psych.digital")
}

async function getActivities(participant: ParticipantObj) {
  let original = await LAMP.Activity.allByParticipant(participant.id)
  let custom = [
    {
      name: "[BAARS-IV SR Current] Inattention",
      spec: "lamp.dashboard.custom_survey_group",
      schedule: {},
      settings: [
        {
          activity: "BAARS-SR Current",
          question: "Fail to give close attention to details or make careless mistakes in my work or other activities",
        },
        {
          activity: "BAARS-SR Current",
          question: "Difficulty sustaining my attention in tasks or fun activities",
        },
        {
          activity: "BAARS-SR Current",
          question: "Don’t listen when spoken to directly",
        },
        {
          activity: "BAARS-SR Current",
          question: "Don’t follow through on instructions and fail to finish work or chores",
        },
        {
          activity: "BAARS-SR Current",
          question: "Have difficulty organizing tasks and activities",
        },
        {
          activity: "BAARS-SR Current",
          question: "Avoid, dislike, or am reluctant to engage in tasks that require sustained mental effort",
        },
        {
          activity: "BAARS-SR Current",
          question: "Lose things necessary for tasks or activities",
        },
        {
          activity: "BAARS-SR Current",
          question: "Easily distracted by extraneous stimuli or irrelevant thoughts",
        },
        {
          activity: "BAARS-SR Current",
          question: "Forgetful in daily activities",
        },
      ],
    },
    {
      name: "[BAARS-IV SR Current] Hyperactivity-Impulsivity",
      spec: "lamp.dashboard.custom_survey_group",
      schedule: {},
      settings: [
        {
          activity: "BAARS-SR Current",
          question: "Fidget with hands or feet or squirm in seat",
        },
        {
          activity: "BAARS-SR Current",
          question: "Leave my seat in classrooms or in other situations in which remaining seated is expected",
        },
        {
          activity: "BAARS-SR Current",
          question: "Shift around excessively or feel restless or hemmed in",
        },
        {
          activity: "BAARS-SR Current",
          question: "Have difficulty engaging in leisure activities quietly (feel uncomfortable, or am loud or noisy)",
        },
        {
          activity: "BAARS-SR Current",
          question: 'I am "on the go" or act as if "driven by motor" ',
        },
        {
          activity: "BAARS-SR Current",
          question: "Talk excessively (in social situations)",
        },
        {
          activity: "BAARS-SR Current",
          question:
            "Blurt out answers before questions have been completed, complete others’ sentences, or jump the gun",
        },
        {
          activity: "BAARS-SR Current",
          question: "Have difficulty awaiting my turn",
        },
        {
          activity: "BAARS-SR Current",
          question: "Interrupt or intrude on others (butt into conversations or activities without permission)",
        },
      ],
    },
    {
      name: "[BAARS-IV SR Current] Sluggish Cognitive Tempo",
      spec: "lamp.dashboard.custom_survey_group",
      schedule: {},
      settings: [
        {
          activity: "BAARS-SR Current",
          question: "Prone to daydreaming when I should have been\r\nconcentrating on something or working",
        },
        {
          activity: "BAARS-SR Current",
          question: "Have trouble staying alert or awake in boring situations",
        },
        {
          activity: "BAARS-SR Current",
          question: "Easily confused",
        },
        {
          activity: "BAARS-SR Current",
          question: "Easily bored",
        },
        {
          activity: "BAARS-SR Current",
          question: 'Spacey or "in a fog"',
        },
        {
          activity: "BAARS-SR Current",
          question: "Lethargic, more tired than others",
        },
        {
          activity: "BAARS-SR Current",
          question: "Underactive or have less energy than others",
        },
        {
          activity: "BAARS-SR Current",
          question: "Slow moving",
        },
        {
          activity: "BAARS-SR Current",
          question: "I don’t seem to process information as quickly or as\r\naccurately as others.",
        },
      ],
    },
    {
      name: "[BAARS-IV SR Current] Other",
      spec: "lamp.dashboard.custom_survey_group",
      schedule: {},
      settings: [
        {
          activity: "BAARS-SR Current",
          question: 'Did you experience any symptoms at least "often" or more frequently?',
        },
        {
          activity: "BAARS-SR Current",
          question: "If so, how old were you when these symptoms began?",
        },
        {
          activity: "BAARS-SR Current",
          question: "If so, in which of these settings did those symptoms impair your functioning?",
        },
      ],
    },
    {
      name: "[BAARS-IV SR Childhood] Inattention",
      spec: "lamp.dashboard.custom_survey_group",
      schedule: {},
      settings: [
        {
          activity: "AARS-SR Child",
          question:
            "Failed to give close attention to details or made careless\r\nmistakes in my work or other activities",
        },
        {
          activity: "AARS-SR Child",
          question: "Had difficulty sustaining my attention in tasks or fun\r\nactivities",
        },
        {
          activity: "AARS-SR Child",
          question: "Didn’t listen when spoken to directly",
        },
        {
          activity: "AARS-SR Child",
          question: "Didn’t follow through on instructions and failed to finish\r\nwork or chores.",
        },
        {
          activity: "AARS-SR Child",
          question: "Had difficulty organizing tasks and activities",
        },
        {
          activity: "AARS-SR Child",
          question: "Avoided, disliked, or was reluctant to engage in tasks that\r\nrequired sustained mental effort",
        },
        {
          activity: "AARS-SR Child",
          question: "Lost things necessary for tasks or activities",
        },
        {
          activity: "AARS-SR Child",
          question: "Was easily distracted by extraneous stimuli or irrelevant\r\nthoughts.",
        },
        {
          activity: "AARS-SR Child",
          question: "Was forgetful in daily activities",
        },
      ],
    },
    {
      name: "[BAARS-IV SR Childhood] Hyperactivity-Impulsivity",
      spec: "lamp.dashboard.custom_survey_group",
      schedule: {},
      settings: [
        {
          activity: "AARS-SR Child",
          question: "Fidgeted with hands or feet or squirmed in seat",
        },

        {
          activity: "AARS-SR Child",
          question: "Left my seat in classrooms or in other situations in which\r\nremaining seated was expected",
        },

        {
          activity: "AARS-SR Child",
          question: "Shifted around excessively or felt restless or hemmed in",
        },

        {
          activity: "AARS-SR Child",
          question:
            "Had difficulty engaging in leisure activities quietly (felt\r\nuncomfortable, or was loud or noisy)",
        },

        {
          activity: "AARS-SR Child",
          question: "Was “on the go” or acted as if “driven by a motor”",
        },

        {
          activity: "AARS-SR Child",
          question: "Talked excessively",
        },

        {
          activity: "AARS-SR Child",
          question: "Blurted out answers before questions had been completed,\r\ncompleted others’ sentences",
        },

        {
          activity: "AARS-SR Child",
          question: "Had difficulty awaiting my turn",
        },

        {
          activity: "AARS-SR Child",
          question: "Interrupted or intruded on others (butted into conversations\r\nor activities without permission)",
        },
      ],
    },
    {
      name: "[BAARS-IV SR Childhood] Other",
      spec: "lamp.dashboard.custom_survey_group",
      schedule: {},
      settings: [
        {
          activity: "AARS-SR Child",
          question: 'Did you experience any of these symptoms at least "often" or more frequently?',
        },

        {
          activity: "AARS-SR Child",
          question: "If so, in which of these settings did those symptoms impair your functioning?",
        },
      ],
    },
    {
      name: "[SCT SR Childhood] Sluggish Cognitive Tempo",
      spec: "lamp.dashboard.custom_survey_group",
      schedule: {},
      settings: [
        {
          activity: "SCT SR Child",
          question: "Prone to daydreaming when I should have been\r\nconcentrating on something or working",
        },

        {
          activity: "SCT SR Child",
          question: "Had trouble staying alert or awake in boring situations",
        },

        {
          activity: "SCT SR Child",
          question: "Easily confused",
        },

        {
          activity: "SCT SR Child",
          question: "Easily bored",
        },

        {
          activity: "SCT SR Child",
          question: 'Spacey or "in a fog"',
        },

        {
          activity: "SCT SR Child",
          question: "Lethargic, more tired than others",
        },

        {
          activity: "SCT SR Child",
          question: "Underactive or had less energy than others",
        },

        {
          activity: "SCT SR Child",
          question: "Slow moving",
        },

        {
          activity: "SCT SR Child",
          question: "I didn’t seem to process information as quickly or as\r\naccurately as others.",
        },
      ],
    },
    {
      name: "[SCT SR Childhood] Other",
      spec: "lamp.dashboard.custom_survey_group",
      schedule: {},
      settings: [
        {
          activity: "SCT SR Child",
          question: 'Did you experience any of these symptoms at least "often" or "more frequently"?',
        },

        {
          activity: "SCT SR Child",
          question: "If so, in which settings did those symptoms impair your functioning?",
        },
      ],
    },
  ]
  return [...original, ...custom] // original.filter((x) => x.spec !== "lamp.survey")
}

async function getVisualizations(participant: ParticipantObj) {
  let visualizations = {}
  for (let attachmentID of ((await LAMP.Type.listAttachments(participant.id)) as any).data) {
    if (!attachmentID.startsWith("lamp.dashboard.experimental")) continue
    let bstr = ((await LAMP.Type.getAttachment(participant.id, attachmentID)) as any).data
    visualizations[attachmentID] = bstr.startsWith("data:") ? bstr : `data:image/svg+xml;base64,${bstr}` // defaults
  }
  return visualizations
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
      activity: _activities.find(
        (y) =>
          x.activity === y.id ||
          (!!x.static_data.survey_name && x.static_data.survey_name.toLowerCase() === y.name.toLowerCase())
      ),
    }))
    .filter((x) => (!!x.activity ? !_hidden.includes(`${x.timestamp}/${x.activity.id}`) : true))
    .sort((x, y) => x.timestamp - y.timestamp)
    .map((x) => ({
      ...x,
      activity: (x.activity || { name: "" }).name,
    }))
    .groupBy("activity") as any
  let custom = _activities
    .filter((x) => x.spec === "lamp.dashboard.custom_survey_group")
    .map((x) => x.settings.map((y) => ({})))
    .groupBy("activity")
  return original
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

// Perform count coalescing on processed events grouped by type.
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
    "Environmental Context": ((sensor_events || {})["lamp.gps.contextual"] || []).length,
    "Step Count": ((sensor_events || {})["lamp.steps"] || []).length,
  }
}

function getEnvironmentalContextGroups(gps_events?: SensorEventObj[]) {
  gps_events = gps_events ?? [] // Catch missing data.
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

export default function ParticipantData({
  participant,
  hiddenEvents,
  enableEditMode,
  onEditAction,
  onCopyAction,
  onDeleteAction,
  ...props
}: {
  participant: ParticipantObj
  hiddenEvents: string[]
  enableEditMode: boolean
  onEditAction: (activity: ActivityObj, data: any) => void
  onCopyAction: (activity: ActivityObj, data: any) => void
  onDeleteAction: (activity: ActivityObj, data: any) => void
}) {
  const [showAll, setShowAll] = React.useState(false)
  const [activities, setActivities] = React.useState([])
  const [activityEvents, setActivityEvents] = React.useState({})
  const [sensorEvents, setSensorEvents] = React.useState({})
  const [activityCounts, setActivityCounts] = React.useState({})
  const [sensorCounts, setSensorCounts] = React.useState({})
  const [selectedActivities, setSelectedActivities] = React.useState([])
  const [selectedSensors, setSelectedSensors] = React.useState([])
  const [selectedExperimental, setSelectedExperimental] = React.useState([])
  const [visualizations, setVisualizations] = React.useState({})
  const printView = useMediaQuery("print")

  React.useEffect(() => {
    getVisualizations(participant).then(setVisualizations)
    ;(async () => {
      let activities = await getActivities(participant)
      let activityEvents = await getActivityEvents(participant, activities, hiddenEvents)
      let sensorEvents = await getSensorEvents(participant)
      let activityEventCount = getActivityEventCount(activityEvents)
      let sensorEventCount = getSensorEventCount(sensorEvents)

      setActivities(activities)
      setActivityEvents(activityEvents)
      setSensorEvents(sensorEvents)
      setActivityCounts(activityEventCount)
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
    <React.Fragment>
      <Box border={1} borderColor="grey.300" borderRadius={8} bgcolor="white" p={2} mx="10%" displayPrint="none">
        <Box display="flex" justifyContent="space-between">
          <Typography variant="overline">Activity</Typography>
          <Box>
            <Typography variant="overline" color="inherit">
              Show All
            </Typography>
            <Switch
              size="small"
              checked={showAll}
              onChange={() => {
                setShowAll((x) => !x)
              }}
            />
          </Box>
        </Box>
        <MultipleSelect
          selected={selectedActivities}
          items={(activities || [])
            .filter((x) => ["lamp.survey", "lamp.dashboard.custom_survey_group"].includes(x.spec) || !!showAll)
            .map((x) => `${x.name}`)}
          showZeroBadges={false}
          badges={activityCounts}
          onChange={(x) => setSelectedActivities(x)}
        />
        {!_hideExperimental() && (
          <React.Fragment>
            <Divider style={{ margin: "8px -16px 8px -16px" }} />
            <Typography variant="overline">Sensor</Typography>
            <MultipleSelect
              selected={selectedSensors || []}
              items={[`Environmental Context`, `Step Count`]}
              showZeroBadges={false}
              badges={sensorCounts}
              onChange={(x) => setSelectedSensors(x)}
            />
          </React.Fragment>
        )}
        {Object.keys(visualizations).length > 0 && (
          <React.Fragment>
            <Divider style={{ margin: "8px -16px 8px -16px" }} />
            <Typography variant="overline">Automations</Typography>
            <MultipleSelect
              tooltips={{}}
              defaultTooltip="An experimental visualization generated by an automation you or your clinician have installed."
              selected={selectedExperimental || []}
              items={Object.keys(visualizations).map((x) => x.replace("lamp.dashboard.experimental.", ""))}
              showZeroBadges={false}
              badges={Object.keys(visualizations)
                .map((x) => x.replace("lamp.dashboard.experimental.", ""))
                .reduce((prev, curr) => ({ ...prev, [curr]: 1 }), {})}
              onChange={(x) => setSelectedExperimental(x)}
            />
          </React.Fragment>
        )}
      </Box>
      {(selectedActivities || []).length + (selectedSensors || []).length + (selectedExperimental || []).length ===
        0 && (
        <Box
          display="flex"
          justifyContent="center"
          border={1}
          borderColor={colors.blue[700]}
          borderRadius={8}
          bgcolor="grey.100"
          color={colors.blue[700]}
          p={2}
          my={4}
          mx="10%"
          displayPrint="none"
        >
          <Typography variant="overline" align="center">
            <b>No Activities are selected. Please select an Activity above to begin.</b>
          </Typography>
        </Box>
      )}
      <Box displayPrint="visible">
        {(activities || [])
          .filter((x) => (selectedActivities || []).includes(x.name) || !!printView)
          .map((activity) => (
            <Card
              key={activity.id}
              style={{ marginTop: 16, marginBottom: 16, overflow: "visible", breakInside: "avoid" }}
            >
              <ActivityCard
                activity={activity}
                events={(activityEvents || {})[activity.name] || []}
                startDate={earliestDate()}
                forceDefaultGrid={_hideExperimental()}
                onEditAction={
                  activity.spec !== "lamp.survey" || !enableEditMode
                    ? undefined
                    : (data) => onEditAction(activity, data)
                }
                onCopyAction={
                  activity.spec !== "lamp.survey" || !enableEditMode
                    ? undefined
                    : (data) => onCopyAction(activity, data)
                }
                onDeleteAction={
                  activity.spec !== "lamp.survey" || !enableEditMode
                    ? undefined
                    : (data) => onDeleteAction(activity, data)
                }
              />
            </Card>
          ))}
        {(selectedSensors || []).includes("Environmental Context") ||
          (!!printView && (
            <Card style={{ marginTop: 16, marginBottom: 16 }}>
              <Typography component="h6" variant="h6" align="center" style={{ width: "100%", margin: 16 }}>
                Environmental Context
              </Typography>
              <Divider />
              <MultiPieChart data={getEnvironmentalContextGroups(sensorEvents?.["lamp.gps.contextual"])} />
            </Card>
          ))}
        {(selectedSensors || []).includes("Step Count") ||
          (!!printView && (
            <Card style={{ marginTop: 16, marginBottom: 16 }}>
              <Typography component="h6" variant="h6" align="center" style={{ width: "100%", margin: 16 }}>
                Step Count
              </Typography>
              <Divider />
              <Sparkline
                minWidth={250}
                minHeight={250}
                XAxisLabel="Time"
                YAxisLabel="Steps Taken"
                color={colors.blue[500]}
                startDate={earliestDate()}
                data={((sensorEvents || {})["lamp.steps"] || []).map((d) => ({
                  x: new Date(parseInt(d.timestamp)),
                  y: d.data.value || 0,
                }))}
              />
            </Card>
          ))}
        {(selectedExperimental || []).map((x) => (
          <Card key={x} style={{ marginTop: 16, marginBottom: 16 }}>
            <Typography component="h6" variant="h6" align="center" style={{ width: "100%", margin: 16 }}>
              {x}
            </Typography>
            <Divider style={{ marginBottom: 16 }} />
            <Grid container justify="center">
              <img
                alt="visualization"
                src={visualizations["lamp.dashboard.experimental." + x]}
                height="85%"
                width="85%"
              />
            </Grid>
          </Card>
        ))}
      </Box>
    </React.Fragment>
  )
}
