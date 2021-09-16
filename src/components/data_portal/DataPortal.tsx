import React from "react"
import DataPortalHome from "./DataPortalHome"
import SignIn from "./SignIn"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { Card, makeStyles, Container } from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
  portal: {
    height: "100%",
    border: "1px solid red",
    background: "grey",
  },
  standaloneContainer: {
    height: "100vh",
  },
}))

export default function DataPortal({ onLogout, standalone = false, ...props }) {
  const [token, setToken] = React.useState(null)

  const classes = useStyles()

  function ConditionalContainerWrap({ condition, children }) {
    return condition ? (
      <Container className={classes.standaloneContainer}>{children}</Container>
    ) : (
      <React.Fragment>{children}</React.Fragment>
    )
  }

  React.useEffect(() => {
    if (props.token) {
      setToken(props.token)
    }
  }, [])

  if (!!token) {
    return (
      <ConditionalContainerWrap condition={standalone}>
        <DndProvider backend={HTML5Backend}>
          <DataPortalHome className={classes.portal} token={token} onLogout={onLogout} />
        </DndProvider>
      </ConditionalContainerWrap>
    )
  } else {
    return (
      <ConditionalContainerWrap condition={standalone}>
        <SignIn onSubmit={setToken} />
      </ConditionalContainerWrap>
    )
  }
}
