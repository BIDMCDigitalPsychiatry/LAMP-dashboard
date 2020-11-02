// Core Imports
import React, { useState, useEffect } from "react"
import {
  Container,
  Typography,
  Grid,
  Card,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  ButtonBase,
  Tooltip,
  Backdrop,
  CircularProgress,
} from "@material-ui/core"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import LAMP, { Participant as ParticipantObj, Activity as ActivityObj } from "lamp-core"
import CloseIcon from "@material-ui/icons/Close"
import { ReactComponent as BreatheIcon } from "../icons/Breathe.svg"
import JournalImg from "../icons/Journal.svg"
import { ReactComponent as GoalIcon } from "../icons/Goal.svg"
import { ReactComponent as JournalIcon } from "../icons/Goal.svg"

import { ReactComponent as HopeBoxIcon } from "../icons/HopeBox.svg"
import { ReactComponent as MedicationIcon } from "../icons/Medication.svg"
import InfoIcon from "../icons/Info.svg"
import ScratchImage from "./ScratchImage"
import ScratchCard from "../icons/ScratchCard.svg"
import ResponsiveDialog from "./ResponsiveDialog"
import Resources from "./Resources"
import classnames from "classnames"
import Link from "@material-ui/core/Link"
import JournalEntries from "./JournalEntries"
import Breathe from "./Breathe"
import Goals from "./Goals"
import HopeBoxSelect from "./HopeBoxSelect"
import NewMedication from "./NewMedication"
import EmbeddedActivity from "./EmbeddedActivity"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    linkButton: {
      padding: "15px 25px 15px 25px",
    },
    cardlabel: {
      fontSize: 16,

      padding: "0 18px",
      bottom: 15,
      position: "absolute",
      width: "100%",
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
    centerHeader: {
      "& h2": {
        textAlign: "center !important",
      },
    },
    header: {
      background: "#FFEFEC",
      padding: "35px 40px 10px",
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
    btnpeach: {
      background: "#FFAC98",
      borderRadius: "40px",
      minWidth: "200px",
      boxShadow: " 0px 10px 15px rgba(255, 172, 152, 0.25)",
      lineHeight: "22px",
      display: "inline-block",
      textTransform: "capitalize",
      fontSize: "16px",
      color: "rgba(0, 0, 0, 0.75)",
      fontWeight: "bold",
      marginBottom: 20,
      cursor: "pointer",
      "& span": { cursor: "pointer" },
      "&:hover": {
        boxShadow:
          "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
      },
    },
    topicon: {
      minWidth: 150,
      minHeight: 150,
      [theme.breakpoints.up("lg")]: {
        width: 150,
        height: 150,
      },
    },
    dialogueContent: {
      padding: "20px 40px 40px",
      "& h4": { fontSize: 16, fontWeight: "bold", marginBottom: 15 },
    },
    dialogtitle: { padding: 0 },
    manage: {
      background: "#FFEFEC",
      padding: "10px 0",
      minHeight: 180,
      textAlign: "center",
      boxShadow: "none",
      borderRadius: 18,
      position: "relative",
      width: "100%",
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

    mainIcons: {
      width: 100,
      height: 100,
      [theme.breakpoints.up("lg")]: {
        width: 150,
        height: 150,
      },
    },

    thumbMain: { maxWidth: 255 },
    thumbContainer: { maxWidth: 1055 },
    fullwidthBtn: { width: "100%" },
    dialogueCurve: { borderRadius: 10, maxWidth: 400, minWidth: "280px" },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
  })
)

const games = ["lamp.jewels_a", "lamp.jewels_b", "lamp.spatial_span", "lamp.cats_and_dogs"]

async function getImage(activityId: string) {
  return [await LAMP.Type.getAttachment(activityId, "lamp.dashboard.activity_details")].map((y: any) =>
    !!y.error ? undefined : y.data
  )[0]
}

