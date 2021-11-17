// Core Imports
import React, { useState, useEffect } from "react"
import {
  Container,
  Typography,
  Grid,
  Icon,
  Card,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  ButtonBase,
  makeStyles,
  Theme,
  createStyles,
  Link,
} from "@material-ui/core"
import ResponsiveDialog from "./ResponsiveDialog"
import SurveyInstrument from "./SurveyInstrument"
import LAMP from "lamp-core"
import classnames from "classnames"
import { useSnackbar } from "notistack"
import { useTranslation } from "react-i18next"
import { DatePicker } from "@material-ui/pickers"
import EmbeddedActivity from "./EmbeddedActivity"
import InfoIcon from "../icons/Info.svg"
import GroupActivity from "./GroupActivity"
import ReactMarkdown from "react-markdown"
import emoji from "remark-emoji"
import gfm from "remark-gfm"
import { changeCase } from "./App"
import { ReactComponent as BreatheIcon } from "../icons/Breathe.svg"
import ScratchCard from "../icons/ScratchCard.svg"
import { ReactComponent as JournalIcon } from "../icons/Goal.svg"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    linkButton: {
      padding: "15px 25px 15px 25px",
    },
    cardlabel: {
      fontSize: 14,
      padding: "0 18px",
      bottom: 15,
      position: "absolute",
      width: "100%",
      [theme.breakpoints.down("sm")]: {
        fontSize: 12,
        padding: "0 5px",
      },
    },
    assess: {
      background: "#E7F8F2",
      padding: "10px 0",
      minHeight: 180,
      textAlign: "center",
      boxShadow: "none",
      borderRadius: 18,
      position: "relative",
      width: "100%",
      "& svg": {
        [theme.breakpoints.up("lg")]: {
          width: 150,
          height: 150,
        },
      },
      [theme.breakpoints.up("lg")]: {
        minHeight: 240,
      },
    },
    MuiDialogPaperScrollPaper: {
      maxHeight: "100% !important",
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    dialogueStyle: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    header: {
      background: "#E7F8F2",
      padding: "35px 40px 10px",
      textAlign: "center",
      [theme.breakpoints.down("lg")]: {
        padding: "35px 20px 10px",
      },
      "& h2": {
        fontSize: 25,
        fontWeight: 600,
        color: "rgba(0, 0, 0, 0.75)",
        textAlign: "left",
        [theme.breakpoints.down("sm")]: {
          fontSize: 18,
        },
      },

      "& h6": {
        fontSize: "14px",
        fontWeight: "normal",
        textAlign: "left",
      },
    },
    btngreen: {
      background: "#92E7CA",
      borderRadius: "40px",
      minWidth: "200px",
      boxShadow: " 0px 10px 15px rgba(146, 231, 202, 0.25)",
      lineHeight: "22px",
      display: "inline-block",
      textTransform: "capitalize",
      fontSize: "16px",
      color: "rgba(0, 0, 0, 0.75)",
      fontWeight: "bold",
      marginBottom: 20,
      cursor: "pointer",
      [theme.breakpoints.down("sm")]: {
        marginBottom: 0,
      },
      "&:hover": {
        boxShadow:
          "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
      },
    },
    topicon: {
      minWidth: 150,
      minHeight: 150,
      [theme.breakpoints.up("lg")]: {
        width: 150,
        height: 150,
      },
      [theme.breakpoints.down("sm")]: {
        minWidth: 105,
        minHeight: 105,
      },
    },
    surveytextarea: {
      padding: "20px 40px 40px",
      "& h4": { fontSize: 16, fontWeight: "bold", marginBottom: 15 },
      [theme.breakpoints.down("lg")]: {
        padding: "20px 20px 10px",
      },
    },
    dialogtitle: { padding: 0 },

    ribbonText: {
      fontSize: "16px",
      color: "rgba(0, 0, 0, 0.75)",
      fontWeight: 600,
      marginBottom: "30px",
      padding: "0 42px",
    },
    thumbMain: { maxWidth: 255 },
    thumbContainer: {
      maxWidth: 1055,
      width: "80%",
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        paddingBottom: 80,
      },
    },
    fullwidthBtn: { width: "100%" },
    dialogueCurve: { borderRadius: 10, maxWidth: 400 },
    niceWork: {
      "& h5": { fontSize: 25, fontWeight: 600, color: "rgba(0, 0, 0, 0.75)" },
    },
    calendatInput: {
      width: "100%",
      "& input": {
        textAlign: "center",
        fontSize: 18,
        fontWeight: 600,
        color: "rgba(0, 0, 0, 0.75)",
      },
    },
    mainIcons: {
      width: 100,
      height: 100,
      [theme.breakpoints.up("lg")]: {
        width: 150,
        height: 150,
      },
    },
    blankMsg: {
      "& path": { fill: "#666" },
      "& p": { margin: "2px 5px" },
    },
    niceWorkbadge: { position: "relative", "& span": { fontSize: "110px", color: "#2F9D7E" } },
    dayNotification: {
      position: "absolute",
      top: 0,
      width: "100%",
      paddingTop: 50,
      "& h4": { fontSize: 40, fontWeight: 700, color: "#00765C", lineHeight: "38px" },
      "& h6": { color: "#00765C", fontSize: 16, fontWeight: 600 },
    },
  })
)

