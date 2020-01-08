
// Core Imports
import React, { useState } from 'react'
import Box from '@material-ui/core/Box'
import Icon from '@material-ui/core/Icon'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import Tooltip from '@material-ui/core/Tooltip'
import { useTheme } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import ButtonBase from '@material-ui/core/ButtonBase'

// Local Imports
import Breathe from './Breathe'
import Jewels from './Jewels'
import { ResponsiveDialog } from './Utils'

var currentTheme = {}

export default function ActivityLauncher({ ...props }) {
	const [launchedActivity, setLaunchedActivity] = useState()

    currentTheme = useTheme() // FIXME

	return (
        <Grid container direction="column" spacing={2}>
            <Grid item />
            <Grid item style={{ margin: '0px 16px' }}>
                <Typography variant="overline" style={{ fontWeight: 700, fontSize: 16 }}>
                    Learn
                </Typography>
            </Grid>
            <Grid item style={{ margin: '0px 8px' }}>
                <Grid container direction="row" spacing={2} wrap="nowrap" style={{ overflow: 'auto' }}>
                    <Grid item>
                        <Tooltip disableHoverListener title="">
                            <Box bgcolor="grey.100" border={1} borderColor="grey.300" borderRadius={4} style={{ width: 200, height: 100 }}>
                                <Grid container direction="column" justify="center" alignItems="center" style={{ height: '100%' }}>
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
                        </Tooltip>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item>
                <Divider />
            </Grid>
            <Grid item style={{ margin: '0px 16px' }}>
                <Typography variant="overline" style={{ fontWeight: 700, fontSize: 16 }}>
                    Assess
                </Typography>
            </Grid>
            <Grid item style={{ margin: '0px 8px' }}>
                <Grid container direction="row" spacing={2} wrap="nowrap" style={{ overflow: 'auto' }}>
                    <Grid item>
                        <Tooltip title="You have a pending notification for this activity.">
                            <Paper elevation={4} style={{ width: 200, height: 100, background: currentTheme.palette.secondary.main, color: '#fff' }}>
                                <ButtonBase style={{ width: '100%', height: '100%' }} onClick={() => setLaunchedActivity('breathe')}>
                                    <Grid container direction="column" justify="center" alignItems="center" style={{ height: '100%' }}>
                                        <Grid item>
                                            <Icon fontSize="large">assignment</Icon>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="overline">
                                                <b>Breathe</b>
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </ButtonBase>
                            </Paper>
                        </Tooltip>
                    </Grid>
                    <Grid item>
                        <Tooltip title="You've added this activity as a favorite.">
                            <Paper elevation={4} style={{ width: 200, height: 100, background: currentTheme.palette.primary.main, color: '#fff' }}>
                                <ButtonBase style={{ width: '100%', height: '100%' }} onClick={() => setLaunchedActivity('jewels')}>
                                    <Grid container direction="column" justify="center" alignItems="center" style={{ height: '100%' }}>
                                        <Grid item>
                                            <Icon fontSize="large">assignment</Icon>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="overline">
                                                <b>Jewels</b>
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </ButtonBase>
                            </Paper>
                        </Tooltip>
                    </Grid>
                    <Grid item>
                        <Tooltip disableHoverListener title="">
                            <Paper elevation={4} style={{ width: 200, height: 100 }}>
                                <ButtonBase style={{ width: '100%', height: '100%' }}>
                                    <Grid container direction="column" justify="center" alignItems="center" style={{ height: '100%' }}>
                                        <Grid item>
                                            <Icon fontSize="large">assignment</Icon>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="overline">
                                                Item 3
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </ButtonBase>
                            </Paper>
                        </Tooltip>
                    </Grid>
                    <Grid item>
                        <Tooltip disableHoverListener title="">
                            <Paper elevation={4} style={{ width: 200, height: 100 }}>
                                <ButtonBase style={{ width: '100%', height: '100%' }}>
                                    <Grid container direction="column" justify="center" alignItems="center" style={{ height: '100%' }}>
                                        <Grid item>
                                            <Icon fontSize="large">assignment</Icon>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="overline">
                                                Item 4
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </ButtonBase>
                            </Paper>
                        </Tooltip>
                    </Grid>
                    <Grid item>
                        <Tooltip disableHoverListener title="">
                            <Paper elevation={4} style={{ width: 200, height: 100 }}>
                                <ButtonBase style={{ width: '100%', height: '100%' }}>
                                    <Grid container direction="column" justify="center" alignItems="center" style={{ height: '100%' }}>
                                        <Grid item>
                                            <Icon fontSize="large">assignment</Icon>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="overline">
                                                Item 5
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </ButtonBase>
                            </Paper>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item>
                <Divider />
            </Grid>
            <Grid item style={{ margin: '0px 16px' }}>
                <Typography variant="overline" style={{ fontWeight: 700, fontSize: 16 }}>
                    Manage
                </Typography>
            </Grid>
            <Grid item style={{ margin: '0px 8px' }}>
                <Grid container direction="row" spacing={2} wrap="nowrap" style={{ overflow: 'auto' }}>
                    <Grid item>
                        <Tooltip disableHoverListener title="">
                            <Paper elevation={4} style={{ width: 200, height: 100 }}>
                                <ButtonBase style={{ width: '100%', height: '100%' }}>
                                    <Grid container direction="column" justify="center" alignItems="center" style={{ height: '100%' }}>
                                        <Grid item>
                                            <Icon fontSize="large">assignment</Icon>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="overline">
                                                Item 1
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </ButtonBase>
                            </Paper>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item>
                <Divider />
            </Grid>
            <Grid item style={{ margin: '0px 16px' }}>
                <Typography variant="overline" style={{ fontWeight: 700, fontSize: 16 }}>
                    Prevent
                </Typography>
            </Grid>
            <Grid item style={{ margin: '0px 8px' }}>
                <Grid container direction="row" spacing={2} wrap="nowrap" style={{ overflow: 'auto' }}>
                    <Grid item>
                        <Tooltip disableHoverListener title="">
                            <Box bgcolor="grey.100" border={1} borderColor="grey.300" borderRadius={4} style={{ width: 200, height: 100 }}>
                                <Grid container direction="column" justify="center" alignItems="center" style={{ height: '100%' }}>
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
                        </Tooltip>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item />
			<ResponsiveDialog transient animate fullScreen open={!!launchedActivity} onClose={() => setLaunchedActivity()}>
				{launchedActivity === 'breathe' ?
					<Breathe onComplete={() => setLaunchedActivity()} /> : 
					<Jewels onComplete={() => setLaunchedActivity()} />
				}
			</ResponsiveDialog>
        </Grid>
	)
}