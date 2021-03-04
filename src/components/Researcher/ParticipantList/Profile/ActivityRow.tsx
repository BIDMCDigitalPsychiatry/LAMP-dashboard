// Core Imports
import React from "react"
import { Box, Typography } from "@material-ui/core"
import { makeStyles, createStyles } from "@material-ui/core/styles"
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
      fontWeight: "bold",
      fontSize: 14,
      marginLeft: 10,
    },
  })
)

export default function ActivityRow({
  activity,
  index,
  studies,
  activities,
  ...props
}: {
  activity: any
  index: number
  studies: any
  activities: any
}) {
  const classes = useStyles()
  const { t } = useTranslation()

  const types = {
    "lamp.survey": t("Survey"),
    "lamp.group": t("Group"),
    "lamp.tips": t("Tips"),
    "lamp.journal": t("Journal"),
    "lamp.breathe": t("Breathe"),
    "lamp.dbt_diary_card": t("DBT Diary Card"),
    "lamp.scratch_image": t("Scratch image"),
  }
  return (
    <div className={classes.rowContainer} style={{ backgroundColor: index % 2 == 0 ? "#ECF4FF" : "transparent" }}>
      <Typography className={classes.contentText} style={{ flex: 1 }}>
        {activity.name}
      </Typography>
      <Typography className={classes.contentText} style={{ flex: 1 }}>
        {types[activity.spec] ?? t("Cognitive Test")}
      </Typography>
      <Typography className={classes.contentText} style={{ flex: 1 }}>
        {(activity?.schedule ?? []).map((sc) => (
          <Box>{sc.repeat_interval}</Box>
        ))}
      </Typography>
      <UpdateActivity activity={activity} activities={activities} studies={studies} />
      <ScheduleActivity activity={activity} />
    </div>
  )
}
