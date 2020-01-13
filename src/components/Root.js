
// Core Imports
import React, { useState, useEffect } from 'react'
import Box from '@material-ui/core/Box'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import MaterialTable from 'material-table'

// Local Imports
import LAMP from '../lamp'
import CredentialManager from './CredentialManager'
import { ResponsivePaper } from './Utils'

// initial load = not working


export default function Root({ onChange, ...props }) {
    const [researchers, setResearchers] = useState([])
    //const [names, setNames] = useState({})
    const [passwordChange, setPasswordChange] = useState()

    useEffect(() => {
        if (LAMP.Auth._auth.type !== 'root')
            return
        (async function() {
            setResearchers(await LAMP.Researcher.all())
        })()
    }, [])

    /*
    useEffect(() => {
        (async function() {
            let data = (await Promise.all(researchers
                            .map(async x => ({ id: x.id, res: await LAMP.Type.getAttachment(x.id, 'lamp.name') }))))
                            .filter(y => y.res.error === undefined && (typeof y.res.data === 'string') && y.res.data.length > 0)
            setNames(names => data.reduce((prev, curr) => ({ ...prev, [curr.id]: curr.res.data }), names))
        })()
    }, [researchers])
    render: (x) => 
    <EditField 
        text={names[x.id]} 
        defaultValue={x.id}
        onChange={newValue => {
            let id = x.id /* shadow copy /
            let oldValue = names[id] || id
            if (oldValue === newValue)
                return
            let isStr = (typeof newValue === 'string') && newValue.length > 0

            LAMP.Type.setAttachment(id, 'me', 'lamp.name', isStr ? newValue : null)
                .then(x => setNames(names => ({ ...names, [id]: isStr ? newValue : undefined })))
                .then(x => onChange())
                .catch(err => {
                    console.error(err)
                    setNames(names => ({ ...names, [id]: oldValue }))
                })
        }} 
    /> 
    */

	return (
        <React.Fragment>
            <ResponsivePaper elevation={4}>
                <MaterialTable 
                    title="Researchers"
                    data={researchers} 
                    columns={[{ title: 'Name', field: 'name' }]}
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
                    actions={[
                        {
                            icon: 'vpn_key',
                            tooltip: 'Manage Credentials',
                            onClick: (event, rowData) => setPasswordChange(rowData.id)
                        }
                    ]}
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
            <Dialog
                open={!!passwordChange}
                onClose={() => setPasswordChange()}
            >
                <DialogContent style={{ marginBottom: 12 }}>
                    <CredentialManager 
                        id={passwordChange} 
                        onError={err => props.layout.showAlert(err)}
                    />
                </DialogContent>
            </Dialog>
        </React.Fragment>
    )
}
