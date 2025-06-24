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
  createTheme,
  MuiThemeProvider,
  Box,
} from "@material-ui/core"
import { KeyboardDatePicker, KeyboardTimePicker } from "@material-ui/pickers"
import { useTranslation } from "react-i18next"
import InlineMenu from "./InlineMenu"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    datePicker: {
      "& div": { paddingRight: 0, maxWidth: 175 },
      "& p.MuiTypography-alignCenter": { textTransform: "capitalize" },
      "& h4.MuiTypography-h4 ": { textTransform: "capitalize" },
      "& span": { textTransform: "capitalize" },
    },
    datePickerDiv: {
      "& h4.MuiTypography-h4": { textTransform: "capitalize" },
      "& span.MuiPickersCalendarHeader-dayLabel": { textTransform: "capitalize" },
    },
    root: {
      "& h4.MuiTypography-h4": { textTransform: "capitalize" },
      "& span": { textTransform: "capitalize" },
    },
    error: {
      color: "red",
    },
    formouter: {
      position: "relative",
      marginBottom: 15,
    },
    formlabel: {
      position: "absolute",
      zIndex: 1,
      fontSize: 12,
      color: "#666",
      left: 13,
      top: 7,
    },
    formSelect: {
      width: "100%",
      border: 0,
      borderRadius: 4,
      "&:hover": {
        borderColor: "rgba(0,0,0,1)",
      },
      "&:focus": {
        borderColor: "rgba(0,0,0,1)",
      },
    },
    formHeading: {
      padding: "0 10px",
      display: "flex",
      alignItems: "Center",
      "& h4": {
        margin: "10px 30px 10px 0",
      },
      "& span": {
        fontSize: 13,
        fontWeight: 600,
      },
    },
    custombtn: {
      fontSize: 13,
      lineHeight: "14px",
      padding: 12,
    },
    btnIcon: {
      padding: 10,
    },
  })
) //MuiTypography-root MuiPickersCalendarHeader-dayLabel MuiTypography-caption
const formTheme = createTheme({
  overrides: {
    MuiTypography: {
      h4: { textTransform: "capitalize" },
    },
    MuiPaper: {
      root: { textTransform: "capitalize" },
    },
  },
})

