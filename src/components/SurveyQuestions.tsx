// Core Imports
import React, { useState } from "react"
import {
  Typography,
  makeStyles,
  Box,
  Slide,
  Radio,
  RadioProps,
  RadioGroup,
  FormControl,
  FormControlLabel,
  useMediaQuery,
  useTheme,
  Button,
  Container,
  TextField,
  LinearProgress,
  createStyles,
  withStyles,
  Theme,
  AppBar,
  Icon,
  IconButton,
  Toolbar,
  Grid,
  Slider,
  Step,
  Stepper,
  StepLabel,
  StepContent,
  StepConnector,
  Menu,
  MenuItem,
  ListItemText,
  ListItem,
  List,
} from "@material-ui/core"
import classnames from "classnames"

const BorderLinearProgress = withStyles((theme: Theme) =>
  createStyles({
    root: {
      height: 5,
      borderRadius: 5,
    },
    colorPrimary: {
      backgroundColor: "#92E7CA",
    },
    bar: {
      borderRadius: 5,
      backgroundColor: "#2F9D7E",
    },
  })
)(LinearProgress)

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  sliderActionsContainer: {
    position: "absolute",
    textAlign: "center",
    width: "100%",
    left: 0,
    marginBottom: 15,
    [theme.breakpoints.down("xs")]: {
      bottom: "5%",
    },
  },
  radioroot: {
    padding: "23px",
  },
  icon: {
    borderRadius: "50%",
    width: 32,
    height: 32,
    border: "#C6C6C6 solid 2px",
    backgroundColor: "#fff",
    backgroundImage: "linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))",
    "$root.Mui-focusVisible &": {
      outline: "2px auto rgba(19,124,189,.6)",
      outlineOffset: 2,
    },
    "input:hover ~ &": {
      backgroundColor: "#ebf1f5",
    },
    "input:disabled ~ &": {
      boxShadow: "none",
      background: "rgba(206,217,224,.5)",
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  checkedIcon: {
    backgroundColor: "#2F9D7E",
    borderColor: "#2F9D7E",
    backgroundImage: "linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))",
    "&:before": {
      display: "block",
      width: 32,
      height: 32,
      content: '""',
    },
    "input:hover ~ &": {
      backgroundColor: "#2F9D7E",
    },
  },
  btngreen: {
    background: "#92E7CA",
    borderRadius: "40px",
    minWidth: "150px",
    boxShadow: "0px 10px 15px rgba(146, 231, 202, 0.25)",
    lineHeight: "38px",
    margin: "5% 5px 0 5px",
    textTransform: "capitalize",
    fontSize: "16px",
    color: "rgba(0, 0, 0, 0.75)",
    [theme.breakpoints.up("md")]: {
      marginTop: 30,
    },
    "&:hover": { background: "#92E7CA" },
  },
  toolbar: {
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: "flex-start",
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    "& h5": {
      color: "#555555",
      fontSize: 25,
      fontWeight: "bold",
      position: "absolute",
      bottom: 0,
    },
  },
  toolbardashboard: { minHeight: 75 },
  backbtn: { paddingLeft: 0, paddingRight: 0 },
  slider: { width: "80%", color: "#2F9D7E" },
  sliderRail: {
    background: "#BCEFDD",
    borderRadius: "2px",
  },
  stepIcon: {
    color: "white",
    width: 32,
    height: 32,
    border: "3px solid #C6C6C6",
    borderRadius: "50%",
    marginRight: 10,
    "& text": {
      fill: "#FFF",
    },
  },
  stepIconActive: {
    color: "#C6C6C6 !important",
    border: "0px solid #C6C6C6",
    "& text": {
      fill: "#C6C6C6 !important",
    },
  },
  customstepper: {
    position: "relative",
    "&::after": {
      content: "",
      position: "absolute",
      display: "block",
      width: 30,
      height: 100,
      background: "black",
      top: 100,
    },
  },
  customsteppercontent: {
    marginLeft: 15,
    marginTop: -30,
    paddingTop: 44,
    marginBottom: -35,
    paddingBottom: 52,
    borderLeft: "2px solid #bdbdbd",
    [theme.breakpoints.up("md")]: {
      paddingLeft: 50,
      paddingBottom: 75,
    },
  },
  customstepperconnecter: {
    minHeight: 0,
    padding: 0,
    "& span": { minHeight: 0 },
  },
  btnBack: {
    borderRadius: "40px",
    minWidth: "150px",
    boxShadow: "0px 10px 15px rgba(0, 0, 0, 0.05)",
    lineHeight: "38px",
    fontFamily: "inter",
    textTransform: "capitalize",
    fontSize: "16px",
    cursor: "pointer",
    margin: "5% 5px 0 5px",
    [theme.breakpoints.up("md")]: {
      marginTop: 30,
    },
  },
  minutes: {
    padding: "10px",
  },
  hours: {
    padding: "10px",
  },
  ampm: {
    padding: "10px",
  },
  timeSelect: { minWidth: 55, margin: "0 10px", "& svg": { display: "none" } },
  timeselectInput: { margin: 0, padding: "10px 0 !important", fontSize: 40 },

  questionTrack: {
    fontSize: "14px",
    color: "#2F9D7E",
    fontWeight: "normal",
    margin: "-10px 0 50px 0",
  },
  radioGroup: {
    marginTop: "30px",
    marginLeft: -15,
    [theme.breakpoints.up("md")]: {
      marginTop: 0,
    },
  },
  textAreaControl: {
    width: "100%",
    marginTop: 35,
    background: "#f5f5f5",
    borderRadius: 10,
    "& p": { position: "absolute", bottom: 15, right: 0 },
  },
  textArea: {
    borderRadius: "10px",
    "& fieldset": { borderWidth: 0 },
  },
  sliderResponse: {
    marginTop: "60px",
    "& h4": {
      color: "#22977B",
      fontSize: 25,
      fontWeight: 600,
    },
  },
  surveyquestions: {
    padding: 10,
    "& h5": { fontSize: 18 },
  },
  questionhead: {
    "& h5": { fontSize: 18, fontWeight: 600 },
    "& span": {
      marginTop: 15,
      fontSize: 12,
      color: "rgba(0, 0, 0, 0.5)",
    },
  },
  timeHours: {
    padding: 0,
    borderBottom: "#BCEFDD solid 2px",
    minWidth: 57,
    "& div": { padding: 0, margin: 0 },
    "& p": { fontSize: 40, fontWeight: 600, color: "rgba(0, 0, 0, 0.75)", textAlign: "center" },
  },
  textCaption: { color: "rgba(0, 0, 0, 0.5)", fontSize: 10 },
  centerBar: { height: 4, background: "#BCEFDD" },
  customTrack: { width: 4, height: 4, borderRadius: "50%", background: "#65DEB4" },
  customThumb: { width: 24, height: 24, marginTop: -10, marginLeft: -10 },
  menuPaper: {
    background: "#F5F5F5",
    boxShadow: "none",
    marginTop: 54,
    maxHeight: 300,
    minWidth: 57,
    borderRadius: 0,
    "& ul": { padding: 0 },
    "& li": {
      fontSize: 25,
      maxWidth: 57,
      padding: "0 12px",
    },
  },
  timeWrapper: {
    fontSize: 25,
    marginTop: 50,
    [theme.breakpoints.up("md")]: {
      justifyContent: "left",
    },
  },
  textfieldwrapper: { marginLeft: -12, marginRight: -12 },
  listSelected: {
    background: "#E7F8F2 !important",
  },
}))

