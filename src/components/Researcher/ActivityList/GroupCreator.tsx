// Core Imports
import React, { useState, useEffect } from "react"
import Box from "@material-ui/core/Box"
import Tooltip from "@material-ui/core/Tooltip"
import Typography from "@material-ui/core/Typography"
import Grid from "@material-ui/core/Grid"
import Fab from "@material-ui/core/Fab"
import Divider from "@material-ui/core/Divider"
import Icon from "@material-ui/core/Icon"
import Button from "@material-ui/core/Button"
import ButtonGroup from "@material-ui/core/ButtonGroup"
import TextField from "@material-ui/core/TextField"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import Container from "@material-ui/core/Container"
import Switch from "@material-ui/core/Switch"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import InputAdornment from "@material-ui/core/InputAdornment"

import makeStyles from "@material-ui/core/styles/makeStyles"
import createStyles from "@material-ui/core/styles/createStyles"
import { Theme } from "@material-ui/core/styles/createTheme"

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
  const [search, setSearch] = useState("")
  const [filteredActivities, setFilteredActivities] = useState(activities ?? [])

  const { t } = useTranslation()
  useEffect(() => {
    if (_selected !== selected && _selected !== null) onSave && onSave(_selected.id)
  }, [_selected])

  useEffect(() => {
    filterActivities(search)
  }, [search])
  const handleSearchChange = (event: any) => {
    setSearch(event.target.value)
  }
  const filterActivities = (searchVal: string) => {
    const searchTxt = searchVal.trim().toLowerCase()
    if (searchTxt.length > 0) {
      const filtered = activities.filter((activity) => activity.name?.toLowerCase()?.includes(searchTxt))
      setFilteredActivities(filtered)
    } else {
      setFilteredActivities(activities)
    }
  }
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
            <div style={{ padding: "8px" }}>
              <TextField
                placeholder="Search..."
                variant="outlined"
                size="small"
                value={search}
                onKeyDown={(e) => e.stopPropagation()}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon>search</Icon>
                    </InputAdornment>
                  ),
                }}
                style={{ marginBottom: 10 }}
              />
            </div>
            {!!filteredActivities && filteredActivities.length > 0 ? (
              filteredActivities.map((activity) => (
                <MenuItem
                  key={activity.id}
                  onClick={() => {
                    setAnchorEl(null)
                    setSelected(activity)
                  }}
                >
                  {t(activity.name)}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>{t("No Records Found")}</MenuItem>
            )}
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
              x.spec !== "lamp.group" &&
              x.spec !== "lamp.zoom_meeting" &&
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
          // initialize_opened: false,
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
                x.spec !== "lamp.module" &&
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
  // const [initializeOpened, setInitializeOpened] = useState(data.settings?.initialize_opened ?? false)
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

  // useEffect(() => {
  //   data.settings.initialize_opened = initializeOpened
  //   setData({ ...data, settings: data.settings })
  // }, [initializeOpened])

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
            {/* {type !== "lamp.group" && (
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
            )} */}
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
