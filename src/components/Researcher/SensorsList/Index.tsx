import React, { useState, useEffect } from "react"
import { Box, Grid, Icon, Backdrop, CircularProgress, makeStyles, Theme, createStyles } from "@material-ui/core"
import Header from "./Header"
import { useTranslation } from "react-i18next"
import SensorListItem from "./SensorListItem"
import { Service } from "../../DBService/DBService"
import { sortData } from "../Dashboard"
import Pagination from "../../PaginatedElement"
import useInterval from "../../useInterval"
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
  researcherId,
  studies,
  selectedStudies,
  setSelectedStudies,
  setOrder,
  getAllStudies,
  order,
  ...props
}: {
  title?: string
  researcherId?: string
  studies: Array<any>
  selectedStudies: Array<any>
  setSelectedStudies?: Function
  getAllStudies?: Function
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

  useInterval(
    () => {
      setLoading(true)
      getAllStudies()
    },
    studies !== null && (studies || []).length > 0 ? null : 2000,
    true
  )

  useEffect(() => {
    let params = JSON.parse(localStorage.getItem("sensors"))
    setPage(params?.page ?? 0)
    setRowCount(params?.rowCount ?? 40)
  }, [])

  useEffect(() => {
    if (selected !== selectedStudies) setSelected(selectedStudies)
  }, [selectedStudies])

  useEffect(() => {
    const userToken: any =
      typeof sessionStorage.getItem("tokenInfo") !== "undefined" && !!sessionStorage.getItem("tokenInfo")
        ? JSON.parse(sessionStorage.getItem("tokenInfo"))
        : null
    if (!!userToken || LAMP.Auth?._auth?.serverAddress == "demo.lamp.digital") {
      if ((selected || []).length > 0) {
        searchFilterSensors()
      } else {
        setSensors([])
        setLoading(false)
      }
    } else {
      window.location.href = "/#/"
    }
  }, [selected, sessionStorage.getItem("tokenInfo")])

  const handleChange = (sensorData, checked) => {
    if (checked) {
      setSelectedSensors((prevState) => [...prevState, sensorData])
    } else {
      let selected = selectedSensors.filter((item) => item.id != sensorData.id)
      setSelectedSensors(selected)
    }
  }
  const searchFilterSensors = (searchVal?: string) => {
    const searchTxt = searchVal ?? search
    const selectedData = selected.filter((o) => studies.some(({ name }) => o === name))
    if (selectedData.length > 0) {
      setLoading(true)
      let result = []
      Service.getAll("sensors").then((sensorData) => {
        if ((sensorData || []).length > 0) {
          if (!!searchTxt && searchTxt.trim().length > 0) {
            result = result.concat(sensorData)
            result = result.filter((i) => i.name?.toLowerCase().includes(searchTxt?.toLowerCase()))
            setSensors(sortData(result, selectedData, "name"))
          } else {
            result = result.concat(sensorData)
            setSensors(sortData(result, selectedData, "name"))
          }
          setPaginatedSensors(sortData(result, selectedData, "name").slice(page * rowCount, page * rowCount + rowCount))
          setPage(page)
          setRowCount(rowCount)
        } else {
          setSensors([])
        }
        setLoading(false)
      })
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
    localStorage.setItem("sensors", JSON.stringify({ page: page, rowCount: rowCount }))
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
        researcherId={researcherId}
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
                {`${t("No Records Found")}`}
              </Box>
            </Box>
          )}
        </Grid>
      </Box>
    </React.Fragment>
  )
}
