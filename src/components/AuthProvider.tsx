import LAMP from "lamp-core"
import React, { createContext, useContext, useEffect, useState } from "react"

export type AuthContextType = {
  authorizationHeader: string | undefined
  isLoggedIn: boolean
  setIsLoggedIn: (value: boolean) => void | undefined
  refreshSessionInfo: () => any | undefined
  accountSetupState: string | undefined
  requireVerification: boolean
  sessionInfo: { [key: string]: any } | undefined
}

export const AuthContext = createContext<AuthContextType>({
  authorizationHeader: undefined,
  isLoggedIn: false,
  setIsLoggedIn: undefined,
  refreshSessionInfo: undefined,
  accountSetupState: undefined,
  requireVerification: false,
  sessionInfo: undefined,
})

// AuthProvider should inject information about the currently logged in user
// TODO: Refactor "state.identity" from AppRouter to belong to AuthProvider
export function AuthContextProvider({ ...props }) {
  const [authorizationHeader, setAuthorizationHeader] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [sessionInfo, setSessionInfo] = useState(undefined)
  const accountSetupState = sessionInfo?.accountSetupState
  const requireVerification = sessionInfo?.require2FAVerification

  const refreshSessionInfo = async () => {
    const sessionInfoResult: any = await LAMP.Auth.fetch_session_info()
    setSessionInfo(sessionInfoResult)
    return sessionInfoResult
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
    sessionInfo: sessionInfo,
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
