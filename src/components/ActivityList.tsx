// Core Imports
import React, { useState, useEffect, useCallback } from "react"
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  MenuItem,
  AppBar,
  Toolbar,
  Icon,
  IconButton,
  Divider,
  Backdrop,
  CircularProgress,
  Chip,
  Tooltip,
  Grid,
  Fab,
  Container,
  Typography,
  Popover,
  Select,
} from "@material-ui/core"
import MaterialTable, { MTableToolbar } from "material-table"
import { useSnackbar } from "notistack"
import { makeStyles, Theme, createStyles, MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles"
import { ReactComponent as AddIcon } from "../icons/plus.svg"
import { ReactComponent as DeleteIcon } from "../icons/DeleteBlue.svg"
import { ReactComponent as ExportIcon } from "../icons/Export.svg"
// External Imports
import { saveAs } from "file-saver"
import { useDropzone } from "react-dropzone"
import CloudUploadIcon from "@material-ui/icons/CloudUpload"
// Local Imports
import LAMP, { Study } from "lamp-core"
import Activity from "./Activity"
import AddActivity from "./AddActivity"
import ActivityScheduler from "./ActivityScheduler"
import ResponsiveDialog from "./ResponsiveDialog"
import { ReactComponent as Filter } from "../icons/Filter.svg"
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown"
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp"
import MultipleSelect from "./MultipleSelect"
import { useTranslation } from "react-i18next"

const theme = createMuiTheme({
  palette: {
    secondary: {
      main: "#333",
    },
  },
  overrides: {
    MuiTableCell: {
      root: {
        borderBottom: "#fff solid 1px",
        padding: 10,
      },
    },
    MuiToolbar: {
      root: {
        maxWidth: 1055,
        width: "80%",
        margin: "0 auto",
        background: "#fff !important",
      },
    },
    MuiInput: {
      root: {
        border: 0,
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
    MuiIcon: {
      root: { color: "rgba(0, 0, 0, 0.4)" },
    },
  },
})

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbardashboard: {
      minHeight: 100,
      padding: "0 10px",
      "& h5": {
        color: "rgba(0, 0, 0, 0.75)",
        textAlign: "left",
        fontWeight: "600",
        fontSize: 30,
        width: "calc(100% - 96px)",
      },
    },
    activityContent: {
      padding: "25px 50px 0",
    },

    backdrop: {
      zIndex: 111111,
      color: "#fff",
    },
    btnBlue: {
      background: "#7599FF",
      borderRadius: "40px",
      minWidth: 100,
      boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.20)",
      lineHeight: "38px",

      cursor: "pointer",
      textTransform: "capitalize",
      fontSize: "16px",
      color: "#fff",
      "& svg": { marginRight: 8 },
      "&:hover": { background: "#5680f9" },
      [theme.breakpoints.up("md")]: {
        position: "absolute",
      },
    },
    btnImport: {
      height: 48,
      width: 48,
      background: "white",
      boxShadow: "none",
      marginRight: 15,
      color: "#7599FF",

      // "&:hover": { background: "#f4f4f4" },
    },
    tableContainer: {
      "& div.MuiInput-underline:before": { borderBottom: "0 !important" },
      "& div.MuiInput-underline:after": { borderBottom: "0 !important" },
      "& div.MuiInput-underline": {
        "& span.material-icons": {
          width: 21,
          height: 19,
          fontSize: 27,
          lineHeight: "23PX",
          color: "rgba(0, 0, 0, 0.4)",
        },
        "& button": { display: "none" },
      },
    },
    studyCode: {
      margin: "4px 0",
      backgroundColor: "#ECF4FF",
      border: "2px solid #FFFFFF",
      color: "#000000",
    },

    tableOptions: {
      background: "#ECF4FF",
      padding: "10px 0",
    },
    btnOptions: {
      textTransform: "capitalize",
      color: "#4C66D6",
      margin: "0 25px 0 0",

      "& span": { cursor: "pointer" },
      "& svg": { width: 24, height: 24, fill: "#4C66D6" },
    },
    tableOuter: {
      width: "100vw",
      position: "relative",
      left: "50%",
      right: "50%",
      marginLeft: "-50.6vw",
      marginRight: "-50.6vw",
      marginBottom: 30,
      marginTop: -20,
      "& input": {
        width: 350,
        [theme.breakpoints.down("md")]: {
          width: 200,
        },
      },
      "& div.MuiToolbar-root": { maxWidth: 1232, width: "100%", margin: "0 auto" },
      "& h6": { fontSize: 30, fontWeight: 600 },
    },

    tagFilteredBg: {
      color: "#5784EE !important",
      "& path": { fill: "#5784EE !important", fillOpacity: 1 },
    },
    btnFilter: {
      color: "rgba(0, 0, 0, 0.4)",
      fontSize: 14,
      lineHeight: "38px",
      cursor: "pointer",
      textTransform: "capitalize",
      boxShadow: "none",
      background: "transparent",
      margin: "0 15px",
      paddingRight: 0,
      "& svg": { marginRight: 10 },
    },
    tableContainerWidth: {
      maxWidth: 1055,
      width: "80%",
    },

    customPopover: { backgroundColor: "rgba(0, 0, 0, 0.4)" },
    customPaper: {
      maxWidth: 380,
      maxHeight: 600,
      marginTop: 75,
      marginLeft: 100,
      borderRadius: 10,
      padding: "10px 0",
      "& h6": { fontSize: 16 },
      "& li": {
        display: "inline-block",
        width: "100%",
        padding: "8px 30px",
        "&:hover": { backgroundColor: "#ECF4FF" },
      },
      "& *": { cursor: "pointer" },
    },
    popexpand: {
      backgroundColor: "#fff",
      color: "#618EF7",
      zIndex: 11111,
      "& path": { fill: "#618EF7" },
      "&:hover": { backgroundColor: "#f3f3f3" },
    },
    tableAccordian: { backgroundColor: "#f4f4f4" },
    errorMsg: { color: "#FF0000", fontSize: 12 },
    dragDrop: {
      outline: "none",
      "& h6": {
        color: "#7599FF",
        fontSize: 14,
      },
    },
  })
)