function StyledRadio(props: RadioProps) {
  const classes = useStyles()

  return (
    <Radio
      className={classes.radioroot}
      disableRipple
      color="default"
      size="medium"
      checkedIcon={<span className={classnames(classes.icon, classes.checkedIcon)} />}
      icon={<span className={classes.icon} />}
      {...props}
    />
  )
}

function range(start, stop, step = 1) {
  return [...Array(stop - start).keys()].map((v, i) =>
    start + i * step < 10 ? "0" + (start + i * step) : start + i * step
  )
}

export default function SurveyQuestions({ ...props }) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [anchorE2, setAnchorE2] = React.useState<null | HTMLElement>(null)
  const [anchorE3, setAnchorE3] = React.useState<null | HTMLElement>(null)
  const [hourSelectedIndex, setHourSelectedIndex] = React.useState("01")
  const [minuteSelectedIndex, setMinuteSelectedIndex] = React.useState("00")
  const [ampmSelectedIndex, setAmPmSelectedIndex] = React.useState("am")

  const handleClickHours = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClickMinutes = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorE2(event.currentTarget)
  }

  const handleClickAmPm = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorE3(event.currentTarget)
  }

  const handleMenuItemClick = (event: React.MouseEvent<HTMLElement>, index: any, type: number) => {
    switch (type) {
      case 0:
        setHourSelectedIndex(index)
        setAnchorEl(null)
        break
      case 1:
        setMinuteSelectedIndex(index)
        setAnchorE2(null)
        break
      case 2:
        setAmPmSelectedIndex(index)
        setAnchorE3(null)
        break
    }
  }
  const handleHoursClose = () => {
    setAnchorEl(null)
  }
  const handleMinutesClose = () => {
    setAnchorE2(null)
  }
  const handleAmPmClose = () => {
    setAnchorE3(null)
  }

  const classes = useStyles()
  const [tab, _setTab] = useState(0)
  const [progressValue, setProgressValue] = useState(25)
  const [activeStep, setActiveStep] = React.useState(0)
  const supportsSidebar = useMediaQuery(useTheme().breakpoints.up("md"))
  const CHARACTER_LIMIT = 300

  const questions = [
    {
      type: "options",
      question: "Today I am worrying too much about different things",
      helpText: "(Select one)",
      options: ["Not at all", "Several times", "More than half the time", "Nearly all the time"],
    },
    {
      type: "text",
      question: "What social interactions have most influenced your mood this week?",
      helpText: "Short answer (1-2 sentences)",
    },
    { type: "time", question: "What time did you go to bed?", helpText: "(Select from drop down menu)" },
    {
      type: "rating",
      question: "How would you rate the quality of your social life?",
      helpText: "(0 being terrible, 10 being excellent)",
      min: 10,
      max: 100,
      values: ["terrible", "neutral", "excellent"],
    },
  ]
  const getSteps = (questions: any) => {
    let stepData = []
    Object.keys(questions).forEach((key) => {
      stepData.push(
        <Box className={classes.questionhead}>
          <Typography variant="h5">{questions[key].question}</Typography>
          <Typography variant="caption" display="block" gutterBottom>
            {questions[key].helpText}
          </Typography>
        </Box>
      )
    })
    return stepData
  }

  const steps = getSteps(questions)

  const [values, setValues] = React.useState({
    radioOption: 0,
    textArea: "",
    sliderValue: 0,
    ampm: "",
    hour: "",
    minutes: "",
  })

  const getStepContent = (step: number) => {
    let stepData = []
    Object.keys(questions).forEach((index) => {
      if (parseInt(index) === step) {
        switch (questions[index].type) {
          case "options":
            let i = 0
            let data = []
            for (let option of questions[index].options) {
              data.push(<FormControlLabel value={`option${i}`} control={<StyledRadio />} label={option} />)
              i++
            }
            stepData.push(
              <FormControl component="fieldset" className={classes.radioGroup}>
                <RadioGroup
                  defaultValue="option0"
                  aria-label="options"
                  name="options"
                  value={values.radioOption}
                  onChange={(event) => handleChange("radioOption", event.target.value)}
                >
                  {data}
                </RadioGroup>
              </FormControl>
            )
            break
          case "text":
            stepData.push(
              <Box className={classes.textfieldwrapper}>
                <FormControl
                  component="fieldset"
                  classes={{
                    root: classes.textAreaControl,
                  }}
                >
                  <TextField
                    id="standard-multiline-flexible"
                    multiline
                    rows={10}
                    variant="outlined"
                    value={values.textArea}
                    helperText={`${values.textArea.length}/${CHARACTER_LIMIT} max characters`}
                    inputProps={{
                      maxLength: CHARACTER_LIMIT,
                    }}
                    onChange={(event) => handleChange("textArea", event.target.value)}
                    classes={{ root: classes.textArea }}
                  />
                </FormControl>
              </Box>
            )
            break
          case "time":
            const ampm = []

            let hourvalues = range(1, 13)
            let minutevalues = range(0, 4, 15)

            ampm.push(
              <MenuItem
                key="am"
                selected={"am" === ampmSelectedIndex}
                onClick={(event) => handleMenuItemClick(event, "am", 2)}
                classes={{ selected: classes.listSelected }}
              >
                am
              </MenuItem>
            )
            ampm.push(
              <MenuItem
                key="pm"
                selected={"pm" === ampmSelectedIndex}
                onClick={(event) => handleMenuItemClick(event, "pm", 2)}
                classes={{ selected: classes.listSelected }}
              >
                pm
              </MenuItem>
            )

            stepData.push(
              <Box textAlign="center">
                <Grid container justify="center" alignItems="center" spacing={2} className={classes.timeWrapper}>
                  <Grid item>
                    <List component="nav" className={classes.timeHours}>
                      <ListItem button aria-haspopup="true" aria-controls="lock-menu" onClick={handleClickHours}>
                        <ListItemText secondary={hourSelectedIndex} />
                      </ListItem>
                    </List>
                    <Menu
                      id="lock-menu"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleHoursClose}
                      classes={{ paper: classes.menuPaper }}
                    >
                      {hourvalues.map((option, index) => (
                        <MenuItem
                          key={option}
                          selected={option === hourSelectedIndex}
                          onClick={(event) => handleMenuItemClick(event, option, 0)}
                          classes={{ selected: classes.listSelected }}
                        >
                          {option}
                        </MenuItem>
                      ))}
                    </Menu>
                  </Grid>
                  :
                  <Grid item>
                    <List component="nav" className={classes.timeHours} aria-label="Device settings">
                      <ListItem button aria-haspopup="true" aria-controls="lock-menu" onClick={handleClickMinutes}>
                        <ListItemText secondary={minuteSelectedIndex} />
                      </ListItem>
                    </List>
                    <Menu
                      id="lock-menu"
                      anchorEl={anchorE2}
                      keepMounted
                      open={Boolean(anchorE2)}
                      onClose={handleMinutesClose}
                      classes={{ paper: classes.menuPaper }}
                    >
                      {minutevalues.map((option, index) => (
                        <MenuItem
                          key={option}
                          selected={option === minuteSelectedIndex}
                          onClick={(event) => handleMenuItemClick(event, option, 1)}
                          classes={{ selected: classes.listSelected }}
                        >
                          {option}
                        </MenuItem>
                      ))}
                    </Menu>
                  </Grid>
                  <Grid item>
                    <List component="nav" className={classes.timeHours} aria-label="Device settings">
                      <ListItem button aria-haspopup="true" aria-controls="lock-menu" onClick={handleClickAmPm}>
                        <ListItemText secondary={ampmSelectedIndex} />
                      </ListItem>
                    </List>
                    <Menu
                      id="lock-menu"
                      classes={{ paper: classes.menuPaper }}
                      anchorEl={anchorE3}
                      keepMounted
                      open={Boolean(anchorE3)}
                      onClose={handleAmPmClose}
                    >
                      {ampm}
                    </Menu>
                  </Grid>
                </Grid>
              </Box>
            )
            break
          case "rating":
            stepData.push(
              <Box textAlign="center" mt={5}>
                <Slider
                  defaultValue={values.sliderValue}
                  getAriaValueText={valuetext}
                  aria-labelledby="discrete-slider"
                  valueLabelDisplay="auto"
                  step={10}
                  marks
                  min={0}
                  max={100}
                  track={false}
                  classes={{
                    root: classes.slider,
                    rail: classes.centerBar,
                    mark: classes.customTrack,
                    thumb: classes.customThumb,
                  }}
                  onChange={handleSliderChange}
                />
                <Grid
                  container
                  spacing={10}
                  style={{ marginTop: "-50px" }}
                  direction="row"
                  justify="center"
                  alignItems="center"
                >
                  <Grid item xs={4}>
                    <Typography variant="caption" className={classes.textCaption} display="block" gutterBottom>
                      terrible
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" className={classes.textCaption} display="block" gutterBottom>
                      neutral
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" className={classes.textCaption} display="block" gutterBottom>
                      excellent
                    </Typography>
                  </Grid>
                </Grid>
                <Box className={classes.sliderResponse}>
                  <Typography variant="caption" display="block" gutterBottom>
                    Your response:
                  </Typography>
                  <Typography variant="h4">{getSliderValue()}</Typography>
                </Box>
              </Box>
            )
            break
        }
      }
    })
    return stepData
  }
  const tabDirection = (currentTab) => {
    return supportsSidebar ? "up" : "left"
  }

  const handleChange = (type: string, value: string) => {
    setValues({ ...values, [type]: value })
  }
  const handleNext = () => {
    _setTab(tab + 1)
    setProgressValue(progressValue + 25)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
    setProgressValue(progressValue - 25)
  }

  const handleSubmit = () => {
    props.submitSurvey()
    props.goBack()
  }

  const marks = [
    {
      value: 0,
      label: "Terrible",
    },

    {
      value: 10,
      label: "Very Poor",
    },
    {
      value: 20,
      label: "Very Poor",
    },
    {
      value: 30,
      label: "Poor",
    },
    {
      value: 40,
      label: "Poor",
    },

    {
      value: 50,
      label: "Neutral",
    },
    {
      value: 60,
      label: "Satisfactory",
    },
    {
      value: 70,
      label: "Good",
    },

    {
      value: 80,
      label: "Pretty Good",
    },
    {
      value: 90,
      label: "Great",
    },
    {
      value: 100,
      label: "Exellent",
    },
  ]

  const valuetext = (value: number) => {
    return `${marks[value]}`
  }
  const handleSliderChange = (event: any, newValue: number) => {
    setValues({ ...values, sliderValue: newValue })
  }
  const getSliderValue = () => {
    let sliderValue
    marks.map(function (mark) {
      if (mark.value == values.sliderValue) {
        sliderValue = mark.label
      }
    })
    return sliderValue
  }

  const handleStepperNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
    setProgressValue(progressValue + 25)
  }

  const handleSliderBack = () => {
    _setTab(tab - 1)
    setProgressValue(progressValue - 25)
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" style={{ background: "#E7F8F2", boxShadow: "none" }}>
        <Toolbar className={classes.toolbardashboard}>
          <IconButton
            onClick={props.goBack}
            color="default"
            className={classes.backbtn}
            aria-label="Menu"
            style={{
              marginLeft: supportsSidebar ? 64 : undefined,
            }}
          >
            <Icon>arrow_back</Icon>
          </IconButton>

          <Typography
            variant="h5"
            style={{
              marginLeft: supportsSidebar ? 64 : undefined,
              color: "rgba(0, 0, 0, 0.75)",
              textAlign: "center",
              width: "100%",
            }}
          >
            {`${props.type.replace(/_/g, " ")}`}
          </Typography>
        </Toolbar>
        <BorderLinearProgress variant="determinate" value={progressValue} />
      </AppBar>
      {supportsSidebar ? (
        <Stepper
          activeStep={activeStep}
          orientation="vertical"
          classes={{ root: classes.customstepper }}
          connector={<StepConnector classes={{ root: classes.customstepperconnecter }} />}
        >
          {steps.map((label, index) => (
            <Step>
              <StepLabel
                StepIconProps={{
                  classes: {
                    root: classes.stepIcon,
                    active: classes.stepIconActive,
                    completed: classes.stepIconActive,
                  },
                }}
              >
                {label}
              </StepLabel>

              <StepContent classes={{ root: classes.customsteppercontent }}>
                <Typography>{getStepContent(index)}</Typography>
                  {activeStep > 0 && (
                    <Button onClick={handleBack} className={classes.btnBack}>
                      Back
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    onClick={activeStep === steps.length - 1 ? handleSubmit : handleStepperNext}
                    className={classes.btngreen}
                  >
                    {activeStep === steps.length - 1 ? "Submit" : "Next"}
                  </Button>               
              </StepContent>
            </Step>
          ))}
        </Stepper>
      ) : (
        <Container>
          {steps.map((label, index) => (
            <Slide in={tab === index} direction={tabDirection(index)} mountOnEnter unmountOnExit>
              <Box my={4}>
                <Box textAlign="center">
                  <Typography gutterBottom align="center" classes={{ root: classes.questionTrack }}>
                    Question {index + 1} of {steps.length}
                  </Typography>
                </Box>
                <Container>
                  {label}
                  {getStepContent(index)}
                  <div className={classes.sliderActionsContainer}>
                    {index > 0 && (
                      <Button onClick={handleSliderBack} className={classes.btnBack}>
                        Back
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      onClick={index === steps.length - 1 ? handleSubmit : handleNext}
                      className={classes.btngreen}
                    >
                      {index === steps.length - 1 ? "Submit" : "Next"}
                    </Button>
                  </div>
                </Container>
              </Box>
            </Slide>
          ))}
        </Container>
      )}
    </div>
  )
}
