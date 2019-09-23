
// Core Imports
import React, { useState, useEffect, useCallback } from 'react'
import IconButton from '@material-ui/core/IconButton'
import Box from '@material-ui/core/Box'
import Icon from '@material-ui/core/Icon'
import Switch from '@material-ui/core/Switch'
import Button from '@material-ui/core/Button'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Popover from '@material-ui/core/Popover'
import MenuItem from '@material-ui/core/MenuItem'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Divider from '@material-ui/core/Divider'
import Chip from '@material-ui/core/Chip'
import Slide from '@material-ui/core/Slide'
import Tooltip from '@material-ui/core/Tooltip'
import MaterialTable from 'material-table'
import red from '@material-ui/core/colors/red'
import yellow from '@material-ui/core/colors/yellow'
import green from '@material-ui/core/colors/green'
import grey from '@material-ui/core/colors/grey'

// External Imports 
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import jsonexport from 'jsonexport'
import { useDropzone } from 'react-dropzone'

// Local Imports
import LAMP from '../lamp'
import Activity from '../components/Activity'
import Messages from '../components/Messages'
import Sparkchips from '../components/Sparkchips'
import EditField from '../components/EditField'
import { ResponsiveDialog, ResponsivePaper } from '../components/Utils'

function SlideUp(props) { return <Slide direction="up" {...props} /> }

// TODO: Traffic Lights with Last Survey Date + Login+device + # completed events
// TODO: Blogs/Tips/AppHelp

