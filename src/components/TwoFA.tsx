// Core Imports
import React, { useState } from "react"
import {
  Fab,
  Box,
  TextField,
  Dialog,
  DialogContent,
  DialogContentText,
  Button,
  DialogActions,
  Grid,
  makeStyles,
  createStyles,
  Typography,
  Theme,
} from "@material-ui/core"
// Local Imports
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
    buttonNav: {
      marginTop: 30,
      "& button": { width: 200, "& span": { textTransform: "capitalize", fontSize: 16, fontWeight: "bold" } },
    },
    loginContainer: { height: "90vh", paddingTop: "3%" },
    loginInner: { maxWidth: 320 },
    loginDisabled: {
      opacity: 0.5,
    },
    errorMessage: { color: "red" },
  })
)

export function validateEmail(email) {
  const result = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return result.test(String(email).toLowerCase())
}

export default function TwoFA({ ...props }) {
  const { t, i18n } = useTranslation()
  const classes = useStyles()
  const [loginClick, setLoginClick] = useState(false)
  const [email, setEmail] = useState("")
  const [passcode, setPasscode] = useState("")
  const [verified, setVerified] = useState(false)
  const [showDialog, setShowDialog] = useState(false)

  const handle2FA = (e) => {
    if (!!validateEmail(email)) {
      setLoginClick(true)
      let pattern = /^(\d?){6}$/
      let result = passcode.match(pattern)
      if (email.endsWith("@bidmc.harvard.edu")) {
        setVerified(!!result)
        setShowDialog(true)
      } else {
        props.onComplete()
      }
    }
    setLoginClick(false)
  }

  return (
    <Box>
      <Grid container direction="row" justifyContent="center" alignItems="center" className={classes.loginContainer}>
        <Grid item className={classes.loginInner}>
          <form onSubmit={(e) => handle2FA(e)}>
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
              <Typography variant="subtitle1" gutterBottom align="center">
                {`${t("Please enter your email address to finish multi-factor authentication:")}`}
              </Typography>
              <TextField
                required
                id="filled-required"
                label={`${t("BIDMC Email Address")}`}
                value={email}
                variant="filled"
                onChange={(event) => setEmail(event.target.value)}
                margin="normal"
                error={
                  typeof email === "undefined" || (typeof email !== "undefined" && email?.trim() === "") ? true : false
                }
              />
              {typeof email !== "undefined" && email?.trim() !== "" && !validateEmail(email) && (
                <small className={classes.errorMessage}>{`${t("Please enter a valid email.")}`}</small>
              )}
              <TextField
                required
                id="filled-required"
                label={`${t("Email Passcode")}`}
                type="password"
                value={passcode}
                onChange={(event) => setPasscode(event.target.value)}
                variant="filled"
                margin="normal"
                error={
                  typeof passcode === "undefined" || (typeof passcode !== "undefined" && passcode?.trim() === "")
                    ? true
                    : false
                }
              />
              <Box className={classes.buttonNav} width={1} textAlign="center">
                <Fab
                  variant="extended"
                  type="button"
                  style={{ background: "#7599FF", color: "White" }}
                  onClick={handle2FA}
                  className={loginClick ? classes.loginDisabled : ""}
                >
                  {`${t("Verify")}`}
                  <input
                    type="button"
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
                    disabled={
                      typeof passcode === "undefined" ||
                      (typeof passcode !== "undefined" && passcode?.trim() === "") ||
                      typeof email === "undefined" ||
                      (typeof email !== "undefined" && email?.trim() === "") ||
                      loginClick
                    }
                  />
                </Fab>
              </Box>
            </Box>
          </form>
        </Grid>
      </Grid>
      <Dialog
        open={!!showDialog}
        onClose={() => setVerified(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {!!verified
              ? `${t("Multi-factor authentication succeeded.")}`
              : `${t("Multi-factor authentication failed. Please login again.")}`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowDialog(false)
              !!verified ? props.onComplete() : props.onLogout()
            }}
            color="primary"
            autoFocus
          >
            {`${t("Ok")}`}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
