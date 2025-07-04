// Core Imports
import React, { useState, useEffect, useCallback } from "react"
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  MenuItem,
  DialogTitle,
  Grid,
  Container,
  Typography,
  Select,
  makeStyles,
  Theme,
  createStyles,
  FormControl,
  InputLabel,
  Backdrop,
  AppBar,
  Toolbar,
  Icon,
  Link,
  Divider,
  CircularProgress,
} from "@material-ui/core"
import { useSnackbar } from "notistack"
import { useDropzone } from "react-dropzone"
import { useTranslation } from "react-i18next"
import { saveSurveyActivity, saveCTestActivity, addActivity } from "../ActivityList/ActivityMethods"
import Pagination from "../../PaginatedElement"
import { Service } from "../../DBService/DBService"

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
    formControl: {
      minWidth: "100%",
    },
    backbtnlink: {
      width: 48,
      height: 48,
      color: "rgba(0, 0, 0, 0.54)",
      padding: 12,
      borderRadius: "50%",
      "&:hover": { background: "rgba(0, 0, 0, 0.04)" },
    },
    containerWidth: { maxWidth: 1055 },
    importList: { padding: "15px", background: "#f4f4f4", borderBottom: "#fff solid 2px" },
    dividerHeader: {
      marginTop: 0,
    },
  })
)

