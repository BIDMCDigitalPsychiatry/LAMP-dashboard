// Core Imports
import React, { useState, useEffect } from "react"
import { Box, Backdrop, CircularProgress, DialogContent, Grid, Icon } from "@material-ui/core"
import { useSnackbar } from "notistack"
import LAMP from "lamp-core"
import { CredentialManager } from "../CredentialManager"
import { useTranslation } from "react-i18next"
import { MuiThemeProvider, makeStyles, Theme, createStyles, createMuiTheme } from "@material-ui/core/styles"
import locale_lang from "../../locale_map.json"
import Pagination from "../PaginatedElement"
import ResearcherRow from "./ResearcherRow"
import Header from "./Header"

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
    backdrop: {
      zIndex: 111111,
      color: "#fff",
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
    norecords: {
      "& span": { marginRight: 5 },
    },
  })
)
export default function Researchers({ history, updateStore, userType, studies, ...props }) {
  const [researchers, setResearchers] = useState([])
  const [paginatedResearchers, setPaginatedResearchers] = useState([])
  const [page, setPage] = useState(0)
  const [rowCount, setRowCount] = useState(40)
  const [search, setSearch] = useState("")
  const { t, i18n } = useTranslation()
  const classes = useStyles()
  const userTypes = ["researcher", "user_admin", "clinical_admin"]
  const [filterData, setFilterData] = useState(false)
  const [loading, setLoading] = useState(true)

  const getSelectedLanguage = () => {
    const matched_codes = Object.keys(locale_lang).filter((code) => code.startsWith(navigator.language))
    const lang = matched_codes.length > 0 ? matched_codes[0] : "en-US"
    return i18n.language ? i18n.language : lang ? lang : "en-US"
  }

  useEffect(() => {
    setFilterData(false)
    refreshResearchers()
    setLoading(true)
  }, [userType, studies])

  const refreshResearchers = () => {
    setFilterData(false)
    setPaginatedResearchers([])
    setPage(0)
    setResearchers([])
    LAMP.Researcher.all().then((data) => {
      if (search.trim().length > 0) {
        data = data.filter((researcher) => researcher.name?.toLowerCase()?.includes(search?.toLowerCase()))
      }
      ;(async function () {
        const studyIds = (studies || []).map((d) => d.id)
        data = (
          await Promise.all(
            data.map(async (x) => ({
              id: x.id,
              name: x.name,
              res:
                ((await LAMP.Type.getAttachment(x.id, "lamp.dashboard.user_type")) as any)?.data?.userType ??
                "researcher",
              study: ((await LAMP.Type.getAttachment(x.id, "lamp.dashboard.user_type")) as any)?.data?.studyId ?? "",
              studyName:
                ((await LAMP.Type.getAttachment(x.id, "lamp.dashboard.user_type")) as any)?.data?.studyName ?? "",
            }))
          )
        ).filter((y) =>
          userType === "user_admin"
            ? !userTypes.includes(y.res) && studyIds.includes(y.study)
            : userType === "clinical_admin"
            ? !userTypes.includes(y.res)
            : y.res !== "clinician"
        )
        setFilterData(true)
        setResearchers(data)
        setPaginatedResearchers(data.slice(0, rowCount))
        setLoading(false)
      })()
    })
  }

  useEffect(() => {
    refreshResearchers()
  }, [search])

  useEffect(() => {
    let authId = LAMP.Auth._auth.id
    let language = !!localStorage.getItem("LAMP_user_" + authId)
      ? JSON.parse(localStorage.getItem("LAMP_user_" + authId)).language
      : getSelectedLanguage()
      ? getSelectedLanguage()
      : "en-US"
    i18n.changeLanguage(language)
  }, [])

  const handleChangePage = (page: number, rowCount: number) => {
    setPage(page)
    setRowCount(rowCount)
    setPaginatedResearchers(researchers.slice(page * rowCount, page * rowCount + rowCount))
  }

  return (
    <React.Fragment>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Header
        researchers={researchers}
        searchData={(data) => setSearch(data)}
        refreshResearchers={refreshResearchers}
        userType={userType}
      />
      <Box className={classes.tableContainer} mt={4}>
        <Grid container spacing={3}>
          {researchers.length > 0 ? (
            <Grid container spacing={3}>
              {(paginatedResearchers ?? []).map((item, index) => (
                <Grid item lg={6} xs={12} key={item.id}>
                  <ResearcherRow
                    researcher={item}
                    history={history}
                    refreshResearchers={refreshResearchers}
                    researchers={researchers}
                    updateStore={updateStore}
                    userType={userType}
                    studies={studies}
                  />
                </Grid>
              ))}
              <Pagination data={researchers} updatePage={handleChangePage} rowPerPage={[20, 40, 60, 80]} />
            </Grid>
          ) : (
            <Grid item lg={6} xs={12}>
              <Box display="flex" alignItems="center" className={classes.norecords}>
                <Icon>info</Icon>
                {t("No Records Found")}
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    </React.Fragment>
  )
}
