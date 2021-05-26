import { anyError, anyErrorSecond, isEmpty, objArray, setError } from "../../../../helpers"

export const optionTypes = ["list", "multiselect", "slider", "rating"] // Declare the various types which utilize options

export const validateQuestions = ({ questions }) => {
  var errors = {}
  const keys = Object.keys(questions)
  keys.forEach((k) => {
    const { text = "", type, options = undefined } = questions[k]

    if (isEmpty(text.trim())) {
      setError(errors, k, "text", "Required")
    }

    if (optionTypes.includes(type)) {
      // Validate that options present
      if (isEmpty(options) || options.length <= 0) {
        setError(errors, k, "options", "Invalid options") // Flag invalid options for associated index
      } else if (options.filter((o) => isEmpty(o)).length > 0) {
        setError(errors, k, "options", "Invalid option, cannot be empty.") // Flag invalid options for associated index
      }
    }
  })
  return errors
}
export const validateDetails = ({ details }) => {
  var errors = {}

  const { text = "", studyId = "" } = details

  if (isEmpty(text.trim())) {
    errors["text"] = "Required"
  }

  if (isEmpty(studyId.trim())) {
    errors["studyId"] = "Required"
  }

  return errors
}

export const defaultData = ({ value, study }) => ({
  id: value?.id ?? undefined,
  name: !!value ? value.name : undefined,
  spec: "lamp.survey",
  schedule: [],
  description: !!value ? value?.description : undefined,
  photo: !!value ? value?.photo : null,
  settings: !!value ? value.settings : [],
  studyID: !!value ? value.study_id : study,
})

export const buildData = ({ value, study, questions, details }) => {
  return {
    ...defaultData({ value, study }),
    settings: objArray(questions),
    description: details.description,
    photo: details.photo,
    name: details.text,
    studyID: details.studyId,
  }
}

export const isAnyError = ({ questions, details }) => {
  const questionErrors = validateQuestions({ questions })
  const detailsErrors = validateDetails({ details })
  return anyError(detailsErrors) || anyErrorSecond(questionErrors)
}
