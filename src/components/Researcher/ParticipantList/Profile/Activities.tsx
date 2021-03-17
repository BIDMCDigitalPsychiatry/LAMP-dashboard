import React, { useState, useEffect } from "react"
import { Box, Typography, Grid } from "@material-ui/core"
import { makeStyles, createStyles } from "@material-ui/core/styles"
import { useTranslation } from "react-i18next"
import AddActivity from "../../ActivityList/AddActivity"
import { Service } from "../../../DBService/DBService"
import ActivityRow from "./ActivityRow"
import addActivity from "../../ActivityList/Activity"
import DeleteActivity from "../../ActivityList/DeleteActivity"
import { sortData } from "../../Dashboard"

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
export default function PatientProfile({ participant, studies, ...props }: { participant: any; studies: any }) {
  const classes = useStyles()
  const [activities, setActivities] = useState([])
  const { t } = useTranslation()
  const [selectedActivities, setSelectedActivities] = useState([])

  const onChangeActivities = () => {
    ;(async () => {
      Service.getDataByKey("activities", [participant.study_name], "study_name").then((activities) => {
        setActivities(sortData(activities, [participant.study_name], "id"))
      })
    })()
    setSelectedActivities([])
  }

  const addedActivity = (data) => {
    addActivity(data)
    setActivities((prevState) => [...prevState, data])
  }

  useEffect(() => {
    onChangeActivities()
  }, [])

  const handleActivitySelected = (activity, checked) => {
    if (!!checked) {
      setSelectedActivities((prevState) => [...prevState, activity])
    } else {
      let selected = selectedActivities
      selected = selected.filter((item) => item.id != activity.id)
      setSelectedActivities(selected)
    }
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
          />
        </Box>
      </Box>
      {selectedActivities.length > 0 && (
        <Box className={classes.optionsMain}>
          <DeleteActivity activities={selectedActivities} setActivities={onChangeActivities} />
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
                    NAME
                  </Typography>
                </Grid>
                <Grid item xs>
                  <Typography className={classes.contentText} style={{ flex: 1 }}>
                    Type
                  </Typography>
                </Grid>
                <Grid item xs>
                  <Typography className={classes.contentText} style={{ flex: 1 }}>
                    SCHEDULE
                  </Typography>
                </Grid>
                <Grid item className={classes.w120}></Grid>
              </Grid>
            ) : (
              "No activities"
            )}
          </Box>
          {(activities ?? []).map((item, index) => {
            return (
              <ActivityRow
                activities={activities}
                activity={item}
                studies={studies}
                index={index}
                handleSelected={handleActivitySelected}
                setActivities={onChangeActivities}
              />
            )
          })}
        </Grid>
        <Grid item xs={10} sm={2} />
      </Grid>
    </Box>
  )
}
