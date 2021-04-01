// Core Imports
import React, { useState, useEffect, useCallback } from "react"
import {
  Box,
  Tooltip,
  Typography,
  Grid,
  Fab,
  Divider,
  Icon,
  Button,
  ButtonGroup,
  TextField,
  Menu,
  MenuItem,
  Container,
  ButtonBase,
} from "@material-ui/core"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { makeStyles, Theme, createStyles, createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import { useTranslation } from "react-i18next"
import { useDropzone } from "react-dropzone"
import { useSnackbar } from "notistack"

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
    MuiStepper: {
      root: { paddingLeft: 8 },
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

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

function ActivitySelector({ activities, selected, onSave, onDelete, index, ...props }) {
  const [_selected, setSelected] = useState(!!selected ? activities.filter((x) => x?.id === selected)[0] ?? null : null)
  const [anchorEl, setAnchorEl] = useState<Element>()
  const { t } = useTranslation()
  useEffect(() => {
    if (_selected !== selected && _selected !== null) onSave && onSave(_selected.id)
  }, [_selected])
  return (
    <Draggable draggableId={`${index}`} index={index} {...props}>
      {(provided) => (
        <Box ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          <Tooltip
            enterDelay={1000}
            title={t("Drag the handle on the left to change the order in which this Activity appears in the group.")}
          >
            <ButtonGroup style={{ background: "#fff", marginBottom: 8 }}>
              <Button disabled variant="outlined" color={_selected?.name ? "primary" : "secondary"}>
                <Icon>drag_indicator</Icon>
              </Button>
              <Button
                variant="outlined"
                color={_selected?.name ? "primary" : "secondary"}
                onClick={(e) => setAnchorEl(e.currentTarget)}
              >
                {t(_selected?.name ?? "No selection")}
              </Button>

              <Button
                variant="outlined"
                color={_selected?.name ? "primary" : "secondary"}
                onClick={() => onDelete && onDelete()}
              >
                <Icon>delete_forever</Icon>
              </Button>
            </ButtonGroup>
          </Tooltip>
          <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={() => setAnchorEl(undefined)}>
            {activities.map((activity) => (
              <MenuItem
                onClick={() => {
                  setAnchorEl(undefined)
                  setSelected(activity)
                }}
              >
                {t(activity.name)}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      )}
    </Draggable>
  )
}

function compress(file, width, height) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    const fileName = file.name
    const extension = fileName.split(".").reverse()[0].toLowerCase()
    reader.onerror = (error) => reject(error)
    if (extension !== "svg") {
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
    } else {
      reader.onload = (event) => {
        resolve(reader.result)
      }
    }
  })
}
const removeExtraSpace = (s) => s.trim().split(/ +/).join(" ")

const availableAtiveSpecs = [
  "lamp.group",
  "lamp.survey",
  "lamp.journal",
  "lamp.jewels_a",
  "lamp.jewels_b",
  "lamp.breathe",
  "lamp.spatial_span",
  "lamp.tips",
  "lamp.cats_and_dogs",
  "lamp.scratch_image",
  "lamp.dbt_diary_card",
]

export default function GroupCreator({
  activities,
  value,
  details,
  onSave,
  studies,
  study,
  ...props
}: {
  activities?: any[]
  value?: any
  details?: any
  onSave?: any
  studies: any
  study?: any
}) {
  console.log(activities)
  const classes = useStyles()
  const [text, setText] = useState(!!value ? value.name : undefined)
  const [items, setItems] = useState(!!value ? value.settings : [])
  const [studyId, setStudyId] = useState(!!value ? value.parentID : study)
  const [studyActivities, setStudyActivities] = useState(
    !!value || !!study
      ? activities.filter(
          (x) =>
            x.spec !== "lamp.group" &&
            (!!study ? x.parentID === study : x.parentID === value.parentID) &&
            availableAtiveSpecs.includes(x.spec)
        )
      : []
  )
  const { t } = useTranslation()
  const [photo, setPhoto] = useState(details?.photo ?? null)
  const { enqueueSnackbar } = useSnackbar()

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

  const onDragEnd = (result) => {
    if (!result.destination || result.destination.index === result.source.index) return
    setItems(reorder(items, result.source.index, result.destination.index))
  }

  return (
    <div>
      <MuiThemeProvider theme={theme}>
        <Container className={classes.containerWidth}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">
                {!!value ? t("Modify an existing group.") : t("Create a new group.")}
              </Typography>
            </Grid>
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
            <Grid item xs={12} sm={6}>
              <Box mb={2}>
                <TextField
                  error={typeof studyId == "undefined" || studyId === null || studyId === "" ? true : false}
                  id="filled-select-currency"
                  select
                  label={t("Study")}
                  value={studyId}
                  onChange={(e) => {
                    setStudyActivities(
                      activities.filter((x) => x.spec !== "lamp.group" && x.parentID === e.target.value)
                    )
                    setStudyId(e.target.value)
                  }}
                  helperText={
                    typeof studyId == "undefined" || studyId === null || studyId === ""
                      ? t("Please select the Study")
                      : ""
                  }
                  variant="filled"
                  disabled={!!value || !!study ? true : false}
                >
                  {studies.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              <Box>
                <TextField
                  fullWidth
                  variant="filled"
                  label={t("Group Title")}
                  defaultValue={text}
                  onChange={(event) => setText(removeExtraSpace(event.target.value))}
                  error={
                    typeof text == "undefined" || text === null || text === "" || !text.trim().length ? true : false
                  }
                  helperText={
                    typeof text == "undefined" || text === null || text === "" || !text.trim().length
                      ? t("Please enter Group Title")
                      : ""
                  }
                  inputProps={{ style: { textTransform: "capitalize" } }}
                />
              </Box>
            </Grid>

            <Box width={1}>
              <Divider />
            </Box>
            <Grid item xs={12}>
              <Typography variant="h6">{t("Configure activities and options.")}</Typography>
            </Grid>
            <Grid item>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="list">
                  {(provided) => (
                    <Box ref={provided.innerRef} {...provided.droppableProps}>
                      {items.map((x, idx) => (
                        <ActivitySelector
                          index={idx}
                          key={`${idx}.${x}`}
                          activities={studyActivities}
                          selected={x}
                          onSave={(x) =>
                            setItems((it) => {
                              let y = [...it]
                              y[idx] = x
                              return y
                            })
                          }
                          onDelete={() =>
                            setItems((it) => {
                              let x = [...it]
                              x.splice(idx, 1)
                              return x
                            })
                          }
                        />
                      ))}
                      {provided.placeholder}
                    </Box>
                  )}
                </Droppable>
              </DragDropContext>
              <ButtonGroup>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!studyId || studyActivities.length === 0}
                  onClick={() => setItems((items) => [...items, null])}
                >
                  <Icon>add_circle</Icon>
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  onClick={() => setItems((items) => [...items, null])}
                  disabled={!studyId || studyActivities.length === 0}
                >
                  {t("Add Activity")}
                </Button>
              </ButtonGroup>
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
        <Grid item>
          <Tooltip title={t("Save this activity group.")}>
            <Fab
              color="secondary"
              aria-label="Save"
              variant="extended"
              onClick={() =>
                onSave(
                  {
                    id: undefined,
                    name: text,
                    spec: "lamp.group",
                    schedule: [],
                    settings: items.filter((i) => i !== null),
                    studyID: studyId,
                    photo: photo,
                  },
                  false /* overwrite */
                )
              }
              disabled={
                !onSave ||
                items.length === 0 ||
                items.filter((i) => i === null).length > 0 ||
                !text ||
                !studyId ||
                !text.trim().length
              }
            >
              {t("Save")}
              <span style={{ width: 8 }} />
              <Icon>save</Icon>
            </Fab>
          </Tooltip>
        </Grid>
      </Grid>
    </div>
  )
}
