import React, { useEffect, useState } from "react"
import { Accordion, AccordionSummary, AccordionDetails, Icon, Backdrop, CircularProgress } from "@mui/material"
import { Typography, Grid, Card, Box, ButtonBase, makeStyles, Theme, createStyles, Button } from "@material-ui/core"
import ReactMarkdown from "react-markdown"
import emoji from "remark-emoji"
import gfm from "remark-gfm"
import { ReactComponent as BreatheIcon } from "../icons/Breathe.svg"
import { ReactComponent as JournalIcon } from "../icons/Goal.svg"
import ScratchCard from "../icons/ScratchCard.svg"
import InfoIcon from "../icons/Info.svg"
import { useTranslation } from "react-i18next"
import { LinkRenderer } from "./ActivityPopup"
import CheckCircleIcon from "@material-ui/icons/CheckCircle"
import LAMP from "lamp-core"
import { getSelfHelpActivityEvents } from "./Participant"

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
    boxShadowNone: {
      boxShadow: "none !important",
      "& h6": {
        fontSize: 22,
        "& span": {
          fontSize: 18,
          fontWeight: "normal",
          paddingLeft: 8,
        },
      },
    },
    greentick: {
      "& svg": {
        width: 30,
        height: 30,
      },
    },
    moduleStart: {
      marginBottom: 40,
      "& button": {
        marginLeft: 24,
        backgroundColor: "#7599FF",
        color: "#fff",
      },
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
  })
)

