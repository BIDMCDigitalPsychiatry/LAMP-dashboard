
// Core Imports
import React, { useState, useEffect } from 'react'
import Box from '@material-ui/core/Box'
import MaterialTable from 'material-table'

// Local Imports
import LAMP from '../lamp'
import { ResponsivePaper } from '../components/Utils'

// TODO: Researcher: Create, Update, Delete

export default function Root({ ...props }) {
	return (
        <ResponsivePaper elevation={4}>
            <MaterialTable 
                title="Researchers"
                data={(props.root || [])} 
                columns={[
                    { title: 'Name', field: 'name' }, 
                    { title: 'Email', field: 'email' }
                ]}
                onRowClick={(event, rowData, togglePanel) => 
                    props.history.push(`/researcher/${(props.root || [])[rowData.tableData.id].id}`)}
                actions={[
                    {
                        icon: 'add_box',
                        tooltip: 'Add Researcher',
                        isFreeAction: true,
                        onClick: (event, rows) => props.layout.showAlert('Creating a new Researcher.')
                    }, {
                        icon: 'edit',
                        tooltip: 'Edit Researcher',
                        onClick: (event, rows) => props.layout.showAlert('Editing a Researcher.')
                    }, {
                        icon: 'delete_forever',
                        tooltip: 'Delete Researcher(s)',
                        onClick: (event, rows) => props.layout.showAlert('Deleting a Researcher.')
                    },
                ]}
                localization={{
                    body: {
                        emptyDataSourceMessage: 'No Researchers. Add Researchers by clicking the [+] button above.',
                        editRow: { deleteText: 'Are you sure you want to delete this Researcher?' }
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
        </ResponsivePaper>
    )
}
