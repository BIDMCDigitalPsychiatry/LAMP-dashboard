import React from "react"
import { Dialog, Box, Typography, Button, LinearProgress, makeStyles } from "@material-ui/core"
import AccessTimeRoundedIcon from "@material-ui/icons/AccessTimeRounded"
import { useTranslation } from "react-i18next"
import { useButtonStyles, useDialogStyles } from "../theme/styles"
import { themeColors } from "../theme/tokens"

const useStyles = makeStyles({
  paper: { width: 420 },
  progress: {
    height: 6,
    borderRadius: 3,
    marginTop: 16,
    backgroundColor: themeColors.border,
    "& .MuiLinearProgress-bar": { backgroundColor: themeColors.primary },
  },
})

/** Warns researchers and admins before an idle logout, with a countdown */
export default function IdlePrompt({ open, idleMinutes, secondsLeft, totalSeconds, onStay, onLogout }) {
  const classes = useStyles()
  const dialog = useDialogStyles()
  const buttons = useButtonStyles()
  const { t } = useTranslation()
  const time = `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, "0")}`
  return (
    <Dialog
      open={open}
      onClose={onStay}
      aria-labelledby="idle-title"
      aria-describedby="idle-body"
      classes={{ paper: `${dialog.paper} ${classes.paper}` }}
    >
      <Box className={dialog.icon}>
        <AccessTimeRoundedIcon />
      </Box>
      <Typography id="idle-title" component="h2" className={dialog.title}>
        {`${t("Still there?")}`}
      </Typography>
      <Typography id="idle-body" className={dialog.body}>
        {`${t("You've been inactive for {{minutes}} minutes. For security, you'll be logged out in {{time}}.", {
          minutes: idleMinutes,
          time,
        })}`}
      </Typography>
      <LinearProgress
        variant="determinate"
        value={(secondsLeft / totalSeconds) * 100}
        aria-label={`${t("Time until logout")}`}
        className={classes.progress}
      />
      <Box className={dialog.actions}>
        <Button className={buttons.secondary} onClick={onLogout}>
          {`${t("Log out")}`}
        </Button>
        <Button className={buttons.primary} onClick={onStay} autoFocus>
          {`${t("Stay logged in")}`}
        </Button>
      </Box>
    </Dialog>
  )
}
