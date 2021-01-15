// Core Imports
import React, { useState, useEffect } from "react"
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Fab,
  Container,
  MenuItem,
  Typography,
  useMediaQuery,
  useTheme,
  AppBar,
  Toolbar,
  Button,
  Popover,
  Divider,
} from "@material-ui/core"

// Local Imports
import LAMP from "lamp-core"
import ParticipantList from "./ParticipantList"
import ActivityList from "./ActivityList"
import { ResponsivePaper } from "./Utils"
import { ReactComponent as Patients } from "../icons/Patients.svg"
import { ReactComponent as Activities } from "../icons/Activities.svg"
import { fade, makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import { useTranslation } from "react-i18next"
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown"
import { ReactComponent as UserIcon } from "../icons/User.svg"

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
      "&:hover div > svg > path": {
        cursor: "pointer !important",
      },
      "&:hover div > span": {
        cursor: "pointer !important",
      },
    },
  })
)

function Study({ onParticipantSelect, researcher, ...props }) {
  const [showUnscheduled, setShowUnscheduled] = useState(false)
  const [currentTab, setCurrentTab] = useState(0)
  const classes = useStyles()
  const supportsSidebar = useMediaQuery(useTheme().breakpoints.up("md"))
  const { t } = useTranslation()

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
                  <Patients />
                </ListItemIcon>
                <ListItemText primary={t("Patients")} />
              </ListItem>
              <ListItem
                className={classes.menuItems + " " + classes.btnCursor}
                button
                selected={currentTab === 1}
                onClick={(event) => setCurrentTab(1)}
              >
                <ListItemIcon className={classes.menuIcon}>
                  <Activities />
                </ListItemIcon>
                <ListItemText primary={t("Activities")} />
              </ListItem>
            </List>
          </Drawer>
          {currentTab === 0 && (
            <ParticipantList
              title={null}
              studyID={null}
              showUnscheduled={showUnscheduled}
              onParticipantSelect={onParticipantSelect}
              researcher={researcher}
            />
          )}
          {currentTab === 1 && <ActivityList title={null} researcher={researcher} />}
        </ResponsivePaper>
      </Container>
    </Container>
  )
}

export default function Researcher({ researcher, onParticipantSelect, ...props }) {
  const { t, i18n } = useTranslation()

  const languagesArray = [
    { key: "en_US", value: "English - United States", lang_array: ["en", "en-US", "en-us"] },
    { key: "hi_IN", value: "Hindi - India", lang_array: ["hi", "hi-IN", "hi-in"] },
    { key: "es_ES", value: "Spanish", lang_array: ["es", "es-ES", "es-es"] },
  ]

  const getSelectedLanguage = () => {
    let lang = languagesArray.filter((x) => {
      return x.lang_array.includes(navigator.language)
    })
    return lang
  }
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? "simple-popover" : undefined
  useEffect(() => {
    ;(async () => {
      await LAMP.Type.setAttachment(researcher.id, "me", "lamp.selectedStudies", null)
    })()
    let language = !!localStorage.getItem("LAMP_user_" + researcher.id)
      ? JSON.parse(localStorage.getItem("LAMP_user_" + researcher.id)).language
      : getSelectedLanguage().length > 0
      ? getSelectedLanguage()[0].key
      : "en_US"
    i18n.changeLanguage(language)
  }, [])

  return (
    <React.Fragment>
      <Study onParticipantSelect={onParticipantSelect} researcher={researcher} />
    </React.Fragment>
  )
}
