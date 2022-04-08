// Core Imports
import React, { useState, useEffect, useCallback } from "react"
import {
  Fab,
  Box,
  TextField,
  Slide,
  Menu,
  MenuItem,
  Icon,
  IconButton,
  colors,
  Grid,
  makeStyles,
  createStyles,
  Link,
  Theme,
} from "@material-ui/core"
import { useSnackbar } from "notistack"
import LAMP from "lamp-core"
import locale_lang from "../locale_map.json"
import { Service } from "./DBService/DBService"

// Local Imports
import { ResponsivePaper, ResponsiveMargin } from "./Utils"
import { ReactComponent as Logo } from "../icons/Logo.svg"
import { ReactComponent as Logotext } from "../icons/mindLAMP.svg"
import { useTranslation } from "react-i18next"

import pkceChallenge from "pkce-challenge"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    logoLogin: {
      width: 90,
      margin: "0 auto 30px",
      textAlign: "center",
      [theme.breakpoints.down("xs")]: {
        width: 69,
        marginBottom: 30,
      },
    },
    logoText: {
      width: "100%",
      textAlign: "center",
      [theme.breakpoints.down("xs")]: {
        width: "80%",
        margin: "0 auto",
      },
      "& svg": { width: "100%", height: 41, marginBottom: 10 },
    },
    textfieldStyle: {
      "& input": { backgroundColor: "#f5f5f5", borderRadius: 10 },
      "& fieldset": { border: 0 },
    },
    buttonNav: {
      "& button": { width: 200, "& span": { textTransform: "capitalize", fontSize: 16, fontWeight: "bold" } },
    },
    linkBlue: { color: "#6083E7", fontWeight: "bold", cursor: "pointer", "&:hover": { textDecoration: "underline" } },
    loginContainer: { height: "90vh", paddingTop: "3%" },
    loginInner: { maxWidth: 280 },
    loginDisabled: {
      opacity: 0.5,
    },
  })
)

