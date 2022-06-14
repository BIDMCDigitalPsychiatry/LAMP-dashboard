import React, { useEffect, useState } from "react"
import {
  Grid,
  makeStyles,
  Theme,
  createStyles,
  NativeSelect,
  useMediaQuery,
  useTheme,
  Backdrop,
  CircularProgress,
  Card,
  Divider,
  Typography,
} from "@material-ui/core"
import { Vega } from "react-vega"
import { useTranslation } from "react-i18next"
import { emotions } from "./charts/emotions_chart"
import { effective } from "./charts/effective_chart"
import { ineffective } from "./charts/ineffective_chart"
import { actions } from "./charts/actions_chart"
import { selfcare } from "./charts/selfcare_chart"
import PreventSkills from "./PreventSkills"
import PreventNoSkills from "./PreventNoSkills"
import PreventNotes from "./PreventNotes"
import { ca } from "date-fns/locale"
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
    graphContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      [theme.breakpoints.down("xs")]: {
        padding: "0 15px",
      },
      "& canvas": {
        [theme.breakpoints.down("xs")]: {
          maxWidth: "100%",
          height: "auto !important",
        },
      },
    },
    titleContainer: {
      display: "flex",
      width: 500,
      marginBottom: 40,
      justifyContent: "space-between",
    },
    separator: {
      border: "2px solid rgba(0, 0, 0, 0.1)",
      width: "100%",
      marginTop: 50,
      marginBottom: 50,
      height: 0,
      maxWidth: 500,
    },
    selector: {
      display: "fixed",
      marginBottom: -30,
      marginRight: -300,
      zIndex: 1000,
      [theme.breakpoints.down("xs")]: {
        marginRight: -150,
        marginBottom: -25,
      },
    },
    blueBoxStyle: {
      background: "linear-gradient(0deg, #ECF4FF, #ECF4FF)",
      borderRadius: "10px",
      padding: "5px 20px 20px 20px",
      textAlign: "justify",
      marginBottom: 20,
      "& span": {
        color: "rgba(0, 0, 0, 0.4)",
        fontSize: "12px",
        lineHeight: "40px",
      },
    },
    graphSubContainer: {
      maxWidth: 500,
      "& h5": { fontSize: 25, color: "rgba(0, 0, 0, 0.75)", fontWeight: 600, marginBottom: 30 },
    },
    cardHeading: {
      padding: "10px 0px 10px 0px",
      maxWidth: "526px",
      margin: "0 auto 20px",
      boxShadow: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "end",
      "& h6": {
        paddingRight: 15,
        fontSize: "1.5rem",
        [theme.breakpoints.down("xs")]: {
          fontSize: "16px !important",
        },
      },
      [theme.breakpoints.down("xs")]: {
        margin: "0 15px 0 15px !important",
      },
      "& select": {
        fontWeight: "600",
        background: "#fff",
        padding: 10,
        width: 100,
      },
    },
    selectorAll: {
      margin: 0,
      float: "right",
    },
  })
)

export function getDates(startDate, endDate) {
  let dates = []
  let curr = new Date(parseInt(startDate))
  let end = new Date(parseInt(endDate))
  while (curr.getTime() < end.getTime()) {
    let curMonth = (curr.getMonth() + 1).toString().padStart(2, "0")
    let curDate = curr.getDate().toString().padStart(2, "0")
    let day = curMonth + "-" + curDate + "-" + curr.getFullYear()
    dates.push(day)
    curr.setDate(curr.getDate() + 1)
  }
  return dates
}

export const getDateString = (date: Date) => {
  var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  var monthname = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return (
    weekday[date.getDay()] +
    " " +
    monthname[date.getMonth()] +
    ", " +
    date.getDate() +
    " " +
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  )
}

export const getDateVal = (dateVal) => {
  let date = dateVal.split("-")
  const newDate = new Date()
  newDate.setFullYear(date[2])
  newDate.setMonth(parseInt(date[0]) - 1)
  newDate.setDate(parseInt(date[1]))
  return newDate
}

