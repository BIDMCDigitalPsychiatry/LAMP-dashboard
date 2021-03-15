// Core Imports
import React, { useState, useEffect, useRef } from "react"
import { Icon, IconButton, TextField, Tooltip, InputAdornment } from "@material-ui/core"
import { useSnackbar } from "notistack"

// Local Imports
import LAMP, { Study } from "lamp-core"
import { useTranslation } from "react-i18next"

// TODO: should be called AliasField??
// TODO: move tag responsibilities out of here when bugs are stabilized

export default function EditStudyField({
  study,
  studyName,
  editData,
  editStudyName,
  updateName,
  onUpdate,
  callbackModal,
  ...props
}: {
  study?: any
  studyName?: any
  editData?: any
  editStudyName?: any
  updateName?: any
  onUpdate?: any
  callbackModal?: any
}) {
  const inputRef = useRef<any>()
  const oldValue = useRef<string>()
  const [editing, setEditing] = useState(false)
  const [editComplete, setEditComplete] = useState(false)
  const [aliasStudyName, setAliasStudyName] = useState<string>()
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation()

  // Load the current alias only upon initialization.
  useEffect(() => {
    let unmounted = false
    if (!!aliasStudyName) return
    let studyname = new Study()
    studyname.name = aliasStudyName
    LAMP.Study.update(study, studyname)
      .then((res: any) =>
        res.error === undefined && typeof res.data === "string" && res.data.length > 0 ? res.data : null
      )
      .then((res) => {
        if (!unmounted) setAliasStudyName((oldValue.current = res))
      })
      .catch((err) =>
        enqueueSnackbar(
          t("Failed to load participantId's alias: errorMessage", {
            participantId: study,
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
    if (!(typeof aliasStudyName === "string" && aliasStudyName !== study)) {
      return
    }
    let studyname = new Study()
    studyname.name = aliasStudyName
    LAMP.Study.update(study, studyname)
      .then((res) => setAliasStudyName((oldValue.current = aliasStudyName)))
      .then((res) => {
        updateName(aliasStudyName === "" ? studyName : aliasStudyName)
        if (aliasStudyName === "")
          enqueueSnackbar(t("Removed study's alias.", { study: study }), {
            variant: "success",
          })
        else
          enqueueSnackbar(
            t("Set participantId's alias to participantName", {
              participantId: study,
              participantName: aliasStudyName,
            }),
            {
              variant: "success",
            }
          )
        callbackModal()
      })
      .catch((err) =>
        enqueueSnackbar(
          t("Failed to change participantId's alias: errorMessage", {
            participantId: study,
            errorMessage: err.message,
          }),
          { variant: "error" }
        )
      ) //}
  }, [editing])

  useEffect(() => {
    if (editData && editStudyName === study && !editComplete) {
      setEditing(true)

      if (!!editing || editData) {
        inputRef.current.focus()
      } else {
        inputRef.current.selectionStart = -1
        inputRef.current.selectionEnd = -1
      }
    }
  }, [editStudyName])

  const updateEditing = () => {
    setEditing(false)
    setEditComplete(true)
    if (!(typeof aliasStudyName === "string" && aliasStudyName !== study)) {
      updateName(aliasStudyName === "" ? studyName : aliasStudyName)
    }
  }
  return (
    <div>
      {editData && editStudyName === study && !editComplete ? (
        <TextField
          inputRef={inputRef}
          variant="outlined"
          margin="dense"
          //disabled={editData && editStudyName === study ? false : true}
          label={t(studyName)}
          value={t(aliasStudyName) || ""}
          onChange={(event) => setAliasStudyName(event.target.value)}
          onClick={(event) => event.stopPropagation()}
          onKeyUp={(event) => event.keyCode === 13 && setEditing(false)}
          onBlur={() => updateEditing()}
          InputLabelProps={{ style: { color: "#000" } }}
          InputProps={{
            style: { color: "#000" },
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title={t("Update Study name. Saving an empty text box will reset this value.")}>
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
      ) : aliasStudyName ? (
        t(aliasStudyName)
      ) : (
        study
      )}
    </div>
  )
}
