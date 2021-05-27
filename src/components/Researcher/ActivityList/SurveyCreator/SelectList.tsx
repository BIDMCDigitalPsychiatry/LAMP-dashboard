// Core Imports
import React from "react"
import {
  Tooltip,
  Typography,
  IconButton,
  Icon,
  TextField,
  InputAdornment,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormGroup,
  Checkbox,
} from "@material-ui/core"
import { isEmpty } from "../../../../helpers"
import { useTranslation } from "react-i18next"

export default function SelectList({ checkbox, type, options: Options = [], onChange }) {
  const options = isEmpty(Options) ? [] : Options // Data provider is passing null for empty values, so default both null and undefine to empty []

  // Toggle certain components/icons between Checkbox/Radio variants.
  const TypeGroup = checkbox ? FormGroup : RadioGroup
  const TypeComponent = checkbox ? Checkbox : Radio
  const AddIcon = checkbox ? "add_box" : "add_circle"
  const CheckedIcon = checkbox ? "check_box" : "radio_button_checked"
  const UncheckedIcon = checkbox ? "check_box_outline_blank" : "radio_button_unchecked"
  const { t } = useTranslation()

  const handleChange = (idx, key) => (event) => {
    const newVal = [...options]
    newVal[idx] = {
      ...newVal[idx],
      [key]: event?.target?.value,
    }
    onChange(newVal)
  }

  const handleDelete = (idx) => () => {
    onChange([...options.slice(0, idx), ...options.slice(idx + 1)])
  }

  const handleAdd = () => {
    onChange([...options, ""])
  }

  return (
    <React.Fragment>
      <TypeGroup name="option">
        {options.map((option, idx) => {
          var { value = "", description = "" } = option
          return (
            <FormControlLabel
              key={idx}
              value={value}
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
                    value={value}
                    label={t("Question Option")}
                    error={isEmpty(value)}
                    helperText={isEmpty(value) ? t("Please enter Option") : ""}
                    onChange={handleChange(idx, "value")}
                    type={type === "slider" || type === "rating" ? "number" : "text"}
                    InputProps={{
                      endAdornment: [
                        <InputAdornment position="end" key="adornment">
                          <Tooltip title={t("Delete this option from the question's list of options.")}>
                            <IconButton edge="end" aria-label="delete" onClick={handleDelete(idx)}>
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
                    label={t("Option Description")}
                    value={description}
                    onChange={handleChange(idx, "description")}
                  />
                </React.Fragment>
              }
              labelPlacement="end"
            />
          )
        })}
        <FormControlLabel
          control={
            <TypeComponent
              checked
              color="primary"
              onClick={handleAdd}
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
