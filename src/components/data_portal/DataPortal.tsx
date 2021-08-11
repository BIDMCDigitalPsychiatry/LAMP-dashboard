import React from "react"
import { useLocalStorage } from "./DataPortalShared"
import DataPortalHome from "./DataPortalHome"
import SignIn from "./SignIn"

export default function DataPortal({ ...props }) {
  const [token, setToken] = useLocalStorage("_query_auth", null)
  if (!!token) {
    return <DataPortalHome token={token} onLogout={() => setToken(null)} />
  } else {
    return <SignIn onSubmit={setToken} />
  }
}
