// Core Imports
import React, { useEffect, useState } from "react"
import {
  Typography,
  makeStyles,
  Box,
  Card,
  Grid,
  IconButton,
  TextField,
  Button,
  FormControl,
  Container,
  AppBar,
  Toolbar,
  Icon,
  CardContent,
} from "@material-ui/core"
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline"
import ResponsiveDialog from "./ResponsiveDialog"
import { ReactComponent as Book } from "../icons/Book.svg"
import { ReactComponent as MoodTips } from "../icons/MoodTips.svg"
import { ReactComponent as SleepTips } from "../icons/SleepTips.svg"
import { ReactComponent as Chat } from "../icons/Chat.svg"
import { ReactComponent as Wellness } from "../icons/Wellness.svg"
import { ReactComponent as PaperLens } from "../icons/PaperLens.svg"
import { ReactComponent as Info } from "../icons/Info.svg"
import { ReactComponent as Lightning } from "../icons/Lightning.svg"
const useStyles = makeStyles((theme) => ({
  topicon: {
    minWidth: 200,
    minHeight: 200,
    marginLeft: "50px",
  },

  header: {
    background: "#FFF9E5",
    padding: 20,

    "& h2": {
      fontSize: 25,
      fontWeight: 600,
      color: "rgba(0, 0, 0, 0.75)",
    },
  },
  tipscontentarea: {
    padding: 20,
    "& h3": {
      fontWeight: "bold",
      fontSize: "16px",
      marginBottom: "15px",
    },
    "& p": {
      fontSize: "16px",
      lineheight: "24px",

      color: "rgba(0, 0, 0, 0.75)",
    },
  },
  tipStyle: {
    background: "#FFF9E5",
    borderRadius: "10px",
    padding: "20px 20px 20px 20px",
    textAlign: "justify",
    marginBottom: 20,
  },
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
}))
const data = {
  Sleep: [
    {
      title: "Circadian rhythms and sleep",
      text:
        "1. Turn off the screens Your body needs time to shift into sleep mode, so spend the last hour before bed doing a calming activity such as reading. For some people, using an electronic device such as a laptop can make it hard to fall asleep, because the particular type of light emanating from the screens of these devices is activating to the brain. If you have trouble sleeping, avoid electronics before bed or in the middle of the night. 2. Create a nightly ritual A relaxing, routine activity right before bedtime conducted away from bright lights helps separate your sleep time from activities that can cause excitement, stress or anxiety which can make it more difficult to fall asleep, get sound and deep sleep or remain asleep.",
    },
    {
      title: "Winding down before bed",
      text:
        "I’m at my full-time job and writing to my Talkspace therapist about not going to the grocery store because I have no idea how to feed myself and the whole thing is overwhelming. I’ve already checked on my cats via security camera twice — no catastrophes yet. I check on them at least every hour, making sure they’re safe, that my apartment didn’t burn down.",
    },
    {
      title: "Exercise for better sleep",
      text:
        "Feeling generally good; slept well and had a good breakfast. Woke up thinking about.I’m at my full-time job and writing to my Talkspace therapist about not going to the grocery store because I have no idea how to feed myself and the whole thing is overwhelming. I’ve already checked on my cats via security camera twice — no catastrophes yet. I check on them at least every hour, making sure they’re safe, that my apartment didn’t burn down.",
    },
    {
      title: "Scheduling your sleep",
      text:
        "I’m at my full-time job and writing to my Talkspace therapist about not going to the grocery store because I have no idea how to feed myself and the whole thing is overwhelming. I’ve already checked on my cats via security camera twice — no catastrophes yet. I check on them at least every hour, making sure they’re safe, that my apartment didn’t burn down.",
    },
    {
      title: "Optimize your bedroom for sleep",
      text:
        "Feeling generally good; slept well and had a good breakfast. Woke up thinking about.I’m at my full-time job and writing to my Talkspace therapist about not going to the grocery store because I have no idea how to feed myself and the whole thing is overwhelming. I’ve already checked on my cats via security camera twice — no catastrophes yet. I check on them at least every hour, making sure they’re safe, that my apartment didn’t burn down.",
    },
  ],

  Mood: [
    {
      title: "Hope",
      text:
        "I’m at my full-time job and writing to my Talkspace therapist about not going to the grocery store because I have no idea how to feed myself and the whole thing is overwhelming. I’ve already checked on my cats via security camera twice — no catastrophes yet. I check on them at least every hour, making sure they’re safe, that my apartment didn’t burn down.",
    },
    {
      title: "Goals",
      text:
        "I’m at my full-time job and writing to my Talkspace therapist about not going to the grocery store because I have no idea how to feed myself and the whole thing is overwhelming. I’ve already checked on my cats via security camera twice — no catastrophes yet. I check on them at least every hour, making sure they’re safe, that my apartment didn’t burn down.",
    },
    {
      title: "Optimism",
      text:
        "I’m at my full-time job and writing to my Talkspace therapist about not going to the grocery store because I have no idea how to feed myself and the whole thing is overwhelming. I’ve already checked on my cats via security camera twice — no catastrophes yet. I check on them at least every hour, making sure they’re safe, that my apartment didn’t burn down.",
    },
    {
      title: "Don't be so hard to yourself",
      text:
        "I’m at my full-time job and writing to my Talkspace therapist about not going to the grocery store because I have no idea how to feed myself and the whole thing is overwhelming. I’ve already checked on my cats via security camera twice — no catastrophes yet. I check on them at least every hour, making sure they’re safe, that my apartment didn’t burn down.",
    },
  ],

  Social: [
    {
      title: "Go outside",
      text:
        "In a sweeping nationwide study, researchers from Denmark’s University of Aarhus found that childhood exposure to green space—parks, forests, rural lands, etc.—reduces the risk for developing an array of psychiatric disorders during adolescence and adulthood. The study could have far-reaching implications for healthy city design, making green space-focused urban planning an early intervention tool for reducing mental health problems.",
    },
    {
      title: "Emotional connections",
      text:
        "I’m at my full-time job and writing to my Talkspace therapist about not going to the grocery store because I have no idea how to feed myself and the whole thing is overwhelming. I’ve already checked on my cats via security camera twice — no catastrophes yet. I check on them at least every hour, making sure they’re safe, that my apartment didn’t burn down.",
    },
    {
      title: "Social media",
      text:
        "I’m at my full-time job and writing to my Talkspace therapist about not going to the grocery store because I have no idea how to feed myself and the whole thing is overwhelming. I’ve already checked on my cats via security camera twice — no catastrophes yet. I check on them at least every hour, making sure they’re safe, that my apartment didn’t burn down.",
    },
    {
      title: "Family and friends",
      text:
        "I’m at my full-time job and writing to my Talkspace therapist about not going to the grocery store because I have no idea how to feed myself and the whole thing is overwhelming. I’ve already checked on my cats via security camera twice — no catastrophes yet. I check on them at least every hour, making sure they’re safe, that my apartment didn’t burn down.",
    },
  ],
}

