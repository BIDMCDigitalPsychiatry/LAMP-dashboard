import React, { useState } from "react"
import {
  Box,
  Button,
  MenuItem,
  DialogContentText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core"
// Local Imports
import LAMP from "lamp-core"
import { makeStyles, Theme, createStyles, createMuiTheme } from "@material-ui/core/styles"
import { useTranslation } from "react-i18next"
import { Service } from "../../DBService/DBService"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbardashboard: {
      minHeight: 100,
      padding: "0 10px",
      "& h5": {
        color: "rgba(0, 0, 0, 0.75)",
        textAlign: "left",
        fontWeight: "600",
        fontSize: 30,
        width: "calc(100% - 96px)",
      },
    },
    tableContainer: {
      "& div.MuiInput-underline:before": { borderBottom: "0 !important" },
      "& div.MuiInput-underline:after": { borderBottom: "0 !important" },
      "& div.MuiInput-underline": {
        "& span.material-icons": {
          width: 21,
          height: 19,
          fontSize: 27,
          lineHeight: "23PX",
          color: "rgba(0, 0, 0, 0.4)",
        },
        "& button": { display: "none" },
      },
    },
    backdrop: {
      zIndex: 111111,
      color: "#fff",
    },
  })
)

export default function DeleteParticipant({ participant, ...props }) {
  const [deleteConfirmationDialog, setDeleteConfirmationDialog] = useState(false)
  const { t } = useTranslation()

  let deleteParticipant = async (participantId) => {
    await LAMP.Participant.delete(participantId)
    Service.delete("participants", [participantId])
  }

  return (
    <Box>
      <MenuItem onClick={() => setDeleteConfirmationDialog(true)}>Delete</MenuItem>

      <Dialog
        open={deleteConfirmationDialog}
        onClose={() => setDeleteConfirmationDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirmation"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t("Are you sure you want to delete this Participant?")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmationDialog(false)} color="primary">
            No
          </Button>
          <Button
            onClick={() => {
              deleteParticipant(participant.id)
            }}
            color="primary"
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
