import React from 'react'
import { withRouter } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import LAMP from '../lamp.js';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import VisGallery from '../components/vis_gallery'
import AttachmentIcon from '@material-ui/icons/Attachment';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {saveAs} from 'file-saver'
import JSZip from 'jszip'
import JSZipUtils from 'jszip-utils'
import DataTable from '../components/datatable'
import MaterialTable from 'material-table'
import Popover from '@material-ui/core/Popover';
import json2csv from 'json2csv'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import jsonexport from 'jsonexport'

//
// import {plotGallery} from '../components/gallery_plots/base_script'
// import {plotArgs} from '../components/gallery_plots/base_script'

const fullDateFormat = {
	weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
	hour: 'numeric', minute: 'numeric'
}

// Connect to Lamp-scripts
const rootURL = 'https://api.github.com/repos/BIDMCDigitalPsychiatry/LAMP-scripts/contents'
const baseURL = 'https://raw.githubusercontent.com/BIDMCDigitalPsychiatry/LAMP-scripts/master'
const docPages = async () => {
    const fetchIndex = async (path) => await (await fetch(rootURL + (!!path ? '/' + path : ''))).json()
    const fetchPage = async (path) => await (await fetch(baseURL + '/' + path)).text()
    const recursiveFetchIndex = async (path) => (await Promise.all(
        (await fetchIndex(path)).map(async x => {
            if (x.type === 'dir') {
                return await Promise.all(await recursiveFetchIndex(x.path))
            } else if (!x.path.endsWith('.md') && x.type === 'file') {
                return [x]
            } else return []
        }).flat(1000)
    )).flat(1000)
    const recursiveFetchPage = async (path) => (await Promise.all(
        (await recursiveFetchIndex(path)).map(async x =>
            [x.path, await fetchPage(x.path)]
        )
    )).reduce((p, c) => {p[c[0]]=c[1];return p;}, {})
    return recursiveFetchPage()
}

const plotParse = (script_sources) => {
    //Create Object mapping plot to [example_image, script, script_reqs]
    var plot_info = {}
    for (var key in script_sources) {
        var split_key = key.split('/')
        var plot_type = split_key[0]
        var file_name = split_key[1]
        //initialize property array
        if (!(plot_type in plot_info)) {
            plot_info[plot_type] = [null, null, null]
        }
        //Place thing in (plot, script, reqs) order
        if (file_name.split('.')[1] === ('png')) {
            plot_info[plot_type][0] = baseURL + '/' + key
        }
        else if (file_name.split('.')[1] === ('r')) {
            plot_info[plot_type][1] = script_sources[key]
        }
        else if (file_name.split('.')[1] === ('json')) {
            plot_info[plot_type][2] = script_sources[key]
        }
    }
    //Convert Object to Array
    var plot_info_array = []
    for (var plot in plot_info) {
        plot_info_array.push(plot_info[plot])
    }
    return plot_info_array
}

//
class Researcher extends React.Component {
    state = {
        researcher: "",
        openVizEdit: false,
        scriptText: '',
        scriptReqs: '',
        data: [],
        activities: null,
        plot_toggle: null,
        plot_sources: null,
        popoverAttachElement: null,
        selectedIcon: null,
        newCount: 1,
        selectedRows: []
    }

    async componentWillMount() {
		this.props.layout.pageLoading(false)

		let { id } = this.props.match.params
        if (id === 'me' && (LAMP.auth || {type: null}).type === 'researcher')
            id = LAMP.get_identity().id
        if (!id || id === 'me') {
            this.props.history.replace(`/`)
            return
		}


		let obj = await LAMP.Researcher.view(id)
		this.props.layout.setTitle(`Researcher ${obj[0].name}`)
        let res = await LAMP.Participant.all_by_researcher(id)
		let actRes = await LAMP.Activity.all_by_researcher(id)

        const script_sources = await docPages() //Get information from Lamp-scripts
        const plot_sources = plotParse(script_sources)
        this.setState({
            plot_sources: plot_sources,
            plot_toggle: plot_sources.map((key) => false),
            researcher: obj[0],
            data: res,
            activities: actRes
        })

		this.props.layout.pageLoading(true)
    }

