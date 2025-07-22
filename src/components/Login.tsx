// Core Imports
import React, { useState, useEffect } from "react"
import {
  Fab,
  Box,
  TextField,
  Slide,
  Menu,
  MenuItem,
  Icon,
  IconButton,
  InputAdornment,
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
import { ResponsiveMargin } from "./Utils"
import { ReactComponent as Logo } from "../icons/Logo.svg"
import { ReactComponent as Logotext } from "../icons/mindLAMP.svg"
import { useTranslation } from "react-i18next"
import { Autocomplete } from "@mui/material"
import demo_db from "../demo_db.json"
import self_help_db from "../self_help_db.json"
import SelfHelpAlertPopup from "./SelfHelpAlertPopup"

type SuggestedUrlOption = {
  label: string
}
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
      backgroundColor: "#f5f5f5", 
      borderRadius: 10,
      "& fieldset": { border: 0 },
      "& .MuiInputBase-inputAdornedEnd": { paddingRight: 48 },
    },
    buttonNav: {
      "& button": { width: 200, "& span": { textTransform: "capitalize", fontSize: 16, fontWeight: "bold" } },
    },
    linkBlue: { color: "#6083E7", fontWeight: "bold", cursor: "pointer", "&:hover": { textDecoration: "underline" } },
    loginContainer: { height: "90vh", paddingTop: "3%" },
    loginInner: { maxWidth: 320 },
    loginDisabled: {
      opacity: 0.5,
    },
  })
)

function str2ab(base64) {
  const binary = atob(base64)
  const len = binary.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i)
  return bytes.buffer
}
async function importPublicKey(pem) {
  try {
    if (typeof pem !== "string") {
      throw new Error("Public key must be a string in PEM format")
    }
    const binaryDer = str2ab(
      pem
        .replace(/-----BEGIN PUBLIC KEY-----/, "")
        .replace(/-----END PUBLIC KEY-----/, "")
        .replace(/\s/g, "")
    )

    return await window.crypto.subtle.importKey(
      "spki",
      binaryDer,
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      true,
      ["encrypt"]
    )
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function generateB64(args: { id: string; password: string }) {
  const password = args?.password?.trim()
  const response = await LAMP.Credential.publicKey()
  const key = await importPublicKey(response)
  let base64
  try {
    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP",
      },
      key,
      new TextEncoder().encode(password)
    )
    base64 = btoa(String.fromCharCode(...new Uint8Array(encrypted)))
    return base64
  } catch (error) {
    console.error(error)
  }
}

