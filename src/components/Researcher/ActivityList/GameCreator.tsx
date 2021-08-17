// Core Imports
import React, { useState, useEffect } from "react"
import {
  Grid,
  Container,
  Backdrop,
  CircularProgress,
  makeStyles,
  Theme,
  createStyles,
  Box,
  Typography,
  Icon,
} from "@material-ui/core"
import { useSnackbar } from "notistack"
import Jewels from "../../../icons/Jewels.svg"
import { useTranslation } from "react-i18next"
import ActivityHeader from "./ActivityHeader"
import ActivityFooter from "./ActivityFooter"
import DynamicForm from "../../shared/DynamicForm"
import { SchemaList } from "./ActivityMethods"
import ScratchCard from "../../../icons/ScratchCard.svg"
import JournalIcon from "../../../icons/Journal.svg"
import BreatheIcon from "../../../icons/Breathe.svg"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    containerWidth: { maxWidth: 1055 },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
    errorcustom: {
      "& span": { color: "#f44336", minWidth: "56px" },
      "& h6": { fontSize: "1.25rem", fontWeight: "normal" },
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
  const [schemaListObj, setSchemaListObj] = React.useState({})
  const [fileMB, setFileMB] = React.useState(0)
  const { t } = useTranslation()
  const breatheFileLimit = 10

  useEffect(() => {
    setSchemaListObj(SchemaList())
  }, [])

  const [data, setData] = useState({
    id: value?.id ?? undefined,
    name: value?.name ?? "",
    spec: value?.spec ?? activitySpecId,
    schedule: [],
    description: "",
    photo: details?.photo ?? null,
    settings: !!value ? value.settings : {},
    studyID: !!value ? value.study_id : study,
  })

  const validate = () => {
    let duplicates = []
    if (typeof data.name !== "undefined" && data.name?.trim() !== "") {
      duplicates = activities.filter(
        (x) =>
          (!!value
            ? x.name?.toLowerCase() === data.name?.trim().toLowerCase() && x.id !== value?.id
            : x.name?.toLowerCase() === data.name?.trim().toLowerCase()) && data.studyID === x.study_id
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
        typeof data.studyID == "undefined" ||
        data.studyID === null ||
        data.studyID === "" ||
        duplicates.length > 0 ||
        data.settings?.beginner_seconds > 300 ||
        data.settings?.beginner_seconds === 0 ||
        data.settings?.beginner_seconds === "" ||
        typeof data.settings?.beginner_seconds == "undefined" ||
        data.settings?.intermediate_seconds > 300 ||
        data.settings?.intermediate_seconds === 0 ||
        data.settings?.intermediate_seconds === "" ||
        typeof data.settings?.intermediate_seconds == "undefined" ||
        data.settings?.advanced_seconds > 300 ||
        data.settings?.advanced_seconds === 0 ||
        data.settings?.advanced_seconds === "" ||
        typeof data.settings?.advanced_seconds == "undefined" ||
        data.settings?.expert_seconds > 300 ||
        data.settings?.expert_seconds === 0 ||
        data.settings?.expert_seconds === "" ||
        typeof data.settings?.expert_seconds == "undefined" ||
        data.settings?.diamond_count > 25 ||
        data.settings?.diamond_count === 0 ||
        data.settings?.diamond_count === "" ||
        data.settings?.bonus_point_count === 0 ||
        data.settings?.bonus_point_count === "" ||
        data.settings?.shape_count > 4 ||
        data.settings?.shape_count === 0 ||
        data.settings?.shape_count === "" ||
        typeof data.settings?.shape_count === "undefined" ||
        typeof data.settings?.bonus_point_count === "undefined" ||
        typeof data.settings?.diamond_count === "undefined" ||
        typeof data.name === "undefined" ||
        data.settings?.beginner_seconds < 30 ||
        data.settings?.intermediate_seconds < 10 ||
        data.settings?.expert_seconds < 10 ||
        data.settings?.advanced_seconds < 10 ||
        data.settings?.diamond_count < 3 ||
        data.settings?.shape_count < 1 ||
        (typeof data.name !== "undefined" && data.name?.trim() === "")
      )
    } else if (
      (value?.spec && ["lamp.balloon_risk"].includes(value.spec)) ||
      ["lamp.balloon_risk"].includes(activitySpecId)
    ) {
      return !(
        typeof data.studyID == "undefined" ||
        data.studyID === null ||
        data.studyID === "" ||
        duplicates.length > 0 ||
        data.settings?.balloon_count === 0 ||
        data.settings?.balloon_count === "" ||
        data.settings?.breakpoint_mean === 0 ||
        data.settings?.breakpoint_mean === "" ||
        data.settings?.breakpoint_std === 0 ||
        data.settings?.breakpoint_std === "" ||
        typeof data.settings?.breakpoint_std === "undefined" ||
        typeof data.settings?.balloon_count === "undefined" ||
        typeof data.settings?.breakpoint_mean === "undefined" ||
        typeof data.name === "undefined" ||
        (typeof data.name !== "undefined" && data.name?.trim() === "")
      )
    } else if (
      (value?.spec && ["lamp.pop_the_bubbles"].includes(value.spec)) ||
      ["lamp.pop_the_bubbles"].includes(activitySpecId)
    ) {
      return !(
        typeof data.studyID == "undefined" ||
        data.studyID === null ||
        data.studyID === "" ||
        duplicates.length > 0 ||
        data.settings?.bubble_count === 0 ||
        data.settings?.bubble_count === "" ||
        data.settings?.bubble_speed === 0 ||
        data.settings?.bubble_speed === "" ||
        data.settings?.intertrial_duration === 0 ||
        data.settings?.intertrial_duration === "" ||
        data.settings?.bubble_duration === 0 ||
        data.settings?.bubble_duration === "" ||
        typeof data.settings?.bubble_duration === "undefined" ||
        typeof data.settings?.intertrial_duration === "undefined" ||
        data.settings?.bubble_count.filter((d) => typeof d === "undefined" || d === null).length > 0 ||
        data.settings?.bubble_speed.filter((d) => typeof d === "undefined" || d === null).length > 0 ||
        typeof data.name === "undefined" ||
        (typeof data.name !== "undefined" && data.name?.trim() === "")
      )
    } else if (["lamp.scratch_image"].includes(activitySpecId)) {
      return !(
        typeof data.studyID == "undefined" ||
        data.studyID === null ||
        data.studyID === "" ||
        duplicates.length > 0 ||
        data.settings.threshold > 90 ||
        typeof data.name === "undefined" ||
        (typeof data.name !== "undefined" && data.name?.trim() === "")
      )
    } else if (activitySpecId === "lamp.dbt_diary_card") {
      let validateEffective = false
      if (data.settings && data.settings.targetEffective !== undefined) {
        if (data.settings.targetEffective.length > 0) {
          validateEffective = data.settings.targetEffective.some((item) => {
            return (
              item.target === "" ||
              typeof item.target === "undefined" ||
              item.measure === "" ||
              typeof item.measure === "undefined"
            )
          })
        } else {
          validateEffective = true
        }
      } else {
        validateEffective = true
      }
      let validateInEffective = false
      if (data.settings && data.settings.targetIneffective !== undefined) {
        if (data.settings.targetIneffective.length > 0) {
          validateInEffective = data.settings.targetIneffective.some((item) => {
            return (
              item.target === "" ||
              typeof item.target === "undefined" ||
              item.measure === "" ||
              typeof item.measure === "undefined"
            )
          })
        } else {
          validateInEffective = true
        }
      } else {
        validateInEffective = true
      }
      let validateEmotions = false
      if (data.settings && data.settings.emotions !== undefined) {
        if (data.settings.emotions.length > 0) {
          validateEmotions = data.settings.emotions.some((item) => {
            return item.emotion === "" || typeof item.emotion === "undefined"
          })
        } else {
          validateEmotions = true
        }
      } else {
        validateEmotions = true
      }
      return !(
        typeof data.studyID == "undefined" ||
        data.studyID === null ||
        data.studyID === "" ||
        duplicates.length > 0 ||
        typeof data.name === "undefined" ||
        (typeof data.name !== "undefined" && data.name?.trim() === "") ||
        validateEffective ||
        validateInEffective ||
        validateEmotions
      )
    } else {
      if (activitySpecId === "lamp.breathe") {
        validateAudioSize()
      }
      return !(
        typeof data.studyID == "undefined" ||
        data.studyID === null ||
        data.studyID === "" ||
        duplicates.length > 0 ||
        typeof data.name === "undefined" ||
        (typeof data.name !== "undefined" && data.name?.trim() === "") ||
        fileMB > breatheFileLimit
      )
    }
  }

  const handleChange = (details) => {
    setData({
      id: value?.id ?? undefined,
      name: details.text,
      spec: value?.spec ?? activitySpecId,
      schedule: [],
      settings: data.settings,
      description: details.description,
      photo: details.photo,
      studyID: details.studyId,
    })
  }

  const validateAudioSize = () => {
    setFileMB(0)
    let settingsData = data.settings
    let b64Settings = settingsData ? settingsData.audio : ""
    let totalSizeMB = 0
    if (b64Settings) {
      let stringLength = b64Settings.length - "data:audio/mpeg;base64,".length
      let sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383812
      totalSizeMB = sizeInBytes / Math.pow(1024, 2)
    }
    setFileMB(totalSizeMB)
    return totalSizeMB
  }

  const updateSettings = (settingsData) => {
    setData({ ...data, settings: settingsData?.settings })
  }

  return (
    <Grid container direction="column" spacing={2} {...props}>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Container className={classes.containerWidth}>
        <ActivityHeader
          studies={studies}
          value={value}
          details={details}
          activitySpecId={activitySpecId}
          study={data?.studyID ?? ""}
          onChange={handleChange}
          image={
            (value?.spec && ["lamp.jewels_a", "lamp.jewels_b"].includes(value.spec)) ||
            ["lamp.jewels_a", "lamp.jewels_b"].includes(activitySpecId)
              ? Jewels
              : (value?.spec && "lamp.scratch_image" === value.spec) || "lamp.scratch_image" === activitySpecId
              ? ScratchCard
              : (value?.spec && "lamp.journal" === value.spec) || "lamp.journal" === activitySpecId
              ? JournalIcon
              : (value?.spec && "lamp.breathe" === value.spec) || "lamp.breathe" === activitySpecId
              ? BreatheIcon
              : null
          }
        />
        {fileMB > breatheFileLimit && (
          <Box my={2} p={2} border={1} borderColor="#0000001f" className={classes.errorcustom}>
            <Typography variant="h6">Errors</Typography>
            <Box alignItems="center" display="flex" p={2}>
              <Icon>error</Icon> {t("The audio size should not exceed 10 MB.")}
            </Box>
          </Box>
        )}
        {((value?.spec && Object.keys(schemaListObj).includes(value.spec)) ||
          Object.keys(schemaListObj).includes(activitySpecId)) && (
          <DynamicForm
            schema={schemaListObj[activitySpecId]}
            initialData={data}
            onChange={(x) => {
              updateSettings(x)
            }}
          />
        )}
      </Container>
      <ActivityFooter onSave={onSave} validate={validate} value={value} data={data ?? []} />
    </Grid>
  )
}