    // Go to the drill-down view.
    rowSelect = (rowNumber) => this.props.history.push(`/researcher/participant/${this.state.data[rowNumber].id}`)

    addParticipant = async () => {
        let newCount = this.state.newCount
        this.setState({popoverAttachElement: null, newCount: 1, selectedIcon: "", selectedRows: []})

        let ids = []
        for (let i = 0; i < newCount; i ++) {
            let newID = await LAMP.Participant.create(this.state.researcher.studies[0], {
                study_code: "001"
            }, {
                untyped: true
            })
            ids = [...ids, newID]
        }
        this.setState({data: [...this.state.data, ...ids]})
    }

    downloadFiles = async (filetype) => {

        let selectedRows = this.state.selectedRows

        this.setState({popoverAttachElement: null, selectedIcon: "", selectedRows: []})

        let zip = new JSZip()

        for (let row of selectedRows) {
            let sensorEvents = await LAMP.SensorEvent.all_by_participant(row.id)
            let resultEvents = await LAMP.ResultEvent.all_by_participant(row.id)

            if (filetype === "json") {
                zip.file(`${row.id}/sensor_event.json`, JSON.stringify(sensorEvents))
                zip.file(`${row.id}/result_event.json`, JSON.stringify(resultEvents))
            } else if (filetype === "csv") {

            let jsonexport = require('jsonexport')

            jsonexport(JSON.parse(JSON.stringify(sensorEvents)), function(err, csv) {
                if(err) return console.log(err)
                console.log(csv)
                zip.file(`${row.id}/sensor_event.csv`, csv)
            })

            jsonexport(JSON.parse(JSON.stringify(resultEvents)), function(err, csv) {
                if(err) return console.log(err)
                console.log(csv)
                zip.file(`${row.id}/result_event.csv`, csv)
            })

            }
        }
         zip.generateAsync({type:'blob'}).then((content) => {
            saveAs(content, "export.zip")
        })
    }

    deleteParticipants = async () => {

        let selectedRows = this.state.selectedRows

        this.setState({popoverAttachElement: null, selectedIcon: "", selectedRows: []})

        for (let row of selectedRows) {
            await LAMP.Participant.delete(row.id, {}, {untyped: true})
        }

        let tempRows = selectedRows.map(y => y.id)
        let tempData = this.state.data.filter((x) => !tempRows.includes(x.id))

        this.setState({ data:  tempData})
    }

    //Read Lamp-script and determine script and pictures
    parseSources = () => {

    }

    saveScript = (inputScript = this.state.scriptText, inputReqs = this.state.scriptReqs) => {
		let { id } = this.props.match.params
		if (id === 'me' && (LAMP.auth || {type: null}).type === 'researcher')
		    id = LAMP.get_identity().id

        var contents = inputScript
        var reqs = inputReqs.split(',')
        this.setState({openVizEdit: false, scriptText: '', scriptReqs: '', toggled_scripts:[]})

        for (let i = 0 ; i < 9; i++){
            if (i < this.state.plot_toggle.length && this.state.plot_toggle[i] === true) {
                LAMP.TypeLegacy.set_attachment(id, 'org.bidmc.digitalpsych.lamp.viz' + (i+1), {
                    "script_type": "rscript",
                    "script_contents": this.state.plot_sources[i][1],
                    "script_requirements": this.state.plot_sources[i][2].replace(/(\r\n\t|\n|\r\t)/gm, "").split(",")
                }, {untyped: true})
            } else {
                LAMP.TypeLegacy.set_attachment(id, 'org.bidmc.digitalpsych.lamp.viz'+(i+1), {
                    "script_type": "rscript",
                    "script_contents": "",
                    "script_requirements": ""
                }, {untyped: true})
            }
        }

        LAMP.TypeLegacy.set_attachment(id, 'org.bidmc.digitalpsych.lamp.viz10', {
            "script_type": "rscript",
            "script_contents": contents,
            "script_requirements": reqs
        })

    }

