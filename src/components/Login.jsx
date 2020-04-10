// Core Imports
import React, { useState, useEffect } from "react"
import {
  Typography,
  TextField,
  Button,
  Avatar,
  Slide,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Menu,
  MenuItem,
  Icon,
  IconButton,
  colors,
} from "@material-ui/core"
import { useSnackbar } from "notistack"

// Local Imports
import { ResponsivePaper, ResponsiveMargin } from "./Utils"

export default function Login({ setIdentity, lastDomain, onComplete, ...props }) {
  const [state, setState] = useState({ serverAddress: lastDomain })
  const [srcLocked, setSrcLocked] = useState(false)
  const [tryitMenu, setTryitMenu] = useState()
  const [helpMenu, setHelpMenu] = useState()
  const { enqueueSnackbar } = useSnackbar()

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

  let handleLogin = (event, mode) => {
    event.preventDefault()
    if (mode === undefined && (!state.id || !state.password)) return
    setIdentity({
      id: !!mode ? `${mode}@demo.lamp.digital` : state.id,
      password: !!mode ? "demo" : state.password,
      serverAddress: !!mode ? "demo.lamp.digital" : state.serverAddress,
    })
      .then((res) => {
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
    <Slide direction='right' in={true} mountOnEnter unmountOnExit>
      <ResponsiveMargin
        style={{
          position: "absolute",
          width: "33%",
          left: 0,
          right: 0,
          margin: "0 auto",
        }}
      >
        <ResponsivePaper elevation={12} style={{ padding: "16px" }}>
          <IconButton
            style={{ position: "absolute", top: 8, right: 8 }}
            onClick={(event) => setHelpMenu(event.currentTarget)}
          >
            <Icon>help</Icon>
            <Menu
              keepMounted
              open={Boolean(helpMenu)}
              anchorPosition={helpMenu?.getBoundingClientRect()}
              anchorReference='anchorPosition'
              onClose={() => setHelpMenu()}
            >
              <MenuItem
                dense
                onClick={() => {
                  setHelpMenu()
                  window.open("https://docs.lamp.digital", "_blank")
                }}
              >
                <b style={{ color: colors.grey["600"] }}>Help & Support</b>
              </MenuItem>
              <MenuItem
                dense
                onClick={() => {
                  setHelpMenu()
                  window.open("https://community.lamp.digital", "_blank")
                }}
              >
                <b style={{ color: colors.grey["600"] }}>LAMP Community</b>
              </MenuItem>
              <MenuItem
                dense
                onClick={() => {
                  setHelpMenu()
                  window.open("mailto:team@digitalpsych.org", "_blank")
                }}
              >
                <b style={{ color: colors.grey["600"] }}>Contact Us</b>
              </MenuItem>
            </Menu>
          </IconButton>
          <Avatar alt='mindLAMP' src={`${process.env.PUBLIC_URL}/logo.png`} style={{ margin: "auto" }} />
          <Typography variant='h4' align='center' style={{ fontWeight: 400, paddingBottom: 20, paddingTop: 10 }}>
            mindLAMP
          </Typography>
          <form onSubmit={handleLogin}>
            <div>
              <TextField
                margin='dense'
                size='small'
                name='serverAddress'
                variant='outlined'
                style={{ width: "100%", height: 76 }}
                label='Domain'
                placeholder='api.lamp.digital'
                helperText="Don't enter a domain if you're not sure what this option does."
                value={state.serverAddress || ""}
                onChange={handleChange}
                disabled={srcLocked}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                required
                name='id'
                label='ID'
                margin='normal'
                variant='outlined'
                style={{ width: "100%", height: 76 }}
                placeholder='my.email@address.com'
                helperText='Use your email address to login.'
                value={state.id || ""}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                required
                name='password'
                label='Password'
                type='password'
                margin='normal'
                variant='outlined'
                style={{ width: "100%", height: 76, marginBottom: 24 }}
                placeholder='•••••••••'
                helperText='Use your password to login.'
                value={state.password || ""}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
              <br />
              <Button
                variant='outlined'
                color='default'
                style={{ width: "45%" }}
                onClick={(event) => setTryitMenu(event.currentTarget)}
              >
                Try It
              </Button>
              <Menu
                keepMounted
                open={Boolean(tryitMenu)}
                anchorPosition={tryitMenu?.getBoundingClientRect()}
                anchorReference='anchorPosition'
                onClose={() => setTryitMenu()}
              >
                <MenuItem disabled divider>
                  <b>Try mindLAMP out as a...</b>
                </MenuItem>
                <MenuItem
                  onClick={(event) => {
                    setTryitMenu()
                    handleLogin(event, "researcher")
                  }}
                >
                  Researcher
                </MenuItem>
                <MenuItem
                  divider
                  onClick={(event) => {
                    setTryitMenu()
                    handleLogin(event, "clinician")
                  }}
                >
                  Clinician
                </MenuItem>
                <MenuItem
                  onClick={(event) => {
                    setTryitMenu()
                    handleLogin(event, "participant")
                  }}
                >
                  Participant
                </MenuItem>
                <MenuItem
                  onClick={(event) => {
                    setTryitMenu()
                    handleLogin(event, "patient")
                  }}
                >
                  Patient
                </MenuItem>
              </Menu>
              <Button
                variant='contained'
                color='primary'
                type='submit'
                style={{ float: "right", width: "45%" }}
                onClick={handleLogin}
              >
                Login
                <input
                  type='submit'
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
            </div>
          </form>
        </ResponsivePaper>
      </ResponsiveMargin>
    </Slide>
  )
}
