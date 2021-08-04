// Core Imports
import React from "react"
import {
  Button,
  DialogTitle,
  DialogContentText,
  DialogActions,
  Dialog,
  DialogContent,
  DialogProps,
} from "@material-ui/core"
import { useTranslation } from "react-i18next"

export default function ConfirmationDialog({
  confirmAction,
  confirmationDialog,
  ...props
}: {
  confirmAction: Function
  confirmationDialog: number
} & DialogProps) {
  const { t } = useTranslation()
  return (
    <Dialog {...props} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">{t("Confirmation")}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {confirmationDialog === 1
            ? t(
                "Changes done to this activity will reflect for all the participants under the study. Are you sure you want proceed?"
              )
            : confirmationDialog === 2
            ? t(
                "This activity will be deleted for all the participants under this study. Are you sure you want to proceed?"
              )
            : confirmationDialog === 3
            ? t(
                "Changes done to this sensor will reflect for all the participants under the study. Are you sure you want proceed?"
              )
            : confirmationDialog === 4
            ? t(
                "This sensor will be deleted for all the participants under this study. Are you sure you want to proceed?"
              )
            : confirmationDialog === 5
            ? t("Are you sure you want to delete this sensor?")
            : confirmationDialog === 6
            ? t("Are you sure you want to delete this Activity?")
            : confirmationDialog === 7
            ? t("Are you sure you want to delete this Participant?")
            : t("Are you sure you want to delete this care team member? ")}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => confirmAction("No")} color="primary">
          {t("No")}
        </Button>
        <Button
          onClick={() => {
            confirmAction("Yes")
          }}
          color="primary"
          autoFocus
        >
          {t("Yes")}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
