import React, { useState, useEffect } from "react"
import { Fab, Icon, Typography, Box, makeStyles, Theme, createStyles, Grid, Badge, Dialog } from "@material-ui/core"
// Local Imports
import { sensorEventUpdate } from "../../BottomMenu"

import { Service } from "../../DBService/DBService"
import MessageDialog from "../ParticipantList/Profile/MessageDialog"
import Messages from "./Messages"
import LAMP from "lamp-core"

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
    padding20: {
      padding: "20px",
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
    popWidth: { width: "95%", maxWidth: "500px", padding: "0 40px" },
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
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [msgCount, setMsgCount] = useState(0)
  const [sensorData, setSensorData] = useState(null)
  const [name, setName] = useState(participant.name ?? "")
  const [conversations, setConversations] = useState({})

  useEffect(() => {
    Service.getDataByKey("participants", [participant.id], "id").then((data) => {
      setName(data[0]?.name ?? participant.id ?? "")
    })
    setMsgCount(getMessageCount())
    refresh()
  }, [participant])

  const refresh = () => {
    if (sensorData === null) {
      ;(async () => {
        let data = await LAMP.SensorEvent.allByResearcher(researcherId, "lamp.analytics")
        data = Array.isArray(data) ? (data || []).filter((d) => d.data.page === "conversations") : null
        setSensorData(!!data ? data[0] : [])
      })()
    }
  }

  const refreshMessages = async () => {
    console.log("Fetching messages...")
    setConversations(
      Object.fromEntries(
        (
          await Promise.all(
            [researcherId || ""].map(async (x) => [
              x,
              await LAMP.Type.getAttachment(x, "lamp.messaging").catch((e) => []),
            ])
          )
        )
          .filter((x: any) => x[1].message !== "404.object-not-found")
          .map((x: any) => [x[0], x[1].data])
      )
    )
  }

  useEffect(() => {
    if (sensorData !== null) refreshMessages()
  }, [sensorData])

  const getMessageCount = () => {
    let x = (conversations || {})[researcherId || ""] || []
    return !Array.isArray(x)
      ? 0
      : x.filter((a) => a.from === "participant" && new Date(a.date).getTime() > (sensorData?.timestamp ?? 0)).length
  }

  const updateAnalytics = async () => {
    setSensorData(null)
    setDialogOpen(true)
    await sensorEventUpdate("conversations", researcherId, null)
    let data = await LAMP.SensorEvent.allByResearcher(researcherId, "lamp.analytics")
    data = (data || []).filter((d) => d.data.page === "conversations")
    setSensorData(data ? data[0] : [])
  }

  useEffect(() => {
    console.log("asd", dialogOpen)
  }, [dialogOpen])

  return (
    <>
      <Box display="flex" p={2} className={classes.studyMain} width={1}>
        <Box flexGrow={1} display="flex" alignItems="center">
          <Box>
            <Typography>{participant.id}</Typography>
            {participant.id != name && <Typography variant="subtitle2">{name}</Typography>}
          </Box>
        </Box>
        <Box display="flex" alignItems="center">
          <Badge
            color="error"
            badgeContent={msgCount > 0 ? msgCount : undefined}
            onClick={() => {
              localStorage.setItem("lastTab" + researcherId, JSON.stringify(new Date().getTime()))
              updateAnalytics()
            }}
          >
            <Fab size="small" color="primary" className={classes.btnWhite} onClick={() => setDialogOpen(true)}>
              <Icon style={{ color: "#7599FF" }}>comment</Icon>
            </Fab>
          </Badge>
        </Box>
      </Box>
      {/* <Dialog
        classes={{ paper: classes.popWidth }}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="simple-dialog-title"
        open={dialogOpen}
      >
        <div className={classes.padding20}> */}
      {!!dialogOpen && (
        <Messages
          setDialogOpen={setDialogOpen}
          refresh
          participant={participant.id}
          msgOpen={true}
          participantOnly={false}
        />
      )}
      {/* </div>
      </Dialog> */}
    </>
  )
}
