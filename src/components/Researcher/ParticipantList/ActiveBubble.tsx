import React, { useState, useEffect } from "react"
import Chip from "@material-ui/core/Chip"
import Tooltip from "@material-ui/core/Tooltip"

import makeStyles from "@material-ui/core/styles/makeStyles"
import { getTimeAgo } from "./Index"
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

const activeDataQuality = (active, classes) => ({
  class:
    (new Date().getTime() - new Date(parseInt(active?.timestamp ?? 0)).getTime()) / (1000 * 3600 * 24) <= 2
      ? classes.dataGreen
      : (new Date().getTime() - new Date(parseInt(active?.timestamp ?? 0)).getTime()) / (1000 * 3600 * 24) <= 7
      ? classes.dataYellow
      : (new Date().getTime() - new Date(parseInt(active?.timestamp ?? 0)).getTime()) / (1000 * 3600 * 24) <= 30
      ? classes.dataRed
      : classes.dataGrey,
})

export default function Active({ participant, ...props }) {
  const classes = useStyles()
  const [logins, setLogins] = useState(null)
  const [active, setActive] = useState(null)
  const { t, i18n } = useTranslation()
  const timeAgo = getTimeAgo(i18n.language)

  useEffect(() => {
    let isCancelled = false
    setTimeout(() => {
      Service.getDataByKey("participants", [participant.id], "id").then((data) => {
        if (!isCancelled) {
          let res = data[0]?.analytics
          setLogins(!!res && res.length > 0 ? res[0] : null)
          let active = !!data[0]?.active && data[0]?.active.length > 0 ? data[0]?.active[0] : []
          setActive(active)
        }
      })
      return () => {
        isCancelled = true
      }
    }, 3000)
  }, [])

  const dateInfo = (id) => ({
    relative: active?.timestamp ?? 0,
    absolute: !!logins
      ? new Date(parseInt((logins || {}).timestamp)).toLocaleString("en-US", Date.formatStyle("medium"))
      : "",
    device: (logins || { data: {} }).data?.device_type || `${t("an unknown device")}`,
    userAgent: (logins || { data: {} }).data?.user_agent || `${t("unknown device model")}`,
  })

  const userAgentConcat = (userAgent) => {
    let appVersion = userAgent.hasOwnProperty("app_version") ? userAgent.app_version : ""
    let osVersion = userAgent.hasOwnProperty("os_version") ? userAgent.os_version : ""
    let deviceName = userAgent.hasOwnProperty("deviceName") ? userAgent.deviceName : ""
    let model = userAgent.hasOwnProperty("model") ? userAgent.model : ""
    return (
      `${t("App Version:.")}` +
      appVersion +
      " " +
      `${t("OS Version:.")}` +
      osVersion +
      " " +
      `${t("DeviceName:.")}` +
      deviceName +
      " " +
      `${t("Model:.")}` +
      model
    )
  }

  return (
    <span>
      {dateInfo(participant.id).relative !== "in NaN years" &&
      dateInfo(participant.id).relative !== undefined &&
      dateInfo(participant.id).relative !== 0 ? (
        <Tooltip
          title={`${timeAgo.format(new Date(parseInt(dateInfo(participant.id).relative)))} on ${
            dateInfo(participant.id).device
          } (${dateInfo(participant.id).absolute} 
           ${
             typeof dateInfo(participant.id).userAgent === "object"
               ? userAgentConcat(dateInfo(participant.id).userAgent)
               : dateInfo(participant.id).userAgent
           } )`}
        >
          <Chip
            label={`${t("Last Active")}`}
            className={classes.dataQuality + " " + activeDataQuality(active, classes).class}
          />
        </Tooltip>
      ) : (
        <Tooltip title={`${t("Never")}`}>
          <Chip
            label={`${t("Last Active")}`}
            className={classes.dataQuality + " " + activeDataQuality(active, classes).class}
          />
        </Tooltip>
      )}
    </span>
  )
}
