// Core Imports
import React, { useState, useEffect } from "react"
import {
  Box,
  IconButton,
  Icon,
  Button,
  TextField,
  Popover,
  AppBar,
  Toolbar,
  Divider,
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
  Switch,
  FormControlLabel,
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
import PatientProfile from "./PatientProfile"
// External Imports
import TimeAgo from "javascript-time-ago"
import en from "javascript-time-ago/locale/en"
import hi from "javascript-time-ago/locale/hi"
import es from "javascript-time-ago/locale/es"
import QRCode from "qrcode.react"
// Local Imports
import LAMP, { Study } from "lamp-core"
import Messages from "./Messages"
import EditUserField from "./EditUserField"
import EditStudyField from "./EditStudyField"
import { CredentialManager } from "./CredentialManager"
import ResponsiveDialog from "./ResponsiveDialog"
import SnackMessage from "./SnackMessage"
import { makeStyles, Theme, createStyles, MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles"
import { ReactComponent as Filter } from "../icons/Filter.svg"
import MultipleSelect from "./MultipleSelect"
import { useTranslation } from "react-i18next"

//TimeAgo.addLocale(en)
//const timeAgo = new TimeAgo("en-US")

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
    switchLabel: { color: "#4C66D6" },

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
      marginLeft: "-50.6vw",
      marginRight: "-50.6vw",
      marginBottom: 30,
      marginTop: -20,
      // paddingTop: 40,
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
      margin: "0 15px",
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
      zIndex: 111111,
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

    manageStudypop: {
      padding: "25px 25px 30px 35px",
    },
    studyList: {
      borderBottom: "#e8e8e8 solid 1px",
    },
    errorMsg: { color: "#FF0000", fontSize: 12 },
    studyOption: { width: "100%" },
    addNewDialog: { maxWidth: 350 },
    manageStudyDialog: { maxWidth: 700 },
    manageStudyBtn: {
      marginRight: 15,
      background: "#7599FF",
      color: "#fff",
      boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.20)",
      "&:hover": { background: "#5680f9" },
    },
    studyName: { maxWidth: 200, minWidth: 200, alignItems: "center", display: "flex" },
  })
)

