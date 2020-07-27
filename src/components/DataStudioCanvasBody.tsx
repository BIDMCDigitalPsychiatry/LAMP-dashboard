import React from "react"
import {
  Box,
  Button,
  Container,
  Typography,
  makeStyles,
  Grid,
} from "@material-ui/core"
import AddCircleIcon from "@material-ui/icons/AddCircle"
import DataStudioSelection from "./DataStudioSelection"
import DataStudioValueIndicator from "./DataStudioValueIndicator"
import DataStudioValueDataIndicator from "./DataStudioValueDataIndicator"
import DataStudioList from "./DataStudioList"
import { useSnackbar } from "notistack"
import Dialog from "@material-ui/core/Dialog"
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon"
import { Slide } from "@material-ui/core"
import Tooltip from '@material-ui/core/Tooltip';
import LAMP, {
  Activity as ActivityObj,
  ActivityEvent as ActivityEventObj, 
} from "lamp-core"
import DataStudioGraphChart from "./DataStudioGraphChart"
import CircularProgress from '@material-ui/core/CircularProgress';
import { useLocation  } from "react-router";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  btnAdd: {
    position: "fixed",
    bottom: 60,
    right: 30,
    zIndex: 111,
    "& svg": {
      background: "#eb384b",
      padding: 14,
      width: 54,
      height: 54,
      borderRadius: "50%",
      color: "white",
      boxShadow: "0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)",
    },
  },
  title: {
    flexGrow: 1,
  },
  welcomemsg: {
    display: "flex",
    flexDirection: "column",
    height: 400,
    textAlign: "center",
    "& h5": { fontSize: 27, color: "#444444", fontWeight: 500, "& span": { color: "#4696eb" } },
    "& h6": { fontWeight: "300", fontSize: 20, "& svg": { color: "#eb384b" } },
  },
  loader: {
    display: "flex",
    flexDirection: "column",
    height: 400,
    textAlign: "center",
    "& h5": { fontSize: 27, color: "#444444", fontWeight: 500, "& span": { color: "#4696eb" } },
    "& h6": { fontWeight: "300", fontSize: 20, "& svg": { color: "#eb384b" } },
  },
}))

async function getActivities(participantId) {
  let original = await LAMP.Activity.allByParticipant(participantId)
  let custom = original.filter((x) => x.spec === "lamp.survey")
  return custom
}

// Perform event coalescing/grouping by sensor or activity type.
async function getActivityEvents(
  participantId,
  _activities: ActivityObj[],
  ): Promise<{ [groupName: string]: ActivityEventObj[] }> {

  let original = (await LAMP.ActivityEvent.allByParticipant(participantId))
    .map((x) => ({
      ...x,
      activity: _activities.find((y) => x.activity === y.id),
    }))
    .sort((x, y) => x.timestamp - y.timestamp)
    .map((x) => ({
      ...x,
      activity: (x.activity || { name: "" }).name,
    }))
    .groupBy("activity") as any;
  delete original[''];
    
  return original;
}

