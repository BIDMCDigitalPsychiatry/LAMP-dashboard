// Core Imports
import React, { useState, useEffect, useRef } from "react"
import { Icon, IconButton, TextField, Tooltip, InputAdornment } from "@material-ui/core"
import { useSnackbar } from "notistack"

// Local Imports
import LAMP from "lamp-core"

// TODO: should be called AliasField??
// TODO: move tag responsibilities out of here when bugs are stabilized

export default function EditUserField({
  participant,
  editData,
  editUserId,
  updateName,
  onUpdate,
  ...props
}: {
  participant?: any
  editData?: any
  editUserId?: any
  updateName?: any
  onUpdate?: any
}) {
  const inputRef = useRef<any>()
  const oldValue = useRef<string>()
  const [editing, setEditing] = useState(false)
  const [editComplete, setEditComplete] = useState(false)
  const [alias, setAlias] = useState<string>()
  const { enqueueSnackbar } = useSnackbar()

  // Load the current alias only upon initialization.
  useEffect(() => {
    let unmounted = false
    if (!!alias) return
    LAMP.Type.getAttachment(participant.id, "lamp.name")
      .then((res: any) =>
        res.error === undefined && typeof res.data === "string" && res.data.length > 0 ? res.data : null
      )
      .then((res) => {
        if (!unmounted) setAlias((oldValue.current = res))
      })
      .catch((err) =>
        enqueueSnackbar(`Failed to load ${participant.id}'s alias: '${err.message}'`, { variant: "error" })
      )
    return () => {
      unmounted = true
    }
  }, [])

  // Update the tag when editing ends (not continuously).
  useEffect(() => {
    if (!(typeof alias === "string" && alias !== participant.id)) {
      return
    }
    LAMP.Type.setAttachment(participant.id, "me", "lamp.name", alias ?? null)
      .then((res) => setAlias((oldValue.current = alias)))
      .then((res) => {
        updateName(alias === "" ? participant.id : alias)
        if (alias === "")
          enqueueSnackbar(`Removed ${participant.id}'s alias.`, {
            variant: "success",
          })
        else
          enqueueSnackbar(`Set ${participant.id}'s alias to '${alias}'.`, {
            variant: "success",
          })
      })
      .catch((err) =>
        enqueueSnackbar(`Failed to change ${participant.id}'s alias: '${err.message}'`, { variant: "error" })
      )
  }, [editing])

  useEffect(() => {
    if (editData && editUserId === participant.id && !editComplete) {
      setEditing(true)

      if (!!editing || editData) {
        inputRef.current.focus()
      } else {
        inputRef.current.selectionStart = -1
        inputRef.current.selectionEnd = -1
      }
    }
  }, [editUserId])

  const updateEditing = () => {
    setEditing(false)
    setEditComplete(true)
    if (!(typeof alias === "string" && alias !== participant.id)) {
      updateName(alias === "" ? participant.id : alias)
    }
  }

  return (
    <div>
      {editData && editUserId === participant.id && !editComplete ? (
        <TextField
          inputRef={inputRef}
          variant="outlined"
          margin="dense"
          disabled={editData && editUserId === participant.id ? false : true}
          label={participant.id}
          value={alias || ""}
          onChange={(event) => setAlias(event.target.value)}
          onClick={(event) => event.stopPropagation()}
          onKeyUp={(event) => event.keyCode === 13 && setEditing(false)}
          onBlur={() => updateEditing()}
          InputLabelProps={{ style: { color: "#000" } }}
          InputProps={{
            style: { color: "#000" },
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Create or edit the alias for this Participant ID. Saving an empty text box will reset this value.">
                  <IconButton
                    edge="end"
                    aria-label="save edit"
                    onClick={() => updateEditing()}
                    onMouseDown={(event) => event.preventDefault()}
                  >
                    <Icon fontSize="small">{editing ? "check" : ""}</Icon>
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
        />
      ) : alias ? (
        alias
      ) : (
        participant.id
      )}
    </div>
  )
}
