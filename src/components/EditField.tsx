// Core Imports
import React, { useState, useEffect, useRef } from "react"
import { Icon, IconButton, TextField, Tooltip, InputAdornment } from "@material-ui/core"
import { useSnackbar } from "notistack"

// Local Imports
import LAMP from "lamp-core"

// TODO: should be called AliasField??
// TODO: move tag responsibilities out of here when bugs are stabilized

export default function EditField({ participant, onUpdate, ...props }: { participant?: any; onUpdate?: any }) {
  const inputRef = useRef<any>()
  const oldValue = useRef<string>()
  const [editing, setEditing] = useState(false)
  const [alias, setAlias] = useState<string>()
  const { enqueueSnackbar } = useSnackbar()

  // Load the current alias only upon initialization.
  useEffect(() => {
    if (!!alias) return
    LAMP.Type.getAttachment(participant.id, "lamp.name")
      .then((res: any) =>
        res.error === undefined && typeof res.data === "string" && res.data.length > 0 ? res.data : null
      )
      .then((res) => setAlias((oldValue.current = res)))
      .catch((err) =>
        enqueueSnackbar(`Failed to load ${participant.id}'s alias: '${err.message}'`, { variant: "error" })
      )
  }, [])

  // Update the tag when editing ends (not continuously).
  useEffect(() => {
    if (!(typeof alias === "string" && alias !== participant.id && alias !== oldValue.current)) return

    LAMP.Type.setAttachment(participant.id, "me", "lamp.name", alias ?? null)
      .then((res) => setAlias((oldValue.current = alias)))
      .then((res) => {
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

  // Ensure clearing selection & setting focus when changing editing state.
  useEffect(() => {
    if (!!editing) {
      inputRef.current.focus()
    } else {
      inputRef.current.selectionStart = -1
      inputRef.current.selectionEnd = -1
    }
  }, [editing])

  return (
    <TextField
      inputRef={inputRef}
      variant="outlined"
      margin="dense"
      disabled={!editing}
      label={participant.id}
      value={alias || ""}
      onChange={(event) => setAlias(event.target.value)}
      onClick={(event) => event.stopPropagation()}
      onKeyUp={(event) => event.keyCode === 13 && setEditing(false)}
      onBlur={(event) => !!editing && setEditing(false)}
      InputLabelProps={{ style: { color: "#000" } }}
      InputProps={{
        style: { color: "#000" },
        endAdornment: (
          <InputAdornment position="end">
            <Tooltip title="Create or edit the alias for this Participant ID. Saving an empty text box will reset this value.">
              <IconButton
                edge="end"
                aria-label="save edit"
                onClick={() => setEditing((editing) => !editing)}
                onMouseDown={(event) => event.preventDefault()}
              >
                <Icon fontSize="small">{editing ? "check" : "edit"}</Icon>
              </IconButton>
            </Tooltip>
          </InputAdornment>
        ),
      }}
    />
  )
}