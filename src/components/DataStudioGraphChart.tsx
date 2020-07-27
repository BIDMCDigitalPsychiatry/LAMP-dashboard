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
import DataStudioPointsSingle from "./DataStudioPointsSingle"
import { Slide } from "@material-ui/core"
import { useLocation  } from "react-router";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },  
  chartwrapperHeader: { padding: 10, marginBottom: 20, borderBottom: "#f0f0f0 solid 1px" },
  databtn: { backgroundColor: "#4696eb", textTransform: "capitalize", paddingRight: 12, "& span": { marginLeft: 0 } },
  piechart: {
    width: "80%",
    margin: "0px auto",
    display: "block !important",
    paddingBottom: 55,
    paddingRight: "0 !important",
    "& canvas": {
      margin: "0px auto",
      display: "block",
      width: "100% !important",
      height: "auto !important",
    },
  },
  pieMaxWidthPx :{
    "& canvas": {
      maxWidth: "350px !important"
    }
  },
  pieMaxWidthPt :{
    "& canvas": {
      maxWidth: "70%"
    }
  }
}))

export default function DataStudioGraphChart(props: any) 
{
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
  const participantData = JSON.parse(localStorage.getItem("participant_id"))
  const currentLocation = useLocation();
  const locationPathname = currentLocation.pathname;
  const splitLocation = locationPathname.split("/");  
  const participantId = (splitLocation.length > 2) ? splitLocation[2] : participantData.id;  
  const templateId = JSON.parse(localStorage.getItem("template_id"+"_"+participantId));
  const templateData = (templateId !== null) ? JSON.parse(localStorage.getItem("template_" + templateId.id+"_"+participantId)) : null;
  const graphType = props.selectedGraphType;
  
  // Remove Line Graph 
  const removeLineGraph = () => {
    confirm({
      title: ``,
      description: `Are you sure you want to delete this?`,
      confirmationText: `Yes`,
      cancellationText: `No`,
    })
    .then(() => {      
      let templateData = templateId != null ? 
                            JSON.parse(localStorage.getItem("template_" + templateId.id+"_"+participantId)) : null
      let templateNewData = templateData
      if(graphType === "line"){
        delete templateNewData.line_chart
        delete templateNewData.line_item
        delete templateNewData.line_selected_item
      }else if(graphType === "bar"){
        delete templateNewData.bar_chart
        delete templateNewData.bar_item
        delete templateNewData.bar_selected_item
      }else if(graphType === "pie"){
        delete templateNewData.pie_chart
        delete templateNewData.pie_selected_item
      }
      localStorage.setItem("template_" + templateId.id+"_"+participantId, JSON.stringify(templateNewData))
      setVegaSpecArray([])
      props.delLineSelectionElement(graphType)
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

  // Handle Graphs
  const handleGraphChart = (type) => {
    if ((templateData == null) || (Object.keys(templateData).length === 0)){
      if(type === "line"){
        return generateLineChart([])
      }else if(type === "bar"){
        return generateBarChart([])
      }else if(type === "pie"){
        return generatePieChart([])
      } 
    }else{  
      if(type === "line"){
        if (templateData.line_chart != null) {
          if (templateData.line_chart.data.length > 0) {
            let graphDataArray = templateData.line_chart.data[0].values
            return generateLineChart(graphDataArray)
          }
        } else {
          return generateLineChart([])
        }
      }else if(type === "bar"){
        if (templateData.bar_chart != null) {
          if (templateData.bar_chart.data.length > 0) {
            let graphDataArray = templateData.bar_chart.data[0].values
            return generateBarChart(graphDataArray)
          }
        } else {
          return generateBarChart([])
        }
      }else if(type === "pie"){
        if (templateData.pie_chart != null) {
          if (templateData.pie_chart.data.length > 0) {
            let graphDataArray = templateData.pie_chart.data[0].values
            return generatePieChart(graphDataArray)
          }
        } else {
          return generatePieChart([])
        }
      }
    }
  }
  
  React.useEffect(() => {
    handleGraphChart(graphType);      
  }, [])

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
    if(graphType === "line"){
      generateLineChart(val)
    }else if(graphType === "bar"){
      generateBarChart(val)
    }else if(graphType === "pie"){
      generatePieChart(val)
    }
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
    if(graphType === "line"){
      generateLineChart(vegaSpecArray.data[0].values, maxVal)
    }else if(graphType === "bar"){
      generateBarChart(vegaSpecArray.data[0].values, maxVal)
    }else if(graphType === "pie"){
      generatePieChart(vegaSpecArray.data[0].values, maxVal)
    }    
  }
  
  //  Line Chart
  const generateLineChart = (dataLineArray, maxVal = false, width = window.innerWidth - (window.innerWidth * 70) / 100) => {
    specs = {
      $schema: "https://vega.github.io/schema/vega/v5.json",
      description: "A basic line chart example.",
      width: (maxVal === true) ? (window.innerWidth - (window.innerWidth * 30) / 100) : width,
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
    let newVegaGrpahData = {specs: vegaDataArray, graphDataType: 'line'};
    props.graphChartSpecArray(newVegaGrpahData)
  }

  // Generate the Bar chart
  const generateBarChart = (dataBarArray, maxVal = false, width = window.innerWidth - (window.innerWidth * 70) / 100) => {
    specs = {
      $schema: "https://vega.github.io/schema/vega/v5.json",
      description: "A basic stacked bar chart example.",
      width: (maxVal === true) ? (window.innerWidth - (window.innerWidth * 30) / 100) : width,
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
    setVegaSpecArray(vegaDataArray)
    let newVegaGrpahData = {specs: vegaDataArray, graphDataType: 'bar'};
    props.graphChartSpecArray(newVegaGrpahData)
  }
  
  //  Generate Pie Chart
  const generatePieChart = (dataLineArray, maxVal = false, width = window.innerWidth - (window.innerWidth * 70) / 100) => {
    specs = {
      $schema: "https://vega.github.io/schema/vega/v5.json",
      description: "A basic pie chart example.",
      width: (maxVal === true) ? (window.innerWidth - (window.innerWidth * 30) / 100) : width,
      height: 400,
      signals: [
        { name: "startAngle", value: 0 },
        { name: "endAngle", value: 6.29 },
        { name: "padAngle", value: 0 },
        { name: "innerRadius", value: 0 },
        { name: "cornerRadius", value: 0 },
      ],
      data: [
        {
          name: "table",
          values: dataLineArray,
          transform: [
            {
              type: "pie",
              field: "field",
            },
          ],
        },
      ],
      scales: [
        {
          name: "color",
          type: "ordinal",
          domain: { data: "table", field: "id" },
          range: { scheme: ["#00BFFF", "#FF4500", "#FF69B4", "#32CD32", "#FFFF33", "#D2691E"] },
        },
      ],
      marks: [
        {
          type: "arc",
          from: { data: "table" },
          encode: {
            enter: {
              fill: { scale: "color", field: "id" },
              x: { signal: "width / 2" },
              y: { signal: "height / 2" },
              tooltip: { signal: "{'Title': datum.title,'ID': datum.id, 'Value': datum.field}" },
            },
            update: {
              startAngle: { field: "startAngle" },
              endAngle: { field: "endAngle" },
              padAngle: { signal: "padAngle" },
              innerRadius: { signal: "innerRadius" },
              outerRadius: { signal: "width / 2" },
              cornerRadius: { signal: "cornerRadius" },
            },
          },
        },
      ],
    }    
    vegaDataArray = specs
    setVegaSpecArray(vegaDataArray)
    let newVegaGrpahData = {specs: vegaDataArray, graphDataType: 'pie'};
    props.graphChartSpecArray(newVegaGrpahData)
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
              <Vega data={vegaSpecArray.data} spec={vegaSpecArray} 
                className={ (graphType === 'pie') ? 
                (classes.piechart + " "+ maximized ? classes.pieMaxWidthPt : classes.pieMaxWidthPx) : ''}/>                           
              {(graphType === "pie") ?
                <Dialog
                  open={openModal}
                  onClose={handleClose}
                  aria-labelledby="customized-dialog-title"
                  TransitionComponent={Slide}
                  transitionDuration={250}
                >
                  <DataStudioPointsSingle
                    dataPointSelected={handleDataPoints}
                    closeDataPointModal={handleCloseDataPointModal}
                  />
                </Dialog>
              :
                <Dialog open={openModal} 
                maxWidth="md" 
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
                    chartType={graphType}
                  />  
                </Dialog>
              }
            </Grid>
          </Paper>
        </Grid>
      ) : (
        ""
      )}
    </React.Fragment>
  )
} 