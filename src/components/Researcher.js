
// Core Imports
import React, { useState, useEffect } from 'react'
import Box from '@material-ui/core/Box'
import Divider from '@material-ui/core/Divider'
import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

// Local Imports
import LAMP from '../lamp'
import ParticipantList from './ParticipantList'
import ActivityList from './ActivityList'
import { ResponsivePaper } from './Utils'

export default function Researcher({ researcher, onParticipantSelect, ...props }) {
    const [showUnscheduled, setShowUnscheduled] = useState(false)
    const [currentTab, setCurrentTab] = useState(0)
    const [participants, setParticipants] = useState([])
    const [activities, setActivities] = useState([])
    useEffect(() => {
        LAMP.Participant.allByResearcher(researcher.id).then(setParticipants)
    }, [])
    useEffect(() => {
        LAMP.Activity.allByResearcher(researcher.id).then(setActivities)
    }, [])

    return (
        <React.Fragment>
            <Box mb="16px" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h5" color="inherit">
                     
                </Typography>
                <Box>
                    <Typography variant="inherit" color="inherit">
                        Show Unscheduled Activities
                    </Typography>
                    <Switch 
                        size="small"
                        checked={showUnscheduled} 
                        onChange={() => setShowUnscheduled(showUnscheduled => !showUnscheduled)} 
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
                {currentTab === 0 &&
                    <ParticipantList 
                        title="Default Clinic"
                        participants={participants}
                        studyID={researcher.studies[0]}
                        showUnscheduled={showUnscheduled}
                        onParticipantSelect={onParticipantSelect}
                        onChange={() => LAMP.Participant.allByResearcher(researcher.id).then(setParticipants)}  />
                }
                {currentTab === 1 &&
                    <ActivityList 
                        title="Default Clinic" 
                        activities={activities}
                        studyID={researcher.studies[0]}
                        onChange={() => LAMP.Activity.allByResearcher(researcher.id).then(setActivities)} />
                }
            </ResponsivePaper>
        </React.Fragment>
    )
}
