
// Core Imports
import React, { useState, useEffect } from 'react'
import IconButton from '@material-ui/core/IconButton'
import Icon from '@material-ui/core/Icon'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Popover from '@material-ui/core/Popover'
import MenuItem from '@material-ui/core/MenuItem'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Chip from '@material-ui/core/Chip'
import Tooltip from '@material-ui/core/Tooltip'
import MaterialTable from 'material-table'
import red from '@material-ui/core/colors/red'
import yellow from '@material-ui/core/colors/yellow'
import green from '@material-ui/core/colors/green'

// External Imports 
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import jsonexport from 'jsonexport'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

// Local Imports
import LAMP from '../lamp'
import Messages from './Messages'
import EditField from './EditField'
import CredentialManager from './CredentialManager'
import { ResponsiveDialog, mediumDateFormat } from './Utils'

TimeAgo.addLocale(en)
const timeAgo = new TimeAgo('en-US')


// TODO: Traffic Lights with Last Survey Date + Login+device + # completed events


export default function ParticipantList({ participants, onChange, onParticipantSelect, studyID, showUnscheduled, ...props }) {
    const [state, setState] = useState({
        popoverAttachElement: null,
        selectedIcon: null,
        newCount: 1,
        selectedRows: []
    })

    const [logins, setLogins] = useState({})
    const [names, setNames] = useState({})

    useEffect(() => {
        (async function() {
            let data = (await Promise.all(participants
                            .map(async x => ({ id: x.id, res: (await LAMP.SensorEvent.allByParticipant(x.id, 'lamp.analytics'))
                                    .filter(z => z.sensor === 'lamp.analytics') }))))
                            .filter(y => y.res.length > 0)
            setLogins(logins => data.reduce((prev, curr) => ({ ...prev, [curr.id]: curr.res.shift() }), logins))
        })()
    }, [participants])

    useEffect(() => {
        (async function() {
            let data = (await Promise.all(participants
                            .map(async x => ({ id: x.id, res: await LAMP.Type.getAttachment(x.id, 'lamp.name') }))))
                            .filter(y => y.res.message === undefined && (typeof y.res.data === 'string') && y.res.data.length > 0)
            setNames(names => data.reduce((prev, curr) => ({ ...prev, [curr.id]: curr.res.data }), names))
        })()
    }, [participants])

    let addParticipant = async () => {
        let newCount = state.newCount
        let ids = []
        for (let i = 0; i < newCount; i ++)
            ids = [...ids, (await LAMP.Participant.create(studyID, { study_code: '001' })).data]
        onChange()
        setState(state => ({ ...state, 
            popoverAttachElement: null, 
            newCount: 1, 
            selectedIcon: "", 
            selectedRows: [] 
        }))
    }

    let downloadFiles = async (filetype) => {
        let selectedRows = state.selectedRows
        setState({ ...state, popoverAttachElement: null, selectedIcon: "", selectedRows: [] })
        let zip = new JSZip()
        for (let row of selectedRows) {
            let sensorEvents = await LAMP.SensorEvent.allByParticipant(row.id)
            let resultEvents = await LAMP.ResultEvent.allByParticipant(row.id)
            if (filetype === "json") {
                zip.file(`${row.id}/sensor_event.json`, JSON.stringify(sensorEvents))
                zip.file(`${row.id}/result_event.json`, JSON.stringify(resultEvents))
            } else if (filetype === "csv") {
                jsonexport(JSON.parse(JSON.stringify(sensorEvents)), function(err, csv) {
                    if(err) return console.log(err)
                    zip.file(`${row.id}/sensor_event.csv`, csv)
                })
                jsonexport(JSON.parse(JSON.stringify(resultEvents)), function(err, csv) {
                    if(err) return console.log(err)
                    zip.file(`${row.id}/result_event.csv`, csv)
                })
            }
        }
        zip.generateAsync({type:'blob'}).then(x => saveAs(x, 'export.zip'))
    }

    let deleteParticipants = async () => {
        let selectedRows = state.selectedRows // tempRows = selectedRows.map(y => y.id)
        for (let row of selectedRows)
            await LAMP.Participant.delete(row.id)
        onChange()
        setState(state => ({ ...state, 
            popoverAttachElement: null, 
            selectedIcon: "", 
            selectedRows: []
        }))
    }

    const dateInfo = (id) => ({
        relative: timeAgo.format(new Date(parseInt((logins[id] || {}).timestamp))),
        absolute: (new Date(parseInt((logins[id] || {}).timestamp))).toLocaleString('en-US', mediumDateFormat),
        device: (logins[id] || {data:{}}).data.device_type || 'an unknown device'
    })

	return (
        <React.Fragment>
            <MaterialTable 
                title="Default Clinic"
                data={participants} 
                columns={[
                    { title: 'Name', field: 'id', render: (x) => 
                        <EditField 
                            text={names[x.id]} 
                            defaultValue={x.id}
                            onChange={newValue => {
                                let id = x.id /* shadow copy */
                                let oldValue = names[id] || id
                                if (oldValue === newValue)
                                    return
                                let isStr = (typeof newValue === 'string') && newValue.length > 0

                                LAMP.Type.setAttachment(id, 'me', 'lamp.name', isStr ? newValue : null)
                                    .then(x => setNames(names => ({ ...names, [id]: isStr ? newValue : undefined })))
                                    .then(x => onChange())
                                    .catch(err => {
                                        console.error(err)
                                        setNames(names => ({ ...names, [id]: oldValue }))
                                    })
                            }} 
                        />
                    },
                    { title: 'Last Active', field: 'last_active', render: (rowData) => 
                        <Tooltip title={dateInfo(rowData.id).absolute}>
                            <span>{`${dateInfo(rowData.id).relative} on ${dateInfo(rowData.id).device}`}</span>
                        </Tooltip>
                    },
                    { title: 'Indicators', field: 'data_health', render: (rowData) => 
                        <div>
                            <Tooltip title={(rowData.id.length % 3 === 0 ? 
                                                'Data is either missing or inconsistent and requires attention.' : (rowData.id.length % 3 === 1 ? 
                                                    'Data is inconsistent and requires attention.' : 
                                                        'Data is optimal.'))}>
                              <Chip 
                                  label="Data Quality"
                                  style={{ 
                                      margin: 4, 
                                      backgroundColor: (rowData.id.length % 3 === 0 ? 
                                                            red[500] : (rowData.id.length % 3 === 1 ? 
                                                                yellow[500] : 
                                                                    green[500])), 
                                      color: (rowData.id.length % 3 === 1) ? '#000' : '#fff'
                                }} />
                            </Tooltip>
                        </div>
                    }, { title: 'Actions', field: '__messages', render: (rowData) => 
                        <React.Fragment>
                            <Tooltip title="Open Messages">
                                <IconButton
                                    onClick={(event) => {
                                        event.preventDefault()
                                        event.stopPropagation()
                                        setState({ ...state, openMessaging: rowData.id })
                                    }}
                                >
                                    <Icon>chat</Icon>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Reset Password">
                                <IconButton
                                    onClick={(event) => {
                                        event.preventDefault()
                                        event.stopPropagation()
                                        setState({ ...state, openPasswordReset: rowData.id })
                                    }}
                                >
                                    <Icon>vpn_key</Icon>
                                </IconButton>
                            </Tooltip>
                        </React.Fragment>
                    }
                ]}
                detailPanel={rowData => <div />}
                onRowClick={(event, rowData, togglePanel) => onParticipantSelect(participants[rowData.tableData.id].id)}
                actions={[
                    {
                        icon: 'add_box',
                        tooltip: 'Create',
                        isFreeAction: true,
                        onClick: (event, rows) => setState(state => ({ ...state, 
                            popoverAttachElement: event.currentTarget,
                            selectedIcon: "add",
                            selectedRows: []
                        }))
                    }, {
                        icon: 'arrow_downward',
                        tooltip: 'Export',
                        onClick: (event, rows) => setState(state => ({ ...state, 
                            popoverAttachElement: event.currentTarget,
                            selectedIcon: "download",
                            selectedRows: rows
                        }))
                    }, {
                        icon: 'delete_forever',
                        tooltip: 'Delete',
                        onClick: (event, rows) => setState(state => ({ ...state, 
                            popoverAttachElement: event.currentTarget,
                            selectedIcon: "delete",
                            selectedRows: rows
                        }))
                    }
                ]}
                localization={{
                    body: {
                        emptyDataSourceMessage: 'No Participants. Add Participants by clicking the [+] button above.',
                        editRow: {
                            deleteText: 'Are you sure you want to delete this Participant?'
                        }
                    }
                }}
                options={{
                    selection: true,
                    actionsColumnIndex: -1,
                    pageSize: 10,
                    pageSizeOptions: [10, 25, 50, 100]

                }}
                components={{ Container: props => <div {...props} /> }}
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
              anchorEl={state.popoverAttachElement}
              onClose={() => setState(state => ({ ...state, popoverAttachElement: null }))}
              anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
              }}
              transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
              }}
            >
            {state.selectedIcon === "download" ?
                <React.Fragment>
                    <MenuItem onClick={() => downloadFiles("csv")}>CSV</MenuItem>
                    <MenuItem onClick={() => downloadFiles("json")}>JSON</MenuItem>
                </React.Fragment> : 
            (state.selectedIcon === "add" ?
                <div style = {{ padding: "20px" }}>
                    <TextField
                        label="Number of participants to add:"
                        value={state.newCount}
                        onChange={(event) => setState({ ...state, newCount: event.target.value })}
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        margin="normal"
                    />
                    <IconButton 
                        aria-label = "Create" 
                        color = "primary"
                        onClick = {addParticipant}
                    >
                        <Icon>check_circle</Icon>
                    </IconButton>
                </div> : 
            (state.selectedIcon === "delete" ?
                <div style = {{ padding: "20px" }}>
                    <Button 
                        variant = "contained" 
                        color = "secondary"
                        onClick={deleteParticipants}
                    >
                        Are you sure you want to delete these participants?
                    </Button>
                </div> :
                <div />
            ))}
            </Popover>
            <ResponsiveDialog
                open={!!state.openMessaging}
                onClose={() => setState({ ...state,  openMessaging: undefined })}
            >
                <DialogContent>
                    <Messages participant={state.openMessaging} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setState({ ...state,  openMessaging: undefined })} color="primary" autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </ResponsiveDialog>
            <Dialog
                open={!!state.openPasswordReset}
                onClose={() => setState({ ...state,  openPasswordReset: undefined, passwordText: undefined })}
            >
                <DialogContent style={{ marginBottom: 12 }}>
                    <CredentialManager 
                        id={state.openPasswordReset} 
                        onError={err => props.layout.showAlert(err.message)}
                    />
                </DialogContent>
            </Dialog>
        </React.Fragment>
    )
}
