import React, { useState, useEffect } from "react"
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
import { useTranslation } from "react-i18next"
import Pagination from "../../PaginatedElement"
import useInterval from "../../useInterval"
import LAMP from "lamp-core"
import { Service } from "../../DBService/DBService"
import { sortData } from "../Dashboard"
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

// TODO: Traffic Lights with Last Survey Date + Login+device + # completed events
export default function ParticipantList({
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
  const [filters, setFilters] = useState({
    studies: [], // study names
    sort: "createdAt",
    order: order ? "asc" : "desc",
    search: "",
    page: 1,
    limit: 40,
  })
  const [sensors, setSensors] = useState(null)
  const [events, setEvents] = useState(null)
  const [participantCount, setParticipantCount] = useState({})
  const [totalCount, setTotalCount] = useState(0)

  const { t } = useTranslation()

  useInterval(
    () => {
      setLoading(true)
      getAllStudies()
    },
    studies !== null && (studies || [])?.length > 0 ? null : 2000,
    true
  )

  useEffect(() => {
    let params = JSON.parse(localStorage.getItem("participants"))
    setPage(params?.page ?? 0)
    setRowCount(params?.rowCount ?? 40)
  }, [])

  useEffect(() => {
    if (studies?.length > 0) {
      studies.forEach((study) => {
        LAMP.Study.lookup(study.id, 1).then((sensors) => {
          setSensors(sensors)
        })
        LAMP.Study.lookup(study.id, 2).then((events) => {
          setEvents(events)
        })
      })
    }
  }, [studies])

  useEffect(() => {
    if (selected !== selectedStudies) setSelected(selectedStudies)
  }, [selectedStudies])

  useEffect(() => {
    const userToken: any = getBasicToken()
    if (!!userToken || LAMP.Auth?._auth?.serverAddress == "demo.lamp.digital") {
      if ((selected || [])?.length > 0) {
        searchParticipants()
      } else {
        setParticipants([])
        setLoading(false)
      }
    } else {
      window.location.href = "/#/"
    }
  }, [selected])

  const searchParticipantsForDemo = (searchVal?: string) => {
    let searchTxt = searchVal ?? search
    const selectedData = selected?.filter((o) => studies.some(({ name }) => o === name))
    if (selectedData?.length > 0) {
      Service.getAll("participants").then((participantData) => {
        if (!!searchTxt && searchTxt.trim()?.length > 0) {
          participantData = (participantData || [])?.filter(
            (i) => i.name?.includes(searchTxt) || i.id?.includes(searchTxt)
          )
          setParticipants(sortData(participantData, selectedData, "id"))
        } else {
          setParticipants(sortData(participantData, selectedData, "id"))
        }
        const allCounts = (participantData || [])?.reduce((acc: Record<string, number>, a: any) => {
          const key = a.study_id || a.study || "unknown"
          acc[key] = (acc[key] || 0) + 1
          return acc
        }, {} as Record<string, number>)

        setParticipantCount(allCounts)
        setTotalCount(participants?.length)
        setPaginatedParticipants(
          sortData(participantData, selectedData, "id")?.slice(page * rowCount, page * rowCount + rowCount)
        )
        setLoading(false)
      })
    } else {
      setParticipants([])
      setLoading(false)
    }
    setSelectedParticipants([])
  }

  const searchParticipants = (searchVal?: string) => {
    if (LAMP.Auth._auth.serverAddress === "demo.lamp.digital") {
      searchParticipantsForDemo(searchVal)
      return
    } else {
      fetchParticipants()
    }
  }

  const handleSearchData = (val: string) => {
    setSearch(val)
    setFilters((prev) => ({ ...prev, search: val, page: 1 }))
  }

  const handleChangePage = (pageNum, rowCnt) => {
    setFilters((prev) => ({ ...prev, page: pageNum + 1, limit: rowCnt }))
    localStorage.setItem("participants", JSON.stringify({ page: pageNum, rowCount: rowCnt }))
  }

  useEffect(() => {
    if (!researcherId || !studies?.length) return
    localStorage.setItem("researcherId", researcherId)

    if (LAMP.Auth?._auth?.serverAddress === "demo.lamp.digital") {
      searchParticipantsForDemo(search)
    } else {
      fetchParticipants()
    }
  }, [researcherId, selectedStudies, filters])

  useEffect(() => {
    if (participants?.length > 0) {
      const start = page * rowCount
      const end = start + rowCount
      setPaginatedParticipants(participants?.slice(start, end))
    } else {
      setPaginatedParticipants([])
    }
  }, [participants, page, rowCount])

  useEffect(() => {
    setFilters((prev) => ({ ...prev, order: order ? "asc" : "desc" }))
  }, [order])

  const handleChange = (participant, checked) => {
    if (checked) setSelectedParticipants((prev) => [...prev, participant])
    else setSelectedParticipants((prev) => prev?.filter((p) => p.id !== participant.id))
  }

  const fetchParticipants = async () => {
    try {
      setLoading(true)

      // build body
      const requestBody = {
        studies: selectedStudies,
        sort: filters.order,
        search: filters.search?.trim(),
        page: filters.page,
        limit: filters.limit,
      }

      const result = await LAMP.Researcher.usersList(researcherId, requestBody)
      const participantArray = result?.users || []
      const mapped = participantArray?.map((p) => ({
        ...p,
        id: p._id,
        name: p.userName || p._id,
        study_name: p.studyName,
      }))

      setParticipants(mapped)

      setTotalCount(result?.count || 0)
      setPaginatedParticipants(mapped?.slice(0, rowCount))
      setParticipantCount(result?.totalUsers || {})
    } catch (err) {
      console.error(" Error fetching participants:", err)
      setPaginatedParticipants([])
    } finally {
      setLoading(false)
    }
    setSelectedParticipants([])
  }

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
        setSelectedParticipants={setSelectedParticipants}
        setData={getAllStudies}
        mode={mode}
        setOrder={setOrder}
        order={order}
        loading={loading}
        participants={participants}
        participantCount={participantCount}
      />
      <Box className={classes.tableContainer} py={4}>
        <Grid container spacing={3}>
          {!!participants && participants?.length > 0 ? (
            <Grid container spacing={3}>
              {paginatedParticipants?.map((eachParticipant, index) => (
                <Grid item lg={6} xs={12} key={eachParticipant.id}>
                  <ParticipantListItem
                    participant={eachParticipant}
                    onParticipantSelect={onParticipantSelect}
                    studies={studies}
                    notificationColumn={notificationColumn}
                    handleSelectionChange={handleChange}
                    selectedParticipants={selectedParticipants}
                    researcherId={researcherId}
                    sensor={sensors?.participants?.filter((s) => s.id === eachParticipant.id)[0]}
                    event={events?.participants?.filter((e) => e.id === eachParticipant.id)[0]}
                  />
                </Grid>
              ))}
              <Pagination
                data={participants}
                updatePage={handleChangePage}
                rowPerPage={[20, 40, 60, 80]}
                currentPage={page}
                currentRowCount={rowCount}
                totalCount={totalCount}
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
