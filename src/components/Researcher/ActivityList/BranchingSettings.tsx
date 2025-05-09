import React, { useState, useCallback, useEffect } from "react"
import {
  TextField,
  makeStyles,
  createStyles,
  Theme,
  Switch,
  FormControlLabel,
  Grid,
  Divider,
  Typography,
  ButtonBase,
  Icon,
  Tooltip,
  Box,
  MenuItem,
} from "@material-ui/core"
import { useSnackbar } from "notistack"
import Jewels from "../../../icons/VisualPopup/Jewels.svg"
import Maze from "../../../icons/VisualPopup/Maze.svg"
import SpatialSpan from "../../../icons/VisualPopup/SpatialSpan.svg"
import SpinWheel from "../../../icons/VisualPopup/SpinWheel.svg"
import Symbol_Digit from "../../../icons/VisualPopup/Symbol_Digit.svg"
import { useTranslation } from "react-i18next"
import { useDropzone } from "react-dropzone"
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
    Service.getAll("activities").then((activities) => {
      setEnumGrpActivities(
        (activities || [])
          .filter((data) => data.spec === "lamp.group" || data.spec === "lamp.module")
          .map((data) => ({ id: data.id, name: data.name }))
      )
    })
  }, [])

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
