import React, { useState, useEffect } from "react"
import { Grid, Tooltip, Icon, Fab } from "@material-ui/core"
import { useTranslation } from "react-i18next"

export default function TipFooter({
  activities,
  isError,
  isDuplicate,
  duplicateTipText,
  validate,
  handleType,
  ...props
}) {
  const { t } = useTranslation()

  return (
    <Grid
      container
      direction="column"
      alignItems="flex-end"
      spacing={1}
      style={{ position: "fixed", bottom: 24, right: 24, width: "auto" }}
    >
      {!!activities ? (
        <Grid item>
          <Tooltip title={t("Duplicate this activity.")}>
            <span>
              <Fab
                color="secondary"
                aria-label="Duplicate"
                variant="extended"
                onClick={() => {
                  if (validate()) handleType(1)
                }}
                disabled={
                  !isError || (activities && !isDuplicate) || duplicateTipText === null || duplicateTipText === ""
                }
              >
                {t("Duplicate")}
                <span style={{ width: 8 }} />
                <Icon>save</Icon>
              </Fab>
            </span>
          </Tooltip>
        </Grid>
      ) : (
        ""
      )}
      <Grid item>
        <Tooltip title={t("Save this activity.")}>
          <span>
            <Fab
              color="secondary"
              aria-label="Save"
              variant="extended"
              onClick={() => {
                if (validate()) handleType(2)
              }}
              disabled={!isError}
            >
              {t("Save")}
              <span style={{ width: 8 }} />
              <Icon>save</Icon>
            </Fab>
          </span>
        </Tooltip>
      </Grid>
    </Grid>
  )
}
