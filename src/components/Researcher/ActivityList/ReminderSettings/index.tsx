import React, { useState } from "react"
import {
  TableCell,
  makeStyles,
  Theme,
  createStyles,
  createTheme,
  Grid,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { KeyboardTimePicker } from "@material-ui/pickers"
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
import RemindBefore from "./RemindBefore"

export default function ReminderSettings({ ...props }) {
  const classes = useStyles()
  const { t, i18n } = useTranslation()
  const [reminderCustom, setReminderCustom] = useState(false)
  const [reminderLastDayCustom, setReminderLastDayCustom] = useState(false)

  const beforeMoreThanOneday = [
    {
      value: "1 hour",
      text: `${t("1 Hour")}`,
      every: [
        { value: "15 mins", text: `${t("15 Mins")}` },
        { value: "30 mins", text: `${t("30 Mins")}` },
      ],
    },
    {
      value: "2 hour",
      text: `${t("2 Hours")}`,
      every: [
        { value: "1 hour", text: `${t("1 Hour")}` },
        { value: "15 mins", text: `${t("15 Mins")}` },
        { value: "30 mins", text: `${t("30 Mins")}` },
      ],
    },
    {
      value: "3 hour",
      text: `${t("3 Hours")}`,
      every: [
        { value: "1 hour", text: `${t("1 Hour")}` },
        { value: "30 mins", text: `${t("30 Mins")}` },
      ],
    },
    {
      value: "6 hour",
      text: `${t("6 Hours")}`,
      every: [
        { value: "1 hour", text: `${t("1 Hour")}` },
        { value: "2 hour", text: `${t("2 Hours")}` },
        { value: "3 hour", text: `${t("3 Hours")}` },
      ],
    },
    {
      value: "12 hour",
      text: `${t("12 Hours")}`,
      every: [
        { value: "1 hour", text: `${t("1 Hour")}` },
        { value: "2 hour", text: `${t("2 Hours")}` },
        { value: "3 hour", text: `${t("3 Hours")}` },
        { value: "6 hour", text: `${t("6 Hours")}` },
      ],
    },
    {
      value: "1 day",
      text: `${t("1 day")}`,
      every: [
        { value: "15 mins", text: `${t("15 Mins")}` },
        { value: "30 mins", text: `${t("30 Mins")}` },
        { value: "1 hour", text: `${t("1 Hour")}` },
        { value: "3 hour", text: `${t("3 Hour")}` },
        { value: "6 hour", text: `${t("6 Hours")}` },
        { value: "9 hour", text: `${t("9 Hours")}` },
      ],
    },
  ]

  const beforeLessThanOneday = [
    {
      value: "1 hour",
      text: `${t("1 Hour")}`,
      every: [
        { value: "15 mins", text: `${t("15 Mins")}` },
        { value: "30 mins", text: `${t("30 Mins")}` },
      ],
    },
    {
      value: "2 hour",
      text: `${t("2 Hours")}`,
      every: [
        { value: "1 hour", text: `${t("1 Hour")}` },
        { value: "15 mins", text: `${t("15 Mins")}` },
        { value: "30 mins", text: `${t("30 Mins")}` },
      ],
    },
    {
      value: "3 hour",
      text: `${t("3 Hours")}`,
      every: [
        { value: "1 hour", text: `${t("1 Hour")}` },
        { value: "30 mins", text: `${t("30 Mins")}` },
      ],
    },
    {
      value: "6 hour",
      text: `${t("6 Hours")}`,
      every: [
        { value: "1 hour", text: `${t("1 Hour")}` },
        { value: "2 hour", text: `${t("2 Hours")}` },
        { value: "3 hour", text: `${t("3 Hours")}` },
      ],
    },
  ]

  const options = [
    {
      key: "hourly",
      before: [
        { value: "5 mins", text: `${t("5 Mins")}` },
        { value: "15 mins", text: `${t("15 Mins")}` },
        { value: "30 mins", text: `${t("30 Mins")}` },
      ],
    },
    {
      key: "every3h",
      before: [
        {
          value: "1 hour",
          text: `${t("1 Hour")}`,
          every: [
            { value: "15 mins", text: `${t("15 Mins")}` },
            { value: "30 mins", text: `${t("30 Mins")}` },
          ],
        },
        {
          value: "2 hour",
          text: `${t("2 Hours")}`,
          every: [
            { value: "1 hour", text: `${t("1 Hour")}` },
            { value: "15 mins", text: `${t("15 Mins")}` },
            { value: "30 mins", text: `${t("30 Mins")}` },
          ],
        },
      ],
    },
    {
      key: "every6h",
      before: [
        {
          value: "1 hour",
          text: `${t("1 Hour")}`,
          every: [
            { value: "15 mins", text: `${t("15 Mins")}` },
            { value: "30 mins", text: `${t("30 Mins")}` },
          ],
        },
        {
          value: "2 hour",
          text: `${t("2 Hours")}`,
          every: [
            { value: "1 hour", text: `${t("1 Hour")}` },
            { value: "15 mins", text: `${t("15 Mins")}` },
            { value: "30 mins", text: `${t("30 Mins")}` },
          ],
        },
        {
          value: "3 hour",
          text: `${t("3 Hours")}`,
          every: [
            { value: "1 hour", text: `${t("1 Hour")}` },
            { value: "15 mins", text: `${t("15 Mins")}` },
            { value: "30 mins", text: `${t("30 Mins")}` },
          ],
        },
      ],
    },
    { key: "every12h", before: beforeLessThanOneday },

    {
      key: "daily",
      before: [
        {
          value: "1 hour",
          text: `${t("1 Hour")}`,
          every: [
            { value: "15 mins", text: `${t("15 Mins")}` },
            { value: "30 mins", text: `${t("30 Mins")}` },
          ],
        },
        {
          value: "2 hour",
          text: `${t("2 Hours")}`,
          every: [
            { value: "1 hour", text: `${t("1 Hour")}` },
            { value: "15 mins", text: `${t("15 Mins")}` },
            { value: "30 mins", text: `${t("30 Mins")}` },
          ],
        },
        {
          value: "3 hour",
          text: `${t("3 Hours")}`,
          every: [
            { value: "1 hour", text: `${t("1 Hour")}` },
            { value: "30 mins", text: `${t("30 Mins")}` },
          ],
        },
        {
          value: "6 hour",
          text: `${t("6 Hours")}`,
          every: [
            { value: "1 hour", text: `${t("1 Hour")}` },
            { value: "2 hour", text: `${t("2 Hours")}` },
            { value: "3 hour", text: `${t("3 Hours")}` },
          ],
        },
        {
          value: "12 hour",
          text: `${t("12 Hours")}`,
          every: [
            { value: "1 hour", text: `${t("1 Hour")}` },
            { value: "2 hour", text: `${t("2 Hours")}` },
            { value: "3 hour", text: `${t("3 Hours")}` },
            { value: "6 hour", text: `${t("6 Hours")}` },
          ],
        },
      ],
    },

    { key: "biweekly", before: beforeMoreThanOneday, lastday: true },

    { key: "triweekly", before: beforeMoreThanOneday, lastday: true },
    { key: "weekly", before: beforeMoreThanOneday, lastday: true },
    { key: "bimonthly", before: beforeMoreThanOneday, lastday: true },
    { key: "fortnightly", before: beforeMoreThanOneday, lastday: true },
    { key: "monthly", before: beforeMoreThanOneday, lastday: true },
    { key: "custom", before: beforeMoreThanOneday, lastday: true },
  ]

  return (
    <TableCell colSpan={5}>
      <Grid container spacing={2}>
        <Grid xs={12} className={classes.formHeading}>
          <h4>Reminder settings</h4>
          <FormControlLabel
            control={<Checkbox onChange={() => setReminderCustom(!reminderCustom)} />}
            label="Use custom time"
          />
        </Grid>
        {!reminderCustom ? (
          <RemindBefore options={options.find((d) => d.key === props?.repeat_interval).before ?? []} />
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
            onChange={() => console.log("sdsf")}
            value={null}
          />
        )}
        {options.findIndex((d) => d.key === props?.repeat_interval) > 4 && (
          <>
            <Grid xs={12} className={classes.formHeading}>
              <h4>Set last day reminder</h4>
              <FormControlLabel
                control={<Checkbox onChange={() => setReminderLastDayCustom(!reminderLastDayCustom)} />}
                label="Use custom time"
              />
            </Grid>
            {!reminderLastDayCustom ? (
              <RemindBefore options={beforeLessThanOneday} />
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
                onChange={() => console.log("sdsf")}
                value={null}
              />
            )}
          </>
        )}
        {/* <Grid xs={12} className={classes.formHeading}>
              <h4>Set last day reminder</h4><FormControlLabel control={<Checkbox defaultChecked />} label="Use custom time" />
            </Grid>
            <RemindBefore options={beforeLessThanOneday}/> */}

        {/* <KeyboardTimePicker
              className={classes.datePicker}
              size="small"
              autoOk
              variant="inline"
              inputVariant="outlined"
              format="hh:mm a"
              mask="__:__ _M"
              placeholder="HH:MM AM"
              error={data.time === "" || data.time === null}
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
            /> */}
      </Grid>
    </TableCell>
  )
}
