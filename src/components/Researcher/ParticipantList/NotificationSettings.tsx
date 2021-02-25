// Core Imports
import React, { useState, useEffect } from "react"
import { Tooltip, Switch, FormControlLabel } from "@material-ui/core"

import LAMP from "lamp-core"
import { makeStyles } from "@material-ui/core/styles"
import { useTranslation } from "react-i18next"

const useStyles = makeStyles((theme) => ({
  dataQuality: {
    margin: "4px 0",
    backgroundColor: "#E9F8E7",
    color: "#FFF",
  },
  switchLabel: { color: "#4C66D6" },
}))

export default function NotificationSettings({ participantId, ...props }) {
  const classes = useStyles()
  const { t } = useTranslation()

  const [setting, setSetting] = useState(null)
  useEffect(() => {
    ;(async () => {
      let settings = ((await LAMP.Type.getAttachment(participantId, "to.unityhealth.psychiatry.settings")) as any)
        .data ?? {
        notification: true,
      }
      setSetting(settings)
    })()
  }, [])

  const saveIndividualUserSettings = async (id, val) => {
    setSetting({ notification: val })
    try {
      await LAMP.Type.setAttachment(id, "me", "to.unityhealth.psychiatry.settings", { notification: val })
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
                saveIndividualUserSettings(participantId, event.target.checked)
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
                saveIndividualUserSettings(participantId, event.target.checked)
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
