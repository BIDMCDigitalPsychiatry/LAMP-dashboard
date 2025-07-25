import {
  Card,
  createStyles,
  makeStyles,
  Theme,
  Typography,
  Container,
  CircularProgress,
  Tooltip,
  Fab,
} from "@material-ui/core"
import ButtonBase from "@material-ui/core/ButtonBase"
import Grid from "@material-ui/core/Grid"
import Icon from "@material-ui/core/Icon"
import Box from "@mui/material/Box/Box"
import React, { useEffect } from "react"
import CheckCircleIcon from "@material-ui/icons/CheckCircle"
import ReactMarkdown from "react-markdown"
import { LinkRenderer } from "./ActivityPopup"
import ScratchCard from "../icons/ScratchCard.svg"
import InfoIcon from "../icons/Info.svg"
import VideoMeeting from "../icons/Video.svg"
import { ReactComponent as BreatheIcon } from "../icons/Breathe.svg"
import { ReactComponent as JournalIcon } from "../icons/Goal.svg"
import emoji from "remark-emoji"
import gfm from "remark-gfm"

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
      top: 15,
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
      padding: 8,
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
      paddingTop: "30px !important",
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

    progressDetails: {
      "& p": {
        fontSize: 15,
        [theme.breakpoints.down("xs")]: {
          fontSize: "14px",
        },
      },
    },
    arrowForword: {
      background: "#fff",
      boxShadow: "none",
      width: 48,
      height: 48,
      color: "#7599FF",
      [theme.breakpoints.down("sm")]: {
        width: 40,
        height: 40,
      },
      "& .material-icons": {
        [theme.breakpoints.down("sm")]: {
          fontSize: "1.2rem",
        },
      },
    },
    activityDialogeContainer: {
      display: "flex",
      justifyContent: "center",
      paddingTop: 100,
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
    activityDialogeHeader: {
      position: "fixed",
      background: "#fff",
      zIndex: 2,
      padding: "8px 8px 8px 80px",
      display: "flex",
      alignItems: "center",
    },
  })
)

const renderActivities = (type, tag, favorites, handleClickOpen, handleSubModule, classes, module) => {
  return (
    <>
      {module?.subActivities?.map((activity) =>
        !activity.isHidden ? (
          <>
            <Grid
              item
              xs={6}
              sm={4}
              md={3}
              lg={3}
              onClick={() => {
                if (
                  activity.spec === "lamp.module" &&
                  module.name != "Other activities" &&
                  module.name != "Unstarted modules"
                ) {
                  handleSubModule(activity)
                } else {
                  handleClickOpen(activity)
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

export default function ActivityListForModule({ ...props }) {
  const classes = useStyles()
  const {
    module,
    type,
    tag,
    favorites,
    handleClickOpen,
    handleSubModule,
    setSubModuleInLocalStorage,
    subModuleInLocalStorage,
  } = props
  // Function to get the status of the module
  const getStatus = (module) => {
    return module.name === "Other activities"
      ? ""
      : module.subActivities?.filter((activity) => activity.isCompleted === true).length +
          "/" +
          module.subActivities.length
  }
  // Function to calculate the percentage of completed sub-activities
  const getPercentage = (module) => {
    return (
      (module.subActivities?.filter((activity) => activity.isCompleted === true).length / module.subActivities.length) *
      100
    )
  }

  useEffect(() => {
    if (!!subModuleInLocalStorage && subModuleInLocalStorage?.length > 0) {
      const moduleData = module.subActivities.find((mod) => mod.id === subModuleInLocalStorage[0])
      if (moduleData) {
        handleSubModule(moduleData)
      }
      setTimeout(() => setSubModuleInLocalStorage(subModuleInLocalStorage.slice(1)), 1000)
    }
  }, [subModuleInLocalStorage])

  return (
    <>
      <Grid container spacing={0} className={classes.activityDialogeHeader}>
        {/* <Grid lg="auto" item>
          <Box className={classes.accordionHeadIcons}>sad</Box>
        </Grid> */}
        {module.name != "Other activities" && module.name != "Unstarted modules" ? (
          <Grid item>
            <Box display="flex" alignItems="center">
              <Typography variant="h6">{module.name}</Typography>
              <Fab className={classes.headerTitleIcon}>
                {(favorites || []).filter((f) => f?.id == module?.id).length > 0 && (
                  <Icon className={classes.favstar}>star_rounded</Icon>
                )}
              </Fab>
            </Box>
            <Box display="flex" alignItems="center" className={classes.progressDetails}>
              <CircularProgress
                variant="determinate"
                thickness={8}
                className={classes.progressCircle}
                value={getPercentage(module)}
              />
              <Typography variant="body1">
                {
                  <span>
                    <span>{getStatus(module)}</span> Sections Complete
                  </span>
                }
              </Typography>
            </Box>
          </Grid>
        ) : (
          <Grid item>
            <Box display="flex" alignItems="center" marginTop={1.5}>
              <Typography variant="h6">{module.name}</Typography>
            </Box>
          </Grid>
        )}
      </Grid>
      <Container fixed className={classes.activityDialogeContainer}>
        <Grid xl={10} container spacing={2}>
          <Grid container spacing={2} direction="row" wrap="wrap">
            {renderActivities(type, tag, favorites, handleClickOpen, handleSubModule, classes, module)}
          </Grid>
        </Grid>
      </Container>
    </>
  )
}
