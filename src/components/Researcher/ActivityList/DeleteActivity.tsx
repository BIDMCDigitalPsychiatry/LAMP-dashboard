import React, { useEffect, useState } from "react"
import { Icon, Fab, makeStyles, Theme, createStyles } from "@material-ui/core"
import LAMP from "lamp-core"
import { useSnackbar } from "notistack"
import { useTranslation } from "react-i18next"
import ConfirmationDialog from "../../ConfirmationDialog"
import { Service } from "../../DBService/DBService"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    btnText: {
      background: "transparent",
      borderRadius: "40px",
      minWidth: 100,
      boxShadow: "none",
      cursor: "pointer",
      textTransform: "capitalize",
      paddingLeft: "10px !important",
      paddingRight: "15px !important",
      fontSize: "14px",
      color: "#7599FF",
      "& svg": { marginRight: 8 },
      "&:hover": { color: "#5680f9", background: "#fff" },
      "& span.MuiIcon-root": { fontSize: 20, marginRight: 3 },
      [theme.breakpoints.up("md")]: {
        //position: "absolute",
      },
    },
  })
)

export default function DeleteActivity({
  activities,
  setActivities,
  profile,
  ...props
}: {
  activities: any
  setActivities?: Function
  profile?: boolean
}) {
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation()
  const classes = useStyles()
  const [confirmationDialog, setConfirmationDialog] = useState(0)
  const [participantCount, setParticipantCount] = useState(0)

  useEffect(() => {
    if (!!profile) {
      LAMP.Participant.allByStudy(activities[0].study_id).then((result) => {
        setParticipantCount(result.length)
      })
    }
  }, [])

  const confirmAction = async (status) => {
    if (status === "Yes") {
      let activityIds = activities.map((a) => {
        return a.id
      })
      for (let activity of activities) {
        let tag
        if (activity.spec === "lamp.survey") {
          tag = await LAMP.Type.setAttachment(activity.id, "me", "lamp.dashboard.survey_description", null)
        } else {
          tag = await LAMP.Type.setAttachment(activity.id, "me", "lamp.dashboard.activity_details", null)
        }
        if (activity.spec === "lamp.module" || activity.spec === "lamp.group") {
          let tag = [await LAMP.Type.getAttachment(null, "lamp.dashboard.hide_activities")].map((y: any) =>
            !!y?.error ? undefined : y?.data
          )[0]
          let hidden = (tag || []).filter((t) => t.moduleId !== activity.id)
          await LAMP.Type.setAttachment(null, "me", "lamp.dashboard.hide_activities", hidden)
        }
        console.dir("deleted tag " + JSON.stringify(tag))
        await LAMP.Activity.delete(activity.id)
        Service.updateCount("studies", activity.study_id, "activity_count", 1, 1)
      }
      Service.delete("activities", activityIds)
      setActivities()
      enqueueSnackbar(`${t("Successfully deleted the selected Activities.")}`, {
        variant: "success",
      })
    }
    setConfirmationDialog(0)
  }

  return (
    <span>
      <Fab
        variant="extended"
        size="small"
        classes={{ root: classes.btnText }}
        onClick={(event) => setConfirmationDialog(6)}
      >
        <Icon>delete_outline</Icon> {`${t("Delete")}`}
      </Fab>
      <ConfirmationDialog
        confirmationDialog={confirmationDialog}
        open={confirmationDialog > 0 ? true : false}
        onClose={() => setConfirmationDialog(0)}
        confirmAction={confirmAction}
        confirmationMsg={
          !!profile && participantCount > 1
            ? `${t(
                "This activity will be deleted for all the participants under this group. Are you sure you want to proceed?"
              )}`
            : `${t("Are you sure you want to delete this Activity?.")}`
        }
      />
    </span>
  )
}
