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
  DialogContentText,
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
  Card,
  CardHeader,
  Menu,
  CardActions,
  CardContent,
  Grow,
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
import PatientProfile from "../ParticipantList/PatientProfile"
// External Imports
import { saveAs } from "file-saver"
import JSZip from "jszip"
import jsonexport from "jsonexport"
import TimeAgo from "javascript-time-ago"
import en from "javascript-time-ago/locale/en"
import hi from "javascript-time-ago/locale/hi"
import es from "javascript-time-ago/locale/es"
import QRCode from "qrcode.react"
// Local Imports
import LAMP, { Study } from "lamp-core"
import Messages from "../../Messages"

import { CredentialManager } from "../../CredentialManager"
import ResponsiveDialog from "../../ResponsiveDialog"
import SnackMessage from "../../SnackMessage"
import { makeStyles, Theme, createStyles, MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles"
import { ReactComponent as Filter } from "../icons/Filter.svg"
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown"
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp"
import MultipleSelect from "../../MultipleSelect"
import { useTranslation } from "react-i18next"
import MoreVertIcon from "@material-ui/icons/MoreVert"
import CreateIcon from "@material-ui/icons/Create"
import ActivityScheduler from "./ActivityScheduler"
import Activity from "./Activity"
//TimeAgo.addLocale(en)
//const timeAgo = new TimeAgo("en-US")

import Header from "./Header"
import UpdateActivity from "./UpdateActivity"
import { updateActivityData } from "./Index"

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

export default function ActivityItem({ activity, refreshActivities, researcher, studies, activities, ...props }) {
  const classes = useStyles()
  const [deleteConfirmationDialog, setDeleteConfirmationDialog] = useState(false)
  const { t, i18n } = useTranslation()
  const [showScheduler, setShowScheduler] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    ;(async () => {})()
  }, [])

  // Commit an update to an Activity object (ONLY DESCRIPTIONS).
  const updateActivity = async (x, isDuplicated) => {
    let result = await updateActivityData(x, isDuplicated, selectedActivity)
    if (!!result.error)
      enqueueSnackbar(t("Encountered an error: ") + result?.error, {
        variant: "error",
      })
    else
      enqueueSnackbar(t("Successfully updated the Activity."), {
        variant: "success",
      })
    setSelectedActivity(undefined)
  }

  const deleteActivities = async (activities) => {
    for (let activity of activities) {
      let tag
      if (activity.spec === "lamp.survey") {
        tag = await LAMP.Type.setAttachment(activity.id, "me", "lamp.dashboard.survey_description", null)
      } else {
        tag = await LAMP.Type.setAttachment(activity.id, "me", "lamp.dashboard.activity_details", null)
      }
      console.dir("deleted tag " + JSON.stringify(tag))

      let raw = await LAMP.Activity.delete(activity.id)
      // let selectedStudy = studies.filter((study) => study.id === activity.parentID)[0]
      // setStudiesCount({ ...studiesCount, [selectedStudy.name]: --studiesCount[selectedStudy.name] })
      // console.dir(raw)
    }
    enqueueSnackbar(t("Successfully deleted the selected Activities."), {
      variant: "success",
    })
  }

  const updateSchedule = async (x) => {
    let result = await LAMP.Activity.update(x.id, { schedule: x.schedule })
    // onChange()
    setShowScheduler(false)
  }
  return (
    <Card style={{ margin: 20 }}>
      <CardHeader
        title={activity.name}
        subheader={
          <Box>
            <Typography variant="overline">{activity.spec?.replace("lamp.", "")}</Typography>
            <Typography variant="overline">{activity.parent}</Typography>
          </Box>
        }
      />
      <CardContent></CardContent>
      <CardActions>
        <UpdateActivity activity={activity} activities={activities} studies={studies} />

        <Button
          size="small"
          color="primary"
          onClick={() => {
            setShowScheduler(true)
          }}
        >
          Schedule
        </Button>
      </CardActions>

      {!!showScheduler && (
        <Box>
          <IconButton onClick={() => setShowScheduler(false)}>
            <Icon>close</Icon>
          </IconButton>
          <ActivityScheduler activity={activity} onChange={(x) => updateSchedule({ ...activity, schedule: x })} />
        </Box>
      )}
    </Card>
  )
}
