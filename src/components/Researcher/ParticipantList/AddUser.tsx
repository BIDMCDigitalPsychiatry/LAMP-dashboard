import React, { useState, useEffect } from "react"
import {
  Box,
  IconButton,
  Button,
  TextField,
  MenuItem,
  Tooltip,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogProps,
} from "@material-ui/core"

import { useSnackbar } from "notistack"
import CloseIcon from "@material-ui/icons/Close"
import QRCode from "qrcode.react"
import LAMP from "lamp-core"
import SnackMessage from "../../SnackMessage"
import { makeStyles, Theme, createStyles, createMuiTheme } from "@material-ui/core/styles"
import { useTranslation } from "react-i18next"
import { Service } from "../../DBService/DBService"

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
  ...props
}: {
  researcher: any
  studies: any
  setParticipants?: Function
  handleNewStudy: Function
  closePopUp: Function
} & DialogProps) {
  const classes = useStyles()
  const [selectedStudy, setSelectedStudy] = useState("")
  const [showErrorMsg, setShowErrorMsg] = useState(false)
  const [studyBtnClicked, setStudyBtnClicked] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()
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
      setLoading(true)
      setStudyBtnClicked(true)
      let newCount = 1
      let ids = []
      for (let i = 0; i < newCount; i++) {
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
          enqueueSnackbar(
            t("Successfully created Participant id. Tap the expand icon on the right to see credentials and details.", {
              id: id,
            }),
            {
              variant: "success",
              persist: true,
              content: (key: string, message: string) => (
                <SnackMessage id={key} message={message}>
                  <TextField
                    variant="outlined"
                    size="small"
                    label={t("Temporary email address")}
                    value={`${id}@lamp.com`}
                  />
                  <Box style={{ height: 16 }} />
                  <TextField variant="outlined" size="small" label={t("Temporary password")} value={`${id}`} />
                  <Grid item>
                    <TextField
                      fullWidth
                      label={t("One-time login link")}
                      style={{ marginTop: 16 }}
                      variant="outlined"
                      value={_qrLink(`${id}@lamp.com`, id)}
                      onChange={(event) => {}}
                    />
                    <Tooltip title={t("Scan this QR code on a mobile device to automatically open a user dashboard.")}>
                      <Grid container justify="center" style={{ padding: 16 }}>
                        <QRCode size={256} level="H" value={_qrLink(`${id}@lamp.com`, id)} />
                      </Grid>
                    </Tooltip>
                  </Grid>
                </SnackMessage>
              ),
            }
          )
        }
        ids = [...ids, id]
      }
      setLoading(false)
      setParticipants()
    }
    setSelectedStudy("")
    closePopUp(3)
    props.onClose as any
  }

  const createNewStudy = () => {
    let lampAuthId = LAMP.Auth._auth.id
    if (LAMP.Auth._type === "researcher" && lampAuthId === "researcher@demo.lamp.digital") {
      createDemoStudy()
    } else {
      createStudy()
    }
  }

  const createDemoStudy = () => {
    if (selectedStudy === "") {
      setShowErrorMsg(true)
      return false
    } else {
      let studyName = studies.filter((study) => study.id === selectedStudy)[0]?.name
      setLoading(true)
      setStudyBtnClicked(true)
      let newParticipant: any = {}
      newParticipant.id = "U" + Math.random().toString().substring(2, 11)
      newParticipant.study_id = selectedStudy
      newParticipant.study_name = studyName
      Service.addData("participants", [newParticipant])
      Service.updateCount("studies", selectedStudy, "participant_count")
      Service.getData("studies", selectedStudy).then((studiesObject) => {
        handleNewStudy(studiesObject)
      })
      let id = newParticipant.id
      enqueueSnackbar(
        t("Successfully created Participant id. Tap the expand icon on the right to see credentials and details.", {
          id: id,
        }),
        {
          variant: "success",
          persist: true,
          content: (key: string, message: string) => (
            <SnackMessage id={key} message={message}>
              <TextField
                variant="outlined"
                size="small"
                label={t("Temporary email address")}
                value={`${id}@lamp.com`}
              />
              <Box style={{ height: 16 }} />
              <TextField variant="outlined" size="small" label={t("Temporary password")} value={`${id}`} />
              <Grid item>
                <TextField
                  fullWidth
                  label={t("One-time login link")}
                  style={{ marginTop: 16 }}
                  variant="outlined"
                  value={_qrLink(`${id}@lamp.com`, id)}
                  onChange={(event) => {}}
                />
                <Tooltip title={t("Scan this QR code on a mobile device to automatically open a user dashboard.")}>
                  <Grid container justify="center" style={{ padding: 16 }}>
                    <QRCode size={256} level="H" value={_qrLink(`${id}@lamp.com`, id)} />
                  </Grid>
                </Tooltip>
              </Grid>
            </SnackMessage>
          ),
        }
      )
      closePopUp(3)
      setSelectedStudy("")
      setLoading(false)
      setParticipants()
    }
    setSelectedStudy("")
    closePopUp(3)
    props.onClose as any
  }

  return (
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
      <DialogTitle id="alert-dialog-slide-title">
        <Typography variant="h6">{t("Create a new user.")}</Typography>
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={props.onClose as any}
          disabled={!!studyBtnClicked ? true : false}
        >
          <CloseIcon />
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
  )
}