export default function Login({ setIdentity, lastDomain, onComplete, ...props }) {
  const { t, i18n } = useTranslation()
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()

  enum Screen {
    serverAddress,
    legacyLogin,
  }
  const [screen, goToScreen] = useState(Screen.serverAddress)

  const [serverAddress, setServerAddress] = useState("")
  const defaultServerAddress = "api.lamp.digital"

  const [legacyCredentials, setLegacyCredentials] = useState({
    id: null,
    password: null,
  })

  const userLanguages = ["en-US", "es-ES", "hi-IN"]
  const getSelectedLanguage = () => {
    const matched_codes = Object.keys(locale_lang).filter((code) => code.startsWith(navigator.language))
    const lang = matched_codes.length > 0 ? matched_codes[0] : "en-US"
    return i18n.language ? i18n.language : userLanguages.includes(lang) ? lang : "en-US"
  }
  const [selectedLanguage, setSelectedLanguage]: any = useState(getSelectedLanguage())

  const [srcLocked, setSrcLocked] = useState(false)
  const [tryitMenu, setTryitMenu] = useState<Element>()
  const [helpMenu, setHelpMenu] = useState<Element>()

  useEffect(() => {
    let query = window.location.hash.split("?")
    if (!!query && query.length > 1) {
      let src = Object.fromEntries(new URLSearchParams(query[1]))["src"]
      if (typeof src === "string" && src.length > 0) {
        setServerAddress(src)
        setSrcLocked(true)
      }
    }
  }, [])
  useEffect(() => {
    i18n.changeLanguage(selectedLanguage)
  }, [selectedLanguage])

  let handleSuccess = () => {
    process.env.REACT_APP_LATEST_LAMP === "true"
      ? enqueueSnackbar(t("Note: This is the latest version of LAMP."), { variant: "info" })
      : enqueueSnackbar(t("Note: This is NOT the latest version of LAMP"), { variant: "info" })

    localStorage.setItem(
      "LAMP_user_" + legacyCredentials.id,
      JSON.stringify({
        language: selectedLanguage,
      })
    )
    ;(async () => {
      await Service.deleteDB()
    })()

    onComplete()
  }

  const form = useCallback(() => {
    switch (screen) {
      case Screen.serverAddress:
        return (
          <ServerAddressInput
            value={serverAddress}
            defaultValue={defaultServerAddress}
            locked={srcLocked}
            onChange={(event: any) => setServerAddress(event.target.value)}
            onComplete={(isOAuthAvailable: boolean) => {
              if (isOAuthAvailable) {
                try {
                  startOAuthFlow(!serverAddress.length ? defaultServerAddress : serverAddress)
                } catch (error) {
                  enqueueSnackbar(error.message, { variant: "error" })
                }
              } else {
                goToScreen(Screen.legacyLogin)
              }
            }}
            onError={(error: Error) => enqueueSnackbar(error.message, { variant: "error" })}
          />
        )
      case Screen.legacyLogin:
        return (
          <LegacyLoginInput
            values={legacyCredentials}
            onChange={(event: any) =>
              setLegacyCredentials({
                ...legacyCredentials,
                [event.target.name]: event.target.value,
              })
            }
            onSubmit={() => {
              if (!legacyCredentials.id || !legacyCredentials.password) {
                enqueueSnackbar("Incorrect username, password, or server address.", {
                  variant: "error",
                })
              }

              handleLegacyLogin(
                !serverAddress.length ? defaultServerAddress : serverAddress,
                legacyCredentials,
                setIdentity
              )
            }}
            onSuccess={handleSuccess}
            onError={(error: Error) => {
              enqueueSnackbar(error.message, { variant: "error" })

              if (!srcLocked) {
                enqueueSnackbar(t("Are you sure you're logging into the right mindLAMP server?"), {
                  variant: "info",
                })
              }
            }}
          />
        )
    }
  }, [screen, serverAddress, legacyCredentials])

  return (
    <Slide direction="right" in={true} mountOnEnter unmountOnExit>
      <ResponsiveMargin>
        <IconButton
          style={{ position: "fixed", top: 8, right: 8 }}
          onClick={(event) => setHelpMenu(event.currentTarget)}
        >
          <Icon>help</Icon>
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={helpMenu}
          keepMounted
          open={Boolean(helpMenu)}
          onClose={() => setHelpMenu(undefined)}
        >
          <MenuItem
            dense
            onClick={() => {
              setHelpMenu(undefined)
              window.open("https://docs.lamp.digital", "_blank")
            }}
          >
            <b style={{ color: colors.grey["600"] }}>{t("Help & Support")}</b>
          </MenuItem>
          <MenuItem
            dense
            onClick={() => {
              setHelpMenu(undefined)
              window.open("https://community.lamp.digital", "_blank")
            }}
          >
            <b style={{ color: colors.grey["600"] }}>LAMP {t("Community")}</b>
          </MenuItem>
          <MenuItem
            dense
            onClick={() => {
              setHelpMenu(undefined)
              window.open("mailto:team@digitalpsych.org", "_blank")
            }}
          >
            <b style={{ color: colors.grey["600"] }}>{t("Contact Us")}</b>
          </MenuItem>
        </Menu>
        <Grid container direction="row" justify="center" alignItems="center" className={classes.loginContainer}>
          <Grid item className={classes.loginInner}>
            <Box>
              <Box className={classes.logoLogin}>
                <Logo />
              </Box>
              <Box className={classes.logoText}>
                <Logotext />
                <div
                  style={{
                    height: 6,
                    marginBottom: 30,
                    background:
                      "linear-gradient(90deg, rgba(255,214,69,1) 0%, rgba(255,214,69,1) 25%, rgba(101,206,191,1) 25%, rgba(101,206,191,1) 50%, rgba(255,119,91,1) 50%, rgba(255,119,91,1) 75%, rgba(134,182,255,1) 75%, rgba(134,182,255,1) 100%)",
                  }}
                />
              </Box>
              <LanguageSelector
                userLanguages={userLanguages}
                value={selectedLanguage || ""}
                onChange={(event: any) => setSelectedLanguage(event.target.value)}
              />

              {form()}

              <Box textAlign="center" width={1} mt={4} mb={4}>
                <Link
                  underline="none"
                  className={classes.linkBlue}
                  onClick={(event) => setTryitMenu(event.currentTarget)}
                >
                  {t("Try it")}
                </Link>
                <br />
                <Link
                  underline="none"
                  className={classes.linkBlue}
                  onClick={(event) => window.open("https://www.digitalpsych.org/studies.html", "_blank")}
                >
                  {t("Research studies using mindLAMP")}
                </Link>
                <Menu
                  keepMounted
                  open={Boolean(tryitMenu)}
                  anchorPosition={tryitMenu?.getBoundingClientRect()}
                  anchorReference="anchorPosition"
                  onClose={() => setTryitMenu(undefined)}
                >
                  <MenuItem disabled divider>
                    <b>{t("Try mindLAMP out as a...")}</b>
                  </MenuItem>
                  <MenuItem
                    onClick={(event) => {
                      setTryitMenu(undefined)
                      handleDemoLogin("researcher", setIdentity)
                    }}
                  >
                    {t("Researcher")}
                  </MenuItem>
                  <MenuItem
                    divider
                    onClick={(event) => {
                      setTryitMenu(undefined)
                      handleDemoLogin("clinician", setIdentity)
                    }}
                  >
                    {t("Clinician")}
                  </MenuItem>
                  <MenuItem
                    onClick={(event) => {
                      setTryitMenu(undefined)
                      handleDemoLogin("participant", setIdentity)
                    }}
                  >
                    {t("Participant")}
                  </MenuItem>
                  <MenuItem
                    onClick={(event) => {
                      setTryitMenu(undefined)
                      handleDemoLogin("patient", setIdentity)
                    }}
                  >
                    {t("Patient")}
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </ResponsiveMargin>
    </Slide>
  )
}

