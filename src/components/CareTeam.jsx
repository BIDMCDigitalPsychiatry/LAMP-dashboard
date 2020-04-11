// Core Imports
import React, { useState, useEffect } from "react"
import { Grid, Icon, Button, Collapse, Typography, Divider, useTheme, useMediaQuery } from "@material-ui/core"

// Local Imports
import LAMP from "lamp-core"
import AvatarCircleGroup from "./AvatarCircleGroup"
import CredentialManager from "./CredentialManager"
import Messages from "./Messages"
import ResponsiveDialog from "./ResponsiveDialog"

export default function CareTeam({ participant, ...props }) {
  const [showMessaging, setShowMessaging] = useState(false)
  const [showCredentials, setShowCredentials] = useState(false)
  const [accounts, setAccounts] = useState([])
  const theme = useTheme()
  const sm = useMediaQuery(theme.breakpoints.down("sm"))

  useEffect(() => {
    ;(async function () {
      let ext = (await LAMP.Type.getAttachment(participant.id, "lamp.dashboard.credential_roles.external")).data
      let int = (await LAMP.Type.getAttachment(participant.id, "lamp.dashboard.credential_roles")).data
      setAccounts([
        {
          id: 0,
          name: "0",
          email: "me@me.com",
          tooltip: "You",
          children: ["ME"],
          style: { background: theme.palette.primary.main },
        },
        ...Object.entries(ext || {}).map((x, idx) => ({
          id: idx + 1,
          name: `${idx + 1}`,
          email: x[0],
          tooltip: (x[1] || {}).role || "No role specified",
          image: (x[1] || {}).photo,
        })),
        ...Object.entries(int || {}).map((x, idx) => ({
          id: idx + 1,
          name: `${idx + 1}`,
          onClick: () => setShowCredentials((x) => !x),
          email: x[0],
          tooltip: (x[1] || {}).role || "No role specified",
          image: (x[1] || {}).photo,
        })),
        {
          id: 99,
          name: "+",
          onClick: () => setShowCredentials((x) => !x),
          tooltip: "Add a family member.",
          children: ["+"],
          style: { background: theme.palette.secondary.main },
        },
      ])
    })()
  }, [])

  return (
    <React.Fragment>
      <Grid container direction={sm ? "column-reverse" : "row"} justify={sm ? "center" : "space-between"} spacing={2}>
        <Grid
          container
          item
          direction="column"
          spacing={1}
          alignItems={sm ? "center" : "flex-start"}
          xs={12}
          sm={12}
          md={6}
          lg={6}
        >
          <Grid item>
            <Typography
              variant="h2"
              gutterBottom
              align={sm ? "center" : "left"}
              style={{ fontWeight: 700, color: "#074377" }}
            >
              Meet your care team.
            </Typography>
            <Typography variant="subtitle1" align={sm ? "center" : "left"}>
              Your care team consists of your clinicians and family members you'd like to grant access to your data. To
              add a family member, press the <Icon style={{ verticalAlign: "-0.2em" }}>add_circle</Icon> icon{" "}
              {sm ? "above" : "to the right"}.
            </Typography>
          </Grid>
          <Grid item>
            <Button variant="outlined" color="secondary" onClick={() => setShowMessaging((x) => !x)}>
              {showMessaging ? "Hide" : "Show"} my conversations
              <Icon>{showMessaging ? "keyboard_arrow_up" : "keyboard_arrow_down"}</Icon>
            </Button>
          </Grid>
          <Grid item />
        </Grid>
        <Grid item style={{ margin: 32 }}>
          <AvatarCircleGroup accounts={accounts} />
        </Grid>
      </Grid>
      <Collapse in={showMessaging} collapsedHeight={0}>
        <Divider style={{ margin: "0px -16px 0px -16px" }} />
        <Messages
          style={{ margin: "0px -16px -16px -16px" }}
          refresh={showMessaging}
          participantOnly
          participant={participant.id}
        />
      </Collapse>
      <ResponsiveDialog transient open={showCredentials} onClose={() => setShowCredentials()}>
        <CredentialManager id={participant.id} style={{ margin: 16 }} />
      </ResponsiveDialog>
    </React.Fragment>
  )
}
