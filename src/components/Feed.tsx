import React, { useEffect, useState } from "react"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import {
  Card,
  Step,
  Stepper,
  StepLabel,
  Typography,
  Box,
  Grid,
  StepContent,
  useMediaQuery,
  useTheme,
  StepConnector,
  Backdrop,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  Icon,
  createTheme,
} from "@material-ui/core/"
import { DatePicker } from "@material-ui/pickers"
import classnames from "classnames"
import InfoIcon from "../icons/Info.svg"
import WeekView from "./WeekView"
import LAMP from "lamp-core"
import { MuiPickersUtilsProvider } from "@material-ui/pickers"
import DateFnsUtils from "@date-io/date-fns"
import { useTranslation } from "react-i18next"
import { Service } from "./DBService/DBService"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    learn: {
      background: "#FFF9E5",
      padding: "8px 10px",
      borderRadius: 10,
      border: "2px solid transparent",
    },
    learnCompleted: {
      border: "2px solid #FFE27A",
      padding: "8px 10px",
      borderRadius: 10,
      "& h5": {
        color: "rgba(0, 0, 0, 0.5) !important",
      },
      "& svg": { opacity: 0.5 },
    },
    assess: {
      background: "#E7F8F2",
      padding: "8px 10px",
      borderRadius: 10,
      border: "2px solid transparent",
    },
    assessCompleted: {
      border: "2px solid #65DEB4",
      padding: "8px 10px",
      borderRadius: 10,
      "& h5": {
        color: "rgba(0, 0, 0, 0.5) !important",
      },
      "& svg": { opacity: 0.5 },
    },
    manage: {
      background: "#FFEFEC",
      padding: "8px 10px",
      borderRadius: 10,
      border: "2px solid transparent",
    },
    manageCompleted: {
      border: "2px solid #FFAC98",
      padding: "8px 10px",
      borderRadius: 10,
      "& h5": {
        color: "rgba(0, 0, 0, 0.5) !important",
      },
      "& svg": { opacity: 0.5 },
    },
    prevent: {
      background: "#ECF4FF",
      padding: "8px 10px",
      borderRadius: 10,
      border: "2px solid transparent",
    },
    preventCompleted: {
      border: "2px solid #7DB2FF",
      padding: "8px 10px",
      borderRadius: 10,
      "& h5": {
        color: "rgba(0, 0, 0, 0.5) !important",
      },
      "& svg": { opacity: 0.5 },
    },
    goal: {
      background: "#FFEFEC",
      padding: "8px 10px",
      borderRadius: 10,
      border: "2px solid transparent",
    },
    goalCompleted: {
      border: "2px solid #FFAC98",
      padding: "8px 10px",
      borderRadius: 10,
      "& h5": {
        color: "rgba(0, 0, 0, 0.5) !important",
      },
      "& svg": { opacity: 0.5 },
    },
    image: {
      width: 65,
      [theme.breakpoints.up("lg")]: {
        width: 85,
      },
      // marginRight: "10px",
      "& div": {
        width: 60,
        height: 60,
        [theme.breakpoints.up("lg")]: {
          width: 80,
          height: 80,
        },
      },
    },
    feedtasks: {
      "& h5": {
        fontSize: 16,

        fontWeight: 600,
        color: "rgba(0, 0, 0, 0.75)",
      },
    },
    smalltext: {
      fontSize: 12,
      fontStyle: "normal",
    },
    stepIcon: {
      color: "white",
      width: 32,
      height: 32,
      border: "3px solid #FFEFEC",
      borderRadius: "50%",
      marginRight: 10,
      "& text": {
        fill: "#FFF",
      },
    },
    stepActiveIcon: {
      color: "#FFFFFF !important",
      "& text": {
        fill: "#FFFFFF !important",
      },
    },
    manageIcon: {
      border: "3px solid #FE8470",
    },

    manageCompletedIcon: {
      color: "#FE8470 !important",
      border: "0px solid #FE8470",
      "& text": {
        fill: "#FE8470 !important",
      },
    },
    preventIcon: {
      border: "3px solid #7DB2FF",
    },

    preventCompletedIcon: {
      color: "#7DB2FF !important",
      border: "0px solid #7DB2FF",
      "& text": {
        fill: "#7DB2FF !important",
      },
    },
    assessIcon: {
      border: "3px solid #65DEB4",
    },

    assessCompletedIcon: {
      color: "#65DEB4 !important",
      border: "0px solid #65DEB4",
      "& text": {
        fill: "#65DEB4 !important",
      },
    },
    learnIcon: {
      border: "3px solid #FFD645",
    },

    learnCompletedIcon: {
      color: "#FFD645 !important",
      border: 0,
      "& text": {
        fill: "#FFD645 !important",
      },
    },

    customstepper: {
      position: "relative",
      maxWidth: 500,
      padding: "15px 18px 18px 28px",
      [theme.breakpoints.down("sm")]: {
        paddingTop: 40,
        paddingLeft: 16,
      },
      "&::after": {
        content: "",
        position: "absolute",
        display: "block",
        width: 30,
        height: 100,
        background: "black",
        top: 100,
      },
    },
    customsteppercontent: {
      marginLeft: 15,
      marginTop: -38,
      paddingTop: 44,
      marginBottom: -38,
      paddingBottom: 52,
      borderLeft: "2px solid #bdbdbd",
    },
    customstepperconnecter: {
      minHeight: 0,
      padding: 0,
      "& span": { minHeight: 0 },
    },

    large_calendar: {
      padding: "0px 0 0 50px",
      "& span": {
        fontSize: 14,
        fontWeight: "bold",
        color: "rgba(0, 0, 0, 0.75)",
        width: 50,
        height: 45,
        display: "block",
        margin: 0,
      },
      "& span.MuiPickersCalendarHeader-dayLabel": {
        textTransform: "capitalize",
        color: "#fff !important",
        paddingLeft: "15px",
      },
      "& span.MuiPickersCalendarHeader-dayLabel:first-letter": { color: "rgba(0, 0, 0, 0.75) !important" },
      "& div.MuiPickersCalendarHeader-switchHeader": { marginBottom: 35, padding: "0 5px" },
      "& div.MuiPickersCalendar-transitionContainer": { minHeight: 300 },
      "& div": { maxWidth: "inherit !important" },
      "& p.MuiTypography-alignCenter": { textTransform: "capitalize" },
      "& button": {
        width: 40,
        height: 40,
        margin: "0 auto",
        display: "flex",
        padding: 0,
        "& span": { width: "auto", height: "auto" },
      },

      [theme.breakpoints.down("sm")]: {
        display: "none",
      },
    },
    // thumbContainer: { maxWidth: 1055, margin: "0 auto" },
    thumbContainer: {
      maxWidth: 1055,
      width: "80%",
      margin: "0 auto",
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        paddingBottom: 80,
      },
    },
    day: {
      "& p": { fontSize: 10 },
    },
    selectedDay: {
      "& button": {
        width: 36,
        height: 36,
        background: "#ECF4FF",
        border: "1px solid #7599FF",
        display: "block",
        "& p": { fontSize: 10, color: "#618EF7" },
        "&:hover": { background: "#2196f3" },
        "&:hover p": { color: "#fff" },
      },
    },
    currentDay: {
      "& button": {
        width: 36,
        height: 36,
        background: "#7599FF",
        display: "block",
        boxShadow: "0px 10px 15px rgba(134, 182, 255, 0.25)",
        "& p": { fontSize: 10, color: "white  !important" },
      },
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
    blankMsg: {
      padding: "0 14px",
      "& path": { fill: "#666" },
      "& p": { margin: "2px 5px" },
    },
  })
)
import locale_lang from "../locale_map.json"
import frLocale from "date-fns/locale/fr"
import koLocale from "date-fns/locale/ko"
import daLocale from "date-fns/locale/da"
import deLocale from "date-fns/locale/de"
import itLocale from "date-fns/locale/it"
import zhLocale from "date-fns/locale/zh-CN"
import esLocale from "date-fns/locale/es"
import enLocale from "date-fns/locale/en-US"
import hiLocale from "date-fns/locale/hi"
import { getSelfHelpAllActivityEvents } from "./Participant"