//The function to renderActivities in accordian layout
const renderActivities = (activities, type, tag, handleClickOpen, handleSubModule, classes, module, status) => {
  return (
    <>
      {activities.map((activity) =>
        !activity.isHidden ? (
          <>
            <Grid
              item
              xs={6}
              sm={4}
              md={3}
              lg={3}
              onClick={() => {
                if (status === true) {
                  return
                } else {
                  if (activity.spec === "lamp.module" && module.name != "Other activities") {
                    handleSubModule(activity, module.level)
                  } else {
                    handleClickOpen(activity)
                  }
                }
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
                  {activity.isCompleted && module.trackProgress && (
                    <Box
                      sx={{
                        position: "absolute",
                        fontSize: "small",
                        top: 8,
                        right: 8,
                        zIndex: 1,
                        color: "#4caf50", // Green
                      }}
                      className={classes.greentick}
                    >
                      <CheckCircleIcon fontSize="small" />
                    </Box>
                  )}

                  <Box mt={2} mb={1}>
                    <Box
                      className={classes.mainIcons}
                      style={{
                        margin: "auto",
                        background: tag.filter((x) => x.id === activity?.id)[0]?.photo
                          ? `url(${tag.filter((x) => x.id === activity?.id)[0]?.photo}) center center/contain no-repeat`
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
                      children={activity.name}
                      skipHtml={false}
                      remarkPlugins={[gfm, emoji]}
                      components={{ link: LinkRenderer }}
                    />
                  </Typography>
                </Card>
              </ButtonBase>
            </Grid>
          </>
        ) : (
          <></>
        )
      )}
    </>
  )
}

const getActivityEvents = async (participant: any, activityId: string) => {
  let from = new Date()
  from.setMonth(from.getMonth() - 6)
  let activityEvents =
    LAMP.Auth._auth.id === "selfHelp@demo.lamp.digital"
      ? await getSelfHelpActivityEvents(activityId, from.getTime(), new Date().getTime())
      : await LAMP.ActivityEvent.allByParticipant(
          participant?.id ?? participant,
          activityId,
          from.getTime(),
          new Date().getTime(),
          null,
          true
        )
  return activityEvents
}

//function to create collapsible layout when module activity is selected
const ActivityAccordion = ({
  data,
  type,
  tag,
  handleClickOpen,
  handleSubModule,
  participant,
  activityStatus,
  setActivityStatus,
}) => {
  const classes = useStyles()
  const { t } = useTranslation()

  const getStatus = (module) => {
    return module.name === "Other activities"
      ? ""
      : module.subActivities.filter((activity) => activity.isCompleted === true).length +
          "/" +
          module.subActivities.length
  }

  const checkIsBegin = async (id) => {
    console.log("checkisbegin")
    const activityEvents = await getActivityEvents(participant, id)
    return activityEvents.length === 0
  }

  const addActivityEventForModule = async (id) => {
    if ((await checkIsBegin(id)) === true) {
      LAMP.ActivityEvent.create(participant.id ?? participant, {
        timestamp: new Date().getTime(),
        duration: 0,
        activity: id,
        static_data: {},
      })
      const hasBegun = false
      setActivityStatus((prevState) => ({
        ...prevState,
        [id]: hasBegun,
      }))
    }
  }

  useEffect(() => {
    const initializeStatus = async () => {
      // Pre-populate the status of all activities
      const statuses = {}
      const moduleActivities = data.filter((module) => module.name != "Other activities")
      for (const module of moduleActivities) {
        statuses[module.id] = await checkIsBegin(module.id)
        module?.subActivities?.forEach(async (activity) => {
          if (activity.spec === "lamp.module") {
            statuses[activity.id] = await checkIsBegin(activity.id)
          }
          activity?.subActivities?.forEach(async (subActivity) => {
            if (subActivity.spec === "lamp.module") {
              statuses[subActivity.id] = await checkIsBegin(subActivity.id)
            }
          })
        })
      }
      setActivityStatus(statuses)
    }
    initializeStatus()
  }, [])

  return (
    <div>
      {data.map((module, index) => (
        <Accordion key={index} defaultExpanded className={classes.boxShadowNone}>
          <AccordionSummary>
            <Typography variant="h6">
              {module.name} {module?.trackProgress ? <span>{getStatus(module)}</span> : <></>}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {module.id && activityStatus[module.id] && (
              <Box className={classes.moduleStart}>
                Click here to start the module activity
                <Button variant="contained" onClick={() => addActivityEventForModule(module.id)}>{`${t(
                  "Start"
                )}`}</Button>
              </Box>
            )}
            <Grid container spacing={2}>
              {module.subActivities.length ? (
                renderActivities(
                  module.subActivities,
                  type,
                  tag,
                  handleClickOpen,
                  handleSubModule,
                  classes,
                  module,
                  activityStatus[module.id]
                )
              ) : (
                <Box display="flex" className={classes.blankMsg} ml={1}>
                  <Typography>No activities available in the module</Typography>
                </Box>
              )}
            </Grid>
            {module.subActivities.map((activity) => (
              <>
                {activity.subActivities && activity.subActivities.length > 0 && (
                  <Box paddingLeft={5} display="flex" flexDirection="column">
                    <Accordion defaultExpanded={true} className={classes.boxShadowNone}>
                      <AccordionSummary>
                        <Typography variant="h6">
                          {activity.name} {activity?.trackProgress ? <span>{getStatus(activity)}</span> : <></>}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {activity.id && activityStatus[activity.id] && (
                          <Box className={classes.moduleStart}>
                            Click here to start the module activity
                            <Button variant="contained" onClick={() => addActivityEventForModule(activity.id)}>{`${t(
                              "Start"
                            )}`}</Button>
                          </Box>
                        )}
                        <Grid container spacing={2} direction="row" wrap="wrap">
                          {renderActivities(
                            activity.subActivities,
                            type,
                            tag,
                            handleClickOpen,
                            handleSubModule,
                            classes,
                            activity,
                            activityStatus[activity.id]
                          )}
                        </Grid>
                        {activity.subActivities.map((subActivity) => (
                          <>
                            {subActivity.subActivities && subActivity.subActivities.length > 0 && (
                              <Box paddingLeft={5} display="flex" flexDirection="column">
                                <Accordion defaultExpanded={true} className={classes.boxShadowNone}>
                                  <AccordionSummary>
                                    <Typography variant="h6">
                                      {subActivity.name}{" "}
                                      {subActivity?.trackProgress ? <span>{getStatus(subActivity)}</span> : <></>}
                                    </Typography>
                                  </AccordionSummary>
                                  <AccordionDetails>
                                    {subActivity.id && activityStatus[subActivity.id] && (
                                      <Box className={classes.moduleStart}>
                                        Click here to start the module activity
                                        <Button
                                          variant="contained"
                                          onClick={() => addActivityEventForModule(subActivity.id)}
                                        >{`${t("Start")}`}</Button>
                                      </Box>
                                    )}
                                    <Grid container spacing={2} direction="row" wrap="wrap">
                                      {renderActivities(
                                        subActivity.subActivities,
                                        type,
                                        tag,
                                        handleClickOpen,
                                        handleSubModule,
                                        classes,
                                        subActivity,
                                        activityStatus[subActivity.id]
                                      )}
                                    </Grid>
                                  </AccordionDetails>
                                </Accordion>
                              </Box>
                            )}
                          </>
                        ))}
                      </AccordionDetails>
                    </Accordion>
                  </Box>
                )}
              </>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  )
}

export default ActivityAccordion
