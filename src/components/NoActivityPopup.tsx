const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    score: {
      color: "#2b2c2cff",
      padding: "4px 12px",

      marginTop: 3,
    },
  })
)

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
  makeStyles,
  Theme,
  createStyles,
  Grid,
} from "@material-ui/core"
import { useTranslation } from "react-i18next"

export default function ConfirmationDialog({
  confirmAction,
  confirmationMsg,
  onClose,
  ...props
}: {
  confirmAction: any
  confirmationMsg: string
  onClose: any
} & DialogProps) {
  const { t } = useTranslation()
  const [isClicked, setIsClicked] = useState(false)
  const classes = useStyles()

  useEffect(() => {
    setIsClicked(false)
  }, [])

  return (
    <Dialog {...props} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">{`${t("  ")}`}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Grid container direction="row" justifyContent="space-between" alignItems="center">
            <span className={classes.score}>{`${t(confirmationMsg)}`}</span>
          </Grid>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" autoFocus>
          {`${t("ok")}`}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
