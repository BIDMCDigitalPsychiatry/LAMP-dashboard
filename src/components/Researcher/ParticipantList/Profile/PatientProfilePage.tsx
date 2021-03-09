// Core Imports
import React, { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Grid,
  Button,
  MenuItem,
  Popover,
  TextField,
  ButtonBase,
  InputBase,
  Container,
  Link,
  DialogTitle,
  Tooltip,
  DialogContentText,
  DialogActions,
  Fab,
  AppBar,
  Toolbar,
  Icon,
  IconButton,
  Divider,
  Dialog,
  DialogContent,
  Backdrop,
  CircularProgress,
  InputAdornment,
} from "@material-ui/core"
import { makeStyles, createStyles, withStyles, createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import { useSnackbar } from "notistack"
import Close from "@material-ui/icons/Close"
import AddCircleOutline from "@material-ui/icons/AddCircleOutline"
import { useTranslation } from "react-i18next"
import { ReactComponent as Key } from "../icons/Key.svg"
import { ReactComponent as Message } from "../../../../icons/Message.svg"
import Messages from "../../../Messages"
import LAMP, { Study, Sensor } from "lamp-core"
import { CredentialManager, CredentialEditor, updateDetails } from "../../../CredentialManager"
import ResponsiveDialog from "../../../ResponsiveDialog"
import Participant from "../../../Participant"
import AddActivity from "../../ActivityList/AddActivity"
import Activity from "../../ActivityList/Activity"
import {
  unspliceActivity,
  unspliceTipsActivity,
  spliceActivity,
  updateActivityData,
  saveGroupActivity,
  saveTipActivity,
  saveSurveyActivity,
  saveCTestActivity,
} from "../../ActivityList/Index"
import SensorListItem from "../../SensorsList/SensorListItem"
import AddSensor from "../../SensorsList/AddSensor"
import ActivityItem from "../../ActivityList/ActivityItem"
import { Service } from "../../../DBService/DBService"
import ConfirmationDialog from "./ConfirmationDialog"
import SensorRow from "./SensorRow"
import ActivityRow from "./ActivityRow"
import UpdateCredential from "./UpdateCredential"
import addActivity from "../../ActivityList/Activity"

const theme = createMuiTheme({
  overrides: {
    MuiFilledInput: {
      root: {
        border: 0,
        backgroundColor: "#f4f4f4",
        borderRadius: "10px !important",
      },
      underline: {
        "&&&:before": {
          borderBottom: "none",
        },
        "&&:after": {
          borderBottom: "none",
        },
      },
    },
    MuiTextField: {
      root: { width: "100%" },
    },
    MuiDivider: {
      root: { margin: "25px 0" },
    },
  },
})

const CssTextField = withStyles({
  root: {
    "label + &": {},
  },
  input: {
    fontSize: 16,
    fontFamily: "Inter",
    fontWeight: "bold",
    color: "rgba(0, 0, 0, 0.75)",
  },
})(InputBase)

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    backdrop: {
      zIndex: 111111,
      color: "#fff",
    },

    buttonContainer: {
      width: 200,
      height: 50,
      marginTop: 91,
      background: "#7599FF",
      boxShadow: "0px 10px 15px rgba(96, 131, 231, 0.2)",
      borderRadius: 25,
    },
    buttonText: {
      fontWeight: "bold",
      fontSize: 16,
      color: "white",
    },
    padding20: {
      padding: "20px",
    },
    backContainer: {
      width: 200,
      height: 50,
      borderRadius: 25,
      backgroundColor: "transparent",
      marginTop: 10,
      alignItems: "center",
      justifyContent: "center",
      display: "flex",
    },
    backText: {
      fontWeight: "bold",
      fontSize: 16,
      color: "#4C66D6",
    },
    buttonsContainer: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      marginTop: 55,
      marginBottom: 55,
      alignItems: "center",
      justifyContent: "center",
    },
    headerButton: {
      position: "absolute",
      width: 105,
      height: 50,
      right: 60,
      top: 25,
      background: "#7599FF",
      boxShadow: "0px 10px 15px rgba(96, 131, 231, 0.2)",
      borderRadius: 25,
      zIndex: 1111,
      "&:hover": { background: "#5680f9" },
    },

    PopupButton: {
      marginTop: 35,
      width: 168,
      height: 50,
      background: "#7599FF",
      boxShadow: "0px 10px 15px rgba(96, 131, 231, 0.2)",
      borderRadius: 25,
      marginBottom: 40,
      "&:hover": { background: "#5680f9" },
    },
    sectionTitle: {
      color: "rgba(0, 0, 0, 0.75)",
      fontSize: 25,
      fontWeight: "bold",
      marginTop: 50,
    },
    inputContainer: {
      backgroundColor: "#F5F5F5",
      borderRadius: 10,
      marginTop: 17,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: 60,
      paddingRight: 20,
      paddingLeft: 20,
    },
    inputDescription: {
      fontSize: 12,
      color: "rgba(0, 0, 0, 0.5)",
      fontWeight: "bold",
      width: "100%",
      textAlign: "right",
    },
    contentContainer: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
    },
    groupTitle: {
      fontSize: 12,
      color: "rgba(0, 0, 0, 0.4)",
      textTransform: "uppercase",
    },
    rowContainer: {
      display: "flex",
      width: "100%",
      alignItems: "center",
      height: 36,
      fontWeight: 600,
    },
    contentText: {
      color: "rgba(0, 0, 0, 0.75)",
      fontWeight: "bold",
      fontSize: 14,
      marginLeft: 10,
    },
    deleteButton: {
      width: 16,
      height: 16,
      color: "rgba(0, 0, 0, 0.45)",
      marginRight: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    addContainer: {
      display: "flex",
      alignItems: "center",
    },
    addButtonTitle: {
      color: "#5784EE",
      fontWeight: 600,
      fontSize: 14,
    },
    addButton: {
      marginRight: 19,
      color: "#5784EE",
      width: 22,
      height: 22,
      marginLeft: 6,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    popWidth: { width: "95%", maxWidth: "500px", padding: "0 40px" },
    containerWidth: { maxWidth: 1055 },
    inputWidth: { width: "100%" },
    linkBtn: { color: "#6083E7", fontSize: 14, fontWeight: 500, "& svg": { marginRight: 15 } },
    chatDrawerCustom: { minWidth: 411 },
    profileMessage: {
      background: "#7599FF",
      bottom: 30,
      right: 40,
      "&:hover": { background: "#5680f9" },
      "& svg": {
        "& path": { fill: "#fff", fillOpacity: 1 },
      },
    },
    customPopover: { backgroundColor: "rgba(0, 0, 0, 0.4)" },
    customPaper: {
      maxWidth: 380,
      maxHeight: 500,

      marginLeft: 100,
      borderRadius: 10,
      padding: "10px 0",
      "& h6": { fontSize: 16 },
      "& li": {
        display: "inline-block",
        width: "100%",
        padding: "15px 30px",
        "&:hover": { backgroundColor: "#ECF4FF" },
      },
      "& *": { cursor: "pointer" },
    },
    toolbardashboard: {
      minHeight: 100,
      padding: "0 10px",
      "& h5": {
        color: "rgba(0, 0, 0, 0.75)",
        textAlign: "left",
        fontWeight: "600",
        fontSize: 30,
        width: "calc(100% - 96px)",
      },
    },
    dialogTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: "rgba(0, 0, 0, 0.75)",
      marginTop: 30,
    },
  })
)

