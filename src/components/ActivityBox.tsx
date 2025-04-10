// Core Imports
import React, { useEffect, useState } from "react"
import { Typography, Grid, Icon, Card, Box, ButtonBase, makeStyles, Theme, createStyles } from "@material-ui/core"
import LAMP, { Participant as ParticipantObj, Activity as ActivityObj } from "lamp-core"
import { ReactComponent as BreatheIcon } from "../icons/Breathe.svg"
import { ReactComponent as JournalIcon } from "../icons/Goal.svg"
import InfoIcon from "../icons/Info.svg"
import ScratchCard from "../icons/ScratchCard.svg"
import { useTranslation } from "react-i18next"
import ActivityPopup from "./ActivityPopup"
import ReactMarkdown from "react-markdown"
import emoji from "remark-emoji"
import gfm from "remark-gfm"
import { LinkRenderer } from "./ActivityPopup"
import ActivityAccordian from "./ActivityAccordian"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cardlabel: {
      fontSize: 14,
      padding: "0 18px",
      bottom: 15,
      position: "absolute",
      width: "100%",
      height: "63px",
      overflow: "auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      [theme.breakpoints.down("sm")]: {
        fontSize: 13,
        padding: "0 5px",
        "& p": { marginBottom: "0", lineHeight: "16px" },
      },
      "& p": { margin: "0" },
    },
    scratch: {
      "& h2": {
        textAlign: "center !important",
      },
      "& h6": {
        textAlign: "center !important",
      },
    },
    dialogtitle: { padding: 0 },
    manage: {
      padding: "10px 0",
      minHeight: 180,
      textAlign: "center",
      boxShadow: "none",
      borderRadius: 18,
      position: "relative",
      width: "100%",
      "& svg": {
        [theme.breakpoints.up("lg")]: {
          width: 150,
          height: 150,
        },
      },

      [theme.breakpoints.up("lg")]: {
        minHeight: 240,
      },
    },
    mainIcons: {
      width: 80,
      height: 80,
      [theme.breakpoints.up("lg")]: {
        width: 130,
        height: 130,
      },
      [theme.breakpoints.down("sm")]: {
        width: 75,
        height: 75,
      },
    },
    thumbMain: { maxWidth: 255 },
    fullwidthBtn: { width: "100%" },
    blankMsg: {
      marginBottom: "15px",
      marginTop: "5px",
      "& path": { fill: "#666" },
      "& p": { margin: "2px 5px" },
    },
    assessH: {
      background: "#E7F8F2 !important",
    },
    learnH: {
      background: "#FFF9E5 !important",
    },
    manageH: {
      background: "#FFEFEC !important",
    },
    preventH: {
      background: "#ECF4FF !important",
    },
  })
)

