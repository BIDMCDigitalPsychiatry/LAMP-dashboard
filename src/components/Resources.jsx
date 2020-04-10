// Core Imports
import React, { useState } from "react"
import {
  Typography,
  makeStyles,
  Box,
  Icon,
  Link,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
} from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  root2: {
    maxWidth: 345,
    margin: "16px",
    maxLength: 500,
  },
  media: {
    height: 140,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}))

export default function Resources({ ...props }) {
  const classes = useStyles()
  return (
    <Box p={4} my={4} width='100%'>
      <div className={classes.root}>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<Icon>expand_more</Icon>}>
            <Typography className={classes.heading}>Department of Mental Health (DMH)</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Link href='https://www.mass.gov/orgs/massachusetts-department-of-mental-health'>
              Department of Mental Health (DMH)
            </Link>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<Icon>expand_more</Icon>}>
            <Typography className={classes.heading}>National Alliance on Mental Illness (NAMI)</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Link href='https://www.nami.org/#'>National Alliance on Mental Illness (NAMI)</Link>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<Icon>expand_more</Icon>}>
            <Typography className={classes.heading}>NAMI Massachussetts</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Link href='https://namimass.org/'>NAMI Massachussetts</Link>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    </Box>
  )
}
