
// Core Imports
import React, { useState, useEffect } from 'react'
import Box from '@material-ui/core/Box'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Fab from '@material-ui/core/Fab'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import Icon from '@material-ui/core/Icon'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import StepButton from '@material-ui/core/StepButton'
import StepContent from '@material-ui/core/StepContent'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'

function SelectList({ value, onChange, ...props }) {
  const [options, setOptions] = useState(value || [])
  useEffect(() => { onChange(options) }, [options])

  return (
      <React.Fragment>
        <RadioGroup name="option">
          {options.map((x, idx) => (
              <FormControlLabel
                  key={`${x}-${idx}`}
                  value={x} 
                  style={{ width: '100%' }}
                  control={<Radio
                    disabled
                    color="secondary"
                    icon={<Icon fontSize="small">radio_button_unchecked</Icon>}
                    checkedIcon={<Icon fontSize="small">radio_button_checked</Icon>}
                  />}
              label={
                <TextField
                    fullWidth
                    style={{ marginBottom: 16 }}
                    variant="outlined"
                    defaultValue={x}
                    label="Question Option"
                    onBlur={event => setOptions(options => Object.assign([...options], { [idx]: event.target.value }))} 
                    InputProps={{
                      endAdornment: [
                        <InputAdornment position="end" key="adornment">
                          <Tooltip title="Delete this option from the question's list of options.">
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              onClick={() => setOptions(options => [...options.slice(0, idx), ...options.slice(idx + 1)])}
                              onMouseDown={event => event.preventDefault()}
                            >
                              <Icon>delete_forever</Icon>
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      ]
                    }}
                  /> 
              }
              labelPlacement="end"
            />)
          )}
          <FormControlLabel
              control={<Radio
                checked
                color="primary"
                onClick={() => setOptions(options => [...options, ''])}
                checkedIcon={<Icon fontSize="small">add_circle</Icon>}
              />}
              label={
                  <Typography>Add Option</Typography>
              }
              labelPlacement="end"
            />
        </RadioGroup>
      </React.Fragment>
  )
}


function QuestionCreator({ question, onChange, onDelete, isSelected, setSelected, ...props }) {
    const [text, setText] = useState(question.text)
    const [description, setDescription] = useState(question.description)
    const [type, setType] = useState(question.type || 'text')
    const [options, setOptions] = useState(question.options)
    useEffect(() => { 
        onChange({ text, type, options: type === 'list' ? options : null, description }) 
    }, [text, description, type, options])

    return (
        <Step {...props}>
          <StepButton onClick={setSelected}>
            <StepLabel style={{ width: '100%', textAlign: 'left' }}>
              {isSelected ? text :
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Question Title"
                    helperText="Modify the question's prompt."
                    defaultValue={text}
                    onBlur={event => setText(event.target.value)} 
                    InputProps={{
                      endAdornment: [
                        <InputAdornment position="end" variant="filled" key="adornment">
                          <Tooltip title="Delete question from survey instrument.">
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              onClick={() => onDelete()}
                              onMouseDown={event => event.preventDefault()}
                            >
                              <Icon>delete_forever</Icon>
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      ]
                    }}
                  /> 
              }
            </StepLabel>
          </StepButton>
          <StepContent>
            <Grid container direction="column" spacing={2}>
                <Grid item>
                    <TextField
                        fullWidth multiline
                        style={{ marginTop: 16 }}
                        label="Question Description"
                        variant="outlined"
                        helperText="Modify the question description."
                        defaultValue={description}
                        onBlur={event => setDescription(event.target.value)} 
                    /> 
                </Grid>
                <Grid item xs={12}>
                    <ButtonGroup size="small">
                      <Button disabled>Question Type</Button>
                      <Button color={type === 'text' ? 'primary' : 'default'} onClick={() => setType('text')}>text</Button>
                      <Button color={type === 'boolean' ? 'primary' : 'default'} onClick={() => setType('boolean')}>boolean</Button>
                      <Button color={type === 'likert' ? 'primary' : 'default'} onClick={() => setType('likert')}>likert</Button>
                      <Button color={type === 'list' ? 'primary' : 'default'} onClick={() => setType('list')}>list</Button>
                    </ButtonGroup>
                </Grid>
                {type === 'list' && 
                <Grid item>
                    <Box borderColor="grey.400" border={1} borderRadius={4} p={2}>
                        <SelectList value={options} onChange={setOptions} />
                    </Box>
                </Grid>}
            </Grid>
          </StepContent>
        </Step>
    )
}


export default function SurveyCreator({ value, onSave, onCancel, ...props }) {
    const [activeStep, setActiveStep] = useState(0)
    const [text, setText] = useState(!!value ? value.name : undefined)
    const [description, setDescription] = useState()
    const [questions, setQuestions] = useState(!!value ? value.settings : [])

	return (
        <Grid container direction="column" spacing={2}>
            <Grid item>
                <Typography variant="h4">{!!value ? 'Modify an existing survey instrument.': 'Create a new survey instrument.'}</Typography>
                <Divider />
            </Grid>
            <Grid item>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Survey Instrument Title"
                    helperText="Modify the survey instrument title."
                    defaultValue={text}
                    onChange={event => setText(event.target.value)} 
                /> 
            </Grid>
            <Grid item>
                <TextField
                    fullWidth
                    multiline
                    label="Survey Instrument Description"
                    variant="outlined"
                    helperText="Modify the survey instrument description."
                    defaultValue={description}
                    onChange={event => setDescription(event.target.value)} 
                /> 
            </Grid>
            <Grid item>
                <Divider />
                <Typography variant="h6">Configure questions, parameters, and options.</Typography>
            </Grid>
            <Grid item>
                <Stepper nonLinear activeStep={activeStep} orientation="vertical">
                  {questions.map((x, idx) => (
                      <QuestionCreator 
                          key={`${x.text}-${idx}`}
                          question={x} 
                          onChange={change => setQuestions(questions => Object.assign([...questions], { [idx]: change }))} 
                          onDelete={() => {setQuestions(questions => [...questions.slice(0, idx), ...questions.slice(idx + 1)]);  setActiveStep(prev => prev - 1)}}
                          isSelected={activeStep !== idx} 
                          setSelected={() => setActiveStep(idx)} />
                  ))}
                  <Grid container direction="row" justify="flex-start" alignItems="center" spacing={2} style={{ margin: '8px 0px 0px -8px' }}>
                      <Fab
                        size="small"
                        color="primary"
                        onClick={() => {setQuestions(questions => [...questions, {}]); setActiveStep(questions.length)}}
                      >
                        <Icon fontSize="small">add_circle</Icon>
                      </Fab>
                      <Grid item>
                          <Typography variant="subtitle2">Add Question</Typography>
                      </Grid>
                  </Grid>
                </Stepper>
            </Grid>
            <Grid item>
                <Divider />
            </Grid>
            <Grid item container alignItems="center" justify="flex-end" spacing={2}>
                <Grid item>
                    <Button variant="contained" color="secondary" onClick={onCancel} disabled={!onCancel}>
                        Cancel
                    </Button>
                </Grid>
                <Grid>
                    <Button variant="contained" color="primary" onClick={() => onSave({ 
                        id: undefined,
                        name: text, 
                        spec: 'lamp.survey',
                        schedule: [],
                        settings: questions,
                        description
                    })} disabled={!onSave || questions.length === 0 || !text}>
                        Save
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    )
}
