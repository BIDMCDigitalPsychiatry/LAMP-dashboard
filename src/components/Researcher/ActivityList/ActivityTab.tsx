import React, { useState, useEffect } from "react"
import {
  Box,
  Select,
  OutlinedInput,
  MenuItem,
  Checkbox,
  ListItemText,
  makeStyles,
  createStyles,
  Theme,
  FormControlLabel,
  Typography,
  Grid
} from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { getDefaultTab } from "./ActivityMethods"
import classes from "*.module.css"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuitemsul: {
      width: "100%",
    },
    marginTop10 : {marginTop : "10px"}
  })
)

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
      ul: {
        paddingTop: 0,
      },
    },
  },
}

export default function ActivityTab({ value, activitySpecId, onChange, ...props }) {
  const classes = useStyles()
  const { t } = useTranslation()
  const [category, setCategory] = useState(value?.category ?? [])
  const [customize, setCustomize] = useState(false)
  const tabs = {
    assess: "Assess",
    learn: "Learn",
    manage: "Manage",
    prevent: "Portal",
  }

  useEffect(() => {
    onChange(category)
  }, [category])

  useEffect(() => {
    if (category === null) {
      setDefault()
    }   
  }, [])

  useEffect(() => {
    if(!customize) {
      setDefault()
    }
  }, [customize])

  const setDefault = async () => {
    let defaultTab = await getDefaultTab(activitySpecId)
    if (!!defaultTab) setCategory([defaultTab])
  }

  return (
    <Grid item lg={12} md={9} xs={12}>
      <Grid container spacing={2}>
        <Grid item lg={6} sm={6} xs={12}>
          <FormControlLabel
            className={classes.marginTop10}
            control={
              <Checkbox
                checked={customize}
                onChange={() => {
                  setCustomize(!customize)
                }}
                name="customize"
                color="primary"
              />
            }
            label={t("Customize which Tab this Activity appears in")}
          />
          </Grid>
          <Grid item lg={6} sm={6} xs={12}>

          <Select
            labelId="demo-multiple-name-label"
            id="demo-multiple-name"
            multiple
            disabled={!customize}
            value={category}
            onChange={(event) => {
              setCategory(typeof event.target.value === "string" ? event.target.value.split(",") : event.target.value)
            }}
            input={<OutlinedInput />}
            MenuProps={MenuProps}
            className={classes.menuitemsul}
            renderValue={(selected) => category.map((c) => tabs[c]).join(", ")}
          >
            {Object.keys(tabs).map((key) => (
              <MenuItem key={key} value={key}>
                <Checkbox checked={category.indexOf(key) > -1} />
                <ListItemText primary={tabs[key]} />
              </MenuItem>
            ))}
          </Select>
          {category.length === 0 && (
            <Typography variant="caption">
              {t("This Activity will only appear in the Feed tab if a schedule is configured.")}
            </Typography>)}
        </Grid>
      </Grid>
    </Grid>
  )
}
