
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
import Checkbox from '@material-ui/core/Checkbox'
import FormGroup from '@material-ui/core/FormGroup'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import Switch from '@material-ui/core/Switch'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Hidden from '@material-ui/core/Hidden'

// Local Imports
import { ResponsivePaper } from './Utils'


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

function TextResponse({ onChange, multiline,  ...props }) {
  return <TextField {...props}
    fullWidth={multiline}
    multiline={multiline}
    rowsMax={multiline ? '10' : undefined}
    variant="outlined"
    onBlur={event => onChange(event.target.value)} 
  />
}

function CheckboxResponse({ onChange, ...props }) {
  return <Checkbox {...props} onChange={event => onChange(event.target.value)} />
}

function SwitchResponse({ onChange, ...props }) {
  return <Switch {...props} onChange={event => onChange(event.target.value)} />
}

function MultiSelectResponse({ onChange, options, ...props }) {
  const [selectedValue, setSelectedValue] = useState([])
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

function SelectResponse({ onChange, options, ...props }) {
  const [selectedValue, setSelectedValue] = useState('')
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

function Question({ onResponse, number, text, type, options, ...props }) {
  let onChange = value => onResponse({ item: text, value: value })
  const _boolOpts = [{ label: 'Yes', value: 'Yes' /* true */ }, { label: 'No', value: 'No' /* false */ }]
  // CheckboxResponse, SwitchResponse

  let component = <Box />
  if (type === 'select' || type === 'list')
    component = <SelectResponse options={options} onChange={onChange} />
  else if (type === 'multiselect')
    component = <MultiSelectResponse options={options} onChange={onChange} />
  else if (type === 'boolean')
    component = <SelectResponse options={_boolOpts} onChange={onChange} />
  else if (type === 'text' || type === null)
    component = <TextResponse onChange={onChange} />
  else if (type === 'paragraph')
    component = <TextResponse multiline onChange={onChange} />
  else component = <TextResponse onChange={onChange} />

  return (
    <FormControl 
      {...props}
      component="fieldset"
      style={{ ...props.style, width: '100%', margin: 16 }}
    >
      <Grid container justify="center" alignItems="center" spacing={2}>
        <Grid item xs={12} lg={6}>
          <Typography variant="subtitle2" color="textSecondary">
            Question {number}
          </Typography>
          <Typography variant="h6">
            {text}
          </Typography>
        </Grid>
        <Grid item xs={12} lg={6}>
          {component}
        </Grid>
      </Grid>
    </FormControl>
  )
}

function Section({ onResponse, index, value, ...props }) {
  const responses = useRef({})
  return (
    <ResponsivePaper {...props} elevation={4}>
      <Banner 
        heading={`Section ${index}`} 
        text={value.banner} 
      />
      {value.questions.map((x, idx) => (
        <React.Fragment key={idx}>
          <Divider />
          <Question 
            number={idx + 1} 
            text={x.text} 
            type={x.type} 
            options={x.options} 
            onResponse={response => {
              responses.current[idx] = response
              onResponse(Array.from({ ...responses.current, length: value.questions.length }))
            }}
          />
        </React.Fragment>
      ))}
    </ResponsivePaper>
  )
}

export default function Survey({ onResponse, onValidationFailure, validate, content, ...props }) {
  if (!content) return <React.Fragment />
  const responses = useRef({})

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
        </ResponsivePaper>
      </Grid>
      {((content || {}).sections || []).map((x, idx) => (
        <Grid item xs={12} key={idx}>
          <Section 
            index={idx + 1} 
            value={x} 
            onResponse={response => responses.current[idx] = response} 
          />
        </Grid>
      ))}
      <Grid item xs={12}>
        <Button 
          variant="contained" 
          color="secondary" 
          style={{ float: 'right' }} 
          onClick={() => postSubmit(Array.from({ ...responses.current, length: content.sections.length }))}
        >
          Submit
        </Button>
      </Grid>
    </Grid>
  )
}
