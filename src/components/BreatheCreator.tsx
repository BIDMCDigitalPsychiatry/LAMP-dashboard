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
  withStyles,
  ButtonBase,
  Container,
  Backdrop,
  CircularProgress,
  Checkbox,
} from "@material-ui/core"
import { useDropzone } from "react-dropzone"
import { CheckboxProps } from "@material-ui/core/Checkbox"
import DeleteIcon from "@material-ui/icons/Delete"
import AudiotrackIcon from "@material-ui/icons/Audiotrack"

import { makeStyles, Theme, createStyles, createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import { useSnackbar } from "notistack"
import BreatheIcon from "../icons/Breathe.svg"
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

    input: {
      display: "none",
    },

    btnText: {
      color: "#333",
      fontSize: 14,
      lineHeight: "38px",
      cursor: "pointer",
      textTransform: "capitalize",
      boxShadow: "none",
      border: "#7599FF solid 1px",
      background: "transparent",
      margin: "15px 0",
      "& svg": { marginRight: 5, color: "#7599FF" },
    },
    iconBtn: { background: "white", boxShadow: "none", marginLeft: 15, color: "#7599FF", width: 48, height: 48 },
  })
)
const PeachCheckbox = withStyles({
  root: {
    color: "#FEAC98",
    "&$checked": {
      color: "#FEAC98",
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color="default" {...props} />)

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

function getBase64(file, cb) {
  let reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onloadend = () => {
    cb(reader.result)
  }
  reader.onerror = function (error) {
    console.log("Error: ", error)
  }
}
export default function BreatheCreator({
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
  console.log(study)
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = React.useState(false)
  const [studyId, setStudyId] = useState(!!value ? value.parentID : study)
  const [disabled, setDisabled] = useState(true)
  const [text, setText] = useState(!!value ? value.name : undefined)
  const [description, setDescription] = useState(details?.description ?? null)
  const [photo, setPhoto] = useState(details?.photo ?? BreatheIcon)
  const { t } = useTranslation()
  const [settings, setSettings] = useState(
    !!value
      ? value?.settings
      : (value?.spec && ["lamp.breathe"].includes(value.spec)) || ["lamp.breathe"].includes(activitySpecId)
      ? {
          audio: null,
          audio_name: null,
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

  useEffect(() => {
    if (
      (photo === null && value?.spec && ["lamp.breathe"].includes(value.spec)) ||
      ["lamp.breathe"].includes(activitySpecId)
    ) {
      setPhoto(BreatheIcon)
    }
  }, [])
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
    if ((value?.spec && ["lamp.breathe"].includes(value.spec)) || ["lamp.breathe"].includes(activitySpecId)) {
      return !(
        typeof studyId == "undefined" ||
        studyId === null ||
        studyId === "" ||
        duplicates.length > 0 ||
        (typeof text !== "undefined" && text?.trim() === "")
      )
    } else {
      return !(
        duplicates.length > 0 ||
        typeof text === "undefined" ||
        (typeof text !== "undefined" && text?.trim() === "")
      )
    }
  }
  const setAudioFileChange = (event) => {
    const file = event.target.files[0]
    const fileSize = event.target.files[0].size / 1024 / 1024
    const audioFormats = ["audio/mpeg", "audio/wav", "audio/x-m4a", "audio/ogg"]
    const fileName = file.name
    if (fileSize <= 2 && audioFormats.includes(file.type.toLowerCase())) {
      setLoading(true)
      file &&
        getBase64(file, (result) => {
          setSettings({ ...settings, audio: result, audio_name: fileName })
          setLoading(false)
        })
    } else {
      if (!audioFormats.includes(file.type.toLowerCase())) {
        enqueueSnackbar(t("Not supported audio type."), {
          variant: "error",
        })
      } else {
        enqueueSnackbar(t("The audio size should not exceed 2 MB."), {
          variant: "error",
        })
      }
    }
  }
  const handleRemoveExistingEvent = (event) => {
    event.target.value = null
  }

  const validURL = (audioURL: string) => {
    let pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + //port
      "(\\?[;&amp;a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    )
    return pattern.test(audioURL)
  }

  return (
    <Grid container direction="column" spacing={2} {...props}>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <MuiThemeProvider theme={theme}>
        <Container className={classes.containerWidth}>
          <Grid container spacing={2}>
            <Grid item xs>
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
                <Grid item sm={4}>
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
                        ? t("Please select the Study")
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
              <Grid item xs={12} spacing={2}>
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
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Divider />
                  <Typography variant="h6">{t("Settings")}</Typography>
                </Grid>
                <Divider />
                <Grid item xs={12} spacing={2}>
                  <Box mb={3}>
                    <TextField
                      error={
                        (settings?.audio_url?.trim() ?? "") === "" ||
                        ((settings?.audio_url?.trim() ?? "") !== "" && !validURL(settings.audio_url))
                          ? true
                          : false
                      }
                      fullWidth
                      variant="filled"
                      label={t("Audio URL")}
                      defaultValue={settings?.audio_url ?? ""}
                      onChange={(event) => setSettings({ ...settings, audio_url: event.target.value })}
                    />
                  </Box>
                </Grid>
                <Grid item xs>
                  <label htmlFor="upload-audio">
                    <TextField
                      className={classes.input}
                      id="upload-audio"
                      name="upload-audio"
                      type="file"
                      onClick={(event) => handleRemoveExistingEvent(event)}
                      onChange={(event) => setAudioFileChange(event)}
                    />

                    <Fab component="span" className={classes.btnText} aria-label="Upload-Audio" variant="extended">
                      <AudiotrackIcon /> {t("Upload audio")}
                    </Fab>
                  </label>

                  <Grid container direction="row" justify="flex-start" alignItems="center">
                    <Grid>
                      {settings.audio && (
                        <audio controls src={settings.audio}>
                          {t("Your browser does not support the")}
                          <code>{t("audio")}</code> {t("element.")}
                        </audio>
                      )}
                    </Grid>
                    {settings.audio_name && settings.audio_name}
                    <Grid>
                      {settings.audio && (
                        <Fab
                          className={classes.iconBtn}
                          aria-label="Remove-Audio"
                          variant="extended"
                          onClick={() => setSettings({ ...settings, audio: null, audio_name: null })}
                        >
                          <DeleteIcon />
                        </Fab>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
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
            <Tooltip title={t("Duplicate this survey instrument and save it with a new title.")}>
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
