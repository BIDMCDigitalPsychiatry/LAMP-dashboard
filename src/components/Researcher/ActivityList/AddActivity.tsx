import React, { useState, useEffect } from "react"
import {
  Box,
  MenuItem,
  AppBar,
  Toolbar,
  Icon,
  IconButton,
  Divider,
  Grid,
  Fab,
  Typography,
  Popover,
  makeStyles,
  Theme,
  createStyles,
} from "@material-ui/core"
import LAMP from "lamp-core"
import { useTranslation } from "react-i18next"
import { availableActivitySpecs } from "./Index"
import ResponsiveDialog from "../../ResponsiveDialog"
import ImportActivity from "./ImportActivity"
import Activity from "./Activity"
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
        [theme.breakpoints.down("sm")]: {
          fontSize: 25,
        },
      },
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
      [theme.breakpoints.down("sm")]: {
        minWidth: "auto",
      },
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
    customPopover: { backgroundColor: "rgba(0, 0, 0, 0.4)" },
    customPaper: {
      maxWidth: 380,
      maxHeight: 400,
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
    addText: {
      [theme.breakpoints.down("sm")]: {
        display: "none",
      },
    },
    dividerMain: {
      margin: 0,
    },
  })
)

export default function AddActivity({
  activities,
  studies,
  studyId,
  setActivities,
  setUpdateCount,
  ...props
}: {
  activities?: any
  studies?: any
  studyId?: string
  setActivities?: Function
  setUpdateCount?: Function
}) {
  const [activitySpecs, setActivitySpecs] = useState([])
  const [createMenu, setCreateMenu] = useState(false)
  const [activitySpecId, setActivitySpecId] = useState(null)
  const [createDialogue, setCreate] = useState(false)
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
    "lamp.pop_the_bubbles": t("Pop the bubbles"),
    "lamp.balloon_risk": t("Balloon Risk"),
    "lamp.recording": t("Voice Recording"),
  }

  useEffect(() => {
    LAMP.ActivitySpec.all().then((res) => {
      setActivitySpecs(
        res.filter((x: any) => availableActivitySpecs.includes(x.id) && !["lamp.group", "lamp.survey"].includes(x.id))
      )
    })
  }, [])

  return (
    <Box>
      <Fab
        variant="extended"
        color="primary"
        classes={{ root: classes.btnBlue + " " + (popover ? classes.popexpand : "") }}
        onClick={(event) => setPopover(event.currentTarget)}
      >
        <Icon>add</Icon> <span className={classes.addText}>{t("Add")}</span>
      </Fab>
      <Popover
        open={!!popover ? true : false}
        //anchorPosition={!!popover && popover.getBoundingClientRect()}
        anchorPosition={popover ? popover.getBoundingClientRect() : null}
        anchorReference="anchorPosition"
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
            divider
            onClick={() => {
              setPopover(null)
              setCreate(true)
              setShowActivityImport(true)
              setCreateMenu(false)
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
          <MenuItem disabled divider>
            <b>{t("Create a new...")}</b>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setPopover(null)
              setCreate(true)
              setShowActivityImport(false)
              setActivitySpecId("lamp.group")
              setCreateMenu(true)
            }}
          >
            {t("Activity Group")}
          </MenuItem>
          <MenuItem
            divider
            onClick={() => {
              setPopover(null)
              setCreate(true)
              setCreateMenu(true)
              setShowActivityImport(false)
              setActivitySpecId("lamp.survey")
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
                  setPopover(null)
                  setCreateMenu(true)
                  setActivitySpecId(x.id)
                  setShowActivityImport(false)
                  setCreate(true)
                }}
              >
                {activitiesObj[x.name] ? t(activitiesObj[x.name]) : t(x?.name?.replace("lamp.", ""))}
              </MenuItem>
            )),
          ]}
        </React.Fragment>
      </Popover>
      <ResponsiveDialog
        fullScreen
        transient={false}
        animate
        open={!!createDialogue}
        onClose={() => {
          setShowActivityImport(false)
          setCreateMenu(false)
          setCreate(false)
        }}
      >
        <AppBar position="static" style={{ background: "#FFF", boxShadow: "none" }}>
          <Toolbar className={classes.toolbardashboard}>
            <IconButton onClick={() => setCreate(false)} color="default" aria-label="Menu">
              <Icon>arrow_back</Icon>
            </IconButton>
            <Typography variant="h5">{t("Create a new activity")}</Typography>
          </Toolbar>
        </AppBar>
        <Divider className={classes.dividerMain} />
        <Box py={8} px={4}>
          {!!showActivityImport && (
            <ImportActivity
              studies={studies}
              activitieas={activities}
              setActivities={setActivities}
              onClose={() => {
                setShowActivityImport(false)
                setCreate(false)
              }}
              setUpdateCount={setUpdateCount}
            />
          )}
          {!!createMenu && (
            <Activity
              allActivities={activities}
              studyId={studyId ?? undefined}
              activitySpecId={activitySpecId}
              studies={studies}
              onClose={() => {
                setCreateMenu(false)
                setCreate(false)
              }}
              openWindow={createDialogue}
              setActivities={setActivities}
              setUpdateCount={setUpdateCount}
            />
          )}
        </Box>
      </ResponsiveDialog>
    </Box>
  )
}
