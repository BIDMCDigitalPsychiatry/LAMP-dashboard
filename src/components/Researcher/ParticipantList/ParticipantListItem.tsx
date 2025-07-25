import React, { useState, useEffect } from "react"
import {
  Fab,
  Icon,
  Typography,
  Card,
  CardHeader,
  CardActions,
  CardContent,
  Box,
  makeStyles,
  Theme,
  createStyles,
  Checkbox,
  Link,
} from "@material-ui/core"
// Local Imports
import ParticipantName from "./ParticipantName"
import Passive from "./PassiveBubble"
import Active from "./ActiveBubble"
import NotificationSettings from "./NotificationSettings"
import Credentials from "../../Credentials"

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
  const [checked, setChecked] = React.useState(
    selectedParticipants.filter((d) => d.id === participant.id).length > 0 ? true : false
  )
  const [user, setName] = useState(participant)
  const [openSettings, setOpenSettings] = useState(false)

  const handleChange = (participant, event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
    handleSelectionChange(participant, event.target.checked)
  }

  const updateParticipant = (nameVal: string) => {
    setName({ ...user, name: nameVal })
  }

  useEffect(() => {
    setName(user)
  }, [user])

  useEffect(() => {}, [])

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
            title={
              <ParticipantName participant={user} updateParticipant={updateParticipant} openSettings={openSettings} />
            }
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
            {!!notificationColumn && <NotificationSettings participant={participant} />}
            <Credentials user={participant} fromParticipant={true} />
            <Link
              href={`/#/researcher/${researcherId}/participant/${participant?.id}/settings`}
              underline="none"
              className={classes.settingslink}
            >
              <Icon>settings</Icon>
            </Link>
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
    </Card>
  )
}
