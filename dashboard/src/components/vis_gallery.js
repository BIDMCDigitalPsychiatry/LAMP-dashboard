import React from 'react';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';

export default class VisGallery extends React.Component {
    state = { switched: [] }

    toggle = (idx) => {
        let switched = this.state.switched
        switched[idx] = !switched[idx]
        this.setState({switched})
        this.props.onChange(this.state.switched)
    }

    render = () =>
    <Grid container spacing={32}>
        {(this.props.value || []).map((x, i) =>
            <Grid item lg={4}>
                <Card>
                    <Switch onChange={() => this.toggle(i)} checked={this.state.switched[i] || false}/>
                    <br />
                    <img src={x[0]} style={{ objectFit: 'cover', width: '100%', height: '100%', overflow: 'hidden' }} />
                </Card>
            </Grid>
        )}
    </Grid>
}
