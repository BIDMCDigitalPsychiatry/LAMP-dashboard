import React, { useEffect, useState } from "react"
import { Box, Card, CardActionArea, CardContent, Typography, TextField, makeStyles, createStyles, Theme } from "@material-ui/core"
import { useTranslation } from "react-i18next"
import LoginFrame, { useLoginStyles } from "./LoginFrame"
import MindLAMPLogo from "../icons/Logo.svg"
import MountSinaiLogo from "../icons/MountSinai.png"
import OxfordHealthLogo from "../icons/OxfordHealth.png"
import LevelUpLogo from "../icons/LevelUp.png"
import AmpSczLogo from "../icons/AMP Scz.jpeg"
import LAMP from "lamp-core"

// Each card represents a deployment a participant can connect to.
// - If dashboardUrl is empty (or points at our own dashboard) we stay here and
//   set the API server via LAMP.Auth.set_server() — which probes /server-info and
//   auto-selects the session or basic auth scheme for that server.
// - If dashboardUrl is external we redirect the WebView to that dashboard entirely,
//   forwarding any ?a= auth-link param so the destination can restore the session.
export type ServerOption = {
  name: string
  description?: string
  logo?: string
  dashboardUrl?: string // external dashboard URL — if empty, use our dashboard
  apiServerUrl: string // the LAMP API server address
}

export const KNOWN_SERVERS: ServerOption[] = [
  {
    name: "mindLAMP",
    description: "Beth Israel Deaconess Medical Center",
    logo: MindLAMPLogo,
    apiServerUrl: "api.lamp.digital",
  },
  {
    name: "ProCAN",
    description: "Psychosis Risk Outcomes Network",
    logo: AmpSczLogo,
    dashboardUrl: "https://mindlamp.procan.med.yale.edu",
    apiServerUrl: "mindlamp-api.procan.med.yale.edu",
  },
  {
    name: "PREDiCTOR",
    description: "Mount Sinai Health System",
    logo: MountSinaiLogo,
    apiServerUrl: "api.mshai.org",
  },
  {
    name: "LevelUp",
    description: "Henry Jackson Foundation",
    logo: LevelUpLogo,
    dashboardUrl: "https://mindlamp.armylevelup.app",
    apiServerUrl: "mindlamp-api.armylevelup.app",
  },
  {
    name: "ABHACUS",
    description: "Oxford Health",
    logo: OxfordHealthLogo,
    dashboardUrl: "https://dashboard.abhacus-lamp.com",
    apiServerUrl: "api.abhacus-lamp.com",
  },
  {
    name: "AMP Schizophrenia",
    description: "Psychosis Risk Outcomes Network",
    logo: AmpSczLogo,
    dashboardUrl: "https://mindlamp.pronet.med.yale.edu",
    apiServerUrl: "mindlamp-api.pronet.med.yale.edu",
  },
]

const STORAGE_KEY = "selectedServer"

// A previously selected EXTERNAL server is remembered so cold starts redirect
// straight to that dashboard instead of bouncing through the gateway. Internal
// servers persist via lamp-core's "lastServerSelected" (set by set_server), so
// LoginWorkflow skips the gateway for them on its own.
export function getSavedServer(): ServerOption | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

export function saveServer(server: ServerOption) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(server))
}

export function clearSavedServer() {
  localStorage.removeItem(STORAGE_KEY)
}

// True if this option should hand the WebView off to a different dashboard.
export function isExternalDashboard(server: ServerOption): boolean {
  return !!server.dashboardUrl && !server.dashboardUrl.includes("dashboard.lamp.digital")
}

// Build the redirect URL for an external dashboard, passing through any ?a=
// auth-link param so the destination dashboard can restore the participant's
// session without a fresh login. This is what keeps cross-instance (other basic
// and JWT) deployments logged in through the redirect.
export function buildExternalRedirectUrl(server: ServerOption): string {
  let url = server.dashboardUrl
  const hash = window.location.hash
  if (hash.includes("?")) {
    const params = hash.split("?")[1]
    url += (url.includes("#") ? "" : "/#/") + "?" + params
  }
  return url
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    intro: { fontSize: 14, color: "rgba(0,0,0,0.6)", textAlign: "center", marginBottom: 20 },
    // Single column on phones (unchanged); two columns once the wide LoginFrame
    // variant gives us room on larger viewports.
    cardGrid: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: 12,
      marginBottom: 12,
      [theme.breakpoints.up("sm")]: { gridTemplateColumns: "1fr 1fr" },
    },
    card: {
      borderRadius: 10,
      border: "1px solid #e0e0e0",
      "&:hover": { borderColor: "#7599FF" },
    },
    cardContent: { padding: "16px 20px", display: "flex", alignItems: "center" },
    cardLogo: { width: 40, height: 40, borderRadius: 8, marginRight: 16, objectFit: "contain" },
    cardName: { fontSize: 16, fontWeight: 600 },
    cardDescription: { fontSize: 13, color: "rgba(0,0,0,0.5)" },
    customLink: {
      fontSize: 14,
      color: "#6083E7",
      fontWeight: "bold",
      cursor: "pointer",
      textAlign: "center",
      marginTop: 8,
      marginBottom: 40,
    },
    customSection: { marginTop: 16, marginBottom: 40, padding: "12px 0", borderTop: "1px solid #e0e0e0" },
  })
)

