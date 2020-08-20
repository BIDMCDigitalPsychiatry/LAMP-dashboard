// Core Imports
import React from "react"
import { Dialog, DialogProps, Icon, IconButton, Slide, useTheme, useMediaQuery } from "@material-ui/core"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"

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

//
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
<<<<<<< HEAD
        <IconButton className={classes.customBackbtn} color="default" onClick={props.onClose as any} aria-label="Close">
=======
        <IconButton
          style={{
            position: "fixed",
            left: 16,
            top: 16,
            background: "#ffffff66",
            WebkitBackdropFilter: "blur(5px)",
            zIndex: 99999,
          }}
          color="default"
          onClick={props.onClose as any}
          aria-label="Close"
        >
>>>>>>> dashboard-design
          <Icon>arrow_back</Icon>
        </IconButton>
      )}
      {children}
    </Dialog>
  )
}
