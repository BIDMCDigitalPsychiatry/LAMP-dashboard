// Core Imports
import React, { useState, useEffect } from "react"
import { Box, Divider, Switch, Typography, Tabs, Tab } from "@material-ui/core"

// Local Imports
import LAMP from "../lamp"
import ParticipantList from "./ParticipantList"
import ActivityList from "./ActivityList"
import { ResponsivePaper } from "./Utils"

function Study({ study, onParticipantSelect, ...props }) {
  const [showUnscheduled, setShowUnscheduled] = useState(false)
  const [currentTab, setCurrentTab] = useState(0)
  return (
    <React.Fragment>
      <Box mb="16px" style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5" color="inherit"></Typography>
        <Box>
          <Typography variant="overline">Show Unscheduled Activities</Typography>
          <Switch
            size="small"
            checked={showUnscheduled}
            onChange={() => setShowUnscheduled((showUnscheduled) => !showUnscheduled)}
          />
        </Box>
      </Box>
      <ResponsivePaper elevation={4}>
        <Tabs
          value={currentTab}
          onChange={(event, newTab) => setCurrentTab(newTab)}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Patients" />
          <Tab label="Activities" />
        </Tabs>
        <Divider />
        {currentTab === 0 && (
          <ParticipantList
            title={study.name}
            studyID={study.id}
            showUnscheduled={showUnscheduled}
            onParticipantSelect={onParticipantSelect}
          />
        )}
        {currentTab === 1 && <ActivityList title={study.name} studyID={study.id} />}
      </ResponsivePaper>
    </React.Fragment>
  )
}

export default function Researcher({ researcher, onParticipantSelect, ...props }) {
  const [studies, setStudies] = useState([])
  useEffect(() => {
    LAMP.Study.allByResearcher(researcher.id).then(setStudies)
  }, [])
  return studies.map((study) => <Study study={study} onParticipantSelect={onParticipantSelect} />)
}
