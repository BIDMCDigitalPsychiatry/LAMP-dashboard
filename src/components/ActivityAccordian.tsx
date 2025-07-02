import React, { useEffect, useState } from "react"
import { Accordion, AccordionSummary, AccordionDetails, Grid } from "@mui/material"
import {
  Typography,
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
import VideoMeeting from "../icons/Video.svg"

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

    favstar: {
      position: "absolute",
      top: 24,
      left: 24,
      zIndex: 1,
      color: "#f9d801",
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
    accordionHeadIcons: {
      [theme.breakpoints.up("lg")]: {
        width: 80,
        height: 80,
      },
      [theme.breakpoints.down("sm")]: {
        width: 75,
        height: 75,
      },
      [theme.breakpoints.down("xs")]: {
        width: 65,
        height: 65,
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
      [theme.breakpoints.down("xs")]: {
        width: 65,
        height: 65,
      },
    },
    thumbMain: { maxWidth: 255, position: "relative" },
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
    accordionMain: {
      boxShadow: "none !important",
      background: "#f8f8f8 !important",
      borderRadius: "18px !important",
      marginBottom: 16,
      [theme.breakpoints.down("xs")]: {
        borderRadius: "12px !important",
        marginBottom: 8,
      },
      "& h6": {
        fontSize: 17,
        [theme.breakpoints.down("xs")]: {
          fontSize: 15,
          fontWeight: 500,
        },
        // "& span": {
        //   fontSize: 18,
        //   fontWeight: "normal",
        // },
      },
      "&::before": {
        display: "none",
      },
      "& .MuiAccordionSummary-root": {
        padding: "0 8px",
        "& .MuiAccordionSummary-expandIconWrapper": {
          "& svg": {
            fontSize: "2rem",
            [theme.breakpoints.down("xs")]: {
              fontSize: "1.5rem",
            },
          },
        },
      },
      "& .MuiAccordionSummary-content": {
        display: "block",
        margin: "8px 0",
        [theme.breakpoints.down("xs")]: {
          paddingLeft: 0,
        },
      },
      "&.Mui-expanded": {
        background: "#fff !important",
        boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.20) !important",
        marginTop: "0 !important",
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
      width: 34,
      height: 34,
      color: "#666",
      marginLeft: 8,
      [theme.breakpoints.down("xs")]: {
        width: 22,
        height: 22,
        minHeight: 22,
      },
      "& .material-icons": {
        fontSize: "1.7rem",
        [theme.breakpoints.down("xs")]: {
          fontSize: "1.3rem",
        },
      },
      "&:hover": {
        background: "#fff",
      },
      "&.active": {
        color: "#e3b303",
      },
    },
    progressCircle: {
      width: "18px !important",
      height: "18px !important",
      marginRight: "8px",
      [theme.breakpoints.down("xs")]: {
        width: "16px !important",
        height: "16px !important",
      },
      "&::after": {
        content: "''",
        position: "absolute",
        width: 18,
        height: 18,
        left: 0,
        top: 0,
        zIndex: -1,
        borderRadius: "50%",
        border: "4px solid #ccc",
        [theme.breakpoints.down("xs")]: {
          width: 16,
          height: 16,
          border: "3px solid #ccc",
        },
      },
    },
    progressDetails: {
      "& p": {
        fontSize: 15,
        [theme.breakpoints.down("xs")]: {
          fontSize: "14px",
        },
      },
    },
  })
)

