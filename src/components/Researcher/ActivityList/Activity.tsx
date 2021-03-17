import React, { useState } from "react"
import { Backdrop, CircularProgress } from "@material-ui/core"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import SurveyCreator from "./SurveyCreator"
import GroupCreator from "./GroupCreator"
import TipCreator from "./TipCreator"
import GameCreator from "./GameCreator"
import JournalCreator from "./JournalCreator"
import BreatheCreator from "./BreatheCreator"
import DBTCreator from "./DBTCreator"
import SCImageCreator from "./SCImageCreator"
import {
  saveGroupActivity,
  saveTipActivity,
  saveSurveyActivity,
  saveCTestActivity,
  addActivity,
} from "../ActivityList/ActivityMethods"
import { useSnackbar } from "notistack"
import { useTranslation } from "react-i18next"
import { Service } from "../../DBService/DBService"

const games = [
  "lamp.jewels_a",
  "lamp.jewels_b",
  "lamp.spatial_span",
  "lamp.cats_and_dogs",
  "lamp.pop_the_bubbles",
  "lamp.balloon_risk",
]

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: 111111,
      color: "#fff",
    },
  })
)

export default function Activity({
  allActivities,
  activity,
  onSave,
  onCancel,
  studies,
  details,
  activitySpecId,
  studyId,
  onClose,
  setActivities,
  ...props
}: {
  allActivities?: Array<JSON>
  activity?: any
  onSave?: Function
  onCancel?: Function
  studies?: any
  details?: JSON
  activitySpecId?: string
  studyId?: string
  onClose?: Function
  setActivities?: Function
}) {
  const [loading, setLoading] = useState(false)
  const isTip = (activity || {}).spec === "lamp.tips" || activitySpecId === "lamp.tips"
  const isGroup = (activity || {}).spec === "lamp.group" || activitySpecId === "lamp.group"
  const isSurvey = (activity || {}).spec === "lamp.survey" || activitySpecId === "lamp.survey"
  const isGames = games.includes((activity || {}).spec) || games.includes(activitySpecId)
  const isJournal = (activity || {}).spec === "lamp.journal" || activitySpecId === "lamp.journal"
  const isBreathe = (activity || {}).spec === "lamp.breathe" || activitySpecId === "lamp.breathe"
  const isDBT = (activity || {}).spec === "lamp.dbt_diary_card" || activitySpecId === "lamp.dbt_diary_card"
  const isSCImage = (activity || {}).spec === "lamp.scratch_image" || activitySpecId === "lamp.scratch_image"
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation()
  const classes = useStyles()
  // Create a new tip activity object & survey descriptions if set.
  const saveTipsActivity = async (x) => {
    setLoading(true)
    let result = await saveTipActivity(x)
    if (!!result.error)
      enqueueSnackbar(t("Encountered an error: ") + result?.error, {
        variant: "error",
      })
    else {
      x["id"] = result["data"]
      updateDb(x)
      enqueueSnackbar(t("Successfully updated the Activity."), {
        variant: "success",
      })
      onClose()
    }
  }
  // Create a new Activity object & survey descriptions if set.
  const saveActivity = async (x) => {
    setLoading(true)
    let newItem = await saveSurveyActivity(x)
    if (!!newItem.error)
      enqueueSnackbar(t("Failed to create a new survey Activity."), {
        variant: "error",
      })
    else {
      x["id"] = newItem["data"]
      updateDb(x)
      enqueueSnackbar(t("Successfully created a new survey Activity."), {
        variant: "success",
      })
      onClose()
    }
  }
  // Create a new group activity object that represents a group of other Activities.
  const saveGroup = async (x) => {
    setLoading(true)
    let newItem = await saveGroupActivity(x)
    if (!!newItem.error)
      enqueueSnackbar(t("Failed to create a new group Activity."), {
        variant: "error",
      })
    else {
      x["id"] = newItem["data"]
      updateDb(x)
      enqueueSnackbar(t("Successfully created a new group Activity."), {
        variant: "success",
      })
      onClose()
    }
  }
  // Create a new Activity object that represents a cognitive test.
  const saveCTest = async (x) => {
    setLoading(true)
    console.log(x)
    let newItem = await saveCTestActivity(x)
    if (!!newItem.error)
      enqueueSnackbar(t("Failed to create a new Activity."), {
        variant: "error",
      })
    else {
      x["id"] = newItem["data"]
      updateDb(x)
      enqueueSnackbar(t("Successfully created a new Activity."), {
        variant: "success",
      })
      onClose()
    }
  }

  const updateDb = (x) => {
    addActivity(x, studies)
    setActivities()
    setLoading(false)
  }

  const updateActivity = (x, isDuplicated) => {
    setLoading(true)
    onSave(x, isDuplicated)
    setLoading(false)
  }

  return (
    <div>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {isGroup && (
        <GroupCreator
          activities={allActivities}
          value={activity ?? null}
          onSave={activitySpecId ? saveGroup : updateActivity}
          studies={studies}
          study={studyId ?? activity?.study_id ?? null}
        />
      )}
      {isTip && (
        <TipCreator
          activities={activity}
          onSave={activitySpecId ? saveTipsActivity : updateActivity}
          studies={studies}
          allActivities={allActivities}
          study={studyId ?? activity?.study_id ?? null}
        />
      )}
      {isSurvey && (
        <SurveyCreator
          value={activity ?? null}
          studies={studies}
          onSave={activitySpecId ? saveActivity : updateActivity}
          study={studyId ?? activity?.study_id ?? null}
          details={details ?? null}
        />
      )}
      {isGames && (
        <GameCreator
          activities={allActivities}
          value={activity ?? null}
          details={details ?? null}
          onSave={activitySpecId ? saveCTest : updateActivity}
          studies={studies}
          activitySpecId={activitySpecId ?? activity.spec}
          study={studyId ?? activity?.study_id ?? null}
        />
      )}
      {isJournal && (
        <JournalCreator
          studies={studies}
          value={activity ?? null}
          activities={allActivities}
          details={details ?? null}
          onSave={activitySpecId ? saveCTest : updateActivity}
          activitySpecId={activitySpecId ?? activity.spec}
          study={studyId ?? activity?.study_id ?? null}
        />
      )}
      {isBreathe && (
        <BreatheCreator
          onSave={activitySpecId ? saveCTest : updateActivity}
          studies={studies}
          value={activity ?? null}
          details={details}
          activities={allActivities}
          activitySpecId={activitySpecId ?? activity.spec}
          study={studyId ?? activity?.study_id ?? null}
        />
      )}
      {isDBT && (
        <DBTCreator
          value={activity ?? null}
          onSave={activitySpecId ? saveCTest : updateActivity}
          details={details}
          activities={allActivities}
          onCancel={onCancel}
          studies={studies}
          activitySpecId={activitySpecId ?? activity.spec}
          study={studyId ?? activity?.study_id ?? null}
        />
      )}
      {isSCImage && (
        <SCImageCreator
          onSave={activitySpecId ? saveCTest : updateActivity}
          studies={studies}
          value={activity ?? null}
          details={details}
          activities={allActivities}
          activitySpecId={activitySpecId ?? activity.spec}
          study={studyId ?? activity?.study_id ?? null}
        />
      )}
    </div>
  )
}
