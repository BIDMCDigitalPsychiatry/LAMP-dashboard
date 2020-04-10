// Core Imports
import React, { useState, useEffect } from "react"
import {
  IconButton,
  Icon,
  Button,
  TextField,
  Popover,
  MenuItem,
  Chip,
  Tooltip,
  Typography,
  Grid,
} from "@material-ui/core"
import { green } from "@material-ui/core/colors"
import MaterialTable from "material-table"
import { useSnackbar } from "notistack"

// External Imports
import { saveAs } from "file-saver"
import JSZip from "jszip"
import jsonexport from "jsonexport"
import TimeAgo from "javascript-time-ago"
import en from "javascript-time-ago/locale/en"
import QRCode from "qrcode.react"

// Local Imports
import LAMP from "../lamp"
import Messages from "./Messages"
import EditField from "./EditField"
import CredentialManager from "./CredentialManager"
import ResponsiveDialog from "./ResponsiveDialog"
import SnackMessage from "./SnackMessage"

TimeAgo.addLocale(en)
const timeAgo = new TimeAgo("en-US")

const _qrLink = (credID, password) =>
  window.location.href.split("#")[0] +
  "#/?a=" +
  btoa(
    [credID, password, LAMP.Auth._auth.serverAddress]
      .filter((x) => !!x)
      .join(":")
  )

// TODO: Traffic Lights with Last Survey Date + Login+device + # completed events