export default function ActivityBox({ type, savedActivities, tag, participant, showStreak, ...props }) {
  const classes = useStyles()
  const [activity, setActivity] = useState(null)
  const [open, setOpen] = useState(false)
  const [questionCount, setQuestionCount] = React.useState(0)
  const [message, setMessage] = useState("")
  const [moduleData, setModuleData] = useState<any[]>([])
  const [shownActivities, setShownActivities] = useState([])
  const { t } = useTranslation()

  const handleClickOpen = (y: any) => {
    LAMP.Activity.view(y.id).then((data) => {
      if (y.spec === "lamp.module") {
        setShownActivities(shownActivities.filter((item) => item.id != y.id))
        const fromActivityList = true
        addActivityData(data, 0, fromActivityList)
      } else {
        setActivity(data)
        setOpen(true)
        y.spec === "lamp.dbt_diary_card"
          ? setQuestionCount(7)
          : y.spec === "lamp.survey"
          ? setQuestionCount(data.settings?.length ?? 0)
          : setQuestionCount(0)
      }
    })
  }

  const handleSubModule = async (activity, level) => {
    let arr = []
    LAMP.Activity.view(activity.id).then((data) => {
      addActivityData(data, level)
    })
  }

  const addActivityData = async (data, level, fromActivityList = false) => {
    // Recursive function to update nested subActivities
    const updateSubActivities = (subActivities, itemLevel) => {
      return subActivities.map((itm) => {
        if (itm.id === moduleAcivityData.id && level === itemLevel && !itm.subActivities) {
          return {
            ...itm,
            isHidden: true,
            subActivities: arr, // Add the fetched data here
            level: level + 1,
          }
        }
        // Recursively update if there are nested subActivities
        if (itm.subActivities && itm.subActivities.length > 0) {
          return {
            ...itm,
            subActivities: updateSubActivities(itm.subActivities, itm.level),
          }
        }
        return itm
      })
    }
    let arr = []
    let moduleAcivityData = { ...data }
    const ids = data?.settings?.activities
    // Fetching data asynchronously
    await Promise.all(
      ids.map(async (id) => {
        try {
          const fetchedData = await LAMP.Activity.view(id)
          delete fetchedData.settings // Clean up the data
          arr.push(fetchedData)
        } catch (error) {
          console.error("Error fetching data for id:", id, error)
        }
      })
    )

    delete moduleAcivityData.settings
    // Updating the moduleData
    if (moduleData.length > 0 && !fromActivityList) {
      const updatedData = moduleData.map((item) => {
        if (!item.subActivities && item.id === moduleAcivityData.id && item.level === level) {
          return {
            ...item,
            isHidden: true,
            level: level + 1,
            subActivities: arr,
          }
        }
        // Check and update subActivities recursively
        if (item.subActivities && item.subActivities.length > 0) {
          return {
            ...item,
            subActivities: updateSubActivities(item.subActivities, item.level),
          }
        }
        return item
      })
      setModuleData(updatedData)
    } else {
      moduleAcivityData.subActivities = arr
      moduleAcivityData.level = level + 1
      setModuleData([...moduleData, moduleAcivityData])
    }
  }

  useEffect(() => {
    setShownActivities(savedActivities)
  }, [savedActivities])

  useEffect(() => {
    setMessage("There are no " + type + " activities available.")
  }, [type])

  return (
    <Box>
      {moduleData.length ? (
        <ActivityAccordian
          data={moduleData.concat({ name: "Other activities", level: 1, subActivities: shownActivities })}
          type={type}
          tag={tag}
          handleClickOpen={handleClickOpen}
          handleSubModule={handleSubModule}
        />
      ) : (
        <Grid container spacing={2}>
          {savedActivities.length
            ? savedActivities.map((activity) => (
                <Grid
                  item
                  xs={6}
                  sm={4}
                  md={3}
                  lg={3}
                  onClick={() => {
                    handleClickOpen(activity)
                  }}
                  className={classes.thumbMain}
                >
                  <ButtonBase focusRipple className={classes.fullwidthBtn}>
                    <Card
                      className={
                        classes.manage +
                        " " +
                        (type === "Manage"
                          ? classes.manageH
                          : type === "Assess"
                          ? classes.assessH
                          : type === "Learn"
                          ? classes.learnH
                          : classes.preventH)
                      }
                    >
                      <Box mt={2} mb={1}>
                        <Box
                          className={classes.mainIcons}
                          style={{
                            margin: "auto",
                            background: tag.filter((x) => x.id === activity?.id)[0]?.photo
                              ? `url(${
                                  tag.filter((x) => x.id === activity?.id)[0]?.photo
                                }) center center/contain no-repeat`
                              : activity.spec === "lamp.breathe"
                              ? `url(${BreatheIcon}) center center/contain no-repeat`
                              : activity.spec === "lamp.journal"
                              ? `url(${JournalIcon}) center center/contain no-repeat`
                              : activity.spec === "lamp.scratch_image"
                              ? `url(${ScratchCard}) center center/contain no-repeat`
                              : `url(${InfoIcon}) center center/contain no-repeat`,
                          }}
                        ></Box>
                      </Box>
                      <Typography className={classes.cardlabel}>
                        <ReactMarkdown
                          children={t(activity.name)}
                          skipHtml={false}
                          remarkPlugins={[gfm, emoji]}
                          components={{ link: LinkRenderer }}
                        />
                      </Typography>
                    </Card>
                  </ButtonBase>
                </Grid>
              ))
            : type !== "Portal" && (
                <Box display="flex" className={classes.blankMsg} ml={1}>
                  <Icon>info</Icon>
                  <p>{`${t(message)}`}</p>
                </Box>
              )}
        </Grid>
      )}
      <ActivityPopup
        activity={activity}
        tag={tag}
        questionCount={questionCount}
        open={open}
        onClose={() => setOpen(false)}
        type={type}
        showStreak={showStreak}
        participant={participant}
      />
    </Box>
  )
}
