import React, { useState, useEffect } from "react"
import { Box, Grid, Backdrop, CircularProgress, Icon, makeStyles, Theme, createStyles } from "@material-ui/core"
import { Service } from "../../DBService/DBService"
import LAMP from "lamp-core"
import { useTranslation } from "react-i18next"
import ActivityItem from "./ActivityItem"
import Header from "./Header"
import { sortData } from "../Dashboard"
import Pagination from "../../PaginatedElement"

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
]
export const games = [
  "lamp.jewels_a",
  "lamp.jewels_b",
  "lamp.spatial_span",
  "lamp.cats_and_dogs",
  "lamp.pop_the_bubbles",
  "lamp.balloon_risk",
]
export default function ActivityList({ researcher, title, studies, selectedStudies, setSelectedStudies, ...props }) {
  const [activities, setActivities] = useState(null)
  const { t } = useTranslation()
  const classes = useStyles()
  const [selectedActivities, setSelectedActivities] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const [paginatedActivities, setPaginatedActivities] = useState([])
  const [studiesData, setStudiesData] = useState(studies)
  const [selected, setSelected] = useState(selectedStudies)
  const [allActivities, setAllActivities] = useState(null)
  const [rowCount, setRowCount] = useState(40)
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState(null)

  const handleChange = (activity, checked) => {
    if (checked) {
      setSelectedActivities((prevState) => [...prevState, activity])
    } else {
      let selected = selectedActivities.filter((item) => item.id != activity.id)
      setSelectedActivities(selected)
    }
  }

  useEffect(() => {
    refreshStudies()
    Service.getAll("activities").then((data) => {
      setAllActivities(data || [])
    })
  }, [])

  const refreshStudies = () => {
    Service.getAll("studies").then((data) => {
      setStudiesData(data || [])
    })
  }

  useEffect(() => {
    setSelected(selectedStudies)
    if (selectedStudies.length > 0) {
      searchActivities()
    }
  }, [selectedStudies])

  const searchActivities = (searchVal?: string) => {
    const searchTxt = searchVal ?? search
    selectedStudies = selectedStudies.filter((o) => studies.some(({ name }) => o === name))
    if (selectedStudies.length > 0 && !loading) {
      let result = []
      setLoading(true)
      selectedStudies.map((study) => {
        Service.getDataByKey("activities", [study], "study_name").then((activitiesData) => {
          if ((activitiesData || []).length > 0) {
            if (!!searchTxt && searchTxt.trim().length > 0) {
              result = result.concat(activitiesData)
              result = result.filter((i) => i.name.toLowerCase()?.includes(searchTxt.toLowerCase()))
              setActivities(sortData(result, selectedStudies, "name"))
            } else {
              result = result.concat(activitiesData)
              setActivities(sortData(result, selectedStudies, "name"))
            }
            setPaginatedActivities(result.slice(page, rowCount))
          } else {
            if (result.length === 0) setActivities([])
          }
          setLoading(false)
        })
      })
    } else {
      setLoading(false)
    }
    setSelectedActivities([])
  }

  const handleSearchData = (val: string) => {
    setSearch(val)
    searchActivities(val)
  }

  const handleChangePage = (page: number, rowCount: number) => {
    setLoading(true)
    setRowCount(rowCount)
    setPage(page)
    setPaginatedActivities(activities.slice(page * rowCount, page * rowCount + rowCount))
    setLoading(false)
  }

  return (
    <React.Fragment>
      <Backdrop className={classes.backdrop} open={loading || activities === null}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Header
        studies={studiesData}
        researcher={researcher}
        activities={activities}
        selectedActivities={selectedActivities}
        searchData={handleSearchData}
        selectedStudies={selected}
        setSelectedStudies={setSelectedStudies}
        setActivities={searchActivities}
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
                    studies={studiesData}
                    activities={allActivities}
                    handleSelectionChange={handleChange}
                    selectedActivities={selectedActivities}
                    setActivities={searchActivities}
                    updateActivities={setActivities}
                  />
                </Grid>
              ))}
              <Pagination data={activities} updatePage={handleChangePage} rowPerPage={[20, 40, 60, 80]} />
            </Grid>
          ) : (
            <Box display="flex" alignItems="center" className={classes.norecords}>
              <Icon>info</Icon>
              {t("No Records Found")}
            </Box>
          )}
        </Grid>
      </Box>
    </React.Fragment>
  )
}
