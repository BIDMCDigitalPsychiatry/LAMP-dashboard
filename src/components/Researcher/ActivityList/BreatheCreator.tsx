import React, { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Grid,
  Fab,
  Divider,
  TextField,
  Container,
  Backdrop,
  CircularProgress,
} from "@material-ui/core"
import DeleteIcon from "@material-ui/icons/Delete"
import AudiotrackIcon from "@material-ui/icons/Audiotrack"
import { makeStyles, Theme, createStyles, createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import { useSnackbar } from "notistack"
import BreatheIcon from "../../../icons/Breathe.svg"
import { useTranslation } from "react-i18next"
import ActivityHeader from "./ActivityHeader"
import ActivityFooter from "./ActivityFooter"

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
  onSave?: Function
  onCancel?: Function
  activitySpecId?: string
  details?: any
  studies?: any
  study?: string
}) {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = React.useState(false)
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
  const [data, setData] = useState({
    id: value?.id ?? undefined,
    name: value?.name ?? "",
    spec: value?.spec ?? activitySpecId,
    schedule: [],
    description: "",
    photo: null,
    settings: !!value
      ? value?.settings
      : {
          audio: null,
          audio_name: null,
        },
    studyID: !!value ? value.study_id : study,
  })
  const validate = () => {
    let duplicates = []
    if (typeof data.name !== "undefined" && data.name?.trim() !== "") {
      duplicates = activities.filter(
        (x) =>
          (!!value
            ? x.name.toLowerCase() === data.name?.trim().toLowerCase() && x.id !== value?.id
            : x.name.toLowerCase() === data.name?.trim().toLowerCase()) && data.studyID === x.study_id
      )
      if (duplicates.length > 0) {
        enqueueSnackbar(t("Activity with same name already exist."), { variant: "error" })
      }
    }
    if ((value?.spec && ["lamp.breathe"].includes(value.spec)) || ["lamp.breathe"].includes(activitySpecId)) {
      return !(
        typeof data.studyID == "undefined" ||
        data.studyID === null ||
        data.studyID === "" ||
        duplicates.length > 0 ||
        (typeof data.name !== "undefined" && data.name?.trim() === "")
      )
    } else {
      return !(
        duplicates.length > 0 ||
        typeof data.name === "undefined" ||
        (typeof data.name !== "undefined" && data.name?.trim() === "")
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

  const handleChange = (details) => {
    setData({
      id: value?.id ?? undefined,
      name: details.text,
      spec: value?.spec ?? activitySpecId,
      schedule: [],
      settings: settings,
      description: details.description,
      photo: details.photo,
      studyID: details.studyId,
    })
  }

  useEffect(() => {
    setData({ ...data, settings: settings })
  }, [settings])

  const updateSettings = (settingsData) => {
    setSettings(settingsData)
  }

  return (
    <Grid container direction="column" spacing={2} {...props}>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <MuiThemeProvider theme={theme}>
        <Container className={classes.containerWidth}>
          <ActivityHeader
            studies={studies}
            value={value}
            details={details}
            activitySpecId={activitySpecId}
            study={study}
            onChange={handleChange}
            image={BreatheIcon}
          />
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
                    ((settings?.audio_url?.trim() ?? "") !== "" && !validURL(settings?.audio_url ?? null))
                      ? true
                      : false
                  }
                  fullWidth
                  variant="filled"
                  label={t("Audio URL")}
                  defaultValue={settings?.audio_url ?? ""}
                  onChange={(event) => updateSettings({ ...settings, audio_url: event.target.value })}
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
                  {!!settings?.audio && (
                    <audio controls src={settings?.audio ?? null}>
                      {t("Your browser does not support the")}
                      <code>{t("audio")}</code> {t("element.")}
                    </audio>
                  )}
                </Grid>
                {!!settings?.audio_name ?? null}
                <Grid>
                  {settings?.audio && (
                    <Fab
                      className={classes.iconBtn}
                      aria-label="Remove-Audio"
                      variant="extended"
                      onClick={() => updateSettings({ ...settings, audio: null, audio_name: null })}
                    >
                      <DeleteIcon />
                    </Fab>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </MuiThemeProvider>
      <ActivityFooter onSave={onSave} validate={validate} value={value} data={data} />
    </Grid>
  )
}
