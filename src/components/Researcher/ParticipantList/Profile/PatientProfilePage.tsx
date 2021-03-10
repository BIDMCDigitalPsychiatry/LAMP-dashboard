import React, { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Grid,
  Button,
  TextField,
  Icon,
  Container,
  Fab,
  Backdrop,
  CircularProgress,
} from "@material-ui/core"
import { makeStyles, createStyles, MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles"
import { useSnackbar } from "notistack"
import { useTranslation } from "react-i18next"
import LAMP from "lamp-core"
import AddActivity from "../../ActivityList/AddActivity"
import AddSensor from "../../SensorsList/AddSensor"
import addSensorItem from "../../SensorsList/AddSensor"
import { Service } from "../../../DBService/DBService"
import SensorRow from "./SensorRow"
import ActivityRow from "./ActivityRow"
import UpdateCredential from "./UpdateCredential"
import addActivity from "../../ActivityList/Activity"
import MessageDialog from "./MessageDialog"
import DeleteActivity from "../../ActivityList/DeleteActivity"

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
    sectionTitle: {
      color: "rgba(0, 0, 0, 0.75)",
      fontSize: 25,
      fontWeight: "bold",
      marginTop: 5,
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
    popWidth: { width: "95%", maxWidth: "500px", padding: "0 40px" },
    containerWidth: { maxWidth: 1055 },
    profileMessage: {
      background: "#7599FF",
      bottom: 30,
      right: 40,
      "&:hover": { background: "#5680f9" },
      "& svg": {
        "& path": { fill: "#fff", fillOpacity: 1 },
      },
    },
    w45: { width: 45 },
    w120: { width: 120 },

    optionsMain: {
      width: "100%",
      background: "#ECF4FF",
      borderTop: "1px solid #C7C7C7",
      padding: "10px",
    },
    btnText: {
      background: "transparent",
      borderRadius: "40px",
      minWidth: 100,
      boxShadow: "none",
      cursor: "pointer",
      textTransform: "capitalize",
      paddingLeft: "10px !important",
      paddingRight: "15px !important",
      fontSize: "14px",
      color: "#7599FF",
      "& svg": { marginRight: 8 },
      "&:hover": { color: "#5680f9", background: "#fff" },
      "& span.MuiIcon-root": { fontSize: 20, marginRight: 3 },
      [theme.breakpoints.up("md")]: {
        //position: "absolute",
      },
    },
  })
)

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
  const [sensors, setSensors] = useState([])
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation()
  const [nickname, setNickname] = useState(participant.name)
  const [loading, setLoading] = React.useState(true)
  const [ext, setExt] = useState([])
  const [allRoles, setAllRoles] = useState({})
  const [selectedActivities, setSelectedActivities] = useState([])

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
    // addSensorItem(data, studies)
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
      setExt(Object.keys(ext ?? {}))
      setAllRoles(Object.assign(ext ?? {}, int ?? {}))
      setLoading(false)
    })()
  }

  useEffect(() => {
    setLoading(true)
    onChangeActivities()
    onChangeSensors()
    onChangeAccounts()
  }, [])

  const updateName = () => {
    LAMP.Type.setAttachment(participant.id, "me", "lamp.name", nickname ?? null)
    enqueueSnackbar(t("Successfully updated user profile."), {
      variant: "success",
    })
    onClose()
  }

  const _deleteCredential = async () => {
    // try {
    //   if (!!((await LAMP.Credential.delete(participant.id, credential.access_key)) as any).error)
    //     return enqueueSnackbar(t("Could not delete."), { variant: "error" })
    //   await LAMP.Type.setAttachment(participant.id, "me", "lamp.dashboard.credential_roles", {
    //     ...allRoles,
    //     [credential.access_key]: undefined,
    //   })
    // } catch (err) {
    //   enqueueSnackbar(t("Credential management failed."), { variant: "error" })
    // }
  }

  useEffect(() => {
    console.log(selectedActivities)
  }, [selectedActivities])

  const handleSelected = (activity, checked) => {
    if (!!checked) {
      setSelectedActivities((prevState) => [...prevState, activity])
    } else {
      let selected = selectedActivities
      selected = selected.filter((item) => item.id != activity.id)
      setSelectedActivities(selected)
    }
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
              <Grid item lg={6}>
                <Box>
                  <MuiThemeProvider theme={theme}>
                    <TextField
                      fullWidth
                      label={t("Nickname(optional)")}
                      variant="filled"
                      value={nickname}
                      onChange={(event) => setNickname(event.target.value)}
                      inputProps={{ maxLength: 2500 }}
                    />
                  </MuiThemeProvider>
                </Box>
              </Grid>
              <Grid item>
                <UpdateCredential allRoles={allRoles} ext={ext} participant={participant} />
              </Grid>
            </Grid>
          </Box>

          <div style={{ border: " 1px solid rgba(0, 0, 0, 0.1)", height: 0, width: "100%" }} />
          {console.log(selectedActivities)}
          {selectedActivities.length > 0 && (
            <Box className={classes.optionsMain}>
              <DeleteActivity activities={selectedActivities} />
            </Box>
          )}
          <Grid container spacing={0}>
            <Grid item xs={12} sm={12}>
              <Box p={1}>
                <AddActivity
                  activities={activities}
                  studies={studies}
                  studyId={participant.parentID}
                  addedActivity={addedActivity}
                />
                <Grid container>
                  <Grid item className={classes.w45}></Grid>
                  <Grid item xs>
                    <Typography className={classes.contentText} style={{ flex: 1 }}>
                      NAME
                    </Typography>
                  </Grid>
                  <Grid item xs>
                    <Typography className={classes.contentText} style={{ flex: 1 }}>
                      Type
                    </Typography>
                  </Grid>
                  <Grid item xs>
                    <Typography className={classes.contentText} style={{ flex: 1 }}>
                      SCHEDULE
                    </Typography>
                  </Grid>
                  <Grid item className={classes.w120}></Grid>
                </Grid>
              </Box>
              {(activities ?? []).map((item, index) => {
                return (
                  <ActivityRow
                    activities={activities}
                    activity={item}
                    studies={studies}
                    index={index}
                    handleSelected={handleSelected}
                  />
                )
              })}
            </Grid>
            <Grid item xs={10} sm={2} />
          </Grid>

          <Box display="flex" width={1} mt={5}>
            <Box flexGrow={1}>
              <Typography className={classes.sectionTitle} style={{ marginBottom: 34 }}>
                {t("Sensors")}
              </Typography>
            </Box>
            <Box>
              <AddSensor studies={studies} addedSensor={addedSensor} />
            </Box>
          </Box>

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

      <MessageDialog participant={participant} />

      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  )
}
