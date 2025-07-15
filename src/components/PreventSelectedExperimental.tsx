// Core Imports
import React from "react"
import Typography from "@material-ui/core/Typography"
import Grid from "@material-ui/core/Grid"
import Card from "@material-ui/core/Card"
import Box from "@material-ui/core/Box"
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles"
import { Participant as ParticipantObj } from "lamp-core"
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

  return (
    <React.Fragment>
      {(selectedExperimental || []).map((experimentalKey) => {
        let visualizationKey = experimentalKey
        if (!visualizationKey.startsWith("lamp.dashboard.experimental.")) {
          visualizationKey = "lamp.dashboard.experimental." + visualizationKey
        }

        const visualization = visualizations[visualizationKey]
        if (typeof visualization === "object" && visualization !== null) {
          return (
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Card key={experimentalKey} className={classes.automation}>
                <Typography component="h6" variant="h6">
                  {experimentalKey}
                </Typography>
                <Grid container justifyContent="center">
                  <Box className={classes.vega}>
                    <Vega spec={visualization} />
                  </Box>
                </Grid>
              </Card>
            </Grid>
          )
        }

        return <></>
      })}
    </React.Fragment>
  )
}
