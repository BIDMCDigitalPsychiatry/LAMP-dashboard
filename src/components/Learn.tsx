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
  makeStyles,
  Theme,
  createStyles,
  Link,
} from "@material-ui/core"
import LAMP, { Participant as ParticipantObj } from "lamp-core"
import ResponsiveDialog from "./ResponsiveDialog"
import classnames from "classnames"
import { useTranslation } from "react-i18next"
import InfoIcon from "../icons/Info.svg"
import EmbeddedActivity from "./EmbeddedActivity"

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
    thumbContainer: {
      maxWidth: 1055,
      width: "80%",
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        paddingBottom: 80,
      },
    },
    fullwidthBtn: { width: "100%" },
    topicon: {
      minWidth: 150,
      minHeight: 150,
      [theme.breakpoints.up("lg")]: {
        width: 150,
        height: 150,
      },
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
    blankMsg: {
      "& path": { fill: "#666" },
      "& p": { margin: "2px 5px" },
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
  const [launchedActivity, setLaunchedActivity] = useState<string>()
  const [spec, setSpec] = useState(null)
  const { t } = useTranslation()

  useEffect(() => {
    let gActivities = activities.filter((x: any) => x.spec === "lamp.tips")
    if (gActivities.length > 0) {
      ;(async () => {
        let activityResult = await Promise.all(
          gActivities.map(async (activity) => {
            let iconData = (await LAMP.Type.getAttachment(activity.id, "lamp.dashboard.activity_details")) as any
            return {
              id: activity.id,
              spec: activity.spec,
              name: activity.name,
              settings: activity.settings,
              schedule: activity.schedule,
              icon: iconData.data ? iconData.data.photo : InfoIcon,
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
          id: a.id,
          name: a.name,
          icon: a.icon,
          spec: "lamp.tips",
          settings: a.settings,
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
        {Object.keys(activitiesArray).length > 0 ? (
          Object.keys(activitiesArray).map((key, index) => (
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
                setSpec(activitiesArray[key])
              }}
            >
              <ButtonBase focusRipple className={classes.fullwidthBtn}>
                <Card className={classes.learn}>
                  <Box mt={2} mb={1}>
                    {activitiesArray[key].icon ? <img src={activitiesArray[key].icon} /> : ""}
                  </Box>
                  <Typography className={classes.cardlabel}>{t(key)}</Typography>
                </Card>
              </ButtonBase>
            </Grid>
          ))
        ) : (
          <Box display="flex" className={classes.blankMsg} ml={1}>
            <Icon>info</Icon> <p>{t("There are no Learn activities available.")}</p>
          </Box>
        )}
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
            <Icon>close</Icon>
          </IconButton>
          <div className={classes.header}>
            <Box mt={2} mb={1}>
              {icon ? <img src={icon} /> : ""}
            </Box>
            <Typography variant="h2">{t(tip)}</Typography>
          </div>
        </DialogTitle>
        <DialogContent className={classes.dialogueContent}>
          {t("Quick Tips to Improve Your")} {t(tip)}
        </DialogContent>
        <DialogActions>
          <Box textAlign="center" width={1} mt={1} mb={4}>
            <Link
              onClick={() => {
                setOpen(false)
                setOpenData(true)
                setLaunchedActivity(spec)
              }}
              underline="none"
              className={classnames(classes.btnyellow, classes.linkButton)}
            >
              {t("Read")}
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
        <EmbeddedActivity
          name={spec?.description ?? ""}
          activity={spec ?? []}
          participant={participant}
          onComplete={() => {
            setOpenData(false)
          }}
        />
      </ResponsiveDialog>
    </Container>
  )
}
