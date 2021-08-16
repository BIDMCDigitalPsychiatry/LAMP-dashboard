import React, { useEffect } from "react"
import {
  Box,
  Typography,
  Card,
  CardHeader,
  CardActions,
  makeStyles,
  Theme,
  createStyles,
  Checkbox,
} from "@material-ui/core"
import ScheduleActivity from "./ScheduleActivity"
import UpdateActivity from "./UpdateActivity"
import { updateSchedule } from "./ActivityMethods"
import LAMP from "lamp-core"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tableContainer: {
      "& div.MuiInput-underline:before": { borderBottom: "0 !important" },
      "& div.MuiInput-underline:after": { borderBottom: "0 !important" },
      "& div.MuiInput-underline": {
        "& span.material-icons": {
          width: 21,
          height: 19,
          fontSize: 27,
          lineHeight: "23PX",
          color: "rgba(0, 0, 0, 0.4)",
        },
        "& button": { display: "none" },
      },
    },
    activityHeader: { padding: "12px 5px" },
    cardMain: {
      boxShadow: "none !important ",
      background: "#F8F8F8",
      "& span.MuiCardHeader-title": { fontSize: "16px", fontWeight: 500 },
    },
    checkboxActive: { color: "#7599FF !important" },
  })
)
export default function ActivityItem({
  activity,
  researcher,
  studies,
  activities,
  handleSelectionChange,
  selectedActivities,
  setActivities,
  updateActivities,
  ...props
}) {
  const classes = useStyles()
  const [checked, setChecked] = React.useState(
    selectedActivities.filter((d) => d.id === activity.id).length > 0 ? true : false
  )

  const handleChange = (activity, event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
    handleSelectionChange(activity, event.target.checked)
  }

  return (
    <Card className={classes.cardMain}>
      <Box display="flex" p={1}>
        <Box>
          <Checkbox
            checked={checked}
            onChange={(event) => handleChange(activity, event)}
            classes={{ checked: classes.checkboxActive }}
            inputProps={{ "aria-label": "primary checkbox" }}
          />
        </Box>
        <Box flexGrow={1}>
          <CardHeader
            className={classes.activityHeader}
            title={activity.name}
            subheader={
              <Box>
                <Typography variant="subtitle1">{activity.spec?.replace("lamp.", "")}</Typography>
                <Typography variant="body2">{activity.study_name}</Typography>
              </Box>
            }
          />
        </Box>
        <Box>
          <CardActions>
            <UpdateActivity
              activity={activity}
              activities={activities}
              studies={studies}
              setActivities={setActivities}
              profile={0}
            />
            <ScheduleActivity activity={activity} setActivities={updateActivities} activities={activities} />
          </CardActions>
        </Box>
      </Box>
    </Card>
  )
}
