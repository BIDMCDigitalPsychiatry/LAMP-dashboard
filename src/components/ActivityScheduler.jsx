
// Core Imports
import React from 'react'
import { KeyboardDatePicker, KeyboardTimePicker } from '@material-ui/pickers'
import MaterialTable from 'material-table'

export default function ActivityScheduler({ activity, ...props }) {
	return (
        <MaterialTable 
            title={activity && activity.name}
            data={((activity || {}).schedule || [])} 
            columns={[
                { title: 'Start Date', field: 'start_date', 
                    render: rowData => <span>{(new Date(rowData.start_date)).toLocaleString('en-US', Date.formatStyle('dateOnly'))}</span>, 
                    editComponent: props => 
                        <KeyboardDatePicker 
                            autoOk 
                            animateYearScrolling
                            variant="inline" 
                            inputVariant="outlined" 
                            format="MM/dd/yyyy" 
                            label="Start Date" 
                            helperText="Select the start date." 
                            InputAdornmentProps={{ position: "start" }} 
                            value={props.value || new Date()} 
                            onChange={date => props.onChange(date)} 
                        /> 
                }, 
                { title: 'Time', field: 'time', 
                    render: rowData => <span>{(new Date(rowData.time)).toLocaleString('en-US', Date.formatStyle('timeOnly'))}</span>,
                    editComponent: props => 
                        <KeyboardTimePicker 
                            autoOk 
                            variant="inline" 
                            inputVariant="outlined" 
                            format="h:mm a" 
                            label="Time" 
                            helperText="Select the start time." 
                            InputAdornmentProps={{ position: "start" }} 
                            value={props.value || new Date()} 
                            onChange={date => props.onChange(date)} 
                        />
                }, 
                { title: 'Repeat Interval', field: 'repeat_interval',
                    editComponent: props => 
                        <KeyboardTimePicker 
                            autoOk 
                            variant="inline" 
                            inputVariant="outlined" 
                            format="h:mm a" 
                            label="Repeat Interval" 
                            helperText="Select the repeat interval." 
                            InputAdornmentProps={{ position: "start" }} 
                            value={props.value || new Date()} 
                            onChange={date => props.onChange(date)} 
                        />
                }
            ]}
            detailPanel={rowData => (
                (rowData.custom_time || []).length === 0 ? <React.Fragment /> :
                <MaterialTable 
                    style={{ margin: '0% 0% 0% 10%' }}
                    data={(rowData.custom_time || []).map(x => ({ custom_time: x }))} 
                    columns={[
                        { title: 'Custom Time', field: 'custom_time', 
                            render: rowData => <span>{(new Date(rowData.custom_time)).toLocaleString('en-US', Date.formatStyle('full'))}</span> }
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
                    components={{ Container: props => <div {...props} /> }}
                />
            )}
            editable={{
                onRowAdd: async (newData) => {

                },
                onRowUpdate: async (newData, oldData) => {

                },
                onRowDelete: async (oldData) => {

                }
            }}
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
            components={{ Container: props => <div {...props} /> }}
        />
    )
}
