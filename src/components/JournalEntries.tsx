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
} from "@material-ui/core"
import CloseIcon from "@material-ui/icons/Close"
import { ReactComponent as ThumbsUp } from "../icons/ThumbsUp.svg"
import { ReactComponent as ThumbsDown } from "../icons/ThumbsDown.svg"
import classnames from "classnames"
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  addicon: { float: "left", color: "#E46759" },
  likebtn: {
    fontStyle: "italic",
    padding: 6,
    margin: "0 5px",
    "& label": {
      position: "absolute",
      bottom: -18,
      fontSize: 12,
    },
  },
  dialogtitle: { padding: 0 },
  active: {
    background: "#FFAC98",
  },
  linkButton: {
    padding: "15px 25px 15px 25px",
  },
  journalHeader: {
    "& h5": {
      fontWeight: 600,
      fontSize: 16,
      color: "rgba(0, 0, 0, 0.75)",
      marginLeft: 15,
    },
  },
  dialogueContent: {
    padding: "10px 20px 35px 20px",
    textAlign: "center",
    "& h4": { fontSize: 25, fontWeight: 600, marginBottom: 15 },
    "& p": { fontSize: 16, fontWeight: 600, color: "rgba(0, 0, 0, 0.75)", lineHeight: "19px" },
  },
  dialogueStyle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButton: {
    color: theme.palette.grey[500],
  },
  addbtnmain: {
    maxWidth: 24,
    "& button": { padding: 0 },
  },
  journalhd: {
    margin: "40px 0 15px 0",
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
  textfieldwrapper: {},
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
    "&:hover": {
      background: "#FFAC98",
      boxShadow:
        "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
    },
  },
  journalday: { color: "rgba(0, 0, 0, 0.4)", marginBottom: 15, marginTop: 25 },
  toolbardashboard: {
    minHeight: 65,
    "& h5": {
      color: "rgba(0, 0, 0, 0.75)",
      textAlign: "center",
      fontWeight: "600",
      fontSize: 18,
      width: "100%",
    },
  },
  backbtn: { paddingLeft: 0, paddingRight: 0 },
  todaydate: { paddingLeft: 13, color: "rgba(0, 0, 0, 0.4)" },
  linkpeach: { fontSize: 16, color: "#BC453D", fontWeight: 600 },
  howFeel: { fontSize: 14, color: "rgba(0, 0, 0, 0.5)", fontStyle: "italic", textAlign: "center", marginBottom: 10 },
  btnNav: { marginBottom: 45 },
}))

const getJournals = () => {
  let data = [
    {
      "This Week": [
        {
          date: "Fri Jul 04, 08:34am",
          text:
            "Feeling generally good; slept well and had a good breakfast. I’m at my full-time job and writing to my Talkspace therapist about not going to the grocery store because I have no idea how to feed myself and the whole thing is overwhelming. I’ve already checked on my cats via security camera twice — no catastrophes yet. I check on them at least every hour, making sure they’re safe, that my apartment didn’t burn down.",
        },
        {
          date: "Wed Jul 05, 10:50am",
          text:
            "I’m at my full-time job and writing to my Talkspace therapist about not going to the grocery store because I have no idea how to feed myself and the whole thing is overwhelming. I’ve already checked on my cats via security camera twice — no catastrophes yet. I check on them at least every hour, making sure they’re safe, that my apartment didn’t burn down.",
        },
        {
          date: "Mon Jul 06, 05:30pm",
          text:
            "Feeling generally good; slept well and had a good breakfast. Woke up thinking about.I’m at my full-time job and writing to my Talkspace therapist about not going to the grocery store because I have no idea how to feed myself and the whole thing is overwhelming. I’ve already checked on my cats via security camera twice — no catastrophes yet. I check on them at least every hour, making sure they’re safe, that my apartment didn’t burn down.",
        },
      ],
    },
    {
      "This Month": [
        {
          date: "Fri Jul 04, 08:34am",
          text:
            "I’m at my full-time job and writing to my Talkspace therapist about not going to the grocery store because I have no idea how to feed myself and the whole thing is overwhelming. I’ve already checked on my cats via security camera twice — no catastrophes yet. I check on them at least every hour, making sure they’re safe, that my apartment didn’t burn down.",
        },
        {
          date: "Wed Jul 05, 10:50am",
          text:
            "I’m at my full-time job and writing to my Talkspace therapist about not going to the grocery store because I have no idea how to feed myself and the whole thing is overwhelming. I’ve already checked on my cats via security camera twice — no catastrophes yet. I check on them at least every hour, making sure they’re safe, that my apartment didn’t burn down.",
        },
        {
          date: "Mon Jul 06, 05:30pm",
          text:
            "I’m at my full-time job and writing to my Talkspace therapist about not going to the grocery store because I have no idea how to feed myself and the whole thing is overwhelming. I’ve already checked on my cats via security camera twice — no catastrophes yet. I check on them at least every hour, making sure they’re safe, that my apartment didn’t burn down.",
        },
      ],
    },
  ]
  return data
}

