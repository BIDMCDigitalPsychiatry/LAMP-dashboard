// Core Imports
import React, { useState, useEffect } from "react"
import {
  Box,
  IconButton,
  Icon,
  Button,
  TextField,
  Popover,
  Menu,
  MenuItem,
  Chip,
  Tooltip,
  Grid,
  Fab,
  Container,
  Typography,
  Backdrop,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
} from "@material-ui/core"
import MaterialTable, { MTableToolbar } from "material-table"
import { useSnackbar } from "notistack"
import { ReactComponent as AddIcon } from "../icons/plus.svg"
import { ReactComponent as DeleteIcon } from "../icons/DeleteBlue.svg"
import { ReactComponent as RenameIcon } from "../icons/RenameBlue.svg"
import { ReactComponent as EditIcon } from "../icons/TagBlue.svg"
import { ReactComponent as VpnKeyIcon } from "../icons/EditPasswordBlue.svg"
import { ReactComponent as ExportIcon } from "../icons/Export.svg"
import { green, yellow, red, grey } from "@material-ui/core/colors"
import CloseIcon from "@material-ui/icons/Close"

// External Imports
import { saveAs } from "file-saver"
import JSZip from "jszip"
import jsonexport from "jsonexport"
import TimeAgo from "javascript-time-ago"
import en from "javascript-time-ago/locale/en"
import QRCode from "qrcode.react"
// Local Imports
import LAMP, { Study } from "lamp-core"
import Messages from "./Messages"
import EditUserField from "./EditUserField"
import { CredentialManager } from "./CredentialManager"
import ResponsiveDialog from "./ResponsiveDialog"
import SnackMessage from "./SnackMessage"
import { makeStyles, Theme, createStyles, MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles"
import { ReactComponent as Filter } from "../icons/Filter.svg"
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown"
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp"
import MultipleSelect from "./MultipleSelect"

TimeAgo.addLocale(en)
const timeAgo = new TimeAgo("en-US")

const _qrLink = (credID, password) =>
  window.location.href.split("#")[0] +
  "#/?a=" +
  btoa([credID, password, LAMP.Auth._auth.serverAddress].filter((x) => !!x).join(":"))

const theme = createMuiTheme({
  palette: {
    secondary: {
      main: "#333",
    },
  },
  overrides: {
    MuiTableCell: {
      root: {
        borderBottom: "#fff solid 1px",
        padding: 10,
      },
    },
    MuiToolbar: {
      root: {
        maxWidth: 1055,
        width: "80%",
        margin: "0 auto",
        background: "#fff !important",
      },
    },
    MuiInput: {
      root: {
        border: 0,
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
    MuiIcon: {
      root: { color: "rgba(0, 0, 0, 0.4)" },
    },
  },
})

const useStyles = makeStyles((theme: Theme) =>
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
    studyCode: {
      margin: "4px 0",
      backgroundColor: "#ECF4FF",
      border: "2px solid #FFFFFF",
      color: "#000000",
      maxWidth: 250,
    },
    dataQuality: {
      margin: "4px 0",
      backgroundColor: "#E9F8E7",
      color: "#FFF",
    },
    tableOptions: {
      background: "#ECF4FF",
      padding: "10px 0",
    },
    btnOptions: {
      textTransform: "capitalize",
      color: "#4C66D6",
      margin: "0 45px 0 0",
      "& span": { cursor: "pointer" },
      "& svg": { width: 24, height: 24, fill: "#4C66D6" },
    },
    tableOuter: {
      width: "100vw",
      position: "relative",
      left: "50%",
      right: "50%",
      marginLeft: "-50vw",
      marginRight: "-50vw",
      marginBottom: 30,
      marginTop: -20,
      "& input": {
        width: 350,
        [theme.breakpoints.down("md")]: {
          width: 200,
        },
      },
      "& div.MuiToolbar-root": { maxWidth: 1232, width: "100%", margin: "0 auto" },
      "& h6": { fontSize: 30, fontWeight: 600 },
    },
    tagFiltered: {
      color: "#5784EE",
    },
    tagFilteredBg: {
      color: "#5784EE !important",
      "& path": { fill: "#5784EE !important", fillOpacity: 1 },
    },
    btnFilter: {
      color: "rgba(0, 0, 0, 0.4)",
      fontSize: 14,
      lineHeight: "38px",
      cursor: "pointer",
      textTransform: "capitalize",
      boxShadow: "none",
      background: "transparent",
      margin: "0 30px",
      paddingRight: 0,
      "& svg": { marginRight: 10 },
    },
    tableContainerWidth: {
      maxWidth: 1055,
      width: "80%",
    },
    disabledButton: {
      color: "#4C66D6 !important",
      opacity: 0.5,
    },
    customPopover: { backgroundColor: "rgba(0, 0, 0, 0.4)" },
    customPaper: {
      maxWidth: 380,
      marginTop: 75,
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
    popexpand: {
      backgroundColor: "#fff",
      color: "#618EF7",
      zIndex: 11111,
      "& path": { fill: "#618EF7" },
      "&:hover": { backgroundColor: "#f3f3f3" },
    },
    deleteBtn: { background: "#7599FF", color: "#fff", "&:hover": { background: "#5680f9" } },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
    dataGreen: { backgroundColor: "#e0ffe1 !important", color: "#4caf50" },
    dataYellow: { backgroundColor: "#fff8bc !important", color: "#a99700" },
    dataRed: { backgroundColor: "#ffcfcc !important", color: "#f44336" },
    dataGrey: { backgroundColor: "#d4d4d4 !important", color: "#424242" },
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    activityContent: {
      padding: "25px 50px 0",
    },
    errorMsg: { color: "#FF0000", fontSize: 12 },
    studyOption: { width: "100%" },
    addNewDialog: { maxWidth: 350 },
  })
)

function StudyCreator({ addStudy, setAddStudy, createStudy, studies, ...props }) {
  const [studyName, setStudyName] = useState("")
  const classes = useStyles()
  const [duplicateCnt, setCount] = useState(0)

  const validate = () => {
    return (
      duplicateCnt == 0 ||
      typeof studyName === "undefined" ||
      (typeof studyName !== "undefined" && studyName?.trim() === "")
    )
  }

  useEffect(() => {
    let duplicateCount = 0
    if (!(typeof studyName === "undefined" || (typeof studyName !== "undefined" && studyName?.trim() === ""))) {
      duplicateCount = studies.filter((study) => study.name?.trim().toLowerCase() === studyName?.trim().toLowerCase())
        .length
    }
    setCount(duplicateCount)
  }, [studyName])

  return (
    <Dialog
      open={addStudy}
      onClose={() => {
        setStudyName("")
        setAddStudy(false)
      }}
      onEnter={() => setStudyName("")}
      scroll="paper"
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
      classes={{ paper: classes.addNewDialog }}
    >
      <DialogTitle id="alert-dialog-slide-title">
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={() => {
            setStudyName("")
            setAddStudy(false)
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers={false} classes={{ root: classes.activityContent }}>
        <TextField
          error={!validate()}
          autoFocus
          fullWidth
          variant="filled"
          label="Name"
          defaultValue={studyName}
          onChange={(e) => {
            setStudyName(e.target.value)
          }}
          inputProps={{ maxLength: 80 }}
          helperText={duplicateCnt > 0 ? "Unique name required" : ""}
        />
      </DialogContent>
      <DialogActions>
        <Box textAlign="center" width={1} mt={3} mb={3}>
          <Button
            onClick={() => {
              setAddStudy(false)
              createStudy(studyName)
            }}
            color="primary"
            autoFocus
            disabled={!validate()}
          >
            Save
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}

// TODO: Traffic Lights with Last Survey Date + Login+device + # completed events
export default function ParticipantList({
  studyID,
  title,
  onParticipantSelect,
  showUnscheduled,
  researcher,
  ...props
}) {
  const [state, setState] = useState({
    popoverAttachElement: null,
    selectedIcon: null,
    newCount: 0,
    selectedRows: [],
    addUser: false,
  })

  const classes = useStyles()
  const [participants, setParticipants] = useState([])
  const [openMessaging, setOpenMessaging] = useState()
  const [openPasswordReset, setOpenPasswordReset] = useState()
  const [editData, setEditData] = useState(false)
  const [editUserId, setEditUserId] = useState("")
  const [aliasName, setAliasName] = useState("")
  const [showFilter, setShowFilter] = useState(false)
  const [tagData, setTagData] = useState([])
  const [tagArray, setTagArray] = useState([])
  const [logins, setLogins] = useState({})
  const [passive, setPassive] = useState({})
  const [studiesCount, setStudiesCount] = useState({})
  const [nameArray, setNameArray] = useState([])
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedStudy, setSelectedStudy] = useState("")
  const [showErrorMsg, setShowErrorMsg] = useState(false)
  const [studyBtnClicked, setStudyBtnClicked] = useState(false)
  const [addStudy, setAddStudy] = useState(false)

  useEffect(() => {
    refreshPage()
  }, [])

  const refreshPage = async () => {
    ;(async () => {
      setLoading(true)
      let studies: any = await LAMP.Study.allByResearcher(researcher.id).then(async (res) => {
        return await Promise.all(
          res.map(async (x) => ({
            id: x.id,
            name: x.name,
            count: (await LAMP.Participant.allByStudy(x.id)).length,
          }))
        )
      })
      setTagData(studies)
      let studiesData = filterStudyData(studies)
      setStudiesCount(studiesData)
    })()
  }

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      let selectedStudies =
        ((await LAMP.Type.getAttachment(researcher.id, "lamp.selectedStudies")) as any).data ??
        tagData.map((study) => {
          return study.name
        })
      let selStudies =
        selectedStudies.length > 0
          ? selectedStudies
          : tagData.map((study) => {
              return study.name
            })
      setTagArray(selStudies)
    })()
  }, [tagData])

  useEffect(() => {
    setLoading(true)
    ;(async () => {
      await onLoadParticipantStudy(tagData)
      setLoading(false)
    })()
  }, [tagArray])

  const onLoadParticipantStudy = async (study) => {
    let filteredStudy = study.filter(function (e) {
      return this.indexOf(e.name) >= 0
    }, tagArray)
    if (filteredStudy.length == 0) {
      setParticipants([])
    } else {
      let participantFormat = await getParticipantsData(filteredStudy)
      let participantArray = participantFormat
      let participantNameArray = await Promise.all(
        participantArray.map(async (x) => ({
          id: x.id,
          name: ((await LAMP.Type.getAttachment(x.id, "lamp.name")) as any).data ?? "",
        }))
      )
      let obj = []
      participantNameArray.forEach(function (res) {
        obj[res["id"]] = res["name"]
      })
      setNameArray(obj)
    }
  }

  const onChangeParticipantStudy = async (study, type = "") => {
    let filteredStudy = tagData.filter(function (e) {
      return this.indexOf(e.name) >= 0
    }, tagArray)
    if (filteredStudy.length > 0) {
      let participantFormat = await getParticipantsData(filteredStudy)
      if (participantFormat.length === 0) {
        setParticipants([])
      }
    } else {
      setParticipants([])
    }
    setLoading(false)
  }

  const generateStudyFilter = async (researcher) => {
    let studies: any = await LAMP.Study.allByResearcher(researcher.id).then(async (res) => {
      return await Promise.all(
        res.map(async (x) => ({
          id: x.id,
          name: x.name,
          count: (await LAMP.Participant.allByStudy(x.id)).length,
        }))
      )
    })
    setTagData(studies)
    let studiesData = filterStudyData(studies)
    setStudiesCount(studiesData)
  }

  const participantFormatData = (participantFormat) => {
    let participantArray = []
    let k = 0
    participantFormat.forEach((eachParticipant) => {
      eachParticipant.participant.forEach((innerObj) => {
        innerObj.study = eachParticipant.study
        innerObj.tableData = { id: k }
        participantArray.push(innerObj)
        k++
      })
    })
    return participantArray
  }

  const getParticipantsData = async (filteredStudy) => {
    let participantFormat = await Promise.all(
      filteredStudy.map(async (x) => ({
        id_0: x.id,
        study: x.name,
        participant: await LAMP.Participant.allByStudy(x.id),
      }))
    )
    let participantFormatArray = await participantFormatData(participantFormat)
    let participantArray = [].concat(...participantFormatArray)
    setParticipants(participantArray)
    setLoading(false)
    let participantNameArray = await Promise.all(
      participantArray.map(async (x) => ({
        id: x.id,
        name: ((await LAMP.Type.getAttachment(x.id, "lamp.name")) as any).data ?? "",
      }))
    )
    let obj = []
    participantNameArray.forEach(function (res) {
      obj[res["id"]] = res["name"]
    })
    setNameArray(obj)
    return participantFormatArray
  }

  useEffect(() => {
    ;(async function () {
      let data = await Promise.all(
        participants.map(async (x) => ({
          id: x.id,
          res: (await LAMP.SensorEvent.allByParticipant(x.id, "lamp.analytics", undefined, undefined, 1)) ?? [],
          passive: {
            gps:
              (await LAMP.SensorEvent.allByParticipant(x.id, "lamp.gps", undefined, undefined, 5)).slice(-1)[0] ??
              (await LAMP.SensorEvent.allByParticipant(x.id, "beiwe.gps", undefined, undefined, 5)).slice(-1)[0] ??
              [],
            accel:
              (await LAMP.SensorEvent.allByParticipant(x.id, "lamp.accelerometer", undefined, undefined, 5)).slice(
                -1
              )[0] ??
              (await LAMP.SensorEvent.allByParticipant(x.id, "beiwe.accelerometer", undefined, undefined, 5)).slice(
                -1
              )[0] ??
              [],
          },
        }))
      )
      let filteredSensors = data.filter((y) => y.res.length > 0)
      setLogins((logins) => filteredSensors.reduce((prev, curr) => ({ ...prev, [curr.id]: curr.res.shift() }), logins))
      setPassive((passive) => data.reduce((prev, curr) => ({ ...prev, [curr.id]: curr.passive }), setPassive))
    })()
  }, [participants])

  let addParticipant = async () => {
    if (selectedStudy && selectedStudy === "") {
      setShowErrorMsg(true)
      return false
    } else {
      setStudyBtnClicked(true)
      let newCount = 1
      let ids = []
      for (let i = 0; i < newCount; i++) {
        let idData = ((await LAMP.Participant.create(selectedStudy, { study_code: "001" } as any)) as any).data
        let id = typeof idData === "object" ? idData.id : idData
        if (!!((await LAMP.Credential.create(id, `${id}@lamp.com`, id, "Temporary Login")) as any).error) {
          enqueueSnackbar(`Could not create credential for ${id}.`, { variant: "error" })
        } else {
          generateStudyFilter(researcher)
          enqueueSnackbar(
            `Successfully created Participant ${id}. Tap the expand icon on the right to see credentials and details.`,
            {
              variant: "success",
              persist: true,
              content: (key: string, message: string) => (
                <SnackMessage id={key} message={message}>
                  <TextField variant="outlined" size="small" label="Temporary email address" value={`${id}@lamp.com`} />
                  <Box style={{ height: 16 }} />
                  <TextField variant="outlined" size="small" label="Temporary password" value={`${id}`} />
                  <Grid item>
                    <TextField
                      fullWidth
                      label="One-time login link"
                      style={{ marginTop: 16 }}
                      variant="outlined"
                      value={_qrLink(`${id}@lamp.com`, id)}
                      onChange={(event) => {}}
                    />
                    <Tooltip title="Scan this QR code on a mobile device to automatically open a patient dashboard.">
                      <Grid container justify="center" style={{ padding: 16 }}>
                        <QRCode size={256} level="H" value={_qrLink(`${id}@lamp.com`, id)} />
                      </Grid>
                    </Tooltip>
                  </Grid>
                </SnackMessage>
              ),
            }
          )
        }
        ids = [...ids, id]
      }
      onChangeParticipantStudy(tagArray, "add")
      setState((state) => ({
        ...state,
        popoverAttachElement: null,
        newCount: 1,
        selectedIcon: "",
        selectedRows: [],
        addUser: false,
      }))
      setOpenDialog(false)
    }
  }

  let downloadFiles = async (filetype) => {
    setLoading(true)
    let selectedRows = state.selectedRows
    setState({
      ...state,
      popoverAttachElement: null,
      selectedIcon: "",
      selectedRows: [],
    })
    let zip = new JSZip()
    for (let row of selectedRows) {
      let sensorEvents = await LAMP.SensorEvent.allByParticipant(row.id)
      let activityEvents = await LAMP.ActivityEvent.allByParticipant(row.id)
      if (filetype === "json") {
        zip.file(`${row.id}/sensor_event.json`, JSON.stringify(sensorEvents))
        zip.file(`${row.id}/result_event.json`, JSON.stringify(activityEvents))
      } else if (filetype === "csv") {
        jsonexport(JSON.parse(JSON.stringify(sensorEvents)), function (err, csv) {
          if (err) return console.log(err)
          zip.file(`${row.id}/sensor_event.csv`, csv)
        })
        jsonexport(JSON.parse(JSON.stringify(activityEvents)), function (err, csv) {
          if (err) return console.log(err)
          zip.file(`${row.id}/result_event.csv`, csv)
        })
      }
    }
    setLoading(false)
    zip.generateAsync({ type: "blob" }).then((x) => saveAs(x, "export.zip"))
  }

  let deleteParticipants = async () => {
    setLoading(true)
    setState((state) => ({
      ...state,
      popoverAttachElement: null,
      selectedIcon: "",
    }))
    let selectedRows = state.selectedRows // tempRows = selectedRows.map(y => y.id)
    for (let row of selectedRows) await LAMP.Participant.delete(row.id)
    onChangeParticipantStudy(tagArray, "delete")
    setState((state) => ({
      ...state,
      selectedRows: [],
    }))
    generateStudyFilter(researcher)
    setLoading(false)
  }

  const daysSinceLast = (id) => ({
    gpsString: passive[id]?.gps?.timestamp
      ? timeAgo.format(new Date(((passive[id] || {}).gps || {}).timestamp))
      : "Never",
    accelString: passive[id]?.accel?.timestamp
      ? timeAgo.format(new Date(((passive[id] || {}).accel || {}).timestamp))
      : "Never",
    gps:
      (new Date().getTime() - new Date(parseInt(((passive[id] || {}).gps || {}).timestamp)).getTime()) /
      (1000 * 3600 * 24),
    accel:
      (new Date().getTime() - new Date(parseInt(((passive[id] || {}).accel || {}).timestamp)).getTime()) /
      (1000 * 3600 * 24),
  })

  const dataQuality = (id) => ({
    title: `GPS: ${daysSinceLast(id).gpsString}, Accelerometer: ${daysSinceLast(id).accelString}`,
    class:
      daysSinceLast(id).gps <= 2 && daysSinceLast(id).accel <= 2
        ? classes.dataGreen
        : daysSinceLast(id).gps <= 7 || daysSinceLast(id).accel <= 7
        ? classes.dataYellow
        : daysSinceLast(id).gps <= 30 || daysSinceLast(id).accel <= 30
        ? classes.dataRed
        : classes.dataGrey,
  })

  const dateInfo = (id) => ({
    relative: timeAgo.format(new Date(parseInt((logins[id] || {}).timestamp))),
    absolute: new Date(parseInt((logins[id] || {}).timestamp)).toLocaleString("en-US", Date.formatStyle("medium")),
    device: (logins[id] || { data: {} }).data.device_type || "an unknown device",
    userAgent: (logins[id] || { data: {} }).data.user_agent || "unknown device model",
  })

  const saveSelectedUserState = (type, rows, event) => {
    setState((state) => ({
      ...state,
      popoverAttachElement: event.currentTarget.parentNode,
      selectedIcon: type,
      selectedRows: rows,
    }))
  }

  const editNameTextField = (selectedRows, event) => {
    setEditData(true)
    setEditUserId(selectedRows.id)
  }

  const updateName = (data) => {
    setEditData(false)
    setAliasName(data)
    let oldNameArray = Object.assign({}, nameArray)
    oldNameArray[editUserId] = data
    setNameArray(oldNameArray)
  }

  const filterStudyData = (dataArray) => {
    return Object.assign({}, ...dataArray.map((item) => ({ [item.name]: item.count })))
  }

  const userAgentConcat = (userAgent) => {
    let appVersion = userAgent.hasOwnProperty("app_version") ? userAgent.app_version : ""
    let osVersion = userAgent.hasOwnProperty("os_version") ? userAgent.os_version : ""
    let deviceName = userAgent.hasOwnProperty("deviceName") ? userAgent.deviceName : ""
    let model = userAgent.hasOwnProperty("model") ? userAgent.model : ""
    return "App Version: " + appVersion + " OS Version: " + osVersion + " DeviceName:" + deviceName + " Model:" + model
  }
  const createStudy = async (studyName: string) => {
    setAddStudy(false)
    setLoading(true)
    let study = new Study()
    study.name = studyName
    await LAMP.Study.create(researcher.id, study)
    refreshPage()
    enqueueSnackbar(`Successfully created new study - ${studyName}.`, { variant: "success" })
  }

  const handleClose = () => {
    setOpenDialog(false)
  }

  const handleChangeStudy = (event) => {
    setShowErrorMsg(false)
    setSelectedStudy(event.target.value)
  }

  return (
    <React.Fragment>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <MuiThemeProvider theme={theme}>
        <Box className={classes.tableContainer}>
          <MaterialTable
            title={"Patients"}
            data={participants}
            columns={[
              {
                title: "Name",
                field: "id",
                render: (x) => (
                  <div>
                    {editData && x.id === editUserId ? (
                      <EditUserField
                        participant={x}
                        editData={editData}
                        editUserId={editUserId}
                        updateName={updateName}
                      />
                    ) : aliasName && editUserId === x.id ? (
                      aliasName
                    ) : nameArray[x.id] ? (
                      nameArray[x.id]
                    ) : (
                      x.id
                    )}
                  </div>
                ),
              },
              {
                title: "Last Active",
                field: "last_active",
                searchable: false,
                render: (rowData) => (
                  <Tooltip
                    title={
                      <span>
                        {dateInfo(rowData.id).absolute}
                        <br />
                        {typeof dateInfo(rowData.id).userAgent === "object"
                          ? userAgentConcat(dateInfo(rowData.id).userAgent)
                          : dateInfo(rowData.id).userAgent}
                      </span>
                    }
                  >
                    <span>
                      {dateInfo(rowData.id).relative !== "in NaN years" &&
                        `${dateInfo(rowData.id).relative} on ${dateInfo(rowData.id).device}`}
                    </span>
                  </Tooltip>
                ),
              },
              {
                title: "Indicators",
                field: "data_health",
                searchable: false,
                render: (rowData) => (
                  <Box>
                    <Tooltip title={dataQuality(rowData.id).title}>
                      <Chip
                        label="Data Quality"
                        className={classes.dataQuality + " " + dataQuality(rowData.id).class}
                      />
                    </Tooltip>
                  </Box>
                ),
              },
              {
                title: "Study",
                field: "study",
                searchable: false,
                render: (rowData) => (
                  <Tooltip title={rowData.study}>
                    <Chip label={rowData.study ? rowData.study : ""} className={classes.studyCode} />
                  </Tooltip>
                ),
              },
            ]}
            detailPanel={(rowData) => (
              <Messages
                refresh
                participant={participants[rowData.tableData.id].id}
                msgOpen={false}
                participantOnly={false}
              />
            )}
            onRowClick={(event, rowData, togglePanel) => {
              onParticipantSelect(participants[rowData.tableData.id].id)
            }}
            localization={{
              body: {
                emptyDataSourceMessage: "", //"No Participants. Add Participants by clicking the [+] button above.",
                editRow: {
                  deleteText: "Are you sure you want to delete this Participant?",
                },
              },
              toolbar: {
                nRowsSelected: "Patients",
              },
            }}
            options={{
              selection: true,
              actionsColumnIndex: -1,
              paging: false,
              search: true,
              searchFieldStyle: {
                borderRadius: 25,
                backgroundColor: "#F8F8F8",
                padding: 8,
              },
              headerStyle: {
                fontWeight: 700,
                textTransform: "uppercase",
              },
              rowStyle: (rowData) => ({
                backgroundColor: rowData.tableData.checked
                  ? "#ECF4FF"
                  : rowData.tableData.id % 2 === 0
                  ? "#FFF"
                  : "#F8F8F8",
              }),
            }}
            components={{
              Actions: (props) => {
                return (
                  <div>
                    <Fab
                      variant="extended"
                      className={classes.btnFilter + " " + (showFilter === true ? classes.tagFilteredBg : "")}
                      onClick={() => {
                        showFilter === true ? setShowFilter(false) : setShowFilter(true)
                      }}
                    >
                      <Filter /> Filter results {showFilter === true ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                    </Fab>
                    <Fab
                      variant="extended"
                      color="primary"
                      classes={{ root: classes.btnBlue + " " + (state.addUser ? classes.popexpand : "") }}
                      onClick={(event) => {
                        setState((state) => ({
                          ...state,
                          popoverAttachElement: event.currentTarget,
                          selectedIcon: "add",
                          selectedRows: [],
                          addUser: true,
                        }))
                      }}
                    >
                      <AddIcon /> Add
                    </Fab>
                  </div>
                )
              },
              Container: (props) => <Box {...props} />,
              Toolbar: (props) => (
                <div className={classes.tableOuter}>
                  <MTableToolbar {...props} />
                  {showFilter === true ? (
                    <Box mt={1}>
                      {
                        <MultipleSelect
                          selected={tagArray}
                          items={(tagData || []).map((x) => `${x.name}`)}
                          showZeroBadges={false}
                          badges={studiesCount}
                          onChange={(x) => {
                            LAMP.Type.setAttachment(researcher.id, "me", "lamp.selectedStudies", x)
                            setTagArray(x)
                          }}
                        />
                      }
                    </Box>
                  ) : (
                    ""
                  )}
                  <Box borderTop={1} borderColor="grey.400" mt={3}></Box>
                  {props.selectedRows.length > 0 ? (
                    <Box display="flex" className={classes.tableOptions}>
                      <Container className={classes.tableContainerWidth}>
                        <Box display="flex">
                          <Box>
                            <Button
                              disabled={props.selectedRows.length > 1 ? true : false}
                              classes={{ root: classes.btnOptions, disabled: classes.disabledButton }}
                              onClick={(event) => {
                                editNameTextField(props.selectedRows[0], event)
                              }}
                              startIcon={<RenameIcon />}
                            >
                              Rename
                            </Button>
                          </Box>
                          <Box>
                            <Button
                              disabled={props.selectedRows.length > 1 ? true : false}
                              classes={{ root: classes.btnOptions, disabled: classes.disabledButton }}
                              onClick={() => {
                                setOpenPasswordReset(props.selectedRows[0].id)
                              }}
                              startIcon={<VpnKeyIcon />}
                            >
                              Edit password
                            </Button>
                          </Box>
                          <Box>
                            <Button
                              className={classes.btnOptions}
                              onClick={(event) => {
                                saveSelectedUserState("delete", props.selectedRows, event)
                              }}
                              startIcon={<DeleteIcon />}
                            >
                              Delete
                            </Button>
                          </Box>
                          <Box>
                            <Button
                              className={classes.btnOptions}
                              onClick={(event) => {
                                saveSelectedUserState("download", props.selectedRows, event)
                              }}
                              startIcon={<ExportIcon />}
                            >
                              Export
                            </Button>
                          </Box>
                        </Box>
                      </Container>
                    </Box>
                  ) : (
                    ""
                  )}
                </div>
              ),
            }}
          />
        </Box>
      </MuiThemeProvider>
      <Popover
        classes={{ root: classes.customPopover, paper: classes.customPaper }}
        open={Boolean(state.popoverAttachElement)}
        anchorPosition={!!state.popoverAttachElement && state.popoverAttachElement.getBoundingClientRect()}
        anchorReference="anchorPosition"
        onClose={() => setState((state) => ({ ...state, popoverAttachElement: null, addUser: false }))}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {state.selectedIcon === "download" ? (
          <React.Fragment>
            <MenuItem onClick={() => downloadFiles("csv")}>CSV</MenuItem>
            <MenuItem onClick={() => downloadFiles("json")}>JSON</MenuItem>
          </React.Fragment>
        ) : state.selectedIcon === "add" ? (
          <React.Fragment>
            <MenuItem
              onClick={() => {
                setOpenDialog(true)
                setShowErrorMsg(false)
                setStudyBtnClicked(false)
                setState((state) => ({ ...state, popoverAttachElement: null, addUser: false }))
              }}
            >
              <Typography variant="h6">New patient</Typography>
              <Typography variant="body2">Create a new entry in this group.</Typography>
            </MenuItem>
            <MenuItem
              onClick={() => {
                setState((state) => ({ ...state, popoverAttachElement: null }))
                setAddStudy(true)
              }}
            >
              <Typography variant="h6">Add a new study</Typography>
              <Typography variant="body2">Create a new study.</Typography>
            </MenuItem>
          </React.Fragment>
        ) : state.selectedIcon === "delete" ? (
          <Box style={{ padding: "20px" }}>
            <Button variant="contained" className={classes.deleteBtn} onClick={deleteParticipants}>
              Are you sure you want to delete these participants?
            </Button>
          </Box>
        ) : (
          <Box />
        )}
      </Popover>
      <StudyCreator addStudy={addStudy} setAddStudy={setAddStudy} studies={tagData} createStudy={createStudy} />

      <Dialog
        open={openDialog}
        onClose={handleClose}
        scroll="paper"
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        classes={{ paper: classes.addNewDialog }}
      >
        <DialogTitle id="alert-dialog-slide-title">
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={handleClose}
            disabled={!!studyBtnClicked ? true : false}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers={false} classes={{ root: classes.activityContent }}>
          <Box mt={2} mb={3}>
            <Typography variant="body2">Choose the Study you want to save this participant.</Typography>
          </Box>

          <Typography variant="caption">Study</Typography>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={selectedStudy}
            onChange={handleChangeStudy}
            className={classes.studyOption}
          >
            {tagData.map((study) => (
              <MenuItem key={study.id} value={study.id}>
                {study.name}
              </MenuItem>
            ))}
          </Select>

          {!!showErrorMsg ? (
            <Box mt={1}>
              <Typography className={classes.errorMsg}>Select a Study to create a participant.</Typography>
            </Box>
          ) : (
            ""
          )}
        </DialogContent>
        <DialogActions>
          <Box textAlign="center" width={1} mt={3} mb={3}>
            <Button
              onClick={() => addParticipant()}
              color="primary"
              autoFocus
              disabled={!!studyBtnClicked ? true : false}
            >
              Save
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
      <ResponsiveDialog transient animate open={!!openMessaging} onClose={() => setOpenMessaging(undefined)}>
        <Messages participant={openMessaging} participantOnly={false} msgOpen={false} />
      </ResponsiveDialog>
      <ResponsiveDialog transient open={!!openPasswordReset} onClose={() => setOpenPasswordReset(undefined)}>
        <CredentialManager style={{ margin: 16 }} id={openPasswordReset} />
      </ResponsiveDialog>
    </React.Fragment>
  )
}
