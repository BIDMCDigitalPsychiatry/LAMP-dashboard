import React from "react"
import { Box } from "@material-ui/core"
import StudyFilter from "../ParticipantList/StudyFilter"
import AddSensor from "./AddSensor"

export default function Header({ studies, researcher, ...props }) {
  return (
    <Box>
      <StudyFilter researcher={researcher} studies={studies} type="participants" />
      <AddSensor studies={studies} />
    </Box>
  )
}
