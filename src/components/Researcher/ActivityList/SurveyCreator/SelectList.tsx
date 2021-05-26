// Core Imports
import React, { useState, useEffect } from "react"
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
import { useTranslation } from "react-i18next"

const removeExtraSpace = (s) => s.trim().split(/ +/).join(" ")

export default function SelectList({ checkbox, type, value, onChange }) {
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
