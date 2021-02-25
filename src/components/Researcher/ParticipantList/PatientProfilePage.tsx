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
import { ReactComponent as Message } from "../../../icons/Message.svg"
import Messages from "../../Messages"
import LAMP, { Study, Sensor } from "lamp-core"
import { CredentialManager, CredentialEditor, updateDetails } from "../../CredentialManager"
import ResponsiveDialog from "../../ResponsiveDialog"
import Participant from "../../Participant"
import AddActivity from "../ActivityList/AddActivity"
import Activity from "../ActivityList/Activity"
import {
  unspliceActivity,
  unspliceTipsActivity,
  spliceActivity,
  updateActivityData,
  saveGroupActivity,
  saveTipActivity,
  saveSurveyActivity,
  saveCTestActivity,
} from "../ActivityList/Index"
import SensorListItem from "../SensorsList/SensorListItem"
import AddSensor from "../SensorsList/AddSensor"

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
export default function PatientProfilePage({
  participant,
  onClose,
  studies,
  ...props
}: {
  participant: any
  onClose: Function
  studies: any
}) {
  const classes = useStyles()
  const [activities, setActivities] = useState([])
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
  const [nickname, setNickname] = useState("")
  const [activitySpecs, setActivitySpecs] = useState([])
  const [sensorSpecs, setSensorSpecs] = useState([])
  const [createMenu, setCreateMenu] = useState<Element>()
  const [showCreate, setShowCreate] = useState(false)
  const [groupCreate, setGroupCreate] = useState(false)
  const [showTipCreate, setShowTipCreate] = useState(false)
  const [showCTCreate, setShowCTCreate] = useState(false)
  const [showJournalCreate, setShowJournalCreate] = useState(false)
  const [showBreatheCreate, setShowBreatheCreate] = useState(false)
  const [showSCImgCreate, setShowSCImgCreate] = useState(false)
  const [showDBTCreate, setShowDBTCreate] = useState(false)
  const [createDialogue, setCreate] = useState(false)
  const [activitySpecId, setActivitySpecId] = useState(null)
  const [sensorDialog, setSensorDialog] = useState(false)
  const [sensorName, setSensorName] = useState("")
  const [sensorSpec, setSensorSpec] = useState("")
  const [selectedActivity, setSelectedActivity] = useState<any>(null)
  const [gameDetails, setGameDetails] = useState(null)
  const [loading, setLoading] = React.useState(true)
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedSensor, setSelectedSensor] = useState(null)
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
  const studyId = ""
  const onChangeActivities = () => {
    LAMP.Activity.allByStudy(studyId).then((data) => {
      let activitydata = data.map((el) => ({ ...el, parentID: studyId }))
      setActivities(activitydata)
      setLoading(false)
    })
  }

  const onChangeSensors = () => {
    LAMP.Sensor.allByStudy(studyId).then((data) => {
      setSensors(data)
      setLoading(false)
    })
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
    ;(async () => {
      let name = ((await LAMP.Type.getAttachment(participant.id, "lamp.name")) as any).data ?? ""
      setNickname(name)
    })()

    LAMP.SensorSpec.all().then((res) => setSensorSpecs(res))
    LAMP.ActivitySpec.all().then((res) => {
      setActivitySpecs(
        res.filter((x: any) => availableAtiveSpecs.includes(x.id) && !["lamp.group", "lamp.survey"].includes(x.id))
      )
    })
    //  onChangeAccounts()
    onChangeActivities()
    // onChangeSensors()
    setLoading(false)
  }, [])

  const types = {
    "lamp.survey": t("Survey"),
    "lamp.group": t("Group"),
    "lamp.tips": t("Tips"),
    "lamp.journal": t("Journal"),
    "lamp.breathe": t("Breathe"),
    "lamp.dbt_diary_card": t("DBT Diary Card"),
    "lamp.scratch_image": t("Scratch image"),
  }

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  const addActivity = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const open = Boolean(anchorEl)
  const id = open ? "simple-popover" : undefined
  const setAllFalse = () => {
    setCreate(false)
    setGroupCreate(false)
    setShowCTCreate(false)
    setShowCreate(false)
    setShowTipCreate(false)
    setShowBreatheCreate(false)
    setShowJournalCreate(false)
    setShowDBTCreate(false)
    setShowSCImgCreate(false)
    setSelectedActivity(null)
    setAnchorEl(null)
    onChangeActivities()
  }
  // Create a new Activity object & survey descriptions if set.
  const saveTipsActivity = async (x) => {
    setAllFalse()
    setLoading(true)
    let result = await saveTipActivity(x)
    if (!!result.error)
      enqueueSnackbar(t("Encountered an error: ") + result?.error, {
        variant: "error",
      })
    else {
      enqueueSnackbar(t("Successfully updated the Activity."), {
        variant: "success",
      })
    }
    onChangeActivities()
  }

  // Create a new Activity object & survey descriptions if set.
  const saveActivity = async (x) => {
    setAllFalse()
    setLoading(true)
    let newItem = await saveSurveyActivity(x)
    if (!!newItem.error)
      enqueueSnackbar(t("Failed to create a new survey Activity."), {
        variant: "error",
      })
    else
      enqueueSnackbar(t("Successfully created a new survey Activity."), {
        variant: "success",
      })

    onChangeActivities()
  }

  // Create a new Activity object that represents a group of other Activities.
  const saveGroup = async (x) => {
    setAllFalse()
    setLoading(true)
    let newItem = await saveGroupActivity(x)
    if (!!newItem.error)
      enqueueSnackbar(t("Failed to create a new group Activity."), {
        variant: "error",
      })
    else
      enqueueSnackbar(t("Successfully created a new group Activity."), {
        variant: "success",
      })
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

  const updateActivity = async (x, isDuplicated) => {
    setAllFalse()
    setLoading(true)
    let result = await updateActivityData(x, isDuplicated, selectedActivity)
    if (!!result.error)
      enqueueSnackbar(t("Encountered an error: ") + result?.error, {
        variant: "error",
      })
    else
      enqueueSnackbar(t("Successfully updated the Activity."), {
        variant: "success",
      })
    onChangeActivities()
    setSelectedActivity(null)
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
  // Create a new Activity object that represents a cognitive test.
  const saveCTest = async (x) => {
    setAllFalse()
    setLoading(true)
    let newItem = await saveCTestActivity(x)
    console.log(newItem)
    if (!!newItem.error)
      enqueueSnackbar(t("Failed to create a new Activity."), {
        variant: "error",
      })
    else
      enqueueSnackbar(t("Successfully created a new Activity."), {
        variant: "success",
      })
    onChangeActivities()
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

  const updateSensor = async () => {
    setLoading(true)
    const result = await LAMP.Sensor.update(selectedSensor.id, {
      name: sensorName,
      spec: sensorSpec,
    })

    enqueueSnackbar(t("Successfully updated a sensor."), {
      variant: "success",
    })
    setSelectedSensor(null)
    onChangeSensors()
  }

  const deleteSensor = async (sensorId) => {
    setLoading(true)
    await LAMP.Sensor.delete(sensorId)
    enqueueSnackbar(t("Successfully deleted the sensor."), {
      variant: "success",
    })
    onChangeSensors()
  }

  const saveSensor = async () => {
    setLoading(true)
    // Create a new Sensor under the given Study.
    const result = await LAMP.Sensor.create(studyId, {
      name: sensorName,
      spec: sensorSpec,
    })
    enqueueSnackbar(t("Successfully created a new sensor."), {
      variant: "success",
    })
    onChangeSensors()
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
  const handleClose = () => {
    setAnchorEl(null)
  }
  const confirmAction = () => {
    switch (confirmationDialog) {
      case 1:
        modifyActivity(selectedItem)
        break
      case 2:
        deleteActivities([selectedItem])
        break
      case 3:
        setSensorName(selectedItem.name)
        setSensorSpec(selectedItem.spec)
        setSelectedSensor(selectedItem)
        setSensorDialog(true)
        break
      case 4:
        deleteSensor(selectedItem.id)
        break
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
          {/* <Link href='/clinician'> */}
          <Typography className={classes.buttonText}>{t("Save")}</Typography>
          {/* </Link> */}
        </Button>
        {/* </div> */}

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
                <Link
                  onClick={() => {
                    setMode(undefined)
                    setCredential(undefined)
                    setShowCredentials(true)
                  }}
                  className={classes.linkBtn}
                >
                  <Icon>key</Icon>
                  Reset account password
                </Link>
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
                return (
                  <div
                    className={classes.rowContainer}
                    style={{ backgroundColor: index % 2 == 0 ? "#ECF4FF" : "transparent" }}
                  >
                    <Typography className={classes.contentText} style={{ flex: 1 }}>
                      {item.name}
                    </Typography>
                    <Typography className={classes.contentText} style={{ flex: 1 }}>
                      {types[item.spec] ?? t("Cognitive Test")}
                    </Typography>
                    <Typography className={classes.contentText} style={{ flex: 1 }}>
                      {(item?.schedule ?? []).map((sc) => (
                        <Box>{sc.repeat_interval}</Box>
                      ))}
                    </Typography>
                    <IconButton
                      onClick={() => {
                        setSelectedItem(item)
                        setConfirmationDialog(1)
                      }}
                      color="default"
                      aria-label="Menu"
                    >
                      <Icon>edit</Icon>
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setSelectedItem(item)
                        setConfirmationDialog(2)
                      }}
                      color="default"
                      aria-label="Menu"
                    >
                      <Icon>close</Icon>
                    </IconButton>
                  </div>
                )
              })}
              <ButtonBase
                className={classes.addContainer}
                onClick={addActivity}
                style={{ marginBottom: 52, marginTop: 15 }}
              >
                <div className={classes.addButton}>
                  <AddCircleOutline />
                </div>
                <Typography className={classes.addButtonTitle}>{t("Add item")}</Typography>
              </ButtonBase>
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
              {(sensors ?? []).map((item, index) => (
                <SensorListItem sensor={item} studies={studies} />
              ))}
              <AddSensor studies={studies} />
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
        open={confirmationDialog > 0 ? true : false}
        onClose={() => setConfirmationDialog(0)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirmation"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {confirmationDialog === 1
              ? "Changes done to this activity will reflect for all the participants under the study. Are you sure you want proceed?."
              : confirmationDialog === 2
              ? "This activity will be deleted for all the participants under this study. Are you sure you want to proceed?."
              : confirmationDialog === 3
              ? "Changes done to this sensor will reflect for all the participants under the study. Are you sure you want proceed?."
              : confirmationDialog === 4
              ? "This sensor will be deleted for all the participants under this study. Are you sure you want to proceed?."
              : "Are you sure you want to delete this care team member? "}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmationDialog(0)} color="primary">
            No
          </Button>
          <Button
            onClick={() => {
              confirmAction()
            }}
            color="primary"
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Popover
        open={Boolean(anchorEl)}
        onClose={handleClose}
        classes={{ root: classes.customPopover, paper: classes.customPaper }}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <React.Fragment>
          <MenuItem
            onClick={() => {
              setCreate(true)
              setCreateMenu(undefined)
              setGroupCreate(true)
            }}
          >
            {t("Activity Group")}
          </MenuItem>
          <MenuItem
            divider
            onClick={() => {
              setCreate(true)
              setCreateMenu(undefined)
              setShowCreate(true)
            }}
          >
            {t("Survey Instrument")}
          </MenuItem>
          {[
            <MenuItem key="head" disabled>
              <b>{t("Smartphone Cognitive Tests")}</b>
            </MenuItem>,
            ...activitySpecs.map((x) => (
              <MenuItem
                key={x?.id}
                onClick={() => {
                  setCreateMenu(undefined)
                  setActivitySpecId(x.id)
                  setCreate(true)
                  games.includes(x?.id)
                    ? setShowCTCreate(true)
                    : x.id === "lamp.journal"
                    ? setShowJournalCreate(true)
                    : x.id === "lamp.scratch_image"
                    ? setShowSCImgCreate(true)
                    : x.id === "lamp.breathe"
                    ? setShowBreatheCreate(true)
                    : x.id === "lamp.tips"
                    ? setShowTipCreate(true)
                    : x.id === "lamp.dbt_diary_card"
                    ? setShowDBTCreate(true)
                    : setShowSCImgCreate(true)
                }}
              >
                {x.name ? activitiesObj[x.name] : x?.name?.replace("lamp.", "")}
              </MenuItem>
            )),
          ]}
        </React.Fragment>
      </Popover>

      <ResponsiveDialog
        fullScreen
        transient={false}
        animate
        open={!!createDialogue || selectedActivity !== null}
        onClose={setAllFalse}
      >
        <AppBar position="static" style={{ background: "#FFF", boxShadow: "none" }}>
          <Toolbar className={classes.toolbardashboard}>
            <IconButton onClick={setAllFalse} color="default" aria-label="Menu">
              <Icon>arrow_back</Icon>
            </IconButton>
            <Typography variant="h5">
              {t(selectedActivity !== null ? "Update an activity" : "Create a new activity")}
            </Typography>
          </Toolbar>
        </AppBar>
        <Divider />
        <Box py={8} px={4}>
          {selectedActivity !== null ? (
            <Activity
              allActivities={activities}
              activity={selectedActivity}
              onSave={updateActivity}
              details={gameDetails}
              studies={studies}
              onCancel={setAllFalse}
            />
          ) : (
            <AddActivity activities={activities} studies={studies} studyId={studyId} activitySpecs={activitySpecs} />
          )}
        </Box>
      </ResponsiveDialog>
      <Dialog open={showCredentials} onClose={() => setShowCredentials(false)}>
        <DialogContent style={{ marginBottom: 12 }}>
          {!!mode ? (
            <CredentialEditor
              credential={credential}
              auxData={allRoles[(credential || {}).access_key] || {}}
              mode={mode}
              onChange={(data) => {
                ;(async () => {
                  let type = ext.includes(data.emailAddress) ? 1 : 2
                  await updateDetails(participant.id, data, mode, allRoles, type)
                  onChangeAccounts()
                })()
              }}
            />
          ) : (
            <CredentialManager id={participant.id} style={{ margin: 16 }} />
          )}
        </DialogContent>
      </Dialog>
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

      <Dialog
        classes={{ paper: classes.popWidth }}
        onClose={() => setSensorDialog(false)}
        aria-labelledby="simple-dialog-title"
        open={sensorDialog}
      >
        <div>
          <Typography className={classes.dialogTitle}>{t("Add Sensor")}</Typography>
          <div className={classes.inputContainer}>
            <div className={classes.contentContainer}>
              <CssTextField
                value={sensorName}
                onChange={(event) => setSensorName(event.target.value)}
                inputProps={{ disableunderline: "true" }}
                placeholder={t("Name")}
              />
            </div>
          </div>
          <Box mt={4}>
            <MuiThemeProvider theme={theme}>
              <TextField
                error={typeof studyId == "undefined" || studyId === null || studyId === "" ? true : false}
                id="filled-select-currency"
                select
                label={t("Sensor spec")}
                value={sensorSpec}
                onChange={(e) => {
                  setSensorSpec(e.target.value)
                }}
                helperText={
                  typeof studyId == "undefined" || studyId === null || studyId === ""
                    ? t("Please select the sensor spec")
                    : ""
                }
                variant="filled"
              >
                {sensorSpecs.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {t(option.id.replace("lamp.", ""))}
                  </MenuItem>
                ))}
              </TextField>
            </MuiThemeProvider>
          </Box>
          <Box textAlign="center" mt={2}>
            <Button
              onClick={() => (selectedSensor !== null ? updateSensor() : saveSensor())}
              className={classes.PopupButton}
            >
              <Typography className={classes.buttonText}>{t(selectedSensor !== null ? "Update" : "Add")}</Typography>
            </Button>
          </Box>
        </div>
      </Dialog>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  )
}
