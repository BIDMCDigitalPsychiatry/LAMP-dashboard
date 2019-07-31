import React from 'react';
import { withRouter } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import LAMP from '../lamp';
import Grid from '@material-ui/core/Grid';
import {useDropzone} from 'react-dropzone'
import {saveAs} from 'file-saver'

const styles = theme => ({
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
});

function Dropzone(props) {
  const {acceptedFiles, getRootProps, getInputProps, open} = useDropzone()

    const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ))

  return (
    <div {...getRootProps}>
      <input {...getInputProps()} />
       <Typography variant="h6" align="left" style={{ fontWeight: 300, paddingBottom: 10 }}>
       Drag a completed form here or upload below
       </Typography>
      <button type="button" onClick={open}>
        Upload Form
      </button>
        <Typography variant="h6" align="left" style={{ fontWeight: 200, paddingTop: 20, paddingBottom: 10 }}>Files</Typography>
            <ul>{files}</ul>

    </div>
  )
}

class Forms extends React.Component {

    componentDidMount() {
        this.props.layout.setTitle('Forms')
    }

    handleSubmit = (event) => {

    }



    handleRegister = (event) => {
        this.props.history.push('/register')
    }

    render = () =>
    <Grid container justify="space-around" alignItems="center" style={{marginTop: '48px'}}><Grid item xs={4}>
        <Paper square={true} elevation={12} style={{padding: '16px'}}>
            <Typography variant="h4" align="center" style={{ fontWeight: 400, paddingBottom: 10 }}>Forms</Typography>
            <Dropzone />
            <form action="" onSubmit={this.handleSubmit}>
                <br />
                <Button
                    variant="outlined"
                    color="default"
                    style={{width: '45%'}}
                    onClick={this.handleRegister}>
                    Register
                </Button>
            </form>
        </Paper>
    </Grid></Grid>
}

export default withRouter(Forms);
