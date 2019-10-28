
// Core Imports
import React, { useState, useRef } from 'react'
import '@material-ui/core'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import Checkbox from '@material-ui/core/Checkbox'
import FormGroup from '@material-ui/core/FormGroup'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import Switch from '@material-ui/core/Switch'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import StepButton from '@material-ui/core/StepButton'
import StepContent from '@material-ui/core/StepContent'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Hidden from '@material-ui/core/Hidden'

// Local Imports
import { ResponsivePaper, useKeyPress } from './Utils'

// TODO: DateTime/Calendar, Dropdown variants, Required vs. optional, Image prompt + choices (?)
// TODO: section-by-section, question-by-question modes -> track time taken + answer changes


function Banner({ heading, text, description, large, ...props }) {
  return (
    <Box {...props} p={2}>
      <Typography variant={large ? 'subtitle2' : 'subtitle2'} color="textSecondary">
        {heading}
      </Typography>
      <Typography variant={large ? 'h3' : 'h6'} color="primary" style={{ fontWeight: large ? 700 : undefined }}>
        {text}
      </Typography>
      <Typography variant={large ? 'body2' : 'body2'} color="textSecondary">
        {description}
      </Typography>
    </Box>
  )
}

function TextResponse({ onChange, multiline, value, ...props }) {
  return <TextField {...props}
    fullWidth={multiline}
    multiline={multiline}
    rowsMax={multiline ? '10' : undefined}
    variant="outlined"
    defaultValue={value}
    onBlur={event => onChange(event.target.value)} 
  />
}

function CheckboxResponse({ onChange, value, ...props }) {
  return <Checkbox {...props} value={value || false} onChange={event => onChange(event.target.value)} />
}

function SwitchResponse({ onChange, value, ...props }) {
  return <Switch {...props} value={value || false} onChange={event => onChange(event.target.value)} />
}

function MultiSelectResponse({ onChange, options, value, ...props }) {
  const [selectedValue, setSelectedValue] = useState(value || [])
  return (
    <FormGroup {...props}>
      {options.map(x => (
          <FormControlLabel
          key={`${x.value || x.label}`}
          value={`${x.value || x.label}`}
          control={<Checkbox
            onClick={() => {
              let targetValue = !selectedValue.includes(`${x.value || x.label}`) ? 
                [...selectedValue, `${x.value || x.label}`] : 
                selectedValue.filter(y => y !== `${x.value || x.label}`)

              setSelectedValue(targetValue)
              onChange(targetValue)
            }}
            icon={<Icon fontSize="small">check_box_outline_blank</Icon>}
            checkedIcon={<Icon fontSize="small">check_box</Icon>}
          />}
          label={
            <Typography component="span" variant="body2">
              {x.label}
            </Typography>
          }
          labelPlacement="end"
        />)
      )}
    </FormGroup>
  )
}

function SelectResponse({ onChange, options, value, ...props }) {
  const [selectedValue, setSelectedValue] = useState(value || '')
  return (
    <RadioGroup 
      {...props}
      name="option" 
      value={selectedValue} 
      onChange={event => {
        setSelectedValue(event.target.value)
        onChange(event.target.value)
      }} 
    >
      {options.map(x => (
          <FormControlLabel
          key={x.label}
          value={`${x.value}`}
          control={<Radio
            color={selectedValue === `${x.value}` ? 'secondary' : 'default'}
            onClick={() => {
              if (selectedValue === `${x.value}`) {
                setSelectedValue('')
                onChange(undefined)
              }
            }}
            icon={<Icon fontSize="small">radio_button_unchecked</Icon>}
            checkedIcon={<Icon fontSize="small">radio_button_checked</Icon>}
          />}
          label={
            <Typography component="span" variant="body2">
              {x.label}
            </Typography>
          }
          labelPlacement="end"
        />)
      )}
    </RadioGroup>
  )
}

