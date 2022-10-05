// Core Imports
import React from "react"
import { Typography, Grid, Card, Box, makeStyles, Theme, createStyles } from "@material-ui/core"
import { Participant as ParticipantObj } from "lamp-core"
import { useTranslation } from "react-i18next"
import { Vega } from "react-vega"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    inlineHeader: {
      background: "#FFFFFF",
      boxShadow: "none",
      "& h5": { fontSize: 25, color: "rgba(0, 0, 0, 0.75)", fontWeight: 600 },
    },
    vega: {
      "& .vega-embed": {
        width: "100%",
        paddingRight: "0 !important",
        "& summary": { top: "-25px" },
        "& .vega-actions": { top: "15px" },
      },
      "& canvas": { width: "100% !important", height: "auto !important" },
    },
    preventlabel: {
      fontSize: 16,
      minHeight: 48,
      padding: "0 0 0 15px",
      marginTop: 8,
      width: "100%",
      textAlign: "left",
      "& span": { color: "#618EF7" },
    },
    automation: {
      padding: "15px 0px 30px",
      boxShadow: "none",
      border: "#ccc solid 1px",
      "& h6": { fontSize: 16, textAlign: "center", marginBottom: 20 },
    },
  })
)

export default function PreventSelectedExperimental({
  participant,
  selectedExperimental,
  visualizations,
  ...props
}: {
  participant: ParticipantObj
  selectedExperimental: any
  visualizations: any
}) {
  const classes = useStyles()
  const { t, i18n } = useTranslation()

  return (
    <React.Fragment>
      {(selectedExperimental || []).map((x) => (
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Card key={x} className={classes.automation}>
            <Typography component="h6" variant="h6">
              {x}
            </Typography>
            <Grid container justifyContent="center">
              {typeof visualizations["lamp.dashboard.experimental." + x] === "object" &&
                visualizations["lamp.dashboard.experimental." + x] !== null && (
                  <Box className={classes.vega}>
                    <Vega spec={visualizations["lamp.dashboard.experimental." + x]} />
                  </Box>
                )}
            </Grid>
          </Card>
        </Grid>
      ))}
    </React.Fragment>
  )
}
