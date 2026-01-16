import LAMP from "lamp-core"
import React, { createContext, useCallback, useContext, useEffect, useState } from "react"
import { buildLampServerRequestUrl } from "../utilities"

export type AuthContextType = {
  authorizationHeader: string | undefined
  isLoggedIn: boolean
  setIsLoggedIn: (value: boolean) => void | undefined
  refreshSessionInfo: () => any | undefined
  accountSetupState: string | undefined
  requireVerification: boolean
}

export const AuthContext = createContext<AuthContextType>({
  authorizationHeader: undefined,
  isLoggedIn: false,
  setIsLoggedIn: undefined,
  refreshSessionInfo: undefined,
  accountSetupState: undefined,
  requireVerification: false,
})

// AuthProvider should inject information about the currently logged in user
// TODO: Refactor "state.identity" from AppRouter to belong to AuthProvider
export function AuthContextProvider({ ...props }) {
  const [authorizationHeader, setAuthorizationHeader] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [accountSetupState, setAccountSetupState] = useState(undefined)
  const [requireVerification, setRequireVerification] = useState(false)

  const refreshSessionInfo = async () => {
    const sessionInfo: any = await LAMP.Auth.fetch_session_info()
    if (sessionInfo?.accountSetupState && sessionInfo.accountSetupState !== accountSetupState) {
      setAccountSetupState(sessionInfo.accountSetupState)
    }
    if (
      sessionInfo?.require2FAVerification !== undefined &&
      sessionInfo.require2FAVerification !== requireVerification
    ) {
      setRequireVerification(sessionInfo?.require2FAVerification || false)
    }
    return sessionInfo
  }

  const authContextState: AuthContextType = {
    authorizationHeader: authorizationHeader,
    isLoggedIn: isLoggedIn,
    setIsLoggedIn: (newvalue: boolean) => {
      // If logging in check for the accountSetupState
      if (newvalue) {
        refreshSessionInfo()
      }
      setIsLoggedIn(newvalue)
    },
    refreshSessionInfo: refreshSessionInfo,
    accountSetupState: accountSetupState,
    requireVerification: requireVerification,
  }

  // Keep authContextState in sync with the values stored by lamp-core
  useEffect(() => {
    setAuthorizationHeader(
      !!LAMP.API.configuration?.authorization ? `Basic ${LAMP.API.configuration.authorization}` : ""
    )
  }, [LAMP.API.configuration?.authorization, setAuthorizationHeader])

  return <AuthContext.Provider value={authContextState}>{props.children}</AuthContext.Provider>
}

export function useAuthContext() {
  return useContext(AuthContext)
}
