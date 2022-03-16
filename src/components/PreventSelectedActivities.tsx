// Core Imports
import React, { useEffect } from "react"
import { Typography, Grid, Card, Box, ButtonBase, makeStyles, Theme, createStyles } from "@material-ui/core"
import { ReactComponent as JournalBlue } from "../icons/journal_blue.svg"
import LAMP, { Participant as ParticipantObj, Activity as ActivityObj } from "lamp-core"
import { ReactComponent as AssessDbt } from "../icons/AssessDbt.svg"
import { ReactComponent as PreventMeditation } from "../icons/PreventMeditation.svg"
import { ReactComponent as PreventCustom } from "../icons/PreventCustom.svg"

import ReactMarkdown from "react-markdown"
import emoji from "remark-emoji"
import gfm from "remark-gfm"
import en from "javascript-time-ago/locale/en"
import TimeAgo from "javascript-time-ago"
import { useTranslation } from "react-i18next"
import { VegaLite } from "react-vega"
TimeAgo.addLocale(en)
const timeAgo = new TimeAgo("en-US")

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
    maxw300: {
      maxWidth: 300,
      marginLeft: "auto",
      marginRight: "auto",
      [theme.breakpoints.up("lg")]: {
        maxWidth: "90%",
        marginTop: 40,
      },
    },
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
    backbtn: {
      [theme.breakpoints.down("xs")]: {
        paddingLeft: 0,
      },
    },
  })
)

