import React from "react"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import Stepper from "@material-ui/core/Stepper"
import Step from "@material-ui/core/Step"
import StepLabel from "@material-ui/core/StepLabel"
import StepContent from "@material-ui/core/StepContent"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import { Box, Grid, IconButton, InputAdornment, StepButton, TextField, Tooltip } from "@material-ui/core"
import { useTranslation } from "react-i18next"
import QuestionButtons from "./QuestionButtons"
import SelectList from "./SelectList"
import { isEmpty } from "../../../../helpers"
import * as Icons from "@material-ui/icons"

const spacing = 2

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    buttonRemove: {
      background: theme.palette.error.main,
      color: theme.palette.common.white,
      "&:hover": {
        background: theme.palette.error.dark,
      },
    },
    label: {
      color: theme.palette.secondary.main,
    },
    labelActive: {
      fontWeight: 600,
      color: theme.palette.primary.main,
    },
  })
)

const Content = ({ question, onChange }) => {
  const { text, type, description } = question

  const { t } = useTranslation()

  const handleChange = React.useCallback((id) => (event) => onChange(id, event?.target?.value), [onChange])
  const handleDelete = React.useCallback((id) => () => onChange(id, ""), [onChange])
  const handleClick = React.useCallback((id, value) => () => onChange(id, value), [onChange])
  const onChangeValue = React.useCallback((id) => (value) => onChange(id, value), [onChange])

  return (
    <Grid container direction="column" spacing={spacing}>
      <Grid item>
        <TextField
          fullWidth
          variant="outlined"
          label={t("Question Title")}
          error={isEmpty(text)}
          helperText={isEmpty(text) && t("Please enter Question Title")}
          value={question["text"]}
          onChange={handleChange("text")}
          InputProps={{
            endAdornment: [
              <InputAdornment position="end" variant="filled" key="adornment">
                <Tooltip title={t("Delete question from survey instrument.")}>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={handleDelete("text")}
                    onMouseDown={(event) => event.preventDefault()}
                  >
                    <Icons.DeleteForever />
                  </IconButton>
                </Tooltip>
              </InputAdornment>,
            ],
          }}
        />
      </Grid>
      <Grid item>
        <TextField
          fullWidth
          multiline
          label={t("Question Description")}
          variant="filled"
          defaultValue={description}
          value={description}
          onChange={handleChange("description")}
        />
      </Grid>
      <Grid item xs={12}>
        <QuestionButtons type={type} onClick={handleClick} />
      </Grid>
      {["list", "select", "multiselect", "slider", "rating"].includes(type) && (
        <Grid item>
          <Box borderColor="grey.400" border={1} borderRadius={4} p={2}>
            <SelectList
              checkbox={type === "multiselect"}
              type={type}
              options={question["options"]}
              onChange={onChangeValue("options")}
            />
          </Box>
        </Grid>
      )}
    </Grid>
  )
}

export default function QuestionStepper({ questions = {}, onChange, onRemove }) {
  const classes = useStyles()
  const [activeStep, setActiveStep] = React.useState(0)

  const stepCount = Object.keys(questions).length

  const { t } = useTranslation()

  const handleNext = React.useCallback(() => setActiveStep((prev) => prev + 1), [setActiveStep])
  const handleBack = React.useCallback(() => setActiveStep((prev) => prev - 1), [setActiveStep])
  const handleClick = React.useCallback((i) => () => setActiveStep(i), [setActiveStep])
  const handleRemove = React.useCallback((i) => () => onRemove(i), [onRemove])

  const handleAdd = React.useCallback(() => {
    onChange(stepCount)("type", "text") // Create new question at next available index with default type = text
    setActiveStep(stepCount) // Navigate to new question index
  }, [stepCount, setActiveStep, onChange])

  return (
    <div className={classes.root}>
      <Button variant="contained" color="primary" onClick={handleAdd}>
        <Icons.AddCircle fontSize="small" style={{ marginRight: 8 }} />
        {t("Add Question")}
      </Button>

      <Stepper activeStep={activeStep} orientation="vertical">
        {Object.keys(questions).map((k, i) => {
          const question = questions[k]
          const isActive = activeStep === i
          const label = isActive ? `${t("Viewing Question")} ${i + 1}: ${question.text ?? ""}` : question.text
          return (
            <Step key={k}>
              <StepButton style={{ display: "flex", width: "100%" }} onClick={handleClick(i)} disabled={false}>
                <StepLabel style={{ display: "flex", width: "100%", textAlign: "left" }}>
                  <Typography noWrap className={isActive ? classes.labelActive : classes.label}>
                    {isEmpty(label) ? `${t("Question")} ${i + 1} ${t("is empty")}` : label}
                  </Typography>
                </StepLabel>
              </StepButton>
              <StepContent>
                <Box mt={2}>
                  <Content question={question} onChange={onChange(k)} />
                  <Box mt={2}>
                    <Grid container justify="space-between" spacing={spacing}>
                      <Grid item>
                        <Grid container spacing={spacing}>
                          <Grid item>
                            <Button disabled={activeStep === 0} onClick={handleBack}>
                              {t("Back")}
                            </Button>
                          </Grid>
                          {activeStep < stepCount - 1 && (
                            <Grid item>
                              <Button variant="contained" color="primary" onClick={handleNext}>
                                {t("Next")}
                              </Button>
                            </Grid>
                          )}
                        </Grid>
                      </Grid>
                      <Grid item>
                        <Grid container spacing={spacing}>
                          <Grid item>
                            <Button variant="contained" onClick={handleRemove(k)} className={classes.buttonRemove}>
                              <Icons.RemoveCircle fontSize="small" style={{ marginRight: 8 }} />
                              {t("Remove Question")}
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </StepContent>
            </Step>
          )
        })}
      </Stepper>
    </div>
  )
}
