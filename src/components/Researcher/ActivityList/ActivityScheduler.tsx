import React, { useState } from "react"
import { Box, Button } from "@material-ui/core"
import { KeyboardDatePicker, KeyboardTimePicker } from "@material-ui/pickers"
import MaterialTable from "material-table"
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import { useTranslation } from "react-i18next"
import InlineMenu from "./InlineMenu"
import { updateSchedule } from "./ActivityMethods"
const theme = createMuiTheme({
  overrides: {
    MuiTypography: {
      h6: { fontSize: 16, fontWeight: 600 },
    },
  },
})
// FIXME: Invalid numbers (i.e. leap year 2/29/19 or 15/65/65) is not considered invalid and needs to be fixed or it will silently rollback.
const manyDates = (items) =>
  items?.length > 0
    ? items
        ?.slice(0, 3)
        .map((x) => new Date(x).toLocaleString("en-US", Date.formatStyle("timeOnly")))
        .join(", ") + (items?.length > 3 ? ", ..." : "")
    : "No custom times"

export default function ActivityScheduler({ activity, activities, setActivities, ...props }) {
  const [schedule, setSchedule] = useState(activity?.schedule ?? [])
  const { t } = useTranslation()
  const updateActivitySchedule = async (activity, x) => {
    updateSchedule(activity, x)
    let index = -1
    const filteredActivity = activities.find((item, i) => {
      if (item.id === activity.id) {
        index = i
        return i
      }
    })
    filteredActivity["schedule"] = schedule
    let data = activities
    data[index] = filteredActivity
    setActivities(data)
  }
  return (
    <MuiThemeProvider theme={theme}>
      <MaterialTable
        title={t("Activity Schedule")}
        data={schedule}
        columns={[
          {
            title: t("Start date"),
            field: "start_date",
            initialEditValue: new Date(),
            render: (rowData) => (
              <span>{new Date(rowData.start_date).toLocaleString("en-US", Date.formatStyle("dateOnly"))}</span>
            ),
            editComponent: (props) => (
              <KeyboardDatePicker
                autoOk
                animateYearScrolling
                variant="inline"
                inputVariant="outlined"
                format="MM/dd/yyyy"
                label={t("Start date")}
                helperText={t("Select the start date.")}
                InputAdornmentProps={{ position: "start" }}
                value={props.value}
                onChange={(date) => date?.isValid() && props.onChange(date)}
              />
            ),
          },
          {
            title: t("Time"),
            field: "time",
            initialEditValue: new Date(),
            render: (rowData) => (
              <span>{new Date(rowData.time).toLocaleString("en-US", Date.formatStyle("timeOnly"))}</span>
            ),
            editComponent: (props) => (
              <KeyboardTimePicker
                autoOk
                variant="inline"
                inputVariant="outlined"
                format="h:mm a"
                label={t("Time")}
                helperText={t("Select the start time.")}
                InputAdornmentProps={{ position: "start" }}
                value={props.value}
                onChange={(date) => date?.isValid() && props.onChange(date)}
              />
            ),
          },
          {
            title: t("Repeat Interval"),
            field: "repeat_interval",
            initialEditValue: "none",
            lookup: {
              hourly: t("Every hour"),
              every3h: t("Every number hours", { number: 3 }),
              every6h: t("Every number hours", { number: 6 }),
              every12h: t("Every number hours", { number: 12 }),
              daily: t("Every day"),
              biweekly: t("Two times every week (Tue, Thurs)"),
              triweekly: t("Three times every week (Mon, Wed, Fri)"),
              weekly: t("Every week"),
              bimonthly: t("Two times every month"),
              monthly: t("Every month"),
              custom: t("Use custom times instead"),
              none: t("Do not repeat"),
            },
          },
          {
            title: t("Custom Times"),
            field: "custom_time",
            initialEditValue: [],
            render: (props) =>
              props.repeat_interval === "custom" ? <span>{manyDates(props.custom_time)}</span> : t("No custom times"),
            editComponent: (props) =>
              props.rowData.repeat_interval !== "custom" ? (
                <Button variant="outlined" disabled>
                  {t("No custom times")}
                </Button>
              ) : (
                <InlineMenu customTimes={props.value} onChange={(x) => props.onChange(x)} />
              ),
          },
        ]}
        editable={{
          onRowAdd: async (newData) => {
            setSchedule([...schedule, newData])
            updateActivitySchedule(activity, newData)
          },
          onRowUpdate: async (newData, oldData: any) => {
            let x = Array.from(schedule) // clone
            x[oldData.tableData.id] = newData
            setSchedule(x)
            updateActivitySchedule(activity, x)
          },
          onRowDelete: async (oldData: any) => {
            let x = Array.from(schedule) // clone
            x.splice(oldData.tableData.id, 1)
            setSchedule(x)
            updateActivitySchedule(activity, x)
          },
        }}
        localization={{
          header: {
            actions: t("Actions"),
          },
          body: {
            emptyDataSourceMessage: t("No schedule."),
            editRow: {
              deleteText: t("Are you sure you want to delete this schedule item?"),
              saveTooltip: t("Save"),
              cancelTooltip: t("Cancel"),
            },
            addTooltip: t("Add"),
            editTooltip: t("Edit"),
            deleteTooltip: t("Delete"),
          },
        }}
        options={{
          search: false,
          actionsColumnIndex: -1,
          pageSize: 3,
          pageSizeOptions: [3, 5, 10],
          headerStyle: {
            fontWeight: 600,
            fontSize: 13,
            background: "transparent",
            borderTop: "#ccc solid 1px",
          },
        }}
        components={{ Container: (props) => <Box {...props} /> }}
      />
    </MuiThemeProvider>
  )
}
