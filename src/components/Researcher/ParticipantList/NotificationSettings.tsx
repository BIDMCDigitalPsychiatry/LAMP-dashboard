// Core Imports
import React, { useState, useEffect } from "react"
import { Tooltip, Switch, FormControlLabel } from "@material-ui/core"

import LAMP from "lamp-core"
import { makeStyles } from "@material-ui/core/styles"
import { useTranslation } from "react-i18next"
import { Service } from "../../DBService/DBService"

const useStyles = makeStyles((theme) => ({
  dataQuality: {
    margin: "4px 0",
    backgroundColor: "#E9F8E7",
    color: "#FFF",
  },
  switchLabel: { color: "#4C66D6" },
}))

export default function NotificationSettings({ participant, ...props }) {
  const classes = useStyles()
  const { t } = useTranslation()

  const [setting, setSetting] = useState(null)
  useEffect(() => {
    ;(async () => {
      let settings = {
        notification: participant.unity_settings ?? false,
      }
      setSetting(settings)
    })()
  }, [])

  const saveIndividualUserSettings = async (id, val) => {
    setSetting({ notification: val })
    try {
      LAMP.Type.setAttachment(id, "me", "to.unityhealth.psychiatry.settings", { notification: val }).then((res) => {
        Service.update(
          "participants",
          { participants: [{ id: participant.id, unity_settings: val }] },
          "unity_settings",
          "id"
        )
      })
    } catch (error) {}
  }

  return (
    <Tooltip title={t("Notification")}>
      {setting === undefined || (!!setting && setting?.notification === true) || setting === "" ? (
        <FormControlLabel
          control={
            <Switch
              checked={true}
              onChange={(event) => {
                saveIndividualUserSettings(participant.id, event.target.checked)
              }}
            />
          }
          label=""
          className={classes.switchLabel}
        />
      ) : (
        <FormControlLabel
          control={
            <Switch
              checked={false}
              onChange={(event) => {
                saveIndividualUserSettings(participant.id, event.target.checked)
              }}
            />
          }
          label=""
          className={classes.switchLabel}
        />
      )}
    </Tooltip>
  )
}
