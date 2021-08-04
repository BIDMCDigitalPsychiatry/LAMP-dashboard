import React, { useState, useEffect } from "react"
import { Icon, Fab, Backdrop, CircularProgress, makeStyles, Theme, createStyles } from "@material-ui/core"
import LAMP from "lamp-core"
import { useSnackbar } from "notistack"
import { useTranslation } from "react-i18next"
import ConfirmationDialog from "../../ConfirmationDialog"
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
  setUpdateCount,
  profile,
  ...props
}: {
  sensors?: Array<Sensors>
  newDeletedIds?: Function
  selectedStudyArray?: Function
  setSensors?: Function
  setUpdateCount?: Function
  profile?: boolean
}) {
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation()
  const classes = useStyles()
  const [confirmationDialog, setConfirmationDialog] = useState(0)
  const [deletedIds, setDeletedIds] = useState([])
  const [loading, setLoading] = useState(false)
  const [confirmStatus, setConfirmStatus] = useState(false)
  const [deletedStudyIds, setDeletedStudyIds] = useState([])

  const confirmAction = async (status) => {
    setConfirmStatus(status === "Yes" ? true : false)
    if (status === "Yes") {
      setLoading(true)
      if (sensors.length > 0) {
        for (let eachSensorIds of sensors) {
          await LAMP.Sensor.delete(eachSensorIds.id).then((data: any) => {
            if (!data.error) {
              setDeletedIds((prev) => [...prev, eachSensorIds.id])
              setDeletedStudyIds((prev) => [...prev, eachSensorIds.study_id])
            }
          })
        }
      }
    }
    setLoading(false)
    setSensors()
    setConfirmationDialog(0)
  }

  useEffect(() => {
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
            setUpdateCount(3)
          })
        })
      }
    }
  }, [deletedStudyIds])

  useEffect(() => {
    if (confirmStatus) {
      if (deletedIds.length > 0) {
        Service.delete("sensors", deletedIds)
      } else {
        enqueueSnackbar(t("An error occured while deleting. Please try again."), {
          variant: "error",
        })
      }
    }
  }, [deletedIds])

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
        confirmationMsg={
          !!profile
            ? "This sensor will be deleted for all the participants under this study. Are you sure you want to proceed?"
            : "Are you sure you want to delete this sensor?"
        }
      />
    </span>
  )
}
