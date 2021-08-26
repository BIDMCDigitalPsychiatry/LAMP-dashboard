import React, { useState, useEffect } from "react"
import {
  Box,
  IconButton,
  Button,
  TextField,
  MenuItem,
  Tooltip,
  Grid,
  Icon,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogProps,
  makeStyles,
  Theme,
  createStyles,
  createMuiTheme,
} from "@material-ui/core"

import { useSnackbar } from "notistack"
import QRCode from "qrcode.react"
import LAMP from "lamp-core"
import SnackMessage from "../../SnackMessage"
import { useTranslation } from "react-i18next"
import { Service } from "../../DBService/DBService"
import NewPatientDetail from "./NewPatientDetail"

const _qrLink = (credID, password) =>
  window.location.href.split("#")[0] +
  "#/?a=" +
  btoa([credID, password, LAMP.Auth._auth.serverAddress].filter((x) => !!x).join(":"))

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    activityContent: {
      padding: "25px 25px 0",
    },
    errorMsg: { color: "#FF0000", fontSize: 12 },
    addNewDialog: {
      maxWidth: 350,
      [theme.breakpoints.up("sm")]: {
        maxWidth: "auto",
        minWidth: 400,
      },
    },
  })
)

export default function AddUser({
  researcher,
  studies,
  setParticipants,
  handleNewStudy,
  closePopUp,
  userType,
  ...props
}: {
  researcher: any
  studies: any
  setParticipants?: Function
  handleNewStudy?: Function
  closePopUp?: Function
  userType?: string
} & DialogProps) {
  const classes = useStyles()
  const [selectedStudy, setSelectedStudy] = useState("")
  const [showErrorMsg, setShowErrorMsg] = useState(false)
  const [studyBtnClicked, setStudyBtnClicked] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation()
  const [newId, setNewId] = useState(null)

  const validate = () => {
    return !(
      typeof selectedStudy === "undefined" ||
      (typeof selectedStudy !== "undefined" && selectedStudy?.trim() === "")
    )
  }
  const handleChangeStudy = (event) => {
    setShowErrorMsg(false)
    setSelectedStudy(event.target.value)
  }

  let createStudy = async () => {
    if (selectedStudy === "") {
      setShowErrorMsg(true)
      return false
    } else {
      setStudyBtnClicked(true)
      addParticipant()
    }
    setSelectedStudy("")
    closePopUp(3)
    props.onClose as any
  }

  const createNewStudy = () => {
    let lampAuthId = LAMP.Auth._auth.id
    if (LAMP.Auth._type === "researcher" && lampAuthId === "researcher@demo.lamp.digital") {
      userType === "clinician" ? addDemoParticipant() : createDemoStudy()
    } else {
      userType === "clinician" ? addParticipant() : createStudy()
      closePopUp(3)
      props.onClose as any
    }
  }

  const addDemoParticipant = () => {
    let newParticipant: any = {}
    newParticipant.id = "U" + Math.random().toString().substring(2, 11)
    newParticipant.study_id = selectedStudy
    let studyName = studies.filter((study) => study.id === selectedStudy)[0]?.name
    newParticipant.study_name = studyName
    Service.addData("participants", [newParticipant])
    Service.updateCount("studies", selectedStudy, "participant_count")
    Service.getData("studies", selectedStudy).then((studiesObject) => {
      handleNewStudy(studiesObject)
    })
    setNewId(newParticipant.id)
  }

  const addParticipant = async () => {
    let ids = []
    let idData = ((await LAMP.Participant.create(selectedStudy, { study_code: "001" } as any)) as any).data
    let id = typeof idData === "object" ? idData.id : idData
    let newParticipant: any = {}
    if (typeof idData === "object") {
      newParticipant = idData
    } else {
      newParticipant["id"] = idData
    }
    if (!!((await LAMP.Credential.create(id, `${id}@lamp.com`, id, "Temporary Login")) as any).error) {
      enqueueSnackbar(t("Could not create credential for id.", { id: id }), { variant: "error" })
    } else {
      newParticipant.study_id = selectedStudy
      newParticipant.study_name = studies.filter((study) => study.id === selectedStudy)[0]?.name
      Service.addData("participants", [newParticipant])
      Service.updateCount("studies", selectedStudy, "participant_count")
      Service.getData("studies", selectedStudy).then((studiesObject) => {
        handleNewStudy(studiesObject)
      })
      setNewId(newParticipant.id)
    }
    ids = [...ids, id]
    setParticipants()
  }

  const createDemoStudy = () => {
    if (selectedStudy === "") {
      setShowErrorMsg(true)
      return false
    } else {
      setStudyBtnClicked(true)
      addDemoParticipant()
      closePopUp(3)
      setSelectedStudy("")
      setParticipants()
    }
    setSelectedStudy("")
    closePopUp(3)
    props.onClose as any
  }

  return (
    <React.Fragment>
      <Dialog
        {...props}
        onEnter={() => {
          setSelectedStudy("")
        }}
        scroll="paper"
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        classes={{ paper: classes.addNewDialog }}
      >
        <DialogTitle id="alert-dialog-slide-title" disableTypography>
          <Typography variant="h6">{t("Create a new user.")}</Typography>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={props.onClose as any}
            disabled={!!studyBtnClicked ? true : false}
          >
            <Icon>close</Icon>
          </IconButton>
        </DialogTitle>
        <DialogContent dividers={false} classes={{ root: classes.activityContent }}>
          <Box mt={2} mb={3}>
            <Typography variant="body2">{t("Choose the Study you want to save this participant.")}</Typography>
          </Box>
          <TextField
            error={!validate()}
            select
            autoFocus
            fullWidth
            variant="outlined"
            label={t("Study")}
            value={selectedStudy}
            onChange={handleChangeStudy}
            helperText={!validate() ? t("Please select the Study") : ""}
          >
            {(studies || []).map((study) => (
              <MenuItem key={study.id} value={study.id}>
                {study.name}
              </MenuItem>
            ))}
          </TextField>
          {!!showErrorMsg && (
            <Box mt={1}>
              <Typography className={classes.errorMsg}>{t("Select a Study to create a participant.")}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Box textAlign="right" width={1} mt={3} mb={3} mx={3}>
            <Button
              color="primary"
              onClick={() => {
                closePopUp(3)
              }}
            >
              {t("Cancel")}
            </Button>
            <Button
              //onClick={() => addParticipant()}
              onClick={() => {
                createNewStudy()
              }}
              color="primary"
              autoFocus
              //disabled={!!studyBtnClicked ? true : false}
              disabled={!validate()}
            >
              {t("Save")}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
      {!!newId && <NewPatientDetail id={newId} />}
    </React.Fragment>
  )
}
