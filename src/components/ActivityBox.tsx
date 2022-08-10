// Core Imports
import React, { useState } from "react"
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
  const { t } = useTranslation()

  const handleClickOpen = (y: any) => {
    LAMP.Activity.view(y.id).then((data) => {
      setActivity(data)
      setOpen(true)
      y.spec === "lamp.dbt_diary_card"
        ? setQuestionCount(7)
        : y.spec === "lamp.survey"
        ? setQuestionCount(data.settings?.length ?? 0)
        : setQuestionCount(0)
    })
  }

  return (
    <Box>
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
                <p>{`${t("There are no " + type + " activities available.")}`}</p>
              </Box>
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
