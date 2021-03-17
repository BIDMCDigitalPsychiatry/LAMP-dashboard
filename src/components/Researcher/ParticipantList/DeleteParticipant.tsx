import React, { useState } from "react"
import { Box, Icon, Fab } from "@material-ui/core"
import LAMP from "lamp-core"
import { useSnackbar } from "notistack"
import { useTranslation } from "react-i18next"
import { makeStyles, Theme, createStyles, MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles"
import ResponsiveDialog from "../../ResponsiveDialog"
import ConfirmationDialog from "../ParticipantList/Profile/ConfirmationDialog"
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

export default function DeleteParticipant({ participants, setParticipants, ...props }) {
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation()
  const classes = useStyles()
  const [confirmationDialog, setConfirmationDialog] = useState(0)
  let deleteParticipants = async (status) => {
    if (status === "Yes") {
      const participantIds = participants.map((p) => {
        return p.id
      })
      for (let participant of participants) {
        await LAMP.Participant.delete(participant.id)
        Service.updateCount("studies", participant.study_id, "participants_count", 1, 1)
      }
      Service.delete("participants", participantIds)
      enqueueSnackbar(t("Successfully deleted the selected participants."), {
        variant: "success",
      })
    }
    setParticipants()
    setConfirmationDialog(0)
  }
  return (
    <span>
      <Fab
        variant="extended"
        size="small"
        classes={{ root: classes.btnText }}
        onClick={(event) => setConfirmationDialog(7)}
      >
        <Icon>delete_outline</Icon> {t("Delete")}
      </Fab>
      <ConfirmationDialog
        confirmationDialog={confirmationDialog}
        open={confirmationDialog > 0 ? true : false}
        onClose={() => setConfirmationDialog(0)}
        confirmAction={deleteParticipants}
      />
    </span>
  )
}
