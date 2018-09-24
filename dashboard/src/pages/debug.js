import LAMP from '../lamp.js';
import React from 'react'
import Tree from 'react-animated-tree'
import Typography from '@material-ui/core/Typography'

export default class Debug extends React.Component {

    //
    label = (str) => <Typography style={{ display: "inline" }}>{str}</Typography>

    // Create a tree of all available LAMP API endpoints.
    render = () => 
    <div style={{padding:'48px', width: '100%'}}>
        <Tree content={this.label("LAMP API")} type="ROOT" open style={{color: 'black', fill: 'black'}}>
        {Object.keys(LAMP.typedef).map((t) => 
            <Tree content={this.label("" + t)}>
                {Object.entries(LAMP.typedef[t].enumerations || {}).map((x) => 
                    <Tree content={this.label("" + x[1])} type="CASE" />
                )}
                {Object.entries(LAMP.typedef[t].properties || {}).map((x) => 
                    <Tree content={this.label(x[0] + ": " + x[1])} type="PROP" />
                )}
                {Object.entries(LAMP.typedef[t].endpoints || {}).map((x) => 
                    <Tree content={this.label("" + x[1])} type="API" />
                )}
            </Tree>
        )}
        </Tree>
    </div>
}
