import React, { useState } from "react"
import { Icon, Fab, makeStyles, Theme, createStyles, FormControlLabel, Checkbox } from "@material-ui/core"
import LAMP from "lamp-core"
import { useSnackbar } from "notistack"
import { useTranslation } from "react-i18next"
import ConfirmationDialog from "../../ConfirmationDialog"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    btnText: {
      background: "transparent",
      borderRadius: "40px",
      minWidth: 100,
      boxShadow: "none",
      cursor: "pointer",
      textTransform: "capitalize",
      paddingLeft: "10px !important",
      paddingRight: "15px !important",
      fontSize: "14px",
      color: "#7599FF",
      "& svg": { marginRight: 8 },
      "&:hover": { color: "#5680f9", background: "#fff" },
      "& span.MuiIcon-root": { fontSize: 20, marginRight: 3 },
      [theme.breakpoints.up("md")]: {
        //position: "absolute",
      },
    },
  })
)
export default function ToggleFeed({ participants, setParticipants, ...props }) {
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation()
  const classes = useStyles()
  const [confirmationDialog, setConfirmationDialog] = useState(0)
  const [showFeed, setShowFeed] = useState(false)

  let updateParticipants = async (status) => {
    if (status === "Yes") {
      for (let participant of participants) {
        await LAMP.Type.setAttachment(participant.id, "me", "lamp.show_feed", showFeed)
      }
      enqueueSnackbar(`${t("Successfully updated the selected participants.")}`, {
        variant: "success",
      })
    }
    setConfirmationDialog(0)
  }
  return (
    <span>
      <FormControlLabel
        control={
          <Checkbox
            checked={showFeed}
            onChange={() => {
              setShowFeed(!showFeed)
            }}
            name="showFeed"
            color="primary"
          />
        }
        label={`${t("Show scheduled activities in the selected participant feed?")}`}
      />
      <Fab
        variant="extended"
        size="small"
        classes={{ root: classes.btnText }}
        onClick={(event) => setConfirmationDialog(8)}
      >
        <Icon>cached_outlined</Icon>
        {`${t("Update")}`}
      </Fab>
      <ConfirmationDialog
        confirmationDialog={confirmationDialog}
        open={confirmationDialog > 0 ? true : false}
        onClose={() => setConfirmationDialog(0)}
        confirmAction={updateParticipants}
        confirmationMsg={`${t("Are you sure you want to update this Participant(s)?")}`}
      />
    </span>
  )
}