export default function Login({ setIdentity, lastDomain, onComplete, setConfirmSession, ...props }) {
  const { t, i18n } = useTranslation()
  const [state, setState] = useState({ serverAddress: lastDomain, id: undefined, password: undefined })
  const [showPassword, setShowPassword] = useState(false)
  const [srcLocked, setSrcLocked] = useState(false)
  const [tryitMenu, setTryitMenu] = useState<Element>()
  const [helpMenu, setHelpMenu] = useState<Element>()
  const [loginClick, setLoginClick] = useState(true)
  const [options, setOptions] = useState([])
  const { enqueueSnackbar } = useSnackbar()
  const classes = useStyles()
  const userLanguages = ["en-US", "es-ES", "hi-IN", "de-DE", "da-DK", "fr-FR", "ko-KR", "it-IT", "zh-CN", "zh-HK"]
  const [open, setOpen] = useState(false)
  const userTokenKey = "tokenInfo"
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

  useEffect(() => {
    setConfirmSession(false)
    let lockoutTime = null
    const cached = localStorage.getItem("cachedOptions")
    const loginAttempts = localStorage.getItem(LOGIN_ATTEMPTS_KEY) || "0"
    if (typeof localStorage.getItem(LOCKOUT_TIME_KEY) != "undefined") {
      lockoutTime = localStorage.getItem(LOCKOUT_TIME_KEY)
    }
    localStorage.clear()
    localStorage.setItem("cachedOptions", cached)
    if (!!lockoutTime) {
      localStorage.setItem(LOCKOUT_TIME_KEY, lockoutTime)
    }
    localStorage.setItem("loginAttempts", loginAttempts)
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
    const cachedOptions = localStorage.getItem("cachedOptions")
    let options: SuggestedUrlOption[]
    if (!cachedOptions) {
      options = [
        { label: "api.lamp.digital" },
        { label: "mindlamp-api.pronet.med.yale.edu" },
        { label: "mindlamp.orygen.org.au" },
        { label: "mindlamp-qa.dmh.lacounty.gov" },
      ]
    } else {
      options = (JSON.parse(cachedOptions) || []).filter((o) => typeof o?.label !== "undefined")
    }
    setOptions(options)
    let query = window.location.hash.split("?")
    if (!!query && query.length > 1) {
      let src = Object.fromEntries(new URLSearchParams(query[1]))["src"]
      if (typeof src === "string" && src.length > 0) {
        setState((state) => ({ ...state, serverAddress: src }))
        setSrcLocked(true)
      }
    }
  }, [])

  useEffect(() => {
    i18n.changeLanguage(selectedLanguage)
  }, [selectedLanguage])

  let handleServerInput = (value) => {
    setState({ ...state, serverAddress: value?.label ?? value })
  }

  let handleChange = (event) =>
    setState({
      ...state,
      [event.target.name]: event.target.type === "checkbox" ? event.target.checked : event.target.value,
    })

  const generateTokens = async (args: { id: string; password: string }) => {
    setLoginClick(false)
    const userName = args?.id?.trim()
    const password = args?.password?.trim()
    let base64 = await generateB64(args)

    if (userName && password) {
      try {
        const res = await LAMP.Credential.login(userName, base64)
        sessionStorage.setItem(
          userTokenKey,
          JSON.stringify({ accessToken: res?.data?.access_token, refreshToken: res?.data?.refresh_token })
        )
        props?.setAuthenticated(true)
      } catch (error) {
        console.log(error)
      }
    }
  }

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
    sessionStorage.clear()
    const attempts = parseInt(localStorage.getItem(LOGIN_ATTEMPTS_KEY) || "0")
    if (!checkMAxAttempts()) {
      return
    }
    setLoginClick(true)
    if (!!state.serverAddress && !options.find((item) => item?.label == state.serverAddress)) {
      options.push({ label: state.serverAddress })
      localStorage.setItem("cachedOptions", JSON.stringify(options))
    }
    setOptions(options)
    // setLoginClick(true)
    if (mode === undefined && (!state.id || !state.password)) {
      enqueueSnackbar(`${t("Incorrect username, password, or server address.")}`, {
        variant: "error",
      })
      return
    }
    if (!mode) {
      await LAMP.Auth.set_identity({
        id: !!mode ? `${mode}@demo.lamp.digital` : state.id,
        password: !!mode ? "demo" : state.password,
        serverAddress: !!mode ? "demo.lamp.digital" : state.serverAddress,
      }).catch((err) => {
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
      })
      await generateTokens({
        id: !!mode ? `${mode}@demo.lamp.digital` : state.id,
        password: !!mode ? "demo" : state.password,
      })
    }
    const res = await setIdentity({
      id: !!mode ? `${mode}@demo.lamp.digital` : state.id,
      password: !!mode ? "demo" : state.password,
      serverAddress: !!mode ? "demo.lamp.digital" : state.serverAddress,
    })

    if (res.authType === "participant") {
      await localStorage.setItem("lastTab" + res.identity.id, JSON.stringify(new Date().getTime()))
      await LAMP.SensorEvent.create(res.identity.id, {
        timestamp: Date.now(),
        sensor: "lamp.analytics",
        data: {
          type: "login",
          device_type: "Dashboard",
          user_agent: `LAMP-dashboard/${process.env.REACT_APP_GIT_SHA} ${window.navigator.userAgent}`,
        },
      } as any).then((res) => console.dir(res))
      await LAMP.Type.setAttachment(res.identity.id, "me", "lamp.participant.timezone", timezoneVal())
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
    process.env.REACT_APP_LATEST_LAMP === "true"
      ? enqueueSnackbar(`${t("Note: This is the latest version of LAMP.")}`, { variant: "info" })
      : enqueueSnackbar(`${t("Note: This is NOT the latest version of LAMP")}`, { variant: "info" })
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
    if (!srcLocked)
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
  const handleSubmit = () => {
    LAMP.initializeDemoDB(self_help_db)
    localStorage.setItem("demo_mode", "self_help")
    handleLogin(event, "selfHelp")
  }
  const timezoneVal = () => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    return timezone
  }

  return (
    <>
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
                window.open("https://docs.lamp.digital/troubleshooting", "_blank")
              }}
            >
              <b style={{ color: colors.grey["600"] }}>{`${t("Help & Support")}`}</b>
            </MenuItem>
            <MenuItem
              dense
              onClick={() => {
                setHelpMenu(undefined)
                window.open("https://community.lamp.digital", "_blank")
              }}
            >
              <b style={{ color: colors.grey["600"] }}>LAMP {`${t("Community")}`}</b>
            </MenuItem>
            <MenuItem
              dense
              onClick={() => {
                setHelpMenu(undefined)
                window.open("mailto:team@digitalpsych.org", "_blank")
              }}
            >
              <b style={{ color: colors.grey["600"] }}>{`${t("Contact Us")}`}</b>
            </MenuItem>
            <MenuItem
              dense
              onClick={() => {
                setHelpMenu(undefined)
                window.open("https://docs.lamp.digital/privacy/", "_blank")
              }}
            >
              <b style={{ color: colors.grey["600"] }}>{`${t("Privacy Policy")}`}</b>
            </MenuItem>
          </Menu>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            className={classes.loginContainer}
          >
            <Grid item className={classes.loginInner}>
              <form onSubmit={(e) => handleLogin(e)}>
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
                  <Autocomplete
                    freeSolo={true}
                    id="serever-selector"
                    options={options}
                    sx={{ width: "100%", marginTop: "12px" }}
                    value={state.serverAddress || ""}
                    onChange={(event, value) => handleServerInput(value)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name="serverAddress"
                        variant="filled"
                        value={state.serverAddress || ""}
                        onChange={(event) => handleServerInput(event.target.value)}
                        InputProps={{ ...params.InputProps, disableUnderline: true }}
                        label={t("Server Address")}
                        helperText={t("Don't enter a domain if you're not sure what this option does.")}
                      />
                    )}
                  />
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

                  <Box textAlign="center" width={1} mt={4} mb={4}>
                    <Link
                      underline="none"
                      className={classes.linkBlue}
                      onClick={(event) => {
                        LAMP.initializeDemoDB(demo_db)
                        localStorage.setItem("demo_mode", "try_it")
                        setTryitMenu(event.currentTarget)
                      }}
                      // setTryitMenu(event.currentTarget)}
                    >
                      {`${t("Try it")}`}
                    </Link>
                    <br />
                    <Link
                      underline="none"
                      className={classes.linkBlue}
                      onClick={(event) => {
                        setOpen(true)
                      }}
                    >
                      {`${t("Self Help")}`}
                    </Link>
                    {/* <Link
                    underline="none"
                    className={classes.linkBlue}
                    onClick={(event) => window.open("https://www.digitalpsych.org/studies.html", "_blank")}
                  >
                    {`${t("Research studies using mindLAMP")}`}
                  </Link> */}
                    <Menu
                      keepMounted
                      open={Boolean(tryitMenu)}
                      anchorPosition={tryitMenu?.getBoundingClientRect()}
                      anchorReference="anchorPosition"
                      onClose={() => setTryitMenu(undefined)}
                    >
                      <MenuItem disabled divider>
                        <b>{`${t("Try mindLAMP out as a...")}`}</b>
                      </MenuItem>
                      <MenuItem
                        onClick={(event) => {
                          setTryitMenu(undefined)
                          handleLogin(event, "researcher")
                        }}
                      >
                        {`${t("Researcher")}`}
                      </MenuItem>
                      <MenuItem
                        divider
                        onClick={(event) => {
                          setTryitMenu(undefined)
                          handleLogin(event, "clinician")
                        }}
                      >
                        {`${t("Clinician")}`}
                      </MenuItem>
                      <MenuItem
                        onClick={(event) => {
                          setTryitMenu(undefined)
                          handleLogin(event, "participant")
                        }}
                      >
                        {`${t("Participant")}`}
                      </MenuItem>
                      <MenuItem
                        onClick={(event) => {
                          setTryitMenu(undefined)
                          handleLogin(event, "patient")
                        }}
                      >
                        {`${t("User")}`}
                      </MenuItem>
                    </Menu>
                  </Box>
                </Box>
              </form>
            </Grid>
          </Grid>
        </ResponsiveMargin>
      </Slide>
      <SelfHelpAlertPopup open={open} onClose={() => setOpen(false)} onSubmit={handleSubmit} />
    </>
  )
}
