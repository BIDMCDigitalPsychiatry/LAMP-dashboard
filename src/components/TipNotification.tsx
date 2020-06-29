import React from "react"
import {
  Container,
  Typography,
  makeStyles,
  createStyles,
  Theme,
  CardActions,
  Card,
  IconButton,
  CardActionArea,
  CardContent,
  Link,
  Button,
  Grid,
  Box,
} from "@material-ui/core"
import { ReactComponent as SadHappy } from "../icons/SadHappy.svg"
import { ReactComponent as ThumbsUp } from "../icons/ThumbsUp.svg"
import { ReactComponent as ThumbsDown } from "../icons/ThumbsDown.svg"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    topicon: {
      minWidth: 200,
      minHeight: 200,
      marginLeft: "50px",
    },

    header: {
      background: "#FFF9E5",
      padding: 20,

      "& h2": {
        fontSize: 25,
        fontWeight: 600,
        color: "rgba(0, 0, 0, 0.75)",
      },
    },
    tipscontentarea: {
      padding: 20,
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
      "&:hover": { background: "#FFD645" },

      "& label": {
        position: "absolute",
        bottom: -18,
        fontSize: 12,
      },
    },
    btnyellow: {
      background: "#FFD645",
      borderRadius: "40px",
      minWidth: "200px",
      boxShadow: "0px 10px 15px rgba(255, 214, 69, 0.25)",
      lineHeight: "38px",
      marginTop: "15%",

      textTransform: "capitalize",
      fontSize: "16px",
      color: "rgba(0, 0, 0, 0.75)",
      "&:hover": { background: "#cea000" },
    },
  })
)

export default function TipNotification() {
  const classes = useStyles()

  return (
    <div>
      <div className={classes.header}>
        <SadHappy className={classes.topicon} />

        <Typography variant="h2">Todays's Tip : Mood</Typography>
      </div>

      <CardContent className={classes.tipscontentarea}>
        <Typography variant="h3" gutterBottom>
          Focus on the good things
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          Challenging situations and obstacles are a part of life. When you’re faced with one, focus on the good things
          no matter how small or seemingly insignificant they seem. If you look for it, you can always find the
          proverbial silver lining in every cloud — even if it’s not immediately obvious. For example, if someone
          cancels plans, focus on how it frees up time for you to catch up on a TV show or other activity you enjoy
        </Typography>
        <Box mt={4} mb={3}>
          <Grid container direction="row" justify="center" alignItems="center">
            <Grid container spacing={0} xs={6} md={4} lg={2}>
              <Grid item xs={3} className={classes.lineyellow}></Grid>
              <Grid item xs={3} className={classes.linegreen}></Grid>
              <Grid item xs={3} className={classes.linered}></Grid>
              <Grid item xs={3} className={classes.lineblue}></Grid>
            </Grid>
          </Grid>
        </Box>{" "}
        <Box fontStyle="italic" textAlign="center" fontSize={16}>
          Was this helpful today?
        </Box>
        <Box textAlign="center">
          <IconButton className={classes.likebtn}>
            <ThumbsUp />
            <label>Yes</label>
          </IconButton>
          <IconButton className={classes.likebtn}>
            <ThumbsDown />
            <label>No</label>
          </IconButton>
        </Box>
        <Box textAlign="center">
          <Button variant="contained" color="primary" className={classes.btnyellow}>
            Completed
          </Button>
        </Box>
      </CardContent>
    </div>
  )
}
