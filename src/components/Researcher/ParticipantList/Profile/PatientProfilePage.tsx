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
} from "@material-ui/core"
import { useSnackbar } from "notistack"
import { useTranslation } from "react-i18next"
import LAMP from "lamp-core"
import UpdateCredential from "./UpdateCredential"
import MessageDialog from "./MessageDialog"
import Activties from "./Activities"
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
    containerWidth: { maxWidth: 1055 },
  })
)

export default function PatientProfile({
  participant,
  studies,
  onClose,
  setUpdateCount,
  ...props
}: {
  participant: any
  studies: any
  onClose: Function
  setUpdateCount: Function
}) {
  const [nickname, setNickname] = useState(participant?.name ?? "")
  const [loading, setLoading] = React.useState(false)
  const [ext, setExt] = useState([])
  const [allRoles, setAllRoles] = useState({})
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation()

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
    onChangeAccounts()
    LAMP.Type.getAttachment(participant.id, "lamp.name").then((res: any) => {
      setNickname(!!res.data ? res.data : null)
    })
  }, [])

  const updateName = () => {
    LAMP.Type.setAttachment(participant.id, "me", "lamp.name", nickname ?? null)
    enqueueSnackbar(t("Successfully updated user profile."), {
      variant: "success",
    })
    Service.update("participants", { participants: [{ name: nickname ?? null, id: participant.id }] }, "name", "id")
    onClose(nickname ?? "")
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
                  <TextField
                    fullWidth
                    label={t("Nickname(optional)")}
                    variant="filled"
                    value={nickname}
                    defaultValue={nickname}
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
          <Activties participant={participant} studies={studies} setUpdateCount={setUpdateCount} />
          <div style={{ border: " 1px solid rgba(0, 0, 0, 0.1)", height: 0, width: "100%", marginTop: 30 }} />
          <Sensors participant={participant} studies={studies} setUpdateCount={setUpdateCount} />
          <div className={classes.buttonsContainer}>
            <Button className={classes.buttonContainer} onClick={() => updateName()}>
              <Typography className={classes.buttonText}>{t("Save")}</Typography>
            </Button>
            <Button className={classes.backContainer} onClick={() => onClose(nickname ?? "")}>
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
