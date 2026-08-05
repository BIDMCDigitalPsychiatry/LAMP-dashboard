import DateFnsUtils from "@date-io/date-fns"
import {
  Box,
  CircularProgress,
  createStyles,
  Fab,
  Grid,
  Icon,
  makeStyles,
  Switch,
  TextField,
  Theme,
  Typography,
} from "@material-ui/core"
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers"
import LAMP from "lamp-core"
import { useSnackbar } from "notistack"
import React, { useCallback } from "react"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useAuthContext } from "../AuthProvider"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      minWidth: "550px",
    },
    apiKeyCard: {
      borderRadius: "5px",
      border: "1px solid lightgrey",
      padding: "1rem",
    },
    valuePreview: {
      fontFamily: "monospace",
      fontSize: "0.8rem",
    },
    createNewKeyButton: {
      backgroundColor: "#7599FF",
      color: "#FFFFFF",
      "&:hover": {
        backgroundColor: "#5680f9",
      },
    },
    loadingIconButton: {
      backgroundColor: "#7599FF",
      width: "40px",
      height: "40px",
      color: "#FFFFFF",
      "&:hover": {
        backgroundColor: "#5680f9",
      },
    },
    loadingIconButtonSpinner: {
      width: "20px !important",
      height: "20px !important",
      color: "#FFFFFF",
    },
  })
)

type ManageApiKeyModes = "view" | "loading" | "create" | "error"

export function ManageApiKey({ credential, ...props }) {
  const { t } = useTranslation()
  const [apiKeys, setApiKeys] = useState(undefined)
  const [mode, setMode] = useState("loading" as ManageApiKeyModes)

  const classes = useStyles()

  function refreshApiKeys() {
    setMode("loading")
    try {
      LAMP.ApiKey.list(credential._id).then((result) => {
        setApiKeys(result)
        setMode("view")
      })
    } catch (err) {
      setMode("error")
    }
  }

  function switchTab(newMode: ManageApiKeyModes) {
    setMode(newMode)
    if (newMode === "view") {
      refreshApiKeys()
    }
  }

  useEffect(() => {
    refreshApiKeys()
  }, [])

  function displayAccountSetupWarning() {
    return (
      LAMP.Auth._authScheme === "session" &&
      ["INCOMPLETE", "TWO_FACTOR_UNVERIFIED"].includes(credential.account_setup_state)
    )
  }

  return (
    <Box className={classes.root}>
      {displayAccountSetupWarning() && (
        <Box marginBottom={3}>
          <Typography>
            <strong>{t("Warning")}: </strong>
            {t(
              "This user has not finished setting up their account. You can manage their API keys, but they will be unable to use them until setting up o-auth or two factor authentication."
            )}
          </Typography>
        </Box>
      )}
      {mode === "loading" ? (
        <CircularProgress />
      ) : mode === "create" ? (
        <CreateApiForm credential={credential} setMode={switchTab} />
      ) : mode === "view" ? (
        <ViewApiKeys credential={credential} apiKeys={apiKeys} setMode={switchTab} />
      ) : (
        <Typography>{`${t("Could not load api keys at this time.")}`}</Typography>
      )}
    </Box>
  )
}

