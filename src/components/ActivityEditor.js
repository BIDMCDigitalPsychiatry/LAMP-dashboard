
// Core Imports
import React from 'react'
import MaterialTable from 'material-table'

export default function ActivityEditor({ activity,  ...props }) {
	return (
        <MaterialTable 
            title={activity && activity.name}
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
                    components={{ Container: props => <div {...props} /> }}
                />
            )}
            localization={{
                body: {
                    emptyDataSourceMessage: 'No questions.',
                    editRow: { deleteText: 'Are you sure you want to delete this question?' }
                }
            }}
            options={{
                selection: false,
                actionsColumnIndex: -1,
                pageSize: 10,
                pageSizeOptions: [10, 25, 50, 100]
            }}
            components={{ Container: props => <div {...props} /> }}
        />
    )
}
