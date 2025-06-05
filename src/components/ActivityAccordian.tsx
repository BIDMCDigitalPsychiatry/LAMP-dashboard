import React, { useEffect, useState } from "react"
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material"
import {
  Typography,
  Grid,
  Card,
  Box,
  ButtonBase,
  makeStyles,
  Theme,
  createStyles,
  Button,
  Backdrop,
  CircularProgress,
  Fab,
  Tooltip,
  Icon,
} from "@material-ui/core"
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
import { getActivityEvents } from "./ActivityBox"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"

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
        },
      },
      "&::before": {
        display: "none",
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
    moduleHeader: {
      position: "fixed",
      background: "#fff",
      width: "100%",
      zIndex: 1,
      padding: "15px 60px",
      left: 0,
      top: 0,
    },
    moduleContainer: {
      paddingTop: "60px !important",
    },
    headerTitleIcon: {
      background: "none",
      boxShadow: "none",
      width: 36,
      height: 36,
      color: "#666",
      marginLeft: 8,
      "& .material-icons": {
        fontSize: "2rem",
      },
      "&:hover": {
        background: "#fff",
      },
      "&.active": {
        color: "#e3b303",
      },
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
                  {activity?.isCompleted && module?.trackProgress && (
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
                        background: tag?.filter((x) => x.id === activity?.id)[0]?.photo
                          ? `url(${
                              tag?.filter((x) => x.id === activity?.id)[0]?.photo
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

//function to create collapsible layout when module activity is selected
const ActivityAccordion = ({
  data,
  type,
  tag,
  handleClickOpen,
  handleSubModule,
  participant,
  moduleForNotification,
  setIsParentModuleLoaded,
  updateModuleStartTime,
}) => {
  const classes = useStyles()
  const { t } = useTranslation()
  const [activityStatus, setActivityStatus] = useState({}) // Store start status for each activity
  const [statusLoaded, setStatusLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isFavoriteActive, setIsFavoriteActive] = useState(false)
  const [selectedActivityId, setSelectedActivityId] = useState()
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [expanded, setExpanded] = useState(false)
  const getStatus = (module) => {
    return module.name === "Other activities"
      ? ""
      : module.subActivities?.filter((activity) => activity.isCompleted === true).length +
          "/" +
          module.subActivities.length
  }

  const checkIsBegin = async (module) => {
    const activityEvents = await getActivityEvents(participant, module.id, module.startTime)
    return activityEvents.length === 0
  }

  const addActivityEventForModule = async (module, parentIds = []) => {
    const compositeKey = getCompositeKey(module, parentIds)
    if ((await checkIsBegin(module)) === true) {
      setLoading(true)
      LAMP.ActivityEvent.create(participant.id ?? participant, {
        timestamp: new Date().getTime(),
        duration: 0,
        activity: module.id,
        static_data: {},
      }).then((a) => {
        setActivityStatus((prevState) => ({
          ...prevState,
          [compositeKey]: true,
        }))
        updateModuleStartTime(module, new Date())
        setLoading(false)
      })
    } else {
      const hasBegun = true
      setActivityStatus((prevState) => ({
        ...prevState,
        [compositeKey]: hasBegun,
      }))
    }
  }

  const getCompositeKey = (module, parentIds = []) => {
    return [...parentIds, module.id].join(">")
  }

  const initializeStatus = async () => {
    setStatusLoaded(false)
    const statuses = {}
    const checkAndNotify = async (module, parentIds = []) => {
      const status = await checkIsBegin(module)
      const compositeKey = getCompositeKey(module, parentIds)
      statuses[compositeKey] = status
      if (moduleForNotification?.id != null && module.id === moduleForNotification?.id) {
        setIsParentModuleLoaded(true)
      }
    }
    const tasks = []
    for (const module of data?.filter((m) => m.name !== "Other activities")) {
      tasks.push(checkAndNotify(module))
      if (module?.subActivities) {
        for (const activity of module.subActivities) {
          if (activity.spec === "lamp.module") {
            tasks.push(checkAndNotify(activity, [module.id]))
          }
          if (activity?.subActivities) {
            for (const subActivity of activity.subActivities) {
              if (subActivity.spec === "lamp.module") {
                tasks.push(checkAndNotify(subActivity, [module.id, activity.id]))
              }
            }
          }
        }
      }
    }
    await Promise.all(tasks)
    setActivityStatus(statuses)
    return true
  }

  useEffect(() => {
    const status = initializeStatus()
    if (status) {
      setStatusLoaded(true)
    }
  }, [data])

  useEffect(() => {
    ;(async () => {
      let tag =
        [await LAMP.Type.getAttachment(participant?.id, "lamp.dashboard.favorite_activities")].map((y: any) =>
          !!y.error ? undefined : y.data
        )[0] ?? []
      setFavoriteIds(tag)
    })()
  }, [])

  const handleFavoriteClick = async (activityId: string) => {
    try {
      const result: any = await LAMP.Type.getAttachment(participant?.id, "lamp.dashboard.favorite_activities")
      let tag: string[] = !!result.error ? [] : result.data ?? []
      const isCurrentlyFavorite = tag.includes(activityId)
      let updatedTag
      if (isCurrentlyFavorite) {
        updatedTag = tag.filter((id) => id !== activityId)
      } else {
        updatedTag = [...tag, activityId]
      }
      await LAMP.Type.setAttachment(participant?.id, "me", "lamp.dashboard.favorite_activities", updatedTag)
      setFavoriteIds(updatedTag)
    } catch (error) {
      console.error("Failed to toggle favorite:", error)
    }
  }
  return (
    <div>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {data.map((module, index) => (
        <Accordion key={index} defaultExpanded className={classes.boxShadowNone}>
          {type != "activity" ? (
            <AccordionSummary expandIcon={<ExpandMoreIcon />} id={module.id}>
              <Typography variant="h6">
                {module.name}
                {module?.trackProgress ? <span>{getStatus(module)}</span> : <></>}
                {module.name !== "Other activities" && (
                  <Tooltip
                    title={
                      favoriteIds.includes(module.id)
                        ? "Tap to remove from Favorite Activities"
                        : "Tap to add to Favorite Activities"
                    }
                  >
                    <Fab
                      className={`${classes.headerTitleIcon} ${favoriteIds.includes(module.id) ? "active" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleFavoriteClick(module.id)
                      }}
                    >
                      <Icon>star_rounded</Icon>
                    </Fab>
                  </Tooltip>
                )}{" "}
              </Typography>
            </AccordionSummary>
          ) : (
            <Typography variant="h6" className={classes.moduleHeader}>
              {module.name} {module?.trackProgress ? <span>{getStatus(module)}</span> : <></>}
              <Tooltip
                title={
                  favoriteIds.includes(module.id)
                    ? "Tap to remove from Favorite Activities"
                    : "Tap to add to Favorite Activities"
                }
              >
                <Fab
                  className={`${classes.headerTitleIcon} ${favoriteIds.includes(module.id) ? "active" : ""}`}
                  onClick={() => handleFavoriteClick(module.id)}
                >
                  <Icon>star_rounded</Icon>
                </Fab>
              </Tooltip>{" "}
            </Typography>
          )}
          <AccordionDetails className={type == "activity" && classes.moduleContainer}>
            {statusLoaded && module.id && activityStatus[module.id] === true && (
              <Box className={classes.moduleStart}>
                Click here to start the module activity
                <Button variant="contained" onClick={() => addActivityEventForModule(module)}>{`${t("Start")}`}</Button>
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
                      <AccordionSummary id={module.id + ">" + activity.id}>
                        <Typography variant="h6">
                          {activity.name} {activity?.trackProgress ? <span>{getStatus(activity)}</span> : <></>}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {statusLoaded && activity.id && activityStatus[module.id + ">" + activity.id] && (
                          <Box className={classes.moduleStart}>
                            Click here to start the module activity
                            <Button
                              variant="contained"
                              onClick={() => addActivityEventForModule(activity, [module.id])}
                            >{`${t("Start")}`}</Button>
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
                                  <AccordionSummary id={module.id + ">" + activity.id + ">" + subActivity.id}>
                                    <Typography variant="h6">
                                      {subActivity.name}{" "}
                                      {subActivity?.trackProgress ? <span>{getStatus(subActivity)}</span> : <></>}
                                    </Typography>
                                  </AccordionSummary>
                                  <AccordionDetails>
                                    {statusLoaded &&
                                      subActivity.id &&
                                      activityStatus[module.id + ">" + activity.id + ">" + subActivity.id] && (
                                        <Box className={classes.moduleStart}>
                                          Click here to start the module activity
                                          <Button
                                            variant="contained"
                                            onClick={() =>
                                              addActivityEventForModule(subActivity, [module.id, activity.id])
                                            }
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
