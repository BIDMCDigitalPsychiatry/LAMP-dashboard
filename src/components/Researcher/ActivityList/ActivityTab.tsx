import React, { useState, useEffect } from "react"
import { Box, Select, OutlinedInput, MenuItem, Checkbox, ListItemText } from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { getDefaultTab } from "./ActivityMethods"

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

export default function ActivityTab({ value, activitySpecId, onChange, ...props }) {
  const { t } = useTranslation()
  const [category, setCategory] = useState(value?.category ?? [])
  const tabs = {
    learn: "Learn",
    assess: "Assess",
    manage: "Manage",
    prevent: "Prevent",
    "": "None",
  }

  useEffect(() => {
    onChange(category)
  }, [category])

  useEffect(() => {
    ;(async () => {
      if (category === null || category.length === 0) {
        let defaultTab = await getDefaultTab(activitySpecId)
        if (!!defaultTab) setCategory([defaultTab])
      }
    })()
  }, [])

  return (
    <Box mb={3}>
      <Select
        labelId="demo-multiple-name-label"
        id="demo-multiple-name"
        multiple
        value={category}
        onChange={(event) => {
          setCategory(typeof event.target.value === "string" ? event.target.value.split(",") : event.target.value)
        }}
        input={<OutlinedInput label="Name" />}
        MenuProps={MenuProps}
        renderValue={(selected) => category.map((c) => tabs[c]).join(", ")}
      >
        {Object.keys(tabs).map((key) => (
          <MenuItem key={key} value={key}>
            <Checkbox checked={category.indexOf(key) > -1} />
            <ListItemText primary={key} />
          </MenuItem>
        ))}
      </Select>
    </Box>
  )
}
