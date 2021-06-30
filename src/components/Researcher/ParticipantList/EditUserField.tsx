// Core Imports
import React, { useState, useEffect, useRef } from "react"
import { Icon, IconButton, TextField, Tooltip, InputAdornment } from "@material-ui/core"
import { useSnackbar } from "notistack"

// Local Imports
import LAMP from "lamp-core"
import { useTranslation } from "react-i18next"
import { Service } from "../../DBService/DBService"
// TODO: should be called AliasField??
// TODO: move tag responsibilities out of here when bugs are stabilized

export default function EditUserField({
  participant,
  editData,
  editUserId,
  updateName,
  ...props
}: {
  participant?: any
  editData?: any
  editUserId?: string
  updateName?: Function
}) {
  const inputRef = useRef<any>()
  const oldValue = useRef<string>()
  const [editing, setEditing] = useState(false)
  const [editComplete, setEditComplete] = useState(false)
  const [alias, setAlias] = useState<string>()
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation()

  // Load the current alias only upon initialization.
  useEffect(() => {
    let unmounted = false
    if (!!alias) return
    LAMP.Type.getAttachment(participant.id, "lamp.name")
      .then((res: any) =>
        res.error === undefined && typeof res.data === "string" && res.data?.trim().length > 0 ? res.data : null
      )
      .then((res) => {
        if (!unmounted) setAlias((oldValue.current = res))
      })
      .catch((err) =>
        enqueueSnackbar(
          t("Failed to load participantId's alias: errorMessage", {
            participantId: participant.id,
            errorMessage: err.message,
          }),
          { variant: "error" }
        )
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
    LAMP.Type.setAttachment(participant.id, "me", "lamp.name", alias?.trim() ?? null)
      .then((res) => setAlias((oldValue.current = alias)))
      .then((res) => {
        Service.update("participants", { participants: [{ id: participant.id, name: alias }] }, "name", "id")
        updateName(alias.trim() === "" ? participant.id : alias.trim())
        if (alias.trim() === "")
          enqueueSnackbar(t("Removed participantId's alias.", { participantId: participant.id }), {
            variant: "success",
          })
        else
          enqueueSnackbar(
            t("Set participantId's alias to participantName", {
              participantId: participant.id,
              participantName: alias,
            }),
            {
              variant: "success",
            }
          )
      })
      .catch((err) =>
        enqueueSnackbar(
          t("Failed to change participantId's alias: errorMessage", {
            participantId: participant.id,
            errorMessage: err.message,
          }),
          { variant: "error" }
        )
      )
    if (!editing) setEditComplete(false)
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
  }

  return (
    <div>
      {editData && editUserId === participant.id && !editComplete ? (
        <TextField
          inputRef={inputRef}
          variant="outlined"
          size="small"
          disabled={editData && editUserId === participant.id ? false : true}
          label={participant.id}
          value={alias || ""}
          onChange={(event) => setAlias(event.target.value)}
          onClick={(event) => event.stopPropagation()}
          onKeyUp={(event) => event.keyCode === 13 && setEditing(false)}
          //onBlur={() => updateEditing()}
          InputLabelProps={{ style: { color: "#000" } }}
          InputProps={{
            style: { color: "#000" },
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip
                  title={t(
                    "Create or edit the alias for this Participant ID. Saving an empty text box will reset this value."
                  )}
                >
                  <IconButton
                    edge="end"
                    aria-label="save edit"
                    onClick={updateEditing}
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
        alias?.trim()
      ) : (
        participant.id
      )}
    </div>
  )
}
