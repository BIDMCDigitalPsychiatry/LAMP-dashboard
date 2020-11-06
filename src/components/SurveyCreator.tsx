// Core Imports
import React, { useState, useEffect } from "react"
import {
  Box,
  Tooltip,
  Typography,
  Grid,
  Fab,
  Divider,
  IconButton,
  Icon,
  Button,
  ButtonGroup,
  TextField,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  StepButton,
  StepContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormGroup,
  Checkbox,
  MenuItem,
  Container,
} from "@material-ui/core"
import { makeStyles, Theme, createStyles, createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"

const theme = createMuiTheme({
  palette: {
    secondary: {
      main: "#333",
    },
  },
  overrides: {
    MuiFilledInput: {
      root: {
        border: 0,
        backgroundColor: "#f4f4f4",
      },
      underline: {
        "&&&:before": {
          borderBottom: "none",
        },
        "&&:after": {
          borderBottom: "none",
        },
      },
    },
    MuiTextField: {
      root: { width: "100%" },
    },
    MuiDivider: {
      root: { margin: "25px 0" },
    },
    MuiStepper: {
      root: { paddingLeft: 8 },
    },
  },
})
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    containerWidth: { maxWidth: 1055 },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
  })
)
function SelectList({ checkbox, type, value, onChange, ...props }) {
  const [options, setOptions] = useState(value || [])
  useEffect(() => {
    onChange(options)
  }, [options])

  // Toggle certain components/icons between Checkbox/Radio variants.

  const TypeGroup = checkbox ? FormGroup : RadioGroup
  const TypeComponent = checkbox ? Checkbox : Radio
  const AddIcon = checkbox ? "add_box" : "add_circle"
  const CheckedIcon = checkbox ? "check_box" : "radio_button_checked"
  const UncheckedIcon = checkbox ? "check_box_outline_blank" : "radio_button_unchecked"

  return (
    <React.Fragment>
      <TypeGroup name="option">
        {options.map((x, idx) => (
          <FormControlLabel
            key={`${x.value}-${idx}`}
            value={x.value}
            style={{ width: "100%", alignItems: "flex-start" }}
            control={
              <TypeComponent
                disabled
                color="secondary"
                icon={<Icon fontSize="small">{UncheckedIcon}</Icon>}
                checkedIcon={<Icon fontSize="small">{CheckedIcon}</Icon>}
              />
            }
            label={
              <React.Fragment>
                <TextField
                  fullWidth
                  variant="outlined"
                  defaultValue={x.value || (type === "slider" ? 0 : "")}
                  label="Question Option"
                  onBlur={(event) =>
                    setOptions((options) =>
                      Object.assign([...options], {
                        [idx]: {
                          value: event.target.value,
                          description: options[idx].description,
                        },
                      })
                    )
                  }
                  type={type === "slider" ? "number" : "text"}
                  InputProps={{
                    endAdornment: [
                      <InputAdornment position="end" key="adornment">
                        <Tooltip title="Delete this option from the question's list of options.">
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() =>
                              setOptions((options) => [...options.slice(0, idx), ...options.slice(idx + 1)])
                            }
                            onMouseDown={(event) => event.preventDefault()}
                          >
                            <Icon>delete_forever</Icon>
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>,
                    ],
                  }}
                />
                <TextField
                  fullWidth
                  margin="dense"
                  variant="filled"
                  style={{ marginBottom: 16 }}
                  defaultValue={x.description || ""}
                  label="Option Description"
                  onBlur={(event) =>
                    setOptions((options) =>
                      Object.assign([...options], {
                        [idx]: {
                          value: options[idx].value,
                          description: event.target.value,
                        },
                      })
                    )
                  }
                />
              </React.Fragment>
            }
            labelPlacement="end"
          />
        ))}
        <FormControlLabel
          control={
            <TypeComponent
              checked
              color="primary"
              onClick={() => setOptions((options) => [...options, ""])}
              checkedIcon={<Icon fontSize="small">{AddIcon}</Icon>}
            />
          }
          label={<Typography>Add Option</Typography>}
          labelPlacement="end"
        />
      </TypeGroup>
    </React.Fragment>
  )
}

