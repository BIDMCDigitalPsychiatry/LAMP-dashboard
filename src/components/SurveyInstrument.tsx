// Core Imports
import React, { useState, useEffect } from "react"
import {
  makeStyles,
  Box,
  Grid,
  Drawer,
  Fab,
  Tooltip,
  Icon,
  Backdrop,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton,
} from "@material-ui/core"
import LAMP, { Participant as ParticipantObj } from "lamp-core"
import { spliceActivity } from "./Researcher/ActivityList/ActivityMethods"
import { useSnackbar } from "notistack"
import Messages from "./Messages"
import { useTranslation } from "react-i18next"
import EmbeddedActivity from "./EmbeddedActivity"

const useStyles = makeStyles((theme) => ({
  chatDrawerCustom: { minWidth: 411 },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  toolbardashboard: {
    minHeight: 65,
    padding: "0 10px",
    "& h5": {
      color: "rgba(0, 0, 0, 0.75)",
      textAlign: "center",
      fontWeight: "600",
      fontSize: 18,
      width: "calc(100% - 96px)",
    },
  },
}))
// Splice together all selected activities & their tags.
async function getSplicedSurveys(activities) {
  let res = await Promise.all(activities.map((x) => LAMP.Type.getAttachment(x.id, "lamp.dashboard.survey_description")))
  let spliced = res.map((y: any, idx) =>
    spliceActivity({
      raw: activities[idx],
      tag: !!y.error ? undefined : y.data,
    })
  )
  // Short-circuit the main title & description if there's only one survey.
  const main = {
    name: spliced.length === 1 ? spliced[0].name : "Multi-questionnaire",
    description: spliced.length === 1 ? spliced[0].description : "Please complete all sections below. Thank you.",
  }
  if (spliced.length === 1) spliced[0].name = spliced[0].description = undefined
  return {
    name: main.name,
    description: main.description,
    sections: spliced,
  }
}

function _patientMode() {
  return LAMP.Auth._type === "participant"
}

export default function SurveyInstrument({ group, onComplete, type, fromPrevent, participant, ...props }) {
  const [survey, setSurvey] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const classes = useStyles()
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()

  useEffect(() => {
    if (group.length === 0) return setSurvey(undefined)
    getSplicedSurveys(group).then((spliced) => {
      setSurvey({
        ...spliced,
        prefillData: !_patientMode() ? group[0].prefillData : undefined,
        prefillTimestamp: !_patientMode() ? group[0].prefillTimestamp : undefined,
        partialValidationOnly: false,
        validate: true,
        toolBarBack: fromPrevent,
        type: type,
        spec: "lamp.survey",
        id: group[0].id,
      })
    })
    setTimeout(() => {
      setLoading(false)
    }, 2500)
  }, [group])

  return (
    <Grid container direction="row">
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid item style={{ width: "100%" }}>
        {survey !== null && (
          <EmbeddedActivity
            name={survey?.name ?? ""}
            activity={survey ?? []}
            participant={participant}
            onComplete={onComplete}
          />
        )}
      </Grid>
      {fromPrevent && (
        <Grid item>
          <Drawer
            anchor="right"
            variant="temporary"
            classes={{
              paperAnchorRight: classes.chatDrawerCustom, // class name, e.g. `classes-nesting-label-x`
            }}
            open={!!sidebarOpen}
            onClose={() => setSidebarOpen(undefined)}
          >
            <Box flexGrow={1} />
            <Messages refresh={!!survey} expandHeight privateOnly participant={participant.id} msgOpen={true} />
          </Drawer>
          <Tooltip title={t("Patient Notes")} placement="left">
            <Fab
              color="primary"
              aria-label="Patient Notes"
              style={{ position: "fixed", bottom: 85, right: 24 }}
              onClick={() => setSidebarOpen(true)}
            >
              <Icon>note_add</Icon>
            </Fab>
          </Tooltip>
        </Grid>
      )}
    </Grid>
  )
}
