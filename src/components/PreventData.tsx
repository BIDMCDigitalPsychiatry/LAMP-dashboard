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
  CardContent,
  Container,
} from "@material-ui/core"
import LAMP, { Participant as ParticipantObj } from "lamp-core"
import Sparkline from "./Sparkline"
import RadialDonutChart from "./RadialDonutChart"

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
  graphcontainer: { height: "auto" },
}))

function createData(dateVal: string, timeVal: string, value: number) {
  return { dateVal, timeVal, value }
}

const getPreventData = (data: JSON, flag: boolean, type: number) => {
  let rows = []
  var options = { month: "short", day: "numeric" }
  let i = 0
  data = type == 1 ? data[0] : data
  Object.keys(data).forEach((key) => {
    if (flag || (!flag && i < 7)) {
      if (type == 1) {
        rows.push(createData(data[key].label, "", data[key].value))
      } else {
        let date = new Date(data[key].x)
        rows.push(
          createData(
            date.toLocaleDateString("en-US", options),
            date.toLocaleTimeString("en-US", { hour12: true, hour: "2-digit", minute: "2-digit" }),
            data[key].y
          )
        )
      }
      i++
    }
  })
  return rows
}

export default function PreventData({
  participant,
  ...props
}: {
  participant: ParticipantObj
  type: string
  activityData: any
  graphType: number
}) {
  const classes = useStyles()
  const [seeAll, setSeeAll] = useState(false)
  const preventData = getPreventData(props.activityData, seeAll, props.graphType)

  return (
    <Box>
      <Grid container>
        <CardContent className={classes.moodContent}>
          <Typography variant="h5">
            {props.type}: <Box component="span">fluctuating</Box>
          </Typography>
          <Typography>Test desc for {props.type}</Typography>
        </CardContent>
      </Grid>
      <Box className={classes.graphcontainer}>
        {props.graphType === 1 ? (
          <RadialDonutChart data={props.activityData} />
        ) : (
          <Sparkline
            minWidth={250}
            minHeight={220}
            XAxisLabel="Time"
            YAxisLabel="  "
            color={colors.blue[500]}
            data={props.activityData}
          />
        )}
      </Box>
      <Box>
        <Container className={classes.recentstoreshd}>
          <Grid container xs={12} spacing={0}>
            <Grid item xs>
              <Typography variant="h5">Recent Scores</Typography>
            </Grid>
            <Grid item xs>
              <Typography align="right">
                <Link href="#" onClick={() => setSeeAll(true)}>
                  See all
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Container>

        <TableContainer>
          <Table className={classes.table} aria-label="simple table">
            <TableBody>
              {preventData.map((row) => (
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
