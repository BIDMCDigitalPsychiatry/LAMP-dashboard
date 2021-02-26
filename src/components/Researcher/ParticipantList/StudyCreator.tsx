// Core Imports
import React, { useState, useEffect } from "react"
import {
  Box,
  IconButton,
  Button,
  TextField,
  MenuItem,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core"

import { useSnackbar } from "notistack"
import CloseIcon from "@material-ui/icons/Close"
import LAMP, { Study } from "lamp-core"
import { makeStyles } from "@material-ui/core/styles"
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
    padding: "25px 50px 0",
  },
  addNewDialog: { maxWidth: 350 },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}))

export default function StudyCreator({ studies, researcher, ...props }) {
  const [studyName, setStudyName] = useState("")
  const classes = useStyles()
  const [duplicateCnt, setCount] = useState(0)
  const { t, i18n } = useTranslation()
  const { enqueueSnackbar } = useSnackbar()
  const [addStudy, setAddStudy] = useState(false)

  const validate = () => {
    return (
      duplicateCnt == 0 ||
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

  const createStudy = async (studyName: string) => {
    setAddStudy(false)
    let study = new Study()
    study.name = studyName
    LAMP.Study.create(researcher.id, study).then((res) => {
      let result = JSON.parse(JSON.stringify(res))
      Service.addData("studies", [{ id: result.data, name: studyName }])
      enqueueSnackbar(t("Successfully created new study - studyName.", { studyName: studyName }), {
        variant: "success",
      })
    })
  }

  return (
    <Box>
      <MenuItem
        onClick={() => {
          setAddStudy(true)
        }}
      >
        <Typography variant="h6">{t("Add a new study")}</Typography>
        <Typography variant="body2">{t("Create a new study.")}</Typography>
      </MenuItem>

      <Dialog
        open={addStudy}
        onClose={() => {
          setStudyName("")
          setAddStudy(false)
        }}
        onEnter={() => setStudyName("")}
        scroll="paper"
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        classes={{ paper: classes.addNewDialog }}
      >
        <DialogTitle id="alert-dialog-slide-title">
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={() => {
              setStudyName("")
              setAddStudy(false)
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers={false} classes={{ root: classes.activityContent }}>
          <TextField
            error={!validate()}
            autoFocus
            fullWidth
            variant="filled"
            label={t("Name")}
            defaultValue={studyName}
            onChange={(e) => {
              setStudyName(e.target.value)
            }}
            inputProps={{ maxLength: 80 }}
            helperText={duplicateCnt > 0 ? t("Unique name required") : ""}
          />
        </DialogContent>
        <DialogActions>
          <Box textAlign="center" width={1} mt={3} mb={3}>
            <Button
              onClick={() => {
                setAddStudy(false)
                createStudy(studyName)
              }}
              color="primary"
              autoFocus
              disabled={!validate()}
            >
              {t("Save")}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
