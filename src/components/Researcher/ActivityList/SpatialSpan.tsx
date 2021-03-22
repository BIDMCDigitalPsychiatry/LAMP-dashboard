import React from "react"
import { Box, Typography, TextField } from "@material-ui/core"
import { useSnackbar } from "notistack"
import { useTranslation } from "react-i18next"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import RatioButton from "./RatioButton"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mL14: {
      marginLeft: "14px",
    },
  })
)

export default function SpatialSpan({ settings, updateSettings, ...props }) {
  const { t } = useTranslation()
  const defaultBubbleCount = [60, 80, 80]
  const defaultBubbleSpeed = [60, 80, 80]
  const defaultIntertrialDuration = 0.5
  const defaultBubbleDuration = 1.0
  const classes = useStyles()

  const numberCommaFormat = (num) => {
    var regex = /^[0-9,\b]+$/
    return regex.test(num)
  }
  return (
    <Box style={{ marginTop: 80 }}>
      <Typography variant="h6">{t("Order of tapping")}:</Typography>
      <Box display="flex" mt={2}>
        <Box>
          <RatioButton
            smallSpace={true}
            title={t("Forward")}
            unable={false}
            color="#618EF7"
            value="Forward"
            checked={!settings?.reverse_tapping ? true : false}
            onChange={() => updateSettings({ ...settings, reverse_tapping: false })}
            labelPlacement="right"
          />
        </Box>
        <Box>
          <RatioButton
            smallSpace={true}
            title={t("Backward")}
            color="#618EF7"
            value="Backward"
            unable={false}
            checked={settings?.reverse_tapping ? true : false}
            onChange={() => updateSettings({ ...settings, reverse_tapping: true })}
            labelPlacement="right"
          />
        </Box>
      </Box>
    </Box>
  )
}
