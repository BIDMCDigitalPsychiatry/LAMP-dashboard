import React, { useState } from "react"
import { Link, Icon, Box, Dialog, DialogContent } from "@material-ui/core"
import { makeStyles, createStyles } from "@material-ui/core/styles"
import { CredentialManager, CredentialEditor, updateDetails } from "../../../CredentialManager"

const useStyles = makeStyles((theme) =>
  createStyles({
    linkBtn: { color: "#6083E7", fontSize: 14, fontWeight: 500, "& svg": { marginRight: 15 } },
  })
)

export default function UpdateCredential({ participant, allRoles, ext, ...props }) {
  const [showCredentials, setShowCredentials] = useState(false)
  const classes = useStyles()
  return (
    <Box>
      <Link
        onClick={() => {
          setShowCredentials(true)
        }}
        className={classes.linkBtn}
      >
        <Icon>key</Icon>
        Reset account password
      </Link>
      <Dialog open={showCredentials} onClose={() => setShowCredentials(false)}>
        <DialogContent style={{ marginBottom: 12 }}>
          <CredentialManager id={participant.id} style={{ margin: 16 }} />
        </DialogContent>
      </Dialog>
    </Box>
  )
}
