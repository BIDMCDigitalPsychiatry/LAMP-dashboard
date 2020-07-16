import React from "react"
import { makeStyles, Grid, Paper, Button, Box, IconButton } from "@material-ui/core"
import { Vega } from "react-vega"
import DataStudioPoints from "./DataStudioPoints"
import ArrowRightIcon from "@material-ui/icons/ArrowRight"
import CloseIcon from "@material-ui/icons/Close"
import AspectRatioIcon from "@material-ui/icons/AspectRatio"
import { useConfirm } from "material-ui-confirm"
import { useSnackbar } from "notistack"
import Dialog from "@material-ui/core/Dialog"
import Tooltip from '@material-ui/core/Tooltip'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  chartwrapperHeader: { padding: 10, marginBottom: 20, borderBottom: "#f0f0f0 solid 1px" },
  databtn: { backgroundColor: "#4696eb", textTransform: "capitalize", paddingRight: 12, "& span": { marginLeft: 0 } },
}))

export default function DataStudioLineChart(props: any) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const confirm = useConfirm()
  const classes = useStyles()
  let specs: any = {}
  let vegaDataArray: any
  const [vegaSpecArray, setVegaSpecArray]: any = React.useState([])
  const [openModal, setOpenModal] = React.useState(false)
  const [itemData, setItemData] = React.useState([])
  const [selItemData, setSelItemData] = React.useState([])
  const [maximized, setMaximized] = React.useState(false)
  const templateId = JSON.parse(localStorage.getItem("template_id"))
  const templateLineData = templateId != null ? JSON.parse(localStorage.getItem("template_" + templateId.id)) : null

  // Remove Line Graph 
  const removeLineGraph = () => {
    confirm({
      title: ``,
      description: `Are you sure you want to delete this?`,
      confirmationText: `Yes`,
      cancellationText: `No`,
    })
      .then(() => {
        let templateData = templateId != null ? JSON.parse(localStorage.getItem("template_" + templateId.id)) : null
        let lineData = templateData
        delete lineData.line_chart
        delete lineData.line_item
        delete lineData.line_selected_item
        localStorage.setItem("template_" + templateId.id, JSON.stringify(lineData))
        setVegaSpecArray([])
        props.delLineSelectionElement("line")
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

  // Line Graph Load 
  const handleLineGraphData = () => {
    if (templateLineData == null) {
      return generateLineChart([])
    } else {
      if (templateLineData.line_chart != null) {
        if (templateLineData.line_chart.data.length > 0) {
          let lineDataArray = templateLineData.line_chart.data[0].values
          return generateLineChart(lineDataArray)
        }
      } else {
        return generateLineChart([])
      }
    }
  }

  React.useEffect(() => handleLineGraphData(), [])

  // Close Data Point Modal
  const handleCloseDataPointModal = () => {
    setOpenModal(false)
  }

  // Close the Modal
  const handleClose = () => {
    setOpenModal(false)
  }

  // Get the Line chart data and load
  const handleDataPoints = (val) => {
    setOpenModal(false)
    generateLineChart(val)
  }

  // Set the Data Item value
  const handleDataItems = (val) => {
    setItemData(val)
  }

  // Set the Selected Data Item value
  const handleDataItemsSel = (val) => {
    setSelItemData(val)
  }
  
  // Open the Modal
  const handelOpenModal = () => {
    setOpenModal(true)
  }

  // Maximize the component
  const maximizeComponent = () => {
    (maximized === true) ? setMaximized(false) : setMaximized(true) ;
    let maxVal = (maximized === true) ? false : true ;
    generateLineChart(vegaSpecArray.data[0].values, maxVal)
  }
  
  //  Line Chart
  const generateLineChart = (dataLineArray, maxVal = false, width = window.innerWidth - (window.innerWidth * 60) / 100) => {
    specs = {
      $schema: "https://vega.github.io/schema/vega/v5.json",
      description: "A basic line chart example.",
      width: (maxVal === true) ? (window.innerWidth - (window.innerWidth * 10) / 100) : width,
      height: 400,      
      autosize: {type: "none", contains: "padding", resize: true}, 
      padding: 40,
      signals: [
        {
          name: "interpolate",
          value: "linear",
        },
      ],
      data: [
        {
          name: "table",
          values: dataLineArray,
        },
      ],
      scales: [
        {
          name: "x",
          type: "point",
          range: "width",
          domain: { data: "table", field: "x" },
        },
        {
          name: "y",
          type: "linear",
          range: "height",
          nice: true,
          zero: true,
          domain: { data: "table", field: "y" },
        },
      ],
      axes: [
        { orient: "bottom", scale: "x" , title: "X-axis"},
        { orient: "left", scale: "y" , title: "Y-axis"},
      ],
      marks: [
        {
          type: "group",
          from: {
            facet: {
              name: "series",
              data: "table",
              groupby: "c",
            },
          },
          marks: [
            {
              type: "line",
              point: true,
              from: { data: "series" },
              encode: {
                enter: {
                  x: { scale: "x", field: "x" },
                  y: { scale: "y", field: "y" },
                },
                hover: {
                  strokeOpacity: { value: 0.5 },
                },
              },
            },
          ],
        },
        {
          type: "symbol",
          from: { data: "table" },
          encode: {
            enter: {
              x: { scale: "x", field: "x" },
              y: { scale: "y", field: "y" },
              size: { value: 200 },
              tooltip: { signal: "{'x-axis ': datum.x, 'y-axis ': datum.y}" },
            },
          },
        },
      ],
    }
    vegaDataArray = specs
    setVegaSpecArray(vegaDataArray)
    props.lineChartSpecArray(vegaDataArray)
  }
  
  return (
    <React.Fragment>
      {vegaSpecArray.length !== 0 ? (
        <Grid item xs={12} md={6} lg={ maximized ? 12 : 6}>
          <Paper>
            <Grid item sm={12}>
              <Box className={classes.chartwrapperHeader}>
                <Grid container alignItems="center">
                  <Grid item xs>
                    <Box display="flex">
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.databtn}
                        onClick={handelOpenModal}
                        endIcon={<ArrowRightIcon />}
                      >
                        Data
                      </Button>
                    </Box>
                  </Grid>
                  <Grid item xs>
                    <Box display="flex" justifyContent="flex-end">
			                <Tooltip title="Maximize">
                        <IconButton aria-label="Maximize" onClick={maximizeComponent}>
                          <AspectRatioIcon />
                        </IconButton>
			                </Tooltip>
			                <Tooltip title="Close">
                        <IconButton aria-label="Close" onClick={removeLineGraph}>
                          <CloseIcon />
                        </IconButton>
			                </Tooltip>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              <Vega data={vegaSpecArray.data} spec={vegaSpecArray} />
              <Dialog open={openModal} maxWidth="md" onClose={handleClose} aria-labelledby="customized-dialog-title">
                <DataStudioPoints
                  dataPointSelected={handleDataPoints}
                  dataItemsData={handleDataItems}
                  itemNewData={itemData}
                  dataItemsSelData={handleDataItemsSel}
                  selItemNewData={selItemData}
                  closeDataPointModal={handleCloseDataPointModal}
                  chartType="line"
                />
              </Dialog>
            </Grid>
          </Paper>
        </Grid>
      ) : (
        ""
      )}
    </React.Fragment>
  )
}