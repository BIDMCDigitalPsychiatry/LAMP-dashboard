import React, { useState, useRef } from "react"
import { Backdrop, Card, Box, Typography, Button, makeStyles, IconButton } from "@material-ui/core"
import CloseIcon from "@material-ui/icons/Close"

const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: "30px",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  backdropInner: {
    background: "white",
    position: "relative",
    zIndex: theme.zIndex.drawer,
    fontSize: "25px",
    color: "black",
    width: "90vw",
    height: "90vh",
    borderRadius: "15px",
  },
  cardDisplay: {
    border: "1px solid black",
    borderRadius: "15px",
    width: "85%",
    height: "calc(85% - 30px)",
    overflowY: "scroll",
    padding: "50px",
    position: "relative",
    top: "2.5vh",
    margin: "auto",
  },
  closeIcon: {
    position: "relative",
    zIndex: theme.zIndex.drawer + 1,
    top: "0",
    left: "calc(100% - 50px)",
  },
  openButton: {
    width: "100%",
    height: "100%",
  },
  buttonWrapper: {
    minHeight: "30px",
    display: "flex",
    width: "100%",
    bottom: "15px",
    position: "absolute",
    background: "transparent",
  },
  submitButton: {
    background: "#7599FF",
    margin: "auto",
    color: "white",
    cornerRadius: "15px",
    "&:hover": {
      background: "black",
    },
  },
}))

export default function SelectionWindow({
  openButtonText = "Open Window",
  handleResult = console.log,
  children = <Typography>Set the 'children' prop to display elements</Typography>,
  submitText = "Submit",
  style = {},
  closesOnSubmit = true,
  displaySubmitButton = true,
  ...props
}) {
  const classes = useStyles()
  const [open, toggleOpen] = useState(false)
  //const [inputChildren, alterChildren] = useState(children)\
  const cardRef = useRef()

  return (
    <Card className={classes.container} style={props.style ? props.style : {}}>
      <Button style={style} className={classes.openButton} onClick={() => toggleOpen(!open)}>
        {openButtonText}
      </Button>
      {open && (
        <Backdrop className={classes.backdrop} open={open} onClick={() => toggleOpen(!open)}>
          <Box
            className={classes.backdropInner}
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <IconButton className={classes.closeIcon} onClick={() => toggleOpen(false)}>
              <CloseIcon />
            </IconButton>
            <Card ref={cardRef} className={classes.cardDisplay}>
              {children}
            </Card>
            <div className={classes.buttonWrapper}>
              {displaySubmitButton && (
                <Button
                  onClick={() => {
                    if (closesOnSubmit) toggleOpen(false)
                    handleResult()
                    if (!closesOnSubmit) toggleOpen(false)
                  }}
                  className={classes.submitButton}
                >
                  {submitText}
                </Button>
              )}
            </div>
          </Box>
        </Backdrop>
      )}
    </Card>
  )
}
