import React, { useState, useEffect } from "react"
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
import SurveyCreator from "./SurveyCreator"
import JournalCreator from "./JournalCreator"
import GroupCreator from "./GroupCreator"
import TipCreator from "./TipCreator"
import DBTCreator from "./DBTCreator"
import GameCreator from "./GameCreator"
import BreatheCreator from "./BreatheCreator"
import SCImageCreator from "./SCImageCreator"
import LAMP from "lamp-core"
import { useSnackbar } from "notistack"
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
} from "../ActivityList/Index"
import { availableAtiveSpecs, games } from "./Activities"
import { makeStyles, Theme, createStyles, MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles"
import ResponsiveDialog from "../../ResponsiveDialog"
import ImportActivity from "./ImportActivity"

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

export default function AddActivity({ activities, studies, ...props }) {
  const [activitySpecs, setActivitySpecs] = useState([])
  const [createMenu, setCreateMenu] = useState<Element>()
  const [showCreate, setShowCreate] = useState(false)
  const [groupCreate, setGroupCreate] = useState(false)
  const [showTipCreate, setShowTipCreate] = useState(false)
  const [showCTCreate, setShowCTCreate] = useState(false)
  const [showJournalCreate, setShowJournalCreate] = useState(false)
  const [showBreatheCreate, setShowBreatheCreate] = useState(false)
  const [showSCImgCreate, setShowSCImgCreate] = useState(false)
  const [showDBTCreate, setShowDBTCreate] = useState(false)
  const [activitySpecId, setActivitySpecId] = useState(null)
  const [createDialogue, setCreate] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation()
  const classes = useStyles()
  const [popover, setPopover] = useState(null)
  const [showActivityImport, setShowActivityImport] = useState(false)
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
  }
  useEffect(() => {
    LAMP.ActivitySpec.all().then((res) => {
      console.log(res)
      setActivitySpecs(
        res.filter((x: any) => availableAtiveSpecs.includes(x.id) && !["lamp.group", "lamp.survey"].includes(x.id))
      )
    })
  }, [])

  // Create a new Activity object & survey descriptions if set.
  const saveTipsActivity = async (x) => {
    let result = await saveTipActivity(x)
    if (!!result.error)
      enqueueSnackbar(t("Encountered an error: ") + result?.error, {
        variant: "error",
      })
    else {
      enqueueSnackbar(t("Successfully updated the Activity."), {
        variant: "success",
      })
      // onChange()
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
    // let selectedStudy = studies.filter((study) => study.id === x.studyID)[0]
    // setStudiesCount({ ...studiesCount, [selectedStudy.name]: ++studiesCount[selectedStudy.name] })
    // onChange()
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
    // let selectedStudy = studies.filter((study) => study.id === x.studyID)[0]
    // setStudiesCount({ ...studiesCount, [selectedStudy.name]: ++studiesCount[selectedStudy.name] })
    // onChange()
  }

  // Create a new Activity object that represents a cognitive test.
  const saveCTest = async (x) => {
    let newItem = await saveCTestActivity(x)
    if (!!newItem.error)
      enqueueSnackbar(t("Failed to create a new Activity."), {
        variant: "error",
      })
    else
      enqueueSnackbar(t("Successfully created a new Activity."), {
        variant: "success",
      })
    // let selectedStudy = studies.filter((study) => study.id === x.studyID)[0]
    // setStudiesCount({ ...studiesCount, [selectedStudy.name]: ++studiesCount[selectedStudy.name] })
    // onChange()
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
  }

  return (
    <Box py={8} px={4}>
      <Fab
        variant="extended"
        color="primary"
        classes={{ root: classes.btnBlue + " " + classes.popexpand }}
        onClick={(event) => setPopover(event.currentTarget)}
      >
        <Icon>add</Icon> {t("Add")}
      </Fab>

      <Popover
        open={!!popover ? true : false}
        anchorPosition={!!popover && popover.getBoundingClientRect()}
        classes={{ root: classes.customPopover, paper: classes.customPaper }}
        onClose={() => setPopover(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <React.Fragment>
          <MenuItem
            onClick={() => {
              setCreate(true)
              setShowActivityImport(true)
            }}
          >
            <Grid container style={{ marginLeft: "-15px" }}>
              <Grid item xs={2} style={{ textAlign: "center" }}>
                <Icon>cloud_upload</Icon>
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
            }}
          >
            {t("Survey Instrument")}
          </MenuItem>
          {[
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
                }}
              >
                {x.name ? activitiesObj[x.name] : x?.name?.replace("lamp.", "")}
              </MenuItem>
            )),
          ]}
        </React.Fragment>
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
          {!!showActivityImport && <ImportActivity studies={studies} activitieas={activities} />}
          {!!groupCreate && (
            <GroupCreator
              activities={props.activities}
              study={props.studyId ?? undefined}
              studies={props.studies}
              onSave={props.saveGroup}
            />
          )}
          {!!showCTCreate && (
            <GameCreator
              onSave={props.saveCTest}
              activitySpecId={props.activitySpecId}
              studies={props.studies}
              activities={props.activities}
              study={props.studyId ?? undefined}
            />
          )}
          {!!showJournalCreate && (
            <JournalCreator
              onSave={props.saveCTest}
              activitySpecId={props.activitySpecId}
              studies={props.studies}
              activities={props.activities}
              study={props.studyId ?? undefined}
            />
          )}
          {!!showSCImgCreate && (
            <SCImageCreator
              onSave={props.saveCTest}
              activitySpecId={props.activitySpecId}
              studies={props.studies}
              activities={props.activities}
              study={props.studyId ?? undefined}
            />
          )}
          {!!showTipCreate && (
            <TipCreator
              onSave={props.saveTipsActivity}
              studies={props.studies}
              allActivities={props.activities}
              study={props.studyId ?? undefined}
            />
          )}
          {!!showCreate && (
            <SurveyCreator studies={props.studies} onSave={props.saveActivity} study={props.studyId ?? undefined} />
          )}
          {!!showBreatheCreate && (
            <BreatheCreator
              activitySpecId={props.activitySpecId}
              studies={props.studies}
              onSave={props.saveCTest}
              activities={props.activities}
              study={props.studyId ?? undefined}
            />
          )}
          {!!showDBTCreate && (
            <DBTCreator
              activitySpecId={props.activitySpecId}
              onCancel={props.setAllFalse}
              studies={props.studies}
              onSave={props.saveCTest}
              activities={props.activities}
              study={props.studyId ?? undefined}
            />
          )}
        </Box>
      </ResponsiveDialog>
    </Box>
  )
}
