// Core Imports
import React, { useState, useEffect } from "react"
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  useMediaQuery,
  useTheme,
} from "@material-ui/core"

import { useSnackbar } from "notistack"
import LAMP from "lamp-core"
import { CredentialManager } from "../CredentialManager"
import { ResponsivePaper } from "../Utils"
import { useTranslation } from "react-i18next"
import { ReactComponent as Researcher } from "../../icons/Researcher.svg"
import { MuiThemeProvider, makeStyles, Theme, createStyles, createMuiTheme } from "@material-ui/core/styles"
import locale_lang from "../../locale_map.json"
import { Service } from "../DBService/DBService"
import Researchers from "./Researchers"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    researcherMenu: {
      background: "#F8F8F8",
      maxWidth: 100,
      border: 0,
      [theme.breakpoints.down("sm")]: {
        maxWidth: "100%",
      },
      "& span": { fontSize: 12 },
      "& div.Mui-selected": { backgroundColor: "transparent", color: "#5784EE", "& path": { fill: "#5784EE" } },
    },
    menuItems: {
      display: "inline-block",
      textAlign: "center",
      color: "rgba(0, 0, 0, 0.4)",
      paddingTop: 40,
      paddingBottom: 30,
      [theme.breakpoints.down("sm")]: {
        paddingTop: 16,
        paddingBottom: 9,
      },
      [theme.breakpoints.down("xs")]: {
        padding: 6,
      },
    },
    menuIcon: {
      minWidth: "auto",
      [theme.breakpoints.down("xs")]: {
        top: 5,
        position: "relative",
      },
      "& path": { fill: "rgba(0, 0, 0, 0.4)", fillOpacity: 0.7 },
    },
    tableContainerWidth: {
      maxWidth: 1055,
      width: "80%",
      [theme.breakpoints.down("md")]: {
        padding: 0,
      },
      [theme.breakpoints.down("sm")]: {
        width: "100%",
      },
    },
    tableContainerWidthPad: {
      maxWidth: 1055,
      paddingLeft: 0,
      paddingRight: 0,
    },
    menuOuter: {
      paddingTop: 0,
      [theme.breakpoints.down("sm")]: {
        display: "flex",
        padding: 0,
      },
    },
    logResearcher: {
      marginTop: 50,
      zIndex: 1111,
      [theme.breakpoints.up("md")]: {
        height: "calc(100vh - 55px)",
      },
      [theme.breakpoints.down("sm")]: {
        borderBottom: "#7599FF solid 5px",
        borderRight: "#7599FF solid 5px",
      },
    },
    btnCursor: {
      "&:hover div": {
        cursor: "pointer !important",
      },
      "&:hover div > svg": {
        cursor: "pointer !important",
      },
      "&:hover div > svg > g > rect": {
        cursor: "pointer !important",
      },
      "&:hover div > svg > g > g > path": {
        cursor: "pointer !important",
      },
      "&:hover div > svg > g > g > circle": {
        cursor: "pointer !important",
      },
      "&:hover div > span": {
        cursor: "pointer !important",
      },
    },
  })
)

export default function Root({ updateStore, ...props }) {
  const { t, i18n } = useTranslation()
  const [currentTab, setCurrentTab] = useState(0)
  const classes = useStyles()
  const supportsSidebar = useMediaQuery(useTheme().breakpoints.up("md"))

  const getSelectedLanguage = () => {
    const matched_codes = Object.keys(locale_lang).filter((code) => code.startsWith(navigator.language))
    const lang = matched_codes.length > 0 ? matched_codes[0] : "en-US"
    return i18n.language ? i18n.language : lang ? lang : "en-US"
  }

  useEffect(() => {
    if (LAMP.Auth._type !== "admin") return
    Service.deleteDB()
  }, [])

  useEffect(() => {
    let authId = LAMP.Auth._auth.id
    let language = !!localStorage.getItem("LAMP_user_" + authId)
      ? JSON.parse(localStorage.getItem("LAMP_user_" + authId)).language
      : getSelectedLanguage()
      ? getSelectedLanguage()
      : "en"
    i18n.changeLanguage(language)
  }, [])

  return (
    <Container maxWidth={false}>
      <Container
        className={
          window.innerWidth >= 1280 && window.innerWidth <= 1350
            ? classes.tableContainerWidthPad
            : classes.tableContainerWidth
        }
      >
        <ResponsivePaper elevation={0}>
          <Drawer
            anchor={supportsSidebar ? "left" : "bottom"}
            variant="permanent"
            classes={{
              paper: classes.researcherMenu + " " + classes.logResearcher,
            }}
          >
            <List component="nav" className={classes.menuOuter}>
              <ListItem
                className={classes.menuItems + " " + classes.btnCursor}
                button
                selected={currentTab === 0}
                onClick={(event) => setCurrentTab(0)}
              >
                <ListItemIcon className={classes.menuIcon}>
                  <Researcher />
                </ListItemIcon>
                <ListItemText primary={t("Researchers")} />
              </ListItem>
            </List>
          </Drawer>
          {currentTab === 0 && <Researchers history={props.history} updateStore={updateStore} />}
        </ResponsivePaper>
      </Container>
    </Container>
  )
}
