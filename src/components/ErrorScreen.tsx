import React, { useEffect, useState } from "react"
import { Box, Typography, Button, makeStyles } from "@material-ui/core"
import ReportProblemOutlinedIcon from "@material-ui/icons/ReportProblemOutlined"
import { useTranslation } from "react-i18next"
import StackTrace from "stacktrace-js"
import LAMP from "lamp-core"
import { dashboardVersion, serverAddress } from "./helper"

// Rendered by the error boundary outside the app's theme, so fonts and colors are set here
const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
    boxSizing: "border-box",
    padding: "40px 16px",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    background: "#F7F8FA",
    fontFamily: "Inter, Roboto, Helvetica, Arial, sans-serif",
    color: "#111827",
  },
  card: {
    width: 540,
    maxWidth: "100%",
    boxSizing: "border-box",
    padding: 28,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    background: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: 16,
    boxShadow: "0 1px 3px rgba(15, 23, 42, 0.06)",
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#FEF3F2",
    color: "#B42318",
  },
  title: { fontFamily: "inherit", fontSize: 22, fontWeight: 600, color: "#111827" },
  body: { fontFamily: "inherit", fontSize: 15, lineHeight: 1.5, color: "#4B5563" },
  reload: {
    alignSelf: "flex-start",
    height: 44,
    marginTop: 4,
    padding: "0 18px",
    borderRadius: 10,
    fontFamily: "inherit",
    fontSize: 15,
    fontWeight: 600,
    textTransform: "none",
    color: "#FFFFFF",
    background: "#1565C0",
    "&:hover": { background: "#0D47A1" },
  },
  details: {
    marginTop: 10,
    padding: "14px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    background: "#F7F8FA",
    border: "1px solid #E5E7EB",
    borderRadius: 10,
    userSelect: "text",
  },
  detailsTitle: {
    margin: 0,
    fontSize: 12,
    fontWeight: 600,
    color: "#4B5563",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  list: {
    margin: 0,
    display: "grid",
    gridTemplateColumns: "64px minmax(0, 1fr)",
    gap: "6px 12px",
    fontSize: 13,
    lineHeight: 1.45,
    "& dt": { color: "#6B7280" },
    "& dd": { margin: 0, overflowWrap: "anywhere" },
  },
  error: { fontFamily: "Menlo, Consolas, monospace", fontSize: 12.5, color: "#B42318" },
})

/** Shown when the dashboard crashes, with the details support needs to triage a screenshot */
export default function ErrorScreen({ error }) {
  const classes = useStyles()
  const { t } = useTranslation()
  const [time] = useState(() =>
    new Date().toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    })
  )
  const server = serverAddress()
  // Leave off any query string, which can carry a login token
  const screen = window.location.hash.replace(/^#/, "").split("?")[0] || "/"
  const message = !error
    ? ""
    : (error.message || "").match(/^\w*:/) || !error.name
    ? error.message
    : `${error.name}: ${error.message}`
  const staff = ["researcher", "admin"].includes(LAMP.Auth?._type)

  useEffect(() => {
    // The production stack is minified; log a source-mapped one for whoever reproduces the crash
    if (!error) return
    StackTrace.fromError(error)
      .then((frames) => console.error(`Dashboard crash, mapped stack:\n${frames.map((f) => f.toString()).join("\n")}`))
      .catch(() => {})
  }, [error])

  return (
    <Box className={classes.root}>
      <Box component="main" className={classes.card}>
        <Box className={classes.icon}>
          <ReportProblemOutlinedIcon />
        </Box>
        <Typography component="h1" className={classes.title}>
          {`${t("Something went wrong")}`}
        </Typography>
        <Typography className={classes.body}>
          {staff
            ? `${t(
                "Reload the page to try again. If it keeps happening, take a screenshot of this page and email it to {{email}}.",
                { email: "mindlamp@bidmc.harvard.edu" }
              )}`
            : `${t(
                "Reload the page to try again. If it keeps happening, take a screenshot of this page and send it to your research team."
              )}`}
        </Typography>
        <Button className={classes.reload} onClick={() => window.location.reload()}>
          {`${t("Reload page")}`}
        </Button>
        <Box component="section" aria-labelledby="support-details" className={classes.details}>
          <h2 id="support-details" className={classes.detailsTitle}>
            {`${t("Details for support")}`}
          </h2>
          <dl className={classes.list}>
            <dt>{`${t("Version")}`}</dt>
            <dd>{dashboardVersion()}</dd>
            {!!server && <dt>{`${t("Server")}`}</dt>}
            {!!server && <dd>{server}</dd>}
            <dt>{`${t("Time")}`}</dt>
            <dd>{time}</dd>
            <dt>{`${t("Screen")}`}</dt>
            <dd>{screen}</dd>
            {!!message && <dt>{`${t("Error")}`}</dt>}
            {!!message && <dd className={classes.error}>{message}</dd>}
          </dl>
        </Box>
      </Box>
    </Box>
  )
}
