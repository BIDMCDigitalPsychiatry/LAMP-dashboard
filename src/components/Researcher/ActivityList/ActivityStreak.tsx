import React, { useState, useEffect } from "react"
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
} from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { removeExtraSpace } from "./ActivityHeader"

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

export default function ActivityStreak({ value, onChange, ...props }) {
  const classes = useStyles()
  const { t } = useTranslation()
  const [streak, setStreak] = useState(value?.streak ?? true)
  const [streakTitle, setStreakTitle] = useState(value?.streakTitle ?? "")
  const [streakDesc, setStreakDesc] = useState(value?.streakDesc ?? "")

  useEffect(() => {
    onChange({ streak, streakTitle, streakDesc })
  }, [streak, streakDesc, streakTitle])

  return (
    <Grid item lg={12} md={9} xs={12}>
      <Typography variant="h6">{t("Streak popup settings")}</Typography>
      <Divider classes={{ root: classes.dividerRoot }} />
      <Grid container spacing={2}>
        <Grid item alignItems="center" lg={3} sm={3} xs={12} className={classes.gridFlex}>
          <FormControlLabel
            control={<Switch checked={streak} onChange={() => setStreak(!streak)} name="streak" />}
            label={!!streak ? "Streak popup on" : "Streak popup off"}
          />
        </Grid>
        <Grid item lg={9} sm={9} xs={12}>
          <TextField
            fullWidth
            label={t("Streak title")}
            variant="filled"
            defaultValue={streakTitle}
            disabled={!streak}
            onChange={(event) => setStreakTitle(removeExtraSpace(event.target.value))}
            inputProps={{ maxLength: 2500 }}
          />
        </Grid>
        <Grid item lg={12} sm={12} xs={12}>
          <TextField
            fullWidth
            multiline
            label={t("Streak Description")}
            variant="filled"
            rows={2}
            disabled={!streak}
            defaultValue={streakDesc}
            onChange={(event) => setStreakDesc(removeExtraSpace(event.target.value))}
            inputProps={{ maxLength: 2500 }}
          />
        </Grid>
      </Grid>
    </Grid>
  )
}
