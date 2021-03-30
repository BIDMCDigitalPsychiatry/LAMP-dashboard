// Core Imports
import React, { useState, useEffect } from "react"
import { Grid, Container, Backdrop, CircularProgress, makeStyles, Theme, createStyles } from "@material-ui/core"
import { useSnackbar } from "notistack"
import Jewels from "../../../icons/Jewels.svg"
import { useTranslation } from "react-i18next"
import ActivityHeader from "./ActivityHeader"
import ActivityFooter from "./ActivityFooter"
import DynamicForm from "../../shared/DynamicForm"
import { schemaList } from "./ActivityMethods"
import ScratchCard from "../../../icons/ScratchCard.svg"
import JournalIcon from "../../../icons/Journal.svg"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    containerWidth: { maxWidth: 1055 },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
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
              : null
          }
        />
        {((value?.spec && Object.keys(schemaList).includes(value.spec)) ||
          Object.keys(schemaList).includes(activitySpecId)) && (
          <DynamicForm
            schema={schemaList[activitySpecId]}
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
