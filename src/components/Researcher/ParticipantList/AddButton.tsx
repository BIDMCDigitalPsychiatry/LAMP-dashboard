import React, { useState, useEffect } from "react"
import {
  Box,
  MenuItem,
  AppBar,
  Toolbar,
  Icon,
  IconButton,
  Divider,
  Grid,
  Fab,
  Typography,
  Popover,
  makeStyles,
  Theme,
  createStyles,
} from "@material-ui/core"
import LAMP from "lamp-core"
import { useTranslation } from "react-i18next"
import AddUser from "./AddUser"
import StudyCreator from "./StudyCreator"
import PatientStudyCreator from "../ParticipantList/PatientStudyCreator"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbardashboard: {
      minHeight: 100,
      padding: "0 10px",
      "& h5": {
        color: "rgba(0, 0, 0, 0.75)",
        textAlign: "left",
        fontWeight: "600",
        fontSize: 30,
        width: "calc(100% - 96px)",
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
    tableContainer: {
      "& div.MuiInput-underline:before": { borderBottom: "0 !important" },
      "& div.MuiInput-underline:after": { borderBottom: "0 !important" },
      "& div.MuiInput-underline": {
        "& span.material-icons": {
          width: 21,
          height: 19,
          fontSize: 27,
          lineHeight: "23PX",
          color: "rgba(0, 0, 0, 0.4)",
        },
        "& button": { display: "none" },
      },
    },
    customPopover: { backgroundColor: "rgba(0, 0, 0, 0.4)" },
    customPaper: {
      maxWidth: 380,
      maxHeight: 600,
      marginTop: 75,
      marginLeft: 100,
      borderRadius: 10,
      padding: "10px 0",
      "& h6": { fontSize: 16 },
      "& li": {
        display: "inline-block",
        width: "100%",
        padding: "8px 30px",
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

export default function AddButton({
  researcher,
  studies,
  setUpdateCount,
  setParticipants,
  newStudyObj,
  userType,
  ...props
}) {
  const [addUser, setAddUser] = useState(false)
  const [addStudy, setAddStudy] = useState(false)
  const { t } = useTranslation()
  const classes = useStyles()
  const [popover, setPopover] = useState(null)
  // const [closePopUp, setClosePopUp] = useState(false)
  const [addParticipantStudy, setAddParticipantStudy] = useState(false)
  const handleNewStudyData = (data) => {
    setUpdateCount(1)
    setParticipants()
    newStudyObj(data)
  }

  const handleClosePopUp = (data) => {
    if (data === 1) {
      setAddParticipantStudy(false)
    } else if (data === 2) {
      setAddStudy(false)
    } else {
      setAddUser(false)
    }
  }

  return (
    <Box>
      <Fab
        variant="extended"
        color="primary"
        classes={{ root: classes.btnBlue + " " + (!!popover ? classes.popexpand : "") }}
        onClick={(event) => setPopover(event.currentTarget)}
      >
        <Icon>add</Icon> <span className={classes.addText}>{t("Add")}</span>
      </Fab>

      <Popover
        classes={{ root: classes.customPopover, paper: classes.customPaper }}
        open={!!popover ? true : false}
        //anchorPosition={!!popover && popover.getBoundingClientRect()}
        anchorPosition={popover ? popover.getBoundingClientRect() : null}
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
              setAddUser(true)
            }}
          >
            <Typography variant="h6">{t("Add a patient")}</Typography>
            <Typography variant="body2">{t("Create a new entry in this group.")}</Typography>
          </MenuItem>
          {userType === "researcher" && (
            <Box>
              <MenuItem
                onClick={() => {
                  setPopover(null)
                  setAddStudy(true)
                }}
              >
                <Typography variant="h6">{t("Add a new study")}</Typography>
                <Typography variant="body2">{t("Create a new study.")}</Typography>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setPopover(null)
                  setAddStudy(false)
                  setAddParticipantStudy(true)
                }}
              >
                <Typography variant="h6">{t("Add a new patient and study.")}</Typography>
                <Typography variant="body2">{t("Create a patient under their own study.")}</Typography>
              </MenuItem>
            </Box>
          )}
        </React.Fragment>
      </Popover>
      <StudyCreator
        studies={studies}
        researcher={researcher}
        open={addStudy}
        onClose={() => setAddStudy(false)}
        handleNewStudy={handleNewStudyData}
        closePopUp={handleClosePopUp}
      />
      <AddUser
        researcher={researcher}
        studies={studies}
        open={addUser}
        onClose={() => setAddUser(false)}
        handleNewStudy={handleNewStudyData}
        setParticipants={setParticipants}
        closePopUp={handleClosePopUp}
        userType={userType}
      />
      <PatientStudyCreator
        studies={studies}
        researcher={researcher}
        onClose={() => setAddParticipantStudy(false)}
        open={addParticipantStudy}
        handleNewStudy={handleNewStudyData}
        closePopUp={handleClosePopUp}
      />
    </Box>
  )
}
