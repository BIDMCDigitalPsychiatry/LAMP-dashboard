// Core Imports
import React, { useEffect } from "react"
import { Box } from "@material-ui/core"
import { Participant as ParticipantObj } from "lamp-core"
import EmbeddedActivity from "./EmbeddedActivity"
import SurveyInstrument from "./SurveyInstrument"
import GroupActivity from "./GroupActivity"
import { useTranslation } from "react-i18next"
import VoiceRecordingResult from "./VoiceRecordingResult"
import { openDB } from "idb"
import ResponsiveDialog from "./ResponsiveDialog"

export default function ActivityPage({
  participant,
  activity,
  submitSurvey,
  setOpenData,
  showStreak,
  openData,
  ...props
}: {
  participant: ParticipantObj
  activity: any
  submitSurvey: Function
  setOpenData: Function
  showStreak: Function
  openData: boolean
}) {
  const [openRecordSuccess, setOpenRecordSuccess] = React.useState(false)
  const [data, setResponse] = React.useState(null)
  const { t } = useTranslation()

  useEffect(() => {
    console.log(openData)
    setResponse(null)
  }, [])

  useEffect(() => {
    if (data !== null) {
      if (activity?.spec === "lamp.survey") {
        if (!!data) submitSurvey(data, activity)
      } else if (activity?.spec === "lamp.recording") {
        if (!!data && !!data?.timestamp) {
          setOpenRecordSuccess(true)
          setTimeout(function () {
            setOpenRecordSuccess(false)
            showStreak(participant, activity)
            setOpenData(false)
          }, 2000)
        } else setOpenData(false)
      } else if (!!data && !!data?.timestamp) showStreak(participant, activity)
      setResponse(null)
    }
  }, [data])

  return (
    <Box>
      <ResponsiveDialog
        transient={false}
        animate
        fullScreen
        open={openData}
        onClose={() => {
          setOpenData(false)
        }}
      >
        {!!activity && activity?.spec === "lamp.survey" ? (
          <SurveyInstrument
            type={activity?.name ?? ""}
            fromPrevent={false}
            group={[activity]}
            participant={participant}
            onComplete={(response) => {
              setResponse(response)
              setOpenData(false)
            }}
            noBack={false}
          />
        ) : !!activity && activity?.spec === "lamp.group" ? (
          <GroupActivity
            activity={activity}
            participant={participant}
            onComplete={(res) => {
              setResponse(res)
              setOpenData(false)
            }}
            noBack={false}
          />
        ) : !!activity && activity?.spec !== "lamp.survey" && activity?.spec !== "lamp.group" ? (
          <EmbeddedActivity
            name={activity?.description ?? ""}
            activity={activity ?? []}
            participant={participant}
            noBack={false}
            onComplete={(data) => {
              setResponse(data)
              setOpenData(false)
            }}
          />
        ) : null}
      </ResponsiveDialog>
      <VoiceRecordingResult
        open={openRecordSuccess}
        onClose={() => {
          setOpenRecordSuccess(false)
        }}
        setOpenRecordSuccess={setOpenRecordSuccess}
      />
    </Box>
  )
}
