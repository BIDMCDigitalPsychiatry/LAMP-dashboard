import React, { useState } from "react"
import { Box, Typography, makeStyles, Theme, createStyles, Fab, Icon } from "@material-ui/core"
import StudyFilter from "../ParticipantList/StudyFilter"
import DeleteParticipant from "./DeleteParticipant"
import AddButton from "./AddButton"
import StudyFilterList from "../ParticipantList/StudyFilterList"
import { useTranslation } from "react-i18next"
import SearchBox from "../../SearchBox"
import AddUser from "./AddUser"

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
    btnBlue: {
      background: "#7599FF",
      borderRadius: "40px",
      minWidth: 100,
      boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.20)",
      lineHeight: "38px",
      cursor: "pointer",
      textTransform: "capitalize",
      fontSize: "16px",
      color: "#fff",
      "& svg": { marginRight: 8 },
      "&:hover": { background: "#5680f9" },
      [theme.breakpoints.up("md")]: {
        position: "absolute",
      },
      [theme.breakpoints.down("sm")]: {
        minWidth: "auto",
      },
    },
    optionsSub: { width: 1030, maxWidth: "80%", margin: "0 auto", padding: "10px 0" },
    popexpand: {
      backgroundColor: "#fff",
      color: "#618EF7",
      zIndex: 11111,
      "& path": { fill: "#618EF7" },
      "&:hover": { backgroundColor: "#f3f3f3" },
    },
    addText: {
      [theme.breakpoints.down("sm")]: {
        display: "none",
      },
    },
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
  userType,
  ...props
}) {
  const classes = useStyles()
  const { t } = useTranslation()
  const [showFilterStudies, setShowFilterStudies] = useState(false)
  const [updateCount, setUpdateCount] = useState(0)
  const [addUser, setAddUser] = useState(false)

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
        {userType === "researcher" && (
          <Box>
            <StudyFilter setShowFilterStudies={handleShowFilterStudies} />
          </Box>
        )}
        <SearchBox searchData={searchData} />
        <Box>
          <AddButton
            researcher={researcher}
            studies={studies}
            setUpdateCount={setUpdateCount}
            setParticipants={setParticipants}
            newStudyObj={handleNewStudyObj}
            userType={userType}
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
      {(selectedParticipants || []).length > 0 && (
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
