// Core Imports
import React, { useState, useEffect, useRef } from "react"
import { HashRouter, Route, Redirect, Switch } from "react-router-dom"
import { CssBaseline, Button, ThemeProvider, createMuiTheme } from "@material-ui/core"
import { blue, red } from "@material-ui/core/colors"
import { MuiPickersUtilsProvider } from "@material-ui/pickers"
import { SnackbarProvider, useSnackbar } from "notistack"
import { ErrorBoundary } from "react-error-boundary"
import StackTrace from "stacktrace-js"

// External Imports
import DateFnsUtils from "@date-io/date-fns"

// Local Imports
import LAMP from "lamp-core"
import Login from "./Login"
import Messages from "./Messages"

import Root from "./Root"
import Researcher from "./Researcher"
import Participant from "./Participant"
import NavigationLayout from "./NavigationLayout"
import HopeBox from "./HopeBox"
import TipNotification from "./TipNotification"
import NotificationPage from "./NotificationPage"
import { useTranslation } from "react-i18next"

// import VegaGraph from "./VegaGraph"

/* TODO: /researcher/:researcher_id/activity/:activity_id -> editor ui */
/* TODO: /participant/:participant_id/activity/:activity_id -> activity ui */
/* TODO: /participant/:participant_id/messaging -> messaging */

