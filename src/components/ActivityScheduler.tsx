// Core Imports
import React, { useState } from "react"
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Divider,
  ListItemSecondaryAction,
  InputAdornment,
  Tooltip,
  IconButton,
  Icon,
  Typography,
} from "@material-ui/core"
import { KeyboardDatePicker, KeyboardTimePicker } from "@material-ui/pickers"
import MaterialTable from "material-table"
import { makeStyles, Theme, createStyles, createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"

const theme = createMuiTheme({
  overrides: {
    MuiTypography: {
      h6: { fontSize: 16, fontWeight: 600 },
    },
  },
})

// FIXME: Invalid numbers (i.e. leap year 2/29/19 or 15/65/65) is not considered invalid
// and needs to be fixed or it will silently rollback.

const manyDates = (items) =>
  items?.length > 0
    ? items
        ?.slice(0, 3)
        .map((x) => new Date(x).toLocaleString("en-US", Date.formatStyle("timeOnly")))
        .join(", ") + (items?.length > 3 ? ", ..." : "")
    : "No custom times"

function InlineMenu({ customTimes, onChange, ...props }) {
  const [items, setItems] = useState(customTimes ?? [])
  const [open, setOpen] = useState<Element>()
  const [current, setCurrent] = useState(new Date())

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={(e) => setOpen(e.currentTarget)}>
        {manyDates(items)}
      </Button>
      <Menu
        keepMounted
        open={Boolean(open)}
        anchorEl={open}
        onClose={() => {
          setOpen(undefined)
          onChange(Array.from(items))
        }}
        MenuListProps={{ dense: true }}
      >
        <MenuItem disabled divider>
          <b>Custom Times</b>
        </MenuItem>
        {items?.map((x, idx) => (
          <MenuItem dense disabled key={idx}>
            <Typography variant="overline">
              {new Date(x).toLocaleString("en-US", Date.formatStyle("timeOnly"))}
            </Typography>
            <ListItemSecondaryAction>
              <Tooltip title="Delete this time from the list.">
                <IconButton
                  edge="end"
                  aria-label="remove"
                  onClick={() => setItems((x) => x.slice(0, idx).concat(x.slice(idx + 1)))}
                >
                  <Icon fontSize="small">delete_forever</Icon>
                </IconButton>
              </Tooltip>
            </ListItemSecondaryAction>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem>
          <KeyboardTimePicker
            autoOk
            variant="inline"
            inputVariant="outlined"
            format="h:mm a"
            label="Time"
            helperText="Add a new custom time."
            InputAdornmentProps={{ position: "start" }}
            InputProps={{
              style: { color: "#000" },
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="Add this time to the list.">
                    <IconButton
                      edge="end"
                      aria-label="add"
                      onClick={() => setItems((x) => [...x, current.toJSON()])}
                      onMouseDown={(event) => event.preventDefault()}
                    >
                      <Icon fontSize="small">check</Icon>
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
            value={current}
            onChange={(date) => setCurrent(date)}
            onAccept={(date) => setCurrent(date)}
          />
        </MenuItem>
      </Menu>
    </React.Fragment>
  )
}

export default function ActivityScheduler({ activity, onChange, ...props }) {
  const schedules = activity?.schedule ?? []

  return (
    <MuiThemeProvider theme={theme}>
      <MaterialTable
        title="Activity Schedule"
        data={schedules}
        columns={[
          {
            title: "Start Date",
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
                label="Start Date"
                helperText="Select the start date."
                InputAdornmentProps={{ position: "start" }}
                value={props.value}
                onChange={(date) => date?.isValid() && props.onChange(date)}
              />
            ),
          },
          {
            title: "Time",
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
                label="Time"
                helperText="Select the start time."
                InputAdornmentProps={{ position: "start" }}
                value={props.value}
                onChange={(date) => date?.isValid() && props.onChange(date)}
              />
            ),
          },
          {
            title: "Repeat Interval",
            field: "repeat_interval",
            initialEditValue: "none",
            lookup: {
              hourly: "Every hour",
              every3h: "Every 3 hours",
              every6h: "Every 6 hours",
              every12h: "Every 12 hours",
              daily: "Every day",
              biweekly: "Two times every week (Tue, Thurs)",
              triweekly: "Three times every week (Mon, Wed, Fri)",
              weekly: "Every week",
              bimonthly: "Two times every month",
              monthly: "Every month",
              custom: "Use custom times instead",
              none: "Do not repeat",
            },
          },
          {
            title: "Custom Times",
            field: "custom_time",
            initialEditValue: [],
            render: (props) =>
              props.repeat_interval === "custom" ? <span>{manyDates(props.custom_time)}</span> : "No custom times",
            editComponent: (props) =>
              props.rowData.repeat_interval !== "custom" ? (
                <Button variant="outlined" disabled>
                  No custom times
                </Button>
              ) : (
                <InlineMenu customTimes={props.value} onChange={(x) => props.onChange(x)} />
              ),
          },
        ]}
        editable={{
          onRowAdd: async (newData) => {
            onChange([...schedules, newData])
          },
          onRowUpdate: async (newData, oldData: any) => {
            let x = Array.from(schedules) // clone
            x[oldData.tableData.id] = newData
            onChange(x)
          },
          onRowDelete: async (oldData: any) => {
            let x = Array.from(schedules) // clone
            x.splice(oldData.tableData.id, 1)
            onChange(x)
          },
        }}
        localization={{
          body: {
            emptyDataSourceMessage: "No schedule.",
            editRow: {
              deleteText: "Are you sure you want to delete this schedule item?",
            },
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
