// Core Imports
import React from "react"
// Local Imports
import SurveyCreator from "./SurveyCreator"
import GroupCreator from "./GroupCreator"
import TipCreator from "./TipCreator"
import GameCreator from "./GameCreator"
import JournalCreator from "./JournalCreator"
import BreatheCreator from "./BreatheCreator"
import DBTCreator from "./DBTCreator"
import SCImageCreator from "./SCImageCreator"
import { saveGroupActivity, saveTipActivity, saveSurveyActivity, saveCTestActivity } from "../ActivityList/Index"
import { useSnackbar } from "notistack"
import { useTranslation } from "react-i18next"

const games = [
  "lamp.jewels_a",
  "lamp.jewels_b",
  "lamp.spatial_span",
  "lamp.cats_and_dogs",
  "lamp.pop_the_bubbles",
  "lamp.balloon_risk",
]

export default function Activity({
  allActivities,
  activity,
  onSave,
  onCancel,
  studies,
  details,
  activitySpecId,
  studyId,
  ...props
}: {
  allActivities?: any
  activity?: any
  onSave?: any
  onCancel?: any
  studies?: any
  details?: JSON
  activitySpecId?: string
  studyId?: string
}) {
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

  // Create a new Activity object & survey descriptions if set.
  const saveTipsActivity = async (x) => {
    let result = await saveTipActivity(x)
    if (!!result.error)
      enqueueSnackbar(t("Encountered an error: ") + result?.error, {
        variant: "error",
      })
    else {
      enqueueSnackbar(t("Successfully updated the Activity."), {
        variant: "success",
      })
      // onChange()
    }
  }

  // Create a new Activity object & survey descriptions if set.
  const saveActivity = async (x) => {
    let newItem = await saveSurveyActivity(x)
    if (!!newItem.error)
      enqueueSnackbar(t("Failed to create a new survey Activity."), {
        variant: "error",
      })
    else
      enqueueSnackbar(t("Successfully created a new survey Activity."), {
        variant: "success",
      })
    // let selectedStudy = studies.filter((study) => study.id === x.studyID)[0]
    // setStudiesCount({ ...studiesCount, [selectedStudy.name]: ++studiesCount[selectedStudy.name] })
    // onChange()
  }

  // Create a new Activity object that represents a group of other Activities.
  const saveGroup = async (x) => {
    let newItem = await saveGroupActivity(x)
    if (!!newItem.error)
      enqueueSnackbar(t("Failed to create a new group Activity."), {
        variant: "error",
      })
    else
      enqueueSnackbar(t("Successfully created a new group Activity."), {
        variant: "success",
      })
    // let selectedStudy = studies.filter((study) => study.id === x.studyID)[0]
    // setStudiesCount({ ...studiesCount, [selectedStudy.name]: ++studiesCount[selectedStudy.name] })
    // onChange()
  }

  // Create a new Activity object that represents a cognitive test.
  const saveCTest = async (x) => {
    let newItem = await saveCTestActivity(x)
    if (!!newItem.error)
      enqueueSnackbar(t("Failed to create a new Activity."), {
        variant: "error",
      })
    else
      enqueueSnackbar(t("Successfully created a new Activity."), {
        variant: "success",
      })
    // let selectedStudy = studies.filter((study) => study.id === x.studyID)[0]
    // setStudiesCount({ ...studiesCount, [selectedStudy.name]: ++studiesCount[selectedStudy.name] })
    // onChange()
  }
  return (
    <div>
      {isGroup && (
        <GroupCreator
          activities={allActivities}
          value={activity ?? null}
          onSave={activitySpecId ? saveGroup : onSave}
          studies={studies}
          study={studyId ?? activity?.study_id ?? null}
        />
      )}
      {isTip && (
        <TipCreator
          activities={activity}
          onSave={activitySpecId ? saveTipsActivity : onSave}
          studies={studies}
          allActivities={allActivities}
          study={studyId ?? activity?.study_id ?? null}
        />
      )}
      {isSurvey && (
        <SurveyCreator
          value={activity ?? null}
          studies={studies}
          onSave={activitySpecId ? saveActivity : onSave}
          study={studyId ?? activity?.study_id ?? null}
        />
      )}
      {isGames && (
        <GameCreator
          activities={allActivities}
          value={activity ?? null}
          details={details ?? null}
          onSave={activitySpecId ? saveCTest : onSave}
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
          onSave={activitySpecId ? saveCTest : onSave}
          activitySpecId={activitySpecId ?? activity.spec}
          study={studyId ?? activity?.study_id ?? null}
        />
      )}
      {isBreathe && (
        <BreatheCreator
          onSave={activitySpecId ? saveCTest : onSave}
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
          onSave={activitySpecId ? saveCTest : onSave}
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
          onSave={activitySpecId ? saveCTest : onSave}
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
