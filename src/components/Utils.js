
// Core Imports 
import React, { useEffect } from 'react'
import Paper from '@material-ui/core/Paper'
import Dialog from '@material-ui/core/Dialog'
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
import { useTheme } from '@material-ui/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

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
}

// 
export const ResponsiveMargin = React.forwardRef((props, ref) => {
    let sm = useMediaQuery(useTheme().breakpoints.down('sm'))
    return <div {...props} style={{ ...props.style, width: sm ? '100%' : props.style.width }} ref={ref} />
})

export const ResponsivePaper = React.forwardRef((props, ref) => {
    let sm = useMediaQuery(useTheme().breakpoints.down('sm'))
    return <Paper {...props} elevation={sm ? 0 : props.elevation} ref={ref} />
})

// 
export const ResponsiveDialog = ({ ...props }) => 
    <Dialog fullScreen={useMediaQuery(useTheme().breakpoints.down('sm'))} {...props} />

// 
export function PageTitle({ children, ...props }) {
    useEffect(() => { document.title = `${typeof children === 'string' ? children : ''}` })
    return <React.Fragment />
}

// Produces an array of integers from 0 until the specified max number.
export const rangeTo = (max) => [...Array(max).keys()]

// 
export const groupBy = (items, key) => items.reduce((result, item) => ({ ...result, [item[key]]: [...(result[item[key]] || []), item]}), {})

//
export const shortDateFormat = {
	year: '2-digit', month: '2-digit', day: '2-digit',
}

// 
export const hourOnlyDateFormat = {
	weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
	hour: 'numeric'
}

//
export const mediumDateFormat = {
    year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'
}

//
export const fullDateFormat = {
	weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
	hour: 'numeric', minute: 'numeric'
}

// Stubbed code for .flat() which is an ES7 function...
Object.defineProperty(Array.prototype, 'flat', {
	value: function(depth = 1) {
		return this.reduce(function (flat, toFlatten) {
			return flat.concat((Array.isArray(toFlatten) && (depth-1)) ? toFlatten.flat(depth-1) : toFlatten);
		}, []);
	}
})

// Easier Date-string formatting using Date.formatUTC
Object.defineProperty(Date, 'formatUTC', {
	value: function(timestampUTC, formatObj) {
		formatObj.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
		return (new Date(timestampUTC).toLocaleString('en-US', formatObj))
	}
})

// Note the surveys we want to use in the average plot with their initial slot number as well as expected length.
const usableSurveys = {
    'ANXIETY, PSYCHOSIS, AND SOCIAL': [0, 16],
    'MOOD, SLEEP, AND SOCIAL': [16, 16],
    'ANXIETY': [0, 7],
    'PSYCHOSIS AND SOCIAL': [7, 9],
    'MOOD': [16, 9],
    'SLEEP AND SOCIAL': [25, 7],
}

// Note the short-name mappings for the above survey questions.
const surveyCatMap = {
    'Today I feel little interest or pleasure':'Mood',
    'Today I feel depressed':'Mood',
    'Today I had trouble sleeping':'Mood',
    'Today I had feel tired or have little energy':'Mood',
    'Today I have poor appetite or am overeating':'Mood',
    'Today I feel bad about myself or that I have let others down':'Mood',
    'Today I have trouble focusing or concentrating':'Mood',
    'Today I feel too slow or too restless':'Mood',
    'Today I have thoughts of self-harm':'Mood',
    'Last night I had trouble staying asleep':'Sleep',
    'Last night I had trouble falling asleep':'Sleep',
    'This morning I was up earlier than I wanted':'Sleep',
    'In the last THREE DAYS, I have taken my medications as scheduled':'Medication',
    'In the last THREE DAYS, during the daytime I have gone outside my home':'Social_Reverse',
    'In the last THREE DAYS, I have had someone to talk to':'Social_Reverse',
    'In the last THREE DAYS, I have preferred to spend time alone':'Social',
    'In the last THREE DAYS, I have felt uneasy with groups of people':'Social',
    'In the last THREE DAYS, I have had arguments with other people':'Social',
    'Today I feel anxious':'Anxiety',
    'Today I cannot stop worrying':'Anxiety',
    'Today I am worrying too much about different things':'Anxiety',
    'Today I have trouble relaxing':'Anxiety',
    'Today I feel so restless it\'s hard to sit still':'Anxiety',
    'Today I am easily annoyed or irritable':'Anxiety',
    'Today I feel afraid something awful might happen':'Anxiety',
    'Today I have heard voices or saw things others cannot':'Psychosis',
    'Today I have had thoughts racing through my head':'Psychosis',
    'Today I feel I have special powers':'Psychosis',
    'Today I feel people are watching me':'Psychosis',
    'Today I feel people are against me':'Psychosis',
    'Today I feel confused or puzzled':'Psychosis',
    'Today I feel unable to cope and have difficulty with everyday tasks':'Psychosis'
}

