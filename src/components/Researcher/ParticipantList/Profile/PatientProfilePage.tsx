import React, { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Grid,
  Button,
  TextField,
  Container,
  Backdrop,
  CircularProgress,
  makeStyles,
  createStyles,
  Fab,
  AppBar,
  Toolbar,
  Icon,
  Link,
  IconButton,
  Divider,
} from "@material-ui/core"
import { useSnackbar } from "notistack"
import { useTranslation } from "react-i18next"
import LAMP from "lamp-core"
import UpdateCredential from "./UpdateCredential"
import MessageDialog from "./MessageDialog"
import Activities from "./Activities"
import Sensors from "./Sensors"
import { Service } from "../../../DBService/DBService"

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

    buttonContainer: {
      width: 200,
      height: 50,
      marginTop: 30,
      background: "#7599FF",
      boxShadow: "0px 10px 15px rgba(96, 131, 231, 0.2)",
      borderRadius: 25,
      "&:hover": { background: "#5680f9" },
    },
    buttonText: {
      fontWeight: "bold",
      fontSize: 16,
      color: "white",
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
      width: "auto",
      height: 50,
      right: 60,
      top: 25,
      padding: "0 10px 0 10px",
      background: "#7599FF",
      boxShadow: "0px 10px 15px rgba(96, 131, 231, 0.2)",
      borderRadius: 25,
      zIndex: 1111,
      "&:hover": { background: "#5680f9" },
    },
    containerWidth: { maxWidth: 1055 },
  })
)

export default function PatientProfile({
  participantId,
  researcherId,
  ...props
}: {
  participantId: string
  researcherId?: string
}) {
  const [nickname, setNickname] = useState("")
  const [loading, setLoading] = React.useState(false)
  const [ext, setExt] = useState([])
  const [participant, setParticipant] = useState(null)
  const [studies, setStudies] = useState(null)
  const [allRoles, setAllRoles] = useState({})
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation()

  const onChangeAccounts = () => {
    ;(async function () {
      const prefix = "lamp.dashboard.credential_roles"
      let ext = ((await LAMP.Type.getAttachment(participantId, `${prefix}.external`)) as any).data
      let int = ((await LAMP.Type.getAttachment(participantId, `${prefix}`)) as any).data
      setExt(Object.keys(ext ?? {}))
      setAllRoles(Object.assign(ext ?? {}, int ?? {}))
      setLoading(false)
    })()
  }

  useEffect(() => {
    Service.getDataByKey("participants", [participantId], "id").then((data) => {
      setParticipant(data[0])
    })
    Service.getAll("studies").then((studies) => {
      setStudies(studies)
    })
    onChangeAccounts()
    LAMP.Type.getAttachment(participantId, "lamp.name").then((res: any) => {
      setNickname(!!res.data ? res.data : null)
    })
  }, [])

  const updateName = () => {
    LAMP.Type.setAttachment(participantId, "me", "lamp.name", nickname ?? null)
    enqueueSnackbar(`${t("Successfully updated user profile.")}`, {
      variant: "success",
    })
    Service.update("participants", { participants: [{ name: nickname ?? null, id: participantId }] }, "name", "id")
    history.back()
  }

  const onClose = () => {
    window.location.replace(`/#/researcher/${researcherId}/users`)
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" style={{ background: "#FFF", boxShadow: "none" }}>
        <Toolbar className={classes.toolbardashboard}>
          <IconButton onClick={onClose}>
            <Icon>arrow_back</Icon>
          </IconButton>
          <Typography variant="h5">
            {`${t("Profile")}`} {participant?.id ?? ""}
          </Typography>
        </Toolbar>
      </AppBar>
      <Divider />
      <Box py={8} px={4}>
        <Container className={classes.containerWidth}>
          <Button className={classes.headerButton} onClick={() => updateName()}>
            <Typography className={classes.buttonText}>{`${t("Save")}`}</Typography>
          </Button>

          <Grid container spacing={0}>
            <Box mb={4} width={1}>
              <Grid container direction="row" justifyContent="space-between" alignItems="center">
                <Grid item lg={6}>
                  <Box>
                    <TextField
                      fullWidth
                      label={`${t("Nickname(optional)")}`}
                      variant="filled"
                      value={nickname}
                      defaultValue={nickname}
                      onChange={(event) => setNickname(event.target.value)}
                      inputProps={{ maxLength: 2500 }}
                    />
                  </Box>
                </Grid>
                <Grid item>
                  {!!participant && <UpdateCredential allRoles={allRoles} ext={ext} participant={participant} />}
                </Grid>
              </Grid>
            </Box>
            <div style={{ border: " 1px solid rgba(0, 0, 0, 0.1)", height: 0, width: "100%" }} />
            {!!participant && <Activities participant={participant} studies={studies} researcherId={researcherId} />}
            <div style={{ border: " 1px solid rgba(0, 0, 0, 0.1)", height: 0, width: "100%", marginTop: 30 }} />
            {!!participant && <Sensors participant={participant} studies={studies} />}
            <div className={classes.buttonsContainer}>
              <Button className={classes.buttonContainer} onClick={() => updateName()}>
                <Typography className={classes.buttonText}>{`${t("Save")}`}</Typography>
              </Button>
              <Button className={classes.backContainer} onClick={onClose}>
                <Typography className={classes.backText}>{t("Cancel")}</Typography>
              </Button>
            </div>
          </Grid>
        </Container>
      </Box>
      {!!participant && <MessageDialog participant={participant} />}
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  )
}
