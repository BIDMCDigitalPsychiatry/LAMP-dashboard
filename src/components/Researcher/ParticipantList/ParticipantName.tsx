import React, { useState } from "react"
import { Box, IconButton, Grid } from "@material-ui/core"
import CreateIcon from "@material-ui/icons/Create"
import EditUserField from "./EditUserField"

export default function ParticipantName({ participant, name, ...props }) {
  const [editData, setEditData] = useState(false)
  const [editUserId, setEditUserId] = useState("")
  const [aliasName, setAliasName] = useState("")

  const editNameTextField = (id, event) => {
    setEditData(true)
    setEditUserId(id)
  }

  const updateName = (data) => {
    setEditData(false)
    setAliasName(data)
    setEditUserId(undefined)
  }
  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          {editData && participant.id === editUserId ? (
            <EditUserField
              participant={participant}
              editData={editData}
              editUserId={editUserId}
              updateName={updateName}
            />
          ) : aliasName && editUserId === participant.id ? (
            aliasName
          ) : name ? (
            name
          ) : (
            participant.id
          )}
        </Grid>
        <Grid item xs={6}>
          <IconButton onClick={(e) => editNameTextField(participant.id, e)}>
            <CreateIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  )
}