function QuestionCreator({ question, onChange, onDelete, isSelected, setSelected, ...props }) {
  const [text, setText] = useState(question.text)
  const [description, setDescription] = useState(question.description)
  const [type, setType] = useState(question.type || "text")
  const [options, setOptions] = useState(question.options)
  useEffect(() => {
    onChange({
      text,
      type,
      description,
      options: ["list", "select", "multiselect", "slider"].includes(type) ? options : null,
    })
  }, [text, description, type, options])

  return (
    <Step {...props}>
      <StepButton onClick={setSelected}>
        <StepLabel style={{ width: "100%", textAlign: "left" }}>
          {isSelected ? (
            text
          ) : (
            <TextField
              fullWidth
              variant="outlined"
              label="Question Title"
              defaultValue={text}
              onBlur={(event) => setText(event.target.value)}
              InputProps={{
                endAdornment: [
                  <InputAdornment position="end" variant="filled" key="adornment">
                    <Tooltip title="Delete question from survey instrument.">
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => onDelete()}
                        onMouseDown={(event) => event.preventDefault()}
                      >
                        <Icon>delete_forever</Icon>
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>,
                ],
              }}
            />
          )}
        </StepLabel>
      </StepButton>
      <StepContent>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <TextField
              fullWidth
              multiline
              label="Question Description"
              variant="filled"
              defaultValue={description}
              onBlur={(event) => setDescription(event.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <ButtonGroup size="small">
              <Button disabled>Question Type</Button>
              <Button color={type === "text" ? "primary" : "default"} onClick={() => setType("text")}>
                text
              </Button>
              <Button color={type === "boolean" ? "primary" : "default"} onClick={() => setType("boolean")}>
                boolean
              </Button>
              <Button color={["list", "select"].includes(type) ? "primary" : "default"} onClick={() => setType("list")}>
                list
              </Button>
              <Button color={type === "multiselect" ? "primary" : "default"} onClick={() => setType("multiselect")}>
                multi-select
              </Button>
              <Button color={type === "slider" ? "primary" : "default"} onClick={() => setType("slider")}>
                Slider
              </Button>
            </ButtonGroup>
          </Grid>
          {["list", "select", "multiselect", "slider"].includes(type) && (
            <Grid item>
              <Box borderColor="grey.400" border={1} borderRadius={4} p={2}>
                <SelectList checkbox={type === "multiselect"} type={type} value={options} onChange={setOptions} />
              </Box>
            </Grid>
          )}
        </Grid>
      </StepContent>
    </Step>
  )
}

export default function SurveyCreator({
  value,
  onSave,
  onCancel,
  studies,
  ...props
}: {
  value?: any
  onSave?: any
  onCancel?: any
  studies?: any
}) {
  const classes = useStyles()
  const [activeStep, setActiveStep] = useState(0)
  const [text, setText] = useState(!!value ? value.name : undefined)
  const [description, setDescription] = useState(!!value ? value.description : undefined)
  const [questions, setQuestions] = useState(!!value ? value.settings : [])
  const [studyId, setStudyId] = useState(!!value ? value.parentID : undefined)

  return (
    <div>
      <MuiThemeProvider theme={theme}>
        <Container className={classes.containerWidth}>
          <Grid container spacing={2} {...props}>
            <Grid item xs sm={6}>
              <TextField
                error={typeof studyId == "undefined" || studyId === null || studyId === "" ? true : false}
                id="filled-select-currency"
                select
                label="Study"
                value={studyId}
                onChange={(e) => {
                  setStudyId(e.target.value)
                }}
                helperText={
                  typeof studyId == "undefined" || studyId === null || studyId === "" ? "Please select the study" : ""
                }
                variant="filled"
                disabled={!!value ? true : false}
              >
                {studies.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs sm={6}>
              <TextField
                fullWidth
                variant="filled"
                label="Survey Title"
                defaultValue={text}
                onChange={(event) => setText(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                label="Survey Description"
                variant="filled"
                defaultValue={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </Grid>
            <Grid item sm={12}>
              <Divider />
              <Typography variant="h6">Configure questions, parameters, and options.</Typography>
            </Grid>
            <Grid item>
              <Stepper nonLinear activeStep={activeStep} orientation="vertical">
                {questions.map((x, idx) => (
                  <QuestionCreator
                    key={`${x.text}-${idx}`}
                    question={x}
                    onChange={(change) => setQuestions((questions) => Object.assign([...questions], { [idx]: change }))}
                    onDelete={() => {
                      setQuestions((questions) => [...questions.slice(0, idx), ...questions.slice(idx + 1)])
                      setActiveStep((prev) => prev - 1)
                    }}
                    isSelected={activeStep !== idx}
                    setSelected={() => setActiveStep(idx)}
                  />
                ))}
                <Grid container direction="row" justify="flex-start" alignItems="center" spacing={2}>
                  <Fab
                    size="small"
                    color="primary"
                    onClick={() => {
                      setQuestions((questions) => [...questions, {}])
                      setActiveStep(questions.length)
                    }}
                  >
                    <Icon fontSize="small">add_circle</Icon>
                  </Fab>
                  <Grid item>
                    <Typography variant="subtitle2">Add Question</Typography>
                  </Grid>
                </Grid>
              </Stepper>
            </Grid>
          </Grid>
        </Container>
      </MuiThemeProvider>
      <Grid
        container
        direction="column"
        alignItems="flex-end"
        spacing={1}
        style={{ position: "fixed", bottom: 24, right: 24, width: "auto" }}
      >
        {!!value && (
          <Grid item>
            <Tooltip title="Duplicate this survey instrument and save it with a new title.">
              <Fab
                color="primary"
                aria-label="Duplicate"
                variant="extended"
                onClick={() =>
                  onSave(
                    {
                      id: undefined,
                      name: text,
                      spec: "lamp.survey",
                      schedule: [],
                      settings: questions,
                      description,
                      studyID: studyId,
                    },
                    true /* duplicate */
                  )
                }
                disabled={
                  !onSave ||
                  questions.length === 0 ||
                  !text ||
                  (value.name.trim() === text.trim() && value.parentID === studyId)
                }
              >
                Duplicate
                <span style={{ width: 8 }} />
                <Icon>file_copy</Icon>
              </Fab>
            </Tooltip>
          </Grid>
        )}
        <Grid item>
          <Tooltip title="Save this survey instrument.">
            <Fab
              color="secondary"
              aria-label="Save"
              variant="extended"
              onClick={() =>
                onSave(
                  {
                    id: undefined,
                    name: text,
                    spec: "lamp.survey",
                    schedule: [],
                    settings: questions,
                    description,
                    studyID: studyId,
                  },
                  false /* overwrite */
                )
              }
              disabled={!onSave || questions.length === 0 || !text || !studyId}
            >
              Save
              <span style={{ width: 8 }} />
              <Icon>save</Icon>
            </Fab>
          </Tooltip>
        </Grid>
      </Grid>
    </div>
  )
}
