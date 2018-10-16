import React from 'react';
import ReactMarkdown from 'react-markdown/with-html';
import Emoji from 'react-emoji-render';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

const renderers = (rootProps) => ({
	text: props => <Emoji text={props.value} />, // TODO: make all text Roboto within here!
	heading: ({ level, ...props }) => {
		let variant;
		let component;
		let color = 'textPrimary';
		switch (level) {
			case 1: variant = 'display4'; component = 'h1'; break;
			case 2: variant = 'display3'; component = 'h2'; break;
			case 3: variant = 'display2'; component = 'h3'; break;
			case 4: variant = 'display1'; component = 'h4'; break;
			case 5: variant = 'headline'; component = 'h5'; break;
			case 6: variant = 'subheading'; component = 'h6'; break;
			default: variant = 'body1'; component = 'p'; break;
		}
		return <Typography {...props}
						   gutterBottom
						   variant={variant}
						   color={color}
						   component={component} />;
	},
	paragraph: props =>
		<Typography {...props} paragraph />,
	blockquote: props => // TODO: fix marginBottom + textSecondary!
		<div {...props} style={{ display: 'inline-block', color: '#eee', borderLeft: '5px solid #eee', paddingLeft: '0.5em' }} />,
	inlineCode: (props) =>
		<code
			style={{ padding: 4, margin: '0px 4px', borderRadius: 4, backgroundColor: '#eee' }}>{props.children}</code>,
	code: (props) =>
		<pre
			style={{ padding: '1%', borderRadius: 4, backgroundColor: '#eee' }}>
			<code>{props.value}</code>
		</pre>,
	thematicBreak: (props) =>
		<Divider
			style={{ margin: '10px 0' }} />,
	list: props => props.ordered ?
		<ol {...props} style={{
			listStyleType: props.children[0].props.checked !== null ? 'none': undefined,
			paddingLeft: props.children[0].props.checked !== null ? '1em' : undefined,
		}} /> :
		<ul {...props} style={{
			listStyleType: props.children[0].props.checked !== null ? 'none': undefined,
			paddingLeft: props.children[0].props.checked !== null ? '1em' : undefined,
		}} />,
	listItem: props =>
		<li>
			{props.checked !== undefined && props.checked !== null ?
				<FormControlLabel
					control={<Checkbox disabled
									   style={{ padding: 0, marginRight: 4 }}
									   checked={props.checked} />}
					label={<Typography component="span" {...props} />} /> :
				<Typography component="span" {...props} />
			}
		</li>,
	table: props =>
		<Table {...props}
			   style={{ display: 'inline-block' }} />,
	tableHead: props =>
		<TableHead {...props} />,
	tableBody: props =>
		<TableBody {...props} />,
	tableRow: props =>
		<TableRow {...props} hover={!props.isHeader} />,
	tableCell: props =>
		<TableCell {...props}
				   numeric={props.align === 'right'}
				   padding="checkbox" />,
	link: props =>
		<Button
			component="a"
			color="primary"
			style={{ display: 'inline-block', padding: 4, minHeight: 0, minWidth: 0, textTransform: 'none' }}
			children={props.children}
			href={(!rootProps.onPageEnter || props.href.startsWith('http')) ? props.href : undefined}
			onClick={() => (rootProps.onPageEnter || (x => {}))(props.href)} />,
	image: props =>
		<img {...props}
			 style={{ maxWidth: '100%' }}
			 src={props.src.startsWith('http') ? props.src : rootProps.imageBaseUrl + '/' + props.src} />,
	linkReference: props => renderers(rootProps).link(props),
	imageReference: props => renderers(rootProps).image(props),
});

export default (props) => <ReactMarkdown {...props}
										 escapeHtml={false}
										 renderers={renderers(props)} />
