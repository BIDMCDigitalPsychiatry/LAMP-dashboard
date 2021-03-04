import React, { useState } from "react"
import { Box, IconButton, Icon } from "@material-ui/core"

import { useSnackbar } from "notistack"
import LAMP, { Study } from "lamp-core"
import { makeStyles, Theme, createStyles, MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles"
import { useTranslation } from "react-i18next"
import ConfirmationDialog from "../ParticipantList/Profile/ConfirmationDialog"
import SensorDialog from "./SensorDialog"

export default function UpdateSensor({
  studies,
  sensor,
  type,
  updateDataSensor,
  ...props
}: {
  studies?: Array<any>
  sensor?: any
  type?: any
  updateDataSensor?: any
}) {
  const [selectedItem, setSelectedItem] = useState(null)
  const [confirmationDialog, setConfirmationDialog] = React.useState(0)
  const [sensorDialog, setSensorDialog] = useState(false)
  const { t, i18n } = useTranslation()

  const { enqueueSnackbar } = useSnackbar()
  const modifySensor = () => {
    setSensorDialog(false)
    updateDataSensor(true)
  }
  const deleteSensor = async (sensorId) => {
    await LAMP.Sensor.delete(sensorId)
    enqueueSnackbar(t("Successfully deleted the sensor."), {
      variant: "success",
    })
    // onChangeSensors()
  }

  const confirmAction = () => {
    switch (confirmationDialog) {
      case 1:
        setSensorDialog(true)
        break
      case 2:
      case 5:
        deleteSensor(selectedItem.id)
        break
    }
    setConfirmationDialog(0)
  }
  return (
    <Box>
      <IconButton
        onClick={() => {
          setSelectedItem(sensor)
          type === "profile" ? setConfirmationDialog(1) : setSensorDialog(true)
        }}
        color="default"
        aria-label="Menu"
      >
        <Icon>edit</Icon>
      </IconButton>
      <IconButton
        onClick={() => {
          setSelectedItem(sensor)
          setConfirmationDialog(type === "profile" ? 2 : 5)
        }}
        color="default"
        aria-label="Menu"
      >
        <Icon>close</Icon>
      </IconButton>
      <ConfirmationDialog
        confirmationDialog={confirmationDialog}
        open={confirmationDialog > 0 ? true : false}
        onClose={() => setConfirmationDialog(0)}
        confirmAction={confirmAction}
      />
      <SensorDialog
        sensor={selectedItem}
        modifySensor={modifySensor}
        onClose={() => setSensorDialog(false)}
        studies={studies}
        open={sensorDialog}
      />
    </Box>
  )
}
