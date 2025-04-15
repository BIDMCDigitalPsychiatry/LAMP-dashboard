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
  makeStyles,
  Theme,
  createStyles,
  Switch,
  FormControlLabel,
} from "@material-ui/core"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { useTranslation } from "react-i18next"
import { availableActivitySpecs } from "./Index"
import ActivityHeader from "./ActivityHeader"
import ActivityFooter from "./ActivityFooter"

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
            title={`${t(
              "Drag the handle on the left to change the order in which this Activity appears in the group."
            )}`}
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
                {`${t(_selected?.name ?? "No selection")}`}
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
                {`${t(activity.name)}`}
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
  details,
  onSave,
  studies,
  study,
  type,
  id,
  ...props
}: {
  activities?: any[]
  value?: any
  details?: any
  onSave?: Function
  studies: any
  study?: string
  type?: string
  id?: string
}) {
  const classes = useStyles()
  const [items, setItems] = useState(!!value ? value.settings.activities ?? value.settings : [])

  const [studyActivities, setStudyActivities] = useState(
    !!value || !!study
      ? type == "lamp.group"
        ? activities.filter(
            (x) =>
              x.spec !== "lamp.group" &&
              (!!study ? x.study_id === study : x.study_id === value.study_id) &&
              availableActivitySpecs.includes(x.spec)
          )
        : !!id
        ? activities.filter(
            (x) =>
              (!!study ? x.study_id === study : x.study_id === value.study_id) &&
              availableActivitySpecs.includes(x.spec) &&
              !!id &&
              x.id != id
          )
        : activities.filter(
            (x) =>
              (!!study ? x.study_id === study : x.study_id === value.study_id) &&
              availableActivitySpecs.includes(x.spec)
          )
      : []
  )

  const { t } = useTranslation()
  const [data, setData] = useState({
    id: value?.id ?? undefined,
    name: !!value ? value.name : undefined,
    spec: type,
    schedule: !!value ? value.schedule : [],
    description: !!details ? details?.description : undefined,
    photo: !!details ? details?.photo : null,
    streak: !!details ? details?.streak : null,
    showFeed: !!details ? details?.showFeed : null,
    settings: !!value
      ? value.settings
      : {
          activities: [],
          sequential_ordering: false,
          hide_sub_activities: false,
          hide_on_completion: false,
          initialize_opened: false,
        },
    studyID: !!value ? value.study_id : study,
    category: value?.category ?? [],
  })

  useEffect(() => {
    if (Array.isArray(data.settings)) {
      activities = data.settings
      data.settings = {}
      data.settings.activities = activities
    }
    data.settings.activities = items
    setData(data)
  }, [items])

  const handleChange = (details) => {
    if (!!details.studyId) {
      setStudyActivities(
        type == "lamp.group"
          ? activities.filter(
              (x) =>
                x.spec !== "lamp.group" &&
                (!!study ? x.study_id === study : x.study_id === details.studyId) &&
                availableActivitySpecs.includes(x.spec)
            )
          : !!id
          ? activities.filter(
              (x) =>
                (!!study ? x.study_id === study : x.study_id === details.studyId) &&
                availableActivitySpecs.includes(x.spec) &&
                !!id &&
                x.id != id
            )
          : activities.filter(
              (x) =>
                (!!study ? x.study_id === study : x.study_id === details.studyId) &&
                availableActivitySpecs.includes(x.spec)
            )
      )
    }
    setData({
      id: value?.id ?? undefined,
      name: details.text ?? "",
      spec: type,
      schedule: value?.schedule ?? [],
      settings: data?.settings ?? {},
      description: details.description,
      photo: details.photo,
      streak: details.streak,
      showFeed: details.showFeed,
      studyID: details.studyId,
      category: data?.category ?? [],
    })
  }

  const onDragEnd = (result) => {
    if (!result.destination || result.destination.index === result.source.index) return
    setItems(reorder(items, result.source.index, result.destination.index))
  }

  const validate = () => {
    return !(
      !onSave ||
      (items || []).length === 0 ||
      (items || []).filter((i) => i === null).length > 0 ||
      !data.name ||
      !data.studyID ||
      !data.name.trim().length
    )
  }

  const [sequentialOrdering, setSequentialOrdering] = useState(data.settings?.sequential_ordering ?? false)
  const [hideOnCompletion, setHideOnCompletion] = useState(data.settings?.hide_on_completion ?? false)
  const [initializeOpened, setInitializeOpened] = useState(data.settings?.initialize_opened ?? false)
  const [hideSubActivities, setHideSubActivities] = useState(data.settings?.hide_sub_activities ?? false)
  const [trackProgress, setTrackProgress] = useState(data.settings?.track_progress ?? false)

  useEffect(() => {
    data.settings.track_progress = trackProgress
    setData({ ...data, settings: data.settings })
  }, [trackProgress])

  useEffect(() => {
    data.settings.sequential_ordering = sequentialOrdering
    setData({ ...data, settings: data.settings })
  }, [sequentialOrdering])

  useEffect(() => {
    data.settings.hide_sub_activities = hideSubActivities
    setData({ ...data, settings: data.settings })
  }, [hideSubActivities])

  useEffect(() => {
    data.settings.hide_on_completion = hideOnCompletion
    setData({ ...data, settings: data.settings })
  }, [hideOnCompletion])

  useEffect(() => {
    data.settings.initialize_opened = initializeOpened
    setData({ ...data, settings: data.settings })
  }, [initializeOpened])

  const handleTabChange = (tab) => {
    setData({ ...data, category: tab })
  }

  return (
    <div>
      <Container className={classes.containerWidth}>
        <Grid container spacing={2}>
          <ActivityHeader
            studies={studies}
            value={value}
            details={details}
            activitySpecId={type}
            study={data.studyID}
            onChange={handleChange}
            onTabChange={handleTabChange}
            image={null}
          />

          <Box width={1}>
            <Divider />
          </Box>
          <Grid item xs={12}>
            <Typography variant="h6">{`${t("Configure activities and options.")}`}</Typography>
          </Grid>
          <Grid item>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="list">
                {(provided) => (
                  <Box ref={provided.innerRef} {...provided.droppableProps}>
                    {(items || []).map((x, idx) => (
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
            {type !== "lamp.group" && (
              <FormControlLabel
                value="sequential_ordering"
                control={
                  <Switch
                    color="primary"
                    onChange={(evt) => setSequentialOrdering(evt.target.checked)}
                    checked={data.settings?.sequential_ordering}
                  />
                }
                label="Sequential Ordering"
                labelPlacement="end"
              />
            )}
            {type !== "lamp.group" && (
              <FormControlLabel
                value="initialize_opened"
                control={
                  <Switch
                    color="primary"
                    checked={data.settings?.initialize_opened}
                    onChange={(evt) => setInitializeOpened(evt.target.checked)}
                  />
                }
                label="Initialize Opened"
                labelPlacement="end"
              />
            )}
            {type !== "lamp.group" && (
              <FormControlLabel
                value="hide_on_completion"
                control={
                  <Switch
                    color="primary"
                    checked={data.settings?.hide_on_completion}
                    onChange={(evt) => setHideOnCompletion(evt.target.checked)}
                  />
                }
                label="Hide on Completion"
                labelPlacement="end"
              />
            )}
            <FormControlLabel
              value="hide_sub_activities"
              control={
                <Switch
                  color="primary"
                  checked={data.settings?.hide_sub_activities}
                  onChange={(evt) => setHideSubActivities(evt.target.checked)}
                />
              }
              label="Hide Sub Activities"
              labelPlacement="end"
            />
            <FormControlLabel
              value="track_progress"
              control={
                <Switch
                  color="primary"
                  checked={data.settings?.track_progress}
                  onChange={(evt) => setTrackProgress(evt.target.checked)}
                />
              }
              label="Track Activity Progress"
              labelPlacement="end"
            />
            <ButtonGroup>
              <Button
                variant="contained"
                color="primary"
                disabled={!data.studyID || studyActivities.length === 0}
                onClick={() => setItems((items) => [...items, null])}
              >
                <Icon>add_circle</Icon>
              </Button>
              <Button
                variant="contained"
                size="small"
                color="primary"
                onClick={() => setItems((items) => [...items, null])}
                disabled={!data.studyID || studyActivities.length === 0}
              >
                {`${t("Add Activity")}`}
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      </Container>
      <ActivityFooter onSave={onSave} validate={validate} value={value} data={data} />
    </div>
  )
}
