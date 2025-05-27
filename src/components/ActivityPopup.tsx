// Core Imports
import React, { useEffect } from "react"
import {
  Typography,
  Icon,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  makeStyles,
  Theme,
  createStyles,
  DialogProps,
  Link,
} from "@material-ui/core"
import classnames from "classnames"
import { useTranslation } from "react-i18next"
import InfoIcon from "../icons/Info.svg"
import ReactMarkdown from "react-markdown"
import emoji from "remark-emoji"
import gfm from "remark-gfm"
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
    closeButton: {
      position: "absolute",
      right: 0,
      top: 0,
      color: theme.palette.grey[500],
    },
    dialogueStyle: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    assessH: {
      background: "#E7F8F2 !important",
    },
    learnH: {
      background: "#FFF9E5 !important",
    },
    manageH: {
      background: "#FFEFEC !important",
    },
    preventH: {
      background: "#ECF4FF !important",
    },
    header: {
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
    btnAsses: {
      background: "#92E7CA !important",
    },
    btnLearn: {
      background: "#FFD645 !important",
    },
    btnManage: {
      background: "#FFAC98 !important",
    },
    btnPrevent: {
      background: "#7DB2FF !important",
    },
    btngreen: {
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
    dialogueCurve: { borderRadius: 10, maxWidth: 400, minWidth: 325 },
    niceWork: {
      "& h5": { fontSize: 25, fontWeight: 600, color: "rgba(0, 0, 0, 0.75)" },
    },
  })
)

export const LinkRenderer = (data: any) => {
  return (
    <a href={data.href} target="_blank">
      {data.children}
    </a>
  )
}

export default function ActivityPopup({
  activity,
  questionCount,
  tag,
  type,
  participant,
  showStreak,
  updateLocalStorage,
  ...props
}: {
  activity: any
  questionCount: number
  tag: any
  type: string
  participant: any
  showStreak: Function
  updateLocalStorage: Function
} & DialogProps) {
  const classes = useStyles()
  const { t } = useTranslation()

  return (
    <React.Fragment>
      <Dialog
        {...props}
        maxWidth="xs"
        scroll="paper"
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        classes={{
          root: classes.dialogueStyle,
          paper: classes.dialogueCurve,
        }}
      >
        <DialogTitle id="alert-dialog-slide-title" className={classes.dialogtitle}>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={(evt) => props.onClose(evt, "backdropClick")}
          >
            <Icon>close</Icon>
          </IconButton>
          <div
            className={
              classes.header +
              " " +
              (type === "Manage"
                ? classes.manageH
                : type === "Assess"
                ? classes.assessH
                : type === "Learn"
                ? classes.learnH
                : classes.preventH)
            }
          >
            <Box
              className={classes.topicon}
              style={{
                margin: "auto",
                background: tag?.filter((x) => x.id === activity?.id)[0]?.photo
                  ? `url(${tag?.filter((x) => x.id === activity?.id)[0]?.photo}) center center/contain no-repeat`
                  : activity?.spec === "lamp.breathe"
                  ? `url(${BreatheIcon}) center center/contain no-repeat`
                  : activity?.spec === "lamp.journal"
                  ? `url(${JournalIcon}) center center/contain no-repeat`
                  : activity?.spec === "lamp.scratch_image"
                  ? `url(${ScratchCard}) center center/contain no-repeat`
                  : `url(${InfoIcon}) center center/contain no-repeat`,
              }}
            ></Box>
            <Typography variant="body2" align="left">
              {`${t(type)}`}
            </Typography>
            <Typography variant="h2">
              <ReactMarkdown
                children={t(activity?.name ?? null)}
                skipHtml={false}
                remarkPlugins={[gfm, emoji]}
                components={{ link: LinkRenderer }}
              />
            </Typography>
          </div>
        </DialogTitle>
        <DialogContent className={classes.surveytextarea}>
          {activity?.spec === "lamp.tips" && (
            <Typography variant="h4" gutterBottom>
              {`${t(activity?.name)}`}
            </Typography>
          )}
          {activity?.spec === "lamp.survey" && (
            <Typography variant="h4" gutterBottom>
              {questionCount} {questionCount > 1 ? `${t("questions")}` : `${t("question")}`} {/* (10 mins) */}
            </Typography>
          )}
          {activity?.spec === "lamp.dbt_diary_card" && (
            <Typography variant="h4" gutterBottom>
              {`${t("Self evaluation")}`}
            </Typography>
          )}

          <Typography variant="body2" component="p">
            <ReactMarkdown
              children={
                activity?.spec !== "lamp.dbt_diary_card"
                  ? t(tag?.filter((x) => x.id === activity?.id)[0]?.description ?? null)
                  : `${t("Daily log of events and related feelings. Track target behaviors and use of skills.")}`
              }
              skipHtml={false}
              remarkPlugins={[gfm, emoji]}
              components={{ link: LinkRenderer }}
            />
          </Typography>
        </DialogContent>
        <DialogActions>
          <Box textAlign="center" width={1} mt={1} mb={3}>
            <Link
              href={`/#/participant/${participant?.id}/activity/${activity?.id}?mode=dashboard`}
              onClick={() => updateLocalStorage()}
              underline="none"
              className={classnames(
                classes.btngreen,
                classes.linkButton,
                type === "Manage"
                  ? classes.btnManage
                  : type === "Assess"
                  ? classes.btnAsses
                  : type === "Learn"
                  ? classes.btnLearn
                  : classes.btnPrevent
              )}
            >
              {activity?.spec === "lamp.survey" ? `${t("Start survey")}` : `${t("Begin")}`}
            </Link>
          </Box>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}