const userLanguages = ["en-US", "es-ES", "hi-IN", "de-DE", "da-DK", "fr-FR", "ko-KR", "it-IT", "zh-CN"]

const localeMap = {
  "en-US": enLocale,
  "es-ES": esLocale,
  "hi-IN": hiLocale,
  "de-DE": deLocale,
  "da-DK": daLocale,
  "fr-FR": frLocale,
  "ko-KR": koLocale,
  "it-IT": itLocale,
  "zh-CN": zhLocale,
}

//MuiTypography-root MuiPickersCalendarHeader-dayLabel MuiTypography-caption
const formTheme = createTheme({
  overrides: {
    MuiTypography: {
      root: { textTransform: "capitalize" },
      caption: {
        color: "#fff !important",
        paddingLeft: "15px",
        "&::first-letter": { color: "rgba(0, 0, 0, 0.75) !important" },
      },
    },
    MuiPaper: {
      root: { textTransform: "capitalize" },
    },
  },
})

function CalendarView({ selectedDays, date, changeDate, getFeedByDate, ...props }) {
  const classes = useStyles()
  const { t, i18n } = useTranslation()

  const getSelectedLanguage = () => {
    const matched_codes = Object.keys(locale_lang).filter((code) => code.startsWith(navigator.language))
    const lang = matched_codes?.length > 0 ? matched_codes[0] : "en-US"
    return i18n.language ? i18n.language : userLanguages.includes(lang) ? lang : "en-US"
  }
  return (
    // <MuiThemeProvider theme={formTheme}>

    <MuiPickersUtilsProvider locale={localeMap[getSelectedLanguage()]} utils={DateFnsUtils}>
      <DatePicker
        autoOk
        disableToolbar
        orientation="landscape"
        variant="static"
        openTo="date"
        value={date}
        onChange={() => {}}
        onMonthChange={(e) => {
          getFeedByDate(new Date(e))
        }}
        renderDay={(date, selectedDate, isInCurrentMonth, dayComponent) => {
          const isSelected = isInCurrentMonth && selectedDays.includes(new Date(date).toLocaleDateString())
          const isActiveDate = selectedDate.getDate() === new Date(date).getDate() ? true : false
          const view = isSelected ? (
            <div onClick={() => getFeedByDate(date)}>
              <span className={isActiveDate ? classes.currentDay : classes.selectedDay}>{dayComponent}</span>
            </div>
          ) : isActiveDate ? (
            <span onClick={() => getFeedByDate(date)} className={classes.currentDay}>
              {dayComponent}
            </span>
          ) : (
            <span onClick={() => getFeedByDate(date)} className={classes.day}>
              {dayComponent}
            </span>
          )
          return view
        }}
        leftArrowIcon={<Icon>arrow_back_ios</Icon>}
        rightArrowIcon={<Icon>arrow_forward_ios</Icon>}
      />
    </MuiPickersUtilsProvider>
    // </MuiThemeProvider>
  )
}
export default function Feed({
  participant,
  activities,
  visibleActivities,
  setVisibleActivities,
  showStreak,
  ...props
}) {
  const classes = useStyles()
  const supportsSidebar = useMediaQuery(useTheme().breakpoints.up("md"))
  const [date, changeDate] = useState(new Date())
  const [selectedDays, setSelectedDays] = useState([])
  const [currentFeed, setCurrentFeed] = useState([])
  const [events, setEvents] = useState(null)
  const [loading, setLoading] = useState(true)
  const [openNotImplemented, setOpenNotImplemented] = useState(false)
  const [tag, setTag] = useState(null)
  const { t } = useTranslation()
  const [showFeed, setShowFeed] = useState(false)

  const getFeedByDate = (date: Date) => {
    FetchModuleCompletionAPI(date)
    Service.getAllTags("activitytags").then((data) => {
      setTag(data)
    })
  }

  useEffect(() => {
    if (!participant?.id) return
    ;(async () => {
      const showFeed = await LAMP.Type.getAttachment(
        participant.id,
        "lamp.dashboard.welcome_dismissed"
      ).then((res: any) => (res.error === undefined && typeof res.data != "undefined" ? res.data : true))
      setShowFeed(showFeed)
      if (showFeed !== false) {
        getFeedByDate(new Date())
      } else {
        setLoading(false)
      }
    })()
  }, [participant?.id])

  const FetchModuleCompletionAPI = async (date: any) => {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    const formattedDate = `${year}-${month}-${day}`
    try {
      LAMP.Activity.feedDetails(participant?.id, formattedDate).then((res: any) => {
        const payload = (res && res.data) || res || {}
        const items = Array.isArray(payload) ? payload : payload.items || []

        // // Multi-day highlighting (month/week) provided by API
        const distinctDays = Array.isArray(payload.distinctDays) ? payload.distinctDays : []
        if (distinctDays?.length) setSelectedDays(distinctDays)
        setCurrentFeed(items as any)
        setLoading(false)
      })
    } catch (e) {
      console.error("Failed to fetch leaderboard", e)
    }
  }

  return (
    <div className={classes.root}>
      {!supportsSidebar && <WeekView type="feed" onSelect={getFeedByDate} daysWithdata={selectedDays} />}

      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid container className={classes.thumbContainer}>
        <Grid item xs>
          {loading == false && (currentFeed?.length === 0 || showFeed == false) ? (
            <Box display="flex" className={classes.blankMsg} ml={1}>
              <Icon>info {showFeed}</Icon>
              <p>
                {showFeed == false
                  ? `${t("The managing researcher has disabled the user feed.")}`
                  : `${t("There are no scheduled activities available.")}`}
              </p>
            </Box>
          ) : null}
          {showFeed !== false && (
            <Stepper
              orientation="vertical"
              classes={{ root: classes.customstepper }}
              connector={<StepConnector classes={{ root: classes.customstepperconnecter }} />}
            >
              {typeof currentFeed !== "undefined" &&
                currentFeed?.map(
                  (feed, index) =>
                    (tag || [])?.filter((x) => x.id === feed.activityData?.id)[0]?.showFeed && (
                      <Step>
                        <StepLabel
                          StepIconProps={{
                            completed: feed.completed,
                            classes: {
                              root: classnames(classes.stepIcon, classes[feed.group + "Icon"]),
                              active: classes.stepActiveIcon,
                              completed: classes[feed.group + "CompletedIcon"],
                            },
                          }}
                        >
                          <Card
                            className={feed.completed ? classes[feed.group + "Completed"] : classes[feed.group]}
                            variant="outlined"
                            onClick={() => {
                              if (
                                !feed.completed &&
                                feed.clickable &&
                                (typeof feed.activityData?.category === "undefined" ||
                                  feed.activityData?.category === null ||
                                  (!!feed.activityData?.category && feed.activityData?.category?.length !== 0))
                              ) {
                                window.location.href = `/#/participant/${participant?.id}/activity/${feed.activityData.id}?mode=dashboard`
                              }
                            }}
                          >
                            <Grid container spacing={0}>
                              <Grid
                                xs
                                container
                                justifyContent="center"
                                direction="column"
                                className={classes.feedtasks}
                                spacing={0}
                              >
                                <Box m={1}>
                                  <Typography variant="body2" color="textSecondary">
                                    <Box fontStyle="italic" className={classes.smalltext}>
                                      {feed.timeValue}
                                    </Box>
                                  </Typography>
                                  <Typography variant="h5">{`${t(feed.title)}`}</Typography>
                                  <Typography className={classes.smalltext} color="textSecondary">
                                    {feed.spec}
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid container justifyContent="center" direction="column" className={classes.image}>
                                <Box
                                  style={{
                                    margin: "auto",
                                    background: !["", null].includes(
                                      (tag || [])?.filter((x) => x.id === feed.activityData?.id)[0]?.photo
                                    )
                                      ? `url(${
                                          (tag || [])?.filter((x) => x.id === feed.activityData?.id)[0]?.photo
                                        }) center center/contain no-repeat`
                                      : `url(${InfoIcon}) center center/contain no-repeat`,
                                  }}
                                ></Box>
                              </Grid>
                            </Grid>
                          </Card>
                        </StepLabel>
                        {index !== currentFeed?.length - 1 && (
                          <StepContent classes={{ root: classes.customsteppercontent }}>
                            <div></div>
                          </StepContent>
                        )}
                      </Step>
                    )
                )}
            </Stepper>
          )}
        </Grid>
        <Grid item xs className={classes.large_calendar}>
          <CalendarView selectedDays={selectedDays} date={date} getFeedByDate={getFeedByDate} changeDate={changeDate} />
        </Grid>
      </Grid>
      <Dialog
        open={openNotImplemented}
        onClose={() => setOpenNotImplemented(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>{`${t("This activity is not yet available in mindLAMP 2.")}`}</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNotImplemented(false)} color="primary">
            {`${t("Ok")}`}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
