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
import EventBus from 'eventing-bus'

class Root extends React.Component {
	state = {
		data: []
	}

	componentWillMount() {
		if ((LAMP.auth || {type: null}).type !== 'root') {
			this.props.history.replace(`/`)
			return
		}
		EventBus.publish("set_title", `LAMP Administrator`)

		LAMP.Researcher.all().then(res => {
			this.setState({ data: res })
		})
	}

	rowSelect = (rowNumber) => this.props.history.push(`/researcher/${this.state.data[rowNumber].id}`)

	render = () =>
		<div>
			<Card style={{ width: '80%', marginTop: 20, marginLeft: 'auto', marginRight: 'auto' }}>
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
							<TableRow key={index} onClick={(e) => this.rowSelect(index)}>
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
