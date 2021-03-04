import React, { useState } from "react"
import { Box, IconButton, Grid } from "@material-ui/core"
import CreateIcon from "@material-ui/icons/Create"
import EditUserField from "./EditUserField"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    editBtn: {
      marginTop: "-2px",
      marginLeft: "5px",
      "&:hover": { color: "#7599FF", background: "transparent" },
      "& svg": { width: "20px", height: "20px" },
    },
  })
)
export default function ParticipantName({ participant, ...props }) {
  const classes = useStyles()
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
  }
  return (
    <Box display="flex">
      <Box>
        {editData && participant.id === editUserId ? (
          <EditUserField
            participant={participant}
            editData={editData}
            editUserId={editUserId}
            updateName={updateName}
          />
        ) : aliasName && editUserId === participant.id ? (
          aliasName
        ) : participant.name ? (
          participant.name
        ) : (
          participant.id
        )}
      </Box>
      <Box flexGrow={1}>
        <IconButton className={classes.editBtn} size="small" onClick={(e) => editNameTextField(participant.id, e)}>
          <CreateIcon />
        </IconButton>
      </Box>
    </Box>
  )
}
