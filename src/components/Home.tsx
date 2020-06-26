// Core Imports
import React, { useState, useEffect } from "react"
import {
  Box,
  Avatar,
  Container,
  Typography,
  Divider,
  Button,
  Link,
  makeStyles,
  createStyles,
  Grid,
} from "@material-ui/core"
import { useSnackbar } from "notistack"
import LAMP from "lamp-core"
import { Link as Linkref } from "react-router-dom"
import { ReactComponent as Logo } from "../icons/logo.svg"
import { ReactComponent as Logotext } from "../icons/mindLAMP.svg"
import { Theme } from "@material-ui/core/styles"

// Local Imports
import { ResponsivePaper, ResponsiveMargin } from "./Utils"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    loginmain: {
      textAlign: "center",
    },
    btnprimary: {
      background: "#7599FF",
      borderRadius: "40px",
      minWidth: "200px",
      boxShadow: " 0px 10px 15px rgba(96, 131, 231, 0.2)",
      lineHeight: "38px",
      marginTop: "35%",
      fontFamily: "inter",
      textTransform: "capitalize",
      fontSize: "16px",
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
      margin: "40px 0 10px 0",
    },
  })
)

// const useStyles = makeStyles(() => createStyles({} as any))
export default function Home() {
  const [srcLocked, setSrcLocked] = useState(false)
  const [tryitMenu, setTryitMenu] = useState<Element>()
  const [helpMenu, setHelpMenu] = useState<Element>()
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {}, [])

  const classes = useStyles()
  return (
    <Grid container direction="row" justify="center" alignItems="center" style={{ height: "100vh" }}>
      <Grid item className={classes.loginmain}>
        <div>
          {" "}
          <Logo />
        </div>
        <div className={classes.logotext}>
          {" "}
          <Logotext />
        </div>
        <Grid container spacing={0}>
          <Grid item xs={3} className={classes.lineyellow}></Grid>
          <Grid item xs={3} className={classes.linegreen}></Grid>
          <Grid item xs={3} className={classes.linered}></Grid>
          <Grid item xs={3} className={classes.lineblue}></Grid>
        </Grid>

        <Button component={Linkref} to="/login" variant="contained" color="primary" className={classes.btnprimary}>
          Login
        </Button>
        <Typography>
          <Link href="#" className={classes.register}>
            Create an account
          </Link>
        </Typography>
      </Grid>
    </Grid>
  )
}
