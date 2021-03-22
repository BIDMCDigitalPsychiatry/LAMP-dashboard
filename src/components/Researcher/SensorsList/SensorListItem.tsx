import React from "react"
import { Box, Typography, Card, CardHeader, Menu, CardActions, CardContent, Grow } from "@material-ui/core"
import { useSnackbar } from "notistack"
import LAMP from "lamp-core"
import { makeStyles, Theme, createStyles, MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles"
import UpdateSensor from "./UpdateSensor"
import Checkbox from "@material-ui/core/Checkbox"

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
  selectedSensors?: Array<Object>
  setSensors?: Function
}) {
  const classes = useStyles()
  const [checked, setChecked] = React.useState(false)

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
