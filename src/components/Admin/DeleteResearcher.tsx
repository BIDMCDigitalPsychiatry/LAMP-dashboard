import React, { useState } from "react"
import { Icon, Fab, makeStyles, Theme, createStyles } from "@material-ui/core"
import LAMP, { Researcher } from "lamp-core"
import { useSnackbar } from "notistack"
import { useTranslation } from "react-i18next"
import ConfirmationDialog from "../ConfirmationDialog"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    btnWhite: {
      background: "#fff",
      borderRadius: "40px",
      boxShadow: "none",
      cursor: "pointer",
      textTransform: "capitalize",
      fontSize: "14px",
      color: "#7599FF",
      "& svg": { marginRight: 8 },
      "&:hover": { color: "#5680f9", background: "#fff", boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.20)" },
    },
  })
)

export default function DeleteResearcher({
  researcher,
  refreshResearchers,
  ...props
}: {
  researcher: Researcher
  refreshResearchers: Function
}) {
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation()
  const classes = useStyles()
  const [confirmationDialog, setConfirmationDialog] = useState(0)

  const confirmAction = async (status) => {
    if (status === "Yes") {
      if (((await LAMP.Researcher.delete(researcher.id)) as any).error === undefined) {
        LAMP.Credential.list(researcher.id).then((cred) => {
          cred = cred.filter((c) => c.hasOwnProperty("origin"))
          cred.map((each) => {
            LAMP.Credential.delete(researcher.id, each["access_key"])
          })
        })
        enqueueSnackbar(`${t("Successfully deleted the investigator.")}`, {
          variant: "success",
        })
        refreshResearchers()
      } else {
        enqueueSnackbar(`${t("Failed to delete the investigator.")}`, {
          variant: "error",
        })
      }
    }
    setConfirmationDialog(0)
  }

  return (
    <span>
      <Fab size="small" classes={{ root: classes.btnWhite }} onClick={(event) => setConfirmationDialog(6)}>
        <Icon>delete_outline</Icon>
      </Fab>
      <ConfirmationDialog
        confirmationDialog={confirmationDialog}
        open={confirmationDialog > 0 ? true : false}
        onClose={() => setConfirmationDialog(0)}
        confirmAction={confirmAction}
        confirmationMsg={`Are you sure you want to delete this investigator(s)?.`}
      />
    </span>
  )
}
