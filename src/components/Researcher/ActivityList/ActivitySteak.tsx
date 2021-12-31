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

export default function ActivitySteak({ value, onChange, ...props }) {
  const classes = useStyles()
  const { t } = useTranslation()
  const [steak, setSteak] = useState(value?.steak ?? true)
  const [steakTitle, setSteakTitle] = useState(value?.steakTitle ?? "")
  const [steakDesc, setSteakDesc] = useState(value?.steakDesc ?? "")

  useEffect(() => {
    onChange({ steak, steakTitle, steakDesc })
  }, [steak, steakDesc, steakTitle])

  return (
    <Grid item lg={12} md={9} xs={12}>
      <Typography variant="h6">{t("Steak popup settings")}</Typography>
      <Divider classes={{ root: classes.dividerRoot }} />
      <Grid container spacing={2}>
        <Grid item alignItems="center" lg={3} sm={3} xs={12} className={classes.gridFlex}>
          <FormControlLabel
            control={<Switch checked={steak} onChange={() => setSteak(!steak)} name="steak" />}
            label={!!steak ? "Steak popup on" : "Steak popup off"}
          />
        </Grid>
        <Grid item lg={9} sm={9} xs={12}>
          <TextField
            fullWidth
            label={t("Steak title")}
            variant="filled"
            defaultValue={steakTitle}
            onChange={(event) => setSteakTitle(removeExtraSpace(event.target.value))}
            inputProps={{ maxLength: 2500 }}
          />
        </Grid>
        <Grid item lg={12} sm={12} xs={12}>
          <TextField
            fullWidth
            multiline
            label={t("Steak Description")}
            variant="filled"
            rows={2}
            defaultValue={steakDesc}
            onChange={(event) => setSteakDesc(removeExtraSpace(event.target.value))}
            inputProps={{ maxLength: 2500 }}
          />
        </Grid>
      </Grid>
    </Grid>
  )
}
