import React, { useState } from "react"
import {
  Box,
  IconButton,
  Icon,
  Fab,
  Dialog,
  DialogContent,
  makeStyles,
  Theme,
  createStyles,
  createMuiTheme,
} from "@material-ui/core"
import { useSnackbar } from "notistack"
import LAMP from "lamp-core"
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
  const { t, i18n } = useTranslation()
  const [showScheduler, setShowScheduler] = useState(false)
  return (
    <span>
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
        </DialogContent>
      </Dialog>
    </span>
  )
}
