import React, { useState, useEffect } from "react"
import { IconButton, Button, Typography, Card, CardHeader, Menu, CardActions, CardContent } from "@material-ui/core"
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
  studies,
  notificationColumn,
  ...props
}) {
  const [openMenu, setOpenMenu] = React.useState(null)

  return (
    <Card style={{ margin: 20 }}>
      <CardHeader
        action={
          <IconButton onClick={(e) => setOpenMenu(e.currentTarget)}>
            <MoreVertIcon />
          </IconButton>
        }
        title={<ParticipantName participant={participant} />}
        subheader={<Typography variant="overline">{participant.parent}</Typography>}
      />
      <CardContent>
        <Passive participant={participant} />
        <Active participant={participant} />
      </CardContent>
      <CardActions>
        <PatientProfile participant={participant} studies={studies} />
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
      {notificationColumn && <NotificationSettings participant={participant} />}

      <Menu open={!!openMenu} anchorEl={openMenu} onClose={() => setOpenMenu(false)}>
        <Credentials participant={participant} />
        <DeleteParticipant participant={participant} />
      </Menu>
    </Card>
  )
}
