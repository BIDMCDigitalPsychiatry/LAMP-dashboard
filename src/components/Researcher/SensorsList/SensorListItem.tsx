import React, { useEffect } from "react"
import {
  Box,
  Typography,
  Card,
  CardHeader,
  Menu,
  CardActions,
  CardContent,
  Grow,
  makeStyles,
  Theme,
  createStyles,
  Checkbox,
} from "@material-ui/core"
import UpdateSensor from "./UpdateSensor"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    activityHeader: { padding: "12px 5px" },
    cardMain: {
      boxShadow: "none !important ",
      background: "#F8F8F8",
      "& span.MuiCardHeader-title": { fontSize: "16px", fontWeight: 500 },
    },
    checkboxActive: { color: "#7599FF !important" },
  })
)

export interface Sensors {
  id?: string
  study_id?: string
  name?: string
  spec?: string
  study_name?: string
}
export default function SensorListItem({
  sensor,
  studies,
  handleSelectionChange,
  selectedSensors,
  setSensors,
  ...props
}: {
  sensor?: Sensors
  studies?: Array<Object>
  handleSelectionChange: Function
  selectedSensors?: any
  setSensors?: Function
}) {
  const classes = useStyles()
  const [checked, setChecked] = React.useState(
    selectedSensors.filter((d) => d.id === sensor.id).length > 0 ? true : false
  )

  const handleChange = (sensor, event) => {
    setChecked(event.target.checked)
    handleSelectionChange(sensor, event.target.checked)
  }

  return (
    <Card className={classes.cardMain}>
      <Box display="flex" p={1}>
        <Box>
          <Checkbox
            checked={checked}
            onChange={(event) => handleChange(sensor, event)}
            classes={{ checked: classes.checkboxActive }}
            inputProps={{ "aria-label": "primary checkbox" }}
          />
        </Box>
        <Box flexGrow={1}>
          <CardHeader
            className={classes.activityHeader}
            title={sensor.name}
            subheader={
              <Box>
                <Typography variant="subtitle1">{sensor.spec?.replace("lamp.", "")}</Typography>
                <Typography variant="body2">{sensor.study_name}</Typography>
              </Box>
            }
          />
        </Box>
        <Box>
          <CardActions>
            <UpdateSensor sensor={sensor} studies={studies} type="list" setSensors={setSensors} />
          </CardActions>
        </Box>
      </Box>
    </Card>
  )
}
