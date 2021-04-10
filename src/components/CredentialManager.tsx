// Core Imports
import React, { useState, useEffect, useCallback } from "react"
import {
  Box,
  Grid,
  Avatar,
  Icon,
  IconButton,
  Tooltip,
  Divider,
  Menu,
  MenuItem,
  TextField,
  ButtonBase,
  Typography,
  InputAdornment,
  useTheme,
} from "@material-ui/core"
import { useSnackbar } from "notistack"

// External Imports
import QRCode from "qrcode.react"
import { useDropzone } from "react-dropzone"

// Local Imports
import LAMP from "lamp-core"
import { useTranslation } from "react-i18next"

function compress(file, width, height) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onerror = (error) => reject(error)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target.result as string
      img.onload = () => {
        const elem = document.createElement("canvas")
        elem.width = width
        elem.height = height
        const ctx = elem.getContext("2d")
        ctx.drawImage(img, 0, 0, width, height)
        resolve(ctx.canvas.toDataURL())
      }
    }
  })
}
export function CredentialEditor({ credential, auxData, mode, onChange }) {
  const { enqueueSnackbar } = useSnackbar()
  const [photo, setPhoto] = useState(credential?.image ?? "")
  const [name, setName] = useState(credential?.name ?? "")
  const [role, setRole] = useState(credential?.tooltip ?? "")
  const [emailAddress, setEmailAddress] = useState(credential?.email ?? "")
  const [password, setPassword] = useState("")
  const [showLink, setShowLink] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    setPhoto(auxData.photo)
    setRole(auxData.role)
  }, [auxData])
  const { acceptedFiles, getRootProps, getInputProps, isDragActive, isDragAccept } = useDropzone({
    onDropAccepted: useCallback((acceptedFiles) => {
      compress(acceptedFiles[0], 64, 64).then(setPhoto)
    }, []),
    onDropRejected: useCallback((rejectedFiles) => {
      if (rejectedFiles[0].size / 1024 / 1024 > 5) {
        enqueueSnackbar(t("Image size should not exceed 5 MB."), { variant: "error" })
      } else if ("image" !== rejectedFiles[0].type.split("/")[0]) {
        enqueueSnackbar(t("Not supported image type."), { variant: "error" })
      }
    }, []),
    accept: "image/*",
    maxSize: 2 * 1024 * 1024 /* 5MB */,
  })

  const credID = !!credential
    ? credential.description === "Default Credential"
      ? credential.origin
      : credential.access_key
    : ""
  const _qrLink = () =>
    window.location.href.split("#")[0] +
    "#/?a=" +
    btoa([credID, password, LAMP.Auth._auth.serverAddress].filter((x) => !!x).join(":"))

  return (
    <Grid container justify="center" alignItems="center">
      {["create-new", "change-role", "update-profile"].includes(mode) && (
        <Tooltip
          title={
            !photo
              ? t("Drag a photo or tap to select a photo.")
              : t("Drag a photo to replace the existing photo or tap to delete the photo.")
          }
        >
          <Box
            {...getRootProps()}
            my={2}
            width={128}
            height={128}
            border={1}
            borderRadius={4}
            borderColor={!(isDragActive || isDragAccept || !!photo) ? "text.secondary" : "#fff"}
            bgcolor={isDragActive || isDragAccept ? "text.secondary" : undefined}
            color={!(isDragActive || isDragAccept || !!photo) ? "text.secondary" : "#fff"}
            style={{
              background: !!photo ? `url(${photo}) center center/contain no-repeat` : undefined,
            }}
          >
            <ButtonBase style={{ width: "100%", height: "100%" }} onClick={() => !!photo && setPhoto(undefined)}>
              {!photo && <input {...getInputProps()} />}
              <Icon fontSize="large">{!photo ? "add_a_photo" : "delete_forever"}</Icon>
            </ButtonBase>
          </Box>
        </Tooltip>
      )}
      {["create-new", "update-profile"].includes(mode) && (
        <TextField
          fullWidth
          label={t("Name")}
          type="text"
          variant="outlined"
          helperText={t("Enter the family member or clinician's name here.")}
          value={name}
          onChange={(event) => setName(event.target.value)}
          style={{ marginBottom: 16 }}
        />
      )}
      {["create-new", "change-role", "update-profile"].includes(mode) && (
        <TextField
          fullWidth
          label={t("Role")}
          type="text"
          variant="outlined"
          helperText={t(
            "Enter the family member or clinician's role here. For this credential to appear as a care team member, either a photo or role MUST be saved."
          )}
          value={role}
          onChange={(event) => setRole(event.target.value)}
          style={{ marginBottom: 16 }}
          InputProps={{
            endAdornment: [
              !["change-role"].includes(mode) ? undefined : (
                <InputAdornment position="end" key="a">
                  <Tooltip title={t("Save Role & Photo")}>
                    <IconButton
                      edge="end"
                      aria-label="save role"
                      onClick={() =>
                        onChange({
                          credential,
                          photo,
                          name,
                          role,
                          emailAddress,
                          password,
                        })
                      }
                      onMouseDown={(event) => event.preventDefault()}
                    >
                      <Icon>check_circle</Icon>
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            ],
          }}
        />
      )}
      {["create-new", "update-profile"].includes(mode) && (
        <TextField
          fullWidth
          label={t("Email Address")}
          type="email"
          variant="outlined"
          helperText={t("Enter the email address here.")}
          value={emailAddress}
          onChange={(event) => setEmailAddress(event.target.value)}
          style={{ marginBottom: 16 }}
        />
      )}
      {["create-new", "reset-password", "update-profile"].includes(mode) && (
        <TextField
          fullWidth
          label={t("Password")}
          type="password"
          variant="outlined"
          helperText={t(
            "Enter the new password here, and press the done button to the right of the box. Tap away if you don't want to change the password."
          )}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          InputProps={{
            endAdornment: [
              ["create-new"].includes(mode) ? undefined : (
                <InputAdornment position="end" key="a">
                  <Tooltip
                    title={t("Copy one-time access link that can be used to log in without entering credentials.")}
                  >
                    <IconButton
                      edge="end"
                      aria-label="copy link"
                      onClick={() => setShowLink((showLink) => !showLink)}
                      onMouseDown={(event) => event.preventDefault()}
                    >
                      <Icon>save</Icon>
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
              !["reset-password", "create-new", "update-profile"].includes(mode) ? undefined : (
                <InputAdornment position="end" key="b">
                  <Tooltip title={t("Save Credential")}>
                    <IconButton
                      edge="end"
                      aria-label="submit credential"
                      onClick={() =>
                        onChange({
                          credential,
                          photo,
                          name,
                          role,
                          emailAddress,
                          password,
                        })
                      }
                      onMouseDown={(event) => event.preventDefault()}
                    >
                      <Icon>check_circle</Icon>
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            ],
          }}
        />
      )}
      {showLink && password.length > 0 && (
        <Grid item>
          <TextField
            fullWidth
            style={{ marginTop: 16 }}
            variant="outlined"
            value={_qrLink()}
            onChange={(event) => {}}
          />
          <Tooltip title={t("Scan this QR code on a mobile device to automatically open a patient dashboard.")}>
            <Grid container justify="center" style={{ padding: 16 }}>
              <QRCode size={256} level="H" value={_qrLink()} />
            </Grid>
          </Tooltip>
        </Grid>
      )}
    </Grid>
  )
}

export async function updateDetails(id, data, mode, allRoles, type) {
  try {
    if (mode === "reset-password" && !!data.password) {
      if (
        !!((await LAMP.Credential.update(id, data.credential.access_key, {
          ...data.credential,
          secret_key: data.password,
        })) as any).error
      )
        return -4
    } else if (mode === "create-new" && !!data.name && !!data.emailAddress && !!data.password) {
      if (!!((await LAMP.Credential.create(id, data.emailAddress, data.password, data.name)) as any).error) return -3
      await LAMP.Type.setAttachment(id, "me", "lamp.dashboard.credential_roles", {
        ...allRoles,
        [data.emailAddress]:
          !data.role && !data.photo && !data.name ? undefined : { role: data.role, name: data.name, photo: data.photo },
      })
    } else if (mode === "update-profile" && !!data.name && !!data.emailAddress && !!data.password) {
      if (
        !!((await LAMP.Credential.update(id, data.credential.access_key, {
          ...data.credential,
          secret_key: data.password,
        })) as any).error
      )
        return -4
      let attachmentName = type === 1 ? "lamp.dashboard.credential_roles.external" : "lamp.dashboard.credential_roles"
      await LAMP.Type.setAttachment(id, "me", attachmentName, {
        ...allRoles,
        [data.emailAddress]:
          !data.role && !data.photo && !data.name ? undefined : { role: data.role, name: data.name, photo: data.photo },
      })
    } else if (mode === "change-role") {
      await LAMP.Type.setAttachment(id, "me", "lamp.dashboard.credential_roles", {
        ...allRoles,
        [data.credential.access_key]: !data.role && !data.photo ? undefined : { role: data.role, photo: data.photo },
      })
    } else {
      return -1
    }
  } catch (err) {
    return -2
  }
  return 1
}
export const CredentialManager: React.FunctionComponent<{
  id?: any
  onComplete?: any
  style?: any
  credential?: any
  mode?: string
}> = ({ id, onComplete, credential, mode, ...props }) => {
  const theme = useTheme()
  const [selected, setSelected] = useState<any>({
    anchorEl: undefined,
    credential: credential ?? undefined,
    mode: mode ?? undefined,
  })
  const [allCreds, setAllCreds] = useState([])
  const [allRoles, setAllRoles] = useState({})
  const [shouldSyncWithChildren, setShouldSyncWithChildren] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation()
  const [ext, setExt] = useState([])
  const [int, setInt] = useState([])

  useEffect(() => {
    LAMP.Type.parent(id)
      .then((x) => Object.keys(x?.data || []).length === 0)
      .then((x) => setShouldSyncWithChildren(x))
    LAMP.Credential.list(id).then((cred) => {
      setAllCreds(cred)
    })
    setRoles()
  }, [])

  const setRoles = () => {
    if (LAMP.Auth._type === "researcher" || LAMP.Auth._type === "admin") {
      const prefix = "lamp.dashboard.credential_roles"
      ;(async () => {
        let ext = ((await LAMP.Type.getAttachment(id, `${prefix}.external`)) as any).data
        let int = ((await LAMP.Type.getAttachment(id, `${prefix}`)) as any).data
        setAllRoles(Object.assign(ext ?? {}, int ?? {}))
        setExt(Object.keys(ext ?? {}))
        setInt(Object.keys(int ?? {}))
      })()
    } else {
      LAMP.Type.getAttachment(id, "lamp.dashboard.credential_roles").then((res: any) => {
        setAllRoles(!!res.data ? res.data : {})
      })
    }
  }

  useEffect(() => {
    if (LAMP.Auth._type === "researcher" || LAMP.Auth._type === "admin") {
      if (shouldSyncWithChildren !== true) return
      LAMP.Type.getAttachment(id, "lamp.dashboard.credential_roles").then((res: any) => {
        !!res.data
          ? LAMP.Type.setAttachment(id, "Participant", "lamp.dashboard.credential_roles.external", res.data)
          : console.log("no roles to sync")
      })
    }
  }, [shouldSyncWithChildren, allRoles])

  const _submitCredential = async (data) => {
    let type = ext.includes(data.emailAddress) ? 1 : 2
    let result = await updateDetails(id, data, selected.mode, allRoles, type)
    if (result === -4) {
      return enqueueSnackbar(t("Could not change password."), {
        variant: "error",
      })
    }
    if (result === -1) {
      enqueueSnackbar(t("Could not perform operation for an unknown reason."), {
        variant: "error",
      })
    }
    if (result === -3) {
      enqueueSnackbar("Could not create credential.", {
        variant: "error",
      })
    }
    if (result === -2) {
      enqueueSnackbar(t("Credential management failed. The email address could be in use already."), {
        variant: "error",
      })
    }
    if (result === 1) {
      LAMP.Credential.list(id).then(setAllCreds)
      setRoles()
      return setSelected({
        anchorEl: undefined,
        credential: undefined,
        mode: undefined,
      })
    }
  }

  const _deleteCredential = async (credential) => {
    try {
      if (!!((await LAMP.Credential.delete(id, credential.access_key)) as any).error)
        return enqueueSnackbar(t("Could not delete."), { variant: "error" })
      await LAMP.Type.setAttachment(id, "me", "lamp.dashboard.credential_roles", {
        ...allRoles,
        [credential.access_key]: undefined,
      })
    } catch (err) {
      enqueueSnackbar(t("Credential management failed."), { variant: "error" })
    }
    LAMP.Credential.list(id).then(setAllCreds)
    LAMP.Type.getAttachment(id, "lamp.dashboard.credential_roles").then((res: any) =>
      setAllRoles(!!res.data ? res.data : [])
    )
  }

  return (
    <Box {...props}>
      <Grid container justify="center" alignItems="center" spacing={1} style={{ marginBottom: 16 }}>
        <Grid item xs={12}>
          <Typography variant="h6" align="center">
            {t("Manage Credentials")}
          </Typography>
        </Grid>
        {allCreds.map((x, idx) => (
          <Grid item key={idx}>
            <Tooltip
              title={
                <React.Fragment>
                  {x.description}
                  <br />
                  {x.access_key}
                </React.Fragment>
              }
            >
              <IconButton
                onClick={(event) =>
                  setSelected((selected) => ({
                    anchorEl: event.currentTarget,
                    credential: x,
                    mode: undefined,
                  }))
                }
              >
                <Avatar
                  src={(allRoles[(x || {}).access_key] || {}).photo}
                  style={{ backgroundColor: theme.palette.primary.main }}
                >
                  {x.description.substring(0, 1)}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Grid>
        ))}
        <Grid item>
          <Tooltip title={t("Add a new member of your care team.")}>
            <IconButton
              onClick={() =>
                setSelected((selected) => ({
                  anchorEl: undefined,
                  credential: undefined,
                  mode: selected.mode === "create-new" ? undefined : "create-new",
                }))
              }
            >
              <Avatar style={{ backgroundColor: theme.palette.secondary.main }}>+</Avatar>
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
      <Menu keepMounted anchorEl={selected.anchorEl} open={!!selected.anchorEl} onClose={() => setSelected({})}>
        <MenuItem
          onClick={() =>
            setSelected((selected) => ({
              anchorEl: undefined,
              credential: selected.credential,
              mode: "change-role",
            }))
          }
        >
          {t("Update Photo & Role")}
        </MenuItem>
        <MenuItem
          onClick={() =>
            setSelected((selected) => ({
              anchorEl: undefined,
              credential: selected.credential,
              mode: "reset-password",
            }))
          }
        >
          {t("Reset Password")}
        </MenuItem>
        <MenuItem
          onClick={() =>
            _deleteCredential(selected.credential).then(() =>
              setSelected((selected) => ({
                anchorEl: undefined,
                credential: undefined,
                mode: undefined,
              }))
            )
          }
        >
          <b>{t("Delete")}</b>
        </MenuItem>
      </Menu>
      {!!selected.mode && <Divider style={{ margin: "0px -24px 32px -24px" }} />}
      {!!selected.mode && (
        <CredentialEditor
          credential={selected.credential}
          auxData={allRoles[(selected.credential || {}).access_key] || {}}
          mode={selected.mode}
          onChange={(data) => _submitCredential(data)}
        />
      )}
    </Box>
  )
}
