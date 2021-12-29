import React, { useEffect, useState } from "react"
import {
  MenuItem,
  Icon,
  IconButton,
  TableCell,
  TableRow,
  Select,
  Button,
  FormControl,
  FormHelperText,
  makeStyles,
  Theme,
  createStyles,
} from "@material-ui/core"
import { KeyboardDatePicker, KeyboardTimePicker } from "@material-ui/pickers"
import { useTranslation } from "react-i18next"
import InlineMenu from "./InlineMenu"
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    datePicker: {
      "& div": { paddingRight: 0, maxWidth: 175 },
    },
  })
)

export const getDate = (val) => {
  if (val.length > 0) {
    const newDate = new Date(val.substr(0, 10))
    newDate.setHours(val.substr(11, 2))
    newDate.setMinutes(val.substr(14, 2))
    newDate.setSeconds(0)
    return newDate
  }
  return new Date()
}

export const manyDates = (items) =>
  items?.length > 0
    ? items
        ?.slice(0, 3)
        .map((x) => getDate(x).toLocaleString("en-US", Date.formatStyle("timeOnly")))
        .join(", ") + (items?.length > 3 ? ", ..." : "")
    : "No custom times"

export const dateInUTCformat = (val) => {
  const dateVal =
    val.getFullYear() +
    "-" +
    (val.getMonth() + 1) +
    "-" +
    val.getDate() +
    "T" +
    (val.getHours() > 9 ? val.getHours() : "0" + val.getHours()) +
    ":" +
    (val.getMinutes() > 9 ? val.getMinutes() : "0" + val.getMinutes()) +
    ":" +
    (val.getSeconds() > 9 ? val.getSeconds() : "0" + val.getSeconds()) +
    ".000Z"
  return dateVal
}

export default function ScheduleRow({
  scheduleRow,
  index,
  updateActivitySchedule,
  ...props
}: {
  scheduleRow: any
  index: number
  updateActivitySchedule: Function
}) {
  const classes = useStyles()
  const [isEdit, setEdit] = useState(!!scheduleRow.start_date ? false : true)
  const { t } = useTranslation()
  const [data, setData] = useState(scheduleRow)
  const intervals = [
    { key: "hourly", value: t("Every hour") },
    { key: "every3h", value: t("Every number hours", { number: 3 }) },
    { key: "every6h", value: t("Every number hours", { number: 6 }) },
    { key: "every12h", value: t("Every number hours", { number: 12 }) },
    { key: "daily", value: t("Every day") },
    { key: "biweekly", value: t("Two times every week (Tue, Thurs)") },
    { key: "triweekly", value: t("Three times every week (Mon, Wed, Fri)") },
    { key: "weekly", value: t("Every week") },
    { key: "bimonthly", value: t("Two times every month") },
    { key: "fortnightly", value: t("Every 2 weeks") },
    { key: "monthly", value: t("Every month") },
    { key: "custom", value: t("Use custom times instead") },
    { key: "none", value: t("Do not repeat") },
  ]

  return (
    <TableRow key={index} style={{ verticalAlign: !isEdit ? "middle" : "top" }}>
      <TableCell component="th" scope="row">
        {!isEdit ? (
          <span>{new Date(data.start_date).toLocaleString("en-US", Date.formatStyle("dateOnly"))}</span>
        ) : (
          <KeyboardDatePicker
            className={classes.datePicker}
            size="small"
            autoOk
            animateYearScrolling
            variant="inline"
            inputVariant="outlined"
            format="MM/dd/yyyy"
            label={t("Start date")}
            helperText={t("Select the start date.")}
            InputAdornmentProps={{ position: "end" }}
            value={data.start_date}
            onChange={(date) => {
              date.setHours(0)
              date.setMinutes(0)
              date.setSeconds(0)
              date?.isValid() && setData({ ...data, start_date: date })
            }}
          />
        )}
      </TableCell>
      <TableCell>
        {!isEdit ? (
          <span>{getDate(data.time ?? "").toLocaleString("en-US", Date.formatStyle("timeOnly"))}</span>
        ) : (
          <KeyboardTimePicker
            className={classes.datePicker}
            size="small"
            autoOk
            variant="inline"
            inputVariant="outlined"
            format="h:mm a"
            label={t("Time")}
            helperText={t("Select the start time.")}
            InputAdornmentProps={{ position: "end" }}
            value={getDate(data.time ?? "")}
            defaultValue={getDate(data.time ?? "")}
            onChange={(date) => {
              date?.isValid() && setData({ ...data, time: dateInUTCformat(date) })
            }}
          />
        )}
      </TableCell>
      <TableCell>
        {!isEdit ? (
          data.repeat_interval
        ) : (
          <FormControl variant="outlined" size="small">
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={data.repeat_interval}
              onChange={(event) => {
                setData({ ...data, repeat_interval: event.target.value })
              }}
              style={{ width: "100%", maxWidth: 175 }}
            >
              {intervals.map((interval, index) => (
                <MenuItem key={interval.key} value={interval.key}>
                  {interval.value}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{t("Select the Repeat interval.")}</FormHelperText>
          </FormControl>
        )}
      </TableCell>
      <TableCell>
        {!isEdit ? (
          <span>
            {data.repeat_interval === "custom" ? <span>{manyDates(data.custom_time)}</span> : t("No custom times")}
          </span>
        ) : (
          <span>
            {data.repeat_interval !== "custom" ? (
              <Button variant="outlined" disabled>
                {t("No custom times")}
              </Button>
            ) : (
              <InlineMenu customTimes={data.custom_time} onChange={(x) => setData({ ...data, custom_time: x })} />
            )}
          </span>
        )}
      </TableCell>
      <TableCell>
        {!isEdit ? (
          <IconButton onClick={() => setEdit(true)}>
            <Icon>edit</Icon>
          </IconButton>
        ) : (
          <IconButton
            onClick={() => {
              updateActivitySchedule(data, index, "edit")
              setEdit(false)
            }}
          >
            <Icon>done</Icon>
          </IconButton>
        )}
        {!isEdit ? (
          <IconButton onClick={() => updateActivitySchedule(null, index, "delete")}>
            <Icon>delete</Icon>
          </IconButton>
        ) : (
          <IconButton
            onClick={() => (!!scheduleRow.start_date ? setEdit(false) : updateActivitySchedule(null, index, "delete"))}
          >
            <Icon>close</Icon>
          </IconButton>
        )}
      </TableCell>
    </TableRow>
  )
}
