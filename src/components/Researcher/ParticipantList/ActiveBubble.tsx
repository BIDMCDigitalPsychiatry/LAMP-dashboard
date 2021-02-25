import React, { useState, useEffect } from "react"
import { Box, Chip, Tooltip } from "@material-ui/core"
import { getTimeAgo, dataQuality } from "./Index"
import LAMP from "lamp-core"
import { makeStyles } from "@material-ui/core/styles"
import { useTranslation } from "react-i18next"

const useStyles = makeStyles((theme) => ({
  dataQuality: {
    margin: "4px 0",
    backgroundColor: "#E9F8E7",
    color: "#FFF",
  },
  dataGreen: { backgroundColor: "#e0ffe1 !important", color: "#4caf50" },
  dataYellow: { backgroundColor: "#fff8bc !important", color: "#a99700" },
  dataRed: { backgroundColor: "#ffcfcc !important", color: "#f44336" },
  dataGrey: { backgroundColor: "#d4d4d4 !important", color: "#424242" },
}))

export default function Active({ participantId, ...props }) {
  const classes = useStyles()
  const [logins, setLogins] = useState(null)
  const [active, setActive] = useState(null)
  const [passive, setPassive] = useState(null)
  const { t, i18n } = useTranslation()
  const timeAgo = getTimeAgo(i18n.language)

  useEffect(() => {
    ;(async function () {
      let res =
        (await LAMP.SensorEvent.allByParticipant(participantId, "lamp.analytics", undefined, undefined, 1)) ?? []
      setLogins(res.shift())
      let passive = {
        gps:
          (await LAMP.SensorEvent.allByParticipant(participantId, "lamp.gps", undefined, undefined, 5)).slice(-1)[0] ??
          (await LAMP.SensorEvent.allByParticipant(participantId, "beiwe.gps", undefined, undefined, 5)).slice(-1)[0] ??
          [],
        accel:
          (await LAMP.SensorEvent.allByParticipant(participantId, "lamp.accelerometer", undefined, undefined, 5)).slice(
            -1
          )[0] ??
          (
            await LAMP.SensorEvent.allByParticipant(participantId, "beiwe.accelerometer", undefined, undefined, 5)
          ).slice(-1)[0] ??
          [],
      }
      setPassive(passive)
      let active = (await LAMP.ActivityEvent.allByParticipant(participantId, undefined, undefined, undefined, 1))[0]
      setActive(active)
    })()
  }, [])

  const dateInfo = (id) => ({
    relative: active?.timestamp ?? 0,
    absolute: new Date(parseInt((logins || {}).timestamp)).toLocaleString("en-US", Date.formatStyle("medium")),
    device: (logins || { data: {} }).data?.device_type || t("an unknown device"),
    userAgent: (logins || { data: {} }).data?.user_agent || t("unknown device model"),
  })

  const userAgentConcat = (userAgent) => {
    let appVersion = userAgent.hasOwnProperty("app_version") ? userAgent.app_version : ""
    let osVersion = userAgent.hasOwnProperty("os_version") ? userAgent.os_version : ""
    let deviceName = userAgent.hasOwnProperty("deviceName") ? userAgent.deviceName : ""
    let model = userAgent.hasOwnProperty("model") ? userAgent.model : ""
    return (
      t("App Version:") +
      appVersion +
      " " +
      t("OS Version:") +
      osVersion +
      " " +
      t("DeviceName:") +
      deviceName +
      " " +
      t("Model:") +
      model
    )
  }
  return (
    <Box>
      {dateInfo(participantId).relative !== "in NaN years" && dateInfo(participantId).relative !== undefined ? (
        <Tooltip
          title={`${timeAgo.format(new Date(parseInt(dateInfo(participantId).relative)))} on ${
            dateInfo(participantId).device
          } (${dateInfo(participantId).absolute} 
           ${
             typeof dateInfo(participantId).userAgent === "object"
               ? userAgentConcat(dateInfo(participantId).userAgent)
               : dateInfo(participantId).userAgent
           })`}
        >
          <Chip
            label={t("Last Active")}
            className={classes.dataQuality + " " + dataQuality(passive, timeAgo, t, classes).class}
          />
        </Tooltip>
      ) : (
        <Tooltip title={t("Never")}>
          <Chip
            label={t("Last Active")}
            className={classes.dataQuality + " " + dataQuality(passive, timeAgo, t, classes).class}
          />
        </Tooltip>
      )}
    </Box>
  )
}
