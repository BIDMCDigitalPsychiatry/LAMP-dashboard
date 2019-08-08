
// Core Imports
import React from 'react'
import { withRouter } from 'react-router-dom'
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
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Divider from '@material-ui/core/Divider'
import Chip from '@material-ui/core/Chip'
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

// Local Imports
import LAMP from '../lamp'
import Messages from '../components/Messages'
import Sparkchips from '../components/Sparkchips'
import { ResponsiveDialog } from '../components/Utils'

// TODO: Traffic Lights with Last Survey Date + Login+device + # completed events
// TODO: Activity settings & schedule + Blogs/Tips/AppHelp

class Researcher extends React.Component {
    state = {
        researcher: "",
        openVizEdit: false,
        scriptText: '',
        scriptReqs: '',
        data: [],
        activities: [],
        popoverAttachElement: null,
        selectedIcon: null,
        newCount: 1,
        selectedRows: []
    }

    async componentWillMount() {
		this.props.layout.pageLoading(false)

		let { id } = this.props.match.params
        if (id === 'me' && (this.props.auth.auth || {type: null}).type === 'researcher')
            id = this.props.auth.identity.id
        if (!id || id === 'me') {
            this.props.history.replace(`/`)
            return
		}

        let obj = await LAMP.Researcher.view(id)
        this.setState({ 
            researcher: obj, 
            data: await LAMP.Participant.allByResearcher(id), 
            activities: await LAMP.Activity.allByResearcher(id) 
        })
        this.props.layout.setTitle(`Researcher ${obj.name}`)
		this.props.layout.pageLoading(true)
    }

    addParticipant = async () => {
        let newCount = this.state.newCount
        this.setState({ popoverAttachElement: null, newCount: 1, selectedIcon: "", selectedRows: [] })
        let ids = []
        for (let i = 0; i < newCount; i ++) {
            let newID = await LAMP.Participant.create(this.state.researcher.studies[0], { study_code: '001' })
            ids = [...ids, newID]
        }
        this.setState({ data: [...this.state.data, ...ids] })
    }

