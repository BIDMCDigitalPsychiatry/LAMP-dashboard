// Core Imports
import React, { useState } from "react"
import {
  Container,
  Typography,
  Grid,
  Card,
  Box,
  AppBar,
  Toolbar,
  Icon,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@material-ui/core"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import { Participant as ParticipantObj } from "lamp-core"
import { ReactComponent as Book } from "../icons/Book.svg"
import { ReactComponent as MoodTips } from "../icons/MoodTips.svg"
import { ReactComponent as SleepTips } from "../icons/SleepTips.svg"
import { ReactComponent as Chat } from "../icons/Chat.svg"
import { ReactComponent as Wellness } from "../icons/Wellness.svg"
import { ReactComponent as PaperLens } from "../icons/PaperLens.svg"
import { ReactComponent as Info } from "../icons/Info.svg"
import { ReactComponent as Lightning } from "../icons/Lightning.svg"
import ResponsiveDialog from "./ResponsiveDialog"
import BottomMenu from "./BottomMenu"
import LearnTips from "./LearnTips"

import Link from "@material-ui/core/Link"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cardlabel: {
      fontSize: 16,
      padding: "0 18px",
      bottom: 15,
      position: "absolute",
      width: "100%",
      [theme.breakpoints.up("lg")]: {
        fontSize: 18,
      },
    },
    inlineHeader: {
      background: "#FFFFFF",
      boxShadow: "none",

      "& h5": { fontSize: 25, paddingLeft: 20, color: "rgba(0, 0, 0, 0.75)", fontWeight: 600 },
    },
    toolbardashboard: {
      minHeight: 65,
      "& h5": {
        color: "rgba(0, 0, 0, 0.75)",
        textAlign: "center",
        fontWeight: "600",
        fontSize: 18,
        width: "100%",
      },
    },
    backbtn: { paddingLeft: 0, paddingRight: 0 },
    learn: {
      background: "#FFF9E5",
      padding: "10px 0",
      minHeight: 180,
      textAlign: "center",
      boxShadow: "none",
      borderRadius: 18,
      position: "relative",
      "& svg": {
        [theme.breakpoints.up("lg")]: {
          width: 150,
          height: 150,
        },
      },

      [theme.breakpoints.up("lg")]: {
        minHeight: 240,
      },
    },
    thumbMain: { maxWidth: 255 },
    thumbContainer: { maxWidth: 1055 },
  })
)

export default function Learn({ participant, ...props }: { participant: ParticipantObj; activeTab: Function }) {
  const classes = useStyles()
  const [tip, setTip] = useState(null)
  const [openData, setOpenData] = useState(false)
  const supportsSidebar = useMediaQuery(useTheme().breakpoints.up("md"))

  return (
    <Container className={classes.thumbContainer}>
      <Grid container spacing={2} direction="row" justify="flex-start" alignItems="center">
        <Grid
          item
          xs={6}
          sm={4}
          md={3}
          lg={3}
          className={classes.thumbMain}
          onClick={() => {
            setTip("Mood")
            setOpenData(true)
          }}
        >
          <Card className={classes.learn}>
            <Box mt={2} mb={1}>
              <MoodTips />
            </Box>
            <Typography className={classes.cardlabel}>Mood Tips</Typography>
          </Card>
        </Grid>
        <Grid
          item
          xs={6}
          sm={4}
          md={3}
          lg={3}
          className={classes.thumbMain}
          onClick={() => {
            setTip("Sleep")
            setOpenData(true)
          }}
        >
          <Card className={classes.learn}>
            <Box mt={2} mb={1}>
              <SleepTips />
            </Box>
            <Typography className={classes.cardlabel}>Sleep Tips</Typography>
          </Card>
        </Grid>
        <Grid
          item
          xs={6}
          sm={4}
          md={3}
          lg={3}
          className={classes.thumbMain}
          onClick={() => {
            setTip("Social")
            setOpenData(true)
          }}
        >
          <Card className={classes.learn}>
            <Box mt={2} mb={1}>
              <Chat />
            </Box>
            <Typography className={classes.cardlabel}>Social Tips</Typography>
          </Card>
        </Grid>
        <Grid
          item
          xs={6}
          sm={4}
          md={3}
          lg={3}
          className={classes.thumbMain}
          onClick={() => {
            setTip("Mental Health Resources")
            setOpenData(true)
          }}
        >
          <Card className={classes.learn}>
            <Box mt={1}>
              <Info />
            </Box>
            <Typography className={classes.cardlabel}>Mental Health Resources</Typography>
          </Card>
        </Grid>
        <Grid
          item
          xs={6}
          sm={4}
          md={3}
          lg={3}
          className={classes.thumbMain}
          onClick={() => {
            setTip("Physical Wellness")
            setOpenData(true)
          }}
        >
          <Card className={classes.learn}>
            <Box mt={2} mb={1}>
              <Wellness />
            </Box>
            <Typography className={classes.cardlabel}>Physical Wellness</Typography>
          </Card>
        </Grid>
        <Grid
          item
          xs={6}
          sm={4}
          md={3}
          lg={3}
          className={classes.thumbMain}
          onClick={() => {
            setTip("Suggested Reading")
            setOpenData(true)
          }}
        >
          <Card className={classes.learn}>
            <Box mt={1}>
              <Book />
            </Box>
            <Typography className={classes.cardlabel}>Suggested Reading</Typography>
          </Card>
        </Grid>
        <Grid
          item
          xs={6}
          sm={4}
          md={3}
          lg={3}
          className={classes.thumbMain}
          onClick={() => {
            setTip("Motivation")
            setOpenData(true)
          }}
        >
          <Card className={classes.learn}>
            <Box mt={2} mb={1}>
              <PaperLens />
            </Box>
            <Typography className={classes.cardlabel}>Motivation</Typography>
          </Card>
        </Grid>
        <Grid
          item
          xs={6}
          sm={4}
          md={3}
          lg={3}
          className={classes.thumbMain}
          onClick={() => {
            setTip("Stress")
            setOpenData(true)
          }}
        >
          <Card className={classes.learn}>
            <Box mt={2} mb={1}>
              <Lightning />
            </Box>
            <Typography className={classes.cardlabel}>Stress Tips</Typography>
          </Card>
        </Grid>
      </Grid>
      <ResponsiveDialog
        transient={false}
        animate
        fullScreen
        open={openData}
        onClose={() => {
          setOpenData(false)
        }}
        style={{ paddingLeft: "100px" }}
      >
        <AppBar position="static" className={classes.inlineHeader}>
          <Toolbar className={classes.toolbardashboard}>
            <IconButton
              onClick={() => setOpenData(false)}
              color="default"
              className={classes.backbtn}
              aria-label="Menu"
            >
              <Icon>arrow_back</Icon>
            </IconButton>
          </Toolbar>
          <Typography variant="h5">{tip}</Typography>
        </AppBar>
        {supportsSidebar && <BottomMenu activeTab={props.activeTab} tabValue={0} />}
        <LearnTips type={tip} closeDialog={() => setOpenData(false)} />
      </ResponsiveDialog>
    </Container>
  )
}
