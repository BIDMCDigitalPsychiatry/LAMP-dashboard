import LAMP from "lamp-core"
import React, { useState } from "react"
import SelectServer from "./SelectServer"
import Login from "./Login"

export default function LoginWorkflow({ setIdentity, state, onComplete, setAuthenticated, setConfirmSession }) {
  const [isServerAddressSelected, setIsServerAddressSelected] = useState(!!LAMP.Auth._auth.serverAddress)
  const [srcLocked, setSrcLocked] = useState(false)
  return (
    <React.Fragment>
      {isServerAddressSelected ? (
        <Login
          setIdentity={setIdentity}
          lastDomain={state.lastDomain}
          onComplete={onComplete}
          setAuthenticated={setAuthenticated}
          setConfirmSession={setConfirmSession}
          srcLocked={srcLocked}
        />
      ) : (
        <SelectServer
          onSetServer={() => {
            setIsServerAddressSelected(true)
          }}
          srcLockedState={[srcLocked, setSrcLocked]}
        />
      )}
    </React.Fragment>
  )
}
