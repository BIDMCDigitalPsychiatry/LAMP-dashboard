import React, { useState } from "react"
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  TextField,
  Fab,
  Typography,
  makeStyles,
  createStyles,
  Theme,
} from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { ResponsiveMargin } from "./Utils"
import { ReactComponent as Logo } from "../icons/Logo.svg"
import { ReactComponent as Logotext } from "../icons/mindLAMP.svg"
import MindLAMPLogo from "../icons/Logo.svg"
import MindBenchLogo from "../icons/MindBench.png"
import MountSinaiLogo from "../icons/MountSinai.png"
import OxfordHealthLogo from "../icons/OxfordHealth.png"
import LAMP from "lamp-core"

// Each card represents a deployment that users can connect to.
// - If dashboardUrl matches our domain (or is empty), we stay on our dashboard and set the API server.
// - If dashboardUrl is external, we redirect the WebView to that dashboard entirely.
export type ServerOption = {
  name: string
  description?: string
  logo?: string
  dashboardUrl?: string // external dashboard URL — if empty, use our dashboard
  apiServerUrl: string // the LAMP API server address
}

const KNOWN_SERVERS: ServerOption[] = [
  {
    name: "mindLAMP",
    description: "Beth Israel Deaconess Medical Center",
    logo: MindLAMPLogo,
    apiServerUrl: "api.lamp.digital",
  },
  {
    name: "PREDiCTOR",
    description: "Mount Sinai Health System",
    logo: MountSinaiLogo,
    apiServerUrl: "api.mshai.org",
  },
  {
    name: "ABHACUS",
    description: "Oxford Health",
    logo: OxfordHealthLogo,
    dashboardUrl: "https://dashboard.abhacus-lamp.com",
    apiServerUrl: "api.abhacus-lamp.com",
  },
  {
    name: "MindBench",
    description: "MindBench",
    logo: MindBenchLogo,
    dashboardUrl: "https://mindbench.ai",
    apiServerUrl: "mindbench.ai",
  },
]

const STORAGE_KEY = "selectedServer"

// Check if user has a previously selected server
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

// Returns true if this server option should redirect to an external dashboard
export function isExternalDashboard(server: ServerOption): boolean {
  return !!server.dashboardUrl && !server.dashboardUrl.includes("dashboard.lamp.digital")
}

// Build the redirect URL for an external dashboard, passing through any ?a= parameter
export function buildExternalRedirectUrl(server: ServerOption): string {
  let url = server.dashboardUrl
  const hash = window.location.hash
  if (hash.includes("?a=")) {
    const params = hash.split("?")[1]
    url += (url.includes("#") ? "" : "/#/") + "?" + params
  }
  return url
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: { minHeight: "90vh", paddingTop: "3%" },
    logoLogin: {
      width: 90,
      margin: "0 auto 30px",
      textAlign: "center",
      [theme.breakpoints.down("xs")]: { width: 69, marginBottom: 30 },
    },
    logoText: {
      width: "100%",
      textAlign: "center",
      marginBottom: 30,
      "& svg": { width: "100%", height: 41, marginBottom: 10 },
    },
    card: {
      marginBottom: 12,
      borderRadius: 10,
      border: "1px solid #e0e0e0",
      "&:hover": { borderColor: "#7599FF" },
    },
    selectedCard: {
      marginBottom: 12,
      borderRadius: 10,
      border: "2px solid #7599FF",
    },
    cardContent: {
      padding: "16px 20px",
    },
    cardName: {
      fontSize: 16,
      fontWeight: 600,
    },
    cardDescription: {
      fontSize: 13,
      color: "rgba(0,0,0,0.5)",
    },
    customSection: {
      marginTop: 16,
      padding: "12px 0",
      borderTop: "1px solid #e0e0e0",
    },
    buttonNav: {
      marginTop: 20,
      "& button": { width: 200, "& span": { textTransform: "capitalize", fontSize: 16, fontWeight: "bold" } },
    },
  })
)

export default function ServerGateway({ onSelectServer }: { onSelectServer: (server: ServerOption) => void }) {
  const { t } = useTranslation()
  const classes = useStyles()
  const [customServer, setCustomServer] = useState("")
  const [showCustom, setShowCustom] = useState(false)

  const handleSelectCard = (server: ServerOption) => {
    saveServer(server)
    onSelectServer(server)
  }

  const handleCustomConnect = () => {
    if (!customServer) return
    const server: ServerOption = {
      name: "Custom",
      apiServerUrl: customServer,
    }
    saveServer(server)
    onSelectServer(server)
  }

  return (
    <ResponsiveMargin style={{ width: "100%", margin: "0 auto" }}>
      <Grid container direction="row" justifyContent="center" alignItems="center" className={classes.container}>
        <Grid item style={{ maxWidth: 360, width: "100%" }}>
          <Box className={classes.logoLogin}>
            <Logo />
          </Box>
          <Box className={classes.logoText}>
            <Logotext />
            <div
              style={{
                height: 6,
                marginBottom: 10,
                background:
                  "linear-gradient(90deg, rgba(255,214,69,1) 0%, rgba(255,214,69,1) 25%, rgba(101,206,191,1) 25%, rgba(101,206,191,1) 50%, rgba(255,119,91,1) 50%, rgba(255,119,91,1) 75%, rgba(134,182,255,1) 75%, rgba(134,182,255,1) 100%)",
              }}
            />
          </Box>

          <Typography
            style={{ fontSize: 14, color: "rgba(0,0,0,0.6)", textAlign: "center", marginBottom: 20 }}
          >
            {t("Select your organization to continue.")}
          </Typography>

          {KNOWN_SERVERS.map((server, i) => (
            <Card key={i} className={classes.card} elevation={0}>
              <CardActionArea onClick={() => handleSelectCard(server)}>
                <CardContent className={classes.cardContent} style={{ display: "flex", alignItems: "center" }}>
                  {server.logo && (
                    <img
                      src={server.logo}
                      alt={server.name}
                      style={{ width: 40, height: 40, borderRadius: 8, marginRight: 16, objectFit: "contain" }}
                    />
                  )}
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

          {!showCustom ? (
            <Typography
              style={{ fontSize: 14, color: "#6083E7", fontWeight: "bold", cursor: "pointer", textAlign: "center", marginTop: 8 }}
              onClick={() => setShowCustom(true)}
            >
              {t("Connect to a different server")}
            </Typography>
          ) : (
            <Box className={classes.customSection}>
              <TextField
                fullWidth
                variant="filled"
                label={t("Server Address")}
                value={customServer}
                onChange={(e) => setCustomServer(e.target.value)}
                placeholder="api.example.com"
                InputProps={{ disableUnderline: true }}
                style={{ marginBottom: 12 }}
              />
              <Box className={classes.buttonNav} textAlign="center">
                <Fab
                  variant="extended"
                  style={{ background: "#7599FF", color: "White" }}
                  onClick={handleCustomConnect}
                  disabled={!customServer}
                >
                  {t("Connect")}
                </Fab>
              </Box>
            </Box>
          )}
        </Grid>
      </Grid>
    </ResponsiveMargin>
  )
}
