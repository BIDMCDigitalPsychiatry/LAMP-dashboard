import React, { useEffect, useState } from "react"
import Box from "@material-ui/core/Box"
import Typography from "@material-ui/core/Typography"
import makeStyles from "@material-ui/core/styles/makeStyles"
import createStyles from "@material-ui/core/styles/createStyles"
import { Theme } from "@material-ui/core/styles/createTheme"
import NativeSelect from "@material-ui/core/NativeSelect"
import { useTranslation } from "react-i18next"
import { getDateString } from "./PreventDBT"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
    separator: {
      border: "2px solid rgba(0, 0, 0, 0.1)",
      width: "100%",
      marginTop: 50,
      marginBottom: 50,
      height: 0,
      maxWidth: 500,
    },
    rangeButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 80,
      height: 32,
      borderRadius: 16,
      border: "1px solid #C6C6C6",
    },
    fullWidth: {
      width: "100%",
      marginTop: "30px",
      marginBottom: "30px",
      maxWidth: 540,
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
    heading: {
      fontSize: 17,
      fontWeight: 600,
    },
    selector: {
      display: "fixed",
      marginBottom: -30,
      zIndex: 1000,
      [theme.breakpoints.down("xs")]: {
        marginBottom: -25,
      },
    },
    skillsContainer: {
      width: "100%",
      maxWidth: 500,
      "& h5": {
        fontWeight: 600,
      },
    },
  })
)

export default function PreventNoSkills({
  selectedEvents,
  dateArray,
  dbtRange,
  setStorageData,
  storageData,
  ...props
}) {
  const classes = useStyles()
  const { t } = useTranslation()
  const [reasonsRange, setReasonsRange] = useState(storageData?.reasons ?? dateArray[0]?.timestamp ?? null)
  const [reasons, setReasons] = useState(null)

  useEffect(() => {
    if (!!reasonsRange) {
      setStorageData({ ...storageData, reasons: reasonsRange })
      let timeStamp = reasonsRange.split("-")
      let reasonData = []
      selectedEvents.map((event) => {
        if (
          event.static_data.reason?.trim().length > 0 &&
          event.timestamp <= parseInt(timeStamp[0]) &&
          event.timestamp >= parseInt(timeStamp[1])
        ) {
          reasonData.push({ reason: event.static_data.reason, date: getDateString(new Date(event.timestamp)) })
        }
      })
      setReasons(reasonData)
    }
  }, [reasonsRange])

  useEffect(() => {
    setReasonsRange(dbtRange)
  }, [dbtRange])

  useEffect(() => {
    setReasonsRange(storageData?.reasons ?? dateArray[0]?.timestamp ?? null)
  }, [storageData])

  return (
    <Box display="flex" justifyContent="center" width={1} className={classes.graphContainer}>
      <div className={classes.separator} />
      <div style={{ width: "100%" }} className={classes.skillsContainer}>
        <Box sx={{ display: "flex" }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5">{`${t("Didn't use skills because...")}`}</Typography>
          </Box>
          <Box>
            <Typography variant="h5"></Typography>

            <NativeSelect
              className={classes.selector}
              value={reasonsRange}
              onChange={(event) => {
                setReasonsRange(event.target.value)
              }}
            >
              {dateArray.map((dateString) => (
                <option value={dateString.timestamp}>{dateString.date}</option>
              ))}
            </NativeSelect>
          </Box>
        </Box>
      </div>
      {!!reasons && (reasons || []).length > 0 ? (
        <Box className={classes.fullWidth}>
          {(reasons || []).map(
            (data) =>
              !!data.reason && (
                <Box className={classes.blueBoxStyle}>
                  <Typography variant="caption" gutterBottom>
                    {data.date}
                  </Typography>
                  <Typography variant="body2" component="p">
                    {data.reason}
                  </Typography>
                </Box>
              )
          )}
        </Box>
      ) : (
        <Box className={classes.fullWidth}>
          <Typography variant="subtitle1">{`${t("No data found")}`}</Typography>
        </Box>
      )}
    </Box>
  )
}
