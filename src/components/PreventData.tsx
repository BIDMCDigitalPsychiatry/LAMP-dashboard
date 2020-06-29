// Core Imports
import React, { useState } from "react"
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
  Paper,
} from "@material-ui/core"

import Sparkline from "./Sparkline"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  table: {
    minWidth: "100%",
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
}))

function createData(dateVal: string, timeVal: string, value: number) {
  return { dateVal, timeVal, value }
}

const rows = [
  createData("Oct 7", "5.56pm", 11),
  createData("Oct 6", "5.56pm", 11),
  createData("Oct 7", "5.56pm", 11),
  createData("Oct 7", "5.56pm", 11),
  createData("Oct 7", "5.56pm", 11),
]

export default function PreventData({ ...props }) {
  const classes = useStyles()

  return (
    <Box>
      <Typography variant="h3">Mood</Typography>
      <Typography variant="h5">Your Mood:fluctuating</Typography>
      <Typography>
        Varying circumstances will cause you mood to change over time, that’s human. But erratic spikes and dips in mood
        can be signs of a more serious problem.
      </Typography>
      <Sparkline
        minWidth={250}
        minHeight={100}
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
      <Grid container xs={12} spacing={0}>
        <Grid item xs={10} md={4} lg={3}>
          <Typography variant="h5">Recent Scores</Typography>
        </Grid>
        <Grid item xs>
          <Link href="#">See all</Link>
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
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
  )
}
