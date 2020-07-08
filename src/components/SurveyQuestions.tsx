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
  FormLabel,
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
  MenuItem,
  Select,
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
    bottom: "5%",
    position: "absolute",
    textAlign: "center",
  },
  actionsContainer: {
    textAlign: "center",
  },
  resetContainer: {
    padding: theme.spacing(3),
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
  selectEmpty: {
    marginTop: theme.spacing(2),
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
  bottom: {
    color: theme.palette.grey[theme.palette.type === "light" ? 200 : 700],
  },
  btngreen: {
    background: "#92E7CA",
    borderRadius: "40px",
    minWidth: "150px",
    boxShadow: "0px 10px 15px rgba(146, 231, 202, 0.25)",
    lineHeight: "38px",
    marginTop: "5%",

    textTransform: "capitalize",
    fontSize: "16px",
    color: "rgba(0, 0, 0, 0.75)",
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
  },
  customstepperconnecter: {
    minHeight: 0,
    padding: 0,
    "& span": { minHeight: 0 },
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  btnBack: {
    borderRadius: "40px",
    minWidth: "150px",
    boxShadow: " 0px 10px 15px rgba(96, 131, 231, 0.2)",
    lineHeight: "38px",
    fontFamily: "inter",
    textTransform: "capitalize",
    fontSize: "16px",
    float: "left",
    cursor: "pointer",
    marginTop: "5%",
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
    fontWeight: "bold",
    margin: "-10px 0 50px 0",
  },
  radioGroup: {
    marginTop: "30px",
  },
  textAreaControl: {
    width: "100%",
  },
  textArea: {
    borderRadius: "10px",
  },
  sliderResponse: {
    marginTop: "30px",
    "& h4": {
      color: "#22977B",
    },
  },
}))

function getSteps(questions: any) {
  let stepData = []
  Object.keys(questions).forEach((key) => {
    stepData.push(
      <Box>
        <Typography variant="h5">{questions[key].question}</Typography>
        <Typography variant="caption" display="block" gutterBottom>
          {questions[key].helpText}
        </Typography>
      </Box>
    )
  })
  return stepData
}

// Inspired by blueprintjs
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
export default function SurveyQuestions({ ...props }) {
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
    Object.keys(questions).forEach((key) => {
      if (parseInt(key) === step) {
        switch (questions[key].type) {
          case "options":
            let i = 0
            let data = []

            for (let option of questions[key].options) {
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
              <FormControl component="fieldset" className={classes.textAreaControl}>
                <TextField
                  id="standard-multiline-flexible"
                  multiline
                  rows={4}
                  variant="filled"
                  value={values.textArea}
                  helperText={`${values.textArea.length}/${CHARACTER_LIMIT} max characters`}
                  inputProps={{
                    maxLength: CHARACTER_LIMIT,
                  }}
                  onChange={(event) => handleChange("textArea", event.target.value)}
                  className={classes.textArea}
                />
              </FormControl>
            )
            break
          case "time":
            const hours = []
            const minutes = []
            const ampm = []

            for (let i = 1; i <= 12; i++) {
              hours.push(
                <MenuItem value={i} classes={{ root: classes.hours }}>
                  {i < 10 ? "0" + i : i}
                </MenuItem>
              )
            }

            for (let i = 0; i <= 60; i++) {
              minutes.push(
                <MenuItem value={i} classes={{ root: classes.minutes }}>
                  {i < 10 ? "0" + i : i}
                </MenuItem>
              )
            }

            ampm.push(
              <MenuItem value="am" classes={{ root: classes.ampm }}>
                am
              </MenuItem>
            )
            ampm.push(
              <MenuItem value="pm" classes={{ root: classes.ampm }}>
                pm
              </MenuItem>
            )

            stepData.push(
              <Box textAlign="center">
                <FormControl className={classes.timeSelect}>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={values.hour}
                    onChange={(event) => handleChange("hour", event.target.value as string)}
                    classes={{ root: classes.timeselectInput }}
                  >
                    {hours}
                  </Select>
                </FormControl>
                :
                <FormControl className={classes.timeSelect}>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={values.minutes}
                    onChange={(event) => handleChange("minutes", event.target.value as string)}
                    classes={{ root: classes.timeselectInput }}
                  >
                    {minutes}
                  </Select>
                </FormControl>
                <FormControl className={classes.timeSelect}>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={values.ampm}
                    onChange={(event) => handleChange("ampm", event.target.value as string)}
                    classes={{ root: classes.timeselectInput }}
                  >
                    {ampm}
                  </Select>
                </FormControl>
              </Box>
            )
            break
          case "rating":
            stepData.push(
              <Box textAlign="center">
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
                  classes={{ root: classes.slider }}
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
                    <Typography variant="caption" display="block" gutterBottom>
                      terrible
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" display="block" gutterBottom>
                      neutral
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" display="block" gutterBottom>
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
                <div className={classes.actionsContainer}>
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
                </div>
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
