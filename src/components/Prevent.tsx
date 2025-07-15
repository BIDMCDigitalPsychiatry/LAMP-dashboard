// Core Imports
import React, { useEffect } from "react"
import Container from "@material-ui/core/Container"
import Typography from "@material-ui/core/Typography"
import Grid from "@material-ui/core/Grid"
import Icon from "@material-ui/core/Icon"
import Box from "@material-ui/core/Box"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import IconButton from "@material-ui/core/IconButton"
import DialogActions from "@material-ui/core/DialogActions"
import Link from "@material-ui/core/Link"
import Backdrop from "@material-ui/core/Backdrop"
import CircularProgress from "@material-ui/core/CircularProgress"
import makeStyles from "@material-ui/core/styles/makeStyles"
import createStyles from "@material-ui/core/styles/createStyles"
import { Theme } from "@material-ui/core/styles/createTheme"
import { Stack } from "@mui/material"
import { Service } from "./DBService/DBService"
import { KeyboardDatePicker } from "@material-ui/pickers"

import LAMP, {
  Participant as ParticipantObj,
  Activity as ActivityObj,
  ActivityEvent as ActivityEventObj,
  SensorEvent as SensorEventObj,
} from "lamp-core"
import ActivityBox from "./ActivityBox"
import { useTranslation } from "react-i18next"
import PreventSelectedActivities from "./PreventSelectedActivities"
import PreventSelectedExperimental from "./PreventSelectedExperimental"
import MultipleSelect from "./MultipleSelect"

import { MuiPickersUtilsProvider } from "@material-ui/pickers"
import locale_lang from "../locale_map.json"
import frLocale from "date-fns/locale/fr"
import koLocale from "date-fns/locale/ko"
import daLocale from "date-fns/locale/da"
import deLocale from "date-fns/locale/de"
import itLocale from "date-fns/locale/it"
import zhLocale from "date-fns/locale/zh-CN"
import zhHKLocale from "date-fns/locale/zh-HK"
import esLocale from "date-fns/locale/es"
import enLocale from "date-fns/locale/en-US"
import hiLocale from "date-fns/locale/hi"

const userLanguages = ["en-US", "es-ES", "hi-IN", "de-DE", "da-DK", "fr-FR", "ko-KR", "it-IT", "zh-CN", "zh-HK"]

const localeMap = {
  "en-US": enLocale,
  "es-ES": esLocale,
  "hi-IN": hiLocale,
  "de-DE": deLocale,
  "da-DK": daLocale,
  "fr-FR": frLocale,
  "ko-KR": koLocale,
  "it-IT": itLocale,
  "zh-CN": zhLocale,
  "zh-HK": zhHKLocale,
}
import DateFnsUtils from "@date-io/date-fns"
import { getSelfHelpAllActivityEvents } from "./Participant"

export const dateInUTCformat = (val) => {
  let month =
    (val || new Date()).getMonth() + 1 > 9
      ? (val || new Date()).getMonth() + 1
      : "0" + ((val || new Date()).getMonth() + 1)
  let date = (val || new Date()).getDate() > 9 ? (val || new Date()).getDate() : "0" + (val || new Date()).getDate()
  const dateVal =
    (val || new Date()).getFullYear() +
    "-" +
    month +
    "-" +
    date +
    "T" +
    ((val || new Date()).getHours() > 9 ? (val || new Date()).getHours() : "0" + (val || new Date()).getHours()) +
    ":" +
    ((val || new Date()).getMinutes() > 9 ? (val || new Date()).getMinutes() : "0" + (val || new Date()).getMinutes()) +
    ":" +
    ((val || new Date()).getSeconds() > 9 ? (val || new Date()).getSeconds() : "0" + (val || new Date()).getSeconds()) +
    ".000Z"
  return dateVal
}
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
    datePicker: {
      "& div": { paddingRight: 0, maxWidth: 175 },
      "& p.MuiTypography-alignCenter": { textTransform: "capitalize" },
      "& h4.MuiTypography-h4 ": { textTransform: "capitalize" },
      "& span": { textTransform: "capitalize" },
    },
    datePickerDiv: {
      "& h4.MuiTypography-h4": { textTransform: "capitalize" },
      "& span.MuiPickersCalendarHeader-dayLabel": { textTransform: "capitalize" },
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },

    vega: {
      "& .vega-embed": {
        width: "100%",
        paddingRight: "0 !important",
        "& summary": { top: "-25px" },
        "& .vega-actions": { top: "15px" },
      },
      "& canvas": { width: "100% !important", height: "auto !important" },
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
    marginTop10: {
      marginTop: "10px",
    },
    activitydatapop: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    activityContent: {
      maxHeight: "280px",
    },
    dialogueCurve: { borderRadius: 10, maxWidth: 400 },
    linkBlue: { color: "#6083E7", cursor: "pointer" },
    dFlex: {
      display: "flex",
      [theme.breakpoints.down("xs")]: {
        marginBottom: 16,
      },
    },
  })
)

