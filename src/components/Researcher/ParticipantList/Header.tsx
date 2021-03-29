import React, { useState } from "react"
import { Box, Typography, makeStyles, Theme, createStyles } from "@material-ui/core"
import StudyFilter from "../ParticipantList/StudyFilter"
import DeleteParticipant from "./DeleteParticipant"
import AddButton from "./AddButton"
import StudyFilterList from "../ParticipantList/StudyFilterList"
import { useTranslation } from "react-i18next"
import SearchBox from "../../SearchBox"

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
  selectedParticipants,
  searchData,
  setSelectedStudies,
  selectedStudies,
  setParticipants,
  newStudyObj,
  ...props
}) {
  const classes = useStyles()
  const { t } = useTranslation()
  const [showFilterStudies, setShowFilterStudies] = useState(false)
  const [updateCount, setUpdateCount] = useState(0)

  const handleShowFilterStudies = (status) => {
    setShowFilterStudies(status)
  }

  const handleNewStudyObj = (data) => {
    newStudyObj(data)
  }

  return (
    <Box>
      <Box display="flex" className={classes.header}>
        <Box flexGrow={1} pt={1}>
          <Typography variant="h5">{t("Users")}</Typography>
        </Box>
        <Box>
          <StudyFilter setShowFilterStudies={handleShowFilterStudies} />
        </Box>
        <SearchBox searchData={searchData} />
        <Box>
          <AddButton
            researcher={researcher}
            studies={studies}
            setUpdateCount={setUpdateCount}
            setParticipants={setParticipants}
            newStudyObj={handleNewStudyObj}
          />
        </Box>
      </Box>
      {!!showFilterStudies && (
        <Box>
          <StudyFilterList
            studies={studies}
            researcher={researcher}
            type="participants"
            showFilterStudies={showFilterStudies}
            selectedStudies={selectedStudies}
            setSelectedStudies={setSelectedStudies}
            updateCount={updateCount}
            setUpdateCount={setUpdateCount}
          />
        </Box>
      )}
      {selectedParticipants.length > 0 && (
        <Box className={classes.optionsMain}>
          <Box className={classes.optionsSub}>
            <DeleteParticipant
              participants={selectedParticipants}
              setParticipants={setParticipants}
              setUpdateCount={setUpdateCount}
            />
          </Box>
        </Box>
      )}
    </Box>
  )
}
