// Core Imports
import React, { useEffect, useState } from "react"
import { Box, Typography, Grid, Checkbox, makeStyles, createStyles } from "@material-ui/core"
import { Service } from "../../../DBService/DBService"
import UpdateActivity from "../../ActivityList/UpdateActivity"
import ScheduleActivity from "../../ActivityList/ScheduleActivity"
import { useTranslation } from "react-i18next"
const useStyles = makeStyles((theme) =>
  createStyles({
    rowContainer: {
      display: "flex",
      width: "100%",
      alignsensors: "center",
      height: 36,
      fontWeight: 600,
    },
    contentText: {
      color: "rgba(0, 0, 0, 0.75)",
      fontSize: 14,
      marginLeft: 10,
    },
    w45: { width: 45 },
    w120: { width: 120, textAlign: "right" },
    checkboxActive: { color: "#7599FF !important" },
  })
)
export default function ActivityRow({
  activity,
  index,
  studies,
  activities,
  handleSelected,
  setActivities,
  researcherId,
  participantId,
  ...props
}: {
  activity: any
  index: number
  studies: any
  activities: any
  handleSelected: Function
  setActivities: Function
  researcherId: string
  participantId?: string
}) {
  const classes = useStyles()
  const { t } = useTranslation()

  const types = {
    "lamp.survey": `${t("Survey")}`,
    "lamp.group": `${t("Group")}`,
    "lamp.tips": `${t("Tips")}`,
    "lamp.journal": `${t("Journal")}`,
    "lamp.breathe": `${t("Breathe")}`,
    "lamp.dbt_diary_card": `${t("DBT Diary Card")}`,
    "lamp.scratch_image": `${t("Scratch image")}`,
    "lamp.memory_game": `${t("Memory Game")}`,
    "lamp.goals": `${t("Goals")}`,
    "lamp.medications": `${t("Medications")}`,
  }
  const [checked, setChecked] = React.useState(false)
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleSelected(activity, event.target.checked)
    setChecked(event.target.checked)
  }

  const intervals = [
    { key: "hourly", value: `${t("Every hour")}` },
    { key: "every3h", value: `${t("Every number hours", { number: 3 })}` },
    { key: "every6h", value: `${t("Every number hours", { number: 6 })}` },
    { key: "every12h", value: `${t("Every number hours", { number: 12 })}` },
    { key: "daily", value: `${t("Every day")}` },
    { key: "biweekly", value: `${t("Two times every week (Tue, Thurs)")}` },
    { key: "triweekly", value: `${t("Three times every week (Mon, Wed, Fri)")}` },
    { key: "weekly", value: `${t("Every week")}` },
    { key: "bimonthly", value: `${t("Two times every month")}` },
    { key: "fortnightly", value: `${t("Every 2 weeks")}` },
    { key: "monthly", value: `${t("Every month")}` },
    { key: "custom", value: `${t("Use custom times instead")}` },
    { key: "none", value: `${t("Do not repeat")}` },
  ]

  return (
    <Box style={{ backgroundColor: index % 2 == 0 ? "#ECF4FF" : "transparent" }} p={1}>
      <Grid container alignItems="center">
        <Grid item className={classes.w45}>
          <Checkbox
            checked={checked}
            onChange={handleChange}
            classes={{ checked: classes.checkboxActive }}
            inputProps={{ "aria-label": "primary checkbox" }}
          />
        </Grid>
        <Grid item xs>
          <Typography className={classes.contentText} style={{ flex: 1 }}>
            {`${t(activity.name)}`}
          </Typography>
        </Grid>
        <Grid item xs>
          <Typography className={classes.contentText} style={{ flex: 1 }}>
            {types[activity.spec] ?? `${t("Cognitive Test")}`}
          </Typography>
        </Grid>
        <Grid item xs>
          <Typography className={classes.contentText} style={{ flex: 1 }}>
            {(activity?.schedule ?? []).map((sc) => (
              <Box>{`${t(intervals.filter((i) => i.key === sc.repeat_interval)[0]?.value)}`}</Box>
            ))}
          </Typography>
        </Grid>
        <Grid item className={classes.w120}>
          <UpdateActivity
            activity={activity}
            activities={activities}
            studies={studies}
            setActivities={setActivities}
            profile={participantId}
            researcherId={researcherId}
          />
          <ScheduleActivity activity={activity} setActivities={setActivities} activities={activities} />
        </Grid>
      </Grid>
    </Box>
  )
}
