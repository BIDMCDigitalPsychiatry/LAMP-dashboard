import LAMP from "lamp-core"
import React, { createContext, useCallback, useContext, useEffect, useState } from "react"

export type AuthContextType = {
  authorizationHeader: string | undefined
  isLoggedIn: boolean
  setIsLoggedIn: (value: boolean) => void | undefined
}

export const AuthContext = createContext<AuthContextType>({
  authorizationHeader: undefined,
  isLoggedIn: false,
  setIsLoggedIn: undefined,
})

// AuthProvider should inject information about the currently logged in user
// TODO: Refactor "state.identity" from AppRouter to belong to AuthProvider
export function AuthContextProvider({ ...props }) {
  const [authorizationHeader, setAuthorizationHeader] = useState(undefined)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const authContextState: AuthContextType = {
    authorizationHeader: authorizationHeader,
    isLoggedIn: isLoggedIn,
    setIsLoggedIn: (newvalue: boolean) => {
      setIsLoggedIn(newvalue)
    },
    // setIsLoggedIn: (value: boolean) => {console.log("ignore set is logged in call")}
  }

  // Keep authContextState in sync with the values stored by lamp-core
  useEffect(() => {
    setAuthorizationHeader(
      !!LAMP.API.configuration?.authorization ? `Basic ${LAMP.API.configuration.authorization}` : undefined
    )
  }, [LAMP.API.configuration?.authorization, setAuthorizationHeader])

  return <AuthContext.Provider value={authContextState}>{props.children}</AuthContext.Provider>
}

export function useAuthContext() {
  return useContext(AuthContext)
}
