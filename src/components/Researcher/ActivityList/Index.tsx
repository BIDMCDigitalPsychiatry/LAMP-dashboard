import React, { useState, useEffect } from "react"
import { Box, Grid, Backdrop, CircularProgress, Icon, makeStyles, Theme, createStyles } from "@material-ui/core"
import { Service } from "../../DBService/DBService"
import LAMP from "lamp-core"
import { useTranslation } from "react-i18next"
import ActivityItem from "./ActivityItem"
import Header from "./Header"
import { sortData } from "../Dashboard"
import Pagination from "../../PaginatedElement"
import classNames from "classnames"
import useInterval from "../../useInterval"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: 111111,
      color: "#fff",
    },
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
    norecordsmain: {
      minHeight: "calc(100% - 114px)",
      position: "absolute",
    },
    norecords: {
      "& span": { marginRight: 5 },
    },
  })
)

export const availableActivitySpecs = [
  "lamp.group",
  "lamp.survey",
  "lamp.journal",
  "lamp.jewels_a",
  "lamp.jewels_b",
  "lamp.breathe",
  "lamp.spatial_span",
  "lamp.tips",
  "lamp.cats_and_dogs",
  "lamp.scratch_image",
  "lamp.dbt_diary_card",
  "lamp.pop_the_bubbles",
  "lamp.balloon_risk",
  "lamp.recording",
]
export const games = [
  "lamp.jewels_a",
  "lamp.jewels_b",
  "lamp.spatial_span",
  "lamp.cats_and_dogs",
  "lamp.pop_the_bubbles",
  "lamp.balloon_risk",
]
export default function ActivityList({
  researcher,
  title,
  studies,
  selectedStudies,
  setSelectedStudies,
  setOrder,
  order,
  getAllStudies,
  ...props
}) {
  const [activities, setActivities] = useState(null)
  const { t } = useTranslation()
  const classes = useStyles()
  const [selectedActivities, setSelectedActivities] = useState<any>([])
  const [loading, setLoading] = useState(true)
  const [paginatedActivities, setPaginatedActivities] = useState([])
  const [selected, setSelected] = useState(selectedStudies)
  const [allActivities, setAllActivities] = useState(null)
  const [rowCount, setRowCount] = useState(40)
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState(null)

  useInterval(
    () => {
      getAllStudies()
    },
    studies !== null && (studies || []).length > 0 ? null : 2000,
    true
  )

  useEffect(() => {
    if (selected !== selectedStudies) setSelected(selectedStudies)
  }, [selectedStudies])

  useEffect(() => {
    if ((selected || []).length > 0) {
      searchActivities()
    } else {
      setActivities([])
    }
  }, [selected])

  const handleChange = (activity, checked) => {
    if (checked) {
      setSelectedActivities((prevState) => [...prevState, activity])
    } else {
      let selected = selectedActivities.filter((item) => item.id != activity.id)
      setSelectedActivities(selected)
    }
  }

  const searchActivities = (searchVal?: string) => {
    const searchTxt = searchVal ?? search
    const selectedData = selected.filter((o) => studies.some(({ name }) => o === name))
    if (selectedData.length > 0) {
      setLoading(true)
      let result = []
      Service.getAll("activities").then((activitiesData) => {
        if ((activitiesData || []).length > 0) {
          if (!!searchTxt && searchTxt.trim().length > 0) {
            result = result.concat(activitiesData)
            result = result.filter((i) => i.name?.toLowerCase()?.includes(searchTxt?.toLowerCase()))
            setActivities(sortData(result, selectedData, "name"))
          } else {
            result = result.concat(activitiesData)
            setActivities(sortData(result, selectedData, "name"))
          }
          setPaginatedActivities(
            sortData(result, selectedData, "name").slice(page * rowCount, page * rowCount + rowCount)
          )
          setPage(page)
          setRowCount(rowCount)
          setLoading(false)
        }
      })
    } else {
      setActivities([])
    }
    setSelectedActivities([])
  }

  const handleSearchData = (val: string) => {
    setSearch(val)
    searchActivities(val)
  }

  const handleChangePage = (page: number, rowCount: number) => {
    setLoading(true)
    console.log(page, rowCount)
    setRowCount(rowCount)
    setPage(page)
    localStorage.setItem("activities", JSON.stringify({ page: page, rowCount: rowCount }))
    const selectedData = selected.filter((o) => studies.some(({ name }) => o === name))
    setPaginatedActivities(
      sortData(activities, selectedData, "name").slice(page * rowCount, page * rowCount + rowCount)
    )
    setLoading(false)
  }

  return (
    <React.Fragment>
      <Backdrop className={classes.backdrop} open={loading || activities === null}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Header
        studies={studies}
        researcher={researcher}
        activities={allActivities}
        selectedActivities={selectedActivities}
        searchData={handleSearchData}
        selectedStudies={selected}
        setSelectedStudies={setSelectedStudies}
        setActivities={searchActivities}
        setOrder={setOrder}
        order={order}
      />
      <Box className={classes.tableContainer} py={4}>
        <Grid container spacing={3}>
          {!!activities && activities.length > 0 ? (
            <Grid container spacing={3}>
              {paginatedActivities.map((activity) => (
                <Grid item lg={6} xs={12} key={activity.id}>
                  <ActivityItem
                    activity={activity}
                    researcher={researcher}
                    studies={studies}
                    activities={allActivities}
                    handleSelectionChange={handleChange}
                    selectedActivities={selectedActivities}
                    setActivities={searchActivities}
                    updateActivities={setActivities}
                  />
                </Grid>
              ))}
              <Pagination
                data={activities}
                updatePage={handleChangePage}
                rowPerPage={[20, 40, 60, 80]}
                currentPage={page}
                currentRowCount={rowCount}
                dataHead="activities"
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
