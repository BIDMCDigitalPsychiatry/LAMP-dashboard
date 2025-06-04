// Core Imports
import React, { useEffect, useState } from "react"
import {
  makeStyles,
  Box,
  Icon,
  Typography,
  Backdrop,
  AppBar,
  Toolbar,
  IconButton,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Button,
} from "@material-ui/core"
import LAMP from "lamp-core"
import Streak from "./Streak"
import EmbeddedActivity from "./EmbeddedActivity"
import { getEvents } from "./Participant"
import { useTranslation } from "react-i18next"
import GroupActivity from "./GroupActivity"
import { spliceActivity, spliceCTActivity } from "./Researcher/ActivityList/ActivityMethods"
import { Service } from "./DBService/DBService"
import VisualPopup from "./VisualPopup"
import ModuleActivity from "./ModuleActivity"
import ResponsiveDialog from "./ResponsiveDialog"
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: 20,
  },
  ribbonText: {
    fontSize: "16px",
    color: "rgba(0, 0, 0, 0.75)",
    fontWeight: 600,
    marginBottom: "30px",
    padding: "0 42px",
  },
  niceWork: {
    marginTop: "20%",
    "& h5": { fontSize: 25, fontWeight: 600, color: "rgba(0, 0, 0, 0.75)" },
  },
  toolbardashboard: {
    minHeight: 65,
    [theme.breakpoints.up("md")]: {
      paddingTop: "0 !important",
      width: "100%",
      maxWidth: "100% !important",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "0 16px !important",
    },
    "& h5": {
      color: "rgba(0, 0, 0, 0.75)",
      textAlign: "center",
      fontWeight: "600",
      fontSize: 18,
      width: "100%",
      textTransform: "capitalize",
    },
  },
  inlineHeader: {
    background: "#FFFFFF",
    boxShadow: "none",
    "& h5": {
      fontSize: 25,
      paddingLeft: 20,
      color: "rgba(0, 0, 0, 0.75)",
      fontWeight: 600,
      lineHeight: "47px",
      textAlign: "left",
      [theme.breakpoints.down("sm")]: {
        paddingLeft: 16,
        lineHeight: "normal",
      },
    },
  },
  dialogueStyle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  dialogueCurve: { borderRadius: 10, maxWidth: 400 },
  MuiDialogPaperScrollPaper: {
    maxHeight: "100% !important",
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  niceWorkbadge: { position: "relative" },
  dayNotification: {
    position: "absolute",
    top: 0,
    width: "100%",
    paddingTop: 50,
    "& h4": { fontSize: 40, fontWeight: 700, color: "#00765C", lineHeight: "38px" },
    "& h6": { color: "#00765C", fontSize: 16, fontWeight: 600 },
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}))

