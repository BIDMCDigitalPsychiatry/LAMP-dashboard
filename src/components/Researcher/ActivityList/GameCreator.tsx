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
import LAMP from "lamp-core"
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
    containerWidth: { maxWidth: 1055, marginBottom: "10px" },
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
  const { t } = useTranslation()
  const breatheFileLimit = 10

  useEffect(() => {
    setSchemaListObj(SchemaList())
  }, [])

  useEffect(() => {
    if (
      Object.keys(schemaListObj).length > 0 &&
      !(
        (value?.spec && Object.keys(schemaListObj).includes(value.spec)) ||
        Object.keys(schemaListObj).includes(activitySpecId)
      )
    ) {
      const spec = value?.spec ?? activitySpecId
      let scheme = []
      LAMP.ActivitySpec.view(spec).then((ActivitySpec) => {
        if (!!ActivitySpec?.settings) {
          scheme[spec] = ActivitySpec?.settings
          setSchemaListObj(scheme)
        }
      })
    }
  }, [schemaListObj])

  const [data, setData] = useState({
    id: value?.id ?? undefined,
    name: value?.name ?? "",
    spec: value?.spec ?? activitySpecId,
    schedule: !!value ? value?.schedule : [],
    description: "",
    photo: details?.photo ?? null,
    streak: details?.streak ?? null,
    showFeed: details?.showFeed ?? null,
    settings: !!value ? value.settings : {},
    studyID: !!value ? value.study_id : study,
    category: value?.category ?? null,
  })

  useEffect(() => {
    validate()
  }, [data])

  const validateQuestions = (questions) => {
    let status = 0
    if (!!questions && questions.length > 0) {
      let optionsArray = []
      {
        ;(questions || []).map((x, idx) => {
          questions[idx].type === "list" ||
          questions[idx].type === "multiselect" ||
          questions[idx].type === "slider" ||
          questions[idx].type === "rating"
            ? !Array.isArray(questions[idx].options) ||
              questions[idx].options === null ||
              (!!questions[idx].options && questions[idx].options.length === 0)
              ? optionsArray.push(1)
              : (questions[idx].options || []).filter(
                  (i) =>
                    (!!i &&
                      (((questions[idx].type === "slider" || questions[idx].type === "rating") && i?.value >= 0) ||
                        ((questions[idx].type === "list" || questions[idx].type === "multiselect") &&
                          (i?.value === 0 ||
                            i?.value === "0" ||
                            (i?.value !== 0 &&
                              i?.value !== "0" &&
                              ((i?.value || "").toString() || "")?.trim().length > 0))))) ||
                    i === ""
                ).length === (questions[idx].options || []).length
              ? optionsArray.push(0)
              : optionsArray.push(1)
            : optionsArray.push(0)
        })
      }

      if (optionsArray.filter((val) => val !== 0).length > 0) {
        status = 1
        return false
      } else {
        status = 0
      }
    }
    if (
      questions.length === 0 ||
      questions.filter((val) => !!val.text && val.text?.trim().length !== 0).length !== questions.length
    ) {
      return false
    } else if (
      questions.filter((q) => ["list", "multiselect", "slider", "rating", "time"].includes(q.type)).length > 0 &&
      status === 1
    ) {
      return false
    }
    return true
  }

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
    if (value?.spec === "lamp.survey" || activitySpecId === "lamp.survey") {
      const status = Object.keys(data.settings).length > 0 ? validateQuestions(data.settings) : false
      return (
        status &&
        !(
          typeof data.studyID == "undefined" ||
          data.studyID === null ||
          data.studyID === "" ||
          duplicates.length > 0 ||
          typeof data.name === "undefined" ||
          (typeof data.name !== "undefined" && data.name?.trim() === "")
        )
      )
    } else if (
      (value?.spec && ["lamp.jewels_a", "lamp.jewels_b"].includes(value.spec)) ||
      ["lamp.jewels_a", "lamp.jewels_b"].includes(activitySpecId)
    ) {
      return validateJewels(duplicates)
    } else if (
      (value?.spec && ["lamp.balloon_risk"].includes(value.spec)) ||
      ["lamp.balloon_risk"].includes(activitySpecId)
    ) {
      return validateBallon(duplicates)
    } else if (
      (value?.spec && ["lamp.pop_the_bubbles"].includes(value.spec)) ||
      ["lamp.pop_the_bubbles"].includes(activitySpecId)
    ) {
      return validatePop(duplicates)
    } else if (
      (value?.spec && ["lamp.scratch_image"].includes(value.spec)) ||
      ["lamp.scratch_image"].includes(activitySpecId)
    ) {
      return !(
        typeof data.studyID == "undefined" ||
        data.studyID === null ||
        data.studyID === "" ||
        duplicates.length > 0 ||
        data.settings?.threshold > 90 ||
        typeof data.name === "undefined" ||
        (typeof data.name !== "undefined" && data.name?.trim() === "")
      )
    } else if (
      (value?.spec && ["lamp.spatial_span", "lamp.cats_and_dogs", "lamp.journal"].includes(value.spec)) ||
      ["lamp.spatial_span", "lamp.cats_and_dogs", "lamp.journal"].includes(activitySpecId)
    ) {
      return !(
        typeof data.studyID == "undefined" ||
        data.studyID === null ||
        data.studyID === "" ||
        duplicates.length > 0 ||
        typeof data.name === "undefined" ||
        (typeof data.name !== "undefined" && data.name?.trim() === "")
      )
    } else if ((value?.spec && value.spec === "lamp.recording") || activitySpecId === "lamp.recording") {
      return validateRecording(duplicates)
    } else if (
      (value?.spec && ["lamp.dbt_diary_card"].includes(value.spec)) ||
      activitySpecId === "lamp.dbt_diary_card"
    ) {
      return validateDBT(duplicates)
    } else if ((value?.spec && ["lamp.breathe"].includes(value.spec)) || activitySpecId === "lamp.breathe") {
      return validateBreathe(duplicates)
    } else if (
      (value?.spec && ["lamp.goals"].includes(value.spec)) ||
      activitySpecId === "lamp.goals" ||
      (value?.spec && ["lamp.medications"].includes(value.spec)) ||
      activitySpecId === "lamp.medications"
    ) {
      return validateGoals(duplicates)
    } else if (
      (value?.spec && ["lamp.emotion_recognition"].includes(value.spec)) ||
      ["lamp.emotion_recognition"].includes(activitySpecId)
    ) {
      return !(
        typeof data.studyID == "undefined" ||
        data.studyID === null ||
        data.studyID === "" ||
        duplicates.length > 0 ||
        typeof data.name === "undefined" ||
        (typeof data.name !== "undefined" && data.name?.trim() === "") ||
        typeof data.settings === "undefined" ||
        (typeof data.settings !== "undefined" && (data?.settings || []).length > 50) ||
        (data?.settings || []).filter((d) => !!d.emotionText).length !== Object.keys(data?.settings || {}).length ||
        (data?.settings || []).filter((d) => !!d.image).length !== Object.keys(data?.settings || {}).length
      )
    } else {
      return !(
        typeof data.studyID == "undefined" ||
        data.studyID === null ||
        data.studyID === "" ||
        duplicates.length > 0 ||
        typeof data.name === "undefined" ||
        (typeof data.name !== "undefined" && data.name?.trim() === "")
      )
    }
  }

  const validateRecording = (duplicates) => {
    return !(
      typeof data.studyID == "undefined" ||
      data.studyID === null ||
      data.studyID === "" ||
      duplicates.length > 0 ||
      typeof data.settings?.record_label === "undefined" ||
      typeof data.settings?.rerecord_label === "undefined" ||
      data.settings?.record_label === "" ||
      data.settings?.rerecord_label === "" ||
      typeof data.name === "undefined" ||
      (typeof data.name !== "undefined" && data.name?.trim() === "")
    )
  }

  const validatePop = (duplicates) => {
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
  }

  const validateBallon = (duplicates) => {
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
  }

  const validateJewels = (duplicates) => {
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
  }

  const validateGoals = (duplicates) => {
    return !(
      typeof data.studyID == "undefined" ||
      data.studyID === null ||
      data.studyID === "" ||
      duplicates.length > 0 ||
      typeof data.settings?.value === "undefined" ||
      (typeof data.settings?.value !== "undefined" && data.settings?.value < 0) ||
      typeof data.settings?.unit === "undefined" ||
      (typeof data.settings?.unit !== "undefined" && data.settings?.unit?.trim() === "") ||
      typeof data.name === "undefined" ||
      (typeof data.name !== "undefined" && data.name?.trim() === "")
    )
  }

  const validateDBT = (duplicates) => {
    let validateEffective = false
    if (data.settings && data.settings?.targetEffective !== undefined) {
      if (data.settings?.targetEffective.length > 0) {
        validateEffective = data.settings?.targetEffective.some((item) => {
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
    return !(
      typeof data.studyID == "undefined" ||
      data.studyID === null ||
      data.studyID === "" ||
      duplicates.length > 0 ||
      typeof data.name === "undefined" ||
      (typeof data.name !== "undefined" && data.name?.trim() === "") ||
      validateEffective
    )
  }

  const validateBreathe = (duplicates) => {
    let fileMB = validateAudioSize()
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

  const handleChange = (details) => {
    setData({
      id: value?.id ?? undefined,
      name: details.text,
      spec: value?.spec ?? activitySpecId,
      schedule: value?.schedule ?? [],
      settings: data.settings,
      description: details.description,
      photo: details.photo,
      streak: details.streak,
      showFeed: details.showFeed,
      studyID: details.studyId,
      category: data?.category ?? [],
    })
  }

  const handleTabChange = (tab) => {
    setData({ ...data, category: tab })
  }

  const validateAudioSize = () => {
    let settingsData = data.settings
    let b64Settings = settingsData ? settingsData.audio : ""
    let totalSizeMB = 0
    if (b64Settings) {
      let stringLength = b64Settings.length - "data:audio/mpeg;base64,".length
      let sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383812
      totalSizeMB = sizeInBytes / Math.pow(1024, 2)
    }
    return totalSizeMB
  }

  const updateSettings = (settingsData) => {
    if (data?.spec === "lamp.survey") {
      ;(settingsData?.settings || []).map((x, idx) => {
        if (
          !(
            x.type === "time" ||
            x.type === "list" ||
            x.type === "multiselect" ||
            x.type === "slider" ||
            x.type === "rating"
          ) &&
          typeof x.options !== "undefined"
        ) {
          delete settingsData.settings[idx]["options"]
        }
        if (x.type === "time") {
          if (!!settingsData.settings[idx]["options"] && settingsData.settings[idx]["options"].length > 1) {
            settingsData.settings[idx]["options"].map((i, indx) => {
              if (indx > 0) {
                settingsData.settings[idx]["options"].splice(indx, 1)
              }
            })
          }
        }
      })
    }
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
          onTabChange={handleTabChange}
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
        {validateAudioSize() > breatheFileLimit && (
          <Box my={2} p={2} border={1} borderColor="#0000001f" className={classes.errorcustom}>
            <Typography variant="h6">Errors</Typography>
            <Box alignItems="center" display="flex" p={2}>
              <Icon>error</Icon> {`${t("The audio size should not exceed 10 MB.")}`}
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