// Perform event coalescing/grouping by sensor or activity type.
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

async function getSelected(participant: ParticipantObj, type) {
  return (
    Object.fromEntries(
      (
        await Promise.all(
          [participant.id || ""].map(async (x) => [x, await LAMP.Type.getAttachment(x, type).catch((e) => [])])
        )
      )
        .filter((x: any) => x[1].message !== "404.object-not-found")
        .map((x: any) => [x[0], x[1].data])
    )[participant.id || ""] ?? []
  )
}

export default function Prevent({
  participant,
  activeTab,
  allActivities,
  hiddenEvents,
  enableEditMode,
  showStreak,
  activitySubmitted,
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
  showStreak: Function
  activitySubmitted: boolean
  onEditAction: (activity: ActivityObj, data: any) => void
  onCopyAction: (activity: ActivityObj, data: any) => void
  onDeleteAction: (activity: ActivityObj, data: any) => void
}) {
  const classes = useStyles()
  const { t, i18n } = useTranslation()
  const [savedActivities, setSavedActivities] = React.useState([])
  const [tag, setTag] = React.useState([])
  const [open, setOpen] = React.useState(false)
  const [dialogueType, setDialogueType] = React.useState(0)
  const [activityCounts, setActivityCounts] = React.useState({})
  const [activities, setActivities] = React.useState([])
  const [visualCounts, setVisualCounts] = React.useState({})
  const [activityEvents, setActivityEvents] = React.useState({})
  const [timeSpans, setTimeSpans] = React.useState({})
  const [loading, setLoading] = React.useState(true)
  const [visualizations, setVisualizations] = React.useState({})
  const [cortex, setCortex] = React.useState({})
  const [selectedActivities, setSelectedActivities] = React.useState([])
  const [selectedExperimental, setSelectedExperimental] = React.useState([])
  const [newEvent, setNewEvent] = React.useState(false)

  let currentDate = new Date()
  let prevDate = new Date()
  let endTime = currentDate.getTime()
  prevDate.setMonth(prevDate.getMonth() - 3)
  let startTime = prevDate.getTime()

  const [startDate, setStartDate] = React.useState<number>(startTime)
  const [endDate, setEndDate] = React.useState<number>(endTime)

  const setTabActivities = () => {
    let gActivities = allActivities.filter((x: any) => !!x?.category && x?.category.includes("prevent"))
    setSavedActivities(gActivities)
    if (gActivities.length > 0) {
      Service.getAllTags("activitytags").then((data) => {
        setTag((data || []).filter((x: any) => !!x?.category && x?.category.includes("prevent")))
      })
    }
    setLoading(false)
  }

  React.useEffect(() => {
    setNewEvent(activitySubmitted)
  }, [activitySubmitted])

  React.useEffect(() => {
    if (!!newEvent) loadEvents()
  }, [newEvent])

  React.useEffect(() => {
    let currentDate = new Date()
    let prevDate = new Date()
    let endTime = currentDate.getTime()
    prevDate.setMonth(prevDate.getMonth() - 3)
    let startTime = prevDate.getTime()
    setStartDate(startTime)
    setEndDate(endTime)
    setNewEvent(activitySubmitted)
    setTabActivities()
    loadEvents()
  }, [])

  useEffect(() => {
    setLoading(true)
    loadActivityEvents().then((res) => {
      setLoading(false)
    })
  }, [startDate, endDate])

  const loadEvents = () => {
    ;(async () => {
      getSelected(participant, "lamp.selectedExperimental").then(setSelectedExperimental)
      let disabled =
        ((await LAMP.Type.getAttachment(participant.id, "lamp.dashboard.disable_data")) as any)?.data ?? false
      if (!disabled) await loadActivityEvents()
      loadVisualizations()
    })()
  }

  const loadVisualizations = () => {
    getVisualizations(participant).then((data) => {
      setVisualizations(data)
      let visualizationCount = Object.keys(data)
        .map((x) => x.replace("lamp.dashboard.experimental.", ""))
        .reduce((prev, curr) => ({ ...prev, [curr]: 1 }), {})
      setVisualCounts(Object.assign({}, visualizationCount))
      setCortex(Object.keys(data).map((x) => x.replace("lamp.dashboard.experimental.", "")))
    })
  }

  const loadActivityEvents = async () => {
    let activities = allActivities
    getActivityEvents(participant, activities, hiddenEvents, startDate, endDate).then((activityEvents) => {
      setActivityEvents(activityEvents)
      setActivities([])
      setTimeSpans([])
      setSelectedActivities([])
      if (Object.keys(activityEvents).length !== 0) {
        let timeSpans = Object.fromEntries(
          Object.entries(activityEvents || {}).map((x) => [x[0], x[1][x[1].length - 1]])
        )
        let activityEventCount = getActivityEventCount(activityEvents)
        setTimeSpans(timeSpans)
        setActivityCounts(activityEventCount)
        activities = activities.filter(
          (activity) =>
            activityEventCount[activity.name] > 0 &&
            activity.spec !== "lamp.group" &&
            activity.spec !== "lamp.tips" &&
            activity.spec !== "lamp.module" &&
            activity.spec !== "lamp.zoom_meeting"
        )
        setActivities(activities)
        setSelectedActivities(activities.map((activity) => activity.name))
      }
    })
  }

  const earliestDate = () =>
    (activities || [])
      .filter((x) => (selectedActivities || []).includes(x.name))
      .map((x) => (activityEvents || {})[x.name] || [])
      .map((x) => (x.length === 0 ? 0 : x.slice(0, 1)[0].timestamp))
      .sort((a, b) => (a > b ? 1 : a < b ? -1 : 0))
      .slice(0, 1)
      .map((x) => (x === 0 ? undefined : new Date(x)))[0]

  const handleClickOpen = (type: number) => {
    setDialogueType(type)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const getSelectedLanguage = () => {
    const matched_codes = Object.keys(locale_lang).filter((code) => code.startsWith(navigator.language))
    const lang = matched_codes.length > 0 ? matched_codes[0] : "en-US"
    return i18n.language ? i18n.language : userLanguages.includes(lang) ? lang : "en-US"
  }

  return (
    <Container className={classes.thumbContainer}>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <ActivityBox
        participant={participant}
        savedActivities={savedActivities}
        tag={tag}
        showStreak={(participant, activity) => {
          loadActivityEvents()
          showStreak(participant, activity)
        }}
        type="Portal"
      />
      {!loading && (
        <Box>
          <Box className={classes.marginTop10}>
            <Grid
              container
              direction="row"
              xs={12}
              spacing={0}
              justifyContent="space-between"
              className={classes.activityhd}
            >
              <Grid item className={classes.dFlex}>
                <Box className={classes.preventHeader}>
                  <Typography variant="h5">{`${t("Activity")}`}</Typography>
                </Box>
                <Box className={classes.addbtnmain}>
                  <IconButton onClick={() => handleClickOpen(0)}>
                    <Icon className={classes.addicon}>add_circle_outline</Icon>
                  </IconButton>
                </Box>
              </Grid>
              <Grid>
                <Stack spacing={2} direction="row" useFlexGap>
                  <Box>
                    <MuiPickersUtilsProvider locale={localeMap[getSelectedLanguage()]} utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        clearable
                        value={new Date(startDate)}
                        onBlur={(event) => {
                          setStartDate(new Date(event.target.value).getTime())
                        }}
                        onChange={(date) => {
                          setStartDate(new Date(date).getTime())
                        }}
                        format="MM/dd/yyyy"
                        animateYearScrolling
                        variant="inline"
                        inputVariant="outlined"
                        className={classes.datePicker}
                        size="small"
                      />
                    </MuiPickersUtilsProvider>
                  </Box>
                  <Box>
                    <MuiPickersUtilsProvider locale={localeMap[getSelectedLanguage()]} utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        clearable
                        value={new Date(endDate)}
                        onBlur={(event) => {
                          const date = new Date(event.target.value)
                          setEndDate(date.getTime())
                        }}
                        onChange={(date) => {
                          setEndDate(date.getTime())
                        }}
                        format="MM/dd/yyyy"
                        animateYearScrolling
                        variant="inline"
                        inputVariant="outlined"
                        className={classes.datePicker}
                        size="small"
                      />
                    </MuiPickersUtilsProvider>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <PreventSelectedActivities
                activities={activities}
                participant={participant}
                selectedActivities={selectedActivities}
                activityEvents={activityEvents}
                activityCounts={activityCounts}
                timeSpans={timeSpans}
                onEditAction={onEditAction}
                onCopyAction={onCopyAction}
                onDeleteAction={onDeleteAction}
                earliestDate={earliestDate}
              />
            </Grid>
            <Grid container xs={12} spacing={0} className={classes.sensorhd}>
              <Grid item xs className={classes.preventHeader}>
                <Typography variant="h5">{`${t("Cortex")}`}</Typography>
              </Grid>
              <Grid item xs className={classes.addbtnmain}>
                <IconButton onClick={() => handleClickOpen(1)}>
                  <Icon className={classes.addicon}>add_circle_outline</Icon>
                </IconButton>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid container xs={12} spacing={2}>
                <PreventSelectedExperimental
                  participant={participant}
                  visualizations={visualizations}
                  selectedExperimental={selectedExperimental}
                />
              </Grid>
            </Grid>
          </Box>
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
              {dialogueType === 0 ? `${t("Activity data")}` : `${t("Cortex data")}`}
              <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
                <Icon>close</Icon>
              </IconButton>
              <Box mt={2}>
                <Typography>{`${t("Choose the data you want to see in your dashboard.")}`}</Typography>
              </Box>
            </DialogTitle>
            <DialogContent dividers={false} classes={{ root: classes.activityContent }}>
              {dialogueType === 0 && (
                <MultipleSelect
                  selected={selectedActivities}
                  items={(activities || []).map((x) => x.name)}
                  showZeroBadges={false}
                  badges={activityCounts}
                  onChange={(x) => {
                    setSelectedActivities(x)
                  }}
                />
              )}
              {dialogueType === 1 && (
                <MultipleSelect
                  selected={selectedExperimental || []}
                  items={cortex}
                  showZeroBadges={false}
                  badges={visualCounts}
                  onChange={(x) => {
                    LAMP.Type.setAttachment(participant.id, "me", "lamp.selectedExperimental", x)
                    setSelectedExperimental(x)
                  }}
                />
              )}
            </DialogContent>
            <DialogActions>
              <Box textAlign="center" width={1} mt={3} mb={3}>
                <Link onClick={handleClose} className={classes.linkBlue}>
                  {`${t("Done")}`}
                </Link>
              </Box>
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </Container>
  )
}
