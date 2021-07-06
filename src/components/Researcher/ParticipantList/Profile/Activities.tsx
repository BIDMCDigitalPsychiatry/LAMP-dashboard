import React, { useState, useEffect } from "react"
import { Box, Typography, Grid, makeStyles, createStyles } from "@material-ui/core"
import { useTranslation } from "react-i18next"
import AddActivity from "../../ActivityList/AddActivity"
import { Service } from "../../../DBService/DBService"
import ActivityRow from "./ActivityRow"
import addActivity from "../../ActivityList/Activity"
import DeleteActivity from "../../ActivityList/DeleteActivity"
import { sortData } from "../../Dashboard"
import Pagination from "../../../PaginatedElement"

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      alignItems: "center",
      justifyContent: "center",
    },
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
export default function PatientProfile({
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
  const [activities, setActivities] = useState([])
  const { t } = useTranslation()
  const [selectedActivities, setSelectedActivities] = useState([])
  const [paginatedActivities, setPaginatedActivities] = useState([])
  const [rowCount, setRowCount] = useState(10)
  const [page, setPage] = useState(0)

  useEffect(() => {
    onChangeActivities()
  }, [])

  const onChangeActivities = () => {
    ;(async () => {
      Service.getDataByKey("activities", [participant.study_name], "study_name").then((activities) => {
        let result = sortData(activities, [participant.study_name], "id")
        setActivities(result)
        setPaginatedActivities(result.slice(page, rowCount))
      })
    })()
    setSelectedActivities([])
  }

  const handleActivitySelected = (activity, checked) => {
    if (!!checked) {
      setSelectedActivities((prevState) => [...prevState, activity])
    } else {
      let selected = selectedActivities
      selected = selected.filter((item) => item.id != activity.id)
      setSelectedActivities(selected)
    }
  }

  const handleChangePage = (page: number, rowCount: number) => {
    setRowCount(rowCount)
    setPage(page)
    setPaginatedActivities(activities.slice(page * rowCount, page * rowCount + rowCount))
  }

  return (
    <Box width={1}>
      <Box display="flex" width={1} mt={5}>
        <Box flexGrow={1}>
          <Typography className={classes.sectionTitle} style={{ marginBottom: 34 }}>
            {t("Activities")}
          </Typography>
        </Box>
        <Box className={classes.secAdd}>
          <AddActivity
            activities={activities}
            studies={studies}
            studyId={participant.study_id}
            setActivities={onChangeActivities}
            setUpdateCount={setUpdateCount}
          />
        </Box>
      </Box>
      {(selectedActivities || []).length > 0 && (
        <Box className={classes.optionsMain}>
          <DeleteActivity
            activities={selectedActivities}
            setActivities={onChangeActivities}
            setUpdateCount={setUpdateCount}
            profile={true}
          />
        </Box>
      )}
      <Grid container spacing={0}>
        <Grid item xs={12} sm={12}>
          <Box p={1}>
            {(activities ?? []).length > 0 ? (
              <Grid container>
                <Grid item className={classes.w45}></Grid>
                <Grid item xs>
                  <Typography className={classes.contentText} style={{ flex: 1 }}>
                    {t("Name")}
                  </Typography>
                </Grid>
                <Grid item xs>
                  <Typography className={classes.contentText} style={{ flex: 1 }}>
                    {t("Type")}
                  </Typography>
                </Grid>
                <Grid item xs>
                  <Typography className={classes.contentText} style={{ flex: 1 }}>
                    {t("Schedule")}
                  </Typography>
                </Grid>
                <Grid item className={classes.w120}></Grid>
              </Grid>
            ) : (
              t("No Activities")
            )}
          </Box>
          <Grid container>
            {(paginatedActivities ?? []).map((item, index) => (
              <Grid item xs={12} sm={12} key={item.id}>
                <ActivityRow
                  activities={activities}
                  activity={item}
                  studies={studies}
                  index={index}
                  handleSelected={handleActivitySelected}
                  setActivities={setSelectedActivities}
                />
              </Grid>
            ))}
            <Pagination data={activities} updatePage={handleChangePage} defaultCount={10} />
          </Grid>
        </Grid>
        <Grid item xs={10} sm={2} />
      </Grid>
    </Box>
  )
}
