// Core Imports
import React, { useState, useEffect } from "react"
import {
  Box,
  Icon,
  IconButton,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogProps,
  Backdrop,
  CircularProgress,
  makeStyles,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core"

import { useSnackbar } from "notistack"
import LAMP, { Study } from "lamp-core"
import { useTranslation } from "react-i18next"
import { Service } from "../../DBService/DBService"

const useStyles = makeStyles((theme) => ({
  dataQuality: {
    margin: "4px 0",
    backgroundColor: "#E9F8E7",
    color: "#FFF",
  },
  switchLabel: { color: "#4C66D6" },
  activityContent: {
    padding: "25px 25px 0",
  },
  backdrop: {
    zIndex: 111111,
    color: "#fff",
  },
  addNewDialog: {
    maxWidth: 350,
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
  enableMessaging: {
    paddingLeft: 18,
    "& span": {
      fontSize: 14,
    },
  },
}))
export default function StudyCreator({
  studies,
  researcherId,
  handleNewStudy,
  closePopUp,
  ...props
}: {
  studies: any
  researcherId: any
  handleNewStudy: Function
  closePopUp: Function
} & DialogProps) {
  const [studyName, setStudyName] = useState("")
  const classes = useStyles()
  const [duplicateCnt, setCount] = useState(0)
  const { t } = useTranslation()
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(false)
  const [isMessagingEnabled, setIsMessagingEnabled] = useState(false)
  const validate = () => {
    return !(
      duplicateCnt > 0 ||
      typeof studyName === "undefined" ||
      (typeof studyName !== "undefined" && studyName?.trim() === "")
    )
  }

  useEffect(() => {
    let duplicateCount = 0
    if (!(typeof studyName === "undefined" || (typeof studyName !== "undefined" && studyName?.trim() === ""))) {
      duplicateCount = studies.filter((study) => study.name?.trim().toLowerCase() === studyName?.trim().toLowerCase())
        .length
    }
    setCount(duplicateCount)
  }, [studyName])

  const createStudy = async (studyName: string, isMessagingEnabled: boolean) => {
    setLoading(true)
    let study = new Study()
    study.name = studyName
    study.isMessagingEnabled = isMessagingEnabled
    LAMP.Study.create(researcherId, study)
      .then(async (res) => {
        let result = JSON.parse(JSON.stringify(res))
        let studiesData = {
          id: result.data,
          name: studyName,
          participant_count: 1,
          activity_count: 0,
          sensor_count: 0,
          isMessagingEnabled: isMessagingEnabled,
        }
        Service.addData("studies", [studiesData])
        enqueueSnackbar(`${t("Successfully created new group - studyName.", { studyName: studyName })}`, {
          variant: "success",
        })
        studiesData.participant_count = 0
        handleNewStudy(studiesData)
        closePopUp(2)
        setStudyName("")
        setLoading(false)
        setIsMessagingEnabled(false)
      })
      .catch((e) => {
        enqueueSnackbar(`${t("An error occured while creating new group - studyName.", { studyName: studyName })}`, {
          variant: "error",
        })
        setLoading(false)
      })
  }

  const createNewStudy = (studyName, isMessagingEnabled) => {
    let lampAuthId = LAMP.Auth._auth.id
    if (
      LAMP.Auth._type === "researcher" &&
      (lampAuthId === "researcher@demo.lamp.digital" || lampAuthId === "clinician@demo.lamp.digital")
    ) {
      createDemoStudy(studyName, isMessagingEnabled)
    } else {
      createStudy(studyName, isMessagingEnabled)
    }
  }

  const createDemoStudy = async (studyName: string, isMessagingEnabled: boolean) => {
    setLoading(true)
    Service.getAll("studies").then((allStudies: any) => {
      let studiesCount = allStudies.length
      let newStudyObj = {
        "#parent": "researcher1",
        "#type": "Study",
        id: "study" + parseInt(studiesCount + 1),
        name: studyName,
        participant_count: 0,
        sensor_count: 0,
        activity_count: 0,
        isMessagingEnabled: isMessagingEnabled,
      }
      Service.addData("studies", [newStudyObj])
      enqueueSnackbar(
        `${t("Successfully created new group - studyName.", {
          studyName: studyName,
        })}`,
        {
          variant: "success",
        }
      )
      handleNewStudy(newStudyObj)
      closePopUp(2)
      setStudyName("")
      setLoading(false)
    })
  }

  const handleEnter = () => {
    setStudyName("")
  }
  const handleEnableMessaging = (event) => {
    const isChecked = event.target.checked
    setIsMessagingEnabled(isChecked)
  }

  return (
    <Dialog
      {...props}
      onEnter={handleEnter}
      scroll="paper"
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
      classes={{ paper: classes.addNewDialog }}
    >
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <DialogTitle id="alert-dialog-slide-title" disableTypography>
        <Typography variant="h6">{`${t("Add a new group")}`}</Typography>
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={() => {
            setStudyName("")
            closePopUp(2)
            setIsMessagingEnabled(false)
          }}
        >
          <Icon>close</Icon>
        </IconButton>
      </DialogTitle>
      <DialogContent dividers={false} classes={{ root: classes.activityContent }}>
        <TextField
          error={!validate()}
          autoFocus
          fullWidth
          variant="outlined"
          label={`${t("Group Name")}`}
          value={studyName}
          onChange={(e) => {
            setStudyName(e.target.value)
          }}
          inputProps={{ maxLength: 80 }}
          helperText={
            duplicateCnt > 0
              ? `${t("Unique group name required")}`
              : !validate()
              ? `${t("Please enter group name.")}`
              : ""
          }
        />
      </DialogContent>
      <DialogActions>
        {/* <Box className={classes.enableMessaging}>
          <FormControlLabel
            control={<Checkbox checked={isMessagingEnabled} onChange={handleEnableMessaging} />}
            label="Enable Messaging"
          />
        </Box> */}
        <Box textAlign="right" width={1} mt={3} mb={3} mx={3}>
          <Button
            color="primary"
            onClick={() => {
              closePopUp(2)
              setIsMessagingEnabled(false)
            }}
          >
            {`${t("Cancel")}`}
          </Button>
          <Button
            onClick={() => {
              createNewStudy(studyName, isMessagingEnabled)
            }}
            color="primary"
            autoFocus
            disabled={!validate()}
          >
            {`${t("Save")}`}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}
