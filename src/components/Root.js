
// Core Imports
import React, { useState, useEffect } from 'react'
import Box from '@material-ui/core/Box'
import MaterialTable from 'material-table'

// Local Imports
import LAMP from '../lamp'
import EditField from './EditField'
import { ResponsivePaper } from './Utils'

export default function Root({ ...props }) {
    const [researchers, setResearchers] = useState([])
    const [names, setNames] = useState({})
    useEffect(() => {
        (async function() {
            setResearchers(await LAMP.Researcher.all())
        })()
    }, [])

    /*
    useEffect(() => {
        (async function() {
            let data = (await Promise.all(researchers
                            .map(async x => ({ id: x.id, res: await LAMP.Type.getAttachment(x.id, 'lamp.name') }))))
                            .filter(y => y.res.message === undefined && (typeof y.res.data === 'string') && y.res.data.length > 0)
            setNames(names => data.reduce((prev, curr) => ({ ...prev, [curr.id]: curr.res.data }), names))
        })()
    }, [researchers])
    */

    /*
    render: (x) => 
        <EditField 
            text={names[x.id] || x.id} 
            onChange={newValue => {
                let oldValue = names[x.id] || x.id
                if (oldValue == newValue)
                    return

                let isStr = (typeof newValue === 'string') && newValue.length > 0
                setNames(names => ({ ...names, [x.id]: isStr ? newValue : undefined }))
                LAMP.Type.setAttachment(x.id, 'me', 'lamp.name', newValue).catch(err => {
                    console.error(err)
                    setNames(names => ({ ...names, [x.id]: oldValue }))
                })
            }} 
        /> 
    */

	return (
        <ResponsivePaper elevation={4}>
            <MaterialTable 
                title="Researchers"
                data={researchers} 
                columns={[
                    { title: 'Name', field: 'name' },
                    { title: 'Email', field: 'email' }
                ]}
                onRowClick={(event, rowData, togglePanel) => 
                    props.history.push(`/researcher/${researchers[rowData.tableData.id].id}`)}
                editable={{
                    onRowAdd: async (newData) => {
                        console.dir(await LAMP.Researcher.create(newData))
                        setResearchers(await LAMP.Researcher.all())
                    },
                    onRowUpdate: async (newData, oldData) => {
                        console.dir(await LAMP.Researcher.update(oldData.id, newData))
                        setResearchers(await LAMP.Researcher.all())
                    },
                    onRowDelete: async (oldData) => {
                        console.dir(await LAMP.Researcher.delete(oldData.id))
                        setResearchers(await LAMP.Researcher.all())
                    }
                }}
                localization={{
                    body: {
                        emptyDataSourceMessage: 'No Researchers. Add Researchers by clicking the [+] button above.',
                        editRow: { deleteText: 'Are you sure you want to delete this Researcher?' }
                    }
                }}
                options={{
                    actionsColumnIndex: -1,
                    pageSize: 10,
                    pageSizeOptions: [10, 25, 50, 100]
                }}
                components={{ Container: props => <Box {...props} /> }}
            />
        </ResponsivePaper>
    )
}