function CreateApiForm({ credential, setMode }) {
  const { t } = useTranslation()
  const classes = useStyles()
  const [formValues, setFormValues] = useState({
    expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    name: "",
  })
  const [formErrors, setFormErrors] = useState(getDefaultErrors())
  const [shouldExpire, setShouldExpire] = useState(true)
  const [createdKey, setCreatedKey] = useState(undefined)

  function onChangeFormValue(newValues) {
    setFormValues((prevState) => {
      return { ...prevState, ...newValues }
    })
  }

  function getDefaultErrors() {
    return {
      expiry: "",
      name: "",
      overall: "",
    }
  }

  async function createKey() {
    let hasErrors = false
    const newFormErrors = getDefaultErrors()

    if (!formValues.name) {
      newFormErrors.name = t("Name is required")
      hasErrors = true
    }

    if (!hasErrors) {
      try {
        const result: any = await LAMP.ApiKey.create(
          credential._id,
          formValues.name,
          shouldExpire ? formValues.expiry || undefined : undefined
        )
        if (result.key) {
          setCreatedKey(result.key)
        } else if (!!result.error) {
          newFormErrors.overall = t("Could not create key at this time.")
        }
      } catch (err) {
        newFormErrors.overall = t("Could not create key at this time.")
      }
    }

    setFormErrors(newFormErrors)
  }

  return (
    <React.Fragment>
      {!!createdKey ? (
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Typography>Successfully created a new api key. </Typography>
          </Grid>
          <Grid item>
            <TextField value={createdKey} variant="outlined" />
          </Grid>
          <Grid item>
            <Fab variant="circular" onClick={() => setMode("view")}>
              <Icon>arrow_back</Icon>
            </Fab>
          </Grid>
        </Grid>
      ) : (
        <Grid container direction="column">
          {!!formErrors.overall && <Typography color="error">{formErrors.overall}</Typography>}
          <form>
            <Box marginY={2}>
              <TextField
                type="text"
                variant="outlined"
                label={t("Name")}
                value={formValues.name}
                onChange={(e) => onChangeFormValue({ name: e.target.value })}
                required={true}
                error={!!formErrors.name}
              />
            </Box>
            <Box marginY={2}>
              <Grid container>
                <Grid item xs={10}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      variant="inline"
                      inputVariant="outlined"
                      format="MM/dd/yyyy"
                      label={t("Expiration date")}
                      value={formValues.expiry}
                      onChange={(v) => {
                        onChangeFormValue({ expiry: v })
                      }}
                      KeyboardButtonProps={{
                        "aria-label": "Change expiry date",
                      }}
                      disablePast={true}
                      disabled={!shouldExpire}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
                <Grid container item xs={2} justifyContent="center" alignItems="center">
                  <Switch
                    checked={shouldExpire}
                    onChange={(e) => setShouldExpire(e.target.checked)}
                    name="should-expire"
                    inputProps={{ "aria-label": "Use api key expiry" }}
                    color="primary"
                  />
                </Grid>
              </Grid>
            </Box>
          </form>
          <Grid container item direction="row" justifyContent="space-between">
            <Fab variant="circular" onClick={() => setMode("view")}>
              <Icon>arrow_back</Icon>
            </Fab>
            <Fab variant="extended" onClick={createKey} className={classes.createNewKeyButton}>
              {t("Create Key")}
            </Fab>
          </Grid>
        </Grid>
      )}
    </React.Fragment>
  )
}

function ViewApiKeys({ credential, apiKeys, setMode, ...props }) {
  const classes = useStyles()
  const { t } = useTranslation()
  const [deletingKey, setDeletingKey] = useState("")

  const deleteApiKey = useCallback(async (apiKey) => {
    setDeletingKey(apiKey.id)
    const result: any = await LAMP.ApiKey.delete(apiKey.id)
    setDeletingKey("")
    setMode("view")
  }, [])

  function formatExpiryDate(expiryDateString) {
    return new Date(Date.parse(expiryDateString)).toLocaleDateString()
  }

  return (
    <Grid container direction="column" spacing={2}>
      {apiKeys.map((apiKey) => (
        <Grid item key={apiKey.id}>
          <Grid container direction="row" className={classes.apiKeyCard}>
            <Grid item xs={7} container direction="column" justifyContent="space-between">
              <Typography>
                <strong>{apiKey.name}</strong>
              </Typography>
              <Typography className={classes.valuePreview}>{apiKey.start?.padEnd(32, "*")}</Typography>
            </Grid>
            <Grid item xs={4} container alignContent="center">
              <Typography>
                {t("Expires")}: {!!apiKey.expiresAt ? formatExpiryDate(apiKey.expiresAt) : t("never")}
              </Typography>
            </Grid>
            <Grid item xs={1} container alignContent="center">
              <LoadingIconButton
                loading={deleteApiKey === apiKeys.id}
                iconName="delete"
                onClick={(event) => deleteApiKey(apiKey)}
              />
            </Grid>
          </Grid>
        </Grid>
      ))}
      <Grid item container justifyContent="center">
        <Fab
          variant="extended"
          onClick={() => {
            setMode("create")
          }}
          className={classes.createNewKeyButton}
        >
          <Icon>add</Icon>
          {t("Create")}
        </Fab>
      </Grid>
    </Grid>
  )
}

function LoadingIconButton({ loading, iconName, onClick }) {
  const classes = useStyles()
  return (
    <Fab variant="circular" className={classes.loadingIconButton} onClick={onClick}>
      {loading ? <CircularProgress className={classes.loadingIconButtonSpinner} /> : <Icon>{iconName}</Icon>}
    </Fab>
  )
}
