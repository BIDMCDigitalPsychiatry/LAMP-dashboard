// Core Imports
import React, { useState, useEffect } from "react"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogActions from "@material-ui/core/DialogActions"
// For types
import { DialogProps } from "@material-ui/core/Dialog"
import { useTranslation } from "react-i18next"

export default function ConfirmationDialog({
  confirmAction,
  confirmationDialog,
  confirmationMsg,
  okText,
  cancelText,
  ...props
}: {
  confirmAction: Function
  confirmationDialog?: number
  confirmationMsg: string
  okText?: string
  cancelText?: string
} & DialogProps) {
  const { t } = useTranslation()
  const [isClicked, setIsClicked] = useState(false)

  useEffect(() => {
    setIsClicked(false)
  }, [])

  return (
    <Dialog {...props} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">{`${t("Confirmation")}`}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{`${t(confirmationMsg)}`}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => confirmAction("No")} color="primary">
          {`${t(cancelText ?? "No")}`}
        </Button>
        <Button
          onClick={() => {
            setIsClicked(true)
            confirmAction("Yes")
            setIsClicked(false)
          }}
          color="primary"
          autoFocus
          disabled={!!isClicked}
        >
          {`${t(okText ?? "Yes")}`}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
