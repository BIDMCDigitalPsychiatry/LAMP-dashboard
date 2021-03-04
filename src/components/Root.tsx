// Core Imports
import React, { useState, useEffect } from "react"
import {
  Box,
  Dialog,
  DialogContent,
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
} from "@material-ui/core"

import MaterialTable, { MTableToolbar } from "material-table"
import { useSnackbar } from "notistack"
import { ReactComponent as AddIcon } from "../icons/plus.svg"

// Local Imports
import LAMP from "lamp-core"
import { CredentialManager } from "./CredentialManager"
import { ResponsivePaper } from "./Utils"
import { useTranslation } from "react-i18next"
import { ReactComponent as Researcher } from "../icons/Researcher.svg"
import { MuiThemeProvider, makeStyles, Theme, createStyles, createMuiTheme } from "@material-ui/core/styles"
import locale_lang from "../locale_map.json"

// initial load = not working
// TODO: <EditField researcher={x} />

const theme = createMuiTheme({
  palette: {
    secondary: {
      main: "#333",
    },
  },
  overrides: {
    MuiTableCell: {
      root: {
        borderBottom: "#fff solid 1px",
        padding: 10,
      },
    },
    MuiToolbar: {
      root: {
        maxWidth: 1055,
        width: "80%",
        margin: "0 auto",
        background: "#fff !important",
      },
    },
    MuiInput: {
      root: {
        border: 0,
      },
      underline: {
        "&&&:before": {
          borderBottom: "none",
        },
        "&&:after": {
          borderBottom: "none",
        },
      },
    },
    MuiIcon: {
      root: { color: "rgba(0, 0, 0, 0.4)" },
    },
  },
})
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
    tableContainer: {
      "& div.MuiInput-underline:before": { borderBottom: "0 !important" },
      "& div.MuiInput-underline:after": { borderBottom: "0 !important" },
      "& div.MuiInput-underline": {
        "& span.material-icons": {
          width: 21,
          height: 19,
          fontSize: 27,
          lineHeight: "23PX",
          color: "rgba(0, 0, 0, 0.4)",
        },
        "& button": { display: "none" },
      },
    },
    btnBlue: {
      background: "#7599FF",
      borderRadius: "40px",
      minWidth: 100,
      boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.20)",
      lineHeight: "38px",

      cursor: "pointer",
      textTransform: "capitalize",
      fontSize: "16px",
      color: "#fff",
      "& svg": { marginRight: 8 },
      "&:hover": { background: "#5680f9" },
      [theme.breakpoints.up("md")]: {
        position: "absolute",
      },
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
    btnFilter: {
      color: "rgba(0, 0, 0, 0.4)",
      fontSize: 14,
      lineHeight: "38px",
      cursor: "pointer",
      textTransform: "capitalize",
      boxShadow: "none",
      background: "transparent",
      margin: "0 15px",
      paddingRight: 0,
      "& svg": { marginRight: 10 },
    },
    tableOuter: {
      width: "100vw",
      position: "relative",
      left: "50%",
      right: "50%",
      marginLeft: "-50.6vw",
      marginRight: "-50.6vw",
      marginBottom: 30,
      marginTop: -20,
      // paddingTop: 40,
      "& input": {
        width: 350,
        [theme.breakpoints.down("md")]: {
          width: 200,
        },
      },
      "& div.MuiToolbar-root": { maxWidth: 1232, width: "100%", margin: "0 auto" },
      "& h6": { fontSize: 30, fontWeight: 600, marginLeft: 10 },
      "& button": {
        marginRight: 15,
        "& span": { color: "#7599FF" },
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
function Researchers({ history, ...props }) {
  const [researchers, setResearchers] = useState([])
  const [passwordChange, setPasswordChange] = useState<boolean>()
  const { enqueueSnackbar } = useSnackbar()
  const { t, i18n } = useTranslation()
  const classes = useStyles()

  const getSelectedLanguage = () => {
    const matched_codes = Object.keys(locale_lang).filter((code) => code.startsWith(navigator.language))
    const lang = matched_codes.length > 0 ? matched_codes[0] : "en-US"
    return i18n.language ? i18n.language : lang ? lang : "en-US"
  }

  useEffect(() => {
    if (LAMP.Auth._type !== "admin") return
    LAMP.Researcher.all().then(setResearchers)
  }, [])

  useEffect(() => {
    let authId = LAMP.Auth._auth.id
    let language = !!localStorage.getItem("LAMP_user_" + authId)
      ? JSON.parse(localStorage.getItem("LAMP_user_" + authId)).language
      : getSelectedLanguage()
      ? getSelectedLanguage()
      : "en-US"
    i18n.changeLanguage(language)
  }, [])

  return (
    <React.Fragment>
      <MuiThemeProvider theme={theme}>
        <Box className={classes.tableContainer}>
          <MaterialTable
            title={t("Researchers")}
            data={researchers}
            columns={[{ title: t("Name"), field: "name" }]}
            onRowClick={(event, rowData, togglePanel) =>
              history.push(`/researcher/${researchers[rowData.tableData.id].id}`)
            }
            editable={{
              onRowAdd: async (newData) => {
                if (((await LAMP.Researcher.create(newData)) as any).error === undefined)
                  enqueueSnackbar(t("Successfully created a new Researcher."), {
                    variant: "success",
                  })
                else
                  enqueueSnackbar(t("Failed to create a new Researcher."), {
                    variant: "error",
                  })
                setResearchers(await LAMP.Researcher.all())
              },
              onRowUpdate: async (newData, oldData) => {
                if (((await LAMP.Researcher.update(oldData.id, newData)) as any).error === undefined)
                  enqueueSnackbar(t("Successfully updated the Researcher."), {
                    variant: "success",
                  })
                else
                  enqueueSnackbar(t("Failed to update the Researcher."), {
                    variant: "error",
                  })
                setResearchers(await LAMP.Researcher.all())
              },
              onRowDelete: async (oldData) => {
                if (((await LAMP.Researcher.delete(oldData.id)) as any).error === undefined)
                  enqueueSnackbar(t("Successfully deleted the Researcher."), {
                    variant: "success",
                  })
                else
                  enqueueSnackbar(t("Failed to delete the Researcher."), {
                    variant: "error",
                  })
                setResearchers(await LAMP.Researcher.all())
              },
            }}
            actions={[
              {
                icon: "vpn_key",
                tooltip: t("Manage Credentials"),
                onClick: (event, rowData) => setPasswordChange(rowData.id),
              },
            ]}
            localization={{
              header: {
                actions: t("Actions"),
              },
              body: {
                emptyDataSourceMessage: t("No Researchers. Add Researchers by clicking the [+] button above."),
                editRow: {
                  deleteText: t("Are you sure you want to delete this Researcher?"),
                },
              },
            }}
            options={{
              addRowPosition: "first",
              actionsColumnIndex: -1,
              paging: false,
              search: false,
              headerStyle: {
                fontWeight: 700,
                textTransform: "uppercase",
              },
              rowStyle: (rowData) => ({
                backgroundColor: rowData.tableData.id % 2 === 0 ? "#FFF" : "#F8F8F8",
              }),
            }}
            components={{
              Container: (props) => <Box {...props} />,
              Toolbar: (props) => (
                <div className={classes.tableOuter}>
                  <MTableToolbar {...props} />

                  <Box borderTop={1} borderColor="grey.400" mt={3}></Box>
                </div>
              ),
            }}
          />
        </Box>
      </MuiThemeProvider>
      <Dialog open={!!passwordChange} onClose={() => setPasswordChange(undefined)}>
        <DialogContent style={{ marginBottom: 12 }}>
          <CredentialManager id={passwordChange} />
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}

export default function Root({ ...props }) {
  const [researchers, setResearchers] = useState([])
  //const [names, setNames] = useState({})
  const [passwordChange, setPasswordChange] = useState<boolean>()
  const { enqueueSnackbar } = useSnackbar()
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
    LAMP.Researcher.all().then(setResearchers)
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
          {currentTab === 0 && <Researchers history={props.history} />}
        </ResponsivePaper>
      </Container>
    </Container>
  )
}
