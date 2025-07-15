import React, { useState } from "react"
import Link from "@material-ui/core/Link"
import Icon from "@material-ui/core/Icon"
import Box from "@material-ui/core/Box"
import Dialog from "@material-ui/core/Dialog"
import DialogContent from "@material-ui/core/DialogContent"
import { makeStyles, createStyles } from "@material-ui/core/styles"
import { CredentialManager } from "../../../CredentialManager"
import { useTranslation } from "react-i18next"

const useStyles = makeStyles((theme) =>
  createStyles({
    linkBtn: {
      color: "#6083E7",
      fontSize: 14,
      fontWeight: 500,
      "& svg": { marginRight: 15 },
      "& span": { lineHeight: "1.5", marginRight: "2px" },
    },
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
        {`${t("Reset account password")}`}
      </Link>
      <Dialog open={showCredentials} onClose={() => setShowCredentials(false)}>
        <DialogContent style={{ marginBottom: 12 }}>
          <CredentialManager id={participant.id} fromParticipant={true} style={{ margin: 16 }} />
        </DialogContent>
      </Dialog>
    </Box>
  )
}
