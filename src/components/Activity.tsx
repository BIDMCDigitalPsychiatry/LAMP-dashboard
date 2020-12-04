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

const games = ["lamp.jewels_a", "lamp.jewels_b", "lamp.spatial_span", "lamp.cats_and_dogs"]

export default function Activity({
  allActivities,
  activity,
  onSave,
  onCancel,
  details,
  studies,
  ...props
}: {
  allActivities?: any
  activity?: any
  onSave?: any
  onCancel?: any
  details?: any
  studies?: any
}) {
  const isTip = (activity || {}).spec === "lamp.tips"
  const isGroup = (activity || {}).spec === "lamp.group"
  const isSurvey = (activity || {}).spec === "lamp.survey"
  const isGames = games.includes((activity || {}).spec)
  const isJournal = (activity || {}).spec === "lamp.journal"
  const isBreathe = (activity || {}).spec === "lamp.breathe"
  const isDBT = (activity || {}).spec === "lamp.dbt_diary_card"
  const isSCImage = (activity || {}).spec === "lamp.scratch_image"

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
