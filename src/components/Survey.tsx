// Core Imports
import React, { useState, useRef, useEffect } from "react"
import {
  Box,
  Typography,
  Icon,
  Fab,
  Paper,
  Divider,
  Checkbox,
  FormGroup,
  Radio,
  RadioGroup,
  Switch,
  FormControl,
  FormControlLabel,
  Stepper,
  Step,
  StepLabel,
  StepButton,
  StepContent,
  TextField,
  Grid,
} from "@material-ui/core"
import { KeyboardDateTimePicker } from "@material-ui/pickers"

// Local Imports
import LAMP from "lamp-core"
import useKeyPress from "./useKeyPress"
import { ResponsivePaper } from "./Utils"

function _useTernaryBool() {
  return (LAMP.Auth._auth.serverAddress || "").includes(".psych.digital")
}
const CSV_parse = (x) => (Array.isArray(JSON.parse(`[${x}]`)) ? JSON.parse(`[${x}]`) : [])
const CSV_stringify = (x) => (Array.isArray(x) ? JSON.stringify(x).slice(1, -1) : "")

// TODO: DateTime/Calendar, Dropdown variants, Required vs. optional, Image prompt + choices (?)
// TODO: section-by-section, question-by-question modes -> track time taken + answer changes

function Banner({
  heading,
  text,
  description,
  large,
  prefillTimestamp,
  onChangeTimestamp,
  ...props
}: {
  heading?: string
  text: string
  description?: string
  large?: boolean
  prefillTimestamp?: Date
  onChangeTimestamp?(Date): void
}) {
  return (
    <Box {...props} p={2}>
      <Grid container direction="row" justify="space-between" alignItems="center">
        <Grid item>
          <Typography variant={large ? "subtitle2" : "subtitle2"} color="textSecondary">
            {heading}
          </Typography>
          <Typography variant={large ? "h3" : "h6"} color="primary" style={{ fontWeight: large ? 700 : undefined }}>
            {text}
          </Typography>
          <Typography variant={large ? "body2" : "body2"} color="textSecondary" style={{ whiteSpace: "pre-wrap" }}>
            {description}
          </Typography>
        </Grid>
        <Grid item style={{ display: "none" }}>
          <KeyboardDateTimePicker
            autoOk
            animateYearScrolling
            variant="inline"
            inputVariant="outlined"
            format="MM/dd/yyyy"
            label="Start Date"
            helperText="Select the start date."
            InputAdornmentProps={{ position: "start" }}
            value={prefillTimestamp || new Date()}
            onChange={(date) => onChangeTimestamp(date)}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

function TextResponse({
  onChange,
  multiline,
  value,
  ...props
}: {
  onChange?(value: string): void
  multiline?: boolean
  value?: string
}) {
  return (
    <TextField
      {...props}
      fullWidth={multiline}
      multiline={multiline}
      rowsMax={multiline ? "10" : undefined}
      variant="outlined"
      defaultValue={value}
      onBlur={(event) => onChange(event.target.value)}
    />
  )
}

// eslint-disable-next-line
function CheckboxResponse({ onChange, value, ...props }) {
  return <Checkbox {...props} value={value || false} onChange={(event) => onChange(event.target.value)} />
}

// eslint-disable-next-line
function SwitchResponse({ onChange, value, ...props }) {
  return <Switch {...props} value={value || false} onChange={(event) => onChange(event.target.value)} />
}

function MultiSelectResponse({ onChange, options, value, ...props }) {
  const [selectedValue, setSelectedValue] = useState(value || "")
  const _selection = CSV_parse(selectedValue)
  return (
    <FormGroup {...props}>
      {options.map((x) => (
        <FormControlLabel
          key={x.label}
          value={`${x.value}`}
          style={{ alignItems: !!x.description ? "flex-start" : undefined }}
          control={
            <Checkbox
              checked={_selection.includes(`${x.value}`)}
              color={_selection.includes(`${x.value}`) ? "secondary" : "default"}
              onClick={() => {
                let targetValue = !_selection.includes(`${x.value}`)
                  ? [..._selection, `${x.value}`]
                  : _selection.filter((y) => y !== `${x.value}`)
                let _target = CSV_stringify(targetValue)

                setSelectedValue(_target)
                onChange(_target)
              }}
              icon={<Icon fontSize="small">check_box_outline_blank</Icon>}
              checkedIcon={<Icon fontSize="small">check_box</Icon>}
            />
          }
          label={
            <Typography component="span" variant="body2">
              {x.label}
              {!!x.description && (
                <Box
                  my={0.5}
                  p={0.5}
                  borderRadius={4}
                  borderColor="text.secondary"
                  border={1}
                  color="text.secondary"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {x.description}
                </Box>
              )}
            </Typography>
          }
          labelPlacement="end"
        />
      ))}
    </FormGroup>
  )
}

function SelectResponse({ onChange, options, value, ...props }) {
  const [selectedValue, setSelectedValue] = useState(value || "")
  return (
    <RadioGroup
      {...props}
      name="option"
      value={selectedValue}
      onChange={(event) => {
        setSelectedValue(event.target.value)
        onChange(event.target.value)
      }}
    >
      {options.map((x) => (
        <FormControlLabel
          key={x.label}
          value={`${x.value}`}
          style={{ alignItems: !!x.description ? "flex-start" : undefined }}
          control={
            <Radio
              color={selectedValue === `${x.value}` ? "secondary" : "default"}
              onClick={() => {
                if (selectedValue === `${x.value}`) {
                  setSelectedValue("")
                  onChange(undefined)
                }
              }}
              icon={<Icon fontSize="small">radio_button_unchecked</Icon>}
              checkedIcon={<Icon fontSize="small">radio_button_checked</Icon>}
            />
          }
          label={
            <Typography component="span" variant="body2">
              {x.label}
              {!!x.description && (
                <Box
                  my={0.5}
                  p={0.5}
                  borderRadius={4}
                  borderColor="text.secondary"
                  border={1}
                  color="text.secondary"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {x.description}
                </Box>
              )}
            </Typography>
          }
          labelPlacement="end"
        />
      ))}
    </RadioGroup>
  )
}

function Question({ onResponse, hideHeader, number, text, type, options, value, ...props }) {
  let onChange = (value) => onResponse({ item: text, value: value })
  const _binaryOpts = [
    { label: "Yes", value: "Yes" /* true */ },
    { label: "No", value: "No" /* false */ },
  ]
  const _ternaryOpts = [
    { label: "Yes", value: "Yes" /* true */ },
    { label: "No", value: "No" /* false */ },
    { label: "N/A", value: null /* null */ },
  ]
  const _likertOpts = [
    { label: "Nearly All the Time", value: 3 },
    { label: "More than Half the Time", value: 2 },
    { label: "Several Times", value: 1 },
    { label: "Not at all", value: 0 },
  ]
  // eslint-disable-next-line
  const _boolOpts = _useTernaryBool() ? _ternaryOpts : _binaryOpts // FIXME DEPRECATED

  // FIXME: CheckboxResponse, SwitchResponse

  let component = <Box />
  if (type === "select" || type === "list")
    component = <SelectResponse options={options} onChange={onChange} value={!!value ? value.value : undefined} />
  else if (type === "multiselect")
    component = <MultiSelectResponse options={options} onChange={onChange} value={!!value ? value.value : undefined} />
  else if (type === "boolean")
    component = <SelectResponse options={_binaryOpts} onChange={onChange} value={!!value ? value.value : undefined} />
  else if (type === "likert")
    component = <SelectResponse options={_likertOpts} onChange={onChange} value={!!value ? value.value : undefined} />
  else if (type === "text" || type === null)
    component = <TextResponse onChange={onChange} value={!!value ? value.value : undefined} />
  else if (type === "paragraph")
    component = <TextResponse multiline onChange={onChange} value={!!value ? value.value : undefined} />
  else component = <TextResponse onChange={onChange} value={!!value ? value.value : undefined} />

  return (
    <FormControl {...props} component="fieldset" style={{ ...props.style, width: "100%", margin: 16 }}>
      <Grid
        container
        spacing={2}
        justify={hideHeader !== true ? "center" : undefined}
        alignItems={hideHeader !== true ? "center" : undefined}
      >
        {hideHeader !== true && (
          <Grid item xs={12} lg={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Question {number}
            </Typography>
            <Typography variant="h6">{text}</Typography>
          </Grid>
        )}
        <Grid item xs={12} lg={6}>
          {component}
        </Grid>
      </Grid>
    </FormControl>
  )
}

function Section({ noHeader, onResponse, index, value, prefillData, ...props }) {
  const base = value.settings.map((x) => ({ item: x.text, value: null }))
  const responses = useRef(!!prefillData ? Object.assign(base, prefillData) : base)
  const [activeStep, setActiveStep] = useState(0)
  // eslint-disable-next-line
  const leftArrowPress = useKeyPress(
    "ArrowLeft",
    () => {},
    () => {
      setActiveStep((step) => Math.max(step - 1, 0))
    }
  )
  // eslint-disable-next-line
  const rightArrowPress = useKeyPress(
    "ArrowRight",
    () => {},
    () => {
      setActiveStep((step) => Math.min(step + 1, value.settings.length))
    }
  )

  // Force creation of result data whether survey was interacted with or not.
  useEffect(() => {
    onResponse(Array.from({ ...responses.current, length: value.settings.length }))
  }, [])
  const isComplete = (idx) => !!responses.current[idx]?.value
  const isError = (idx) => !isComplete(idx) && idx < activeStep

  return (
    <ResponsivePaper {...props} elevation={noHeader ? 0 : 4}>
      {noHeader !== true && <Banner heading={`Section ${index}`} text={value.name} />}
      <div>
        <Stepper nonLinear activeStep={activeStep} orientation="vertical">
          {value.settings.map((x, idx) => (
            <Step key={idx}>
              <StepButton
                onClick={() => setActiveStep(idx)}
                completed={isComplete(idx)}
                optional={
                  isError(idx) && (
                    <Typography variant="caption" color="error">
                      Required
                    </Typography>
                  )
                }
              >
                <StepLabel error={isError(idx)} style={{ textAlign: "left", whiteSpace: "pre-wrap" }}>
                  {x.text}
                </StepLabel>
              </StepButton>
              <StepContent>
                {!!x.description && (
                  <Typography variant="caption" style={{ whiteSpace: "pre-wrap" }}>
                    {x.description}
                  </Typography>
                )}
                <Question
                  hideHeader
                  number={idx + 1}
                  text={x.text}
                  type={x.type}
                  options={x.options?.map((y) => ({ ...y, label: y.value }))}
                  value={responses.current[idx]}
                  onResponse={(response) => {
                    responses.current[idx] = response

                    // Can be problematic when trying to select 2+ items...
                    if (x.type !== "multiselect") setActiveStep((prev) => prev + 1)

                    onResponse(
                      Array.from({
                        ...responses.current,
                        length: value.settings.length,
                      })
                    )
                  }}
                />
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </div>
    </ResponsivePaper>
  )
}

// eslint-disable-next-line
function TabPanel({ index, value, children }) {
  return <div hidden={value !== index}>{children}</div>
}

export default function Survey({
  onResponse,
  onValidationFailure,
  validate,
  partialValidationOnly,
  content,
  prefillData,
  prefillTimestamp,
  ...props
}) {
  const responses = useRef(!!prefillData ? Object.assign({}, prefillData) : {})

  // eslint-disable-next-line
  const [activeTab, setActiveTab] = useState(0)
  // eslint-disable-next-line
  const upArrowPress = useKeyPress(
    "ArrowUp",
    () => {},
    () => {
      setActiveTab((tab) => Math.max(tab - 1, 0))
    }
  )
  // eslint-disable-next-line
  const downArrowPress = useKeyPress(
    "ArrowDown",
    () => {},
    () => {
      setActiveTab((tab) => Math.min(tab + 1, ((content || {}).sections || []).length))
    }
  )

  if (!content) return <React.Fragment />

  const validator = (response) => {
    for (let section of response) {
      if (section === undefined)
        if (!!partialValidationOnly) continue
        else return false
      for (let question of section) if (question === undefined) return false
    }
    return true
  }
  const postSubmit = (response) => {
    if (!validate) onResponse(response, prefillTimestamp)
    else if (validate && validator(response)) onResponse(response, prefillTimestamp)
    else if (validate && !validator(response)) onValidationFailure()
  }

  return (
    <Grid container alignItems="stretch" spacing={2}>
      <Grid item xs={12}>
        <Paper elevation={4}>
          <Banner large text={(content || {}).name} description={(content || {}).description} />
        </Paper>
      </Grid>
      {((content || {}).sections || []).map((x, idx) => (
        <Grid item xs={12} key={idx}>
          <Paper elevation={4}>
            {!!x.name && (
              <React.Fragment>
                <Banner text={x.name} description={x.description} />
                <Divider />
              </React.Fragment>
            )}
            <Section
              noHeader
              index={idx + 1}
              value={x}
              prefillData={responses.current[idx]}
              onResponse={(response) => (responses.current[idx] = response)}
            />
          </Paper>
        </Grid>
      ))}
      <Fab
        color="secondary"
        aria-label="Submit"
        variant="extended"
        style={{ position: "fixed", bottom: 24, right: 24 }}
        onClick={() =>
          postSubmit(
            Array.from({
              ...responses.current,
              length: content.sections.length,
            })
          )
        }
      >
        {!!prefillData ? (!!prefillTimestamp ? "Overwrite" : "Duplicate") : "Submit"}
        <span style={{ width: 8 }} />
        <Icon>save</Icon>
      </Fab>
    </Grid>
  )
}
