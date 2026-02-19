import { Box, Grid, Typography, Fab } from "@material-ui/core"
import React, { useRef } from "react"
import LoginFrame from "./components/LoginFrame"
import LAMP from "lamp-core"
import { useSnackbar } from "notistack"

export function LinkAccount(props) {
  const { enqueueSnackbar } = useSnackbar()

  // Display error messages only once
  const errorMessageEnqueued = useRef(false)
  const searchParams = new URLSearchParams(window.location.search)
  const errorMessage = searchParams.get("error")
  if (errorMessage && !errorMessageEnqueued.current) {
    enqueueSnackbar(errorMessage, { variant: "error" })
    errorMessageEnqueued.current = true
  }

  // O-Auth providers configured for server
  const configuredProviders = LAMP.Auth._configuredProviders

  const handleLinkOauth = async (socialProvider: string) => {
    const result: any = await LAMP.Credential.linkAccount(socialProvider)
    if (!!result.redirectUrl) {
      window.location.replace(result.redirectUrl)
    }
  }

  return (
    <LoginFrame>
      <Box marginBottom={3}>
        <Typography>
          You're almost done setting up your account. Pick one of the options below to finish account setup.
        </Typography>
      </Box>

      {configuredProviders.length && (
        <Box marginY={2}>
          <Typography>Link your account to an external authentication provider</Typography>
          <Box marginY={2}>
            <Grid container direction="row" justifyContent="center">
              {configuredProviders.map((providerKey) => (
                <Fab
                  variant="extended"
                  type="button"
                  style={{ background: "#7599FF", color: "White" }}
                  onClick={() => handleLinkOauth(providerKey)}
                  key={`link-to-${providerKey}`}
                >
                  {providerKey}
                </Fab>
              ))}
            </Grid>
          </Box>
        </Box>
      )}
      <hr />
      <Box marginY={2}>
        <Typography>Set up 2 factor authentication.</Typography>
        <Typography color="textSecondary">Not yet implemented.</Typography>
      </Box>
    </LoginFrame>
  )
}