//The function to renderActivities in accordian layout
const renderActivities = (
  activities,
  type,
  tag,
  favorites,
  handleClickOpen,
  handleSubModule,
  classes,
  module,
  status
) => {
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
                  if (
                    activity.spec === "lamp.module" &&
                    module.name != "Other activities" &&
                    module.name != "Unstarted Modules"
                  ) {
                    handleSubModule(activity, module.level)
                  } else {
                    handleClickOpen(activity)
                  }
                }
              }}
              className={classes.thumbMain}
            >
              {(favorites || []).filter((f) => f?.id == activity?.id).length > 0 && (
                <Icon className={classes.favstar}>star_rounded</Icon>
              )}
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
                          : activity?.spec === "lamp.zoom_meeting"
                          ? `url(${VideoMeeting}) center center/contain no-repeat`
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

  favorites,
  setFavorites,
}) => {
  const classes = useStyles()
  const { t } = useTranslation()
  const [activityStatus, setActivityStatus] = useState({}) // Store start status for each activity
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const getStatus = (module) => {
    return module.name === "Other activities"
      ? ""
      : module.subActivities?.filter((activity) => activity.isCompleted === true).length +
          "/" +
          module.subActivities.length
  }

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
      setFavorites(updatedTag)
    } catch (error) {
      console.error("Failed to toggle favorite:", error)
    }
  }
  return (
    <div>
      {data.map((module, index) => (
        <Accordion key={index} defaultExpanded className={classes.accordionMain}>
          {type != "activity" ? (
            <AccordionSummary expandIcon={<ExpandMoreIcon />} id={module.id}>
              <Typography variant="h6">
                <Grid container spacing={1}>
                  <Grid lg="auto" item>
                    <Box
                      className={classes.accordionHeadIcons}
                      style={{
                        margin: "auto",
                        background: tag.filter((x) => x.id === module?.id)[0]?.photo
                          ? `url(${tag.filter((x) => x.id === module?.id)[0]?.photo}) center center/contain no-repeat`
                          : `url(${InfoIcon}) center center/contain no-repeat`,
                      }}
                    ></Box>
                  </Grid>

                  <Grid item xs display="flex" alignItems="center" spacing={0}>
                    <Box>
                      <Box display="flex" alignItems="center">
                        <Typography variant="h6">{module.name}</Typography>
                        {module.name !== "Other activities" && module.name !== "Unstarted Modules" && (
                          <Tooltip
                            title={
                              favoriteIds.includes(module.id)
                                ? "Tap to remove from Favorite Activities"
                                : "Tap to add to Favorite Activities"
                            }
                          >
                            <Fab
                              className={`${classes.headerTitleIcon} ${
                                favoriteIds.includes(module.id) ? "active" : ""
                              }`}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleFavoriteClick(module.id)
                              }}
                            >
                              <Icon>star_rounded</Icon>
                            </Fab>
                          </Tooltip>
                        )}
                      </Box>
                      {module.name !== "Other activities" && module.name !== "Unstarted Modules" && (
                        <Grid display="flex" alignItems="center" className={classes.progressDetails}>
                          <CircularProgress
                            variant="determinate"
                            thickness={8}
                            className={classes.progressCircle}
                            value={70}
                          />
                          <Typography variant="body1">
                            {module?.trackProgress ? <span>{getStatus(module)}</span> : <></>} Sections Complete
                          </Typography>
                        </Grid>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Typography>
            </AccordionSummary>
          ) : (
            <Typography variant="h6" className={classes.moduleHeader}>
              <Box
                className={classes.mainIcons}
                style={{
                  margin: "auto",
                  background: tag.filter((x) => x.id === module?.id)[0]?.photo
                    ? `url(${tag.filter((x) => x.id === module?.id)[0]?.photo}) center center/contain no-repeat`
                    : `url(${InfoIcon}) center center/contain no-repeat`,
                }}
              ></Box>
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
              </Tooltip>
            </Typography>
          )}
          <AccordionDetails className={type == "activity" && classes.moduleContainer}>
            <Grid container spacing={2}>
              {module.subActivities.length ? (
                renderActivities(
                  module.subActivities,
                  type,
                  tag,
                  favorites,
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
                  <Box marginTop={3} display="flex" flexDirection="column">
                    <Accordion defaultExpanded className={classes.accordionMain}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />} id={module.id + ">" + activity.id}>
                        <Typography variant="h6">
                          <Grid container spacing={1}>
                            <Grid lg="auto" item>
                              <Box
                                className={classes.accordionHeadIcons}
                                style={{
                                  margin: "auto",
                                  background: tag.filter((x) => x.id === module?.id)[0]?.photo
                                    ? `url(${
                                        tag.filter((x) => x.id === module?.id)[0]?.photo
                                      }) center center/contain no-repeat`
                                    : `url(${InfoIcon}) center center/contain no-repeat`,
                                }}
                              ></Box>
                            </Grid>
                            <Grid item xs display="flex" alignItems="center" spacing={0}>
                              <Box display="flex" alignItems="center">
                                <Box>
                                  {activity.name}
                                  {activity.name !== "Other activities" && activity.name !== "Unstarted Modules" && (
                                    <Tooltip
                                      title={
                                        favoriteIds.includes(activity.id)
                                          ? "Tap to remove from Favorite Activities"
                                          : "Tap to add to Favorite Activities"
                                      }
                                    >
                                      <Fab
                                        className={`${classes.headerTitleIcon} ${
                                          favoriteIds.includes(activity.id) ? "active" : ""
                                        }`}
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleFavoriteClick(activity.id)
                                        }}
                                      >
                                        <Icon>star_rounded</Icon>
                                      </Fab>
                                    </Tooltip>
                                  )}
                                  {activity.name !== "Other activities" && activity.name !== "Unstarted Modules" && (
                                    <Grid display="flex" alignItems="center" className={classes.progressDetails}>
                                      <CircularProgress
                                        variant="determinate"
                                        thickness={8}
                                        className={classes.progressCircle}
                                        value={70}
                                      />
                                      <Typography variant="body1">
                                        {activity?.trackProgress ? <span>{getStatus(activity)}</span> : <></>} Sections
                                        Complete
                                      </Typography>
                                    </Grid>
                                  )}
                                </Box>
                              </Box>
                            </Grid>
                          </Grid>
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container spacing={2} direction="row" wrap="wrap">
                          {renderActivities(
                            activity.subActivities,
                            type,
                            tag,
                            favorites,
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
                                <Accordion defaultExpanded={true} className={classes.accordionMain}>
                                  <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    id={module.id + ">" + activity.id + ">" + subActivity.id}
                                  >
                                    <Typography variant="h6">
                                      <Grid container spacing={1}>
                                        <Grid lg="auto" item>
                                          <Box
                                            className={classes.accordionHeadIcons}
                                            style={{
                                              margin: "auto",
                                              background: tag.filter((x) => x.id === module?.id)[0]?.photo
                                                ? `url(${
                                                    tag.filter((x) => x.id === module?.id)[0]?.photo
                                                  }) center center/contain no-repeat`
                                                : `url(${InfoIcon}) center center/contain no-repeat`,
                                            }}
                                          ></Box>
                                        </Grid>

                                        <Grid item xs display="flex" alignItems="center" spacing={0}>
                                          <Box display="flex" alignItems="center">
                                            <Box>
                                              <Typography variant="h6">{subActivity.name}</Typography>
                                              {subActivity.name !== "Other activities" &&
                                                subActivity.name !== "Unstarted Modules" && (
                                                  <Tooltip
                                                    title={
                                                      favoriteIds.includes(subActivity.id)
                                                        ? "Tap to remove from Favorite Activities"
                                                        : "Tap to add to Favorite Activities"
                                                    }
                                                  >
                                                    <Fab
                                                      className={`${classes.headerTitleIcon} ${
                                                        favoriteIds.includes(subActivity.id) ? "active" : ""
                                                      }`}
                                                      onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleFavoriteClick(subActivity.id)
                                                      }}
                                                    >
                                                      <Icon>star_rounded</Icon>
                                                    </Fab>
                                                  </Tooltip>
                                                )}
                                            </Box>
                                            {subActivity.name !== "Other activities" &&
                                              subActivity.name !== "Unstarted Modules" && (
                                                <Grid
                                                  display="flex"
                                                  alignItems="center"
                                                  className={classes.progressDetails}
                                                >
                                                  <CircularProgress
                                                    variant="determinate"
                                                    thickness={8}
                                                    className={classes.progressCircle}
                                                    value={70}
                                                  />
                                                  <Typography variant="body1">
                                                    {subActivity?.trackProgress ? (
                                                      <span>{getStatus(subActivity)}</span>
                                                    ) : (
                                                      <></>
                                                    )}{" "}
                                                    Sections Complete
                                                  </Typography>
                                                </Grid>
                                              )}
                                          </Box>
                                        </Grid>
                                      </Grid>
                                    </Typography>
                                  </AccordionSummary>
                                  <AccordionDetails>
                                    <Grid container spacing={2} direction="row" wrap="wrap">
                                      {renderActivities(
                                        subActivity.subActivities,
                                        type,
                                        tag,
                                        favorites,
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
