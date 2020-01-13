
// Core Imports 
import React, { useState, useEffect } from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableHead from '@material-ui/core/TableHead'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'

// Convert underscore case into human-readable strings.
const humanize = (str) => str.replace(/(^|_)(\w)/g, ($0, $1, $2) => ($1 && ' ') + $2.toUpperCase())

// Expects a homogenous array (!!) and produces a Table.
export default class ArrayView extends React.Component {

    // Get all the keys we'll be displaying from the array.
    displayKeys = () => Object.keys(this.props.value[0] || {}).filter(x => !((this.props.hiddenKeys || []).includes(x)))

    render = () => 
    <div style={{ overflowX: 'auto' }}>
        <Table>
            <TableHead>
                <TableRow>
                {this.displayKeys().map((key) => (
                    <TableCell key={key} style={{borderBottom: 0}} tooltip={humanize(key)}>{humanize(key)}</TableCell>
                ))}
                </TableRow>
            </TableHead>
            <TableBody>
            {this.props.value.map((row, index) => (
                <React.Fragment>
                    <TableRow hover key={index}>
                    {this.displayKeys().map((key) => Array.isArray(row[key]) ? (
                        <ArrayView value={row[key]} />
                    ) : (!!row[key]) && (typeof row[key] === 'object') ? (
                        <ArrayView value={[row[key]]} />
                    ) : (
                        <TableCell key={row[key]} style={{borderBottom: 0}}>{row[key]}</TableCell>
                    ))}
                    </TableRow>
                    {((!!this.props.hasSpanningRowForIndex && !!this.props.spanningRowForIndex) && this.props.hasSpanningRowForIndex(index)) &&
                        <TableRow key={`${index}-optional`}>
                            <TableCell colSpan={this.displayKeys().length}>
                                {this.props.spanningRowForIndex(index)}
                            </TableCell>
                        </TableRow>
                    }
                </React.Fragment>
            ))}
            </TableBody>
        </Table>
    </div>
}