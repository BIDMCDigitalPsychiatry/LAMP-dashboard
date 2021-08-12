import React from "react"
import { useLocalStorage } from "./DataPortalShared"
import DataPortalHome from "./DataPortalHome"
import SignIn from "./SignIn"

export default function DataPortal({ onLogout, ...props }) {
  const [token, setToken] = React.useState(null)

  React.useEffect(() => {
    if (props.token) {
      setToken(props.token)
    }
  }, [])

  if (!!token) {
    return <DataPortalHome token={token} onLogout={onLogout} />
  } else {
    return <SignIn onSubmit={setToken} />
  }
}
