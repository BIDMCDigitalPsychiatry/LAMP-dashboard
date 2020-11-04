import React from "react"
import PropTypes from "prop-types"
import { Box } from "@material-ui/core"
import { makeStyles, withStyles, createStyles } from "@material-ui/core/styles"
import InputBase from "@material-ui/core/InputBase"
import Dialog from "@material-ui/core/Dialog"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"

const CssTextField = withStyles({
  root: {
    "label + &": {},
  },
  input: {
    fontSize: 16,
    fontFamily: "Inter",
    fontWeight: "bold",
    color: "rgba(0, 0, 0, 0.75)",
  },
})(InputBase)

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: 500,
      backgroundColor: "white",
      borderRadius: 10,
      paddingLeft: 40,
      paddingRight: 40,
    },
    dialogTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: "rgba(0, 0, 0, 0.75)",
      marginTop: 30,
    },
    inputContainer: {
      backgroundColor: "#F5F5F5",
      borderRadius: 10,
      marginTop: 17,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: 60,
      paddingRight: 20,
      paddingLeft: 20,
    },
    contentContainer: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
    },
    measureTitle: {
      fontWeight: "bold",
      fontSize: 14,
      color: "rgba(0, 0, 0, 0.4)",
      marginTop: 40,
    },
    measureContainer: {
      // display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      fontWeight: "bold",
      fontSize: 16,
      color: "white",
    },
    headerButton: {
      marginTop: 35,
      width: 168,
      height: 50,
      background: "#7599FF",
      boxShadow: "0px 10px 15px rgba(96, 131, 231, 0.2)",
      borderRadius: 25,

      marginBottom: 40,
      "&:hover": { background: "#5680f9" },
    },
    uncheckContainer: {
      width: 24,
      height: 24,
      border: "3px solid #C6C6C6",
      borderRadius: 12,
      boxSizing: "border-box",
      arginRight: 17,
    },
    checkedContainer: {
      width: 24,
      height: 24,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#2F9D7E",
      borderRadius: 12,
      marginRight: 17,
    },
    titleChecked: {
      fontSize: 14,
      color: "rgba(0, 0, 0, 0.75)",
      fontWeight: "bold",
      flex: 1,
    },
    titleUncheck: {
      fontSize: 14,
      color: "rgba(0, 0, 0, 0.4)",
      flex: 1,
    },
    unableContainer: {
      width: 24,
      height: 24,
      border: "3px solid #BFBFBF",
      borderRadius: 12,
      boxSizing: "border-box",
      marginRight: 17,
      opacity: 0.4,
    },
    unableCheck: {
      fontSize: 14,
      color: "rgba(0, 0, 0, 0.4)",
      flex: 1,
      opacity: 0.4,
    },
    popWidth: { width: "95%", maxWidth: "500px", padding: "0 40px" },
  })
)

function RatioButton({ checked, onChange, title, value, unable, smallSpace, color, ...props }) {
  const classes = useStyles()

  return (
    <Box display="flex" mx={3}>
      <div
        onClick={() => !unable && onChange(value)}
        className={unable ? classes.unableContainer : checked ? classes.checkedContainer : classes.uncheckContainer}
        style={{
          marginRight: smallSpace ? 10 : 10,
          backgroundColor: checked ? (color ? color : "#2F9D7E") : "transparent",
        }}
      />
      <Typography className={unable ? classes.unableCheck : checked ? classes.titleChecked : classes.titleUncheck}>
        {title}
      </Typography>
    </Box>
  )
}

export function TargetDialog({ onClose, dialogOpen, ...props }) {
  const classes = useStyles()
  const [measure, setMeasure] = React.useState("Times")
  const [target, setTarget] = React.useState("")

  const handleClose = () => {
    onClose({ type: dialogOpen, target, measure })
    setTarget("")
    setMeasure("Times")
  }

  return (
    <Dialog
      classes={{ paper: classes.popWidth }}
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={dialogOpen != ""}
    >
      <div>
        <Typography className={classes.dialogTitle}>Add a target behavior</Typography>
        <div className={classes.inputContainer}>
          <div className={classes.contentContainer}>
            <CssTextField
              value={target}
              onChange={(event) => setTarget(event.target.value)}
              inputProps={{ disableunderline: "true" }}
              placeholder="Behavior name"
            />
          </div>
        </div>
        <Typography className={classes.measureTitle}>Measure of action:</Typography>
        <Box display="flex" justifyContent="center" mt={2}>
          <Box>
            <RatioButton
              value="Times"
              unable={false}
              smallSpace={true}
              title="Times"
              color="#618EF7"
              checked={measure == "Times"}
              onChange={() => setMeasure("Times")}
              labelPlacement="right"
            />
          </Box>
          <Box>
            <RatioButton
              smallSpace={true}
              title="Hours"
              color="#618EF7"
              value="Hours"
              unable={false}
              checked={measure == "Hours"}
              onChange={() => setMeasure("Hours")}
              labelPlacement="right"
            />
          </Box>
          <Box>
            <RatioButton
              smallSpace={true}
              title="Yes"
              color="#618EF7"
              value="Yes"
              unable={false}
              checked={measure == "Yes"}
              onChange={() => setMeasure("Yes")}
              labelPlacement="right"
            />
          </Box>
          <Box>
            <RatioButton
              value="Custom"
              unable={false}
              smallSpace={true}
              title="Custom"
              color="#618EF7"
              checked={measure == "Custom"}
              onChange={() => setMeasure("Custom")}
              labelPlacement="right"
            />
          </Box>
        </Box>
        <Box textAlign="center" mt={2}>
          <Button onClick={handleClose} className={classes.headerButton}>
            <Typography className={classes.buttonText}>Add</Typography>
          </Button>
        </Box>
      </div>
    </Dialog>
  )
}

export function EmotionDialog({ ...props }) {
  const classes = useStyles()
  const [emotion, setEmotion] = React.useState("")
  const { onClose, dialogOpen } = props

  const handleClose = () => {
    onClose(emotion)
    setEmotion("")
  }

  return (
    <Dialog
      classes={{ paper: classes.popWidth }}
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={dialogOpen}
    >
      <div>
        <Typography className={classes.dialogTitle}>Add an emotion</Typography>
        <div className={classes.inputContainer}>
          <div className={classes.contentContainer}>
            <CssTextField
              value={emotion}
              onChange={(event) => setEmotion(event.target.value)}
              inputProps={{ disableunderline: "true" }}
              placeholder="Emotion name"
            />
          </div>
        </div>
        <Box textAlign="center" mt={2}>
          <Button onClick={handleClose} className={classes.headerButton}>
            <Typography className={classes.buttonText}>Add</Typography>
          </Button>
        </Box>
      </div>
    </Dialog>
  )
}
