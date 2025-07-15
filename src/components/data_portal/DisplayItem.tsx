import React from "react"
import Typography from "@material-ui/core/Typography"
import { useTranslation } from "react-i18next"

export default function DisplayItem({ ...props }) {
  const { t } = useTranslation()
  return <Typography>{`${t("Set the 'children' prop to display elements")}`}</Typography>
}
