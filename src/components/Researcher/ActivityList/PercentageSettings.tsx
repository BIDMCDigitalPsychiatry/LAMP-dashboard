import React, { useEffect, useState } from "react"
import { makeStyles, createStyles, Theme, Grid, TextField, Button, Box, Tooltip, Fab, Icon } from "@material-ui/core"
import { useTranslation } from "react-i18next"
import LAMP from "lamp-core"
import { useSnackbar } from "notistack"

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
    },
    formHeading: {
      padding: "0 10px",
      borderTop: "#eee solid 1px",
      marginTop: 15,
      "& h4": {
        marginBottom: "10px",
      },
    },
  })
)

export default function PercentageSettings({ activityId, ...props }) {
  const { t } = useTranslation()
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()

  const [settings, setSettings] = useState({
    limit: null,
    unit: null,
    timeframe: null,
    startDate: new Date().getTime(),
  })

  useEffect(() => {
    ;(async () => {
      let tag = [await LAMP.Type.getAttachment(activityId, "lamp.dashboard.percentage_settings")].map((y: any) =>
        !!y.error ? undefined : y.data
      )[0]
      if (!!tag) setSettings(tag)
    })()
  }, [])

  const updateSettings = async () => {
    settings["startDate"] = new Date().getTime()
    await LAMP.Type.setAttachment(activityId, "me", "lamp.dashboard.percentage_settings", settings)
    enqueueSnackbar(`${t("Successfully updated survey percentage settings.")}`, {
      variant: "success",
    })
  }

  return (
    <Grid container spacing={2}>
      <Grid xs={12} className={classes.formHeading}>
        <h4>Survey percentage settings</h4>
      </Grid>
      <Grid item xs={4} className={classes.formouter}>
        <label className={classes.formlabel}>{`${t("Required number of completions")}`}</label>
        <TextField
          type="number"
          value={settings.limit}
          variant="filled"
          InputProps={{ inputProps: { min: 1 } }}
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
          InputProps={{ inputProps: { min: 1 } }}
          onChange={(e) => {
            setSettings({ ...settings, timeframe: parseInt(e.target.value) })
          }}
        />
      </Grid>
      <Box marginLeft={1} paddingBottom={4}>
        <Tooltip title={`${t("Save this activity.")}`}>
          <Fab className={classes.btnBlue} aria-label="Save" variant="extended" onClick={updateSettings}>
            {`${t("Save")}`}
            <span style={{ width: 8 }} />
            <Icon>save</Icon>
          </Fab>
        </Tooltip>
      </Box>
    </Grid>
  )
}
