// Core Imports
import React, { useState, useEffect, useRef } from "react"
import { HashRouter, Route, Redirect, Switch } from "react-router-dom"
import { CssBaseline, Button, ThemeProvider, createMuiTheme, makeStyles } from "@material-ui/core"
import { blue, red } from "@material-ui/core/colors"
import { MuiPickersUtilsProvider } from "@material-ui/pickers"
import { SnackbarProvider, useSnackbar } from "notistack"
import "typeface-roboto"

// External Imports
import DateFnsUtils from "@date-io/date-fns"
import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"

// Local Imports
import LAMP from "lamp-core"
import Login from "./Login"
import Conversations from "./Conversations"
import TipNotification from "./TipNotification"
import Feed from "./Feed"
import Breathe from "./Breathe"
import JournalEntries from "./JournalEntries"

import SurveyQuestions from "./SurveyQuestions"
import Root from "./Root"
import Researcher from "./Researcher"
import Participant from "./Participant"
import PreventData from "./PreventData"

import NavigationLayout from "./NavigationLayout"
import ScratchImage from "./ScratchImage"
import HopeBox from "./HopeBox"

// import VegaGraph from "./VegaGraph"

/* TODO: /researcher/:researcher_id/activity/:activity_id -> editor ui */
/* TODO: /participant/:participant_id/activity/:activity_id -> activity ui */
/* TODO: /participant/:participant_id/messaging -> messaging */

//
/*const srcLock = () => {
  let query = window.location.hash.split("?") || []
  let src = Object.fromEntries(new URLSearchParams(query[1]))["src"]
  return typeof src === "string" && src.length > 0
}*/

