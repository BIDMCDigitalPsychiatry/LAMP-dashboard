// Core Imports
import React, { useState } from "react"
import {
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
import { KeyboardTimePicker } from "@material-ui/pickers"
import { useTranslation } from "react-i18next"
import { getDate, dateInUTCformat, manyDates } from "./ScheduleRow"

export default function InlineMenu({ customTimes, onChange, startDate, startTime, ...props }) {
  const [items, setItems] = useState(customTimes ?? [])
  const [open, setOpen] = useState<Element>()
  const [current, setCurrent] = useState("")

  const { t } = useTranslation()

  const getStartDateTime = () => {
    try {
      const datePart = startDate ? new Date(getDate(startDate)) : new Date()
      const timePart = startTime ? new Date(getDate(startTime)) : new Date()
      // Combine both for comparison
      const combined = new Date(
        datePart.getFullYear(),
        datePart.getMonth(),
        datePart.getDate(),
        timePart.getHours(),
        timePart.getMinutes(),
        0
      )
      return combined
    } catch {
      return new Date()
    }
  }

  const startDateTime = getStartDateTime()

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={(e) => setOpen(e.currentTarget)}>
        {`${t(manyDates(items))}`}
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
          <b>{`${t("Custom Times")}`}</b>
        </MenuItem>
        {items?.map((x, idx) => (
          <MenuItem dense disabled key={idx}>
            <Typography variant="overline">
              {getDate(x).toLocaleString("en-US", Date.formatStyle("timeOnly"))}
            </Typography>
            <ListItemSecondaryAction>
              <Tooltip title={`${t("Delete this time from the list.")}`}>
                <IconButton
                  edge="end"
                  aria-label="remove"
                  onClick={() => setItems((x) => x?.slice(0, idx)?.concat(x?.slice(idx + 1)))}
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
            label="Custom time"
            placeholder="08:00 AM"
            mask="__:__ _M"
            value={getDate(current)}
            onChange={(date) => {
              setCurrent(dateInUTCformat(date))
            }}
            onAccept={(date) => {
              setCurrent(dateInUTCformat(date))
            }}
            inputVariant="outlined"
            InputAdornmentProps={{ position: "start" }}
            InputProps={{
              style: { color: "#000" },
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title={`${t("Add this time to the list.")}`}>
                    <IconButton
                      edge="end"
                      aria-label="add"
                      // onClick={() => {
                      //   if (current?.length > 0) setItems((x) => [...x, current])
                      // }}
                      onClick={() => {
                        if (!current) return
                        // const newTime = getDate(current)

                        // // Combine with startDate for comparison
                        // const checkTime = new Date(
                        //   startDateTime.getFullYear(),
                        //   startDateTime.getMonth(),
                        //   startDateTime.getDate(),
                        //   newTime.getHours(),
                        //   newTime.getMinutes(),
                        //   0
                        // )

                        // if (checkTime < startDateTime) {
                        //   alert(t("Custom time cannot be earlier than the start time."))
                        //   return
                        // }

                        setItems((x) => [...x, current])
                      }}
                      onMouseDown={(event) => event.preventDefault()}
                    >
                      <Icon fontSize="small">check</Icon>
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
            helperText={`${t("Add a new custom time.")}`}
          />
        </MenuItem>
      </Menu>
    </React.Fragment>
  )
}
