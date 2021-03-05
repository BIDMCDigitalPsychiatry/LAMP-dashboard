import React from "react"
import { Divider, Grid, Typography, TextField } from "@material-ui/core"
import { useSnackbar } from "notistack"
import { useTranslation } from "react-i18next"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mL14: {
      marginLeft: "14px",
    },
  })
)

export default function PopTheBubbles({ settings, updateSettings, ...props }) {
  const { t } = useTranslation()
  const defaultBubbleCount = [60, 80, 80]
  const defaultBubbleSpeed = [60, 80, 80]
  const defaultIntertrialDuration = 0.5
  const defaultBubbleDuration = 1.0
  const classes = useStyles()

  const numberCommaFormat = (num) => {
    var regex = /^[0-9,\b]+$/
    return regex.test(num)
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Divider />
        <Typography variant="h6">{t("Game Settings")}</Typography>
      </Grid>
      <Grid item lg={3} md={6} sm={6}>
        <TextField
          error={
            settings.bubble_count === 0 || settings.bubble_count === "" || !numberCommaFormat(settings.bubble_count)
              ? true
              : false
          }
          type="text"
          variant="filled"
          id="bubble_count"
          label={t("Bubble Count")}
          defaultValue={settings?.bubble_count ?? defaultBubbleCount}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            min: 1,
          }}
          onChange={(e) => updateSettings({ ...settings, bubble_count: e.target.value.split(",").map((x) => +x) })}
          helperText={
            settings.balloon_count === 0 || settings.balloon_count === "" || !numberCommaFormat(settings.bubble_count)
              ? t("Please enter Bubble Count with comma seperated.")
              : ""
          }
        />
        <Typography variant="caption" display="block" className={classes.mL14}>
          {t("Multiple should be comma seperated")}
        </Typography>
      </Grid>
      <Grid item lg={3} md={6} sm={6}>
        <TextField
          error={
            settings.bubble_speed === 0 || settings.bubble_speed === "" || !numberCommaFormat(settings.bubble_speed)
              ? true
              : false
          }
          type="text"
          variant="filled"
          id="bubble_speed"
          label={t("Bubble Speed")}
          defaultValue={settings?.bubble_speed ?? defaultBubbleSpeed}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            min: 1,
          }}
          onChange={(e) => updateSettings({ ...settings, bubble_speed: e.target.value.split(",").map((x) => +x) })}
          helperText={
            settings.bubble_speed === 0 || settings.bubble_speed === "" || !numberCommaFormat(settings.bubble_speed)
              ? t("Please enter Bubble Speed with comma seperated.")
              : ""
          }
        />
        <Typography variant="caption" display="block" className={classes.mL14}>
          {t("Multiple should be comma seperated")}
        </Typography>
      </Grid>
      <Grid item lg={3} md={6} sm={6}>
        <TextField
          error={settings.intertrial_duration === 0 || settings.intertrial_duration === "" ? true : false}
          type="text"
          variant="filled"
          id="intertrial_duration"
          label={t("Intertrial Duration")}
          defaultValue={settings?.intertrial_duration ?? defaultIntertrialDuration}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            min: 1,
          }}
          onChange={(e) => updateSettings({ ...settings, intertrial_duration: Number(e.target.value) })}
          helperText={
            settings.intertrial_duration === 0 || settings.intertrial_duration === ""
              ? t("Please enter Intertrial Duration.")
              : ""
          }
        />
      </Grid>
      <Grid item lg={3} md={6} sm={6}>
        <TextField
          error={settings.bubble_duration === 0 || settings.bubble_duration === "" ? true : false}
          type="text"
          variant="filled"
          id="bubble_duration"
          label={t("Bubble Duration")}
          defaultValue={settings?.bubble_duration ?? defaultBubbleDuration}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            min: 1,
          }}
          onChange={(e) => updateSettings({ ...settings, bubble_duration: Number(e.target.value) })}
          helperText={
            settings.bubble_duration === 0 || settings.bubble_duration === "" ? t("Please enter Bubble Duration.") : ""
          }
        />
      </Grid>
    </Grid>
  )
}
