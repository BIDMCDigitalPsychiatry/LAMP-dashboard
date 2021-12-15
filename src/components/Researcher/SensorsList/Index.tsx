import React, { useState, useEffect } from "react"
import { Box, Grid, Icon, Backdrop, CircularProgress, makeStyles, Theme, createStyles } from "@material-ui/core"
import Header from "./Header"
import { useTranslation } from "react-i18next"
import SensorListItem from "./SensorListItem"
import { Service } from "../../DBService/DBService"
import { sortData } from "../Dashboard"
import Pagination from "../../PaginatedElement"
import useInterval from "../../useInterval"

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
    norecordsmain: {
      minHeight: "calc(100% - 114px)",
      position: "absolute",
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
  getDBStudies,
  setOrder,
  order,
  ...props
}: {
  title?: string
  researcher?: Object
  studies: Array<any>
  selectedStudies: Array<any>
  setSelectedStudies?: Function
  getDBStudies?: Function
  setOrder?: Function
  order?: boolean
}) {
  const classes = useStyles()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [sensors, setSensors] = useState(null)
  const [selectedSensors, setSelectedSensors] = useState([])
  const [paginatedSensors, setPaginatedSensors] = useState([])
  const [selected, setSelected] = useState(selectedStudies)
  const [rowCount, setRowCount] = useState(40)
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState(null)
  const [loadTime, setLoadTime] = useState(false)
  const [allSensors, setAllSensors] = useState(null)

  useInterval(
    () => {
      getAllSensors()
    },
    allSensors !== null && !!loadTime ? null : 3000,
    true
  )

  useEffect(() => {
    setTimeout(() => {
      setLoadTime(true)
    }, 10000)
  }, [])

  const getAllSensors = () => {
    Service.getAll("sensors").then((data) => {
      setAllSensors(data || [])
      if ((data || []).length > 0) setLoadTime(true)
    })
  }

  const handleChange = (sensorData, checked) => {
    if (checked) {
      setSelectedSensors((prevState) => [...prevState, sensorData])
    } else {
      let selected = selectedSensors.filter((item) => item.id != sensorData.id)
      setSelectedSensors(selected)
    }
  }
  useEffect(() => {
    setSelected(selectedStudies)
  }, [selectedStudies])

  useEffect(() => {
    setLoadTime(false)
    if ((selectedStudies || []).length > 0) {
      setLoadTime(true)
      searchFilterSensors()
    } else {
      setSensors([])
    }
  }, [selected])

  useEffect(() => {
    if (!!loadTime) searchFilterSensors()
  }, [loadTime])

  const searchFilterSensors = (searchVal?: string) => {
    const searchTxt = searchVal ?? search
    if (selectedStudies.length > 0) {
      const selectedData = selectedStudies.filter((o) => studies.some(({ name }) => o === name))
      if (selectedData.length > 0 && !loading) {
        let result = []
        selectedData.map((study) => {
          Service.getDataByKey("sensors", [study], "study_name").then((sensorData) => {
            if ((sensorData || []).length > 0) {
              if (!!searchTxt && searchTxt.trim().length > 0) {
                result = result.concat(sensorData)
                result = result.filter((i) => i.name?.toLowerCase().includes(searchTxt?.toLowerCase()))
                setSensors(sortData(result, selectedData, "name"))
              } else {
                result = result.concat(sensorData)
                setSensors(sortData(result, selectedData, "name"))
              }
              setPaginatedSensors(
                sortData(result, selectedData, "name").slice(page * rowCount, page * rowCount + rowCount)
              )
              setPage(page)
              setRowCount(rowCount)
            } else {
              if (result.length === 0) setSensors([])
            }
            setLoading(false)
          })
        })
      } else {
        setLoading(false)
      }
    } else {
      setSensors([])
      setLoading(false)
    }
    setSelectedSensors([])
  }

  const handleSearchData = (val: string) => {
    setSearch(val)
    searchFilterSensors(val)
  }

  const handleChangePage = (page: number, rowCount: number) => {
    setLoading(true)
    setRowCount(rowCount)
    setPage(page)
    const selectedData = selected.filter((o) => studies.some(({ name }) => o === name))
    setPaginatedSensors(sortData(sensors, selectedData, "name").slice(page * rowCount, page * rowCount + rowCount))
    setLoading(false)
  }

  return (
    <React.Fragment>
      <Backdrop className={classes.backdrop} open={loading || sensors === null}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Header
        studies={studies}
        researcher={researcher}
        selectedSensors={selectedSensors}
        searchData={handleSearchData}
        setSelectedStudies={setSelectedStudies}
        selectedStudies={selected}
        setSensors={searchFilterSensors}
        setOrder={setOrder}
        order={order}
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
              <Pagination
                data={sensors}
                updatePage={handleChangePage}
                rowPerPage={[20, 40, 60, 80]}
                currentPage={page}
                currentRowCount={rowCount}
              />
            </Grid>
          ) : (
            <Box className={classes.norecordsmain}>
              <Box display="flex" p={2} alignItems="center" className={classes.norecords}>
                <Icon>info</Icon>
                {t("No Records Found")}
              </Box>
            </Box>
          )}
        </Grid>
      </Box>
    </React.Fragment>
  )
}
