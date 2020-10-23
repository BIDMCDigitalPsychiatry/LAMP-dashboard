// Core Imports
import React, { useState, useEffect } from "react"
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
  ButtonBase,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Backdrop,
  CircularProgress,
} from "@material-ui/core"
import CloseIcon from "@material-ui/icons/Close"
import LAMP from "lamp-core"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import { Participant as ParticipantObj } from "lamp-core"
import ResponsiveDialog from "./ResponsiveDialog"
import LearnTips from "./LearnTips"
import classnames from "classnames"
import Link from "@material-ui/core/Link"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cardlabel: {
      fontSize: 16,
      lineHeight: "18px",
      padding: "0 18px",
      bottom: 15,
      position: "absolute",
      width: "100%",
      [theme.breakpoints.up("lg")]: {
        fontSize: 18,
        lineHeight: "22px",
      },
    },
    header: {
      background: "#FFF9E5",
      padding: 20,
      textAlign: "center",

      "& h2": {
        fontSize: 25,
        fontWeight: 600,
        color: "rgba(0, 0, 0, 0.75)",
        textAlign: "left",
      },
      "& img": {
        maxWidth: 175,
        margin: "20px 0 10px",
      },
    },
    linkButton: {
      padding: "15px 40px 15px 40px",
    },
    dialogueContent: {
      padding: 20,
      "& h4": { fontSize: 16, fontWeight: "bold", marginBottom: 15 },
    },
    inlineHeader: {
      background: "#FFFFFF",
      boxShadow: "none",

      "& h5": { fontSize: 25, paddingLeft: 20, color: "rgba(0, 0, 0, 0.75)", fontWeight: 600 },
    },
    toolbardashboard: {
      minHeight: 65,
      [theme.breakpoints.down("xs")]: {
        display: "block",
      },
      "& h5": {
        color: "rgba(0, 0, 0, 0.75)",
        textAlign: "left",
        fontWeight: "600",
        fontSize: 18,
        width: "calc(100% - 96px)",
        [theme.breakpoints.down("xs")]: {
          paddingLeft: 0,
        },
      },
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    dialogueStyle: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    dialogtitle: { padding: 0 },
    backbtn: {
      [theme.breakpoints.down("xs")]: {
        paddingLeft: 0,
      },
    },
    learn: {
      background: "#FFF9E5",
      padding: "10px 0",
      minHeight: 180,
      textAlign: "center",
      boxShadow: "none",
      borderRadius: 18,
      position: "relative",
      width: "100%",
      "& svg": {
        [theme.breakpoints.down("md")]: {
          width: 100,
          height: 100,
        },
        [theme.breakpoints.up("lg")]: {
          width: 150,
          height: 150,
        },
      },
      "& img": {
        [theme.breakpoints.down("md")]: {
          width: 100,
          height: 100,
        },
        [theme.breakpoints.up("lg")]: {
          width: 140,
          height: 140,
        },
      },
      [theme.breakpoints.up("lg")]: {
        minHeight: 240,
      },
    },
    thumbMain: { maxWidth: 255 },
    thumbContainer: { maxWidth: 1055 },
    fullwidthBtn: { width: "100%" },
    topicon: {
      minWidth: 120,
    },
    tipicon: {
      minWidth: 200,
      minHeight: 200,

      [theme.breakpoints.down("xs")]: {
        minWidth: 180,
        minHeight: 180,
      },
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
      "&:hover": {
        boxShadow:
          "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
      },
    },
    dialogueCurve: { borderRadius: 10, maxWidth: 335, minWidth: 335 },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
  })
)

export default function Learn({
  participant,
  activities,
  ...props
}: {
  participant: ParticipantObj
  activities: any
  activeTab: Function
}) {
  const classes = useStyles()
  const [details, setDetails] = useState(null)
  const [openData, setOpenData] = useState(false)
  const [open, setOpen] = useState(false)
  const [tip, setTip] = useState(null)
  const [icon, setIcon] = useState(null)
  const [loading, setLoading] = useState(true)
  const [savedActivities, setSavedActivities] = useState([])
  const [activitiesArray, setActivitiesArray] = useState({})

  useEffect(() => {
    let gActivities = activities.filter((x: any) => x.spec === "lamp.tips")
    if (gActivities.length > 0) {
      ;(async () => {
        let activityResult = await Promise.all(
          gActivities.map(async (activity) => {
            let iconData = (await LAMP.Type.getAttachment(activity.id, "lamp.dashboard.tip_details")) as any
            return {
              id: activity.id,
              spec: activity.spec,
              name: activity.name,
              settings: activity.settings,
              schedule: activity.schedule,
              icon: iconData.data ? iconData.data.icon : undefined,
            }
          })
        )
        setSavedActivities(activityResult)
      })()
    } else {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    ;(async () => {
      let activityData = await savedActivities.reduce(function (r, a) {
        r[a.name] = r[a.name] || []
        r[a.name] = {
          description: a.name,
          icon: a.icon,
          data: a.settings,
        }
        setLoading(false)
        return r
      }, Object.create(null))
      setActivitiesArray(activityData)
    })()
  }, [savedActivities])

  const setData = (type: string) => {
    setTip(type.replace(/_/g, " "))
    setIcon(activitiesArray[type].icon)
    Object.keys(activitiesArray[type])?.forEach((key) => {
      setDetails(activitiesArray[type][key])
    })
  }

  return (
    <Container className={classes.thumbContainer}>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid container spacing={2} direction="row" justify="flex-start" alignItems="center">
        {Object.keys(activitiesArray).length > 0
          ? Object.keys(activitiesArray).map((key, index) => (
              <Grid
                item
                key={index}
                xs={6}
                sm={4}
                md={3}
                lg={3}
                className={classes.thumbMain}
                onClick={() => {
                  setData(key)
                  setOpen(true)
                }}
              >
                <ButtonBase focusRipple className={classes.fullwidthBtn}>
                  <Card className={classes.learn}>
                    <Box mt={2} mb={1}>
                      {activitiesArray[key].icon ? <img src={activitiesArray[key].icon} /> : ""}
                    </Box>
                    <Typography className={classes.cardlabel}>{key}</Typography>
                  </Card>
                </ButtonBase>
              </Grid>
            ))
          : ""}
      </Grid>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        scroll="paper"
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        classes={{
          root: classes.dialogueStyle,
          paper: classes.dialogueCurve,
        }}
      >
        <DialogTitle id="alert-dialog-slide-title" className={classes.dialogtitle}>
          <IconButton aria-label="close" className={classes.closeButton} onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
          <div className={classes.header}>
            <Box mt={2} mb={1}>
              {icon ? <img src={icon} /> : ""}
            </Box>
            <Typography variant="h2">{tip}</Typography>
          </div>
        </DialogTitle>
        <DialogContent className={classes.dialogueContent}>Quick Tips to Improve Your {tip}</DialogContent>
        <DialogActions>
          <Box textAlign="center" width={1} mt={1} mb={4}>
            <Link
              onClick={() => {
                setOpen(false)
                setOpenData(true)
              }}
              underline="none"
              className={classnames(classes.btnyellow, classes.linkButton)}
            >
              Read
            </Link>
          </Box>
        </DialogActions>
      </Dialog>
      <ResponsiveDialog
        transient={false}
        animate
        fullScreen
        open={openData}
        onClose={() => {
          setOpenData(false)
        }}
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
            <Typography variant="h5">{tip}</Typography>
          </Toolbar>
        </AppBar>
        <LearnTips tip={tip} icon={icon} details={details} closeDialog={() => setOpenData(false)} />
      </ResponsiveDialog>
    </Container>
  )
}
