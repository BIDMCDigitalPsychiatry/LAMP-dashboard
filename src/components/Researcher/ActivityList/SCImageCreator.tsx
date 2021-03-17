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
import ScratchCard from "../../../icons/ScratchCard.svg"
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
  onSave?: Function
  onCancel?: Function
  activitySpecId?: string
  details?: any
  studies?: any
  study?: string
}) {
  const { enqueueSnackbar } = useSnackbar()
  const classes = useStyles()
  const [loading, setLoading] = React.useState(false)
  const [settings, setSettings] = useState(!!value ? value?.settings : { threshold: 80 })
  const { t } = useTranslation()
  const [data, setData] = useState({
    id: value?.id ?? undefined,
    name: "",
    spec: value?.spec ?? activitySpecId,
    schedule: [],
    description: "",
    photo: null,
    settings: !!value ? value?.settings : { threshold: 80 },
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
    return !(
      typeof data.studyID == "undefined" ||
      data.studyID === null ||
      data.studyID === "" ||
      duplicates.length > 0 ||
      settings.threshold > 90 ||
      typeof data.name === "undefined" ||
      (typeof data.name !== "undefined" && data.name?.trim() === "")
    )
  }

  const handleChange = (details) => {
    setData({
      id: value?.id ?? undefined,
      name: details.text,
      spec: value?.spec ?? activitySpecId,
      schedule: [],
      description: details.description,
      photo: details.photo,
      studyID: details.studyId,
      settings: data.settings,
    })
  }

  const updateSettings = (settingsData) => {
    setData({ ...data, settings: { threshold: settingsData } })
    setSettings({ threshold: settingsData })
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
            image={ScratchCard}
          />
          <Grid container spacing={2}>
            <Grid item lg={4}>
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
                  onChange={(e) => updateSettings(Number(e.target.value))}
                  helperText={settings.threshold > 90 ? t("Maximum value is number", { number: 90 }) : ""}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </MuiThemeProvider>

      <ActivityFooter onSave={onSave} validate={validate} value={value} data={data} />
    </Grid>
  )
}
