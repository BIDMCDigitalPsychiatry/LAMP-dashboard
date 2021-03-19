import React, { useState, useEffect } from "react"
import { Box, Grid, Backdrop, CircularProgress, Icon } from "@material-ui/core"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
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

export const availableAtiveSpecs = [
  "lamp.group",
  "lamp.suvey",
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
  const [activities, setActivities] = useState([])
  const { t } = useTranslation()
  const classes = useStyles()
  const [selectedActivities, setSelectedActivities] = useState<any>([])
  const [search, setSearch] = useState(null)
  const [loading, setLoading] = useState(false)
  const [paginatedActivities, setPaginatedActivities] = useState([])
  const [studiesData, setStudiesData] = useState(studies)
  const [selected, setSelected] = useState(selectedStudies)

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

  useEffect(() => {
    if (search !== null) searchActivities()
  }, [search])

  const searchActivities = () => {
    selectedStudies = selectedStudies.filter((o) => studies.some(({ name }) => o === name))
    if (selectedStudies.length > 0 && !loading) {
      let result = []
      setLoading(true)
      selectedStudies.map((study) => {
        Service.getDataByKey("activities", [study], "study_name").then((activitiesData) => {
          if ((activitiesData || []).length > 0) {
            if (!!search && search.trim().length > 0) {
              result = result.concat(activitiesData)
              result = result.filter((i) => i.name.toLowerCase()?.includes(search.toLowerCase()))
              setActivities(sortData(result, selectedStudies, "name"))
            } else {
              result = result.concat(activitiesData)
              setActivities(sortData(result, selectedStudies, "name"))
            }
            setPaginatedActivities(result.slice(0, 50))
          }
          setLoading(false)
        })
      })
    } else {
      setLoading(false)
    }
    setSelectedActivities([])
  }
  const handleSearchData = (val) => {
    setSearch(val)
  }
  const handleChangePage = (page: number, rowCount: number) => {
    setLoading(true)
    setPaginatedActivities(activities.slice(page * rowCount, page * rowCount + rowCount))
    setLoading(false)
  }

  return (
    <React.Fragment>
      <Backdrop className={classes.backdrop} open={loading}>
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
                    activities={activities}
                    handleSelectionChange={handleChange}
                    selectedActivities={selectedActivities}
                    setActivities={searchActivities}
                    updateActivities={setActivities}
                  />
                </Grid>
              ))}
              <Pagination data={activities} updatePage={handleChangePage} />
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