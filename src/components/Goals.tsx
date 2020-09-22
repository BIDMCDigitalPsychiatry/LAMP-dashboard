// Core Imports
import React, { useState } from "react"
import {
  Container,
  Typography,
  Grid,
  Card,
  Box,
  IconButton,
  ButtonBase,
  AppBar,
  Toolbar,
  Icon,
} from "@material-ui/core"

import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import { ReactComponent as Exercise } from "../icons/Exercise.svg"
import { ReactComponent as Reading } from "../icons/Reading.svg"
import { ReactComponent as Sleeping } from "../icons/Sleeping.svg"
import { ReactComponent as Nutrition } from "../icons/Nutrition.svg"
import { ReactComponent as Medication } from "../icons/Medication.svg"
import { ReactComponent as Emotions } from "../icons/Emotions.svg"
import { ReactComponent as BreatheIcon } from "../icons/Breathe.svg"
import { ReactComponent as Savings } from "../icons/Savings.svg"
import { ReactComponent as Weight } from "../icons/Weight.svg"
import { ReactComponent as Custom } from "../icons/Custom.svg"
import ResponsiveDialog from "./ResponsiveDialog"
import NewGoals from "./NewGoal"
import classnames from "classnames"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbardashboard: {
      minHeight: 65,
      padding: "0 10px",
      "& h5": {
        color: "rgba(0, 0, 0, 0.75)",
        textAlign: "center",
        fontWeight: "600",
        fontSize: 18,
        width: "calc(100% - 96px)",
      },
    },

    cardlabel: {
      fontSize: 14,

      padding: "0 18px",
      bottom: 8,
      position: "absolute",
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        bottom: 30,
      },
    },

    header: {
      background: "#FFEFEC",
      padding: "25px 20px 10px",
      textAlign: "center",

      "& h2": {
        fontSize: 25,
        fontWeight: 600,
        color: "rgba(0, 0, 0, 0.75)",
        textAlign: "left",
      },
      "& h6": {
        fontSize: "14px",
        fontWeight: "normal",
        textAlign: "left",
      },
    },
    scratch: {
      "& h2": {
        textAlign: "center !important",
      },
      "& h6": {
        textAlign: "center !important",
      },
    },

    topicon: {
      minWidth: 120,
    },
    dialogueContent: {
      padding: 20,
      "& h4": { fontSize: 16, fontWeight: "bold", marginBottom: 15 },
    },
    dialogtitle: { padding: 0 },
    manage: {
      background: "#FFEFEC",
      padding: "10px 0",
      minHeight: 105,
      textAlign: "center",
      boxShadow: "none",
      borderRadius: 10,
      position: "relative",
      width: "100%",
      "& svg": {
        [theme.breakpoints.up("lg")]: {
          width: 150,
          height: 150,
          marginTop: 20,
        },
        [theme.breakpoints.down("md")]: {
          width: 130,
          height: 130,
          marginTop: 20,
        },
        [theme.breakpoints.down("xs")]: {
          width: 60,
          height: 60,
          marginTop: 0,
        },
      },

      [theme.breakpoints.up("sm")]: {
        minHeight: 230,
      },
      [theme.breakpoints.up("lg")]: {
        minHeight: 240,
      },
    },
    thumbMain: { maxWidth: 255 },
    thumbContainer: { maxWidth: 1055 },
    fullwidthBtn: { width: "100%" },
    goalHeading: {
      textAlign: "center",
      "& h5": { fontSize: 18, fontWeight: 600, margin: "25px 0 15px", color: "rgba(0, 0, 0, 0.75)" },
      "& h6": {
        fontSize: 14,
        color: "rgba(0, 0, 0, 0.4)",
        marginBottom: 15,
      },
    },
  })
)

