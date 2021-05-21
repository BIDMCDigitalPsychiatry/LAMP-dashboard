import React, { useState, useEffect } from "react"
import {
  Box,
  IconButton,
  Button,
  TextField,
  Popover,
  MenuItem,
  Tooltip,
  Grid,
  Fab,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  InputBase,
  DialogProps,
  Backdrop,
  CircularProgress,
  makeStyles,
  Theme,
  createStyles,
  withStyles,
} from "@material-ui/core"

import { useSnackbar } from "notistack"

import QRCode from "qrcode.react"
// Local Imports
import LAMP, { Study } from "lamp-core"

import SnackMessage from "../../SnackMessage"

import { useTranslation } from "react-i18next"
import { Service } from "../../DBService/DBService"

import Header from "./Header"
const _qrLink = (credID, password) =>
  window.location.href.split("#")[0] +
  "#/?a=" +
  btoa([credID, password, LAMP.Auth._auth.serverAddress].filter((x) => !!x).join(":"))

const CssTextField = withStyles({
  root: {
    "label + &": {},
  },
  input: {
    fontSize: 16,
    fontFamily: "Inter",
    fontWeight: "bold",
    color: "rgba(0, 0, 0, 0.75)",
  },
})(InputBase)

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    backdrop: {
      zIndex: 111111,
      color: "#fff",
    },
    buttonText: {
      fontWeight: "bold",
      fontSize: 16,
      color: "white",
    },
    PopupButton: {
      marginTop: 35,
      width: 168,
      height: 50,
      background: "#7599FF",
      boxShadow: "0px 10px 15px rgba(96, 131, 231, 0.2)",
      borderRadius: 25,
      marginBottom: 40,
      "&:hover": { background: "#5680f9" },
    },
    popWidth: { width: "95%", maxWidth: "500px", padding: "0 40px" },
    dialogTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: "rgba(0, 0, 0, 0.75)",
      marginTop: 30,
    },
    disabled: {
      color: "rgba(0, 0, 0, 0.26)",
      boxShadow: "none",
      backgroundColor: "rgba(0, 0, 0, 0.12)",
    },
  })
)

