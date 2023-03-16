import { Grid, Button, TextField, CircularProgress, Typography } from "@material-ui/core"
import { DatePicker } from "@material-ui/pickers"
import LAMP from "lamp-core"
import React, { useState, useEffect, useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"
import ConfirmationDialog from "./ConfirmationDialog"

export function TokenManager(props: { credential?: any; id?: string }) {
  const { t } = useTranslation()
  const [credential, setCredential] = useState(props.credential ?? null)

  const defaultDate = useMemo(() => {
    const date = new Date()
    date.setMonth(date.getMonth() + 3)
    return date
  }, [])
  const minDate = useMemo(() => {
    const date = new Date()
    date.setDate(date.getDate() + 1)
    return date
  }, [])
  const fetchCredential = useCallback(async () => {
    if (!props.credential && props.id) {
      const result = await LAMP.Credential.list(props.id)
      if (result.length > 0) {
        setCredential(result[0])
      }
    }
  }, [])

  useEffect(() => {
    if (!props.credential) {
      fetchCredential()
    }
  }, [props])

  const [mode, setMode] = useState("manage-tokens")
  const [selectedToken, setSelectedToken] = useState(undefined)
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(defaultDate)
  const [description, setDescription] = useState<string | undefined>(t("New Access Token"))
  const [tokens, setTokens] = useState([])

  useEffect(() => {
    if (credential !== null) {
      refreshTokens()
    }
  }, [credential])

  const refreshTokens = useCallback(async () => {
    const credentialTokens = await LAMP.Credential.listTokens(credential.access_key)
    setTokens(credentialTokens)
  }, [credential])

  const createToken = useCallback(async () => {
    const result = await LAMP.Credential.createToken(credential.access_key, expiryDate.getTime(), description)
    refreshTokens()
    setMode("show-token")
    const token = { description, expiry: expiryDate?.getTime(), created: Date.now(), token: result }
    setSelectedToken(token)
    setExpiryDate(undefined)
    setDescription(undefined)
  }, [description, expiryDate, credential, refreshTokens])
  const revokeToken = useCallback(async () => {
    await LAMP.Credential.deleteToken(credential.access_key, selectedToken.token)
    refreshTokens()
    setMode("manage-tokens")
    setSelectedToken(undefined)
  }, [selectedToken, credential, refreshTokens])

  return credential === null ? (
    <CircularProgress />
  ) : (
    <div>
      {mode === "manage-tokens" && (
        <Grid item>
          <div style={{ display: "flex", margin: 5 }}>
            <Typography variant="h6" style={{ width: "100%" }}>{`${
              props.credential ? t("Manage Credential Tokens") : t("Manage Personal Tokens")
            }`}</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setMode("create-token")
              }}
            >{`${t("Create")}`}</Button>
          </div>
          <div style={{ display: "flex", padding: 5, width: "100%" }}>
            <Typography variant="overline" style={{ margin: 15 }}>
              {t("Created")}
            </Typography>
            <Typography variant="overline" style={{ margin: 15 }}>
              {t("Expires")}
            </Typography>
            <Typography variant="overline" style={{ margin: 15 }}>
              {t("Description")}
            </Typography>
          </div>
          {tokens.map((token) => (
            <div style={{ display: "flex", flex: "center-row", margin: 5 }}>
              <div style={{ display: "flex", padding: 5, width: "100%" }}>
                <Typography style={{ margin: 5 }}>{new Date(token.created).toLocaleDateString()}</Typography>
                <Typography style={{ margin: 5 }}>{new Date(token.expiry).toLocaleDateString()}</Typography>
                <Typography style={{ margin: 5 }}>{token.description}</Typography>
              </div>
              <div style={{ display: "flex", margin: 5, alignSelf: "end" }}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    setSelectedToken(token)
                    setMode("show-token")
                  }}
                >{`${t("Show")}`}</Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    setSelectedToken(token)
                    setMode("revoking")
                  }}
                >{`${t("Revoke")}`}</Button>
              </div>
            </div>
          ))}
        </Grid>
      )}
      {mode === "show-token" && selectedToken && (
        <Grid item>
          <Typography variant="h6">{`${t("This is your token")}`}</Typography>
          <div style={{ overflow: "auto" }}>
            <Typography variant="caption">{`${selectedToken.token}`}</Typography>
          </div>
          <div style={{ display: "flex", alignItems: "end" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigator.clipboard.writeText(selectedToken.token)}
            >{`${t("Copy")}`}</Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                setSelectedToken(undefined)
                setMode("manage-tokens")
              }}
            >{`${t("Back")}`}</Button>
          </div>
        </Grid>
      )}
      {mode === "create-token" && (
        <Grid item>
          <Typography variant="h6">{`${t("Create Token")}`}</Typography>
          <TextField
            placeholder={t("Description")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></TextField>
          <DatePicker onChange={(value) => setExpiryDate(value)} value={expiryDate} minDate={minDate}></DatePicker>
          <Button variant="contained" color="primary" onClick={createToken}>{`${t("Create")}`}</Button>
        </Grid>
      )}
      {mode === "revoking" && (
        <ConfirmationDialog
          open
          confirmationDialog={1}
          confirmationMsg={t("Are you sure you want to revoke permissions for this token?")}
          confirmAction={revokeToken}
        />
      )}
    </div>
  )
}
