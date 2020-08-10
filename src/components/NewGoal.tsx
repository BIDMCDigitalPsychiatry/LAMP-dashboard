// Core Imports
import React, { useEffect, useState } from "react"
import {
  Typography,
  makeStyles,
  Box,
  Grid,
  IconButton,
  TextField,
  Button,
  FormControl,
  Container,
  AppBar,
  Toolbar,
  Icon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link,
  List,
  ListItem,
  Menu,
  ListItemText,
  MenuItem,
  Card,
  ButtonBase,
  InputBase,
} from "@material-ui/core"
import { DatePicker } from "@material-ui/pickers"
import CloseIcon from "@material-ui/icons/Close"
import classnames from "classnames"
import { ReactComponent as Nutrition } from "../icons/Nutrition.svg"
import { KeyboardTimePicker, KeyboardDatePicker } from "@material-ui/pickers"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  addicon: { float: "left", color: "#E46759" },
  likebtn: {
    fontStyle: "italic",
    padding: 6,
    margin: "0 5px",
    "& label": {
      position: "absolute",
      bottom: -18,
      fontSize: 12,
    },
  },
  dialogtitle: { padding: 0 },
  active: {
    background: "#FFAC98",
  },
  linkButton: {
    padding: "15px 25px 15px 25px",
  },
  goalUnit: { minWidth: 127, marginLeft: 15 },
  timeHours: {
    padding: "3px 10px 5px 0",
    borderBottom: "#FFCEC2 solid 2px",
    minWidth: 57,
    "& div": { padding: 0, margin: 0 },
    "& p": { fontSize: 30, fontWeight: 600, color: "rgba(0, 0, 0, 0.75)", textAlign: "left" },
  },
  inputText: {
    borderBottom: "#FFCEC2 solid 2px",
    fontSize: 30,
    fontWeight: 600,
    color: "rgba(0, 0, 0, 0.75)",
    "& input": { textAlign: "right" },
  },
  durationOuter: { margin: "30px 0" },
  weekdaysOuter: { marginBottom: 50 },
  journalHeader: {
    "& h5": {
      fontWeight: 600,
      fontSize: 16,
      color: "rgba(0, 0, 0, 0.75)",
      marginLeft: 15,
    },
  },
  menuPaper: {
    background: "#F5F5F5",
    boxShadow: "none",
    marginTop: 54,
    maxHeight: 300,

    borderRadius: 0,
    "& ul": { padding: 0 },
    "& li": {
      fontSize: 25,

      padding: "0 12px",
    },
  },
  dialogueContent: {
    padding: "10px 20px 35px 20px",
    textAlign: "center",
    "& h4": { fontSize: 25, fontWeight: 600, marginBottom: 15 },
    "& p": { fontSize: 16, fontWeight: 600, color: "rgba(0, 0, 0, 0.75)", lineHeight: "19px" },
  },
  dialogueStyle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButton: {
    color: theme.palette.grey[500],
  },
  addbtnmain: {
    maxWidth: 24,
    "& button": { padding: 0 },
  },
  journalhd: {
    margin: "40px 0 15px 0",
  },
  journalStyle: {
    background: "linear-gradient(0deg, #FBF1EF, #FBF1EF)",
    borderRadius: "10px",
    padding: "0px 20px 20px 20px",
    textAlign: "justify",
    marginBottom: 20,
    "& span": {
      color: "rgba(0, 0, 0, 0.4)",
      fontSize: "12px",
      lineHeight: "40px",
    },
  },
  textAreaControl: {
    width: "100%",
    marginTop: 25,
    borderRadius: 10,
    // "& p": { position: "absolute", bottom: 15, right: 0 },
  },
  textArea: {
    borderRadius: "10px",
    "& fieldset": { borderWidth: 0, outline: 0 },
    "& textarea": { lineHeight: "24px" },
  },
  textfieldwrapper: {
    "& h5": { fontSize: 16, fontWeight: 600, color: "rgba(0, 0, 0, 0.4)" },
  },
  btnpeach: {
    background: "#FFAC98",
    padding: "15px 25px 15px 25px",
    borderRadius: "40px",
    minWidth: "200px",
    boxShadow: " 0px 10px 15px rgba(255, 172, 152, 0.25)",
    lineHeight: "22px",
    display: "inline-block",
    textTransform: "capitalize",
    fontSize: "16px",
    color: "rgba(0, 0, 0, 0.75)",
    fontWeight: "bold",
    "&:hover": {
      background: "#FFAC98",
      boxShadow:
        "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
    },
  },
  journalday: { color: "rgba(0, 0, 0, 0.4)", marginBottom: 15, marginTop: 25 },
  toolbardashboard: {
    minHeight: 65,
    "& h5": {
      color: "rgba(0, 0, 0, 0.75)",
      textAlign: "center",
      fontWeight: "600",
      fontSize: 18,
      width: "100%",
    },
  },
  backbtn: { paddingLeft: 0, paddingRight: 0 },
  todaydate: { paddingLeft: 13, color: "rgba(0, 0, 0, 0.4)" },
  linkpeach: { fontSize: 16, color: "#BC453D", fontWeight: 600 },
  howFeel: { fontSize: 14, color: "rgba(0, 0, 0, 0.5)", fontStyle: "italic", textAlign: "center", marginBottom: 10 },
  btnNav: { marginBottom: 45 },
  weekdays: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "#FFCEC2",
    textAlign: "center",
    lineHeight: "32px",
  },
  duration: { padding: "8px 10px", border: "1px solid #C6C6C6", borderRadius: 20, minWidth: 80, fontSize: 14 },
  durationActive: { background: "#FFCEC2", fontWeight: 600, borderColor: "#FFCEC2" },
  reminderTime: { float: "right", fontSize: 14 },
  goalHeader: {
    marginBottom: 30,
    marginTop: 25,
    "& svg": { width: 40, height: 40 },
    "& h4": { fontSize: 18, fontWeight: 600, paddingLeft: 20 },
  },
  goalDetails: {
    "& p": { fontWeight: 500 },
    "& input": { fontWeight: 500 },
  },
}))