    render = () =>
    <div>
        <div>
            <Toolbar>
                <Typography variant="body1" color="inherit" style={{flex: 1}}>
                    Visualization Editor
                </Typography>
                <Button
                    variant="outlined"
                    onClick={() => this.setState({openVizEdit: true})}>
                    Update Script
                </Button>
            </Toolbar>
        </div>
        <Card>
            <Toolbar>
                <Typography variant="h6" color="inherit" style={{flex: 1}}>
                    Default Study
                </Typography>
            </Toolbar>
            <Divider />
            <MaterialTable 
                columns={[{ title: 'Participant ID', field: 'id' }]}
                data = {this.state.data} 
                title = "Study Participants"
                detailPanel={rowData => {
                    return (
                      <div style={{background: "white", width: "100%", height: "150px"}} />
                    )
                  }}
                onRowClick={(event, rowData, togglePanel) => this.rowSelect(rowData.tableData.id)}
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
                    },
                    {
                        icon: 'arrow_downward',
                        tooltip: 'Download',
                        onClick: (event, rows) => this.setState({
                            popoverAttachElement: event.currentTarget,
                            selectedIcon: "download",
                            selectedRows: rows
                        })
                    },
                    {
                        icon: 'delete_forever',
                        tooltip: 'Delete',
                        onClick: (event, rows) => this.setState({
                            popoverAttachElement: event.currentTarget,
                            selectedIcon: "delete",
                            selectedRows: rows
                        })
                    },
                ]}
                options={{
                    selection: true,
                    actionsColumnIndex: -1,
                    pageSize: 10,
                    pageSizeOptions: [10, 25, 50, 100]

                }}
            /> 
        }
            <Popover
              id="simple-popper"
              open={!!this.state.popoverAttachElement}
              anchorEl={this.state.popoverAttachElement}
              onClose={() => this.setState({popoverAttachElement: null})}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
            {this.state.selectedIcon === "download" &&
                <React.Fragment>
                <MenuItem onClick={() => this.downloadFiles("csv")}>CSV</MenuItem>
                <MenuItem onClick={() => this.downloadFiles("json")}>JSON</MenuItem>
                </React.Fragment>
            || this.state.selectedIcon === "add" &&
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
            </div>
            || this.state.selectedIcon === "delete" &&
                <div style = {{ padding: "20px" }}>
                    <Button 
                        variant = "raised" 
                        color = "secondary"
                        onClick={() => this.deleteParticipants()}
                        >
                        Are you sure you want to delete these participants?
                    </Button>
            </div>

        }
            </Popover>
        </Card>
        <br />
        <Card>
            <Toolbar>
                <Typography variant="h6" color="inherit" style={{flex: 1}}>
                    Activities
                </Typography>
            </Toolbar>
            <Divider />
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Type</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(this.state.activities || []).map((row, index) => (
                        <TableRow hover key={index}>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.type}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
        <Dialog
            fullScreen
            open={this.state.openVizEdit}
            onClose={() => this.setState({openVizEdit: false})}
            aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">
                Visualization Editor
            </DialogTitle>
            <Divider />
            <DialogContent>
                <br />
                <DialogContentText>
                    Enter script contents and (comma-separated) requirements below.
                </DialogContentText>
                <TextField
                    id="outlined-multiline-flexible"
                    label="Script Contents"
                    style={{width: '100%', marginTop: '20px'}}
                    variant="outlined"
                    rowsMax="10"
                    value={this.state.scriptText}
                    onChange={(x) => this.setState({scriptText: x.target.value})}
                    autoFocus
                    multiline />
                <TextField
                    id="outlined-multiline-flexible"
                    label="Script Requirements"
                    style={{width: '100%', marginTop: '20px'}}
                    variant="outlined"
                    value={this.state.scriptReqs}
                    onChange={(x) => this.setState({scriptReqs: x.target.value})}
                    autoFocus />
                <Divider />
                <div>
                    <Divider />
                    <Typography variant="h6">
                        Image Gallery
                    </Typography>
                    <Typography gutter variant="body1">
                        Choose visualizations by toggling buttons
                    </Typography>
                    <VisGallery
                        value={this.state.plot_sources}
                        onChange={(switch_list) => this.setState({plot_toggle: switch_list})} />
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => this.setState({openVizEdit: false})} color="primary">
                    Cancel
                </Button>
                <Button onClick={() => this.saveScript()} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    </div>
}

export default withRouter(Researcher)
