// Core Imports
import React, { useState } from "react"
import {
  Avatar,
  Box,
  TextField,
  Tabs,
  Tab,
  Grid,
  Divider,
  Icon,
  IconButton,
  Tooltip,
  InputAdornment,
  useTheme,
  useMediaQuery,
} from "@material-ui/core"
import { blue, grey } from "@material-ui/core/colors"

// Local Imports
import LAMP from "lamp-core"
import useInterval from "./useInterval"

const capitalize = (x) => x.charAt(0).toUpperCase() + x.slice(1)

function MessageItem({ from, date, text, flipped, ...props }) {
  return (
    <Grid
      container
      direction={flipped ? "row" : "row-reverse"}
      alignItems="flex-end"
      spacing={1}
      style={{ padding: 8 }}
    >
      <Grid item style={{ display: flipped ? undefined : "none" }}>
        <Tooltip title={capitalize(from === "researcher" ? "clinician" : "patient")}>
          <Avatar
            style={{
              background: "#aaa",
            }} /* src="https://uploads-ssl.webflow.com/5d321d55bdb594133bc03c07/5d7958ecfedbb68c91822af2_00100dportrait_00100_W9YBE~2-p-800.jpeg" */
          >
            C
          </Avatar>
        </Tooltip>
      </Grid>
      <Grid item>
        <Tooltip title={new Date(date || 0).toLocaleString("en-US", Date.formatStyle("medium"))}>
          <Box
            p={1}
            borderRadius={flipped ? "16px 16px 16px 4px" : "16px 16px 4px 16px"}
            color={flipped ? "#fff" : "#000"}
            bgcolor={flipped ? blue[600] : grey[200]}
            style={{ wordWrap: "break-word", whiteSpace: "pre-line" }}
          >
            {text}
          </Box>
        </Tooltip>
      </Grid>
    </Grid>
  )
}

export default function Messages({
  refresh,
  participant,
  participantOnly,
  privateOnly,
  expandHeight,
  ...props
}: {
  privateOnly?: boolean
  expandHeight?: boolean
  participant?: string
  participantOnly?: boolean
  refresh?: boolean
  style?: any
}) {
  const [messages, setMessages] = useState({})
  const [currentMessage, setCurrentMessage] = useState<string>()
  const [messageTab, setMessageTab] = useState(!!privateOnly ? 1 : 0)
  const theme = useTheme()
  const sm = useMediaQuery(theme.breakpoints.down("sm"))

  useInterval(
    () => {
      refreshMessages()
    },
    !!refresh ? 10 * 1000 /* 10s */ : null,
    true
  )

  const sendMessage = async () => {
    let msg = (currentMessage || "").trim()
    if (msg.length === 0 || !participant) return

    await refreshMessages()
    let all = getMessages()
    all.push({
      from: !!participantOnly ? "participant" : "researcher",
      type: (messageTab || 0) === 1 ? "note" : "message",
      date: new Date(),
      text: msg,
    })
    LAMP.Type.setAttachment(participant, "me", "lamp.messaging", all)
    setCurrentMessage(undefined)
    setMessages({ ...(messages || {}), [participant]: all })
  }

  const refreshMessages = async () => {
    console.log("Fetching messages...")
    setMessages(
      Object.fromEntries(
        (
          await Promise.all(
            [participant || ""].map(async (x) => [
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

  const getMessages = () => {
    let x = (messages || {})[participant || ""] || []
    return !Array.isArray(x) ? [] : x
  }

  // FIXME: don't pass in props ie. functions!
  return (
    <Box {...props}>
      <Grid container direction={sm ? "column" : "row"} alignItems="stretch">
        <Grid item hidden={!!privateOnly}>
          <Tabs
            value={messageTab}
            onChange={(e, value) => setMessageTab(value)}
            orientation={sm ? "horizontal" : "vertical"}
            variant="scrollable"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Messages" />
            <Tab label={!!participantOnly ? "My Journal" : "Patient Notes"} />
          </Tabs>
        </Grid>
        <Grid item hidden={!!privateOnly}>
          <Divider orientation={sm ? "horizontal" : "vertical"} />
        </Grid>
        <Grid item style={{ flexGrow: 1 }}>
          <Grid container direction="column">
            <Grid item>
              <Box
                mx={2}
                style={{
                  minHeight: 100,
                  maxHeight: expandHeight ? undefined : "50vh",
                  overflow: expandHeight ? undefined : "scroll",
                }}
              >
                {getMessages()
                  .filter((x) =>
                    (messageTab || 0) === 0
                      ? x.type === "message"
                      : x.type === "note" && x.from === (!!participantOnly ? "participant" : "researcher")
                  )
                  .map((x) => (
                    <MessageItem
                      {...x}
                      flipped={
                        (!!participantOnly && x.from === "researcher") || (!participantOnly && x.from === "participant")
                      }
                      key={JSON.stringify(x)}
                    />
                  ))}
              </Box>
              <Divider />
            </Grid>
            <Grid item>
              <TextField
                label="Send a message"
                style={{ margin: 16, paddingRight: 32 }}
                placeholder="Message..."
                value={currentMessage || ""}
                onChange={(event) => setCurrentMessage(event.target.value)}
                helperText={`Your ${!!participantOnly ? "clinician" : "patient"} will ${
                  (messageTab || 0) === 0
                    ? "be able to see your messages when they log in."
                    : "not be able to see this message."
                }`}
                margin="normal"
                variant="outlined"
                multiline
                fullWidth
                rowsMax="15"
                InputProps={{
                  endAdornment: [
                    <InputAdornment key={"end"} position="end">
                      <Tooltip title="Send Message">
                        <IconButton
                          edge="end"
                          aria-label="send"
                          onClick={sendMessage}
                          onMouseDown={(event) => event.preventDefault()}
                        >
                          <Icon>send</Icon>
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>,
                  ],
                }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}
