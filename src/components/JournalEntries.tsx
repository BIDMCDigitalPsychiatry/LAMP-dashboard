﻿// Core Imports
import React, { useEffect, useState } from "react"
import {
  Typography,
  makeStyles,
  Box,
  Grid,
  IconButton,
  TextField,
  FormControl,
  AppBar,
  Toolbar,
  Icon,
  Dialog,
  DialogContent,
  Link,
  Fab,
  Backdrop,
  CircularProgress,
} from "@material-ui/core"
import classnames from "classnames"
import LAMP from "lamp-core"
import { useTranslation } from "react-i18next"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  likebtn: {
    fontStyle: "italic",
    padding: 6,
    margin: "0 5px",
    "&:hover": { background: "#FFAC98" },
    "& label": {
      position: "absolute",
      bottom: -18,
      fontSize: 12,
    },
  },
  active: {
    background: "#FFAC98 !important",
  },
  linkButton: {
    padding: "15px 25px 15px 25px",
  },
  dialogueContent: {
    padding: "10px 20px 35px 20px",
    textAlign: "center",
    "& h4": { fontSize: 25, fontWeight: 600, marginBottom: 15 },
    "& p": { fontSize: 16, fontWeight: 300, color: "rgba(0, 0, 0, 0.75)", lineHeight: "19px" },
  },
  dialogueStyle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButton: {
    color: theme.palette.grey[500],
  },
  textAreaControl: {
    width: "100%",
    marginTop: 35,

    borderRadius: 10,
    "& p": { position: "absolute", bottom: 15, right: 0 },
  },
  textArea: {
    borderRadius: "10px",
    "& fieldset": { borderWidth: 0, outline: 0 },
    "& textarea": { lineHeight: "24px" },
  },
  btnpeach: {
    background: "#FFAC98",
    padding: "15px 25px 15px 25px",
    borderRadius: "40px",
    minWidth: "200px",
    boxShadow: " 0px 10px 15px rgba(255, 172, 152, 0.25)",
    lineHeight: "22px",
    display: "inline-block",
    textTransform: "capitalize",
    fontSize: "16px",
    color: "rgba(0, 0, 0, 0.75)",
    fontWeight: "bold",
    cursor: "pointer",
    "& span": { cursor: "pointer" },
    "&:hover": {
      background: "#FFAC98",
      boxShadow:
        "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
    },
  },
  toolbardashboard: {
    minHeight: 65,
    padding: "0 10px",
    "& h5": {
      color: "rgba(0, 0, 0, 0.75)",
      textAlign: "center",
      fontWeight: "600",
      fontSize: 18,
      width: "calc(100% - 96px)",
    },
  },
  todaydate: { paddingLeft: 13, color: "rgba(0, 0, 0, 0.4)" },
  linkpeach: { fontSize: 16, color: "#BC453D", fontWeight: 600, cursor: "pointer" },
  howFeel: { fontSize: 14, color: "rgba(0, 0, 0, 0.5)", fontStyle: "italic", textAlign: "center", marginBottom: 10 },
  btnNav: { marginBottom: 0 },
  dialogueCurve: { borderRadius: 10, maxWidth: 400 },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}))

