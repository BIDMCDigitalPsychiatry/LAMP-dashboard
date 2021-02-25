import React from "react"
import { Box } from "@material-ui/core"
import AddActivity from "./AddActivity"
import StudyFilter from "../ParticipantList/StudyFilter"
import ExportActivities from "./ExportActivities"

export default function Header({ researcher, activities, studies, ...props }) {
  return (
    <Box>
      <StudyFilter researcher={researcher} studies={studies} type="activities" />

      <Box py={8} px={4}>
        <AddActivity activities={activities} studies={studies} />
        <ExportActivities activities={activities} />
      </Box>
    </Box>
  )
}
