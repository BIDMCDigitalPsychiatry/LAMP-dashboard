import React from "react"
import { useAuthContext } from "./AuthProvider"
import LoginWorkflow from "./LoginWorkflow"
import { AccountSetupWorkflow, TwoFactorVerifyForm } from "../AccountSetupWorkflow"
import LoginFrame from "./LoginFrame"
import { useSnackbar } from "notistack"
import { useTranslation } from "react-i18next"
import { Box, Button, Typography } from "@material-ui/core"
import LAMP from "lamp-core"
import { isInMobileApp } from "./helper"

export default function AuthenticatedRoute({
  children,
  identityState,
  state,
  onComplete,
  setAuthenticated,
  setConfirmSession,
  reset,
  ...props
}) {
  const { isLoggedIn, accountSetupState, requireVerification } = useAuthContext()
  const [identity, setIdentity] = identityState
  const setupCompleteStates = ["OAUTH", "TWO_FACTOR", "NOT_REQUIRED"]
  const requireSetup = !setupCompleteStates.some((s) => accountSetupState === s)
  return (
    <React.Fragment>
      {!isLoggedIn ? (
        <LoginWorkflow
          setIdentity={setIdentity}
          state={state}
          onComplete={onComplete}
          setAuthenticated={setAuthenticated}
          setConfirmSession={setConfirmSession}
        />
      ) : isInMobileApp() && LAMP.Auth._type !== "participant" ? (
        <UseWebDashboardPage reset={reset} />
      ) : requireSetup ? (
        <AccountSetupWorkflow />
      ) : requireVerification ? (
        <TwoFactorVerificationPage />
      ) : (
        children
      )}
    </React.Fragment>
  )
}

// The mobile apps are for participants; researchers and admins use the web dashboard
function UseWebDashboardPage({ reset }) {
  const { t } = useTranslation()

  return (
    <LoginFrame>
      <Box textAlign="center">
        <Typography gutterBottom>
          {t("Researcher and administrator accounts can't be used in the mobile app. Please log in on the web dashboard.")}
        </Typography>
        <Button variant="contained" color="primary" onClick={() => reset()}>
          {t("Log out")}
        </Button>
      </Box>
    </LoginFrame>
  )
}

function TwoFactorVerificationPage({}) {
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation()

  return (
    <LoginFrame>
      <TwoFactorVerifyForm
        onError={() =>
          enqueueSnackbar(`${t("Failed to verify. Make you sure you entered the correct code.")}`, { variant: "error" })
        }
        introTextOverride={`${t("Click 'Send Code' to receive your two factor verification code.")}`}
      />
    </LoginFrame>
  )
}
