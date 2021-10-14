import React, { useEffect, useState } from "react"
import {
  Box,
  Icon,
  Typography,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  makeStyles,
  Theme,
  createStyles,
  NativeSelect,
  TableCell,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableContainer,
} from "@material-ui/core"
import LAMP from "lamp-core"
import { Vega } from "react-vega"
import { useTranslation } from "react-i18next"
import { emotions } from "./charts/emotions_chart"
import { effective } from "./charts/effective_chart"
import { ineffective } from "./charts/ineffective_chart"
import { actions } from "./charts/actions_chart"
import { selfcare } from "./charts/selfcare_chart"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    graphContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
    },
    titleContainer: {
      display: "flex",
      width: 500,
      marginBottom: 40,
      justifyContent: "space-between",
    },
    separator: {
      border: "2px solid rgba(0, 0, 0, 0.1)",
      width: 500,
      marginTop: 50,
      marginBottom: 50,
      height: 0,
    },
    addContainer: {
      display: "flex",
      alignItems: "center",
    },
    addButtonTitle: {
      color: "#5784EE",
      fontWeight: 600,
      fontSize: 14,
    },
    addButton: {
      marginRight: 19,
      color: "#5784EE",
      width: 22,
      height: 22,
      marginLeft: 6,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    rangeButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 80,
      height: 32,
      borderRadius: 16,
      border: "1px solid #C6C6C6",
    },
    rangeTitle: {
      color: "rgba(0, 0, 0, 0.4)",
      fontSize: 14,
      fontWeight: "bold",
    },
    rangeButtonSelected: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 80,
      height: 32,
      borderRadius: 16,
      backgroundColor: "#ECF4FF",
    },
    rangeTitleSelected: {
      color: "#4C66D6",
      fontSize: 14,
      fontWeight: "bold",
    },
    selector: {
      display: "fixed",
      marginBottom: -30,
      marginRight: -300,
      zIndex: 1000,
    },
    blueBoxStyle: {
      background: "linear-gradient(0deg, #ECF4FF, #ECF4FF)",
      borderRadius: "10px",
      padding: "5px 20px 20px 20px",
      textAlign: "justify",
      marginBottom: 20,
      "& span": {
        color: "rgba(0, 0, 0, 0.4)",
        fontSize: "12px",
        lineHeight: "40px",
      },
    },
    graphSubContainer: {
      maxWidth: 500,
      "& h5": { fontSize: 25, color: "rgba(0, 0, 0, 0.75)", fontWeight: 600, marginBottom: 30 },
    },
    heading: {
      fontSize: 17,
      fontWeight: 600,
    },
    accordionContent: {
      display: "block",
      "& > div": {
        "&:first-child": {
          "& h6": {
            borderTop: 0,
            marginTop: 0,
            paddingTop: 0,
          },
        },
      },
    },
    accordionContentSub: {
      "& h6": { fontSize: 17, borderTop: "#e4e4e4 solid 1px", marginTop: 15, paddingTop: 15 },
      "& span": { color: "#666" },
    },
  })
)

function getDates(startDate, endDate) {
  let dates = []
  let curr = new Date(parseInt(startDate))
  let end = new Date(parseInt(endDate))
  while (curr.getTime() <= end.getTime()) {
    let curMonth = (curr.getMonth() + 1).toString().padStart(2, "0")
    let curDate = curr.getDate().toString().padStart(2, "0")
    let day = curr.getFullYear() + "-" + curMonth + "-" + curDate
    dates.push(day)
    curr.setDate(curr.getDate() + 1)
  }
  return dates
}

