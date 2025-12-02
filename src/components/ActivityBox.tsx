// Core Imports
import React, { useEffect, useRef, useState } from "react"
import {
  Typography,
  Grid,
  Icon,
  Card,
  Box,
  ButtonBase,
  makeStyles,
  Theme,
  createStyles,
  Tab,
  Backdrop,
  CircularProgress,
} from "@material-ui/core"
import LAMP, { Participant as ParticipantObj, Activity as ActivityObj } from "lamp-core"
import BreatheIcon from "../icons/Breathe.svg"
import JournalIcon from "../icons/Goal.svg"
import InfoIcon from "../icons/Info.svg"
import ScratchCard from "../icons/ScratchCard.svg"
import { useTranslation } from "react-i18next"
import ActivityPopup from "./ActivityPopup"
import ReactMarkdown from "react-markdown"
import emoji from "remark-emoji"
import gfm from "remark-gfm"
import { LinkRenderer } from "./ActivityPopup"
import { getSelfHelpActivityEvents } from "./Participant"

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
    thumbMain: {
      maxWidth: 255,
      position: "relative",
    },
    favstar: {
      position: "absolute",
      top: 24,
      left: 24,
      zIndex: 1,
      color: "#f9d801",
    },
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
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
    tabPanelMain: {
      paddingLeft: 0,
      paddingRight: 0,
    },
    tabHeader: {
      "& button": {
        fontSize: 15,
        fontWeight: 600,
        minWidth: "auto",
        padding: 0,
        margin: "0 30px",
        "&:first-child": {
          marginLeft: 0,
        },
        "&.Mui-selected": {
          color: "#7599FF",
        },
        [theme.breakpoints.down("xs")]: {
          fontSize: 14,
          margin: "0 12px",
        },
      },
      "& .MuiTabs-indicator": {
        backgroundColor: "#7599FF",
      },
    },
  })
)

export const getActivityEvents = async (participant: any, activityId, moduleStartTime?) => {
  let from: Date
  if (moduleStartTime) {
    from = new Date(moduleStartTime)
  } else {
    from = new Date()
    from.setMonth(from.getMonth() - 6)
  }
  let activityEvents =
    LAMP.Auth._auth.id === "selfHelp@demo.lamp.digital"
      ? await getSelfHelpActivityEvents(activityId, from.getTime(), new Date().getTime())
      : await LAMP.ActivityEvent.allByParticipant(
          participant?.id ?? participant,
          activityId,
          from?.getTime(),
          new Date().getTime(),
          null,
          true
        )
  return activityEvents
}

export const sortModulesByCompletion = (modules) => {
  if (!Array.isArray(modules)) return []
  return modules
    ?.map((module) => {
      const processedSubActivities = Array.isArray(module?.subActivities)
        ? sortModulesByCompletion(module?.subActivities)
        : []
      return {
        ...module,
        subActivities: module?.sequentialOrdering
          ? module?.subActivities // keep original order if sequentialOrdering is true
          : processedSubActivities?.sort((a, b) => (a.isCompleted ? 1 : 0) - (b.isCompleted ? 1 : 0)),
      }
    })
    ?.sort((a, b) => (a.isCompleted ? 1 : 0) - (b.isCompleted ? 1 : 0))
}

const checkIsBegin = async (module, participant) => {
  const activityEvents = await getActivityEvents(participant, module.id, module.startTime)
  return activityEvents?.length === 0
}

export const addActivityEventForModule = async (module, participant) => {
  if ((await checkIsBegin(module, participant)) === true) {
    LAMP.ActivityEvent.create(participant.id ?? participant, {
      timestamp: new Date().getTime(),
      duration: 0,
      activity: module.id,
      static_data: {},
    }).then((a) => {
      return new Date()
    })
  }
}