export const strategies = {
  "lamp.survey": (slices, activity, scopedItem) =>
    (slices ?? [])
      .filter((x, idx) => (scopedItem !== undefined ? idx === scopedItem : true))
      .map((x, idx) => {
        let question = (Array.isArray(activity.settings) ? activity.settings : []).filter((y) => y.text === x.item)[0]
        if (!!question && typeof x?.value !== "undefined")
          return ["Yes", "True"].includes(x.value) ? 1 : ["No", "False"].includes(x.value) ? 0 : Number(x.value) || 0
        else if (!!question && !!!question.options) return Math.max(question.options.indexOf(x.value), 0)
        else if (typeof x?.value !== "number" && typeof x?.value !== "string") {
          let sum = 0
          Object.keys(x.value || []).map((val) => {
            if (!!x.value[val]?.value && x.value[val]?.value.length > 0) {
              sum += (x.value[val]?.value || [])
                .map((elt) => {
                  // assure the value can be converted into an integer
                  return !isNaN(Number(elt)) ? Number(elt) : 0
                })
                .reduce((sum, current) => sum + current)
            }
          })
          return sum
        } else return Number(x?.value) || 0
      })
      .reduce((prev, curr) => prev + curr, 0),

  "lamp.jewels_a": (slices, activity, scopedItem) =>
    (parseInt(slices.score ?? 0).toFixed(1) || 0) > 100 ? 100 : parseInt(slices.score ?? 0).toFixed(1) || 0,
  "lamp.jewels_b": (slices, activity, scopedItem) =>
    (parseInt(slices.score ?? 0).toFixed(1) || 0) > 100 ? 100 : parseInt(slices.score ?? 0).toFixed(1) || 0,
  "lamp.spatial_span": (slices, activity, scopedItem) =>
    (parseInt(slices.score ?? 0).toFixed(1) || 0) > 100 ? 100 : parseInt(slices.score ?? 0).toFixed(1) || 0,
  "lamp.balloon_risk": (slices, activity, scopedItem) => parseInt(slices.points ?? 0).toFixed(1) || 0,
  "lamp.pop_the_bubbles": (slices, activity, scopedItem) => {
    let temporalSlices = slices.filter(function (data) {
      return data.type === true
    })
    return temporalSlices.length > 0 && slices.length > 0 ? temporalSlices.length / slices.length : 0
  },
  "lamp.cats_and_dogs": (slices, activity, scopedItem) =>
    (parseInt(slices.score ?? 0).toFixed(1) || 0) > 100 ? 100 : parseInt(slices.score ?? 0).toFixed(1) || 0,
  "lamp.scratch_image": (slices, activity, scopedItem) =>
    ((parseInt(slices?.duration ?? 0) / 1000).toFixed(1) || 0) > 100
      ? 100
      : (parseInt(slices?.duration ?? 0) / 1000).toFixed(1) || 0,
  "lamp.breathe": (slices, activity, scopedItem) =>
    ((parseInt(slices?.duration ?? 0) / 1000).toFixed(1) || 0) > 100
      ? 100
      : (parseInt(slices?.duration ?? 0) / 1000).toFixed(1) || 0,
  "lamp.tips": (slices, activity, scopedItem) =>
    ((parseInt(slices?.duration ?? 0) / 1000).toFixed(1) || 0) > 100
      ? 100
      : (parseInt(slices?.duration ?? 0) / 1000).toFixed(1) || 0,
  __default__: (slices, activity, scopedItem) =>
    slices.map((x) => parseInt(x.item) || 0).reduce((prev, curr) => (prev > curr ? prev : curr), 0),
}
export default function PreventSelectedActivities({
  participant,
  activities,
  selectedActivities,
  activityEvents,
  activityCounts,
  timeSpans,
  onEditAction,
  onCopyAction,
  onDeleteAction,
  earliestDate,
  ...props
}: {
  participant: ParticipantObj
  activities: any
  selectedActivities: any
  activityEvents: any
  activityCounts: any
  timeSpans: any
  earliestDate: any
  onEditAction: (activity: ActivityObj, data: any) => void
  onCopyAction: (activity: ActivityObj, data: any) => void
  onDeleteAction: (activity: ActivityObj, data: any) => void
}) {
  const classes = useStyles()
  const { t, i18n } = useTranslation()

  return (
    <React.Fragment>
      {(activities || [])
        .filter((x) => (selectedActivities || []).includes(x.name))
        .map((
          activity // Uncomment if you want to view the Voice Recording Details on Prevent
        ) =>
          /*activity.spec === "lamp.recording" ||*/ activity.spec === "lamp.journal" ||
          activity.spec === "lamp.dbt_diary_card" ||
          activity.spec === "lamp.goals" ||
          activity.spec === "lamp.medications" ? (
            <Grid item xs={6} sm={3} md={3} lg={3}>
              <ButtonBase focusRipple className={classes.fullwidthBtn}>
                <Card
                  className={classes.prevent}
                  onClick={() => {
                    window.location.href = `/#/participant/${participant.id}/portal/activity/${activity.id}`
                  }}
                >
                  <Box display="flex">
                    <Box flexGrow={1}>
                      <Typography className={classes.preventlabel}>{t(activity.name)}</Typography>
                    </Box>
                    <Box mr={1} className={classes.preventRightSVG}>
                      {
                        activity.spec === "lamp.goals" ? (
                          <PreventCustom />
                        ) : activity.spec === "lamp.medications" ? (
                          <PreventMeditation />
                        ) : activity.spec === "lamp.journal" ? (
                          <JournalBlue />
                        ) : (
                          <AssessDbt width="50" height="50" />
                        ) /*: activity.spec === "lamp.recording" ? ( // Uncomment if you want to view the Voice Recording Details on Prevent 
                        <PreventRecording />
                      )*/
                      }
                    </Box>
                  </Box>
                  <Box className={classes.preventGraph}>
                    <Typography variant="h2">{(activityEvents?.[activity.name] || []).length}</Typography>
                  </Box>
                  <Typography variant="h6">
                    {t("entries")} {timeAgo.format(timeSpans[activity.name].timestamp)}
                  </Typography>
                </Card>
              </ButtonBase>
            </Grid>
          ) : (
            <Grid item xs={12} sm={6} md={6} lg={6}>
              <ButtonBase focusRipple className={classes.fullwidthBtn}>
                <Card
                  className={classes.preventFull}
                  onClick={() =>
                    (window.location.href = `/#/participant/${participant.id}/portal/activity/${activity.id}`)
                  }
                >
                  <Typography className={classes.preventlabelFull}>
                    <ReactMarkdown
                      source={`${t(activity.name)} (${activityCounts[activity.name]})`}
                      escapeHtml={false}
                      plugins={[gfm, emoji]}
                    />
                  </Typography>
                  <Box className={classes.maxw300}>
                    <VegaLite
                      actions={false}
                      style={{ backgroundColor: "#00000000" }}
                      spec={{
                        data: {
                          values: activityEvents?.[activity.name]?.map((d) => ({
                            x: new Date(d.timestamp),
                            y: strategies[activity.spec]
                              ? strategies[activity.spec](
                                  activity.spec === "lamp.survey" || activity.spec === "lamp.pop_the_bubbles"
                                    ? d?.temporal_slices ?? d["temporal_slices"]
                                    : activity.spec === "lamp.scratch_image" ||
                                      activity.spec === "lamp.breathe" ||
                                      activity.spec === "lamp.tips"
                                    ? d
                                    : d.static_data,
                                  activity,
                                  undefined
                                )
                              : 0,
                          })),
                        },
                        width: 300,
                        height: 70,
                        background: "#00000000",
                        config: {
                          view: { stroke: "transparent" },
                          title: {
                            color: "rgba(0, 0, 0, 0.75)",
                            fontSize: 25,
                            font: "Inter",
                            fontWeight: 600,
                            align: "left",
                            anchor: "start",
                          },
                          legend: {
                            title: null,
                            orient: "bottom",
                            columns: 2,
                            labelColor: "rgba(0, 0, 0, 0.75)",
                            labelFont: "Inter",
                            labelFontSize: 14,
                            labelFontWeight: 600,
                            symbolStrokeWidth: 12,
                            symbolSize: 150,
                            symbolType: "circle",
                            offset: 0,
                          },
                          axisX: {
                            disable: true,
                          },
                          axisY: {
                            disable: true,
                          },
                        },
                        mark: { type: "line", interpolate: "cardinal", tension: 0.8, color: "#3C5DDD" },
                        encoding: {
                          x: { field: "x", type: "ordinal", timeUnit: "utcyearmonthdate" },
                          y: { field: "y", type: "quantitative" },
                          strokeWidth: { value: 2 },
                        },
                      }}
                    />
                  </Box>
                  <Typography variant="h6">{timeAgo.format(timeSpans[activity.name]?.timestamp)}</Typography>
                </Card>
              </ButtonBase>
            </Grid>
          )
        )}
    </React.Fragment>
  )
}
