// Core Imports
import React from "react"
// Local Imports
import SurveyCreator from "./SurveyCreator"
import GroupCreator from "./GroupCreator"
import TipCreator from "./TipCreator"
import GameCreator from "./GameCreator"
const games = ["lamp.jewels_a", "lamp.jewels_b", "lamp.spatial_span", "lamp.cats_and_dogs"]

export default function Activity({ allActivities, activity, onSave, details, studies, ...props }) {
  const isTip = (activity || {}).spec === "lamp.tips"
  const isGroup = (activity || {}).spec === "lamp.group"
  const isSurvey = (activity || {}).spec === "lamp.survey"
  const isGames = games.includes((activity || {}).spec)

  return (
    <div>
      {isGroup && <GroupCreator activities={allActivities} value={activity} onSave={onSave} studies={studies} />}

      {isTip && <TipCreator activities={activity} onSave={onSave} />}

      {isSurvey && <SurveyCreator value={activity} onSave={onSave} studies={studies} />}

      {isGames && (
        <GameCreator value={activity} onSave={onSave} details={details} activities={allActivities} studies={studies} />
      )}
    </div>
  )
}
