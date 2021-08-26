import React, { useState } from "react"
import StudyFilter from "../ParticipantList/StudyFilter"
import AddSensor from "./AddSensor"
import { Box, Typography, makeStyles, Theme, createStyles } from "@material-ui/core"
import DeleteSensor from "./DeleteSensor"
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
  studies,
  researcher,
  selectedSensors,
  searchData,
  setSelectedStudies,
  selectedStudies,
  setSensors,
  setChangeCount,
  userType,
  ...props
}: {
  studies?: Array<Object>
  researcher?: Object
  selectedSensors?: Array<Object>
  searchData?: Function
  setSelectedStudies?: Function
  selectedStudies: Array<string>
  setSensors?: Function
  setChangeCount?: Function
  userType?: string
}) {
  const classes = useStyles()
  const [showFilterStudies, setShowFilterStudies] = useState(false)
  const [updateCount, setUpdateCount] = useState(0)
  const { t } = useTranslation()

  const handleShowFilterStudies = (data) => {
    setShowFilterStudies(data)
  }

  return (
    <Box>
      <Box display="flex" className={classes.header}>
        <Box flexGrow={1} pt={1}>
          <Typography variant="h5">{t("Sensors")}</Typography>
        </Box>
        {userType === "researcher" && (
          <Box>
            <StudyFilter setShowFilterStudies={handleShowFilterStudies} />
          </Box>
        )}
        <SearchBox searchData={searchData} />
        <Box>
          <AddSensor studies={studies} setSensors={setSensors} setUpdateCount={setUpdateCount} />
        </Box>
      </Box>
      {showFilterStudies && (
        <Box>
          <StudyFilterList
            studies={studies}
            researcher={researcher}
            type="sensors"
            showFilterStudies={showFilterStudies}
            selectedStudies={selectedStudies}
            setSelectedStudies={setSelectedStudies}
            updateCount={updateCount}
            setUpdateCount={setUpdateCount}
          />
        </Box>
      )}
      {(selectedSensors || []).length > 0 && (
        <Box className={classes.optionsMain}>
          <Box className={classes.optionsSub}>
            <DeleteSensor sensors={selectedSensors} setSensors={setSensors} setUpdateCount={setUpdateCount} />
          </Box>
        </Box>
      )}
    </Box>
  )
}
