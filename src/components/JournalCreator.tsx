// Core Imports
import React, { useState, useEffect, useCallback } from "react"
import {
  Box,
  Tooltip,
  Typography,
  Grid,
  Fab,
  Divider,
  MenuItem,
  Icon,
  TextField,
  ButtonBase,
  Container,
  Backdrop,
  CircularProgress,
} from "@material-ui/core"
import { useDropzone } from "react-dropzone"
import { makeStyles, Theme, createStyles, createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import { useSnackbar } from "notistack"
import JournalIcon from "../icons/Journal.svg"

const theme = createMuiTheme({
  palette: {
    secondary: {
      main: "#333",
    },
  },
  overrides: {
    MuiFilledInput: {
      root: {
        border: 0,
        backgroundColor: "#f4f4f4",
      },
      underline: {
        "&&&:before": {
          borderBottom: "none",
        },
        "&&:after": {
          borderBottom: "none",
        },
      },
    },
    MuiTextField: {
      root: { width: "100%" },
    },
    MuiDivider: {
      root: { margin: "25px 0" },
    },
  },
})

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    containerWidth: { maxWidth: 1055 },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
  })
)

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

export default function JournalCreator({
  activities,
  value,
  onSave,
  onCancel,
  activitySpecId,
  details,
  studies,
  ...props
}: {
  activities?: any
  value?: any
  onSave?: any
  onCancel?: any
  activitySpecId?: string
  details?: any
  studies?: any
}) {
  const { enqueueSnackbar } = useSnackbar()
  const classes = useStyles()
  const [text, setText] = useState(!!value ? value.name : undefined)
  const [description, setDescription] = useState(details?.description ?? null)
  const [photo, setPhoto] = useState(details?.photo ?? JournalIcon)
  const [disabled, setDisabled] = useState(true)
  const [loading, setLoading] = React.useState(false)
  const [studyId, setStudyId] = useState(!!value ? value.parentID : undefined)

  const onDrop = useCallback((acceptedFiles) => compress(acceptedFiles[0], 64, 64).then(setPhoto), [])
  // eslint-disable-next-line
  const { acceptedFiles, getRootProps, getInputProps, isDragActive, isDragAccept } = useDropzone({
    onDrop,
    accept: "image/*",
    maxSize: 2 * 1024 * 1024 /* 5MB */,
  })

  const validate = () => {
    let duplicates = []
    if (typeof text !== "undefined" && text?.trim() !== "") {
      duplicates = activities.filter(
        (x) =>
          (!!value
            ? x.name.toLowerCase() === text?.trim().toLowerCase() && x.id !== value?.id
            : x.name.toLowerCase() === text?.trim().toLowerCase()) && studyId === x.parentID
      )
      if (duplicates.length > 0) {
        enqueueSnackbar("Activity with same name already exist.", { variant: "error" })
      }
    }
    return !(
      typeof studyId == "undefined" ||
      studyId === null ||
      studyId === "" ||
      duplicates.length > 0 ||
      typeof text === "undefined" ||
      (typeof text !== "undefined" && text?.trim() === "")
    )
  }

  return (
    <Grid container direction="column" spacing={2} {...props}>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <MuiThemeProvider theme={theme}>
        <Container className={classes.containerWidth}>
          <Grid container spacing={2}>
            <Grid item xs md={2}>
              <Tooltip
                title={
                  !photo
                    ? "Drag a photo or tap to select a photo."
                    : "Drag a photo to replace the existing photo or tap to delete the photo."
                }
              >
                <Box
                  {...getRootProps()}
                  width={154}
                  height={154}
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
            </Grid>
            <Grid item md={10}>
              <Grid container spacing={2}>
                <Grid item lg={4}>
                  <TextField
                    error={typeof studyId == "undefined" || studyId === null || studyId === "" ? true : false}
                    id="filled-select-currency"
                    select
                    label="Study"
                    value={studyId}
                    onChange={(e) => {
                      setStudyId(e.target.value)
                    }}
                    helperText={
                      typeof studyId == "undefined" || studyId === null || studyId === ""
                        ? "Please select the study"
                        : ""
                    }
                    variant="filled"
                    disabled={!!value ? true : false}
                  >
                    {studies.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs>
                  <Box mb={3}>
                    <TextField
                      error={
                        typeof text === "undefined" || (typeof text !== "undefined" && text?.trim() === "")
                          ? true
                          : false
                      }
                      fullWidth
                      variant="filled"
                      label="Activity Title"
                      defaultValue={text}
                      onChange={(event) => setText(event.target.value)}
                      inputProps={{ maxLength: 80 }}
                    />
                  </Box>
                </Grid>
              </Grid>

              <Box>
                <TextField
                  fullWidth
                  multiline
                  label="Activity Description"
                  variant="filled"
                  rows={2}
                  defaultValue={description}
                  onChange={(event) => setDescription(event.target.value)}
                  inputProps={{ maxLength: 2500 }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </MuiThemeProvider>

      <Grid
        container
        direction="column"
        alignItems="flex-end"
        spacing={1}
        style={{ position: "fixed", bottom: 24, right: 24, width: "auto" }}
      >
        {!!value && (
          <Grid item>
            <Tooltip title="Duplicate this activity and save it with a new title.">
              <Fab
                color="primary"
                aria-label="Duplicate"
                variant="extended"
                onClick={() => {
                  if (validate()) {
                    setLoading(true)
                    onSave(
                      {
                        id: undefined,
                        name: text,
                        spec: value?.spec,
                        schedule: [],
                        description: description,
                        photo: photo,
                        studyID: studyId,
                      },
                      true /* duplicate */
                    )
                  }
                }}
                disabled={
                  !validate() ||
                  !disabled ||
                  !onSave ||
                  !text ||
                  (value.name.trim() === text.trim() && value.parentID === studyId)
                }
              >
                Duplicate
                <span style={{ width: 8 }} />
                <Icon>file_copy</Icon>
              </Fab>
            </Tooltip>
          </Grid>
        )}
        <Grid item>
          <Tooltip title="Save this activity.">
            <Fab
              color="secondary"
              aria-label="Save"
              variant="extended"
              onClick={() => {
                if (validate()) {
                  setLoading(true)
                  onSave(
                    {
                      id: value?.id ?? undefined,
                      name: text,
                      spec: value?.spec ?? activitySpecId,
                      schedule: [],
                      description: description,
                      photo: photo,
                      studyID: studyId,
                    },
                    false /* overwrite */
                  )
                }
              }}
              disabled={!validate() || !disabled || !onSave || !text}
            >
              Save
              <span style={{ width: 8 }} />
              <Icon>save</Icon>
            </Fab>
          </Tooltip>
        </Grid>
      </Grid>
    </Grid>
  )
}
