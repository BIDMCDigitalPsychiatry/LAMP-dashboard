import React from "react"
import {
  Box,
  Button,
  IconButton,
  makeStyles,
  Grid,
} from "@material-ui/core"
import { Vega } from "react-vega"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import CloseIcon from "@material-ui/icons/Close"
import { useConfirm } from "material-ui-confirm"
import { useSnackbar } from "notistack"
import moodScore from "../icons/moodScore.png"
import stepScore from "../icons/stepScore.png"
import greenScore from "../icons/greenScore.png"
import vioScore from "../icons/vioScore.png"
import Tooltip from '@material-ui/core/Tooltip';
import { useLocation  } from "react-router";

const useStyles = makeStyles((theme) => ({
  cardheader: { border: "#f0f0f0 solid 1px" },
  valueindicatorcard: {
    "& h6": { fontSize: 18, color: "#444", fontWeight: "500", textAlign: "center" },
    "& h5": { fontWeight: 300, fontSize: 20 },
    "& h2": { fontWeight: "500", lineHeight: "90px" },
    "& img": { width: "100%" },
  },
  moodScore: {
    "& h2": { color: "#4696eb" },
  },
  stepScore: {
    "& h2": { color: "#eb384b" },
  },
  greenScore: {
    "& h2": { color: "#27a321" },
  },
  vioScore: {
    "& h2": { color: "#a13cbc" },
  },
  yellowScore: {
    "& h2": { color: "#cec319" },
  },
  orangeScore: {
    "& h2": { color: "#de9200" },
  },
}))

export default function DataStudioValueDataIndicator(props: any) 
{
  const classes = useStyles()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const confirm = useConfirm()
  const [vegaSpecArray, setVegaSpecArray]: any = React.useState([])
  const [requestData, setRequestData] = React.useState(new Date());
  const participantData = JSON.parse(localStorage.getItem("participant_id"))
  const currentLocation = useLocation();
  const locationPathname = currentLocation.pathname;
  const splitLocation = locationPathname.split("/");
  const participantId = (splitLocation.length > 2) ? splitLocation[2] : participantData.id;  
  const templateId = JSON.parse(localStorage.getItem("template_id"+"_"+participantId))
  const templateData = templateId != null ? JSON.parse(localStorage.getItem("template_" + templateId.id+"_"+participantId)) : null
  const tempValIndicator = (templateData === null || templateData === undefined || templateData === {}) ? 
                              [] : 
                              (templateData.hasOwnProperty("value_indicator") ? templateData.value_indicator : [] );
  
  React.useEffect(() => {
    handleVegaSpecData();
    props.dataIndicatorArray(tempValIndicator)
  }, [tempValIndicator.length])
  
  // Handle Vega spec for Value indicator
  const handleVegaSpecData = () => {
    setVegaSpecArray([]);
    if(tempValIndicator.length > 0){
      for (var i = 0; i < tempValIndicator.length; i++) {
        vegaSpec(tempValIndicator[i]); 
      } 
    }
  }

  // Generate Data indicator based on Aggregate functions
  const vegaSpec = (tempValIndicator) => {    
    let vegaDataArray: any
    let specs;   
    let aggregateDataArray =  (() => {
      switch (tempValIndicator.aggregate) {
        case "min": return 'Minimum Of ';
        case "max": return 'Maximum Of ';
        case "sum": return 'Sum Of ';
        case "average": return 'Average Of ';
      }
    })();  
    let aggregateType = (() => {
      switch (tempValIndicator.aggregate) {
        case "min":   return moodScore;
        case "max": return stepScore;
        case "sum": return vioScore;
        case "average":  return greenScore;
      }
    })();
    specs= {
      "$schema": "https://vega.github.io/schema/vega/v3.0.json",
      "width": 130,
      "height": 200,
      "padding": 5,
      "autosize": "pad",
      "data": [{
        "name": "dataObj",
        "values": tempValIndicator.calculation,
        "transform": [{
          "type": "aggregate",
          "fields": ["y"],
          "ops": [tempValIndicator.aggregate],
          "as": ["y"]
        }]
      }],
      "layout": {
        "padding": 10,
        "columns": 1,
        "align": "all"
      },
      "marks": [
        {
          "type": "group",
          "marks": [
            {
              "type": "text",
              "encode": {
                "update": {
                  "x": {"value": 0},
                  "y": {"value": 0},
                  "text": {"value": aggregateDataArray + tempValIndicator.id},
                  "fill": {"value": "#444"},
                  "fontSize": {"value": 20},
                  "font": {"value": "Roboto"},
                  "align": {"value": "center"},
                  "fontWeight": {"value": 500}
                }
              }
            }
          ]
        },
        {
          "type": "group",
          "marks": [
            {
              "type": "text",
              "encode": {
                "update": {
                  "x": {"value": 0},
                  "y": {"value": 45},
                  "text": {"value": "units"},
                  "fill": {"value": "#444"},
                  "fontSize": {"value": 20},
                  "align": {"value": "center"},
                  "font": {"value": "Roboto"}
                }
              }
            }
          ]
        },
        {
          "type": "text",
          "from": {"data": "dataObj"},
          "encode": {
            "enter": {
              "text": {"field": "y", "signal": "round(datum.y, 2)"},
              "fontSize": {"value": 60},
              "fill": {"value": "#4696eb"},
              "baseline": {"value": "middle"},
              "align": {"value": "center"},
              "x": {"value": 0},
              "y": {"value": 55}
            }
          }
        },
        { 
          "type": "image",
          "encode": {
            "enter": {
              "url": {"value": aggregateType},
              "x": {"value": 0},
              "align": {"value": "center"},
              "y": {"value": 80}
            }
          }
        }
      ]
    };   
    vegaDataArray = specs;
    let vegaSpecs = {};
    Object.assign(vegaSpecs, { id: tempValIndicator.id, aggregate: tempValIndicator.aggregate, specs: specs })
    setVegaSpecArray(state => [...state, vegaSpecs])
  }

  // Remove the selected Value Indicator
  const removeSelectedValueIndicator = (id) => {
    confirm({
      title: ``,
      description: `Are you sure you want to delete this?`,
      confirmationText: `Yes`,
      cancellationText: `No`,
    })
    .then(() => {
      if (templateData.hasOwnProperty("value_indicator")) {
        let tempValIndicator = templateData.value_indicator
        tempValIndicator.splice(id, 1);
        if(tempValIndicator.length === 0){
          delete templateData.value_indicator
        }
        localStorage.setItem("template_" + templateId.id+"_"+participantId, JSON.stringify(templateData))        
        setRequestData(new Date())
      }
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
      {(vegaSpecArray.length > 0) ? 
          vegaSpecArray.map((selected, key) => (          
            <Grid item xs={12} sm={6} md={4} lg={3} key={key}>
              <Card className={ classes.valueindicatorcard}>
                <Box display="flex" py={1} borderBottom={1} className={classes.cardheader} justifyContent="flex-end">
                  <Tooltip title="Delete">
                    <IconButton aria-label="Close" onClick={() => removeSelectedValueIndicator(key)}>
                      <CloseIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                <CardContent>
                  <Vega data={selected.specs.data} spec={selected.specs} />
                </CardContent>
              </Card>
            </Grid>
          ))
        : ""
      }
    </React.Fragment>
  )
}