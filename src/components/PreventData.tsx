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

const rows = [
  createData("Oct 7", "5.56pm", 11),
  createData("Oct 6", "6.00pm", 21),
  createData("Oct 5", "6.50pm", 16),
  createData("Sep 30", "4.00pm", 7),
  createData("Sep 15", "3.30pm", 10),
]

export default function PreventData({ ...props }) {
  const classes = useStyles()

  return (
    <Box>
      <Grid container>
        <CardContent className={classes.moodContent}>
          <Typography variant="h5">
            Your Mood: <Box component="span">fluctuating</Box>
          </Typography>
          <Typography>
            Varying circumstances will cause you mood to change over time, that’s human. But erratic spikes and dips in
            mood can be signs of a more serious problem.
          </Typography>
        </CardContent>
      </Grid>
      <Sparkline
        minWidth={250}
        minHeight={220}
        XAxisLabel="Time"
        YAxisLabel="Mood"
        color={colors.blue[500]}
        data={[
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
        ]}
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
              {rows.map((row) => (
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
