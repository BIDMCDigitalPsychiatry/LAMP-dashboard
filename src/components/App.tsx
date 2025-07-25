import React, { useState, useEffect, useRef } from "react"
import { HashRouter, Route, Redirect, Switch, useLocation } from "react-router-dom"
import { CssBaseline, Button, ThemeProvider, colors, Backdrop, CircularProgress } from "@material-ui/core"
import { MuiPickersUtilsProvider } from "@material-ui/pickers"
import { createTheme } from "@material-ui/core/styles"
import { SnackbarProvider, useSnackbar } from "notistack"
import { ErrorBoundary } from "react-error-boundary"
import StackTrace from "stacktrace-js"
import DateFnsUtils from "@date-io/date-fns"
import LAMP from "lamp-core"
import Login from "./Login"
import Messages from "./Messages"
import Root from "./Admin/Index"
import Researcher from "./Researcher/Index"
import Participant from "./Participant"
import DataPortal from "./data_portal/DataPortal"
import NavigationLayout from "./NavigationLayout"
import NotificationPage from "./NotificationPage"
import { useTranslation } from "react-i18next"
import { Service } from "./DBService/DBService"
import PatientProfile from "./Researcher/ParticipantList/Profile/PatientProfilePage"
import Activity from "./Researcher/ActivityList/Activity"
import ImportActivity from "./Researcher/ActivityList/ImportActivity"
import PreventPage from "./PreventPage"
import { sensorEventUpdate } from "./BottomMenu"
import TwoFA from "./TwoFA"
import demo_db from "../demo_db.json"
import self_help_db from "../self_help_db.json"
import ConfirmModal from "./shared/ConfirmModal"