function _hideCognitiveTesting() {
  return (LAMP.Auth._auth.serverAddress || "").includes(".psych.digital")
}

// TODO: Blogs/Tips/AppHelp

// Splice a raw Activity object with its ActivityDescription object.
export function spliceActivity({ raw, tag }) {
  return {
    id: raw.id,
    parentID: raw.parentID,
    spec: "lamp.survey",
    name: raw.name,
    description: tag?.description,
    photo: tag?.photo,
    schedule: raw.schedule,
    settings: !Array.isArray(raw.settings)
      ? raw.settings
      : raw.settings.map((question, idx) => ({
          text: question.text,
          type: question.type,
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

// Un-splice an object into its raw Tips Activity object
export function unspliceTipsActivity(x) {
  return {
    raw: {
      id: x.id,
      name: x.name,
      spec: "lamp.tips",
      icon: x.icon,
      schedule: x.schedule,
      settings: x.settings,
      studyID: x.studyID,
    },
  }
}

// Un-splice an object into its raw Activity object and ActivityDescription object.
export function unspliceActivity(x) {
  return {
    raw: {
      id: x.id,
      parentID: x.parentID,
      spec: "lamp.survey",
      name: x.name,
      schedule: x.schedule,
      settings: (x.settings && Array.isArray(x.settings) ? x.settings : [])?.map((y) => ({
        text: y?.text,
        type: y?.type,
        options: y?.options === null ? null : y?.options?.map((z) => z?.value),
      })),
    },
    tag: {
      description: x.description,
      photo: x.photo,
      questions: (x.settings && Array.isArray(x.settings) ? x.settings : [])?.map((y) => ({
        multiselect: y?.type,
        description: y?.description,
        options: y?.options === null ? null : y?.options?.map((z) => z?.description),
      })),
    },
  }
}

export function unspliceCTActivity(x) {
  return {
    raw: {
      id: x.id,
      spec: x.spec,
      name: x.name,
      schedule: x.schedule,
      settings: x.settings,
    },
    tag: {
      description: x.description,
      photo: x.photo,
    },
  }
}

export function spliceCTActivity({ raw, tag }) {
  return {
    id: raw.id,
    parentID: raw.parentID,
    spec: raw.spec,
    name: raw.name,
    description: tag?.description,
    photo: tag?.photo,
    schedule: raw.schedule,
    settings: raw.settings,
  }
}

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
  "lamp.pop_the_bubbles",
  "lamp.balloon_risk",
]

const games = [
  "lamp.jewels_a",
  "lamp.jewels_b",
  "lamp.spatial_span",
  "lamp.cats_and_dogs",
  "lamp.pop_the_bubbles",
  "lamp.balloon_risk",
]

function ImportActivity({
  studies,
  showActivityImport,
  setShowActivityImport,
  importActivities,
  setLoading,
  ...props
}) {
  const [selectedStudy, setSelectedStudy] = useState(undefined)
  const classes = useStyles()
  const [importFile, setImportFile] = useState<any>()
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation()

  const onDrop = useCallback((acceptedFiles) => {
    const reader = new FileReader()
    reader.onabort = () => enqueueSnackbar(t("Couldn't import the Activities."), { variant: "error" })
    reader.onerror = () => enqueueSnackbar(t("Couldn't import the Activities."), { variant: "error" })
    reader.onload = () => {
      setShowActivityImport(false)
      setLoading(true)
      let obj = JSON.parse(decodeURIComponent(escape(atob(reader.result as string))))
      if (
        Array.isArray(obj) &&
        obj.filter((x) => typeof x === "object" && !!x.name && !!x.settings && !!x.schedule).length > 0
      )
        setImportFile(obj)
      else enqueueSnackbar(t("Couldn't import the Activities."), { variant: "error" })
    }
    acceptedFiles.forEach((file) => reader.readAsText(file))
  }, [])
  // eslint-disable-next-line
  const { acceptedFiles, getRootProps, getInputProps, isDragActive, isDragAccept } = useDropzone({
    onDrop,
    accept: "application/json,.json",
    maxSize: 5 * 1024 * 1024 /* 5MB */,
  })

  return (
    <Container>
      <Dialog open={!!showActivityImport} onClose={() => setShowActivityImport(false)}>
        <DialogContent dividers={false} classes={{ root: classes.activityContent }}>
          <Box mt={2} mb={3}>
            <Typography variant="body2">{t("Choose the Study you want to import activities.")}</Typography>
          </Box>

          <Typography variant="caption">{t("Study")}</Typography>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={selectedStudy}
            onChange={(event) => {
              setSelectedStudy(event.target.value)
            }}
            style={{ width: "100%" }}
          >
            {studies.map((study) => (
              <MenuItem key={study.id} value={study.id}>
                {study.name}
              </MenuItem>
            ))}
          </Select>

          {typeof selectedStudy === "undefined" ||
          (typeof selectedStudy !== "undefined" && selectedStudy?.trim() === "") ? (
            <Box mt={1}>
              <Typography className={classes.errorMsg}>{t("Select a Study to import activities.")}</Typography>
            </Box>
          ) : (
            ""
          )}
          <Box
            {...getRootProps()}
            p={4}
            bgcolor={isDragActive || isDragAccept ? "primary.main" : undefined}
            color={!(isDragActive || isDragAccept) ? "primary.main" : "#fff"}
            className={classes.dragDrop}
          >
            <input {...getInputProps()} />

            <Typography variant="h6">{t("Drag files here, or click to select files.")}</Typography>
          </Box>
        </DialogContent>
      </Dialog>
      <Dialog open={!!importFile} onEnter={() => setLoading(false)} onClose={() => setImportFile(undefined)}>
        <MaterialTable
          title="Continue importing?"
          data={importFile || []}
          columns={[{ title: "Activity Name", field: "name" }]}
          options={{ search: false, selection: false }}
          components={{ Container: (props) => <Box {...props} /> }}
        />
        <DialogActions>
          <Button onClick={() => setImportFile(undefined)} color="secondary" autoFocus>
            {t("Cancel")}
          </Button>
          <Button
            onClick={() => {
              importActivities(selectedStudy, importFile)
              setImportFile(undefined)
            }}
            color="primary"
            autoFocus
          >
            {t("Import")}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
export async function saveTipActivity(x) {
  const { raw } = unspliceTipsActivity(x)
  let result
  if (!x.id && x.name) {
    result = (await LAMP.Activity.create(x.studyID, raw)) as any
    await LAMP.Type.setAttachment(result.data, "me", "lamp.dashboard.activity_details", {
      photo: x.icon,
    })
  } else {
    result = (await LAMP.Activity.update(x.id, {
      settings: x.settings,
    })) as any
    await LAMP.Type.setAttachment(x.id, "me", "lamp.dashboard.activity_details", {
      photo: x.icon,
    })
  }
  return result
}

export async function saveCTestActivity(x) {
  let newItem = (await LAMP.Activity.create(x.studyID, x)) as any
  if (x.spec !== "lamp.dbt_diary_card") {
    await LAMP.Type.setAttachment(newItem.data, "me", "lamp.dashboard.activity_details", {
      description: x.description,
      photo: x.photo,
    })
  }
  return newItem
}

export async function saveSurveyActivity(x) {
  // FIXME: ensure this is a lamp.survey only!
  const { raw, tag } = unspliceActivity(x)
  //return false;

  let newItem = (await LAMP.Activity.create(x.studyID, raw)) as any
  await LAMP.Type.setAttachment(newItem.data, "me", "lamp.dashboard.survey_description", tag)
  return newItem
}

export async function saveGroupActivity(x) {
  let newItem = (await LAMP.Activity.create(x.studyID, {
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
  await LAMP.Type.setAttachment(newItem.data, "me", "lamp.dashboard.activity_details", {
    description: x.description,
    photo: x.photo,
  })
  return newItem
}

// Commit an update to an Activity object (ONLY DESCRIPTIONS).
export async function updateActivityData(x, isDuplicated, selectedActivity) {
  let result
  if (!["lamp.group", "lamp.survey", "lamp.tips"].includes(x.spec)) {
    // Short-circuit for groups and CTests
    if (isDuplicated) {
      result = (await LAMP.Activity.create(x.studyID, x)) as any
      await LAMP.Type.setAttachment(result.data, "me", "lamp.dashboard.activity_details", {
        description: x?.description ?? "",
        photo: x?.photo ?? "",
      })
    } else {
      if (selectedActivity.parentID !== x.studyID) {
        // let tag = await LAMP.Type.setAttachment(x.id, "me", "lamp.dashboard.activity_details", null)
        // console.dir("deleted tag " + JSON.stringify(tag))
        // await LAMP.Activity.delete(x.id)
        // result = (await LAMP.Activity.create(x.studyID, x)) as any
        // await LAMP.Type.setAttachment(result.data, "me", "lamp.dashboard.activity_details", {
        //   description: x?.description ?? "",
        //   photo: x?.photo ?? "",
        // })
      } else {
        result = (await LAMP.Activity.update(x.id, { name: x.name, settings: x.settings ?? [] })) as any
        await LAMP.Type.setAttachment(selectedActivity.id, "me", "lamp.dashboard.activity_details", {
          description: x.description,
          photo: x.photo,
        })
      }
    }
  } else if (x.spec === "lamp.group" || x.spec === "lamp.dbt_diary_card") {
    if (isDuplicated) {
      result = (await LAMP.Activity.create(x.studyID, x)) as any
      await LAMP.Type.setAttachment(result.data, "me", "lamp.dashboard.activity_details", {
        description: x.description,
        photo: x.photo,
      })
      return result
    } else {
      result = (await LAMP.Activity.update(selectedActivity?.id, {
        name: x.name,
        settings: x.settings,
      })) as any

      await LAMP.Type.setAttachment(selectedActivity?.id, "me", "lamp.dashboard.activity_details", {
        description: x.description,
        photo: x.photo,
      })
      return result
    }
  } else if (x.spec === "lamp.survey") {
    const { raw, tag } = unspliceActivity(x)
    if (isDuplicated) {
      /* duplicate */ let result = (await LAMP.Activity.create(x.studyID, raw)) as any
      await LAMP.Type.setAttachment(result.data, "me", "lamp.dashboard.survey_description", tag)
    } else {
      result = (await LAMP.Activity.update(selectedActivity.id, raw)) as any
      await LAMP.Type.setAttachment(selectedActivity.id, "me", "lamp.dashboard.survey_description", tag)
    }
  } else if (x.spec === "lamp.tips") {
    if (x.id === undefined) {
      let tipObj = {
        id: x.id,
        name: x.name,
        icon: x.icon,
        studyID: selectedActivity.parentID,
        spec: "lamp.tips",
        settings: selectedActivity.settings,
        schedule: selectedActivity.schedule,
      }
      result = await saveTipActivity(tipObj)
    } else {
      let obj = {
        settings: x.settings,
      }
      result = (await LAMP.Activity.update(selectedActivity.id, obj)) as any
      await LAMP.Type.setAttachment(selectedActivity.id, "me", "lamp.dashboard.activity_details", {
        photo: x.icon,
      })
    }
  }
  return result
}

export default function ActivityList({ researcher, title, ...props }) {
  const [state, setState] = useState({
    popoverAttachElement: null,
    selectedIcon: null,
    newCount: 0,
    selectedRows: [],
    addUser: false,
  })
  const [activitySpecs, setActivitySpecs] = useState([])
  const [activities, setActivities] = useState([])
  const [createMenu, setCreateMenu] = useState<Element>()
  const [showCreate, setShowCreate] = useState(false)
  const [groupCreate, setGroupCreate] = useState(false)
  const [showTipCreate, setShowTipCreate] = useState(false)
  const [showCTCreate, setShowCTCreate] = useState(false)
  const [showJournalCreate, setShowJournalCreate] = useState(false)
  const [showBreatheCreate, setShowBreatheCreate] = useState(false)
  const [showSCImgCreate, setShowSCImgCreate] = useState(false)
  const [showDBTCreate, setShowDBTCreate] = useState(false)
  const [showActivityImport, setShowActivityImport] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<any>()
  const [activitySpecId, setActivitySpecId] = useState(null)
  const [createDialogue, setCreate] = useState(false)
  const [gameDetails, setGameDetails] = useState(null)
  const classes = useStyles()
  const [loading, setLoading] = React.useState(true)
  const [showFilter, setShowFilter] = useState(false)
  const [studiesCount, setStudiesCount] = useState({})
  const { enqueueSnackbar } = useSnackbar()
  const [studies, setStudies] = useState([])
  const [selected, setSelected] = useState(null)
  const [activityData, setActivityData] = useState(null)
  const { t } = useTranslation()
  const activitiesObj = {
    "lamp.journal": t("Journal"),
    "lamp.scratch_image": t("Scratch card"),
    "lamp.breathe": t("Breathe"),
    "lamp.tips": t("Tip"),
    "lamp.dbt_diary_card": t("DBT Diary Card"),
    "lamp.cats_and_dogs": t("Cats and Dogs"),
    "lamp.jewels_a": t("Jewels A"),
    "lamp.jewels_b": t("Jewels B"),
    "lamp.spatial_span": t("Spatial Span"),
    "lamp.pop_the_bubbles": t("Pop the Bubbles"),
    "lamp.balloon_risk": t("Balloon Risk"),
  }

  useEffect(() => {
    LAMP.Study.allByResearcher(researcher.id).then(setStudies)
    LAMP.ActivitySpec.all().then((res) => {
      setActivitySpecs(
        res.filter((x: any) => availableAtiveSpecs.includes(x.id) && !["lamp.group", "lamp.survey"].includes(x.id))
      )
    })
  }, [])

  useEffect(() => {
    setLoading(true)
    ;(async () => {
      let selectedStudies =
        ((await LAMP.Type.getAttachment(researcher.id, "lamp.selectedStudies")) as any).data ??
        studies.map((study) => {
          return study.name
        })
      let selStudies =
        selectedStudies.length > 0
          ? selectedStudies
          : studies.map((study) => {
              return study.name
            })
      setSelected(selStudies)
    })()
  }, [studies])

  useEffect(() => {
    if (selected !== null) {
      setLoading(true)
      refreshData()
    }
  }, [selected])

  const refreshData = () => {
    setLoading(true)
    let activityData = []
    let counts = studiesCount
    let index = 0
    studies.sort((a, b) => (a.name < b.name ? -1 : 1))
    studies.map((study) => {
      ;(async () => {
        let resActivities = await LAMP.Activity.allByStudy(study.id)
        counts[study.name] = resActivities.length
        if (selected !== null && selected.includes(study.name)) {
          resActivities.sort(function (a, b) {
            return b.name > a.name ? -1 : 1
          })
          resActivities = resActivities.map((el) => ({ ...el, parent: study.name, parentID: study.id }))
          activityData = activityData.concat(resActivities)
        }
        if (index === studies.length - 1) {
          let data = []
          studies.forEach((study) => {
            data = data.concat(activityData.filter((d) => d.parent === study.name))
          })
          setActivityData(data)
        }
        index++
      })()
    })
  }
  useEffect(() => {
    if (activityData !== null) {
      setActivities(activityData)
    }
  }, [activityData])

  useEffect(() => {
    if (activities !== null) {
      setLoading(false)
    }
  }, [activities])

  const onChange = () => {
    refreshData()
    setAllFalse()
    setState((state) => ({
      ...state,
      popoverAttachElement: null,
      selectedIcon: "",
      selectedRows: [],
    }))
  }

  // Import a file containing pre-linked Activity objects from another Study.
  const importActivities = async (selectedStudy: string, importFile: any) => {
    setLoading(true)
    const _importFile = [...importFile] // clone it so we can close the dialog first

    let allIDs = _importFile.map((x) => x.id).reduce((prev, curr) => ({ ...prev, [curr]: undefined }), {})
    let brokenGroupsCount = _importFile
      .filter((activity) => activity.spec === "lamp.group")
      .filter((activity) => activity.settings.filter((x) => !Object.keys(allIDs).includes(x)).length > 0).length

    if (brokenGroupsCount > 0) {
      enqueueSnackbar(t("Couldn't import the Activities because some Activities are misconfigured or missing."), {
        variant: "error",
      })
      return
    }
    // Surveys only.
    for (let x of _importFile.filter((x) => ["lamp.survey"].includes(x.spec))) {
      const { raw, tag } = unspliceActivity(x)
      try {
        allIDs[raw.id] = ((await LAMP.Activity.create(selectedStudy, {
          ...raw,
          id: undefined,
          parentId: undefined,
          tableData: undefined,
        } as any)) as any).data
        await LAMP.Type.setAttachment(allIDs[raw.id], "me", "lamp.dashboard.survey_description", tag)
      } catch (e) {
        enqueueSnackbar(t("Couldn't import one of the selected survey Activities."), { variant: "error" })
      }
    }

    // CTests only.
    for (let x of _importFile.filter((x) => !["lamp.group", "lamp.survey"].includes(x.spec))) {
      const { raw, tag } = unspliceCTActivity(x)
      try {
        allIDs[raw.id] = ((await LAMP.Activity.create(selectedStudy, {
          ...raw,
          id: undefined,
        })) as any).data
        await LAMP.Type.setAttachment(allIDs[raw.id], "me", "lamp.dashboard.activity_details", tag)
      } catch (e) {
        enqueueSnackbar(t("Couldn't import one of the selected Activities."), { variant: "error" })
      }
    }

    // Groups only. This MUST be done last or the mapping will be incorrect (allIDs).
    for (let x of _importFile.filter((x) => ["lamp.group"].includes(x.spec))) {
      try {
        await LAMP.Activity.create(selectedStudy, {
          ...x,
          id: undefined,
          tableData: undefined,
          settings: x.settings.map((y) => allIDs[y]),
        })
      } catch (e) {
        enqueueSnackbar(t("Couldn't import one of the selected Activity groups."), { variant: "error" })
      }
    }

    onChange()
    enqueueSnackbar(t("The selected Activities were successfully imported."), {
      variant: "success",
    })
  }
  // Export a file containing this Study's pre-linked Activity objects.
  const downloadActivities = async (rows) => {
    let data = []
    for (let x of rows) {
      delete x["parent"]
      delete x["parentID"]

      if (x.spec === "lamp.survey") {
        try {
          let res = (await LAMP.Type.getAttachment(x.id, "lamp.dashboard.survey_description")) as any
          let activity = spliceActivity({
            raw: { ...x, tableData: undefined },
            tag: !!res.error ? undefined : res.data,
          })
          data.push(activity)
        } catch (e) {}
      } else if (!["lamp.survey"].includes(x.spec)) {
        try {
          let res = (await LAMP.Type.getAttachment(x.id, "lamp.dashboard.activity_details")) as any
          let activity = spliceCTActivity({
            raw: { ...x, tableData: undefined },
            tag: !!res.error ? undefined : res.data,
          })
          data.push(activity)
        } catch (e) {}
      } else data.push({ ...x, tableData: undefined })
    }
    _saveFile(data)
    enqueueSnackbar(t("The selected Activities were successfully exported."), {
      variant: "info",
    })
  }

  const _saveFile = (data) =>
    saveAs(
      new Blob([btoa(unescape(encodeURIComponent(JSON.stringify(data))))], {
        type: "text/plain;charset=utf-8",
      }),
      "export.json"
    )

  // Create a new Activity object & survey descriptions if set.
  const saveTipsActivity = async (x) => {
    setLoading(true)
    let result = await saveTipActivity(x)
    if (!!result.error)
      enqueueSnackbar(t("Encountered an error: ") + result?.error, {
        variant: "error",
      })
    else {
      setAllFalse()
      enqueueSnackbar(t("Successfully updated the Activity."), {
        variant: "success",
      })
      onChange()
    }
  }

  // Create a new Activity object & survey descriptions if set.
  const saveActivity = async (x) => {
    let newItem = await saveSurveyActivity(x)
    if (!!newItem.error)
      enqueueSnackbar(t("Failed to create a new survey Activity."), {
        variant: "error",
      })
    else
      enqueueSnackbar(t("Successfully created a new survey Activity."), {
        variant: "success",
      })
    let selectedStudy = studies.filter((study) => study.id === x.studyID)[0]
    setStudiesCount({ ...studiesCount, [selectedStudy.name]: ++studiesCount[selectedStudy.name] })
    onChange()
  }

  // Create a new Activity object that represents a group of other Activities.
  const saveGroup = async (x) => {
    let newItem = await saveGroupActivity(x)
    if (!!newItem.error)
      enqueueSnackbar(t("Failed to create a new group Activity."), {
        variant: "error",
      })
    else
      enqueueSnackbar(t("Successfully created a new group Activity."), {
        variant: "success",
      })
    let selectedStudy = studies.filter((study) => study.id === x.studyID)[0]
    setStudiesCount({ ...studiesCount, [selectedStudy.name]: ++studiesCount[selectedStudy.name] })
    onChange()
  }

  // Create a new Activity object that represents a cognitive test.
  const saveCTest = async (x) => {
    setLoading(true)
    let newItem = await saveCTestActivity(x)
    if (!!newItem.error)
      enqueueSnackbar(t("Failed to create a new Activity."), {
        variant: "error",
      })
    else
      enqueueSnackbar(t("Successfully created a new Activity."), {
        variant: "success",
      })
    let selectedStudy = studies.filter((study) => study.id === x.studyID)[0]
    setStudiesCount({ ...studiesCount, [selectedStudy.name]: ++studiesCount[selectedStudy.name] })
    onChange()
  }

  // Delete the selected Activity objects & survey descriptions if set.
  const deleteActivities = async (rows) => {
    setLoading(true)
    for (let activity of rows) {
      if (activity.spec === "lamp.survey") {
        let tag = await LAMP.Type.setAttachment(activity.id, "me", "lamp.dashboard.survey_description", null)
        console.dir("deleted tag " + JSON.stringify(tag))
      }
      let raw = await LAMP.Activity.delete(activity.id)
      let selectedStudy = studies.filter((study) => study.id === activity.parentID)[0]
      setStudiesCount({ ...studiesCount, [selectedStudy.name]: --studiesCount[selectedStudy.name] })
      console.dir(raw)
    }
    enqueueSnackbar(t("Successfully deleted the selected Activities."), {
      variant: "success",
    })
    onChange()
  }

  // Begin an Activity object modification (ONLY DESCRIPTIONS).
  const modifyActivity = async (raw) => {
    setLoading(true)
    if (raw.spec === "lamp.survey") {
      let tag = [await LAMP.Type.getAttachment(raw.id, "lamp.dashboard.survey_description")].map((y: any) =>
        !!y.error ? undefined : y.data
      )[0]
      const activity = spliceActivity({ raw, tag })
      setSelectedActivity(activity)
    } else if (raw.spec === "lamp.dbt_diary_card" || raw.spec === "lamp.tips") {
      setSelectedActivity(raw)
    } else if (
      games.includes(raw.spec) ||
      raw.spec === "lamp.journal" ||
      raw.spec === "lamp.scratch_image" ||
      raw.spec === "lamp.breathe" ||
      raw.spec === "lamp.group"
    ) {
      let tag = [await LAMP.Type.getAttachment(raw.id, "lamp.dashboard.activity_details")].map((y: any) =>
        !!y.error ? undefined : y.data
      )[0]
      setGameDetails(tag)
      setSelectedActivity(raw)
    }
    setLoading(false)
  }

  // Commit an update to an Activity object (ONLY DESCRIPTIONS).
  const updateActivity = async (x, isDuplicated) => {
    setLoading(true)
    let result = await updateActivityData(x, isDuplicated, selectedActivity)
    if (result !== undefined && !!result.error)
      enqueueSnackbar(t("Encountered an error: ") + result?.error, {
        variant: "error",
      })
    else
      enqueueSnackbar(t("Successfully updated the Activity."), {
        variant: "success",
      })
    onChange()
    setSelectedActivity(undefined)
  }

  const updateSchedule = async (x) => {
    let result = await LAMP.Activity.update(x.id, { schedule: x.schedule })
    onChange()
  }

  const setAllFalse = () => {
    setCreate(false)
    setGroupCreate(false)
    setShowCTCreate(false)
    setShowCreate(false)
    setShowTipCreate(false)
    setShowBreatheCreate(false)
    setShowJournalCreate(false)
    setShowDBTCreate(false)
    setShowSCImgCreate(false)
    setSelectedActivity(undefined)
    refreshData()
  }
  return (
    <React.Fragment>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <MuiThemeProvider theme={theme}>
        <Box className={classes.tableContainer}>
          <MaterialTable
            title={t("Activities")}
            data={activities}
            columns={[
              { title: t("Name"), field: "name" },
              {
                title: t("Type"),
                field: "spec",
                lookup: {
                  "lamp.survey": t("Survey"),
                  "lamp.group": t("Group"),
                  "lamp.tips": t("Tips"),
                  "lamp.journal": t("Journal"),
                  "lamp.breathe": t("Breathe"),
                  "lamp.dbt_diary_card": t("DBT Diary Card"),
                  "lamp.scratch_image": t("Scratch image"),
                },
                emptyValue: t("Cognitive Test"),
              },
              {
                title: t("Study"),
                field: "parent",
                searchable: false,
                render: (rowData) => (
                  <Tooltip title={t(rowData.parent)}>
                    <Chip label={t(rowData.parent)} className={classes.studyCode} />
                  </Tooltip>
                ),
              },
            ]}
            onRowClick={(event, rowData, togglePanel) => modifyActivity(rowData)}
            detailPanel={(rowData) => (
              <Box className={classes.tableAccordian}>
                <ActivityScheduler activity={rowData} onChange={(x) => updateSchedule({ ...rowData, schedule: x })} />
              </Box>
            )}
            actions={[
              {
                icon: "cloud_upload",
                tooltip: t("Import"),
                isFreeAction: true,
                onClick: (event, rows) => setShowActivityImport(true),
              },
              {
                icon: "cloud_download",
                tooltip: t("Export"),
                onClick: (event, rows) => downloadActivities(rows),
              },
              {
                icon: "add_box",
                tooltip: t("Create"),
                isFreeAction: true,
                onClick: (event, rows) => setCreateMenu(event.currentTarget.parentNode),
              },
              {
                icon: "delete_forever",
                tooltip: t("Delete"),
                onClick: async (event, rows) => deleteActivities(rows),
              },
            ]}
            localization={{
              body: {
                emptyDataSourceMessage: "",
                // !loading && activities.length === 0
                //   ? "No Activities. Add Activities by clicking the [+] button above."
                //   : "",
                editRow: {
                  deleteText: t("Are you sure you want to delete this Activity?"),
                },
              },
              toolbar: {
                nRowsSelected: t("Activities"),
                searchPlaceholder: t("Search"),
              },
            }}
            options={{
              selection: true,
              actionsColumnIndex: -1,
              paging: false,
              searchFieldStyle: {
                borderRadius: 25,
                backgroundColor: "#F8F8F8",
                padding: 8,
              },
              headerStyle: {
                fontWeight: 700,
                textTransform: "uppercase",
              },
              rowStyle: (rowData) => ({
                backgroundColor: rowData.tableData.checked
                  ? "#ECF4FF"
                  : rowData.tableData.id % 2 === 0
                  ? "#FFF"
                  : "#F8F8F8",
              }),
            }}
            components={{
              Actions: (props) => {
                return (
                  <div>
                    <Fab
                      variant="extended"
                      className={classes.btnFilter + " " + (showFilter === true ? classes.tagFilteredBg : "")}
                      onClick={() => {
                        showFilter === true ? setShowFilter(false) : setShowFilter(true)
                      }}
                    >
                      <Filter /> {t("Filter results")}{" "}
                      {showFilter === true ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                    </Fab>
                    {/* <Tooltip title="Import">
                      <Fab
                        className={classes.btnImport}
                        onClick={(event) => {
                          setShowActivityImport(true)
                        }}
                      >
                        <CloudUploadIcon />
                      </Fab>
                    </Tooltip> */}
                    <Fab
                      variant="extended"
                      color="primary"
                      classes={{ root: classes.btnBlue }} //</div>/+ " " + (state.addUser ? classes.popexpand : "") }}
                      onClick={(event) => {
                        setState((state) => ({
                          ...state,
                          popoverAttachElement: event.currentTarget,
                          selectedIcon: "add",
                          selectedRows: [],
                        }))
                      }}
                    >
                      <AddIcon /> {t("Add")}
                    </Fab>
                  </div>
                )
              },
              Container: (props) => <Box {...props} />,
              Toolbar: (props) => (
                <div className={classes.tableOuter}>
                  <MTableToolbar {...props} />
                  {showFilter === true ? (
                    <Box mt={1}>
                      {
                        <MultipleSelect
                          selected={selected}
                          items={(studies || []).map((x) => `${x.name}`)}
                          showZeroBadges={false}
                          badges={studiesCount}
                          onChange={(x) => {
                            ;(async () => {
                              await LAMP.Type.setAttachment(researcher.id, "me", "lamp.selectedStudies", x)
                              setSelected(x)
                            })()
                          }}
                        />
                      }
                    </Box>
                  ) : (
                    ""
                  )}
                  <Box borderTop={1} borderColor="grey.400" mt={3}></Box>
                  {props.selectedRows.length > 0 ? (
                    <Box display="flex" className={classes.tableOptions}>
                      <Container className={classes.tableContainerWidth}>
                        <Box display="flex">
                          <Box>
                            <Button
                              className={classes.btnOptions}
                              onClick={(event) => {
                                deleteActivities(props.selectedRows)
                              }}
                              startIcon={<DeleteIcon />}
                            >
                              {t("Delete")}
                            </Button>
                          </Box>
                          <Box>
                            <Button
                              className={classes.btnOptions}
                              onClick={(event) => {
                                downloadActivities(props.selectedRows)
                              }}
                              startIcon={<ExportIcon />}
                            >
                              {t("Export")}
                            </Button>
                          </Box>
                        </Box>
                      </Container>
                    </Box>
                  ) : (
                    ""
                  )}
                </div>
              ),
            }}
          />
        </Box>
      </MuiThemeProvider>
      <Popover
        classes={{ root: classes.customPopover, paper: classes.customPaper }}
        open={Boolean(state.popoverAttachElement)}
        anchorPosition={!!state.popoverAttachElement && state.popoverAttachElement.getBoundingClientRect()}
        anchorReference="anchorPosition"
        onClose={() => setState((state) => ({ ...state, popoverAttachElement: null }))}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {state.selectedIcon === "download" ? (
          <React.Fragment>
            {/* <MenuItem onClick={() => downloadFiles("csv")}>CSV</MenuItem>
            <MenuItem onClick={() => downloadFiles("json")}>JSON</MenuItem> */}
          </React.Fragment>
        ) : state.selectedIcon === "add" ? (
          <React.Fragment>
            <MenuItem
              onClick={() => {
                setShowActivityImport(true)
              }}
            >
              <Grid container style={{ marginLeft: "-15px" }}>
                <Grid item xs={2} style={{ textAlign: "center" }}>
                  <CloudUploadIcon />
                </Grid>
                <Grid item xs={10}>
                  {t("Import activities")}
                </Grid>
              </Grid>
            </MenuItem>
            <Divider />
            <MenuItem disabled divider>
              <b>{t("Create a new...")}</b>
            </MenuItem>
            <MenuItem
              onClick={() => {
                setCreate(true)
                setCreateMenu(undefined)
                setGroupCreate(true)
                setState((state) => ({ ...state, popoverAttachElement: null }))
              }}
            >
              {t("Activity Group")}
            </MenuItem>
            <MenuItem
              divider
              onClick={() => {
                setCreate(true)
                setCreateMenu(undefined)
                setShowCreate(true)
                setState((state) => ({ ...state, popoverAttachElement: null }))
              }}
            >
              {t("Survey Instrument")}
            </MenuItem>
            {!_hideCognitiveTesting() && [
              <MenuItem key="head" disabled>
                <b>{t("Smartphone Cognitive Tests")}</b>
              </MenuItem>,
              ...activitySpecs.map((x) => (
                <MenuItem
                  key={x?.id}
                  onClick={() => {
                    setCreateMenu(undefined)
                    setActivitySpecId(x.id)
                    setCreate(true)
                    games.includes(x?.id)
                      ? setShowCTCreate(true)
                      : x.id === "lamp.journal"
                      ? setShowJournalCreate(true)
                      : x.id === "lamp.scratch_image"
                      ? setShowSCImgCreate(true)
                      : x.id === "lamp.breathe"
                      ? setShowBreatheCreate(true)
                      : x.id === "lamp.tips"
                      ? setShowTipCreate(true)
                      : x.id === "lamp.dbt_diary_card"
                      ? setShowDBTCreate(true)
                      : setShowSCImgCreate(true)

                    setState((state) => ({ ...state, popoverAttachElement: null }))
                  }}
                >
                  {x.name ? activitiesObj[x.name] : x?.name?.replace("lamp.", "")}
                </MenuItem>
              )),
            ]}
          </React.Fragment>
        ) : state.selectedIcon === "delete" ? (
          <Box style={{ padding: "20px" }}>
            {/* <Button variant="contained" className={classes.deleteBtn} onClick={deleteParticipants}>
              Are you sure you want to delete these participants?
            </Button> */}
          </Box>
        ) : (
          <Box />
        )}
      </Popover>

      <ResponsiveDialog fullScreen transient={false} animate open={!!createDialogue} onClose={setAllFalse}>
        <AppBar position="static" style={{ background: "#FFF", boxShadow: "none" }}>
          <Toolbar className={classes.toolbardashboard}>
            <IconButton onClick={setAllFalse} color="default" aria-label="Menu">
              <Icon>arrow_back</Icon>
            </IconButton>
            <Typography variant="h5">{t("Create a new activity")}</Typography>
          </Toolbar>
        </AppBar>
        <Divider />
        <Box py={8} px={4}>
          <AddActivity
            activities={activities}
            studies={studies}
            groupCreate={groupCreate}
            showJournalCreate={showJournalCreate}
            showCTCreate={showCTCreate}
            showSCImgCreate={showSCImgCreate}
            showTipCreate={showTipCreate}
            showCreate={showCreate}
            showBreatheCreate={showBreatheCreate}
            showDBTCreate={showDBTCreate}
            saveGroup={saveGroup}
            activitySpecId={activitySpecId}
            saveCTest={saveCTest}
            saveTipsActivity={saveTipsActivity}
            saveActivity={saveActivity}
            setAllFalse={setAllFalse}
            activitySpecs={activitySpecs}
          />
        </Box>
      </ResponsiveDialog>
      <ImportActivity
        studies={studies}
        showActivityImport={showActivityImport}
        setLoading={setLoading}
        setShowActivityImport={setShowActivityImport}
        importActivities={importActivities}
      />
      <ResponsiveDialog
        fullScreen
        transient={false}
        animate
        open={!!selectedActivity}
        onClose={() => setSelectedActivity(undefined)}
      >
        <AppBar position="static" style={{ background: "#FFF", boxShadow: "none" }}>
          <Toolbar className={classes.toolbardashboard}>
            <IconButton onClick={() => setSelectedActivity(undefined)} color="default" aria-label="Menu">
              <Icon>arrow_back</Icon>
            </IconButton>
            <Typography variant="h5">
              {!!selectedActivity ? t("Modify an existing activity") : t("Create a new activity")}
            </Typography>
          </Toolbar>
        </AppBar>
        <Divider />
        <Box py={8} px={4}>
          <Activity
            allActivities={activities}
            activity={selectedActivity}
            onSave={updateActivity}
            details={gameDetails}
            studies={studies}
            onCancel={setAllFalse}
          />
        </Box>
      </ResponsiveDialog>
    </React.Fragment>
  )
}
