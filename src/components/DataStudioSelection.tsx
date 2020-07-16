import React from "react"
import {
  Box,
  Typography,
  IconButton,
  makeStyles,
  Grid,
  Paper,
  Container,
} from "@material-ui/core"

import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import CardMedia from "@material-ui/core/CardMedia"
import CloseIcon from "@material-ui/icons/Close"
import AspectRatioIcon from "@material-ui/icons/AspectRatio"
import Linechart from "../icons/LineChart.png"
import Barchart from "../icons/BarChart.png"
import Piechart from "../icons/PieChart.png"
import List from "../icons/List.png"
import ValueIndicator from "../icons/ValueIndicator.png"
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles((theme) => ({
  media: {
    height: 100,
    marginTop: 35, // as an example I am modifying width and height
    "& img": { maxWidth: "100%", maxHeight: "100%" },
  },
  rightToolbar: {
    marginLeft: "auto",
    marginRight: -12,
  },
  cardAction: {
    textAlign: "initial",
    border: "2px solid blue",
  },
  card: {
    minHeight: 200,
    textAlign: "center",
  },
  chartwrapper: { paddingBottom: 80 },
  hdh5: {
    "& h5": { fontSize: "18px", textAlign: "center", fontWeight: 500, marginBottom: 40 },
  },
  chartwrapperHeader: { padding: 10, marginBottom: 20, borderBottom: "#f0f0f0 solid 1px" },
  databtn: { backgroundColor: "#4696eb", textTransform: "capitalize", paddingRight: 12, "& span": { marginLeft: 0 } },
}))

export default function DataStudioSelection(props: any) 
{
  const classes = useStyles()

  // Set Selected Items
  const saveSelectedItems = (val) => {
    props.selectedItemsObj(val)
  }
  
  // Set Close Modal value
  const handleCloseSelectionModal = () => {
    props.closeSelectionModal()
  }

  return (
    <React.Fragment>
      <Container maxWidth="xl">
        <Paper className={classes.chartwrapper}>
          <Box className={classes.chartwrapperHeader}>
            <Grid container alignItems="center">
              <Grid item xs>
                <Box display="flex" justifyContent="flex-end">
                  <Tooltip title="Maximize">
                    <IconButton aria-label="Maximize">
                      <AspectRatioIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Close">
                    <IconButton aria-label="Close" onClick={handleCloseSelectionModal}>
                      <CloseIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Grid item xs={12} className={classes.hdh5}>
            <Typography variant="h5">Select the desired type for this new item</Typography>
          </Grid>
          <Grid container direction="row" justify="center" alignItems="center" spacing={2}>
            <Grid item lg={2} md={3} sm={4} xs={6}>
              <Card elevation={2} className={classes.card} onClick={() => saveSelectedItems("line")}>
                <CardMedia className={classes.media}>
                  <img src={Linechart} alt="Line Chart"/>
                </CardMedia>
                <CardContent>
                  <Typography color="textSecondary" align="center">
                    Line Chart
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item lg={2} md={3} sm={4} xs={6}>
              <Card elevation={2} className={classes.card} onClick={() => saveSelectedItems("bar")}>
                <CardMedia className={classes.media}>
                  <img src={Barchart} alt="Bar Chart"/>
                </CardMedia>
                <CardContent>
                  <Typography color="textSecondary" align="center">
                    Bar Chart
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item lg={2} md={3} sm={4} xs={6}>
              <Card elevation={2} className={classes.card} onClick={() => saveSelectedItems("pie")}>
                <CardMedia className={classes.media}>
                  <img src={Piechart} alt="Pie Chart"/>
                </CardMedia>
                <CardContent>
                  <Typography color="textSecondary" align="center">
                    Pie Chart
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item lg={2} md={3} sm={4} xs={6}>
              <Card elevation={2} className={classes.card} onClick={() => saveSelectedItems("val-indicate")}>
                <CardMedia className={classes.media}>
                  <img src={ValueIndicator} alt="Value Indicator"/>
                </CardMedia>
                <CardContent>
                  <Typography color="textSecondary" align="center">
                    Value Indicator
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item lg={2} md={3} sm={4} xs={6}>
              <Card elevation={2} className={classes.card} onClick={() => saveSelectedItems("listing")}>
                <CardMedia className={classes.media}>
                  <img src={List} alt="List"/>
                </CardMedia>
                <CardContent>
                  <Typography color="textSecondary" align="center">
                    List
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </React.Fragment>
  )
}