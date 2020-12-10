// Core Imports
import React, { useState, useEffect, useCallback } from "react"
import {
  Box,
  Tooltip,
  Typography,
  Grid,
  Fab,
  Divider,
  MenuItem,
  Icon,
  TextField,
  ButtonBase,
  Container,
  Backdrop,
  CircularProgress,
} from "@material-ui/core"
import { useDropzone } from "react-dropzone"
import { makeStyles, Theme, createStyles, createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import { useSnackbar } from "notistack"
import Jewels from "../icons/Jewels.svg"
import { useTranslation } from "react-i18next"

const theme = createMuiTheme({
  palette: {
    secondary: {
      main: "#333",
    },
  },
  overrides: {
    MuiFilledInput: {
      root: {
        border: 0,
        backgroundColor: "#f4f4f4",
      },
      underline: {
        "&&&:before": {
          borderBottom: "none",
        },
        "&&:after": {
          borderBottom: "none",
        },
      },
    },
    MuiTextField: {
      root: { width: "100%" },
    },
    MuiDivider: {
      root: { margin: "25px 0" },
    },
  },
})

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    containerWidth: { maxWidth: 1055 },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
    unableContainer: {
      width: 24,
      height: 24,
      border: "3px solid #BFBFBF",
      borderRadius: 12,
      boxSizing: "border-box",
      marginRight: 17,
      opacity: 0.4,
    },
    unableCheck: {
      fontSize: 14,
      color: "rgba(0, 0, 0, 0.4)",
      flex: 1,
      opacity: 0.4,
    },
    uncheckContainer: {
      width: 24,
      height: 24,
      border: "3px solid #C6C6C6",
      borderRadius: 12,
      boxSizing: "border-box",
      arginRight: 17,
    },
    checkedContainer: {
      width: 24,
      height: 24,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#2F9D7E",
      borderRadius: 12,
      marginRight: 17,
    },
    titleChecked: {
      fontSize: 14,
      color: "rgba(0, 0, 0, 0.75)",
      fontWeight: "bold",
      flex: 1,
    },
    titleUncheck: {
      fontSize: 14,
      color: "rgba(0, 0, 0, 0.4)",
      flex: 1,
    },
  })
)

function compress(file, width, height) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    const fileName = file.name
    const extension = fileName.split(".").reverse()[0].toLowerCase()
    reader.onerror = (error) => reject(error)
    if (extension !== "svg") {
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target.result as string
        img.onload = () => {
          const elem = document.createElement("canvas")
          elem.width = width
          elem.height = height
          const ctx = elem.getContext("2d")
          ctx.drawImage(img, 0, 0, width, height)
          resolve(ctx.canvas.toDataURL())
        }
      }
    } else {
      reader.onload = (event) => {
        resolve(reader.result)
      }
    }
  })
}

