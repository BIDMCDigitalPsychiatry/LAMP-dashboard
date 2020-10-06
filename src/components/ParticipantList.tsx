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

// External Imports
import { saveAs } from "file-saver"
import JSZip from "jszip"
import jsonexport from "jsonexport"
import TimeAgo from "javascript-time-ago"
import en from "javascript-time-ago/locale/en"
import QRCode from "qrcode.react"
// Local Imports
import LAMP from "lamp-core"
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
      sampleStyle: {
        height: "150px",
        width: "150px",
        border: "2px solid red",
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
      dataGreen: {backgroundColor: "#e0ffe1 !important", color: "#4caf50",},
      dataYellow: {backgroundColor: "#fff8bc !important", color: "#a99700",},
      dataRed: {backgroundColor: "#ffcfcc !important", color: "#f44336",},
      dataGrey: {backgroundColor: "#d4d4d4 !important", color: "#424242",},
    })
  )
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
  const [tagIds, setTagIds] = useState([])
  const [studyArray, setStudyArray] = useState([])
  const [logins, setLogins] = useState({})
  const [passive, setPassive] = useState({})
  const [studiesCount, setStudiesCount] = useState({})
  const [nameArray, setNameArray] = useState([])
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = React.useState(true)
  useEffect(() => {
    ;(async () => {
      let participantCount = (await LAMP.Participant.allByStudy(studyID)).length
      let studies: any = await LAMP.Study.allByResearcher(researcher.id).then((res) => {
        return res.map((x) => ({
          id: x.id,
          name: x.name,
          count: participantCount,
        }))
      })
      setTagData(studies)
      let studiesData = filterStudyData(studies)
      setStudiesCount(studiesData)
      let participantData = await LAMP.Participant.allByResearcher(researcher.id).then(async (res: any) => {
        setParticipants(res)
        setLoading(false)
        return await Promise.all(
          res.map(async (x) => ({
            id: x.id,
            name: ((await LAMP.Type.getAttachment(x.id, "lamp.name")) as any).data ?? "",
          }))
        )
      })
      let obj = []
      participantData.forEach(function (res) {
        obj[res["id"]] = res["name"]
      })
      setNameArray(obj)
    })()
  }, [])

  const onChange = () => LAMP.Participant.allByResearcher(researcher.id).then(setParticipants)

  const onStudyChange = (study) => {
    let studyData: any = tagData.filter((order) => order.name === study)
    if (studyData.length > 0) {
      LAMP.Participant.allByStudy(studyData[0].id).then(setParticipants)
    }
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
    let newCount = 1
    let ids = []
    for (let i = 0; i < newCount; i++) {
      let id = ((await LAMP.Participant.create(studyID, { study_code: "001" } as any)) as any).data?.id
      if (!!((await LAMP.Credential.create(id, `${id}@lamp.com`, id, "Temporary Login")) as any).error) {
        enqueueSnackbar(`Could not create credential for ${id}.`, { variant: "error" })
      } else {
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
    onChange()
    setState((state) => ({
      ...state,
      popoverAttachElement: null,
      newCount: 1,
      selectedIcon: "",
      selectedRows: [],
      addUser: false,
    }))
  }

  let downloadFiles = async (filetype) => {
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
    zip.generateAsync({ type: "blob" }).then((x) => saveAs(x, "export.zip"))
  }

  let deleteParticipants = async () => {
    let selectedRows = state.selectedRows // tempRows = selectedRows.map(y => y.id)
    for (let row of selectedRows) await LAMP.Participant.delete(row.id)
    onChange()
    setState((state) => ({
      ...state,
      popoverAttachElement: null,
      selectedIcon: "",
      selectedRows: [],
    }))
  }

  const daysSinceLast = (id) => ({
    gpsString:
      passive[id]?.gps.length > 0 ? timeAgo.format(new Date(((passive[id] || {}).gps || {}).timestamp)) : "Never",
    accelString:
      passive[id]?.accel.length > 0 ? timeAgo.format(new Date(((passive[id] || {}).accel || {}).timestamp)) : "Never",
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

  const updateStudyData = (x) => {
    setTagArray(x)
    if (x.length > 0) {
      onStudyChange(x[0])
    }
  }

  const userAgentConcat = (userAgent) => {
    let appVersion = userAgent.hasOwnProperty("app_version") ? userAgent.app_version : ""
    let osVersion = userAgent.hasOwnProperty("os_version") ? userAgent.os_version : ""
    let deviceName = userAgent.hasOwnProperty("deviceName") ? userAgent.deviceName : ""
    let model = userAgent.hasOwnProperty("model") ? userAgent.model : ""
    return "App Version: " + appVersion + " OS Version: " + osVersion + " DeviceName:" + deviceName + " Model:" + model
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
                  <Tooltip title={title}>
                    <Chip label={title} className={classes.studyCode} />
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
                emptyDataSourceMessage: "No Participants. Add Participants by clicking the [+] button above.",
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
              pageSize: 10,
              pageSizeOptions: [10, 25, 50, 100],
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
                            updateStudyData(x)
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
            <MenuItem onClick={() => addParticipant()}>
              <Typography variant="h6">New patient</Typography>
              <Typography variant="body2">Create a new entry in this group.</Typography>
            </MenuItem>
            <MenuItem>
              <Typography variant="h6">Import patient list</Typography>
              <Typography variant="body2">Add patients from a list or file.</Typography>
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
      <ResponsiveDialog transient animate open={!!openMessaging} onClose={() => setOpenMessaging(undefined)}>
        <Messages participant={openMessaging} participantOnly={false} msgOpen={false} />
      </ResponsiveDialog>
      <ResponsiveDialog transient open={!!openPasswordReset} onClose={() => setOpenPasswordReset(undefined)}>
        <CredentialManager style={{ margin: 16 }} id={openPasswordReset} />
      </ResponsiveDialog>
    </React.Fragment>
  )
}
