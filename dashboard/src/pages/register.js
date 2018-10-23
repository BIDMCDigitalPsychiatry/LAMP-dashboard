import React from 'react';
import { withRouter } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import LAMP from '../lamp.js';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
});

class Register extends React.Component {
    state = {
        password: "",
        passwordErrText: "",
        password2: "",
        password2ErrText: "",
        name: "",
        nameErrText: "",
        email: "",
        emailErrText: "",
        address: "",
        addressErrText: ""
    }

    componentDidMount() {
        this.props.layout.setTitle('Register')
    }

    validator = {
        password: [{
            test: (val) => val !== "",
            msg: "This field is required"
        }, {
            test: (val) => val.length >= 8,
            msg: "Password must be 8 characters or more"
        }],
        password2: [{
            test: (val) => val !== "",
            msg: "This field is required"
        }, {
            test: (val) => val === this.state.password,
            msg: "Passwords does not match"
        }],
        email: [{
            test: (val) => val !== "",
            msg: "This field is required"
        }, {
            test: (val) => val.match(/^.+@.+$/) !== null,
            msg: "Must be a valid email"
        }],
        address: [{
            test: (val) => val !== "",
            msg: "This field is required"
        }],
        name: [{
            test: (val) => val !== "",
            msg: "This field is required"
        }],
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({[name]: value});

        let errored = false;

        this.validator[name].forEach(({test, msg}) => {
            if (!errored && !test(value)) {
                this.setState({[name+"ErrText"]: msg})
                errored = true;
            }
        })

        if (!errored) {
            this.setState({[name+"ErrText"]: ""})
        }
    }

    handleSubmit = (event) => {
        event.preventDefault()
        let errored = false

        Object.keys(this.validator).forEach((field) => {
            let erroredField = false
            this.validator[field].forEach(({test, msg}) => {
                if (!erroredField && !test(this.state[field])) {
                    this.setState({[field+"ErrText"]: msg})
                    erroredField = true
                    errored = true;
                }
            })
        })
        if (errored)
            return this.props.layout.showMessage('Not all fields are filled out!')

        LAMP.Participant.add({
            username: this.state.username,
            password: this.state.password,
            first: this.state.firstname,
            last: this.state.lastname,
            email: this.state.email,
            address: this.state.address,
            city: this.state.city,
            state: this.state.state,
            zip: this.state.zip
        }).then(res => {
            if (!!res['error'])
                this.props.layout.showMessage(`Error: ${res['error']}`)
            else if (res['result']) {
                LAMP.Researcher.login({
                    username: this.state.username,
                    password: this.state.password
                }).then(res => {
                    if (res['error'] !== undefined) {
                        this.props.history.replace('/login')
                    }
                    else if (res['result']){
                        this.props.history.replace('/participant')
                    }
                }).catch(err => {
                    this.props.history.replace('/login')
                })
            }
        }).catch(err => {
            console.warn("Error with auth request", err)
            this.props.layout.showMessage('Error: please try again: ' + err.message + '.')
        })
    }

    handleLogin = (event) => this.props.history.replace('/login')

    render = () => 
    <Grid container justify="space-around" alignItems="center" style={{marginTop: '48px'}}><Grid item xs={4}>
        <Paper square={true} elevation={12} style={{padding: '16px'}}>
            <Typography variant="display4" style={{ fontWeight: 500 }}>Create an account.</Typography>
            <Typography variant="body2" color="primary" style={{ lineHeight: '0.5em', paddingLeft: 0 }}>
                LAMP Researcher
            </Typography>
                <form action="" onSubmit={this.handleSubmit}>
                    <TextField
                        required
                        hintText="John Torous"
                        label="Name"
                        style={{width: '100%'}}
                        margin="normal"
                        variant="outlined"
                        name="name"
                        value={this.state.name}
                        className={styles.textField}
                        errorText={this.state.nameErrText}
                        onChange={this.handleChange}
                        />
                    <TextField
                        required
                        hintText="john@torous.com"
                        label="Email"
                        style={{width: '100%'}}
                        margin="normal"
                        variant="outlined"
                        name="email"
                        value={this.state.email}
                        className={styles.textField}
                        errorText={this.state.emailErrText}
                        onChange={this.handleChange}
                        />
                    <TextField
                        hintText="75 Fenwood Rd, Boston, MA 02118"
                        label="Address"
                        style={{width: '100%'}}
                        margin="normal"
                        variant="outlined"
                        name="address"
                        value={this.state.address}
                        className={styles.textField}
                        errorText={this.state.addressErrText}
                        onChange={this.handleChange}
                        />
                    <TextField
                        required
                        hintText="********"
                        label="Password"
                        type="password"
                        style={{width: '100%'}}
                        margin="normal"
                        variant="outlined"
                        name="password"
                        value={this.state.password}
                        className={styles.textField}
                        errorText={this.state.passwordErrText}
                        onChange={this.handleChange}
                        />
                    <TextField
                        required
                        hintText="********"
                        label="Renter Password"
                        type="password"
                        style={{width: '100%'}}
                        margin="normal"
                        variant="outlined"
                        name="password2"
                        value={this.state.password2}
                        className={styles.textField}
                        errorText={this.state.password2ErrText}
                        onChange={this.handleChange}
                        />
                    <br />
                    <Button
                        variant="outlined"
                        color="default"
                        style={{width: '45%'}}
                        onClick={this.handleLogin}>
                        Login
                    </Button>
                    <Button
                        variant="raised"
                        color="primary"
                        className="submit"
                        style={{float: 'right', width: '45%'}}
                        onClick={this.handleSubmit}>
                        Register
                        <input type="submit" style={{
							cursor: 'pointer',
							position: 'absolute',
							top: 0,
							bottom: 0,
							right: 0,
							left: 0,
							width: '100%',
							opacity: 0,
						}}/>
                    </Button>
                </form>
        </Paper>
    </Grid></Grid>
}

export default withRouter(Register);
