import React from "react"
import { Box, Grid, Tooltip, Fab, Dialog, makeStyles, createStyles, Icon } from "@material-ui/core"
import { useTranslation } from "react-i18next"
import Messages from "../../../Messages"

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    backdrop: {
      zIndex: 111111,
      color: "#fff",
    },
    padding20: {
      padding: "20px",
    },
    popWidth: { width: "95%", maxWidth: "500px", padding: "0 40px" },
    profileMessage: {
      background: "#7599FF",
      bottom: 30,
      right: 40,
      "&:hover": { background: "#5680f9" },
      "& svg": {
        "& path": { fill: "#fff", fillOpacity: 1 },
      },
    },
  })
)

export default function PatientProfile({ participant, ...props }: { participant: any }) {
  const classes = useStyles()
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const { t } = useTranslation()
  return (
    <Box>
      <Grid item>
        <Tooltip title={t("Messages")} placement="left">
          <Fab className={classes.profileMessage} style={{ position: "fixed" }} onClick={() => setDialogOpen(true)}>
            <Icon style={{ color: "white" }}>comment</Icon>
          </Fab>
        </Tooltip>
      </Grid>

      <Dialog
        classes={{ paper: classes.popWidth }}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="simple-dialog-title"
        open={dialogOpen}
      >
        <div className={classes.padding20}>
          <Messages refresh participant={participant.id} msgOpen={false} participantOnly={false} />
        </div>
      </Dialog>
    </Box>
  )
}