function Question({ onResponse, hideHeader, number, text, type, options, value, ...props }) {
  let onChange = value => onResponse({ item: text, value: value })
  const _boolOpts = [{ label: 'Yes', value: 'Yes' /* true */ }, { label: 'No', value: 'No' /* false */ }]
  // CheckboxResponse, SwitchResponse

  let component = <Box />
  if (type === 'select' || type === 'list')
    component = <SelectResponse options={options} onChange={onChange} value={!!value ? value.value : undefined} />
  else if (type === 'multiselect')
    component = <MultiSelectResponse options={options} onChange={onChange} value={!!value ? value.value : undefined} />
  else if (type === 'boolean')
    component = <SelectResponse options={_boolOpts} onChange={onChange} value={!!value ? value.value : undefined} />
  else if (type === 'text' || type === null)
    component = <TextResponse onChange={onChange} value={!!value ? value.value : undefined} />
  else if (type === 'paragraph')
    component = <TextResponse multiline onChange={onChange} value={!!value ? value.value : undefined} />
  else component = <TextResponse onChange={onChange} value={!!value ? value.value : undefined} />

  return (
    <FormControl 
      {...props}
      component="fieldset"
      style={{ ...props.style, width: '100%', margin: 16 }}
    >
      <Grid 
        container spacing={2}
        justify={hideHeader !== true ? 'center' : undefined} 
        alignItems={hideHeader !== true ? 'center' : undefined} 
      >
        {hideHeader !== true &&
          <Grid item xs={12} lg={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Question {number}
            </Typography>
            <Typography variant="h6">
              {text}
            </Typography>
          </Grid>
        }
        <Grid item xs={12} lg={6}>
          {component}
        </Grid>
      </Grid>
    </FormControl>
  )
}

function Section({ noHeader, onResponse, index, value, ...props }) {
  const responses = useRef({})
  const [activeStep, setActiveStep] = useState(0)
  const leftArrowPress = useKeyPress('ArrowLeft', () => {}, () => {
    setActiveStep(step => Math.max(step - 1, 0))
  })
  const rightArrowPress = useKeyPress('ArrowRight', () => {}, () => {
    setActiveStep(step => Math.min(step + 1, value.questions.length))
  })

  const isComplete = (idx) => responses.current[idx] && responses.current[idx].value
  const isError = (idx) => !isComplete(idx) && (idx < activeStep)

  return (
    <ResponsivePaper {...props} elevation={noHeader ? 0 : 4}>
      {noHeader !== true && <Banner 
        heading={`Section ${index}`} 
        text={value.banner} 
      />}
      <div>
        <Stepper nonLinear activeStep={activeStep} orientation="vertical">
          {value.questions.map((x, idx) => (
            <Step key={idx}>
              <StepButton 
                onClick={() => setActiveStep(idx)} 
                completed={isComplete(idx)}
                optional={isError(idx) && <Typography variant="caption" color="error">Required</Typography>}
              >
                <StepLabel error={isError(idx)} style={{ textAlign: 'left' }}>
                  {x.text}
                </StepLabel>
              </StepButton>
              <StepContent>
                <Question 
                  hideHeader
                  number={idx + 1} 
                  text={x.text} 
                  type={x.type} 
                  options={x.options} 
                  value={responses.current[idx]}
                  onResponse={response => {
                    responses.current[idx] = response
                    onResponse(Array.from({ ...responses.current, length: value.questions.length }))
                  }}
                />
                <div>
                  <Button
                    disabled={activeStep === 0}
                    onClick={() => setActiveStep(prev => prev - 1)}
                    style={{ marginRight: 16 }}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setActiveStep(prev => prev + 1)}
                  >
                    {activeStep === value.questions.length - 1 ? 'Finish' : 'Next'}
                  </Button>
                </div>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </div>
    </ResponsivePaper>
  )
}

function TabPanel({ index, value, children }) {
  return (
    <div
      hidden={value !== index}
    >
      {children}
    </div>
  )
}

export default function Survey({ onResponse, onValidationFailure, validate, content, ...props }) {
  if (!content) return <React.Fragment />
  const responses = useRef({})
  const [activeTab, setActiveTab] = useState(0)
  const upArrowPress = useKeyPress('ArrowUp', () => {}, () => {
    setActiveTab(tab => Math.max(tab - 1, 0))
  })
  const downArrowPress = useKeyPress('ArrowDown', () => {}, () => {
    setActiveTab(tab => Math.min(tab + 1, ((content || {}).sections || []).length))
  })

  const validator = response => {
    for (let section of response) {
      if (section === undefined)
        return false
      for (let question of section)
        if (question === undefined)
          return false
    }
    return true
  }
  const postSubmit = response => {
    if (!validate)
      onResponse(response)
    else if (validate && validator(response))
      onResponse(response)
    else if (validate && !validator(response))
      onValidationFailure()
  }

  return (
    <Grid container spacing={8}>
      <Grid item xs={12}>
        <ResponsivePaper elevation={4}>
          <Banner 
            large 
            text={(content || {}).name} 
            description={(content || {}).description} 
          />
          <Divider />
          <Grid container spacing={1}>
            {((content || {}).sections || []).length > 1 &&
              <Grid item xs={1}>
                <Tabs
                  orientation="vertical"
                  variant="scrollable"
                  value={activeTab}
                  onChange={(e, newValue) => setActiveTab(newValue)}
                >
                {((content || {}).sections || []).map((x, idx) => (
                  <Tab label={x.banner} />
                ))}
                </Tabs>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  style={{ margin: '0px 0px 0px 16px', width: '85%' }} 
                  onClick={() => postSubmit(Array.from({ ...responses.current, length: content.sections.length }))}
                >
                  Submit
                </Button>
              </Grid>
            }
            <Grid item xs={11 + (((content || {}).sections || []).length > 1 ? 0 : 1)}>
              {((content || {}).sections || []).map((x, idx) => (
                <div hidden={activeTab !== idx}>
                  <Section 
                    noHeader
                    index={idx + 1} 
                    value={x} 
                    onResponse={response => responses.current[idx] = response} 
                  />
                </div>
              ))}
            </Grid>
            {((content || {}).sections || []).length <= 1 &&
              <Button 
                variant="contained" 
                color="secondary" 
                style={{ float: 'left', margin: '0px 0px 16px 16px' }} 
                onClick={() => postSubmit(Array.from({ ...responses.current, length: content.sections.length }))}
              >
                Submit
              </Button>
            }
          </Grid>
        </ResponsivePaper>
      </Grid>
    </Grid>
  )
}
