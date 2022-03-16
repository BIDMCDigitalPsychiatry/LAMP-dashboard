import React, { useState, useEffect } from "react"
import {
  Box,
  MenuItem,
  Icon,
  Grid,
  Fab,
  Backdrop,
  CircularProgress,
  Popover,
  makeStyles,
  Theme,
  createStyles,
  Link,
} from "@material-ui/core"
import LAMP from "lamp-core"
import { useTranslation } from "react-i18next"
import { availableActivitySpecs } from "./Index"

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
      "& a": {
        display: "block",
        fontSize: "1rem",
        color: "rgba(0, 0, 0, 0.87)",
        padding: "8px 30px",
        textTransform: "capitalize",
        "&:hover": { backgroundColor: "#ECF4FF" },
      },
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
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
    borderTop: { borderTop: "1px solid rgba(0, 0, 0, 0.20)" },
  })
)

export default function AddActivity({
  activities,
  studies,
  studyId,
  setActivities,
  researcherId,
  ...props
}: {
  activities?: any
  studies?: any
  studyId?: string
  setActivities?: Function
  researcherId?: string
}) {
  const [activitySpecs, setActivitySpecs] = useState([])
  const { t } = useTranslation()
  const classes = useStyles()
  const [popover, setPopover] = useState(null)
  const [loading, setLoading] = useState(true)

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
    "lamp.survey": t("Survey Instrument"),
    "lamp.group": t("Activity Group"),
  }

  const getActivitySpec = async (id) => {
    try {
      const spec = await LAMP.ActivitySpec.view(id)
      if (!!spec && (!!spec?.executable || !!spec?.settings)) {
        return spec
      }
      return null
    } catch (e) {
      return null
    }
  }

  useEffect(() => {
    ;(async () => {
      const allSpecs = await LAMP.ActivitySpec.all()
      let availableSpecs = allSpecs.filter((x: any) => Object.keys(activitiesObj).includes(x?.id))
      let otherSpecs = allSpecs.filter((x: any) => !Object.keys(activitiesObj).includes(x?.id))
      let i = 0
      await otherSpecs.map(async (x: any, index: number) => {
        if (!!x.id) {
          await getActivitySpec(x.id).then((spec) => {
            if (!!spec) availableSpecs.push(spec)
          })
        }
        if (index === otherSpecs.length - 1) {
          setActivitySpecs(availableSpecs)
          setLoading(false)
        }
      })
    })()
  }, [])

  return (
    <Box>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
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
              window.location.href = `/#/researcher/${researcherId}/activity/import`
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
          {activitySpecs.filter((x) => ["lamp.group", "lamp.survey"].includes(x.id)).length > 0 && (
            <React.Fragment>
              <MenuItem disabled divider>
                <b>{t("Create a new...")}</b>
              </MenuItem>
              {activitySpecs
                .filter((x) => ["lamp.group", "lamp.survey"].includes(x.id))
                .map((x) => (
                  <Link
                    href={`/#/researcher/${researcherId}/activity/add/${x?.id?.replace("lamp.", "")}`}
                    underline="none"
                  >
                    {activitiesObj[x.id] ? t(activitiesObj[x.id]) : t(x?.id?.replace("lamp.", "").replaceAll("_", " "))}
                  </Link>
                ))}
            </React.Fragment>
          )}
          {[
            <MenuItem divider key="head" disabled className={classes.borderTop}>
              <b>{t("Smartphone Cognitive Tests")}</b>
            </MenuItem>,
            ...activitySpecs
              .filter((x) => !["lamp.group", "lamp.survey"].includes(x.id))
              .map((x) => (
                <Link
                  href={`/#/researcher/${researcherId}/activity/add/${x?.id?.replace("lamp.", "")}`}
                  underline="none"
                >
                  {activitiesObj[x.id] ? t(activitiesObj[x.id]) : t(x?.id?.replace("lamp.", "").replaceAll("_", " "))}
                </Link>
              )),
          ]}
        </React.Fragment>
      </Popover>
    </Box>
  )
}
