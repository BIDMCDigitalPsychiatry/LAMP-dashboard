import React, { useState, useEffect, useMemo } from "react"
import { Box, Grid, Backdrop, CircularProgress, Icon, makeStyles, Theme, createStyles } from "@material-ui/core"
import TimeAgo from "javascript-time-ago"
import en from "javascript-time-ago/locale/en"
import hi from "javascript-time-ago/locale/hi"
import es from "javascript-time-ago/locale/es"
import ParticipantListItem from "./ParticipantListItem"
import Header from "./Header"
import { Service } from "../../DBService/DBService"
import { sortData } from "../Dashboard"
import { useTranslation } from "react-i18next"
import Pagination from "../../PaginatedElement"
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
    norecordsmain: {
      minHeight: "calc(100% - 114px)",
      position: "absolute",
    },
    norecords: {
      "& span": { marginRight: 5 },
    },
  })
)

function getCurrentLanguage(language) {
  let lang
  switch (language) {
    case "en_US":
      lang = "en-US"
      break
    case "hi_IN":
      lang = "hi-IN"
      break
    case "es_ES":
      lang = "es-ES"
      break
    default:
      lang = "en-US"
      break
  }
  return lang
}

function getCurrentLanguageCode(language) {
  let langCode
  switch (language) {
    case "en_US":
      langCode = en
      break
    case "hi_IN":
      langCode = hi
      break
    case "es_ES":
      langCode = es
      break
    default:
      langCode = en
      break
  }
  return langCode
}

export function getTimeAgo(language) {
  const currentLanguage = getCurrentLanguage(language)
  const currentLanguageCode = getCurrentLanguageCode(language)
  TimeAgo.addLocale(currentLanguageCode)
  return new TimeAgo(currentLanguage)
}

const daysSinceLast = (passive, timeAgo, t) => ({
  gpsString: passive?.gps?.timestamp ? timeAgo.format(new Date(((passive || {}).gps || {}).timestamp)) : t("Never"),
  accelString: passive?.accel?.timestamp
    ? timeAgo.format(new Date(((passive || {}).accel || {}).timestamp))
    : t("Never"),
  gps:
    (new Date().getTime() - new Date(parseInt(((passive || {}).gps || {}).timestamp)).getTime()) / (1000 * 3600 * 24),
  accel:
    (new Date().getTime() - new Date(parseInt(((passive || {}).accel || {}).timestamp)).getTime()) / (1000 * 3600 * 24),
})

