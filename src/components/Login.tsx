// Core Imports
import React, { useState, useEffect } from "react"
import {
  Box,
  TextField,
  Button,
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
} from "@material-ui/core"
import { useSnackbar } from "notistack"
import LAMP from "lamp-core"
import { Link as RouterLink } from "react-router-dom"

// Local Imports
import { ResponsivePaper, ResponsiveMargin } from "./Utils"
import { ReactComponent as Logo } from "../icons/Logo.svg"
import { ReactComponent as Logotext } from "../icons/mindLAMP.svg"
import { Theme } from "@material-ui/core/styles"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    loginmain: {
      textAlign: "center",
    },
    btnprimary: {
      background: "#7599FF",
      borderRadius: "40px",
      minWidth: "45%",
      boxShadow: " 0px 10px 15px rgba(96, 131, 231, 0.2)",
      lineHeight: "38px",
      fontFamily: "inter",
      textTransform: "capitalize",
      fontSize: "16px",
      float: "right",
      cursor: "pointer",
    },
    btnTry: {
      borderRadius: "40px",
      minWidth: "45%",
      boxShadow: " 0px 10px 15px rgba(96, 131, 231, 0.2)",
      lineHeight: "38px",
      fontFamily: "inter",
      textTransform: "capitalize",
      fontSize: "16px",
      float: "left",
      cursor: "pointer",
    },
    register: {
      color: "#6083E7",
      marginTop: "20px",
      display: "block",
      fontFamily: "inter",
    },
    lineyellow: {
      background: "#FFD645",
      height: "6px",
    },
    linegreen: {
      background: "#65CEBF",
      height: "6px",
    },
    linered: {
      background: "#FF775B",
      height: "6px",
    },
    lineblue: {
      background: "#86B6FF",
      height: "6px",
    },
    logotext: {
      margin: "25px 0 10px 0",
    },
  })
)

export default function Login({ setIdentity, lastDomain, onComplete, ...props }) {
  const [state, setState] = useState({ serverAddress: lastDomain, id: undefined, password: undefined })
  const [srcLocked, setSrcLocked] = useState(false)
  const [tryitMenu, setTryitMenu] = useState<Element>()
  const [helpMenu, setHelpMenu] = useState<Element>()
  const { enqueueSnackbar } = useSnackbar()
  const classes = useStyles()

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

  let handleChange = (event) =>
    setState({
      ...state,
      [event.target.name]: event.target.type === "checkbox" ? event.target.checked : event.target.value,
    })

  let handleLogin = (event: any, mode?: string): void => {
    event.preventDefault()
    if (mode === undefined && (!state.id || !state.password)) return
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
        onComplete()
      })
      .catch((err) => {
        console.warn("error with auth request", err)
        enqueueSnackbar("Incorrect username, password, or server address.", {
          variant: "error",
        })
        if (!srcLocked)
          enqueueSnackbar("Are you sure you're logging into the right mindLAMP server?", { variant: "info" })
      })
  }

  return (
    <Slide direction="right" in={true} mountOnEnter unmountOnExit>
      <ResponsiveMargin
        style={{
          position: "absolute",
          width: "33%",
          left: 0,
          right: 0,
          margin: "0 auto",
        }}
      >
        <ResponsivePaper elevation={12} style={{ padding: "16px", minHeight: "600px" }}>
          <IconButton
            style={{ position: "absolute", top: 8, right: 8 }}
            onClick={(event) => setHelpMenu(event.currentTarget)}
          >
            <Icon>help</Icon>
            <Menu
              keepMounted
              open={Boolean(helpMenu)}
              anchorPosition={helpMenu?.getBoundingClientRect()}
              anchorReference="anchorPosition"
              onClose={() => setHelpMenu(undefined)}
            >
              <MenuItem
                dense
                onClick={() => {
                  setHelpMenu(undefined)
                  window.open("https://docs.lamp.digital", "_blank")
                }}
              >
                <b style={{ color: colors.grey["600"] }}>Help & Support</b>
              </MenuItem>
              <MenuItem
                dense
                onClick={() => {
                  setHelpMenu(undefined)
                  window.open("https://community.lamp.digital", "_blank")
                }}
              >
                <b style={{ color: colors.grey["600"] }}>LAMP Community</b>
              </MenuItem>
              <MenuItem
                dense
                onClick={() => {
                  setHelpMenu(undefined)
                  window.open("mailto:team@digitalpsych.org", "_blank")
                }}
              >
                <b style={{ color: colors.grey["600"] }}>Contact Us</b>
              </MenuItem>
            </Menu>
          </IconButton>
          <form onSubmit={(e) => handleLogin(e)}>
            <Box className={classes.loginmain}>
              <div>
                <Logo height="70px" />
              </div>
              <div className={classes.logotext}>
                <Logotext />
              </div>
              <Grid container spacing={0} style={{ marginBottom: "20px" }}>
                <Grid item xs={3} className={classes.lineyellow}></Grid>
                <Grid item xs={3} className={classes.linegreen}></Grid>
                <Grid item xs={3} className={classes.linered}></Grid>
                <Grid item xs={3} className={classes.lineblue}></Grid>
              </Grid>
              <TextField
                margin="dense"
                size="small"
                name="serverAddress"
                variant="outlined"
                style={{ width: "100%", height: 76 }}
                label="Domain"
                placeholder="api.lamp.digital"
                helperText="Don't enter a domain if you're not sure what this option does."
                value={state.serverAddress || ""}
                onChange={handleChange}
                disabled={srcLocked}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                required
                name="id"
                label="ID"
                margin="normal"
                variant="outlined"
                style={{ width: "100%", height: 76 }}
                placeholder="my.email@address.com"
                helperText="Use your email address to login."
                value={state.id || ""}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                required
                name="password"
                label="Password"
                type="password"
                margin="normal"
                variant="outlined"
                style={{ width: "100%", height: 76, marginBottom: 24 }}
                placeholder="•••••••••"
                helperText="Use your password to login."
                value={state.password || ""}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
              <br />
              <Button
                variant="outlined"
                color="default"
                style={{ float: "left" }}
                className={classes.btnTry}
                onClick={(event) => setTryitMenu(event.currentTarget)}
              >
                Try It
              </Button>
              <Menu
                keepMounted
                open={Boolean(tryitMenu)}
                anchorPosition={tryitMenu?.getBoundingClientRect()}
                anchorReference="anchorPosition"
                onClose={() => setTryitMenu(undefined)}
              >
                <MenuItem disabled divider>
                  <b>Try mindLAMP out as a...</b>
                </MenuItem>
                <MenuItem
                  onClick={(event) => {
                    setTryitMenu(undefined)
                    handleLogin(event, "researcher")
                  }}
                >
                  Researcher
                </MenuItem>
                <MenuItem
                  divider
                  onClick={(event) => {
                    setTryitMenu(undefined)
                    handleLogin(event, "clinician")
                  }}
                >
                  Clinician
                </MenuItem>
                <MenuItem
                  onClick={(event) => {
                    setTryitMenu(undefined)
                    handleLogin(event, "participant")
                  }}
                >
                  Participant
                </MenuItem>
                <MenuItem
                  onClick={(event) => {
                    setTryitMenu(undefined)
                    handleLogin(event, "patient")
                  }}
                >
                  Patient
                </MenuItem>
              </Menu>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                className={classes.btnprimary}
                onClick={handleLogin}
              >
                Login
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
                />
              </Button>
            </Box>
          </form>
        </ResponsivePaper>
      </ResponsiveMargin>
    </Slide>
  )
}
