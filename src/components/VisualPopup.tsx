import React from "react"
import Dialog from "@material-ui/core/Dialog"
import { DialogProps } from "@material-ui/core/Dialog" // TypeScript type
import DialogContent from "@material-ui/core/DialogContent"
import DialogActions from "@material-ui/core/DialogActions"
import Box from "@material-ui/core/Box"
import Fab from "@material-ui/core/Fab"
import Grid from "@material-ui/core/Grid"
import makeStyles from "@material-ui/core/styles/makeStyles"
import createStyles from "@material-ui/core/styles/createStyles"
import { Theme } from "@material-ui/core/styles/createTheme" // TypeScript type

import { useTranslation } from "react-i18next"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialogueStyle: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    dialogueCurve: { borderRadius: 10, maxWidth: 400 },
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    visualIcon: {
      width: 100,
      height: 100,
      fill: theme.palette.primary.main,
    },
    btnBlue: {
      background: "#7599FF",
      borderRadius: "40px",
      minWidth: 100,
      boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.20)",
      lineHeight: "38px",
      cursor: "pointer",
      textTransform: "capitalize",
      fontSize: "16px",
      color: "#fff",
      "&:hover": { background: "#5680f9" },
    },
    justifyCenter: {
      justifyContent: "center",
      padding: "5px 0 15px",
    },
    score: {
      border: "#aedbff solid 1px",
      color: "#2196f3",
      padding: "4px 12px",
      borderRadius: 15,
      marginTop: 3,
    },
    maxscore: {
      fontSize: 12,
      marginTop: 3,
    },
  })
)

export default function VisualPopup({
  image,
  showStreak,
  data,
  ...props
}: {
  image?: any
  data?: any
  showStreak?: Function
} & DialogProps) {
  const classes = useStyles()
  const { t } = useTranslation()

  return (
    <Dialog
      {...props}
      scroll="paper"
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
      classes={{
        root: classes.dialogueStyle,
        paper: classes.dialogueCurve,
      }}
    >
      <DialogContent>
        <Box textAlign="center">
          <Box
            style={{
              margin: "auto",
              height: "400px",
              width: "300px",
              background: `url(${image}) center center/contain no-repeat`,
            }}
          ></Box>
        </Box>
        {!!data?.score && (
          <Grid container direction="row" justifyContent="space-between" alignItems="center">
            <span className={classes.score}>{`Score: ${data?.score}`}</span>
            <span className={classes.maxscore}>{`Maximum score: ${data?.max_score ?? 100}`}</span>
          </Grid>
        )}
      </DialogContent>
      <DialogActions className={classes.justifyCenter}>
        <Fab
          className={classes.btnBlue}
          aria-label="Save"
          variant="extended"
          onClick={() => {
            showStreak()
          }}
        >
          {`${t("Ok")}`}
        </Fab>
      </DialogActions>
    </Dialog>
  )
}