export default function JournalEntries({ participant, activityId, ...props }) {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [journalValue, setJounalValue] = useState("")
  const [status, setStatus] = useState("good")
  const [loading, setLoading] = useState(false)
  const [time, setTime] = useState(new Date().getTime())
  const { t } = useTranslation()

  const handleClickStatus = (statusVal: string) => {
    setStatus(statusVal)
  }

  const saveJournal = () => {
    setLoading(true)
    let data = {
      timestamp: new Date().getTime(),
      duration: new Date().getTime() - time,
      activity: activityId,
      static_data: {
        text: journalValue,
        sentiment: status,
      },
      temporal_slices: {},
    }
    LAMP.ActivityEvent.create(participant.id, data)
      .catch((e) => console.dir(e))
      .then((x) => {
        setLoading(false)
        props.onComplete()
      })
  }

  const getDateString = (date: Date) => {
    var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    var monthname = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return weekday[date.getDay()] + " " + monthname[date.getMonth()] + ", " + date.getDate()
  }

  return (
    <div className={classes.root}>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <AppBar position="static" style={{ background: "#FBF1EF", boxShadow: "none" }}>
        <Toolbar className={classes.toolbardashboard}>
          <IconButton onClick={() => setOpen(true)} color="default" aria-label="Menu">
            <Icon>arrow_back</Icon>
          </IconButton>
          <Typography variant="h5">{t("New journal entry")}</Typography>
        </Toolbar>
      </AppBar>
      <Box px={2}>
        <Grid container direction="row" justify="center" alignItems="flex-start">
          <Grid item lg={4} sm={10} xs={12}>
            <Box px={2}>
              <FormControl
                component="fieldset"
                classes={{
                  root: classes.textAreaControl,
                }}
              >
                <Typography variant="caption" className={classes.todaydate}>
                  {getDateString(new Date())}
                </Typography>
                <TextField
                  id="standard-multiline-flexible"
                  multiline
                  rows={10}
                  autoFocus={true}
                  value={journalValue}
                  onChange={(event) => setJounalValue(event.target.value)}
                  classes={{ root: classes.textArea }}
                />
                <Box className={classes.howFeel}>{t("How do you feel today?")}</Box>
                <Grid className={classes.btnNav}>
                  <Box textAlign="center">
                    <IconButton
                      onClick={() => handleClickStatus("good")}
                      className={status === "good" ? classnames(classes.likebtn, classes.active) : classes.likebtn}
                    >
                      <Icon>thumb_up_off_alt</Icon>
                      <label>{t("Good")}</label>
                    </IconButton>
                    <IconButton
                      onClick={() => handleClickStatus("bad")}
                      className={status === "bad" ? classnames(classes.likebtn, classes.active) : classes.likebtn}
                    >
                      <Icon>thumb_down_off_alt</Icon>
                      <label>{t("Bad")}</label>
                    </IconButton>
                  </Box>
                </Grid>
                <Box textAlign="center" pt={4} mt={2}>
                  <Fab className={classes.btnpeach} onClick={() => saveJournal()}>
                    {t("Submit")}
                  </Fab>
                </Box>
              </FormControl>
            </Box>

            <Dialog
              open={open}
              onClose={() => setOpen(false)}
              scroll="paper"
              aria-labelledby="alert-dialog-slide-title"
              aria-describedby="alert-dialog-slide-description"
              classes={{
                root: classes.dialogueStyle,
                paper: classes.dialogueCurve,
              }}
            >
              <Box display="flex" justifyContent="flex-end">
                <Box>
                  <IconButton aria-label="close" className={classes.closeButton} onClick={() => setOpen(false)}>
                    <Icon>close</Icon>
                  </IconButton>
                </Box>
              </Box>

              <DialogContent className={classes.dialogueContent}>
                <Typography variant="h4">{t("Leaving so soon?")}</Typography>
                <Typography variant="body1">
                  {t("If you leave without submitting, your entry will be lost.")}
                </Typography>
              </DialogContent>
              <Grid>
                <Box textAlign="center" width={1} mt={1} mb={3}>
                  <Link
                    underline="none"
                    onClick={() => setOpen(false)}
                    className={classnames(classes.btnpeach, classes.linkButton)}
                  >
                    {t("No, don’t leave yet")}
                  </Link>
                </Box>
                <Box textAlign="center" width={1} mb={4}>
                  <Link underline="none" onClick={props.onComplete} className={classes.linkpeach}>
                    {t("Yes, leave")}
                  </Link>
                </Box>
              </Grid>
            </Dialog>
          </Grid>
        </Grid>
      </Box>
    </div>
  )
}
