import React, { useState, useEffect } from "react"
import { Box, Typography, InputBase } from "@material-ui/core"
import AddActivity from "./AddActivity"
import StudyFilter from "../ParticipantList/StudyFilter"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import SearchIcon from "@material-ui/icons/Search"
import { useSnackbar } from "notistack"
import { useTranslation } from "react-i18next"
import ExportActivity from "./ExportActivity"
import DeleteActivity from "./DeleteActivity"
import StudyFilterList from "../ParticipantList/StudyFilterList"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      "& h5": {
        fontSize: "30px",
        fontWeight: "bold",
      },
    },
    search: {
      position: "relative",
      borderRadius: 50,
      backgroundColor: "#F8F8F8",
      "&:hover": {
        backgroundColor: "#eee",
      },
      marginLeft: 0,
      width: "100%",
      [theme.breakpoints.up("lg")]: {
        width: "450px",
      },
      [theme.breakpoints.down("md")]: {
        width: "300px",
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: "100%",
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    inputRoot: {
      color: "inherit",
    },
    inputInput: {
      padding: "15px 10px",
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("lg")]: {
        width: "20ch",
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
  ...props
}) {
  const classes = useStyles()
  const [search, setSearch] = useState("")
  const [showFilterStudies, setShowFilterStudies] = useState(false)
  const [updateCount, updateStudyCount] = useState(0)

  const handleSearchData = (data) => {
    searchData(data)
  }

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
          <Typography variant="h5">Activities</Typography>
        </Box>

        <Box>
          <StudyFilter setShowFilterStudies={handleShowFilterStudies} />
        </Box>
        <Box>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
              onChange={(e) => {
                setSearch(e.target.value)
                handleSearchData(e.target.value)
              }}
              value={search}
            />
          </div>
        </Box>
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
        />
      </Box>
      {selectedActivities.length > 0 && (
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
