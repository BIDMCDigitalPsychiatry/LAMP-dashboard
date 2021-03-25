import React, { useState, useEffect } from "react"
import { useSnackbar } from "notistack"
import { useTranslation } from "react-i18next"
import ConfirmationDialog from "../../ConfirmationDialog"
import SensorDialog from "./SensorDialog"
import { Service } from "../../DBService/DBService"
import { Box, Icon, Fab, makeStyles, Theme, createStyles } from "@material-ui/core"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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

export interface Sensors {
  id?: string
  study_id?: string
}
export default function UpdateSensor({
  studies,
  sensor,
  type,
  studyId,
  setSensors,
  profile,
  ...props
}: {
  studies?: Array<Object>
  sensor?: Sensors
  type?: string
  studyId?: string
  setSensors?: Function
  profile?: boolean
}) {
  const classes = useStyles()
  const [confirmationDialog, setConfirmationDialog] = React.useState(0)
  const [sensorDialog, setSensorDialog] = useState(false)
  const { t, i18n } = useTranslation()
  const { enqueueSnackbar } = useSnackbar()

  const [allSensors, setAllSensors] = useState<Array<Object>>([])

  useEffect(() => {
    getAllStudies()
  }, [])

  useEffect(() => {
    getAllStudies()
  }, [sensorDialog])

  const getAllStudies = () => {
    Service.getAll("sensors").then((sensorObj) => {
      if (sensorObj) {
        setAllSensors(sensorObj)
      }
    })
  }

  const addOrUpdateSensor = (sensor?: any) => {
    setSensorDialog(false)
    setSensors()
  }

  const confirmAction = (val) => {
    if (val === "Yes") {
      setSensorDialog(true)
    }
    setConfirmationDialog(0)
  }

  return (
    <Box>
      <Fab
        size="small"
        color="primary"
        classes={{ root: classes.btnWhite }}
        onClick={() => {
          !!profile ? setConfirmationDialog(1) : setSensorDialog(true)
        }}
      >
        <Icon>mode_edit</Icon>
      </Fab>
      <ConfirmationDialog
        confirmationDialog={confirmationDialog}
        open={confirmationDialog > 0 ? true : false}
        onClose={() => setConfirmationDialog(0)}
        confirmAction={confirmAction}
        confirmationMsg={
          !!profile
            ? "Changes done to this sensor will reflect for all the participants under the study. Are you sure you want proceed?."
            : null
        }
      />
      <SensorDialog
        sensor={sensor}
        onClose={() => setSensorDialog(false)}
        studies={studies}
        open={sensorDialog}
        type="edit"
        studyId={studyId ?? null}
        addOrUpdateSensor={addOrUpdateSensor}
        allSensors={allSensors}
      />
    </Box>
  )
}
