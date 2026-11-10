import React from "react"
import { useAuthContext } from "./AuthProvider"
import LoginWorkflow from "./LoginWorkflow"
import { AccountSetupWorkflow, TwoFactorVerifyForm } from "../AccountSetupWorkflow"
import LoginFrame from "./LoginFrame"
import SplashScreen from "./SplashScreen"
import { useSnackbar } from "notistack"
import { useTranslation } from "react-i18next"
import { Box, Typography } from "@material-ui/core"
import LAMP from "lamp-core"
import { isInMobileApp } from "./helper"
import { connectButtonStyle } from "./ServerGateway"

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
  const { isLoggedIn, accountSetupState, requireVerification, sessionInfo } = useAuthContext()
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
      ) : sessionInfo === undefined ? (
        // Session info is still loading, so the setup state isn't known yet
        <SplashScreen />
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

  // Ends the session on the server like the menu's Logout, then keeps the server selected for the login screen
  const logout = async () => {
    const server = localStorage.getItem("lastServerSelected")
    try {
      await LAMP.Credential.logout()
    } catch (err) {
      console.error("Logout failed:", err)
    }
    await reset()
    if (server) await LAMP.Auth.set_server(server)
    window.location.replace("/#/")
  }

  return (
    <LoginFrame>
      {/* Same text and button styles as the server select screen */}
      <Typography style={{ fontSize: 14, color: "rgba(0,0,0,0.6)", textAlign: "center", marginBottom: 20 }}>
        {t(
          "Researcher and administrator accounts can't be used in the mobile app. Please log in on the web dashboard."
        )}
      </Typography>
      <Box textAlign="center">
        <button onClick={logout} style={connectButtonStyle(false)}>
          {t("Log out")}
        </button>
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
