import React, { useState, useEffect } from "react"
import { Box } from "@material-ui/core"
import TimeAgo from "javascript-time-ago"
import en from "javascript-time-ago/locale/en"
import hi from "javascript-time-ago/locale/hi"
import es from "javascript-time-ago/locale/es"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import ParticipantListItem from "./ParticipantListItem"
import Header from "./Header"
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
    },
    backdrop: {
      zIndex: 111111,
      color: "#fff",
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
  showUnscheduled,
  researcher,
  notificationColumn,
  ...props
}) {
  const classes = useStyles()
  const [participants, setParticipants] = useState(null)

  useEffect(() => {
    Service.getAll("participants").then((participants) => {
      console.log(participants)
      setParticipants(participants)
    })
  }, [])

  const refreshParticipants = () => {}

  return (
    <React.Fragment>
      {/* <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop> */}
      <Header studies={studies} researcher={researcher} />
      <Box className={classes.tableContainer}>
        {!!participants &&
          participants.map((eachParticipant) => (
            <ParticipantListItem
              participant={eachParticipant}
              onParticipantSelect={onParticipantSelect}
              refreshParticipants={refreshParticipants}
              studies={studies}
              notificationColumn={notificationColumn}
            />
          ))}
      </Box>
    </React.Fragment>
  )
}