export default function LearnTips({ ...props }) {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [icon, setIcon] = useState(null)
  const [title, setTitle] = useState(null)
  const [details, setDetails] = useState(null)

  useEffect(() => {
    setIcon(getIcon())
  }, [])

  const getIcon = () => {
    switch (props.type) {
      case "Book":
        return <Book className={classes.topicon} />
      case "Mood":
        return <MoodTips className={classes.topicon} />
      case "Stress":
        return <Lightning className={classes.topicon} />
      case "Motivation":
        return <PaperLens className={classes.topicon} />
      case "Physical_Wellness":
        return <Wellness className={classes.topicon} />
      case "Resources":
        return <Info className={classes.topicon} />
      case "Social":
        return <Chat className={classes.topicon} />
      case "Sleep":
        return <SleepTips className={classes.topicon} />
    }
  }
  const getTips = (type: string) => {
    let details = []
    Object.keys(data).forEach((key) => {
      if (key == type) {
        details = data[key].map((detail) => {
          return (
            <Box
              className={classes.tipStyle}
              onClick={() => {
                setOpen(true)
                setTitle(detail.title)
                setDetails(detail.text)
              }}
            >
              <Typography variant="h6">{detail.title}</Typography>
            </Box>
          )
        })
      }
    })
    return details
  }

  return (
    <Container>
      <Box>{getTips(props.type)}</Box>
      <ResponsiveDialog
        transient={false}
        animate
        fullScreen
        open={open}
        onClose={() => {
          setOpen(false)
        }}
      >
        <AppBar position="static" style={{ background: "#FFF9E5", boxShadow: "none" }}>
          <Toolbar className={classes.toolbardashboard}>
            <IconButton onClick={() => setOpen(false)} color="default" className={classes.backbtn} aria-label="Menu">
              <Icon>arrow_back</Icon>
            </IconButton>
          </Toolbar>
        </AppBar>

        <div>
          <div className={classes.header}>
            {icon}
            <Typography variant="caption">Tip</Typography>
            <Typography variant="h2">{title}</Typography>
          </div>

          <CardContent className={classes.tipscontentarea}>
            <Typography variant="body2" color="textSecondary" component="p">
              {details}
            </Typography>
          </CardContent>
        </div>
      </ResponsiveDialog>
    </Container>
  )
}
