
// Core Imports
import React, { useState, useEffect } from 'react'
import Box from '@material-ui/core/Box'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import MaterialTable from 'material-table'

// Local Imports
import ActivityEditor from './ActivityEditor'
import ActivityScheduler from './ActivityScheduler'
import SurveyCreator from './SurveyCreator'
import { 
    ResponsivePaper, 
    timeOnlyDateFormat, 
    dateOnlyDateFormat, 
    fullDateFormat 
} from '../components/Utils'

export default function Activity({ activity, studyID,  ...props }) {
    const isGroup = ((activity || {}).spec) === 'lamp.group'
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
