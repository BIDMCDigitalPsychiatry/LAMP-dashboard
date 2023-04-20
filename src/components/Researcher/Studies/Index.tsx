import React, { useState, useEffect } from "react"
import { Box, Icon, Grid, makeStyles, Theme, createStyles, Backdrop, CircularProgress } from "@material-ui/core"
import Header from "./Header"
import { useTranslation } from "react-i18next"
import DeleteStudy from "./DeleteStudy"
import EditStudy from "./EditStudy"
import { Service } from "../../DBService/DBService"
import useInterval from "../../useInterval"

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
    studyMain: { background: "#F8F8F8", borderRadius: 4 },
    norecords: {
      "& span": { marginRight: 5 },
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

  useInterval(
    () => {
      setLoading(true)
      getAllStudies()
    },
    studies !== null && (studies || []).length > 0 ? null : 2000,
    true
  )

  useEffect(() => {
    getAllStudies()
    newAdddeStudy(newStudy)
  }, [newStudy])

  useEffect(() => {
    if ((studies || []).length > 0) setAllStudies(studies)
    else setAllStudies(null)
  }, [studies])

  const searchFilterStudies = async () => {
    if (!!search && search !== "") {
      let studiesList: any = await Service.getAll("studies")
      let newStudies = studiesList.filter((i) => i.name?.toLowerCase()?.includes(search?.toLowerCase()))
      setAllStudies(newStudies)
    } else {
      getAllStudies()
    }
  }

  useEffect(() => {
    if (allStudies !== null) setLoading(false)
  }, [allStudies])

  useEffect(() => {
    searchFilterStudies()
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
            {allStudies !== null && (allStudies || []).length > 0 ? (
              (allStudies || []).map((study) => (
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
