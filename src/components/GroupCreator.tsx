// Core Imports
import React, { useState, useEffect } from "react"
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
} from "@material-ui/core"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { makeStyles, Theme, createStyles, createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"

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
  useEffect(() => {
    if (_selected !== selected && _selected !== null) onSave && onSave(_selected.id)
  }, [_selected])
  return (
    <Draggable draggableId={`${index}`} index={index} {...props}>
      {(provided) => (
        <Box ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          <Tooltip
            enterDelay={1000}
            title="Drag the handle on the left to change the order in which this Activity appears in the group."
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
                {_selected?.name ?? "No selection"}
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
                {activity.name}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      )}
    </Draggable>
  )
}

export default function GroupCreator({
  activities,
  value,
  onSave,
  studies,
  ...props
}: {
  activities?: any[]
  value?: any
  onSave?: any
  studies: any
}) {
  const classes = useStyles()
  const [text, setText] = useState(!!value ? value.name : undefined)
  const [items, setItems] = useState(!!value ? value.settings : [])
  const [studyId, setStudyId] = useState(!!value ? value.parentID : undefined)

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
              <Typography variant="h6">{!!value ? "Modify an existing group." : "Create a new group."}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                error={typeof studyId == "undefined" || studyId === null || studyId === "" ? true : false}
                id="filled-select-currency"
                select
                label="Select"
                value={studyId}
                onChange={(e) => {
                  setStudyId(e.target.value)
                }}
                helperText={
                  typeof studyId == "undefined" || studyId === null || studyId === "" ? "Please select the study" : ""
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="filled"
                label="Group Title"
                defaultValue={text}
                onChange={(event) => setText(event.target.value)}
              />
            </Grid>
            <Box width={1}>
              <Divider />
            </Box>
            <Grid item xs={12}>
              <Typography variant="h6">Configure activities and options.</Typography>
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
                          activities={activities.filter((x) => x.spec !== "lamp.group")}
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
                <Button variant="contained" color="primary" onClick={() => setItems((items) => [...items, null])}>
                  <Icon>add_circle</Icon>
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  onClick={() => setItems((items) => [...items, null])}
                >
                  Add Activity
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
          <Tooltip title="Save this activity group.">
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
                  },
                  false /* overwrite */
                )
              }
              disabled={
                !onSave || items.length === 0 || items.filter((i) => i === null).length > 0 || !text || !studyId
              }
            >
              Save
              <span style={{ width: 8 }} />
              <Icon>save</Icon>
            </Fab>
          </Tooltip>
        </Grid>
      </Grid>
    </div>
  )
}
