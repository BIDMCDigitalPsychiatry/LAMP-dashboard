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
  makeStyles,
  Theme,
  createStyles,
} from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { useSnackbar } from "notistack"
import ActivityHeader from "./ActivityHeader"
import ActivityFooter from "./ActivityFooter"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    containerWidth: { maxWidth: 1055 },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
    mw175: { minWidth: 250 },
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
                {t("Short Answer")}
              </Button>
              <Button color={type === "rating" ? "primary" : "default"} onClick={() => setType("rating")}>
                {t("Rating")}
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
const removeExtraSpace = (s) => s?.trim().split(/ +/).join(" ")
export default function SurveyCreator({
  value,
  onSave,
  onCancel,
  studies,
  study,
  details,
  activities,
  ...props
}: {
  value?: any
  onSave?: Function
  onCancel?: Function
  studies?: any
  study?: string
  details?: any
  activities?: any
}) {
  const classes = useStyles()
  const [activeStep, setActiveStep] = useState(0)
  const [questions, setQuestions] = useState(!!value ? value.settings : [])
  const { t } = useTranslation()
  const { enqueueSnackbar } = useSnackbar()

  const [data, setData] = useState({
    id: value?.id ?? undefined,
    name: !!value ? value.name : undefined,
    spec: "lamp.survey",
    schedule: [],
    description: !!value ? value?.description : undefined,
    photo: !!value ? value?.photo : null,
    settings: !!value ? value.settings : [],
    studyID: !!value ? value.study_id : study,
  })

  const [isOptionNull, setIsOptionNull] = useState(0)

  useEffect(() => {
    setData({ ...data, settings: questions })
  }, [questions])

  const handleChange = (details) => {
    setData({
      id: value?.id ?? undefined,
      name: details.text ?? "",
      spec: "lamp.survey",
      schedule: [],
      settings: questions,
      description: details.description,
      photo: details.photo,
      studyID: details.studyId,
    })
  }

  const validate = () => {
    let duplicates = []
    if (typeof data.name !== "undefined" && data.name?.trim() !== "") {
      duplicates = activities.filter(
        (x) =>
          (!!value
            ? x.name?.toLowerCase() === data?.name?.trim().toLowerCase() && x.id !== value?.id
            : x.name?.toLowerCase() === data?.name?.trim().toLowerCase()) && data.studyID === x.study_id
      )
      if (duplicates.length > 0) {
        enqueueSnackbar(t("Activity with same name already exist."), { variant: "error" })
      }
    }
    return !(
      duplicates.length > 0 ||
      typeof data.name === "undefined" ||
      (typeof data.name !== "undefined" && data.name?.trim() === "") ||
      data.studyID === null ||
      data.studyID === "" ||
      !validateQuestions()
    )
  }

  const validateQuestions = () => {
    let status = 0
    if (!!questions && questions.length > 0) {
      let optionsArray = []
      {
        questions.map((x, idx) =>
          questions[idx].type === "list" ||
          questions[idx].type === "multiselect" ||
          questions[idx].type === "slider" ||
          questions[idx].type === "rating"
            ? questions[idx].options === null || (!!questions[idx].options && questions[idx].options.length === 0)
              ? optionsArray.push(1)
              : (questions[idx].options || []).filter((i) => !!i && i?.value?.trim().length > 0).length > 0
              ? optionsArray.push(0)
              : optionsArray.push(1)
            : optionsArray.push(0)
        )
      }
      if (optionsArray.filter((val) => val !== 0).length > 0) {
        setIsOptionNull(1)
        status = 1
        return false
      } else {
        status = 0
        setIsOptionNull(0)
      }
    }
    if (questions.length === 0 || questions.filter((val) => !!val.text && val.text?.trim().length !== 0).length === 0) {
      return false
    } else if (
      questions.filter((q) => ["list", "multiselect", "slider", "rating"].includes(q.type)).length > 0 &&
      status === 1
    ) {
      return false
    }
    return true
  }

  const checkAndSave = (data, isDuplicate) => {
    if (questions.length === 0 || questions.filter((val) => !!val.text && val.text?.trim().length !== 0).length === 0) {
      enqueueSnackbar(t("At least one question required."), { variant: "error" })
    } else if (
      questions.filter((q) => ["list", "multiselect", "slider", "rating"].includes(q.type)).length > 0 &&
      isOptionNull === 1
    ) {
      enqueueSnackbar(t("At least one option required for list/slider/rating/multiselect type questions."), {
        variant: "error",
      })
    } else {
      onSave(data, isDuplicate)
    }
  }

  return (
    <div>
      <Container className={classes.containerWidth}>
        <Grid container spacing={2}>
          <ActivityHeader
            studies={studies}
            value={value}
            details={details}
            activitySpecId={null}
            study={data.studyID}
            onChange={handleChange}
            image={null}
          />
          <Grid item sm={12}>
            <Divider />
            <Typography variant="h6">{t("Configure questions, parameters, and options.")}</Typography>
          </Grid>
          <Grid item>
            <Stepper nonLinear activeStep={activeStep} orientation="vertical">
              {questions?.map((x, idx) => (
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
              <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="center"
                className={classes.mw175}
                spacing={2}
              >
                <Grid item>
                  <Box ml={-1}>
                    <Fab
                      size="small"
                      color="primary"
                      onClick={() => {
                        setQuestions((questions) => (!!questions ? [...questions, {}] : []))
                        setActiveStep(!!questions ? questions.length : 0)
                      }}
                    >
                      <Icon fontSize="small">add_circle</Icon>
                    </Fab>
                  </Box>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle2">{t("Add Question")}</Typography>
                </Grid>
              </Grid>
            </Stepper>
          </Grid>
        </Grid>
      </Container>
      <ActivityFooter onSave={checkAndSave} validate={validate} value={value} data={data} />
    </div>
  )
}
