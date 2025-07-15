// Core Imports
import React, { useState, useEffect } from "react"
import Box from "@material-ui/core/Box"
import Typography from "@material-ui/core/Typography"
import makeStyles from "@material-ui/core/styles/makeStyles"
import createStyles from "@material-ui/core/styles/createStyles"
import { Theme } from "@material-ui/core/styles/createTheme"
import Backdrop from "@material-ui/core/Backdrop"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Icon from "@material-ui/core/Icon"
import Link from "@material-ui/core/Link"
import Divider from "@material-ui/core/Divider"
import CircularProgress from "@material-ui/core/CircularProgress"
import LAMP from "lamp-core"
import { useTranslation } from "react-i18next"
import Journal from "./Journal"
import PreventDBT from "./PreventDBT"
import PreventData from "./PreventData"
import PreventGoalData from "./PreventGoalData"
import VoiceRecoding from "./VoiceRecoding"
import { getSelfHelpAllActivityEvents } from "./Participant"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbardashboard: {
      minHeight: 100,
      padding: "0 10px",
      "& h5": {
        color: "rgba(0, 0, 0, 0.75)",
        textAlign: "left",
        fontWeight: "600",
        fontSize: 30,
        width: "calc(100% - 96px)",
      },
    },
    activityContent: {
      padding: "25px 50px 0",
    },
    backdrop: {
      zIndex: 111111,
      color: "#fff",
    },
    btnBlue: {
      background: "#7599FF",
      borderRadius: "40px",
      minWidth: 100,
      boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.20)",
      lineHeight: "38px",

      cursor: "pointer",
      textTransform: "capitalize",
      fontSize: "16px",
      color: "#fff",
      "& svg": { marginRight: 8 },
      "&:hover": { background: "#5680f9" },
      [theme.breakpoints.up("md")]: {
        position: "absolute",
      },
    },
    btnImport: {
      height: 48,
      width: 48,
      background: "white",
      boxShadow: "none",
      marginRight: 15,
      color: "#7599FF",
      // "&:hover": { background: "#f4f4f4" },
    },
    tableContainer: {
      "& div.MuiInput-underline:before": { borderBottom: "0 !important" },
      "& div.MuiInput-underline:after": { borderBottom: "0 !important" },
      "& div.MuiInput-underline": {
        "& span.material-icons": {
          width: 21,
          height: 19,
          fontSize: 27,
          lineHeight: "23PX",
          color: "rgba(0, 0, 0, 0.4)",
        },
        "& button": { display: "none" },
      },
    },
    studyCode: {
      margin: "4px 0",
      backgroundColor: "#ECF4FF",
      border: "2px solid #FFFFFF",
      color: "#000000",
    },

    tableOptions: {
      background: "#ECF4FF",
      padding: "10px 0",
    },
    btnOptions: {
      textTransform: "capitalize",
      color: "#4C66D6",
      margin: "0 25px 0 0",

      "& span": { cursor: "pointer" },
      "& svg": { width: 24, height: 24, fill: "#4C66D6" },
    },
    tableOuter: {
      width: "100vw",
      position: "relative",
      left: "50%",
      right: "50%",
      marginLeft: "-50.6vw",
      marginRight: "-50.6vw",
      marginBottom: 30,
      marginTop: -20,
      "& input": {
        width: 350,
        [theme.breakpoints.down("md")]: {
          width: 200,
        },
      },
      "& div.MuiToolbar-root": { maxWidth: 1232, width: "100%", margin: "0 auto" },
      "& h6": { fontSize: 30, fontWeight: 600 },
    },

    tagFilteredBg: {
      color: "#5784EE !important",
      "& path": { fill: "#5784EE !important", fillOpacity: 1 },
    },
    btnFilter: {
      color: "rgba(0, 0, 0, 0.4)",
      fontSize: 14,
      lineHeight: "38px",
      cursor: "pointer",
      textTransform: "capitalize",
      boxShadow: "none",
      background: "transparent",
      margin: "0 15px",
      paddingRight: 0,
      "& svg": { marginRight: 10 },
    },
    tableContainerWidth: {
      maxWidth: 1055,
      width: "80%",
    },

    customPopover: { backgroundColor: "rgba(0, 0, 0, 0.4)" },
    customPaper: {
      maxWidth: 380,
      maxHeight: 600,
      marginTop: 75,
      marginLeft: 100,
      borderRadius: 10,
      padding: "10px 0",
      "& h6": { fontSize: 16 },
      "& li": {
        display: "inline-block",
        width: "100%",
        padding: "8px 30px",
        "&:hover": { backgroundColor: "#ECF4FF" },
      },
      "& *": { cursor: "pointer" },
    },
    popexpand: {
      backgroundColor: "#fff",
      color: "#618EF7",
      zIndex: 11111,
      "& path": { fill: "#618EF7" },
      "&:hover": { backgroundColor: "#f3f3f3" },
    },
    tableAccordian: { backgroundColor: "#f4f4f4" },
    errorMsg: { color: "#FF0000", fontSize: 12 },
    dragDrop: {
      outline: "none",
      "& h6": {
        color: "#7599FF",
        fontSize: 14,
      },
    },
    formControl: {
      minWidth: "100%",
    },
    backbtnlink: {
      width: 48,
      height: 48,
      color: "rgba(0, 0, 0, 0.54)",
      padding: 12,
      borderRadius: "50%",
      "&:hover": { background: "rgba(0, 0, 0, 0.04)" },
    },
    containerWidth: { maxWidth: 1055 },
    importList: { padding: "15px", background: "#f4f4f4", borderBottom: "#fff solid 2px" },
    dividerHeader: {
      marginTop: 0,
    },
  })
)

