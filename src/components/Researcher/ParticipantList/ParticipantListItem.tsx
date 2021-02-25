import React, { useState, useEffect } from "react"
import {
  Box,
  IconButton,
  Icon,
  Button,
  AppBar,
  Toolbar,
  Divider,
  MenuItem,
  DialogContentText,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardHeader,
  Menu,
  CardActions,
  CardContent,
} from "@material-ui/core"
import PatientProfile from "./PatientProfile"

// Local Imports
import LAMP from "lamp-core"
import { CredentialManager } from "../../CredentialManager"
import ResponsiveDialog from "../../ResponsiveDialog"
import SnackMessage from "../../SnackMessage"
import { makeStyles, Theme, createStyles, createMuiTheme } from "@material-ui/core/styles"
import { useTranslation } from "react-i18next"
import MoreVertIcon from "@material-ui/icons/MoreVert"
import ParticipantName from "./ParticipantName"
import Passive from "./PassiveBubble"
import Active from "./PassiveBubble"
import NotificationSettings from "./NotificationSettings"
import DeleteParticipant from "./DeleteParticipant"
import Credentials from "./Credentials"

const _qrLink = (credID, password) =>
  window.location.href.split("#")[0] +
  "#/?a=" +
  btoa([credID, password, LAMP.Auth._auth.serverAddress].filter((x) => !!x).join(":"))

const theme = createMuiTheme({
  palette: {
    secondary: {
      main: "#333",
    },
  },
  overrides: {
    MuiTableCell: {
      root: {
        borderBottom: "#fff solid 1px",
        padding: 10,
      },
    },
    MuiToolbar: {
      root: {
        maxWidth: 1055,
        width: "80%",
        margin: "0 auto",
        background: "#fff !important",
      },
    },
    MuiInput: {
      root: {
        border: 0,
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
    MuiIcon: {
      root: { color: "rgba(0, 0, 0, 0.4)" },
    },
  },
})

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbardashboard: {
      minHeight: 100,
      padding: "0 10px",
      "& h5": {
        color: "rgba(0, 0, 0, 0.75)",
        textAlign: "left",
        fontWeight: "600",
        fontSize: 30,
        width: "calc(100% - 96px)",
      },
    },
    tableContainer: {
      "& div.MuiInput-underline:before": { borderBottom: "0 !important" },
      "& div.MuiInput-underline:after": { borderBottom: "0 !important" },
      "& div.MuiInput-underline": {
        "& span.material-icons": {
          width: 21,
          height: 19,
          fontSize: 27,
          lineHeight: "23PX",
          color: "rgba(0, 0, 0, 0.4)",
        },
        "& button": { display: "none" },
      },
    },
    backdrop: {
      zIndex: 111111,
      color: "#fff",
    },
  })
)

export default function ParticipantListItem({
  participant,
  onParticipantSelect,
  refreshParticipants,
  researcher,
  studies,
  ...props
}) {
  const [openMenu, setOpenMenu] = React.useState(null)
  const classes = useStyles()
  const [profileDialog, setProfileDialog] = useState(false)
  const [openPasswordReset, setOpenPasswordReset] = useState(null)
  const { t } = useTranslation()
  const [name, setName] = useState("")
  const [notificationColumn, setNotificationColumn] = useState(false)

  useEffect(() => {
    ;(async () => {
      let name = ((await LAMP.Type.getAttachment(participant.id, "lamp.name")) as any).data ?? ""
      setName(name)
      let notificationDisplay: any =
        ((await LAMP.Type.getAttachment(researcher.id, "to.unityhealth.psychiatry.enabled")) as any).data ?? ""
      if (notificationDisplay) setNotificationColumn(true)
    })()
  }, [])

  return (
    <Card style={{ margin: 20 }}>
      <CardHeader
        action={
          <IconButton onClick={(e) => setOpenMenu(e.currentTarget)}>
            <MoreVertIcon />
          </IconButton>
        }
        title={<ParticipantName participant={participant} name={name} />}
        subheader={<Typography variant="overline">{participant.study}</Typography>}
      />
      <CardContent>
        <Passive participant={participant} />
        <Active participant={participant} />
      </CardContent>
      <CardActions>
        <PatientProfile participant={participant} onClose={() => setProfileDialog(false)} studies={studies} />
        <Button
          size="small"
          color="primary"
          onClick={() => {
            onParticipantSelect(participant.id)
          }}
        >
          View
        </Button>
      </CardActions>
      {notificationColumn && <NotificationSettings participantId={participant.id} />}

      <Menu open={!!openMenu} anchorEl={openMenu} onClose={() => setOpenMenu(false)}>
        <Credentials participant={participant} />
        <DeleteParticipant participant={participant} />
      </Menu>
    </Card>
  )
}
