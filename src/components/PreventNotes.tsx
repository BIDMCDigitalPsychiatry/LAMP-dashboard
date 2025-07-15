import React, { useEffect, useState } from "react"
import Box from "@material-ui/core/Box"
import Typography from "@material-ui/core/Typography"
import NativeSelect from "@material-ui/core/NativeSelect"
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles"
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

export default function PreventNotes({ selectedEvents, dateArray, dbtRange, setStorageData, storageData, ...props }) {
  const classes = useStyles()
  const { t } = useTranslation()
  const [notesRange, setNotesRange] = useState(storageData?.notes ?? dateArray[0]?.timestamp ?? null)
  const [notes, setNotes] = useState(null)

  useEffect(() => {
    if (!!notesRange) {
      setStorageData({ ...storageData, notes: notesRange })
      let timeStamp = notesRange.split("-")
      let notesData = []
      selectedEvents.map((event) => {
        if (
          event.static_data.notes?.trim().length > 0 &&
          event.timestamp <= parseInt(timeStamp[0]) &&
          event.timestamp >= parseInt(timeStamp[1])
        ) {
          notesData.push({ note: event.static_data.notes, date: getDateString(new Date(event.timestamp)) })
        }
      })
      setNotes(notesData)
    }
  }, [notesRange])

  useEffect(() => {
    setNotesRange(dbtRange)
  }, [dbtRange])

  useEffect(() => {
    setNotesRange(storageData?.notes ?? dateArray[0]?.timestamp ?? null)
  }, [storageData])

  return (
    <Box display="flex" justifyContent="center" width={1} className={classes.graphContainer}>
      <div className={classes.separator} />
      <div style={{ width: "100%" }} className={classes.skillsContainer}>
        <Box sx={{ display: "flex" }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5">{`${t("Optional notes:")}`}</Typography>
          </Box>
          <Box>
            <Typography variant="h5"></Typography>
            <NativeSelect
              className={classes.selector}
              value={notesRange}
              onChange={(event) => {
                setNotesRange(event.target.value)
              }}
            >
              {dateArray.map((dateString) => (
                <option value={dateString.timestamp}>{dateString.date}</option>
              ))}
            </NativeSelect>
          </Box>
        </Box>
      </div>
      {(notes || []).length > 0 ? (
        <Box className={classes.fullWidth}>
          {(notes || []).map(
            (data) =>
              !!data.note && (
                <Box className={classes.blueBoxStyle}>
                  <Typography variant="caption" gutterBottom>
                    {data.date}
                  </Typography>
                  <Typography variant="body2" component="p">
                    {data.note}
                  </Typography>
                </Box>
              )
          )}
        </Box>
      ) : (
        <Box className={classes.fullWidth}>
          <Typography variant="subtitle1">{`${t("No notes added")}`}</Typography>
        </Box>
      )}
    </Box>
  )
}
