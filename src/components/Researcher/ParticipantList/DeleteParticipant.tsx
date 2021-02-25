import React, { useState, useEffect } from "react"
import {
  Box,
  IconButton,
  Icon,
  Button,
  TextField,
  Popover,
  AppBar,
  Toolbar,
  Divider,
  MenuItem,
  Chip,
  Tooltip,
  Grid,
  Fab,
  DialogContentText,
  Typography,
  Backdrop,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  Switch,
  FormControlLabel,
  Card,
  CardHeader,
  Menu,
  CardActions,
  CardContent,
} from "@material-ui/core"
import MaterialTable, { MTableToolbar } from "material-table"
import { useSnackbar } from "notistack"
import { ReactComponent as AddIcon } from "../icons/plus.svg"
import { ReactComponent as DeleteIcon } from "../icons/DeleteBlue.svg"
import { ReactComponent as RenameIcon } from "../icons/RenameBlue.svg"
import { ReactComponent as EditIcon } from "../icons/TagBlue.svg"
import { ReactComponent as VpnKeyIcon } from "../icons/EditPasswordBlue.svg"
import { ReactComponent as ExportIcon } from "../icons/Export.svg"
import { green, yellow, red, grey } from "@material-ui/core/colors"
import CloseIcon from "@material-ui/icons/Close"
import PatientProfile from "./PatientProfile"
// External Imports
import { saveAs } from "file-saver"
import JSZip from "jszip"
import jsonexport from "jsonexport"
import TimeAgo from "javascript-time-ago"
import en from "javascript-time-ago/locale/en"
import hi from "javascript-time-ago/locale/hi"
import es from "javascript-time-ago/locale/es"
import QRCode from "qrcode.react"
// Local Imports
import LAMP, { Study } from "lamp-core"
import Messages from "../../Messages"
import EditUserField from "./EditUserField"
import { CredentialManager } from "../../CredentialManager"
import ResponsiveDialog from "../../ResponsiveDialog"
import SnackMessage from "../../SnackMessage"
import { makeStyles, Theme, createStyles, MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles"
import { ReactComponent as Filter } from "../icons/Filter.svg"
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown"
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp"
import MultipleSelect from "../../MultipleSelect"
import { useTranslation } from "react-i18next"
import MoreVertIcon from "@material-ui/icons/MoreVert"
import CreateIcon from "@material-ui/icons/Create"
//TimeAgo.addLocale(en)
//const timeAgo = new TimeAgo("en-US")
import StudyCreator from "./StudyCreator"
import Header from "./Header"

import ParticipantName from "./ParticipantName"
import Passive from "./PassiveBubble"
import Active from "./PassiveBubble"
import NotificationSettings from "./NotificationSettings"

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

export default function DeleteParticipant({ participant, ...props }) {
  const [deleteConfirmationDialog, setDeleteConfirmationDialog] = useState(false)
  const { t } = useTranslation()

  let deleteParticipant = async (participantId) => {
    await LAMP.Participant.delete(participantId)
  }

  return (
    <Box>
      <MenuItem onClick={() => setDeleteConfirmationDialog(true)}>Delete</MenuItem>

      <Dialog
        open={deleteConfirmationDialog}
        onClose={() => setDeleteConfirmationDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirmation"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t("Are you sure you want to delete this Participant?")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmationDialog(false)} color="primary">
            No
          </Button>
          <Button
            onClick={() => {
              deleteParticipant(participant.id)
            }}
            color="primary"
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