    downloadFiles = async (filetype) => {
        let selectedRows = this.state.selectedRows
        this.setState({ popoverAttachElement: null, selectedIcon: "", selectedRows: [] })
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

    deleteParticipants = async () => {
        let selectedRows = this.state.selectedRows, tempRows = selectedRows.map(y => y.id)
        this.setState({ popoverAttachElement: null, selectedIcon: "", selectedRows: [] })
        for (let row of selectedRows)
            await LAMP.Participant.delete(row.id)
        this.setState({ data: this.state.data.filter((x) => !tempRows.includes(x.id)) })
    }

    render = () =>
    <React.Fragment>
        <Box mb="16px" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h5" color="inherit">
                Default Study
            </Typography>
            <Box>
                <Typography variant="subtitle" color="inherit">
                    Show Unscheduled Activities
                </Typography>
                <Switch 
                    size="small"
                    checked={this.state.showUnscheduled} 
                    onChange={() => this.setState({ showUnscheduled: !this.state.showUnscheduled })} 
                />
            </Box>
        </Box>
        <MaterialTable 
            title="Participants"
            data={this.state.data.map(x => ({...x, last_login: 'Unknown', device_type: 'Unknown' }))} 
            columns={[
                { title: 'Participant ID', field: 'id' },
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
                            this.setState({ openMessaging: rowData.id })
                        }}
                    >
                        <Icon>chat</Icon>
                    </IconButton>
                }
            ]}
            detailPanel={rowData => 
                <div style={{ margin: 8 }}>
                    <Typography style={{ width: '100%', textAlign: 'center' }}>
                        <b>Patient Health</b>
                    </Typography>
                    <Divider style={{ margin: 8 }} />
                    <Sparkchips items={
                        [ ...(this.state.activities || []), { name: 'Environmental Context' }, { name: 'Step Count' }]
                            .filter(x => (x.spec !== 'lamp.survey' && !!this.state.showUnscheduled) || (x.spec === 'lamp.survey'))
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
            }
            onRowClick={(event, rowData, togglePanel) => this.props.history.push(`/participant/${this.state.data[rowData.tableData.id].id}`)}
            actions={[
                {
                    icon: 'add_box',
                    tooltip: 'Add Participant',
                    isFreeAction: true,
                    onClick: (event, rows) => this.setState({
                        popoverAttachElement: event.currentTarget,
                        selectedIcon: "add",
                        selectedRows: []
                    })
                }, {
                    icon: 'arrow_downward',
                    tooltip: 'Download Participant(s)',
                    onClick: (event, rows) => this.setState({
                        popoverAttachElement: event.currentTarget,
                        selectedIcon: "download",
                        selectedRows: rows
                    })
                }, {
                    icon: 'delete_forever',
                    tooltip: 'Delete Participant(s)',
                    onClick: (event, rows) => this.setState({
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
        />
        <div style={{ height: 16 }} />
        {/*<MaterialTable 
            title="Activities"
            data={this.state.activities.map(x => ({ ...x, type: x.spec === 'lamp.survey' ? 'Survey' : 'Cognitive Test' }))} 
            columns={[
                { title: 'Name', field: 'name' }, 
                { title: 'Type', field: 'type' }
            ]}
            onRowClick={(event, rowData, togglePanel) => console.log(rowData.tableData)}
            actions={[
                {
                    icon: 'add_box',
                    tooltip: 'Add Activity',
                    isFreeAction: true,
                    onClick: (event, rows) => this.props.layout.showAlert('Creating a new Activity.')
                }, {
                    icon: 'edit',
                    tooltip: 'Edit Activity',
                    onClick: (event, rows) => this.props.layout.showAlert('Editing an Activity.')
                }, {
                    icon: 'delete_forever',
                    tooltip: 'Delete Activity(s)',
                    onClick: (event, rows) => this.props.layout.showAlert('Deleting an Activity.')
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
        />*/}
        <Popover
          id="simple-popper"
          open={!!this.state.popoverAttachElement}
          anchorEl={this.state.popoverAttachElement}
          onClose={() => this.setState({ popoverAttachElement: null })}
          anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
          }}
          transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
          }}
        >
        {this.state.selectedIcon === "download" ?
            <React.Fragment>
                <MenuItem onClick={() => this.downloadFiles("csv")}>CSV</MenuItem>
                <MenuItem onClick={() => this.downloadFiles("json")}>JSON</MenuItem>
            </React.Fragment> : 
        (this.state.selectedIcon === "add" ?
            <div style = {{ padding: "20px" }}>
                <TextField
                    label="Number of participants to add:"
                    value={this.state.newCount}
                    onChange={(event) => this.setState({ newCount: event.target.value })}
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    margin="normal"
                />
                <IconButton 
                    aria-label = "Create" 
                    color = "primary"
                    onClick = {() => this.addParticipant()}
                >
                    <CheckCircleIcon />
                </IconButton>
            </div> : 
        (this.state.selectedIcon === "delete" ?
            <div style = {{ padding: "20px" }}>
                <Button 
                    variant = "contained" 
                    color = "secondary"
                    onClick={() => this.deleteParticipants()}
                >
                    Are you sure you want to delete these participants?
                </Button>
            </div> :
            <div />
        ))}
        </Popover>
        <ResponsiveDialog
            open={!!this.state.openMessaging}
            onClose={() => this.setState({ openMessaging: undefined })}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogContent>
                <Messages participant={this.state.openMessaging} />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => this.setState({ openMessaging: undefined })} color="primary" autoFocus>
                    Close
                </Button>
            </DialogActions>
        </ResponsiveDialog>
    </React.Fragment>
}

export default withRouter(Researcher)
