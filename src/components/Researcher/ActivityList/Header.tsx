import React, { useEffect, useState } from "react"
import { Box, Typography, makeStyles, Theme, createStyles } from "@material-ui/core"
import AddActivity from "./AddActivity"
import StudyFilter from "../ParticipantList/StudyFilter"
import ExportActivity from "./ExportActivity"
import DeleteActivity from "./DeleteActivity"
import StudyFilterList from "../ParticipantList/StudyFilterList"
import SearchBox from "../../SearchBox"
import { useTranslation } from "react-i18next"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      "& h5": {
        fontSize: "30px",
        fontWeight: "bold",
      },
    },
    optionsMain: {
      background: "#ECF4FF",
      borderTop: "1px solid #C7C7C7",

      marginTop: 20,
      width: "99.4vw",
      position: "relative",
      left: "50%",
      right: "50%",
      marginLeft: "-50vw",
      marginRight: "-50vw",
    },
    optionsSub: { width: 1030, maxWidth: "80%", margin: "0 auto", padding: "10px 0" },
    showFeed: { marginTop: "10px" },
    exportingText: {
      background: "#078637",
      color: "#fff",
      padding: "5px 16px",
      borderRadius: "16px",
      marginLeft: "15px",
      fontSize: "12px",
    },
  })
)
export default function Header({
  researcherId,
  activities,
  studies,
  selectedActivities,
  searchData,
  setSelectedStudies,
  selectedStudies,
  setActivities,
  setOrder,
  order,
  activityByStudy,
  setSelectedActivities,
  ...props
}) {
  const classes = useStyles()
  const [showFilterStudies, setShowFilterStudies] = useState(false)
  const { t } = useTranslation()
  const handleShowFilterStudies = (data) => {
    setShowFilterStudies(data)
  }
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const check = () => {
      const present = !!localStorage.getItem("exportInProgress")
      setLoading(present)
    }
    const onStorage = (e: StorageEvent) => {
      if (e.key === "exportInProgress") check()
    }
    const onExportRemoved = () => {
      setSelectedActivities([])
      setLoading(false)
    }
    window.addEventListener("storage", onStorage)
    window.addEventListener("exportInProgressRemoved", onExportRemoved)
    const intervalId = window.setInterval(check, 1000)
    return () => {
      window.removeEventListener("storage", onStorage)
      window.removeEventListener("exportInProgressRemoved", onExportRemoved)
      clearInterval(intervalId)
    }
  }, [])

  return (
    <Box>
      <Box display="flex" className={classes.header}>
        <Box flexGrow={1} pt={1}>
          <Typography variant="h5">{`${t("Activities")}`}</Typography>
        </Box>
        <Box>
          <StudyFilter setShowFilterStudies={handleShowFilterStudies} setOrder={setOrder} order={order} />
        </Box>
        <SearchBox searchData={searchData} />
        <Box>
          <AddActivity
            activities={activities}
            studies={studies}
            studyId={null}
            setActivities={setActivities}
            researcherId={researcherId}
          />
        </Box>
      </Box>

      <Box>
        <StudyFilterList
          studies={studies}
          researcherId={researcherId}
          type="activities"
          showFilterStudies={showFilterStudies}
          selectedStudies={selectedStudies}
          setSelectedStudies={setSelectedStudies}
          filterData={activityByStudy}
        />
      </Box>
      {((selectedActivities || [])?.length > 0 || loading) && (
        <Box className={classes.optionsMain}>
          <Box className={classes.optionsSub}>
            <ExportActivity activities={selectedActivities} />
            <DeleteActivity activities={selectedActivities} setActivities={setActivities} />
            {loading && <span className={classes.exportingText}>Exporting...</span>}
          </Box>
        </Box>
      )}
    </Box>
  )
}
