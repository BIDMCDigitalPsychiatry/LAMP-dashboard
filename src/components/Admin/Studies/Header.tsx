import React, { useState } from "react"
import { Box, Popover, Fab, Typography, Icon, MenuItem, makeStyles, Theme, createStyles } from "@material-ui/core"
import { useTranslation } from "react-i18next"
import PatientStudyCreator from "../../Researcher/ParticipantList/PatientStudyCreator"
import SearchBox from "../../SearchBox"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      "& h5": {
        fontSize: "30px",
        fontWeight: "bold",
      },
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
    customPopover: { backgroundColor: "rgba(0, 0, 0, 0.4)" },
    customPaper: {
      maxWidth: 380,
      marginTop: 75,
      marginLeft: 100,
      borderRadius: 10,
      padding: "10px 0",
      "& h6": { fontSize: 16 },
      "& li": {
        display: "inline-block",
        width: "100%",
        padding: "15px 30px",
        "&:hover": { backgroundColor: "#ECF4FF" },
      },
      "& *": { cursor: "pointer" },
    },
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
  searchData,
  setUpdateCount,
  setParticipants,
  newStudyObj,
  ...props
}) {
  const classes = useStyles()
  const { t } = useTranslation()
  const [popover, setPopover] = useState(null)
  const [addParticipantStudy, setAddParticipantStudy] = useState(false)

  const handleNewStudyData = (data) => {
    setUpdateCount(1)
    setParticipants()
    newStudyObj(data)
  }

  const handleClosePopUp = (data) => {
    if (data === 1) {
      setAddParticipantStudy(false)
    }
  }

  return (
    <Box>
      <Box display="flex" className={classes.header}>
        <Box flexGrow={1} pt={1}>
          <Typography variant="h5">{t("Studies")}</Typography>
        </Box>
        <Box>
          <SearchBox searchData={searchData} />
        </Box>
        <Box>
          <Fab
            variant="extended"
            color="primary"
            classes={{ root: classes.btnBlue + " " + (!!popover ? classes.popexpand : "") }}
            onClick={(event) => setPopover(event.currentTarget)}
          >
            <Icon>add</Icon> <span className={classes.addText}>{t("Add")}</span>
          </Fab>
        </Box>
        <Popover
          classes={{ root: classes.customPopover, paper: classes.customPaper }}
          open={!!popover ? true : false}
          anchorPosition={!!popover && popover.getBoundingClientRect()}
          anchorReference="anchorPosition"
          onClose={() => setPopover(null)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <React.Fragment>
            <MenuItem
              onClick={() => {
                setPopover(null)
                setAddParticipantStudy(true)
              }}
            >
              <Typography variant="h6">{t("Add a new study")}</Typography>
              <Typography variant="body2">{t("Create a new study.")}</Typography>
            </MenuItem>
          </React.Fragment>
        </Popover>

        <PatientStudyCreator
          studies={studies}
          researcher={researcher}
          onClose={() => setAddParticipantStudy(false)}
          open={addParticipantStudy}
          handleNewStudy={handleNewStudyData}
          closePopUp={handleClosePopUp}
        />
      </Box>
    </Box>
  )
}
