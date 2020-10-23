import React, { useState } from "react"
import {
  Typography,
  makeStyles,
  createStyles,
  Theme,
  IconButton,
  CardContent,
  Grid,
  Box,
  Fab,
  Container,
  Link,
} from "@material-ui/core"

import { ReactComponent as ThumbsUp } from "../icons/ThumbsUp.svg"
import { ReactComponent as ThumbsDown } from "../icons/ThumbsDown.svg"
import classnames from "classnames"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      background: "#FFF9E5",
      padding: 20,
      [theme.breakpoints.up("sm")]: {
        textAlign: "center",
      },
      "& h2": {
        fontSize: 25,
        fontWeight: 600,
        color: "rgba(0, 0, 0, 0.75)",
      },
    },
    tipscontentarea: {
      padding: "40px 20px 20px",
      "& h3": {
        fontWeight: "bold",
        fontSize: "16px",
        marginBottom: "15px",
      },
      "& p": {
        fontSize: "16px",
        lineheight: "24px",
        marginBottom: 20,
        color: "rgba(0, 0, 0, 0.75)",
      },
      "& img": {
        maxWidth: "100%",
        marginBottom: 15,
      },
      "& h6": { fontSize: 14, fontWeight: 700, fontStyle: "italic" },
      "& a": { fontSize: 14, fontStyle: "italic" },
    },
    lineyellow: {
      background: "#FFD645",
      height: "3px",
    },
    linegreen: {
      background: "#65CEBF",
      height: "3px",
    },
    linered: {
      background: "#FF775B",
      height: "3px",
    },
    lineblue: {
      background: "#86B6FF",
      height: "3px",
    },
    likebtn: {
      fontStyle: "italic",
      padding: 6,
      margin: "0 5px",
      "&:hover": { background: "#FFD645" },
      "& label": {
        position: "absolute",
        bottom: -18,
        fontSize: 12,
      },
    },
    active: {
      background: "#FFD645",
    },
    btnyellow: {
      background: "#FFD645",
      borderRadius: "40px",
      minWidth: "200px",
      boxShadow: "0px 10px 15px rgba(255, 214, 69, 0.25)",
      lineHeight: "38px",
      marginTop: "15%",
      cursor: "pointer",
      textTransform: "capitalize",
      fontSize: "16px",
      color: "rgba(0, 0, 0, 0.75)",
      "& span": { cursor: "pointer" },
      "&:hover": {
        background: "#FFD645",
        boxShadow:
          "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
      },
    },
    howFeel: { fontSize: 14, color: "rgba(0, 0, 0, 0.5)", fontStyle: "italic", textAlign: "center", marginBottom: 10 },
    colorLine: { maxWidth: 115 },
    headerIcon: { textAlign: "center", marginBottom: 15 },
    mainContainer: { padding: 0 },
  })
)

export default function TipNotification({ ...props }) {
  const classes = useStyles()
  const [status, setStatus] = useState("Yes")

  const handleClickStatus = (statusVal: string) => {
    setStatus(statusVal)
  }

  return (
    <Container maxWidth={false} className={classes.mainContainer}>
      <Box className={classes.header}>
        <Box width={1} className={classes.headerIcon}>
          {!!props.icon ? <img src={!!props.icon ? props.icon : undefined} alt={props.title} /> : ""}
        </Box>
        <Typography variant="caption">Tip</Typography>
        <Typography variant="h2">{props.title}</Typography>
      </Box>
      <Grid container direction="row" justify="center" alignItems="flex-start">
        <Grid item lg={4} sm={10} xs={12}>
          <CardContent className={classes.tipscontentarea}>
            {!!props.images ? <img src={props.images} alt={props.title} /> : ""}
            <Typography variant="body2" color="textSecondary" component="p">
              {props.details}
            </Typography>
            <Typography variant="subtitle2">{props.author}</Typography>

            {props.link && (
              <Link target="_blank" href={props.link}>
                {props.link}
              </Link>
            )}
            <Box mt={4} mb={2}>
              <Grid container direction="row" justify="center" alignItems="center">
                <Grid container className={classes.colorLine} spacing={0} xs={4} md={4} lg={4}>
                  <Grid item xs={3} className={classes.lineyellow}></Grid>
                  <Grid item xs={3} className={classes.linegreen}></Grid>
                  <Grid item xs={3} className={classes.linered}></Grid>
                  <Grid item xs={3} className={classes.lineblue}></Grid>
                </Grid>
              </Grid>
            </Box>
            <Box className={classes.howFeel}>Was this helpful today?</Box>
            <Box textAlign="center">
              <IconButton
                onClick={() => handleClickStatus("Yes")}
                className={status === "Yes" ? classnames(classes.likebtn, classes.active) : classes.likebtn}
              >
                <ThumbsUp />
                <label>Yes</label>
              </IconButton>
              <IconButton
                onClick={() => handleClickStatus("No")}
                className={status === "No" ? classnames(classes.likebtn, classes.active) : classes.likebtn}
              >
                <ThumbsDown />
                <label>No</label>
              </IconButton>
            </Box>
            <Box textAlign="center">
              <Fab variant="extended" color="primary" className={classes.btnyellow} onClick={props.onComplete}>
                Mark complete
              </Fab>
            </Box>
          </CardContent>
        </Grid>
      </Grid>
    </Container>
  )
}
