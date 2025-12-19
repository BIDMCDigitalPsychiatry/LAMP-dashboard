import { Box, Card, CardContent, Fab, Slide, TextField } from "@material-ui/core"
import React, { useEffect, useState } from "react"
import LoginFrame, { useLoginStyles } from "./LoginFrame"
import { Autocomplete } from "@mui/material"
import { useTranslation } from "react-i18next"
import LAMP from "lamp-core"

type SuggestedUrlOption = {
  label: string
}

export default function SelectServer({ onSetServer, srcLockedState }) {
  const { t, i18n } = useTranslation()
  const [serverAddress, setServerAddress] = useState("")
  const classes = useLoginStyles()
  const [options, setOptions] = useState([])
  const [srcLocked, setSrcLocked] = srcLockedState
  useEffect(() => {
    const cachedOptions = localStorage.getItem("cachedOptions")
    let options: SuggestedUrlOption[]
    if (!cachedOptions) {
      options = [
        { label: "api.lamp.digital" },
        { label: "mindlamp-api.pronet.med.yale.edu" },
        { label: "mindlamp.orygen.org.au" },
        { label: "mindlamp-qa.dmh.lacounty.gov" },
      ]
    } else {
      options = (JSON.parse(cachedOptions) || []).filter((o) => typeof o?.label !== "undefined")
    }
    setOptions(options)
    let query = window.location.hash.split("?")
    if (!!query && query.length > 1) {
      let src = Object.fromEntries(new URLSearchParams(query[1]))["src"]
      if (typeof src === "string" && src.length > 0) {
        setServerAddress(src)
        setSrcLocked(true)
      }
    }
  }, [])

  const handleSelectServer = async (value) => {
    const setServerResult = await LAMP.Auth.set_server(serverAddress)

    // Update available autocomplete options
    if (!options.find((item) => item?.label === serverAddress)) {
      options.push({ label: serverAddress })
      localStorage.setItem("cachedOptions", JSON.stringify(options))
      setOptions([...options])
    }
    onSetServer()
  }

  return (
    <>
      <LoginFrame>
        <Autocomplete
          freeSolo={true}
          id="serever-selector"
          options={options}
          sx={{ width: "100%", marginTop: "12px" }}
          value={serverAddress || ""}
          onChange={(event, value) => setServerAddress(value.label)}
          renderInput={(params) => (
            <TextField
              {...params}
              name="serverAddress"
              variant="filled"
              value={serverAddress || ""}
              onChange={(event) => setServerAddress(event.target.value)}
              InputProps={{ ...params.InputProps, disableUnderline: true }}
              label={t("Server Address")}
              helperText={t("Don't enter a domain if you're not sure what this option does.")}
            />
          )}
        />
        <Box className={classes.buttonNav} width={1} textAlign="center">
          <Fab
            variant="extended"
            type="submit"
            style={{ background: "#7599FF", color: "White" }}
            onClick={handleSelectServer}
            className={!serverAddress ? classes.loginDisabled : ""}
            disabled={!serverAddress}
          >
            {`${t("Select Server")}`}
            <input
              type="submit"
              style={{
                cursor: "pointer",
                position: "absolute",
                top: 0,
                bottom: 0,
                right: 0,
                left: 0,
                width: "100%",
                opacity: 0,
              }}
              disabled={!serverAddress}
            />
          </Fab>
        </Box>
      </LoginFrame>
    </>
  )
}
