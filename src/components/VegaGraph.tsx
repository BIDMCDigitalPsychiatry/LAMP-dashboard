import React, { useState } from "react"
import { View, parse } from "vega";
import { makeStyles } from '@material-ui/core/styles';
import Grid, { GridSpacing } from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import {
  Box,
  Button,
  AppBar,
  Toolbar,
  TextareaAutosize, Typography,
  IconButton,
  Icon
} from "@material-ui/core"
  
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
        }));
export default function VegaGraph({
  goBack
}: {
  goBack?: any
}) {
  const classes = useStyles();
  const [chartType, setChartType] = React.useState('');
  const [graphDataArray, setGraphDataArray] = React.useState('');
  const [lineData, setLineData] = React.useState('');
  const [barData, setBarData] = React.useState('');
  const [pieData, setPieData] = React.useState('');
  let specs: any = {};

  const createGraph = (event) => {
    if(chartType == "line_chart"){
      handleLineChart();
    }else if(chartType == "bar_chart"){
      handleBarChart();
    }else if(chartType == "pie_chart"){
      handlePieChart();
    }
  } 
  
  const handleChartType = (event) => {
    setChartType(event.target.value); 
    if(event.target.value == "line_chart"){
      handleLineChart();
    }else if(event.target.value == "bar_chart"){
      handleBarChart();
    }else if(event.target.value == "pie_chart"){
      handlePieChart();
    }else{
      setGraphDataArray('');
      document.getElementById("graphVega").innerHTML = "";
    }
  }

  const handleDataArray = (event) => {
    setGraphDataArray(event.target.value);
    if(chartType == "line_chart"){
      setLineData(event.target.value);
    }else if(chartType == "bar_chart"){
      setBarData(event.target.value);
    }else if(chartType == "pie_chart"){
      setPieData(event.target.value);
    }
  }

  const handleChange = (event) => {
    setChartType(event.target.value);
  };

  //   Pie Chart 
  const handlePieChart = () => {
    let dataArray: any ;
    setLineData("");
    setBarData("");
    if(pieData == ''){
      dataArray = [
        {"id": 1, "field": 4, "title": "Title 1"},
        {"id": 2, "field": 6, "title": "Title 2"},
        {"id": 3, "field": 10, "title": "Title 3"},
        {"id": 4, "field": 3, "title": "Title 4"},
        {"id": 5, "field": 7, "title": "Title 5"},
        {"id": 6, "field": 8, "title": "Title 6"}
      ];
      setPieData(JSON.stringify(dataArray, undefined, 1));
      dataArray = JSON.stringify(dataArray, undefined, 1)
    }else{
      dataArray = pieData;
    }
    setGraphDataArray(dataArray);
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
          "values": dataArray,
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
          "range": {"scheme": ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff']}
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
    const runtime = parse(specs);    
    const graphVega = document.getElementById('graphVega');
    var viewGraph = new View(runtime)
                .renderer('svg')     // set render type (defaults to 'canvas')
                .initialize(graphVega); // set parent DOM element
    viewGraph.run();
  };

  //  Bar Chart
  const handleBarChart = () => {
    let dataArray: any ;
    setLineData("");
    setPieData("");
    if(barData == ''){
      dataArray = [
        {"category": "A", "amount": 28},
        {"category": "B", "amount": 55},
        {"category": "C", "amount": 43},
        {"category": "D", "amount": 91},
        {"category": "E", "amount": 81},
        {"category": "F", "amount": 53},
        {"category": "G", "amount": 19}
      ];
      setBarData(JSON.stringify(dataArray, undefined, 1));
      dataArray = JSON.stringify(dataArray, undefined, 1)
    }else{
      dataArray = barData;
    }
    setGraphDataArray(dataArray);

    specs = {
      "$schema": "https://vega.github.io/schema/vega/v5.json",
      "description": "A basic bar chart example, with value labels shown upon mouse hover.",
      "width": 400,
      "height": 400,
      "padding": 5,
      "data": [
        {
          "name": "table",
          "values": dataArray
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
              "fill": {"value": "red"}
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
    const runtime = parse(specs);    
    const graphVega = document.getElementById('graphVega');
    var viewGraph = new View(runtime)
                .renderer('svg')     // set render type (defaults to 'canvas')
                .initialize(graphVega);
    viewGraph.run();
  };

  //  Line Chart
  const handleLineChart = () => {
    let dataArray: any ;
    setBarData("");
    setPieData("");
    if(lineData == ''){
      dataArray = [
        {"x": 0, "y": 28, "c":0},
        {"x": 1, "y": 43, "c":0},
        {"x": 2, "y": 81, "c":0},
        {"x": 3, "y": 19, "c":0},
        {"x": 4, "y": 52, "c":0},
        {"x": 5, "y": 24, "c":0},
        {"x": 6, "y": 87, "c":0},
        {"x": 7, "y": 17, "c":0}
      ];
      setLineData(JSON.stringify(dataArray, undefined, 1));
      dataArray = JSON.stringify(dataArray, undefined, 1)
    }else{
      dataArray = lineData;
    }
    setGraphDataArray(dataArray);

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
          "values": dataArray
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
              "tooltip": {"signal": "{'x-axis: ': datum.x, 'y-axis': datum.y}"}
            }
          }
        },
      ]
    };
    const runtime = parse(specs);    
    const graphVega = document.getElementById('graphVega');
    var viewGraph = new View(runtime)
                .renderer('svg')     // set render type (defaults to 'canvas')
                .initialize(graphVega); // set parent DOM element
    viewGraph.run();
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
        
      <Grid container spacing={1}>
        <Grid item xs={5}>
          <Paper className={classes.paper} variant="outlined">
            <TextareaAutosize className={classes.textarea}  
              rowsMin={26} rowsMax={41}
              placeholder="Data should be json format" value={ graphDataArray }
              onChange={ handleDataArray } 
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
                  className={classes.dropdown} onChange={handleChartType}  style={{textAlign: "center"}}
                > 
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={"line_chart"}>Line Chart</MenuItem>
                <MenuItem value={"bar_chart"}>Bar Chart</MenuItem>
                <MenuItem value={"pie_chart"}>Pie Chart</MenuItem>
              </Select>
            </Box>
            <Button variant="contained" color="primary" onClick={createGraph} >Generate</Button>
          </Paper>
        </Grid>
        <Grid item xs={5}>
          <Paper className={classes.paper} variant="outlined">            
            <div id="graphVega" ></div>
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}