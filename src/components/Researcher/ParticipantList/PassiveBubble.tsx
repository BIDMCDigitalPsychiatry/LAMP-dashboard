import React, { useState, useEffect } from "react"
import { Chip, Tooltip, makeStyles } from "@material-ui/core"
import { getTimeAgo } from "./Index"
import { useTranslation } from "react-i18next"

const useStyles = makeStyles((theme) => ({
  dataQuality: {
    margin: "4px 5px 4px 0",
    backgroundColor: "#E9F8E7",
    color: "#FFF",
  },
  dataGreen: { backgroundColor: "#e0ffe1 !important", color: "#4caf50" },
  dataYellow: { backgroundColor: "#fff8bc !important", color: "#a99700" },
  dataRed: { backgroundColor: "#ffcfcc !important", color: "#f44336" },
  dataGrey: { backgroundColor: "#e4e4e4 !important", color: "#424242" },
}))

const daysSinceLast = (passive, timeAgo, t) => ({
  gpsString: passive?.gps?.timestamp
    ? timeAgo.format(new Date(((passive || {}).gps || {}).timestamp))
    : `${t("Never")}`,
  accelString: passive?.accel?.timestamp
    ? timeAgo.format(new Date(((passive || {}).accel || {}).timestamp))
    : `${t("Never")}`,
  gps:
    (new Date().getTime() - new Date(parseInt(((passive || {}).gps || {}).timestamp)).getTime()) / (1000 * 3600 * 24),
  accel:
    (new Date().getTime() - new Date(parseInt(((passive || {}).accel || {}).timestamp)).getTime()) / (1000 * 3600 * 24),
})

export const dataQuality = (passive, timeAgo, t, classes) => ({
  title:
    `${t("GPS")}` +
    `: ${daysSinceLast(passive, timeAgo, t).gpsString}, ` +
    `${t("Accelerometer")}` +
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

export default function Passive({ sensor, ...props }) {
  const classes = useStyles()
  const { t, i18n } = useTranslation()
  const timeAgo = getTimeAgo(i18n.language)
  const [passive, setPassive] = useState(null)

  useEffect(() => {
    let passive = {
      gps: !!sensor?.gps && sensor?.gps?.length > 0 ? sensor?.gps?.slice(-1)[0] : [],
      accel: !!sensor?.accelerometer && sensor?.accelerometer?.length > 0 ? sensor?.accelerometer?.slice(-1)[0] : [],
    }
    setPassive(passive)
  }, [sensor])

  return (
    <Tooltip title={dataQuality(passive, timeAgo, t, classes).title}>
      <Chip
        label={`${t("Last Passive")}`}
        className={classes.dataQuality + " " + dataQuality(passive, timeAgo, t, classes).class}
      />
    </Tooltip>
  )
}
