import React, { useState } from "react"
import { Box, MenuItem } from "@material-ui/core"

// Local Imports
import LAMP from "lamp-core"
import { CredentialManager } from "../../CredentialManager"
import ResponsiveDialog from "../../ResponsiveDialog"
import { makeStyles, Theme, createStyles, createMuiTheme } from "@material-ui/core/styles"
import { useTranslation } from "react-i18next"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: 111111,
      color: "#fff",
    },
  })
)

export default function Credentials({ participant, ...props }) {
  const classes = useStyles()
  const [openPasswordReset, setOpenPasswordReset] = useState(null)
  const { t } = useTranslation()

  return (
    <Box>
      <MenuItem onClick={() => setOpenPasswordReset(participant.id)}>{t("Edit Credentials")}</MenuItem>

      <ResponsiveDialog transient open={!!openPasswordReset} onClose={() => setOpenPasswordReset(undefined)}>
        <CredentialManager style={{ margin: 16 }} id={openPasswordReset} />
      </ResponsiveDialog>
    </Box>
  )
}
