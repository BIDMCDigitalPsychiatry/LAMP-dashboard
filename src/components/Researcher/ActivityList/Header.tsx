import React, { useState } from "react"
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
  })
)
export default function Header({
  researcher,
  activities,
  studies,
  selectedActivities,
  searchData,
  setSelectedStudies,
  selectedStudies,
  setActivities,
  userType,
  ...props
}) {
  const classes = useStyles()
  const [showFilterStudies, setShowFilterStudies] = useState(false)
  const [updateCount, updateStudyCount] = useState(0)
  const { t } = useTranslation()

  const setUpdateCount = (type: number) => {
    updateStudyCount(type)
  }

  const handleShowFilterStudies = (data) => {
    setShowFilterStudies(data)
  }

  return (
    <Box>
      <Box display="flex" className={classes.header}>
        <Box flexGrow={1} pt={1}>
          <Typography variant="h5">{t("Activities")}</Typography>
        </Box>
        {userType === "researcher" && (
          <Box>
            <StudyFilter setShowFilterStudies={handleShowFilterStudies} />
          </Box>
        )}
        <SearchBox searchData={searchData} />
        <Box>
          <AddActivity
            activities={activities}
            studies={studies}
            studyId={null}
            setUpdateCount={setUpdateCount}
            setActivities={setActivities}
          />
        </Box>
      </Box>
      <Box>
        <StudyFilterList
          studies={studies}
          researcher={researcher}
          type="activities"
          showFilterStudies={showFilterStudies}
          selectedStudies={selectedStudies}
          setSelectedStudies={setSelectedStudies}
          updateCount={updateCount}
          setUpdateCount={setUpdateCount}
        />
      </Box>
      {(selectedActivities || []).length > 0 && (
        <Box className={classes.optionsMain}>
          <Box className={classes.optionsSub}>
            <ExportActivity activities={selectedActivities} />
            <DeleteActivity
              activities={selectedActivities}
              setActivities={setActivities}
              setUpdateCount={setUpdateCount}
            />
          </Box>
        </Box>
      )}
    </Box>
  )
}
