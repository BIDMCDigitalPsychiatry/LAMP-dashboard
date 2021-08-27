import React, { useState } from "react"
import { Link, Icon, Box, Dialog, DialogContent, makeStyles, createStyles } from "@material-ui/core"
import { CredentialManager, CredentialEditor, updateDetails } from "../../../CredentialManager"
import { useTranslation } from "react-i18next"

const useStyles = makeStyles((theme) =>
  createStyles({
    linkBtn: { color: "#6083E7", fontSize: 14, fontWeight: 500, "& svg": { marginRight: 15 } },
  })
)

export default function UpdateCredential({ participant, allRoles, ext, ...props }) {
  const [showCredentials, setShowCredentials] = useState(false)
  const classes = useStyles()
  const { t } = useTranslation()

  return (
    <Box>
      <Link
        onClick={() => {
          setShowCredentials(true)
        }}
        className={classes.linkBtn}
      >
        <Icon>key</Icon>
        {t("Reset account password")}
      </Link>
      <Dialog open={showCredentials} onClose={() => setShowCredentials(false)}>
        <DialogContent style={{ marginBottom: 12 }}>
          <CredentialManager id={participant.id} style={{ margin: 16 }} />
        </DialogContent>
      </Dialog>
    </Box>
  )
}
