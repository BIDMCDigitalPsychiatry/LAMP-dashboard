import React from "react"
import { Grid, Tooltip, Icon, Fab } from "@material-ui/core"
import { useTranslation } from "react-i18next"

export default function ActivityFooter({ value, onSave, validate, data, ...props }) {
  const { t } = useTranslation()

  return (
    <Grid
      container
      direction="column"
      alignItems="flex-end"
      spacing={1}
      style={{ position: "fixed", bottom: 24, right: 24, width: "auto" }}
    >
      {!!value && (
        <Grid item>
          <Tooltip title={t("Duplicate this activity and save it with a new title.")}>
            <Fab
              color="primary"
              aria-label="Duplicate"
              variant="extended"
              onClick={() => {
                if (validate()) {
                  onSave(data, true /* duplicate */)
                }
              }}
              disabled={
                !validate() || !onSave || (value.name.trim() === data.name.trim() && value.study_id === data.studyId)
              }
            >
              {t("Duplicate")}
              <span style={{ width: 8 }} />
              <Icon>file_copy</Icon>
            </Fab>
          </Tooltip>
        </Grid>
      )}
      <Grid item>
        <Tooltip title={t("Save this activity.")}>
          <Fab
            color="secondary"
            aria-label="Save"
            variant="extended"
            onClick={() => {
              if (validate()) {
                onSave(data, false /* overwrite */)
              }
            }}
            disabled={!validate() || !onSave || !data.name}
          >
            {t("Save")}
            <span style={{ width: 8 }} />
            <Icon>save</Icon>
          </Fab>
        </Tooltip>
      </Grid>
    </Grid>
  )
}
