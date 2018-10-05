import React from 'react'
import { withRouter } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import LAMP from '../lamp.js';
import Snackbar from '@material-ui/core/Snackbar'
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import AttachmentIcon from '@material-ui/icons/Attachment';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import EventBus from 'eventing-bus'
import {saveAs} from 'file-saver'
import JSZip from 'jszip'
import JSZipUtils from 'jszip-utils'

// The download URL for any given participant.
const xpath = "[*].{activity:activity,start_time:date(div(start_time,\`1000\`)),end_time:date(div(end_time,\`1000\`)),summary:static_data,detail:temporal_events[*].{target:item,value:value,correct:!starts_with(to_string(type), \`\"false\"\`),elapsed_time:div(elapsed_time,\`1000.0\`),level:level},environment_location:environment_event.coordinates,location_context:environment_event.location_context,social_context:environment_event.social_context,fitness_event:fitness_event.record}"
const csv_url = (id, auth, export_type) => `http://lampapi-env.persbissfu.us-east-2.elasticbeanstalk.com/participant/${id}/export?auth=${auth}&xpath=${xpath}&export=${export_type}`

// TODO: Rename to Researcher:

class ParticipantList extends React.Component {
    state = {
        openVizEdit: false,
        scriptText: '',
        scriptReqs: '',
        userMsg: null,
        data: []
    }

    componentWillMount() {
        EventBus.publish("set_title", "Participants")
        LAMP.Participant.all_by_researcher(LAMP.get_identity().id).then(res => {
            this.setState({ data: res })
        })
    }

    // Go to the drill-down view. (DISABLED)
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

    saveScript = () => {
        var contents = this.state.scriptText
        var reqs = this.state.scriptReqs.split(',')
        this.setState({openVizEdit: false, scriptText: '', scriptReqs: ''})

        LAMP.Researcher.set_attachment(LAMP.get_identity()['id'], 'org.bidmc.digitalpsych.lamp.viz1', {
            "script_type": "rscript",
            "script_contents": contents,
            "script_requirements": reqs
        }, {untyped: true}).then(x => console.log(x))
    }

    render = () =>
    <div>
        <div style={{ width: '80%', marginTop: 20, marginLeft: 'auto', marginRight: 'auto' }}>
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
        <Card style={{ width: '80%', marginTop: 20, marginLeft: 'auto', marginRight: 'auto' }}>
            <Toolbar>
                <Typography variant="title" color="inherit" style={{flex: 1}}>
                    All Participants
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
                        <TableRow key={index} onClick={(e) => this.rowSelect(index)}>
                            <TableCell>{row.id}</TableCell>
                            <TableCell>{row.settings.study_code}</TableCell>
                            <TableCell>{new Date(row.settings.last_login).toString()}</TableCell>
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
        <Dialog
            fullScreen
            open={this.state.openVizEdit}
            onClose={() => this.setState({openVizEdit: false})}
            aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">
                Visualization Editor
            </DialogTitle>
            <DialogContent>
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
        <Snackbar
            open={this.state.userMsg != null}
            message={this.state.userMsg || ''}
            autoHideDuration={3000}
            onRequestClose={() => this.setState({userMsg: null})} />
    </div>
}

export default withRouter(ParticipantList)
