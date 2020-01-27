
// Core Imports
import React, { useState, useEffect } from 'react'
import { 
  Box, Tooltip, Typography, Grid, Fab, Divider, 
  IconButton, Icon, Button, ButtonGroup, TextField, 
  InputAdornment, Stepper, Step, StepLabel, StepButton, 
  StepContent, Radio, RadioGroup, FormControlLabel 
} from '@material-ui/core'

function SelectList({ value, onChange, ...props }) {
  const [options, setOptions] = useState(value || [])
  useEffect(() => { onChange(options) }, [options])

  return (
      <React.Fragment>
        <RadioGroup name="option">
          {options.map((x, idx) => (
              <FormControlLabel
                  key={`${x.value}-${idx}`}
                  value={x.value} 
                  style={{ width: '100%', alignItems: 'flex-start' }}
                  control={<Radio
                    disabled
                    color="secondary"
                    icon={<Icon fontSize="small">radio_button_unchecked</Icon>}
                    checkedIcon={<Icon fontSize="small">radio_button_checked</Icon>}
                  />}
              label={
                <React.Fragment>
                  <TextField
                      fullWidth
                      variant="outlined"
                      defaultValue={x.value || ''}
                      label="Question Option"
                      onBlur={event => setOptions(options => Object.assign(
                        [...options], { 
                          [idx]: { 
                            value: event.target.value, 
                            description: options[idx].description 
                          } 
                        })
                      )}
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
                  <TextField
                      fullWidth
                      margin="dense"
                      variant="filled"
                      style={{ marginBottom: 16 }}
                      defaultValue={x.description || ''}
                      label="Option Description"
                      onBlur={event => setOptions(options => Object.assign(
                        [...options], { 
                          [idx]: { 
                            value: options[idx].value, 
                            description: event.target.value
                          } 
                        })
                      )}
                    /> 
                  </React.Fragment>
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
        onChange({ text, type, description, options: type === 'list' ? options : null }) 
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
                        label="Question Description"
                        variant="filled"
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
  const [description, setDescription] = useState(!!value ? value.description : undefined)
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
                    label="Survey Title"
                    defaultValue={text}
                    onChange={event => setText(event.target.value)} 
                /> 
            </Grid>
            <Grid item>
                <TextField
                    fullWidth
                    multiline
                    label="Survey Description"
                    variant="filled"
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
            <Grid container 
              direction="column" 
              alignItems="flex-end" 
              spacing={1} 
              style={{ position: 'fixed', bottom: 24, right: 24, width: 'auto' }}
            >
              {!!value &&
                <Grid item>
                  <Tooltip title="Duplicate this survey instrument and save it with a new title.">
                    <Fab 
                      color="primary" 
                      aria-label="Duplicate" 
                      variant="extended"
                      onClick={() => onSave({ 
                          id: undefined,
                          name: text, 
                          spec: 'lamp.survey',
                          schedule: [],
                          settings: questions,
                          description
                      }, true /* duplicate */)} 
                      disabled={!onSave || questions.length === 0 || !text || (value.name.trim() === text.trim())}
                    >
                      Duplicate
                      <span style={{ width: 8 }} />
                      <Icon>file_copy</Icon>
                    </Fab>
                  </Tooltip>
                </Grid>
              }
              <Grid item>
                <Tooltip title="Save this survey instrument.">
                  <Fab 
                    color="secondary" 
                    aria-label="Save" 
                    variant="extended"
                    onClick={() => onSave({ 
                        id: undefined,
                        name: text, 
                        spec: 'lamp.survey',
                        schedule: [],
                        settings: questions,
                        description
                    }, false /* overwrite */)} 
                    disabled={!onSave || questions.length === 0 || !text}
                  >
                    Save
                    <span style={{ width: 8 }} />
                    <Icon>save</Icon>
                  </Fab>
                </Tooltip>
              </Grid>
            </Grid>
        </Grid>
    )
}
