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
import { Slide } from "@material-ui/core"
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  chartwrapperHeader: { padding: 10, marginBottom: 20, borderBottom: "#f0f0f0 solid 1px" },
  databtn: { backgroundColor: "#4696eb", textTransform: "capitalize", paddingRight: 12, "& span": { marginLeft: 0 } },
}))

export default function DataStudioBarChart(props: any) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const confirm = useConfirm()
  const classes = useStyles()
  let specs: any = {}
  let vegaDataArray: any
  const [vegaBarSpecArray, setVegaBarSpecArray]: any = React.useState([])
  const [openModal, setOpenModal] = React.useState(false)
  const [itemData, setItemData] = React.useState([])
  const [selItemData, setSelItemData] = React.useState([])
  const [maximized, setMaximized] = React.useState(false)

  const templateId = JSON.parse(localStorage.getItem("template_id"))
  const templateBarData = templateId != null ? JSON.parse(localStorage.getItem("template_" + templateId.id)) : null

  // Remove bar Graph
  const removeBarGraph = () => {
    confirm({
      title: ``,
      description: `Are you sure you want to delete this?`,
      confirmationText: `Yes`,
      cancellationText: `No`,
    })
    .then(() => {
      let templateData = templateId != null ? JSON.parse(localStorage.getItem("template_" + templateId.id)) : null
      let barData = templateData
      delete barData.bar_chart
      delete barData.bar_item
      delete barData.bar_selected_item
      localStorage.setItem("template_" + templateId.id, JSON.stringify(barData))
      setVegaBarSpecArray([])
      props.delBarSelectionElement("bar")
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

  // Bar Graph Load
  const handleBarGraphData = () => {
    if (templateBarData == null) {
      return generateBarChart([])
    } else {
      if (templateBarData.bar_chart != null) {
        if (templateBarData.bar_chart.data.length > 0) {
          let barDataArray = templateBarData.bar_chart.data[0].values
          return generateBarChart(barDataArray)
        }
      } else {
        return generateBarChart([])
      }
    }
  }

  React.useEffect(() => handleBarGraphData(), [])

  // Close Data Point Modal
  const handleCloseDataPointModal = () => {
    setOpenModal(false)
  }

  // Close Modal
  const handleClose = () => {
    setOpenModal(false)
  }

  // Handle data points
  const handleDataPoints = (val) => {
    setOpenModal(false)
    generateBarChart(val)
  }

  // Set Data Items
  const handleDataItems = (val) => {
    setItemData(val)
  }

  // Set Selected Data Items
  const handleDataItemsSel = (val) => {
    setSelItemData(val)
  }

  // Open Modal
  const handelOpenModal = () => {
    setOpenModal(true)
  }

  // Maximize the component
  const maximizeComponent = () => {
    (maximized === true) ? setMaximized(false) : setMaximized(true) ;
    let maxVal = (maximized === true) ? false : true ;
    generateBarChart(vegaBarSpecArray.data[0].values, maxVal)
  }
  
  // Generate the Bar chart
  const generateBarChart = (dataBarArray, maxVal = false, width = window.innerWidth - (window.innerWidth * 60) / 100) => {
    specs = {
      $schema: "https://vega.github.io/schema/vega/v5.json",
      description: "A basic stacked bar chart example.",
      width: (maxVal === true) ? (window.innerWidth - (window.innerWidth * 10) / 100) : width,
      height: 400,
      autosize: {type: "none", contains: "padding", resize: true},
      padding: 40,
      data: [
        {
          name: "table",
          values: dataBarArray,
          transform: [
            {
              type: "stack",
              groupby: ["x"],
              sort: { field: "c" },
              field: "y",
            },
          ],
        },
      ],
      scales: [
        {
          name: "x",
          type: "band",
          range: "width",
          domain: { data: "table", field: "x" },
        },
        {
          name: "y",
          type: "linear",
          range: "height",
          nice: true,
          zero: true,
          domain: { data: "table", field: "y1" },
        },
        {
          name: "color",
          type: "ordinal",
          range: "category",
          domain: { data: "table", field: "c" },
        },
      ],
      axes: [
        { orient: "bottom", scale: "x", zindex: 1 , title: "X-axis"},
        { orient: "left", scale: "y", zindex: 1 , title: "Y-axis"},
      ],
      marks: [
        {
          type: "rect",
          from: { data: "table" },
          encode: {
            enter: {
              x: { scale: "x", field: "x" },
              width: { scale: "x", band: 1, offset: -1 },
              y: { scale: "y", field: "y0" },
              y2: { scale: "y", field: "y1" },
              fill: { scale: "color", field: "c" },
              tooltip: { signal: "{'x-axis ': datum.x, 'y-axis ': datum.y}" },
            },
            update: {
              fillOpacity: { value: 1 },
            },
            hover: {
              fillOpacity: { value: 0.5 },
            },
          },
        },
      ],
    }
    vegaDataArray = specs
    setVegaBarSpecArray(vegaDataArray)
    props.barChartSpecArray(vegaDataArray)
  }

  return (
    <React.Fragment>
      {vegaBarSpecArray.length !== 0 ? (
        <Grid item xs={12} md={6} lg={ maximized ? 12 : 6}>
          <Paper>
            <Grid item sm={12}>
              <Grid item>
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
                          <IconButton aria-label="Close" onClick={removeBarGraph}>
                            <CloseIcon />
                          </IconButton>
								        </Tooltip>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
                <Vega data={vegaBarSpecArray.data} spec={vegaBarSpecArray} />
                <Dialog
                  maxWidth="md"
                  open={openModal}
                  onClose={handleClose}
                  aria-labelledby="customized-dialog-title"
                  TransitionComponent={Slide}
                  transitionDuration={250}
                >
                  <DataStudioPoints
                    dataPointSelected={handleDataPoints}
                    dataItemsData={handleDataItems}
                    itemNewData={itemData}
                    dataItemsSelData={handleDataItemsSel}
                    selItemNewData={selItemData}
                    closeDataPointModal={handleCloseDataPointModal}
                    chartType="bar"
                  />
                </Dialog>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      ) : (
        ""
      )}
    </React.Fragment>
  )
}