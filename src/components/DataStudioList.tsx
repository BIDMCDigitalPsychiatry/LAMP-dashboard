import React from "react"
import { makeStyles, Grid, Paper, Button, Box, IconButton } from "@material-ui/core"
import MaterialTable from "material-table"
import CloseIcon from "@material-ui/icons/Close"
import AspectRatioIcon from "@material-ui/icons/AspectRatio"
import { useSnackbar } from "notistack"
import { useConfirm } from "material-ui-confirm"
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles((theme) => ({
  chartwrapperHeader: { padding: 10, marginBottom: 20, borderBottom: "#f0f0f0 solid 1px" },
  databtn: { backgroundColor: "#4696eb", textTransform: "capitalize", paddingRight: 12, "& span": { marginLeft: 0 } },
}))

export default function DataStudioList(props) {
  const confirm = useConfirm()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const classes = useStyles()
  const [maximized, setMaximized] = React.useState(false)

  const templateId = JSON.parse(localStorage.getItem("template_id"))
  const templateData = templateId != null ? JSON.parse(localStorage.getItem("template_" + templateId.id)) : null

  const [columns, setColumns]: any = React.useState([
    { title: "Name", field: "name" },
    { title: "Study Id", field: "study_id", initialEditValue: "U987654123" },
    { title: "Phone", field: "phone" },
    { title: "Gender", field: "gender", initialEditValue: 1, lookup: { 1: "Male", 2: "Female" } },
  ])

  const [data, setData] = React.useState([
    { name: "Demo User 01", study_id: "U123456789", phone: "+44-1123567890", gender: 1 },
    { name: "Demo User 02", study_id: "U123456791", phone: "+1-1234567", gender: 2 },
    { name: "Demo User 03", study_id: "U123456792", phone: "+1-1123788", gender: 1 },
    { name: "Demo User 04", study_id: "U123456793", phone: "+1-4567890", gender: 2 },
    { name: "Demo User 05", study_id: "U123456794", phone: "+44-1456320789", gender: 1 },
    { name: "Demo User 06", study_id: "U123456795", phone: "+44-1123789654", gender: 2 },
    { name: "Demo User 07", study_id: "U123456796", phone: "+1-1547896", gender: 1 },
    { name: "Demo User 08", study_id: "U123456797", phone: "+44-1024025678", gender: 2 },
    { name: "Demo User 09", study_id: "U123456798", phone: "+1-4556897", gender: 1 },
    { name: "Demo User 10", study_id: "U123456799", phone: "+1-4440123", gender: 2 },
    { name: "Demo User 11", study_id: "U123456800", phone: "+1-4869854", gender: 2 },
  ])

  // handle table list data
  const handleTableListingData = () => {
    if (templateData == null) {
      return props.tableListData(data)
    } else {
      if (templateData.listing != null) {
        if (templateData.listing.length > 0) {
          let listDataArray = templateData.listing
          return setData(listDataArray)
        }
      } else {
        return props.tableListData(data)
      }
    }
  }

  React.useEffect(() => handleTableListingData(), [])

  // Update local storage data
  const updateLocalStorageData = (userData) => {
    if (userData.length > 0) {
      templateData.listing = userData
      localStorage.setItem("template_" + templateId.id, JSON.stringify(templateData))
    }
  }

  // remove Table listing
  const removeTableListing = () => {
    confirm({
      title: ``,
      description: `Are you sure you want to delete this?`,
      confirmationText: `Yes`,
      cancellationText: `No`,
    })
    .then(() => {
      let templateData = templateId != null ? JSON.parse(localStorage.getItem("template_" + templateId.id)) : null
      let listData = templateData
      delete listData.listing
      localStorage.setItem("template_" + templateId.id, JSON.stringify(listData))
      props.delListingSelectionElement("listing")
      enqueueSnackbar("Successfully deleted the item.", {
        variant: "success",
        action: (key) => (
          <Button style={{ color: "#fff" }} onClick={() => closeSnackbar(key)}>
            Dismiss
          </Button>
        ),
      })
    })
    .catch((e) => {
      if (e !== undefined) {
        enqueueSnackbar("An error has been occured while deleting the data.", {
          variant: "error",
          action: (key) => (
            <Button style={{ color: "#fff" }} onClick={() => closeSnackbar(key)}>
              Dismiss
            </Button>
          ),
        })
      }
    })
  }

  // Maximize the component
  const maximizeComponent = () => {
    (maximized === true) ? setMaximized(false) : setMaximized(true) ;
  }

  return (
    <React.Fragment>
      <Grid item xs={12} sm={6} lg={ maximized ? 12 : 6}>
        <Paper>
          <Grid item>
            <Box className={classes.chartwrapperHeader}>
              <Grid container alignItems="center">
                <Grid item xs>
                  <Box display="flex" justifyContent="flex-end">
								    <Tooltip title="Maximize">
                      <IconButton aria-label="Maximize" onClick={maximizeComponent}>
                        <AspectRatioIcon />
                      </IconButton>
								    </Tooltip>
							    	<Tooltip title="Close">
                      <IconButton aria-label="Close" onClick={removeTableListing}>
                        <CloseIcon />
                      </IconButton>
								    </Tooltip>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <MaterialTable
              title="Patients"
              columns={columns}
              data={data}
              editable={{
                onRowAdd: (newData) =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      setData([...data, newData])
                      updateLocalStorageData([...data, newData])
                      resolve()
                    }, 1000)
                  }),
                onRowUpdate: (newData, oldData: any) =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      const dataUpdate = [...data]
                      const index = oldData.tableData.id
                      dataUpdate[index] = newData
                      setData([...dataUpdate])
                      updateLocalStorageData(dataUpdate)
                      resolve()
                    }, 1000)
                  }),
                onRowDelete: (oldData: any) =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      const dataDelete = [...data]
                      const index = oldData.tableData.id
                      dataDelete.splice(index, 1)
                      setData([...dataDelete])
                      updateLocalStorageData(dataDelete)
                      resolve()
                    }, 1000)
                  }),
              }}
              options={{
                actionsColumnIndex: -1,
              }}
            />
          </Grid>
        </Paper>
      </Grid>
    </React.Fragment>
  )
}