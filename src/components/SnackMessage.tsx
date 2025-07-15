import React, { useState } from "react"
import Box from "@material-ui/core/Box"
import Collapse from "@material-ui/core/Collapse"
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import Card from "@material-ui/core/Card"
import CardActions from "@material-ui/core/CardActions"
import IconButton from "@material-ui/core/IconButton"
import Icon from "@material-ui/core/Icon"
import makeStyles from "@material-ui/core/styles/makeStyles"
import { useSnackbar } from "notistack"
import classnames from "classnames"
import { useTranslation } from "react-i18next"

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
}))

const SnackMessage = React.forwardRef((props: { id?: string; message?: string; children: any }, ref) => {
  const classes = useStyles()
  const { closeSnackbar } = useSnackbar()
  const [expanded, setExpanded] = useState(false)
  const { t } = useTranslation()
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
          {`${t(props.message)}`}
        </Typography>
        <Box className={classes.icons}>
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
        </Box>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Paper className={classes.collapse}>{props.children}</Paper>
      </Collapse>
    </Card>
  )
})

export default SnackMessage
