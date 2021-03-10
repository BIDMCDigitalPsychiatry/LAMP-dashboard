import React, { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Grid,
  Button,
  MenuItem,
  TextField,
  InputBase,
  DialogTitle,
  DialogContentText,
  DialogActions,
  Icon,
  IconButton,
  Dialog,
  DialogContent,
  Backdrop,
  CircularProgress,
  InputAdornment,
  ButtonBase,
} from "@material-ui/core"
import { useSnackbar } from "notistack"
import MaterialTable, { MTableToolbar } from "material-table"
import LAMP, { Study } from "lamp-core"
import { makeStyles, Theme, createStyles, withStyles, MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles"
import { ReactComponent as DeleteIcon } from "../icons/DeleteBlue.svg"
import { ReactComponent as RenameIcon } from "../icons/RenameBlue.svg"
import AddCircleOutline from "@material-ui/icons/AddCircleOutline"
import AddSensor from "./AddSensor"
import Header from "./Header"
import { useTranslation } from "react-i18next"
import SensorListItem from "./SensorListItem"
import { Service } from "../../DBService/DBService"

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

    header: {
      "& h5": {
        fontSize: "30px",
        fontWeight: "bold",
      },
    },
    tableContainer: {
      "& div.MuiInput-underline:before": { borderBottom: "0 !important" },
      "& div.MuiInput-underline:after": { borderBottom: "0 !important" },
      "& div.MuiInput-underline": {
        "& span.material-icons": {
          width: 21,
          height: 19,
          fontSize: 27,
          lineHeight: "23PX",
          color: "rgba(0, 0, 0, 0.4)",
        },
        "& button": { display: "none" },
      },
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

export default function SensorsList({ title, researcher, studies, ...props }) {
  const { enqueueSnackbar } = useSnackbar()
  const classes = useStyles()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [sensors, setSensors] = useState(null)
  const [updatedData, setUpdatedData] = useState({})
  const [selectedSensors, setSelectedSensors] = useState<any>([])
  const [search, setSearch] = useState(null)

  const updatedSensor = (data) => {
    if (data.fn_type === "update") {
      let dataSensors = [...sensors]
      let index = dataSensors.findIndex((obj) => obj.id === data.id)
      dataSensors[index].name = data.name
      dataSensors[index].spec = data.spec
      setSensors(dataSensors)
    } else {
      setSensors((prevState) => {
        const tasks = prevState.filter((eachSensor) => eachSensor.id !== data.id)
        return tasks
      })
    }
  }

  const addedSensor = (data) => {
    setSensors((prevState) => [...prevState, data])
  }

  const handleChange = (activity, checked) => {
    let selected = selectedSensors
    if (checked) {
      selected.push(activity)
    } else {
      selected = selected.filter((item) => item.id != activity.id)
    }
    setSelectedSensors(selected)
  }

  const handleDeleted = (val) => {
    if (val) {
      let newSensors = sensors.filter((i) => !selectedSensors.some((j) => j.id === i.id))
      setSensors(newSensors)
    }
  }

  const handleSearchData = (val) => {
    setSearch(val)
    if (val) {
      Service.getDataByKey("sensors", selectedSensors, "study_name").then((sensors) => {
        let newSensors = sensors.filter((i) => i.name.includes(val))
        setSensors(newSensors)
      })
    } else {
      Service.getDataByKey("sensors", selectedSensors, "study_name").then((sensors) => {
        setSensors(sensors)
      })
    }
  }

  const filterStudies = (val) => {
    setSelectedSensors(val)
    if (val) {
      Service.getDataByKey("sensors", val, "study_name").then((sensors) => {
        if (search) {
          let newSensors = sensors.filter((i) => i.name.includes(search))
          setSensors(newSensors)
        } else {
          setSensors(sensors)
        }
      })
    }
  }

  return (
    <React.Fragment>
      {/* 
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      */}
      <Header
        studies={studies}
        researcher={researcher}
        selectedSensors={selectedSensors}
        deleted={handleDeleted}
        addedSensor={addedSensor}
        searchData={handleSearchData}
        filterStudies={filterStudies}
      />
      <Box className={classes.tableContainer} py={4}>
        <Grid container spacing={3}>
          {(sensors ?? []).map((item, index) => (
            <Grid item lg={6} xs={12}>
              <SensorListItem
                sensor={item}
                studies={studies}
                updatedSensor={updatedSensor}
                handleSelectionChange={handleChange}
                selectedSensors={selectedSensors}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </React.Fragment>
  )
}
