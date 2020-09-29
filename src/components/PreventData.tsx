// Core Imports
import React from "react"
import { Typography, makeStyles, Box, Grid, colors, CardContent } from "@material-ui/core"
import LAMP, { Participant as ParticipantObj, Activity as ActivityObj } from "lamp-core"
import Sparkline from "./Sparkline"
import RadialDonutChart from "./RadialDonutChart"
import ActivityCard from "./ActivityCard"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
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
  graphcontainer: { height: "auto" },
}))

function createData(dateVal: string, timeVal: string, value: number) {
  return { dateVal, timeVal, value }
}

function _hideExperimental() {
  return (LAMP.Auth._auth.serverAddress || "").includes(".psych.digital")
}

export default function PreventData({
  participant,
  activity,
  events,
  type,
  graphType,
  earliestDate,
  enableEditMode,
  onEditAction,
  onCopyAction,
  onDeleteAction,
  ...props
}: {
  participant: ParticipantObj
  activity: any
  events: any
  type: any
  graphType: number
  earliestDate: any
  enableEditMode: boolean
  onEditAction: (activity: ActivityObj, data: any) => void
  onCopyAction: (activity: ActivityObj, data: any) => void
  onDeleteAction: (activity: ActivityObj, data: any) => void
}) {
  const classes = useStyles()
  return (
    <Grid container direction="row" justify="center" alignItems="flex-start">
      <Grid item lg={4} sm={10} xs={12}>
        <CardContent className={classes.moodContent}>
          <Typography variant="h5">
            {graphType == 0 ? activity.name : activity}: <Box component="span">{/*fluctuating*/}</Box>
          </Typography>
          <Typography variant="h5">Summary</Typography>
          <Typography variant="body2">
            {/*You have a good distribution of locations, which means you’re getting out of the house and doing things.
            Studies show a change of scenery helps keep the mid engaged and positive.*/}
          </Typography>
        </CardContent>

        <Box
          className={classes.graphcontainer}
          style={{ marginTop: 16, marginBottom: 16, overflow: "visible", breakInside: "avoid" }}
        >
          {graphType === 1 ? (
            <RadialDonutChart data={events} type={type} detailPage={true} width={370} height={350} />
          ) : graphType === 2 ? (
            <Sparkline
              minWidth={250}
              minHeight={450}
              XAxisLabel="Time"
              YAxisLabel="  "
              color={colors.blue[500]}
              data={events}
            />
          ) : (
            <ActivityCard
              activity={activity}
              events={events}
              startDate={earliestDate}
              forceDefaultGrid={_hideExperimental()}
              onEditAction={
                activity.spec !== "lamp.survey" || !enableEditMode ? undefined : (data) => onEditAction(activity, data)
              }
              onCopyAction={
                activity.spec !== "lamp.survey" || !enableEditMode ? undefined : (data) => onCopyAction(activity, data)
              }
              onDeleteAction={
                activity.spec !== "lamp.survey" || !enableEditMode
                  ? undefined
                  : (data) => onDeleteAction(activity, data)
              }
            />
          )}
        </Box>
      </Grid>
    </Grid>
  )
}
