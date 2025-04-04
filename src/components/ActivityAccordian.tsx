import React, { useEffect, useState } from "react"
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material"
import { Typography, Grid, Card, Box, ButtonBase, makeStyles, Theme, createStyles } from "@material-ui/core"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import ReactMarkdown from "react-markdown"
import emoji from "remark-emoji"
import gfm from "remark-gfm"
import { ReactComponent as BreatheIcon } from "../icons/Breathe.svg"
import { ReactComponent as JournalIcon } from "../icons/Goal.svg"
import ScratchCard from "../icons/ScratchCard.svg"
import InfoIcon from "../icons/Info.svg"
import { useTranslation } from "react-i18next"
import { LinkRenderer } from "./ActivityPopup"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cardlabel: {
      fontSize: 14,
      padding: "0 18px",
      bottom: 15,
      position: "absolute",
      width: "100%",
      height: "63px",
      overflow: "auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      [theme.breakpoints.down("sm")]: {
        fontSize: 13,
        padding: "0 5px",
        "& p": { marginBottom: "0", lineHeight: "16px" },
      },
      "& p": { margin: "0" },
    },
    scratch: {
      "& h2": {
        textAlign: "center !important",
      },
      "& h6": {
        textAlign: "center !important",
      },
    },
    dialogtitle: { padding: 0 },
    manage: {
      padding: "10px 0",
      minHeight: 180,
      textAlign: "center",
      boxShadow: "none",
      borderRadius: 18,
      position: "relative",
      width: "100%",
      "& svg": {
        [theme.breakpoints.up("lg")]: {
          width: 150,
          height: 150,
        },
      },

      [theme.breakpoints.up("lg")]: {
        minHeight: 240,
      },
    },
    submodule: {
      [theme.breakpoints.up("lg")]: {
        minHeight: 200,
      },
    },

    subIcons: {
      width: 70,
      height: 70,
      [theme.breakpoints.up("lg")]: {
        width: 110,
        height: 110,
      },
      [theme.breakpoints.down("sm")]: {
        width: 60,
        height: 60,
      },
    },
    mainIcons: {
      width: 80,
      height: 80,
      [theme.breakpoints.up("lg")]: {
        width: 130,
        height: 130,
      },
      [theme.breakpoints.down("sm")]: {
        width: 75,
        height: 75,
      },
    },
    thumbMain: { maxWidth: 255 },
    fullwidthBtn: { width: "100%" },
    blankMsg: {
      marginBottom: "15px",
      marginTop: "5px",
      "& path": { fill: "#666" },
      "& p": { margin: "2px 5px" },
    },
    assessH: {
      background: "#E7F8F2 !important",
    },
    learnH: {
      background: "#FFF9E5 !important",
    },
    manageH: {
      background: "#FFEFEC !important",
    },
    preventH: {
      background: "#ECF4FF !important",
    },
  })
)

function createSequentialArray(limit) {
  // Create an empty array
  let arr = []

  // Loop from 0 to limit-1 and push each number into the array
  for (let i = 0; i < limit; i++) {
    arr.push(i)
  }

  return arr
}