const availableAtiveSpecs = [
  "lamp.group",
  "lamp.suvey",
  "lamp.journal",
  "lamp.jewels_a",
  "lamp.jewels_b",
  "lamp.breathe",
  "lamp.spatial_span",
  "lamp.tips",
  "lamp.cats_and_dogs",
  "lamp.scratch_image",
  "lamp.dbt_diary_card",
]
export default function PatientProfile({
  participant,
  studies,
  onClose,
  ...props
}: {
  participant: any
  studies: any
  onClose: Function
}) {
  const classes = useStyles()
  const [activities, setActivities] = useState(null)
  const [careTeams, setCareTeams] = useState([])
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [confirmationDialog, setConfirmationDialog] = React.useState(0)
  const [sensors, setSensors] = useState([])
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation()
  const preventDefault = (event: React.SyntheticEvent) => event.preventDefault()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [accounts, setAccounts] = useState([])
  const [showCredentials, setShowCredentials] = useState(false)
  const [nickname, setNickname] = useState(participant.name)
  const [selectedActivity, setSelectedActivity] = useState<any>(null)
  const [gameDetails, setGameDetails] = useState(null)
  const [loading, setLoading] = React.useState(true)
  const [selectedItem, setSelectedItem] = useState(null)
  const [credential, setCredential] = useState(null)
  const [password, setPassword] = useState(null)
  const [allRoles, setAllRoles] = useState({})
  const [mode, setMode] = useState(null)
  const [ext, setExt] = useState([])
  const [int, setInt] = useState([])
  const activitiesObj = {
    "lamp.journal": t("Journal"),
    "lamp.scratch_image": t("Scratch card"),
    "lamp.breathe": t("Breathe"),
    "lamp.tips": t("Tip"),
    "lamp.dbt_diary_card": t("DBT Diary Card"),
    "lamp.cats_and_dogs": t("Cats and Dogs"),
    "lamp.jewels_a": t("Jewels A"),
    "lamp.jewels_b": t("Jewels B"),
    "lamp.spatial_span": t("Spatial Span"),
  }
  const games = ["lamp.jewels_a", "lamp.jewels_b", "lamp.spatial_span", "lamp.cats_and_dogs"]

  const onChangeActivities = () => {
    ;(async () => {
      Service.getAll("activities").then((activities) => {
        let data = (activities || []).filter((i) => i.study_id === participant.parentID)
        setActivities(data)
      })
    })()
  }

  const addedActivity = (data) => {
    addActivity(data)
    setActivities((prevState) => [...prevState, data])
  }

  const addedSensor = (data) => {
    // addActivity(data)
    setSensors((prevState) => [...prevState, data])
  }

  const onChangeSensors = () => {
    ;(async () => {
      Service.getAll("sensors").then((sensors) => {
        let data = (sensors || []).filter((i) => i.study_id === participant.parentID)
        setSensors(data)
      })
    })()
  }

  const onChangeAccounts = () => {
    ;(async function () {
      const prefix = "lamp.dashboard.credential_roles"
      let ext = ((await LAMP.Type.getAttachment(participant.id, `${prefix}.external`)) as any).data
      let int = ((await LAMP.Type.getAttachment(participant.id, `${prefix}`)) as any).data
      setExt(Object.keys(ext))
      setInt(Object.keys(int))
      setAccounts([
        ...Object.entries(ext ?? {}).map((x: any, idx) => ({
          id: idx + 1,
          name: x?.[1]?.name ?? "",
          email: x?.[0],
          tooltip: x?.[1]?.role ?? "No role specified",
          image: x?.[1]?.photo,
        })),
        ...Object.entries(int ?? {}).map((x: any, idx) => ({
          id: idx + 1,
          name: x?.[1]?.name ?? "",
          onClick: () => setShowCredentials((x) => !x),
          email: x?.[0],
          tooltip: x?.[1]?.role ?? "No role specified",
          image: x?.[1]?.photo,
        })),
      ])
      setAllRoles(Object.assign(ext, int))
      setLoading(false)
      setShowCredentials(false)
    })()
  }

  useEffect(() => {
    setLoading(true)
    console.log(studies)
    // LAMP.SensorSpec.all().then((res) => setSensorSpecs(res))
    // LAMP.ActivitySpec.all().then((res) => {
    //   setActivitySpecs(
    //     res.filter((x: any) => availableAtiveSpecs.includes(x.id) && !["lamp.group", "lamp.survey"].includes(x.id))
    //   )
    // })
    //  onChangeAccounts()
    onChangeActivities()
    // onChangeSensors()
    setLoading(false)
  }, [])

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  const open = Boolean(anchorEl)
  const id = open ? "simple-popover" : undefined
  const setAllFalse = () => {
    // setCreate(false)
    // setGroupCreate(false)
    // setShowCTCreate(false)
    // setShowCreate(false)
    // setShowTipCreate(false)
    // setShowBreatheCreate(false)
    // setShowJournalCreate(false)
    // setShowDBTCreate(false)
    // setShowSCImgCreate(false)
    // setSelectedActivity(null)
    // setAnchorEl(null)
    onChangeActivities()
  }
  // Begin an Activity object modification (ONLY DESCRIPTIONS).
  const modifyActivity = async (raw) => {
    setLoading(true)
    if (raw.spec === "lamp.survey") {
      let tag = [await LAMP.Type.getAttachment(raw.id, "lamp.dashboard.survey_description")].map((y: any) =>
        !!y.error ? undefined : y.data
      )[0]
      const activity = spliceActivity({ raw, tag })
      setSelectedActivity(activity)
    } else if (raw.spec === "lamp.dbt_diary_card") {
      setSelectedActivity(raw)
    } else if (raw.spec === "lamp.tips") {
      setSelectedActivity(raw)
    } else if (
      games.includes(raw.spec) ||
      raw.spec === "lamp.journal" ||
      raw.spec === "lamp.scratch_image" ||
      raw.spec === "lamp.breathe" ||
      raw.spec === "lamp.group"
    ) {
      let tag = [await LAMP.Type.getAttachment(raw.id, "lamp.dashboard.activity_details")].map((y: any) =>
        !!y.error ? undefined : y.data
      )[0]
      setGameDetails(tag)
      setSelectedActivity(raw)
    }
    setLoading(false)
  }

  // Delete the selected Activity objects & survey descriptions if set.
  const deleteActivities = async (rows) => {
    setLoading(true)
    for (let activity of rows) {
      if (activity.spec === "lamp.survey") {
        let tag = await LAMP.Type.setAttachment(activity.id, "me", "lamp.dashboard.survey_description", null)
        console.dir("deleted tag " + JSON.stringify(tag))
      }
      let raw = await LAMP.Activity.delete(activity.id)
    }
    enqueueSnackbar(t("Successfully deleted the selected Activities."), {
      variant: "success",
    })
    onChangeAccounts()
  }
  const resetPassword = () => {
    // if (
    //   !!((await LAMP.Credential.update(id, data.credential.access_key, {
    //     ...data.credential,
    //     secret_key: data.password,
    //   })) as any).error
    // )
    //   enqueueSnackbar(t("Could not change password."), {
    //     variant: "error",
    //   })
  }

  const updateName = () => {
    LAMP.Type.setAttachment(participant.id, "me", "lamp.name", nickname ?? null)
    enqueueSnackbar(t("Successfully updated user profile."), {
      variant: "success",
    })
    onClose()
  }

  const _deleteCredential = async () => {
    console.log(credential)
    try {
      if (!!((await LAMP.Credential.delete(participant.id, credential.access_key)) as any).error)
        return enqueueSnackbar(t("Could not delete."), { variant: "error" })

      await LAMP.Type.setAttachment(id, "me", "lamp.dashboard.credential_roles", {
        ...allRoles,
        [credential.access_key]: undefined,
      })
    } catch (err) {
      enqueueSnackbar(t("Credential management failed."), { variant: "error" })
    }
  }

  const confirmAction = () => {
    switch (confirmationDialog) {
      case 1:
        modifyActivity(selectedItem)
        break
      case 2:
        deleteActivities([selectedItem])
        break
      // case 3:
      //   setSensorName(selectedItem.name)
      //   setSensorSpec(selectedItem.spec)
      //   setSelectedSensor(selectedItem)
      //   setSensorDialog(true)
      //   break
      // case 4:
      //   deleteSensor(selectedItem.id)
      //   break
      case 5:
        ;(async () => {
          await _deleteCredential()
        })()
        break
    }
    setConfirmationDialog(0)
  }
  return (
    <div className={classes.root}>
      <Container className={classes.containerWidth}>
        <Button className={classes.headerButton} onClick={() => updateName()}>
          <Typography className={classes.buttonText}>{t("Save")}</Typography>
        </Button>

        <Grid container spacing={0}>
          <Box mb={4} width={1}>
            <Grid container direction="row" justify="space-between" alignItems="center">
              <Grid item>
                <Box>
                  <TextField
                    fullWidth
                    multiline
                    label={t("Nickname(optional)")}
                    variant="filled"
                    rows={2}
                    value={nickname}
                    onChange={(event) => setNickname(event.target.value)}
                    inputProps={{ maxLength: 2500 }}
                  />
                </Box>
              </Grid>
              <Grid item>
                <UpdateCredential allRoles={allRoles} ext={ext} participant={participant} />
              </Grid>
            </Grid>
          </Box>

          <div style={{ border: " 1px solid rgba(0, 0, 0, 0.1)", height: 0, width: "100%" }} />

          {/* <Typography className={classes.sectionTitle} style={{ marginBottom: 34 }}>
            {t("Care team")}
          </Typography>
          <Grid container spacing={0}>
            <Grid item xs={10} sm={8}>
              <div className={classes.rowContainer}>
                <Typography className={classes.contentText} style={{ flex: 1 }}>
                  Email
                </Typography>
                {/* <Typography className={classes.contentText} style={{ flex: 1 }}>
                  ROLE
                </Typography>
                <Typography className={classes.contentText} style={{ flex: 1 }}>
                  CONTACT
                </Typography> 
              </div>
              {(accounts ?? []).map((item, index) => {
                return (
                  <div
                    className={classes.rowContainer}
                    style={{ backgroundColor: index % 2 == 0 ? "#ECF4FF" : "transparent" }}
                  >
                    <Typography className={classes.contentText} style={{ flex: 1 }}>
                      {item.email}
                    </Typography>

                    <IconButton
                      onClick={() => {
                        setMode("update-profile")
                        setCredential(item)
                        setShowCredentials(true)
                      }}
                      color="default"
                      aria-label="Menu"
                    >
                      <Icon>edit</Icon>
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setCredential(item)
                        setConfirmationDialog(5)
                      }}
                      color="default"
                      aria-label="Menu"
                    >
                      <Icon>close</Icon>
                    </IconButton>
                  </div>
                )
              })} 
              <ButtonBase className={classes.addContainer} style={{ marginBottom: 52, marginTop: 15 }}>
                <div className={classes.addButton}>
                  <AddCircleOutline onClick={() => setShowCredentials(true)} />
                </div>
                <Typography
                  onClick={() => {
                    setMode("create-new")
                    setCredential(undefined)
                    setShowCredentials(true)
                  }}
                  className={classes.addButtonTitle}
                >
                  {t("Add item")}
                </Typography>
              </ButtonBase>
            </Grid>
            <Grid item xs={10} sm={2} />
          </Grid> */}

          <div style={{ border: " 1px solid rgba(0, 0, 0, 0.1)", height: 0, width: "100%" }} />
          <Typography className={classes.sectionTitle} style={{ marginBottom: 34 }}>
            {t("Activities")}
          </Typography>
          <Grid container spacing={0}>
            <Grid item xs={10} sm={8}>
              <div className={classes.rowContainer}>
                <Typography className={classes.contentText} style={{ flex: 1 }}>
                  NAME
                </Typography>
                <Typography className={classes.contentText} style={{ flex: 1 }}>
                  Type
                </Typography>
                <Typography className={classes.contentText} style={{ flex: 1 }}>
                  SCHEDULE
                </Typography>
              </div>
              {(activities ?? []).map((item, index) => {
                return <ActivityRow activities={activities} activity={item} studies={studies} index={index} />
              })}
              <AddActivity
                activities={activities}
                studies={studies}
                studyId={participant.parentID}
                addedActivity={addedActivity}
              />
            </Grid>
            <Grid item xs={10} sm={2} />
          </Grid>

          <div style={{ border: " 1px solid rgba(0, 0, 0, 0.1)", height: 0, width: "100%" }} />

          <Typography className={classes.sectionTitle} style={{ marginBottom: 34 }}>
            {t("Sensors")}
          </Typography>
          <Grid container spacing={0}>
            <Grid item xs={10} sm={8}>
              <div className={classes.rowContainer}>
                <Typography className={classes.contentText} style={{ flex: 1 }}>
                  NAME
                </Typography>
                <Typography className={classes.contentText} style={{ flex: 1 }}>
                  TYPE
                </Typography>
              </div>
              {(sensors ?? []).map((item, index) => {
                return <SensorRow studies={studies} sensor={item} index={index} />
              })}
              <AddSensor studies={studies} addedSensor={addedSensor} />
            </Grid>
            <Grid item xs={10} sm={2} />
          </Grid>

          <div style={{ border: " 1px solid rgba(0, 0, 0, 0.1)", height: 0, width: "100%" }} />
          <div className={classes.buttonsContainer}>
            <Button className={classes.buttonContainer} onClick={() => updateName()}>
              <Typography className={classes.buttonText}>{t("Save")}</Typography>
            </Button>
            <Button className={classes.backContainer} onClick={() => onClose()}>
              <Typography className={classes.backText}>{t("Cancel")}</Typography>
            </Button>
          </div>
        </Grid>
      </Container>

      <Grid item>
        <Tooltip title={t("Message")} placement="left">
          <Fab className={classes.profileMessage} style={{ position: "fixed" }} onClick={() => setDialogOpen(true)}>
            <Message />
          </Fab>
        </Tooltip>
      </Grid>

      <Dialog
        classes={{ paper: classes.popWidth }}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="simple-dialog-title"
        open={dialogOpen}
      >
        <div className={classes.padding20}>
          <Messages refresh participant={participant.id} msgOpen={false} participantOnly={false} />
        </div>
      </Dialog>

      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  )
}
