import React, { useEffect } from "react"
import QRCode from "qrcode.react"
import { Grid, Tooltip, TextField, Box } from "@material-ui/core"
import SnackMessage from "../../SnackMessage"
import LAMP from "lamp-core"
import { useTranslation } from "react-i18next"
import { useSnackbar } from "notistack"

const _qrLink = (credID, password) =>
  window.location.href.split("#")[0] +
  "#/?a=" +
  btoa([credID, password, LAMP.Auth._auth.serverAddress].filter((x) => !!x).join(":"))

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
          t("Successfully created Participant id. Tap the expand icon on the right to see credentials and details.", {
            id: id,
          }),
          {
            variant: "success",
            persist: true,
            content: (key: string, message: string) => (
              <SnackMessage id={key} message={message}>
                <TextField
                  variant="outlined"
                  size="small"
                  label={t("Temporary email address")}
                  value={`${id}@lamp.com`}
                />
                <Box style={{ height: 16 }} />
                <TextField variant="outlined" size="small" label={t("Temporary password")} value={`${id}`} />
                <Grid item>
                  <TextField
                    fullWidth
                    label={t("One-time login link")}
                    style={{ marginTop: 16 }}
                    variant="outlined"
                    value={_qrLink(`${id}@lamp.com`, id)}
                    onChange={(event) => {}}
                  />
                  <Tooltip title={t("Scan this QR code on a mobile device to automatically open a user dashboard.")}>
                    <Grid container justify="center" style={{ padding: 16 }}>
                      <QRCode size={256} level="H" value={_qrLink(`${id}@lamp.com`, id)} />
                    </Grid>
                  </Tooltip>
                </Grid>
              </SnackMessage>
            ),
          }
        )}
    </React.Fragment>
  )
}
