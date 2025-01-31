// Core Imports
import React, { useEffect, useState } from "react"
import { Typography, Grid, Card, Box, ButtonBase, makeStyles, Theme, createStyles } from "@material-ui/core"
import { ReactComponent as JournalBlue } from "../icons/journal_blue.svg"
import LAMP, { Participant as ParticipantObj, Activity as ActivityObj } from "lamp-core"
import { ReactComponent as AssessDbt } from "../icons/AssessDbt.svg"
import { ReactComponent as PreventMeditation } from "../icons/PreventMeditation.svg"
import { ReactComponent as PreventRecording } from "../icons/PreventRecording.svg"
import { ReactComponent as PreventCustom } from "../icons/PreventCustom.svg"
import locale_lang from "../locale_map.json"

import ReactMarkdown from "react-markdown"
import emoji from "remark-emoji"
import gfm from "remark-gfm"
import en from "javascript-time-ago/locale/en"
import da from "javascript-time-ago/locale/da"
import de from "javascript-time-ago/locale/de"
import zh_HK from "javascript-time-ago/locale/zh-Hans-HK"
import zh_CN from "javascript-time-ago/locale/zh"
import ko from "javascript-time-ago/locale/ko"
import es from "javascript-time-ago/locale/es"
import it from "javascript-time-ago/locale/it"
import hi from "javascript-time-ago/locale/hi"
import fr from "javascript-time-ago/locale/fr"
import TimeAgo from "javascript-time-ago"
import { useTranslation } from "react-i18next"
import { VegaLite } from "react-vega"
import { getSelfHelpAllActivityEvents } from "./Participant"
TimeAgo.addLocale(en)
const timeAgo = new TimeAgo("en-US")

