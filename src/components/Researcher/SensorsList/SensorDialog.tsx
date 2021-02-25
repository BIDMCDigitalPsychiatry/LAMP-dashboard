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
        borderRadius: "10px !important",
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
  })
)

export default function SensorDialog({
  sensor,
  studies,
  ...props
}: {
  sensor?: JSON
  studies?: Array<any>
} & DialogProps) {
  const classes = useStyles()
  const [selectedStudy, setSelectedStudy] = useState("")
  const [showErrorMsg, setShowErrorMsg] = useState(false)
  const [studyBtnClicked, setStudyBtnClicked] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const { t, i18n } = useTranslation()
  const [selectedSensor, setSelectedSensor] = useState(null)
  const [sensorName, setSensorName] = useState("")
  const [sensorSpecs, setSensorSpecs] = useState(null)
  const [sensorSpec, setSensorSpec] = useState("")

  const handleChangeStudy = (event) => {
    setShowErrorMsg(false)
    setSelectedStudy(event.target.value)
  }
  useEffect(() => {
    LAMP.SensorSpec.all().then((res) => setSensorSpecs(res))
  }, [])

  const updateSensor = async () => {
    // setLoading(true)
    const result = await LAMP.Sensor.update(selectedSensor.id, {
      name: sensorName,
      spec: sensorSpec,
    })
    enqueueSnackbar(t("Successfully updated a sensor."), {
      variant: "success",
    })
    setSelectedSensor(null)
    // refreshPage()
  }

  const saveSensor = async () => {
    // setLoading(true)
    const result = await LAMP.Sensor.create(selectedStudy, {
      name: sensorName,
      spec: sensorSpec,
    })
    enqueueSnackbar(t("Successfully created a sensor."), {
      variant: "success",
    })
    setSelectedSensor(null)
    // refreshPage()
  }

  return (
    <Dialog {...props} classes={{ paper: classes.popWidth }} aria-labelledby="simple-dialog-title">
      <div>
        <Typography className={classes.dialogTitle}>
          {sensor === null ? t("Add Sensor") : t("Update Sensor")}
        </Typography>
        <Box mt={4}>
          <MuiThemeProvider theme={theme}>
            <TextField
              error={
                typeof selectedStudy == "undefined" || selectedStudy === null || selectedStudy === "" ? true : false
              }
              id="filled-select-currency"
              select
              label={t("Study")}
              value={selectedStudy}
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
                <MenuItem key={option.id} value={option.id}>
                  {t(option.name)}
                </MenuItem>
              ))}
            </TextField>
          </MuiThemeProvider>
        </Box>

        <div className={classes.inputContainer}>
          <div className={classes.contentContainer}>
            <CssTextField
              value={sensorName}
              onChange={(event) => setSensorName(event.target.value)}
              inputProps={{ disableunderline: "true" }}
              placeholder={t("Name")}
            />
          </div>
        </div>
        <Box mt={4}>
          <MuiThemeProvider theme={theme}>
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
          </MuiThemeProvider>
        </Box>
        <Box textAlign="center" mt={2}>
          <Button onClick={() => (sensor === null ? saveSensor() : updateSensor())} className={classes.PopupButton}>
            <Typography className={classes.buttonText}>{sensor === null ? t("Add") : t("Update")}</Typography>
          </Button>
        </Box>
      </div>
    </Dialog>
  )
}
