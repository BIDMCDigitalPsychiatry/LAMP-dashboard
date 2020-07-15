// Core Imports
import React, { useEffect, useState } from "react"
import {
  Typography,
  makeStyles,
  Box,
  Card,
  Link,
  colors,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  CardContent,
  Container,
} from "@material-ui/core"

import Sparkline from "./Sparkline"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  table: {
    minWidth: "100%",
    "& tr:nth-child(even)": {
      backgroundColor: "rgba(236, 244, 255, 0.75)",
    },
    "& th": { border: 0, padding: "12px 0px 12px 20px" },
    "& td": { border: 0, padding: "12px 0px 12px 20px" },
    "& td:last-child": { paddingRight: 20 },
  },
  root2: {
    maxWidth: 345,
    margin: "16px",
    maxLength: 500,
  },
  media: {
    height: 200,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  moodContent: {
    padding: 17,

    "& h4": { fontSize: 25, color: "rgba(0, 0, 0, 0.75)", fontWeight: 600, marginBottom: 40 },
    "& h5": {
      fontSize: 18,
      color: "rgba(0, 0, 0, 0.75)",
      fontWeight: 600,
      marginBottom: 20,
      "& span": { color: "#ff8f26" },
    },
  },
  recentstoreshd: {
    padding: "0 20px",
    "& h5": { fontSize: 18, color: "rgba(0, 0, 0, 0.75)", fontWeight: 600, marginBottom: 10 },
  },
}))

const getJournals = () => {
  let data = [
    {
      "This Week": [
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

  useEffect(() => {
    setJournals(getJournals())
  }, [])

  const getContent = () => {
    let content = []
    let eachData = []
    Object.keys(journals).forEach((index) => {
      Object.keys(journals[index]).forEach((key) => {
        console.log(key, journals[index][key])
        eachData.push(
          <Typography variant="h6" color="textSecondary" gutterBottom>
            {key}
          </Typography>
        )
        Object.keys(journals[index][key]).forEach((keyIndex) => {
          eachData.push(
            <CardContent>
              <Typography variant="caption" gutterBottom>
                {journals[index][key][keyIndex].date}
              </Typography>
              <Typography variant="body2" component="p">
                {journals[index][key][keyIndex].text}
              </Typography>
            </CardContent>
          )
        })
      })
      content.push(<Card>{eachData}</Card>)
      return content
    })
  }

  return <Box>{getContent}</Box>
}
