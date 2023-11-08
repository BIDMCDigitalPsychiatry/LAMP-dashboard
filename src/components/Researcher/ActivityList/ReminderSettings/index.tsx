import React, { useEffect, useState } from "react"
import { TableCell, makeStyles, Theme, createStyles, Grid, FormControlLabel, Checkbox } from "@material-ui/core"
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
)
import { getDate, dateInUTCformat } from "../ScheduleRow"
import RemindBefore from "./RemindBefore"

export default function ReminderSettings({ ...props }) {
  const classes = useStyles()
  const { t } = useTranslation()
  const [reminderCustom, setReminderCustom] = useState(false)
  const [reminderLastDayCustom, setReminderLastDayCustom] = useState(false)
  const [reminderSettings, setReminderSettings] = useState(props?.reminderSettings ?? null)

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
  const [optionValues, setOptions] = useState([])
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

  useEffect(() => {
    console.log(props)
    setOptions(options.find((d) => d.key === props?.repeat_interval)?.before)
    setReminderSettings(props?.reminderSettings)
  }, [props?.repeat_interval])

  useEffect(() => {
    if (reminderSettings !== props?.reminderSettings) props.onUpdate(reminderSettings)
  }, [reminderSettings])

  return (
    <TableCell colSpan={5}>
      <Grid container spacing={2}>
        <Grid xs={12} className={classes.formHeading}>
          <h4>Reminder settings</h4>
          <FormControlLabel
            control={
              <Checkbox
                checked={reminderSettings?.beforeTime !== null}
                disabled={!props.isEdit}
                onChange={() => setReminderCustom(!reminderCustom)}
              />
            }
            label="Use custom time"
          />
        </Grid>
        {!reminderCustom ? (
          <RemindBefore
            options={optionValues}
            disabled={!props.isEdit}
            onUpdate={(data) => {
              setReminderSettings({ ...reminderSettings, before: data, beforeTime: null })
            }}
            value={reminderSettings?.before}
          />
        ) : (
          <KeyboardTimePicker
            className={classes.datePicker}
            size="small"
            autoOk
            disabled={!props.isEdit}
            variant="inline"
            inputVariant="outlined"
            format="hh:mm a"
            mask="__:__ _M"
            placeholder="HH:MM AM"
            onChange={(date) => {
              setReminderSettings({
                ...reminderSettings,
                before: null,
                beforeTime: date?.isValid() ? dateInUTCformat(date) : null,
              })
            }}
            value={reminderSettings?.beforeTime ? getDate(reminderSettings?.beforeTime ?? "") : ""}
            onBlur={(event) => {
              const date = new Date()
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
              setReminderSettings({
                ...reminderSettings,
                before: null,
                beforeTime: date?.isValid() ? dateInUTCformat(date) : null,
              })
            }}
          />
        )}
        {options.findIndex((d) => d.key === props?.repeat_interval) > 4 && (
          <>
            <Grid xs={12} className={classes.formHeading}>
              <h4>Set last day reminder</h4>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={reminderSettings?.beforeLastDayTime !== null}
                    disabled={!props.isEdit}
                    onChange={() => setReminderLastDayCustom(!reminderLastDayCustom)}
                  />
                }
                label="Use custom time"
              />
            </Grid>
            {!reminderLastDayCustom ? (
              <RemindBefore
                options={beforeLessThanOneday}
                disabled={!props.isEdit}
                onUpdate={(data) => {
                  setReminderSettings({ ...reminderSettings, beforeLastDayTime: null, beforeLastDay: data })
                }}
                value={reminderSettings?.beforeTime}
              />
            ) : (
              <KeyboardTimePicker
                className={classes.datePicker}
                size="small"
                autoOk
                disabled={!props.isEdit}
                variant="inline"
                inputVariant="outlined"
                format="hh:mm a"
                mask="__:__ _M"
                placeholder="HH:MM AM"
                onChange={(date) => {
                  setReminderSettings({
                    ...reminderSettings,
                    beforeLastDay: null,
                    beforeLastDayTime: date?.isValid() ? dateInUTCformat(date) : null,
                  })
                }}
                value={reminderSettings?.beforeLastDayTime ? getDate(reminderSettings?.beforeLastDayTime ?? "") : ""}
                onBlur={(event) => {
                  const date = new Date()
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
                  setReminderSettings({
                    ...reminderSettings,
                    beforeLastDay: null,
                    beforeLastDayTime: date?.isValid() ? dateInUTCformat(date) : null,
                  })
                }}
              />
            )}
          </>
        )}
      </Grid>
    </TableCell>
  )
}
