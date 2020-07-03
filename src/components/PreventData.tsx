// Core Imports
import React from "react"
import {
  Typography,
  makeStyles,
  Box,
  Grid,
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

function createData(dateVal: string, timeVal: string, value: number) {
  return { dateVal, timeVal, value }
}

const getPreventData = (type: string) => {
  let data = []
  let graphData, rows
  switch (type) {
    case "mood":
      graphData = [
        { x: new Date(2017, 0), y: 250 },
        { x: new Date(2017, 1), y: 279 },
        { x: new Date(2017, 2), y: 428 },
        { x: new Date(2017, 3), y: 324 },
        { x: new Date(2017, 4), y: 352 },
        { x: new Date(2017, 5), y: 339 },
        { x: new Date(2017, 6), y: 400 },
        { x: new Date(2017, 7), y: 525 },
        { x: new Date(2017, 8), y: 323 },
        { x: new Date(2017, 9), y: 420 },
        { x: new Date(2017, 10), y: 370 },
        { x: new Date(2017, 11), y: 380 },
      ]
      rows = [
        createData("Oct 7", "5.56pm", 11),
        createData("Oct 6", "6.00pm", 21),
        createData("Oct 5", "6.50pm", 16),
        createData("Sep 30", "4.00pm", 7),
        createData("Sep 15", "3.30pm", 10),
      ]
      data.push({
        title: "Your Mood",
        description:
          "Varying circumstances will cause you mood to change over time, that’s human. But erratic spikes and dips in " +
          "mood can be signs of a more serious problem.",
        data: rows,
        graphData: graphData,
      })
      break
    case "sleep_social":
      graphData = [
        { x: new Date(2017, 0), y: 150 },
        { x: new Date(2020, 1), y: 249 },
        { x: new Date(2020, 2), y: 400 },
        { x: new Date(2020, 3), y: 344 },
        { x: new Date(2020, 4), y: 42 },
        { x: new Date(2020, 5), y: 349 },
      ]
      rows = [
        createData("Feb 7", "5.00pm", 1),
        createData("Feb 6", "4.00pm", 10),
        createData("Oct 5", "6.00pm", 10),
        createData("Mar 30", "4.00pm", 27),
        createData("Sep 15", "3.30pm", 1),
      ]
      data.push({
        title: "Sleep & Social",
        description: "Test desc for sleep and social.",
        data: rows,
        graphData: graphData,
      })
      break
    case "social_context":
      graphData = [
        { x: new Date(2020, 0), y: 50 },
        { x: new Date(2020, 1), y: 49 },
        { x: new Date(2020, 2), y: 400 },
        { x: new Date(2020, 3), y: 304 },
        { x: new Date(2020, 4), y: 40 },
        { x: new Date(2020, 5), y: 309 },
        { x: new Date(2020, 9), y: 420 },
        { x: new Date(2020, 10), y: 370 },
        { x: new Date(2020, 11), y: 380 },
      ]
      rows = [
        createData("Jan 7", "6.00pm", 15),
        createData("Jan 6", "5.00pm", 90),
        createData("Oct 5", "3.00pm", 20),
        createData("Oct 30", "1.00pm", 29),
        createData("Sep 15", "1.30pm", 13),
      ]
      data.push({
        title: "Social context",
        description: "Test desc for social context.",
        data: rows,
        graphData: graphData,
      })
      break
    case "env_context":
      graphData = [
        { x: new Date(2017, 0), y: 50 },
        { x: new Date(2017, 1), y: 79 },
        { x: new Date(2017, 2), y: 28 },
        { x: new Date(2017, 3), y: 324 },
        { x: new Date(2017, 4), y: 35 },
        { x: new Date(2017, 5), y: 33 },
        { x: new Date(2017, 6), y: 40 },
        { x: new Date(2017, 7), y: 52 },
        { x: new Date(2017, 8), y: 323 },
        { x: new Date(2017, 9), y: 42 },
        { x: new Date(2017, 10), y: 30 },
        { x: new Date(2017, 11), y: 30 },
      ]
      rows = [
        createData("Oct 7", "5.56pm", 11),
        createData("Oct 6", "6.00pm", 21),
        createData("Oct 5", "6.50pm", 16),
        createData("Sep 30", "4.00pm", 7),
        createData("Sep 15", "3.30pm", 10),
      ]
      data.push({
        title: "Environmental Context",
        description: "Test desc for Environmental Context.",
        data: rows,
        graphData: graphData,
      })
      break
    case "step_count":
      graphData = [
        { x: new Date(2017, 0), y: 50 },
        { x: new Date(2017, 1), y: 79 },
        { x: new Date(2017, 2), y: 28 },
        { x: new Date(2017, 3), y: 24 },
        { x: new Date(2017, 4), y: 52 },
        { x: new Date(2017, 5), y: 319 },
        { x: new Date(2017, 6), y: 410 },
        { x: new Date(2017, 7), y: 515 },
        { x: new Date(2017, 8), y: 313 },
        { x: new Date(2017, 9), y: 410 },
        { x: new Date(2017, 10), y: 270 },
        { x: new Date(2017, 11), y: 280 },
      ]
      rows = [
        createData("Jan 7", "8.00pm", 5),
        createData("Mar 6", "7.00pm", 12),
        createData("Mar 5", "6.00pm", 16),
        createData("Mar 30", "4.00pm", 17),
        createData("Sep 15", "3.30pm", 20),
      ]
      data.push({ title: "Step count", description: "Test desc for Step count.", data: rows, graphData: graphData })
      break
  }
  return data
}

export default function PreventData({ ...props }) {
  const classes = useStyles()
  const preventData = getPreventData(props.type)[0]

  return (
    <Box>
      <Grid container>
        <CardContent className={classes.moodContent}>
          <Typography variant="h5">
            {preventData.title}: <Box component="span">fluctuating</Box>
          </Typography>
          <Typography>{preventData.description}</Typography>
        </CardContent>
      </Grid>
      <Sparkline
        minWidth={250}
        minHeight={220}
        XAxisLabel="Time"
        YAxisLabel="  "
        color={colors.blue[500]}
        data={preventData.graphData}
      />
      <Box>
        <Container className={classes.recentstoreshd}>
          <Grid container xs={12} spacing={0}>
            <Grid item xs>
              <Typography variant="h5">Recent Scores</Typography>
            </Grid>
            <Grid item xs>
              <Typography align="right">
                <Link href="#">See all</Link>
              </Typography>
            </Grid>
          </Grid>
        </Container>

        <TableContainer>
          <Table className={classes.table} aria-label="simple table">
            <TableBody>
              {preventData.data.map((row) => (
                <TableRow key={row.dateVal}>
                  <TableCell component="th" style={{ width: "20%" }}>
                    {row.dateVal}
                  </TableCell>
                  <TableCell style={{ width: "40%" }}>{row.timeVal}</TableCell>
                  <TableCell align="right">{row.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  )
}