function RatioButton({ checked, onChange, title, value, unable, smallSpace, color, ...props }) {
  const classes = useStyles()

  return (
    <Box display="flex" mx={3}>
      <div
        onClick={() => !unable && onChange(value)}
        className={unable ? classes.unableContainer : checked ? classes.checkedContainer : classes.uncheckContainer}
        style={{
          marginRight: smallSpace ? 10 : 10,
          backgroundColor: checked ? (color ? color : "#2F9D7E") : "transparent",
        }}
      />
      <Typography className={unable ? classes.unableCheck : checked ? classes.titleChecked : classes.titleUncheck}>
        {title}
      </Typography>
    </Box>
  )
}
export default function GameCreator({
  activities,
  value,
  onSave,
  onCancel,
  activitySpecId,
  details,
  studies,
  ...props
}: {
  activities?: any
  value?: any
  onSave?: any
  onCancel?: any
  activitySpecId?: string
  details?: any
  studies?: any
}) {
  const { enqueueSnackbar } = useSnackbar()
  const classes = useStyles()
  const [text, setText] = useState(!!value ? value.name : undefined)
  const [description, setDescription] = useState(details?.description ?? null)
  const [photo, setPhoto] = useState(
    details?.photo ??
      ((value?.spec && ["lamp.jewels_a", "lamp.jewels_b"].includes(value.spec)) ||
        ["lamp.jewels_a", "lamp.jewels_b"].includes(activitySpecId))
      ? Jewels
      : null
  )
  const [disabled, setDisabled] = useState(true)
  const [loading, setLoading] = React.useState(false)
  const [studyId, setStudyId] = useState(!!value ? value.parentID : undefined)
  const { t } = useTranslation()
  const [settings, setSettings] = useState(
    !!value
      ? value?.settings
      : (value?.spec && ["lamp.jewels_a", "lamp.jewels_b"].includes(value.spec)) ||
        ["lamp.jewels_a", "lamp.jewels_b"].includes(activitySpecId)
      ? {
          mode: 1,
          variant:
            activitySpecId === "lamp.jewels_a" || (value?.spec && value?.spec === "lamp.jewels_a")
              ? "trails_a"
              : "trails_b",
          beginner_seconds: 90,
          intermediate_seconds: 30,
          advanced_seconds: 25,
          expert_seconds: 15,
          diamond_count: 15,
          shape_count: (value?.spec && "lamp.jewels_b" === value.spec) || "lamp.jewels_b" == activitySpecId ? 2 : 1,
          bonus_point_count: 50,
          x_changes_in_level_count: 1,
          x_diamond_count: 0,
          y_changes_in_level_count: 1,
          y_shape_count: 1,
        }
      : {}
  )

  const { acceptedFiles, getRootProps, getInputProps, isDragActive, isDragAccept } = useDropzone({
    onDropAccepted: useCallback((acceptedFiles) => {
      compress(acceptedFiles[0], 64, 64).then(setPhoto)
    }, []),
    onDropRejected: useCallback((rejectedFiles) => {
      if (rejectedFiles[0].size / 1024 / 1024 > 5) {
        enqueueSnackbar(t("Image size should not exceed 5 MB."), { variant: "error" })
      } else if ("image" !== rejectedFiles[0].type.split("/")[0]) {
        enqueueSnackbar(t("Not supported image type."), { variant: "error" })
      }
    }, []),
    accept: "image/*",
    maxSize: 2 * 1024 * 1024 /* 5MB */,
  })

  const validate = () => {
    let duplicates = []
    if (typeof text !== "undefined" && text?.trim() !== "") {
      duplicates = activities.filter(
        (x) =>
          (!!value
            ? x.name.toLowerCase() === text?.trim().toLowerCase() && x.id !== value?.id
            : x.name.toLowerCase() === text?.trim().toLowerCase()) && studyId === x.parentID
      )
      if (duplicates.length > 0) {
        enqueueSnackbar("Activity with same name already exist.", { variant: "error" })
      }
    }
    if (
      (value?.spec && ["lamp.jewels_a", "lamp.jewels_b"].includes(value.spec)) ||
      ["lamp.jewels_a", "lamp.jewels_b"].includes(activitySpecId)
    ) {
      return !(
        typeof studyId == "undefined" ||
        studyId === null ||
        studyId === "" ||
        duplicates.length > 0 ||
        settings.beginner_seconds > 300 ||
        settings.beginner_seconds === 0 ||
        settings.beginner_seconds === "" ||
        settings.intermediate_seconds > 300 ||
        settings.intermediate_seconds === 0 ||
        settings.intermediate_seconds === "" ||
        settings.advanced_seconds > 300 ||
        settings.advanced_seconds === 0 ||
        settings.advanced_seconds === "" ||
        settings.expert_seconds > 300 ||
        settings.expert_seconds === 0 ||
        settings.expert_seconds === "" ||
        settings.diamond_count > 25 ||
        settings.diamond_count === 0 ||
        settings.diamond_count === "" ||
        settings.bonus_point_count === 0 ||
        settings.bonus_point_count === "" ||
        settings.shape_count > 4 ||
        settings.shape_count === 0 ||
        settings.shape_count === "" ||
        typeof text === "undefined" ||
        settings.beginner_seconds < 30 ||
        settings.intermediate_seconds < 10 ||
        settings.expert_seconds < 10 ||
        settings.advanced_seconds < 10 ||
        settings.diamond_count < 3 ||
        settings.shape_count < 1 ||
        (typeof text !== "undefined" && text?.trim() === "")
      )
    } else {
      return !(
        typeof studyId == "undefined" ||
        studyId === null ||
        studyId === "" ||
        duplicates.length > 0 ||
        typeof text === "undefined" ||
        (typeof text !== "undefined" && text?.trim() === "")
      )
    }
  }

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

  return (
    <Grid container direction="column" spacing={2} {...props}>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <MuiThemeProvider theme={theme}>
        <Container className={classes.containerWidth}>
          <Grid container spacing={2}>
            <Grid item xs md={2}>
              <Tooltip
                title={
                  !photo
                    ? t("Drag a photo or tap to select a photo.")
                    : t("Drag a photo to replace the existing photo or tap to delete the photo.")
                }
              >
                <Box
                  {...getRootProps()}
                  width={154}
                  height={154}
                  border={1}
                  borderRadius={4}
                  borderColor={!(isDragActive || isDragAccept || !!photo) ? "text.secondary" : "#fff"}
                  bgcolor={isDragActive || isDragAccept ? "text.secondary" : undefined}
                  color={!(isDragActive || isDragAccept || !!photo) ? "text.secondary" : "#fff"}
                  style={{
                    background: !!photo ? `url(${photo}) center center/contain no-repeat` : undefined,
                  }}
                >
                  <ButtonBase style={{ width: "100%", height: "100%" }} onClick={() => !!photo && setPhoto(undefined)}>
                    {!photo && <input {...getInputProps()} />}
                    <Icon fontSize="large">{!photo ? "add_a_photo" : "delete_forever"}</Icon>
                  </ButtonBase>
                </Box>
              </Tooltip>
            </Grid>
            <Grid item md={10}>
              <Grid container spacing={2}>
                <Grid item lg={4}>
                  <TextField
                    error={typeof studyId == "undefined" || studyId === null || studyId === "" ? true : false}
                    id="filled-select-currency"
                    select
                    label={t("Study")}
                    value={studyId}
                    onChange={(e) => {
                      setStudyId(e.target.value)
                    }}
                    helperText={
                      typeof studyId == "undefined" || studyId === null || studyId === ""
                        ? t("Please select the study")
                        : ""
                    }
                    variant="filled"
                    disabled={!!value ? true : false}
                  >
                    {studies.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {t(option.name)}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs>
                  <Box mb={3}>
                    <TextField
                      error={
                        typeof text === "undefined" || (typeof text !== "undefined" && text?.trim() === "")
                          ? true
                          : false
                      }
                      fullWidth
                      variant="filled"
                      label={t("Activity Title")}
                      defaultValue={text}
                      onChange={(event) => setText(event.target.value)}
                      inputProps={{ maxLength: 80 }}
                    />
                  </Box>
                </Grid>
              </Grid>

              <Box>
                <TextField
                  fullWidth
                  multiline
                  label={t("Activity Description")}
                  variant="filled"
                  rows={2}
                  defaultValue={description}
                  onChange={(event) => setDescription(event.target.value)}
                  inputProps={{ maxLength: 2500 }}
                />
              </Box>
            </Grid>
          </Grid>

          {((value?.spec && "lamp.spatial_span" === value.spec) || "lamp.spatial_span" === activitySpecId) && (
            <Box style={{ marginTop: 80 }}>
              <Typography variant="h6">{t("Order of tapping")}:</Typography>
              <Box display="flex" mt={2}>
                <Box>
                  <RatioButton
                    smallSpace={true}
                    title={t("Forward")}
                    unable={false}
                    color="#618EF7"
                    value="Forward"
                    checked={!settings.reverse_tapping ? true : false}
                    onChange={() => setSettings({ ...settings, reverse_tapping: false })}
                    labelPlacement="right"
                  />
                </Box>
                <Box>
                  <RatioButton
                    smallSpace={true}
                    title={t("Backward")}
                    color="#618EF7"
                    value="Backward"
                    unable={false}
                    checked={settings.reverse_tapping ? true : false}
                    onChange={() => setSettings({ ...settings, reverse_tapping: true })}
                    labelPlacement="right"
                  />
                </Box>
              </Box>
            </Box>
          )}

          {((value?.spec && ["lamp.jewels_a", "lamp.jewels_b"].includes(value.spec)) ||
            ["lamp.jewels_a", "lamp.jewels_b"].includes(activitySpecId)) && (
            <Grid container spacing={2}>
              <Grid item lg={3} md={6} sm={6}>
                <TextField
                  error={
                    typeof settings.mode == "undefined" || settings.mode === null || settings.mode === "" ? true : false
                  }
                  select
                  label={t("Mode")}
                  value={settings?.mode ?? 1}
                  onChange={(e) => {
                    setSettings({ ...settings, mode: Number(e.target.value) })
                  }}
                  helperText={
                    typeof settings.mode == "undefined" || settings.mode === null || settings.mode === ""
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
                    typeof settings.variant == "undefined" || settings.variant === null || settings.variant === ""
                      ? true
                      : false
                  }
                  select
                  label={t("Variant")}
                  value={settings?.variant ?? "trails_a"}
                  onChange={(e) => {
                    setSettings({ ...settings, variant: e.target.value })
                  }}
                  helperText={
                    typeof settings.variant == "undefined" || settings.variant === null || settings.variant === ""
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
                    settings.beginner_seconds < 30 ||
                    settings.beginner_seconds > 300 ||
                    settings.beginner_seconds === 0 ||
                    settings.beginner_seconds === ""
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
                  onChange={(e) => setSettings({ ...settings, beginner_seconds: Number(e.target.value) })}
                  helperText={settings.beginner_seconds > 300 ? t("Maximum value is number", { number: 300 }) : ""}
                />
              </Grid>
              <Grid item lg={3} md={6} sm={6}>
                <TextField
                  error={
                    settings.intermediate_seconds < 10 ||
                    settings.intermediate_seconds > 300 ||
                    settings.intermediate_seconds === 0 ||
                    settings.intermediate_seconds === ""
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
                  onChange={(e) => setSettings({ ...settings, intermediate_seconds: Number(e.target.value) })}
                  helperText={settings.intermediate_seconds > 300 ? t("Maximum value is number", { number: 300 }) : ""}
                />
              </Grid>
              <Grid item lg={3} md={6} sm={6}>
                <TextField
                  error={
                    settings.expert_seconds < 10 ||
                    settings.expert_seconds > 300 ||
                    settings.expert_seconds === 0 ||
                    settings.expert_seconds === ""
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
                  onChange={(e) => setSettings({ ...settings, expert_seconds: Number(e.target.value) })}
                  helperText={settings.expert_seconds > 300 ? t("Maximum value is number", { number: 300 }) : ""}
                />
              </Grid>
              <Grid item lg={3} md={6} sm={6}>
                <TextField
                  error={
                    settings.advanced_seconds > 300 ||
                    settings.advanced_seconds < 10 ||
                    settings.advanced_seconds === 0 ||
                    settings.advanced_seconds === ""
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
                  onChange={(e) => setSettings({ ...settings, advanced_seconds: Number(e.target.value) })}
                  helperText={settings.advanced_seconds > 300 ? t("Maximum value is number", { number: 300 }) : ""}
                />
              </Grid>
              <Grid item xs={12}>
                <Divider />
                <Typography variant="h6">{t("Settings")}</Typography>
              </Grid>
              <Grid item lg={3} md={6} sm={6}>
                <TextField
                  error={
                    settings.diamond_count < 3 ||
                    settings.diamond_count > 25 ||
                    settings.diamond_count === 0 ||
                    settings.diamond_count === ""
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
                  onChange={(e) => setSettings({ ...settings, diamond_count: Number(e.target.value) })}
                  helperText={settings.diamond_count > 25 ? t("Maximum value is number", { number: 25 }) : ""}
                />
              </Grid>
              <Grid item lg={6} md={6} sm={6} xs={12}>
                <TextField
                  error={settings.bonus_point_count === 0 || settings.bonus_point_count === "" ? true : false}
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
                  onChange={(e) => setSettings({ ...settings, bonus_point_count: Number(e.target.value) })}
                  helperText={settings.bonus_point_count > 500 ? t("Maximum value is number", { number: 500 }) : ""}
                />
              </Grid>
              <Grid item lg={3} md={6} sm={6}>
                <TextField
                  error={
                    settings.shape_count < 1 ||
                    settings.shape_count > 4 ||
                    settings.shape_count === 0 ||
                    settings.shape_count === ""
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
                  onChange={(e) => setSettings({ ...settings, shape_count: Number(e.target.value) })}
                  helperText={settings.shape_count > 4 ? t("Maximum value is number", { number: 4 }) : ""}
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
                  onChange={(e) => setSettings({ ...settings, x_changes_in_level_count: Number(e.target.value) })}
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
                  onChange={(e) => setSettings({ ...settings, x_diamond_count: Number(e.target.value) })}
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
                  onChange={(e) => setSettings({ ...settings, y_changes_in_level_count: Number(e.target.value) })}
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
                  onChange={(e) => setSettings({ ...settings, y_shape_count: Number(e.target.value) })}
                />
              </Grid>
            </Grid>
          )}
        </Container>
      </MuiThemeProvider>

      <Grid
        container
        direction="column"
        alignItems="flex-end"
        spacing={1}
        style={{ position: "fixed", bottom: 24, right: 24, width: "auto" }}
      >
        {!!value && (
          <Grid item>
            <Tooltip title={t("Duplicate this activity and save it with a new title.")}>
              <Fab
                color="primary"
                aria-label="Duplicate"
                variant="extended"
                onClick={() => {
                  if (validate()) {
                    setLoading(true)
                    onSave(
                      {
                        id: undefined,
                        name: text,
                        spec: value?.spec,
                        schedule: [],
                        settings: settings,
                        description: description,
                        photo: photo,
                        studyID: studyId,
                      },
                      true /* duplicate */
                    )
                  }
                }}
                disabled={
                  !validate() ||
                  !disabled ||
                  !onSave ||
                  !text ||
                  (value.name.trim() === text.trim() && value.parentID === studyId)
                }
              >
                {t("Duplicate")}
                <span style={{ width: 8 }} />
                <Icon>file_copy</Icon>
              </Fab>
            </Tooltip>
          </Grid>
        )}
        <Grid item>
          <Tooltip title={t("Save this activity.")}>
            <Fab
              color="secondary"
              aria-label="Save"
              variant="extended"
              onClick={() => {
                if (validate()) {
                  setLoading(true)
                  onSave(
                    {
                      id: value?.id ?? undefined,
                      name: text,
                      spec: value?.spec ?? activitySpecId,
                      schedule: [],
                      settings: settings,
                      description: description,
                      photo: photo,
                      studyID: studyId,
                    },
                    false /* overwrite */
                  )
                }
              }}
              disabled={!validate() || !disabled || !onSave || !text}
            >
              {t("Save")}
              <span style={{ width: 8 }} />
              <Icon>save</Icon>
            </Fab>
          </Tooltip>
        </Grid>
      </Grid>
    </Grid>
  )
}
