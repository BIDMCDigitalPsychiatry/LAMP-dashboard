import React, { useState, useEffect } from "react"
import { Icon, Fab, makeStyles, Theme, createStyles, Link } from "@material-ui/core"
import { useTranslation } from "react-i18next"
import ConfirmationDialog from "../../ConfirmationDialog"
import LAMP from "lamp-core"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    btnWhite: {
      background: "#fff",
      borderRadius: "40px",
      boxShadow: "none",
      cursor: "pointer",
      textTransform: "capitalize",
      fontSize: "14px",
      color: "#7599FF",
      "& svg": { marginRight: 8 },
      "&:hover": { color: "#5680f9", background: "#fff", boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.20)" },
    },
  })
)

export default function UpdateActivity({
  activity,
  activities,
  studies,
  setActivities,
  profile,
  researcherId,
  ...props
}) {
  const classes = useStyles()
  const { t } = useTranslation()
  const [confirmationDialog, setConfirmationDialog] = useState(0)
  const [participantCount, setParticipantCount] = useState(0)

  useEffect(() => {
    if (!!profile) {
      LAMP.Participant.allByStudy(activity.study_id).then((result) => {
        setParticipantCount(result.length)
      })
    }
  }, [])

  const confirmAction = (status: string) => {
    if (status === "Yes") {
      window.location.href = `/#/researcher/${researcherId}/activity/${activity.id}`
    }
    setConfirmationDialog(0)
  }

  return (
    <span>
      {!!profile ? (
        <Fab
          size="small"
          color="primary"
          classes={{ root: classes.btnWhite }}
          onClick={(event) => {
            participantCount > 1
              ? setConfirmationDialog(3)
              : (window.location.href = `/#/researcher/${researcherId}/activity/${activity.id}`)
          }}
        >
          <Icon>mode_edit</Icon>
        </Fab>
      ) : (
        <Link href={`/#/researcher/${researcherId}/activity/${activity.id}`} underline="none">
          <Icon>mode_edit</Icon>
        </Link>
      )}
      <ConfirmationDialog
        confirmationDialog={confirmationDialog}
        open={confirmationDialog > 0 ? true : false}
        onClose={() => setConfirmationDialog(0)}
        confirmAction={confirmAction}
        confirmationMsg={
          !!profile && participantCount > 1
            ? t(
                "Changes done to this activity will reflect for all the participants under the study. Are you sure you want to proceed?."
              )
            : ""
        }
      />
    </span>
  )
}
