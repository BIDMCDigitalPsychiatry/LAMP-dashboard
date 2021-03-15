import React, { useState, useEffect } from "react"
import { Chip, Tooltip } from "@material-ui/core"
import { getTimeAgo, dataQuality } from "./Index"
import { makeStyles } from "@material-ui/core/styles"
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

export default function Passive({ participant, ...props }) {
  const classes = useStyles()
  const [passive, setPassive] = useState(null)
  const { t, i18n } = useTranslation()
  const timeAgo = getTimeAgo(i18n.language)

  useEffect(() => {
    let passive = {
      gps: participant.gps,
      accel: participant.accelerometer,
    }
    setPassive(passive)
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
