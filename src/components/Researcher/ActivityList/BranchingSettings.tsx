import React, { useState, useEffect } from "react"
import TextField from "@material-ui/core/TextField"
import Grid from "@material-ui/core/Grid"
import Divider from "@material-ui/core/Divider"
import Typography from "@material-ui/core/Typography"
import MenuItem from "@material-ui/core/MenuItem"

import makeStyles from "@material-ui/core/styles/makeStyles"
import createStyles from "@material-ui/core/styles/createStyles"
import { Theme } from "@material-ui/core/styles/createTheme"
import { useTranslation } from "react-i18next"
import { Service } from "../../DBService/DBService"
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuitemsul: {
      width: "100%",
    },
    dividerRoot: { marginTop: 10 },
    marginTop10: { marginTop: "10px" },
    gridFlex: { display: "flex" },
  })
)

export default function BranchingSettings({ ...props }) {
  const { t } = useTranslation()
  const [branchingSettings, setBranchingSettings] = useState(
    props?.branching_settings ? props?.branching_settings : null
  )

  const classes = useStyles()

  useEffect(() => {
    props.onChange(branchingSettings)
  }, [branchingSettings])

  const [enumGrpActivities, setEnumGrpActivities] = useState([])

  useEffect(() => {
    updateActivityList()
  }, [])
  useEffect(() => {
    updateActivityList()
  }, [props.studyId])

  const updateActivityList = () => {
    Service.getAll("activities").then((activities) => {
      setEnumGrpActivities(
        (activities || [])
          .filter(
            (data) => data.study_id == props.studyId && (data.spec === "lamp.group" || data.spec === "lamp.module")
          )
          .map((data) => ({ id: data.id, name: data.name }))
      )
    })
  }

  return (
    <Grid item lg={12} md={12} xs={12}>
      <Typography variant="h6">{`${t("Branching settings")}`}</Typography>
      <Divider classes={{ root: classes.dividerRoot }} />
      <Grid container spacing={2}>
        <Grid item lg={6} sm={6} xs={12}>
          <TextField
            label={`${t("Total Score")}`}
            value={branchingSettings?.total_score?.toString()}
            variant="filled"
            type="number"
            inputProps={{ min: 0 }}
            onChange={(e) => {
              setBranchingSettings({ total_score: parseInt(e.target.value) })
            }}
          />
        </Grid>
        {branchingSettings?.total_score > 0 && (
          <Grid item lg={6} sm={6} xs={12}>
            <TextField
              id="filled-select-currency"
              select
              label={`${t("Activity")}`}
              value={branchingSettings?.activityId}
              onChange={(e) => {
                setBranchingSettings({ ...branchingSettings, activityId: e.target.value })
              }}
              variant="filled"
            >
              {(enumGrpActivities || []).map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {t(option.name)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        )}
      </Grid>
      <Divider classes={{ root: classes.dividerRoot }} />
    </Grid>
  )
}
