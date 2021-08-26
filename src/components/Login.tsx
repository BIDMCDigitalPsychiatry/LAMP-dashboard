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
  const [state, setState] = useState({ serverAddress: lastDomain, id: undefined, password: undefined })
  const [srcLocked, setSrcLocked] = useState(false)
  const [tryitMenu, setTryitMenu] = useState<Element>()
  const [helpMenu, setHelpMenu] = useState<Element>()
  const [loginClick, setLoginClick] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const classes = useStyles()
  const userLanguages = ["en-US", "es-ES", "hi-IN"]

  const getSelectedLanguage = () => {
    const matched_codes = Object.keys(locale_lang).filter((code) => code.startsWith(navigator.language))
    const lang = matched_codes.length > 0 ? matched_codes[0] : "en-US"
    return i18n.language ? i18n.language : userLanguages.includes(lang) ? lang : "en-US"
  }
  const [selectedLanguage, setSelectedLanguage]: any = useState(getSelectedLanguage())
  useEffect(() => {
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

  let handleChange = (event) =>
    setState({
      ...state,
      [event.target.name]: event.target.type === "checkbox" ? event.target.checked : event.target.value,
    })

  let handleLogin = (event: any, mode?: string): void => {
    event.preventDefault()
    setLoginClick(true)
    if (mode === undefined && (!state.id || !state.password)) {
      enqueueSnackbar(t("Incorrect username, password, or server address."), {
        variant: "error",
      })
      setLoginClick(false)
      return
    }
    setIdentity({
      id: !!mode ? `${mode}@demo.lamp.digital` : state.id,
      password: !!mode ? "demo" : state.password,
      serverAddress: !!mode ? "demo.lamp.digital" : state.serverAddress,
    })
      .then((res) => {
        if (res.authType === "participant") {
          LAMP.SensorEvent.create(res.identity.id, {
            timestamp: Date.now(),
            sensor: "lamp.analytics",
            data: {
              device_type: "Dashboard",
              user_agent: `LAMP-dashboard/${process.env.REACT_APP_GIT_SHA} ${window.navigator.userAgent}`,
            },
          } as any).then((res) => console.dir(res))
        }
        process.env.REACT_APP_LATEST_LAMP === "true"
          ? enqueueSnackbar(t("Note: This is the latest version of LAMP."), { variant: "info" })
          : enqueueSnackbar(t("Note: This is NOT the latest version of LAMP"), { variant: "info" })
        localStorage.setItem(
          "LAMP_user_" + res.identity.id,
          JSON.stringify({
            language: selectedLanguage,
          })
        )
        ;(async () => {
          await Service.deleteDB()
        })()
        setLoginClick(false)
        onComplete()
      })
      .catch((err) => {
        console.warn("error with auth request", err)
        enqueueSnackbar(t("Incorrect username, password, or server address."), {
          variant: "error",
        })
        if (!srcLocked)
          enqueueSnackbar(t("Are you sure you're logging into the right mindLAMP server?"), { variant: "info" })
        setLoginClick(false)
      })
  }

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
                <TextField
                  select
                  label={t("Select Language")}
                  style={{ width: "100%" }}
                  onChange={(event) => {
                    setSelectedLanguage(event.target.value)
                  }}
                  variant="filled"
                  value={selectedLanguage || ""}
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
                  margin="normal"
                  name="serverAddress"
                  variant="outlined"
                  style={{ width: "100%", height: 90 }}
                  // label="Domain"
                  placeholder="api.lamp.digital"
                  helperText={t("Don't enter a domain if you're not sure what this option does.")}
                  value={state.serverAddress || ""}
                  onChange={handleChange}
                  disabled={srcLocked}
                  InputProps={{
                    classes: {
                      root: classes.textfieldStyle,
                    },
                  }}
                />
                <TextField
                  required
                  name="id"
                  type="email"
                  margin="normal"
                  variant="outlined"
                  style={{ width: "100%", height: 50 }}
                  placeholder="my.email@address.com"
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
                  type="password"
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
                  }}
                />

                <Box className={classes.buttonNav} width={1} textAlign="center">
                  <Fab
                    variant="extended"
                    type="submit"
                    style={{ background: "#7599FF", color: "White" }}
                    onClick={handleLogin}
                    className={loginClick ? classes.loginDisabled : ""}
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
                      disabled={loginClick}
                    />
                  </Fab>
                </Box>

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
                    {/* <MenuItem                      
                      onClick={(event) => {
                        setTryitMenu(undefined)
                        handleLogin(event, "clinical_admin")
                      }}
                    >
                      {t("Clinical Administrator")}
                    </MenuItem>
                    <MenuItem
                      divider
                      onClick={(event) => {
                        setTryitMenu(undefined)
                        handleLogin(event, "user_admin")
                      }}
                    >
                      {t("User Administrator")}
                    </MenuItem> */}
                    <MenuItem
                      onClick={(event) => {
                        setTryitMenu(undefined)
                        handleLogin(event, "researcher")
                      }}
                    >
                      {t("Researcher")}
                    </MenuItem>
                    <MenuItem
                      divider
                      onClick={(event) => {
                        setTryitMenu(undefined)
                        handleLogin(event, "clinician")
                      }}
                    >
                      {t("Clinician")}
                    </MenuItem>

                    <MenuItem
                      onClick={(event) => {
                        setTryitMenu(undefined)
                        handleLogin(event, "participant")
                      }}
                    >
                      {t("Participant")}
                    </MenuItem>
                    <MenuItem
                      onClick={(event) => {
                        setTryitMenu(undefined)
                        handleLogin(event, "patient")
                      }}
                    >
                      {t("Patient")}
                    </MenuItem>
                  </Menu>
                </Box>
              </Box>
            </form>
          </Grid>
        </Grid>
      </ResponsiveMargin>
    </Slide>
  )
}
