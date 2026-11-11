// Core Imports
import React, { useState, useEffect } from "react"
import {
  Fab,
  Box,
  TextField,
  MenuItem,
  Icon,
  IconButton,
  InputAdornment,
  Grid,
  Typography,
  Button,
} from "@material-ui/core"
import { useSnackbar } from "notistack"
import LAMP from "lamp-core"
import locale_lang from "../locale_map.json"
import { Service } from "./DBService/DBService"

// Local Imports
import { useTranslation } from "react-i18next"
import { clearLocalStorageItems, isInMobileApp } from "./helper"
import { useAuthContext } from "./AuthProvider"
import LoginFrame, { useLoginStyles } from "./LoginFrame"
import { KNOWN_SERVERS } from "./ServerGateway"
import { ReactComponent as GoogleLogo } from "../icons/GoogleLogo.svg"

const PROVIDER_NAMES = { google: "Google", apple: "Apple", microsoft: "Microsoft" }

export default function Login({ setIdentity, lastDomain, onComplete, setConfirmSession, clearServer, ...props }) {
  const { t, i18n } = useTranslation()
  const [state, setState] = useState({ id: undefined, password: undefined })
  const [showPassword, setShowPassword] = useState(false)
  const [loginClick, setLoginClick] = useState(true)
  const { enqueueSnackbar } = useSnackbar()
  const classes = useLoginStyles()
  const userLanguages = ["en-US", "es-ES", "hi-IN", "de-DE", "da-DK", "fr-FR", "ko-KR", "it-IT", "zh-CN", "zh-HK"]
  const getSelectedLanguage = () => {
    const matched_codes = Object.keys(locale_lang).filter((code) => code.startsWith(navigator.language))
    const lang = matched_codes.length > 0 ? matched_codes[0] : "en-US"
    return i18n.language ? i18n.language : userLanguages.includes(lang) ? lang : "en-US"
  }
  const [selectedLanguage, setSelectedLanguage]: any = useState(getSelectedLanguage())
  const MAX_ATTEMPTS = 5
  const LOCKOUT_DURATION = 60 * 60 * 1000
  const LOGIN_ATTEMPTS_KEY = "loginAttempts"
  const LOCKOUT_TIME_KEY = "lockoutTime"
  const [isLockedOut, setIsLockedOut] = useState(false)
  const { setIsLoggedIn } = useAuthContext()
  const srcLocked = props.srcLocked

  useEffect(() => {
    setConfirmSession(false)
    let lockoutTime = null
    if (typeof localStorage.getItem(LOCKOUT_TIME_KEY) != "undefined") {
      lockoutTime = localStorage.getItem(LOCKOUT_TIME_KEY)
    }
    if (lockoutTime) {
      const lockoutEnd = parseInt(lockoutTime) + LOCKOUT_DURATION
      const now = Date.now()
      if (now < lockoutEnd) {
        setIsLockedOut(true)
        const remaining = lockoutEnd - now
        setTimeout(() => {
          setIsLockedOut(false)
          localStorage.removeItem(LOCKOUT_TIME_KEY)
          localStorage.removeItem(LOGIN_ATTEMPTS_KEY)
        }, remaining)
      } else {
        // Lockout expired
        localStorage.removeItem(LOCKOUT_TIME_KEY)
        localStorage.removeItem(LOGIN_ATTEMPTS_KEY)
      }
    }
    checkMAxAttempts()
  }, [])

  useEffect(() => {
    i18n.changeLanguage(selectedLanguage)
  }, [selectedLanguage])

  let handleChange = (event) =>
    setState({
      ...state,
      [event.target.name]: event.target.type === "checkbox" ? event.target.checked : event.target.value,
    })

  const checkMAxAttempts = () => {
    const attempts = parseInt(localStorage.getItem(LOGIN_ATTEMPTS_KEY) || "0")
    if (attempts >= MAX_ATTEMPTS) {
      const lockoutUntil = Date.now() + LOCKOUT_DURATION
      localStorage.setItem(LOCKOUT_TIME_KEY, lockoutUntil.toString())
      setIsLockedOut(true)
      return false
    }
    return true
  }

  let handleLogin = async (event: any, mode?: string) => {
    event.preventDefault()
    clearLocalStorageItems()
    const attempts = parseInt(localStorage.getItem(LOGIN_ATTEMPTS_KEY) || "0")
    if (!checkMAxAttempts()) {
      return
    }
    setLoginClick(true)

    // setLoginClick(true)
    if (mode === undefined && (!state.id || !state.password)) {
      enqueueSnackbar(`${t("Incorrect username, password, or server address.")}`, {
        variant: "error",
      })
      return
    }

    let res: any
    if (!mode) {
      try {
        res = await setIdentity({
          id: state.id,
          password: state.password,
          serverAddress: LAMP.Auth._auth.serverAddress,
        })
      } catch (err) {
        // Failed login throws an error
        const currentAttempts = attempts + 1
        localStorage.setItem(LOGIN_ATTEMPTS_KEY, currentAttempts.toString())
        if (currentAttempts >= MAX_ATTEMPTS) {
          const lockoutUntil = Date.now() + LOCKOUT_DURATION
          localStorage.setItem(LOCKOUT_TIME_KEY, lockoutUntil.toString())
          setIsLockedOut(true)
          setLoginClick(false)
        } else {
          enqueueSnackbar(`${t("Incorrect username, password, or server address.")}`, {
            variant: "error",
          })
          if (!srcLocked)
            enqueueSnackbar(`${t("Are you sure you're logging into the right mindLAMP server?")}`, {
              variant: "info",
            })
        }
      }
      setLoginClick(false)
    } else {
      res = await setIdentity({
        id: `${mode}@demo.lamp.digital`,
        password: "demo",
        serverAddress: "demo.lamp.digital",
      })
    }

    if (res?.authType === "participant") {
      await localStorage.setItem("lastTab" + res.identity.id, JSON.stringify(new Date().getTime()))
      await LAMP.SensorEvent.create(res.identity.id, {
        timestamp: Date.now(),
        sensor: "lamp.analytics",
        data: {
          type: "login",
          device_type: "Dashboard",
          user_agent: `LAMP-dashboard/${process.env.REACT_APP_GIT_SHA} ${window.navigator.userAgent}`,
        },
      } as any)
      await LAMP.Type.setAttachment(res.identity.id, "me", "lamp.participant.timezone", timezoneVal())
    }
    if (res?.authType === "researcher" && res.auth.serverAddress === "demo.lamp.digital") {
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
    localStorage.setItem(
      "LAMP_user_" + res?.identity?.id,
      JSON.stringify({
        language: selectedLanguage,
      })
    )
    ;(async () => {
      await Service.deleteDB()
      await Service.deleteUserDB()
    })()
    // No result means the login failed (setIdentity catches the error itself)
    if (!res && !srcLocked)
      enqueueSnackbar(`${t("Are you sure you're logging into the right mindLAMP server?")}`, { variant: "info" })
    onComplete()
    setLoginClick(true)
    // .catch((err) => {
    //   // console.warn("error with auth request", err)
    //   enqueueSnackbar(`${t("Incorrect username, password, or server address.")}`, {
    //     variant: "error",
    //   })
    //   if (!srcLocked)
    //     enqueueSnackbar(`${t("Are you sure you're logging into the right mindLAMP server?")}`, { variant: "info" })
    //   setLoginClick(false)
    // })
  }

  // Google blocks OAuth sign-in inside the mobile apps' web views
  const configuredProviders = isInMobileApp() ? [] : LAMP.Auth._configuredProviders
  const [showStaffSignIn, setShowStaffSignIn] = useState(false)

  const handleOAuthLogin = async (socialProvider) => {
    const result = (await LAMP.Credential.startOAuth(socialProvider)) as any
    if (result.redirectUrl) {
      window.location.replace(result.redirectUrl)
    }
  }

  const timezoneVal = () => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    return timezone
  }

  return (
    <>
      <LoginFrame>
        <Grid item className={classes.loginInner}>
          {(() => {
            // Show the friendly server card (logo + name) when the selected server
            // is a known deployment; fall back to the raw address for custom servers.
            const serverAddress = LAMP.Auth._auth.serverAddress
            const known = KNOWN_SERVERS.find((s) => s.apiServerUrl === serverAddress)
            return (
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  margin: "12px 0",
                  padding: "10px 16px",
                  borderRadius: 10,
                  backgroundColor: "#f5f5f5",
                }}
              >
                <Box style={{ display: "flex", alignItems: "center" }}>
                  {known?.logo && (
                    <img
                      src={known.logo}
                      alt={known.name}
                      style={{ width: 28, height: 28, borderRadius: 6, marginRight: 10, objectFit: "contain" }}
                    />
                  )}
                  <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(0,0,0,0.7)" }}>
                    {known?.name || serverAddress}
                  </span>
                </Box>
                {!srcLocked && (
                  <button
                    type="button"
                    onClick={() => clearServer()}
                    style={{
                      background: "transparent",
                      color: "#7599FF",
                      border: "1px solid #7599FF",
                      borderRadius: 8,
                      padding: "6px 20px",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {`${t("Change")}`}
                  </button>
                )}
              </Box>
            )
          })()}
          <form onSubmit={(e) => handleLogin(e)}>
            <Box>
              {isLockedOut && (
                <div style={{ marginBottom: "12px" }}>
                  <span style={{ color: "red", fontSize: "14px" }}>
                    {t("Too many login attempts. Try again after 1 hour.")}
                  </span>
                </div>
              )}
              <TextField
                select
                label={`${t("Select Language")}`}
                style={{ width: "100%" }}
                onChange={(event) => {
                  setSelectedLanguage(event.target.value)
                }}
                variant="filled"
                value={selectedLanguage || "en-US"}
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

              <TextField
                required
                name="id"
                type="email"
                margin="normal"
                variant="outlined"
                style={{ width: "100%", height: 50 }}
                placeholder={`${t("my.email@address.com")}`}
                value={state.id || ""}
                onChange={handleChange}
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
                type={showPassword ? "text" : "password"}
                margin="normal"
                variant="outlined"
                style={{ width: "100%", height: 50, marginBottom: 40 }}
                placeholder="•••••••••"
                value={state.password || ""}
                onChange={handleChange}
                InputProps={{
                  classes: {
                    root: classes.textfieldStyle,
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        onMouseDown={(event) => event.preventDefault()}
                        edge="end"
                      >
                        <Icon>{showPassword ? "visibility_off" : "visibility"}</Icon>
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Box className={classes.buttonNav} width={1} textAlign="center">
                <Fab
                  variant="extended"
                  type="submit"
                  style={{ background: "#7599FF", color: "White" }}
                  onClick={handleLogin}
                  className={loginClick && isLockedOut ? classes.loginDisabled : ""}
                  disabled={loginClick && isLockedOut}
                >
                  {`${t("Login")}`}
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
                    disabled={loginClick && isLockedOut}
                  />
                </Fab>
              </Box>
            </Box>
          </form>
          {/* Google sign-in is only for research staff, so it stays behind a link (and is absent in the mobile apps) */}
          {configuredProviders.length > 0 && (
            <Box
              style={{
                marginTop: 32,
                marginBottom: 32,
                paddingTop: showStaffSignIn ? 20 : 8,
                borderTop: "1px solid #e0e0e0",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
              }}
            >
              {!showStaffSignIn ? (
                <button
                  type="button"
                  onClick={() => setShowStaffSignIn(true)}
                  style={{
                    minHeight: 44,
                    padding: "0 12px",
                    border: 0,
                    background: "transparent",
                    color: "#4467D6",
                    fontFamily: "inherit",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {`${t("Research staff sign-in")}`}
                </button>
              ) : (
                <>
                  <Typography style={{ fontSize: 13, color: "rgba(0,0,0,0.6)", textAlign: "center" }}>
                    {`${t("For research staff who have set up Google sign-in.")}`}
                  </Typography>
                  {configuredProviders.map((providerKey) => (
                    // Follows Google's "Sign in with Google" button guidelines
                    <button
                      type="button"
                      key={`login-with-${providerKey}`}
                      onClick={() => handleOAuthLogin(providerKey)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 12,
                        width: 240,
                        height: 44,
                        padding: "0 12px",
                        border: "1px solid #747775",
                        borderRadius: 22,
                        background: "#ffffff",
                        color: "#1F1F1F",
                        fontFamily: "Roboto, Arial, sans-serif",
                        fontSize: 14,
                        fontWeight: 500,
                        letterSpacing: 0.25,
                        cursor: "pointer",
                      }}
                    >
                      {providerKey === "google" && <GoogleLogo aria-hidden="true" />}
                      {`${t("Sign in with")} ${PROVIDER_NAMES[providerKey] ?? providerKey}`}
                    </button>
                  ))}
                </>
              )}
            </Box>
          )}
        </Grid>
      </LoginFrame>
    </>
  )
}
