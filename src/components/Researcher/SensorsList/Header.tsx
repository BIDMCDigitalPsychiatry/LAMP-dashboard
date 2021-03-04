import React from "react"
import { Box } from "@material-ui/core"
import StudyFilter from "../ParticipantList/StudyFilter"
import AddSensor from "./AddSensor"

export default function Header({ studies, researcher, ...props }) {
  const updateDataSensor = () => {
    console.log(600, props)
    props.updateDataSensor(true)
  }

  return (
    <Box>
      <StudyFilter researcher={researcher} studies={studies} type="participants" />
      <AddSensor studies={studies} updateDataSensor={updateDataSensor} />
    </Box>
  )
}