export default function ImportActivity({ ...props }) {
  const [selectedStudy, setSelectedStudy] = useState(undefined)
  const classes = useStyles()
  const [importFile, setImportFile] = useState<any>()
  const [page, setPage] = useState(0)
  const [rowCount, setRowCount] = useState(5)
  const [paginatedImported, setPaginatedImported] = useState([])
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const inputRef = React.useRef(null)
  const [studies, setStudies] = useState(null)
  const [activities, setActivities] = useState(null)

  useEffect(() => {
    setLoading(true)
    Service.getAll("studies").then((studies) => {
      setStudies(studies)
      Service.getAll("activities").then((activities) => {
        setActivities(activities)
        setLoading(false)
      })
    })
  }, [])

  const handleChangePage = (page: number, rowCount: number) => {
    setRowCount(rowCount)
    setPage(page)
    setPaginatedImported(importFile.slice(page * rowCount, page * rowCount + rowCount))
  }

  // Import a file containing pre-linked Activity objects from another Study.
  const importActivities = async (selectedStudy: string, importFile: any) => {
    setLoading(true)
    let status = true
    const _importFile = [...importFile] // clone it so we can close the dialog first
    let allIDs = _importFile.map((x) => x.id).reduce((prev, curr) => ({ ...prev, [curr]: undefined }), {})
    let brokenGroupsCount = _importFile
      .filter((activity) => activity.spec === "lamp.group")
      .filter((activity) => activity.settings.filter((x) => !Object.keys(allIDs).includes(x)).length > 0).length
    if (brokenGroupsCount > 0) {
      enqueueSnackbar(`${t("Couldn't import the Activities because some Activities are misconfigured or missing.")}`, {
        variant: "error",
      })
      setLoading(false)
      return
    }

    // checking and updating duplicate activities under same group
    checkDuplicateUpdateActivity(_importFile, activities, selectedStudy)

    // Surveys only.
    for (let x of _importFile.filter((x) => ["lamp.survey"].includes(x.spec))) {
      try {
        let newItem = await saveSurveyActivity({
          ...x,
          id: undefined,
          studyID: selectedStudy,
          tableData: undefined,
        })
        if (!!newItem.data) {
          allIDs[x.id] = newItem.data
          addActivity(
            {
              ...x,
              id: newItem.data,
              studyID: selectedStudy,
            },
            studies
          )
        }
      } catch (e) {
        status = false
      }
    }

    // CTests only.
    for (let x of _importFile.filter((x) => !["lamp.group", "lamp.survey"].includes(x.spec))) {
      try {
        let newItem = await saveCTestActivity({
          ...x,
          id: undefined,
          studyID: selectedStudy,
        })
        if (!!newItem.data) {
          allIDs[x.id] = newItem.data
          addActivity(
            {
              ...x,
              id: newItem.data,
              studyID: selectedStudy,
            },
            studies
          )
        }
      } catch (e) {
        status = false
      }
    }

    // Groups only. This MUST be done last or the mapping will be incorrect (allIDs).
    for (let x of _importFile.filter((x) => ["lamp.group"].includes(x.spec))) {
      try {
        let newItem = await saveCTestActivity({
          ...x,
          id: undefined,
          tableData: undefined,
          studyID: selectedStudy,
          settings: x.settings.map((y) => allIDs[y]),
        })
        if (!!newItem.data) {
          addActivity(
            {
              ...x,
              id: newItem.data,
              studyID: selectedStudy,
            },
            studies
          )
        }
      } catch (e) {
        status = false
      }
    }
    if (status) {
      setLoading(false)
      enqueueSnackbar(`${t("The selected Activities were successfully imported.")}`, {
        variant: "success",
      })
    } else {
      setLoading(false)
      enqueueSnackbar(`${t("Couldn't import one of the selected Activity groups.")}`, { variant: "error" })
    }
    history.back()
  }

  const checkDuplicateUpdateActivity = (obj, activitiesList, selectedStudyId) => {
    const objArray = obj
    objArray.map((eachData, i) => {
      let activityStudyCount = activitiesList.reduce(function (n, eachActivity) {
        return n + (eachActivity.study_id === selectedStudyId)
      }, 0)
      const nameExists = activitiesList.some((el) => el.name === eachData.name && el.study_id === selectedStudyId)
      if (nameExists) {
        if (activityStudyCount > 0) {
          objArray[i].name = eachData.name + "-duplicate-" + parseInt(activityStudyCount + 1)
        } else {
          objArray[i].name = eachData.name + "-duplicate"
        }
      }
    })
  }

  const onDrop = useCallback((acceptedFiles, event) => {
    const reader = new FileReader()
    reader.onabort = () => enqueueSnackbar(`${t("Couldn't import the Activities.")}`, { variant: "error" })
    reader.onerror = () => enqueueSnackbar(`${t("Couldn't import the Activities.")}`, { variant: "error" })
    reader.onload = () => {
      let obj = JSON.parse(decodeURIComponent(escape(atob(reader.result as string))))
      if (
        Array.isArray(obj) &&
        obj.filter((x) => typeof x === "object" && !!x.name && !!x.settings && !!x.schedule).length > 0
      ) {
        setPaginatedImported(obj.slice(page * rowCount, page * rowCount + rowCount))
        setImportFile(obj)
      } else {
        enqueueSnackbar(`${t("Couldn't import the Activities.")}`, { variant: "error" })
      }
    }
    acceptedFiles.forEach((file) => reader.readAsText(file))
  }, [])

  // eslint-disable-next-line
  const { acceptedFiles, getRootProps, getInputProps, isDragActive, isDragAccept } = useDropzone({
    onDrop,
    accept: "application/json,.json",
    maxSize: 25 * 1024 * 1024 /* 5MB */,
  })

  return (
    <React.Fragment>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <AppBar position="static" style={{ background: "#FFF", boxShadow: "none" }}>
        <Toolbar className={classes.toolbardashboard}>
          <Link
            onClick={() => {
              history.back()
            }}
            underline="none"
            className={classes.backbtnlink}
          >
            <Icon>arrow_back</Icon>
          </Link>
          <Typography variant="h5">{`${t("Import activities")}`}</Typography>
        </Toolbar>
      </AppBar>
      <Divider className={classes.dividerHeader} />
      <Container className={classes.containerWidth}>
        <Box mt={2} mb={2}>
          <Typography variant="h6">{`${t("Choose the Group you want to import activities.")}`}</Typography>
        </Box>
        <Grid item lg={4} md={6} xs={12}>
          <FormControl variant="filled" className={classes.formControl}>
            <InputLabel id="demo-simple-select-filled-label">{`${t("Group")}`}</InputLabel>
            <Select
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              value={selectedStudy}
              onChange={(event) => {
                setSelectedStudy(event.target.value)
              }}
            >
              {(studies || []).map((study) => (
                <MenuItem key={study.id} value={study.id}>
                  {study.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {typeof selectedStudy === "undefined" ||
        (typeof selectedStudy !== "undefined" && selectedStudy?.trim() === "") ? (
          <Box mt={1}>
            <Typography className={classes.errorMsg}>{`${t("Select a Study to import activities.")}`}</Typography>
          </Box>
        ) : (
          ""
        )}
        <Box {...getRootProps()} py={3} className={classes.dragDrop} onClick={() => inputRef.current?.click()}>
          <input
            {...getInputProps()}
            className={selectedStudy}
            ref={inputRef}
            disabled={selectedStudy ? false : true}
          />
          <Typography variant="h6">{`${t("Drag files here, or click to select files.")}`}</Typography>
          <Typography className={classes.errorMsg}>{`${t("The maximum allowed file size is 25 MB.")}`}</Typography>
        </Box>

        <Dialog open={!!importFile} onClose={() => setImportFile(undefined)}>
          <DialogTitle>{`${t("Continue importing?")}`}</DialogTitle>
          <DialogContent dividers={false}>
            {(paginatedImported || []).map((activity) => (
              <Box className={classes.importList}>
                <Box>{activity.name}</Box>
              </Box>
            ))}
            <Pagination data={importFile} updatePage={handleChangePage} rowPerPage={[5, 10]} defaultCount={5} />
            <Typography className={classes.errorMsg}>
              {`${t("The Activities having same name under the selected group will be duplicated into new name.")}`}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Box p={2} pt={1}>
              <Button onClick={() => setImportFile(undefined)} color="secondary" autoFocus>
                {`${t("Cancel")}`}
              </Button>
              <Button
                onClick={() => {
                  importActivities(selectedStudy, importFile)
                  setImportFile(undefined)
                }}
                color="primary"
                autoFocus
              >
                {`${t("Import")}`}
              </Button>
            </Box>
          </DialogActions>
        </Dialog>
      </Container>
    </React.Fragment>
  )
}
