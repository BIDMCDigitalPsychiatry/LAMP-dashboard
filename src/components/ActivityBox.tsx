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
  Tooltip,
  Backdrop,
  CircularProgress,
  makeStyles,
  Theme,
  createStyles,
  Link,
} from "@material-ui/core"
import LAMP, { Participant as ParticipantObj, Activity as ActivityObj } from "lamp-core"
import { ReactComponent as BreatheIcon } from "../icons/Breathe.svg"
import JournalImg from "../icons/Journal.svg"
import { ReactComponent as GoalIcon } from "../icons/Goal.svg"
import { ReactComponent as JournalIcon } from "../icons/Goal.svg"
import { ReactComponent as HopeBoxIcon } from "../icons/HopeBox.svg"
import { ReactComponent as MedicationIcon } from "../icons/Medication.svg"
import InfoIcon from "../icons/Info.svg"
import ScratchCard from "../icons/ScratchCard.svg"
import ResponsiveDialog from "./ResponsiveDialog"
import Resources from "./Resources"
import classnames from "classnames"
import NewMedication from "./NewMedication"
import { useTranslation } from "react-i18next"
import ActivityPage from "./ActivityPage"
import { changeCase } from "./App"
import ActivityPopup from "./ActivityPopup"
import ReactMarkdown from "react-markdown"
import emoji from "remark-emoji"
import gfm from "remark-gfm"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
    centerHeader: {
      "& h2": {
        textAlign: "center !important",
      },
    },
    header: {
      background: "#FFEFEC",
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
    scratch: {
      "& h2": {
        textAlign: "center !important",
      },
      "& h6": {
        textAlign: "center !important",
      },
    },
    btnpeach: {
      background: "#FFAC98",
      borderRadius: "40px",
      minWidth: "200px",
      boxShadow: " 0px 10px 15px rgba(255, 172, 152, 0.25)",
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
      "& span": { cursor: "pointer" },
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
    dialogueContent: {
      padding: "20px 40px 40px",
      "& h4": { fontSize: 16, fontWeight: "bold", marginBottom: 15 },
      [theme.breakpoints.down("lg")]: {
        padding: "20px 20px 10px",
      },
    },
    dialogtitle: { padding: 0 },
    manage: {
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
    mainIcons: {
      width: 80,
      height: 80,
      [theme.breakpoints.up("lg")]: {
        width: 130,
        height: 130,
      },
      [theme.breakpoints.down("sm")]: {
        width: 75,
        height: 75,
      },
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
    dialogueCurve: { borderRadius: 10, maxWidth: 400, minWidth: "280px" },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
    blankMsg: {
      marginBottom: "15px",
      "& path": { fill: "#666" },
      "& p": { margin: "2px 5px" },
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
  })
)

export async function getImage(activityId: string) {
  return [await LAMP.Type.getAttachment(activityId, "lamp.dashboard.activity_details")].map((y: any) =>
    !!y.error ? undefined : y.data
  )[0]
}

export function LinkRenderer(data: any) {
  return (
    <a href={data.href} target="_blank">
      {data.children}
    </a>
  )
}

export default function ActivityBox({ type, savedActivities, tag, participant, showSteak, submitSurvey, ...props }) {
  const classes = useStyles()
  const [activity, setActivity] = useState(null)
  const [spec, setSpec] = useState(null)
  const [openData, setOpenData] = useState(false)
  const [open, setOpen] = useState(false)
  const [questionCount, setQuestionCount] = React.useState(0)
  const { t } = useTranslation()

  const handleClickOpen = (y: any) => {
    LAMP.Activity.view(y.id).then((data) => {
      setActivity(data)
      setOpen(true)
      y.spec === "lamp.dbt_diary_card"
        ? setQuestionCount(6)
        : y.spec === "lamp.survey"
        ? setQuestionCount(data.settings?.length ?? 0)
        : setQuestionCount(0)
    })
  }
  console.log(type)

  return (
    <Box>
      <Grid container spacing={2}>
        {savedActivities.length ? (
          savedActivities.map((activity) => (
            <Grid
              item
              xs={6}
              sm={4}
              md={3}
              lg={3}
              onClick={() => {
                setSpec(activity.spec)
                handleClickOpen(activity)
              }}
              className={classes.thumbMain}
            >
              <ButtonBase focusRipple className={classes.fullwidthBtn}>
                <Card
                  className={
                    classes.manage +
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
                  <Box mt={2} mb={1}>
                    <Box
                      className={classes.mainIcons}
                      style={{
                        margin: "auto",
                        background: tag[activity.id]?.photo
                          ? `url(${tag[activity?.id]?.photo}) center center/contain no-repeat`
                          : activity.spec === "lamp.breathe"
                          ? `url(${BreatheIcon}) center center/contain no-repeat`
                          : activity.spec === "lamp.journal"
                          ? `url(${JournalIcon}) center center/contain no-repeat`
                          : activity.spec === "lamp.scratch_image"
                          ? `url(${ScratchCard}) center center/contain no-repeat`
                          : `url(${InfoIcon}) center center/contain no-repeat`,
                      }}
                    ></Box>
                  </Box>
                  <Typography className={classes.cardlabel}>
                    <ReactMarkdown
                      source={t(activity.name)}
                      escapeHtml={false}
                      plugins={[gfm, emoji]}
                      renderers={{ link: LinkRenderer }}
                    />
                  </Typography>
                </Card>
              </ButtonBase>
            </Grid>
          ))
        ) : (
          <Box display="flex" className={classes.blankMsg} ml={1}>
            <Icon>info</Icon>
            <p>{t("There are no " + type + " activities available.")}</p>
          </Box>
        )}
      </Grid>
      <ActivityPopup
        spec={spec}
        activity={activity}
        tag={tag}
        questionCount={questionCount}
        open={open}
        setOpen={setOpen}
        type={type}
        setOpenData={setOpenData}
      />

      <ResponsiveDialog
        transient={false}
        animate
        fullScreen
        open={openData}
        onClose={() => {
          setOpenData(false)
        }}
      >
        <ActivityPage
          activity={activity}
          participant={participant}
          setOpenData={setOpenData}
          submitSurvey={submitSurvey}
          showSteak={showSteak}
        />
      </ResponsiveDialog>
    </Box>
  )
}
