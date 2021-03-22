import React from "react"
import { Divider, Grid, Typography, TextField } from "@material-ui/core"
import { useTranslation } from "react-i18next"

export default function BalloonRisk({ settings, updateSettings, ...props }) {
  const { t } = useTranslation()
  const defaultBallonCount = 15
  const defaultMean = 64.5
  const defaultSD = 37
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Divider />
        <Typography variant="h6">{t("Game Settings")}</Typography>
      </Grid>
      <Grid item lg={3} md={6} sm={6}>
        <TextField
          error={settings?.balloon_count === 0 || settings?.balloon_count === "" ? true : false}
          type="number"
          variant="filled"
          id="balloon_count"
          label={t("Balloon Count")}
          defaultValue={settings?.balloon_count ?? defaultBallonCount}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            min: 1,
          }}
          onChange={(e) => updateSettings({ ...settings, balloon_count: Number(e.target.value) })}
          helperText={
            settings?.balloon_count === 0 || settings?.balloon_count === "" ? t("Please enter balloon count.") : ""
          }
        />
      </Grid>
      <Grid item lg={3} md={6} sm={6}>
        <TextField
          error={settings?.breakpoint_mean === 0 || settings?.breakpoint_mean === "" ? true : false}
          type="number"
          variant="filled"
          id="breakpoint_mean"
          label={t("Breakpoint Mean")}
          defaultValue={settings?.breakpoint_mean ?? defaultMean}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            min: 1,
          }}
          onChange={(e) => updateSettings({ ...settings, breakpoint_mean: Number(e.target.value) })}
          helperText={
            settings?.breakpoint_mean === 0 || settings?.breakpoint_mean === ""
              ? t("Please enter breakpoint mean.")
              : ""
          }
        />
      </Grid>
      <Grid item lg={3} md={6} sm={6}>
        <TextField
          error={settings?.breakpoint_std === 0 || settings?.breakpoint_std === "" ? true : false}
          type="number"
          variant="filled"
          id="breakpoint_std"
          label={t("Breakpoint Standard Deviation")}
          defaultValue={settings?.breakpoint_std ?? defaultSD}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            min: 1,
          }}
          onChange={(e) => updateSettings({ ...settings, breakpoint_std: Number(e.target.value) })}
          helperText={
            settings?.breakpoint_std === 0 || settings?.breakpoint_std === ""
              ? t("Please enter breakpoint standard deviation.")
              : ""
          }
        />
      </Grid>
    </Grid>
  )
}
