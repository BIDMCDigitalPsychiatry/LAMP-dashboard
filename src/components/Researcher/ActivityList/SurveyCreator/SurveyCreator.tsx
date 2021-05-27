// Core Imports
import React, { useState } from "react"
import { Typography, Grid, Divider, Container, makeStyles, Theme, createStyles } from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { useSnackbar } from "notistack"
import ActivityFooter from "../ActivityFooter"
import QuestionStepper from "./QuestionStepper"
import { reduceArrayObject, anyErrorSecond } from "../../../../helpers"
import { buildData, isAnyError, validateQuestions } from "./helpers"
import ActivityHeader from "../ActivityHeader"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    containerWidth: { maxWidth: 1055 },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
    mw175: { minWidth: 175 },
  })
)

export default function SurveyCreator({
  value,
  onSave,
  onCancel,
  studies,
  study,
  details: Details = {},
  activities,
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
  const [questions, setQuestions] = useState(reduceArrayObject(value?.settings ?? []))
  const [details, setDetails] = useState(Details ?? {})

  const data = buildData({ value, study, questions, details })

  const handleChangeQuestion = React.useCallback(
    (id) => (key, value) => {
      setQuestions((prev) => ({ ...prev, [id]: { ...prev[id], [key]: value } }))
    },
    [setQuestions]
  )

  const handleRemoveQuestion = React.useCallback(
    (id) => {
      setQuestions((prev) =>
        reduceArrayObject(
          Object.keys(prev)
            .filter((k) => k !== id)
            .map((k) => prev[k])
        )
      )
    },
    [setQuestions]
  )

  const { t } = useTranslation()
  const { enqueueSnackbar } = useSnackbar()

  const validate = () => {
    let duplicates = []
    if (typeof details.name !== "undefined" && details.name?.trim() !== "") {
      duplicates = activities.filter(
        (x) =>
          (!!value
            ? x.name?.toLowerCase() === details?.name?.trim().toLowerCase() && x.id !== value?.id
            : x.name?.toLowerCase() === details?.name?.trim().toLowerCase()) && details.studyID === x.study_id
      )
      if (duplicates.length > 0) {
        enqueueSnackbar(t("Activity with same name already exist."), { variant: "error" })
      }
    }

    return duplicates.length <= 0 && !isAnyError({ details, questions })
  }

  const checkAndSave = (data, isDuplicate) => {
    const questionErrors = validateQuestions({ questions })
    if (
      questions.length === 0 ||
      Object.keys(questions).filter((k) => !!questions[k].text && questions[k].text?.trim().length !== 0).length === 0
    ) {
      enqueueSnackbar(t("At least one question required."), { variant: "error" })
    } else if (anyErrorSecond(questionErrors, "options")) {
      enqueueSnackbar(t("At least one option required for list/slider/rating/multiselect type questions."), {
        variant: "error",
      })
    } else {
      onSave({ ...data }, isDuplicate) // Create copy of the data object to isolate external modifications
    }
  }

  return (
    <div>
      <Container className={classes.containerWidth}>
        <Grid container spacing={2}>
          <ActivityHeader studies={studies} study={study} value={value} details={details} onChange={setDetails} />
          <Grid item sm={12}>
            <Divider />
            <Typography variant="h6">{t("Configure questions, parameters, and options.")}</Typography>
          </Grid>
          <Grid item>
            {<QuestionStepper questions={questions} onChange={handleChangeQuestion} onRemove={handleRemoveQuestion} />}
          </Grid>
        </Grid>
      </Container>
      <ActivityFooter onSave={checkAndSave} validate={validate} value={value} data={data} />
    </div>
  )
}