function LanguageSelector({ userLanguages, value, onChange }) {
  const { t } = useTranslation()

  return (
    <TextField
      select
      label={t("Select Language")}
      style={{ width: "100%" }}
      onChange={onChange}
      variant="filled"
      value={value}
    >
      {Object.keys(locale_lang).map((key, value) => {
        if (userLanguages.includes(key)) {
          return (
            <MenuItem key={key} value={key}>
              {locale_lang[key].native + " (" + locale_lang[key].english + ")"}
            </MenuItem>
          )
        }
      })}
    </TextField>
  )
}

function ServerAddressInput({ value, defaultValue, locked, onChange, onComplete, onError }) {
  const { t } = useTranslation()
  const classes = useStyles()

  const [disabled, setDisabled] = useState(false)

  let handleSubmit = async (event: any) => {
    event.preventDefault()
    setDisabled(true)

    let isOAuthAvailable: boolean
    try {
      isOAuthAvailable = await checkOAuthAvailability(!value.length ? defaultValue : value)
    } catch (error) {
      setDisabled(false)
      onError(Error(`Could not connect to server at ${value}: ${error.message}`))
      return
    }

    onComplete(isOAuthAvailable)
  }

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        margin="normal"
        name="serverAddress"
        variant="outlined"
        style={{ width: "100%" }}
        placeholder={defaultValue}
        helperText={t("Don't enter a domain if you're not sure what this option does.")}
        value={value}
        onChange={onChange}
        disabled={disabled || locked}
        InputProps={{
          classes: {
            root: classes.textfieldStyle,
          },
        }}
      />

      <Box className={classes.buttonNav} width={1} textAlign="center">
        <Fab
          variant="extended"
          style={{ background: "#7599FF", color: "White" }}
          className={disabled ? classes.loginDisabled : ""}
        >
          {t("Continue")}
          <input
            type="submit"
            style={{
              cursor: "pointer",
              position: "absolute",
              top: 0,
              bottom: 0,
              right: 0,
              left: 0,
              width: "100%",
              opacity: 0,
            }}
            disabled={disabled}
          />
        </Fab>
      </Box>
    </form>
  )
}

