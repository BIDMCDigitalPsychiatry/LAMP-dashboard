// Core Imports
import React, { useState, useEffect } from "react"
import {
  Card,
  Tooltip,
  Typography,
  Grid,
  Fab,
  Divider,
  IconButton,
  Icon,
  Button,
  ButtonGroup,
  TextField,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  StepButton,
  StepContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Menu,
  MenuItem,
} from "@material-ui/core"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

function ActivitySelector({ activities, selected, onSave, onDelete, index, ...props }) {
  const [_selected, setSelected] = useState(!!selected ? activities.filter((x) => x.id === selected)[0] : null)
  const [anchorEl, setAnchorEl] = useState<Element>()
  useEffect(() => {
    if (_selected !== selected) onSave && onSave(_selected.id)
  }, [_selected])
  return (
    <Draggable draggableId={`${index}`} index={index} {...props}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          <Tooltip
            enterDelay={1000}
            title="Drag the handle on the left to change the order in which this Activity appears in the group."
          >
            <ButtonGroup style={{ background: "#fff", margin: 8 }}>
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
        </div>
      )}
    </Draggable>
  )
}

export default function GroupCreator({
  activities,
  value,
  onSave,
  ...props
}: {
  activities?: any[]
  value?: any
  onSave?: any
}) {
  const [activeStep, setActiveStep] = useState(0)
  const [text, setText] = useState(!!value ? value.name : undefined)
  const [items, setItems] = useState(!!value ? value.settings : [])

  const onDragEnd = (result) => {
    if (!result.destination || result.destination.index === result.source.index) return
    setItems(reorder(items, result.source.index, result.destination.index))
  }

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <Typography variant="h4">{!!value ? "Modify an existing group." : "Create a new group."}</Typography>
        <Divider />
      </Grid>
      <Grid item>
        <TextField
          fullWidth
          variant="outlined"
          label="Group Title"
          defaultValue={text}
          onChange={(event) => setText(event.target.value)}
        />
      </Grid>
      <Grid item>
        <Divider />
        <Typography variant="h6">Configure activities and options.</Typography>
      </Grid>
      <Grid item>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="list">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
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
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <ButtonGroup style={{ background: "#fff", margin: 8 }}>
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
                  },
                  false /* overwrite */
                )
              }
              disabled={!onSave || items.length === 0 || items.filter((i) => i === null).length > 0 || !text}
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
