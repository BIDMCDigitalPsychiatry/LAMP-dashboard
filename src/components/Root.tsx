// Core Imports
import React, { useState, useEffect } from "react"
import { Box, Dialog, DialogContent } from "@material-ui/core"
import MaterialTable from "material-table"
import { useSnackbar } from "notistack"

// Local Imports
import LAMP from "lamp-core"
import { CredentialManager } from "./CredentialManager"
import { ResponsivePaper } from "./Utils"
import { useTranslation } from "react-i18next";

// initial load = not working
// TODO: <EditField researcher={x} />

export default function Root({ ...props }) {
  const [researchers, setResearchers] = useState([])
  //const [names, setNames] = useState({})
  const [passwordChange, setPasswordChange] = useState<boolean>()
  const { enqueueSnackbar } = useSnackbar()
	const { t, i18n } = useTranslation();  
  const languagesArray = [{key: "en_US", value: "English - United States", lang_array: ["en", "en-US", "en-us"]}, 
                            {key: "hi_IN", value: "Hindi - India", lang_array: ["hi", "hi-IN", "hi-in"]},
                           {key: "fr_US", value: "French", lang_array: []}]

  const getSelectedLanguage = () => {    
    let lang = languagesArray.filter((x) =>{
      return x.lang_array.includes(navigator.language)  
    })
    return lang
  }  

  useEffect(() => {
    if (LAMP.Auth._type !== "admin") return
    LAMP.Researcher.all().then(setResearchers)
  }, [])

  useEffect(() => {
    let authId = LAMP.Auth._auth.id
    let language = !!localStorage.getItem("LAMP_user_"+ authId)
                  ? JSON.parse(localStorage.getItem("LAMP_user_"+ authId)).language
                  : (getSelectedLanguage().length > 0) ? getSelectedLanguage()[0].key
                  : "en_US"
    i18n.changeLanguage(language);  
  }, [])
  
  return (
    <React.Fragment>
      <ResponsivePaper elevation={4}>
        <MaterialTable
          title={t("Researchers")}
          data={researchers}
          columns={[{ title: t("Name"), field: "name" }]}
          onRowClick={(event, rowData, togglePanel) =>
            props.history.push(`/researcher/${researchers[rowData.tableData.id].id}`)
          }
          editable={{
            onRowAdd: async (newData) => {
              if (((await LAMP.Researcher.create(newData)) as any).error === undefined)
                enqueueSnackbar(t("Successfully created a new Researcher."), {
                  variant: "success",
                })
              else
                enqueueSnackbar(t("Failed to create a new Researcher."), {
                  variant: "error",
                })
              setResearchers(await LAMP.Researcher.all())
            },
            onRowUpdate: async (newData, oldData) => {
              if (((await LAMP.Researcher.update(oldData.id, newData)) as any).error === undefined)
                enqueueSnackbar(t("Successfully updated the Researcher."), {
                  variant: "success",
                })
              else
                enqueueSnackbar(t("Failed to update the Researcher."), {
                  variant: "error",
                })
              setResearchers(await LAMP.Researcher.all())
            },
            onRowDelete: async (oldData) => {
              if (((await LAMP.Researcher.delete(oldData.id)) as any).error === undefined)
                enqueueSnackbar(t("Successfully deleted the Researcher."), {
                  variant: "success",
                })
              else
                enqueueSnackbar(t("Failed to delete the Researcher."), {
                  variant: "error",
                })
              setResearchers(await LAMP.Researcher.all())
            },
          }}
          actions={[
            {
              icon: "vpn_key",
              tooltip: t("Manage Credentials"),
              onClick: (event, rowData) => setPasswordChange(rowData.id),
            },
          ]}
          localization={{
            header: {
                actions: t('Actions')
            },
            body: {
              emptyDataSourceMessage: t("No Researchers. Add Researchers by clicking the [+] button above."),
              editRow: {
                deleteText: t("Are you sure you want to delete this Researcher?"),
              },
            },
          }}
          options={{
            actionsColumnIndex: -1,
            pageSize: 10,
            pageSizeOptions: [10, 25, 50, 100],
          }}
          components={{ Container: (props) => <Box {...props} /> }}
        />
      </ResponsivePaper>
      <Dialog open={!!passwordChange} onClose={() => setPasswordChange(undefined)}>
        <DialogContent style={{ marginBottom: 12 }}>
          <CredentialManager id={passwordChange} />
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}