/*
// colors as a gradient:
background: linear-gradient(90deg, rgba(255,214,69,1) 0%, rgba(101,206,191,1) 33%, rgba(255,119,91,1) 66%, rgba(134,182,255,1) 100%);
// colors as a bar:
background: linear-gradient(90deg, rgba(255,214,69,1) 0%, rgba(255,214,69,1) 25%, rgba(101,206,191,1) 25%, rgba(101,206,191,1) 50%, rgba(255,119,91,1) 50%, rgba(255,119,91,1) 75%, rgba(134,182,255,1) 75%, rgba(134,182,255,1) 100%);
*/

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
    messageCount: 0,
  })
  const [store, setStore] = useState({ researchers: [], participants: [] })
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const storeRef = useRef([])
  const [showDemoMessage, setShowDemoMessage] = useState(true)
  const { t } = useTranslation()

  useEffect(() => {
    let query = window.location.hash.split("?")
    if (!!query && query.length > 1) {
      //
      let src = Object.fromEntries(new URLSearchParams(query[1]))["src"]
      if (typeof src === "string" && src.length > 0) {
        enqueueSnackbar(t("You're using the src server to log into mindLAMP.", { src: src }), { variant: "info" })
      }
      //
      let a = Object.fromEntries(new URLSearchParams(query[1]))["a"]
      if (a === undefined) window.location.href = "/#/"
      let x = atob(a).split(":")
      //

      reset({
        id: x[0],
        password: x[1],
        serverAddress:
          x.length > 2 && typeof x[2] !== "undefined"
            ? x[2] + (x.length > 3 && typeof x[3] !== "undefined" ? ":" + x[3] : "")
            : "api.lamp.digital",
      }).then((x) => {
        window.location.href = query[0]
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
    enqueueSnackbar(t("Add mindLAMP to your home screen?"), {
      variant: "info",
      persist: true,
      action: (key) => (
        <React.Fragment>
          <Button style={{ color: "#fff" }} onClick={promptInstall}>
            {t("Install")}
          </Button>
          <Button style={{ color: "#fff" }} onClick={() => closeSnackbar(key)}>
            {t("Dismiss")}
          </Button>
        </React.Fragment>
      ),
    })
  }, [deferredPrompt])

  useEffect(() => {
    closeSnackbar("admin")
    if (!showDemoMessage) closeSnackbar("demo")
    if (!!state.identity && state.authType === "admin") {
      enqueueSnackbar(t("Proceed with caution: you are logged in as the administrator."), {
        key: "admin",
        variant: "info",
        persist: true,
        preventDuplicate: true,
        action: (key) => (
          <Button style={{ color: "#fff" }} onClick={() => closeSnackbar(key)}>
            {t("Dismiss")}
          </Button>
        ),
      })
    } else if (showDemoMessage && state.auth?.serverAddress === "demo.lamp.digital") {
      enqueueSnackbar(
        t("You're logged into a demo account. Any changes you make will be reset when you restart the app."),
        {
          key: "demo",
          variant: "info",
          persist: true,
          preventDuplicate: true,
          action: (key) => (
            <Button style={{ color: "#fff" }} onClick={() => closeSnackbar(key)}>
              {t("Dismiss")}
            </Button>
          ),
        }
      )
    }
    if (!!state.identity && state.authType === "participant") {
      // console.log(messages(state.identity))
      // setState((state) => ({
      //   ...state,
      //   messageCount:messages(state.identity)
      // }))
    }
  }, [state])

  let messages = async (identity?: any) => {
    let allMessages = Object.fromEntries(
      (
        await Promise.all(
          [identity.id || ""].map(async (x) => [x, await LAMP.Type.getAttachment(x, "lamp.messaging").catch((e) => [])])
        )
      )
        .filter((x: any) => x[1].message !== "404.object-not-found")
        .map((x: any) => [x[0], x[1].data])
    )
    let x = (allMessages || {})[identity.id || ""] || []
    allMessages = !Array.isArray(x) ? [] : x

    return allMessages.filter((x) => x.type === "message" && x.from === "researcher").length
  }

  let reset = async (identity?: any) => {
    await LAMP.Auth.set_identity(identity).catch((e) => {
      enqueueSnackbar(t("Invalid id or password."), {
        variant: "error",
      })
      return
    })
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
        activeTab: null,
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
        enqueueSnackbar(t("mindLAMP will be installed on your device."), {
          variant: "info",
        })
      } else {
        enqueueSnackbar(t("mindLAMP will not be installed on your device."), {
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
        path="/participant/:id/messages"
        render={(props) => (
          <React.Fragment>
            <PageTitle>mindLAMP | {t("Messages")}</PageTitle>
            <NavigationLayout
              authType={state.authType}
              id={props.match.params.id}
              goBack={props.history.goBack}
              onLogout={() => reset()}
              activeTab="Messages"
              sameLineTitle={true}
            >
              {/* <Messages goBack={props.history.goBack} /> */}
              <Messages
                style={{ margin: "0px -16px -16px -16px" }}
                refresh={true}
                participantOnly
                participant={getParticipant(props.match.params.id).id}
              />
            </NavigationLayout>
          </React.Fragment>
        )}
      />

      <Route
        exact
        path="/participant/:id/hopebox"
        render={(props) => (
          <React.Fragment>
            <PageTitle>mindLAMP | {t("Hope Box")}</PageTitle>
            <HopeBox goBack={props.history.goBack} />
          </React.Fragment>
        )}
      />
      <Route
        exact
        path="/participant/:id/activity/:activityId"
        render={(props) =>
          !state.identity ? (
            <React.Fragment>
              <PageTitle>mindLAMP | {t("Login")}</PageTitle>
              <Login
                setIdentity={async (identity) => await reset(identity)}
                lastDomain={state.lastDomain}
                onComplete={() => props.history.replace("/")}
              />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <NotificationPage participant={props.match.params.id} activityId={props.match.params.activityId} />
            </React.Fragment>
          )
        }
      />
      <Route
        exact
        path="/participant/:id/tip"
        render={(props) => (
          <React.Fragment>
            <PageTitle>mindLAMP | {t("Hope Box")}</PageTitle>
            <TipNotification goBack={props.history.goBack} />
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
                <PageTitle>mindLAMP | {t("Login")}</PageTitle>
                <Login
                  setIdentity={async (identity) => await reset(identity)}
                  lastDomain={state.lastDomain}
                  onComplete={() => props.history.replace("/")}
                />
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
              <PageTitle>mindLAMP | {t("Login")}</PageTitle>
              <Login
                setIdentity={async (identity) => await reset(identity)}
                lastDomain={state.lastDomain}
                onComplete={() => props.history.replace("/")}
              />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <PageTitle>{t("Administrator")}</PageTitle>
              <NavigationLayout
                authType={state.authType}
                title="Administrator"
                goBack={props.history.goBack}
                onLogout={() => reset()}
              >
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
              <PageTitle>mindLAMP | {t("Login")}</PageTitle>
              <Login
                setIdentity={async (identity) => await reset(identity)}
                lastDomain={state.lastDomain}
                onComplete={() => props.history.replace("/")}
              />
            </React.Fragment>
          ) : !getResearcher(props.match.params.id) ? (
            <React.Fragment />
          ) : (
            <React.Fragment>
              <PageTitle>{`${getResearcher(props.match.params.id).name}`}</PageTitle>
              <NavigationLayout
                authType={state.authType}
                id={props.match.params.id}
                title={`${getResearcher(props.match.params.id).name}`}
                goBack={props.history.goBack}
                onLogout={() => reset()}
                activeTab="Researcher"
                sameLineTitle={true}
              >
                <Researcher
                  researcher={getResearcher(props.match.params.id)}
                  onParticipantSelect={(id) => {
                    setState((state) => ({
                      ...state,
                      activeTab: 3,
                    }))
                    props.history.push(`/participant/${id}`)
                  }}
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
              <PageTitle>mindLAMP | {t("Login")}</PageTitle>
              <Login
                setIdentity={async (identity) => await reset(identity)}
                lastDomain={state.lastDomain}
                onComplete={() => props.history.replace("/")}
              />
            </React.Fragment>
          ) : !getParticipant(props.match.params.id) ? (
            <React.Fragment />
          ) : (
            <React.Fragment>
              <PageTitle>{t("Patient") + " " + getParticipant(props.match.params.id).id}</PageTitle>
              <NavigationLayout
                authType={state.authType}
                id={props.match.params.id}
                title={"Patient" + " " + getParticipant(props.match.params.id).id}
                goBack={props.history.goBack}
                onLogout={() => reset()}
                activeTab={state.activeTab}
              >
                <Participant
                  participant={getParticipant(props.match.params.id)}
                  activeTab={activeTab}
                  tabValue={props.match.params.tabVal > -1 ? props.match.params.tabVal : state.activeTab}
                  surveyDone={state.surveyDone}
                  submitSurvey={submitSurvey}
                  setShowDemoMessage={(val) => {
                    setShowDemoMessage(val)
                  }}
                />
              </NavigationLayout>
            </React.Fragment>
          )
        }
      />
    </Switch>
  )
}

function ErrorFallback({ error }) {
  const [trace, setTrace] = useState([])
  useEffect(() => {
    StackTrace.fromError(error).then(setTrace)
  }, [])
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        border: "none",
        zIndex: 2147483647,
        padding: "0.5rem",
        fontFamily: "Consolas, Menlo, monospace",
        whiteSpace: "pre-wrap",
        lineHeight: 1.5,
        fontSize: "12px",
        color: "rgb(232, 59, 70)",
        background: "rgb(53, 53, 53)",
      }}
    >
      <pre>
        <code style={{ fontSize: "16px" }}>
          {error.message.match(/^\w*:/) || !error.name ? error.message : error.name + ": " + error.message}
        </code>
        <br />
        <code style={{ color: "#fff" }}>
          {trace.length > 0 ? trace.map((x) => x.toString()).join("\n") : "Generating stacktrace..."}
        </code>
        <br />
        <code>
          mindLAMP Version: `v${process.env.REACT_APP_GIT_NUM} (${process.env.REACT_APP_GIT_SHA})`
        </code>
      </pre>
    </div>
  )
}

export default function App({ ...props }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ThemeProvider
        theme={createMuiTheme({
          typography: {
            fontFamily: ["Inter", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
          },
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
          {`v${process.env.REACT_APP_GIT_NUM} (${process.env.REACT_APP_GIT_SHA})`}
        </span>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