export default function PreventDBT({ selectedEvents, ...props }) {
  const classes = useStyles()

  const { t } = useTranslation()
  const [emotionsData, setEmotionsData] = useState(null)
  const [effectiveData, setEffectiveData] = useState(null)
  const [ineffectiveData, setIneffectiveData] = useState(null)
  const [actionsData, setActionsData] = useState(null)
  const [selfcareData, setSelfcareData] = useState(null)
  const [dateArray, setDateArray] = useState([])
  const [emotionrange, setEmotionrange] = useState(null)
  const [effectiverange, setEffectiverange] = useState(null)
  const [inEffectiverange, setInEffectiverange] = useState(null)
  const [actionrange, setActionrange] = useState(null)
  const [summaryRange, setSummaryRange] = useState(null)
  const [storageData, setStorageData] = useState(null)
  const [calculated, setCalculated] = useState(false)
  const [dbtrange, setDBTrange] = useState(null)
  const [firstLoaded, setLoaded] = useState(false)

  useEffect(() => {
    let dateArray = []
    let weekend
    if (selectedEvents.length > 0) {
      selectedEvents = selectedEvents.sort((a, b) => {
        return a.timestamp - b.timestamp
      })
      let start = new Date(selectedEvents[selectedEvents.length - 1].timestamp)
      let i = 0
      while (start >= selectedEvents[0].timestamp) {
        weekend = new Date(start)
        let timestampFormat = setTimestamp(start)
        let dateFormat =
          weekend.getMonth() + 1 + "/" + weekend.getDate() + "-" + (start.getMonth() + 1) + "/" + start.getDate()
        start.setDate(start.getDate() - 7)

        i++
        dateArray.push({ timestamp: timestampFormat, date: dateFormat })
      }
      setDateArray(dateArray)
      setCalculated(true)
    }
    let ranges = localStorage.getItem("DBT" + selectedEvents[0].activity)
    if (ranges !== null && ranges != "null") {
      ranges = JSON.parse(ranges)
      setStorageData(ranges)
      setDBTrange(ranges["dbt"])
    } else {
      setDBTrange(setTimestamp(new Date(selectedEvents[selectedEvents.length - 1].timestamp)))
      setLoaded(true)
    }
  }, [selectedEvents])

  const setTimestamp = (start) => {
    let weekend = new Date(start)
    start.setHours(23)
    start.setMinutes(59)
    start.setSeconds(55)

    weekend.setDate(weekend.getDate() - 6)
    if (weekend.getTime() < selectedEvents[0].timestamp) {
      weekend = new Date(selectedEvents[0].timestamp)
    }
    weekend.setHours(0)
    weekend.setMinutes(0)
    weekend.setSeconds(0)
    let timestampFormat = start.getTime() + "-" + weekend.getTime()
    return timestampFormat
  }

  useEffect(() => {
    if (dbtrange !== null && !!firstLoaded && !!calculated) {
      setEffectiverange(dbtrange)
      setEmotionrange(dbtrange)
      setActionrange(dbtrange)
      setInEffectiverange(dbtrange)
      setSummaryRange(dbtrange)
      setStorageData({
        ...storageData,
        dbt: dbtrange,
        emotion: dbtrange,
        effective: dbtrange,
        action: dbtrange,
        inEffective: dbtrange,
        summary: dbtrange,
      })
    }
  }, [dbtrange])

  useEffect(() => {
    if (storageData !== null) {
      if (!!firstLoaded && !!calculated) {
        localStorage.setItem("DBT" + selectedEvents[0].activity, JSON.stringify(storageData))
      } else if (!firstLoaded) {
        setInEffectiverange(storageData.inEffective)
        setEmotionrange(storageData.emotion)
        setEffectiverange(storageData.effective)
        setActionrange(storageData.action)
        setSummaryRange(storageData.summary)
        setLoaded(true)
      }
    }
  }, [storageData])

  useEffect(() => {
    if (!!summaryRange) {
      let dData = []
      let summaryData = []
      setStorageData({ ...storageData, summary: summaryRange })
      let timeStamp = summaryRange.split("-")
      selectedEvents.map((event) => {
        if (event.timestamp <= parseInt(timeStamp[0]) && event.timestamp >= parseInt(timeStamp[1])) {
          event.temporal_slices.map((slice) => {
            if (!!slice.value) {
              if ((slice.type !== null && slice.level === "target_effective") || slice.level === "target_ineffective") {
                dData[slice.item] = dData[slice.item] ? dData[slice.item] + parseInt(slice.type) : parseInt(slice.type)
              }
            }
          })
          if (!!event.static_data?.urgeForSuicide || !!event.static_data?.urgeToQuitTheray) {
            dData["Urge to Die by suicide"] = dData["Urge to Die by suicide"]
              ? dData["Urge to Die by suicide"] + parseInt(event.static_data?.urgeForSuicide)
              : parseInt(event.static_data?.urgeForSuicide)
            dData["Urge to Quit Therapy"] = dData["Urge to Quit Therapy"]
              ? dData["Urge to Quit Therapy"] + parseInt(event.static_data?.urgeToQuitTheray)
              : parseInt(event.static_data?.urgeToQuitTheray)
          }
        }
      })
      if (Object.keys(dData).length === 0) {
        summaryData.push({ action: "", count: 0 })
      } else {
        Object.keys(dData).forEach(function (key) {
          summaryData.push({ action: key, count: dData[key] })
        })
      }
      let actionsD = JSON.parse(JSON.stringify(actions))
      actionsD.data.values = summaryData
      actionsD.title = t(actionsD.title)
      setActionsData(actionsD)
    }
  }, [summaryRange])

  useEffect(() => {
    if (!!emotionrange) {
      let emotionData = []
      setStorageData({ ...storageData, emotion: emotionrange })
      let timeStamp = emotionrange.split("-")
      selectedEvents.map((event) => {
        let date = new Date(event.timestamp)
        var curr_date = date.getDate()
        var curr_month = date.getMonth() + 1
        var curr_year = date.getFullYear()
        let dateString = curr_month + "-" + curr_date + "-" + curr_year

        event.temporal_slices.map((slice) => {
          if (!!slice.value) {
            switch (slice.level) {
              case "emotion":
                if (event.timestamp <= parseInt(timeStamp[0]) && event.timestamp >= parseInt(timeStamp[1]))
                  emotionData.push({ value: slice.value, date: getDateVal(dateString), symbol: slice.item })
                break
            }
          }
        })
      })
      let dates = getDates(timeStamp[1], timeStamp[0])
      dates.map((d) => {
        if (emotionData.length === 0) {
          if (emotionData.filter((eff) => eff.date === d).length === 0) {
            emotionData.push({ value: null, date: d, symbol: "None" })
          }
        }
      })
      let emotionsD = JSON.parse(JSON.stringify(emotions))
      emotionsD.data.values = emotionData
      emotionsD.title = t(emotionsD.title)
      setEmotionsData(emotionsD)
    }
  }, [emotionrange])

  useEffect(() => {
    if (!!effectiverange) {
      let effectivesData = []
      setStorageData({ ...storageData, effective: effectiverange })
      let timeStamp = effectiverange.split("-")
      selectedEvents.map((event) => {
        let date = new Date(event.timestamp)
        var curr_date = date.getDate()
        var curr_month = date.getMonth() + 1
        var curr_year = date.getFullYear()
        let dateString = curr_month + "-" + curr_date + "-" + curr_year
        event.temporal_slices.map((slice) => {
          if (!!slice.value) {
            switch (slice.level) {
              case "target_effective":
                if (event.timestamp <= parseInt(timeStamp[0]) && event.timestamp >= parseInt(timeStamp[1]))
                  effectivesData.push({ value: slice.value, date: getDateVal(dateString), symbol: slice.item })
                break
            }
          }
        })
      })
      let dates = getDates(timeStamp[1], timeStamp[0])
      dates.map((d) => {
        if (effectivesData.length === 0) {
          if (effectivesData.filter((eff) => eff.date === d).length === 0) {
            effectivesData.push({ value: null, date: d, symbol: "None" })
          }
        }
      })
      let effectiveD = JSON.parse(JSON.stringify(effective))
      effectiveD.data.values = effectivesData
      effectiveD.title = t(effectiveD.title)
      setEffectiveData(effectiveD)
    }
  }, [effectiverange])

  useEffect(() => {
    if (!!inEffectiverange) {
      let inEffectiveData = []
      setStorageData({ ...storageData, inEffective: inEffectiverange })
      let timeStamp = inEffectiverange.split("-")
      selectedEvents.map((event) => {
        let date = new Date(event.timestamp)
        var curr_date = date.getDate()
        var curr_month = date.getMonth() + 1
        var curr_year = date.getFullYear()
        let dateString = curr_month + "-" + curr_date + "-" + curr_year
        event.temporal_slices.map((slice) => {
          if (!!slice.value) {
            switch (slice.level) {
              case "target_ineffective":
                if (event.timestamp <= parseInt(timeStamp[0]) && event.timestamp >= parseInt(timeStamp[1]))
                  inEffectiveData.push({ value: slice.value, date: getDateVal(dateString), symbol: slice.item })
                break
            }
          }
        })
        if (event.timestamp <= parseInt(timeStamp[0]) && event.timestamp >= parseInt(timeStamp[1])) {
          if (!!event.static_data?.urgeForSuicide || !!event.static_data?.urgeToQuitTheray) {
            inEffectiveData.push({
              value: event.static_data.urgeForSuicide,
              date: getDateVal(dateString),
              symbol: t("Urge to Die by suicide"),
            })
            inEffectiveData.push({
              value: event.static_data.urgeToQuitTheray,
              date: getDateVal(dateString),
              symbol: t("Urge to Quit Therapy"),
            })
          }
        }
      })
      let dates = getDates(timeStamp[1], timeStamp[0])
      dates.map((d) => {
        if (inEffectiveData.length === 0) {
          if (inEffectiveData.filter((eff) => eff.date === d).length === 0) {
            inEffectiveData.push({ value: null, date: d, symbol: "None" })
          }
        }
      })
      let ineffectiveD = JSON.parse(JSON.stringify(ineffective))
      ineffectiveD.data.values = inEffectiveData
      ineffectiveD.title = t(ineffectiveD.title)
      setIneffectiveData(ineffectiveD)
    }
  }, [inEffectiverange])

  useEffect(() => {
    if (!!actionrange) {
      let timelineData = []
      let tData = []
      setStorageData({ ...storageData, action: actionrange })
      let timeStamp = actionrange.split("-")
      selectedEvents.map((event) => {
        let date = new Date(event.timestamp)
        var curr_date = date.getDate().toString().padStart(2, "0")
        var curr_month = (date.getMonth() + 1).toString().padStart(2, "0") //Months are zero based
        var curr_year = date.getFullYear()

        let dateString = curr_month + "-" + curr_date + "-" + curr_year
        event.temporal_slices.map((slice) => {
          if (slice.level === "target_effective" || slice.level === "target_ineffective") {
            if (
              slice.type !== null &&
              event.timestamp <= parseInt(timeStamp[0]) &&
              event.timestamp >= parseInt(timeStamp[1])
            ) {
              let typeTarget = slice.level === "target_effective" ? "Effective" : "Ineffective"
              tData[dateString + "~" + typeTarget] = tData[dateString + "~" + typeTarget]
                ? tData[dateString + "~" + typeTarget] + parseInt(slice.type)
                : parseInt(slice.type)
            }
          }
        })
      })
      if (Object.keys(tData).length === 0) {
        let date = new Date(parseInt(timeStamp[0]))
        var curr_date = date.getDate().toString().padStart(2, "0")
        var curr_month = (date.getMonth() + 1).toString().padStart(2, "0") //Months are zero based
        var curr_year = date.getFullYear()
        let dateString = curr_month + "-" + curr_date + "-" + curr_year
        timelineData.push({ date: getDateVal(dateString), count: 0, action: "" })
      } else {
        Object.keys(tData).forEach(function (key) {
          const keys = key.split("~")
          timelineData.push({ date: getDateVal(keys[0]), count: tData[key], action: keys[1] })
        })
      }
      let selfcareD = JSON.parse(JSON.stringify(selfcare))
      selfcareD.data.values = timelineData
      selfcareD.title = t(selfcareD.title)
      setSelfcareData(selfcareD)
    }
  }, [actionrange])

  return (
    <div className={classes.root}>
      {!!calculated ? (
        <Grid container spacing={0}>
          <Grid item xs={12} sm={3} />
          <Grid item xs={12} sm={6}>
            <Card className={classes.cardHeading}>
              <Typography variant="h6">{`${t("Select a date range: ")}`}</Typography>
              <NativeSelect
                className={classes.selectorAll}
                value={dbtrange}
                onChange={(event) => setDBTrange(event.target.value)}
              >
                {dateArray.map((dateString) => (
                  <option value={dateString.timestamp}>{dateString.date}</option>
                ))}
              </NativeSelect>
            </Card>
            <Divider />
            <div className={classes.graphContainer}>
              <NativeSelect
                className={classes.selector}
                value={emotionrange}
                onChange={(event) => setEmotionrange(event.target.value)}
              >
                {dateArray.map((dateString) => (
                  <option value={dateString.timestamp}>{dateString.date}</option>
                ))}
              </NativeSelect>
              {emotionsData !== null && <Vega spec={emotionsData} />}
              <div className={classes.separator} />
              <NativeSelect
                className={classes.selector}
                value={effectiverange}
                onChange={(event) => setEffectiverange(event.target.value)}
              >
                {dateArray.map((dateString) => (
                  <option value={dateString.timestamp}>{dateString.date}</option>
                ))}
              </NativeSelect>
              {effectiveData !== null && <Vega spec={effectiveData} />}
              <div className={classes.separator} />
              <NativeSelect
                className={classes.selector}
                value={inEffectiverange}
                onChange={(event) => setInEffectiverange(event.target.value)}
              >
                {dateArray.map((dateString) => (
                  <option value={dateString.timestamp}>{dateString.date}</option>
                ))}
              </NativeSelect>
              {ineffectiveData !== null && <Vega spec={ineffectiveData} />}
              <div className={classes.separator} />
              <NativeSelect
                className={classes.selector}
                value={summaryRange}
                onChange={(event) => setSummaryRange(event.target.value)}
              >
                {dateArray.map((dateString) => (
                  <option value={dateString.timestamp}>{dateString.date}</option>
                ))}
              </NativeSelect>
              {actionsData !== null && <Vega spec={actionsData} />}
              <div className={classes.separator} />
              <NativeSelect
                className={classes.selector}
                value={actionrange}
                onChange={(event) => setActionrange(event.target.value)}
              >
                {dateArray.map((dateString) => (
                  <option value={dateString.timestamp}>{dateString.date}</option>
                ))}
              </NativeSelect>
              {selfcareData !== null && <Vega spec={selfcareData} />}

              <PreventSkills
                selectedEvents={selectedEvents}
                setStorageData={setStorageData}
                storageData={storageData}
                dateArray={dateArray}
                dbtRange={dbtrange}
              />
              <PreventNoSkills
                selectedEvents={selectedEvents}
                setStorageData={setStorageData}
                storageData={storageData}
                dateArray={dateArray}
                dbtRange={dbtrange}
              />
              <PreventNotes
                selectedEvents={selectedEvents}
                setStorageData={setStorageData}
                storageData={storageData}
                dateArray={dateArray}
                dbtRange={dbtrange}
              />
            </div>
          </Grid>
        </Grid>
      ) : (
        <Backdrop className={classes.backdrop} open={!calculated}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </div>
  )
}
