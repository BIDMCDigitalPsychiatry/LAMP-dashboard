import React, { useEffect } from "react"
import { TextField, Box } from "@material-ui/core"
import SnackMessage from "../../SnackMessage"
import { useTranslation } from "react-i18next"
import { useSnackbar } from "notistack"

export default function NewPatientDetail({ id, ...props }: { id: string }) {
  const { t } = useTranslation()
  const { enqueueSnackbar } = useSnackbar()
  const [shown, setShown] = React.useState(false)

  useEffect(() => {
    setShown(true)
  }, [id])

  return (
    <React.Fragment>
      {!shown &&
        enqueueSnackbar(
          `${t(
            "Successfully created Participant id. Tap the expand icon on the right to see credentials and details.",
            {
              id: id,
            }
          )}`,
          {
            variant: "success",
            persist: true,
            content: (key: string, message: string) => (
              <SnackMessage id={key} message={message}>
                <TextField
                  variant="outlined"
                  size="small"
                  label={`${t("Temporary email address")}`}
                  value={`${id}@digitalpsych.org`}
                />
                <Box style={{ height: 16 }} />
                <TextField variant="outlined" size="small" label={`${t("Temporary password")}`} value={`${id}`} />
              </SnackMessage>
            ),
          }
        )}
    </React.Fragment>
  )
}
