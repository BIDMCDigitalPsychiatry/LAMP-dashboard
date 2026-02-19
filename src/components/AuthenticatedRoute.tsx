import React from "react"
import { useAuthContext } from "./AuthProvider"
import LoginWorkflow from "./LoginWorkflow"
import LAMP from "lamp-core"
import { LinkAccount } from "../LinkAccount"

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
  const { isLoggedIn } = useAuthContext()
  const [identity, setIdentity] = identityState
  return (
    <React.Fragment>
      {isLoggedIn && !LAMP.Auth._requireAccountSetup ? (
        children
      ) : isLoggedIn && LAMP.Auth._requireAccountSetup ? (
        <LinkAccount></LinkAccount>
      ) : (
        <LoginWorkflow
          setIdentity={setIdentity}
          state={state}
          onComplete={onComplete}
          setAuthenticated={setAuthenticated}
          setConfirmSession={setConfirmSession}
        />
      )}
    </React.Fragment>
  )
}
