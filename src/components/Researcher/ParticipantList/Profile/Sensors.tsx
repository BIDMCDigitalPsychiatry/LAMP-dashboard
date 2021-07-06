import React, { useState, useEffect } from "react"
import { Box, Typography, Grid, makeStyles, createStyles } from "@material-ui/core"
import { useSnackbar } from "notistack"
import { useTranslation } from "react-i18next"
import AddSensor from "../../SensorsList/AddSensor"
import { Service } from "../../../DBService/DBService"
import SensorRow from "./SensorRow"
import DeleteSensor from "../../SensorsList/DeleteSensor"
import { sortData } from "../../Dashboard"
import Pagination from "../../../PaginatedElement"

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
export default function Sensors({
  participant,
  studies,
  setUpdateCount,
  ...props
}: {
  participant: any
  studies: any
  setUpdateCount: Function
}) {
  const classes = useStyles()
  const [sensors, setSensors] = useState([])
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation()
  const [selectedSensors, setSelectedSensors] = useState([])
  const [paginatedSensors, setPaginatedSensors] = useState([])
  const [rowCount, setRowCount] = useState(10)
  const [page, setPage] = useState(0)

  const onChangeSensors = () => {
    ;(async () => {
      Service.getDataByKey("sensors", [participant.study_name], "study_name").then((sensors) => {
        let result = sortData(sensors, [participant.study_name], "id")
        setSensors(result)
        setPaginatedSensors(result.slice(page, rowCount))
      })
    })()
    setSelectedSensors([])
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

  const handleChangePage = (page: number, rowCount: number) => {
    setRowCount(rowCount)
    setPage(page)
    setPaginatedSensors(sensors.slice(page * rowCount, page * rowCount + rowCount))
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
          <AddSensor
            studies={studies}
            studyId={participant.study_id}
            setSensors={onChangeSensors}
            setUpdateCount={setUpdateCount}
          />
        </Box>
      </Box>
      {(selectedSensors || []).length > 0 && (
        <Box className={classes.optionsMain}>
          <DeleteSensor
            sensors={selectedSensors}
            selectedStudyArray={() => {}}
            newDeletedIds={deleteSensors}
            setSensors={onChangeSensors}
            setUpdateCount={setUpdateCount}
            profile={true}
          />
        </Box>
      )}

      <Grid container spacing={0}>
        <Grid item xs={12} sm={12}>
          <Box p={1}>
            {(sensors || []).length > 0 ? (
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
              t("No Sensors")
            )}
          </Box>
          <Grid container>
            {(paginatedSensors ?? []).map((item, index) => (
              <Grid item xs={12} sm={12} key={item.id}>
                <SensorRow
                  studies={studies}
                  sensor={item}
                  index={index}
                  studyId={participant.study_id}
                  handleSelected={handleSensorSelected}
                  setSensors={onChangeSensors}
                />
              </Grid>
            ))}
            <Pagination data={sensors} updatePage={handleChangePage} defaultCount={10} />
          </Grid>
        </Grid>
        <Grid item xs={10} sm={2} />
      </Grid>
    </Box>
  )
}
