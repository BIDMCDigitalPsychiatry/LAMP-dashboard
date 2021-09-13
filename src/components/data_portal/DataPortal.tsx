import React from "react"
import { useLocalStorage } from "./DataPortalShared"
import DataPortalHome from "./DataPortalHome"
import SignIn from "./SignIn"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

export default function DataPortal({ onLogout, ...props }) {
  const [token, setToken] = React.useState(null)

  React.useEffect(() => {
    if (props.token) {
      setToken(props.token)
    }
  }, [])

  if (!!token) {
    return (
      <DndProvider backend={HTML5Backend}>
        <DataPortalHome token={token} onLogout={onLogout} />
      </DndProvider>
    )
  } else {
    return <SignIn onSubmit={setToken} />
  }
}
