import React, { useState } from "react"
import { Box, Fab, Icon, makeStyles, Theme, createStyles } from "@material-ui/core"
import { useSnackbar } from "notistack"
import EditStudyField from "./EditStudyField"
import { useTranslation } from "react-i18next"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    disabledButton: {
      color: "#4C66D6 !important",
      opacity: 0.5,
    },
    studyName: { minWidth: 200, alignItems: "center", display: "flex" },
    btnWhite: {
      background: "#fff",
      borderRadius: "40px",
      boxShadow: "none",
      cursor: "pointer",
      textTransform: "capitalize",
      fontSize: "14px",
      color: "#7599FF",

      "&:hover": { color: "#5680f9", background: "#fff", boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.20)" },
    },
  })
)

export default function EditStudy({ study, upatedDataStudy, allStudies, researcherId, ...props }) {
  const { enqueueSnackbar } = useSnackbar()
  const classes = useStyles()
  const { t, i18n } = useTranslation()
  const [editStudy, setEditStudy] = useState(false)
  const [editStudyName, setEditStudyName] = useState("")
  const [aliasStudyName, setAliasStudyName] = useState("")
  const [studyArray, setStudyNameArray] = useState([])
  const [openDialogStudies, setOpenDialogManageStudies] = useState(false)

  const updateStudyName = (data) => {
    setEditStudy(false)
    setAliasStudyName(data)
    let oldNameArray = Object.assign({}, studyArray)
    oldNameArray[editStudyName] = data
    setStudyNameArray(oldNameArray)
    upatedDataStudy(oldNameArray)
  }

  const callbackModal = () => {
    setOpenDialogManageStudies(false)
  }

  const editStudyField = (selectedRows, event) => {
    setEditStudy(true)
    setEditStudyName(selectedRows)
  }

  return (
    <Box display="flex" alignItems="center">
      <Box flexGrow={1} pl={1}>
        {editStudy && study.id == editStudyName ? (
          <Box flexGrow={1} className={classes.studyName}>
            <EditStudyField
              study={study.id}
              studyName={study.name}
              editData={editStudy}
              editStudyName={editStudyName}
              updateName={updateStudyName}
              callbackModal={callbackModal}
              allStudies={allStudies}
              researcherId={researcherId}
            />
          </Box>
        ) : aliasStudyName && editStudyName === study.id ? (
          t(aliasStudyName)
        ) : studyArray[study.id] ? (
          t(studyArray[study.id])
        ) : (
          t(study.name)
        )}
      </Box>
      <Box>
        <Fab
          size="small"
          color="primary"
          disabled={study.id > 1 ? true : false}
          classes={{ root: classes.btnWhite, disabled: classes.disabledButton }}
          onClick={(event) => {
            editStudyField(study.id, event)
          }}
        >
          <Icon>create</Icon>
        </Fab>
      </Box>
    </Box>
  )
}
