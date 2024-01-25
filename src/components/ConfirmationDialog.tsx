// Core Imports
import React, { useState, useEffect } from "react"
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
