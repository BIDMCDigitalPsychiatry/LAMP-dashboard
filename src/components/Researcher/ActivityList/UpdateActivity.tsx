import React, { useState } from "react"
import {
  Box,
  IconButton,
  Icon,
  AppBar,
  Toolbar,
  Divider,
  Fab,
  Typography,
  Backdrop,
  CircularProgress,
} from "@material-ui/core"
import { useSnackbar } from "notistack"
import LAMP from "lamp-core"
import ResponsiveDialog from "../../ResponsiveDialog"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import { useTranslation } from "react-i18next"
import Activity from "./Activity"
import { updateActivityData, addActivity, spliceActivity } from "./ActivityMethods"
import { games } from "./Index"
import { Service } from "../../DBService/DBService"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    btnWhite: {
      background: "#fff",
      borderRadius: "40px",
      boxShadow: "none",
      cursor: "pointer",
      textTransform: "capitalize",
      fontSize: "14px",
      color: "#7599FF",
      "& svg": { marginRight: 8 },
      "&:hover": { color: "#5680f9", background: "#fff", boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.20)" },
    },
    toolbardashboard: {
      minHeight: 100,
      padding: "0 10px",
      "& h5": {
        color: "rgba(0, 0, 0, 0.75)",
        textAlign: "left",
        fontWeight: "600",
        fontSize: 30,
        width: "calc(100% - 96px)",
      },
    },
    backdrop: {
      zIndex: 111111,
      color: "#fff",
    },
  })
)

export default function UpdateActivity({ activity, activities, studies, setActivities, ...props }) {
  const classes = useStyles()
  const { t } = useTranslation()
  const [gameDetails, setGameDetails] = useState(null)
  const [selectedActivity, setSelectedActivity] = useState(null)
  const { enqueueSnackbar } = useSnackbar()
  // Commit an update to an Activity object (ONLY DESCRIPTIONS).
  const updateActivity = async (x, isDuplicated) => {
    let result = await updateActivityData(x, isDuplicated, selectedActivity)
    if (!!result.error)
      enqueueSnackbar(t("Encountered an error: ") + result?.error, {
        variant: "error",
      })
    else {
      if (isDuplicated || (!x.id && x.name)) {
        x["id"] = result.data
        addActivity(x, studies)
        enqueueSnackbar(t("Successfully duplicated the Activity."), {
          variant: "success",
        })
      } else {
        x["study_id"] = x.studyID
        x["study_name"] = studies.filter((study) => study.id === x.studyID)[0]?.name
        delete x["studyID"]
        Service.updateMultipleKeys("activities", { activities: [x] }, Object.keys(x), "id")
        enqueueSnackbar(t("Successfully updated the Activity."), {
          variant: "success",
        })
      }
      setActivities()
    }
    setSelectedActivity(undefined)
  }
  // Begin an Activity object modification (ONLY DESCRIPTIONS).
  const modifyActivity = async (activity) => {
    let data = await LAMP.Activity.view(activity.id)
    activity.settings = data.settings
    if (activity.spec === "lamp.survey") {
      let tag = [await LAMP.Type.getAttachment(activity.id, "lamp.dashboard.survey_description")].map((y: any) =>
        !!y.error ? undefined : y.data
      )[0]
      activity = spliceActivity({ raw: activity, tag: tag })
      setGameDetails(tag)
    } else if (
      games.includes(activity.spec) ||
      activity.spec === "lamp.journal" ||
      activity.spec === "lamp.scratch_image" ||
      activity.spec === "lamp.breathe" ||
      activity.spec === "lamp.group"
    ) {
      let tag = [await LAMP.Type.getAttachment(activity.id, "lamp.dashboard.activity_details")].map((y: any) =>
        !!y.error ? undefined : y.data
      )[0]
      setGameDetails(tag)
    }
    setSelectedActivity(activity)
  }
  return (
    <span>
      <Fab
        size="small"
        color="primary"
        classes={{ root: classes.btnWhite }}
        onClick={(event) => modifyActivity(activity)}
      >
        <Icon>mode_edit</Icon>
      </Fab>
      <ResponsiveDialog
        fullScreen
        transient={false}
        animate
        open={!!selectedActivity}
        onClose={() => {
          setSelectedActivity(undefined)
        }}
      >
        <AppBar position="static" style={{ background: "#FFF", boxShadow: "none" }}>
          <Toolbar className={classes.toolbardashboard}>
            <IconButton onClick={() => setSelectedActivity(undefined)} color="default" aria-label="Menu">
              <Icon>arrow_back</Icon>
            </IconButton>
            <Typography variant="h5">{t("Modify an existing activity")}</Typography>
          </Toolbar>
        </AppBar>
        <Divider />
        <Box py={8} px={4}>
          <Activity
            allActivities={activities}
            activity={selectedActivity}
            onSave={updateActivity}
            studies={studies}
            details={gameDetails}
            onCancel={() => {
              setSelectedActivity(undefined)
            }}
          />
        </Box>
      </ResponsiveDialog>
    </span>
  )
}
