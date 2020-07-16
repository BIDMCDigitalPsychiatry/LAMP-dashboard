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
import Tooltip from "@material-ui/core/Tooltip"

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
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
    marginBottom: 15,
    [theme.breakpoints.up("sm")]: {
      minWidth: 400,
    },
    [theme.breakpoints.up("md")]: {
      minWidth: 598,
    },
    "& h3": {
      fontSize: 18,
    },
  },
  piechartCards: {
    minWidth: 150,
    minHeight: 150,
  },
  inActive: { border: "#e8e8e8 solid 2px" },
  active: { border: "#4696eb solid 2px" },
  popfooter: {
    padding: 20,
    borderTop: "#f4f4f4 solid 1px",
  },
  maxWidth: { width: "100%" },
}))

export default function DataStudioPointsSingle(props: any) {
  const [selectedPoints, setSelectedPoints] = React.useState("")
  const templateId = JSON.parse(localStorage.getItem("template_id"))
  const templateData = templateId != null ? JSON.parse(localStorage.getItem("template_" + templateId.id)) : null
  const selectedTempPoints = templateId != null ? templateData.pie_selected_item : ""
  const [selectedDataPoints, setSelectedDataPoints] = React.useState(selectedTempPoints)
  const classes = useStyles()
  let itemsArray = [
    { id: "mood", content: "Mood Score" },
    { id: "sleep", content: "Sleep Score" },
    { id: "anxiety", content: "Anxiety Score" },
  ]
  const [moodArray, setMoodArray] = React.useState([
    { id: 0, field: 13, title: "Mood Title 1" },
    { id: 1, field: 68, title: "Mood Title 2" },
    { id: 2, field: 41, title: "Mood Title 3" },
    { id: 3, field: 75, title: "Mood Title 4" },
    { id: 4, field: 23, title: "Mood Title 5" },
    { id: 5, field: 9, title: "Mood Title 6" },
    { id: 6, field: 59, title: "Mood Title 7" },
    { id: 7, field: 28, title: "Mood Title 8" },
  ])
  const [sleepArray, setSleepArray] = React.useState([
    { id: 0, field: 65, title: "Sleep Title 1" },
    { id: 1, field: 84, title: "Sleep Title 2" },
    { id: 2, field: 12, title: "Sleep Title 3" },
    { id: 3, field: 50, title: "Sleep Title 4" },
    { id: 4, field: 21, title: "Sleep Title 5" },
    { id: 5, field: 49, title: "Sleep Title 6" },
    { id: 6, field: 26, title: "Sleep Title 7" },
    { id: 7, field: 39, title: "Sleep Title 8" },
  ])
  const [anxietyArray, setAnxietyArray] = React.useState([
    { id: 0, field: 8, title: "Anxiety Title 1" },
    { id: 1, field: 10, title: "Anxiety Title 2" },
    { id: 2, field: 30, title: "Anxiety Title 3" },
    { id: 3, field: 50, title: "Anxiety Title 4" },
    { id: 4, field: 20, title: "Anxiety Title 5" },
    { id: 5, field: 15, title: "Anxiety Title 6" },
    { id: 6, field: 18, title: "Anxiety Title 7" },
    { id: 7, field: 5, title: "Anxiety Title 8" },
  ])

  // Close Modal
  const handleClosePopup = () => {
    props.closeDataPointModal(true)
  }

  // Set Data Points
  const saveDataPoint = (id) => {
    setSelectedPoints(id)
    setSelectedDataPoints(id)
  }

  // handle Data Points
  const handleSaveDataPoint = () => {
    let propDataPoint
    if (selectedPoints === "mood") {
      propDataPoint = moodArray
    } else if (selectedPoints === "anxiety") {
      propDataPoint = anxietyArray
    } else if (selectedPoints === "sleep") {
      propDataPoint = sleepArray
    }
    let templateId = JSON.parse(localStorage.getItem("template_id"))
    let templateData =
      templateId != null
        ? localStorage.getItem("template_" + templateId.id)
          ? JSON.parse(localStorage.getItem("template_" + templateId.id))
          : null
        : null
    if (templateData != null) {
      templateData.pie_selected_item = selectedPoints
      localStorage.setItem("template_" + templateId.id, JSON.stringify(templateData))
    }
    props.dataPointSelected(propDataPoint)
  }

  return (
    <React.Fragment>
      <Grid className={classes.popup_head}>
        <Box display="flex">
          <Box flexGrow={1} mt={2}>
            <Typography variant="h3">Data points for Pie Graph</Typography>{" "}
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
      <Grid container justify="center">
        <Grid item xs={12}>
          <Typography align="center">Select the data point</Typography>
        </Grid>
        <Box p={2} className={classes.maxWidth}>
          <Grid container spacing={2}>
            {itemsArray.length > 0
              ? itemsArray.map((selected) => (
                  <Grid
                    item
                    sm={4}
                    xs={12}
                    key={selected.id}
                    onClick={() => saveDataPoint(selected.id)}
                  >
                    <Card
                      variant="outlined"
                      className={
                        classes.piechartCards + " " + selectedDataPoints !== "" && selectedDataPoints === selected.id
                          ? classes.active
                          : classes.inActive
                      }
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
          <Button variant="contained" className={classes.btn} onClick={handleClosePopup}>
            Cancel
          </Button>
          <Button variant="contained" className={classes.btn} color="primary" onClick={() => handleSaveDataPoint()}>
            Save
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}