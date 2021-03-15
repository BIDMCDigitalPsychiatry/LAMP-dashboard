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
} from "@material-ui/core"
import PatientProfile from "./PatientProfile"
// Local Imports
import LAMP from "lamp-core"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import MoreVertIcon from "@material-ui/icons/MoreVert"
import ParticipantName from "./ParticipantName"
import Passive from "./PassiveBubble"
import Active from "./ActiveBubble"
import NotificationSettings from "./NotificationSettings"
import DeleteParticipant from "./DeleteParticipant"
import Credentials from "./Credentials"
import { Service } from "../../DBService/DBService"
import Checkbox from "@material-ui/core/Checkbox"

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
    cardMain: {
      boxShadow: "none !important ",
      background: "#F8F8F8",
      "& span.MuiCardHeader-title": { fontSize: "16px", fontWeight: 500 },
    },
    checkboxActive: { color: "#7599FF !important" },
    participantHeader: { padding: "12px 5px 0" },
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
  })
)

export default function ParticipantListItem({
  participant,
  onParticipantSelect,
  studies,
  notificationColumn,
  handleSelectionChange,
  ...props
}) {
  const classes = useStyles()
  const [checked, setChecked] = React.useState(false)
  const handleChange = (participant, event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
    handleSelectionChange(participant, event.target.checked)
  }

  return (
    <Card className={classes.cardMain}>
      <Box display="flex" p={1}>
        <Box>
          <Checkbox
            checked={checked}
            onChange={(event) => handleChange(participant, event)}
            classes={{ checked: classes.checkboxActive }}
            inputProps={{ "aria-label": "primary checkbox" }}
          />
        </Box>
        <Box flexGrow={1}>
          <CardHeader
            title={<ParticipantName participant={participant} />}
            subheader={<Typography variant="overline">{participant.study_name}</Typography>}
            className={classes.participantHeader}
          />
          <CardContent className={classes.participantSub}>
            <Passive participant={participant} />
            <Active participant={participant} />
          </CardContent>
        </Box>
        <Box>
          <CardActions>
            <Credentials participant={participant} />
            <PatientProfile participant={participant} studies={studies} />
            <Fab
              size="small"
              classes={{ root: classes.btnWhite }}
              onClick={() => {
                onParticipantSelect(participant.id)
              }}
            >
              <Icon>arrow_forward</Icon>
            </Fab>
          </CardActions>
        </Box>
      </Box>
      {notificationColumn && <NotificationSettings participant={participant} />}
    </Card>
  )
}
