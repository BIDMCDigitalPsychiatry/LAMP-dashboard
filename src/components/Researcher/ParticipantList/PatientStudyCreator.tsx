// Core Imports
import React, { useState, useEffect } from "react"
import {
  Box,
  IconButton,
  Button,
  Icon,
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
  makeStyles,
} from "@material-ui/core"
import { useSnackbar } from "notistack"
import LAMP, { Study } from "lamp-core"
import { useTranslation } from "react-i18next"
import { Service } from "../../DBService/DBService"
import { fetchPostData, fetchResult } from "../SaveResearcherData"
import { updateActivityData, addActivity } from "../ActivityList/ActivityMethods"
import NewPatientDetail from "./NewPatientDetail"

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
  const [duplicateStudyName, setDuplicateStudyName] = useState<any>("")
  const [createPatient, setCreatePatient] = useState(false)
  const [loading, setLoading] = useState(false)
  const [newId, setNewId] = useState(null)

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

  const createNewStudy = (studyName) => {
    let lampAuthId = LAMP.Auth._auth.id
    if (LAMP.Auth._type === "researcher" && lampAuthId === "researcher@demo.lamp.digital") {
      createDemoStudy(studyName)
    } else {
      createStudy(studyName)
    }
  }

  const createDemoStudy = (studyName) => {
    let shouldAddParticipant = createPatient ?? false
    setLoading(true)
    let newStudyObj: any = {}
    let study = new Study()
    study.name = studyName

    LAMP.Study.create(researcher.id, study).then(async (res) => {
      let result = JSON.parse(JSON.stringify(res))
      if (!!result.error) {
        enqueueSnackbar(t("Encountered an error: ") + result?.error, {
          variant: "error",
        })
      } else {
        Service.getData("studies", duplicateStudyName).then((studyData) => {
          let studyId = result.data
          let studiesData = {
            id: result.data,
            name: studyName,
            participant_count: 0,
            activity_count: duplicateStudyName ? studyData.activity_count : 0,
            sensor_count: duplicateStudyName ? studyData.sensor_count : 0,
          }
          Service.addData("studies", [studiesData])
          if (duplicateStudyName) {
            Service.getDataByKey("activities", [duplicateStudyName], "study_id").then((activityData) => {
              let newActivities = activityData
              newActivities.map((activity) => {
                ;(async () => {
                  activity.studyID = studyId
                  let result = await updateActivityData(activity, true, null)
                  if (result.data) {
                    delete activity["studyID"]
                    activity["id"] = result.data
                    activity.study_id = studyId
                    activity.study_name = studyName
                    addActivity(activity, studies)
                  }
                })()
              })
            })
            Service.getDataByKey("sensors", [duplicateStudyName], "study_id").then((SensorData) => {
              let newSensors = SensorData
              newSensors.map((sensor) => {
                ;(async () => {
                  sensor.studyID = studyId
                  await LAMP.Sensor.create(studyId, sensor).then((res) => {
                    let result = JSON.parse(JSON.stringify(res))
                    delete sensor["studyID"]
                    sensor.study_id = studyId
                    sensor.study_name = studyName
                    sensor.id = result.data
                    Service.addData("sensors", [sensor])
                  })
                })()
              })
            })
          }

          if (shouldAddParticipant) {
            ;(async () => {
              let idData = ((await LAMP.Participant.create(studyId, { study_code: "001" } as any)) as any).data
              let id = typeof idData === "object" ? idData.id : idData
              let newParticipant: any = {}
              if (typeof idData === "object") {
                newParticipant = idData
              } else {
                newParticipant["id"] = idData
              }
              Service.updateCount("studies", newStudyObj.id, "participant_count")
              newParticipant.id = "U" + Math.random().toString().substring(2, 11)
              newParticipant.study_id = newStudyObj.id
              newParticipant.study_name = studyName
              Service.addData("participants", [newParticipant])
            })()
          }
        })
      }
    })
    setLoading(false)
    handleNewStudy(newStudyObj)
    closePopUp(1)
  }

  const createStudy = async (studyName: string) => {
    setLoading(true)
    let authId = researcher.id
    let authString = LAMP.Auth._auth.id + ":" + LAMP.Auth._auth.password
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
            participant_count: 0,
            activity_count: studyAllData.length > 0 ? studyAllData[0].activity_count : 0,
            sensor_count: studyAllData.length > 0 ? studyAllData[0].sensor_count : 0,
          }
          Service.addData("studies", [newStudyData])
          fetchResult(authString, authId, "activity" + newUriStudyID, "researcher").then((result) => {
            let filteredActivities = (result?.activities || []).filter(
              (eachActivities) => eachActivities.study_id === newStudyId
            )
            saveStudyData(filteredActivities, "activities")
          })

          fetchResult(authString, authId, "sensor" + newUriStudyID, "researcher").then((resultData) => {
            let filteredSensors = (resultData?.sensors || []).filter((eachSensors) => {
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
                if (filteredParticipants.length > 0) {
                  filteredParticipants[0].name = studyName
                  setNewId(filteredParticipants[0]?.id)
                  LAMP.Type.setAttachment(filteredParticipants[0]?.id, "me", "lamp.name", studyName ?? null)
                  saveStudyData(filteredParticipants, "participants")
                }
              }
              setLoading(false)
            })
            updatedNewStudy.participant_count = 1
          } else {
            setLoading(false)
          }
          closePopUp(1)
          handleNewStudy(updatedNewStudy)
        })
      } else {
        let newStudyData = {
          id: studyData.data,
          name: studyName,
          participant_count: 0,
          activity_count: 0,
          sensor_count: 0,
        }
        if (createPatient) {
          fetchResult(authString, authId, "participant" + newUriStudyID, "researcher").then((results) => {
            if (results.studies[0].participants.length > 0) {
              let filteredParticipants = results.studies[0].participants.filter(
                (eachParticipant) => eachParticipant.study_id === newStudyId
              )
              if (filteredParticipants.length > 0) {
                filteredParticipants[0].name = studyName
                setNewId(filteredParticipants[0]?.id)
                LAMP.Type.setAttachment(filteredParticipants[0]?.id, "me", "lamp.name", studyName ?? null)
                saveStudyData(filteredParticipants, "participants")
              }
            }
            newStudyData.participant_count = 1
            setLoading(false)
            Service.addData("studies", [newStudyData])
            handleNewStudy(newStudyData)
            closePopUp(1)
          })
        } else {
          setLoading(false)
          Service.addData("studies", [newStudyData])
          handleNewStudy(newStudyData)
          closePopUp(1)
        }
      }
    })
  }

  return (
    <React.Fragment>
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
        <DialogTitle id="alert-dialog-slide-title" disableTypography>
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
            <Icon>close</Icon>
          </IconButton>
        </DialogTitle>
        <DialogContent dividers={false} classes={{ root: classes.activityContent }}>
          <Box mb={2}>
            <TextField
              error={!validate()}
              autoFocus
              fullWidth
              variant="outlined"
              label={t("Study Name")}
              value={studyName}
              onChange={(e) => {
                setStudyName(e.target.value)
              }}
              inputProps={{ maxLength: 80 }}
              helperText={
                duplicateCnt > 0 ? t("Unique study name required") : !validate() ? t("Please enter study name.") : ""
              }
            />
          </Box>
          <Box>
            <TextField
              select
              autoFocus
              fullWidth
              variant="outlined"
              label={t("Duplicate from")}
              value={duplicateStudyName}
              onChange={(e) => {
                setDuplicateStudyName(e.target.value)
              }}
              inputProps={{ maxLength: 80 }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {(studies || []).map((study) => (
                <MenuItem key={study.id} value={study.id}>
                  {study.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box ml={-1}>
            <Checkbox
              checked={createPatient}
              onChange={(event) => {
                setCreatePatient(event.target.checked)
              }}
              classes={{ checked: classes.checkboxActive }}
              inputProps={{ "aria-label": "primary checkbox" }}
            />
            {t("Create a new patient under this study")}
          </Box>
          {!!createPatient && (
            <Typography variant="caption">{t("Study name and patient name will be same.")}</Typography>
          )}
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
                createNewStudy(studyName)
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
      {!!newId && <NewPatientDetail id={newId} />}
    </React.Fragment>
  )
}