export default function ActivityBox({ type, savedActivities, tag, participant, showStreak, ...props }) {
  const classes = useStyles()
  const [activity, setActivity] = useState(null)
  const [open, setOpen] = useState(false)
  const [questionCount, setQuestionCount] = React.useState(0)
  const [message, setMessage] = useState("")
  const [activitiesList, setActivityList] = useState<any>({})
  const [loadingModules, setLoadingModules] = useState(true)

  const { t } = useTranslation()

  const handleClickOpen = (y: any, isAuto = false) => {
    LAMP.Activity.view(y.id).then(async (data) => {
      setActivity(data)
      setOpen(true)
      y.spec === "lamp.dbt_diary_card"
        ? setQuestionCount(7)
        : y.spec === "lamp.survey"
        ? setQuestionCount(data.settings?.length ?? 0)
        : setQuestionCount(0)
    })
  }

  useEffect(() => {
    if (!participant?.id) return
    const fetchData = async () => {
      try {
        const batchSize = 50
        const tab = String(type || "").toLowerCase()

        const firstBatchResponse: any = await (LAMP.Activity.listActivities as any)(
          participant.id,
          tab,
          null,
          batchSize,
          0
        )
        if (!firstBatchResponse || !firstBatchResponse.data) {
          setLoadingModules(false)
          return
        }
        // Extract data and total from response
        let firstBatchData: any = firstBatchResponse.data ?? {}
        let total = firstBatchResponse.total || 0
        setLoadingModules(false)
        setActivityList(firstBatchData)
        const totalBatches = Math.ceil(total / batchSize)
        // If there's only one batch, we're done
        if (totalBatches <= 1) {
          return
        }
        // Create array of promises for remaining batches (batch 2 onwards)
        const remainingBatches = Array.from({ length: totalBatches - 1 }, (_, i) => {
          const offset = (i + 1) * batchSize
          return (LAMP.Activity.listActivities as any)(participant.id, tab, null, batchSize, offset)
        })
        const remainingResults: any[] = await Promise.all(remainingBatches)
        const mergedData = remainingResults?.reduce((acc: any, result: any) => {
          if (!result || !result.data) return acc
          const data = result.data
          return {
            otherActivities: [...(acc.otherActivities || []), ...(data.otherActivities || [])],
          }
        }, firstBatchData)
        // Remove duplicates from each array based on activity id
        const removeDuplicates = (activities: any[]): any[] => {
          if (!Array.isArray(activities)) return []
          const uniqueMap = new Map<string, any>()
          activities.forEach((activity: any) => {
            if (activity && activity.id) {
              // Keep the first occurrence of each activity
              if (!uniqueMap.has(activity.id)) {
                uniqueMap.set(activity.id, activity)
              }
            }
          })
          return Array.from(uniqueMap.values())
        }

        const deduplicatedData = {
          otherActivities: removeDuplicates(mergedData.otherActivities || []),
        }
        setActivityList(deduplicatedData)
      } catch (err) {
        setLoadingModules(false)
        console.log("Error fetching activities:", err)
      } finally {
        setLoadingModules(false)
      }
    }
    if (LAMP.Auth?._auth?.serverAddress !== "demo.lamp.digital") {
      fetchData()
    }
  }, [participant?.id, type, savedActivities])

  useEffect(() => {
    localStorage.removeItem("enabledActivities")
    localStorage.removeItem("parentStringForSurvey")
    for (let i = localStorage?.length - 1; i >= 0; i--) {
      const key = localStorage.key(i)
      if (key.startsWith("activity-survey-")) {
        localStorage.removeItem(key)
      }
    }
    if (LAMP.Auth?._auth?.serverAddress == "demo.lamp.digital") {
      const dataForSelfHelp = {
        otherActivities: Array.from(savedActivities || [])?.filter((activity: any) => activity?.spec !== "lamp.module"),
      }

      setActivityList(dataForSelfHelp)

      setLoadingModules(false)
    }
  }, [savedActivities])

  useEffect(() => {
    setMessage("There are no " + type + " activities available.")
  }, [type])

  return (
    <Box>
      <Grid container spacing={2}>
        {loadingModules ? (
          <Backdrop className={classes.backdrop} open={loadingModules}>
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : activitiesList?.otherActivities?.length ? (
          activitiesList?.otherActivities?.map((activity) => (
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
                        background: tag?.filter((x) => x.id === activity?.id)[0]?.photo
                          ? `url(${
                              tag?.filter((x) => x.id === activity?.id)[0]?.photo
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
        ) : (
          type !== "Portal" && (
            <Box display="flex" className={classes.blankMsg} ml={1}>
              <Icon>info</Icon>
              <p>{`${t(message)}`}</p>
            </Box>
          )
        )}
      </Grid>
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
