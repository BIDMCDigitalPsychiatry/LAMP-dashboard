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

//
// import {plotGallery} from '../components/gallery_plots/base_script'
// import {plotArgs} from '../components/gallery_plots/base_script'

// The download URL for any given participant.
const xpath = "[*].{activity:activity,start_time:date(div(start_time,\`1000\`)),end_time:date(div(end_time,\`1000\`)),summary:static_data,detail:temporal_events[*].{target:item,value:value,correct:!starts_with(to_string(type), \`\"false\"\`),elapsed_time:div(elapsed_time,\`1000.0\`),level:level},environment_location:environment_event.coordinates,location_context:environment_event.location_context,social_context:environment_event.social_context,fitness_event:fitness_event.record}"
const csv_url = (id, auth, export_type) => `http://lampapi-env.persbissfu.us-east-2.elasticbeanstalk.com/participant/${id}/export?auth=${auth}&xpath=${xpath}&export=${export_type}`

const fullDateFormat = {
	timeZone: 'America/New_York',
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
        openVizEdit: false,
        scriptText: '',
        scriptReqs: '',
        data: [],
        activities: null,
        plot_toggle: null,
        plot_sources: null
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
		this.setState({ data: res })
		let actRes = await LAMP.Activity.all_by_researcher(id)
		this.setState({ activities: actRes })

		this.props.layout.pageLoading(true)

        const script_sources = await docPages() //Get information from Lamp-scripts
        this.setState({plot_sources:plotParse(script_sources)})
        this.setState({plot_toggle:this.state.plot_sources.map((key) => false)})
        console.log(this.state.plot_toggle)
    }

    // Go to the drill-down view.
    rowSelect = (rowNumber) => this.props.history.push(`/participant/${this.state.data[rowNumber].id}`)

    // Shorthand for authentication stuff.
    _auth = () => (LAMP.auth.id + ':' + LAMP.auth.password)

    // Download ALL the data!
    downloadAll = () => {
        var count = this.state.data.length
        var zip = new JSZip()
        this.state.data.map((r) => ({id: r.id, url: csv_url(r.id, this._auth(), "csv")})).forEach((doc) => {
            JSZipUtils.getBinaryContent(doc.url, (err, dl) => {
                if(!!err) throw err; count--
                zip.file(`${doc.id}.csv`, dl, {binary:true})
                if (count === 0) {
                    zip.generateAsync({type:'blob'}).then((content) => {
                        saveAs(content, "export.zip")
                    })
                }
            })
        })
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

        LAMP.Researcher.set_attachment(id, 'org.bidmc.digitalpsych.lamp.viz1', {
            "script_type": "rscript",
            "script_contents": contents,
            "script_requirements": reqs
        }, {untyped: true}).then(x => console.log(x))
    }

    render = () =>
    <div>
        {/*{console.log(this.state.sources)}*/}
        <div>
            <Toolbar>
                <Typography variant="body2" color="inherit" style={{flex: 1}}>
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
                <Typography variant="title" color="inherit" style={{flex: 1}}>
                    Default Study
                </Typography>
                <Button
                    variant="outlined"
                    onClick={this.downloadAll}>
                    Download All
                    <AttachmentIcon style={{marginLeft: '8px'}} />
                </Button>
            </Toolbar>
            <Divider />
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Study ID</TableCell>
                        <TableCell>Study Code</TableCell>
                        <TableCell>Last Login</TableCell>
                        <TableCell>Device Type</TableCell>
                        <TableCell>Download CSV</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {this.state.data.map((row, index) => (
                        <TableRow hover key={index} onClick={(e) => this.rowSelect(index)}>
                            <TableCell>{row.id}</TableCell>
                            <TableCell>{row.settings.study_code}</TableCell>
                            <TableCell>{Date.formatUTC(row.settings.last_login, fullDateFormat)}</TableCell>
                            <TableCell>{row.settings.device_type}</TableCell>
                            <TableCell>
                                <IconButton
                                    aria-label="Download"
                                    href={csv_url(row.id, this._auth(), "csv")}>
                                    <AttachmentIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
        <br />
        <Card>
            <Toolbar>
                <Typography variant="title" color="inherit" style={{flex: 1}}>
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
                    <Typography variant="title">
                        Image Gallery
                    </Typography>
                    <Typography gutter variant="body2">
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
