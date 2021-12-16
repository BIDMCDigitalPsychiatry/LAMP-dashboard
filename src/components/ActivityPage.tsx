// Core Imports
import React from "react"
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  makeStyles,
  createStyles,
  IconButton,
  Icon,
  Typography,
  Theme,
} from "@material-ui/core"
import { Participant as ParticipantObj } from "lamp-core"
import EmbeddedActivity from "./EmbeddedActivity"
import SurveyInstrument from "./SurveyInstrument"
import GroupActivity from "./GroupActivity"
import { useTranslation } from "react-i18next"
import VoiceRecordingResult from "./VoiceRecordingResult"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    MuiDialogPaperScrollPaper: {
      maxHeight: "100% !important",
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    dialogueStyle: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    ribbonText: {
      fontSize: "16px",
      color: "rgba(0, 0, 0, 0.75)",
      fontWeight: 600,
      marginBottom: "30px",
      padding: "0 42px",
    },
    dialogueCurve: { borderRadius: 10, maxWidth: 400 },
    niceWork: {
      "& h5": { fontSize: 25, fontWeight: 600, color: "rgba(0, 0, 0, 0.75)" },
    },
    niceWorkbadge: { position: "relative", "& span": { fontSize: "110px", color: "#2F9D7E" } },
  })
)

export default function ActivityPage({
  participant,
  activity,
  submitSurvey,
  setOpenData,
  showSteak,
  ...props
}: {
  participant: ParticipantObj
  activity: any
  submitSurvey: Function
  setOpenData: Function
  showSteak: Function
}) {
  const [openRecordSuccess, setOpenRecordSuccess] = React.useState(false)
  const classes = useStyles()
  const { t } = useTranslation()

  return (
    <Box>
      {(activity?.spec || "") === "lamp.survey" ? (
        <SurveyInstrument
          type={activity?.name ?? ""}
          fromPrevent={false}
          group={[activity]}
          participant={participant}
          onComplete={(response) => {
            submitSurvey(response, activity.id)
            setOpenData(false)
          }}
        />
      ) : (activity?.spec || "") === "lamp.group" ? (
        <GroupActivity
          activity={activity}
          participant={participant}
          submitSurvey={(response) => {
            submitSurvey(response, activity.id)
            setOpenData(false)
          }}
          onComplete={() => {
            setOpenData(false)
          }}
        />
      ) : (
        <EmbeddedActivity
          name={activity?.description ?? ""}
          activity={activity ?? []}
          participant={participant}
          noBack={false}
          onComplete={(data) => {
            if (activity?.spec === "lamp.recording" && !!data && !!data?.timestamp) {
              if (!!data && !!data?.timestamp) {
                setOpenRecordSuccess(true)
                setTimeout(function () {
                  setOpenRecordSuccess(false)
                  showSteak(participant, activity.id)
                  setOpenData(false)
                }, 2000)
              } else setOpenData(false)
            } else {
              if (activity?.spec === "lamp.tips" ||  activity?.spec === "lamp.breathe") showSteak(participant, activity.id)
              else if(!!data && !!data?.timestamp) showSteak(participant, activity.id)  
              setOpenData(false)
            }
          }}
        />
      )}
      <VoiceRecordingResult open={openRecordSuccess}
        onClose={() => {
          setOpenRecordSuccess(false)
        }}
        setOpenRecordSuccess={setOpenRecordSuccess} />     
    </Box>
  )
}
