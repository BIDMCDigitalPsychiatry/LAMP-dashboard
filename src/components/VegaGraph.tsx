import React from "react";
import {
  Box,
  Button,
  AppBar,
  Toolbar,
  TextareaAutosize, Typography,
  IconButton,
  Icon,
  makeStyles,
  Grid,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  CircularProgress
} from "@material-ui/core"; 
import {Alert, AlertTitle} from '@material-ui/lab/';
import { Vega } from 'react-vega';

const useStyles = makeStyles((theme) => ({
        root: {
          flexGrow: 1,
        }, 
        paper: {
          height: 693,
          width: "auto",
          padding: theme.spacing(2),
        },
        textarea:{
          width: "100%",
          border: "1px solid rgba(0, 0, 0, 0.12)"
        },
        dropdown: {
          margin: theme.spacing(1),
          minWidth: 120,
        },
        loaderIcon: {
          margin: "30px",
          textAlign: "center" 
        }
      }));  
export default function VegaGraph({goBack}: {goBack?: any})
{
  const apiBaseUrl = "https://api.lamp.digital/";
  const apiAuthorization = "admin:LAMPLAMP";
  const classes = useStyles();
  const [chartType, setChartType] = React.useState('');
  const [vegaGraphArray, setVegaGraphArray] = React.useState('');
  const [lineData, setLineData] = React.useState('');
  const [barData, setBarData] = React.useState('');
  const [pieData, setPieData] = React.useState('');
  const [vegaSpecArray, setVegaSpecArray]:any = React.useState([]);
  const [lampApiError, setLampApiError] = React.useState(false);
  const [loadingIcon, setLoadingIcon] = React.useState(false);
  let specs: any = {};
  let vegaDataArray: any;
  let dataArray: any ;
  const createGraph = () => {
    setVegaGraphArray('');
    setVegaSpecArray([]);
    setLampApiError(false);
    if(chartType == "line_chart"){
      generateLineChart();  
    }else if(chartType == "bar_chart"){
      generateBarChart();
    }else if(chartType == "pie_chart"){
      generatePieChart();
    }
  }
  
  const handleChartType = (event) => {
    setLampApiError(false);
    setChartType(event.target.value); 
    if(event.target.value == "line_chart"){
      generateLineChart();
    }else if(event.target.value == "bar_chart"){
      generateBarChart();
    }else if(event.target.value == "pie_chart"){
      generatePieChart();
    }else{
      setVegaGraphArray('');
      setVegaSpecArray([]);
    }
  }
  
  const generateDataArray = (event) => {
    setVegaGraphArray(event.target.value);
    if(chartType == "line_chart"){
      setLineData(event.target.value);
    }else if(chartType == "bar_chart"){
      setBarData(event.target.value);
    }else if(chartType == "pie_chart"){
      setPieData(event.target.value);
    }
  }

  // API call
  const getLampQueryAPI = (specs) => {
    setLoadingIcon(true);
    let specBody: any;
    if(typeof specs == "object"){
      specBody = JSON.stringify(specs)
    }else{
      specBody = specs;
    }

    fetch(apiBaseUrl, {
      "method": "POST",
      "headers": {
        "Authorization": apiAuthorization
      },
      "body":  specBody
    })
    .then(response => response.json())
    .then(response => {
      setLoadingIcon(false); 
      if(response.hasOwnProperty('error')){
        setLampApiError(true);
      }
      setVegaSpecArray(response);
      setVegaGraphArray(JSON.stringify(response, undefined, 1));
    })
    .catch(err => {
      setLoadingIcon(false); 
      setLampApiError(true)
	  });
  }
  
  //  Line Chart
  const generateLineChart = () => {
    setBarData("");
    setPieData("");
    specs = {
      "$schema": "https://vega.github.io/schema/vega/v5.json",
      "description": "A basic line chart example.",
      "width": 400,
      "height": 400,
      "padding": 5,
      "signals": [
        { 
          "name": "interpolate",
          "value": "linear",
        }
      ],    
      "data": [
        {
          "name": "table",
          "values": [
            {"x": 0, "y": 28, "c":0},
            {"x": 1, "y": 43, "c":0},
            {"x": 2, "y": 81, "c":0},
            {"x": 3, "y": 19, "c":0},
            {"x": 4, "y": 52, "c":0},
            {"x": 5, "y": 24, "c":0},
            {"x": 6, "y": 87, "c":0},
            {"x": 7, "y": 17, "c":0}
          ]
        }
      ],
      "scales": [
        {
          "name": "x",
          "type": "point",
          "range": "width",
          "domain": {"data": "table", "field": "x"}
        },
        {
          "name": "y",
          "type": "linear",
          "range": "height",
          "nice": true,
          "zero": true,
          "domain": {"data": "table", "field": "y"}
        }
      ],    
      "axes": [
        {"orient": "bottom", "scale": "x"},
        {"orient": "left", "scale": "y"}
      ],    
      "marks": [
        {
          "type": "group",
          "from": {
            "facet": {
              "name": "series",
              "data": "table",
              "groupby": "c"
            }
          },
          "marks": [
            {
              "type": "line", 
              "point": true, 
              "from": {"data": "series"},
              "encode": {
                "enter": {
                  "x": {"scale": "x", "field": "x"},
                  "y": {"scale": "y", "field": "y"},
                },
                "hover": {
                  "strokeOpacity": {"value": 0.5}
                }
              }
            }
          ]
        },{
          "type": "symbol",
          "from": {"data":"table"},
          "encode": {
            "enter": {
              "x": {"scale": "x", "field": "x"},
              "y": {"scale": "y", "field": "y"},
              "size": {"value": 200},
              "tooltip": {"signal": "{'x-axis ': datum.x, 'y-axis ': datum.y}"}
            }
          }
        },
      ]
    };
    if(lineData == ''){
      setLineData(JSON.stringify(specs, undefined, 1));
      dataArray = JSON.stringify(specs, undefined, 1);
      vegaDataArray = specs;
    }else{
      dataArray = lineData;
      vegaDataArray = dataArray;
    }
    getLampQueryAPI(vegaDataArray);
  };

  //  Bar Chart
  const generateBarChart = () => {
    setLineData("");
    setPieData("");
    specs = {
      "$schema": "https://vega.github.io/schema/vega/v5.json",
      "description": "A basic bar chart example, with value labels shown upon mouse hover.",
      "width": 400,
      "height": 400,
      "padding": 5,
      "data": [
        {
          "name": "table",
          "values": [
            {"category": "A", "amount": 28},
            {"category": "B", "amount": 55},
            {"category": "C", "amount": 43},
            {"category": "D", "amount": 91},
            {"category": "E", "amount": 81},
            {"category": "F", "amount": 53},
            {"category": "G", "amount": 19}
          ]
        }
      ],    
      "signals": [
        {
          "name": "tooltip",
          "value": {},
          "on": [
            {"events": "rect:mouseover", "update": "datum"},
            {"events": "rect:mouseout",  "update": "{}"}
          ]
        }
      ],    
      "scales": [
        {
          "name": "xscale",
          "type": "band",
          "domain": {"data": "table", "field": "category"},
          "range": "width",
          "padding": 0.05,
          "round": true
        },
        {
          "name": "yscale",
          "domain": {"data": "table", "field": "amount"},
          "nice": true,
          "range": "height"
        }
      ],    
      "axes": [
        { "orient": "bottom", "scale": "xscale" },
        { "orient": "left", "scale": "yscale" }
      ],    
      "marks": [
        {
          "type": "rect",
          "from": {"data":"table"},
          "encode": {
            "enter": {
              "x": {"scale": "xscale", "field": "category"},
              "width": {"scale": "xscale", "band": 1},
              "y": {"scale": "yscale", "field": "amount"},
              "y2": {"scale": "yscale", "value": 0}
            },
            "update": {
              "fill": {"value": "steelblue"}
            },
            "hover": {
              "fill": {"value": "#2196f3"}
            }
          }
        },
        {
          "type": "text",
          "encode": {
            "enter": {
              "align": {"value": "center"},
              "baseline": {"value": "bottom"},
              "fill": {"value": "#333"}
            },
            "update": {
              "x": {"scale": "xscale", "signal": "tooltip.category", "band": 0.5},
              "y": {"scale": "yscale", "signal": "tooltip.amount", "offset": -2},
              "text": {"signal": "tooltip.amount"},
              "fillOpacity": [
                {"test": "datum === tooltip", "value": 0},
                {"value": 1}
              ]
            }
          }
        }
      ]
    }
    if(barData == ''){
      setBarData(JSON.stringify(specs, undefined, 1));
      dataArray = JSON.stringify(specs, undefined, 1);
      vegaDataArray = specs;
    }else{
      dataArray = barData;
      vegaDataArray = dataArray;
    }
    getLampQueryAPI(vegaDataArray);
  };
  
  //   Pie Chart 
  const generatePieChart = () => {  
    setLineData("");
    setBarData("");
    specs = { 
      "$schema": "https://vega.github.io/schema/vega/v5.json",
      "description": "A basic pie chart example.",
      "width": 400,
      "height": 400,
      "autosize": "none",        
      "signals": [
        {"name": "startAngle", "value": 0},{"name": "endAngle", "value": 6.29},{"name": "padAngle", "value": 0},
        {"name": "innerRadius", "value": 0},{"name": "cornerRadius", "value": 0}
      ],    
      "data": [
        {
          "name": "table",
          "values": [
            {"id": 1, "field": 4, "title": "Title 1"},
            {"id": 2, "field": 6, "title": "Title 2"},
            {"id": 3, "field": 10, "title": "Title 3"},
            {"id": 4, "field": 3, "title": "Title 4"},
            {"id": 5, "field": 7, "title": "Title 5"},
            {"id": 6, "field": 8, "title": "Title 6"}
          ],
          "transform": [
            {
              "type": "pie",
              "field": "field"
            }
          ]
        }
      ],
      "scales": [
        {
          "name": "color",
          "type": "ordinal",
          "domain": {"data": "table", "field": "id"},
          "range": {"scheme": ['#00BFFF', '#FF4500', '#FF69B4', '#32CD32', '#FFFF33', '#D2691E']}
        }
      ],
      "marks": [
        {
          "type": "arc",
          "from": {"data": "table"},
          "encode": {
            "enter": {
              "fill": {"scale": "color", "field": "id"},
              "x": {"signal": "width / 2"},
              "y": {"signal": "height / 2"},
              "tooltip": {"signal": "{'Title': datum.title,'ID': datum.id, 'Value': datum.field}"}
            },
            "update": {
              "startAngle": {"field": "startAngle"},
              "endAngle": {"field": "endAngle"},
              "padAngle": {"signal": "padAngle"},
              "innerRadius": {"signal": "innerRadius"},
              "outerRadius": {"signal": "width / 2"},
              "cornerRadius": {"signal": "cornerRadius"}
            }
          }
        }
      ]
    };    
    if(pieData == ''){
      setPieData(JSON.stringify(specs, undefined, 1));
      dataArray = JSON.stringify(specs, undefined, 1);
      vegaDataArray = specs;
    }else{
      dataArray = pieData;
      vegaDataArray = dataArray;  
    } 
    getLampQueryAPI(vegaDataArray); 
  };
  
  return (
    <React.Fragment>      
      <AppBar  style={{ height: 48, background: "transparent", boxShadow: "none" }}>
        <Toolbar>
          <IconButton 
            color="default"
            aria-label="Menu"
            onClick={goBack}
          >
            <Icon>arrow_back</Icon>
          </IconButton>
          <Box flexGrow={1} />
        </Toolbar>
      </AppBar>
      <Typography variant="h4" align="center" style={{ fontWeight: 400, paddingBottom: 20, paddingTop: 10 }}>
        mindLAMP - Graphs
      </Typography>
      { lampApiError ? 
        <Alert variant="filled" severity="error">
          <AlertTitle>Error</AlertTitle>
          An error occured while fetching the data.
        </Alert>
      : ''}
      <Grid container spacing={1}>
        <Grid item xs={5}>
          <Paper className={classes.paper} variant="outlined">
            <TextareaAutosize className={classes.textarea}  
              rows={41} rowsMax={41}
              placeholder="Data should be only json format" value={ vegaGraphArray }
              onChange={ generateDataArray } 
            />
          </Paper>
        </Grid>
        <Grid item xs={2}>
          <Paper className={classes.paper} variant="outlined">
            <Box component="span" m={1}>
                <InputLabel id="demo-simple-select-outlined-label">Type of Chart</InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={chartType}
                  name="chartType"
                  className={classes.dropdown} onChange={ handleChartType }  style={{textAlign: "center"}}
                > 
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={"line_chart"}>Line Chart</MenuItem>
                <MenuItem value={"bar_chart"}>Bar Chart</MenuItem>
                <MenuItem value={"pie_chart"}>Pie Chart</MenuItem>
              </Select>
            </Box>
            <Box component="span" m={1}>
              <Button variant="contained" color="primary" onClick={createGraph} >Generate</Button>
            </Box>
            { loadingIcon ? 
            <Box component="span" m={1}>
              <CircularProgress className={classes.loaderIcon} color="secondary"/>
            </Box>
            : '' }
          </Paper>
        </Grid>
        <Grid item xs={5}>
          <Paper className={classes.paper} variant="outlined">
            {(vegaSpecArray.length != 0) ?
              <Vega data={ vegaSpecArray.data } spec={ vegaSpecArray }  />
            : '' }
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  )
} 