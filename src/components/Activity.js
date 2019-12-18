
// Core Imports
import React, { useState } from 'react'
import Box from '@material-ui/core/Box'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

// Local Imports
import ActivityScheduler from './ActivityScheduler'
import SurveyCreator from './SurveyCreator'
import { ResponsivePaper } from '../components/Utils'

export default function Activity({ activity, studyID,  ...props }) {
    //const isGroup = ((activity || {}).spec) === 'lamp.group'
    const isSurvey = ((activity || {}).spec) === 'lamp.survey'
    const [currentTab, setCurrentTab] = useState(isSurvey ? 0 : 1)
	return (
        <ResponsivePaper elevation={4}>
            <Tabs
                value={currentTab}
                onChange={(event, newTab) => setCurrentTab(isSurvey ? newTab : 1)}
                indicatorColor="primary"
                textColor="primary"
                centered
            >
                <Tab label="Settings" />
                <Tab label="Schedules" />
            </Tabs>
            {currentTab === 0 && isSurvey && <Box m={4}><SurveyCreator value={activity} /></Box>}
            {currentTab === 1 && <ActivityScheduler activity={activity} />}
        </ResponsivePaper>
    )
}
