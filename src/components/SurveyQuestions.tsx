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
  icon: {
    borderRadius: "50%",
    width: 16,
    height: 16,
    // backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
    // '$root.Mui-focusVisible &': {
    //   outline: '2px auto rgba(19,124,189,.6)',
    //   outlineOffset: 2,
    // },
    border: "3px solid #C6C6C6",
  },
  checkedIcon: {
    background: "#2F9D7E !important",
    // backgroundColor: '#137cbd',
    // backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
    // '&:before': {
    //   display: 'block',
    //   width: 16,
    //   height: 16,
    //   backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
    //   content: '""',
    // },
    // 'input:hover ~ &': {
    //   backgroundColor: '#106ba3',
    // },
  },
  bottom: {
    color: theme.palette.grey[theme.palette.type === "light" ? 200 : 700],
  },
  btngreen: {
    background: "#92E7CA",
    borderRadius: "40px",
    minWidth: "200px",
    boxShadow: "0px 10px 15px rgba(146, 231, 202, 0.25)",
    lineHeight: "38px",
    marginTop: "15%",

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
  // sliderTrack : {
  //   background: "#2F9D7E",
  //   boxShadow: "0px 5px 10px rgba(47, 157, 122, 0.25)"
  // }
}))
const PrettoSlider = withStyles({
  root: {
    color: "#52af77",
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    marginTop: -8,
    marginLeft: -12,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)",
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider)

// Inspired by blueprintjs
function StyledRadio(props: RadioProps) {
  const classes = useStyles()

  return (
    <Radio
      className={classes.root}
      disableRipple
      color="default"
      size="medium"
      checkedIcon={<span className={classnames(classes.icon, classes.checkedIcon)} />}
      //icon={<span className={classes.icon} />}
      {...props}
    />
  )
}

export default function SurveyQuestions({ ...props }) {
  const classes = useStyles()
  const [tab, _setTab] = useState(0)
  const [progressValue, setProgressValue] = useState(25)

  const supportsSidebar = useMediaQuery(useTheme().breakpoints.up("md"))
  const CHARACTER_LIMIT = 300
  const [values, setValues] = React.useState({
    radioOption: 0,
    textArea: "",
    sliderValue: 0,
  })
  let activeTab = (newTab?: any) => {
    _setTab(newTab)
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
  const handleSubmit = () => {}

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
      value: 30,
      label: "Poor",
    },

    {
      value: 50,
      label: "neutral",
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
      value: 80,
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
            }}
          >
            {`${props.type.replace(/_/g, " ")}`}
          </Typography>
        </Toolbar>
        <BorderLinearProgress variant="determinate" value={progressValue} />
      </AppBar>

      <Slide in={tab === 0} direction={tabDirection(0)} mountOnEnter unmountOnExit>
        <Box my={4}>
          <Container>
            <FormControl component="fieldset">
              <FormLabel component="legend">Gender</FormLabel>
              <RadioGroup
                aria-label="gender"
                name="gender1"
                value={values.radioOption}
                onChange={(event) => handleChange("radioOption", event.target.value)}
              >
                <FormControlLabel value="male" control={<StyledRadio />} label="Male" />
                <FormControlLabel value="male" control={<Radio />} label="Male" />
                <FormControlLabel value="other" control={<Radio />} label="Other" />
                <FormControlLabel value="disabled" disabled control={<Radio />} label="(Disabled option)" />
              </RadioGroup>
            </FormControl>
            <Box textAlign="center">
              <Button variant="contained" color="primary" className={classes.btngreen} onClick={handleNext}>
                Next
              </Button>
            </Box>
          </Container>
        </Box>
      </Slide>
      <Slide in={tab === 1} direction={tabDirection(1)} mountOnEnter unmountOnExit>
        <Box my={4}>
          <Container>
            <Typography variant="h5">What social interactions have most influenced your mood this week?</Typography>
            <Typography variant="caption" display="block" gutterBottom>
              Short answer (1-2 sentences)
            </Typography>
            <FormControl component="fieldset">
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
              />
            </FormControl>
            <Box textAlign="center">
              <Button variant="contained" color="primary" className={classes.btngreen} onClick={handleNext}>
                Next
              </Button>
            </Box>
          </Container>
        </Box>
      </Slide>
      <Slide in={tab === 2} direction={tabDirection(2)} mountOnEnter unmountOnExit>
        <Box my={4}>
          <Container>
            <Typography variant="h5">What time did you go to bed?</Typography>
            <Typography variant="caption" display="block" gutterBottom>
              (Select from drop down menu)
            </Typography>
            <FormControl component="fieldset">
              {/* <TextField
          id="standard-select-currency"
          select
          label="Select"
          // value={currency}
          // onChange={handleChange}
          helperText="Please select your currency"
        >
          {currencies.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id="standard-select-currency"
          select
          label="Select"
          value={currency}
          onChange={handleChange}
          helperText="Please select your currency"
        >
          {currencies.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id="standard-select-currency"
          select
          label="Select"
          value={currency}
          onChange={handleChange}
          helperText="Please select your currency"
        >
          {currencies.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>       */}
            </FormControl>
            <Box textAlign="center">
              <Button variant="contained" color="primary" className={classes.btngreen} onClick={handleNext}>
                Next
              </Button>
            </Box>
          </Container>
        </Box>
      </Slide>
      <Slide in={tab === 3} direction={tabDirection(3)} mountOnEnter unmountOnExit>
        <Box my={4}>
          <Container>
            <Typography variant="h5">How would you rate the quality of your social life?</Typography>
            <Typography variant="caption" display="block" gutterBottom>
              (0 being terrible, 10 being excellent)
            </Typography>
            <Box textAlign="center">
              <Slider
                defaultValue={values.sliderValue}
                getAriaValueText={valuetext}
                aria-labelledby="discrete-slider"
                valueLabelDisplay="auto"
                step={10}
                marks //={marks}
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
              <Typography variant="caption" display="block" gutterBottom>
                Your response:
              </Typography>
              <Typography variant="h4">{getSliderValue()}</Typography>
            </Box>
            <Box textAlign="center">
              <Button variant="contained" color="primary" className={classes.btngreen} onClick={handleSubmit}>
                Submit
              </Button>
            </Box>
          </Container>
        </Box>
      </Slide>
    </div>
  )
}
