import React, { useState } from "react"
import { Box, Collapse, Paper, Typography, Card, CardActions, IconButton, Icon, makeStyles } from "@material-ui/core"
import { useSnackbar } from "notistack"
import classnames from "classnames" // FIXME
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
          {t(props.message)}
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
