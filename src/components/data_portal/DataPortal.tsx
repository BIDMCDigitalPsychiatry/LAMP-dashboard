import React from "react"
import DataPortalHome from "./DataPortalHome"
import SignIn from "./SignIn"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import makeStyles from "@material-ui/core/styles/makeStyles"
import Container from "@material-ui/core/Container"

const useStyles = makeStyles((theme) => ({
  portal: {
    height: "100%",
  },
  standaloneContainer: {
    height: "100vh",
  },
}))

export default function DataPortal({ onLogout, standalone = false, ...props }) {
  const [token, setToken] = React.useState(null)
  const classes = useStyles()

  function ConditionalContainerWrap({ condition, children }) {
    return condition ? <Container className={classes.standaloneContainer}>{children}</Container> : children
  }

  React.useEffect(() => {
    if (props.token) {
      setToken(props.token)
    }
  }, [])

  if (!!token) {
    return standalone ? (
      <Container className={classes.standaloneContainer}>
        <DndProvider backend={HTML5Backend}>
          <DataPortalHome className={classes.portal} token={token} onLogout={onLogout} />
        </DndProvider>
      </Container>
    ) : (
      <DndProvider backend={HTML5Backend}>
        <DataPortalHome className={classes.portal} token={token} onLogout={onLogout} />
      </DndProvider>
    )
  } else {
    return (
      <ConditionalContainerWrap condition={standalone}>
        <SignIn onSubmit={setToken} />
      </ConditionalContainerWrap>
    )
  }
}
