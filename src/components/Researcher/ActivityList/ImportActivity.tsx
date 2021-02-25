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
import { ReactComponent as AddIcon } from "../../../icons/plus.svg"
import { ReactComponent as DeleteIcon } from "../../../icons/DeleteBlue.svg"
import { ReactComponent as ExportIcon } from "../../../icons/Export.svg"
// External Imports
import { saveAs } from "file-saver"
import { useDropzone } from "react-dropzone"
import CloudUploadIcon from "@material-ui/icons/CloudUpload"
// Local Imports
import LAMP, { Study } from "lamp-core"

import { useTranslation } from "react-i18next"
import {
  unspliceActivity,
  unspliceTipsActivity,
  spliceActivity,
  updateActivityData,
  saveGroupActivity,
  saveTipActivity,
  saveSurveyActivity,
  saveCTestActivity,
  unspliceCTActivity,
} from "../ActivityList/Index"
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

export default function ImportActivity({ studies, ...props }) {
  const [selectedStudy, setSelectedStudy] = useState(undefined)
  const classes = useStyles()
  const [importFile, setImportFile] = useState<any>()
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation()

  // Import a file containing pre-linked Activity objects from another Study.
  const importActivities = async (selectedStudy: string, importFile: any) => {
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

    enqueueSnackbar(t("The selected Activities were successfully imported."), {
      variant: "success",
    })
  }
  const onDrop = useCallback((acceptedFiles) => {
    const reader = new FileReader()
    reader.onabort = () => enqueueSnackbar(t("Couldn't import the Activities."), { variant: "error" })
    reader.onerror = () => enqueueSnackbar(t("Couldn't import the Activities."), { variant: "error" })
    reader.onload = () => {
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

      <Dialog open={!!importFile} onClose={() => setImportFile(undefined)}>
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
