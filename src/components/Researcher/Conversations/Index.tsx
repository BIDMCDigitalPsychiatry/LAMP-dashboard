import React, { useState, useEffect, useMemo } from "react"
import { Box, Grid, Backdrop, CircularProgress, Icon, makeStyles, Theme, createStyles } from "@material-ui/core"
import TimeAgo from "javascript-time-ago"
import en from "javascript-time-ago/locale/en"
import da from "javascript-time-ago/locale/da"
import de from "javascript-time-ago/locale/de"
import zh from "javascript-time-ago/locale/zh"
import ko from "javascript-time-ago/locale/ko"
import es from "javascript-time-ago/locale/es"
import it from "javascript-time-ago/locale/it"
import hi from "javascript-time-ago/locale/hi"
import zhHK from "javascript-time-ago/locale/zh-Hans-HK"
import fr from "javascript-time-ago/locale/fr"
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
    case "it_IT":
      lang = "it-IT"
      break
    case "de_DE":
      lang = "de-DE"
      break
    case "da_DK":
      lang = "da-DK"
      break
    case "fr_FR":
      lang = "fr-FR"
      break
    case "zh_CN":
      lang = "zh-CN"
      break
    case "zh_HK":
      lang = "zh-HK"
      break
    case "ko_KR":
      lang = "ko-KR"
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
    case "it_IT":
      langCode = it
      break
    case "de_DE":
      langCode = de
      break
    case "da_DK":
      langCode = da
      break
    case "fr_FR":
      langCode = fr
      break
    case "ko_KR":
      langCode = ko
      break
    case "zh_CN":
      langCode = zh
      break
    case "zh_HK":
      langCode = zhHK
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

export default function Conversations({
  studies,
  title,
  onParticipantSelect,
  researcherId,
  notificationColumn,
  selectedStudies,
  setSelectedStudies,
  getAllStudies,
  mode,
  setOrder,
  order,
  ...props
}) {
  const classes = useStyles()
  const [participants, setParticipants] = useState(null)
  const [selectedParticipants, setSelectedParticipants] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState([])
  const [paginatedParticipants, setPaginatedParticipants] = useState([])
  const [rowCount, setRowCount] = useState(40)
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState(null)

  const { t } = useTranslation()

  useInterval(
    () => {
      setLoading(true)
      getAllStudies()
    },
    studies !== null && (studies || []).length > 0 ? null : 2000,
    true
  )

  useEffect(() => {
    let params = JSON.parse(localStorage.getItem("participants"))
    setPage(params?.page ?? 0)
    setRowCount(params?.rowCount ?? 40)
  }, [])

  useEffect(() => {
    if (selected !== selectedStudies) setSelected(selectedStudies)
  }, [selectedStudies])

  useEffect(() => {
    if ((selected || []).length > 0) {
      searchParticipants()
    } else {
      setParticipants([])
      setLoading(false)
    }
  }, [selected])

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
    const selectedData = selected.filter((o) => studies.some(({ name }) => o === name))
    if (selectedData.length > 0) {
      Service.getAll("participants").then((participantData) => {
        // participantData = (participantData || []).filter((p) => p.is_deleted != true)
        if (!!searchTxt && searchTxt.trim().length > 0) {
          participantData = (participantData || []).filter(
            (i) => i.name?.includes(searchTxt) || i.id?.includes(searchTxt)
          )
          setParticipants(sortData(participantData, selectedData, "id"))
        } else {
          setParticipants(sortData(participantData, selectedData, "id"))
        }
        setPaginatedParticipants(
          sortData(participantData, selectedData, "id").slice(page * rowCount, page * rowCount + rowCount)
        )
        setPage(page)
        setRowCount(rowCount)
        setLoading(false)
      })
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
    const selectedData = selected.filter((o) => studies.some(({ name }) => o === name))
    setPaginatedParticipants(
      sortData(participants, selectedData, "name").slice(page * rowCount, page * rowCount + rowCount)
    )
    localStorage.setItem("participants", JSON.stringify({ page: page, rowCount: rowCount }))
    setLoading(false)
  }
  const [enabled, setEnabled] = useState(false)

  return (
    <React.Fragment>
      <Backdrop className={classes.backdrop} open={loading || participants === null}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Header
        studies={studies}
        researcherId={researcherId}
        selectedParticipants={selectedParticipants}
        searchData={handleSearchData}
        selectedStudies={selected}
        setSelectedStudies={setSelectedStudies}
        setParticipants={searchParticipants}
        setData={getAllStudies}
        mode={mode}
        setOrder={setOrder}
        order={order}
        setEnabled={setEnabled}
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
                    studies={studies}
                    notificationColumn={notificationColumn}
                    handleSelectionChange={handleChange}
                    selectedParticipants={selectedParticipants}
                    researcherId={researcherId}
                    enabled={enabled}
                  />
                </Grid>
              ))}
              <Pagination
                data={participants}
                updatePage={handleChangePage}
                rowPerPage={[20, 40, 60, 80]}
                currentPage={page}
                currentRowCount={rowCount}
              />
            </Grid>
          ) : (
            <Box className={classes.norecordsmain}>
              <Box display="flex" p={2} alignItems="center" className={classes.norecords}>
                <Icon>info</Icon>
                {`${t("No Records Found")}`}
              </Box>
            </Box>
          )}
        </Grid>
      </Box>
    </React.Fragment>
  )
}
