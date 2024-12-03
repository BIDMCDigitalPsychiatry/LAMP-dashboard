import React, { useEffect, useState } from "react"
import { Backdrop, CircularProgress, AppBar, Toolbar, Icon, Box, Divider, Typography, Link } from "@material-ui/core"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import GroupCreator from "./GroupCreator"
import Tips from "./Tips"
import GameCreator from "./GameCreator"
import {
  saveTipActivity,
  saveSurveyActivity,
  saveCTestActivity,
  addActivity,
  spliceActivity,
  updateActivityData,
} from "../ActivityList/ActivityMethods"
import { useSnackbar } from "notistack"
import { useTranslation } from "react-i18next"
import LAMP from "lamp-core"
import { Service } from "../../DBService/DBService"
import { SchemaList } from "./ActivityMethods"

export const games = [
  "lamp.jewels_a",
  "lamp.jewels_b",
  "lamp.spatial_span",
  "lamp.cats_and_dogs",
  "lamp.pop_the_bubbles",
  "lamp.balloon_risk",
  "lamp.spin_wheel",
  "lamp.maze_game",
  "lamp.emotion_recognition",
  "lamp.symbol_digit_substitution",
  "lamp.gyroscope",
  "lamp.dcog",
  "lamp.funny_memory",
  "lamp.trails_b",
  "lamp.voice_survey",
]

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: 111111,
      color: "#fff",
    },
    backbtnlink: {
      width: 48,
      height: 48,
      color: "rgba(0, 0, 0, 0.54)",
      padding: 12,
      borderRadius: "50%",
      "&:hover": { background: "rgba(0, 0, 0, 0.04)" },
    },
    toolbardashboard: {
      minHeight: 100,
      padding: "0 10px",
      "& h5": {
        color: "rgba(0, 0, 0, 0.75)",
        textAlign: "left",
        fontWeight: "600",
        fontSize: 30,
        width: "calc(100% - 96px)",
      },
    },
    dividerHeader: {
      marginTop: 0,
    },
  })
)

const toBinary = (string) => {
  const codeUnits = new Uint16Array(string.length)
  for (let i = 0; i < codeUnits.length; i++) {
    codeUnits[i] = string.charCodeAt(i)
  }
}
const defaultBase64 = toBinary("data:image/png;base64,")

