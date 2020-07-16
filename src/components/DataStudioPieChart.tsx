import React from "react"
import { makeStyles, Grid, Paper, Button, Box, IconButton } from "@material-ui/core"
import { Vega } from "react-vega"
import DataStudioPointsSingle from "./DataStudioPointsSingle"
import ArrowRightIcon from "@material-ui/icons/ArrowRight"
import CloseIcon from "@material-ui/icons/Close"
import AspectRatioIcon from "@material-ui/icons/AspectRatio"
import { useSnackbar } from "notistack"
import { useConfirm } from "material-ui-confirm"
import Dialog from "@material-ui/core/Dialog"
import { Slide } from "@material-ui/core"
import Tooltip from '@material-ui/core/Tooltip';

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

export default function DataStudioPieChart(props) {
  const confirm = useConfirm()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const classes = useStyles()
  const [openModal, setOpenModal] = React.useState(false)
  let specs: any = {}
  let vegaDataArray: any
  const [vegaPieSpecArray, setVegaPieSpecArray]: any = React.useState([])
  const [maximized, setMaximized] = React.useState(false)
  const templateId = JSON.parse(localStorage.getItem("template_id"))
  const templateData = templateId != null ? JSON.parse(localStorage.getItem("template_" + templateId.id)) : null

  // Handle Pie Graph
  const handlePieGraphData = () => {
    if (templateData == null) {
      return generatePieChart([])
    } else {
      if (templateData.pie_chart != null) {
        if (templateData.pie_chart.data.length > 0) {
          let lineDataArray = templateData.pie_chart.data[0].values
          return generatePieChart(lineDataArray)
        }
      } else {
        return generatePieChart([])
      }
    }
  }

  React.useEffect(() => handlePieGraphData(), [])

  // Open Modal
  const handelOpenModal = () => {
    setOpenModal(true)
  }

  // Close Modal
  const handleClose = () => {
    setOpenModal(false)
  }

  // Close Data point modal
  const handleCloseDataPointModal = () => {
    setOpenModal(false)
  }

  // handle Data points
  const handleDataPoints = (val) => {
    setOpenModal(false)
    generatePieChart(val)
  }

  //Maximize the component
  const maximizeComponent = () => {
    (maximized === true) ? setMaximized(false) : setMaximized(true) ;
    let maxVal = (maximized === true) ? false : true ;
    generatePieChart(vegaPieSpecArray.data[0].values, maxVal)
  }

  //  Generate Pie Chart
  const generatePieChart = (dataLineArray, maxVal = false, width = window.innerWidth - (window.innerWidth * 60) / 100) => {
    specs = {
      $schema: "https://vega.github.io/schema/vega/v5.json",
      description: "A basic pie chart example.",
      width: (maxVal === true) ? (window.innerWidth - (window.innerWidth * 10) / 100) : width,
      height: 360,
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
    setVegaPieSpecArray(vegaDataArray)
    props.pieChartSpecArray(vegaDataArray)
  }

  //Remove Pie Graph
  const removePieGraph = () => {
    confirm({
      title: ``,
      description: `Are you sure you want to delete this?`,
      confirmationText: `Yes`,
      cancellationText: `No`,
    })
    .then(() => {
      let templateData = templateId != null ? JSON.parse(localStorage.getItem("template_" + templateId.id)) : null
      let pieData = templateData
      delete pieData.pie_chart
      delete pieData.pie_selected_item
      localStorage.setItem("template_" + templateId.id, JSON.stringify(pieData))
      setVegaPieSpecArray([])
      props.delPieSelectionElement("pie")
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

  return (
    <React.Fragment>
      {vegaPieSpecArray.length !== 0 ? (
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
                        <IconButton aria-label="Close" onClick={removePieGraph}>
                          <CloseIcon />
                        </IconButton>
								      </Tooltip>
                    </Box>
                  </Grid>
                </Grid>
              </Box>  
              <Vega data={vegaPieSpecArray.data} spec={vegaPieSpecArray} 
                  className={classes.piechart + " "+ maximized ? classes.pieMaxWidthPt : classes.pieMaxWidthPx} />
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
            </Grid>
          </Paper>
        </Grid>
      ) : (
        ""
      )}
    </React.Fragment>
  )
}