
// Core Imports
import React, { useState, useEffect } from 'react'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import MaterialTable from 'material-table'

// Local Imports
import { 
    ResponsivePaper, 
    timeOnlyDateFormat, 
    dateOnlyDateFormat, 
    fullDateFormat 
} from '../components/Utils'

export default function Activity({ activity,  ...props }) {
	return (
        <React.Fragment>
            <ResponsivePaper elevation={4}>
                <Typography variant="h5" align="center" style={{ fontWeight: 700, padding: 24 }}>
                    {activity && activity.name}
                </Typography>
            </ResponsivePaper>
            <div style={{ height: 24, width: '100%' }} />
            {((activity || {}).spec) === 'lamp.survey' && <ResponsivePaper elevation={4}>
                <MaterialTable 
                    title="Questions"
                    data={((activity || {}).settings || []).map(x => typeof x === 'object' ? x : { value: x })} 
                    columns={[
                        { title: 'Text', field: 'text' }, 
                        { title: 'Type', field: 'type' }
                    ]}
                    detailPanel={rowData => (
                        (rowData.options || []).length === 0 ? <React.Fragment /> :
                        <MaterialTable 
                            style={{ margin: '0% 0% 0% 10%' }}
                            data={(rowData.options || []).map(x => ({ option: x }))} 
                            columns={[
                                { title: 'Option', field: 'option' }
                            ]}
                            localization={{
                                body: {
                                    emptyDataSourceMessage: 'No options.',
                                    editRow: { deleteText: 'Are you sure you want to delete this question option?' }
                                }
                            }}
                            options={{
                                maxBodyHeight: 256,
                                toolbar: false,
                                search: false,
                                selection: true,
                                actionsColumnIndex: -1,
                                pageSize: 10,
                                pageSizeOptions: [10, 25, 50, 100]
                            }}
                            components={{ Container: props => <Box {...props} /> }}
                        />
                    )}
                    localization={{
                        body: {
                            emptyDataSourceMessage: 'No questions.',
                            editRow: { deleteText: 'Are you sure you want to delete this question?' }
                        }
                    }}
                    options={{
                        selection: true,
                        actionsColumnIndex: -1,
                        pageSize: 10,
                        pageSizeOptions: [10, 25, 50, 100]
                    }}
                    components={{ Container: props => <Box {...props} /> }}
                />
            </ResponsivePaper>}
            <div style={{ height: 48, width: '100%' }} />
            <ResponsivePaper elevation={4}>
                <MaterialTable 
                    title="Schedule"
                    data={((activity || {}).schedule || [])} 
                    columns={[
                        { title: 'Start Date', field: 'start_date', 
                            render: rowData => <span>{(new Date(rowData.start_date)).toLocaleString('en-US', dateOnlyDateFormat)}</span> }, 
                        { title: 'Time', field: 'time', 
                            render: rowData => <span>{(new Date(rowData.time)).toLocaleString('en-US', timeOnlyDateFormat)}</span> }, 
                        { title: 'Repeat Interval', field: 'repeat_interval' }
                    ]}
                    detailPanel={rowData => (
                        (rowData.custom_time || []).length === 0 ? <React.Fragment /> :
                        <MaterialTable 
                            style={{ margin: '0% 0% 0% 10%' }}
                            data={(rowData.custom_time || []).map(x => ({ custom_time: x }))} 
                            columns={[
                                { title: 'Custom Time', field: 'custom_time', 
                                    render: rowData => <span>{(new Date(rowData.custom_time)).toLocaleString('en-US', fullDateFormat)}</span> }
                            ]}
                            localization={{
                                body: {
                                    emptyDataSourceMessage: 'No custom times.',
                                    editRow: { deleteText: 'Are you sure you want to delete this custom time?' }
                                }
                            }}
                            options={{
                                maxBodyHeight: 256,
                                toolbar: false,
                                search: false,
                                selection: true,
                                actionsColumnIndex: -1,
                                pageSize: 10,
                                pageSizeOptions: [10, 25, 50, 100]
                            }}
                            components={{ Container: props => <Box {...props} /> }}
                        />
                    )}
                    localization={{
                        body: {
                            emptyDataSourceMessage: 'No schedule.',
                            editRow: { deleteText: 'Are you sure you want to delete this schedule item?' }
                        }
                    }}
                    options={{
                        search: false,
                        selection: true,
                        actionsColumnIndex: -1,
                        pageSize: 10,
                        pageSizeOptions: [10, 25, 50, 100]
                    }}
                    components={{ Container: props => <Box {...props} /> }}
                />
            </ResponsivePaper>
        </React.Fragment>
    )
}
