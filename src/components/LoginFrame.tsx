import {
  Box,
  colors,
  createStyles,
  Grid,
  Icon,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  Slide,
  Theme,
} from "@material-ui/core"
import LAMP from "lamp-core"
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { ResponsiveMargin } from "./Utils"
import { ReactComponent as Logo } from "../icons/Logo.svg"
import { ReactComponent as Logotext } from "../icons/mindLAMP.svg"

export const useLoginStyles = makeStyles((theme: Theme) =>
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
    // Wide variant for the server gateway: identical to loginInner on phones,
    // opens up on larger viewports so cards can flow into two columns.
    loginInnerWide: {
      maxWidth: 320,
      "@media (min-width: 550px)": { maxWidth: 640, width: "100%" },
    },
    loginDisabled: {
      opacity: 0.5,
    },
  })
)

export default function LoginFrame({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
  const { t, i18n } = useTranslation()
  const [helpMenu, setHelpMenu] = useState<Element>()
  const classes = useLoginStyles()

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
        <Grid container direction="row" justifyContent="center" alignItems="center" className={classes.loginContainer}>
          <Grid item className={wide ? classes.loginInnerWide : classes.loginInner}>
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
            {children}
          </Grid>
        </Grid>
      </ResponsiveMargin>
    </Slide>
  )
}
