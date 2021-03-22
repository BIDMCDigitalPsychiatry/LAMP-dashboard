import React, { useState, useEffect, useRef } from "react"
import { Icon, IconButton, TextField, Tooltip, InputAdornment } from "@material-ui/core"
import { useSnackbar } from "notistack"
import LAMP, { Study } from "lamp-core"
import { useTranslation } from "react-i18next"
import { Service } from "../../DBService/DBService"

export default function EditStudyField({
  study,
  studyName,
  editData,
  editStudyName,
  updateName,
  onUpdate,
  callbackModal,
  allStudies,
  ...props
}: {
  study?: any
  studyName?: any
  editData?: any
  editStudyName?: any
  updateName?: any
  onUpdate?: any
  callbackModal?: any
  allStudies?: any
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
        if (!unmounted) {
          setAliasStudyName((oldValue.current = res))
        }
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
    Service.update("studies", { studies: [{ id: study, name: aliasStudyName }] }, "name", "id")
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
  const validate = (val) => {
    let studyDuplicateCount = allStudies.filter(
      (studyItem) => studyItem.name?.trim().toLowerCase() === val?.trim().toLowerCase() && studyItem.id !== study
    ).length
    let status = true
    if (studyDuplicateCount > 0) {
      enqueueSnackbar(
        t("Failed to change participantId's alias: Study name already exist", {
          participantId: study,
        }),
        { variant: "error" }
      )
      status = false
    } else if (val?.trim().length === 0) {
      enqueueSnackbar(
        t("Failed to change participantId's alias: Study name required", {
          participantId: study,
        }),
        { variant: "error" }
      )
      status = false
    }
    return status
  }

  return (
    <div>
      {editData && editStudyName === study && !editComplete ? (
        <TextField
          inputRef={inputRef}
          variant="outlined"
          margin="dense"
          label={t(studyName)}
          value={t(aliasStudyName) || ""}
          onChange={(event) => {
            setAliasStudyName(event.target.value)
          }}
          onClick={(event) => event.stopPropagation()}
          onKeyUp={(event) => event.keyCode === 13 && setEditing(false)}
          onBlur={() => {
            if (validate(aliasStudyName)) updateEditing()
          }}
          InputLabelProps={{ style: { color: "#000" } }}
          InputProps={{
            style: { color: "#000" },
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title={t("Update Study name. Saving an empty text box will reset this value.")}>
                  <IconButton
                    edge="end"
                    aria-label="save edit"
                    onClick={() => {
                      if (validate(aliasStudyName)) updateEditing()
                    }}
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
