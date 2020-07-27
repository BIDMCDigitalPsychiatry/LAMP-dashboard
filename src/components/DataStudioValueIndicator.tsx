import React from "react"
import {
  Box,
  Button,
  Typography,
  IconButton,
  makeStyles,
  Container,
  Grid,
} from "@material-ui/core"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import CloseIcon from "@material-ui/icons/Close"
import Tooltip from '@material-ui/core/Tooltip';
import { useLocation  } from "react-router";
  
const useStyles = makeStyles((theme) => ({
  media: {
    // this is the`className` passed to `CardMedia` later
    height: 100, // as an example I am modifying width and height
    width: "33%",
    marginLeft: "33%",
  },
  rightToolbar: {
    marginLeft: "auto",
    marginRight: -12,
  },
  cardAction: {
    textAlign: "initial",
    border: "2px solid #808080",
  },
  card: {
    width: 150,
  },
  gridRow: {
    /*margin: 50*/
  },
  box_btn: {
    float: "right",
    padding: "20px"
  },
  btn: {
    cursor: "pointer",
    height: 45,
    width: 120,
    textTransform: "capitalize",
    marginLeft: 15,
  },
  selectedCard: {
    border: "#4696eb solid 2px",
  },
  noAction: {
    border: "2px solid black",
  },
  active: { border: "#4696eb solid 2px" },
  popup_head: {
    padding: "10px 10px 10px 20px",
    borderBottom: "#f4f4f4 solid 1px",
    marginBottom: 15,
    [theme.breakpoints.up("sm")]: {
      minWidth: 750,
    },
    [theme.breakpoints.up("md")]: {
      minWidth: 598,
    },
    "& h3": {
      fontSize: 18,
    },
  },
  popfooter: {
    padding: 20,
    borderTop: "#f4f4f4 solid 1px",
  },
  errorMsg: {
    color: "red"
  }
}))

