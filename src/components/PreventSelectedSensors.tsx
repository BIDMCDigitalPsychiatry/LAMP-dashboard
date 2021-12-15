// Core Imports
import React from "react"
import {
  Typography,
  Grid,
  Card,
  Icon,
  Box,
  AppBar,
  Toolbar,
  ButtonBase,
  makeStyles,
  Theme,
  IconButton,
  createStyles,
} from "@material-ui/core"
import ResponsiveDialog from "./ResponsiveDialog"
import PreventData from "./PreventData"
import LAMP, { Participant as ParticipantObj, Activity as ActivityObj, SensorEvent as SensorEventObj } from "lamp-core"
import { useTranslation } from "react-i18next"
import { VegaLite } from "react-vega"

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
    maxw150: { maxWidth: 150, marginLeft: "auto", marginRight: "auto" },
    fullwidthBtn: { width: "100%" },
    backbtn: {
      [theme.breakpoints.down("xs")]: {
        paddingLeft: 0,
      },
    },
  })
)

//const { t } = useTranslation()

function _patientMode() {
  return LAMP.Auth._type === "participant"
}
export default function PreventSelectedSensors({
  participant,
  sensorEvents,
  sensorCounts,
  selectedSensors,
  earliestDate,
  onEditAction,
  onCopyAction,
  onDeleteAction,
  ...props
}: {
  participant: ParticipantObj
  sensorEvents: any
  sensorCounts: any
  selectedSensors: any
  earliestDate: any
  onEditAction: (activity: ActivityObj, data: any) => void
  onCopyAction: (activity: ActivityObj, data: any) => void
  onDeleteAction: (activity: ActivityObj, data: any) => void
}) {
  const classes = useStyles()
  const { t, i18n } = useTranslation()

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
  const [openData, setOpenData] = React.useState(false)
  const [activityData, setActivityData] = React.useState(null)
  const [graphType, setGraphType] = React.useState(0)
  const [selectedActivity, setSelectedActivity] = React.useState(null)
  const [selectedActivityName, setSelectedActivityName] = React.useState(null)
  let socialContexts = ["Alone", "Friends", "Family", "Peers", "Crowd"]
  let envContexts = ["Home", "School", "Work", "Hospital", "Outside", "Shopping", "Transit"]

  const getSocialContextGroups = (gps_events?: SensorEventObj[]) => {
    gps_events = gps_events?.filter((x) => !!x.data?.context?.social) ?? [] // Catch missing data.
    let events = [
      {
        label: t("Alone"),
        value: gps_events.filter((x) => x.data.context.social === "alone").length,
      },
      {
        label: t("Friends"),
        value: gps_events.filter((x) => x.data.context.social === "friends").length,
      },
      {
        label: t("Family"),
        value: gps_events.filter((x) => x.data.context.social === "family").length,
      },
      {
        label: t("Peers"),
        value: gps_events.filter((x) => x.data.context.social === "peers").length,
      },
      {
        label: t("Crowd"),
        value: gps_events.filter((x) => x.data.context.social === "crowd").length,
      },
    ]
    return events
  }

  const getEnvironmentalContextGroups = (gps_events?: SensorEventObj[]) => {
    gps_events = gps_events?.filter((x) => !!x.data?.context?.environment) ?? [] // Catch missing data.
    let events = [
      {
        label: t("Home"),
        value: gps_events.filter((x) => x.data.context.environment === "home" || x.data.context.environment === null)
          .length,
      },
      {
        label: t("School"),
        value: gps_events.filter((x) => x.data.context.environment === "school").length,
      },
      {
        label: t("Work"),
        value: gps_events.filter((x) => x.data.context.environment === "work").length,
      },
      {
        label: t("Hospital"),
        value: gps_events.filter((x) => x.data.context.environment === "hospital").length,
      },
      {
        label: t("Outside"),
        value: gps_events.filter((x) => x.data.context.environment === "outside").length,
      },
      {
        label: t("Shopping"),
        value: gps_events.filter((x) => x.data.context.environment === "shopping").length,
      },
      {
        label: t("Transit"),
        value: gps_events.filter((x) => x.data.context.environment === "transit").length,
      },
    ]

    return events
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

  return (
    <React.Fragment>
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
                {t("Social Context")} <Box component="span">({sensorCounts["Social Context"]})</Box>
              </Typography>
              <Box>
                {/*<RadialDonutChart
                        type={socialContexts}
                        data={getSocialContextGroups(sensorEvents?.["lamp.gps.contextual"])}
                        detailPage={false}
                        width={150}
                        height={150}
                      />*/}
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
                {t("Environmental Context")} <Box component="span">({sensorCounts["Environmental Context"]})</Box>
              </Typography>
              <Box>
                {/*<RadialDonutChart
                        type={envContexts}
                        data={getEnvironmentalContextGroups(sensorEvents?.["lamp.gps.contextual"])}
                        detailPage={false}
                        width={150}
                        height={150}
                      />*/}
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
                {t("Step Count")} <Box component="span">({sensorCounts["Step Count"]})</Box>
              </Typography>

              <Box mt={3} mb={1} className={classes.maxw150}>
                <VegaLite
                  actions={false}
                  spec={{
                    data: {
                      values:
                        sensorEvents?.["lamp.steps"]?.map((d) => ({
                          x: new Date(parseInt(d.timestamp)),
                          y: typeof d.data.value !== "number" ? 0 : d.data.value || 0,
                        })) ?? [],
                    },
                    background: "#00000000",
                    width: 126,
                    height: 70,
                    config: {
                      view: { stroke: "transparent" },
                      title: {
                        color: "rgba(0, 0, 0, 0.75)",
                        fontSize: 25,
                        font: "Inter",
                        fontWeight: 600,
                        align: "left",
                        anchor: "start",
                        dy: -40,
                      },
                      legend: {
                        title: null,
                        orient: "bottom",
                        columns: 2,
                        labelColor: "rgba(0, 0, 0, 0.75)",
                        labelFont: "Inter",
                        labelFontSize: 14,
                        labelFontWeight: 600,
                        rowPadding: 20,
                        columnPadding: 50,
                        symbolStrokeWidth: 12,
                        symbolSize: 150,
                        symbolType: "circle",
                        offset: 30,
                      },
                      axisX: {
                        orient: "bottom",
                        format: "%b %d",
                        labelColor: "rgba(0, 0, 0, 0.4)",
                        labelFont: "Inter",
                        labelFontWeight: 500,
                        labelFontSize: 10,
                        ticks: false,
                        labelPadding: 32,
                        title: null,
                        grid: false,
                        disable: true,
                      },
                      axisY: {
                        orient: "left",
                        tickCount: 5,
                        labelColor: "rgba(0, 0, 0, 0.4)",
                        labelFont: "Inter",
                        labelFontWeight: 500,
                        labelFontSize: 10,
                        ticks: false,
                        labelPadding: 10,
                        title: null,
                        grid: false,
                        disable: true,
                      },
                    },
                    mark: { type: "line", interpolate: "cardinal", tension: 0.9, color: "#3C5DDD" },
                    encoding: {
                      x: { field: "x", type: "ordinal", timeUnit: "utcyearmonthdate" },
                      y: { field: "y", type: "quantitative" },
                      strokeWidth: { value: 2 },
                    },
                  }}
                />
              </Box>
            </Card>
          </ButtonBase>
        </Grid>
      )}

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
            <Typography variant="h5"> {t(selectedActivityName)} </Typography>
          </Toolbar>
        </AppBar>

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
      </ResponsiveDialog>
    </React.Fragment>
  )
}
