import React from "react"
import { Box } from "@material-ui/core"
import SurveyCreator from "./SurveyCreator"
import JournalCreator from "./JournalCreator"
import GroupCreator from "./GroupCreator"
import TipCreator from "./TipCreator"
import DBTCreator from "./DBTCreator"
import GameCreator from "./GameCreator"
import BreatheCreator from "./BreatheCreator"
import SCImageCreator from "./SCImageCreator"

export default function AddActivity({ ...props }) {
  return (
    <Box py={8} px={4}>
      {!!props.groupCreate && (
        <GroupCreator
          activities={props.activities}
          study={props.studyId ?? undefined}
          studies={props.studies}
          onSave={props.saveGroup}
        />
      )}
      {!!props.showCTCreate && (
        <GameCreator
          onSave={props.saveCTest}
          activitySpecId={props.activitySpecId}
          studies={props.studies}
          activities={props.activities}
          study={props.studyId ?? undefined}
        />
      )}
      {!!props.showJournalCreate && (
        <JournalCreator
          onSave={props.saveCTest}
          activitySpecId={props.activitySpecId}
          studies={props.studies}
          activities={props.activities}
          study={props.studyId ?? undefined}
        />
      )}
      {!!props.showSCImgCreate && (
        <SCImageCreator
          onSave={props.saveCTest}
          activitySpecId={props.activitySpecId}
          studies={props.studies}
          activities={props.activities}
          study={props.studyId ?? undefined}
        />
      )}
      {!!props.showTipCreate && (
        <TipCreator
          onSave={props.saveTipsActivity}
          studies={props.studies}
          allActivities={props.activities}
          study={props.studyId ?? undefined}
        />
      )}
      {!!props.showCreate && (
        <SurveyCreator studies={props.studies} onSave={props.saveActivity} study={props.studyId ?? undefined} />
      )}
      {!!props.showBreatheCreate && (
        <BreatheCreator
          activitySpecId={props.activitySpecId}
          studies={props.studies}
          onSave={props.saveCTest}
          activities={props.activities}
          study={props.studyId ?? undefined}
        />
      )}
      {!!props.showDBTCreate && (
        <DBTCreator
          activitySpecId={props.activitySpecId}
          onCancel={props.setAllFalse}
          studies={props.studies}
          onSave={props.saveCTest}
          activities={props.activities}
          study={props.studyId ?? undefined}
        />
      )}
    </Box>
  )
}
