import React from "react"
import {
  Box,
  TextField,
  makeStyles,
  withStyles,
  createStyles,
  Button,
  InputBase,
  Dialog,
  Typography,
} from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { Autocomplete } from "@material-ui/lab"

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
    autoComplete: { width: "100%" },
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
  const [customUnit, setCustomUnit] = React.useState(null)
  const { t } = useTranslation()

  const handleClose = () => {
    onClose({ type: dialogOpen, target, measure, customUnit })
    setTarget("")
    setMeasure("Times")
    setCustomUnit(null)
  }
  const options = [t("Times"), t("Hours"), t("Minutes".toLowerCase())]
  return (
    <Dialog
      classes={{ paper: classes.popWidth }}
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={dialogOpen != ""}
    >
      <div>
        <Typography className={classes.dialogTitle}>{t("Add a target behavior")}</Typography>
        <div className={classes.inputContainer}>
          <div className={classes.contentContainer}>
            <CssTextField
              value={target}
              onChange={(event) => setTarget(event.target.value)}
              inputProps={{ disableunderline: "true", maxLength: 120 }}
              placeholder={t("Behavior name")}
            />
          </div>
        </div>
        <Typography className={classes.measureTitle}>{t("Measure of action:")}</Typography>
        <Box display="flex" justifyContent="center" mt={2}>
          <Autocomplete
            className={classes.autoComplete}
            options={options}
            onChange={(event: any, newValue: string | null) => {
              setMeasure(newValue)
            }}
            value={measure}
            inputValue={t(measure)}
            onInputChange={(event, newInputValue) => {
              setMeasure(newInputValue)
            }}
            renderInput={(params) => <TextField {...params} label={t("Measure")} variant="filled" />}
          />
        </Box>
        <Box textAlign="center" mt={2}>
          <Button
            onClick={handleClose}
            disabled={measure === "" || target === "" ? true : false}
            className={classes.headerButton}
          >
            <Typography className={classes.buttonText}>{t("Add")}</Typography>
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
  const { t } = useTranslation()

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
        <Typography className={classes.dialogTitle}>{t("Add a emotion")}</Typography>
        <div className={classes.inputContainer}>
          <div className={classes.contentContainer}>
            <CssTextField
              value={emotion}
              onChange={(event) => setEmotion(event.target.value)}
              inputProps={{ disableunderline: "true", maxLength: 120 }}
              placeholder={t("Emotion name")}
            />
          </div>
        </div>
        <Box textAlign="center" mt={2}>
          <Button onClick={handleClose} disabled={emotion === "" ? true : false} className={classes.headerButton}>
            <Typography className={classes.buttonText}>{t("Add")}</Typography>
          </Button>
        </Box>
      </div>
    </Dialog>
  )
}

export function NameDialog({ onClose, dialogOpen, ...props }) {
  const classes = useStyles()
  const [name, setName] = React.useState("")
  const { t } = useTranslation()

  const handleClose = () => {
    onClose(name)
    setName("")
  }

  return (
    <Dialog
      classes={{ paper: classes.popWidth }}
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={dialogOpen}
    >
      <div>
        <Typography className={classes.dialogTitle}>{t("Add Sensor")}</Typography>
        <div className={classes.inputContainer}>
          <div className={classes.contentContainer}>
            <CssTextField
              value={name}
              onChange={(event) => setName(event.target.value)}
              inputProps={{ disableunderline: "true" }}
              placeholder={t("Name")}
            />
          </div>
        </div>

        <Box textAlign="center" mt={2}>
          <Button onClick={handleClose} disabled={name === "" ? true : false} className={classes.headerButton}>
            <Typography className={classes.buttonText}>{t("Add")}</Typography>
          </Button>
        </Box>
      </div>
    </Dialog>
  )
}
