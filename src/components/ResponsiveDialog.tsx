// Core Imports
import React from "react"
import Dialog from "@material-ui/core/Dialog"
import { DialogProps } from "@material-ui/core/Dialog"
import Icon from "@material-ui/core/Icon"
import IconButton from "@material-ui/core/IconButton"
import Slide from "@material-ui/core/Slide"
import useTheme from "@material-ui/core/styles/useTheme"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import makeStyles from "@material-ui/core/styles/makeStyles"
import createStyles from "@material-ui/core/styles/createStyles"
import { Theme } from "@material-ui/core/styles/createTheme"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    customBackbtn: {
      width: 48,
      height: 48,
      zIndex: 99999,
      left: 15,
      top: 9,
      position: "fixed",
      [theme.breakpoints.down("xs")]: {
        paddingLeft: 0,
        left: 10,
        top: 10,
      },
    },
  })
)
const SlideUp: any = React.forwardRef((props: any, ref) => <Slide direction="up" {...props} ref={ref} />)
export default function ResponsiveDialog({
  transient,
  animate,
  fullScreen,
  children,
  ...props
}: {
  transient?: boolean
  animate?: boolean
  fullScreen?: boolean
  children?: any
} & DialogProps) {
  const sm = useMediaQuery(useTheme().breakpoints.down("sm"))
  const classes = useStyles()
  return (
    <Dialog {...props} fullScreen={!!fullScreen ? true : sm} TransitionComponent={!!animate ? SlideUp : undefined}>
      {!!transient && (
        <IconButton className={classes.customBackbtn} color="default" onClick={props.onClose as any} aria-label="Close">
          <Icon>arrow_back</Icon>
        </IconButton>
      )}
      {children}
    </Dialog>
  )
}
