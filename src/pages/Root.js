
// Core Imports
import React from 'react'
import { withRouter } from 'react-router-dom'
import MaterialTable from 'material-table'

// Local Imports
//import LAMP from '../lamp'

// TODO: Researcher: Create, Update, Delete

class Root extends React.Component {
	state = {}
	async componentWillMount() {
		this.props.layout.pageLoading(false)

		if ((this.props.auth.auth || {type: null}).type !== 'root') {
			this.props.history.replace(`/`)
			return
		}
		this.props.layout.setTitle(`Administrator`)

        this.setState({ data: this.props.auth.identity })
        this.props.layout.pageLoading(true)
        this.props.layout.showMessage('Proceed with caution: you are logged in as the administrator.')
	}

	render = () =>
    <MaterialTable 
        title="Researchers"
        data={(this.state.data || [])} 
        columns={[
            { title: 'Name', field: 'name' }, 
            { title: 'Email', field: 'email' }
        ]}
        onRowClick={(event, rowData, togglePanel) => 
            this.props.history.push(`/researcher/${this.state.data[rowData.tableData.id].id}`)}
        actions={[
            {
                icon: 'add_box',
                tooltip: 'Add Researcher',
                isFreeAction: true,
                onClick: (event, rows) => this.props.layout.showAlert('Creating a new Researcher.')
            }, {
                icon: 'edit',
                tooltip: 'Edit Researcher',
                onClick: (event, rows) => this.props.layout.showAlert('Editing a Researcher.')
            }, {
                icon: 'delete_forever',
                tooltip: 'Delete Researcher(s)',
                onClick: (event, rows) => this.props.layout.showAlert('Deleting a Researcher.')
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
    />
}

export default withRouter(Root)
