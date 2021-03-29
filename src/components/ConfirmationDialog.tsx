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
  confirmationMsg,
  ...props
}: {
  confirmAction: Function
  confirmationDialog: number
  confirmationMsg: string
} & DialogProps) {
  const { t } = useTranslation()
  return (
    <Dialog {...props} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">{t("Confirmation")}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{t(confirmationMsg)}</DialogContentText>
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
