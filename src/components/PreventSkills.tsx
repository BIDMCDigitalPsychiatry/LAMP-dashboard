import React, { useEffect, useState } from "react"
import {
  Box,
  Icon,
  Typography,
  TableCell,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableContainer,
  makeStyles,
  Theme,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  createStyles,
  NativeSelect,
  Chip,
  FormControlLabel,
  Checkbox,
  Grid,
} from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { getDates, getDateVal } from "./PreventDBT"
import { getDateString } from "./PreventDBT"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
    graphContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      [theme.breakpoints.down("xs")]: {
        padding: "0 15px",
      },
      "& canvas": {
        [theme.breakpoints.down("xs")]: {
          maxWidth: "100%",
          height: "auto !important",
        },
      },
    },
    titleContainer: {
      display: "flex",
      width: 540,
      marginBottom: 40,
      justifyContent: "space-between",
    },
    separator: {
      border: "2px solid rgba(0, 0, 0, 0.1)",
      width: "100%",
      marginTop: 50,
      marginBottom: 50,
      height: 0,
      maxWidth: 540,
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
      [theme.breakpoints.down("xs")]: {
        marginRight: -150,
        marginBottom: -25,
      },
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
      maxWidth: 540,
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
    noData: {
      backgroundColor: "#A6A6A6",
    },
    mindfulness: {
      backgroundColor: "#D9E1F2",
    },
    Interpersonal: {
      backgroundColor: "#FCE4D6",
    },
    emotion: {
      backgroundColor: "#E2EFDA",
    },
    distress: {
      backgroundColor: "#FFF2CC",
    },
    categoryTitle: {
      fontSize: "16px",
      fontWeight: "bold",
      "& div.MuiAccordionSummary-content": {
        margin: "0",
      },
      "& td": { border: 0 },
      "& div.MuiAccordionDetails-root": {
        padding: "0",
      },
    },
    tableDiv: {
      display: "contents",
    },
    tableOuter: {
      maxWidth: 570,
      paddingTop: 10,
      [theme.breakpoints.up("md")]: {
        minWidth: "540px",
        width: "100%",
      },
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        minWidth: "300px",
      },
    },
    skillWidth: { maxWidth: "100px" },
    skillsContainer: {
      width: "100%",
      maxWidth: 570,
      "& h5": {
        fontWeight: 600,
      },
    },
    accSummary: { paddingLeft: 0, paddingRight: 0 },
    greentxt: { color: "#21a521" },
    colCheck: { borderLeft: "0.5px solid #f4f4f4" },
    colDate: { borderLeft: "0.5px solid #c4c4c4" },
    marginTop10: { marginTop: "10px" },
    checkboxLabel: {
      "& span.MuiFormControlLabel-label": { fontSize: "13.5px" },
    },
    tableResponsive: {
      maxWidth: "570px",
      overflow: "auto",
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        minWidth: "300px",
      },
      [theme.breakpoints.up("md")]: {
        minWidth: "540px",
        width: "100%",
      },
    },
  })
)

