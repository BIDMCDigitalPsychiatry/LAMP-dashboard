// Core Imports
import React, { useState } from "react"
import { Grid, Container, Backdrop, CircularProgress, makeStyles, Theme, createStyles } from "@material-ui/core"
import { useSnackbar } from "notistack"
import Jewels from "../../../icons/Jewels.svg"
import { useTranslation } from "react-i18next"
import ActivityHeader from "./ActivityHeader"
import ActivityFooter from "./ActivityFooter"
import DynamicForm from "../../shared/DynamicForm"

const schemaList: any = {
  "lamp.balloon_risk": {
    type: "object",
    properties: {
      settings: {
        title: "Activity Settings",
        type: "object",
        required: ["balloon_count", "breakpoint_mean", "breakpoint_std"],
        properties: {
          balloon_count: {
            title: "Balloon Count",
            description: "The number of balloons to display.",
            type: "number",
            default: 15,
            minimum: 1,
            "ui:grid": {
              xs: 4,
            },
          },
          breakpoint_mean: {
            title: "Breakpoint Mean",
            description: "The mean of the breakpoint for balloon risk.",
            type: "number",
            default: 64.5,
            minimum: 1,
            "ui:grid": {
              xs: 4,
            },
          },
          breakpoint_std: {
            title: "Breakpoint Standard Deviation",
            description: "The standard deviation of the breakpoint for balloon risk.",
            type: "number",
            default: 37,
            minimum: 1,
            "ui:grid": {
              xs: 4,
            },
          },
        },
      },
    },
  },
  "lamp.pop_the_bubbles": {
    type: "object",
    properties: {
      settings: {
        title: "Activity Settings",
        type: "object",
        required: ["bubble_count", "bubble_speed", "intertrial_duration", "bubble_duration"],
        properties: {
          bubble_count: {
            title: "Bubble Count",
            description: "Multiple bubble counts per level.",
            type: "array",
            minItems: 3,
            maxItems: 3,
            items: {
              title: "Level Count",
              type: "number",
              minimum: 1,
              default: 80,
            },
            "ui:options": {
              addable: false,
              removable: false,
              orderable: false,
            },
            "ui:grid": {
              xs: 6,
            },
          },
          bubble_speed: {
            title: "Bubble Speed",
            description: "Multiple bubble speeds per level.",
            type: "array",
            minItems: 3,
            maxItems: 3,
            items: {
              title: "Level Speed",
              type: "number",
              minimum: 1,
              default: 80,
            },
            "ui:options": {
              addable: false,
              removable: false,
              orderable: false,
            },
            "ui:grid": {
              xs: 6,
            },
          },
          intertrial_duration: {
            title: "Intertrial Duration",
            description: "The duration between bubbles.",
            type: "number",
            minimum: 0,
            default: 0.5,
            "ui:grid": {
              xs: 6,
            },
          },
          bubble_duration: {
            title: "Bubble Duration",
            description: "The duration the bubble appears on screen.",
            type: "number",
            minimum: 1,
            default: 1.0,
            "ui:grid": {
              xs: 6,
            },
          },
        },
      },
    },
  },
  "lamp.spatial_span": {
    type: "object",
    properties: {
      settings: {
        title: "Activity Settings",
        type: "object",
        required: ["reverse_tapping"],
        properties: {
          reverse_tapping: {
            title: "Tap Order",
            description: "Whether taps are going forwards or backwards.",
            type: "boolean",
            enumNames: ["Backwards", "Forwards"],
            default: true,
            "ui:widget": "radio",
          },
        },
      },
    },
  },
  "lamp.jewels_a": {
    type: "object",
    properties: {
      settings: {
        title: "Activity Settings",
        type: "object",
        required: ["mode", "variant"],
        properties: {
          mode: {
            title: "Mode",
            description: "The mode of the jewels game.",
            type: "number",
            enum: [1, 2, 3, 4],
            enumNames: ["Beginner", "Intermediate", "Advanced", "Expert"],
            default: 1,
            "ui:grid": {
              xs: 6,
            },
          },
          variant: {
            title: "Variant",
            description: "The variant of the Jewels game (A or B).",
            type: "string",
            enum: ["jewels_a", "jewels_b"],
            enumNames: ["Trails A", "Trails B"],
            default: "jewels_b",
            "ui:grid": {
              xs: 6,
            },
          },
          beginner_seconds: {
            title: "Beginner Duration",
            description: "The duration of a Jewels session on Beginner mode (in seconds).",
            type: "number",
            minimum: 1,
            maximum: 300,
            default: 90,
            "ui:grid": {
              xs: 3,
            },
          },
          intermediate_seconds: {
            title: "Intermediate Duration",
            description: "The duration of a Jewels session on Intermediate mode (in seconds).",
            type: "number",
            minimum: 1,
            maximum: 300,
            default: 30,
            "ui:grid": {
              xs: 3,
            },
          },
          advanced_seconds: {
            title: "Advanced Duration",
            description: "The duration of a Jewels session on Advanced mode (in seconds).",
            type: "number",
            minimum: 1,
            maximum: 300,
            default: 25,
            "ui:grid": {
              xs: 3,
            },
          },
          expert_seconds: {
            title: "Expert Duration",
            description: "The duration of a Jewels session on Expert mode (in seconds).",
            type: "number",
            minimum: 1,
            maximum: 300,
            default: 15,
            "ui:grid": {
              xs: 3,
            },
          },
          diamond_count: {
            title: "Initial Diamond Count",
            description: "The duration of a Jewels session on Expert mode (in seconds).",
            type: "number",
            minimum: 3,
            maximum: 25,
            default: 15,
            "ui:grid": {
              xs: 3,
            },
          },
          shape_count: {
            title: "Initial Shape Count",
            description: "The duration of a Jewels session on Expert mode (in seconds).",
            type: "number",
            minimum: 1,
            maximum: 3,
            default: 1,
            "ui:grid": {
              xs: 3,
            },
          },
          bonus_point_count: {
            title: "Bonus Points for Next Level",
            description: "The duration of a Jewels session on Expert mode (in seconds).",
            type: "number",
            minimum: 0,
            maximum: 500,
            default: 50,
            "ui:grid": {
              xs: 6,
            },
          },
          x_changes_in_level_count: {
            title: "X Changes in Level Count",
            description: "The duration of a Jewels session on Expert mode (in seconds).",
            type: "number",
            minimum: 0,
            maximum: 25,
            default: 1,
            "ui:grid": {
              xs: 3,
            },
          },
          x_diamond_count: {
            title: "X Diamond Count",
            description: "The duration of a Jewels session on Expert mode (in seconds).",
            type: "number",
            minimum: 0,
            maximum: 25,
            default: 4,
            "ui:grid": {
              xs: 3,
            },
          },
          y_changes_in_level_count: {
            title: "X Changes in Level Count",
            description: "The duration of a Jewels session on Expert mode (in seconds).",
            type: "number",
            minimum: 0,
            maximum: 25,
            default: 2,
            "ui:grid": {
              xs: 3,
            },
          },
          y_shape_count: {
            title: "Y Shape Count",
            description: "The duration of a Jewels session on Expert mode (in seconds).",
            type: "number",
            minimum: 0,
            maximum: 4,
            default: 1,
            "ui:grid": {
              xs: 3,
            },
          },
        },
      },
    },
  },
  "lamp.jewels_b": {
    type: "object",
    properties: {
      settings: {
        title: "Activity Settings",
        type: "object",
        required: ["mode", "variant"],
        properties: {
          mode: {
            title: "Mode",
            description: "The mode of the jewels game.",
            type: "number",
            enum: [1, 2, 3, 4],
            enumNames: ["Beginner", "Intermediate", "Advanced", "Expert"],
            default: 1,
            "ui:grid": {
              xs: 6,
            },
          },
          variant: {
            title: "Variant",
            description: "The variant of the Jewels game (A or B).",
            type: "string",
            enum: ["jewels_a", "jewels_b"],
            enumNames: ["Trails A", "Trails B"],
            default: "jewels_b",
            "ui:grid": {
              xs: 6,
            },
          },
          beginner_seconds: {
            title: "Beginner Duration",
            description: "The duration of a Jewels session on Beginner mode (in seconds).",
            type: "number",
            minimum: 1,
            maximum: 300,
            default: 90,
            "ui:grid": {
              xs: 3,
            },
          },
          intermediate_seconds: {
            title: "Intermediate Duration",
            description: "The duration of a Jewels session on Intermediate mode (in seconds).",
            type: "number",
            minimum: 1,
            maximum: 300,
            default: 30,
            "ui:grid": {
              xs: 3,
            },
          },
          advanced_seconds: {
            title: "Advanced Duration",
            description: "The duration of a Jewels session on Advanced mode (in seconds).",
            type: "number",
            minimum: 1,
            maximum: 300,
            default: 25,
            "ui:grid": {
              xs: 3,
            },
          },
          expert_seconds: {
            title: "Expert Duration",
            description: "The duration of a Jewels session on Expert mode (in seconds).",
            type: "number",
            minimum: 1,
            maximum: 300,
            default: 15,
            "ui:grid": {
              xs: 3,
            },
          },
          diamond_count: {
            title: "Initial Diamond Count",
            description: "The duration of a Jewels session on Expert mode (in seconds).",
            type: "number",
            minimum: 3,
            maximum: 25,
            default: 15,
            "ui:grid": {
              xs: 3,
            },
          },
          shape_count: {
            title: "Initial Shape Count",
            description: "The duration of a Jewels session on Expert mode (in seconds).",
            type: "number",
            minimum: 1,
            maximum: 3,
            default: 1,
            "ui:grid": {
              xs: 3,
            },
          },
          bonus_point_count: {
            title: "Bonus Points for Next Level",
            description: "The duration of a Jewels session on Expert mode (in seconds).",
            type: "number",
            minimum: 0,
            maximum: 500,
            default: 50,
            "ui:grid": {
              xs: 6,
            },
          },
          x_changes_in_level_count: {
            title: "X Changes in Level Count",
            description: "The duration of a Jewels session on Expert mode (in seconds).",
            type: "number",
            minimum: 0,
            maximum: 25,
            default: 1,
            "ui:grid": {
              xs: 3,
            },
          },
          x_diamond_count: {
            title: "X Diamond Count",
            description: "The duration of a Jewels session on Expert mode (in seconds).",
            type: "number",
            minimum: 0,
            maximum: 25,
            default: 4,
            "ui:grid": {
              xs: 3,
            },
          },
          y_changes_in_level_count: {
            title: "X Changes in Level Count",
            description: "The duration of a Jewels session on Expert mode (in seconds).",
            type: "number",
            minimum: 0,
            maximum: 25,
            default: 2,
            "ui:grid": {
              xs: 3,
            },
          },
          y_shape_count: {
            title: "Y Shape Count",
            description: "The duration of a Jewels session on Expert mode (in seconds).",
            type: "number",
            minimum: 0,
            maximum: 4,
            default: 1,
            "ui:grid": {
              xs: 3,
            },
          },
        },
      },
    },
  },
  "lamp.survey": {
    title: "Survey Questions",
    description: "Configure questions, parameters, and options.",
    type: "array",
    items: {
      title: "Question",
      description: "Configure a question.",
      type: "object",
      required: ["title", "type"],
      properties: {
        title: {
          type: "string",
          title: "Question Text",
          minLength: 1,
          default: "",
        },
        description: {
          type: "string",
          title: "Question Description",
          default: "",
        },
        type: {
          type: "string",
          title: "Question Type",
          enum: ["text", "boolean", "list", "multiselect", "slider", "short_answer", "rating"],
          enumNames: ["Text", "Boolean", "List", "Multi-Select", "Slider", "Short Answer", "Rating"],
          default: "text",
        },
      },
      dependencies: {
        type: {
          oneOf: [
            {
              properties: {
                type: {
                  enum: ["text", "boolean", "short_answer"],
                },
              },
            },
            {
              properties: {
                type: {
                  enum: ["list", "multiselect"],
                },
                options: {
                  type: "array",
                  title: "Response Options",
                  minItems: 1,
                  items: {
                    type: "object",
                    properties: {
                      value: {
                        title: "Option Text",
                        type: "string",
                        minLength: 1,
                        default: "",
                      },
                      description: {
                        title: "Option Description",
                        type: "string",
                        default: "",
                      },
                    },
                  },
                },
              },
              required: ["options"],
            },
            {
              properties: {
                type: {
                  enum: ["slider", "rating"],
                },
                options: {
                  type: "array",
                  title: "Response Options",
                  minItems: 1,
                  items: {
                    type: "object",
                    properties: {
                      value: {
                        title: "Option Text (Numerical)",
                        type: "number",
                        default: 0,
                      },
                      description: {
                        title: "Option Description",
                        type: "string",
                        default: "",
                      },
                    },
                  },
                },
              },
              required: ["options"],
            },
          ],
        },
      },
    },
  },
}

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
  const { t } = useTranslation()
  const defaultBallonCount = 15
  const defaultMean = 64.5
  const defaultSD = 37
  const defaultBubbleCount = [60, 80, 80]
  const defaultBubbleSpeed = [60, 80, 80]
  const defaultIntertrialDuration = 0.5
  const defaultBubbleDuration = 1.0
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
  const [data, setData] = useState({
    id: value?.id ?? undefined,
    name: value?.name ?? "",
    spec: value?.spec ?? activitySpecId,
    schedule: [],
    description: "",
    photo: details?.photo ?? null,
    settings: settings ?? [],
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
        settings?.beginner_seconds > 300 ||
        settings?.beginner_seconds === 0 ||
        settings?.beginner_seconds === "" ||
        settings?.intermediate_seconds > 300 ||
        settings?.intermediate_seconds === 0 ||
        settings?.intermediate_seconds === "" ||
        settings?.advanced_seconds > 300 ||
        settings?.advanced_seconds === 0 ||
        settings?.advanced_seconds === "" ||
        settings?.expert_seconds > 300 ||
        settings?.expert_seconds === 0 ||
        settings?.expert_seconds === "" ||
        settings?.diamond_count > 25 ||
        settings?.diamond_count === 0 ||
        settings?.diamond_count === "" ||
        settings?.bonus_point_count === 0 ||
        settings?.bonus_point_count === "" ||
        settings?.shape_count > 4 ||
        settings?.shape_count === 0 ||
        settings?.shape_count === "" ||
        typeof data.name === "undefined" ||
        settings?.beginner_seconds < 30 ||
        settings?.intermediate_seconds < 10 ||
        settings?.expert_seconds < 10 ||
        settings?.advanced_seconds < 10 ||
        settings?.diamond_count < 3 ||
        settings?.shape_count < 1 ||
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
        settings?.balloon_count === 0 ||
        settings?.balloon_count === "" ||
        settings?.breakpoint_mean === 0 ||
        settings?.breakpoint_mean === "" ||
        settings?.breakpoint_std === 0 ||
        settings?.breakpoint_std === "" ||
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
        settings?.bubble_count === 0 ||
        settings?.bubble_count === "" ||
        settings?.bubble_speed === 0 ||
        settings?.bubble_speed === "" ||
        settings?.intertrial_duration === 0 ||
        settings?.intertrial_duration === "" ||
        settings?.bubble_duration === 0 ||
        settings?.bubble_duration === "" ||
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
      settings: settings,
      description: details.description,
      photo: details.photo,
      studyID: details.studyId,
    })
  }

  const updateSettings = (settingsData) => {
    setData({ ...data, settings: settingsData })
    setSettings(settingsData)
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
          study={data.studyID}
          onChange={handleChange}
          image={
            (value?.spec && ["lamp.jewels_a", "lamp.jewels_b"].includes(value.spec)) ||
            ["lamp.jewels_a", "lamp.jewels_b"].includes(activitySpecId)
              ? Jewels
              : null
          }
        />
        {((value?.spec && Object.keys(schemaList).includes(value.spec)) ||
          Object.keys(schemaList).includes(activitySpecId)) && (
          <DynamicForm
            schema={schemaList[activitySpecId]}
            initialData={settings}
            onChange={(x) => updateSettings({ ...settings, ...x })}
          />
        )}
      </Container>
      <ActivityFooter onSave={onSave} validate={validate} value={value} data={data} />
    </Grid>
  )
}
