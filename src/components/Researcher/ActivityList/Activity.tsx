// Core Imports
import React, { useState, useEffect } from "react"
// Local Imports
import SurveyCreator from "./SurveyCreator"
import GroupCreator from "./GroupCreator"
import TipCreator from "./TipCreator"
import GameCreator from "./GameCreator"
import JournalCreator from "./JournalCreator"
import BreatheCreator from "./BreatheCreator"
import DBTCreator from "./DBTCreator"
import SCImageCreator from "./SCImageCreator"
import { spliceActivity } from "./Index"
import LAMP from "lamp-core"

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
  ...props
}: {
  allActivities?: any
  activity?: any
  onSave?: any
  onCancel?: any
  studies?: any
}) {
  const [details, setDetails] = useState(null)
  const isTip = (activity || {}).spec === "lamp.tips"
  const isGroup = (activity || {}).spec === "lamp.group"
  const isSurvey = (activity || {}).spec === "lamp.survey"
  const isGames = games.includes((activity || {}).spec)
  const isJournal = (activity || {}).spec === "lamp.journal"
  const isBreathe = (activity || {}).spec === "lamp.breathe"
  const isDBT = (activity || {}).spec === "lamp.dbt_diary_card"
  const isSCImage = (activity || {}).spec === "lamp.scratch_image"
  const [selectedActivity, setSelectedActivity] = useState(activity)

  useEffect(() => {
    ;(async () => {
      if (activity.spec === "lamp.survey") {
        let tag = [await LAMP.Type.getAttachment(activity.id, "lamp.dashboard.survey_description")].map((y: any) =>
          !!y.error ? undefined : y.data
        )[0]
        let raw = activity
        const activityData = spliceActivity({ raw, tag })
        setSelectedActivity(activityData)
      } else if (activity.spec === "lamp.dbt_diary_card") {
        setSelectedActivity(activity)
      } else if (activity.spec === "lamp.tips") {
        setSelectedActivity(activity)
      } else if (
        games.includes(activity.spec) ||
        activity.spec === "lamp.journal" ||
        activity.spec === "lamp.scratch_image" ||
        activity.spec === "lamp.breathe" ||
        activity.spec === "lamp.group"
      ) {
        let tag = [await LAMP.Type.getAttachment(activity.id, "lamp.dashboard.activity_details")].map((y: any) =>
          !!y.error ? undefined : y.data
        )[0]
        setDetails(tag)
        setSelectedActivity(activity)
      }
    })()
  })

  return (
    <div>
      {isGroup && (
        <GroupCreator activities={allActivities} value={activity} details={details} onSave={onSave} studies={studies} />
      )}
      {isTip && <TipCreator activities={activity} onSave={onSave} studies={studies} allActivities={allActivities} />}
      {isSurvey && <SurveyCreator value={activity} onSave={onSave} studies={studies} />}
      {isGames && (
        <GameCreator value={activity} onSave={onSave} details={details} activities={allActivities} studies={studies} />
      )}
      {isJournal && (
        <JournalCreator
          onSave={onSave}
          studies={studies}
          value={activity}
          details={details}
          activities={allActivities}
        />
      )}
      {isBreathe && (
        <BreatheCreator
          onSave={onSave}
          studies={studies}
          value={activity}
          details={details}
          activities={allActivities}
        />
      )}
      {isDBT && (
        <DBTCreator
          value={activity}
          onSave={onSave}
          details={details}
          activities={allActivities}
          onCancel={onCancel}
          studies={studies}
        />
      )}
      {isSCImage && (
        <SCImageCreator
          onSave={onSave}
          studies={studies}
          value={activity}
          details={details}
          activities={allActivities}
        />
      )}
    </div>
  )
}
