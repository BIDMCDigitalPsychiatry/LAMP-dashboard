// Core Imports
import React from "react"
import {
  Typography,
  Grid,
  Icon,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  DialogActions,
  Link,
  makeStyles,
  Theme,
  createStyles,
} from "@material-ui/core"
import LAMP, {
  Participant as ParticipantObj,
  Activity as ActivityObj,
  ActivityEvent as ActivityEventObj,
  SensorEvent as SensorEventObj,
} from "lamp-core"
import MultipleSelect from "./MultipleSelect"
import en from "javascript-time-ago/locale/en"
import hi from "javascript-time-ago/locale/hi"
import es from "javascript-time-ago/locale/es"
import TimeAgo from "javascript-time-ago"
import { useTranslation } from "react-i18next"
import PreventSelectedActivities from "./PreventSelectedActivities"
import PreventSelectedSensors from "./PreventSelectedSensors"
import PreventSelectedExperimental from "./PreventSelectedExperimental"
TimeAgo.addLocale(en)
const timeAgo = new TimeAgo("en-US")

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
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
  })
)

export default function PreventSelections({
  participant,
  activities,
  cortex,
  activityEvents,
  sensorEvents,
  sensorCounts,
  visualizations,
  timeSpans,
  activityCounts,
  onEditAction,
  onCopyAction,
  onDeleteAction,
  ...props
}: {
  participant: ParticipantObj
  activities: any
  cortex: any
  activityEvents: any
  sensorEvents: any
  sensorCounts: any
  visualizations: any
  timeSpans: any
  activityCounts: any
  onEditAction: (activity: ActivityObj, data: any) => void
  onCopyAction: (activity: ActivityObj, data: any) => void
  onDeleteAction: (activity: ActivityObj, data: any) => void
}) {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const [dialogueType, setDialogueType] = React.useState(0)
  const { t, i18n } = useTranslation()
  const [selectedActivities, setSelectedActivities] = React.useState([])
  const [selectedSensors, setSelectedSensors] = React.useState([])
  const [selectedExperimental, setSelectedExperimental] = React.useState([])

  const handleClickOpen = (type: number) => {
    setDialogueType(type)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const earliestDate = () =>
    (activities || [])
      .filter((x) => (selectedActivities || []).includes(x.name))
      .map((x) => (activityEvents || {})[x.name] || [])
      .map((x) => (x.length === 0 ? 0 : x.slice(0, 1)[0].timestamp))
      .sort((a, b) => (a > b ? 1 : a < b ? -1 : 0))
      .slice(0, 1)
      .map((x) => (x === 0 ? undefined : new Date(x)))[0]

  return (
    <Box>
      <Box className={classes.marginTop10}>
        <Grid container xs={12} spacing={0} className={classes.activityhd}>
          <Grid item xs className={classes.preventHeader}>
            <Typography variant="h5">{t("Activity")}</Typography>
          </Grid>
          <Grid item xs className={classes.addbtnmain}>
            <IconButton onClick={() => handleClickOpen(0)}>
              <Icon className={classes.addicon}>add_circle_outline</Icon>
            </IconButton>
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
            <Typography variant="h5">{t("Cortex")}</Typography>
          </Grid>
          <Grid item xs className={classes.addbtnmain}>
            <IconButton onClick={() => handleClickOpen(1)}>
              <Icon className={classes.addicon}>add_circle_outline</Icon>
            </IconButton>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <PreventSelectedSensors
            participant={participant}
            selectedSensors={selectedSensors}
            sensorCounts={sensorCounts}
            sensorEvents={sensorEvents}
            onEditAction={onEditAction}
            onCopyAction={onCopyAction}
            onDeleteAction={onDeleteAction}
            earliestDate={earliestDate}
          />

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
          {dialogueType === 0 ? t("Activity data") : t("Cortex data")}
          <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
            <Icon>close</Icon>
          </IconButton>
          <Box mt={2}>
            <Typography>{t("Choose the data you want to see in your dashboard.")}</Typography>
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
                LAMP.Type.setAttachment(participant.id, "me", "lamp.selectedActivities", x)
                setSelectedActivities(x)
              }}
            />
          )}
          {dialogueType === 1 && (
            <MultipleSelect
              selected={selectedSensors.concat(selectedExperimental) || []}
              items={cortex}
              showZeroBadges={false}
              badges={sensorCounts}
              onChange={(x) => {
                if ([`Environmental Context`, `Step Count`, `Social Context`].includes(x[x.length - 1])) {
                  LAMP.Type.setAttachment(participant.id, "me", "lamp.selectedSensors", x)
                  setSelectedSensors(x)
                } else {
                  LAMP.Type.setAttachment(participant.id, "me", "lamp.selectedExperimental", x)
                  setSelectedExperimental(x)
                }
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Box textAlign="center" width={1} mt={3} mb={3}>
            <Link onClick={handleClose} className={classes.linkBlue}>
              {t("Done")}
            </Link>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
