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
import { getBasicToken } from "../../helper"

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
  const [totalCount, setTotalCount] = useState(0)
  const [sensorsByStudy, setSensorsByStudy] = useState({})
  const [filters, setFilters] = useState({
    sort: "createdAt",
    order: order ? "asc" : "desc",
    search: "",
    page: 1,
    limit: 40,
  })

  useInterval(
    () => {
      setLoading(true)
      getAllStudies()
    },
    studies !== null && (studies || [])?.length > 0 ? null : 2000,
    true
  )

  useEffect(() => {
    setFilters((prev) => ({ ...prev, order: order ? "asc" : "desc" }))
  }, [order])

  useEffect(() => {
    let params = JSON.parse(localStorage.getItem("sensors"))
    setPage(params?.page ?? 0)
    setRowCount(params?.rowCount ?? 40)
  }, [])

  useEffect(() => {
    if (selected !== selectedStudies) setSelected(selectedStudies)
  }, [selectedStudies])

  useEffect(() => {
    if (researcherId && studies?.length) {
      searchFilterSensors()
    }
  }, [researcherId, selectedStudies, filters])

  useEffect(() => {
    const userToken: any = getBasicToken()
    if (!!userToken || LAMP.Auth?._auth?.serverAddress == "demo.lamp.digital") {
      if ((selected || [])?.length > 0) {
        searchFilterSensors()
      } else {
        setSensors([])
        setLoading(false)
      }
    } else {
      window.location.href = "/#/"
    }
  }, [selected])

  const handleChange = (sensorData, checked) => {
    if (checked) {
      setSelectedSensors((prevState) => [...prevState, sensorData])
    } else {
      let selected = selectedSensors?.filter((item) => item.id != sensorData.id)
      setSelectedSensors(selected)
    }
  }
  const searchFilterSensorsForDemo = (searchVal?: string) => {
    const searchTxt = searchVal ?? search
    const selectedData = selected?.filter((o) => studies.some(({ name }) => o === name))
    if (selectedData?.length > 0) {
      setLoading(true)
      let result = []
      Service.getAll("sensors").then((sensorData) => {
        if ((sensorData || [])?.length > 0) {
          if (!!searchTxt && searchTxt.trim()?.length > 0) {
            result = result?.concat(sensorData)
            result = result?.filter((i) => i.name?.toLowerCase().includes(searchTxt?.toLowerCase()))
            setSensors(sortData(result, selectedData, "name"))
          } else {
            result = result?.concat(sensorData)
            setSensors(sortData(result, selectedData, "name"))
          }
          const allCounts = (result || [])?.reduce((acc: Record<string, number>, a: any) => {
            const key = a.study_id || a.study || "unknown"
            acc[key] = (acc[key] || 0) + 1
            return acc
          }, {} as Record<string, number>)
          setSensorsByStudy(allCounts)
          setTotalCount(result?.length)
          setPaginatedSensors(
            sortData(result, selectedData, "name")?.slice(page * rowCount, page * rowCount + rowCount)
          )
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

  const searchFilterSensors = async (searchVal?: string) => {
    if (LAMP.Auth?._auth?.serverAddress == "demo.lamp.digital") {
      searchFilterSensorsForDemo(searchVal)
      return
    }
    try {
      setLoading(true)
      const searchTxt = searchVal ?? search
      const studyIds =
        selectedStudies?.map((name) => studies?.find((s) => s.name === name)?.name)?.filter(Boolean) || []
      const requestBody = {
        studies: studyIds,
        sort: filters.order,
        search: searchTxt?.trim(),
        page: filters.page,
        limit: filters.limit,
      }
      const result = await LAMP.Researcher.sensorsList(researcherId, requestBody)
      const sensorArray = result?.sensors || []
      const mapped = sensorArray?.map((p) => ({
        ...p,
        id: p._id,
        name: p.name || p._id,
        study_name: p.studyName,
        study_id: p._parent,
        spec: p.spec,
        settings: p.settings,
        category: p.category,
        parent: p._parent,
        timestamp: p.timestamp,
        deleted: p._deleted,
      }))
      setSensors(mapped)
      const total = !!result?.totalSensors
        ? Object.values(result?.totalSensors)?.reduce((sum, value) => Number(sum) + Number(value), 0)
        : 0
      setSensorsByStudy(result?.totalSensors || {})
      setTotalCount(result?.count || 0)
      setPaginatedSensors(mapped?.slice(0, rowCount))
    } catch (err) {
      console.error(" Error fetching sensors:", err)
      setPaginatedSensors([])
    } finally {
      setLoading(false)
    }
    setSelectedSensors([])
  }

  const handleSearchData = (val: string) => {
    setSearch(val)
    searchFilterSensors(val)
  }

  const handleChangePage = (page: number, rowCount: number) => {
    setFilters((prev) => ({ ...prev, page: page + 1, limit: rowCount }))
    localStorage.setItem("activities", JSON.stringify({ page: page, rowCount: rowCount }))
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
        sensorsByStudy={sensorsByStudy}
      />
      <Box className={classes.tableContainer} py={4}>
        <Grid container spacing={3}>
          {sensors !== null && sensors?.length > 0 ? (
            <Grid container spacing={3}>
              {(paginatedSensors ?? [])?.map((item, index) => (
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
                totalCount={totalCount}
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