export const dataQuality = (passive, timeAgo, t, classes) => ({
  title:
    t("GPS") +
    `: ${daysSinceLast(passive, timeAgo, t).gpsString}, ` +
    t("Accelerometer") +
    `: ${daysSinceLast(passive, timeAgo, t).accelString}`,
  class:
    daysSinceLast(passive, timeAgo, t).gps <= 2 && daysSinceLast(passive, timeAgo, t).accel <= 2
      ? classes.dataGreen
      : daysSinceLast(passive, timeAgo, t).gps <= 7 || daysSinceLast(passive, timeAgo, t).accel <= 7
      ? classes.dataYellow
      : daysSinceLast(passive, timeAgo, t).gps <= 30 || daysSinceLast(passive, timeAgo, t).accel <= 30
      ? classes.dataRed
      : classes.dataGrey,
})
// TODO: Traffic Lights with Last Survey Date + Login+device + # completed events
export default function ParticipantList({
  studies,
  title,
  onParticipantSelect,
  researcher,
  notificationColumn,
  selectedStudies,
  setSelectedStudies,
  userType,
  ...props
}) {
  const classes = useStyles()
  const [participants, setParticipants] = useState(null)
  const [selectedParticipants, setSelectedParticipants] = useState([])
  const [loading, setLoading] = useState(false)
  const [updateCount, setUpdateCount] = useState(0)
  const [selected, setSelected] = useState(selectedStudies)
  const [paginatedParticipants, setPaginatedParticipants] = useState([])
  const [newStudy, setNewStudy] = useState(null)
  const [studiesData, setStudiesData] = useState(studies)
  const [rowCount, setRowCount] = useState(40)
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState(null)

  const { t } = useTranslation()

  useEffect(() => {
    setSelected(selectedStudies)
    if (selectedStudies) {
      searchParticipants()
    }
  }, [selectedStudies])

  useEffect(() => {
    setStudiesData(studies)
  }, [studies])

  const handleChange = (participant, checked) => {
    if (checked) {
      setSelectedParticipants((prevState) => [...prevState, participant])
    } else {
      let selected = selectedParticipants.filter((item) => item.id != participant.id)
      setSelectedParticipants(selected)
    }
  }

  const searchParticipants = (searchVal?: string) => {
    let searchTxt = searchVal ?? search
    if (selectedStudies.length > 0) {
      const selectedData = selectedStudies.filter((o) => studiesData.some(({ name }) => o === name))
      if (selectedData.length > 0 && !loading) {
        let result = []
        setLoading(true)
        selectedData.map((study) => {
          Service.getDataByKey("participants", [study], "study_name").then((participantData) => {
            if ((participantData || []).length > 0) {
              if (!!searchTxt && searchTxt.trim().length > 0) {
                result = result.concat(participantData)
                result = result.filter((i) => i.name?.includes(searchTxt) || i.id?.includes(searchTxt))
                setParticipants(sortData(result, selectedData, "id"))
              } else {
                result = result.concat(participantData)
                setParticipants(sortData(result, selectedData, "id"))
              }
              setPaginatedParticipants(result.slice(0, rowCount))
              setPage(0)
            } else {
              if (result.length === 0) setParticipants([])
            }
            setLoading(false)
          })
        })
      }
    } else {
      setParticipants([])
      setLoading(false)
    }
    setSelectedParticipants([])
  }

  const handleSearchData = (val: string) => {
    setSearch(val)
    searchParticipants(val)
  }

  const handleChangePage = (page: number, rowCount: number) => {
    setLoading(true)
    setRowCount(rowCount)
    setPage(page)
    setPaginatedParticipants(participants.slice(page * rowCount, page * rowCount + rowCount))
    setLoading(false)
  }

  return (
    <React.Fragment>
      {/*<Backdrop className={classes.backdrop} open={loading || participants === null}>
        <CircularProgress color="inherit" />
  </Backdrop>*/}
      <Header
        studies={studiesData}
        researcher={researcher}
        selectedParticipants={selectedParticipants}
        searchData={handleSearchData}
        selectedStudies={selected}
        setSelectedStudies={setSelectedStudies}
        setParticipants={searchParticipants}
        newStudyObj={setNewStudy}
        userType={userType}
      />
      <Box className={classes.tableContainer} py={4}>
        <Grid container spacing={3}>
          {!!participants && participants.length > 0 ? (
            <Grid container spacing={3}>
              {paginatedParticipants.map((eachParticipant, index) => (
                <Grid item lg={6} xs={12} key={eachParticipant.id}>
                  <ParticipantListItem
                    participant={eachParticipant}
                    onParticipantSelect={onParticipantSelect}
                    studies={studiesData}
                    notificationColumn={notificationColumn}
                    handleSelectionChange={handleChange}
                    setUpdateCount={setUpdateCount}
                    selectedParticipants={selectedParticipants}
                  />
                </Grid>
              ))}
              <Pagination data={participants} updatePage={handleChangePage} rowPerPage={[20, 40, 60, 80]} />
            </Grid>
          ) : (
            <Box className={classes.norecordsmain}>
              <Box display="flex" p={2} alignItems="center" className={classes.norecords}>
                <Icon>info</Icon>
                {t("No Records Found")}
              </Box>
            </Box>
          )}
        </Grid>
      </Box>
    </React.Fragment>
  )
}