const connectButtonStyle = (disabled: boolean): React.CSSProperties => ({
  background: disabled ? "#ccc" : "#7599FF",
  color: "white",
  border: "none",
  borderRadius: 8,
  padding: "10px 32px",
  fontSize: 15,
  fontWeight: 600,
  cursor: disabled ? "default" : "pointer",
  width: 200,
})

export default function ServerGateway({ onSetServer, srcLockedState }) {
  const { t } = useTranslation()
  const classes = useStyles()
  const loginClasses = useLoginStyles()
  const [, setSrcLocked] = srcLockedState
  const [customServer, setCustomServer] = useState("")
  const [showCustom, setShowCustom] = useState(false)

  // NOTE: the sticky external-server redirect happens pre-mount in src/index.tsx —
  // it must run before App.tsx consumes the ?a= auth-link param at mount.

  useEffect(() => {
    // ?src= deep link forces a specific server and locks the selection.
    const query = window.location.hash.split("?")
    if (!!query && query.length > 1) {
      const src = Object.fromEntries(new URLSearchParams(query[1]))["src"]
      if (typeof src === "string" && src.length > 0) {
        ;(async () => {
          await LAMP.Auth.set_server(src)
          setSrcLocked(true)
          onSetServer()
        })()
      }
    }
  }, [])

  const selectInternal = async (serverAddress: string) => {
    await LAMP.Auth.set_server(serverAddress)
    clearSavedServer()
    onSetServer()
  }

  const handleSelectCard = (server: ServerOption) => {
    if (isExternalDashboard(server)) {
      saveServer(server)
      // iOS WKWebView writes localStorage to disk on a background thread. Navigating
      // cross-origin immediately after setItem can tear down the page before that
      // write commits, losing the sticky selection on the next cold start. Defer the
      // redirect briefly to give the write time to land before we leave the origin.
      setTimeout(() => {
        window.location.replace(buildExternalRedirectUrl(server))
      }, 100)
      return
    }
    selectInternal(server.apiServerUrl)
  }

  const handleCustomConnect = () => {
    if (!customServer) return
    selectInternal(customServer)
  }

  return (
    <LoginFrame wide>
      <Typography className={classes.intro}>{t("Select your organization or study to continue.")}</Typography>

      <Box className={classes.cardGrid}>
        {KNOWN_SERVERS.map((server, i) => (
          <Card key={i} className={classes.card} elevation={0}>
            <CardActionArea onClick={() => handleSelectCard(server)} style={{ height: "100%" }}>
              <CardContent className={classes.cardContent}>
                {server.logo && <img src={server.logo} alt={server.name} className={classes.cardLogo} />}
                <div>
                  <Typography className={classes.cardName}>{server.name}</Typography>
                  {server.description && (
                    <Typography className={classes.cardDescription}>{server.description}</Typography>
                  )}
                </div>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>

      {!showCustom ? (
        <Typography
          className={classes.customLink}
          onClick={() => {
            setShowCustom(true)
            setTimeout(() => {
              document.getElementById("custom-server-input")?.scrollIntoView({ behavior: "smooth", block: "center" })
            }, 100)
          }}
        >
          {t("Connect to a different server")}
        </Typography>
      ) : (
        <Box className={classes.customSection}>
          <TextField
            id="custom-server-input"
            fullWidth
            variant="filled"
            label={t("Server Address")}
            value={customServer}
            onChange={(e) => setCustomServer(e.target.value)}
            placeholder="api.example.com"
            InputProps={{ disableUnderline: true, classes: { root: loginClasses.textfieldStyle } }}
            style={{ marginBottom: 12 }}
          />
          <Box textAlign="center">
            <button onClick={handleCustomConnect} disabled={!customServer} style={connectButtonStyle(!customServer)}>
              {t("Connect")}
            </button>
          </Box>
        </Box>
      )}
    </LoginFrame>
  )
}
