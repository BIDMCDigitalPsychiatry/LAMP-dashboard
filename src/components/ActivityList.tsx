// Core Imports
import React, { useState, useEffect, useCallback } from "react"
import {
  IconButton,
  Box,
  Icon,
  Button,
  Typography,
  Dialog,
  DialogActions,
  Slide,
  Menu,
  MenuItem,
} from "@material-ui/core"
import MaterialTable from "material-table"
import { useSnackbar } from "notistack"

// External Imports
import { saveAs } from "file-saver"
import { useDropzone } from "react-dropzone"

// Local Imports
import LAMP from "lamp-core"
import Activity from "./Activity"
import SurveyCreator from "./SurveyCreator"
import GroupCreator from "./GroupCreator"
import ActivityScheduler from "./ActivityScheduler"
import ResponsiveDialog from "./ResponsiveDialog"

function _hideCognitiveTesting() {
  return (LAMP.Auth._auth.serverAddress || "").includes(".psych.digital")
}

// TODO: Blogs/Tips/AppHelp

// Splice a raw Activity object with its ActivityDescription object.
export function spliceActivity({ raw, tag }) {
  return {
    id: raw.id,
    spec: "lamp.survey",
    name: raw.name,
    description: tag?.description,
    schedule: raw.schedule,
    settings: !Array.isArray(raw.settings)
      ? raw.settings
      : raw.settings.map((question, idx) => ({
          text: question.text,
          type: tag?.questions?.[idx]?.multiselect === true ? "multiselect" : question.type,
          description: tag?.questions?.[idx]?.description,
          options:
            question.options === null
              ? null
              : question.options?.map((z, idx2) => ({
                  value: z,
                  description: tag?.questions?.[idx]?.options?.[idx2],
                })),
        })),
  }
}

// Un-splice an object into its raw Activity object and ActivityDescription object.
export function unspliceActivity(x) {
  return {
    raw: {
      id: x.id,
      spec: "lamp.survey",
      name: x.name,
      schedule: x.schedule,
      settings: x.settings?.map((y) => ({
        text: y?.text,
        type: y?.type === "multiselect" ? "list" : y?.type,
        options: y?.options === null ? null : y?.options?.map((z) => z?.value),
      })),
    },
    tag: {
      description: x.description,
      questions: x.settings?.map((y) => ({
        multiselect: y?.type === "multiselect" ? true : undefined,
        description: y?.description,
        options: y?.options === null ? null : y?.options?.map((z) => z?.description),
      })),
    },
  }
}