export interface Sensors {
  id?: string
  study_id?: string
  name?: string
  spec?: string
}
export default function SensorDialog({
  sensor,
  studies,
  studyId,
  type,
  addOrUpdateSensor,
  allSensors,
  ...props
}: {
  sensor?: Sensors
  studies?: Array<any>
  studyId?: string
  type?: string
  addOrUpdateSensor?: Function
  allSensors?: Array<any>
} & DialogProps) {
  const classes = useStyles()
  const [selectedStudy, setSelectedStudy] = useState(sensor ? sensor.study_id : studyId ?? "")
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation()
  const [selectedSensor, setSelectedSensor] = useState(sensor ?? null)
  const [sensorName, setSensorName] = useState(sensor ? sensor.name : "")
  const [sensorSpecs, setSensorSpecs] = useState(null)
  const [sensorSpec, setSensorSpec] = useState(sensor ? sensor.spec : null)
  const [loading, setLoading] = useState(false)
  const [duplicateCnt, setDuplicateCnt] = useState(0)
  const [oldSensorName, setOldSensorName] = useState(sensor ? sensor.name : "")
  const [allSensorData, setAllSensorData] = useState([])

  useEffect(() => {
    LAMP.SensorSpec.all().then((res) => {
      setSensorSpecs(res)
      setSensorSpec(sensor ? sensor.spec : null)
    })
  }, [])

  useEffect(() => {
    setAllSensorData(allSensors)
  }, [allSensors])

  useEffect(() => {
    if (type === "add") {
      setSelectedSensor(null)
      setSelectedStudy(sensor ? sensor.study_id : studyId ?? "")
      setSensorName("")
      setSensorSpec("")
    } else {
      setSelectedStudy(sensor ? sensor.study_id : studyId ?? "")
      setSelectedSensor(sensor ?? null)
      setSensorName(sensor ? sensor.name : "")
      setSensorSpec(sensor ? sensor.spec : null)
    }
  }, [props.open])

  useEffect(() => {
    let duplicateCount = 0
    if (!(typeof sensorName === "undefined" || (typeof sensorName !== "undefined" && sensorName?.trim() === ""))) {
      if (allSensorData) {
        selectedSensor
          ? (duplicateCount = allSensorData.filter((sensorData) => {
              if (sensorData.name !== oldSensorName) {
                return (
                  sensorData.study_id === selectedStudy &&
                  sensorData.name?.trim().toLowerCase() === sensorName?.trim().toLowerCase()
                )
              }
            }).length)
          : (duplicateCount = allSensorData.filter(
              (sensorData) =>
                sensorData.study_id === selectedStudy &&
                sensorData.name?.trim().toLowerCase() === sensorName?.trim().toLowerCase()
            ).length)
      }
      setDuplicateCnt(duplicateCount)
    }
  }, [sensorName])

  useEffect(() => {
    let duplicateCount = 0
    if (!(typeof sensorName === "undefined" || (typeof sensorName !== "undefined" && sensorName?.trim() === ""))) {
      if (allSensors) {
        duplicateCount = allSensors.filter(
          (sensorData) =>
            sensorData.study_id === selectedStudy &&
            sensorData.name?.trim().toLowerCase() === sensorName?.trim().toLowerCase()
        ).length
      }
      setDuplicateCnt(duplicateCount)
    }
  }, [selectedStudy])

  const validate = () => {
    return !(
      duplicateCnt > 0 ||
      typeof selectedStudy == "undefined" ||
      selectedStudy === null ||
      selectedStudy === "" ||
      typeof sensorName == "undefined" ||
      sensorName === null ||
      sensorName.trim() === "" ||
      typeof sensorSpec == "undefined" ||
      sensorSpec === null ||
      sensorSpec === ""
    )
  }

  const updateSensor = async () => {
    setLoading(true)
    const result = await LAMP.Sensor.update(selectedSensor.id, {
      name: sensorName.trim(),
      spec: sensorSpec,
    }).then((res) => {
      Service.updateMultipleKeys(
        "sensors",
        { sensors: [{ id: selectedSensor.id, name: sensorName.trim(), spec: sensorSpec }] },
        ["name", "spec"],
        "id"
      )
      enqueueSnackbar(t("Successfully updated a sensor."), {
        variant: "success",
      })
      setLoading(false)
      addOrUpdateSensor()
    })
  }

  const saveSensor = async () => {
    setLoading(true)
    const result = await LAMP.Sensor.create(selectedStudy, {
      name: sensorName.trim(),
      spec: sensorSpec,
    }).then((res) => {
      let result = JSON.parse(JSON.stringify(res))
      Service.getData("studies", selectedStudy).then((studiesObject) => {
        let sensorObj = {
          id: result.data,
          name: sensorName.trim(),
          spec: sensorSpec,
          study_id: selectedStudy,
          study_name: studies.filter((study) => study.id === selectedStudy)[0]?.name,
        }
        Service.addData("sensors", [sensorObj])
        Service.updateMultipleKeys(
          "studies",
          {
            studies: [
              { id: studiesObject.id, sensor_count: studiesObject.sensor_count ? studiesObject.sensor_count + 1 : 1 },
            ],
          },
          ["sensor_count"],
          "id"
        )
        enqueueSnackbar(t("Successfully created a sensor."), {
          variant: "success",
        })
        setLoading(false)
        addOrUpdateSensor()
      })
    })
  }

  return (
    <Dialog {...props} classes={{ paper: classes.popWidth }} aria-labelledby="simple-dialog-title">
      <div>
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <Typography className={classes.dialogTitle}>{selectedSensor ? t("Update Sensor") : t("Add Sensor")}</Typography>
        <Box mt={4}>
          <TextField
            error={typeof selectedStudy == "undefined" || selectedStudy === null || selectedStudy === ""}
            id="filled-select-currency"
            select
            label={t("Study")}
            value={selectedStudy}
            //disabled={!!studyId ? true : false}
            disabled={!!sensor ? true : false}
            onChange={(e) => {
              setSelectedStudy(e.target.value)
            }}
            helperText={
              typeof selectedStudy == "undefined" || selectedStudy === null || selectedStudy === ""
                ? t("Please select the Study")
                : ""
            }
            variant="filled"
          >
            {studies.map((option) => (
              <MenuItem key={option.id} value={option.id} data-selected-study-name={t(option.name)}>
                {t(option.name)}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box mt={4}>
          <TextField
            error={
              duplicateCnt > 0 || typeof sensorName == "undefined" || sensorName === null || sensorName.trim() === ""
                ? true
                : false
            }
            value={sensorName}
            variant="filled"
            label={t("Name")}
            onChange={(event) => setSensorName(event.target.value)}
            placeholder={t("Name")}
            helperText={
              duplicateCnt > 0
                ? t("Unique name required")
                : typeof sensorName == "undefined" || sensorName === null || sensorName.trim() === ""
                ? t("Please enter name.")
                : ""
            }
          />
        </Box>
        <Box mt={4}>
          <TextField
            error={typeof sensorSpec == "undefined" || sensorSpec === null || sensorSpec === "" ? true : false}
            id="filled-select-currency"
            select
            label={t("Sensor spec")}
            value={sensorSpec}
            onChange={(e) => {
              setSensorSpec(e.target.value)
            }}
            helperText={
              typeof sensorSpec == "undefined" || sensorSpec === null || sensorSpec === ""
                ? t("Please select the sensor spec")
                : ""
            }
            variant="filled"
          >
            {!!sensorSpecs &&
              sensorSpecs.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {t(option.id.replace("lamp.", ""))}
                </MenuItem>
              ))}
          </TextField>
        </Box>
        <Box textAlign="center" mt={2}>
          <Button
            onClick={() => (selectedSensor ? updateSensor() : saveSensor())}
            disabled={!validate()}
            className={!validate() ? classes.disabled + " " + classes.PopupButton : classes.PopupButton}
          >
            <Typography className={classes.buttonText}>{selectedSensor ? t("Update") : t("Add")}</Typography>
          </Button>
        </Box>
      </div>
    </Dialog>
  )
}
