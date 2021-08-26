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
import { ReactComponent as DataPortalIcon } from "../../icons/DataPortal.svg"
import { MuiThemeProvider, makeStyles, Theme, createStyles, createMuiTheme } from "@material-ui/core/styles"
import locale_lang from "../../locale_map.json"
import { Service } from "../DBService/DBService"
import Researchers from "./Researchers"
import DataPortal from "../data_portal/DataPortal"
import DashboardStudies from "./DashboardStudies"
import { saveDataToCache, saveDemoData } from "../Researcher/SaveResearcherData"
import useInterval from "../useInterval"

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
    tableContainerDataPortalWidth: {
      width: "calc(100% - 100px)",
      height: "calc(100% - 55px)",
      zIndex: 5000,
      maxWidth: "100%",
      maxHeight: "calc(100% - 55px)",
      backgroundColor: "lightgrey",
      top: "55px",
      left: "90px",
      overflow: "scroll",
      position: "absolute",
      [theme.breakpoints.down("sm")]: {
        left: "0px",
        width: "100vw",
        height: "calc(100% - 155px)",
      },
    },
    responsivePaperDataPortal: {
      paddingBottom: 0,
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

export default function Root({
  updateStore,
  userType,
  researcher,
  history,
  ...props
}: {
  updateStore: Function
  userType: string
  researcher?: any
  history: any
}) {
  const { t, i18n } = useTranslation()
  const [currentTab, setCurrentTab] = useState(0)
  const classes = useStyles()
  const supportsSidebar = useMediaQuery(useTheme().breakpoints.up("md"))
  const [studies, setStudies] = useState(null)

  const getSelectedLanguage = () => {
    const matched_codes = Object.keys(locale_lang).filter((code) => code.startsWith(navigator.language))
    const lang = matched_codes.length > 0 ? matched_codes[0] : "en-US"
    return i18n.language ? i18n.language : lang ? lang : "en-US"
  }

  useInterval(
    () => {
      if (userType === "user_admin") getDBStudies()
    },
    studies !== null ? null : 2000,
    true
  )

  const getDBStudies = () => {
    Service.getAll("studies").then((data) => {
      setStudies((data || []).length > 0 ? data : null)
    })
  }

  useEffect(() => {
    ;(async () => {
      let lampAuthId = LAMP.Auth._auth.id
      let lampAuthPswd = LAMP.Auth._auth.password
      if (userType === "user_admin") {
        lampAuthId === "researcher@demo.lamp.digital"
          ? await saveDemoData()
          : await saveDataToCache(lampAuthId + ":" + lampAuthPswd, researcher.id)
      }
    })()
    setCurrentTab(0)
  }, [userType])

  useEffect(() => {
    //if (LAMP.Auth._type !== "admin") return
    Service.deleteDB()
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
          currentTab !== 2
            ? window.innerWidth >= 1280 && window.innerWidth <= 1350
              ? classes.tableContainerWidthPad
              : classes.tableContainerWidth
            : classes.tableContainerDataPortalWidth
        }
        style={{ marginBottom: "0px" }}
      >
        <ResponsivePaper elevation={0}>
          <Drawer
            anchor={supportsSidebar ? "left" : "bottom"}
            variant="permanent"
            classes={{
              paper: classes.researcherMenu + " " + classes.logResearcher,
            }}
            style={{ marginBottom: "0px" }}
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
                <ListItemText
                  primary={
                    userType === "user_admin" || userType === "clinical_admin" ? t("Clinicians") : t("Researchers")
                  }
                />
              </ListItem>
              {userType === "user_admin" && (
                <ListItem
                  className={classes.menuItems + " " + classes.btnCursor}
                  button
                  selected={currentTab === 1}
                  onClick={(event) => setCurrentTab(1)}
                >
                  <ListItemIcon className={classes.menuIcon}>
                    <Researcher />
                  </ListItemIcon>
                  <ListItemText primary={t("Studies")} />
                </ListItem>
              )}
              <ListItem
                className={classes.menuItems + " " + classes.btnCursor}
                button
                selected={currentTab === 2}
                onClick={(event) => setCurrentTab(2)}
              >
                <ListItemIcon className={classes.menuIcon}>
                  <DataPortalIcon />
                </ListItemIcon>
                <ListItemText primary={"Data Portal"} />
              </ListItem>
            </List>
          </Drawer>
          {currentTab === 0 && (
            <Researchers history={history} updateStore={updateStore} userType={userType} studies={studies} />
          )}
          {currentTab === 1 && <DashboardStudies researcher={researcher} setData={(data) => setStudies(data)} />}
          {currentTab === 2 && (
            <DataPortal
              onLogout={null}
              token={{
                username: LAMP.Auth._auth.id,
                password: LAMP.Auth._auth.password,
                server: LAMP.Auth._auth.serverAddress ? LAMP.Auth._auth.serverAddress : "api.lamp.digital",
                type: "Administrator",
                name: "Administrator",
              }}
            />
          )}
        </ResponsivePaper>
      </Container>
    </Container>
  )
}
