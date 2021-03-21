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
} from "@material-ui/core"

import { useSnackbar } from "notistack"
import { ReactComponent as AddIcon } from "../../../icons/plus.svg"

import CloseIcon from "@material-ui/icons/Close"

import QRCode from "qrcode.react"
// Local Imports
import LAMP, { Study } from "lamp-core"

import SnackMessage from "../../SnackMessage"
import { makeStyles, Theme, createStyles, withStyles, createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"

import { useTranslation } from "react-i18next"
import { Service } from "../../DBService/DBService"

import Header from "./Header"
const _qrLink = (credID, password) =>
  window.location.href.split("#")[0] +
  "#/?a=" +
  btoa([credID, password, LAMP.Auth._auth.serverAddress].filter((x) => !!x).join(":"))

const theme = createMuiTheme({
  overrides: {
    MuiFilledInput: {
      root: {
        border: 0,
        backgroundColor: "#f4f4f4",
        borderRadius: "5px !important",
      },
      underline: {
        "&&&:before": {
          borderBottom: "none",
        },
        "&&:after": {
          borderBottom: "none",
        },
      },
    },
    MuiTextField: {
      root: { width: "100%" },
    },
    MuiDivider: {
      root: { margin: "25px 0" },
    },
  },
})

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

    buttonContainer: {
      width: 200,
      height: 50,
      marginTop: 91,
      background: "#7599FF",
      boxShadow: "0px 10px 15px rgba(96, 131, 231, 0.2)",
      borderRadius: 25,
    },
    buttonText: {
      fontWeight: "bold",
      fontSize: 16,
      color: "white",
    },
    padding20: {
      padding: "20px",
    },
    backContainer: {
      width: 200,
      height: 50,
      borderRadius: 25,
      backgroundColor: "transparent",
      marginTop: 10,
      alignItems: "center",
      justifyContent: "center",
      display: "flex",
    },
    backText: {
      fontWeight: "bold",
      fontSize: 16,
      color: "#4C66D6",
    },
    buttonsContainer: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      marginTop: 55,
      marginBottom: 55,
      alignItems: "center",
      justifyContent: "center",
    },
    headerButton: {
      position: "absolute",
      width: 105,
      height: 50,
      right: 60,
      top: 25,
      background: "#7599FF",
      boxShadow: "0px 10px 15px rgba(96, 131, 231, 0.2)",
      borderRadius: 25,
      zIndex: 1111,
      "&:hover": { background: "#5680f9" },
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
    sectionTitle: {
      color: "rgba(0, 0, 0, 0.75)",
      fontSize: 25,
      fontWeight: "bold",
      marginTop: 50,
    },
    inputContainer: {
      backgroundColor: "#F5F5F5",
      borderRadius: 10,
      marginTop: 17,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: 60,
      paddingRight: 20,
      paddingLeft: 20,
    },
    inputDescription: {
      fontSize: 12,
      color: "rgba(0, 0, 0, 0.5)",
      fontWeight: "bold",
      width: "100%",
      textAlign: "right",
    },
    contentContainer: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
    },
    groupTitle: {
      fontSize: 12,
      color: "rgba(0, 0, 0, 0.4)",
      textTransform: "uppercase",
    },
    rowContainer: {
      display: "flex",
      width: "100%",
      alignItems: "center",
      height: 36,
      fontWeight: 600,
    },
    contentText: {
      color: "rgba(0, 0, 0, 0.75)",
      fontWeight: "bold",
      fontSize: 14,
      marginLeft: 10,
    },
    deleteButton: {
      width: 16,
      height: 16,
      color: "rgba(0, 0, 0, 0.45)",
      marginRight: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    addContainer: {
      display: "flex",
      alignItems: "center",
    },
    addButtonTitle: {
      color: "#5784EE",
      fontWeight: 600,
      fontSize: 14,
    },
    addButton: {
      marginRight: 19,
      color: "#5784EE",
      width: 22,
      height: 22,
      marginLeft: 6,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    popWidth: { width: "95%", maxWidth: "500px", padding: "0 40px" },
    containerWidth: { maxWidth: 1055 },
    inputWidth: { width: "100%" },
    linkBtn: { color: "#6083E7", fontSize: 14, fontWeight: 500, "& svg": { marginRight: 15 } },
    chatDrawerCustom: { minWidth: 411 },
    profileMessage: {
      background: "#7599FF",
      bottom: 30,
      right: 40,
      "&:hover": { background: "#5680f9" },
      "& svg": {
        "& path": { fill: "#fff", fillOpacity: 1 },
      },
    },
    customPopover: { backgroundColor: "rgba(0, 0, 0, 0.4)" },
    customPaper: {
      maxWidth: 380,
      maxHeight: 500,
      marginLeft: 100,
      borderRadius: 10,
      padding: "10px 0",
      "& h6": { fontSize: 16 },
      "& li": {
        display: "inline-block",
        width: "100%",
        padding: "15px 30px",
        "&:hover": { backgroundColor: "#ECF4FF" },
      },
      "& *": { cursor: "pointer" },
    },
    toolbardashboard: {
      minHeight: 100,
      padding: "0 10px",
      "& h5": {
        color: "rgba(0, 0, 0, 0.75)",
        textAlign: "left",
        fontWeight: "600",
        fontSize: 30,
        width: "calc(100% - 96px)",
      },
    },
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

        <MuiThemeProvider theme={theme}>
          <Box mt={4}>
            <TextField
              error={
                typeof selectedStudy == "undefined" || selectedStudy === null || selectedStudy === "" ? true : false
              }
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
              label="Name"
              onChange={(event) => setSensorName(event.target.value)}
              placeholder={t("Name")}
              helperText={
                duplicateCnt > 0
                  ? t("Unique name required")
                  : typeof sensorName == "undefined" || sensorName === null || sensorName.trim() === ""
                  ? t("Please enter Name")
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
        </MuiThemeProvider>
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
