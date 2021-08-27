import React, { useState } from "react"
import {
  Icon,
  IconButton,
  TableContainer,
  Paper,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Table,
  Box,
  Fab,
  makeStyles,
  createStyles,
  Theme,
} from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { updateSchedule } from "./ActivityMethods"
import ScheduleRow from "./ScheduleRow"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    btnBlue: {
      background: "#7599FF",
      borderRadius: "40px",
      minWidth: 100,
      boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.20)",
      lineHeight: "38px",
      cursor: "pointer",
      textTransform: "capitalize",
      fontSize: "16px",
      color: "#fff",
      position: "absolute",
      top: 25,
      "&:hover": { background: "#5680f9" },
      [theme.breakpoints.down("sm")]: {
        minWidth: "auto",
      },
    },
  })
)

export default function ActivityScheduler({ activity, activities, setActivities, ...props }) {
  const [activityData, setActivityData] = useState(activity ?? null)
  const [schedule, setSchedule] = useState(activity?.schedule ?? [])
  const [newRow, setNewRow] = useState(null)
  const { t } = useTranslation()
  const classes = useStyles()

  const updateActivitySchedule = async (x, index, type) => {
    if (type === "add") {
      setActivityData({ ...activityData, schedule: activity["schedule"].concat(x) })
    } else if (type == "edit") {
      let data = activityData
      data["schedule"][index] = x
      setActivityData({ ...activityData, schedule: data["schedule"] })
    } else if (type === "delete") {
      let item = schedule
      item.splice(index, 1)
      setActivityData({ ...activityData, schedule: item })
    }
    setNewRow(null)
    setSchedule(activityData["schedule"])
    updateSchedule(activityData)
    let data = activities
    data[index] = activityData
    setActivities(data)
  }

  const addRow = () => {
    if (newRow === null) {
      let x = schedule
      x.push({ start_date: null, time: null, custom_time: null, repeat_interval: null })
      setSchedule(x)
      setNewRow(x)
    }
  }

  return (
    <TableContainer component={Paper} elevation={0}>
      <Box mt={3}>
        <Fab variant="extended" color="primary" className={classes.btnBlue} onClick={() => addRow()}>
          <Icon>add</Icon> {t("Add")}
        </Fab>
      </Box>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>{t("Start date")}</TableCell>
            <TableCell>{t("Time")}</TableCell>
            <TableCell>{t("Repeat Interval")}</TableCell>
            <TableCell>{t("Custom Times")}</TableCell>
            <TableCell>{t("Actions")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(schedule || []).map((row, index) => (
            <ScheduleRow scheduleRow={row} index={index} updateActivitySchedule={updateActivitySchedule} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
