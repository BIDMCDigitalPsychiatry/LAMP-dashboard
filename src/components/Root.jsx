
// Core Imports
import React, { useState, useEffect } from 'react'
import { Box, Dialog, DialogContent } from '@material-ui/core'
import MaterialTable from 'material-table'
import { useSnackbar } from 'notistack'

// Local Imports
import LAMP from '../lamp'
import CredentialManager from './CredentialManager'
import { ResponsivePaper } from './Utils'

// initial load = not working
// TODO: <EditField researcher={x} /> 

export default function Root({ onChange, ...props }) {
    const [researchers, setResearchers] = useState([])
    //const [names, setNames] = useState({})
    const [passwordChange, setPasswordChange] = useState()
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        if (LAMP.Auth._auth.type !== 'root')
            return
        (async function() {
            setResearchers(await LAMP.Researcher.all())
        })()
    }, [])

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
                        onError={err => enqueueSnackbar(err, { variant: 'error' })}
                    />
                </DialogContent>
            </Dialog>
        </React.Fragment>
    )
}
