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
  Button,
  Container,
  Backdrop,
  CircularProgress,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core"
import AddIcon from "@material-ui/icons/Add"

import { useDropzone } from "react-dropzone"
import { CheckboxProps } from "@material-ui/core/Checkbox"
import DeleteIcon from "@material-ui/icons/Delete"
import AudiotrackIcon from "@material-ui/icons/Audiotrack"

import { makeStyles, Theme, createStyles, createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import { useSnackbar } from "notistack"
import BreatheIcon from "../icons/Breathe.svg"
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
    cardHeader: {
      textalign: "center",
      align: "center",
      backgroundColor: "white",
    },
    input: {
      display: "none",
    },
    button: {
      color: "blue",
      margin: 10,
    },
    btnpeach: {
      background: "#FFAC98",
      padding: "15px 25px 15px 25px",
      borderRadius: "40px",
      minWidth: "200px",
      boxShadow: " 0px 10px 15px rgba(255, 172, 152, 0.25)",
      lineHeight: "22px",
      display: "inline-block",
      textTransform: "capitalize",
      fontSize: "16px",
      color: "rgba(0, 0, 0, 0.75)",
      fontWeight: "bold",
      cursor: "pointer",
      "& span": { cursor: "pointer" },
      "&:hover": {
        background: "#FFAC98",
        boxShadow:
          "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
        textDecoration: "none",
      },
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
    reader.onerror = (error) => reject(error)
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
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = React.useState(false)
  const [studyId, setStudyId] = useState(!!value ? value.parentID : undefined)
  const [disabled, setDisabled] = useState(true)
  const [text, setText] = useState(!!value ? value.name : undefined)
  const [description, setDescription] = useState(details?.description ?? null)
  const [photo, setPhoto] = useState(details?.photo ?? BreatheIcon)
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
        enqueueSnackbar("Image size should not exceed 5 MB.", { variant: "error" })
      } else if ("image" !== rejectedFiles[0].type.split("/")[0]) {
        enqueueSnackbar("Not supported image type.", { variant: "error" })
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
        enqueueSnackbar("Activity with same name already exist.", { variant: "error" })
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
    console.log("fileName", fileName)
    if (fileSize <= 2 && audioFormats.includes(file.type.toLowerCase())) {
      setLoading(true)
      file &&
        getBase64(file, (result) => {
          setSettings({ ...settings, audio: result, audio_name: fileName })
          setLoading(false)
        })
    } else {
      if (!audioFormats.includes(file.type.toLowerCase())) {
        enqueueSnackbar("Not supported audio type.", {
          variant: "error",
        })
      } else {
        enqueueSnackbar("The audio size should not exceed 2 MB.", {
          variant: "error",
        })
      }
    }
  }
  const handleRemoveExistingEvent = (event) => {
    event.target.value = null
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
                    ? "Drag a photo or tap to select a photo."
                    : "Drag a photo to replace the existing photo or tap to delete the photo."
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
                    label="Select"
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
                    disabled={!!value ? true : false}
                  >
                    {studies.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
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
                      label="Activity Title"
                      defaultValue={text}
                      onChange={(event) => setText(event.target.value)}
                      inputProps={{ maxLength: 80 }}
                    />
                  </Box>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Box>
                  <TextField
                    fullWidth
                    multiline
                    label="Activity Description"
                    variant="filled"
                    rows={2}
                    defaultValue={description}
                    onChange={(event) => setDescription(event.target.value)}
                    inputProps={{ maxLength: 350 }}
                  />
                </Box>
              </Grid>
              <Grid container spacing={2}>
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
                      <AudiotrackIcon /> Upload audio
                    </Fab>
                  </label>

                  <Grid container direction="row" justify="flex-start" alignItems="center">
                    <Grid>
                      {settings.audio && (
                        <audio controls src={settings.audio}>
                          Your browser does not support the
                          <code>audio</code> element.
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
            <Tooltip title="Duplicate this survey instrument and save it with a new title.">
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
                Duplicate
                <span style={{ width: 8 }} />
                <Icon>file_copy</Icon>
              </Fab>
            </Tooltip>
          </Grid>
        )}
        <Grid item>
          <Tooltip title="Save this activity.">
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
              Save
              <span style={{ width: 8 }} />
              <Icon>save</Icon>
            </Fab>
          </Tooltip>
        </Grid>
      </Grid>

      {/* <Grid container spacing={2}>
  Count: {count}
  <button onClick={() => setCount(initialCount)}>Reset</button>
  <button onClick={() => setCount(prevCount => prevCount - 1)}>-</button>
  <button onClick={() => setCount(prevCount => prevCount + 1)}>+</button>
  </Grid> */}
    </Grid>
  )
}