export default function JournalEntries({ ...props }) {
  const classes = useStyles()
  const [journals, setJournals] = useState([])
  const [open, setOpen] = useState(false)
  const [journalValue, setJounalValue] = useState("")
  const [status, setStatus] = useState("Yes")

  const handleClickStatus = (statusVal: string) => {
    setStatus(statusVal)
  }
  const getDateString = (date: Date) => {
    var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    var monthname = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return weekday[date.getDay()] + " " + monthname[date.getMonth()] + ", " + date.getDate()
  }

  const [jounalDate, setJounalDate] = useState(getDateString(new Date()))

  useEffect(() => {
    setJournals(getJournals())
  }, [])

  const handleOpen = (text: string, date?: string) => {
    if (text) setJounalValue(text)
    date = typeof date == "undefined" ? getDateString(new Date()) : date
    setJounalDate(date)
    setOpen(true)
  }

  const getContent = () => {
    let content = []

    Object.keys(journals).forEach((index) => {
      let eachData = []
      Object.keys(journals[index]).forEach((key) => {
        eachData.push(
          <Box fontWeight="fontWeightBold" className={classes.journalday}>
            {key}
          </Box>
        )
        Object.keys(journals[index][key]).forEach((keyIndex) => {
          let fullText = journals[index][key][keyIndex].text
          let text = fullText.substring(0, 80)
          text = text.substr(0, Math.min(text.length, text.lastIndexOf(" ")))
          eachData.push(
            <Grid item>
              <Box
                className={classes.journalStyle}
                onClick={() => handleOpen(fullText, journals[index][key][keyIndex].date)}
              >
                <Typography variant="caption" gutterBottom>
                  {journals[index][key][keyIndex].date}
                </Typography>
                <Typography variant="body2" component="p">
                  {text}...
                </Typography>
              </Box>
            </Grid>
          )
        })
      })
      content.push(<Box boxShadow={0}>{eachData}</Box>)
    })
    return content
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" style={{ background: "#FBF1EF", boxShadow: "none" }}>
        <Toolbar className={classes.toolbardashboard}>
          <IconButton onClick={() => setOpen(true)} color="default" className={classes.backbtn} aria-label="Menu">
            <Icon>arrow_back</Icon>
          </IconButton>
          <Typography variant="h5">New journal entry</Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Box className={classes.textfieldwrapper} px={2}>
          <FormControl
            component="fieldset"
            classes={{
              root: classes.textAreaControl,
            }}
          >
            <Typography variant="caption" className={classes.todaydate}>
              {jounalDate}
            </Typography>
            <TextField
              id="standard-multiline-flexible"
              multiline
              rows={10}
              variant="outlined"
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
            <Box textAlign="center" mt={4}>
              <Button className={classes.btnpeach}>Submit</Button>
            </Box>
          </FormControl>
        </Box>

        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          scroll="paper"
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          className={classes.dialogueStyle}
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
                {" "}
                Yes, leave
              </Link>
            </Box>
          </Grid>
        </Dialog>
      </Container>
    </div>
  )
}
