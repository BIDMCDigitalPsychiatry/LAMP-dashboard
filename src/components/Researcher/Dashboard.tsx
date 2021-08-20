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
import { useTranslation } from "react-i18next"
import { Service } from "../DBService/DBService"
import LAMP from "lamp-core"
import useInterval from "../useInterval"
import DataPortal from "../data_portal/DataPortal"
// import { Researcher } from "../DBService/Types/Researcher"
// import { Study } from "../DBService/Types/Study"

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
export default function Dashboard({ onParticipantSelect, researcher, ...props }) {
  const [currentTab, setCurrentTab] = useState(-1)
  const [studies, setStudies] = useState(null)
  const [notificationColumn, setNotification] = useState(false)
  const [selectedStudies, setSelectedStudies] = useState([])
  const supportsSidebar = useMediaQuery(useTheme().breakpoints.up("md"))
  const [updatedData, setUpdatedData] = useState(null)
  const [deletedData, setDeletedData] = useState(null)
  const [newStudy, setNewStudy] = useState(null)
  const [search, setSearch] = useState(null)
  const classes = useStyles()
  const { t } = useTranslation()

  useInterval(
    () => {
      getDBStudies()
    },
    studies !== null && (studies || []).length > 0 ? null : 2000,
    true
  )

  useEffect(() => {
    if (!!newStudy) getAllStudies()
  }, [newStudy])

  useEffect(() => {
    if (updatedData !== null) getAllStudies()
  }, [updatedData])

  useEffect(() => {
    if (deletedData !== null) {
      let newStudies = studies.filter((item) => {
        if (!!search) {
          return item?.name?.toLowerCase()?.includes(search?.toLowerCase()) && item.id !== deletedData
        } else {
          return item?.id !== deletedData
        }
      })
      setStudies(newStudies)
    } else {
      getAllStudies()
    }
  }, [deletedData])

  const getDBStudies = async () => {
    Service.getAll("studies").then((studies) => {
      setStudies(studies)
      filterStudies(studies)
      setCurrentTab(0)
      Service.getAll("researcher").then((data) => {
        let researcherNotification = !!data ? data[0]?.notification ?? false : false
        setNotification(researcherNotification)
      })
    })
  }

  const getAllStudies = async () => {
    Service.getAll("studies").then((studies) => {
      setStudies(studies)
      filterStudies(studies)
    })
  }

  const filterStudies = async (studies) => {
    if (studies !== null && (studies || []).length > 0) {
      let selected = ((await LAMP.Type.getAttachment(researcher.id, "lamp.selectedStudies")) as any).data ?? []
      let filtered = selected.filter((o) => studies.some(({ name }) => o === name))
      selected =
        selected.length === 0 || filtered.length === 0
          ? (studies ?? []).map((study) => {
              return study.name
            })
          : filtered
      selected.sort()
      setSelectedStudies(selected)
    }
  }

  return (
    <Container maxWidth={false}>
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
                <ListItem
                  className={classes.menuItems + " " + classes.btnCursor}
                  button
                  selected={currentTab === 4}
                  onClick={(event) => setCurrentTab(4)}
                >
                  <ListItemIcon className={classes.menuIcon}>
                    <DataPortalIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Data Portal"} />
                </ListItem>
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
                getAllStudies={getAllStudies}
                newAdddeStudy={setNewStudy}
              />
            )}
            {currentTab === 1 && (
              <ActivityList
                title={null}
                researcher={researcher}
                studies={studies}
                selectedStudies={selectedStudies}
                setSelectedStudies={setSelectedStudies}
              />
            )}
            {currentTab === 2 && (
              <SensorsList
                title={null}
                researcher={researcher}
                studies={studies}
                selectedStudies={selectedStudies}
                setSelectedStudies={setSelectedStudies}
              />
            )}
            {currentTab === 3 && (
              <StudiesList
                title={null}
                researcher={researcher}
                studies={studies}
                upatedDataStudy={(data) => setUpdatedData(data)}
                deletedDataStudy={(data) => setDeletedData(data)}
                searchData={(data) => setSearch(data)}
                newAdddeStudy={setNewStudy}
              />
            )}

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
