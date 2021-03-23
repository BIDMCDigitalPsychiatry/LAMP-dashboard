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
import { useTranslation } from "react-i18next"

// FIXME: Invalid numbers (i.e. leap year 2/29/19 or 15/65/65) is not considered invalid
// and needs to be fixed or it will silently rollback.

const manyDates = (items) =>
  items?.length > 0
    ? items
        ?.slice(0, 3)
        .map((x) => new Date(x).toLocaleString("en-US", Date.formatStyle("timeOnly")))
        .join(", ") + (items?.length > 3 ? ", ..." : "")
    : "No custom times"

export default function InlineMenu({ customTimes, onChange, ...props }) {
  const [items, setItems] = useState(customTimes ?? [])
  const [open, setOpen] = useState<Element>()
  const [current, setCurrent] = useState(new Date())
  const { t } = useTranslation()

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
          <b>{t("Custom Times")}</b>
        </MenuItem>
        {items?.map((x, idx) => (
          <MenuItem dense disabled key={idx}>
            <Typography variant="overline">
              {new Date(x).toLocaleString("en-US", Date.formatStyle("timeOnly"))}
            </Typography>
            <ListItemSecondaryAction>
              <Tooltip title={t("Delete this time from the list.")}>
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
            helperText={t("Add a new custom time.")}
            InputAdornmentProps={{ position: "start" }}
            InputProps={{
              style: { color: "#000" },
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title={t("Add this time to the list.")}>
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