function StudyCreator({ addStudy, setAddStudy, createStudy, studies, ...props }) {
  const [studyName, setStudyName] = useState("")
  const classes = useStyles()
  const [duplicateCnt, setCount] = useState(0)
  const { t } = useTranslation()
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
          <Icon>close</Icon>
        </IconButton>
      </DialogTitle>
      <DialogContent dividers={false} classes={{ root: classes.activityContent }}>
        <TextField
          error={!validate()}
          autoFocus
          fullWidth
          variant="filled"
          label={t("Name")}
          defaultValue={studyName}
          onChange={(e) => {
            setStudyName(e.target.value)
          }}
          inputProps={{ maxLength: 80 }}
          helperText={duplicateCnt > 0 ? t("Unique name required") : ""}
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
            {t("Save")}
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
  const [active, setActive] = useState({})
  const [studiesCount, setStudiesCount] = useState({})
  const [nameArray, setNameArray] = useState([])
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedStudy, setSelectedStudy] = useState("")
  const [showErrorMsg, setShowErrorMsg] = useState(false)
  const [studyBtnClicked, setStudyBtnClicked] = useState(false)
  const [addStudy, setAddStudy] = useState(false)
  const { t, i18n } = useTranslation()
  const [studyId, setStudyId] = useState(null)
  const [openDialogStudies, setOpenDialogManageStudies] = useState(false)
  const [editStudy, setEditStudy] = useState(false)
  const [editStudyName, setEditStudyName] = useState("")
  const [studyArray, setStudyNameArray] = useState([])
  const [aliasStudyName, setAliasStudyName] = useState("")
  const [participant, setParticipant] = useState(null)
  const [openDialogDeleteStudy, setOpenDialogDeleteStudy] = useState(false)
  const [studyIdDelete, setStudyIdForDelete] = useState("")
  const [participantSettingArray, setParticipantSettingArray] = useState([])
  const [showNotificationColumn, setNotificationColumn] = useState(false)
  const [profileDialog, setProfileDialog] = useState(false)
  const [studies, setStudies] = useState([])

  const getCurrentLanguage = () => {
    let lang
    switch (i18n.language) {
      case "en_US":
        lang = "en-US"
        break
      case "hi_IN":
        lang = "hi-IN"
        break
      case "es_ES":
        lang = "es-ES"
        break
      default:
        lang = "en-US"
        break
    }
    return lang
  }

  const getCurrentLanguageCode = () => {
    let langCode
    switch (i18n.language) {
      case "en_US":
        langCode = en
        break
      case "hi_IN":
        langCode = hi
        break
      case "es_ES":
        langCode = es
        break
      default:
        langCode = en
        break
    }
    return langCode
  }
  const currentLanguage = getCurrentLanguage()
  const currentLanguageCode = getCurrentLanguageCode()
  TimeAgo.addLocale(currentLanguageCode)
  const timeAgo = new TimeAgo(currentLanguage)

  useEffect(() => {
    console.log(profileDialog, participant)
    if (!profileDialog && participant !== null) {
      ;(async () => {
        let name = ((await LAMP.Type.getAttachment(participant.id, "lamp.name")) as any).data ?? ""
        setNameArray({ ...nameArray, [participant.id]: name })
      })()
    }
  }, [profileDialog])

  useEffect(() => {
    refreshPage()
  }, [])

  const refreshPage = async () => {
    ;(async () => {
      setLoading(true)
      let studies: any = await LAMP.Study.allByResearcher(researcher.id).then(async (res) => {
        setStudies(res)
        return await Promise.all(
          res.map(async (x) => ({
            id: x.id,
            name: x.name,
            count: (await LAMP.Participant.allByStudy(x.id)).length,
          }))
        )
      })
      studies.sort(function (a, b) {
        return a["name"] > b["name"] ? 1 : -1
      })
      setTagData(studies)
      let studiesData = filterStudyData(studies)
      setStudiesCount(studiesData)
      let notificationDisplay: any =
        ((await LAMP.Type.getAttachment(researcher.id, "to.unityhealth.psychiatry.enabled")) as any).data ?? ""
      if (notificationDisplay) setNotificationColumn(true)
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
      if (showNotificationColumn === true) {
        let participantSettingArray = await Promise.all(
          participantArray.map(async (x) => ({
            id: x.id,
            settings: ((await LAMP.Type.getAttachment(x.id, "to.unityhealth.psychiatry.settings")) as any).data ?? {
              notification: true,
            },
          }))
        )
        let objNot = []
        participantSettingArray.forEach(function (res) {
          objNot[res["id"]] = res["settings"]
        })
        setParticipantSettingArray(objNot)
      }
    }
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
      eachParticipant.participant.sort(function (a, b) {
        return a["id"] > b["id"] ? 1 : -1
      })
      eachParticipant.participant.forEach((innerObj) => {
        innerObj.study = eachParticipant.study
        innerObj.studyId = eachParticipant.id_0
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
    if (showNotificationColumn === true) {
      let participantSettingsArray = await Promise.all(
        participantArray.map(async (x) => ({
          id: x.id,
          settings: ((await LAMP.Type.getAttachment(x.id, "to.unityhealth.psychiatry.settings")) as any).data ?? {
            notification: true,
          },
        }))
      )
      let objNot = []
      participantSettingsArray.forEach(function (res) {
        objNot[res["id"]] = res["settings"]
      })

      setParticipantSettingArray(objNot)
    }
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
              (await LAMP.SensorEvent.allByParticipant(x.id, "lamp.gps", undefined, undefined, 5)).slice(-1)[0] ?? [],
            accel:
              (await LAMP.SensorEvent.allByParticipant(x.id, "lamp.accelerometer", undefined, undefined, 5)).slice(
                -1
              )[0] ?? [],
          },
          active: (await LAMP.ActivityEvent.allByParticipant(x.id, undefined, undefined, undefined, 1))[0],
        }))
      )
      let filteredSensors = data.filter((y) => y.res.length > 0)
      setLogins((logins) => filteredSensors.reduce((prev, curr) => ({ ...prev, [curr.id]: curr.res.shift() }), logins))
      setPassive((passive) => data.reduce((prev, curr) => ({ ...prev, [curr.id]: curr.passive }), setPassive))
      setActive((active) => data.reduce((prev, curr) => ({ ...prev, [curr.id]: curr.active }), setActive))
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
          enqueueSnackbar(t("Could not create credential for id.", { id: id }), { variant: "error" })
        } else {
          generateStudyFilter(researcher)
          enqueueSnackbar(
            t("Successfully created Participant id. Tap the expand icon on the right to see credentials and details.", {
              id: id,
            }),
            {
              variant: "success",
              persist: true,
              content: (key: string, message: string) => (
                <SnackMessage id={key} message={message}>
                  <TextField
                    variant="outlined"
                    size="small"
                    label={t("Temporary email address")}
                    value={`${id}@lamp.com`}
                  />
                  <Box style={{ height: 16 }} />
                  <TextField variant="outlined" size="small" label={t("Temporary password")} value={`${id}`} />
                  <Grid item>
                    <TextField
                      fullWidth
                      label={t("One-time login link")}
                      style={{ marginTop: 16 }}
                      variant="outlined"
                      value={_qrLink(`${id}@lamp.com`, id)}
                      onChange={(event) => {}}
                    />
                    <Tooltip title={t("Scan this QR code on a mobile device to automatically open a user dashboard.")}>
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
      refreshPage()
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

  let deleteParticipants = async () => {
    setLoading(true)
    setState((state) => ({
      ...state,
      popoverAttachElement: null,
      selectedIcon: "",
    }))
    let selectedRows = state.selectedRows // tempRows = selectedRows.map(y => y.id)
    for (let row of selectedRows) await LAMP.Participant.delete(row.id)
    refreshPage()
    setState((state) => ({
      ...state,
      selectedRows: [],
    }))
    setLoading(false)
  }

  const daysSinceLast = (id) => ({
    gpsString: passive[id]?.gps?.timestamp
      ? timeAgo.format(new Date(((passive[id] || {}).gps || {}).timestamp))
      : t("Never"),
    accelString: passive[id]?.accel?.timestamp
      ? timeAgo.format(new Date(((passive[id] || {}).accel || {}).timestamp))
      : t("Never"),
    gps:
      (new Date().getTime() - new Date(parseInt(((passive[id] || {}).gps || {}).timestamp)).getTime()) /
      (1000 * 3600 * 24),
    accel:
      (new Date().getTime() - new Date(parseInt(((passive[id] || {}).accel || {}).timestamp)).getTime()) /
      (1000 * 3600 * 24),
  })

  const dataQuality = (id) => ({
    title: t("GPS") + `: ${daysSinceLast(id).gpsString}, ` + t("Accelerometer") + `: ${daysSinceLast(id).accelString}`,
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
    relative: (active[id] || {}).timestamp,
    absolute: new Date(parseInt((logins[id] || {}).timestamp)).toLocaleString("en-US", Date.formatStyle("medium")),
    device: (logins[id] || { data: {} }).data.device_type || t("an unknown device"),
    userAgent: (logins[id] || { data: {} }).data.user_agent || t("unknown device model"),
  })

  const saveSelectedUserState = (type, rows, event) => {
    setState((state) => ({
      ...state,
      popoverAttachElement: event.currentTarget.parentNode,
      selectedIcon: type,
      selectedRows: rows,
    }))
  }

  const saveIndividualUserSettings = async (id, val) => {
    setLoading(true)
    let oldSettingArray = Object.assign({}, participantSettingArray)
    oldSettingArray[id] = { ...oldSettingArray[id], notification: val }
    try {
      await LAMP.Type.setAttachment(id, "me", "to.unityhealth.psychiatry.settings", oldSettingArray[id])
      setParticipantSettingArray(oldSettingArray)
    } catch (error) {}
    setLoading(false)
  }

  const editNameTextField = (selectedRows, event) => {
    setEditData(true)
    setEditUserId(selectedRows.id)
  }

  const editStudyField = (selectedRows, event) => {
    setEditStudy(true)
    setEditStudyName(selectedRows)
  }

  const updateName = (data) => {
    setEditData(false)
    setAliasName(data)
    let oldNameArray = Object.assign({}, nameArray)
    oldNameArray[editUserId] = data
    setNameArray(oldNameArray)
    setEditUserId(undefined)
  }

  const updateStudyName = (data) => {
    setEditStudy(false)
    setAliasStudyName(data)
    let oldNameArray = Object.assign({}, studyArray)
    oldNameArray[editStudyName] = data
    setStudyNameArray(oldNameArray)
  }

  const filterStudyData = (dataArray) => {
    return Object.assign({}, ...dataArray.map((item) => ({ [item.name]: item.count })))
  }

  const userAgentConcat = (userAgent) => {
    let appVersion = userAgent.hasOwnProperty("app_version") ? userAgent.app_version : ""
    let osVersion = userAgent.hasOwnProperty("os_version") ? userAgent.os_version : ""
    let deviceName = userAgent.hasOwnProperty("deviceName") ? userAgent.deviceName : ""
    let model = userAgent.hasOwnProperty("model") ? userAgent.model : ""
    return (
      t("App Version:") +
      appVersion +
      " " +
      t("OS Version:") +
      osVersion +
      " " +
      t("DeviceName:") +
      deviceName +
      " " +
      t("Model:") +
      model
    )
  }

  const createStudy = async (studyName: string) => {
    setAddStudy(false)
    setLoading(true)
    let study = new Study()
    study.name = studyName
    await LAMP.Study.create(researcher.id, study)
    refreshPage()
    enqueueSnackbar(t("Successfully created new study - studyName.", { studyName: studyName }), { variant: "success" })
  }

  const handleClose = () => {
    setOpenDialog(false)
  }

  const handleCloseStudies = () => {
    setOpenDialogManageStudies(false)
  }

  const handleCloseDeleteStudy = () => {
    setOpenDialogDeleteStudy(false)
  }

  const handleChangeStudy = (event) => {
    setShowErrorMsg(false)
    setSelectedStudy(event.target.value)
  }

  // Parent Component
  const callbackModal = () => {
    refreshPage()
    setOpenDialogManageStudies(false)
  }

  useEffect(() => {
    let unmounted = false
    refreshPage()
    return () => {
      unmounted = true
    }
  }, [openDialogStudies])
  const deleteStudy = async (studyId: string) => {
    setOpenDialogDeleteStudy(false)
    setOpenDialogManageStudies(false)
    setLoading(true)
    let study_id: any = new Study()
    study_id = studyId
    await LAMP.Study.delete(study_id)
    enqueueSnackbar(t("Successfully deleted study.", { studyId: studyId }), { variant: "success" })
  }

  return (
    <React.Fragment>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <MuiThemeProvider theme={theme}>
        <Box className={classes.tableContainer}>
          <MaterialTable
            title={t("Users")}
            data={participants}
            columns={[
              {
                title: t("Name"),
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
                title: t("User Activity"),
                field: "data_health",
                searchable: false,
                render: (rowData) => (
                  <Box>
                    <Tooltip title={dataQuality(rowData.id).title}>
                      <Chip
                        label={t("Last Passive")}
                        className={classes.dataQuality + " " + dataQuality(rowData.id).class}
                      />
                    </Tooltip>
                    {dateInfo(rowData.id).relative !== "in NaN years" && dateInfo(rowData.id).relative !== undefined ? (
                      <Tooltip
                        title={`${timeAgo.format(new Date(parseInt(dateInfo(rowData.id).relative)))} on ${
                          dateInfo(rowData.id).device
                        } (${dateInfo(rowData.id).absolute} 
                         ${
                           typeof dateInfo(rowData.id).userAgent === "object"
                             ? userAgentConcat(dateInfo(rowData.id).userAgent)
                             : dateInfo(rowData.id).userAgent
                         })`}
                      >
                        <Chip
                          label={t("Last Active")}
                          className={classes.dataQuality + " " + dataQuality(rowData.id).class}
                        />
                      </Tooltip>
                    ) : (
                      <Tooltip title={t("Never")}>
                        <Chip
                          label={t("Last Active")}
                          className={classes.dataQuality + " " + dataQuality(rowData.id).class}
                        />
                      </Tooltip>
                    )}
                  </Box>
                ),
              },
              {
                title: t("Study"),
                field: "study",
                searchable: false,
                render: (rowData) => (
                  <Tooltip title={t(rowData.study)}>
                    <Chip label={rowData.study ? t(rowData.study) : ""} className={classes.studyCode} />
                  </Tooltip>
                ),
              },
              {
                title: t("Notification"),
                field: "notification",
                hidden: !showNotificationColumn,
                searchable: false,
                render: (rowData) => (
                  <Tooltip title={t("Notification")}>
                    {participantSettingArray[rowData.id] === undefined ||
                    participantSettingArray[rowData.id].notification === true ||
                    participantSettingArray[rowData.id] === "" ? (
                      <FormControlLabel
                        control={
                          <Switch
                            checked={true}
                            onChange={(event) => {
                              saveIndividualUserSettings(rowData.id, event.target.checked)
                            }}
                          />
                        }
                        label=""
                        className={classes.switchLabel}
                      />
                    ) : (
                      <FormControlLabel
                        control={
                          <Switch
                            checked={false}
                            onChange={(event) => {
                              saveIndividualUserSettings(rowData.id, event.target.checked)
                            }}
                          />
                        }
                        label=""
                        className={classes.switchLabel}
                      />
                    )}
                  </Tooltip>
                ),
              },
              {
                title: null,
                field: null,
                searchable: false,
                render: (rowData) => (
                  <Tooltip title={t("Update profile")}>
                    <IconButton
                      onClick={() => {
                        setParticipant(participants[rowData.tableData.id])
                        setStudyId(participants[rowData.tableData.id].studyId)
                        setProfileDialog(true)
                      }}
                    >
                      <Icon>settings</Icon>
                    </IconButton>
                  </Tooltip>
                ),
              },
              {
                title: null,
                field: null,
                searchable: false,
                render: (rowData) => (
                  <Tooltip title={t("View as User")}>
                    <IconButton
                      onClick={() => {
                        onParticipantSelect(participants[rowData.tableData.id].id)
                      }}
                    >
                      <Icon>arrow_forward</Icon>
                    </IconButton>
                  </Tooltip>
                ),
              },
            ]}
            localization={{
              body: {
                emptyDataSourceMessage: "", //"No Participants. Add Participants by clicking the [+] button above.",
                editRow: {
                  deleteText: t("Are you sure you want to delete this Participant?"),
                },
              },
              toolbar: {
                nRowsSelected: t("Users"),
                searchPlaceholder: t("Search"),
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
                      <Filter /> {t("Filter results")}{" "}
                      {showFilter === true ? <Icon>arrow_drop_up</Icon> : <Icon>arrow_drop_down</Icon>}
                    </Fab>
                    <Tooltip title="Manage Studies">
                      <IconButton
                        className={classes.manageStudyBtn}
                        onClick={(event) => {
                          setOpenDialogManageStudies(true)
                        }}
                      >
                        <Icon style={{ color: "#FFF" }}>description_outlined</Icon>
                      </IconButton>
                    </Tooltip>
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
                      <AddIcon /> {t("Add")}
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
                              {t("Rename")}
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
                              {t("Edit password")}
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
                              {t("Delete")}
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
        {state.selectedIcon === "add" ? (
          <React.Fragment>
            <MenuItem
              onClick={() => {
                setOpenDialog(true)
                setShowErrorMsg(false)
                setStudyBtnClicked(false)
                setState((state) => ({ ...state, popoverAttachElement: null, addUser: false }))
              }}
            >
              <Typography variant="h6">{t("New user")}</Typography>
              <Typography variant="body2">{t("Create a new entry in this group.")}</Typography>
            </MenuItem>
            <MenuItem
              onClick={() => {
                setState((state) => ({ ...state, popoverAttachElement: null }))
                setAddStudy(true)
              }}
            >
              <Typography variant="h6">{t("Add a new study")}</Typography>
              <Typography variant="body2">{t("Create a new study.")}</Typography>
            </MenuItem>
          </React.Fragment>
        ) : state.selectedIcon === "delete" ? (
          <Box style={{ padding: "20px" }}>
            <Button variant="contained" className={classes.deleteBtn} onClick={deleteParticipants}>
              {t("Are you sure you want to delete these participants?")}
            </Button>
          </Box>
        ) : (
          <Box />
        )}
      </Popover>
      <StudyCreator addStudy={addStudy} setAddStudy={setAddStudy} studies={tagData} createStudy={createStudy} />

      <Dialog
        open={openDialogDeleteStudy}
        onClose={handleCloseDeleteStudy}
        scroll="paper"
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        classes={{ paper: classes.manageStudyDialog }}
      >
        <DialogContent dividers={false} classes={{ root: classes.activityContent }}>
          <Box mt={2} mb={2}>
            {t(
              "Deleting study will delete all users and activities associated with it. Are you sure you want to delete this study?"
            )}
          </Box>
          <DialogActions>
            <Box textAlign="center" width={1} mb={3}>
              <Button onClick={() => deleteStudy(studyIdDelete)} color="primary" autoFocus>
                {t("Delete")}
              </Button>

              <Button
                onClick={() => {
                  handleCloseDeleteStudy()
                }}
              >
                {t("Cancel")}
              </Button>
            </Box>
          </DialogActions>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openDialogStudies}
        onClose={handleCloseStudies}
        scroll="paper"
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        classes={{ paper: classes.manageStudyDialog }}
      >
        <DialogTitle id="alert-dialog-slide-title">
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={handleCloseStudies}
            //disabled={!!studyBtnClicked ? true : false}
          >
            <Icon>close</Icon>
          </IconButton>
        </DialogTitle>
        <DialogContent dividers={false} classes={{ root: classes.manageStudypop }}>
          <Box mb={3}>
            <Typography variant="h5">{t("Manage Studies")}</Typography>
          </Box>
          {tagData.map((study) => (
            <Box display="flex" key={study.id} className={classes.studyList}>
              <Box flexGrow={1} className={classes.studyName}>
                {editStudy && study.id == editStudyName ? (
                  <EditStudyField
                    study={study.id}
                    studyName={study.name}
                    editData={editStudy}
                    editStudyName={editStudyName}
                    updateName={updateStudyName}
                    callbackModal={callbackModal}
                  />
                ) : aliasStudyName && editStudyName === study.id ? (
                  t(aliasStudyName)
                ) : studyArray[study.id] ? (
                  t(studyArray[study.id])
                ) : (
                  t(study.name)
                )}
              </Box>
              <Box>
                <IconButton
                  color="primary"
                  disabled={study.id > 1 ? true : false}
                  classes={{ disabled: classes.disabledButton }}
                  onClick={(event) => {
                    editStudyField(study.id, event)
                  }}
                >
                  <RenameIcon fontSize="small" />
                </IconButton>
              </Box>
              <Box>
                <IconButton
                  color="primary"
                  disabled={study.id > 1 ? true : false}
                  classes={{ disabled: classes.disabledButton }}
                  onClick={() => {
                    setOpenDialogDeleteStudy(true)
                    setStudyIdForDelete(study.id)
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          ))}
        </DialogContent>
      </Dialog>

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
            <Icon>close</Icon>
          </IconButton>
        </DialogTitle>
        <DialogContent dividers={false} classes={{ root: classes.activityContent }}>
          <Box mt={2} mb={3}>
            <Typography variant="body2">{t("Choose the Study you want to save this participant.")}</Typography>
          </Box>

          <Typography variant="caption">{t("Study")}</Typography>
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
              <Typography className={classes.errorMsg}>{t("Select a Study to create a participant.")}</Typography>
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
              {t("Save")}
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
      <ResponsiveDialog fullScreen transient={false} animate open={!!profileDialog}>
        <AppBar position="static" style={{ background: "#FFF", boxShadow: "none" }}>
          <Toolbar className={classes.toolbardashboard}>
            <IconButton onClick={() => setProfileDialog(false)} color="default" aria-label="Menu">
              <Icon>arrow_back</Icon>
            </IconButton>
            <Typography variant="h5">
              {t("Profile")} {participant?.id ?? ""}
            </Typography>
          </Toolbar>
        </AppBar>
        <Divider />
        <Box py={8} px={4}>
          <PatientProfile
            studies={studies}
            studyId={studyId}
            participant={participant}
            name={participant?.id ? nameArray[participant.id] ?? "" : ""}
            onClose={() => setProfileDialog(false)}
          />
        </Box>
      </ResponsiveDialog>
    </React.Fragment>
  )
}
