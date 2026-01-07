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

TimeAgo.addLocale(en)

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
      ?.filter((idx) => (scopedItem !== undefined ? idx === scopedItem : true))
      ?.map((x) => {
        let question = (Array.isArray(activity.settings) ? activity.settings : [])?.filter((y) => y.text === x.item)[0]
        if (!!question && typeof x?.value !== "undefined")
          return ["Yes", "True"].includes(x.value)
            ? 1
            : ["No", "False"].includes(x.value)
            ? 0
            : Number(typeof x.value === "string" ? x.value.replace(/\"/g, "") : x.value) || 0
        else if (!!question && !!!question.options)
          return Math.max(
            (question.options || []).indexOf(typeof x.value === "string" ? x.value.replace(/\"/g, "") : x.value),
            0
          )
        else if (x?.value != null && typeof x.value !== "string" && typeof x.value !== "number") {
          let sum = 0
          Object.keys(x.value || [])?.map((val) => {
            const valueArray = x.value[val]?.value
            if (!!valueArray && Array.isArray(valueArray) && valueArray?.length > 0) {
              sum += valueArray
                ?.map((elt) => {
                  // assure the value can be converted into an integer
                  return !isNaN(Number(elt)) ? Number(elt) : 0
                })
                ?.reduce((sum, current) => sum + current, 0)
            }
          })
          return sum
        } else return Number(typeof x.value === "string" ? x.value.replace(/\"/g, "") : x.value) || 0
      })
      ?.reduce((prev, curr) => prev + curr, 0),
  "lamp.trails_b": (slices) =>
    slices.score == "NaN"
      ? 0
      : (parseInt(slices.score ?? 0).toFixed(1) || 0) > 100
      ? 100
      : parseInt(slices.score ?? 0).toFixed(1) || 0,
  "lamp.spin_wheel": (slices) => slices[slices?.length - 1]?.type ?? 0,
  "lamp.jewels_a": (slices) =>
    slices.score == "NaN"
      ? 0
      : (parseInt(slices.score ?? 0).toFixed(1) || 0) > 100
      ? 100
      : parseInt(slices.score ?? 0).toFixed(1) || 0,
  "lamp.jewels_b": (slices) =>
    slices.score == "NaN"
      ? 0
      : (parseInt(slices.score ?? 0).toFixed(1) || 0) > 100
      ? 100
      : parseInt(slices.score ?? 0).toFixed(1) || 0,
  "lamp.symbol_digit_substitution": (slices) =>
    slices.score == "NaN"
      ? 0
      : (parseInt(slices.score ?? 0).toFixed(1) || 0) > 100
      ? 100
      : parseInt(slices.score ?? 0).toFixed(1) || 0,
  "lamp.fragmented_letters": (slices) => parseInt(slices.best_correct_fragmentation.split("%")[0]),
  "lamp.spatial_span": (slices) =>
    slices.score == "NaN"
      ? 0
      : (parseInt(slices.score ?? 0).toFixed(1) || 0) > 100
      ? 100
      : parseInt(slices.score ?? 0).toFixed(1) || 0,
  "lamp.dcog": (slices) =>
    slices.score == "NaN"
      ? 0
      : (parseInt(slices.score ?? 0).toFixed(1) || 0) > 100
      ? 100
      : parseInt(slices.score ?? 0).toFixed(1) || 0,
  "lamp.balloon_risk": (slices) => parseInt(slices.points ?? 0).toFixed(1) || 0,
  "lamp.pop_the_bubbles": (slices) => {
    let temporalSlices = slices?.filter(function (data) {
      return !!data && data.type === true
    })
    return temporalSlices?.length > 0 && slices?.length > 0 ? temporalSlices?.length / slices?.length : 0
  },
  "lamp.maze_game": (slices) => {
    return (slices || [])?.map((x) => x.duration)?.reduce((prev, cur) => prev + cur, 0) / slices?.length
  },
  "lamp.emotion_recognition": (slices) => {
    return (slices || [])?.map((x) => (!!x.type ? 1 : 0))?.reduce((prev, cur) => prev + cur, 0)
  },
  "lamp.cats_and_dogs": (slices) => (slices.correct_answers / slices.total_questions) * 100,
  "lamp.digit_span": (slices) =>
    slices.score == "NaN"
      ? 0
      : (parseInt(slices.score ?? 0).toFixed(1) || 0) > 100
      ? 100
      : parseInt(slices.score ?? 0).toFixed(1) || 0,
  "lamp.memory_game": (slices) => (slices.correct_answers / slices.total_questions) * 100,
  "lamp.funny_memory": (slices) =>
    (slices.number_of_correct_force_choice / slices.total_number_of_pairings_listed) * 100,
  "lamp.scratch_image": (slices) =>
    ((parseInt(slices?.duration ?? 0) / 1000).toFixed(1) || 0) > 100
      ? 100
      : (parseInt(slices?.duration ?? 0) / 1000).toFixed(1) || 0,
  "lamp.breathe": (slices) =>
    ((parseInt(slices?.duration ?? 0) / 1000).toFixed(1) || 0) > 100
      ? 100
      : (parseInt(slices?.duration ?? 0) / 1000).toFixed(1) || 0,
  "lamp.tips": (slices) =>
    ((parseInt(slices?.duration ?? 0) / 1000).toFixed(1) || 0) > 100
      ? 100
      : (parseInt(slices?.duration ?? 0) / 1000).toFixed(1) || 0,
  __default__: (slices) =>
    slices?.map((x) => parseInt(x.item) || 0)?.reduce((prev, curr) => (prev > curr ? prev : curr), 0),
}

/**
 * Get percentage value for particular survey activity.
 *
 * @param activities
 * @returns
 */

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
    const matched_codes = Object.keys(locale_lang)?.filter((code) => code.startsWith(navigator.language))
    const lang = matched_codes?.length > 0 ? matched_codes[0] : "en-US"
    return i18n.language ? i18n.language : userLanguages.includes(lang) ? lang : "en-US"
  }

  useEffect(() => {
    TimeAgo.addLocale(localeMap[getSelectedLanguage()])
    setLang(new TimeAgo(getSelectedLanguage()))
  }, [])

  return (
    <React.Fragment>
      {(activities || [])
        ?.filter((x) => (selectedActivities || []).includes(x.name))
        ?.map((
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
                    <Typography variant="h2">{(activityEvents?.[activity.name] || [])?.length}</Typography>
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
                  </Typography>
                  <Box className={classes.maxw300}></Box>
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
