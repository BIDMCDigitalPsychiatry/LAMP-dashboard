import React from "react"
import {
  Box,
  Button,
  Typography,
  IconButton,
  makeStyles,
  Grid,
  Paper,
} from "@material-ui/core"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import CloseIcon from "@material-ui/icons/Close"
import Tooltip from '@material-ui/core/Tooltip';
import { useLocation  } from "react-router";
  
// Reordering the result
const reorder = (list, startIndex, endIndex, destDrop, sourDrop) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

// Moves an item from one list to another list.
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source)
  const destClone = Array.from(destination)
  const [removed] = sourceClone.splice(droppableSource.index, 1)
  destClone.splice(droppableDestination.index, 0, removed)
  const result = {}
  result[droppableSource.droppableId] = sourceClone
  result[droppableDestination.droppableId] = destClone
  return result
}

const grid = 8

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  background: isDragging ? "lightgreen" : "#fff",
  ...draggableStyle,
})

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "#fafafa",
  padding: grid,
})

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  box_btn: {
    float: "right",
  },
  btn: {
    cursor: "pointer",
    height: 45,
    width: 120,
    textTransform: "capitalize",
    marginLeft: 15,
  },
  popup_head: {
    padding: "10px 10px 10px 20px",
    borderBottom: "#f4f4f4 solid 1px",
    [theme.breakpoints.up("sm")]: {
      minWidth: 600,
    },
    [theme.breakpoints.up("md")]: {
      minWidth: 930,
    },
    "& h3": {
      fontSize: 18,
    },
  },
  availablehd: {
    background: "#4696eb",
    display: "block",
    padding: "15px 20px",
    "& h4": { margin: 0, fontSize: 16, color: "#fff", fontWeight: "500" },
  },
  availableWrapper: {
    border: "#4696eb solid 1px",
  },
  selectedWrapper: {
    border: "#eb384b solid 1px",
  },
  dragitem: { borderRadius: "0 0 5px 5px !important", padding: "10px 15px !important", minHeight: 300 },
  dragitemPoints: { border: "#e8e8e8 solid 1px" },
  selectedhd: {
    background: "#eb384b",
    display: "block",
    padding: "15px 20px",
    "& h4": { margin: 0, fontSize: 16, color: "#fff", fontWeight: "500" },
  },
  popfooter: {
    padding: 20,
    borderTop: "#f4f4f4 solid 1px",
  },
}))