export default function ActivityPopup({
  activity,
  questionCount,
  spec,
  open,
  setOpen,
  setOpenData,
  tag,
  type,
  ...props
}) {
  const classes = useStyles()
  const { t } = useTranslation()

  function LinkRenderer(data: any) {
    return (
      <a href={data.href} target="_blank">
        {data.children}
      </a>
    )
  }

  return (
    <Dialog
      open={open}
      maxWidth="xs"
      onClose={() => setOpen(false)}
      scroll="paper"
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
      classes={{
        root: classes.dialogueStyle,
        paper: classes.dialogueCurve,
      }}
    >
      <DialogTitle id="alert-dialog-slide-title" className={classes.dialogtitle}>
        <IconButton aria-label="close" className={classes.closeButton} onClick={() => setOpen(false)}>
          <Icon>close</Icon>
        </IconButton>
        <div className={classes.header}>
          <Box
            className={classes.topicon}
            style={{
              margin: "auto",
              background: tag[activity?.id]?.photo
                ? `url(${tag[activity?.id]?.photo}) center center/contain no-repeat`
                : activity?.spec === "lamp.breathe"
                ? `url(${BreatheIcon}) center center/contain no-repeat`
                : activity?.spec === "lamp.journal"
                ? `url(${JournalIcon}) center center/contain no-repeat`
                : activity?.spec === "lamp.scrath_image"
                ? `url(${ScratchCard}) center center/contain no-repeat`
                : `url(${InfoIcon}) center center/contain no-repeat`,
            }}
          ></Box>
          <Typography variant="body2" align="left">
            {t(type)}
          </Typography>
          <Typography variant="h2">
            <ReactMarkdown
              source={t(activity?.name ?? null)}
              escapeHtml={false}
              plugins={[gfm, emoji]}
              renderers={{ link: LinkRenderer }}
            />
            {" (" + t(changeCase(spec?.substr(5))) + ")"}
          </Typography>
        </div>
      </DialogTitle>
      <DialogContent className={classes.surveytextarea}>
        {spec === "lamp.tips" && (
          <Typography variant="h4" gutterBottom>
            {t("Quick Tips to Improve Your")} {t(activity?.name)}
          </Typography>
        )}
        {(spec === "lamp.survey" || spec === "lamp.dbt_diary_card") && (
          <Typography variant="h4" gutterBottom>
            {questionCount} {questionCount > 1 ? t(" questions") : t(" question")} {/* (10 mins) */}
          </Typography>
        )}
        <Typography variant="body2" component="p">
          <ReactMarkdown
            source={
              spec !== "lamp.dbt_diary_card"
                ? t(tag[activity?.id]?.description ?? null)
                : t("Daily log of events and related feelings. Track target behaviors and use of skills.")
            }
            escapeHtml={false}
            plugins={[gfm, emoji]}
            renderers={{ link: LinkRenderer }}
          />
        </Typography>
      </DialogContent>
      <DialogActions>
        <Box textAlign="center" width={1} mt={1} mb={3}>
          <Link
            onClick={() => {
              setOpenData(true)
              setOpen(false)
            }}
            underline="none"
            className={classnames(classes.btngreen, classes.linkButton)}
          >
            {spec === "lamp.survey" ? t("Start survey") : t("Begin")}
          </Link>
        </Box>
      </DialogActions>
    </Dialog>
  )
}