export default function Researcher({ researcher, onParticipantSelect, ...props }) {
    const [state, setState] = useState({
        data: [],
        activities: [],

        // 

        popoverAttachElement: null,
        selectedIcon: null,
        newCount: 1,
        selectedRows: []
    })
    const [showActivityImport, setShowActivityImport] = useState()
    const [importFile, setImportFile] = useState()
    const [exportActivities, setExportActivities] = useState()
    const [selectedActivity, setSelectedActivity] = useState()
    const [names, setNames] = useState({})
    const onDrop = useCallback(acceptedFiles => {
        const reader = new FileReader()
        reader.onabort = () => props.layout.showAlert('Couldn\'t import the Activities.')
        reader.onerror = () => props.layout.showAlert('Couldn\'t import the Activities.')
        reader.onload = () => {
            setShowActivityImport()
            let obj = JSON.parse(reader.result)
            if (Array.isArray(obj) && obj.filter(x => (typeof x === 'object' && !!x.name && !!x.settings && !!x.schedule)).length > 0)
                setImportFile(obj)
            else props.layout.showAlert('Couldn\'t import the Activities.')
        }
        acceptedFiles.forEach(file => reader.readAsText(file))
    }, [])
    const { acceptedFiles, getRootProps, getInputProps, isDragActive, isDragAccept } = useDropzone({
        onDrop, accept: 'application/json,.json', maxSize: 1 * 1024 * 1024 /* 5MB */
    })

    useEffect(() => {
        (async function() {
            setState({ ...state, 
                data: await LAMP.Participant.allByResearcher(researcher.id), 
                activities: await LAMP.Activity.allByResearcher(researcher.id) 
            })
        })()
    }, [])

    useEffect(() => {
        (async function() {
            let data = (await Promise.all(state.data
                            .map(async x => ({ id: x.id, res: await LAMP.Type.getAttachment(x.id, 'lamp.name') }))))
                            .filter(y => y.res.message === undefined && (typeof y.res.data === 'string') && y.res.data.length > 0)
            setNames(names => data.reduce((prev, curr) => ({ ...prev, [curr.id]: curr.res.data }), names))
        })()
    }, [state])

    let addParticipant = async () => {
        let newCount = state.newCount
        setState({ ...state, popoverAttachElement: null, newCount: 1, selectedIcon: "", selectedRows: [] })
        let ids = []
        for (let i = 0; i < newCount; i ++) {
            let newID = await LAMP.Participant.create(researcher.studies[0], { study_code: '001' })
            ids = [...ids, newID]
        }
        setState({ ...state, data: [...state.data, ...ids] })
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
        let selectedRows = state.selectedRows, tempRows = selectedRows.map(y => y.id)
        setState({ ...state, popoverAttachElement: null, selectedIcon: "", selectedRows: [] })
        for (let row of selectedRows)
            await LAMP.Participant.delete(row.id)
        setState({ ...state, data: state.data.filter((x) => !tempRows.includes(x.id)) })
    }

    return (
        <React.Fragment>
            <Box mb="16px" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h5" color="inherit">
                     
                </Typography>
                <Box>
                    <Typography variant="inherit" color="inherit">
                        Show Unscheduled Activities
                    </Typography>
                    <Switch 
                        size="small"
                        checked={state.showUnscheduled} 
                        onChange={() => setState({ ...state, showUnscheduled: !state.showUnscheduled })} 
                    />
                </Box>
            </Box>
            <ResponsivePaper elevation={4}>
                <MaterialTable 
                    title="Patients"
                    data={state.data.map(x => ({...x, last_login: 'Unknown', device_type: 'Unknown' }))} 
                    columns={[
                        { title: 'Name', field: 'id', render: (x) => 
                            <EditField 
                                text={names[x.id] || x.id} 
                                onChange={newValue => {
                                    let oldValue = names[x.id] || x.id
                                    if (oldValue == newValue)
                                        return

                                    let isStr = (typeof newValue === 'string') && newValue.length > 0
                                    setNames(names => ({ ...names, [x.id]: isStr ? newValue : undefined }))
                                    LAMP.Type.setAttachment(x.id, 'me', 'lamp.name', newValue).catch(err => {
                                        console.error(err)
                                        setNames(names => ({ ...names, [x.id]: oldValue }))
                                    })
                                }} 
                            />
                        },
                        { title: 'Last Login', field: 'last_login' },
                        { title: 'Device Type', field: 'device_type' },
                        { title: 'Indicators', field: 'data_health', render: (rowData) => 
                            <div>
                                <Tooltip title={(rowData.id.length % 3 === 0 ? 
                                                    'Data health is either missing or inconsistent and requires attention.' : (rowData.id.length % 3 === 1 ? 
                                                        'Data health is inconsistent and requires attention.' : 
                                                            'Data health is optimal.'))}>
                                  <Chip 
                                      label="Data Health"
                                      style={{ 
                                          margin: 4, 
                                          backgroundColor: (rowData.id.length % 3 === 0 ? 
                                                                red[500] : (rowData.id.length % 3 === 1 ? 
                                                                    yellow[500] : 
                                                                        green[500])), 
                                          color: (rowData.id.length % 3 === 1) ? '#000' : '#fff'
                                    }} />
                                </Tooltip>
                                <Tooltip title={(rowData.id.length % 3 === 0 ? 
                                                    'Patient health is optimal.' : (rowData.id.length % 3 === 1 ? 
                                                        'Patient health may require clinical monitoring.' : 
                                                            'Patient health may require clinical attention.'))}>
                                  <Chip 
                                      label="Patient Health"
                                      style={{ 
                                          margin: 4, 
                                          backgroundColor: (rowData.id.length % 3 === 0 ? 
                                                                green[500] : (rowData.id.length % 3 === 1 ? 
                                                                    yellow[500] : 
                                                                        red[500])), 
                                          color: (rowData.id.length % 3 === 1) ? '#000' : '#fff'
                                    }} />
                                </Tooltip>
                            </div>
                        }, { title: 'Messages', field: '__messages', render: (rowData) => 
                            <IconButton
                                onClick={(event) => {
                                    event.preventDefault()
                                    event.stopPropagation()
                                    setState({ ...state, openMessaging: rowData.id })
                                }}
                            >
                                <Icon>chat</Icon>
                            </IconButton>
                        }
                    ]}
                    detailPanel={rowData => <div />}
                    onRowClick={(event, rowData, togglePanel) => onParticipantSelect(state.data[rowData.tableData.id].id)}
                    actions={[
                        {
                            icon: 'add_box',
                            tooltip: 'Create',
                            isFreeAction: true,
                            onClick: (event, rows) => setState({ ...state, 
                                popoverAttachElement: event.currentTarget,
                                selectedIcon: "add",
                                selectedRows: []
                            })
                        }, {
                            icon: 'arrow_downward',
                            tooltip: 'Export',
                            onClick: (event, rows) => setState({ ...state, 
                                popoverAttachElement: event.currentTarget,
                                selectedIcon: "download",
                                selectedRows: rows
                            })
                        }, {
                            icon: 'delete_forever',
                            tooltip: 'Delete',
                            onClick: (event, rows) => setState({ ...state, 
                                popoverAttachElement: event.currentTarget,
                                selectedIcon: "delete",
                                selectedRows: rows
                            })
                        },
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
                                [ ...(state.activities || []), { name: 'Environmental Context' }, { name: 'Step Count' }]
                                    .filter(x => (x.spec !== 'lamp.survey' && !!state.showUnscheduled) || (x.spec === 'lamp.survey'))
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
            </ResponsivePaper>
            <div style={{ height: 16 }} />
            <ResponsivePaper elevation={4}>
                <MaterialTable 
                    title="Activities"
                    data={state.activities} 
                    columns={[
                        { title: 'Name', field: 'name' }, 
                        { title: 'Type', field: 'spec', lookup: { 'lamp.survey': 'Survey', 'lamp.group': 'Group' }, emptyValue: 'Cognitive Test' }
                    ]}
                    onRowClick={(event, rowData, togglePanel) => setSelectedActivity(rowData)}
                    actions={[
                        {
                            icon: 'cloud_upload',
                            tooltip: 'Import',
                            isFreeAction: true,
                            onClick: (event, rows) => setShowActivityImport(true)
                        }, {
                            icon: 'cloud_download',
                            tooltip: 'Export',
                            onClick: (event, rows) => {
                                saveAs(new Blob([JSON.stringify(rows.map(x => ({ ...x, 
                                    id: undefined, tableData: undefined 
                                })), undefined, 4)], { type: 'text/plain;charset=utf-8' }), 'export.json')
                            }
                        }, {
                            icon: 'add_box',
                            tooltip: 'Create',
                            isFreeAction: true,
                            onClick: (event, rows) => props.layout.showAlert('Creating a new Activity is not yet supported. Please import Activities instead.')
                        }, {
                            icon: 'delete_forever',
                            tooltip: 'Delete',
                            onClick: async (event, rows) => {
                                for (let activity of rows)
                                    console.dir(await LAMP.Activity.delete(activity.id))
                                setState({ ...state, 
                                    activities: await LAMP.Activity.allByResearcher(researcher.id) 
                                })
                            }                  
                        },
                    ]}
                    localization={{
                        body: {
                            emptyDataSourceMessage: 'No Activities. Add Activities by clicking the [+] button above.',
                            editRow: {
                                deleteText: 'Are you sure you want to delete this Activity?'
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
            </ResponsivePaper>
            <Popover
              open={Boolean(state.popoverAttachElement)}
              anchorEl={state.popoverAttachElement}
              onClose={() => setState({ ...state, popoverAttachElement: null })}
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
                        <CheckCircleIcon />
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
            <Dialog
                open={!!showActivityImport}
                onClose={() => setShowActivityImport()}
            >
                <Box {...getRootProps()} 
                    p={4} 
                    bgcolor={(isDragActive || isDragAccept) ? 'primary.main' : undefined} 
                    color={!(isDragActive || isDragAccept) ? 'primary.main' : '#fff'}
                >
                    <input {...getInputProps()} />
                    <Typography variant="h6">
                        Drag files here, or click to select files.
                    </Typography>
                </Box>
            </Dialog>
            <Dialog
                open={!!importFile}
                onClose={() => setImportFile()}
            >
                <MaterialTable 
                    title="Continue importing?"
                    data={importFile || []} 
                    columns={[{ title: 'Activity Name', field: 'name' }]}
                    options={{ search: false, selection: false }}
                    components={{ Container: props => <div {...props} /> }}
                />
                <DialogActions>
                    <Button onClick={() => setImportFile()} color="secondary" autoFocus>
                        Cancel
                    </Button>
                    <Button onClick={async () => {
                        for (let activity of importFile)
                            console.dir(await LAMP.Activity.create(researcher.studies[0], activity))
                        setState({ ...state, 
                            activities: await LAMP.Activity.allByResearcher(researcher.id) 
                        })
                        setImportFile()
                    }} color="primary" autoFocus>
                        Import
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                fullScreen
                open={!!selectedActivity}
                onClose={() => setSelectedActivity()}
                TransitionComponent={SlideUp}
            >
                <IconButton 
                    style={{ 
                        position: 'fixed', 
                        left: 16, 
                        top: 16, 
                        background: '#ffffff66', 
                        WebkitBackdropFilter: 'blur(5px)' 
                    }} 
                    color="inherit" 
                    onClick={() => setSelectedActivity()} 
                    aria-label="Close"
                >
                    <Icon>close</Icon>
                </IconButton>
                <Box py={8} px={4}>
                    <Activity activity={selectedActivity} />
                </Box>
            </Dialog>
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
        </React.Fragment>
    )
}
