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
  makeStyles,
  Theme,
  createStyles,
  Backdrop,
  CircularProgress,
  Box,
} from "@material-ui/core"
import ParticipantList from "./ParticipantList/Index"
import ActivityList from "./ActivityList/Index"
import SensorsList from "./SensorsList/Index"
import StudiesList from "../Admin/Studies/Index"
import { ResponsivePaper } from "../Utils"
import { ReactComponent as Patients } from "../../icons/Patients.svg"
import { ReactComponent as Activities } from "../../icons/Activities.svg"
import { ReactComponent as Sensors } from "../../icons/Sensor.svg"
import { ReactComponent as Studies } from "../../icons/Study.svg"
import { ReactComponent as DataPortalIcon } from "../../icons/DataPortal.svg"
import { useTranslation } from "react-i18next"
import { Service } from "../DBService/DBService"
import LAMP from "lamp-core"
import useInterval from "../useInterval"
import DataPortal from "../data_portal/DataPortal"
// import { Researcher } from "../DBService/Types/Researcher"
// import { Study } from "../DBService/Types/Study"
import DashboardStudies from "../Admin/DashboardStudies"

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
      height: "calc(100%)",
      zIndex: 5000,
      maxWidth: "100%",
      maxHeight: "calc(100%)",
      backgroundColor: "lightgrey",
      top: "0px",
      left: "90px",
      overflow: "scroll",
      position: "absolute",
      [theme.breakpoints.down("sm")]: {
        left: "0px",
        width: "100vw",
        height: "calc(100% - 155px)",
      },
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
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
  })
)

export const sortData = (data, studies, key) => {
  let result = []
  studies.map((study) => {
    let filteredData = data.filter((d) => d.study_name === study)
    filteredData.sort((a, b) => {
      return a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0
    })
    result = result.concat(filteredData)
  })
  return result
}
// export interface Study {
//   id?: string
//   name?: string
//   participant_count?: number
//   activity_count?: number
//   sensor_count?: number
// }

export default function Dashboard({ onParticipantSelect, researcher, userType, ...props }) {
  const [currentTab, setCurrentTab] = useState(-1)
  const [studies, setStudies] = useState(null)
  const [notificationColumn, setNotification] = useState(false)
  const [selectedStudies, setSelectedStudies] = useState([])
  const [loading, setLoading] = useState(false)
  const supportsSidebar = useMediaQuery(useTheme().breakpoints.up("md"))
  const classes = useStyles()
  const { t } = useTranslation()

  useInterval(
    () => {
      getDBStudies()
    },
    studies !== null && (studies || []).length > 0 ? null : 2000,
    true
  )

  const getDBStudies = async () => {
    Service.getAll("studies").then((studies) => {
      if ((studies || []).length > 0) setLoading(false)
      setStudies(studies)
      filterStudies(studies)
      setCurrentTab(0)
    })
  }

  useEffect(() => {
    Service.getAll("researcher").then((data) => {
      let researcherNotification = !!data ? data[0]?.notification ?? false : false
      setNotification(researcherNotification)
    })
  }, [])

  const filterStudies = async (studies) => {
    if (studies !== null && (studies || []).length > 0) {
      let selected =
        localStorage.getItem("studies_" + researcher.id) !== null
          ? JSON.parse(localStorage.getItem("studies_" + researcher.id))
          : userType === "clinician"
          ? studies
          : []
      if (selected.length > 0) {
        let filtered = selected.filter((o) => studies.some(({ name }) => o === name))
        selected =
          selected.length === 0 || filtered.length === 0
            ? (studies ?? []).map((study) => {
                return study.name
              })
            : filtered
        selected.sort()
      }
      setSelectedStudies(selected)
    }
  }

  return (
    <Container maxWidth={false}>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Container
        className={
          currentTab !== 4
            ? window.innerWidth >= 1280 && window.innerWidth <= 1350
              ? classes.tableContainerWidthPad
              : classes.tableContainerWidth
            : classes.tableContainerDataPortalWidth
        }
      >
        {!!studies && (
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
                  <ListItemText primary={t("Users")} />
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
                <ListItem
                  className={classes.menuItems + " " + classes.btnCursor}
                  button
                  selected={currentTab === 2}
                  onClick={(event) => setCurrentTab(2)}
                >
                  <ListItemIcon className={classes.menuIcon}>
                    <Sensors />
                  </ListItemIcon>
                  <ListItemText primary={t("Sensors")} />
                </ListItem>
                {userType === "researcher" && (
                  <ListItem
                    className={classes.menuItems + " " + classes.btnCursor}
                    button
                    selected={currentTab === 3}
                    onClick={(event) => setCurrentTab(3)}
                  >
                    <ListItemIcon className={classes.menuIcon}>
                      <Studies />
                    </ListItemIcon>
                    <ListItemText primary={t("Studies")} />
                  </ListItem>
                )}
              </List>
            </Drawer>
            {currentTab === 0 && (
              <ParticipantList
                title={null}
                onParticipantSelect={onParticipantSelect}
                researcher={researcher}
                studies={studies}
                notificationColumn={notificationColumn}
                selectedStudies={selectedStudies}
                setSelectedStudies={setSelectedStudies}
                userType={userType}
              />
            )}
            {currentTab === 1 && (
              <ActivityList
                title={null}
                researcher={researcher}
                studies={studies}
                selectedStudies={selectedStudies}
                setSelectedStudies={setSelectedStudies}
                userType={userType}
              />
            )}
            {currentTab === 2 && (
              <SensorsList
                title={null}
                researcher={researcher}
                studies={studies}
                selectedStudies={selectedStudies}
                setSelectedStudies={setSelectedStudies}
                userType={userType}
              />
            )}
            {currentTab === 3 && <DashboardStudies researcher={researcher} filterStudies={filterStudies} />}

            {currentTab === 4 && (
              <DataPortal
                onLogout={null}
                token={{
                  username: LAMP.Auth._auth.id,
                  password: LAMP.Auth._auth.password,
                  server: LAMP.Auth._auth.serverAddress ? LAMP.Auth._auth.serverAddress : "api.lamp.digital",
                  type: "Researcher",
                  id: researcher.id,
                  name: researcher.name,
                }}
                data={LAMP.Auth}
              />
            )}
          </ResponsivePaper>
        )}
      </Container>
    </Container>
  )
}
