import React, { useState, useEffect } from "react"
import { Icon, Fab, Backdrop, CircularProgress } from "@material-ui/core"
import LAMP from "lamp-core"
import { useSnackbar } from "notistack"
import { useTranslation } from "react-i18next"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import ConfirmationDialog from "../ParticipantList/Profile/ConfirmationDialog"
import { Service } from "../../DBService/DBService"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    btnText: {
      background: "transparent",
      borderRadius: "40px",
      minWidth: 100,
      boxShadow: "none",
      cursor: "pointer",
      textTransform: "capitalize",
      paddingLeft: "10px !important",
      paddingRight: "15px !important",
      fontSize: "14px",
      color: "#7599FF",
      "& svg": { marginRight: 8 },
      "&:hover": { color: "#5680f9", background: "#fff" },
      "& span.MuiIcon-root": { fontSize: 20, marginRight: 3 },
      [theme.breakpoints.up("md")]: {},
    },
    backdrop: {
      zIndex: 111111,
      color: "#fff",
    },
  })
)

export interface Sensors {
  id?: string
  study_id?: string
  study_name?: string
}

export default function DeleteSensor({
  sensors,
  newDeletedIds,
  selectedStudyArray,
  setSensors,
  ...props
}: {
  sensors?: Array<Sensors>
  newDeletedIds?: Function
  selectedStudyArray?: Function
  setSensors?: Function
}) {
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation()
  const classes = useStyles()
  const [confirmationDialog, setConfirmationDialog] = useState(0)
  const [deletedIds, setDeletedIds] = useState([])
  const [loading, setLoading] = useState(false)
  const [confirmStatus, setConfirmStatus] = useState(false)
  const [deletedStudyIds, setDeletedStudyIds] = useState([])
  const [deletedStudys, setDeletedStudys] = useState([])

  const confirmAction = async (status) => {
    setConfirmStatus(status === "Yes" ? true : false)
    if (status === "Yes") {
      setLoading(true)
      if (sensors.length > 0) {
        for (let eachSensorIds of sensors) {
          /*  // WORKING  */
          await LAMP.Sensor.delete(eachSensorIds.id).then((data: any) => {
            console.log(200, data, eachSensorIds)

            if (!data.error) {
              setDeletedIds((prev) => [...prev, eachSensorIds.id])
              setDeletedStudyIds((prev) => [...prev, eachSensorIds.study_id])
              setDeletedStudys((prev) => [...prev, eachSensorIds.study_name])
            }
          })

          /*
          setDeletedIds((prev) => [...prev, eachSensorIds.id])
          setDeletedStudyIds((prev) => [...prev, eachSensorIds.study_id])
          setDeletedStudys((prev) => [...prev, eachSensorIds.study_name])
          */
        }
      }
    }
    setLoading(false)
    setSensors()
    setConfirmationDialog(0)
  }

  useEffect(() => {
    //// WORKING
    if (confirmStatus) {
      if (deletedStudyIds.length > 0) {
        let idCounts = {}
        deletedStudyIds.forEach((x) => (idCounts[x] = (idCounts[x] || 0) + 1))
        Object.keys(idCounts).forEach(function (key) {
          Service.getData("studies", key).then((studiesObject) => {
            Service.updateMultipleKeys(
              "studies",
              {
                studies: [{ id: key, sensor_count: studiesObject.sensor_count - idCounts[key] }],
              },
              ["sensor_count"],
              "id"
            )
          })
        })
      }
    }

    /*
    if (confirmStatus) {
      if (deletedStudyIds.length > 0) {
        let idCounts = {}
        deletedStudyIds.forEach((x) => (idCounts[x] = (idCounts[x] || 0) + 1))
      }
    }*/
  }, [deletedStudyIds])

  useEffect(() => {
    if (confirmStatus) {
      if (deletedIds.length > 0) {
        Service.delete("sensors", deletedIds)
        /*enqueueSnackbar(t("Successfully deleted the selected Sensors."), {
          variant: "success",
        })*/
      } else {
        enqueueSnackbar(t("An error occured while deleting. Please try again."), {
          variant: "error",
        })
      }

      console.log(202, deletedIds, deletedStudys)

      newDeletedIds(deletedIds)
      //selectedStudyArray(deletedStudys)
    }
    //setLoading(false)
  }, [deletedIds])

  useEffect(() => {
    console.log(203, deletedStudys)
    selectedStudyArray(deletedStudys)
  }, [deletedStudys])

  /*
  useEffect(() => {
    if (deletedIds.length > 0) {
       // WORKING
      Service.delete("sensors", deletedIds)
      
      enqueueSnackbar(t("Successfully deleted the selected Sensors."), {
        variant: "success",
      })
    }  else {
      enqueueSnackbar(t("2  An error occured while deleting. Please try again."), {
        variant: "error",
      })
    }
    newDeletedIds(deletedIds)
    setLoading(false)
  }, [deletedIds])
*/

  return (
    <span>
      <Fab
        variant="extended"
        size="small"
        classes={{ root: classes.btnText }}
        onClick={(event) => setConfirmationDialog(5)}
      >
        <Icon>delete_outline</Icon> {t("Delete")}
      </Fab>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <ConfirmationDialog
        confirmationDialog={confirmationDialog}
        open={confirmationDialog > 0 ? true : false}
        onClose={() => setConfirmationDialog(0)}
        confirmAction={confirmAction}
      />
    </span>
  )
}
