import React, { useEffect, useState } from "react"
import { makeStyles, createStyles, Theme, Grid, TextField, Button } from "@material-ui/core"
import { useTranslation } from "react-i18next"
import LAMP from "lamp-core"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    btnBlue: {
      background: "#7599FF",
      borderRadius: "40px",
      minWidth: 100,
      boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.20)",
      lineHeight: "38px",
      cursor: "pointer",
      textTransform: "capitalize",
      fontSize: "16px",
      color: "#fff",
      position: "absolute",
      top: 25,
      "&:hover": { background: "#5680f9" },
      [theme.breakpoints.down("sm")]: {
        minWidth: "auto",
      },
    },

    formouter: {
      position: "relative",
      marginBottom: 20,
    },
    formlabel: {
      position: "absolute",
      zIndex: 1,
      fontSize: 12,
      color: "#666",
      left: 20,
      top: 14,
    },
    formSelect: {
      background: "#f4f4f4",
      padding: "27px 12px 10px",
      width: "100%",
      border: 0,
      borderRadius: 4,
      "&:hover": {
        borderColor: "rgba(0,0,0,1)",
      },
      "&:focus": {
        borderColor: "rgba(0,0,0,1)",
      },
      option: {
        padding: 100,
      },
    },
  })
)

export default function PercentageSettings({ activityId, ...props }) {
  const { t } = useTranslation()
  const classes = useStyles()
  const [settings, setSettings] = useState({ limit: null, unit: null, timeframe: null })

  useEffect(() => {
    ;(async () => {
      let tag = [await LAMP.Type.getAttachment(activityId, "lamp.dashboard.percentage_settings")].map((y: any) =>
        !!y.error ? undefined : y.data
      )[0]
      if (!!tag) setSettings(tag)
    })()
  }, [])

  const updateSettings = async () => {
    await LAMP.Type.setAttachment(activityId, "me", "lamp.dashboard.percentage_settings", settings)
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={4} className={classes.formouter}>
        <label className={classes.formlabel}>{`${t("Required number of completions")}`}</label>
        <TextField
          type="number"
          value={settings.limit}
          variant="filled"
          onChange={(e) => {
            setSettings({ ...settings, limit: parseInt(e.target.value) })
          }}
        />
      </Grid>
      <Grid item xs={4} className={classes.formouter}>
        <label className={classes.formlabel}>{`${t("Unit")}`}</label>
        <select
          name="unit"
          value={settings.unit}
          onChange={(e) => {
            console.log(e.target.value)
            setSettings({ ...settings, unit: e.target.value })
          }}
          className={classes.formSelect}
        >
          <option value="months">{`${t("Months")}`}</option>
          <option value="weeks">{`${t("Weeks")}`}</option>
          <option value="days">{`${t("Days")}`}</option>
          <option value="hours">{`${t("Hours")}`}</option>
        </select>
      </Grid>
      <Grid item xs={4} className={classes.formouter}>
        <label className={classes.formlabel}>{`${t("Timeframe")}`}</label>
        <TextField
          type="number"
          value={settings.timeframe}
          variant="filled"
          onChange={(e) => {
            setSettings({ ...settings, timeframe: parseInt(e.target.value) })
          }}
        />
      </Grid>
      <Button onClick={updateSettings}>Save</Button>
    </Grid>
  )
}
