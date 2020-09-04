// Core Imports
import React, { useEffect, useState } from "react"
import {
  Typography,
  makeStyles,
  Box,
  Grid,
  IconButton,
  TextField,
  Button,
  FormControl,
  Container,
  AppBar,
  Toolbar,
  Icon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link,
  Fab,
} from "@material-ui/core"
import CloseIcon from "@material-ui/icons/Close"
import { ReactComponent as ThumbsUp } from "../icons/ThumbsUp.svg"
import { ReactComponent as ThumbsDown } from "../icons/ThumbsDown.svg"
import classnames from "classnames"
import LAMP from "lamp-core"

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
  dialogtitle: { padding: 0 },
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
  journalStyle: {
    background: "linear-gradient(0deg, #FBF1EF, #FBF1EF)",
    borderRadius: "10px",
    padding: "0px 20px 20px 20px",
    textAlign: "justify",
    marginBottom: 20,
    "& span": {
      color: "rgba(0, 0, 0, 0.4)",
      fontSize: "12px",
      lineHeight: "40px",
    },
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
    // marginTop: "50px",
    "&:hover": {
      background: "#FFAC98",
      boxShadow:
        "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
    },
  },
  journalday: { color: "rgba(0, 0, 0, 0.4)", marginBottom: 15, marginTop: 25 },
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
  linkpeach: { fontSize: 16, color: "#BC453D", fontWeight: 600 },
  howFeel: { fontSize: 14, color: "rgba(0, 0, 0, 0.5)", fontStyle: "italic", textAlign: "center", marginBottom: 10 },
  btnNav: { marginBottom: 0 },
  dialogueCurve: { borderRadius: 10, maxWidth: 400 },
}))

async function getJournals(participantId) {
  return Object.fromEntries(
    (
      await Promise.all(
        [participantId || ""].map(async (x) => [x, await LAMP.Type.getAttachment(x, "lamp.journals").catch((e) => [])])
      )
    )
      .filter((x: any) => x[1].message !== "404.object-not-found")
      .map((x: any) => [x[0], x[1].data])
  )
}

export default function JournalEntries({ participant, ...props }) {
  const classes = useStyles()
  const [journals, setJournals] = useState({})
  const [open, setOpen] = useState(false)
  const [journalValue, setJounalValue] = useState("")
  const [status, setStatus] = useState("Yes")

  const handleClickStatus = (statusVal: string) => {
    setStatus(statusVal)
  }

  useEffect(() => {
    ;(async () => {
      let journals = await getJournals(participant.id)
      setJournals(journals)
    })()
  }, [])

  const getData = () => {
    let x = (journals || {})[participant.id || ""] || []
    return !Array.isArray(x) ? [] : x
  }

  const saveJournal = async () => {
    let all = getData()
    let journal = {
      journalText: journalValue,
      feedback: status,
      datetime: new Date(),
    }
    all.push(journal)
    LAMP.Type.setAttachment(participant.id, "me", "lamp.journals", all)
    setJournals({ ...(journals || {}), [participant]: all })
    props.onComplete()
  }

  const getDateString = (date: Date) => {
    var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    var monthname = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return weekday[date.getDay()] + " " + monthname[date.getMonth()] + ", " + date.getDate()
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" style={{ background: "#FBF1EF", boxShadow: "none" }}>
        <Toolbar className={classes.toolbardashboard}>
          <IconButton onClick={() => setOpen(true)} color="default" aria-label="Menu">
            <Icon>arrow_back</Icon>
          </IconButton>
          <Typography variant="h5">New journal entry</Typography>
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
                <Box className={classes.howFeel}>How do you feel today?</Box>
                <Grid className={classes.btnNav}>
                  <Box textAlign="center">
                    <IconButton
                      onClick={() => handleClickStatus("Yes")}
                      className={status === "Yes" ? classnames(classes.likebtn, classes.active) : classes.likebtn}
                    >
                      <ThumbsUp />
                      <label>Good</label>
                    </IconButton>
                    <IconButton
                      onClick={() => handleClickStatus("No")}
                      className={status === "No" ? classnames(classes.likebtn, classes.active) : classes.likebtn}
                    >
                      <ThumbsDown />
                      <label>Bad</label>
                    </IconButton>
                  </Box>
                </Grid>
                <Box textAlign="center" pt={4} mt={2}>
                  <Fab className={classes.btnpeach} onClick={() => saveJournal()}>
                    Submit
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
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Box>

              <DialogContent className={classes.dialogueContent}>
                <Typography variant="h4">Leaving so soon?</Typography>
                <Typography variant="body1">If you leave without submitting, your entry will be lost.</Typography>
              </DialogContent>
              <Grid>
                <Box textAlign="center" width={1} mt={1} mb={3}>
                  <Link
                    underline="none"
                    onClick={() => setOpen(false)}
                    className={classnames(classes.btnpeach, classes.linkButton)}
                  >
                    No, don’t leave yet
                  </Link>
                </Box>
                <Box textAlign="center" width={1} mb={4}>
                  <Link underline="none" onClick={props.onComplete} className={classes.linkpeach}>
                    Yes, leave
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