export default function PreventSkills({ selectedEvents, dateArray, dbtRange, setStorageData, storageData, ...props }) {
  const classes = useStyles()
  const { t } = useTranslation()
  const [skillData, setSkillData] = useState(null)
  const [expanded, setExpanded] = useState(false)
  const [expandedSkills, setExpandedSkills] = useState([])
  const [selectedDates, setSelectedDates] = useState(null)
  const [filterChecked, setFilterChecked] = useState(false)
  const [skillRange, setSkillRange] = useState(dateArray[0]?.timestamp ?? null)
  const data = [
    {
      title: `${t("Mindfulness")}`,
      data: [
        `${t("Wise Mind")}`,
        `${t("Observe: Just notice (Urge Surfing)")}`,
        `${t("Describe: Put words on")}`,
        `${t("Participate: Enter into the experience")}`,
        `${t("Nonjudgmental stance")}`,
        `${t("One-Mindfully: In-the-moment")}`,
        `${t("Effectiveness: Focus on what works")}`,
        `${t("Loving Kindness: Build compassion")}`,
      ],
    },
    {
      title: `${t("Interpersonal")}`,
      data: [
        `${t("Objective effectiveness: DEAR MAN")}`,
        `${t("Relationship effectiveness: GIVE")}`,
        `${t("Self-respect effectiveness: FAST")}`,
        `${t("Validating Others")}`,
        `${t("Self-Validation")}`,
        `${t("Behavior change: reinforce/extinguish")}`,
        `${t("Mindfulness of others")}`,
        `${t("Find others and get them to like you")}`,
        `${t("End relationships")}`,
      ],
    },
    {
      title: `${t("Emotion Regulation")}`,
      data: [
        `${t("Check the Facts to change emotions")}`,
        `${t("Opposite Action to change emotions")}`,
        `${t("Problem Solving to change emotions")}`,
        `${t("Accumulate positive emotions")}`,
        `${t("Build Mastery")}`,
        `${t("Cope Ahead")}`,
        `${t("PLEASE: Take care of your body")}`,
      ],
    },
    {
      title: `${t("Distress Tolerance")}`,
      data: [
        `${t("STOP Skill")}`,
        `${t("Pros and Cons of acting on urges")}`,
        `${t("TIP: Change body chemistry")}`,
        `${t("Paired Muscle Relaxation")}`,
        `${t("Effective Rethinking/Paired Relax")}`,
        `${t("Distracting: Wise Mind ACCEPTS")}`,
        `${t("Self-Soothing")}`,
        `${t("Body Scan Meditation")}`,
        `${t("IMPROVE the Moment")}`,
        `${t("Sensory Awareness")}`,
        `${t("Radical Acceptance")}`,
        `${t("Turning the Mind")}`,
        `${t("Replace Willfulness with Willingness")}`,
        `${t("Half-Smiling and Willing Hands")}`,
        `${t("Dialectical Abstinence")}`,
        `${t("Alternate Rebellion / Adaptive Denial")}`,
      ],
    },
  ]

  useEffect(() => {
    if (!!skillRange) {
      setStorageData({ ...storageData, skill: skillRange })
      let skillData = []
      let timeStamp = skillRange.split("-")
      selectedEvents.map((event) => {
        let date = new Date(event.timestamp)
        var curr_date = date.getDate().toString().padStart(2, "0")
        var curr_month = (date.getMonth() + 1).toString().padStart(2, "0") //Months are zero based
        event.temporal_slices.map((slice) => {
          if (
            slice.level === "skill" &&
            event.timestamp <= parseInt(timeStamp[0]) &&
            event.timestamp >= parseInt(timeStamp[1])
          ) {
            !!skillData[slice.item]
              ? skillData[slice.item].push(curr_month + "/" + curr_date)
              : (skillData[slice.item] = [curr_month + "/" + curr_date])
          }
        })
      })

      let dates = getDates(timeStamp[1], timeStamp[0])
      let selDates = []
      dates.map((date) => {
        selDates.push(
          (getDateVal(date).getMonth() + 1).toString().padStart(2, "0") +
            "/" +
            getDateVal(date).getDate().toString().padStart(2, "0")
        )
      })
      setSelectedDates(selDates)
      setSkillData(skillData)
    }
  }, [skillRange])

  const handleExpansion = (key) => {
    let data = expandedSkills
    let index = data.indexOf(key)
    if (index >= 0) {
      data.splice(index, 1)
    } else {
      data.push(key)
    }
    setExpanded(data.length > 0)
    setExpandedSkills([...data])
  }

  useEffect(() => {
    setStorageData({ ...storageData, skill: dbtRange })
    setSkillRange(dbtRange)
  }, [dbtRange])

  useEffect(() => {
    if (!!storageData && storageData.skill) setSkillRange(storageData.skill)
  }, [storageData])

  return (
    <Box>
      {skillData !== null && (
        <Box display="flex" justifyContent="center" width={1} className={classes.graphContainer}>
          <div className={classes.separator} />
          <div style={{ width: "100%" }} className={classes.skillsContainer}>
            <Box sx={{ display: "flex" }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h5">Skills used:</Typography>
              </Box>
              <Box>
                <NativeSelect
                  value={skillRange}
                  onChange={(event) => {
                    setSkillRange(event.target.value)
                  }}
                >
                  {dateArray.map((dateString) => (
                    <option value={dateString.timestamp}>{dateString.date}</option>
                  ))}
                </NativeSelect>
              </Box>
            </Box>
          </div>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className={classes.marginTop10}
          >
            <Grid>
              <Chip
                label={expanded ? "Collapse All" : "Expand All"}
                onClick={(evt) => {
                  setExpanded(!expanded)
                  setExpandedSkills([0, 1, 2, 3])
                }}
                icon={expanded ? <Icon>expand_less</Icon> : <Icon>expand_more</Icon>}
                variant="outlined"
              />
            </Grid>
            <Grid>
              <FormControlLabel
                className={classes.checkboxLabel}
                control={
                  <Checkbox
                    checked={filterChecked}
                    onChange={(evt) => setFilterChecked(!filterChecked)}
                    name="skillset"
                  />
                }
                label="Show Only Skills Used"
              />
            </Grid>
          </Grid>
          <TableContainer className={classes.tableOuter}>
            {data.map((v, kv) => {
              return (
                <div className={classes.tableDiv}>
                  <Accordion
                    expanded={expanded && expandedSkills.includes(kv)}
                    onChange={(evt, exp) => {
                      handleExpansion(kv)
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<Icon>expand_more</Icon>}
                      aria-controls="panel1a-content"
                      id="panael1a-header"
                      className={
                        classes.categoryTitle +
                        " " +
                        (kv === 0
                          ? classes.mindfulness
                          : kv === 1
                          ? classes.Interpersonal
                          : kv === 2
                          ? classes.emotion
                          : classes.distress)
                      }
                    >
                      <TableRow>
                        <TableCell colSpan={9}>{v.title}</TableCell>
                      </TableRow>
                    </AccordionSummary>
                    <AccordionDetails className={classes.accSummary}>
                      <div className={classes.tableResponsive}>
                        <Table>
                          <TableHead>
                            {(v.data.filter((each) => !!skillData[each]).length > 0 && filterChecked) ||
                            !filterChecked ? (
                              <TableRow>
                                <TableCell className={classes.skillWidth}>Skills</TableCell>
                                {selectedDates.map((date) => (
                                  <TableCell className={classes.colDate}>{date}</TableCell>
                                ))}
                              </TableRow>
                            ) : (
                              <TableRow>
                                <TableCell className={classes.skillWidth} colSpan={selectedDates.length + 1}>
                                  No records found
                                </TableCell>
                              </TableRow>
                            )}
                          </TableHead>
                          <TableBody>
                            {((!!skillData[v.data[0]] && filterChecked) || !filterChecked) && (
                              <TableRow>
                                <TableCell
                                  className={
                                    classes.skillWidth +
                                    " " +
                                    (!!skillData[v.data[0]]
                                      ? kv === 0
                                        ? classes.mindfulness
                                        : kv === 1
                                        ? classes.Interpersonal
                                        : kv === 2
                                        ? classes.emotion
                                        : classes.distress
                                      : classes.noData)
                                  }
                                >
                                  {v.data[0]}
                                </TableCell>
                                {selectedDates.map((d) => (
                                  <TableCell
                                    className={
                                      classes.colCheck +
                                      " " +
                                      (!!skillData[v.data[0]]
                                        ? kv === 0
                                          ? classes.mindfulness
                                          : kv === 1
                                          ? classes.Interpersonal
                                          : kv === 2
                                          ? classes.emotion
                                          : classes.distress
                                        : classes.noData)
                                    }
                                  >
                                    {skillData[v.data[0]]?.includes(d) ? (
                                      <Icon className={classes.greentxt}>check</Icon>
                                    ) : null}
                                  </TableCell>
                                ))}
                              </TableRow>
                            )}
                            {v.data.map(
                              (k, key) =>
                                ((!!skillData[k] && filterChecked) || !filterChecked) &&
                                key !== 0 && (
                                  <TableRow
                                    className={
                                      !!skillData[k]
                                        ? kv === 0
                                          ? classes.mindfulness
                                          : kv === 1
                                          ? classes.Interpersonal
                                          : kv === 2
                                          ? classes.emotion
                                          : classes.distress
                                        : classes.noData
                                    }
                                  >
                                    <TableCell className={classes.skillWidth}>{k}</TableCell>
                                    {selectedDates.map((d) => (
                                      <TableCell className={classes.colCheck}>
                                        {skillData[k]?.includes(d) ? (
                                          <Icon className={classes.greentxt}>check</Icon>
                                        ) : null}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                )
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </AccordionDetails>
                  </Accordion>
                </div>
              )
            })}
          </TableContainer>
        </Box>
      )}
    </Box>
  )
}
