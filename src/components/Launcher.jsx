
// Core Imports
import React, { useState } from 'react'
import { 
    Box, Icon, IconButton, Typography, Divider, Grid, 
    Tooltip, Collapse, Paper, ButtonBase, useTheme 
} from '@material-ui/core'

var Launcher = {}

Launcher.Placeholder = function Placeholder({ ...props }) {
    return (
        <Box {...props} 
            bgcolor="grey.100" 
            border={1} 
            borderColor="grey.300" 
            borderRadius={4} 
            style={{ 
                width: 200, height: 100, 
                ...(props.style || {}) 
            }}
        >
            <Grid container 
                direction="column" 
                justify="center" 
                alignItems="center" 
                style={{ height: '100%' }}
            >
                <Grid item>
                    <Icon>more_horiz</Icon>
                </Grid>
                <Grid item>
                    <Typography variant="overline">
                        No items available
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    )
}

Launcher.Button = function Button({ notification, favorite, icon, title, onClick, ...props }) {
    const theme = useTheme()
    const color = (!!notification ? theme.palette.secondary.main : (!!favorite ? theme.palette.primary.main : theme.palette.background))
    const tooltip = (!!notification ? "You have a pending notification for this activity." : (!!favorite ? "You've added this activity as a favorite." : ''))
    return (
        <Tooltip disableHoverListener={tooltip.length === 0} title={tooltip}>
            <Paper 
                elevation={4} 
                style={{ 
                    width: 200, 
                    height: 100, 
                    background: color, 
                    color: (!!notification || !!favorite) ? '#fff' : theme.palette.text.primary
                }}
            >
                <ButtonBase 
                    style={{ width: '100%', height: '100%' }} 
                    onClick={onClick || (() => {})}
                >
                    <Grid container 
                        direction="column" 
                        justify="center" 
                        alignItems="center" 
                        style={{ height: '100%' }}
                    >
                        <Grid item>
                            {icon || <Icon fontSize="large">assignment</Icon>}
                        </Grid>
                        <Grid item>
                            <Typography variant="overline" style={{ lineHeight: 'normal' }}>
                                {(!!notification || !!favorite) ? <b>{title}</b> : title}
                            </Typography>
                        </Grid>
                    </Grid>
                </ButtonBase>
            </Paper>
        </Tooltip>    
    )
}

Launcher.Section = function Section({ title, children, ...props }) {
    const [expanded, setExpanded] = useState(!!children)
    // eslint-disable-next-line
    const [scroll, setScroll] = useState(true)
    return (
        <React.Fragment>
            <Grid item style={{ margin: '0px 16px' }}>
                <Typography variant="overline" 
                    style={{ fontWeight: 700, fontSize: 16 }}
                >
                    {title}
                </Typography>
                <IconButton 
                    style={{ margin: -12 }} 
                    onClick={() => setExpanded(x => !x)}
                >
                    <Icon>{expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</Icon>
                </IconButton>
            </Grid>
            <Collapse in={expanded} collapsedHeight={0}>
                <Grid item>
                    <Box mx={2}>
                        <Grid container 
                            direction="row" 
                            spacing={scroll ? 2 : 1} 
                            wrap={scroll ? 'nowrap' : 'wrap'} 
                            style={{ 
                                overflowX: scroll ? 'scroll' : undefined, 
                                overflowY: scroll ? 'hidden' : undefined,
                                padding: scroll ? '0px 0px 16px 16px' : undefined
                            }}
                        >
                            {!!children ? (!Array.isArray(children) ? 
                                <Grid item>
                                    {children}
                                </Grid> : 
                                children.map((x, idx) => (
                                    <Grid item key={idx}>
                                        {x}
                                    </Grid>
                                ))) :
                                <Grid item>
                                    <Launcher.Placeholder />
                                </Grid>
                            }
                            <Grid item />
                        </Grid>
                    </Box>
                </Grid>
            </Collapse>
        </React.Fragment>
    )
}

Launcher.Group = function({ children, ...props }) {
	return (
        <Grid container 
            direction="column" 
            spacing={2}
            wrap="nowrap"
        >
            <Grid item />
            {children.map((x, idx) => 
                <React.Fragment key={idx}>
                    {x}
                    {idx + 1 < children.length && <Grid item><Divider /></Grid>}
                </React.Fragment>
            )}
            <Grid item />
        </Grid>
	)
}

export default Launcher
