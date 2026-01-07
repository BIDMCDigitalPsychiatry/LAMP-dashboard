import React, { useState, useEffect } from "react"
import {
  Box,
  Icon,
  Grid,
  makeStyles,
  Theme,
  createStyles,
  Backdrop,
  CircularProgress,
  Fab,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core"
import Header from "./Header"
import { useTranslation } from "react-i18next"
import DeleteStudy from "./DeleteStudy"
import EditStudy from "./EditStudy"
import { Service } from "../../DBService/DBService"
import useInterval from "../../useInterval"
import LAMP from "lamp-core"
import { useSnackbar } from "notistack"
import { getBasicToken } from "../../helper"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
      [theme.breakpoints.down("sm")]: {
        marginBottom: 80,
      },
    },
    backdrop: {
      zIndex: 111111,
      color: "#fff",
    },
    studyMain: { background: "#F8F8F8", borderRadius: 4, position: "relative" },
    norecords: {
      "& span": { marginRight: 5 },
    },
    checkMsgContainer: {
      position: "absolute",
      right: 104,
      top: 0,
      height: "100%",
      display: "flex",
      alignItems: "center",
      "& label": {
        marginRight: 8,
      },
    },
    btnWhite: {
      background: "#fff",
      borderRadius: "40px",
      boxShadow: "none",
      cursor: "pointer",
      textTransform: "capitalize",
      fontSize: "14px",
      color: "#7599FF",

      "&:hover": { color: "#5680f9", background: "#fff", boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.20)" },
    },
    disabledButton: {
      color: "#4C66D6 !important",
      opacity: 0.5,
    },
  })
)

export default function StudiesList({
  title,
  researcherId,
  studies,
  upatedDataStudy,
  deletedDataStudy,
  searchData,
  getAllStudies,
  newAdddeStudy,
  ...props
}) {
  const classes = useStyles()
  const { t } = useTranslation()
  const [search, setSearch] = useState(null)
  const [allStudies, setAllStudies] = useState(null)
  const [newStudy, setNewStudy] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enabledMessagingStudyIds, setEnabledMessagingStudyIds] = useState([])

  useInterval(
    () => {
      setLoading(true)
      getAllStudies()
    },
    studies !== null && (studies || [])?.length > 0 ? null : 2000,
    true
  )

  useEffect(() => {
    getAllStudies()
    newAdddeStudy(newStudy)
  }, [newStudy])

  useEffect(() => {
    if ((studies || [])?.length > 0) {
      setAllStudies(studies)
      const enabledIds = studies?.filter((study) => study.isMessagingEnabled)?.map((study) => study.id)
      setEnabledMessagingStudyIds(enabledIds)
    } else {
      setAllStudies([])
      setEnabledMessagingStudyIds([]) // Reset if studies is empty
    }
  }, [studies])
  const searchFilterStudies = async () => {
    if (!!search && search !== "") {
      const newStudies = studies?.filter((i) => i.name?.toLowerCase()?.includes(search?.toLowerCase()))
      setAllStudies(newStudies)
    } else {
      getAllStudies()
    }
    setLoading(false)
  }

  useEffect(() => {
    if (allStudies !== null) setLoading(false)
  }, [allStudies])

  useEffect(() => {
    const userToken: any = getBasicToken()
    if (!!userToken || LAMP.Auth?._auth?.serverAddress == "demo.lamp.digital") {
      searchFilterStudies()
    } else {
      window.location.href = "/#/"
    }
  }, [search])

  const handleUpdatedStudyObject = (data) => {
    upatedDataStudy(data)
  }

  const handleDeletedStudy = (data) => {
    deletedDataStudy(data)
    searchData(search)
  }

  const handleSearchData = (val) => {
    setSearch(val)
  }

  return (
    <React.Fragment>
      <Backdrop className={classes.backdrop} open={loading || allStudies === null}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box>
        <Header
          studies={allStudies ?? null}
          researcherId={researcherId}
          searchData={handleSearchData}
          setParticipants={searchFilterStudies}
          newStudyObj={setNewStudy}
        />
        <Box className={classes.tableContainer} py={4}>
          <Grid container spacing={3}>
            {allStudies !== null && (allStudies || [])?.length > 0 ? (
              (allStudies || [])?.map((study) => (
                <Grid item lg={6} xs={12} key={study.id}>
                  <Box display="flex" p={1} className={classes.studyMain}>
                    <Box flexGrow={1}>
                      <EditStudy
                        study={study}
                        upatedDataStudy={handleUpdatedStudyObject}
                        allStudies={allStudies}
                        researcherId={researcherId}
                      />
                    </Box>

                    <DeleteStudy study={study} deletedStudy={handleDeletedStudy} researcherId={researcherId} />
                  </Box>
                </Grid>
              ))
            ) : (
              <Grid item lg={6} xs={12}>
                <Box display="flex" alignItems="center" className={classes.norecords}>
                  <Icon>info</Icon>
                  {`${t("No Records Found")}`}
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>
    </React.Fragment>
  )
}
