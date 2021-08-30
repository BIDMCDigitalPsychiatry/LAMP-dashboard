import React, { useState, useEffect } from "react"
import { Box, Icon, Grid, makeStyles, Theme, createStyles } from "@material-ui/core"
import Header from "./Header"
import { useTranslation } from "react-i18next"
import DeleteStudy from "./DeleteStudy"
import EditStudy from "./EditStudy"
import { Service } from "../../DBService/DBService"

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
  researcher,
  studies,
  upatedDataStudy,
  deletedDataStudy,
  searchData,
  newAdddeStudy,
  ...props
}: {
  title: string
  researcher: any
  studies: any
  upatedDataStudy?: any
  deletedDataStudy?: any
  searchData?: any
  newAdddeStudy?: any
}) {
  const classes = useStyles()
  const { t } = useTranslation()
  const [search, setSearch] = useState(null)
  const [allStudies, setAllStudies] = useState(studies)
  const [updateCount, setUpdateCount] = useState(0)
  const [newStudy, setNewStudy] = useState(null)
  const [studiesData, setStudiesData] = useState(studies)

  useEffect(() => {
    refreshStudies()
    newAdddeStudy(newStudy)
  }, [newStudy])

  useEffect(() => {
    setAllStudies(studies)
  }, [studies])

  const refreshStudies = () => {
    Service.getAll("studies").then((data) => {
      setStudiesData(data || [])
    })
  }

  const getAllStudies = async () => {
    let studies = await Service.getAll("studies")
    setAllStudies(studies)
  }

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
      <Header
        studies={studiesData}
        researcher={researcher}
        searchData={handleSearchData}
        setParticipants={searchFilterStudies}
        setUpdateCount={setUpdateCount}
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
                      researcherId={researcher?.id ?? ""}
                    />
                  </Box>
                  <DeleteStudy study={study} deletedStudy={handleDeletedStudy} researcherId={researcher?.id ?? ""} />
                </Box>
              </Grid>
            ))
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
