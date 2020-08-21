import React, { useState } from "react"
import {
  Typography,
  makeStyles,
  createStyles,
  Theme,
  IconButton,
  CardContent,
  Button,
  Grid,
  Box,
  Icon,
  Fab,
  Container,
} from "@material-ui/core"
import { ReactComponent as SadHappy } from "../icons/SadHappy.svg"
import { ReactComponent as ThumbsUp } from "../icons/ThumbsUp.svg"
import { ReactComponent as ThumbsDown } from "../icons/ThumbsDown.svg"
import classnames from "classnames"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    topicon: {
      minWidth: 180,
      minHeight: 180,
      [theme.breakpoints.down("xs")]: {
        minWidth: 180,
        minHeight: 180,
      },
    },
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

        color: "rgba(0, 0, 0, 0.75)",
      },
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
      "&:hover": { background: "#cea000" },
    },
    backbtn: {
      position: "absolute",
      left: 10,
    },
    howFeel: { fontSize: 14, color: "rgba(0, 0, 0, 0.5)", fontStyle: "italic", textAlign: "center", marginBottom: 10 },
    colorLine: { maxWidth: 115 },
  })
)

export default function TipNotification({ ...props }) {
  const classes = useStyles()
  const [status, setStatus] = useState("Yes")

  const handleClickStatus = (statusVal: string) => {
    setStatus(statusVal)
  }

  return (
    <div>
      <div className={classes.header}>
        <IconButton onClick={props.onClose} color="default" className={classes.backbtn} aria-label="Menu">
          <Icon>arrow_back</Icon>
        </IconButton>
        <Box display="flex" justifyContent="center">
          <Box>
            <SadHappy className={classes.topicon} />
          </Box>
        </Box>
        <Typography variant="body2">Tip</Typography>
        <Typography variant="h2">Todays's Tip: Mood</Typography>
      </div>
      <Grid container direction="row" justify="center" alignItems="flex-start">
        <Grid item lg={4} sm={10} xs={12}>
          <CardContent className={classes.tipscontentarea}>
            <Typography variant="h3" gutterBottom>
              Focus on the good things
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              Challenging situations and obstacles are a part of life. When you’re faced with one, focus on the good
              things no matter how small or seemingly insignificant they seem. If you look for it, you can always find
              the proverbial silver lining in every cloud — even if it’s not immediately obvious. For example, if
              someone cancels plans, focus on how it frees up time for you to catch up on a TV show or other activity
              you enjoy
            </Typography>
            <Box mt={4} mb={2}>
              <Grid container direction="row" justify="center" alignItems="center">
                <Grid container className={classes.colorLine} spacing={0} xs={4} md={4} lg={3}>
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
              <Fab variant="extended" color="primary" className={classes.btnyellow}>
                Mark complete
              </Fab>
            </Box>
          </CardContent>
        </Grid>
      </Grid>
    </div>
  )
}
