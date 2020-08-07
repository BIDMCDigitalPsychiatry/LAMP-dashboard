// Core Imports
import React, { useState, useEffect } from "react"
import {
  Fab,
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

// Local Imports
import { ResponsivePaper, ResponsiveMargin } from "./Utils"
import { ReactComponent as Logo } from "../icons/Logo.svg"
import { ReactComponent as Logotext } from "../icons/mindLAMP.svg"
import { Theme } from "@material-ui/core/styles"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    logoLogin: {
      width: 90,
      margin: "0 auto 60px",
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
    inputText: {},
    buttonNav: {
      "& button": { width: 200, "& span": { textTransform: "capitalize", fontSize: 16, fontWeight: "bold" } },
    },
    linkBlue: { color: "#6083E7", fontWeight: "bold" },
    loginContainer: { height: "90vh" },
    loginInner: { maxWidth: 280 },
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
      <ResponsiveMargin>
        <IconButton
          style={{ position: "fixed", top: 8, right: 8 }}
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
                      marginBottom: 40,
                      background:
                        "linear-gradient(90deg, rgba(255,214,69,1) 0%, rgba(255,214,69,1) 25%, rgba(101,206,191,1) 25%, rgba(101,206,191,1) 50%, rgba(255,119,91,1) 50%, rgba(255,119,91,1) 75%, rgba(134,182,255,1) 75%, rgba(134,182,255,1) 100%)",
                    }}
                  />
                </Box>

                <TextField
                margin="normal"
                
                name="serverAddress"
                variant="outlined"
                style={{ width: "100%", height: 90 }}
                // label="Domain"
                placeholder="api.lamp.digital"
                helperText="Don't enter a domain if you're not sure what this option does."
                value={state.serverAddress || ""}
                onChange={handleChange}
                disabled={srcLocked}
                InputProps={{
                  classes: {
                    root: classes.textfieldStyle,
                  },
                }}
              />
                {/* <TextField
                required
                name="ID"
                label="ID"
                
                margin="normal"
                variant="outlined"
                style={{ width: "100%", height: 50, marginBottom: 10 }}
                placeholder="Email address"
                
                value={state.id || ""}
                onChange={handleChange}
                InputProps={{
                  classes: {
                     root: classes.textfieldStyle,
                    
                  }
               }}
              /> */}

                <TextField
                  required
                  name="id"
                  // label="ID"
                  margin="normal"
                  variant="outlined"
                  style={{ width: "100%", height: 50 }}
                  placeholder="my.email@address.com"
                  // helperText="Use your email address to login."
                  value={state.id || ""}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    classes: {
                      root: classes.textfieldStyle,
                    },
                  }}
                />

                <TextField
                  required
                  name="password"
                  // label="Password"
                  type="password"
                  margin="normal"
                  variant="outlined"
                  style={{ width: "100%", height: 50, marginBottom: 40 }}
                  placeholder="•••••••••"
                  // helperText="Use your password to login."
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
                    </Fab>
                 
                </Box>

                <Box textAlign="center" width={1} mt={4} >
                <Link underline="none" className={classes.linkBlue} onClick={(event) => setTryitMenu(event.currentTarget)}>
                    Try it
                    </Link>
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
                 
                
                </Box>
              </Box>
            </form>
          </Grid>
        </Grid>
      </ResponsiveMargin>
    </Slide>
  )
}