export default function JournalEntries({ ...props }) {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [journalValue, setJounalValue] = useState("")
  const [status, setStatus] = useState("Yes")
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [selectedIndex, setSelectedIndex] = React.useState("Ounces")
  const [date, changeDate] = useState(new Date())
  const [startDateOpen, setStartDateOpen] = useState(false)
  const [endDateOpen, setEndDateOpen] = useState(false)
  const [duration, setDuration] = useState(0)
  const [startDate, setStartDate] = useState(new Date())

  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  const getDateString = (date: Date) => {
    var monthname = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return monthname[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear()
  }
  const units = ["Ounces", "mg", "g", "hours", "minutes"]
  const frequency = ["hourly", "daily", "weekly", "monthly"]

  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleMenuItemClick = (event: React.MouseEvent<HTMLElement>, index: any) => {
    setSelectedIndex(index)
    setAnchorEl(null)
  }
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const changeStartDate = (e: any) => {
    debugger
    var date = new Date(e)
    setStartDate(date)
  }
  const changeEndDate = (e: any) => {
    let msDiff = new Date(e).getTime() - startDate.getTime()
    let daysDiff = Math.floor(msDiff / (1000 * 60 * 60 * 24))
    setDuration(daysDiff)
  }
  return (
    <div className={classes.root}>
      <AppBar position="static" style={{ background: "#FBF1EF", boxShadow: "none" }}>
        <Toolbar className={classes.toolbardashboard}>
          <IconButton onClick={() => setOpen(true)} color="default" className={classes.backbtn} aria-label="Menu">
            <Icon>arrow_back</Icon>
          </IconButton>
          <Typography variant="h5">New Goal</Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Grid container direction="row" justify="flex-start" alignItems="center" className={classes.goalHeader}>
          <Grid item>
            <Nutrition />
          </Grid>
          <Grid item>
            <Typography variant="h4">Goal name</Typography>
          </Grid>
        </Grid>
        <Box className={classes.textfieldwrapper}>
          <Typography variant="h5">Goal details</Typography>
          <FormControl
            component="fieldset"
            classes={{
              root: classes.textAreaControl,
            }}
          >
            <Grid container direction="row" justify="center" alignItems="center" className={classes.root}>
              <Grid item xs={2}>
                <InputBase className={classes.inputText} defaultValue="10" />
              </Grid>
              <Grid item xs={5} className={classes.goalUnit}>
                <List component="nav" className={classes.timeHours}>
                  <ListItem button aria-haspopup="true" aria-controls="lock-menu" onClick={handleClick}>
                    <ListItemText secondary={selectedIndex} />
                  </ListItem>
                </List>
                <Menu
                  id="lock-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  classes={{ paper: classes.menuPaper }}
                >
                  {units.map((option, index) => (
                    <MenuItem
                      key={option}
                      selected={option === selectedIndex}
                      onClick={(event) => handleMenuItemClick(event, option)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </Menu>
              </Grid>

              <Grid item xs={12}>
                <Grid
                  container
                  direction="row"
                  justify="space-between"
                  alignItems="center"
                  className={classes.durationOuter}
                >
                  {frequency.map((value) => (
                    <Grid key={value} item>
                      <ButtonBase focusRipple className={classes.duration + " " + classes.durationActive}>
                        {value}
                      </ButtonBase>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Grid
                  container
                  direction="row"
                  justify="space-between"
                  alignItems="center"
                  className={classes.weekdaysOuter}
                >
                  {weekdays.map((value) => (
                    <Grid key={value} item className={classes.weekdays}>
                      {value.substr(0, 1)}
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              <Box width={1} mb={5}>
                <Grid container direction="row" justify="space-between" alignItems="center">
                  <Grid item xs={6}>
                    <Typography variant="body2">Start date</Typography>
                  </Grid>
                  <Grid item xs={6} className={classes.goalDetails}>
                    <Typography variant="body2" onClick={() => setStartDateOpen(true)} align="right">
                      {startDate != null ? getDateString(startDate) : getDateString(new Date())}
                    </Typography>
                    <DatePicker
                      autoOk
                      open={startDateOpen}
                      onOpen={() => setStartDateOpen(true)}
                      onClose={() => setStartDateOpen(false)}
                      value={startDate}
                      onChange={(e) => changeStartDate(e)}
                      TextFieldComponent={() => null}
                      disableToolbar={true}
                      okLabel=""
                      cancelLabel=""
                    />
                  </Grid>
                </Grid>
              </Box>
              <Box width={1} mb={5}>
                <Grid container direction="row" justify="space-between" alignItems="center">
                  <Grid item xs={6}>
                    <Typography variant="body2">Duration</Typography>
                  </Grid>
                  <Grid item xs={6} className={classes.goalDetails}>
                    <Typography variant="body2" onClick={() => setEndDateOpen(true)} align="right">
                      {duration} days
                    </Typography>
                    <DatePicker
                      autoOk
                      open={endDateOpen}
                      onOpen={() => setEndDateOpen(true)}
                      onClose={() => setEndDateOpen(false)}
                      value={date}
                      onChange={(e) => changeEndDate(e)} // Function to be implemented to set duration
                      TextFieldComponent={() => null}
                      disableToolbar={true}
                      okLabel=""
                      cancelLabel=""
                      minDate={startDate}
                    />
                  </Grid>
                </Grid>
              </Box>
              <Box width={1} mb={5}>
                <Grid container direction="row" justify="space-between" alignItems="center">
                  <Grid item xs={6}>
                    <Typography variant="body2">Reminders</Typography>
                  </Grid>
                  <Grid item xs={6} className={classes.goalDetails}>
                    <InputBase
                      id="time"
                      // label="Alarm clock"
                      type="time"
                      defaultValue="07:30"
                      className={classes.reminderTime}
                      inputProps={{
                        step: 300, // 5 min
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            <Box textAlign="center" mt={4}>
              <Button className={classes.btnpeach}>Save</Button>
            </Box>
            <Box textAlign="center" width={1} mt={3}>
              <Link className={classes.linkpeach}>Cancel</Link>
            </Box>
          </FormControl>
        </Box>

        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          scroll="paper"
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          className={classes.dialogueStyle}
        >
          <Box display="flex" justifyContent="flex-end">
            <Box>
              <IconButton aria-label="close" className={classes.closeButton} onClick={() => setOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          <DialogContent className={classes.dialogueContent}>
            <Typography variant="h4">Leaving so soon?</Typography>
            <Typography variant="body1">If you leave without submitting, your entry will be lost.</Typography>
          </DialogContent>
          <Grid>
            <Box textAlign="center" width={1} mt={1} mb={3}>
              <Link
                underline="none"
                onClick={() => setOpen(false)}
                className={classnames(classes.btnpeach, classes.linkButton)}
              >
                No, don’t leave yet
              </Link>
            </Box>
            <Box textAlign="center" width={1} mb={4}>
              <Link underline="none" onClick={props.onComplete} className={classes.linkpeach}>
                {" "}
                Yes, leave
              </Link>
            </Box>
          </Grid>
        </Dialog>
      </Container>
    </div>
  )
}