function LegacyLoginInput({ values, onChange, onSubmit, onSuccess, onError }) {
  const { t } = useTranslation()
  const classes = useStyles()

  const [disabled, setDisabled] = useState(false)

  let handleSubmit = async (event: any) => {
    event.preventDefault()
    setDisabled(true)

    try {
      await onSubmit()
    } catch (error) {
      onError(Error(error.message))
      setDisabled(false)
      return
    }

    onSuccess()
    setDisabled(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        required
        name="id"
        type="email"
        margin="normal"
        variant="outlined"
        style={{ width: "100%", height: 50 }}
        placeholder="my.email@address.com"
        value={values.id || ""}
        onChange={onChange}
        disabled={disabled}
        InputLabelProps={{ shrink: true }}
        InputProps={{
          classes: {
            root: classes.textfieldStyle,
          },
          autoCapitalize: "off",
        }}
      />

      <TextField
        required
        name="password"
        type="password"
        margin="normal"
        variant="outlined"
        style={{ width: "100%", height: 50, marginBottom: 40 }}
        placeholder="•••••••••"
        value={values.password || ""}
        onChange={onChange}
        disabled={disabled}
        InputProps={{
          classes: {
            root: classes.textfieldStyle,
          },
        }}
      />

      <Box className={classes.buttonNav} width={1} textAlign="center">
        <Fab
          variant="extended"
          type="submit"
          style={{ background: "#7599FF", color: "White" }}
          className={disabled ? classes.loginDisabled : ""}
        >
          {t("Login")}
          <input
            type="submit"
            style={{
              cursor: "pointer",
              position: "absolute",
              top: 0,
              bottom: 0,
              right: 0,
              left: 0,
              width: "100%",
              opacity: 0,
            }}
            disabled={disabled}
          />
        </Fab>
      </Box>
    </form>
  )
}

let checkOAuthAvailability = async (serverAddress: string): Promise<boolean> => {
  const endpoint = new URL("oauth", `https://${serverAddress}`).href
  const response = await fetch(endpoint, { method: "HEAD" })
  return response.ok
}

const pkceCodeVerifierLength = 43
let startOAuthFlow = async (serverAddress: string): Promise<void> => {
  const pkce = pkceChallenge(pkceCodeVerifierLength)

  LAMP.Auth.set_oauth_params({
    serverAddress: `https://${serverAddress}`,
    codeVerifier: pkce.code_verifier,
  })

  let urlString: string
  try {
    urlString = (await LAMP.OAuth.startOauthFlow()).url
  } catch (error) {
    throw Error(`OAuth start URL could not be retrieved from server at ${serverAddress}: ${error.message}`)
  }

  let url: URL
  try {
    url = new URL(urlString)
  } catch {
    throw Error(`Server returned an invalid OAUth start URL: ${urlString}`)
  }

  url.searchParams.set("code_challenge", pkce.code_challenge)
  window.location.assign(url.href)
}

let handleLegacyLogin = async (
  serverAddress: string,
  credentials: { id: string; password: string },
  setIdentity
): Promise<void> => {
  try {
    const res = await setIdentity({
      id: credentials.id,
      password: credentials.password,
      serverAddress: serverAddress,
    })

    if (res.authType === "participant") {
      localStorage.setItem("lastTab" + res.identity.id, JSON.stringify(new Date().getTime()))
      LAMP.SensorEvent.create(res.identity.id, {
        timestamp: Date.now(),
        sensor: "lamp.analytics",
        data: {
          type: "login",
          device_type: "Dashboard",
          user_agent: `LAMP-dashboard/${process.env.REACT_APP_GIT_SHA} ${window.navigator.userAgent}`,
        },
      } as any).then((res) => console.dir(res))
      LAMP.Type.setAttachment(res.identity.id, "me", "lamp.participant.timezone", timezoneVal())
    }
    if (res.authType === "researcher" && res.auth.serverAddress === "demo.lamp.digital") {
      let studiesSelected =
        localStorage.getItem("studies_" + res.identity.id) !== null
          ? JSON.parse(localStorage.getItem("studies_" + res.identity.id))
          : []
      if (studiesSelected.length === 0) {
        let studiesList = [res.identity.name]
        localStorage.setItem("studies_" + res.identity.id, JSON.stringify(studiesList))
        localStorage.setItem("studyFilter_" + res.identity.id, JSON.stringify(1))
      }
    }
  } catch (error) {
    console.warn("error with auth request", error)
    throw Error("Incorrect username, password, or server address.")
  }
}

const timezoneVal = () => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  return timezone
}

let handleDemoLogin = async (mode: string, setIdentity) => {
  await handleLegacyLogin(
    "demo.lamp.digital",
    {
      id: `${mode}@demo.lamp.digital`,
      password: "demo",
    },
    setIdentity
  )
}