const ActivityAccordian = ({ data, type, tag, handleClickOpen, handleSubModule }) => {
  const classes = useStyles()
  const { t } = useTranslation()
  const [expandedModules, setExpandedModules] = useState([])

  useEffect(() => {
    if (data?.length) {
      setExpandedModules(createSequentialArray(data?.length))
    }
  }, [data])

  const accordionClicked = (index) => {
    if (expandedModules.includes(index)) setExpandedModules(expandedModules.filter((number) => number !== index))
    else setExpandedModules([...expandedModules, index])
  }

  return (
    <div>
      {data.map((module, index) => (
        <Accordion key={index} onChange={() => accordionClicked(index)} expanded={expandedModules.includes(index)}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{module.name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {module.subActivities.length ? (
                module.subActivities.map((activity) => (
                  <Grid
                    item
                    xs={6}
                    sm={4}
                    md={3}
                    lg={3}
                    onClick={() => {
                      if (index != data?.length - 1 && activity.spec === "lamp.module") {
                        handleSubModule(module, activity)
                      } else handleClickOpen(activity)
                    }}
                    className={classes.thumbMain}
                  >
                    <ButtonBase focusRipple className={classes.fullwidthBtn}>
                      <Card
                        className={
                          classes.manage +
                          " " +
                          (type === "Manage"
                            ? classes.manageH
                            : type === "Assess"
                            ? classes.assessH
                            : type === "Learn"
                            ? classes.learnH
                            : classes.preventH)
                        }
                      >
                        <Box mt={2} mb={1}>
                          <Box
                            className={classes.mainIcons}
                            style={{
                              margin: "auto",
                              background: tag.filter((x) => x.id === activity?.id)[0]?.photo
                                ? `url(${
                                    tag.filter((x) => x.id === activity?.id)[0]?.photo
                                  }) center center/contain no-repeat`
                                : activity.spec === "lamp.breathe"
                                ? `url(${BreatheIcon}) center center/contain no-repeat`
                                : activity.spec === "lamp.journal"
                                ? `url(${JournalIcon}) center center/contain no-repeat`
                                : activity.spec === "lamp.scratch_image"
                                ? `url(${ScratchCard}) center center/contain no-repeat`
                                : `url(${InfoIcon}) center center/contain no-repeat`,
                            }}
                          ></Box>
                        </Box>
                        <Typography className={classes.cardlabel}>
                          <ReactMarkdown
                            children={t(activity.name)}
                            skipHtml={false}
                            remarkPlugins={[gfm, emoji]}
                            components={{ link: LinkRenderer }}
                          />
                        </Typography>
                      </Card>
                    </ButtonBase>
                    {/* Nested Accordion for Sub-Modules */}
                    {activity.subModuleActivities && activity.subModuleActivities.length > 0 && (
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography>{activity.name}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2} direction="row" wrap="wrap">
                            {activity.subModuleActivities.length > 0 && (
                              <Grid justifyContent="flex-end" container direction="row">
                                <Grid xs={11}>
                                  <Grid container spacing={2}>
                                    {activity.subModuleActivities.length ? (
                                      activity.subModuleActivities.map((activity) => (
                                        <Grid
                                          item
                                          xs={6}
                                          sm={4}
                                          md={3}
                                          lg={3}
                                          onClick={() => {
                                            handleClickOpen(activity)
                                          }}
                                          className={classes.thumbMain}
                                        >
                                          <ButtonBase focusRipple className={classes.fullwidthBtn}>
                                            <Card
                                              className={
                                                classes.manage +
                                                " " +
                                                (type === "Manage"
                                                  ? classes.manageH + " " + classes.submodule
                                                  : type === "Assess"
                                                  ? classes.assessH + " " + classes.submodule
                                                  : type === "Learn"
                                                  ? classes.learnH + " " + classes.submodule
                                                  : classes.preventH + " " + classes.submodule)
                                              }
                                            >
                                              <Box mt={2} mb={1}>
                                                <Box
                                                  className={classes.subIcons}
                                                  style={{
                                                    margin: "auto",
                                                    background: tag.filter((x) => x.id === activity?.id)[0]?.photo
                                                      ? `url(${
                                                          tag.filter((x) => x.id === activity?.id)[0]?.photo
                                                        }) center center/contain no-repeat`
                                                      : activity.spec === "lamp.breathe"
                                                      ? `url(${BreatheIcon}) center center/contain no-repeat`
                                                      : activity.spec === "lamp.journal"
                                                      ? `url(${JournalIcon}) center center/contain no-repeat`
                                                      : activity.spec === "lamp.scratch_image"
                                                      ? `url(${ScratchCard}) center center/contain no-repeat`
                                                      : `url(${InfoIcon}) center center/contain no-repeat`,
                                                  }}
                                                ></Box>
                                              </Box>
                                              <Typography className={classes.cardlabel}>
                                                <ReactMarkdown
                                                  children={t(activity.name)}
                                                  skipHtml={false}
                                                  remarkPlugins={[gfm, emoji]}
                                                  components={{ link: LinkRenderer }}
                                                />
                                              </Typography>
                                            </Card>
                                          </ButtonBase>
                                        </Grid>
                                      ))
                                    ) : (
                                      <></>
                                    )}
                                  </Grid>
                                </Grid>
                              </Grid>
                            )}
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    )}
                  </Grid>
                ))
              ) : (
                <Box display="flex" className={classes.blankMsg} ml={1}>
                  <Typography>No activities available in the module</Typography>
                </Box>
              )}
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  )
}

export default ActivityAccordian