function ErrorFallback({ error }) {
  const [trace, setTrace] = useState([])
  const { t } = useTranslation()

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
        {/* <code style={{ fontSize: "16px" }}>
          {error.message.match(/^\w*:/) || !error.name ? error.message : error.name + ": " + error.message}
        </code>
        <br />
        <code style={{ color: "#fff" }}>
          {trace.length > 0 ? trace.map((x) => x.toString()).join("\n") : "Generating stacktrace..."}
        </code> */}
        <code>{`${t("An unexpected error occured. Please try again.")}`}</code>
        <br />
        {/* <code>
          mindLAMP Version: `v${process.env.REACT_APP_GIT_NUM} (${process.env.REACT_APP_GIT_SHA})`
        </code> */}
        <br />
        <a style={{ fontSize: "16px" }} href="javascript:void(0)" onClick={() => window.location.reload()}>
          {`${t("Back to page.")}`}
        </a>
      </pre>
    </div>
  )
}
function PageTitle({ children, ...props }) {
  useEffect(() => {
    document.title = `${typeof children === "string" ? children : ""}`
  })
  return <React.Fragment>{null}</React.Fragment>
}
export const changeCase = (text) => {
  if (!!text) {
    let result = text.replace(/([A-Z])/g, " $1")
    result = text.replace(/_/g, " ")
    result = result.charAt(0).toUpperCase() + result.slice(1)
    return result
  }
  return ""
}
function AppRouter({ setConfirmSession, ...props }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isAuthenticated, setAuthenticated] = useState<boolean>(false)
  const search = useLocation().search
  const location: any = useLocation()

  useEffect(() => {
    const isLoginPage = location.pathname === "/"
    localStorage.setItem("isLoginPage", JSON.stringify(isLoginPage))

    try {
      if (window.self !== window.top) {
        window.top?.location.replace(window.location.href)
      }
    } catch (error) {
      console.log(error)
    }
    const userToken: any = JSON.parse(sessionStorage.getItem("tokenInfo"))
    const hasRoleFlag = localStorage.getItem("isParticipant")

    if (userToken && !hasRoleFlag) {
      const firstPath = window.location.hash
      const participantRegex = /^#\/participant\/[^\/]+\/assess$/

      if (participantRegex.test(firstPath)) {
        localStorage.setItem("isParticipant", "true")
      } else {
        localStorage.setItem("isParticipant", "false")
      }
    }
    if (
      LAMP.Auth?._auth?.serverAddress !== "demo.lamp.digital" &&
      location?.pathname === "/" &&
      !userToken?.accessToken
    ) {
      reset()
    }
  }, [location?.pathname])
  // To set page titile for active tab for menu
  let activeTab = (newTab?: string, participantId?: string) => {
    if (window.location.href.indexOf("participant") >= 0) {
      setState((state) => ({
        ...state,
        activeTab: newTab ?? "assess",
      }))
      window.location.href = `/#/participant/${participantId}/${(newTab ?? "assess").toLowerCase()}`
    }
  }

  let changeResearcherType = (type: string) => {
    setState((state) => ({
      ...state,
      researcherType: type,
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
    researcherType: "clinician",
    adminType: "admin",
  })
  const [store, setStore] = useState({ researchers: [], participants: [] })
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const storeRef = useRef([])
  const [showDemoMessage, setShowDemoMessage] = useState(true)
  const { t } = useTranslation()
  const serverAddressFro2FA = ["api-staging.lamp.digital", "api.lamp.digital", "lamp-api.zcodemo.com"]
  const [loading, setLoading] = useState(false)
  const [participantSelected, setParticipantSelected] = useState(false)
  useEffect(() => {
    setParticipantSelected(false)
    if (localStorage.getItem("demo_mode") === "try_it") {
      LAMP.initializeDemoDB(demo_db)
    } else if (localStorage.getItem("demo_mode") === "self_help") {
      LAMP.initializeDemoDB(self_help_db)
    }
    let query = window.location.hash.split("?")
    if (!!query && query.length > 1) {
      setLoading(true)
      let src = Object.fromEntries(new URLSearchParams(query[1]))["src"]
      if (typeof src === "string" && src.length > 0) {
        enqueueSnackbar(`${t("You're using the src server to log into mindLAMP.", { src: src })}`, { variant: "info" })
      }
      let values = Object.fromEntries(new URLSearchParams(query[1]))
      if (!!values["mode"]) {
        refreshPage()
        setLoading(false)
        return
      }
      let a = Object.fromEntries(new URLSearchParams(query[1]))["a"]
      if (a === undefined) window.location.href = "/#/"
      let x = atob(a).split(":")
      const userName = x[0].trim()
      const password = x[1].trim()

      ;(async () => {
        await LAMP.Auth.set_identity({
          id: userName,
          password: password,
          serverAddress:
            x.length > 2 && typeof x[2] !== "undefined"
              ? x[2] + (x.length > 3 && typeof x[3] !== "undefined" ? ":" + x[3] : "")
              : "api.lamp.digital",
        })
        if (userName && password) {
          try {
            const res = await LAMP.Credential.login(userName, password)
            sessionStorage.setItem(
              "tokenInfo",
              JSON.stringify({ accessToken: res?.data?.access_token, refreshToken: res?.data?.refresh_token })
            )
            setAuthenticated(true)
            reset({
              id: x[0],
              password: x[1],
              serverAddress:
                x.length > 2 && typeof x[2] !== "undefined"
                  ? x[2] + (x.length > 3 && typeof x[3] !== "undefined" ? ":" + x[3] : "")
                  : "api.lamp.digital",
            }).then((x) => {
              window.location.href = query[0]
              setLoading(false)
            })
          } catch (error) {
            setLoading(false)
            enqueueSnackbar(`${t("Some error occured. Please login again")}`, {
              variant: "error",
            })
            window.location.href = "/#/"
            console.log(error)
          }
        } else {
          setLoading(false)
        }
      })()
    } else if (!state.identity) {
      refreshPage()
      setLoading(false)
    }
    document.addEventListener("visibilitychange", function logData() {
      if (document.visibilityState === "hidden") {
        sensorEventUpdate(null, (LAMP.Auth._me as any)?.id, null)
      } else {
        let hrefloc = window.location.href.split("/")[window.location.href.split("/").length - 1]
        hrefloc.split("?").length > 1
          ? sensorEventUpdate(state.activeTab, (LAMP.Auth._me as any)?.id, hrefloc.split("?")[0])
          : sensorEventUpdate(hrefloc.split("?")[0], (LAMP.Auth._me as any)?.id, null)
      }
    })
    window.addEventListener("beforeinstallprompt", (e) => setDeferredPrompt(e))
  }, [])

  const refreshPage = () => {
    LAMP.Auth.refresh_identity().then((x) => {
      getAdminType()
      setState((state) => ({
        ...state,
        identity: LAMP.Auth._me,
        auth: LAMP.Auth._auth,
        authType: LAMP.Auth._type,
        activeTab: LAMP.Auth._type === "participant" ? "assess" : "users",
      }))
    })
  }

  const getAdminType = async () => {
    LAMP.Type.getAttachment(null, "lamp.dashboard.admin_permissions").then((res: any) => {
      if (res?.data) {
        let checked = false
        Object.keys(res.data).map((key) => {
          if (res.data[key].hasOwnProperty((LAMP.Auth._auth as any).id)) {
            const id = Object.keys(res.data[key])[0]
            checked = true
            setState((state) => ({
              ...state,
              adminType:
                res.data[key][id] === "view" ? "practice_lead" : res.data[key][id] === "edit" ? "user_admin" : "admin",
            }))
          }
        })
        if (!checked) {
          setState((state) => ({
            ...state,
            adminType: "admin",
          }))
        }
      } else {
        setState((state) => ({
          ...state,
          adminType: "admin",
        }))
      }
    })
  }

  useEffect(() => {
    if (!deferredPrompt) return
    enqueueSnackbar(`${t("Add mindLAMP to your home screen?")}`, {
      variant: "info",
      persist: true,
      action: (key) => (
        <React.Fragment>
          <Button style={{ color: "#fff" }} onClick={promptInstall}>
            {`${t("Install")}`}
          </Button>
          <Button style={{ color: "#fff" }} onClick={() => closeSnackbar(key)}>
            {`${t("Dismiss")}`}
          </Button>
        </React.Fragment>
      ),
    })
  }, [deferredPrompt])

  useEffect(() => {
    closeSnackbar("admin")
    if (!showDemoMessage) closeSnackbar("demo")
    let status = false
    if (typeof localStorage.getItem("verified") !== undefined) {
      status = JSON.parse(localStorage.getItem("verified"))?.value ?? false
    }
    if (
      !!state.identity &&
      (serverAddressFro2FA.includes(state.auth?.serverAddress) || typeof state.auth?.serverAddress === "undefined") &&
      state.authType !== "participant" &&
      !participantSelected &&
      !status &&
      isAuthenticated
    ) {
      window.location.href = "/#/2fa"
    }
    if (!!state.identity && state.authType === "admin") {
      enqueueSnackbar(`${t("Proceed with caution: you are logged in as the administrator.")}`, {
        key: "admin",
        variant: "info",
        persist: true,
        preventDuplicate: true,
        action: (key) => (
          <Button style={{ color: "#fff" }} onClick={() => closeSnackbar(key)}>
            {`${t("Dismiss")}`}
          </Button>
        ),
      })
    } else if (showDemoMessage && state.auth?.serverAddress === "demo.lamp.digital") {
      enqueueSnackbar(
        `${t("You're logged into a demo account. Any changes you make will be reset when you restart the app.")}`,
        {
          key: "demo",
          variant: "info",
          persist: true,
          preventDuplicate: true,
          action: (key) => (
            <Button style={{ color: "#fff" }} onClick={() => closeSnackbar(key)}>
              {`${t("Dismiss")}`}
            </Button>
          ),
        }
      )
    }
  }, [state])

  const logout = async () => {
    const token = sessionStorage.getItem("tokenInfo")
    try {
      await LAMP.Credential.logout(token)
    } catch (err) {
      console.error("Logout failed:", err)
    } finally {
      await reset()
    }
  }

  let reset = async (identity?: any) => {
    if (identity?.id != "selfHelp@demo.lamp.digital") {
      Service.deleteUserDB()
    }
    Service.deleteUserDB()
    Service.deleteDB()
    if (typeof identity === "undefined" && LAMP.Auth._type === "participant") {
      await sensorEventUpdate(null, (state.identity as any)?.id ?? null, null)
      !!(state.identity as any)?.id &&
        (await LAMP.SensorEvent.create((state.identity as any)?.id ?? null, {
          timestamp: Date.now(),
          sensor: "lamp.analytics",
          data: {
            type: "logout",
            device_type: "Dashboard",
            user_agent: `LAMP-dashboard/${process.env.REACT_APP_GIT_SHA} ${window.navigator.userAgent}`,
          },
        } as any).then((res) => sessionStorage.removeItem("tokenInfo")))
    }

    await LAMP.Auth.set_identity(identity).catch((e) => {
      enqueueSnackbar(`${t("Invalid id or password.")}`, {
        variant: "error",
      })
      return
    })

    if (!!identity) {
      getAdminType()
      let type = {
        identity: LAMP.Auth._me,
        auth: LAMP.Auth._auth,
        authType: LAMP.Auth._type,
        activeTab: LAMP.Auth._type === "participant" ? "assess" : "users",
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
        lastDomain: ["api.lamp.digital", "demo.lamp.digital"]?.includes(state?.auth?.serverAddress)
          ? undefined
          : state?.auth?.serverAddress,
      }))
      localStorage.setItem("verified", JSON.stringify({ value: false }))
      sessionStorage.removeItem("tokenInfo")
      localStorage.removeItem("isParticipant")
      localStorage.removeItem("isLoginPage")
      window.location.href = "/#/"
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
      LAMP.Researcher.view(id).then((x) => {
        setStore({
          researchers: { ...store.researchers, [id]: x },
          participants: store.participants,
        })
      })
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
      LAMP.Participant.view(id).then((x) => {
        setStore({
          researchers: store.researchers,
          participants: { ...store.participants, [id]: x },
        })
      })
      storeRef.current = [...storeRef.current, id]
    }
    return null
  }

  const submitSurvey = () => {
    setState((state) => ({
      ...state,
      surveyDone: true,
    }))
  }

  const setServerAddress = (address) => {
    setState((state) => ({
      ...state,
      lastDomain: true,
    }))
  }

  const promptInstall = () => {
    if (deferredPrompt === null) return
    deferredPrompt.prompt()
    deferredPrompt.userChoice.then((c) => {
      if (c.outcome === "accepted") {
        enqueueSnackbar(`${t("mindLAMP will be installed on your device.")}`, {
          variant: "info",
        })
      } else {
        enqueueSnackbar(`${t("mindLAMP will not be installed on your device.")}`, {
          variant: "warning",
        })
      }
      setDeferredPrompt(null)
    })
  }

  const updateStore = (id: string) => {
    if (!!store?.researchers[id]) {
      LAMP.Researcher.view(id).then((x) => {
        setStore({
          researchers: { ...store.researchers, [id]: x },
          participants: store.participants,
        })
      })
    }
  }

  return (
    <>
      {!!loading ? (
        <Backdrop
          style={{
            zIndex: 9999,
            color: "#fff",
          }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <Switch>
          <Route
            exact
            path="/participant/:id/messages"
            render={(props) =>
              !state.identity ? (
                <React.Fragment>
                  <PageTitle>mindLAMP | {`${t("Login")}`}</PageTitle>
                  <Login
                    setIdentity={async (identity) => !!identity && (await reset(identity))}
                    lastDomain={state.lastDomain}
                    onComplete={() => {
                      props.history.replace("/")
                    }}
                    setAuthenticated={setAuthenticated}
                    setConfirmSession={setConfirmSession}
                  />
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <PageTitle>mindLAMP | {`${t("Messages")}`}</PageTitle>
                  <Messages
                    style={{ margin: "0px -16px -16px -16px" }}
                    refresh={true}
                    participantOnly
                    participant={getParticipant(props.match.params.id)?.id ?? null}
                  />
                </React.Fragment>
              )
            }
          />

          <Route
            exact
            path="/2fa"
            render={(props) =>
              !state.identity ? (
                <React.Fragment>
                  <PageTitle>mindLAMP | {`${t("Login")}`}</PageTitle>
                  <Login
                    setIdentity={async (identity) => !!identity && (await reset(identity))}
                    lastDomain={state.lastDomain}
                    onComplete={() => props.history.replace("/")}
                    setAuthenticated={setAuthenticated}
                    setConfirmSession={setConfirmSession}
                  />
                </React.Fragment>
              ) : state.authType === "participant" ? (
                <Redirect to="/participant/me/assess" />
              ) : (
                <React.Fragment>
                  <PageTitle>mindLAMP | {`${t("2FA")}`}</PageTitle>
                  <TwoFA
                    onLogout={() => logout()}
                    onComplete={() => {
                      localStorage.setItem("verified", JSON.stringify({ value: true }))

                      state.authType === "admin"
                        ? props.history.replace("/researcher")
                        : props.history.replace("/researcher/me/users")
                    }}
                  />
                </React.Fragment>
              )
            }
          />

          <Route
            exact
            path="/participant/:id/activity/:activityId"
            render={(props) =>
              !state.identity ? (
                <React.Fragment>
                  <PageTitle>mindLAMP | {t("Login")}</PageTitle>
                  <Login
                    setIdentity={async (identity) => !!identity && (await reset(identity))}
                    lastDomain={state.lastDomain}
                    onComplete={() => props.history.replace("/")}
                    setAuthenticated={setAuthenticated}
                    setConfirmSession={setConfirmSession}
                  />
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <NotificationPage
                    participant={props.match.params.id}
                    activityId={props.match.params.activityId}
                    mode={new URLSearchParams(search).get("mode")}
                    tab={state.activeTab}
                  />
                </React.Fragment>
              )
            }
          />

          <Route
            exact
            path="/researcher/:rid/activity/import"
            render={(props) =>
              !state.identity ? (
                <React.Fragment>
                  <PageTitle>mindLAMP | {`${t("Login")}`}</PageTitle>
                  <Login
                    setIdentity={async (identity) => !!identity && (await reset(identity))}
                    lastDomain={state.lastDomain}
                    onComplete={() => props.history.replace("/")}
                    setAuthenticated={setAuthenticated}
                    setConfirmSession={setConfirmSession}
                  />
                </React.Fragment>
              ) : (serverAddressFro2FA.includes(state.auth?.serverAddress) ||
                  typeof state.auth?.serverAddress === "undefined") &&
                JSON.parse(localStorage.getItem("verified"))?.value === false ? (
                <React.Fragment>
                  <PageTitle>mindLAMP | {`${t("2FA")}`}</PageTitle>
                  <TwoFA
                    onLogout={() => logout()}
                    onComplete={() => {
                      localStorage.setItem("verified", JSON.stringify({ value: true }))
                      state.authType === "admin"
                        ? props.history.replace("/researcher")
                        : props.history.replace("/researcher/me/users")
                    }}
                  />
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <ImportActivity />
                </React.Fragment>
              )
            }
          />
          <Route
            exact
            path="/researcher/:rid/activity/add/:type"
            render={(props) =>
              !state.identity ? (
                <React.Fragment>
                  <PageTitle>mindLAMP | {`${t("Login")}`}</PageTitle>
                  <Login
                    setIdentity={async (identity) => !!identity && (await reset(identity))}
                    lastDomain={state.lastDomain}
                    onComplete={() => props.history.replace("/")}
                    setAuthenticated={setAuthenticated}
                    setConfirmSession={setConfirmSession}
                  />
                </React.Fragment>
              ) : (serverAddressFro2FA.includes(state.auth?.serverAddress) ||
                  typeof state.auth?.serverAddress === "undefined") &&
                JSON.parse(localStorage.getItem("verified"))?.value === false ? (
                <React.Fragment>
                  <PageTitle>mindLAMP | {`${t("2FA")}`}</PageTitle>
                  <TwoFA
                    onLogout={() => logout()}
                    onComplete={() => {
                      localStorage.setItem("verified", JSON.stringify({ value: true }))
                      state.authType === "admin"
                        ? props.history.replace("/researcher")
                        : props.history.replace("/researcher/me/users")
                    }}
                  />
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Activity type={props.match.params.type} researcherId={props.match.params.rid} />
                </React.Fragment>
              )
            }
          />

          <Route
            exact
            path="/researcher/:rid/participant/:id/settings"
            render={(props) =>
              !state.identity ? (
                <React.Fragment>
                  <PageTitle>mindLAMP | {`${t("Login")}`}</PageTitle>
                  <Login
                    setIdentity={async (identity) => !!identity && (await reset(identity))}
                    lastDomain={state.lastDomain}
                    onComplete={() => props.history.replace("/")}
                    setAuthenticated={setAuthenticated}
                    setConfirmSession={setConfirmSession}
                  />
                </React.Fragment>
              ) : (serverAddressFro2FA.includes(state.auth?.serverAddress) ||
                  typeof state.auth?.serverAddress === "undefined") &&
                JSON.parse(localStorage.getItem("verified"))?.value === false ? (
                <React.Fragment>
                  <PageTitle>mindLAMP | {`${t("2FA")}`}</PageTitle>
                  <TwoFA
                    onLogout={() => logout()}
                    onComplete={() => {
                      localStorage.setItem("verified", JSON.stringify({ value: true }))
                      state.authType === "admin"
                        ? props.history.replace("/researcher")
                        : props.history.replace("/researcher/me/users")
                    }}
                  />
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <PatientProfile researcherId={props.match.params.rid} participantId={props.match.params.id} />
                </React.Fragment>
              )
            }
          />
          <Route
            exact
            path="/researcher/:rid/activity/:id"
            render={(props) =>
              !state.identity ? (
                <React.Fragment>
                  <PageTitle>mindLAMP | {`${t("Login")}`}</PageTitle>
                  <Login
                    setIdentity={async (identity) => !!identity && (await reset(identity))}
                    lastDomain={state.lastDomain}
                    onComplete={() => props.history.replace("/")}
                    setAuthenticated={setAuthenticated}
                    setConfirmSession={setConfirmSession}
                  />
                </React.Fragment>
              ) : (serverAddressFro2FA.includes(state.auth?.serverAddress) ||
                  typeof state.auth?.serverAddress === "undefined") &&
                JSON.parse(localStorage.getItem("verified"))?.value === false ? (
                <React.Fragment>
                  <PageTitle>mindLAMP | {`${t("2FA")}`}</PageTitle>
                  <TwoFA
                    onLogout={() => logout()}
                    onComplete={() => {
                      localStorage.setItem("verified", JSON.stringify({ value: true }))
                      state.authType === "admin"
                        ? props.history.replace("/researcher")
                        : props.history.replace("/researcher/me/users")
                    }}
                  />
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Activity id={props.match.params.id} researcherId={props.match.params.rid} />
                </React.Fragment>
              )
            }
          />
          {/* Route index => login or home (which redirects based on user type). */}
          <Route
            exact
            path="/"
            render={(props) =>
              !(window.location.hash.split("?").length > 1 && !state.identity) ? (
                !state.identity ? (
                  <React.Fragment>
                    <PageTitle>mindLAMP | {`${t("Login")}`}</PageTitle>
                    <Login
                      setIdentity={async (identity) => !!identity && (await reset(identity))}
                      lastDomain={state.lastDomain}
                      onComplete={() => props.history.replace("/")}
                      setAuthenticated={setAuthenticated}
                      setConfirmSession={setConfirmSession}
                    />
                  </React.Fragment>
                ) : (serverAddressFro2FA.includes(state.auth?.serverAddress) ||
                    typeof state.auth?.serverAddress === "undefined") &&
                  JSON.parse(localStorage.getItem("verified"))?.value === false &&
                  state.authType !== "participant" ? (
                  <React.Fragment>
                    <PageTitle>mindLAMP | {`${t("2FA")}`}</PageTitle>
                    <TwoFA
                      onLogout={() => logout()}
                      onComplete={() => {
                        localStorage.setItem("verified", JSON.stringify({ value: true }))
                        state.authType === "admin"
                          ? props.history.replace("/researcher")
                          : props.history.replace("/researcher/me/users")
                      }}
                    />
                  </React.Fragment>
                ) : state.authType === "admin" ? (
                  <Redirect to="/researcher" />
                ) : state.authType === "researcher" ? (
                  <Redirect to="/researcher/me/users" />
                ) : (
                  <Redirect to="/participant/me/assess" />
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
                  <PageTitle>mindLAMP | {`${t("Login")}`}</PageTitle>
                  <Login
                    setIdentity={async (identity) => !!identity && (await reset(identity))}
                    lastDomain={state.lastDomain}
                    onComplete={() => props.history.replace("/")}
                    setAuthenticated={setAuthenticated}
                    setConfirmSession={setConfirmSession}
                  />
                </React.Fragment>
              ) : (serverAddressFro2FA.includes(state.auth?.serverAddress) ||
                  typeof state.auth?.serverAddress === "undefined") &&
                JSON.parse(localStorage.getItem("verified"))?.value === false ? (
                <React.Fragment>
                  <PageTitle>mindLAMP | {`${t("2FA")}`}</PageTitle>
                  <TwoFA
                    onLogout={() => logout()}
                    onComplete={() => {
                      localStorage.setItem("verified", JSON.stringify({ value: true }))
                      state.authType === "admin"
                        ? props.history.replace("/researcher")
                        : props.history.replace("/researcher/me/users")
                    }}
                  />
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <PageTitle>{`${t("Administrator")}`}</PageTitle>
                  <NavigationLayout
                    authType={state.authType}
                    title={
                      state.adminType === "admin"
                        ? "Administrator"
                        : state.adminType === "practice_lead"
                        ? "Practice Lead"
                        : "User Administrator"
                    }
                    goBack={props.history.goBack}
                    onLogout={() => logout()}
                  >
                    <Root {...props} updateStore={updateStore} adminType={state.adminType} />
                  </NavigationLayout>
                </React.Fragment>
              )
            }
          />
          <Route
            exact
            path="/researcher/:id/:tab"
            render={(props) =>
              !state.identity ? (
                <React.Fragment>
                  <PageTitle>mindLAMP | {`${t("Login")}`}</PageTitle>
                  <Login
                    setIdentity={async (identity) => !!identity && (await reset(identity))}
                    lastDomain={state.lastDomain}
                    onComplete={() => props.history.replace("/")}
                    setAuthenticated={setAuthenticated}
                    setConfirmSession={setConfirmSession}
                  />
                </React.Fragment>
              ) : (serverAddressFro2FA.includes(state.auth?.serverAddress) ||
                  typeof state.auth?.serverAddress === "undefined") &&
                JSON.parse(localStorage.getItem("verified"))?.value === false ? (
                <React.Fragment>
                  <PageTitle>mindLAMP | {`${t("2FA")}`}</PageTitle>
                  <TwoFA
                    onLogout={() => logout()}
                    onComplete={() => {
                      localStorage.setItem("verified", JSON.stringify({ value: true }))
                      state.authType === "admin"
                        ? props.history.replace("/researcher")
                        : props.history.replace("/researcher/me/users")
                    }}
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
                    onLogout={() => logout()}
                    activeTab="Researcher"
                    sameLineTitle={true}
                    changeResearcherType={changeResearcherType}
                  >
                    <Researcher
                      researcher={getResearcher(props.match.params.id)}
                      onParticipantSelect={(id) => {
                        ;(async () => {
                          setParticipantSelected(true)
                          await Service.deleteUserDB()
                          setState((state) => ({
                            ...state,
                            activeTab: 3,
                          }))
                          props.history.push(`/participant/${id}/portal`)
                        })()
                      }}
                      mode={"researcher"} // Defaulting to researcher mode for now {state.researcherType}
                      tab={props.match.params.tab}
                    />
                  </NavigationLayout>
                </React.Fragment>
              )
            }
          />

          <Route
            exact
            path="/data_portal"
            render={(props) =>
              !state.identity || (state.authType !== "admin" && state.authType !== "researcher") ? (
                <React.Fragment>
                  <PageTitle>mindLAMP | {`${t("Login")}`}</PageTitle>
                  <Login
                    setIdentity={async (identity) => !!identity && (await reset(identity))}
                    lastDomain={state.lastDomain}
                    onComplete={() => props.history.replace("/data_portal")}
                    setAuthenticated={setAuthenticated}
                    setConfirmSession={setConfirmSession}
                  />
                </React.Fragment>
              ) : (serverAddressFro2FA.includes(state.auth?.serverAddress) ||
                  typeof state.auth?.serverAddress === "undefined") &&
                JSON.parse(localStorage.getItem("verified"))?.value === false ? (
                <React.Fragment>
                  <PageTitle>mindLAMP | {`${t("2FA")}`}</PageTitle>
                  <TwoFA
                    onLogout={() => logout()}
                    onComplete={() => {
                      localStorage.setItem("verified", JSON.stringify({ value: true }))
                      state.authType === "admin"
                        ? props.history.replace("/researcher")
                        : props.history.replace("/researcher/me/users")
                    }}
                  />
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <PageTitle>Data Portal</PageTitle>
                  <DataPortal
                    standalone
                    token={{
                      username: LAMP.Auth._auth.id,
                      password: LAMP.Auth._auth.password,
                      server: LAMP.Auth._auth.serverAddress ? LAMP.Auth._auth.serverAddress : "api.lamp.digital",
                      type: state.authType === "admin" ? "Administrator" : "Researcher",
                      //@ts-ignore: state.identity will have an id param if not admin
                      id: state.authType === "admin" ? null : state.identity.id,
                      //@ts-ignore: state.identity will have an name param if not admin
                      name: state.authType === "admin" ? "Administrator" : state.identity.name,
                    }}
                    onLogout={() => logout()}
                  />
                </React.Fragment>
              )
            }
          />

          <Route
            exact
            path="/participant/:id/:tab"
            render={(props) =>
              !state.identity || !getParticipant(props.match.params.id) ? (
                <React.Fragment>
                  <PageTitle>mindLAMP | {`${t("Login")}`}</PageTitle>
                  <Login
                    setIdentity={async (identity) => !!identity && (await reset(identity))}
                    lastDomain={state.lastDomain}
                    onComplete={() => props.history.replace("/")}
                    setAuthenticated={setAuthenticated}
                    setConfirmSession={setConfirmSession}
                  />
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <PageTitle>{`${t("User number", { number: getParticipant(props.match.params.id).id })}`}</PageTitle>
                  <NavigationLayout
                    authType={state.authType}
                    id={props.match.params.id}
                    title={`User ${getParticipant(props.match.params.id).id}`}
                    // name={
                    //   getParticipant(props.match.params.id)?.alias ||
                    //   getParticipant(props.match.params.id)?.name ||
                    //   getParticipant(props.match.params.id)?.id
                    // }
                    goBack={props.history.goBack}
                    onLogout={() => logout()}
                    activeTab={state.activeTab ?? "assess"}
                    // participant={getParticipant(props.match.params.id)}
                  >
                    <Participant
                      participant={getParticipant(props.match.params.id)}
                      activeTab={activeTab}
                      tabValue={props.match.params.tab ?? "assess"}
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

          <Route
            exact
            path="/participant/:id/portal/activity/:activityId"
            render={(props) =>
              !state.identity ? (
                <React.Fragment>
                  <PageTitle>mindLAMP | {`${t("Login")}`}</PageTitle>
                  <Login
                    setIdentity={async (identity) => !!identity && (await reset(identity))}
                    lastDomain={state.lastDomain}
                    onComplete={() => props.history.replace("/")}
                    setAuthenticated={setAuthenticated}
                    setConfirmSession={setConfirmSession}
                  />
                </React.Fragment>
              ) : !getParticipant(props.match.params.id) ? (
                <React.Fragment />
              ) : (
                <React.Fragment>
                  <PageTitle>{`${t("User number", { number: getParticipant(props.match.params.id).id })}`}</PageTitle>
                  <PreventPage
                    type="activity"
                    activityId={props.match.params.activityId}
                    participantId={props.match.params.id}
                  />
                </React.Fragment>
              )
            }
          />

          <Route
            exact
            path="/participant/:id/portal/sensor/:spec"
            render={(props) =>
              !state.identity ? (
                <React.Fragment>
                  <PageTitle>mindLAMP | {`${t("Login")}`}</PageTitle>
                  <Login
                    setIdentity={async (identity) => !!identity && (await reset(identity))}
                    lastDomain={state.lastDomain}
                    onComplete={() => props.history.replace("/")}
                    setAuthenticated={setAuthenticated}
                    setConfirmSession={setConfirmSession}
                  />
                </React.Fragment>
              ) : !getParticipant(props.match.params.id) ? (
                <React.Fragment />
              ) : (
                <React.Fragment>
                  <PageTitle>{`${t("User number", { number: getParticipant(props.match.params.id).id })}`}</PageTitle>
                  <PreventPage
                    type="sensor"
                    activityId={props.match.params.spec}
                    participantId={props.match.params.id}
                  />
                </React.Fragment>
              )
            }
          />
        </Switch>
      )}
    </>
  )
}

export default function App({ ...props }) {
  // const INACTIVITY_LIMIT = 30 * 60 * 1000 // 5 minutes
  // let inactivityTimer: ReturnType<typeof setTimeout> | null = null

  // const resetInactivityTimer = () => {
  //   clearTimeout(inactivityTimer)
  //   inactivityTimer = setTimeout(() => {
  //     localStorage.getItem("isParticipant") === "false"
  //     if (localStorage.getItem("isLoginPage") === "false" && localStorage.getItem("isParticipant") === "false") {
  //       alert("Your session has expired. Please login again to continue.")
  //       window.location.href = "/#/"
  //       localStorage.removeItem("isParticipant")
  //       localStorage.removeItem("tokenInfo")
  //     }
  //   }, INACTIVITY_LIMIT)
  // }
  // const activityEvents = ["mousemove", "mousedown", "keydown", "touchstart"]
  // activityEvents.forEach((event) => window.addEventListener(event, resetInactivityTimer))

  // resetInactivityTimer()

  const [confirmSession, setConfirmSession] = useState(false)

  const onMouseMove = () => {
    localStorage.setItem("mousemoved", JSON.stringify(Date.now()))
  }

  useEffect(() => {
    setConfirmSession(false)
  }, [location?.pathname])

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove)
    return () => window.removeEventListener("mousemove", onMouseMove)
  }, [])

  useEffect(() => {
    if (confirmSession) {
      const timeout = setTimeout(() => {
        setConfirmSession(false)
        goBackToHome()
      }, 60 * 1000)

      return () => clearTimeout(timeout)
    } else {
      const interval = setInterval(() => {
        const moved = parseInt(localStorage.getItem("mousemoved") || "0")
        const now = Date.now()
        const inactiveMinutes = (now - moved) / 60000
        if (
          inactiveMinutes > 15 &&
          !confirmSession &&
          localStorage.getItem("isLoginPage") === "false" &&
          localStorage.getItem("isParticipant") === "false"
        ) {
          setConfirmSession(true)
        }
      }, 60 * 1000)

      return () => clearInterval(interval)
    }
  }, [confirmSession])

  const goBackToHome = () => {
    setConfirmSession(false)
    sessionStorage.removeItem("tokenInfo")
    localStorage.removeItem("expiry")
    window.location.href = "/#/"
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ThemeProvider
        theme={createTheme({
          typography: {
            fontFamily: ["Inter", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
          },
          palette: {
            primary: colors.blue,
            secondary: {
              main: "#333",
            },
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
            MuiFilledInput: {
              root: {
                border: 0,
                backgroundColor: "#f4f4f4",
              },
              underline: {
                "&&&:before": {
                  borderBottom: "none",
                },
                "&&:after": {
                  borderBottom: "none",
                },
              },
            },
            MuiTextField: {
              root: { width: "100%" },
            },
            MuiTableCell: {
              root: {
                borderBottom: "#fff solid 1px",
                padding: 10,
              },
            },
            MuiTypography: {
              h6: { fontSize: 16, fontWeight: 600 },
            },
            MuiDivider: {
              root: { margin: "25px 0" },
            },
            MuiStepper: {
              root: { paddingLeft: 8 },
            },
          },
        })}
      >
        <CssBaseline />
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <SnackbarProvider>
            <ConfirmModal
              confirm={confirmSession}
              title="Confirm Session"
              text="Your session has expired. Do you want to continue or logout?"
              confirmText="Continue"
              cancelText="Logout"
              handleConfirm={() => {
                localStorage.setItem("mousemoved", JSON.stringify(Date.now()))
                setConfirmSession(false)
              }}
              onCancel={goBackToHome}
              onClose={() => setConfirmSession(false)}
            />
            <HashRouter>
              <AppRouter {...props} setConfirmSession={setConfirmSession} />
            </HashRouter>
          </SnackbarProvider>
        </MuiPickersUtilsProvider>
        {/* <span
          style={{
            position: "fixed",
            bottom: 16,
            left: 16,
            fontSize: "8",
            zIndex: -1,
            opacity: 0.1,
          }}
        >
          {`v${process.env.REACT_APP_GIT_NUM} (${process.env.REACT_APP_GIT_SHA})}`}
        </span> */}
      </ThemeProvider>
    </ErrorBoundary>
  )
}