export default function Manage({ participant, activities, ...props }) {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const [dialogueType, setDialogueType] = React.useState("")
  const [launchedActivity, setLaunchedActivity] = useState<string>()
  const [classType, setClassType] = useState("")
  const [activityName, setActivityName] = useState(null)
  const [activity, setActivity] = useState(null)
  const [tag, setTag] = useState([])
  const [savedActivities, setSavedActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [spec, setSpec] = useState(null)

  useEffect(() => {
    setLoading(true)
    let gActivities = activities.filter(
      (x: any) =>
        games.includes(x.spec) ||
        x.spec === "lamp.journal" ||
        x.spec === "lamp.breathe" ||
        x.spec === "lamp.scratch_image"
    )
    setSavedActivities(gActivities)
  }, [])

  useEffect(() => {
    if (savedActivities.length > 0) {
      setLoading(true)
      ;(async () => {
        let tags = []
        let images = await savedActivities.map((activity, index) => {
          ;(async () => {
            tags[activity.id] = await getImage(activity.id)
            setTag(tags)
            if (index === savedActivities.length - 1) {
              setLoading(false)
              setTag(tags)
              return tags
            }
          })()
        })
        setTag(images)
      })()
    } else {
      setLoading(false)
    }
  }, [savedActivities])

  const handleClickOpen = (type: string) => {
    setDialogueType(type)
    let classT = type === "lamp.scratch_image" ? classnames(classes.header, classes.scratch) : classes.header
    setClassType(classT)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Container className={classes.thumbContainer}>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid container spacing={2}>
        {savedActivities.map((activity) => (
          <Grid
            item
            xs={6}
            sm={4}
            md={3}
            lg={3}
            onClick={() => {
              setSpec(activity.spec)
              setActivity(activity)
              handleClickOpen(activity.spec)
            }}
            className={classes.thumbMain}
          >
            <ButtonBase focusRipple className={classes.fullwidthBtn}>
              <Card className={classes.manage}>
                <Box mt={2} mb={1}>
                  <Box
                    className={classes.mainIcons}
                    style={{
                      margin: "auto",
                      background: tag[activity.id]?.photo
                        ? `url(${tag[activity?.id]?.photo}) center center/contain no-repeat`
                        : activity.spec === "lamp.breathe"
                        ? `url(${BreatheIcon}) center center/contain no-repeat`
                        : activity.spec === "lamp.journal"
                        ? `url(${JournalIcon}) center center/contain no-repeat`
                        : activity.spec === "lamp.scratch_image"
                        ? `url(${ScratchCard}) center center/contain no-repeat`
                        : `url(${InfoIcon}) center center/contain no-repeat`,
                    }}
                  ></Box>
                </Box>
                <Typography className={classes.cardlabel}>{activity.name}</Typography>
              </Card>
            </ButtonBase>
          </Grid>
        ))}
      </Grid>
      {/*  <Grid item xs={6} sm={4} md={3} lg={3} onClick={() => handleClickOpen("Goals")} className={classes.thumbMain}>
          <ButtonBase focusRipple className={classes.fullwidthBtn}>
            <Card className={classes.manage}>
              <Box mt={2} mb={1}>
                <GoalIcon />
              </Box>
              <Typography className={classes.cardlabel}>New goal</Typography>
            </Card>
          </ButtonBase>
        </Grid>
        <Grid item xs={6} sm={4} md={3} lg={3} onClick={() => {
              setSpec(null)
              handleClickOpen("HopeBox")
            }} className={classes.thumbMain}>
          <ButtonBase focusRipple className={classes.fullwidthBtn}>
            <Card className={classes.manage}>
              <Box mt={1}>
                <HopeBoxIcon />
              </Box>
              <Typography className={classes.cardlabel}>Hope box</Typography>
            </Card>
          </ButtonBase>
        </Grid> */}
      {/* <Grid
          item
          xs={6}
          sm={4}
          md={3}
          lg={3}
          onClick={() => {
            setSpec(null)
            handleClickOpen("Medication_tracker")
          }}
          className={classes.thumbMain}
        >
          <ButtonBase focusRipple className={classes.fullwidthBtn}>
            <Card className={classes.manage}>
              <Box mt={2} mb={1}>
                <MedicationIcon />
              </Box>
              <Typography className={classes.cardlabel}>Medication tracker</Typography>
            </Card>
          </ButtonBase>
         </Grid> */}

      <ResponsiveDialog
        transient={games.includes(spec) ? true : false}
        animate
        fullScreen
        open={!!launchedActivity}
        onClose={() => {
          setOpen(false)
          setLaunchedActivity(undefined)
        }}
      >
        {
          {
            Goals: (
              <Goals
                participant={participant}
                onComplete={() => {
                  setOpen(false)
                  setLaunchedActivity(undefined)
                }}
              />
            ),
            "lamp.journal": (
              <JournalEntries
                participant={participant}
                activityId={activity?.id ?? null}
                onComplete={() => {
                  setOpen(false)
                  setLaunchedActivity(undefined)
                }}
              />
            ),
            "lamp.scratch_image": (
              <ScratchImage
                onComplete={() => {
                  setOpen(false)
                  setLaunchedActivity(undefined)
                }}
              />
            ),
            "lamp.breathe": (
              <Breathe
                activity={activity}
                participant={participant}
                onComplete={() => {
                  setOpen(false)
                  setLaunchedActivity(undefined)
                }}
              />
            ),
            HopeBox: (
              <HopeBoxSelect
                onComplete={() => {
                  setOpen(false)
                  setLaunchedActivity(undefined)
                }}
              />
            ),
            resources: <Resources onComplete={() => setLaunchedActivity(undefined)} />,
            Medication_tracker: (
              <NewMedication
                participant={participant}
                onComplete={() => {
                  setOpen(false)
                  setLaunchedActivity(undefined)
                }}
              />
            ),
            Game: (
              <EmbeddedActivity
                name={activity?.name ?? null}
                activity={activity}
                participant={participant}
                onComplete={() => {
                  setOpen(false)
                  setLaunchedActivity(undefined)
                }}
              />
            ),
          }[launchedActivity ?? ""]
        }
      </ResponsiveDialog>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        classes={{
          root: classes.dialogueStyle,
          paper: classes.dialogueCurve,
        }}
      >
        <DialogTitle id="alert-dialog-slide-title" className={classes.dialogtitle}>
          <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
          <div className={classType}>
            <Box mt={2} mb={1}>
              <Box
                className={classes.topicon}
                style={{
                  margin: "auto",
                  background: tag[activity?.id]?.photo
                    ? `url(${tag[activity?.id]?.photo}) center center/contain no-repeat`
                    : activity?.spec === "lamp.breathe"
                    ? `url(${BreatheIcon}) center center/contain no-repeat`
                    : activity?.spec === "lamp.journal"
                    ? `url(${JournalIcon}) center center/contain no-repeat`
                    : activity?.spec === "lamp.scrath_image"
                    ? `url(${ScratchCard}) center center/contain no-repeat`
                    : `url(${InfoIcon}) center center/contain no-repeat`,
                }}
              ></Box>

              {/* {dialogueType === "Goals" && <GoalIcon className={classes.topicon} />}
              {dialogueType === "HopeBox" && <HopeBoxIcon className={classes.topicon} />}
              {dialogueType === "Medication_tracker" && <MedicationIcon className={classes.topicon} />} */}
            </Box>
            <Box>
              <Typography variant="body2" align="left">
                Manage
              </Typography>
              <Typography variant="h2">{activity?.name ?? (spec !== null ? " (" + spec + ")" : "")}</Typography>
            </Box>
          </div>
        </DialogTitle>
        <DialogContent className={classes.dialogueContent}>
          {tag[activity?.id]?.description && (
            <Box>
              <Typography variant="h4" gutterBottom>
                {tag[activity.id]?.description.split(".")[0]}
              </Typography>
              {tag[activity?.id]?.description.split(".").length > 1 && (
                <Typography variant="body2" component="p">
                  {tag[activity?.id]?.description.split(".").slice(1).join(".")}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Box textAlign="center" width={1} mt={1} mb={4}>
            <Link
              onClick={() => {
                setLaunchedActivity(games.includes(spec) ? "Game" : spec)
              }}
              underline="none"
              className={classnames(classes.btnpeach, classes.linkButton)}
            >
              Begin
            </Link>
          </Box>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
