import React from "react"
import { makeStyles, createStyles, Grid, Theme, Box, Paper, InputBase, IconButton, Button } from "@material-ui/core"
import { ReactComponent as LogoMindLamp } from "../icons/LogoMindlamp.svg"
import { ReactComponent as LogoArmyLevelUp } from "../icons/LogoArmyLevelUp.svg"
import { useHistory } from "react-router-dom"
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    loginmain: {
      textAlign: "center",
    },
    landingMain: { height: "100vh", background: "#f4f4f4" },
    logoContainer: {
      width: 200,
      height: 200,
      background: "rgba(255,255,255,0.5)",
      padding: "0 60px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 8,
      cursor: "pointer",
      "& svg": {
        maxWidth: 100,
      },
      "&.safeguard": {
        background: "linear-gradient(to right, #3E6457 0%, #A3B98B 100%)",
        marginLeft: 16,
      },
      "&:hover": {
        boxShadow: "0px 0px 13px 1px rgba(0,0,0,0.19)",
      },
      [theme.breakpoints.down("sm")]: {
        width: 140,
        height: 140,
        padding: "0 40px",
      },
    },
    logoOuter: {
      display: "flex",
    },
    inputText: {
      padding: 6,
      display: "flex",
      alignItems: "center",
      marginTop: 24,
      borderRadius: 32,
    },
    input: {
      marginLeft: 10,
      flex: 1,
    },
    iconButton: {
      padding: 12,
      background: "#7DB2FF",
      color: "#fff",
      fontSize: 20,
      "&:hover": {
        background: "#377adfff",
      },
    },

    loginBG: {
      height: "100%",
      position: "fixed",
      zIndex: -1,
      [theme.breakpoints.down("xs")]: {
        left: "-58%",
        top: 0,
        height: "107%",
      },
    },
  })
)

export default function Home() {
  const classes = useStyles()
  const [url, setUrl] = React.useState("")

  return (
    <>
      <Grid container justifyContent="center" alignItems="center" className={classes.landingMain}>
        <Grid container md={8} lg={5}>
          <Grid xs item className={classes.logoOuter} justifyContent="center">
            <Button
              focusRipple
              className={classes.logoContainer}
              onClick={() => {
                localStorage.setItem("site-selected", "true")
                window.location.href = "https://lamp-dashboard.zcodemo.com"
              }}
            >
              <LogoMindLamp />
            </Button>
            <Button
              focusRipple
              className={classes.logoContainer + " safeguard"}
              onClick={() => {
                localStorage.setItem("site-selected", "true")
                window.location.href = "https://lampdev.armylevelup.app"
              }}
            >
              <LogoArmyLevelUp />
            </Button>
          </Grid>
          <Grid xs={12}>
            <Box p={3}>
              <Paper component="form" className={classes.inputText}>
                <InputBase
                  className={classes.input}
                  placeholder="Type the URL here"
                  onChange={(e) => setUrl((e.target as HTMLInputElement).value)}
                  //inputProps={{ "aria-label": "search google maps" }}
                />
                <IconButton
                  color="primary"
                  className={classes.iconButton}
                  aria-label="Go"
                  onClick={() => (window.location.href = url)}
                >
                  Go
                </IconButton>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}
