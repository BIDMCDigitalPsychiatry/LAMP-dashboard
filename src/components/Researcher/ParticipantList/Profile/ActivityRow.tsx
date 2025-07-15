// Core Imports
import React from "react"
import Box from "@material-ui/core/Box"
import Typography from "@material-ui/core/Typography"
import Grid from "@material-ui/core/Grid"
import Checkbox from "@material-ui/core/Checkbox"
import { makeStyles, createStyles } from "@material-ui/core/styles"
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
    "lamp.journal": `${t("Journal")}`,
    "lamp.scratch_image": `${t("Scratch card")}`,
    "lamp.breathe": `${t("Breathe")}`,
    "lamp.tips": `${t("Tip")}`,
    "lamp.dbt_diary_card": `${t("DBT Diary Card")}`,
    "lamp.cats_and_dogs": `${t("Cats and Dogs")}`,
    "lamp.jewels_a": `${t("Jewels A")}`,
    "lamp.jewels_b": `${t("Jewels B")}`,
    "lamp.spatial_span": `${t("Spatial Span")}`,
    "lamp.pop_the_bubbles": `${t("Pop the bubbles")}`,
    "lamp.balloon_risk": `${t("Balloon Risk")}`,
    "lamp.recording": `${t("Voice Recording")}`,
    "lamp.survey": `${t("Survey Instrument")}`,
    "lamp.group": `${t("Activity Group")}`,
    "lamp.module": `${t("Activity Module")}`,
    "lamp.memory_game": `${t("Memory Game")}`,
    "lamp.goals": `${t("Goals")}`,
    "lamp.medications": `${t("Medications")}`,
    "lamp.spin_wheel": `${t("Spin The Wheel")}`,
    "lamp.maze_game": `${t("Maze Game")}`,
    "lamp.emotion_recognition": `${t("Emotion Recognition")}`,
    "lamp.symbol_digit_substitution": `${t("Symbol-digit Substitution")}`,
    "lamp.dcog": `${t("D-Cog")}`,
    "lamp.funny_memory": `${t("Funny Memory Game")}`,
    "lamp.trails_b": `${t("Trails B")}`,
    "lamp.voice_survey": `${t("Speech Recording")}`,
    "lamp.fragmented_letters": `${t("Fragmented Letters")}`,
    "lamp.digit_span": `${t("Digit Span")}`,
    "lamp.zoom_meeting": `${t("Virtual Meeting")}`,
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