function PageTitle({ children, ...props }) {
  useEffect(() => {
    document.title = `${typeof children === "string" ? children : ""}`
  })
  return <React.Fragment />
}
function _patientMode() {
  return LAMP.Auth._type === "participant"
}
function AppRouter({ ...props }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null)

  // To set page titile for active tab for menu
  let activeTab = (newTab?: any) => {
    setState((state) => ({
      ...state,
      activeTab: newTab,
    }))
  }

  const [state, setState] = useState({
    identity: LAMP.Auth._me,
    auth: LAMP.Auth._auth,
    authType: LAMP.Auth._type,
    lastDomain: undefined,
    activeTab: null,
    surveyDone: false,
    welcome: true,
  })
  const [store, setStore] = useState({ researchers: [], participants: [] })
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const storeRef = useRef([])
  useEffect(() => {
    let query = window.location.hash.split("?")
    if (!!query && query.length > 1) {
      //
      let src = Object.fromEntries(new URLSearchParams(query[1]))["src"]
      if (typeof src === "string" && src.length > 0) {
        enqueueSnackbar(`You're using the "${src}" server to log into mindLAMP.`, { variant: "info" })
      }

      //
      let a = Object.fromEntries(new URLSearchParams(query[1]))["a"]
      if (a === undefined) return
      let x = atob(a).split(":")

      //
      reset({
        id: x[0],
        password: x[1],
        serverAddress: x[2],
      }).then((x) => {
        //props.history.replace('/')
      })
    } else if (!state.identity) {
      LAMP.Auth.refresh_identity().then((x) => {
        setState((state) => ({
          ...state,
          identity: LAMP.Auth._me,
          auth: LAMP.Auth._auth,
          authType: LAMP.Auth._type,
        }))
      })
    }

    window.addEventListener("beforeinstallprompt", (e) => setDeferredPrompt(e))
  }, [])

  useEffect(() => {
    if (!deferredPrompt) return
    enqueueSnackbar("Add mindLAMP to your home screen?", {
      variant: "info",
      persist: true,
      action: (key) => (
        <React.Fragment>
          <Button style={{ color: "#fff" }} onClick={promptInstall}>
            Install
          </Button>
          <Button style={{ color: "#fff" }} onClick={() => closeSnackbar(key)}>
            Dismiss
          </Button>
        </React.Fragment>
      ),
    })
  }, [deferredPrompt])

  useEffect(() => {
    closeSnackbar("admin")
    closeSnackbar("demo")
    if (!!state.identity && state.authType === "admin") {
      enqueueSnackbar("Proceed with caution: you are logged in as the administrator.", {
        key: "admin",
        variant: "info",
        persist: true,
        preventDuplicate: true,
        action: (key) => (
          <Button style={{ color: "#fff" }} onClick={() => closeSnackbar(key)}>
            Dismiss
          </Button>
        ),
      })
    } else if (state.auth?.serverAddress === "demo.lamp.digital") {
      enqueueSnackbar(
        "You're logged into a demo account. Any changes you make will be reset when you restart the app.",
        {
          key: "demo",
          variant: "info",
          persist: true,
          preventDuplicate: true,
          action: (key) => (
            <Button style={{ color: "#fff" }} onClick={() => closeSnackbar(key)}>
              Dismiss
            </Button>
          ),
        }
      )
    }
  }, [state])

  let reset = async (identity?: any) => {
    await LAMP.Auth.set_identity(identity)
    if (!!identity) {
      let type = {
        identity: LAMP.Auth._me,
        auth: LAMP.Auth._auth,
        authType: LAMP.Auth._type,
      }
      setState((state) => ({ ...state, ...type }))
      return type
    } else {
      setState((state) => ({
        ...state,
        identity: null,
        auth: null,
        authType: null,
        lastDomain: ["api.lamp.digital", "demo.lamp.digital"].includes(state.auth.serverAddress)
          ? undefined
          : state.auth.serverAddress,
      }))
      return null
    }
  }

  let getResearcher = (id) => {
    if (id === "me" && state.authType === "researcher" && !Array.isArray(state.identity)) {
      id = state.identity.id
    }
    if (!id || id === "me") {
      return null //props.history.replace(`/`)
    }
    if (!!store.researchers[id]) {
      return store.researchers[id]
    } else if (!storeRef.current.includes(id)) {
      LAMP.Researcher.view(id).then((x) =>
        setStore({
          researchers: { ...store.researchers, [id]: x },
          participants: store.participants,
        })
      )
      storeRef.current = [...storeRef.current, id]
    }
    return null
  }

  let getParticipant = (id) => {
    if (id === "me" && state.authType === "participant" && !Array.isArray(state.identity)) {
      id = state.identity.id
    }
    if (!id || id === "me") {
      return null //props.history.replace(`/`)
    }
    if (!!store.participants[id]) {
      return store.participants[id]
    } else if (!storeRef.current.includes(id)) {
      LAMP.Participant.view(id).then((x) =>
        setStore({
          researchers: store.researchers,
          participants: { ...store.participants, [id]: x },
        })
      )
      storeRef.current = [...storeRef.current, id]
    }
    return null
  }

  const titlecase = (str) => {
    return str
      .toLowerCase()
      .split("_")
      .map(function (word) {
        return word.replace(word[0], word[0].toUpperCase())
      })
      .join(" ")
  }
  const submitSurvey = () => {
    setState((state) => ({
      ...state,
      surveyDone: true,
    }))
  }

  const promptInstall = () => {
    if (deferredPrompt === null) return
    deferredPrompt.prompt()
    deferredPrompt.userChoice.then((c) => {
      if (c.outcome === "accepted") {
        enqueueSnackbar("mindLAMP will be installed on your device.", {
          variant: "info",
        })
      } else {
        enqueueSnackbar("mindLAMP will not be installed on your device.", {
          variant: "warning",
        })
      }
      setDeferredPrompt(null)
    })
  }

  return (
    <Switch>
      <Route
        exact
        path="/tip"
        render={(props) => (
          <React.Fragment>
            <PageTitle>mindLAMP | Today's Tip</PageTitle>
            <TipNotification />
          </React.Fragment>
        )}
      />
      {/* Route feed page */}
      <Route
        exact
        path="/Feed"
        render={(props) => (
          <React.Fragment>
            <PageTitle>mindLAMP | Feed</PageTitle>
            <Feed />
          </React.Fragment>
        )}
      />
      <Route
        exact
        path="/participant/:id/messages"
        render={(props) => (
          <React.Fragment>
            <PageTitle>mindLAMP | Conversations</PageTitle>
            <Conversations goBack={props.history.goBack} />
          </React.Fragment>
        )}
      />
      <Route
        exact
        path="/participant/:id/breathe"
        render={(props) => (
          <React.Fragment>
            <PageTitle>mindLAMP | Breathe</PageTitle>
            <Breathe goBack={props.history.goBack} />
          </React.Fragment>
        )}
      />
      <Route
        exact
        path="/participant/:id/journals"
        render={(props) => (
          <React.Fragment>
            <PageTitle>mindLAMP | Journals</PageTitle>
            <NavigationLayout
              id={props.match.params.id}
              goBack={props.history.goBack}
              onLogout={() => reset()}
              activeTab="Journals"
            >
              <JournalEntries goBack={props.history.goBack} />
            </NavigationLayout>
          </React.Fragment>
        )}
      />

      <Route
        exact
        path="/participant/:id/hopebox"
        render={(props) => (
          <React.Fragment>
            <PageTitle>mindLAMP | Hope Box</PageTitle>
            <HopeBox goBack={props.history.goBack} />
          </React.Fragment>
        )}
      />

      <Route
        exact
        path="/participant/:id/scratch"
        render={(props) => (
          <React.Fragment>
            <PageTitle>mindLAMP | Scratch Card</PageTitle>
            <ScratchImage goBack={props.history.goBack} />
          </React.Fragment>
        )}
      />
      <Route
        exact
        path="/participant/:id/survey/:type"
        render={(props) => (
          <React.Fragment>
            <PageTitle>mindLAMP | Survey</PageTitle>
            <SurveyQuestions type={props.match.params.type} goBack={props.history.goBack} submitSurvey={submitSurvey} />
          </React.Fragment>
        )}
      />

      {/* Route prevent-tab inner page ; done with static data for now. */}
      <Route
        exact
        path="/participant/:id/prevent-data/:type"
        render={(props) => (
          <React.Fragment>
            <PageTitle>mindLAMP | Prevent</PageTitle>
            <NavigationLayout
              id={props.match.params.id}
              title={
                getParticipant(props.match.params.id) !== null && `Patient ${getParticipant(props.match.params.id).id}`
              }
              goBack={props.history.goBack}
              onLogout={() => reset()}
              activeTab={`${titlecase(props.match.params.type)}`}
            >
              <PreventData type={props.match.params.type} />
            </NavigationLayout>
          </React.Fragment>
        )}
      />
      {/* Route index => login or home (which redirects based on user type). */}
      <Route
        exact
        path="/"
        render={(props) =>
          !(window.location.hash.split("?").length > 1 && !state.identity) ? (
            !state.identity ? (
              <React.Fragment>
                <PageTitle>mindLAMP | Login</PageTitle>
                <NavigationLayout noToolbar goBack={props.history.goBack} onLogout={() => reset()}>
                  <Login
                    setIdentity={async (identity) => await reset(identity)}
                    lastDomain={state.lastDomain}
                    onComplete={() => props.history.replace("/")}
                  />
                </NavigationLayout>
              </React.Fragment>
            ) : state.authType === "admin" ? (
              <Redirect to="/researcher" />
            ) : state.authType === "researcher" ? (
              <Redirect to="/researcher/me" />
            ) : (
              <Redirect to="/participant/me" />
            )
          ) : (
            <React.Fragment />
          )
        }
      />

      {/* Route authenticated routes. */}
      <Route
        exact
        path="/researcher"
        render={(props) =>
          !state.identity || state.authType !== "admin" ? (
            <React.Fragment>
              <PageTitle>mindLAMP | Login</PageTitle>
              <NavigationLayout noToolbar goBack={props.history.goBack} onLogout={() => reset()}>
                <Login
                  setIdentity={async (identity) => await reset(identity)}
                  lastDomain={state.lastDomain}
                  onComplete={() => props.history.replace("/")}
                />
              </NavigationLayout>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <PageTitle>Administrator</PageTitle>
              <NavigationLayout title="Administrator" goBack={props.history.goBack} onLogout={() => reset()}>
                <Root {...props} />
              </NavigationLayout>
            </React.Fragment>
          )
        }
      />
      <Route
        exact
        path="/researcher/:id"
        render={(props) =>
          !state.identity ? (
            <React.Fragment>
              <PageTitle>mindLAMP | Login</PageTitle>
              <NavigationLayout noToolbar goBack={props.history.goBack} onLogout={() => reset()}>
                <Login
                  setIdentity={async (identity) => await reset(identity)}
                  lastDomain={state.lastDomain}
                  onComplete={() => props.history.replace("/")}
                />
              </NavigationLayout>
            </React.Fragment>
          ) : !getResearcher(props.match.params.id) ? (
            <React.Fragment />
          ) : (
            <React.Fragment>
              <PageTitle>{`${getResearcher(props.match.params.id).name}`}</PageTitle>
              <NavigationLayout
                id={props.match.params.id}
                title={`${getResearcher(props.match.params.id).name}`}
                goBack={props.history.goBack}
                onLogout={() => reset()}
              >
                <Researcher
                  researcher={getResearcher(props.match.params.id)}
                  onParticipantSelect={(id) => props.history.push(`/participant/${id}`)}
                />
              </NavigationLayout>
            </React.Fragment>
          )
        }
      />

      <Route
        exact
        path="/participant/:id"
        render={(props) =>
          !state.identity ? (
            <React.Fragment>
              <PageTitle>mindLAMP | Login</PageTitle>
              <NavigationLayout noToolbar goBack={props.history.goBack} onLogout={() => reset()}>
                <Login
                  setIdentity={async (identity) => await reset(identity)}
                  lastDomain={state.lastDomain}
                  onComplete={() => props.history.replace("/")}
                />
              </NavigationLayout>
            </React.Fragment>
          ) : !getParticipant(props.match.params.id) ? (
            <React.Fragment />
          ) : (
            <React.Fragment>
              <PageTitle>{`Patient ${getParticipant(props.match.params.id).id}`}</PageTitle>
              <NavigationLayout
                id={props.match.params.id}
                title={`Patient ${getParticipant(props.match.params.id).id}`}
                goBack={props.history.goBack}
                onLogout={() => reset()}
                activeTab={state.activeTab}
              >
                <Participant
                  participant={getParticipant(props.match.params.id)}
                  activeTab={activeTab}
                  tabValue={state.activeTab}
                  surveyDone={state.surveyDone}
                  submitSurvey={submitSurvey}
                />
              </NavigationLayout>
            </React.Fragment>
          )
        }
      />

      {/* Route API documentation ONLY. */}
      <Route
        exact
        path="/api"
        render={(props) => (
          <React.Fragment>
            <PageTitle>LAMP Platform API</PageTitle>
            <SwaggerUI
              url="https://api.lamp.digital/"
              docExpansion="list"
              displayOperationId={true}
              deepLinking={true}
              displayRequestDuration={true}
            />
          </React.Fragment>
        )}
      />
    </Switch>
  )
}

export default function App({ ...props }) {
  return (
    <ThemeProvider
      theme={createMuiTheme({
        palette: {
          primary: blue,
          secondary: red,
          background: {
            default: "#fff",
          },
        },
        overrides: {
          MuiBottomNavigationAction: {
            label: {
              letterSpacing: `0.1em`,
              textTransform: "uppercase",
            },
          },
        },
      })}
    >
      <CssBaseline />
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <SnackbarProvider>
          <HashRouter>
            <AppRouter {...props} />
          </HashRouter>
        </SnackbarProvider>
      </MuiPickersUtilsProvider>
      <span
        style={{
          position: "fixed",
          bottom: 16,
          left: 16,
          fontSize: "8",
          zIndex: -1,
          opacity: 0.1,
        }}
      >
        {process.env.REACT_APP_GIT_SHA}
      </span>
    </ThemeProvider>
  )
}