export default function DataStudioPoints(props: any) 
{  
  const currentLocation = useLocation();
  const locationPathname = currentLocation.pathname;
  const splitLocation = locationPathname.split("/");
  const participantData = JSON.parse(localStorage.getItem("participant_id"))
  const participantId = (splitLocation.length > 2) ? splitLocation[2] : participantData.id;
  const templateId = JSON.parse(localStorage.getItem("template_id"+"_"+participantId))
  const templateDataArray = templateId != null ? JSON.parse(localStorage.getItem("template_" + templateId.id+"_"+participantId)) : null
  const chartType = props.chartType
  const classes = useStyles()
  let itemsArray = [
    { id: "mood", content: "Mood Score" },
    { id: "sleep", content: "Sleep Score" },
    { id: "anxiety", content: "Anxiety Score" },
  ]
    
  // Get Item Data from local Storage
  const getItemStateData = () => {
    if (templateDataArray != null) {
      if (chartType === "line") {
        if (templateDataArray.line_item != null) return templateDataArray.line_item
      }
      if (chartType === "bar") {
        if (templateDataArray.bar_item != null) return templateDataArray.bar_item
      }
    }
    if (props.selItemNewData.length > 0) {
      return props.itemNewData
    } else {
      return itemsArray
    }
  }

  // Get selected item from local Storage
  const getSelectedItemStateData = () => {
    if (templateDataArray != null) {
      if (chartType === "line") {
        if (templateDataArray.line_selected_item != null) return templateDataArray.line_selected_item
      }
      if (chartType === "bar") {
        if (templateDataArray.bar_selected_item != null) return templateDataArray.bar_selected_item
      }
    }
    if (props.selItemNewData.length > 0) {
      return props.selItemNewData
    } else {
      return []
    }
  }

  const [itemsData, setItemsData] = React.useState(getItemStateData())
  const [selectedData, setSelectedData] = React.useState(getSelectedItemStateData())
  const [selectedDataPoints, setSelectedDataPoints] = React.useState([])
  const [closeModal, setCloseModal] = React.useState(false)
  const [lineDataPoints, setLineDataPoints] = React.useState([])
  const [barDataPoints, setBarDataPoints] = React.useState([])
  const [moodArray, setMoodArray] = React.useState([
    { x: 0, y: 10, c: 0 },
    { x: 1, y: 11, c: 0 },
    { x: 2, y: 12, c: 0 },
    { x: 3, y: 13, c: 0 },
    { x: 4, y: 14, c: 0 },
    { x: 5, y: 15, c: 0 },
    { x: 6, y: 16, c: 0 },
    { x: 7, y: 17, c: 0 },
  ])
  const [sleepArray, setSleepArray] = React.useState([
    { x: 0, y: 20, c: 1 },
    { x: 1, y: 21, c: 1 },
    { x: 2, y: 22, c: 1 },
    { x: 3, y: 23, c: 1 },
    { x: 4, y: 24, c: 1 },
    { x: 5, y: 25, c: 1 },
    { x: 6, y: 26, c: 1 },
    { x: 7, y: 27, c: 1 },
  ])
  const [anxietyArray, setAnxietyArray] = React.useState([
    { x: 0, y: 30, c: 2 },
    { x: 1, y: 31, c: 2 },
    { x: 2, y: 32, c: 2 },
    { x: 3, y: 33, c: 2 },
    { x: 4, y: 34, c: 2 },
    { x: 5, y: 35, c: 2 },
    { x: 6, y: 36, c: 2 },
    { x: 7, y: 37, c: 2 },
  ])

  let id2List = {
    droppable: "items",
    droppable2: "selected",
  }

  // Get Items List
  const getList = (id) => {
    if (id2List[id] === "items") {
      return itemsData
    }
    if (id2List[id] === "selected") {
      return selectedData
    }
  }

  // Close Modal
  const handleClosePopup = () => {
    setCloseModal(true)
    props.closeDataPointModal(true)
  }

  // On Drag End Set the selected data points
  const onDragEnd = (result) => {
    const { source, destination } = result
    if (!destination) {
      return
    }
    if (source.droppableId === destination.droppableId) {
      const items: any[] = reorder(
        getList(source.droppableId),
        source.index,
        destination.index,
        destination.droppableId,
        source.droppableId
      )
      let state = { items }
      let templateData =
        templateId != null
          ? localStorage.getItem("template_" + templateId.id+"_"+participantId)
            ? JSON.parse(localStorage.getItem("template_" + templateId.id+"_"+participantId))
            : null
          : null
      if (destination.droppableId === "droppable") {
        setItemsData(items)
        if (chartType === "line") {
          templateData["line_item"] = items
        } else if (chartType === "bar") {
          templateData["bar_item"] = items
        }
      }
      if (source.droppableId === "droppable2") {
        setSelectedData(items)
        if (chartType === "line") {
          templateData["line_selected_item"] = items
        } else if (chartType === "bar") {
          templateData["bar_selected_item"] = items
        }
      }
      localStorage.setItem("template_" + templateId.id+"_"+participantId, JSON.stringify(templateData))
    } else {
      const result: any = move(getList(source.droppableId), getList(destination.droppableId), source, destination)
      setItemsData(result.droppable)
      setSelectedData(result.droppable2)

      let templateData =
        templateId != null
          ? localStorage.getItem("template_" + templateId.id+"_"+participantId)
            ? JSON.parse(localStorage.getItem("template_" + templateId.id+"_"+participantId))
            : null
          : null
      if (templateData != null) {
        if (chartType === "line") {
          templateData["line_item"] = result.droppable
          templateData["line_selected_item"] = result.droppable2
          setLineDataPoints(templateData)
        } else if (chartType === "bar") {
          templateData["bar_item"] = result.droppable
          templateData["bar_selected_item"] = result.droppable2
          setBarDataPoints(templateData)
        }
      }
    }
  }

  // Save Selected data Points to Local Storage
  const saveDataPoints = () => {
    setSelectedDataPoints(selectedData)
    let propDataPoint = []
    let selectDataPoint = Array.from(selectedData, (res: any) => {
      if (res.id === "mood") {
        propDataPoint = moodArray
      } else if (res.id === "anxiety") {
        propDataPoint = anxietyArray
      } else if (res.id === "sleep") {
        propDataPoint = sleepArray
      }
      return [...propDataPoint]
    })
    let selectDataPointArray = [].concat(...selectDataPoint)
    props.dataPointSelected(selectDataPointArray)
    let templateData =
      templateId != null
        ? localStorage.getItem("template_" + templateId.id+"_"+participantId)
          ? JSON.parse(localStorage.getItem("template_" + templateId.id+"_"+participantId))
          : null
        : null;    
    if (chartType === "line") {
      let templateLineData = templateData;
      if(Object.keys(lineDataPoints).length > 0){
        templateLineData.line_item = lineDataPoints['line_item'];
        templateLineData.line_selected_item = lineDataPoints['line_selected_item'];
        localStorage.setItem("template_" + templateId.id+"_"+participantId, JSON.stringify(templateLineData))
      }
      let tempItemData = templateData.line_item != null ? templateData.line_item : itemsData
      let tempItemSelData = templateData.line_selected_item != null ? templateData.line_selected_item : selectedData
      props.dataItemsData(tempItemData)
      props.dataItemsSelData(tempItemSelData)
    } 
    if (chartType === "bar") {
      let templateBarData = templateData;     
      if(Object.keys(barDataPoints).length > 0){ 
        templateBarData.bar_item = barDataPoints['bar_item'];
        templateBarData.bar_selected_item = barDataPoints['bar_selected_item'];
        localStorage.setItem("template_" + templateId.id+"_"+participantId, JSON.stringify(templateBarData))
      } 
      let tempItemData = templateData.bar_item != null ? templateData.bar_item : itemsData
      let tempItemSelData = templateData.bar_selected_item != null ? templateData.bar_selected_item : selectedData
      props.dataItemsData(tempItemData)
      props.dataItemsSelData(tempItemSelData)
    }
  }

  return (
    <React.Fragment>
      <Grid className={classes.popup_head}>
        <Box display="flex">
          <Box flexGrow={1} mt={2}>
            <Typography variant="h3">Data points for { props.chartType === "line" ? "Line" : "Bar"} Chart </Typography>
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
      <Box p={3}>
        <Grid container spacing={2}>
          <DragDropContext onDragEnd={onDragEnd}>
            <Grid item xs={6}>
              <Paper variant="outlined" className={classes.availableWrapper}>
                <Box component="span" className={classes.availablehd}>
                  <h4>Available Points</h4>
                </Box>
                <Droppable droppableId="droppable">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      style={getListStyle(snapshot.isDraggingOver)}
                      className={classes.dragitem}
                    >
                      {itemsData.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              className={classes.dragitemPoints}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                            >
                              {item.content}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper variant="outlined" className={classes.selectedWrapper}>
                <Box component="span" className={classes.selectedhd}>
                  <h4>Selected Points</h4>
                </Box>  
                <Droppable droppableId="droppable2">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      style={getListStyle(snapshot.isDraggingOver)}
                      className={classes.dragitem}
                    >
                      {selectedData.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              className={classes.dragitemPoints}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                            >
                              {item.content}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Paper>
            </Grid>
          </DragDropContext>
        </Grid>
      </Box>
      <Grid className={classes.popfooter}>
        <Box component="span" className={classes.box_btn}>
          <Button variant="contained" className={classes.btn} onClick={handleClosePopup}>
            Cancel
          </Button>
          <Button variant="contained" className={classes.btn} color="primary" onClick={saveDataPoints}>
            Save
          </Button>
        </Box>
      </Grid>
    </React.Fragment>
  )
}