export default function Goals({ participant, ...props }) {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const [dialogueType, setDialogueType] = React.useState("")
  const [classType, setClassType] = useState("")
  const [goalType, setGoalType] = useState("")

  const handleClickOpen = (type: string) => {
    setGoalType(type)
    setDialogueType(type)
    let classT = type === "Scratch card" ? classnames(classes.header, classes.scratch) : classes.header
    setClassType(classT)
    setOpen(true)
  }

  return (
    <div>
      <AppBar position="static" style={{ background: "#FBF1EF", boxShadow: "none" }}>
        <Toolbar className={classes.toolbardashboard}>
          <IconButton onClick={props.onComplete} color="default" aria-label="Menu">
            <Icon>arrow_back</Icon>
          </IconButton>
          <Typography variant="h5">Create goal</Typography>
        </Toolbar>
      </AppBar>
      <Box className={classes.goalHeading}>
        <Typography variant="h5">What type of goal?</Typography>
        <Typography variant="subtitle1">Choose a category</Typography>
      </Box>
      <Container className={classes.thumbContainer}>
        <Grid container spacing={2}>
          <Grid
            item
            xs={4}
            sm={4}
            md={3}
            lg={3}
            onClick={() => handleClickOpen("Exercise")}
            className={classes.thumbMain}
          >
            <ButtonBase focusRipple className={classes.fullwidthBtn}>
              <Card className={classes.manage}>
                <Box>
                  <Exercise />
                </Box>
                <Typography className={classes.cardlabel}>Exercise</Typography>
              </Card>
            </ButtonBase>
          </Grid>
          <Grid
            item
            xs={4}
            sm={4}
            md={3}
            lg={3}
            onClick={() => handleClickOpen("Weight")}
            className={classes.thumbMain}
          >
            <ButtonBase focusRipple className={classes.fullwidthBtn}>
              <Card className={classes.manage}>
                <Box>
                  <Weight />
                </Box>
                <Typography className={classes.cardlabel}>Weight</Typography>
              </Card>
            </ButtonBase>
          </Grid>
          <Grid
            item
            xs={4}
            sm={4}
            md={3}
            lg={3}
            onClick={() => handleClickOpen("Nutrition")}
            className={classes.thumbMain}
          >
            <ButtonBase focusRipple className={classes.fullwidthBtn}>
              <Card className={classes.manage}>
                <Box>
                  <Nutrition />
                </Box>
                <Typography className={classes.cardlabel}>Nutrition</Typography>
              </Card>
            </ButtonBase>
          </Grid>
          <Grid item xs={4} sm={4} md={3} lg={3} onClick={() => handleClickOpen("Sleep")} className={classes.thumbMain}>
            <ButtonBase focusRipple className={classes.fullwidthBtn}>
              <Card className={classes.manage}>
                <Box>
                  <Sleeping />
                </Box>
                <Typography className={classes.cardlabel}>Sleep</Typography>
              </Card>
            </ButtonBase>
          </Grid>
          <Grid
            item
            xs={4}
            sm={4}
            md={3}
            lg={3}
            onClick={() => handleClickOpen("Meditation")}
            className={classes.thumbMain}
          >
            <ButtonBase focusRipple className={classes.fullwidthBtn}>
              <Card className={classes.manage}>
                <Box>
                  <BreatheIcon />
                </Box>
                <Typography className={classes.cardlabel}>Meditation</Typography>
              </Card>
            </ButtonBase>
          </Grid>
          <Grid
            item
            xs={4}
            sm={4}
            md={3}
            lg={3}
            onClick={() => handleClickOpen("Reading")}
            className={classes.thumbMain}
          >
            <ButtonBase focusRipple className={classes.fullwidthBtn}>
              <Card className={classes.manage}>
                <Box>
                  <Reading />
                </Box>
                <Typography className={classes.cardlabel}>Reading</Typography>
              </Card>
            </ButtonBase>
          </Grid>
          <Grid
            item
            xs={4}
            sm={4}
            md={3}
            lg={3}
            onClick={() => handleClickOpen("Finances")}
            className={classes.thumbMain}
          >
            <ButtonBase focusRipple className={classes.fullwidthBtn}>
              <Card className={classes.manage}>
                <Box>
                  <Savings />
                </Box>
                <Typography className={classes.cardlabel}>Finances</Typography>
              </Card>
            </ButtonBase>
          </Grid>
          <Grid item xs={4} sm={4} md={3} lg={3} onClick={() => handleClickOpen("Mood")} className={classes.thumbMain}>
            <ButtonBase focusRipple className={classes.fullwidthBtn}>
              <Card className={classes.manage}>
                <Box mt={1}>
                  <Emotions />
                </Box>
                <Typography className={classes.cardlabel}>Mood</Typography>
              </Card>
            </ButtonBase>
          </Grid>

          <Grid
            item
            xs={4}
            sm={4}
            md={3}
            lg={3}
            onClick={() => handleClickOpen("Medication")}
            className={classes.thumbMain}
          >
            <ButtonBase focusRipple className={classes.fullwidthBtn}>
              <Card className={classes.manage}>
                <Box>
                  <Medication />
                </Box>
                <Typography className={classes.cardlabel}>Medication</Typography>
              </Card>
            </ButtonBase>
          </Grid>
          <Grid
            item
            xs={4}
            sm={4}
            md={3}
            lg={3}
            onClick={() => handleClickOpen("Custom")}
            className={classes.thumbMain}
          >
            <ButtonBase focusRipple className={classes.fullwidthBtn}>
              <Card className={classes.manage}>
                <Box>
                  <Custom />
                </Box>
                <Typography className={classes.cardlabel}>Custom</Typography>
              </Card>
            </ButtonBase>
          </Grid>
        </Grid>
        <ResponsiveDialog
          transient={false}
          animate
          fullScreen
          open={open}
          onClose={() => {
            setOpen(false)
          }}
        >
          <NewGoals
            participant={participant}
            goalType={goalType}
            onComplete={() => {
              setOpen(false)
            }}
          />
        </ResponsiveDialog>
      </Container>
    </div>
  )
}