export const getDate = (val) => {
  if ((val || "").length > 0) {
    const dateVal = val.split("T")[0].split("-")
    const timeVal = val.split("T")[1].split(":")
    const newDate = new Date()
    newDate.setFullYear(parseInt(dateVal[0]))
    newDate.setMonth(parseInt(dateVal[1]) - 1)
    newDate.setDate(parseInt(dateVal[2]))
    newDate.setHours(timeVal[0])
    newDate.setMinutes(timeVal[1])
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
  let month =
    (val || new Date()).getMonth() + 1 > 9
      ? (val || new Date()).getMonth() + 1
      : "0" + ((val || new Date()).getMonth() + 1)
  let date = (val || new Date()).getDate() > 9 ? (val || new Date()).getDate() : "0" + (val || new Date()).getDate()
  const dateVal =
    (val || new Date()).getFullYear() +
    "-" +
    month +
    "-" +
    date +
    "T" +
    ((val || new Date()).getHours() > 9 ? (val || new Date()).getHours() : "0" + (val || new Date()).getHours()) +
    ":" +
    ((val || new Date()).getMinutes() > 9 ? (val || new Date()).getMinutes() : "0" + (val || new Date()).getMinutes()) +
    ":" +
    ((val || new Date()).getSeconds() > 9 ? (val || new Date()).getSeconds() : "0" + (val || new Date()).getSeconds()) +
    ".000Z"
  return dateVal
}

import { MuiPickersUtilsProvider } from "@material-ui/pickers"
import locale_lang from "../../../locale_map.json"
import frLocale from "date-fns/locale/fr"
import koLocale from "date-fns/locale/ko"
import daLocale from "date-fns/locale/da"
import deLocale from "date-fns/locale/de"
import itLocale from "date-fns/locale/it"
import zhLocale from "date-fns/locale/zh-CN"
import zhHKLocale from "date-fns/locale/zh-HK"
import esLocale from "date-fns/locale/es"
import enLocale from "date-fns/locale/en-US"
import hiLocale from "date-fns/locale/hi"

const userLanguages = ["en-US", "es-ES", "hi-IN", "de-DE", "da-DK", "fr-FR", "ko-KR", "it-IT", "zh-CN", "zh-HK"]

const localeMap = {
  "en-US": enLocale,
  "es-ES": esLocale,
  "hi-IN": hiLocale,
  "de-DE": deLocale,
  "da-DK": daLocale,
  "fr-FR": frLocale,
  "ko-KR": koLocale,
  "it-IT": itLocale,
  "zh-CN": zhLocale,
  "zh-HK": zhHKLocale,
}
import DateFnsUtils from "@date-io/date-fns"

export default function ScheduleRow({
  scheduleRow,
  index,
  updateActivitySchedule,
  setShowNotificationInput,
  showNotificationInput,
  ...props
}: {
  scheduleRow: any
  index: number
  updateActivitySchedule: Function
  setShowNotificationInput: any
  showNotificationInput: boolean
}) {
  const classes = useStyles()
  const [isEdit, setEdit] = useState(!!scheduleRow.start_date ? false : true)
  const { t, i18n } = useTranslation()
  const [data, setData] = useState(scheduleRow)
  const [showReminderSettings, setShowReminderSettings] = useState(false)
  const intervals = [
    { key: "hourly", value: `${t("Every hour")}` },
    { key: "every3h", value: `${t("Every number hours", { number: 3 })}` },
    { key: "every6h", value: `${t("Every number hours", { number: 6 })}` },
    { key: "every12h", value: `${t("Every number hours", { number: 12 })}` },
    { key: "daily", value: `${t("Every day")}` },
    { key: "biweekly", value: `${t("Two times every week (Tue, Thurs)")}` },
    { key: "triweekly", value: `${t("Three times every week (Mon, Wed, Fri)")}` },
    { key: "weekly", value: `${t("Every week")}` },
    { key: "bimonthly", value: `${t("Two times every month")}` },
    { key: "fortnightly", value: `${t("Every 2 weeks")}` },
    { key: "monthly", value: `${t("Every month")}` },
    { key: "custom", value: `${t("Use custom times instead")}` },
    { key: "none", value: `${t("Do not repeat")}` },
  ]

  useEffect(() => {
    if (scheduleRow.reminderSettings || !!isEdit) setShowReminderSettings(true)
  }, [scheduleRow])

  useEffect(() => {
    validate()
  }, [data])

  const validate = () => {
    return !(
      data.start_date === null ||
      data.time === null ||
      data.repeat_interval === "" ||
      data.repeat_interval === null
    )
  }
  const getSelectedLanguage = () => {
    const matched_codes = Object.keys(locale_lang).filter((code) => code.startsWith(navigator.language))
    const lang = matched_codes.length > 0 ? matched_codes[0] : "en-US"
    return i18n.language ? i18n.language : userLanguages.includes(lang) ? lang : "en-US"
  }
  const handleNotificationChange = () => {
    setShowNotificationInput(true)
  }

  return (
    <>
      <TableRow key={index} style={{ verticalAlign: !isEdit ? "middle" : "top" }}>
        <TableCell component="th" scope="row">
          {!isEdit ? (
            <span>{getDate(data.start_date ?? "").toLocaleString("en-US", Date.formatStyle("dateOnly"))}</span>
          ) : (
            <MuiThemeProvider theme={formTheme}>
              <MuiPickersUtilsProvider locale={localeMap[getSelectedLanguage()]} utils={DateFnsUtils}>
                <KeyboardDatePicker
                  clearable
                  value={data?.start_date ? getDate(data.start_date ?? "") : ""}
                  onBlur={(event) => {
                    const date = new Date(event.target.value)
                    if (!!date) {
                      date.setHours(1)
                      date.setMinutes(0)
                      date.setSeconds(0)
                    }
                    setData({
                      ...data,
                      start_date: date?.isValid() ? dateInUTCformat(date) : null,
                      time: date?.isValid() ? dateInUTCformat(date) : null,
                    })
                  }}
                  onChange={(date) => {
                    if (!!date) {
                      date.setHours(1)
                      date.setMinutes(0)
                      date.setSeconds(0)
                    }
                    setData({
                      ...data,
                      start_date: date?.isValid() ? dateInUTCformat(date) : null,
                      time: date?.isValid() ? dateInUTCformat(date) : null,
                    })
                  }}
                  format="MM/dd/yyyy"
                  animateYearScrolling
                  variant="inline"
                  inputVariant="outlined"
                  className={classes.datePicker}
                  helperText={`${t("Select the start date.")}`}
                  size="small"
                />
              </MuiPickersUtilsProvider>
            </MuiThemeProvider>
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
              format="hh:mm a"
              mask="__:__ _M"
              placeholder="HH:MM AM"
              error={data.time === "" || data.time === null}
              helperText={`${t("Select the start time.")}`}
              InputAdornmentProps={{ position: "end" }}
              value={data.time ? getDate(data.time ?? "") : ""}
              defaultValue={data.time ? getDate(data.time ?? "") : ""}
              onChange={(date) => {
                setData({ ...data, time: date?.isValid() ? dateInUTCformat(date) : null })
              }}
              onBlur={(event) => {
                const date = data?.start_date ? new Date(data?.start_date) : new Date()

                const value = event.target.value
                const parts = value.match(/(\d+)\:(\d+) (\w+)/)
                const hours =
                  /am/i.test(parts[3]) || /AM/i.test(parts[3])
                    ? parseInt(parts[1], 10) === 12
                      ? 0
                      : parseInt(parts[1], 10)
                    : parseInt(parts[1], 10) === 12
                    ? parseInt(parts[1], 10) + 0
                    : parseInt(parts[1], 10) + 12
                const minutes = parseInt(parts[2], 10)
                date.setHours(hours)
                date.setMinutes(minutes)
                setData({ ...data, time: date?.isValid() ? dateInUTCformat(date) : null })
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
                error={data.repeat_interval === "" || data.repeat_interval === null}
                onChange={(event) => {
                  setShowReminderSettings(true)
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
              <FormHelperText
                className={data.repeat_interval === "" || data.repeat_interval === null ? classes.error : ""}
              >
                {`${t("Select the Repeat interval.")}`}
              </FormHelperText>
            </FormControl>
          )}
        </TableCell>
        <TableCell>
          {!isEdit ? (
            <span>
              {data.repeat_interval === "custom" ? (
                <span>{`${t(manyDates(data.custom_time))}`}</span>
              ) : (
                `${t("No custom times")}`
              )}
            </span>
          ) : (
            <span>
              {data.repeat_interval !== "custom" ? (
                <Button variant="outlined" disabled className={classes.custombtn}>
                  {`${t("No custom times")}`}
                </Button>
              ) : (
                <InlineMenu customTimes={data.custom_time} onChange={(x) => setData({ ...data, custom_time: x })} />
              )}
            </span>
          )}
        </TableCell>
        <TableCell>
          {!showNotificationInput && (
            <>
              <IconButton className={classes.btnIcon} onClick={() => handleNotificationChange()}>
                <Icon>notifications</Icon>
              </IconButton>

              {/* Action Icons */}

              {!isEdit ? (
                <>
                  <IconButton
                    className={classes.btnIcon}
                    onClick={() => {
                      setEdit(true)
                      setShowReminderSettings(true)
                    }}
                  >
                    <Icon>edit</Icon>
                  </IconButton>
                  <IconButton className={classes.btnIcon} onClick={() => updateActivitySchedule(null, index, "delete")}>
                    <Icon>delete</Icon>
                  </IconButton>
                </>
              ) : (
                <>
                  <IconButton
                    className={classes.btnIcon}
                    onClick={() => {
                      if (validate()) {
                        updateActivitySchedule(data, index, "edit")
                        setEdit(false)
                        setShowNotificationInput(false)
                      }
                    }}
                  >
                    <Icon>done</Icon>
                  </IconButton>
                  <IconButton
                    className={classes.btnIcon}
                    onClick={() => {
                      if (!!scheduleRow.start_date) {
                        setEdit(false)
                        setShowNotificationInput(false)
                        setData(scheduleRow)
                      } else {
                        updateActivitySchedule(null, index, "delete")
                      }
                      setShowNotificationInput(false)
                    }}
                    // onClick={() => {
                    //   setEdit(false)
                    //   setShowNotificationInput(false)
                    //   setData(scheduleRow) //To make the state value to its initial value other wise updated state value is showing
                    // }}
                  >
                    <Icon>close</Icon>
                  </IconButton>
                </>
              )}
            </>
          )}
        </TableCell>
      </TableRow>
      {showNotificationInput && (
        <TableRow>
          <TableCell colSpan={4}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <strong style={{ fontSize: 12 }}>{t("Notification Text")}</strong>
              <textarea
                rows={2}
                value={data?.notificationMessage}
                onChange={(e) =>
                  setData({
                    ...data,
                    notificationMessage: e.target.value,
                  })
                }
                placeholder={t("Enter custom message")}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  backgroundColor: "#f5f5f5",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 14,
                  fontFamily: "inherit",
                  outline: "none",
                  resize: "none",
                }}
              />
            </div>
          </TableCell>
          <TableCell>
            <Box pt={3}>
              <IconButton
                className={classes.btnIcon}
                onClick={() => {
                  if (validate()) {
                    updateActivitySchedule(data, index, "edit")
                    setEdit(false)
                    setShowNotificationInput(false)
                  }
                }}
              >
                <Icon>done</Icon>
              </IconButton>
              <IconButton
                className={classes.btnIcon}
                onClick={() => {
                  setEdit(false)
                  setShowNotificationInput(false)
                  setData(scheduleRow) //To make the state value to its initial value other wise updated state value is showing
                }}
              >
                <Icon>close</Icon>
              </IconButton>
            </Box>
          </TableCell>
        </TableRow>
      )}
      {/* <TableRow style={{ display: showReminderSettings ? "" : "none" }}>
        <ReminderSettings
          isEdit={isEdit}
          reminderSettings={data.reminderSettings}
          repeat_interval={data?.repeat_interval}
          onUpdate={(settings) => {
            setData({
              ...data,
              reminderSettings: settings,
            })
          }}
        />
      </TableRow> */}
    </>
  )
}
