import React, { useState } from "react"
import { Box, Typography, makeStyles, Theme, createStyles, Fab } from "@material-ui/core"
import SearchBox from "../SearchBox"

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
    btnWhite: {
      background: "#fff",
      borderRadius: "40px",
      boxShadow: "none",
      cursor: "pointer",
      textTransform: "capitalize",
      fontSize: "14px",
      color: "#7599FF",
      "& svg": { marginRight: 8 },
      "&:hover": { color: "#5680f9", background: "#fff", boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.20)" },
    },
  })
)
export default function Header({ researchers, searchData, ...props }) {
  const classes = useStyles()
  const [showFilterStudies, setShowFilterStudies] = useState(false)
  const [updateCount, updateStudyCount] = useState(0)

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
          <Typography variant="h5">Researchers</Typography>
        </Box>
        <SearchBox searchData={searchData} />
        <Box>
          <Fab
            size="small"
            classes={{ root: classes.btnWhite }}
            onClick={() => {
              history.push(`/researcher/${researcher.id}`)
            }}
          >
            <Icon>arrow_forward</Icon>
          </Fab>
        </Box>
      </Box>
    </Box>
  )
}
