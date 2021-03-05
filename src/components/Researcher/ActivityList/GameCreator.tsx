// Core Imports
import React, { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"

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
import { makeStyles, Theme, createStyles, createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import { useSnackbar } from "notistack"
import Jewels from "../../../icons/Jewels.svg"
import { useTranslation } from "react-i18next"
import BalloonRisk from "./BalloonRisk"
import PopTheBubbles from "./PopTheBubbles"
import SpatialSpan from "./SpatialSpan"
import JewelsGame from "./Jewels"
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
    mL14: {
      marginLeft: "14px",
    },
  })
)

export default function GameCreator({
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
  const defaultBallonCount = 15
  const defaultMean = 64.5
  const defaultSD = 37
  const defaultBubbleCount = [60, 80, 80]
  const defaultBubbleSpeed = [60, 80, 80]
  const defaultIntertrialDuration = 0.5
  const defaultBubbleDuration = 1.0
  const { enqueueSnackbar } = useSnackbar()
  const classes = useStyles()
  const [text, setText] = useState(!!value ? value.name : "")
  const [description, setDescription] = useState(details?.description ?? null)
  const [photo, setPhoto] = useState(
    details?.photo
      ? details?.photo
      : (value?.spec && ["lamp.jewels_a", "lamp.jewels_b"].includes(value.spec)) ||
        (!!activitySpecId && ["lamp.jewels_a", "lamp.jewels_b"].includes(activitySpecId))
      ? Jewels
      : null
  )

  const [disabled, setDisabled] = useState(true)
  const [loading, setLoading] = React.useState(false)
  const [studyId, setStudyId] = useState(!!value ? value.study_id : study)
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
      : ["lamp.balloon_risk"].includes(activitySpecId)
      ? {
          balloon_count: defaultBallonCount,
          breakpoint_mean: defaultMean,
          breakpoint_std: defaultSD,
        }
      : ["lamp.pop_the_bubbles"].includes(activitySpecId)
      ? {
          bubble_count: defaultBubbleCount,
          bubble_speed: defaultBubbleSpeed,
          intertrial_duration: defaultIntertrialDuration,
          bubble_duration: defaultBubbleDuration,
        }
      : {}
  )

  const validate = () => {
    let duplicates = []
    if (typeof text !== "undefined" && text?.trim() !== "") {
      duplicates = activities.filter(
        (x) =>
          (!!value
            ? x.name.toLowerCase() === text?.trim().toLowerCase() && x.id !== value?.id
            : x.name.toLowerCase() === text?.trim().toLowerCase()) && studyId === x.study_id
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
    } else if (
      (value?.spec && ["lamp.balloon_risk"].includes(value.spec)) ||
      ["lamp.balloon_risk"].includes(activitySpecId)
    ) {
      return !(
        typeof studyId == "undefined" ||
        studyId === null ||
        studyId === "" ||
        duplicates.length > 0 ||
        settings.balloon_count === 0 ||
        settings.balloon_count === "" ||
        settings.breakpoint_mean === 0 ||
        settings.breakpoint_mean === "" ||
        settings.breakpoint_std === 0 ||
        settings.breakpoint_std === ""
      )
    } else if (
      (value?.spec && ["lamp.pop_the_bubbles"].includes(value.spec)) ||
      ["lamp.pop_the_bubbles"].includes(activitySpecId)
    ) {
      return !(
        typeof studyId == "undefined" ||
        studyId === null ||
        studyId === "" ||
        duplicates.length > 0 ||
        settings.bubble_count === 0 ||
        settings.bubble_count === "" ||
        settings.bubble_speed === 0 ||
        settings.bubble_speed === "" ||
        settings.intertrial_duration === 0 ||
        settings.intertrial_duration === "" ||
        settings.bubble_duration === 0 ||
        settings.bubble_duration === ""
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

  const handleChange = (data) => {
    setText(data.text)
    setDescription(data.description)
    setPhoto(data.photo)
    setStudyId(data.studyId)
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
          />

          {((value?.spec && "lamp.balloon_risk" === value.spec) || "lamp.balloon_risk" === activitySpecId) && (
            <BalloonRisk settings={settings} updateSettings={(data) => setSettings(data)} />
          )}

          {((value?.spec && "lamp.pop_the_bubbles" === value.spec) || "lamp.pop_the_bubbles" === activitySpecId) && (
            <PopTheBubbles settings={settings} updateSettings={(data) => setSettings(data)} />
          )}

          {((value?.spec && "lamp.spatial_span" === value.spec) || "lamp.spatial_span" === activitySpecId) && (
            <SpatialSpan settings={settings} updateSettings={(data) => setSettings(data)} />
          )}

          {((value?.spec && ["lamp.jewels_a", "lamp.jewels_b"].includes(value.spec)) ||
            ["lamp.jewels_a", "lamp.jewels_b"].includes(activitySpecId)) && (
            <JewelsGame settings={settings} updateSettings={(data) => setSettings(data)} />
          )}
        </Container>
      </MuiThemeProvider>
      <ActivityFooter
        onSave={onSave}
        validate={validate}
        value={value}
        data={{
          id: value?.id ?? undefined,
          name: text,
          spec: value?.spec ?? activitySpecId,
          schedule: [],
          settings: settings,
          description: description,
          photo: photo,
          studyID: studyId,
        }}
        disabled={disabled}
      />
    </Grid>
  )
}
