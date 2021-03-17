// Core Imports
import React, { useState, useEffect } from "react"
import {
  Box,
  IconButton,
  Button,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  DialogProps,
  Backdrop,
  CircularProgress,
  Typography,
} from "@material-ui/core"

import { useSnackbar } from "notistack"
import CloseIcon from "@material-ui/icons/Close"
import LAMP, { Study } from "lamp-core"
import { makeStyles } from "@material-ui/core/styles"
import { useTranslation } from "react-i18next"
import { Service } from "../../DBService/DBService"
import { fetchPostData, fetchResult } from "../SaveResearcherData"

const useStyles = makeStyles((theme) => ({
  dataQuality: {
    margin: "4px 0",
    backgroundColor: "#E9F8E7",
    color: "#FFF",
  },
  switchLabel: { color: "#4C66D6" },
  activityContent: {
    padding: "15px 25px 0",
  },
  backdrop: {
    zIndex: 111111,
    color: "#fff",
  },
  addNewDialog: {
    maxWidth: 500,
    [theme.breakpoints.up("sm")]: {
      maxWidth: "auto",
      minWidth: 400,
    },
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  checkboxActive: { color: "#7599FF !important" },
}))

export default function PatientStudyCreator({
  studies,
  researcher,
  handleNewStudy,
  closePopUp,
  ...props
}: {
  studies: any
  researcher: any
  handleNewStudy: Function
  closePopUp: Function
} & DialogProps) {
  const [studyName, setStudyName] = useState("")
  const classes = useStyles()
  const [duplicateCnt, setDuplicateCnt] = useState(0)
  const { t, i18n } = useTranslation()
  const { enqueueSnackbar } = useSnackbar()
  const [addStudy, setAddStudy] = useState(false)
  const [duplicateStudyName, setDuplicateStudyName] = useState<any>("")
  const [createPatient, setCreatePatient] = useState(false)
  const [studiedData, setStudiedData] = useState(null)
  const [loading, setLoading] = useState(false)

  const validate = () => {
    return !(
      duplicateCnt > 0 ||
      typeof studyName === "undefined" ||
      (typeof studyName !== "undefined" && studyName?.trim() === "")
    )
  }

  const saveStudyData = (result, type) => {
    for (let resultData of result) {
      Service.addData(type, [resultData])
    }
  }

  useEffect(() => {
    let duplicateCount = 0
    if (!(typeof studyName === "undefined" || (typeof studyName !== "undefined" && studyName?.trim() === ""))) {
      duplicateCount = studies.filter((study) => study.name?.trim().toLowerCase() === studyName?.trim().toLowerCase())
        .length
    }
    setDuplicateCnt(duplicateCount)
  }, [studyName])

  const createStudy = async (studyName: string) => {
    setLoading(true)
    setAddStudy(false)
    let auth = await LAMP.Auth
    let authId = auth._me["id"]
    let authUser = auth._auth
    let authString = authUser.id + ":" + authUser.password
    let bodyData = {
      study_id: duplicateStudyName, //old study id
      should_add_participant: createPatient ? createPatient : false,
      name: studyName,
    }

    fetchPostData(authString, authId, "study/clone", "researcher", "POST", bodyData).then((studyData) => {
      let newStudyId = studyData.data
      let newUriStudyID = "?study_id=" + newStudyId

      if (duplicateStudyName) {
        Service.getDataByKey("studies", duplicateStudyName, "id").then((studyAllData: any) => {
          let newStudyData = {
            id: studyData.data,
            name: studyName,
            participants_count: studyAllData.length > 0 ? studyAllData[0].participants_count : 0,
            activity_count: studyAllData.length > 0 ? studyAllData[0].activity_count : 0,
            sensor_count: studyAllData.length > 0 ? studyAllData[0].sensor_count : 0,
          }

          Service.addData("studies", [newStudyData])

          fetchResult(authString, authId, "activity" + newUriStudyID, "researcher").then((result) => {
            let filteredActivities = result.activities.filter(
              (eachActivities) => eachActivities.study_id === duplicateStudyName
            )
            saveStudyData(filteredActivities, "activities")
          })

          fetchResult(authString, authId, "sensor" + newUriStudyID, "researcher").then((resultData) => {
            let filteredSensors = resultData.sensors.filter((eachSensors) => {
              return eachSensors.study_id === newStudyId
            })
            saveStudyData(filteredSensors, "sensors")
          })
          let updatedNewStudy = newStudyData
          if (createPatient) {
            fetchResult(authString, authId, "participant" + newUriStudyID, "researcher").then((results) => {
              if (results.studies[0].participants.length > 0) {
                let filteredParticipants = results.studies[0].participants.filter(
                  (eachParticipant) => eachParticipant.study_id === newStudyId
                )
                saveStudyData(filteredParticipants, "participants")
              }
              setLoading(false)
            })
            updatedNewStudy.participants_count = 1
          } else {
            setLoading(false)
          }
          closePopUp(1)
          handleNewStudy(updatedNewStudy)
        })
      } else {
        if (createPatient) {
          fetchResult(authString, authId, "participant" + newUriStudyID, "researcher").then((results) => {
            if (results.studies[0].participants.length > 0) {
              let filteredParticipants = results.studies[0].participants.filter(
                (eachParticipant) => eachParticipant.study_id === newStudyId
              )
              saveStudyData(filteredParticipants, "participants")
            }
            setLoading(false)
            closePopUp(1)
          })
        }
      }
    })
  }

  return (
    <Dialog
      {...props}
      onEnter={() => {
        setStudyName("")
        setDuplicateStudyName("")
        setCreatePatient(false)
      }}
      scroll="paper"
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
      classes={{ paper: classes.addNewDialog }}
    >
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <DialogTitle id="alert-dialog-slide-title">
        <Typography variant="h6">{t("Create a new study.")}</Typography>
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={() => {
            closePopUp(1)
            setStudyName("")
            setDuplicateStudyName("")
            setCreatePatient(false)
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers={false} classes={{ root: classes.activityContent }}>
        <Box mb={2}>
          <TextField
            error={!validate()}
            autoFocus
            fullWidth
            variant="outlined"
            label={t("Name")}
            value={studyName}
            onChange={(e) => {
              setStudyName(e.target.value)
            }}
            inputProps={{ maxLength: 80 }}
            helperText={duplicateCnt > 0 ? t("Unique name required") : !validate() ? t("Please enter name.") : ""}
          />
        </Box>
        <Box>
          <TextField
            select
            autoFocus
            fullWidth
            variant="outlined"
            label={t("Duplicate Study")}
            value={duplicateStudyName}
            onChange={(e) => {
              setDuplicateStudyName(e.target.value)
            }}
            inputProps={{ maxLength: 80 }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {studies.map((study) => (
              <MenuItem key={study.id} value={study.id}>
                {study.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box ml={-1}>
          <Checkbox
            checked={createPatient}
            onChange={(event) => setCreatePatient(true)}
            classes={{ checked: classes.checkboxActive }}
            inputProps={{ "aria-label": "primary checkbox" }}
          />{" "}
          {t("Create a new patient under this study")}
        </Box>
      </DialogContent>

      <DialogActions>
        <Box textAlign="right" width={1} mt={1} mb={3} mx={3}>
          <Button
            color="primary"
            onClick={() => {
              closePopUp(1)
              setCreatePatient(false)
            }}
          >
            {t("Cancel")}
          </Button>
          <Button
            onClick={() => {
              createStudy(studyName)
            }}
            color="primary"
            autoFocus
            disabled={!validate()}
          >
            {t("Confirm")}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}
