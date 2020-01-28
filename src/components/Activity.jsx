
// Core Imports
import React, { useState, useEffect } from 'react'
import { Box, Tabs, Tab } from '@material-ui/core'
import MaterialTable from 'material-table'
import { useSnackbar } from 'notistack'

// Local Imports
import ActivityScheduler from './ActivityScheduler'
import SurveyCreator from './SurveyCreator'
import { ResponsivePaper } from '../components/Utils'

function JewelsSettings({ value, onSave, ...props }) {
    const [settings, setSettings] = useState(value?.settings || {})
    const { enqueueSnackbar } = useSnackbar()
    return (
        <MaterialTable 
            title="Jewels Settings"
            data={Object.entries(settings)} 
            columns={[
                { field: '0', title: 'Parameter', editable: 'never' },
                { field: '1', title: 'Value', editable: 'onUpdate' }
            ]}
            editable={{
                onRowUpdate: async (newData, oldData) => {
                    let newValue = parseInt(newData[1])
                    if (!!newValue && !isNaN(newValue)) {
                        setSettings(settings => ({ ...settings, [newData[0]]: newValue }))
                        onSave({ ...value, settings: { ...settings, [newData[0]]: newValue }})
                        enqueueSnackbar(`Successfully changed the value for the parameter '${newData[0]}'.`, { variant: 'success' })
                    } else { 
                        enqueueSnackbar(`The value for the parameter '${newData[0]}' must be numeric.`, { variant: 'error' })
                    }
                }
            }}
            options={{ 
                actionsColumnIndex: -1,
                search: false, 
                selection: false, 
                showTitle: false, 
                paging: false 
            }}
            components={{ Container: props => <div {...props} /> }}
        />
    )
}

export default function Activity({ activity, studyID, onSave, ...props }) {
    //const isGroup = ((activity || {}).spec) === 'lamp.group'
    const isSurvey = ((activity || {}).spec) === 'lamp.survey'
    const isJewels = ['lamp.jewels_a', 'lamp.jewels_b'].includes((activity || {}).spec)
    const [currentTab, setCurrentTab] = useState((isSurvey || isJewels) ? 0 : 1)
    console.dir(activity)
	return (
        <ResponsivePaper elevation={4}>
            <Tabs
                value={currentTab}
                onChange={(event, newTab) => setCurrentTab((isSurvey || isJewels) ? newTab : 1)}
                indicatorColor="primary"
                textColor="primary"
                centered
            >
                <Tab label="Settings" />
                <Tab label="Schedules" />
            </Tabs>
            {currentTab === 0 && isSurvey && <Box m={4}><SurveyCreator value={activity} onSave={onSave} /></Box>}
            {currentTab === 0 && isJewels && <JewelsSettings value={activity} onSave={onSave} />}
            {currentTab === 1 && <ActivityScheduler activity={activity} />}
        </ResponsivePaper>
    )
}