export default function DataStudioValueIndicator(props: any) 
{
  const classes = useStyles()
  const [itemsArray, setItemsArray] = React.useState([])
  const [updatedItemArray, setUpdatedItemArray] = React.useState([])
  const dataValDataIndicator = props.dataValDataIndicator;
  
  React.useEffect(() => {
    let dataValArray = Object.keys(dataValDataIndicator)
                        .map(key => (
                          {id: key, value: ((dataValDataIndicator[key][0]['temporal_slices']))}                     
                        ));                        
    setItemsArray(dataValArray);    
    let newdataArray = Object.keys(dataValDataIndicator)
    .map(key => (
      { id: key, value: 
        Object.keys(dataValDataIndicator[key])
        .map(keyVal => (
            (dataValDataIndicator[key][keyVal]['temporal_slices']).reduce((a, {value}) => a + value, 0)
        ))  
      }         
    ));
    setUpdatedItemArray(newdataArray);  
  }, [])

  const [dataIndicatorError, setDataIndicatorError] = React.useState(false)
  const [dataAggregateError, setDataAggregateError] = React.useState(false)
  const [closeModal, setCloseModal] = React.useState(false)
  const [showAggValIndicator, setShowAggValIndicator] = React.useState(false)
  const [showDataValIndicator, setShowDataValIndicator] = React.useState(true)
  const [selectedPoint, setSelectedPoint] = React.useState("")
  const [selectedDataIndicator, setSelectedDataIndicator] = React.useState("")
  const [selectedAggregate, setSelectedAggregate] = React.useState("")
  const currentLocation = useLocation();
  const locationPathname = currentLocation.pathname;
  const splitLocation = locationPathname.split("/");
  const participantData = JSON.parse(localStorage.getItem("participant_id"))
  const participantId = (splitLocation.length > 2) ? splitLocation[2] : participantData.id;  
  const templateId = JSON.parse(localStorage.getItem("template_id"+"_"+participantId))
  const templateData = (templateId != null)
                          ? localStorage.getItem("template_" + templateId.id+"_"+participantId)
                            ? JSON.parse(localStorage.getItem("template_" + templateId.id+"_"+participantId))
                            : null
                          : null
  const templateValIndicator = templateData != null ? 
                                  (templateData.hasOwnProperty("value_indicator") ? templateData.value_indicator : []) : [];

  const aggregateArray = [
    { id: "min", content: "Minimum"},
    { id: "max", content: "Maximum"},
    { id: "sum", content: "Sum"},
    { id: "average", content: "Average "},
  ]
  
  // Set value Indaictor
  const saveValueIndicator = (val) => {
    setSelectedDataIndicator(val)
    setSelectedPoint(val)
  }

  // Close Modal
  const handleClosePopup = () => {
    setCloseModal(true)
    props.closeValIndicatornModal(true)
  }
  
  const saveSelectedDataIndicator = () => {
    if(Object.keys(dataValDataIndicator).length > 0){
      if(selectedPoint == ""){
        if(templateValIndicator.length > 0){
          setSelectedDataIndicator(templateValIndicator[0].id)
          setSelectedPoint(templateValIndicator[0].id)
          setShowDataValIndicator(false);
          setShowAggValIndicator(true);
        }else{
          setDataIndicatorError(true);
        }
      }else{
        setShowDataValIndicator(false);
        setShowAggValIndicator(true);
      }
    }else{
      setDataIndicatorError(true);
    }
  }
  
  const saveAggregateValueIndicator = (id) => {
    setSelectedAggregate(id);
  }
  
  const saveSelectedAggregate = () => {
    if(selectedAggregate == ""){
      setDataAggregateError(true);
    }else{
      let itemsRemData = updatedItemArray;  
      let itemsRemData1 = itemsRemData.filter(function(number) {
        return number.id == selectedDataIndicator
      });
      let indexedItem = itemsRemData1[0];                          
      let itemDataVal = Object.keys(indexedItem.value)
                        .map(key => ( {"x":Number(key), "y": indexedItem.value[key]} ));
      let templateData =
          templateId != null
            ? localStorage.getItem("template_" + templateId.id+"_"+participantId)
              ? JSON.parse(localStorage.getItem("template_" + templateId.id+"_"+participantId))
              : {}
            : null;
      
      if (templateData != null) {
        if (templateData.hasOwnProperty("value_indicator")) {
          let currentValIndicator = templateData.value_indicator;
          let valIndicatorExists = currentValIndicator.some(el => (el.id === selectedDataIndicator) && (el.aggregate === selectedAggregate));
          if(!valIndicatorExists){
            currentValIndicator.push({"id":selectedDataIndicator,"aggregate":selectedAggregate,"calculation":itemDataVal})
            templateData.value_indicator = currentValIndicator
          }
        } else {
          templateData.value_indicator = [{"id":selectedDataIndicator,"aggregate":selectedAggregate,"calculation":itemDataVal}];
        } 
        props.dataIndicatorArray(templateData.value_indicator);
        localStorage.setItem("template_" + templateId.id+"_"+participantId, JSON.stringify(templateData))
      }
      props.dataSurveyArray(itemDataVal);
      props.dataAggregateData(selectedAggregate);
      handleClosePopup();
    }
  }

  return (
    <React.Fragment>
      <Container maxWidth="xl" style={{display: (showDataValIndicator) ? 'block' : 'none' }}>          
        <Grid className={classes.popup_head} >
            <Box display="flex">
              <Box flexGrow={1} mt={2}>
                <Typography variant="h3"> Value Indicators</Typography>{" "}
              </Box>  
              <Box>
                <Tooltip title="Close">
                  <IconButton onClick={handleClosePopup}>
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Grid> 
          <Grid item xs={12}>
            <Typography align="center">Select the value indicator</Typography>
          </Grid>
          { (dataIndicatorError) ?  
            <Grid item xs={12} className={classes.errorMsg}>
              <Typography align="center">Select one indicator to continue.</Typography>
            </Grid>
          : ""} 
          <Box p={3}>
            <Grid container spacing={2} className={classes.gridRow} alignItems="center" justify="center">
              {itemsArray.length > 0
                ? itemsArray.map((selected) => (  
                    <Grid item sm={3} xs={12} key={selected.id} >
                      {
                        <Card
                          variant="outlined" 
                          onClick={() => saveValueIndicator(selected.id)} 
                          className={ ((templateValIndicator.some(el => el.id === selected.id)) || (selectedPoint === selected.id)) ? classes.selectedCard : '' } 
                        >
                          <CardContent>
                            <Typography color="textSecondary" align="center">                              
                              {selected.id}
                            </Typography> 
                          </CardContent>
                        </Card>
                      }
                    </Grid>
                  ))
                : ""}
            </Grid>
          </Box>
          <Grid className={classes.popfooter}>
            <Box className={classes.box_btn}>
              <Button variant="contained" className={classes.btn} onClick={handleClosePopup}>
                Cancel
              </Button>
              <Button variant="contained" className={classes.btn} color="primary" onClick={saveSelectedDataIndicator}>
                Save
              </Button>
            </Box>
          </Grid>
      </Container>
      <Container maxWidth="xl" style={{display: (showAggValIndicator) ? 'block' : 'none' }}>
        <Grid className={classes.popup_head}>
          <Box display="flex">
            <Box flexGrow={1} mt={2}>
              <Typography variant="h3"> Data points for Value Indicator</Typography>{" "}
            </Box>
            <Box>
              <Tooltip title="Close">
                <IconButton onClick={handleClosePopup}>
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Grid> 
        <Grid item xs={12}> 
          <Typography align="center">Select the aggregate for { selectedPoint }</Typography>
        </Grid>
        { (dataAggregateError) ?  
          <Grid item xs={12} className={classes.errorMsg}>
            <Typography align="center">Select one aggregate to continue.</Typography>
          </Grid>
        : ""} 
        <Box p={3}>
          <Grid container spacing={2} className={classes.gridRow} alignItems="center" justify="center"> 
            {aggregateArray.length > 0
              ? aggregateArray.map((selected) => (
                  <Grid item sm={3} xs={12} key={selected.id}>                    
                      <Card
                        variant="outlined" 
                        onClick={() => saveAggregateValueIndicator(selected.id)} 
                        className={                         
                         ((templateValIndicator.some(el => (el.aggregate === selected.id) && (el.id === selectedPoint)) 
                         || (selectedAggregate == selected.id)))
                         ? classes.selectedCard : '' }
                      >
                        <CardContent>
                          <Typography color="textSecondary" align="center">
                            {selected.content}
                          </Typography>
                        </CardContent>
                      </Card>
                  </Grid>
                ))
              : ""}
          </Grid>
        </Box>
        <Grid className={classes.popfooter}>
          <Box className={classes.box_btn}>
            <Button variant="contained" className={classes.btn} onClick={handleClosePopup}>
              Cancel
            </Button>
            <Button variant="contained" className={classes.btn} color="primary" onClick={saveSelectedAggregate}>
              Save
            </Button>
          </Box>
        </Grid>
      </Container>
    </React.Fragment>
  )
}