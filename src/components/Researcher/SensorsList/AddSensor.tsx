import React, { useState, useEffect } from "react"
import Box from "@material-ui/core/Box"
import Fab from "@material-ui/core/Fab"
import Icon from "@material-ui/core/Icon"
import { makeStyles, createStyles } from "@material-ui/core/styles"
import { useTranslation } from "react-i18next"
import { Service } from "../../DBService/DBService"
import SensorDialog from "./SensorDialog"

const useStyles = makeStyles((theme) =>
  createStyles({
    btnBlue: {
      background: "#7599FF",
      borderRadius: "40px",
      minWidth: 100,
      boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.20)",
      lineHeight: "38px",
      cursor: "pointer",
      textTransform: "capitalize",
      fontSize: "16px",
      color: "#fff",
      "& svg": { marginRight: 8 },
      "&:hover": { background: "#5680f9" },
      [theme.breakpoints.up("md")]: {
        position: "absolute",
      },
      [theme.breakpoints.down("sm")]: {
        minWidth: "auto",
      },
    },
    addText: {
      [theme.breakpoints.down("sm")]: {
        display: "none",
      },
    },
  })
)
export function addSensorItem(x, studies) {
  Service.updateCount("studies", x.studyID, "sensor_count")
  x["study_id"] = x.studyID
  x["study_name"] = studies.filter((study) => study.id === x.studyID)[0]?.name
  delete x["studyID"]
  Service.addData("sensors", [x])
}
export default function AddSensor({
  studies,
  studyId,
  setSensors,
  ...props
}: {
  studies?: Array<Object>
  studyId?: string
  setSensors?: Function
}) {
  const classes = useStyles()
  const { t } = useTranslation()
  const [sensorDialog, setSensorDialog] = useState(false)
  const [allSensors, setAllSensors] = useState<Array<Object>>([])

  useEffect(() => {
    getAllStudies()
  }, [])

  useEffect(() => {
    getAllStudies()
  }, [sensorDialog])

  const getAllStudies = () => {
    Service.getAll("sensors").then((sensorObj: any) => {
      setAllSensors(sensorObj)
    })
  }

  const addOrUpdateSensor = () => {
    setSensorDialog(false)
    setSensors()
  }

  return (
    <Box>
      <Fab variant="extended" color="primary" classes={{ root: classes.btnBlue }} onClick={() => setSensorDialog(true)}>
        <Icon>add</Icon> <span className={classes.addText}>{`${t("Add")}`}</span>
      </Fab>
      <SensorDialog
        studies={studies}
        onClose={() => setSensorDialog(false)}
        open={sensorDialog}
        type="add"
        studyId={studyId ?? null}
        addOrUpdateSensor={addOrUpdateSensor}
        allSensors={allSensors}
      />
    </Box>
  )
}
