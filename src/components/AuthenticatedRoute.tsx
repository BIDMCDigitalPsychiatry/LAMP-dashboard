import React from "react"
import { useAuthContext } from "./AuthProvider"
import LoginWorkflow from "./LoginWorkflow"
import { AccountSetupWorkflow, TwoFactorVerifyForm } from "../AccountSetupWorkflow"
import LoginFrame from "./LoginFrame"

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

function TwoFactorVerificationPage({}) {
  return (
    <LoginFrame>
      <TwoFactorVerifyForm onSuccess={() => console.log("success")} onError={() => console.log("Error")} />
    </LoginFrame>
  )
}
