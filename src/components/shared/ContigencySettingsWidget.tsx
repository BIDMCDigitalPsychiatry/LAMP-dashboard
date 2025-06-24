import { makeStyles, Button, Box, Checkbox, Radio, TextField, Icon, Select, MenuItem } from "@material-ui/core"
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Service } from "../DBService/DBService"
import { sortData } from "../Researcher/Dashboard"
import { FormControl } from "@mui/material"

const useStyles = makeStyles((theme) => ({
  checkbox: { display: "inline-block", position: "relative" },
  addActivityBtn: {
    backgroundColor: "#2196f3",
    color: "white",
    "&:hover": {
      backgroundColor: "#0b69b3",
    },
    "& span": {
      marginRight: 16,
    },
  },
}))

const SurveyContingency = (props) => {
  const classes = useStyles()
  const { t } = useTranslation()

  console.log("SurveyContingency widget rendered")

  const { value } = props
  const [isChecked, setIsChecked] = useState(false)
  const [selectedOption, setSelectedOption] = useState("")
  const [activities, setActivities] = useState(null)
  const [addActivity, setAddActivity] = useState(false)
  const [open, setOpen] = useState(false) // state to control the Select open/close
  const [selectedActivity, setSelectedActivity] = useState<any>(null) // state to store the selected activity

  // Handles checkbox state change
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked)
    setSelectedOption("") // Reset the radio selection when checkbox is toggled
  }

  useEffect(() => {
    Service.getAll("studies").then((studies) => {
      Service.getDataByKey("activities", [studies[0].name], "study_name").then((activities) => {
        let result = sortData(activities, [studies[0].name], "name")
        setActivities(result)
      })
    })
  }, [])

  // Handles radio button selection change
  const handleRadioChange = (e) => {
    setSelectedOption(e.target.value)
    props.onChange({ ...value, contigencyType: e.target.value })
    setAddActivity(false)
  }

  const handleChange = (e) => {
    props.onChange({ ...value, questionIndex: e.target.value })
  }

  // Function to handle selecting an activity
  const handleSelectChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedId = event.target.value
    const selectedActivity = activities.find((activity) => activity.id === selectedId)
    setSelectedActivity(selectedActivity) // Set the selected activity
    setOpen(false) // Close the dropdown after selection
  }

  return (
    <Box>
      <label>
        <Checkbox checked={isChecked} onChange={handleCheckboxChange} name="enable-contigency" />
        Enable survey contingency on survey response
      </label>

      {isChecked && (
        <Box>
          <Box>
            <label>
              <Radio value="Question" checked={selectedOption === "Question"} onChange={handleRadioChange} />
              Question
            </label>
            <label>
              <Radio value="Activity" checked={selectedOption === "Activity"} onChange={handleRadioChange} />
              Activity
            </label>
          </Box>

          {selectedOption === "Question" && (
            <Box mt={2} ml={2}>
              <TextField label="Number:" variant="outlined" type="number" onChange={handleChange} />
            </Box>
          )}

          {selectedOption === "Activity" && (
            <Box display="flex" justifyContent="flex-start" mt={2} width={1}>
              <Button
                type="button"
                onClick={() => {
                  setAddActivity(true)
                  setOpen(!open)
                }}
                variant="contained"
                className={classes.addActivityBtn}
              >
                <Icon>add_circle_icon</Icon>
                {`${t("Add Activity")}`}
              </Button>
              {addActivity ? (
                <FormControl variant="standard" sx={{ m: 1, minWidth: 150 }}>
                  <Select
                    labelId="select-activity"
                    id="select-activity-id"
                    open={open}
                    value={selectedActivity ? selectedActivity.id : ""}
                    onOpen={() => setOpen(true)} // Open when user clicks dropdown
                    onClose={() => setOpen(false)} // Close when user clicks outside
                    onChange={handleSelectChange} // Handle activity selection
                    label="Activity"
                  >
                    <MenuItem value={null}>Select</MenuItem>
                    {activities && activities.length > 0 ? (
                      activities.map((activity: any) => (
                        <MenuItem key={activity.id} value={activity.id}>
                          {activity.name || "Unnamed Activity"}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value={null}>No Activities Available</MenuItem>
                    )}
                  </Select>
                </FormControl>
              ) : null}
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}

export default SurveyContingency
