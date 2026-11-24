import React from "react"
import { Dialog, Box, Typography, Button, LinearProgress, makeStyles } from "@material-ui/core"
import AccessTimeRoundedIcon from "@material-ui/icons/AccessTimeRounded"
import { useTranslation } from "react-i18next"

const useStyles = makeStyles({
  paper: {
    width: 420,
    maxWidth: "calc(100% - 32px)",
    margin: 16,
    borderRadius: 16,
    padding: "24px 24px 20px",
    boxShadow: "0 20px 48px rgba(15, 23, 42, 0.24)",
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginBottom: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#ECF4FF",
    color: "#1565C0",
  },
  title: { fontSize: 20, fontWeight: 600, color: "#111827", marginBottom: 8 },
  body: { fontSize: 15, lineHeight: 1.5, color: "#4B5563" },
  progress: {
    height: 6,
    borderRadius: 3,
    marginTop: 16,
    backgroundColor: "#E5E7EB",
    "& .MuiLinearProgress-bar": { backgroundColor: "#1565C0" },
  },
  actions: { display: "flex", justifyContent: "flex-end", flexWrap: "wrap", gap: 8, marginTop: 20 },
  logout: {
    height: 44,
    padding: "0 16px",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    textTransform: "none",
    color: "#1F2937",
    background: "#F3F4F6",
    "&:hover": { background: "#E5E7EB" },
  },
  stay: {
    height: 44,
    padding: "0 16px",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    textTransform: "none",
    color: "#FFFFFF",
    background: "#1565C0",
    "&:hover": { background: "#0D47A1" },
  },
})

/** Warns researchers and admins before an idle logout, with a countdown */
export default function IdlePrompt({ open, idleMinutes, secondsLeft, totalSeconds, onStay, onLogout }) {
  const classes = useStyles()
  const { t } = useTranslation()
  const time = `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, "0")}`
  return (
    <Dialog
      open={open}
      onClose={onStay}
      aria-labelledby="idle-title"
      aria-describedby="idle-body"
      classes={{ paper: classes.paper }}
    >
      <Box className={classes.icon}>
        <AccessTimeRoundedIcon />
      </Box>
      <Typography id="idle-title" component="h2" className={classes.title}>
        {`${t("Still there?")}`}
      </Typography>
      <Typography id="idle-body" className={classes.body}>
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
      <Box className={classes.actions}>
        <Button className={classes.logout} onClick={onLogout}>
          {`${t("Log out")}`}
        </Button>
        <Button className={classes.stay} onClick={onStay} autoFocus>
          {`${t("Stay logged in")}`}
        </Button>
      </Box>
    </Dialog>
  )
}