export default function Activity({
  id,
  type,
  researcherId,
  ...props
}: {
  id?: string
  type?: string
  researcherId?: string
}) {
  const [loading, setLoading] = useState(true)
  const [activity, setActivity] = useState(null)
  const [studies, setStudies] = useState(null)
  const [allActivities, setAllActivities] = useState(null)
  const [details, setDetails] = useState(null)
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation()
  const classes = useStyles()

  useEffect(() => {
    setLoading(true)
    Service.getAll("studies").then((studies) => {
      setStudies(studies)
      Service.getAll("activities").then((activities) => {
        setAllActivities(activities)
        if (!!id) {
          Service.getDataByKey("activities", [id], "id").then((data) => {
            setActivity(data[0])
          })
        } else setLoading(false)
      })
    })
  }, [])

  useEffect(() => {
    if (!!activity && details === null) {
      ;(async () => {
        let lampAuthId = LAMP.Auth._auth.id

        if (!(lampAuthId === "researcher@demo.lamp.digital" || lampAuthId === "clinician@demo.lamp.digital")) {
          let data = await LAMP.Activity.view(activity.id)
          activity.settings = data.settings
        }
        if (activity.spec === "lamp.survey") {
          let tag = [await LAMP.Type.getAttachment(activity.id, "lamp.dashboard.survey_description")].map((y: any) =>
            !!y.error ? undefined : y.data
          )[0]
          let dataActivity = spliceActivity({ raw: activity, tag: tag })
          setActivity(dataActivity)
          setDetails(tag ?? [])
        } else if (activity.spec === "lamp.tips") {
          activity.settings = activity.settings.reduce((ds, d) => {
            let newD = d
            if (d.image === "") {
              newD = Object.assign({}, d, { image: defaultBase64 })
            }
            return ds.concat(newD)
          }, [])
          let tag = [await LAMP.Type.getAttachment(activity.id, "lamp.dashboard.activity_details")].map((y: any) =>
            !!y.error ? undefined : y.data
          )[0]
          setActivity(activity)
          setDetails(tag ?? [])
        } else {
          if (activity.spec === "lamp.breathe" && activity.settings?.audio === null) {
            delete activity.settings?.audio
          }
          let tag = [await LAMP.Type.getAttachment(activity.id, "lamp.dashboard.activity_details")].map((y: any) =>
            !!y.error ? undefined : y.data
          )[0]
          setDetails(tag ?? [])
        }
        setLoading(false)
      })()
    }
  }, [activity])

  const saveActivity = async (x) => {
    setLoading(true)
    let newItem =
      x.spec === "lamp.survey"
        ? await saveSurveyActivity(x)
        : x.spec === "lamp.tips"
        ? await saveTipActivity(x)
        : await saveCTestActivity(x)
    if (!!newItem.error) {
      setLoading(false)
      enqueueSnackbar(`${t("Failed to create a new Activity.")}`, {
        variant: "error",
      })
    } else {
      x["id"] = newItem["data"]
      updateDb(x)
      setLoading(false)
      enqueueSnackbar(`${t("Successfully created a new Activity.")}`, {
        variant: "success",
      })
      history.back()
    }
  }

  const updateDb = (x) => {
    addActivity(x, studies)
    setLoading(false)
  }

  // Commit an update to an Activity object (ONLY DESCRIPTIONS).
  const updateActivity = async (x, isDuplicated) => {
    setLoading(true)
    let result = await updateActivityData(x, isDuplicated, activity)
    if (!!result.error)
      enqueueSnackbar(`${t("Encountered an error: .")}` + result?.error, {
        variant: "error",
      })
    else {
      if (isDuplicated || (!x.id && x.name)) {
        x["id"] = result.data
        addActivity(x, studies)
        enqueueSnackbar(`${t("Successfully duplicated the Activity under a new name.")}`, {
          variant: "success",
        })
        history.back()
      } else {
        x["study_id"] = x.studyID
        x["study_name"] = studies.filter((study) => study.id === x.studyID)[0]?.name
        delete x["studyID"]
        Service.updateMultipleKeys("activities", { activities: [x] }, Object.keys(x), "id")
        enqueueSnackbar(`${t("Successfully updated the Activity.")}`, {
          variant: "success",
        })
        history.back()
      }
    }
    setLoading(false)
  }

  return (
    <Box>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {!loading && !!studies && (!!type || (!!activity && !!details)) && (
        <Box>
          <AppBar position="static" style={{ background: "#FFF", boxShadow: "none" }}>
            <Toolbar className={classes.toolbardashboard}>
              <Link
                onClick={() => {
                  history.back()
                }}
                underline="none"
                className={classes.backbtnlink}
              >
                <Icon>arrow_back</Icon>
              </Link>
              <Typography variant="h5">
                {!!type ? `${t("Create a new activity")}` : `${t("Modify an existing activity")}`}
              </Typography>
            </Toolbar>
          </AppBar>
          <Divider className={classes.dividerHeader} />
          {(!!type && type === "group") || activity?.spec === "lamp.group" ? (
            <GroupCreator
              activities={allActivities}
              value={activity ?? null}
              onSave={!!type ? saveActivity : updateActivity}
              studies={studies}
              study={activity?.study_id ?? null}
              details={details ?? null}
            />
          ) : (!!type && type === "tips") || activity?.spec === "lamp.tips" ? (
            <Tips
              value={activity}
              details={details ?? null}
              onSave={activity && activity?.id ? updateActivity : saveActivity}
              studies={studies}
              allActivities={allActivities}
              study={activity?.study_id ?? null}
            />
          ) : (
            <GameCreator
              activities={allActivities}
              value={activity ?? null}
              details={details ?? null}
              onSave={!!type ? saveActivity : updateActivity}
              studies={studies}
              activitySpecId={
                !!type
                  ? Object.keys(SchemaList()).includes("lamp." + type)
                    ? "lamp." + type
                    : type
                  : activity.spec ?? activity.spec
              }
              study={activity?.study_id ?? null}
            />
          )}
        </Box>
      )}
    </Box>
  )
}
