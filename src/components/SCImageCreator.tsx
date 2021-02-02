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
import ScratchCard from "../icons/ScratchCard.svg"
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

export default function SCImageCreator({
  activities,
  value,
  onSave,
  onCancel,
  activitySpecId,
  details,
  studies,
  study,
  ...props
}: {
  activities?: any
  value?: any
  onSave?: any
  onCancel?: any
  activitySpecId?: string
  details?: any
  studies?: any
  study?: any
}) {
  const { enqueueSnackbar } = useSnackbar()
  const classes = useStyles()
  const [text, setText] = useState(!!value ? value.name : undefined)
  const [description, setDescription] = useState(details?.description ?? null)
  const [photo, setPhoto] = useState(details?.photo ?? ScratchCard)
  const [disabled, setDisabled] = useState(true)
  const [loading, setLoading] = React.useState(false)
  const [studyId, setStudyId] = useState(!!value ? value.parentID : study)
  const [settings, setSettings] = useState(!!value ? value?.settings : { threshold: 80 })
  const { t } = useTranslation()

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
        enqueueSnackbar(t("Activity with same name already exist."), { variant: "error" })
      }
    }
    return !(
      typeof studyId == "undefined" ||
      studyId === null ||
      studyId === "" ||
      duplicates.length > 0 ||
      typeof text === "undefined" ||
      (typeof text !== "undefined" && text?.trim() === "")
    )
  }

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
                        ? "Please select the study"
                        : ""
                    }
                    variant="filled"
                    disabled={!!value || !!study ? true : false}
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
              <br />
              <Box>
                <TextField
                  fullWidth
                  label={t("Threshold")}
                  error={
                    settings.threshold < 30 ||
                    settings.threshold > 90 ||
                    settings.threshold === 0 ||
                    settings.threshold === ""
                      ? true
                      : false
                  }
                  type="number"
                  variant="filled"
                  defaultValue={settings?.threshold ?? 80}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    max: 90,
                    min: 30,
                  }}
                  onChange={(e) => setSettings({ ...settings, threshold: Number(e.target.value) })}
                  helperText={settings.threshold > 100 ? t("Maximum value is number", { number: 90 }) : ""}
                />
              </Box>
            </Grid>
          </Grid>
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
                        description: description,
                        photo: photo,
                        studyID: studyId,
                        settings: settings,
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
                Duplicate
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
                      description: description,
                      photo: photo,
                      studyID: studyId,
                      settings: settings,
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