export default function DataStudioCanvasBody(props: any)
{
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const classes = useStyles()
  const [openModal, setOpenModal] = React.useState(false)
  const [openIndicatorModal, setOpenIndicatorModal] = React.useState(false)
  const [indicatorClicked, setIndicatorClicked] = React.useState(false)
  const [currentGraphType, setCurrentGraphType] = React.useState('')
  const [selectedItemArray, setSelectedItemArray] = React.useState([])
  const [selectedValItemArray, setSelectedValItemArray] = React.useState([])
  const [dataArrayForVega, setDataArrayForVega] = React.useState([])
  const [dataAggregateForVega, setDataAggregateForVega] = React.useState('')
  const [valIndicateArray, setValIndicateArray] = React.useState([])
  const [selectedItemCount, setSelectedItemCount] = React.useState(0)
  const [remainingDataIndicator, setRemainingDataIndicator] = React.useState([])
  const [valueDataIndicator, setValueDataIndicator] = React.useState([])
  const currentLocation = useLocation();
  const locationPathname = currentLocation.pathname;
  const splitLocation = locationPathname.split("/");
  const participantData = JSON.parse(localStorage.getItem("participant_id"))
  const participantId = (splitLocation.length > 2) ? splitLocation[2] : participantData.id;
  const templateId = JSON.parse(localStorage.getItem("template_id"+"_"+participantId))
  const templateDataArray = templateId != null 
                              ? JSON.parse(localStorage.getItem("template_" + templateId.id+"_"+participantId)) : null;
  
  React.useEffect(() => {
    let selItemCount = 0
    if (templateDataArray != null) {
      let newItemArray = []
      if (templateDataArray.hasOwnProperty("line_chart")) {
        newItemArray.push("line")
        selItemCount++
      }
      if (templateDataArray.hasOwnProperty("bar_chart")) {
        newItemArray.push("bar")
        selItemCount++
      }
      if (templateDataArray.hasOwnProperty("pie_chart")) {
        newItemArray.push("pie")
        selItemCount++
      }
      if (templateDataArray.hasOwnProperty("listing")) {
        newItemArray.push("listing")
        selItemCount++
      }
      if (templateDataArray.hasOwnProperty("value_indicator")) {
        newItemArray.push("value_indicator")
        selItemCount++
      }
      setSelectedItemArray(newItemArray)
      setSelectedItemCount(selectedItemCount + selItemCount)
    }
  }, [])

  // Delete Selected item
  const deleteSelectedElement = (boolVal) => {
    if (boolVal) {
      let itemArray = selectedItemArray
      let index = itemArray.indexOf(boolVal)
      if (index > -1) {
        itemArray.splice(index, 1)
      }
      setSelectedItemArray(itemArray)
      setSelectedItemCount(selectedItemCount - 1)
    }
  }

  // Open Popup and show data Items to be selected
  const addVisualizationObject = () => {
    setOpenModal(true)
  }

  // Close Popup of data
  const handleClose = () => {
    setOpenModal(false)
  }

  // Close Popup of Value Indiactor
  const handleCloseValIndicator = () => {
    setOpenIndicatorModal(false)
  }

  // Data items based on selection
  const handleChangeSelection = (val) => {
    if (!selectedItemArray.includes(val)) {
      let newItemArray = selectedItemArray
      newItemArray.push(val)
      setSelectedItemArray(newItemArray)
      if((val == "line") || (val == "pie") || (val == "bar")){
        setCurrentGraphType(val);
      }
      if (val !== "value_indicator") {
        setSelectedItemCount(selectedItemCount + 1)
      }
    }
    setOpenModal(false)
    if (val === "value_indicator") {
      dataValueIndicatorAPI();
      setIndicatorClicked(true);
      document.body.style.opacity = "0.5";
    }else{
      enqueueSnackbar("Successfully created a item.", {
        variant: "success",
        action: (key) => (
          <Button style={{ color: "#fff" }} onClick={() => closeSnackbar(key)}>
            Dismiss
          </Button>
        ),
      })
    }
  }
  
  // API for Getting Activities and Activity Events
  const dataValueIndicatorAPI = () => {
    ;(async () => {              
      let activities = await getActivities(participantId)
      let activityEvents:any = await getActivityEvents(participantId, activities);
      setValueDataIndicator(activityEvents)
      setOpenIndicatorModal(true);
      setIndicatorClicked(false);      
      document.body.style.opacity = "1";
    })()
  } 

  // Data based on Vale indicator selection
  const handleValueIndicator = (arrayVal) => {
    if (arrayVal.length > 0) {
      if (valIndicateArray.length > 0) {
        let newValArray = valIndicateArray
        let found = newValArray.some((el) => el.id === arrayVal[0].id)
        if (!found) newValArray.push(arrayVal[0])
        setValIndicateArray(newValArray)
      } else {
        setValIndicateArray(arrayVal)
      }
      enqueueSnackbar("Successfully created a item.", {
        variant: "success",
        action: (key) => (
          <Button style={{ color: "#fff" }} onClick={() => closeSnackbar(key)}>
            Dismiss
          </Button>
        ),
      })
    } else {
      setValIndicateArray(arrayVal)
    }
    setSelectedValItemArray(arrayVal)
    setOpenIndicatorModal(false)
  }

  // Get and Store List data from/to LocalStorage
  const handleTableListData = (val) => {
    let templateData =
      templateId != null
        ? localStorage.getItem("template_" + templateId.id+"_"+participantId)
          ? JSON.parse(localStorage.getItem("template_" + templateId.id+"_"+participantId))
          : {}
        : null
    if (props.dataSelectedTemplate != null) { 
      templateData.listing = val
      localStorage.setItem("template_" + props.dataSelectedTemplate+"_"+participantId, JSON.stringify(templateData))
    }
  }

  // Get and Store List data from/to LocalStorage
  const handleGraphChartSpec = (dataArray) => {      
    let templateData =
        templateId != null
          ? localStorage.getItem("template_" + templateId.id+"_"+participantId)
            ? JSON.parse(localStorage.getItem("template_" + templateId.id+"_"+participantId))
            : {}
          : null
    if (props.dataSelectedTemplate != null) {
      let graphSpec = dataArray.specs;
      let graphDataType = dataArray.graphDataType;
      if(graphDataType === 'line'){
        templateData.line_chart = graphSpec
      }
      if(graphDataType === 'bar'){
        templateData.bar_chart = graphSpec
      }
      if(graphDataType === 'pie'){
        templateData.pie_chart = graphSpec
      }
      localStorage.setItem("template_" + props.dataSelectedTemplate+"_"+participantId, JSON.stringify(templateData))
    }
  }

  // Get Remaining Data Values
  const handleRemainingDataArray = (val) => {
    setRemainingDataIndicator(val)
  }

  const handleSurveyDataArray = (itemDataVal) => {
    setDataArrayForVega(itemDataVal);
  }

  const handleSataAggregate = (aggr) => {
    setDataAggregateForVega(aggr); 
  }
    
  return (
    <React.Fragment>      
      { (indicatorClicked) ?
        <Box className={classes.loader} alignItems="center" justifyContent="center">
          <CircularProgress /> Loading
        </Box>
            : ''
      } 

      {((props.templateChanged) || ((openModal === false) && selectedItemCount === 0 && remainingDataIndicator.length === 0)) ? (
        <Box className={classes.welcomemsg} alignItems="center" justifyContent="center">
          <Typography variant="h5">
            Welcome to <Box component="span">Data Studio</Box>
          </Typography>
          <Typography variant="h6">
            {" "}
            Tap <AddCircleIcon /> to add data visualization objects
          </Typography>
        </Box>
      ) : (
        ""
      )}
      
      <Tooltip title="Add Data Items">
        <SpeedDialIcon className={classes.btnAdd} color="secondary" onClick={addVisualizationObject} />
      </Tooltip>

      {openModal ? (
        <DataStudioSelection selectedItemsObj={handleChangeSelection} closeSelectionModal={handleClose} />
      ) : (
        ""
      )}      

      {! openModal && !(props.templateChanged) ? (
      <Container maxWidth="xl">
        <Grid container spacing={3} >
          { selectedItemArray.indexOf("line") > -1 ? (
            <DataStudioGraphChart  selectedGraphType={'line'}
                  graphChartSpecArray={handleGraphChartSpec} delLineSelectionElement={deleteSelectedElement} />
            ) : (
          "" )}

          { selectedItemArray.indexOf("bar") > -1 ? (
            <DataStudioGraphChart selectedGraphType={'bar'}
                  graphChartSpecArray={handleGraphChartSpec} delLineSelectionElement={deleteSelectedElement} />
            ) : (
          "" )}

          { selectedItemArray.indexOf("pie") > -1 ? (
            <DataStudioGraphChart selectedGraphType={'pie'}
                  graphChartSpecArray={handleGraphChartSpec} delLineSelectionElement={deleteSelectedElement} />
            ) : (
          "" )}
          
          {selectedItemArray.indexOf("listing") > -1 ? (
            <DataStudioList tableListData={handleTableListData} delListingSelectionElement={deleteSelectedElement} />
          ) : (
            ""
          )}

          {selectedItemArray.indexOf("value_indicator") > -1 ? (
            <DataStudioValueDataIndicator
              valueDataIndicateArray={valIndicateArray}
              valueIndicatorObj={selectedValItemArray}
              dataIndicatorArray={handleRemainingDataArray}
              dataValArrayForVega={dataArrayForVega}
              dataValAggregateForVega={dataAggregateForVega}
              updatedDateVal={new Date()}
            />         
          ) : (
            ""
          )}      

          <Dialog
            open={openIndicatorModal}
            maxWidth="md"
            aria-labelledby="customized-dialog-title"
            TransitionComponent={Slide}
            transitionDuration={250}
          >
            <DataStudioValueIndicator
              valueIndicatorObj={handleValueIndicator}
              closeValIndicatornModal={handleCloseValIndicator}
              dataIndicatorArray={handleRemainingDataArray}
              dataValDataIndicator={valueDataIndicator}
              dataSurveyArray={ handleSurveyDataArray }
              dataAggregateData={ handleSataAggregate }
            />
          </Dialog>
        </Grid>
      </Container>
      ): (
        ""
      )}
    </React.Fragment>
  )
}