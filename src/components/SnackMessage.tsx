import React, { useState } from "react"
import { Collapse, Paper, Typography, Card, CardActions, IconButton, Icon } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import { useSnackbar } from "notistack"
import classnames from "classnames"

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 400,
    minWidth: 344,
  },
  typography: {
    fontWeight: "bold",
  },
  actionRoot: {
    padding: "8px 8px 8px 16px",
    backgroundColor: "#4caf50",
    color: "#ffffff",
  },
  icons: {
    marginLeft: "auto",
  },
  expand: {
    padding: "8px 8px",
    transform: "rotate(0deg)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  collapse: {
    padding: 16,
  },
  checkIcon: {
    fontSize: 20,
    color: "#b3b3b3",
    paddingRight: 4,
  },
  button: {
    padding: 0,
    textTransform: "none",
  },
}))

const SnackMessage = React.forwardRef((props: { id?: string; message?: string; children: any }, ref) => {
  const classes = useStyles()
  const { closeSnackbar } = useSnackbar()
  const [expanded, setExpanded] = useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  const handleDismiss = () => {
    closeSnackbar(props.id)
  }

  return (
    <Card className={classes.card} ref={ref}>
      <CardActions classes={{ root: classes.actionRoot }}>
        <Typography variant="subtitle2" className={classes.typography}>
          {props.message}
        </Typography>
        <div className={classes.icons}>
          <IconButton
            aria-label="Show more"
            className={classnames(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
          >
            <Icon>expand_more</Icon>
          </IconButton>
          <IconButton className={classes.expand} onClick={handleDismiss}>
            <Icon>close</Icon>
          </IconButton>
        </div>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Paper className={classes.collapse}>{props.children}</Paper>
      </Collapse>
    </Card>
  )
})

export default SnackMessage
