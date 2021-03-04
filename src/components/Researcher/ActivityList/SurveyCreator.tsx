// Core Imports
import React, { useState, useEffect, useCallback } from "react"
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
  ButtonBase,
} from "@material-ui/core"
import { makeStyles, Theme, createStyles, createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import { useTranslation } from "react-i18next"
import { useDropzone } from "react-dropzone"
import { id } from "vega"
import { useSnackbar } from "notistack"

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
  const { t } = useTranslation()
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
                  defaultValue={x.value || (type === "slider" ? "" : "")}
                  label={t("Question Option")}
                  error={typeof x.value == "undefined" || x.value === null || x.value === "" ? true : false}
                  helperText={
                    typeof x.value == "undefined" || x.value === null || x.value === "" ? t("Please enter Option") : ""
                  }
                  onBlur={(event) =>
                    setOptions((options) =>
                      Object.assign([...options], {
                        [idx]: {
                          value: removeExtraSpace(event.target.value),
                          description: options[idx].description,
                        },
                      })
                    )
                  }
                  type={type === "slider" || type === "rating" ? "number" : "text"}
                  InputProps={{
                    endAdornment: [
                      <InputAdornment position="end" key="adornment">
                        <Tooltip title={t("Delete this option from the question's list of options.")}>
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
                  label={t("Option Description")}
                  onBlur={(event) =>
                    setOptions((options) =>
                      Object.assign([...options], {
                        [idx]: {
                          value: removeExtraSpace(options[idx].value),
                          description: removeExtraSpace(event.target.value),
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
          label={<Typography>{t("Add Option")}</Typography>}
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
  const { t } = useTranslation()
  useEffect(() => {
    onChange({
      text,
      type,
      description,
      options: ["list", "select", "multiselect", "slider", "rating"].includes(type) ? options : null,
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
              label={t("Question Title")}
              error={typeof text == "undefined" || text === null || text === "" || !text.trim().length ? true : false}
              helperText={
                typeof text == "undefined" || text === null || text === "" || !text.trim().length
                  ? t("Please enter Question Title")
                  : ""
              }
              defaultValue={text}
              onBlur={(event) => setText(removeExtraSpace(event.target.value))}
              InputProps={{
                endAdornment: [
                  <InputAdornment position="end" variant="filled" key="adornment">
                    <Tooltip title={t("Delete question from survey instrument.")}>
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
              label={t("Question Description")}
              variant="filled"
              defaultValue={description}
              onBlur={(event) => setDescription(removeExtraSpace(event.target.value))}
            />
          </Grid>
          <Grid item xs={12}>
            <ButtonGroup size="small">
              <Button disabled>{t("Question Type")}</Button>
              <Button color={type === "text" ? "primary" : "default"} onClick={() => setType("text")}>
                {t("text")}
              </Button>
              <Button color={type === "boolean" ? "primary" : "default"} onClick={() => setType("boolean")}>
                {t("boolean")}
              </Button>
              <Button color={["list", "select"].includes(type) ? "primary" : "default"} onClick={() => setType("list")}>
                {t("list")}
              </Button>
              <Button color={type === "multiselect" ? "primary" : "default"} onClick={() => setType("multiselect")}>
                {t("multi-select")}
              </Button>
              <Button color={type === "slider" ? "primary" : "default"} onClick={() => setType("slider")}>
                {t("Slider")}
              </Button>
              <Button color={type === "short" ? "primary" : "default"} onClick={() => setType("short")}>
                Short Answer
              </Button>
              <Button color={type === "rating" ? "primary" : "default"} onClick={() => setType("rating")}>
                Rating
              </Button>
            </ButtonGroup>
          </Grid>
          {["list", "select", "multiselect", "slider", "rating"].includes(type) && (
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

function compress(file, width, height) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    const fileName = file.name
    const extension = fileName.split(".").reverse()[0].toLowerCase()
    reader.onerror = (error) => reject(error)
    if (extension !== "svg") {
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target.result as string
        img.onload = () => {
          const elem = document.createElement("canvas")
          elem.width = width
          elem.height = height
          const ctx = elem.getContext("2d")
          ctx.drawImage(img, 0, 0, width, height)
          resolve(ctx.canvas.toDataURL())
        }
      }
    } else {
      reader.onload = (event) => {
        resolve(reader.result)
      }
    }
  })
}

const removeExtraSpace = (s) => s.trim().split(/ +/).join(" ")
export default function SurveyCreator({
  value,
  onSave,
  onCancel,
  studies,
  study,
  ...props
}: {
  value?: any
  onSave?: any
  onCancel?: any
  studies?: any
  study?: any
}) {
  const { enqueueSnackbar } = useSnackbar()
  const classes = useStyles()
  const [activeStep, setActiveStep] = useState(0)
  const [text, setText] = useState(!!value ? value.name : undefined)
  const [description, setDescription] = useState(!!value ? value.description : undefined)
  const [questions, setQuestions] = useState(!!value ? value.settings : [])
  const [studyId, setStudyId] = useState(!!value ? value.study_id : study)
  const { t } = useTranslation()
  const [photo, setPhoto] = useState(value?.photo ?? null)

  const { acceptedFiles, getRootProps, getInputProps, isDragActive, isDragAccept } = useDropzone({
    onDropAccepted: useCallback((acceptedFiles) => {
      compress(acceptedFiles[0], 64, 64).then(setPhoto)
    }, []),
    onDropRejected: useCallback((rejectedFiles) => {
      if (rejectedFiles[0].size / 1024 / 1024 > 5) {
        enqueueSnackbar(t("Image size should not exceed 5 MB."), { variant: "error" })
      } else if ("image" !== rejectedFiles[0].type.split("/")[0]) {
        enqueueSnackbar(t("Not supported image type."), { variant: "error" })
      }
    }, []),
    accept: "image/*",
    maxSize: 2 * 1024 * 1024 /* 5MB */,
  })

  const [isOptionNull, setIsOptionNull] = useState(0)

  useEffect(() => {
    let optionsArray = []
    {
      questions.map((x, idx) =>
        questions[idx].text == undefined ||
        questions[idx].text == "" ||
        questions[idx].text == null ||
        !questions[idx].text.trim().length
          ? optionsArray.push(idx)
          : questions[idx].options != null
          ? questions[idx].options.length == 0
            ? optionsArray.push(idx)
            : questions[idx].type == "list" ||
              questions[idx].type == "multiselect" ||
              questions[idx].type == "slider" ||
              questions[idx].type == "rating"
            ? questions[idx].options.map((x, id) =>
                questions[idx].options[id].value == "" ||
                questions[idx].options[id].value == null ||
                questions[idx].options[id].value == undefined ||
                !questions[idx].options[id].value.trim().length
                  ? optionsArray.push(id)
                  : ""
              )
            : ""
          : ""
      )
    }

    if (optionsArray.length > 0) {
      setIsOptionNull(1)
    } else {
      setIsOptionNull(0)
    }
  }, [questions])

  return (
    <div>
      <MuiThemeProvider theme={theme}>
        <Container className={classes.containerWidth}>
          <Grid container spacing={2}>
            <Grid item xs md={2}>
              <Tooltip
                title={
                  !photo
                    ? t("Drag a photo or tap to select a photo.")
                    : t("Drag a photo to replace the existing photo or tap to delete the photo.")
                }
              >
                <Box
                  {...getRootProps()}
                  width={154}
                  height={154}
                  border={1}
                  borderRadius={4}
                  borderColor={!(isDragActive || isDragAccept || !!photo) ? "text.secondary" : "#fff"}
                  bgcolor={isDragActive || isDragAccept ? "text.secondary" : undefined}
                  color={!(isDragActive || isDragAccept || !!photo) ? "text.secondary" : "#fff"}
                  style={{
                    background: !!photo ? `url(${photo}) center center/contain no-repeat` : undefined,
                  }}
                >
                  <ButtonBase style={{ width: "100%", height: "100%" }} onClick={() => !!photo && setPhoto(undefined)}>
                    {!photo && <input {...getInputProps()} />}
                    <Icon fontSize="large">{!photo ? "add_a_photo" : "delete_forever"}</Icon>
                  </ButtonBase>
                </Box>
              </Tooltip>
            </Grid>
            <Grid item md={10}>
              <Grid container spacing={2}>
                <Grid item lg={4}>
                  <TextField
                    error={typeof studyId == "undefined" || studyId === null || studyId === "" ? true : false}
                    id="filled-select-currency"
                    select
                    label={t("Study")}
                    value={studyId}
                    onChange={(e) => {
                      setStudyId(e.target.value)
                    }}
                    helperText={
                      typeof studyId == "undefined" || studyId === null || studyId === ""
                        ? t("Please select the Study")
                        : ""
                    }
                    variant="filled"
                    disabled={!!value || !!study ? true : false}
                  >
                    {studies.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {t(option.name)}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs>
                  <TextField
                    fullWidth
                    variant="filled"
                    label={t("Survey Title")}
                    defaultValue={text}
                    onChange={(event) => setText(removeExtraSpace(event.target.value))}
                    error={
                      typeof text == "undefined" || text === null || text === "" || !text.trim().length ? true : false
                    }
                    helperText={
                      typeof text == "undefined" || text === null || text === "" || !text.trim().length
                        ? t("Please enter Survey Title")
                        : ""
                    }
                  />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  label={t("Survey Description")}
                  variant="filled"
                  defaultValue={description}
                  onChange={(event) => setDescription(removeExtraSpace(event.target.value))}
                />
              </Grid>
              <Grid item sm={12}>
                <Divider />
                <Typography variant="h6">{t("Configure questions, parameters, and options.")}</Typography>
              </Grid>
              <Grid item>
                <Stepper nonLinear activeStep={activeStep} orientation="vertical">
                  {questions.map((x, idx) => (
                    <QuestionCreator
                      key={`${x.text}-${idx}`}
                      question={x}
                      onChange={(change) =>
                        setQuestions((questions) =>
                          Object.assign(
                            [...questions],
                            {
                              [idx]: change,
                            } /*, setQuestionField(!questions[idx].text || questions[idx].text == undefined || questions[idx].text == null || questions[idx].text=='' || !questions[idx].text.trim().length)*/
                          )
                        )
                      }
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
                      <Typography variant="subtitle2">{t("Add Question")}</Typography>
                    </Grid>
                  </Grid>
                </Stepper>
              </Grid>
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
            <Tooltip title={t("Duplicate this survey instrument and save it with a new title.")}>
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
                      photo: photo,
                    },
                    true /* duplicate */
                  )
                }
                disabled={
                  !onSave ||
                  questions.length === 0 ||
                  !text ||
                  (value.name.trim() === text.trim() && value.study_id === studyId)
                }
              >
                {t("Duplicate")}
                <span style={{ width: 8 }} />
                <Icon>file_copy</Icon>
              </Fab>
            </Tooltip>
          </Grid>
        )}
        <Grid item>
          <Tooltip title={t("Save this survey instrument")}>
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
                    photo: photo,
                  },
                  false /* overwrite */
                )
              }
              disabled={
                !onSave || !text || !text.trim().length || !studyId || questions.length == 0 || isOptionNull == 1
              }
            >
              {t("Save")}
              <span style={{ width: 8 }} />
              <Icon>save</Icon>
            </Fab>
          </Tooltip>
        </Grid>
      </Grid>
    </div>
  )
}
