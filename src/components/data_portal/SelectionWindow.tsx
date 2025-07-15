import React, { useState } from "react"
import Backdrop from "@material-ui/core/Backdrop"
import Card from "@material-ui/core/Card"
import Box from "@material-ui/core/Box"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import Tooltip from "@material-ui/core/Tooltip"
import CircularProgress from "@material-ui/core/CircularProgress"
import makeStyles from "@material-ui/core/styles/makeStyles"

import CloseIcon from "@material-ui/icons/Close"
import { useTranslation } from "react-i18next"
import DisplayItem from "./DisplayItem"

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
    width: "85vw",
    height: "calc(85vh - 75px)",
    overflowY: "scroll",
    padding: "25px",
    position: "relative",
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
    fontSize: "100%",
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
  openButtonText,
  customButton = null,
  exposeButton = false,
  handleResult = console.log,
  children = <DisplayItem />,
  submitText = "Submit",
  style = {},
  closesOnSubmit = true,
  displaySubmitButton = true,
  runOnOpen = () => {},

  ...props
}) {
  const classes = useStyles()
  const [open, toggleOpen] = useState(false)
  const [awaitingClose, setAwaitClose] = useState(false)

  React.useEffect(() => {
    if (open) runOnOpen()
  }, [open])
  function ConditionalCardWrap({ condition, children }) {
    return condition ? (
      <Card className={classes.container} style={style ? style : {}}>
        {children}
      </Card>
    ) : (
      <React.Fragment>{children}</React.Fragment>
    )
  }

  function toggle() {
    toggleOpen(!open)
  }

  return (
    <React.Fragment>
      <ConditionalCardWrap condition={!exposeButton}>
        {React.isValidElement(customButton) ? (
          <Tooltip title={openButtonText}>
            {React.cloneElement(
              customButton,
              //@ts-ignore: Assigning a function to onclick prop
              { onClick: toggle, ...props }
            )}
          </Tooltip>
        ) : (
          <Button className={classes.openButton} onClick={() => toggleOpen(!open)}>
            {openButtonText}
          </Button>
        )}
      </ConditionalCardWrap>
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
            <Card className={classes.cardDisplay}>{children}</Card>
            <div className={classes.buttonWrapper}>
              {displaySubmitButton && (
                <Button
                  onClick={async () => {
                    if (!!closesOnSubmit) toggleOpen(false)
                    else setAwaitClose(true)
                    await handleResult()
                    toggleOpen(false)
                    setAwaitClose(false)
                  }}
                  disabled={awaitingClose}
                  className={classes.submitButton}
                >
                  {!awaitingClose ? submitText : <CircularProgress size={24} />}
                </Button>
              )}
            </div>
          </Box>
        </Backdrop>
      )}
    </React.Fragment>
  )
}
