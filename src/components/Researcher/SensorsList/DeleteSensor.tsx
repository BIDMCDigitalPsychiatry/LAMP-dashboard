import React, { useState } from "react"
import { Icon, Fab } from "@material-ui/core"
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
      [theme.breakpoints.up("md")]: {
        //position: "absolute",
      },
    },
  })
)

export default function DeleteActivity({ sensors, deleted, ...props }) {
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation()
  const classes = useStyles()
  const [confirmationDialog, setConfirmationDialog] = useState(0)

  const confirmAction = async (status) => {
    if (status === "Yes") {
      let sensorIds = sensors.map((a) => {
        return a.id
      })
      for (let eachSensorIds of sensorIds) {
        await LAMP.Activity.delete(eachSensorIds)
      }
      Service.delete("sensors", sensorIds)
      enqueueSnackbar(t("Successfully deleted the selected Sensors."), {
        variant: "success",
      })
      deleted(true)
    }
    setConfirmationDialog(0)
  }

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
      <ConfirmationDialog
        confirmationDialog={confirmationDialog}
        open={confirmationDialog > 0 ? true : false}
        onClose={() => setConfirmationDialog(0)}
        confirmAction={confirmAction}
      />
    </span>
  )
}