function _patientMode() {
  return LAMP.Auth._type === "participant"
}

export default function PreventPage({ activityId, type, participantId, ...props }) {
  const classes = useStyles()
  const [loading, setLoading] = useState(false)
  const [activity, setActivity] = useState(null)
  const [activityEvents, setActivityEvents] = useState(null)
  const { t, i18n } = useTranslation()

  useEffect(() => {
    setLoading(true)
    LAMP.Activity.view(activityId).then((data) => {
      setActivity(data)
      if (LAMP.Auth._auth.id === "selfHelp@demo.lamp.digital") {
        getSelfHelpAllActivityEvents().then((events) => {
          setActivityEvents(events.filter((event) => event.activity === activityId))
          setLoading(false)
        })
      } else {
        LAMP.ActivityEvent.allByParticipant(participantId).then((events) => {
          setActivityEvents(events.filter((event) => event.activity === activityId))
          setLoading(false)
        })
      }
    })
  }, [])

  const earliestDate = () =>
    activityEvents
      .map((x) => (x.length === 0 ? 0 : x.slice(0, 1)[0].timestamp))
      .sort((a, b) => (a > b ? 1 : a < b ? -1 : 0))
      .slice(0, 1)
      .map((x) => (x === 0 ? undefined : new Date(x)))[0]

  return (
    <React.Fragment>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <AppBar position="static" style={{ background: "#FFF", boxShadow: "none" }}>
        <Toolbar className={classes.toolbardashboard}>
          <Link
            onClick={() => {
              history.back()
            }}
            underline="none"
            className={classes.backbtnlink}
          >
            <Icon>arrow_back</Icon>
          </Link>
          <Typography variant="h5">{type === "sensor" ? "Step count" : activity?.name}</Typography>
        </Toolbar>
      </AppBar>

      <Divider className={classes.dividerHeader} />
      {!!activity && type === "activity" && !!activityEvents && (
        <Box>
          {activity?.spec === "lamp.journal" ? (
            <Journal selectedEvents={activityEvents} />
          ) : activity?.spec === "lamp.goals" || activity?.spec === "lamp.medications" ? (
            <PreventGoalData
              selectedEvents={activityEvents}
              participantId={participantId}
              activity={activity ?? null}
            />
          ) : activity?.spec === "lamp.dbt_diary_card" ? (
            <PreventDBT selectedEvents={activityEvents} />
          ) : activity?.spec === "lamp.recording" ? (
            <VoiceRecoding selectedEvents={activityEvents} />
          ) : (
            <PreventData
              activity={activity}
              events={activityEvents}
              graphType={3}
              earliestDate={earliestDate}
              enableEditMode={!_patientMode()}
              onEditAction={
                (activity, data) => {}
                //     setSurveyName(activity.name)
                //     setVisibleActivities([
                //       {
                //         ...activity,
                //         prefillData: [
                //           data.slice.map(({ item, value }) => ({
                //             item,
                //             value,
                //           })),
                //         ],
                //         prefillTimestamp: new Date(
                //           data.x
                //         ).getTime() /* post-increment later to avoid double-reporting events! */,
                //       },
                //     ])
                //   }
              }
              onCopyAction={
                (activity, data) => {}
                //     setSurveyName(activity.name)
                //     setVisibleActivities([
                //       {
                //         ...activity,
                //         prefillData: [
                //           data.slice.map(({ item, value }) => ({
                //             item,
                //             value,
                //           })),
                //         ],
                //       },
                //     ])
                //   }
              }
              onDeleteAction={(activity, data) => {}} //hideEvent(new Date(data.x).getTime(), activity.id)}
            />
          )}
        </Box>
      )}
    </React.Fragment>
  )
}
