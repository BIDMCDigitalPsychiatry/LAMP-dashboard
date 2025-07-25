import React, { useState } from "react"
import { Box, Fab, Icon, makeStyles, Theme, createStyles } from "@material-ui/core"
import { CredentialManager } from "./CredentialManager"
import ResponsiveDialog from "./ResponsiveDialog"
import { useTranslation } from "react-i18next"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: 111111,
      color: "#fff",
    },
    btnWhite: {
      background: "#fff",
      borderRadius: "40px",
      boxShadow: "none",
      cursor: "pointer",
      textTransform: "capitalize",
      fontSize: "14px",
      color: "#7599FF",
      "& svg": { marginRight: 8 },
      "&:hover": { color: "#5680f9", background: "#fff", boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.20)" },
    },
  })
)

export default function Credentials({ user, fromParticipant, ...props }) {
  const classes = useStyles()
  const [openPasswordReset, setOpenPasswordReset] = useState(null)
  const { t } = useTranslation()
  return (
    <Box>
      <Fab size="small" classes={{ root: classes.btnWhite }} onClick={() => setOpenPasswordReset(user.id)}>
        <Icon>vpn_key</Icon>
      </Fab>
      <ResponsiveDialog open={!!openPasswordReset} onClose={() => setOpenPasswordReset(undefined)}>
        {!fromParticipant ? (
          <CredentialManager
            fromParticipant={fromParticipant}
            style={{ margin: 16 }}
            id={openPasswordReset}
            userType={"researcher"}
          />
        ) : (
          <CredentialManager fromParticipant={fromParticipant} style={{ margin: 16 }} id={openPasswordReset} />
        )}
      </ResponsiveDialog>
    </Box>
  )
}
