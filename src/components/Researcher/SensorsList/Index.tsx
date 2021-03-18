import React, { useState, useEffect } from "react"
import { Box, Grid, Icon, Backdrop, CircularProgress } from "@material-ui/core"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import Header from "./Header"
import { useTranslation } from "react-i18next"
import SensorListItem from "./SensorListItem"
import { Service } from "../../DBService/DBService"
import { sortData } from "../Dashboard"
import Pagination from "../../PaginatedElement"

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
      [theme.breakpoints.down("sm")]: {
        marginBottom: 80,
      },
    },
    backdrop: {
      zIndex: 111111,
      color: "#fff",
    },
    norecords: {
      "& span": { marginRight: 5 },
    },
  })
)

export default function SensorsList({
  title,
  researcher,
  studies,
  selectedStudies,
  setSelectedStudies,
  ...props
}: {
  title?: string
  researcher?: Object
  studies: Array<any>
  selectedStudies: Array<any>
  setSelectedStudies?: Function
}) {
  const classes = useStyles()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [sensors, setSensors] = useState([])
  const [selectedSensors, setSelectedSensors] = useState<any>([])
  const [search, setSearch] = useState(null)
  const [paginatedSensors, setPaginatedSensors] = useState([])

  const handleChange = (sensorData, checked) => {
    if (checked) {
      setSelectedSensors((prevState) => [...prevState, sensorData])
    } else {
      let selected = selectedSensors.filter((item) => item.id != sensorData.id)
      setSelectedSensors(selected)
    }
  }

  useEffect(() => {
    if (selectedStudies.length > 0) searchFilterSensors()
  }, [selectedStudies])

  useEffect(() => {
    searchFilterSensors()
  }, [search])

  const searchFilterSensors = () => {
    setLoading(true)
    selectedStudies = selectedStudies.filter((o) => studies.some(({ name }) => o === name))
    if (selectedStudies.length > 0) {
      let result = []
      selectedStudies.map((study) => {
        Service.getDataByKey("sensors", [study], "study_name").then((sensorData) => {
          if ((sensorData || []).length > 0) {
            if (!!search && search.trim().length > 0) {
              result = result.concat(sensorData)
              let newSensors = result.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()))
              setSensors(sortData(newSensors, selectedStudies, "name"))
            } else {
              result = result.concat(sensorData)
              setSensors(sortData(result, selectedStudies, "name"))
            }
          }
          setLoading(false)
        })
      })
    }
    setSelectedSensors([])
  }

  useEffect(() => {
    setPaginatedSensors(sensors.slice(0, 50))
  }, [sensors])

  const handleSearchData = (val) => {
    setSearch(val)
  }

  const handleChangePage = (page: number, rowCount: number) => {
    setPaginatedSensors(sensors.slice((Number(page) - 1) * rowCount, (Number(page) - 1) * rowCount + rowCount))
    setLoading(false)
  }

  return (
    <React.Fragment>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Header
        studies={studies}
        researcher={researcher}
        selectedSensors={selectedSensors}
        searchData={handleSearchData}
        setSelectedStudies={setSelectedStudies}
        selectedStudies={selectedStudies}
        setSensors={searchFilterSensors}
      />
      <Box className={classes.tableContainer} py={4}>
        <Grid container spacing={3}>
          {sensors !== null && sensors.length > 0 ? (
            <Grid container spacing={3}>
              {(paginatedSensors ?? []).map((item, index) => (
                <Grid item lg={6} xs={12} key={item.id}>
                  <SensorListItem
                    sensor={item}
                    studies={studies}
                    handleSelectionChange={handleChange}
                    selectedSensors={selectedSensors}
                    setSensors={searchFilterSensors}
                  />
                </Grid>
              ))}
              <Pagination data={sensors} updatePage={handleChangePage} />
            </Grid>
          ) : (
            <Grid item lg={6} xs={12}>
              <Box display="flex" alignItems="center" className={classes.norecords}>
                <Icon>info</Icon>
                {t("No Records Found")}
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    </React.Fragment>
  )
}
