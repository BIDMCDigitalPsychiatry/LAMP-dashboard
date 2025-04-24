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
  CircularProgress,
  Backdrop,
} from "@material-ui/core"
import ParticipantList from "./ParticipantList/Index"
import ActivityList from "./ActivityList/Index"
import SensorsList from "./SensorsList/Index"
import StudiesList from "./Studies/Index"
import { ResponsivePaper } from "../Utils"
import { ReactComponent as Patients } from "../../icons/Patients.svg"
import { ReactComponent as Activities } from "../../icons/Activities.svg"
import { ReactComponent as Sensors } from "../../icons/Sensor.svg"
import { ReactComponent as Studies } from "../../icons/Study.svg"
import { ReactComponent as DataPortalIcon } from "../../icons/DataPortal.svg"
import { ReactComponent as Conversation } from "../../icons/Conversation.svg"
import { useTranslation } from "react-i18next"
import { Service } from "../DBService/DBService"
import LAMP from "lamp-core"
import useInterval from "../useInterval"
import DataPortal from "../data_portal/DataPortal"
import Conversations from "./Conversations/Index"

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
    backdrop: {
      zIndex: 111111,
      color: "#fff",
    },
    tableContainerWidthPad: {
      maxWidth: 1055,
      paddingLeft: 0,
      paddingRight: 0,
    },
    tableContainerDataPortalWidth: {
      width: "calc(100vw - 100px)",
      height: "calc(100vh - 50px)",
      paddingLeft: "0px",
      paddingRight: "0px",
      maxWidth: "100vw",
      maxHeight: "100vh",
      top: "0px",
      left: "100px",
      overflow: "scroll",
      position: "absolute",
      [theme.breakpoints.down("sm")]: {
        left: "0px",
        width: "100vw",
        height: "calc(100vh - 150px)",
      },
    },
    dataPortalPaper: {
      height: "100%",
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
const sortStudies = (studies, order) => {
  return (studies || []).sort((a, b) => {
    return !!order
      ? a["name"] > b["name"]
        ? 1
        : a["name"] < b["name"]
        ? -1
        : 0
      : a["name"] < b["name"]
      ? 1
      : a["name"] > b["name"]
      ? -1
      : 0
  })
}

export const sortData = (data, studies, key) => {
  let result = []
  ;(studies || []).map((study) => {
    let filteredData = data.filter((d) => d.study_name === study)
    filteredData.sort((a, b) => {
      return a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0
    })
    result = result.concat(filteredData)
  })
  return [...new Map(result.map((item) => [item["id"], item])).values()]
}
// export interface Study {
//   id?: string
//   name?: string
//   participant_count?: number
//   activity_count?: number
//   sensor_count?: number
// }
export default function Dashboard({ onParticipantSelect, researcherId, mode, tab, ...props }) {
  const [studies, setStudies] = useState(null)
  const [notificationColumn, setNotification] = useState(false)
  const [selectedStudies, setSelectedStudies] = useState([])
  const supportsSidebar = useMediaQuery(useTheme().breakpoints.up("md"))
  const [updatedData, setUpdatedData] = useState(null)
  const [deletedData, setDeletedData] = useState(null)
  const [newStudy, setNewStudy] = useState(null)
  const [search, setSearch] = useState(null)
  const [researcher, setResearcher] = useState(null)
  const [order, setOrder] = useState(localStorage.getItem("order") ? JSON.parse(localStorage.getItem("order")) : true)
  const classes = useStyles()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)

  useInterval(
    () => {
      setLoading(true)
      getDBStudies()
    },
    studies !== null && (studies || []).length > 0 ? null : 2000,
    true
  )

  useEffect(() => {
    LAMP.Researcher.view(researcherId).then(setResearcher)
  }, [])

  useEffect(() => {
    getAllStudies()
  }, [researcher])

  useEffect(() => {
    if (!!newStudy) getAllStudies()
  }, [newStudy])

  useEffect(() => {
    if (updatedData !== null) getAllStudies()
  }, [updatedData])

  useEffect(() => {
    if (deletedData !== null) getAllStudies()
  }, [deletedData])

  const getDBStudies = async () => {
    Service.getAll("studies").then((studies) => {
      setStudies(sortStudies(studies, order))
      setLoading(false)
      Service.getAll("researcher").then((data) => {
        let researcherNotification = !!data ? data[0]?.notification ?? false : false
        setNotification(researcherNotification)
      })
    })
  }

  const getAllStudies = async () => {
    Service.getAll("studies").then((studies) => {
      setStudies(sortStudies(studies, order))
    })
  }

  useEffect(() => {
    localStorage.setItem("order", JSON.stringify(order))
    getAllStudies()
  }, [order])

  useEffect(() => {
    filterStudies(studies)
  }, [studies])

  const filterStudies = async (studies) => {
    if (!!researcherId && studies !== null && (studies || []).length > 0) {
      let selected =
        localStorage.getItem("studies_" + researcherId) !== null
          ? JSON.parse(localStorage.getItem("studies_" + researcherId))
          : []
      if (selected.length > 0) {
        let filtered = selected.filter((o) => studies.some(({ name }) => o === name))
        selected =
          selected.length === 0 || filtered.length === 0
            ? (studies ?? []).map((study) => {
                return study.name
              })
            : filtered
      }
      selected.sort()
      if (!order) selected.reverse()
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
          tab !== "portal"
            ? window.innerWidth >= 1280 && window.innerWidth <= 1350
              ? classes.tableContainerWidthPad
              : classes.tableContainerWidth
            : classes.tableContainerDataPortalWidth
        }
      >
        {!!studies && (
          <ResponsivePaper className={tab === "portal" ? classes.dataPortalPaper : null} elevation={0}>
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
                  selected={tab === "users"}
                  onClick={(event) => (window.location.href = `/#/researcher/${researcherId}/users`)}
                >
                  <ListItemIcon className={classes.menuIcon}>
                    <Patients />
                  </ListItemIcon>
                  <ListItemText primary={`${t("Users")}`} />
                </ListItem>
                {mode === "researcher" && (
                  <ListItem
                    className={classes.menuItems + " " + classes.btnCursor}
                    button
                    selected={tab === "activities"}
                    onClick={(event) => {
                      window.location.href = `/#/researcher/${researcherId}/activities`
                    }}
                  >
                    <ListItemIcon className={classes.menuIcon}>
                      <Activities />
                    </ListItemIcon>
                    <ListItemText primary={`${t("Activities")}`} />
                  </ListItem>
                )}
                {mode === "researcher" && (
                  <ListItem
                    className={classes.menuItems + " " + classes.btnCursor}
                    button
                    selected={tab === "sensors"}
                    onClick={(event) => {
                      window.location.href = `/#/researcher/${researcherId}/sensors`
                    }}
                  >
                    <ListItemIcon className={classes.menuIcon}>
                      <Sensors />
                    </ListItemIcon>
                    <ListItemText primary={`${t("Sensors")}`} />
                  </ListItem>
                )}
                {mode === "researcher" && (
                  <ListItem
                    className={classes.menuItems + " " + classes.btnCursor}
                    button
                    selected={tab === "studies"}
                    onClick={(event) => (window.location.href = `/#/researcher/${researcherId}/studies`)}
                  >
                    <ListItemIcon className={classes.menuIcon}>
                      <Studies />
                    </ListItemIcon>
                    <ListItemText primary={`${t("Groups")}`} />
                  </ListItem>
                )}
                {mode === "researcher" && (
                  <ListItem
                    className={classes.menuItems + " " + classes.btnCursor}
                    button
                    selected={tab === "portal"}
                    onClick={(event) => (window.location.href = `/#/researcher/${researcherId}/portal`)}
                  >
                    <ListItemIcon className={classes.menuIcon}>
                      <DataPortalIcon />
                    </ListItemIcon>
                    <ListItemText primary={`${t("Data Portal")}`} />
                  </ListItem>
                )}
                <ListItem
                  className={classes.menuItems + " " + classes.btnCursor}
                  button
                  selected={tab === "conversations"}
                  onClick={(event) => (window.location.href = `/#/researcher/${researcherId}/conversations`)}
                  disableGutters
                >
                  <ListItemIcon className={classes.menuIcon}>
                    <Conversation />
                  </ListItemIcon>
                  <ListItemText primary={`${t("Conversations")}`} />
                </ListItem>
              </List>
            </Drawer>
            {tab === "users" && (
              <ParticipantList
                title={null}
                onParticipantSelect={onParticipantSelect}
                researcherId={researcherId}
                studies={studies}
                notificationColumn={notificationColumn}
                selectedStudies={selectedStudies}
                setSelectedStudies={setSelectedStudies}
                getAllStudies={getAllStudies}
                mode={mode}
                setOrder={() => setOrder(!order)}
                order={order}
              />
            )}
            {tab === "activities" && (
              <ActivityList
                title={null}
                researcherId={researcherId}
                studies={studies}
                selectedStudies={selectedStudies}
                setSelectedStudies={setSelectedStudies}
                setOrder={() => setOrder(!order)}
                getAllStudies={getAllStudies}
                order={order}
              />
            )}
            {tab === "sensors" && (
              <SensorsList
                title={null}
                researcherId={researcherId}
                studies={studies}
                selectedStudies={selectedStudies}
                setSelectedStudies={setSelectedStudies}
                setOrder={() => setOrder(!order)}
                getAllStudies={getAllStudies}
                order={order}
              />
            )}
            {tab === "studies" && (
              <StudiesList
                title={null}
                researcherId={researcherId}
                studies={studies}
                upatedDataStudy={(data) => setUpdatedData(data)}
                deletedDataStudy={(data) => setDeletedData(data)}
                searchData={(data) => setSearch(data)}
                newAdddeStudy={setNewStudy}
                getAllStudies={getAllStudies}
              />
            )}
            {tab === "portal" && (
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
            {tab === "conversations" && (
              <Conversations
                title={null}
                onParticipantSelect={onParticipantSelect}
                researcherId={researcherId}
                studies={studies}
                notificationColumn={notificationColumn}
                selectedStudies={selectedStudies}
                setSelectedStudies={setSelectedStudies}
                getAllStudies={getAllStudies}
                mode={mode}
                setOrder={() => setOrder(!order)}
                order={order}
              />
            )}
          </ResponsivePaper>
        )}
      </Container>
    </Container>
  )
}
