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
  const [credential, setCredential] = useState(null)
  const [mode, setMode] = useState(null)
  const [showCredentials, setShowCredentials] = useState(false)

  const classes = useStyles()
  return (
    <Box>
      <Link
        onClick={() => {
          setMode(undefined)
          setCredential(undefined)
          setShowCredentials(true)
        }}
        className={classes.linkBtn}
      >
        <Icon>key</Icon>
        Reset account password
      </Link>
      <Dialog open={showCredentials} onClose={() => setShowCredentials(false)}>
        <DialogContent style={{ marginBottom: 12 }}>
          {!!mode ? (
            <CredentialEditor
              credential={credential}
              auxData={allRoles[(credential || {}).access_key] || {}}
              mode={mode}
              onChange={(data) => {
                ;(async () => {
                  let type = ext.includes(data.emailAddress) ? 1 : 2
                  await updateDetails(participant.id, data, mode, allRoles, type)
                  //   onChangeAccounts()
                })()
              }}
            />
          ) : (
            <CredentialManager id={participant.id} style={{ margin: 16 }} />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  )
}