export default function NotificationPage({ participant, activityId, mode, tab, ...props }) {
  const classes = useStyles()
  const [activity, setActivity] = useState(null)
  const [openComplete, setOpenComplete] = React.useState(false)
  const [streak, setStreak] = useState(1)
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()
  const [response, setResponse] = useState(false)
  const [streakActivity, setStreakActivity] = useState(null)
  const [openNotFound, setOpenNotFound] = useState(false)
  const [tag, setTag] = useState(null)
  const [visualPopup, setVisualPopup] = useState(null)
  const [staticData, setStaticData] = useState(0)

  useEffect(() => {
    console.log(activityId)
    setLoading(true)
    setResponse(false)
    ;(async () => {
      if (!!activityId) {
        LAMP.Activity.view(activityId)
          .then((data: any) => {
            if (!!data) {
              Service.getUserDataByKey("activitytags", [activityId], "id").then((tags) => {
                setTag(tags[0])
                const tag = tags[0]
                data =
                  data.spec === "lamp.survey"
                    ? spliceActivity({ raw: data, tag })
                    : spliceCTActivity({ raw: data, tag })
                setActivity(data)
                setLoading(false)
              })
            } else {
              setOpenNotFound(true)
              setLoading(false)
            }
          })
          .catch((e) => {
            console.log(e)
            setOpenNotFound(true)
            setLoading(false)
          })
      }
    })()
  }, [activityId])

  const [moduleActivity, setModuleActivity] = useState("")
  const [open, setOpen] = useState(false)

  useEffect(() => {
    console.log(tab)
  }, [tab])
  const returnResult = () => {
    const activityFromModule = localStorage.getItem("activityFromModule")
    console.log(tab, activityFromModule, mode)

    if (mode === null) setResponse(true)
    else if (mode === "responseActivity") {
      const surveyId = localStorage.getItem("SurveyId")
      window.location.href = `/#/participant/${participant}/activity/${surveyId}?mode=dashboard`
      localStorage.removeItem("SurveyId")
    } else if (!!activityFromModule && !!tab) {
      setModuleActivity(activityFromModule)
      setOpen(true)
    } else if (tab === null || typeof tab === "undefined")
      window.location.href = `/#/participant/${participant}/assess `
    else if (!!tab) {
      window.location.href = `/#/participant/${participant}/${tab}`
    }
  }

  const showStreak = (participant, activity) => {
    setLoading(true)
    setVisualPopup(null)
    setStreakActivity(tag?.streak ?? null)
    if (!!tag?.streak?.streak || typeof tag?.streak === "undefined") {
      getEvents(participant, activity.id).then((streak) => {
        setStreak(streak)
        setOpenComplete(true)
        setTimeout(() => {
          setOpenComplete(false)
          returnResult()
          setLoading(false)
        }, 5000)
      })
    } else {
      returnResult()
      setLoading(false)
    }
  }

  const showVisualPopup = (activity) => {
    Service.getUserDataByKey("activitytags", [activity?.id], "id").then((tags) => {
      const tag = tags[0]
      if (
        typeof tag?.visualSettings !== "undefined" &&
        tag?.visualSettings != null &&
        tag?.visualSettings?.image !== ""
      ) {
        setVisualPopup(tag?.visualSettings)
      } else {
        showStreak(participant, activity)
      }
    })
  }

  return (
    <div style={{ height: "100%" }}>
      {!!response && (
        <Box>
          <AppBar position="static" className={classes.inlineHeader}>
            <Toolbar className={classes.toolbardashboard}>
              <IconButton onClick={() => (window.location.href = "/#/")} color="default" aria-label="Menu">
                <Icon>arrow_back</Icon>
              </IconButton>
            </Toolbar>
          </AppBar>
          <Box textAlign="center" pb={4} className={classes.niceWork}>
            <Typography variant="h5" gutterBottom>
              {`${t("Success.")}` + "!"}
            </Typography>
            <Typography className={classes.ribbonText} component="p">
              {`${t("You have successfully completed your activity.")}`}
            </Typography>
            <Box textAlign="center" className={classes.niceWorkbadge}>
              <Icon>check_circle</Icon>
            </Box>
          </Box>
        </Box>
      )}
      {!response &&
        !loading &&
        (activity?.spec === "lamp.group" || activity?.spec === "lamp.module" ? (
          <GroupActivity
            activity={activity}
            participant={participant}
            onComplete={(data) => {
              showStreak(participant, activity)
            }}
            noBack={false}
            tab={tab}
          />
        ) : (
          <EmbeddedActivity
            name={activity?.name}
            activity={activity}
            participant={participant}
            noBack={false}
            tab={tab}
            onComplete={(data) => {
              setStaticData(data?.static_data ?? {})
              if (data === null) {
                if (mode === null) window.location.href = "/#/"
                else history.back()
              } else if (!!data && !!data?.timestamp) {
                showVisualPopup(activity)
              }
            }}
          />
        ))}
      <Streak
        open={openComplete}
        onClose={() => {
          setOpenComplete(false)
          returnResult()
          setLoading(false)
        }}
        popupClose={() => {
          setOpenComplete(false)
          setLoading(true)
        }}
        streak={streak}
        activity={streakActivity}
      />
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Dialog
        open={openNotFound}
        onClose={() => {
          setOpenNotFound(false)
          window.location.href = "/#/"
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>{t("Some error occured. This activity does not exist.")}</DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setLoading(false)
              setOpenNotFound(false)
              history.back()
            }}
            color="primary"
          >
            {`${t("Ok")}`}
          </Button>
        </DialogActions>
      </Dialog>
      <VisualPopup
        open={visualPopup?.checked ?? false}
        image={visualPopup?.image}
        data={staticData}
        showStreak={() => showStreak(participant, activity)}
      />
      <ResponsiveDialog
        open={!!open}
        transient={activity?.spec === "lamp.module"}
        animate
        fullScreen
        onClose={() => setOpen(false)}
      >
        <ModuleActivity type="activity" moduleId={moduleActivity} participant={participant} />
      </ResponsiveDialog>
    </div>
  )
}
