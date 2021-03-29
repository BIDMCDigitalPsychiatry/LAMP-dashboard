import React, { useState, useEffect } from "react"
import { Chip, Tooltip, makeStyles } from "@material-ui/core"
import { getTimeAgo, dataQuality } from "./Index"
import { useTranslation } from "react-i18next"
import { Service } from "../../DBService/DBService"

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
export default function Passive({ participant, ...props }) {
  const classes = useStyles()
  const [passive, setPassive] = useState(null)
  const { t, i18n } = useTranslation()
  const timeAgo = getTimeAgo(i18n.language)
  useEffect(() => {
    let isCancelled = false
    Service.getDataByKey("participants", [participant.id], "id").then((data) => {
      if (!isCancelled) {
        let passive = {
          gps: !!data[0]?.gps && data[0]?.gps.length > 0 ? data[0]?.gps.slice(-1)[0] : [],
          accel:
            !!data[0]?.accelerometer && data[0]?.accelerometer.length > 0 ? data[0]?.accelerometer.slice(-1)[0] : [],
        }
        setPassive(passive)
      }
    })
    return () => {
      isCancelled = true
    }
  }, [])
  return (
    <Tooltip title={dataQuality(passive, timeAgo, t, classes).title}>
      <Chip
        label={t("Last Passive")}
        className={classes.dataQuality + " " + dataQuality(passive, timeAgo, t, classes).class}
      />
    </Tooltip>
  )
}
