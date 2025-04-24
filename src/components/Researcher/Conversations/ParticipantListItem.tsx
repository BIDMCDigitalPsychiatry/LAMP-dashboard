import React, { useState, useEffect } from "react"
import {
  IconButton,
  Fab,
  Icon,
  Typography,
  Card,
  CardHeader,
  Menu,
  CardActions,
  CardContent,
  Box,
  makeStyles,
  Theme,
  createStyles,
  Checkbox,
  Link,
  Grid,
  Badge,
} from "@material-ui/core"
// Local Imports
import ParticipantName from "../ParticipantList/ParticipantName"
import Credentials from "../../Credentials"
import { Service } from "../../DBService/DBService"

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
    studyMain: { background: "#F8F8F8", borderRadius: 4 },
    norecords: {
      "& span": { marginRight: 5 },
    },
    w100: { width: "100%" },
    cardMain: {
      boxShadow: "none !important ",
      background: "#F8F8F8",
      "& span.MuiCardHeader-title": { fontSize: "16px", fontWeight: 500 },
    },
    checkboxActive: { color: "#7599FF !important" },
    participantHeader: { padding: "12px 5px 0", wordBreak: "break-all" },
    moreBtn: {},
    participantSub: { padding: "0 5px", "&:last-child": { paddingBottom: 10 } },
    btnWhite: {
      background: "#fff",
      borderRadius: "40px",
      boxShadow: "none",
      cursor: "pointer",
      textTransform: "capitalize",
      fontSize: "14px",
      color: "#7599FF",
      "& svg": { marginRight: 8 },
      "&:hover": { color: "#5680f9", background: "#fff", boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.20)" },
    },
    settingslink: {
      background: "#fff",
      width: 40,
      height: 40,
      borderRadius: "50%",
      padding: 8,
      color: "#7599FF",
      "&:hover": { color: "#5680f9", background: "#fff", boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.20)" },
    },
  })
)

export default function ParticipantListItem({
  participant,
  onParticipantSelect,
  studies,
  notificationColumn,
  handleSelectionChange,
  selectedParticipants,
  researcherId,
  ...props
}) {
  const classes = useStyles()
  const [name, setName] = useState(participant.name ?? "")
  useEffect(() => {
    Service.getDataByKey("participants", [participant.id], "id").then((data) => {
      setName(data[0]?.name ?? participant.id ?? "")
    })
  }, [participant])

  useEffect(() => {}, [])

  return (
    <Grid item lg={6} xs={12}>
      <Badge badgeContent="2" color="error" className={classes.w100}>
        <Box display="flex" p={2} className={classes.studyMain} width={1}>
          <Box flexGrow={1} display="flex" alignItems="center">
            <Box>
              <Typography>{participant.id}</Typography>
              {participant.id != name && <Typography variant="subtitle2">{name}</Typography>}
            </Box>
          </Box>
          <Box display="flex" alignItems="center">
            <Fab size="small" color="primary" className={classes.btnWhite}>
              <Icon>chevron_right</Icon>
            </Fab>
          </Box>
        </Box>
      </Badge>
    </Grid>
  )
}