// Note the short-name mappings for the above survey questions.
const surveyMap = {
    "Today I feel anxious": "Anxious",
    "Today I cannot stop worrying": "Constant Worry",
    "Today I am worrying too much about different things": "Many Worries",
    "Today I have trouble relaxing": "Can't Relax",
    "Today I feel so restless it's hard to sit still": "Restless",
    "Today I am easily annoyed or irritable": "Irritable",
    "Today I feel afraid something awful might happen": "Afraid",
    "Today I have heard voices or saw things others cannot": "Voices",
    "Today I have had thoughts racing through my head": "Racing Thoughts",
    "Today I feel I have special powers": "Special Powers",
    "Today I feel people are watching me": "People watching me",
    "Today I feel people are against me": "People against me",
    "Today I feel confused or puzzled": "Confused",
    "Today I feel unable to cope and have difficulty with everyday tasks": "Unable to cope",
    "In the last THREE DAYS, I have had someone to talk to": "Someone to talk to",
    "In the last THREE DAYS, I have felt uneasy with groups of people": "Uneasy in groups",
    "Today I feel little interest or pleasure": "Low interest",
    "Today I feel depressed": "Depressed",
    "Today I had trouble sleeping": "Trouble Sleeping",
    "Today I feel tired or have little energy": "Low Energy",
    "Today I have a poor appetite or am overeating": "Low/High Appetite",
    "Today I feel bad about myself or that I have let others down": "Poor self-esteem",
    "Today I have trouble focusing or concentrating": "Can't focus",
    "Today I feel too slow or too restless": "Feel slow",
    "Today I have thoughts of self-harm": "Self-harm",
    "Last night I had trouble falling asleep": "Can't fall asleep",
    "Last night I have had trouble falling asleep": "Can't fall asleep",
    "Last night I had trouble staying asleep": "Can't stay asleep",
    "This morning I was up earlier than I wanted": "Waking up early",
    "In the last THREE DAYS, I have taken my medications as scheduled": "Medication",
    "In the last THREE DAYS, during the daytime I have gone outside my home": "Spent time outside",
    "In the last THREE DAYS, I have preferred to spend time alone": "Prefer to be alone",
    "In the last THREE DAYS, I have had arguments with other people": "Arguments with others",
    "I trust this app to guide me towards my personal goals" : "Goals",
    "I believe this app's tasks will help me to address my problem" : "Tasks",
    "This app encourages me to accomplish tasks and make progress" : "Encouragement",
    "I agree that the tasks within this app are important for my goals" : "Tasks match goals",
    "This app is easy to use and operate" : "Usability",
    "This app supports me to overcome challenges" : "Support",
    "When I see others who are doing better than I am, I realize it's possible to improve" : "Can improve",
    "When I see others who are doing better than I am, I feel frustrated about my own situation" : "Frustrated",
    "When I see others who are doing worse than I am, I feel fear that my future will be similar to them" : "Similar future",
    "When I see others who are doing worse than I am, I feel relieved about my own situation" : "Relieved"
}