export default function ActivityList({ studyID, title, ...props }) {
  const [activitySpecs, setActivitySpecs] = useState([])
  const [activities, setActivities] = useState([])
  const [createMenu, setCreateMenu] = useState<Element>()
  const [showCreate, setShowCreate] = useState(false)
  const [groupCreate, setGroupCreate] = useState(false)
  const [showActivityImport, setShowActivityImport] = useState(false)
  const [importFile, setImportFile] = useState<any>()
  const [selectedActivity, setSelectedActivity] = useState<any>()
  const { enqueueSnackbar } = useSnackbar()
  useEffect(() => {
    LAMP.Activity.allByStudy(studyID).then(setActivities)
    LAMP.ActivitySpec.all().then((res) =>
      setActivitySpecs(res.filter((x) => !["lamp.activity_group", "lamp.group", "lamp.survey"].includes(x.name)))
    )
  }, [])
  const onChange = () => LAMP.Activity.allByStudy(studyID).then(setActivities)
  useEffect(() => {
    onChange()
  }, [showCreate])
  useEffect(() => {
    onChange()
  }, [groupCreate])
  const onDrop = useCallback((acceptedFiles) => {
    const reader = new FileReader()
    reader.onabort = () => enqueueSnackbar("Couldn't import the Activities.", { variant: "error" })
    reader.onerror = () => enqueueSnackbar("Couldn't import the Activities.", { variant: "error" })
    reader.onload = () => {
      setShowActivityImport(false)
      let obj = JSON.parse(decodeURIComponent(escape(atob(reader.result as string))))
      if (
        Array.isArray(obj) &&
        obj.filter((x) => typeof x === "object" && !!x.name && !!x.settings && !!x.schedule).length > 0
      )
        setImportFile(obj)
      else enqueueSnackbar("Couldn't import the Activities.", { variant: "error" })
    }
    acceptedFiles.forEach((file) => reader.readAsText(file))
  }, [])
  // eslint-disable-next-line
  const { acceptedFiles, getRootProps, getInputProps, isDragActive, isDragAccept } = useDropzone({
    onDrop,
    accept: "application/json,.json",
    maxSize: 5 * 1024 * 1024 /* 5MB */,
  })
  const _saveFile = (data) =>
    saveAs(
      new Blob([btoa(unescape(encodeURIComponent(JSON.stringify(data))))], {
        type: "text/plain;charset=utf-8",
      }),
      "export.json"
    )

  // ---------------------------

  // Import a file containing pre-linked Activity objects from another Study.
  const importActivities = async () => {
    const _importFile = [...importFile] // clone it so we can close the dialog first
    setImportFile(undefined)

    let allIDs = _importFile.map((x) => x.id).reduce((prev, curr) => ({ ...prev, [curr]: undefined }), {})
    let brokenGroupsCount = _importFile
      .filter((activity) => activity.spec === "lamp.group")
      .filter((activity) => activity.settings.filter((x) => !Object.keys(allIDs).includes(x)).length > 0).length
    if (brokenGroupsCount > 0) {
      enqueueSnackbar("Couldn't import the Activities because some Activities are misconfigured or missing.", {
        variant: "error",
      })
      return
    }

    // Surveys only.
    for (let x of _importFile.filter((x) => ["lamp.survey"].includes(x.spec))) {
      const { raw, tag } = unspliceActivity(x)
      try {
        allIDs[raw.id] = ((await LAMP.Activity.create(studyID, {
          ...raw,
          id: undefined,
          tableData: undefined,
        } as any)) as any).data
        await LAMP.Type.setAttachment(allIDs[raw.id], "me", "lamp.dashboard.survey_description", tag)
      } catch (e) {
        enqueueSnackbar("Couldn't import one of the selected survey Activities.", { variant: "error" })
      }
    }

    // CTests only.
    for (let x of _importFile.filter((x) => !["lamp.group", "lamp.survey"].includes(x.spec))) {
      try {
        allIDs[x.id] = ((await LAMP.Activity.create(studyID, {
          ...x,
          id: undefined,
          tableData: undefined,
        })) as any).data
      } catch (e) {
        enqueueSnackbar("Couldn't import one of the selected cognitive test Activities.", { variant: "error" })
      }
    }

    // Groups only. This MUST be done last or the mapping will be incorrect (allIDs).
    for (let x of _importFile.filter((x) => ["lamp.group"].includes(x.spec))) {
      try {
        await LAMP.Activity.create(studyID, {
          ...x,
          id: undefined,
          tableData: undefined,
          settings: x.settings.map((y) => allIDs[y]),
        })
      } catch (e) {
        enqueueSnackbar("Couldn't import one of the selected Activity groups.", { variant: "error" })
      }
    }

    onChange()
    enqueueSnackbar("The selected Activities were successfully imported.", {
      variant: "success",
    })
  }

  // Export a file containing this Study's pre-linked Activity objects.
  const downloadActivities = async (rows) => {
    let data = []
    for (let x of rows) {
      if (x.spec === "lamp.survey") {
        try {
          let res = (await LAMP.Type.getAttachment(x.id, "lamp.dashboard.survey_description")) as any
          let activity = spliceActivity({
            raw: { ...x, tableData: undefined },
            tag: !!res.error ? undefined : res.data,
          })
          data.push(activity)
        } catch (e) {}
      } else data.push({ ...x, tableData: undefined })
    }
    _saveFile(data)
    enqueueSnackbar("The selected Activities were successfully exported.", {
      variant: "info",
    })
  }

  // Create a new Activity object & survey descriptions if set.
  const saveActivity = async (x) => {
    // FIXME: ensure this is a lamp.survey only!
    const { raw, tag } = unspliceActivity(x)
    let newItem = (await LAMP.Activity.create(studyID, raw)) as any
    await LAMP.Type.setAttachment(newItem.data, "me", "lamp.dashboard.survey_description", tag)
    enqueueSnackbar("Successfully created a new survey Activity.", {
      variant: "success",
    })
    setShowCreate(false)
  }

  // Create a new Activity object that represents a group of other Activities.
  const saveGroup = async (x) => {
    let newItem = (await LAMP.Activity.create(studyID, {
      ...x,
      id: undefined,
      schedule: [
        {
          start_date: "1970-01-01T00:00:00.000Z", // FIXME should not need this!
          time: "1970-01-01T00:00:00.000Z", // FIXME should not need this!
          repeat_interval: "none", // FIXME should not need this!
          custom_time: null, // FIXME should not need this!
        },
      ],
    })) as any
    //console.dir(newItem)
    if (!!newItem.error)
      enqueueSnackbar("Failed to create a new group Activity.", {
        variant: "error",
      })
    else
      enqueueSnackbar("Successfully created a new group Activity.", {
        variant: "success",
      })
    setGroupCreate(false)
  }

  // Create a new Activity object that represents a cognitive test.
  const saveCTest = async (x) => {
    let newItem = (await LAMP.Activity.create(studyID, { spec: x.name })) as any
    //console.dir(newItem)
    if (!!newItem.data) {
      onChange()
      enqueueSnackbar("Successfully created a new cognitive test Activity.", {
        variant: "success",
      })
    } else
      enqueueSnackbar("Failed to create a new cognitive test Activity.", {
        variant: "error",
      })
  }

  // Delete the selected Activity objects & survey descriptions if set.
  const deleteActivities = async (rows) => {
    for (let activity of rows) {
      if (activity.spec === "lamp.survey") {
        let tag = await LAMP.Type.setAttachment(activity.id, "me", "lamp.dashboard.survey_description", null)
        console.dir("deleted tag " + JSON.stringify(tag))
      }
      let raw = await LAMP.Activity.delete(activity.id)
      //console.dir(raw)
    }
    enqueueSnackbar("Successfully deleted the selected Activities.", {
      variant: "success",
    })
    onChange()
  }

  // Begin an Activity object modification (ONLY DESCRIPTIONS).
  const modifyActivity = async (raw) => {
    if (raw.spec === "lamp.survey") {
      let tag = [await LAMP.Type.getAttachment(raw.id, "lamp.dashboard.survey_description")].map((y: any) =>
        !!y.error ? undefined : y.data
      )[0]
      const activity = spliceActivity({ raw, tag })
      setSelectedActivity(activity)
    } else if (raw.spec === "lamp.group") {
      setSelectedActivity(raw)
    } else if (["lamp.jewels_a", "lamp.jewels_b"].includes(raw.spec)) {
      setSelectedActivity(raw)
    } //else setSelectedActivity(raw) // FIXME
  }

  // Commit an update to an Activity object (ONLY DESCRIPTIONS).
  const updateActivity = async (x, isDuplicated) => {
    if (!["lamp.group", "lamp.survey"].includes(x.spec)) {
      // Short-circuit for groups and CTests
      let result = (await LAMP.Activity.update(x.id, { settings: x.settings })) as any
      if (!!result.error)
        enqueueSnackbar("Encountered an error: " + result?.error, {
          variant: "error",
        })
      else
        enqueueSnackbar("Successfully updated the Activity.", {
          variant: "success",
        })
    } else if (x.spec === "lamp.group") {
      //
      let result = (await LAMP.Activity.update(selectedActivity.id, {
        settings: x.settings,
      })) as any
      if (!!result.error)
        enqueueSnackbar("Encountered an error: " + result?.error, {
          variant: "error",
        })
      else
        enqueueSnackbar("Successfully updated the Activity.", {
          variant: "success",
        })
      onChange()
    } else if (x.spec === "lamp.survey") {
      //
      const { raw, tag } = unspliceActivity(x)
      if (isDuplicated) {
        /* duplicate */ let newItem = (await LAMP.Activity.create(studyID, raw)) as any
        await LAMP.Type.setAttachment(newItem.data, "me", "lamp.dashboard.survey_description", tag)
        enqueueSnackbar("Successfully duplicated the Activity under a new name.", { variant: "success" })
        onChange()
      } /* overwrite */ else {
        /* // FIXME: DISABLED UNTIL FURTHER NOTICE!
                raw.id = selectedActivity.id
                raw.schedule = selectedActivity.schedule
                await LAMP.Activity.updateActivity(raw)
                */
        await LAMP.Type.setAttachment(selectedActivity.id, "me", "lamp.dashboard.survey_description", tag)
        enqueueSnackbar("Only survey description content was modified to prevent irrecoverable data loss.", {
          variant: "error",
        })
      }
    }
    setSelectedActivity(undefined)
  }

  //
  const updateSchedule = async (x) => {
    let result = await LAMP.Activity.update(x.id, { schedule: x.schedule })
    let tbl = activities.reduce((prev, curr) => ({ ...prev, [curr.id]: curr.tableData }), {})
    let all = await LAMP.Activity.allByStudy(studyID)
    setActivities(all) // need to resave below to trigger detail panel correctly!
    setActivities(all.map((x) => ({ ...x, tableData: { ...tbl[x.id], id: undefined } })))
  }

  return (
    <React.Fragment>
      <MaterialTable
        title={title}
        data={activities}
        columns={[
          { title: "Name", field: "name" },
          {
            title: "Type",
            field: "spec",
            lookup: { "lamp.survey": "Survey", "lamp.group": "Group" },
            emptyValue: "Cognitive Test",
          },
        ]}
        onRowClick={(event, rowData, togglePanel) => modifyActivity(rowData)}
        detailPanel={(rowData) => (
          <Box ml={6} borderLeft={1} borderColor="grey.300">
            <ActivityScheduler activity={rowData} onChange={(x) => updateSchedule({ ...rowData, schedule: x })} />
          </Box>
        )}
        actions={[
          {
            icon: "cloud_upload",
            tooltip: "Import",
            isFreeAction: true,
            onClick: (event, rows) => setShowActivityImport(true),
          },
          {
            icon: "cloud_download",
            tooltip: "Export",
            onClick: (event, rows) => downloadActivities(rows),
          },
          {
            icon: "add_box",
            tooltip: "Create",
            isFreeAction: true,
            onClick: (event, rows) => setCreateMenu(event.currentTarget.parentNode),
          },
          {
            icon: "delete_forever",
            tooltip: "Delete",
            onClick: async (event, rows) => deleteActivities(rows),
          },
        ]}
        localization={{
          body: {
            emptyDataSourceMessage: "No Activities. Add Activities by clicking the [+] button above.",
            editRow: {
              deleteText: "Are you sure you want to delete this Activity?",
            },
          },
        }}
        options={{
          selection: true,
          actionsColumnIndex: -1,
          pageSize: 10,
          pageSizeOptions: [10, 25, 50, 100],
        }}
        components={{ Container: (props) => <div {...props} /> }}
      />
      <Menu
        keepMounted
        open={Boolean(createMenu)}
        anchorPosition={createMenu?.getBoundingClientRect()}
        anchorReference="anchorPosition"
        onClose={() => setCreateMenu(undefined)}
      >
        <MenuItem disabled divider>
          <b>Create a new...</b>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setCreateMenu(undefined)
            setGroupCreate(true)
          }}
        >
          Activity Group
        </MenuItem>
        <MenuItem
          divider
          onClick={() => {
            setCreateMenu(undefined)
            setShowCreate(true)
          }}
        >
          Survey Instrument
        </MenuItem>
        {!_hideCognitiveTesting() && [
          <MenuItem key="head" disabled>
            <b>Smartphone Cognitive Tests</b>
          </MenuItem>,
          ...activitySpecs.map((x) => (
            <MenuItem
              key={x?.name}
              onClick={() => {
                setCreateMenu(undefined)
                saveCTest(x)
              }}
            >
              {x?.name?.replace("lamp.", "")}
            </MenuItem>
          )),
        ]}
      </Menu>
      <Dialog open={!!showActivityImport} onClose={() => setShowActivityImport(false)}>
        <Box
          {...getRootProps()}
          p={4}
          bgcolor={isDragActive || isDragAccept ? "primary.main" : undefined}
          color={!(isDragActive || isDragAccept) ? "primary.main" : "#fff"}
        >
          <input {...getInputProps()} />
          <Typography variant="h6">Drag files here, or click to select files.</Typography>
        </Box>
      </Dialog>
      <Dialog open={!!importFile} onClose={() => setImportFile(undefined)}>
        <MaterialTable
          title="Continue importing?"
          data={importFile || []}
          columns={[{ title: "Activity Name", field: "name" }]}
          options={{ search: false, selection: false }}
          components={{ Container: (props) => <div {...props} /> }}
        />
        <DialogActions>
          <Button onClick={() => setImportFile(undefined)} color="secondary" autoFocus>
            Cancel
          </Button>
          <Button onClick={importActivities} color="primary" autoFocus>
            Import
          </Button>
        </DialogActions>
      </Dialog>
      <ResponsiveDialog fullScreen transient animate open={!!showCreate} onClose={() => setShowCreate(false)}>
        <Box py={8} px={4}>
          <SurveyCreator onSave={saveActivity} />
        </Box>
      </ResponsiveDialog>
      <ResponsiveDialog fullScreen transient animate open={!!groupCreate} onClose={() => setGroupCreate(false)}>
        <Box py={8} px={4}>
          <GroupCreator activities={activities} onSave={saveGroup} />
        </Box>
      </ResponsiveDialog>
      <ResponsiveDialog
        fullScreen
        transient
        animate
        open={!!selectedActivity}
        onClose={() => setSelectedActivity(undefined)}
      >
        <Activity allActivities={activities} activity={selectedActivity} studyID={studyID} onSave={updateActivity} />
      </ResponsiveDialog>
    </React.Fragment>
  )
}
