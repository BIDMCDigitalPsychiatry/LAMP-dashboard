import React from "react"
import {
  Box,
  Button,
  Typography,
  IconButton,
  makeStyles,
  Grid,
} from "@material-ui/core"

import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import CloseIcon from "@material-ui/icons/Close"
import Tooltip from '@material-ui/core/Tooltip';

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
}))

export default function DataStudioValueIndicator(props: any) {
  const classes = useStyles()
  const [closeModal, setCloseModal] = React.useState(false)
  const [selectedPoint, setSelectedPoint] = React.useState("")
  const [selectedDataIndicator, setSelectedDataIndicator] = React.useState("")
  const templateId = JSON.parse(localStorage.getItem("template_id"))
  const templateData =
    templateId != null
      ? localStorage.getItem("template_" + templateId.id)
        ? JSON.parse(localStorage.getItem("template_" + templateId.id))
        : null
      : null
  const templateValIndicator =
    templateData != null ? (templateData.hasOwnProperty("value_indicator") ? templateData.value_indicator : null) : null
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

  // Calculate Average of Array Value
  const calcAverage = (itemArray) => {
    let avg = itemArray.reduce((a, { y }) => a + y, 0) / itemArray.length
    return avg
  }

  // Calculate Sum of Array Value
  const calSum = (itemArray) => {
    let sum = itemArray.reduce((a, { y }) => a + y, 0)
    return sum
  }

  const itemsArray = [
    { id: "avg-mood", content: "Average Of Mood Score", calculation: calcAverage(moodArray) },
    { id: "avg-anxiety", content: "Average of Anxiety Score", calculation: calcAverage(anxietyArray) },
    { id: "avg-sleep", content: "Average of Sleep Score", calculation: calcAverage(sleepArray) },
    { id: "sum-mood", content: "Sum Of Mood Score", calculation: calSum(moodArray) },
    { id: "sum-anxiety", content: "Sum of Anxiety Score", calculation: calSum(anxietyArray) },
    { id: "sum-sleep", content: "Sum of Sleep Score", calculation: calSum(sleepArray) },
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

  // Save the Selectde Data Value indicator to local storage
  const saveSelectedDataIndicator = () => {
    if (selectedDataIndicator) {
      let valIndicator = itemsArray.filter((itemVal) => selectedDataIndicator.includes(itemVal.id))
      let templateData =
        templateId != null
          ? localStorage.getItem("template_" + templateId.id)
            ? JSON.parse(localStorage.getItem("template_" + templateId.id))
            : {}
          : null  
      if (templateData != null) {
        if (templateData.hasOwnProperty("value_indicator")) {
          let currentValIndicator = templateData.value_indicator
          currentValIndicator.push(valIndicator[0])
          templateData.value_indicator = currentValIndicator
        } else {
          templateData.value_indicator = [valIndicator[0]]
        }
        localStorage.setItem("template_" + templateId.id, JSON.stringify(templateData))
      }
      props.valueIndicatorObj(valIndicator)
      props.dataIndicatorArray(templateData.value_indicator)
    }
  }

  return (
    <React.Fragment>
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
        <Typography align="center">Select the value indicator</Typography>
      </Grid>
      <Box p={3}>
        <Grid container spacing={2} className={classes.gridRow}>
          {itemsArray.length > 0
            ? itemsArray.map((selected) => (
                <Grid item sm={2} xs={12} key={selected.id}>
                  {templateValIndicator != null ? (
                    templateValIndicator.some((el) => el.id === selected.id) ? (
                      <Card variant="outlined" className={classes.active}>
                        <CardContent>
                          <Typography color="textSecondary" align="center">
                            {selected.content}
                          </Typography>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card
                        variant="outlined"
                        className={selectedPoint === selected.id ? classes.selectedCard : ""}
                        onClick={() => saveValueIndicator(selected.id)}
                      >
                        <CardContent>
                          <Typography color="textSecondary" align="center">
                            {selected.content}
                          </Typography>
                        </CardContent>
                      </Card>
                    )
                  ) : (
                    <Card
                      variant="outlined"
                      className={selectedPoint === selected.id ? classes.selectedCard : ""}
                      onClick={() => saveValueIndicator(selected.id)}
                    >
                      <CardContent>
                        <Typography color="textSecondary" align="center">
                          {selected.content}
                        </Typography>
                      </CardContent>
                    </Card>
                  )}
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
    </React.Fragment>
  )
}