const localeMap = {
  "en-US": en,
  "es-ES": es,
  "hi-IN": hi,
  "de-DE": de,
  "da-DK": da,
  "fr-FR": fr,
  "ko-KR": ko,
  "it-IT": it,
  "zh-CN": zh_CN,
  "zh-HK": zh_HK,
}
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
      "& h5": {
        color: "#4C66D6",
        fontSize: 12,
        textAlign: "right",
        padding: "0 25px 0 10px",
        fontWeight: 600,
      },
    },
    preventlabelFull: {
      minHeight: "auto",
      fontSize: 16,
      padding: "0 0 0 15px",
      width: "100%",
      textAlign: "left",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
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
          return ["Yes", "True"].includes(x.value)
            ? 1
            : ["No", "False"].includes(x.value)
            ? 0
            : Number(x.value.replace(/\"/g, "")) || 0
        else if (!!question && !!!question.options)
          return Math.max((question.options || []).indexOf(x.value.replace(/\"/g, "")), 0)
        else if (typeof x?.value.replace(/\"/g, "") !== "number" && typeof x?.value.replace(/\"/g, "") !== "string") {
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
        } else return Number(x?.value.replace(/\"/g, "")) || 0
      })
      .reduce((prev, curr) => prev + curr, 0),
  "lamp.trails_b": (slices, activity, scopedItem) =>
    slices.score == "NaN"
      ? 0
      : (parseInt(slices.score ?? 0).toFixed(1) || 0) > 100
      ? 100
      : parseInt(slices.score ?? 0).toFixed(1) || 0,
  "lamp.spin_wheel": (slices, activity, scopedItem) => slices[slices.length - 1]?.type ?? 0,
  "lamp.jewels_a": (slices, activity, scopedItem) =>
    slices.score == "NaN"
      ? 0
      : (parseInt(slices.score ?? 0).toFixed(1) || 0) > 100
      ? 100
      : parseInt(slices.score ?? 0).toFixed(1) || 0,
  "lamp.jewels_b": (slices, activity, scopedItem) =>
    slices.score == "NaN"
      ? 0
      : (parseInt(slices.score ?? 0).toFixed(1) || 0) > 100
      ? 100
      : parseInt(slices.score ?? 0).toFixed(1) || 0,
  "lamp.symbol_digit_substitution": (slices, activity, scopedItem) =>
    slices.score == "NaN"
      ? 0
      : (parseInt(slices.score ?? 0).toFixed(1) || 0) > 100
      ? 100
      : parseInt(slices.score ?? 0).toFixed(1) || 0,
  "lamp.fragmented_letters": (slices, activity, scopedItem) =>
    parseInt(slices.best_correct_fragmentation.split("%")[0]),
  "lamp.spatial_span": (slices, activity, scopedItem) =>
    slices.score == "NaN"
      ? 0
      : (parseInt(slices.score ?? 0).toFixed(1) || 0) > 100
      ? 100
      : parseInt(slices.score ?? 0).toFixed(1) || 0,
  "lamp.dcog": (slices, activity, scopedItem) =>
    slices.score == "NaN"
      ? 0
      : (parseInt(slices.score ?? 0).toFixed(1) || 0) > 100
      ? 100
      : parseInt(slices.score ?? 0).toFixed(1) || 0,
  "lamp.balloon_risk": (slices, activity, scopedItem) => parseInt(slices.points ?? 0).toFixed(1) || 0,
  "lamp.pop_the_bubbles": (slices, activity, scopedItem) => {
    let temporalSlices = slices.filter(function (data) {
      return !!data && data.type === true
    })
    return temporalSlices.length > 0 && slices.length > 0 ? temporalSlices.length / slices.length : 0
  },
  "lamp.maze_game": (slices, activity, scopedItem) => {
    return (slices || []).map((x) => x.duration).reduce((prev, cur) => prev + cur, 0) / slices.length
  },
  "lamp.emotion_recognition": (slices, activity, scopedItem) => {
    return (slices || []).map((x) => (!!x.type ? 1 : 0)).reduce((prev, cur) => prev + cur, 0)
  },
  "lamp.cats_and_dogs": (slices, activity, scopedItem) => (slices.correct_answers / slices.total_questions) * 100,
  "lamp.digit_span": (slices, activity, scopedItem) =>
    slices.score == "NaN"
      ? 0
      : (parseInt(slices.score ?? 0).toFixed(1) || 0) > 100
      ? 100
      : parseInt(slices.score ?? 0).toFixed(1) || 0,
  "lamp.memory_game": (slices, activity, scopedItem) => (slices.correct_answers / slices.total_questions) * 100,
  "lamp.funny_memory": (slices, activity, scopedItem) =>
    (slices.number_of_correct_pairs_recalled / slices.number_of_total_pairs) * 100,
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

/**
 * Get percentage value for particular survey activity for the seletced participant.
 * @param participantId
 * @param activities
 * @returns
 */
const getPercentageSettings = async (participantId, activities: ActivityObj[]) => {
  let percentage = []
  let activityEvents =
    LAMP.Auth._auth.id === "selfHelp@demo.lamp.digital"
      ? await getSelfHelpAllActivityEvents()
      : await LAMP.ActivityEvent.allByParticipant(participantId)
  return await Promise.all(
    percentage.concat(
      activities.map(async (activity) => {
        let tag = [await LAMP.Type.getAttachment(activity.id, "lamp.dashboard.percentage_settings")].map((y: any) =>
          !!y.error ? undefined : y.data
        )[0]
        if (!!tag) {
          const startTime = getStartTime(tag)
          const endTime = getEndTime(startTime, tag)
          return {
            activityId: activity.id,
            percentage:
              Math.round(
                (activityEvents.filter(
                  (a) => a.activity === activity.id && a.timestamp >= startTime && a.timestamp <= endTime
                ).length /
                  tag.limit) *
                  100 *
                  100
              ) / 100,
          }
        }
      })
    )
  )
}

const getStartTime = (tag: { limit: number; unit: string; timeframe: number; startDate: number }) => {
  let startTime = tag.startDate
  let diff = 1
  let diffDate = new Date(tag.startDate)
  switch (tag.unit) {
    case "weeks":
      diff = (new Date().getTime() - diffDate.getTime()) / (7 * tag.timeframe * 24 * 60 * 60 * 1000)
      diffDate = new Date(tag.startDate + 7 * Math.floor(diff) * tag.timeframe * 24 * 60 * 60 * 1000)
      break
    case "months":
      diff = (new Date().getTime() - diffDate.getTime()) / (30 * tag.timeframe * 24 * 60 * 60 * 1000)
      diffDate = new Date(tag.startDate + 30 * Math.floor(diff) * tag.timeframe * 24 * 60 * 60 * 1000)
      diffDate.setDate(new Date(tag.startDate).getDate())
      break
    case "days":
      diff = (new Date().getTime() - diffDate.getTime()) / (24 * tag.timeframe * 60 * 60 * 1000)
      diffDate = new Date(tag.startDate + Math.floor(diff) * tag.timeframe * 24 * 60 * 60 * 1000)
      break
    case "hours":
      diff = (new Date().getTime() - diffDate.getTime()) / (tag.timeframe * 60 * 60 * 1000)
      diffDate = new Date(tag.startDate + Math.floor(diff) * tag.timeframe * 60 * 60 * 1000)
      break
  }
  startTime = diffDate.getTime()
  return startTime
}
const getEndTime = (startTime: number, tag: { limit: number; unit: string; timeframe: number; startDate: number }) => {
  let endTime = startTime
  switch (tag.unit) {
    case "weeks":
      endTime = startTime + 7 * tag.timeframe * 24 * 60 * 60 * 1000
      break
    case "months":
      const d = new Date(startTime)
      d.setMonth(d.getMonth() + tag.timeframe)
      endTime = d.getTime()
      break
    case "days":
      endTime = startTime + tag.timeframe * 24 * 60 * 60 * 1000
      break
    case "hours":
      endTime = startTime + tag.timeframe * 60 * 60 * 1000
      break
  }
  return endTime
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
  const [timeAgo, setLang] = useState(new TimeAgo("en-US"))
  const userLanguages = ["en-US", "es-ES", "hi-IN", "de-DE", "da-DK", "fr-FR", "ko-KR", "it-IT", "zh-CN"]
  // State for survey percentage
  // const [percentages, setPercentages] = React.useState([])

  const getSelectedLanguage = () => {
    const matched_codes = Object.keys(locale_lang).filter((code) => code.startsWith(navigator.language))
    const lang = matched_codes.length > 0 ? matched_codes[0] : "en-US"
    return i18n.language ? i18n.language : userLanguages.includes(lang) ? lang : "en-US"
  }

  /**
   * Enable the survey percentage settings by uncommenting the below section
   */
  // React.useEffect(() => {
  //   ;(async () => {
  //     const percentages = await getPercentageSettings(
  //       participant.id,
  //       activities.filter((activity) => activity.spec === "lamp.survey")
  //     )
  //     setPercentages(percentages)
  //   })()
  // }, [activities])

  useEffect(() => {
    TimeAgo.addLocale(localeMap[getSelectedLanguage()])
    setLang(new TimeAgo(getSelectedLanguage()))
  }, [])

  return (
    <React.Fragment>
      {(activities || [])
        .filter((x) => (selectedActivities || []).includes(x.name))
        .map((
          activity // Uncomment if you want to view the Voice Recording Details on Prevent
        ) =>
          activity.spec === "lamp.recording" ||
          activity.spec === "lamp.journal" ||
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
                      <Typography className={classes.preventlabel}>{`${t(activity.name)}`}</Typography>
                    </Box>
                    <Box mr={1} className={classes.preventRightSVG}>
                      {activity.spec === "lamp.goals" ? (
                        <PreventCustom />
                      ) : activity.spec === "lamp.medications" ? (
                        <PreventMeditation />
                      ) : activity.spec === "lamp.journal" ? (
                        <JournalBlue />
                      ) : activity.spec === "lamp.recording" ? (
                        <PreventRecording />
                      ) : (
                        <AssessDbt width="50" height="50" />
                      )}
                    </Box>
                  </Box>
                  <Box className={classes.preventGraph}>
                    <Typography variant="h2">{(activityEvents?.[activity.name] || []).length}</Typography>
                  </Box>
                  <Typography variant="h6">
                    {`${t("entries")}`} {timeAgo.format(timeSpans[activity.name].timestamp)}
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
                      children={`${t(activity.name)} ${activityCounts[activity.name]}`}
                      skipHtml={false}
                      remarkPlugins={[gfm, emoji]}
                    />
                    {/* Uncomment below lines to show the survey percentage value
                    {activity.spec === "lamp.survey" && !!percentages && (
                      <Typography variant="h5">
                        {(percentages || []).filter((p) => p?.activityId === activity.id)[0]?.percentage ?? 0}%
                        completed
                      </Typography>
                    )} */}
                  </Typography>
                  <Box className={classes.maxw300}>
                    {!!activityEvents?.[activity.name] && (
                      <VegaLite
                        actions={false}
                        style={{ backgroundColor: "#00000000" }}
                        spec={{
                          data: {
                            values: activityEvents?.[activity.name]?.map((d) => ({
                              x: new Date(d.timestamp),
                              y: strategies[activity.spec]
                                ? strategies[activity.spec](
                                    activity.spec === "lamp.survey" ||
                                      activity.spec === "lamp.pop_the_bubbles" ||
                                      activity.spec === "lamp.maze_game" ||
                                      activity.spec === "lamp.emotion_recognition"
                                      ? d?.temporal_slices.filter((t) => t.type != "manual_exit") ??
                                          d["temporal_slices"].filter((t) => t.type != "manual_exit")
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
                    )}
                  </Box>
                  <Typography variant="h6">
                    {activity?.name && timeAgo.format(timeSpans[activity?.name]?.timestamp)}
                  </Typography>
                </Card>
              </ButtonBase>
            </Grid>
          )
        )}
    </React.Fragment>
  )
}
