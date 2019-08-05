
// Core Imports
import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableHead from '@material-ui/core/TableHead'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import TablePagination from '@material-ui/core/TablePagination'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Checkbox from '@material-ui/core/Checkbox'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import FilterListIcon from '@material-ui/icons/FilterList'
import Divider from '@material-ui/core/Divider'

// External Imports
import classNames from 'classnames'

// Convert underscore case into human-readable strings.
const humanize = (str) => str.replace(/(^|_)(\w)/g, ($0, $1, $2) => ($1 && ' ') + $2.toUpperCase())

// See below.
export class ObjectView extends React.Component {

    // Get all the keys we'll be displaying from the array.
    displayKeys = () => Object.keys(this.props.value || {}).filter(x => !((this.props.hiddenKeys || []).includes(x)))

    render = () =>
    <Table>
        <TableBody>
            {this.displayKeys().map((key) =>
                <TableRow hover key={key}>
                    <TableCell style={{width:'20%'}}>
                        <Typography color="inherit" variant="body1">
                            {humanize(key)}
                        </Typography>
                    </TableCell>
                    <TableCell>{this.props.value[key]}</TableCell>
                </TableRow>
            )}
        </TableBody>
    </Table>
}

// Expects a homogenous array (!!) and produces a Table.
export class ArrayView extends React.Component {

    // Get all the keys we'll be displaying from the array.
    displayKeys = () => Object.keys(this.props.value[0] || {}).filter(x => !((this.props.hiddenKeys || []).includes(x)))

    render = () => 
    <Table>
        <TableHead>
            <TableRow>
            {this.displayKeys().map((key) => (
                <TableCell style={{borderBottom: 0}} tooltip={humanize(key)}>{humanize(key)}</TableCell>
            ))}
            </TableRow>
        </TableHead>
        <TableBody>
        {this.props.value.map((row, index) => (
            <TableRow hover key={index}>
            {this.displayKeys().map((key) => Array.isArray(row[key]) ? (
                <ArrayView value={row[key]} />
            ) : (!!row[key]) && (typeof row[key] === 'object') ? (
                <ArrayView value={[row[key]]} />
            ) : (
                <TableCell style={{borderBottom: 0}}>{row[key]}</TableCell>
            ))}
            </TableRow>
        ))}
        </TableBody>
    </Table>
}

class DataTable extends ArrayView {
    state = {
        order: 'asc',
        orderBy: 'xyz',
        selected: [],
        page: 0,
        rowsPerPage: 5,
    };

    stableSort = (array, order2, orderBy2) => {
        const getSorting = (order, orderBy) => {
            const desc = (a, b, orderBy) => {
                if (b[orderBy] < a[orderBy])
                    return -1;
                if (b[orderBy] > a[orderBy])
                    return 1;
                return 0;
            }
            return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
        }
        const cmp = getSorting(order2, orderBy2)
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = cmp(a[0], b[0]);
            if (order !== 0)
                return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map(el => el[0]);
    }

    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';
        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }
        this.setState({ order, orderBy });
    };

    handleSelectAllClick = event => {
        if (event.target.checked) {
            this.setState(state => ({ selected: this.props.value.map(n => n.id) }));
            return;
        }
        this.setState({ selected: [] });
    };

    handleClick = (event, id) => {
        const { selected } = this.state;
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        this.setState({ selected: newSelected });
    };

    handleChangePage = (event, page) => this.setState({ page });
    handleChangeRowsPerPage = event => this.setState({ rowsPerPage: event.target.value })
    isSelected = id => this.state.selected.indexOf(id) !== -1
    createSortHandler = property => event => this.handleRequestSort(event, property)
    
    emptyRows = () => this.state.rowsPerPage - Math.min(this.state.rowsPerPage, this.props.value.length - this.state.page * this.state.rowsPerPage);
    sortedData = () => this.stableSort(this.props.value, this.state.order, this.state.orderBy)
                           .slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)

    render = () =>  
    <div>
        <Toolbar
            className={(theme) => classNames({paddingRight: theme.spacing.unit}, {
                [this.props.classes.highlight]: this.state.selected.length > 0,
            })}>
            <div style={{flex: '0 0 auto'}}>
                {this.state.selected.length > 0 ? (
                    <Typography color="inherit" variant="subtitle1">
                        {this.state.selected.length} selected
                    </Typography>
                ) : (
                    <Typography variant="h6" id="tableTitle">
                        {this.props.title}
                    </Typography>
                )}
            </div>
            <div style={{flex: '1 1 100%'}} />
            <div color="secondary">
                {this.props.additionalButtons}
                {this.state.selected.length > 0 ? (
                    <Tooltip title="Delete">
                        <IconButton aria-label="Delete">
                            <DeleteIcon onClick={() => {
                                this.props.deleteHandler(this.state.selected)
                                this.setState({ selected: []})
                            }}/>
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Tooltip title="Filter list">
                        <IconButton aria-label="Filter list">
                            <FilterListIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </div>
        </Toolbar>
        <Divider />
        <Table style={{minWidth: 1020, overflowX: 'auto'}} aria-labelledby="tableTitle">
            <TableHead>
                <TableRow>
                    <TableCell padding="checkbox">
                        <Checkbox
                            indeterminate={this.state.selected.length > 0 && this.state.selected.length < this.props.value.length}
                            checked={this.state.selected.length === this.props.value.length}
                            onChange={this.handleSelectAllClick}/>
                    </TableCell>
                    {this.displayKeys().map((key) => (
                        <TableCell
                            sortDirection={this.state.orderBy === key ? this.state.order : false}>
                            <Tooltip
                                title="Sort"
                                enterDelay={300}>
                                <TableSortLabel
                                    active={this.state.orderBy === key}
                                    direction={this.state.order}
                                    onClick={this.createSortHandler(key)}>
                                    {humanize(key)}
                                </TableSortLabel>
                            </Tooltip>
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {this.sortedData().map((n, index) => {
                    const isSelected = this.isSelected(index);
                    return (
                    <TableRow
                        hover
                        onClick={event => this.handleClick(event, index)}
                        role="checkbox"
                        aria-checked={isSelected}
                        tabIndex={-1}
                        key={n.id}
                        selected={isSelected}>
                        <TableCell padding="checkbox">
                            <Checkbox checked={isSelected} />
                        </TableCell>
                        {this.displayKeys().map((key) => Array.isArray(n[key]) ? (
                            <ArrayView classes={this.props.classes} value={n[key]} />
                        ) : (!!n[key]) && (typeof n[key] === 'object') ? (
                            <ArrayView classes={this.props.classes} value={[n[key]]} />
                        ) : (
                            <TableCell>{
                                ["start_time", "end_time", "timestamp"].includes(key) ? 
                                new Date(n[key]).toString() : n[key]
                            }</TableCell>
                        ))}
                        </TableRow>
                    );
                })}
                {this.emptyRows() > 0 && (
                    <TableRow style={{ height: 49 * this.emptyRows() }}>
                        <TableCell colSpan={6} />
                    </TableRow>
                )}
            </TableBody>
        </Table>
        <TablePagination
            component="div"
            count={this.props.value.length}
            rowsPerPage={this.state.rowsPerPage}
            page={this.state.page}
            backIconButtonProps={{'aria-label': 'Previous Page'}}
            nextIconButtonProps={{'aria-label': 'Next Page'}}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage} />
    </div>
}

export default withStyles({})(DataTable)
