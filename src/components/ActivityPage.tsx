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
          onComplete={(data) => {
            if (activity?.spec === "lamp.recording") {
              setOpenRecordSuccess(true)
              setTimeout(function () {
                setOpenRecordSuccess(false)
                if (!!data && !!data?.timestamp) showSteak(participant, activity.id)
                setOpenData(false)
              }, 2000)
            } else {
              if (activity?.spec === "lamp.tips" && !!data) showSteak(participant, activity.id)
              else if(activity?.spec === "lamp.dbt_diary_card" && !!data && !!data?.timestamp) showSteak(participant, activity.id)
              else if (activity?.spec !== "lamp.tips" && activity?.spec !== "lamp.dbt_diary_card" && !!data && (!!data?.completed || !!data.timestamp))
                showSteak(participant, activity.id)
              setOpenData(false)
            }
          }}
        />
      )}
      <Dialog
        open={openRecordSuccess}
        onClose={() => setOpenRecordSuccess(false)}
        scroll="paper"
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        classes={{
          root: classes.dialogueStyle,
          paper: classes.dialogueCurve,
          paperScrollPaper: classes.MuiDialogPaperScrollPaper,
        }}
      >
        <DialogTitle>
          <IconButton aria-label="close" className={classes.closeButton} onClick={() => setOpenRecordSuccess(false)}>
            <Icon>close</Icon>
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box textAlign="center" pb={4} className={classes.niceWork}>
            <Typography variant="h5" gutterBottom>
              {t("Success") + "!"}
            </Typography>
            <Typography className={classes.ribbonText} component="p">
              {t("Voice Recorded has been submitted Successfully.")}
            </Typography>
            <Box textAlign="center" className={classes.niceWorkbadge}>
              <Icon>check_circle</Icon>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  )
}
