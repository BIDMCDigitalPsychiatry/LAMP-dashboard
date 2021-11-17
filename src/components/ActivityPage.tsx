// Core Imports
import React from "react"
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  makeStyles,
  createStyles,
  IconButton,
  Icon,
  Typography,
  Theme,
} from "@material-ui/core"
import { Participant as ParticipantObj } from "lamp-core"
import EmbeddedActivity from "./EmbeddedActivity"
import SurveyInstrument from "./SurveyInstrument"
import GroupActivity from "./GroupActivity"
import { useTranslation } from "react-i18next"

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

export default function ActivityPage({
  participant,
  activity,
  submitSurvey,
  setOpenData,
  showSteak,
  ...props
}: {
  participant: ParticipantObj
  activity: any
  submitSurvey: Function
  setOpenData: Function
  showSteak: Function
}) {
  const [openRecordSuccess, setOpenRecordSuccess] = React.useState(false)
  const classes = useStyles()
  const { t } = useTranslation()

  return (
    <Box>
      {(activity?.spec || "") === "lamp.survey" ? (
        <SurveyInstrument
          type={activity?.name ?? ""}
          fromPrevent={false}
          group={[activity]}
          participant={participant}
          onComplete={(response) => {
            submitSurvey(response, activity.id)
            setOpenData(false)
          }}
        />
      ) : (activity?.spec || "") === "lamp.group" ? (
        <GroupActivity
          activity={activity}
          participant={participant}
          submitSurvey={(response) => {
            submitSurvey(response, activity.id)
            setOpenData(false)
          }}
          onComplete={() => {
            setOpenData(false)
          }}
        />
      ) : (
        <EmbeddedActivity
          name={activity?.description ?? ""}
          activity={activity ?? []}
          participant={participant}
          onComplete={(data) => {
            if (activity?.spec === "lamp.tips" && !!data) showSteak(participant, activity.id)
            if (activity?.spec !== "lamp.tips" && !!data && (!!data?.completed || !!data.timestamp))
              showSteak(participant, activity.id)
            setOpenData(false)
          }}
        />
      )}
      <Dialog
        open={openRecordSuccess}
        onClose={() => setOpenRecordSuccess(false)}
        scroll="paper"
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        classes={{
          root: classes.dialogueStyle,
          paper: classes.dialogueCurve,
          paperScrollPaper: classes.MuiDialogPaperScrollPaper,
        }}
      >
        <DialogTitle>
          <IconButton aria-label="close" className={classes.closeButton} onClick={() => setOpenRecordSuccess(false)}>
            <Icon>close</Icon>
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box textAlign="center" pb={4} className={classes.niceWork}>
            <Typography variant="h5" gutterBottom>
              {t("Success") + "!"}
            </Typography>
            <Typography className={classes.ribbonText} component="p">
              {t("Voice Recorded has been submitted Successfully.")}
            </Typography>
            <Box textAlign="center" className={classes.niceWorkbadge}>
              <Icon>check_circle</Icon>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  )
}
