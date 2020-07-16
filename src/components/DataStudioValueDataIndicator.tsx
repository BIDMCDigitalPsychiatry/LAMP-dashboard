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
//import AspectRatioIcon from "@material-ui/icons/AspectRatio"
import { useConfirm } from "material-ui-confirm"
import { useSnackbar } from "notistack"
import moodScore from "../icons/moodScore.png"
import stepScore from "../icons/stepScore.png"
import greenScore from "../icons/greenScore.png"
import vioScore from "../icons/vioScore.png"
import yellowScore from "../icons/yellowScore.png"
import orangeScore from "../icons/yellowScore.png"
import Tooltip from '@material-ui/core/Tooltip';

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

export default function DataStudioValueDataIndicator(props: any) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const confirm = useConfirm()
  const classes = useStyles()
  let selectedDataIndicator = []
  const selectedDataArray = props.valueDataIndicateArray
  const [valDataIndicator, setValDataIndicator] = React.useState([])
  const [requestData, setRequestData] = React.useState(new Date())
  const templateId = JSON.parse(localStorage.getItem("template_id"))
  const templateData =
    templateId != null
      ? localStorage.getItem("template_" + templateId.id)
        ? JSON.parse(localStorage.getItem("template_" + templateId.id))
        : {}
      : null
  if (templateData != null) {
    if (templateData.hasOwnProperty("value_indicator")) {
      selectedDataIndicator = templateData.value_indicator
    } else {
      if (selectedDataArray.length > 0) selectedDataIndicator = selectedDataArray.value_indicator
    }
  }

  React.useEffect(() => {
    const templateId = JSON.parse(localStorage.getItem("template_id"))
    const templateData =
      templateId != null
        ? localStorage.getItem("template_" + templateId.id)
          ? JSON.parse(localStorage.getItem("template_" + templateId.id))
          : {}
        : null
    if (templateData != null) {
      if (templateData.hasOwnProperty("value_indicator")) {
        setValDataIndicator(templateData.value_indicator)
        props.dataIndicatorArray(templateData.value_indicator)
      } else {
        if (selectedDataArray.length > 0) {
          setValDataIndicator(selectedDataArray.value_indicator)
          props.dataIndicatorArray(templateData.value_indicator)
        }
      }
    }
  }, [requestData])

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
        let removeIndex = tempValIndicator
          .map(function (item) {
            return item.id
          })
          .indexOf(id)
        // remove object
        tempValIndicator.splice(removeIndex, 1)
        templateData.value_indicator = tempValIndicator
        localStorage.setItem("template_" + templateId.id, JSON.stringify(templateData))
        props.dataIndicatorArray(tempValIndicator)
        setRequestData(new Date())
        enqueueSnackbar("Successfully deleted the item.", {
          variant: "success",
          action: (key) => (
            <Button style={{ color: "#fff" }} onClick={() => closeSnackbar(key)}>
              Dismiss
            </Button>
          ),
        })
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
      {selectedDataIndicator.length > 0
        ? selectedDataIndicator.map((selected) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={selected.id}>
              <Card className={
              (() => {
                switch (selected.id) {
                  case "avg-mood":   return classes.moodScore;
                  case "avg-anxiety": return classes.stepScore;
                  case "avg-sleep":  return classes.greenScore;
                  case "sum-mood":  return classes.vioScore;
                  case "sum-anxiety":  return classes.yellowScore;
                  case "sum-sleep":  return classes.orangeScore;
                }
              })() + " " + classes.valueindicatorcard}>
                 
                <Box display="flex" py={1} borderBottom={1} className={classes.cardheader} justifyContent="flex-end">
                  {/*
                    <IconButton aria-label="Maximize">
                      <AspectRatioIcon />
                    </IconButton>
                  */}
								<Tooltip title="Delete">
                  <IconButton aria-label="Close" onClick={() => removeSelectedValueIndicator(selected.id)}>
                    <CloseIcon />
                  </IconButton>
								</Tooltip>
                </Box>
                <CardContent>
                  <Typography variant="h6">{selected.content}</Typography>
                  <Typography variant="h2" align="center">
                    {selected.calculation}
                  </Typography>
                  <Typography variant="h5" align="center">
                    units
                  </Typography>
                </CardContent>                  
                <img src={(() => {
                  switch (selected.id) {
                    case "avg-mood":   return moodScore;
                    case "avg-anxiety": return stepScore;
                    case "avg-sleep":  return greenScore;
                    case "sum-mood":  return vioScore;
                    case "sum-anxiety":  return yellowScore;
                    case "sum-sleep":  return orangeScore;
                  }
                })()} />                
              </Card>
            </Grid>
          ))
        : ""}
    </React.Fragment>
  )
}