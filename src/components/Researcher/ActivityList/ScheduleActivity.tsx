import React, { useState } from "react"
import Box from "@material-ui/core/Box"
import IconButton from "@material-ui/core/IconButton"
import Icon from "@material-ui/core/Icon"
import Fab from "@material-ui/core/Fab"
import Dialog from "@material-ui/core/Dialog"
import DialogContent from "@material-ui/core/DialogContent"
import Tooltip from "@material-ui/core/Tooltip"

import makeStyles from "@material-ui/core/styles/makeStyles"
import createStyles from "@material-ui/core/styles/createStyles"
import { Theme } from "@material-ui/core/styles/createTheme" // TypeScript type

import { useTranslation } from "react-i18next"
import ActivityScheduler from "./ActivityScheduler"

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
      marginLeft: 10,
      "& svg": { marginRight: 8 },
      "&:hover": { color: "#5680f9", background: "#fff", boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.20)" },
    },
    tableContainer: {
      "& div.MuiInput-underline:before": { borderBottom: "0 !important" },
      "& div.MuiInput-underline:after": { borderBottom: "0 !important" },
      "& div.MuiInput-underline": {
        "& span.material-icons": {
          width: 21,
          height: 19,
          fontSize: 27,
          lineHeight: "23PX",
          color: "rgba(0, 0, 0, 0.4)",
        },
        "& button": { display: "none" },
      },
    },
    tagFiltered: {
      color: "#5784EE",
    },
  })
)
export default function ScheduleActivity({ activity, activities, setActivities, ...props }) {
  const classes = useStyles()
  const { t } = useTranslation()
  const [showScheduler, setShowScheduler] = useState(false)
  return (
    <span>
      <Tooltip title={t("Schedule activity")} arrow>
        <Fab
          size="small"
          color="primary"
          classes={{ root: classes.btnWhite }}
          onClick={() => {
            setShowScheduler(true)
          }}
        >
          <Icon>calendar_today</Icon>
        </Fab>
      </Tooltip>
      <Dialog
        fullWidth
        maxWidth="md"
        open={showScheduler}
        onClose={() => setShowScheduler(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <Box textAlign="right">
            <IconButton onClick={() => setShowScheduler(false)}>
              <Icon>close</Icon>
            </IconButton>
          </Box>
          <ActivityScheduler activity={activity} setActivities={setActivities} activities={activities} />
          {/* 
          Percentage settings section can be enabled by uncommenting this.
          {activity.spec === "lamp.survey" && <PercentageSettings activityId={activity.id} />} */}
        </DialogContent>
      </Dialog>
    </span>
  )
}