export default function PreventDBT({ participant, activity, selectedEvents, ...props }) {
  const classes = useStyles()
  const { t } = useTranslation()
  const [emotionsData, setEmotionsData] = useState(null)
  const [effectiveData, setEffectiveData] = useState(null)
  const [ineffectiveData, setIneffectiveData] = useState(null)
  const [actionsData, setActionsData] = useState(JSON.parse(JSON.stringify(actions)))
  const [selfcareData, setSelfcareData] = useState(null)
  const [skillData, setSkillData] = useState(null)
  const [dateArray, setDateArray] = useState([])
  const [emotionrange, setEmotionrange] = useState(null)
  const [skillRange, setSkillRange] = useState(null)
  const [skills, setSkills] = useState(null)
  const [effectiverange, setEffectiverange] = useState(null)
  const [inEffectiverange, setInEffectiverange] = useState(null)
  const [actionrange, setActionrange] = useState(null)
  const data = [
    {
      title: t("MINDFULNESS"),
      data: [
        t("WISE_MIND"),
        t("OBSERVE_JUST_NOTICE_URGE_SURFING"),
        t("DESCRIBE_PUT_WORDS_ON"),
        t("PARTICIPATE_ENTER_INTO_THE_EXPERIENCE"),
        t("NONJUDGMENTAL_STANCE"),
        t("ONE_MINDFULLY_IN_THE_MOMENT"),
        t("EFFECTIVENESS_FOCUS_ON_WHAT_WORKS"),
        t("LOVING_KINDNESS_BUILD_COMPASSION"),
      ],
    },
    {
      title: t("INTERPERSONAL"),
      data: [
        t("OBJECTIVE_EFFECTIVENESS_DEAR_MAN"),
        t("RELATIONSHIP_EFFECTIVENESS_GIVE"),
        t("SELF_RESPECT_EFFECTIVENESS_FAST"),
        t("VALIDATING_OTHERS"),
        t("SELF_VALIDATION"),
        t("BEHAVIOR_CHANGE_REINFORCE_EXTINGUISH"),
        t("MINDFULNESS_OF_OTHERS"),
        t("FIND_OTHERS_AND_GET_THEM_TO_LIKE_YOU"),
        t("END_RELATIONSHIPS"),
      ],
    },
    {
      title: t("EMOTION_REGULATION"),
      data: [
        t("CHECK_THE_FACTS_TO_CHANGE_EMOTIONS"),
        t("OPPOSITE_ACTION_TO_CHANGE_EMOTIONS"),
        t("PROBLEM_SOLVING_TO_CHANGE_EMOTIONS"),
        t("ACCUMULATE_POSITIVE_EMOTIONS"),
        t("BUILD_MASTERY"),
        t("COPE_AHEAD"),
        t("PLEASE_TAKE_CARE_OF_YOUR_BODY"),
      ],
    },
    {
      title: t("DISTRESS_TOLERANCE"),
      data: [
        t("STOP_SKILL"),
        t("PROS_AND_CONS_OF_ACTING_ON_URGES"),
        t("TIP_CHANGE_BODY_CHEMISTRY"),
        t("PAIRED_MUSCLE_RELAXATION"),
        t("EFFECTIVE_RETHINKING_PAIRED_RELAX"),
        t("DISTRACTING_WISE_MIND_ACCEPTS"),
        t("SELF_SOOTHING"),
        t("BODY_SCAN_MEDITATION"),
        t("IMPROVE_THE_MOMENT"),
        t("SENSORY_AWARENESS"),
        t("RADICAL_ACCEPTANCE"),
        t("TURNING_THE_MIND"),
        t("REPLACE_WILLFULNESS_WITH_WILLINGNESS"),
        t("HALF_SMILING_AND_WILLING_HANDS"),
        t("DIALECTICAL_ABSTINENCE"),
        t("ALTERNATE_REBELLION_ADAPTIVE_DENIAL"),
      ],
    },
  ]

  const getDateString = (date: Date) => {
    var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    var monthname = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return (
      weekday[date.getDay()] +
      " " +
      monthname[date.getMonth()] +
      ", " +
      date.getDate() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    )
  }

  useEffect(() => {
    data.map((v) => {
      console.log(v)
    })
    let summaryData = []
    let dData = []
    let skills = {}
    let dateArray = []
    let weekend
    let start = new Date(selectedEvents[selectedEvents.length - 1].timestamp)
    let i = 0
    while (start.getTime() >= selectedEvents[0].timestamp) {
      weekend = new Date(start)
      start.setHours(0)
      start.setMinutes(0)
      start.setSeconds(0)
      weekend.setDate(weekend.getDate() - 7)
      if (weekend.getTime() < selectedEvents[0].timestamp) {
        weekend = new Date(selectedEvents[0].timestamp)
      }
      weekend.setHours(0)
      weekend.setMinutes(0)
      weekend.setSeconds(0)
      let timestampFormat = start.getTime() + 86400000 + "-" + weekend.getTime()
      let dateFormat =
        weekend.getMonth() + 1 + "/" + weekend.getDate() + "-" + (start.getMonth() + 1) + "/" + start.getDate()
      start.setDate(start.getDate() - 8)
      if (i === 0) {
        setEmotionrange(timestampFormat)
        setEffectiverange(timestampFormat)
        setInEffectiverange(timestampFormat)
        setActionrange(timestampFormat)
      }
      i++
      dateArray.push({ timestamp: timestampFormat, date: dateFormat })
    }
    console.log(dateArray)
    setDateArray(dateArray)
    selectedEvents.map((event) => {
      let date = new Date(event.timestamp)
      var curr_date = date.getDate().toString().padStart(2, "0")
      var curr_month = (date.getMonth() + 1).toString().padStart(2, "0") //Months are zero based
      event.temporal_slices.map((slice) => {
        if (slice.level === "skill") {
          !!skills[curr_month + "/" + curr_date]
            ? skills[curr_month + "/" + curr_date].push({ category: slice.value, value: slice.item })
            : (skills[curr_month + "/" + curr_date] = [{ category: slice.value, value: slice.item }])
        }
        if ((slice.type !== null && slice.level === "target_effective") || slice.level === "target_ineffective") {
          dData[slice.item] = dData[slice.item] ? dData[slice.item] + parseInt(slice.type) : parseInt(slice.type)
        }
      })
    })

    let categories = []
    Object.keys(skills).map((key) => {
      categories = []
      skills[key].sort((a, b) => {
        return a.category.localeCompare(b.category)
      })
      skills[key].map((skill, index) => {
        if (categories.includes(skill.category)) {
          delete skills[key][index].category
        }
        categories.push(skill.category)
      })
    })
    setSkillData(skills)
    Object.keys(dData).forEach(function (key) {
      summaryData.push({ action: key, count: dData[key] })
    })
    let actionsD = actionsData
    actionsD.data.values = summaryData
    actionsD.title = t(actionsD.title)
    setActionsData(actionsD)
  }, [])

  useEffect(() => {
    if (!!emotionrange) {
      let emotionData = []
      let timeStamp = emotionrange.split("-")
      selectedEvents.map((event) => {
        let date = new Date(event.timestamp)
        var curr_date = date.getDate().toString().padStart(2, "0")
        var curr_month = (date.getMonth() + 1).toString().padStart(2, "0") //Months are zero based
        var curr_year = date.getFullYear()
        let dateString = curr_year + "-" + curr_month + "-" + curr_date
        event.temporal_slices.map((slice) => {
          if (!!slice.value) {
            switch (slice.level) {
              case "emotion":
                if (event.timestamp <= parseInt(timeStamp[0]) && event.timestamp >= parseInt(timeStamp[1]))
                  emotionData.push({ value: slice.value, date: dateString, symbol: slice.item })
                break
            }
          }
        })
      })
      let dates = getDates(timeStamp[1], timeStamp[0])
      dates.map((d) => {
        if (emotionData.length === 0) {
          if (emotionData.filter((eff) => eff.date === d).length === 0) {
            emotionData.push({ value: null, date: d, symbol: "None" })
          }
        }
      })
      let emotionsD = JSON.parse(JSON.stringify(emotions))
      emotionsD.data.values = emotionData
      emotionsD.title = t(emotionsD.title)
      setEmotionsData(emotionsD)
    }
  }, [emotionrange])

  useEffect(() => {
    if (!!effectiverange) {
      let effectivesData = []
      let timeStamp = effectiverange.split("-")
      selectedEvents.map((event) => {
        let date = new Date(event.timestamp)
        var curr_date = date.getDate().toString().padStart(2, "0")
        var curr_month = (date.getMonth() + 1).toString().padStart(2, "0") //Months are zero based
        var curr_year = date.getFullYear()
        let dateString = curr_year + "-" + curr_month + "-" + curr_date
        event.temporal_slices.map((slice) => {
          if (!!slice.value) {
            switch (slice.level) {
              case "target_effective":
                if (event.timestamp <= parseInt(timeStamp[0]) && event.timestamp >= parseInt(timeStamp[1]))
                  effectivesData.push({ value: slice.value, date: dateString, symbol: slice.item })
                break
            }
          }
        })
      })
      let dates = getDates(timeStamp[1], timeStamp[0])
      dates.map((d) => {
        if (effectivesData.length === 0) {
          if (effectivesData.filter((eff) => eff.date === d).length === 0) {
            effectivesData.push({ value: null, date: d, symbol: "None" })
          }
        }
      })
      let effectiveD = JSON.parse(JSON.stringify(effective))
      effectiveD.data.values = effectivesData
      effectiveD.title = t(effectiveD.title)
      setEffectiveData(effectiveD)
    }
  }, [effectiverange])

  useEffect(() => {
    if (!!inEffectiverange) {
      let inEffectiveData = []
      let timeStamp = inEffectiverange.split("-")
      selectedEvents.map((event) => {
        let date = new Date(event.timestamp)
        var curr_date = date.getDate().toString().padStart(2, "0")
        var curr_month = (date.getMonth() + 1).toString().padStart(2, "0") //Months are zero based
        var curr_year = date.getFullYear()
        let dateString = curr_year + "-" + curr_month + "-" + curr_date
        event.temporal_slices.map((slice) => {
          if (!!slice.value) {
            switch (slice.level) {
              case "target_ineffective":
                if (event.timestamp <= parseInt(timeStamp[0]) && event.timestamp >= parseInt(timeStamp[1]))
                  inEffectiveData.push({ value: slice.value, date: dateString, symbol: slice.item })
                break
            }
          }
        })
      })
      let dates = getDates(timeStamp[1], timeStamp[0])
      dates.map((d) => {
        if (inEffectiveData.length === 0) {
          if (inEffectiveData.filter((eff) => eff.date === d).length === 0) {
            inEffectiveData.push({ value: null, date: d, symbol: "None" })
          }
        }
      })
      let ineffectiveD = JSON.parse(JSON.stringify(ineffective))
      ineffectiveD.data.values = inEffectiveData
      ineffectiveD.title = t(ineffectiveD.title)
      setIneffectiveData(ineffectiveD)
    }
  }, [inEffectiverange])

  useEffect(() => {
    if (!!actionrange) {
      let timelineData = []
      let tData = []
      let timeStamp = actionrange.split("-")
      selectedEvents.map((event) => {
        let date = new Date(event.timestamp)
        var curr_date = date.getDate().toString().padStart(2, "0")
        var curr_month = (date.getMonth() + 1).toString().padStart(2, "0") //Months are zero based
        var curr_year = date.getFullYear()
        let dateString = curr_year + "-" + curr_month + "-" + curr_date
        event.temporal_slices.map((slice) => {
          if (slice.level === "target_effective" || slice.level === "target_ineffective") {
            if (
              slice.type !== null &&
              event.timestamp <= parseInt(timeStamp[0]) &&
              event.timestamp >= parseInt(timeStamp[1])
            ) {
              let typeTarget = slice.level === "target_effective" ? "Effective" : "Ineffective"
              tData[dateString + "~" + typeTarget] = tData[dateString + "~" + typeTarget]
                ? tData[dateString + "~" + typeTarget] + parseInt(slice.type)
                : parseInt(slice.type)
            }
          }
        })
      })
      Object.keys(tData).forEach(function (key) {
        const keys = key.split("~")
        timelineData.push({ date: keys[0], count: tData[key], action: keys[1] })
      })
      let selfcareD = JSON.parse(JSON.stringify(selfcare))
      selfcareD.data.values = timelineData
      selfcareD.title = t(selfcareD.title)
      setSelfcareData(selfcareD)
    }
  }, [actionrange])

  return (
    <div className={classes.root}>
      <Grid container spacing={0}>
        <Grid item xs={12} sm={3} />
        <Grid item xs={12} sm={6}>
          <div className={classes.graphContainer}>
            <NativeSelect
              className={classes.selector}
              value={emotionrange}
              onChange={(event) => setEmotionrange(event.target.value)}
            >
              {dateArray.map((dateString) => (
                <option value={dateString.timestamp}>{dateString.date}</option>
              ))}
            </NativeSelect>
            {emotionsData !== null && <Vega spec={emotionsData} />}
            <div className={classes.separator} />
            <NativeSelect
              className={classes.selector}
              value={effectiverange}
              onChange={(event) => setEffectiverange(event.target.value)}
            >
              {dateArray.map((dateString) => (
                <option value={dateString.timestamp}>{dateString.date}</option>
              ))}
            </NativeSelect>
            {effectiveData !== null && <Vega spec={effectiveData} />}
            <div className={classes.separator} />
            <NativeSelect
              className={classes.selector}
              value={inEffectiverange}
              onChange={(event) => setInEffectiverange(event.target.value)}
            >
              {dateArray.map((dateString) => (
                <option value={dateString.timestamp}>{dateString.date}</option>
              ))}
            </NativeSelect>
            {ineffectiveData !== null && <Vega spec={ineffectiveData} />}
            <div className={classes.separator} />
            <Vega spec={actionsData} />
            <div className={classes.separator} />
            <NativeSelect
              className={classes.selector}
              value={actionrange}
              onChange={(event) => setActionrange(event.target.value)}
            >
              {dateArray.map((dateString) => (
                <option value={dateString.timestamp}>{dateString.date}</option>
              ))}
            </NativeSelect>
            {selfcareData !== null && <Vega spec={selfcareData} />}

            {selectedEvents.filter((event) => !!event.static_data.reason).length > 0 && (
              <Box display="flex" justifyContent="center" width={1} className={classes.graphContainer}>
                <div className={classes.separator} />
                <Box width={1} className={classes.graphSubContainer}>
                  <Typography variant="h5">Didn't use skills because...</Typography>
                  {selectedEvents.map(
                    (event) =>
                      !!event.static_data.reason && (
                        <Box className={classes.blueBoxStyle}>
                          <Typography variant="caption" gutterBottom>
                            {getDateString(new Date(event.timestamp))}
                          </Typography>
                          <Typography variant="body2" component="p">
                            {event.static_data.reason}
                          </Typography>
                        </Box>
                      )
                  )}
                </Box>
              </Box>
            )}

            {skillData !== null && (
              <Box display="flex" justifyContent="center" width={1} className={classes.graphContainer}>
                <div className={classes.separator} />
                <Box width={1} className={classes.graphSubContainer}>
                  <Typography variant="h5">Skills used:</Typography>

                  <NativeSelect
                    className={classes.selector}
                    value={skillRange}
                    onChange={(event) => setSkillRange(event.target.value)}
                  >
                    {dateArray.map((dateString) => (
                      <option value={dateString.timestamp}>{dateString.date}</option>
                    ))}
                  </NativeSelect>
                  <TableContainer>
                    <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                        <TableRow>
                          <TableCell align="center" colSpan={2}>
                            Skills
                          </TableCell>
                          {dateArray.map((column) => (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              style={{ top: 57, minWidth: column.minWidth }}
                            >
                              {column.date}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      {/* <TableBody>
          {skillData[key].map((detail) => (
              <Box width={1} className={classes.accordionContentSub}>
                {!!detail.category && <Typography variant="h6">{detail.category}</Typography>}
                <Typography variant="body2" component="span">
                  {detail.value}
                </Typography>
              </Box>
            ))}


            {skills.map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody> */}
                    </Table>
                  </TableContainer>

                  {Object.keys(skillData).map((key) => (
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<Icon>expand_more</Icon>}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography className={classes.heading}>{key}</Typography>
                      </AccordionSummary>
                      <AccordionDetails className={classes.accordionContent}>
                        {skillData[key].map((detail) => (
                          <Box width={1} className={classes.accordionContentSub}>
                            {!!detail.category && <Typography variant="h6">{detail.category}</Typography>}
                            <Typography variant="body2" component="span">
                              {detail.value}
                            </Typography>
                          </Box>
                        ))}
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              </Box>
            )}

            {selectedEvents.filter((event) => !!event.static_data.notes).length > 0 && (
              <Box display="flex" justifyContent="center" width={1} className={classes.graphContainer}>
                <div className={classes.separator} />
                <Box width={1} className={classes.graphSubContainer}>
                  <Typography variant="h5">Optional notes:</Typography>
                  {selectedEvents.map(
                    (event) =>
                      !!event.static_data.notes && (
                        <Box className={classes.blueBoxStyle}>
                          <Typography variant="caption" gutterBottom>
                            {getDateString(new Date(event.timestamp))}
                          </Typography>
                          <Typography variant="body2" component="p">
                            {event.static_data.notes}
                          </Typography>
                        </Box>
                      )
                  )}
                </Box>
              </Box>
            )}
          </div>
        </Grid>
      </Grid>
    </div>
  )
}