export default function ParticipantList({
  studyID,
  title,
  onParticipantSelect,
  showUnscheduled,
  ...props
}) {
  const [state, setState] = useState({
    popoverAttachElement: null,
    selectedIcon: null,
    newCount: 1,
    selectedRows: [],
  })
  const [participants, setParticipants] = useState([])
  const [openMessaging, setOpenMessaging] = useState()
  const [openPasswordReset, setOpenPasswordReset] = useState()
  const [logins, setLogins] = useState({})
  const { enqueueSnackbar } = useSnackbar()
  useEffect(() => {
    LAMP.Participant.allByStudy(studyID).then(setParticipants)
  }, [])
  const onChange = () =>
    LAMP.Participant.allByStudy(studyID).then(setParticipants)

  useEffect(() => {
    ;(async function () {
      let data = (
        await Promise.all(
          participants.map(async (x) => ({
            id: x.id,
            res:
              (
                await LAMP.SensorEvent.allByParticipant(x.id, "lamp.analytics")
              )?.filter((z) => z.sensor === "lamp.analytics") ?? [],
          }))
        )
      ).filter((y) => y.res.length > 0)
      setLogins((logins) =>
        data.reduce(
          (prev, curr) => ({ ...prev, [curr.id]: curr.res.shift() }),
          logins
        )
      )
    })()
  }, [participants])

  let addParticipant = async () => {
    let newCount = state.newCount
    let ids = []

    for (let i = 0; i < newCount; i++) {
      let id = (await LAMP.Participant.create(studyID, { study_code: "001" }))
        .data
      let tempPassword = id
      if (
        !!(
          await LAMP.Credential.create(
            id,
            `${id}@lamp.com`,
            tempPassword,
            "Temporary Login"
          )
        ).error
      ) {
        enqueueSnackbar(`Could not create credential for ${id}.`, {
          variant: "error",
        })
      } else {
        enqueueSnackbar(
          `Successfully created Participant ${id}. Tap the expand icon on the right to see credentials and details.`,
          {
            variant: "success",
            persist: true,
            content: (key, message) => (
              <SnackMessage id={key} message={message}>
                <TextField
                  variant='outlined'
                  size='small'
                  label='Temporary email address'
                  value={`${id}@lamp.com`}
                />
                <div style={{ height: 16 }} />
                <TextField
                  variant='outlined'
                  size='small'
                  label='Temporary password'
                  value={`${tempPassword}`}
                />
                <Grid item>
                  <TextField
                    fullWidth
                    label='One-time login link'
                    style={{ marginTop: 16 }}
                    variant='outlined'
                    value={_qrLink(`${id}@lamp.com`, tempPassword)}
                    onChange={(event) => {}}
                  />
                  <Tooltip title='Scan this QR code on a mobile device to automatically open a patient dashboard.'>
                    <Grid container justify='center' style={{ padding: 16 }}>
                      <QRCode
                        size={256}
                        level='H'
                        value={_qrLink(`${id}@lamp.com`, tempPassword)}
                      />
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
      let resultEvents = await LAMP.ResultEvent.allByParticipant(row.id)
      if (filetype === "json") {
        zip.file(`${row.id}/sensor_event.json`, JSON.stringify(sensorEvents))
        zip.file(`${row.id}/result_event.json`, JSON.stringify(resultEvents))
      } else if (filetype === "csv") {
        jsonexport(JSON.parse(JSON.stringify(sensorEvents)), function (
          err,
          csv
        ) {
          if (err) return console.log(err)
          zip.file(`${row.id}/sensor_event.csv`, csv)
        })
        jsonexport(JSON.parse(JSON.stringify(resultEvents)), function (
          err,
          csv
        ) {
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

  const dateInfo = (id) => ({
    relative: timeAgo.format(new Date(parseInt((logins[id] || {}).timestamp))),
    absolute: new Date(parseInt((logins[id] || {}).timestamp)).toLocaleString(
      "en-US",
      Date.formatStyle("medium")
    ),
    device:
      (logins[id] || { data: {} }).data.device_type || "an unknown device",
  })

  return (
    <React.Fragment>
      <MaterialTable
        title={title}
        data={participants}
        columns={[
          {
            title: "Name",
            field: "id",
            render: (x) => <EditField participant={x} />,
          },
          {
            title: "Last Active",
            field: "last_active",
            searchable: false,
            render: (rowData) => (
              <Tooltip title={dateInfo(rowData.id).absolute}>
                <span>
                  {dateInfo(rowData.id).relative !== "in NaN years" &&
                    `${dateInfo(rowData.id).relative} on ${
                      dateInfo(rowData.id).device
                    }`}
                </span>
              </Tooltip>
            ),
          },
          {
            title: "Indicators",
            field: "data_health",
            searchable: false,
            render: (rowData) => (
              <div>
                <Tooltip title={"Data is optimal."}>
                  <Chip
                    label='Data Quality'
                    style={{
                      margin: 4,
                      backgroundColor: green[500],
                      color: "#fff",
                    }}
                  />
                </Tooltip>
                <Tooltip title='Reset Password'>
                  <IconButton
                    onClick={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                      setOpenPasswordReset(rowData.id)
                    }}
                  >
                    <Icon>vpn_key</Icon>
                  </IconButton>
                </Tooltip>
              </div>
            ),
          },
        ]}
        detailPanel={(rowData) => (
          <Messages
            refresh
            participant={participants[rowData.tableData.id].id}
          />
        )}
        onRowClick={(event, rowData, togglePanel) =>
          onParticipantSelect(participants[rowData.tableData.id].id)
        }
        actions={[
          {
            icon: "add_box",
            tooltip: "Create",
            isFreeAction: true,
            onClick: (event, rows) =>
              setState((state) => ({
                ...state,
                popoverAttachElement: event.currentTarget.parentNode,
                selectedIcon: "add",
                selectedRows: [],
              })),
          },
          {
            icon: "arrow_downward",
            tooltip: "Export",
            onClick: (event, rows) =>
              setState((state) => ({
                ...state,
                popoverAttachElement: event.currentTarget.parentNode,
                selectedIcon: "download",
                selectedRows: rows,
              })),
          },
          {
            icon: "delete_forever",
            tooltip: "Delete",
            onClick: (event, rows) =>
              setState((state) => ({
                ...state,
                popoverAttachElement: event.currentTarget.parentNode,
                selectedIcon: "delete",
                selectedRows: rows,
              })),
          },
        ]}
        localization={{
          body: {
            emptyDataSourceMessage:
              "No Participants. Add Participants by clicking the [+] button above.",
            editRow: {
              deleteText: "Are you sure you want to delete this Participant?",
            },
          },
        }}
        options={{
          selection: true,
          actionsColumnIndex: -1,
          pageSize: 10,
          pageSizeOptions: [10, 25, 50, 100],
        }}
        components={{ Container: (props) => <div {...props} /> }}
      />
      {/*detailPanel={rowData => 
          <div style={{ margin: 8 }}>
            <Typography style={{ width: '100%', textAlign: 'center' }}>
              <b>Patient Health</b>
            </Typography>
            <Divider style={{ margin: 8 }} />
            <Sparkchips items={
              [ ...(activities || []), { name: 'Environmental Context' }, { name: 'Step Count' }]
                .filter(x => (x.spec !== 'lamp.survey' && !!showUnscheduled) || (x.spec === 'lamp.survey'))
                .map(x => ({ 
                  name: x.name, 
                  color: (x.spec !== 'lamp.survey' ? 
                    grey[700] : (x.name.length % 3 === 0 ? 
                      red[500] : (x.name.length % 3 === 1 ? 
                        yellow[500] : 
                          green[500]))), 
                  textColor: (x.name.length % 3 === 1 && x.spec === 'lamp.survey') ? '#000' : '#fff',
                  tooltip: (x.spec !== 'lamp.survey' ? 
                    'Activity not scheduled or monitored (optional).' : (x.name.length % 3 === 0 ? 
                      'Requires clinical attention.' : (x.name.length % 3 === 1 ? 
                        'Monitor health status for changes.' : 
                          'Health status is okay.')))
                }))
            } />
          </div>
        }*/}
      <Popover
        open={Boolean(state.popoverAttachElement)}
        anchorPosition={
          !!state.popoverAttachElement &&
          state.popoverAttachElement.getBoundingClientRect()
        }
        anchorReference='anchorPosition'
        onClose={() =>
          setState((state) => ({ ...state, popoverAttachElement: null }))
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        {state.selectedIcon === "download" ? (
          <React.Fragment>
            <MenuItem onClick={() => downloadFiles("csv")}>CSV</MenuItem>
            <MenuItem onClick={() => downloadFiles("json")}>JSON</MenuItem>
          </React.Fragment>
        ) : state.selectedIcon === "add" ? (
          <div style={{ padding: "20px" }}>
            <TextField
              label='Number of participants to add:'
              value={state.newCount}
              onChange={(event) =>
                setState({ ...state, newCount: event.target.value })
              }
              type='number'
              InputLabelProps={{
                shrink: true,
              }}
              margin='normal'
            />
            <IconButton
              aria-label='Create'
              color='primary'
              onClick={addParticipant}
            >
              <Icon>check_circle</Icon>
            </IconButton>
          </div>
        ) : state.selectedIcon === "delete" ? (
          <div style={{ padding: "20px" }}>
            <Button
              variant='contained'
              color='secondary'
              onClick={deleteParticipants}
            >
              Are you sure you want to delete these participants?
            </Button>
          </div>
        ) : (
          <div />
        )}
      </Popover>
      <ResponsiveDialog
        transient
        animate
        open={!!openMessaging}
        onClose={() => setOpenMessaging()}
      >
        <Messages participant={openMessaging} />
      </ResponsiveDialog>
      <ResponsiveDialog
        transient
        open={!!openPasswordReset}
        onClose={() => setOpenPasswordReset()}
      >
        <CredentialManager style={{ margin: 16 }} id={openPasswordReset} />
      </ResponsiveDialog>
    </React.Fragment>
  )
}
