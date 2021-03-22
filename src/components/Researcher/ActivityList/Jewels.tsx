import React, { useEffect } from "react"
import { Box, Typography, TextField, MenuItem, Grid, Divider } from "@material-ui/core"
import { useSnackbar } from "notistack"
import { useTranslation } from "react-i18next"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import RatioButton from "./RatioButton"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mL14: {
      marginLeft: "14px",
    },
  })
)
const modes = [
  { name: "Beginner", value: 1 },
  { name: "Intermediate", value: 2 },
  { name: "Expert", value: 4 },
  { name: "Advanced", value: 3 },
]
const variants = [
  { name: "Trails A", value: "trails_a" },
  { name: "Trails B", value: "trails_b" },
]
export default function JewelsGame({ settings, updateSettings, ...props }) {
  const { t } = useTranslation()

  useEffect(() => {
    updateSettings({
      ...settings,
      mode: settings?.mode ?? modes[0].value,
      variant: settings?.variant ?? variants[0].value,
    })
  }, [])

  return (
    <Grid container spacing={2}>
      <Grid item lg={3} md={6} sm={6}>
        <TextField
          error={
            typeof settings?.mode == "undefined" || settings?.mode === null || settings?.mode === "" ? true : false
          }
          select
          label={t("Mode")}
          value={settings?.mode ?? 1}
          onChange={(e) => {
            updateSettings({ ...settings, mode: Number(e.target.value) })
          }}
          helperText={
            typeof settings?.mode == "undefined" || settings?.mode === null || settings?.mode === ""
              ? t("Please select the mode")
              : ""
          }
          variant="filled"
        >
          {modes.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {t(option.name)}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item lg={3} md={6} sm={6}>
        <TextField
          error={
            typeof settings?.variant == "undefined" || settings?.variant === null || settings?.variant === ""
              ? true
              : false
          }
          select
          label={t("Variant")}
          value={settings?.variant ?? "trails_a"}
          onChange={(e) => {
            updateSettings({ ...settings, variant: e.target.value })
          }}
          helperText={
            typeof settings?.variant == "undefined" || settings?.variant === null || settings?.variant === ""
              ? t("Please select the variant")
              : ""
          }
          variant="filled"
        >
          {variants.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {t(option.name)}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12}>
        <Divider />
        <Typography variant="h6">{t("Game duration")}</Typography>
      </Grid>
      <Grid item lg={3} md={6} sm={6}>
        <TextField
          error={
            settings?.beginner_seconds < 30 ||
            settings?.beginner_seconds > 300 ||
            settings?.beginner_seconds === 0 ||
            settings?.beginner_seconds === ""
              ? true
              : false
          }
          type="number"
          variant="filled"
          id="beginner_seconds"
          label={t("Beginner seconds")}
          defaultValue={settings?.beginner_seconds ?? 90}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            max: 300,
            min: 30,
          }}
          onChange={(e) => updateSettings({ ...settings, beginner_seconds: Number(e.target.value) })}
          helperText={settings?.beginner_seconds > 300 ? t("Maximum value is number", { number: 300 }) : ""}
        />
      </Grid>
      <Grid item lg={3} md={6} sm={6}>
        <TextField
          error={
            settings?.intermediate_seconds < 10 ||
            settings?.intermediate_seconds > 300 ||
            settings?.intermediate_seconds === 0 ||
            settings?.intermediate_seconds === ""
              ? true
              : false
          }
          type="number"
          variant="filled"
          id="intermediate_seconds"
          label={t("Intermediate seconds")}
          defaultValue={settings?.intermediate_seconds ?? 30}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            max: 300,
            min: 10,
          }}
          onChange={(e) => updateSettings({ ...settings, intermediate_seconds: Number(e.target.value) })}
          helperText={settings?.intermediate_seconds > 300 ? t("Maximum value is number", { number: 300 }) : ""}
        />
      </Grid>
      <Grid item lg={3} md={6} sm={6}>
        <TextField
          error={
            settings?.expert_seconds < 10 ||
            settings?.expert_seconds > 300 ||
            settings?.expert_seconds === 0 ||
            settings?.expert_seconds === ""
              ? true
              : false
          }
          type="number"
          variant="filled"
          id="expert_seconds"
          label={t("Expert seconds")}
          defaultValue={settings?.expert_seconds ?? 100}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            max: 300,
            min: 10,
          }}
          onChange={(e) => updateSettings({ ...settings, expert_seconds: Number(e.target.value) })}
          helperText={settings?.expert_seconds > 300 ? t("Maximum value is number", { number: 300 }) : ""}
        />
      </Grid>
      <Grid item lg={3} md={6} sm={6}>
        <TextField
          error={
            settings?.advanced_seconds > 300 ||
            settings?.advanced_seconds < 10 ||
            settings?.advanced_seconds === 0 ||
            settings?.advanced_seconds === ""
              ? true
              : false
          }
          type="number"
          variant="filled"
          id="advanced_seconds"
          label={t("Advanced seconds")}
          defaultValue={settings?.advanced_seconds ?? 120}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            max: 300,
            min: 10,
          }}
          onChange={(e) => updateSettings({ ...settings, advanced_seconds: Number(e.target.value) })}
          helperText={settings?.advanced_seconds > 300 ? t("Maximum value is number", { number: 300 }) : ""}
        />
      </Grid>
      <Grid item xs={12}>
        <Divider />
        <Typography variant="h6">{t("Settings")}</Typography>
      </Grid>
      <Grid item lg={3} md={6} sm={6}>
        <TextField
          error={
            settings?.diamond_count < 3 ||
            settings?.diamond_count > 25 ||
            settings?.diamond_count === 0 ||
            settings?.diamond_count === ""
              ? true
              : false
          }
          type="number"
          variant="filled"
          id="diamond_count"
          label={t("Number of diamonds for level number", { number: 1 })}
          defaultValue={settings?.diamond_count ?? 15}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            max: 25,
            min: 3,
          }}
          onChange={(e) => updateSettings({ ...settings, diamond_count: Number(e.target.value) })}
          helperText={settings?.diamond_count > 25 ? t("Maximum value is number", { number: 25 }) : ""}
        />
      </Grid>
      <Grid item lg={6} md={6} sm={6} xs={12}>
        <TextField
          error={settings?.bonus_point_count === 0 || settings?.bonus_point_count === "" ? true : false}
          type="number"
          id="bonus_point_count"
          label={t("Bonus points for next level")}
          defaultValue={settings?.bonus_point_count ?? 50}
          variant="filled"
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            max: 500,
            min: 0,
          }}
          onChange={(e) => updateSettings({ ...settings, bonus_point_count: Number(e.target.value) })}
          helperText={settings?.bonus_point_count > 500 ? t("Maximum value is number", { number: 500 }) : ""}
        />
      </Grid>
      <Grid item lg={3} md={6} sm={6}>
        <TextField
          error={
            settings?.shape_count < 1 ||
            settings?.shape_count > 4 ||
            settings?.shape_count === 0 ||
            settings?.shape_count === ""
              ? true
              : false
          }
          type="number"
          variant="filled"
          id="shape_count"
          label={t("Number of shapes")}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            max: 4,
            min: 1,
          }}
          defaultValue={settings?.shape_count ?? 1}
          onChange={(e) => updateSettings({ ...settings, shape_count: Number(e.target.value) })}
          helperText={settings?.shape_count > 4 ? t("Maximum value is number", { number: 4 }) : ""}
        />
      </Grid>
      <Grid item lg={3} md={6} sm={6}>
        <TextField
          type="number"
          variant="filled"
          id="x_changes_in_level_count"
          label={t("X changes in level count")}
          defaultValue={settings?.x_changes_in_level_count ?? 1}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            max: 25,
            min: 0,
          }}
          onChange={(e) => updateSettings({ ...settings, x_changes_in_level_count: Number(e.target.value) })}
        />
      </Grid>
      <Grid item lg={3} md={6} sm={6}>
        <TextField
          type="number"
          variant="filled"
          id="x_diamond_count"
          label={t("X diamond count")}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            max: 25,
            min: 0,
          }}
          defaultValue={settings?.x_diamond_count ?? 4}
          onChange={(e) => updateSettings({ ...settings, x_diamond_count: Number(e.target.value) })}
        />
      </Grid>
      <Grid item lg={3} md={6} sm={6}>
        <TextField
          type="number"
          variant="filled"
          id="y_changes_in_level_count"
          label={t("Y changes in level count")}
          defaultValue={settings?.y_changes_in_level_count ?? 2}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            max: 25,
            min: 0,
          }}
          onChange={(e) => updateSettings({ ...settings, y_changes_in_level_count: Number(e.target.value) })}
        />
      </Grid>
      <Grid item lg={3} md={6} sm={6}>
        <TextField
          type="number"
          variant="filled"
          id="y_shape_count"
          label={t("Y shape count")}
          defaultValue={settings?.y_shape_count ?? 1}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            max: 4,
            min: 0,
          }}
          onChange={(e) => updateSettings({ ...settings, y_shape_count: Number(e.target.value) })}
        />
      </Grid>
    </Grid>
  )
}
