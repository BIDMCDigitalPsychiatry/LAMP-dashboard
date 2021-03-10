import React, { useState } from "react"
import { Box, Typography, InputBase } from "@material-ui/core"
import { makeStyles, Theme, createStyles, createMuiTheme } from "@material-ui/core/styles"
import StudyFilter from "../ParticipantList/StudyFilter"
import SearchIcon from "@material-ui/icons/Search"
import DeleteParticipant from "./DeleteParticipant"
import PatientStudyCreator from "../ParticipantList/PatientStudyCreator"
import AddButton from "./AddButton"
import StudyFilterList from "../ParticipantList/StudyFilterList"

const theme = createMuiTheme({
  palette: {
    secondary: {
      main: "#333",
    },
  },
  overrides: {
    MuiTableCell: {
      root: {
        borderBottom: "#fff solid 1px",
        padding: 10,
      },
    },
    MuiToolbar: {
      root: {
        maxWidth: 1055,
        width: "80%",
        margin: "0 auto",
        background: "#fff !important",
      },
    },
    MuiInput: {
      root: {
        border: 0,
      },
      underline: {
        "&&&:before": {
          borderBottom: "none",
        },
        "&&:after": {
          borderBottom: "none",
        },
      },
    },
    MuiIcon: {
      root: { color: "rgba(0, 0, 0, 0.4)" },
    },
  },
})

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
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: "100%",
      [theme.breakpoints.up("sm")]: {
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
      [theme.breakpoints.up("md")]: {
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
  studies,
  researcher,
  selectedParticipants,
  searchData,
  filterStudies,
  addedParticipant,
  ...props
}) {
  const classes = useStyles()
  const [search, setSearch] = useState("")
  const [showFilterStudies, setShowFilterStudies] = useState(false)
  const [selectedStudies, setSelectedStudies] = useState([])

  const handleSearchData = (data) => {
    searchData(data)
  }

  const handleShowFilterStudies = (data) => {
    setShowFilterStudies(data)
  }

  const filteredStudyArray = (val) => {
    setSelectedStudies(val)
    filterStudies(val)
  }

  return (
    <Box>
      <Box display="flex" className={classes.header}>
        <Box flexGrow={1} pt={1}>
          <Typography variant="h5">Patients</Typography>
        </Box>

        <Box>
          <StudyFilter
            researcher={researcher}
            studies={studies}
            type="participants"
            showFilterStudies={handleShowFilterStudies}
            filteredStudyArray={filteredStudyArray}
          />
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
          <AddButton researcher={researcher} studies={studies} addedParticipant={addedParticipant} />
        </Box>
      </Box>

      {!!showFilterStudies && (
        <Box>
          <StudyFilterList
            studies={studies}
            researcher={researcher}
            type="participants"
            showFilterStudies={showFilterStudies}
            filteredStudyArray={filteredStudyArray}
            selectedStudies={selectedStudies}
          />
        </Box>
      )}
      {selectedParticipants.length > 0 && (
        <Box className={classes.optionsMain}>
          <Box className={classes.optionsSub}>
            <DeleteParticipant participants={selectedParticipants} />
          </Box>
        </Box>
      )}
    </Box>
  )
}
