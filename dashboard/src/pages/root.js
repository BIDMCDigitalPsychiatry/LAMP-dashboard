import React from 'react'
import { withRouter } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import LAMP from '../lamp.js';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';

class Root extends React.Component {
	state = {
		data: []
	}

	componentWillMount() {
		this.props.layout.pageLoading(false)

		if ((LAMP.auth || {type: null}).type !== 'root') {
			this.props.history.replace(`/`)
			return
		}
		this.props.layout.setTitle(`Administrator`)

		LAMP.Researcher.all().then(res => {
			this.setState({ data: res })
			this.props.layout.pageLoading(true)
			this.props.layout.showMessage('Proceed with caution: you are logged in as the administrator.')
		})
	}

	rowSelect = (rowNumber) => this.props.history.push(`/researcher/${this.state.data[rowNumber].id}`)

	render = () =>
		<div>
			<Card>
				<Toolbar>
					<Typography variant="title" color="inherit">
						All Researchers
					</Typography>
				</Toolbar>
				<Divider />
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Email</TableCell>
							<TableCell>Name</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{this.state.data.map((row, index) => (
							<TableRow hover key={index} onClick={(e) => this.rowSelect(index)}>
								<TableCell>{row.email}</TableCell>
								<TableCell>{row.name}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Card>
		</div>
}

export default withRouter(Root)
