import React, { useState, useEffect } from "react"
import { Box, Typography, Grid } from "@material-ui/core"
import { makeStyles, createStyles } from "@material-ui/core/styles"
import { useSnackbar } from "notistack"
import { useTranslation } from "react-i18next"
import AddSensor from "../../SensorsList/AddSensor"
import { Service } from "../../../DBService/DBService"
import SensorRow from "./SensorRow"
import DeleteSensor from "../../SensorsList/DeleteSensor"
import { sortData } from "../../Dashboard"

const useStyles = makeStyles((theme) =>
  createStyles({
    sectionTitle: {
      color: "rgba(0, 0, 0, 0.75)",
      fontSize: 25,
      fontWeight: "bold",
      marginTop: 5,
    },
    contentText: {
      color: "rgba(0, 0, 0, 0.75)",
      fontWeight: "bold",
      fontSize: 14,
      marginLeft: 10,
    },
    w45: { width: 45 },
    w120: { width: 120 },
    optionsMain: {
      width: "100%",
      background: "#ECF4FF",
      borderBottom: "1px solid #C7C7C7",
      padding: "10px",
    },
    secAdd: {
      "& *": { position: "relative !important" },
    },
  })
)
export default function Sensors({ participant, studies, ...props }: { participant: any; studies: any }) {
  const classes = useStyles()
  const [sensors, setSensors] = useState([])
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation()
  const [selectedSensors, setSelectedSensors] = useState([])

  const addedSensor = (data) => {
    // addSensorItem(data, studies)
    setSensors((prevState) => [...prevState, data])
  }

  const onChangeSensors = () => {
    ;(async () => {
      Service.getAll("sensors").then((sensors) => {
        let data = (sensors || []).filter((i) => i.study_id === participant.study_id)
        setSensors(sortData(data, [studies.filter((study) => study.id === participant.study_id)[0]?.name], "id"))
      })
    })()
  }

  useEffect(() => {
    onChangeSensors()
  }, [])

  const deleteSensors = () => {
    const sensorIds = selectedSensors.map((s) => {
      return s.id
    })
    let newSensors = sensors.filter((i) => sensorIds.includes(i.id))
    setSensors(newSensors)
  }

  const handleSensorSelected = (sensor, checked) => {
    if (!!checked) {
      setSelectedSensors((prevState) => [...prevState, sensor])
    } else {
      let selected = selectedSensors
      selected = selected.filter((item) => item.id != sensor.id)
      setSelectedSensors(selected)
    }
  }

  return (
    <Box width={1}>
      <Box display="flex" width={1} mt={5}>
        <Box flexGrow={1}>
          <Typography className={classes.sectionTitle} style={{ marginBottom: 34 }}>
            {t("Sensors")}
          </Typography>
        </Box>
        <Box className={classes.secAdd}>
          <AddSensor studies={studies} addedSensor={addedSensor} studyId={participant.study_id} />
        </Box>
      </Box>
      {selectedSensors.length > 0 && (
        <Box className={classes.optionsMain}>
          <DeleteSensor sensors={selectedSensors} newDeletedIds={deleteSensors} setSensors={onChangeSensors} />
        </Box>
      )}

      <Grid container spacing={0}>
        <Grid item xs={12} sm={12}>
          <Box p={1}>
            {sensors.length > 0 ? (
              <Grid container>
                <Grid item className={classes.w45}></Grid>
                <Grid item xs>
                  <Typography className={classes.contentText} style={{ flex: 1 }}>
                    NAME
                  </Typography>
                </Grid>
                <Grid item xs>
                  <Typography className={classes.contentText} style={{ flex: 1 }}>
                    TYPE
                  </Typography>
                </Grid>
                <Grid item className={classes.w120}></Grid>
              </Grid>
            ) : (
              "No Sensors"
            )}
          </Box>
          {(sensors ?? []).map((item, index) => {
            return (
              <SensorRow
                studies={studies}
                sensor={item}
                index={index}
                studyId={participant.study_id}
                handleSelected={handleSensorSelected}
              />
            )
          })}
        </Grid>
        <Grid item xs={10} sm={2} />
      </Grid>
    </Box>
  )
}
