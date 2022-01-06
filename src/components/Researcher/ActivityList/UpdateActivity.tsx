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
  makeStyles,
  Theme,
  createStyles,
  Backdrop,
  CircularProgress,
  Link,
} from "@material-ui/core"
import { useSnackbar } from "notistack"
import LAMP from "lamp-core"
import ResponsiveDialog from "../../ResponsiveDialog"
import { useTranslation } from "react-i18next"
import Activity from "./Activity"
import { updateActivityData, addActivity, spliceActivity } from "./ActivityMethods"
import { games } from "./Index"
import { Service } from "../../DBService/DBService"
import ConfirmationDialog from "../../ConfirmationDialog"

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

export default function UpdateActivity({ activity, activities, studies, setActivities, profile, ...props }) {
  const classes = useStyles()
  const { t } = useTranslation()
  const [gameDetails, setGameDetails] = useState(null)
  const [selectedActivity, setSelectedActivity] = useState(null)
  const { enqueueSnackbar } = useSnackbar()
  const [confirmationDialog, setConfirmationDialog] = useState(0)
  const [createDialogue, setcreateDialogue] = useState(true)
  const toBinary = (string) => {
    const codeUnits = new Uint16Array(string.length)
    for (let i = 0; i < codeUnits.length; i++) {
      codeUnits[i] = string.charCodeAt(i)
    }
  }
  const defaultBase64 = toBinary("data:image/png;base64,")
  const [loading, setLoading] = useState(false)

  // Begin an Activity object modification (ONLY DESCRIPTIONS).
  const modifyActivity = async () => {
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
      activity.spec === "lamp.group" ||
      activity.spec === "lamp.dbt_diary_card" ||
      activity.spec === "lamp.recording"
    ) {
      if (activity.spec === "lamp.breathe" && activity.settings.audio === null) {
        delete activity.settings.audio
      }
      let tag = [await LAMP.Type.getAttachment(activity.id, "lamp.dashboard.activity_details")].map((y: any) =>
        !!y.error ? undefined : y.data
      )[0]
      setGameDetails(tag)
    } else if (activity.spec === "lamp.tips") {
      activity.settings = activity.settings.reduce((ds, d) => {
        let newD = d
        if (d.image === "") {
          newD = Object.assign({}, d, { image: defaultBase64 })
        }
        return ds.concat(newD)
      }, [])
      let tag = [await LAMP.Type.getAttachment(activity.id, "lamp.dashboard.activity_details")].map((y: any) =>
        !!y.error ? undefined : y.data
      )[0]
      setGameDetails(tag)
    }
    setConfirmationDialog(0)
    setSelectedActivity(activity)
  }

  const confirmAction = (status: string) => {
    if (status === "Yes") {
      window.location.href = `/#/activity/${activity.id}`
    }
    setConfirmationDialog(0)
  }

  return (
    <span>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {!!profile ? (
        <Fab
          size="small"
          color="primary"
          classes={{ root: classes.btnWhite }}
          onClick={(event) => {
            setConfirmationDialog(3)
          }}
        >
          <Icon>mode_edit</Icon>
        </Fab>
      ) : (
        <Link href={`/#/activity/${activity.id}`} underline="none">
          <Icon>mode_edit</Icon>
        </Link>
      )}
      <ConfirmationDialog
        confirmationDialog={confirmationDialog}
        open={confirmationDialog > 0 ? true : false}
        onClose={() => setConfirmationDialog(0)}
        confirmAction={confirmAction}
        confirmationMsg={
          !!profile
            ? "Changes done to this activity will reflect for all the participants under the study. Are you sure you want to proceed?."
            : ""
        }
      />
    </span>
  )
}
