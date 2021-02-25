import React, { useState, useEffect } from "react"
import { Box, Popover, MenuItem, Fab, Typography, IconButton, Icon } from "@material-ui/core"

import { ReactComponent as AddIcon } from "../../../icons/plus.svg"
import LAMP from "lamp-core"
import { makeStyles, Theme, createStyles, MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles"
import { ReactComponent as Filter } from "../../../icons/Filter.svg"
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown"
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp"
import MultipleSelect from "../../MultipleSelect"
import { useTranslation } from "react-i18next"
// import AddUser from "./AddUser"
// import StudyCreator from "./StudyCreator"
import { useSnackbar } from "notistack"
import { saveAs } from "file-saver"
import AddActivity from "./AddActivity"
import StudyFilter from "../ParticipantList/StudyFilter"
import {
  unspliceActivity,
  unspliceTipsActivity,
  spliceActivity,
  spliceCTActivity,
  updateActivityData,
  saveGroupActivity,
  saveTipActivity,
  saveSurveyActivity,
  saveCTestActivity,
} from "../ActivityList/Index"
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

export default function ExportActivities({ activities, ...props }) {
  const [showFilter, setShowFilter] = useState(false)
  const classes = useStyles()
  const { t, i18n } = useTranslation()
  const [selectedStudies, setSelectedStudies] = useState([])
  const [addStudy, setAddStudy] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [addUser, setAddUser] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  // useEffect(() => {
  //   ;(async () => {
  //     let studies: any = await LAMP.Study.allByResearcher(researcher.id).then(async (res) => {
  //       return await Promise.all(
  //         res.map(async (x) => ({
  //           id: x.id,
  //           name: x.name,
  //           count: (await LAMP.Participant.allByStudy(x.id)).length,
  //         }))
  //       )
  //     })
  //     studies.sort(function (a, b) {
  //       return a["name"] > b["name"] ? 1 : -1
  //     })
  //     setStudies(studies)
  //     let studiesData = filterStudyData(studies)
  //     setStudiesCount(studiesData)
  //   })()
  // }, [])

  // useEffect(() => {
  //   ;(async() => {
  //     let selectedStudies =
  //     ((await LAMP.Type.getAttachment(researcher.id, "lamp.selectedStudies")) as any).data ??
  //       studies.map((study) => {
  //         return study.name
  //       })
  //    setSelectedStudies(selectedStudies)
  //   })()
  // }, [studies])

  // const filterStudyData = (dataArray) => {
  //   return Object.assign({}, ...dataArray.map((item) => ({ [item.name]: item.count })))
  // }

  // Export a file containing this Study's pre-linked Activity objects.
  const downloadActivities = async (rows) => {
    let data = []
    for (let x of rows) {
      delete x["parent"]
      delete x["parentID"]

      if (x.spec === "lamp.survey") {
        try {
          let res = (await LAMP.Type.getAttachment(x.id, "lamp.dashboard.survey_description")) as any
          let activity = spliceActivity({
            raw: { ...x, tableData: undefined },
            tag: !!res.error ? undefined : res.data,
          })
          data.push(activity)
        } catch (e) {}
      } else if (!["lamp.group", "lamp.survey"].includes(x.spec)) {
        try {
          let res = (await LAMP.Type.getAttachment(x.id, "lamp.dashboard.activity_details")) as any
          let activity = spliceCTActivity({
            raw: { ...x, tableData: undefined },
            tag: !!res.error ? undefined : res.data,
          })
          data.push(activity)
        } catch (e) {}
      } else data.push({ ...x, tableData: undefined })
    }
    _saveFile(data)
    enqueueSnackbar(t("The selected Activities were successfully exported."), {
      variant: "info",
    })
  }

  const _saveFile = (data) =>
    saveAs(
      new Blob([btoa(unescape(encodeURIComponent(JSON.stringify(data))))], {
        type: "text/plain;charset=utf-8",
      }),
      "export.json"
    )

  return (
    <Box>
      <IconButton onClick={downloadActivities}>
        <Icon>cloud_download</Icon>
      </IconButton>
    </Box>
  )
}
