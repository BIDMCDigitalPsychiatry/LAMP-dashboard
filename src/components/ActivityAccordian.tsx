import React, { useEffect, useState } from "react"
import { Accordion, AccordionSummary, Grid } from "@mui/material"
import {
  Typography,
  Box,
  makeStyles,
  Theme,
  createStyles,
  CircularProgress,
  Fab,
  Tooltip,
  Icon,
} from "@material-ui/core"
import InfoIcon from "../icons/Info.svg"
import LAMP from "lamp-core"
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    favstar: {
      position: "absolute",
      top: 24,
      left: 24,
      zIndex: 1,
      color: "#f9d801",
    },
    accordionHeadIcons: {
      [theme.breakpoints.up("lg")]: {
        width: 80,
        height: 80,
      },
      [theme.breakpoints.down("sm")]: {
        width: 75,
        height: 75,
      },
      [theme.breakpoints.down("xs")]: {
        width: 65,
        height: 65,
      },
    },

    accordionMain: {
      boxShadow: "none !important",
      background: "#f8f8f8 !important",
      borderRadius: "18px !important",
      marginBottom: 16,
      padding: 8,
      [theme.breakpoints.down("xs")]: {
        borderRadius: "12px !important",
        marginBottom: 8,
      },
      "& h6": {
        fontSize: 17,
        [theme.breakpoints.down("xs")]: {
          fontSize: 15,
          fontWeight: 500,
        },
      },
      "&::before": {
        display: "none",
      },
      "& .MuiAccordionSummary-root": {
        padding: "0 8px",
        "& .MuiAccordionSummary-expandIconWrapper": {
          "& svg": {
            fontSize: "2rem",
            [theme.breakpoints.down("xs")]: {
              fontSize: "1.5rem",
            },
          },
        },
      },
      "& .MuiAccordionSummary-content": {
        display: "block",
        margin: "8px 0",
        [theme.breakpoints.down("xs")]: {
          paddingLeft: 0,
        },
      },
      "&.Mui-expanded": {
        // background: "#fff !important",
        // boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.20) !important",
        marginTop: "0 !important",
      },
    },

    headerTitleIcon: {
      background: "none",
      boxShadow: "none",
      width: 34,
      height: 34,
      color: "#666",
      marginLeft: 8,
      [theme.breakpoints.down("xs")]: {
        width: 22,
        height: 22,
        minHeight: 22,
      },
      "& .material-icons": {
        fontSize: "1.7rem",
        [theme.breakpoints.down("xs")]: {
          fontSize: "1.3rem",
        },
      },
      "&:hover": {
        background: "#fff",
      },
      "&.active": {
        color: "#e3b303",
      },
    },
    progressCircle: {
      width: "18px !important",
      height: "18px !important",
      marginRight: "8px",
      [theme.breakpoints.down("xs")]: {
        width: "16px !important",
        height: "16px !important",
      },
      "&::after": {
        content: "''",
        position: "absolute",
        width: 18,
        height: 18,
        left: 0,
        top: 0,
        zIndex: -1,
        borderRadius: "50%",
        border: "4px solid #ccc",
        [theme.breakpoints.down("xs")]: {
          width: 16,
          height: 16,
          border: "3px solid #ccc",
        },
      },
    },
    progressDetails: {
      "& p": {
        fontSize: 15,
        [theme.breakpoints.down("xs")]: {
          fontSize: "14px",
        },
      },
    },
    arrowForword: {
      background: "#fff",
      boxShadow: "none",
      width: 48,
      height: 48,
      color: "#7599FF",
      [theme.breakpoints.down("sm")]: {
        width: 40,
        height: 40,
      },
      "& .material-icons": {
        [theme.breakpoints.down("sm")]: {
          fontSize: "1.2rem",
        },
      },
    },
  })
)

const moduleAccordianContent = (module, classes, tag, favoriteIds, handleFavoriteClick, handleSubModule) => {
  // Function to get the status of the module
  const getStatus = (module) => {
    return module.name === "Other activities"
      ? ""
      : module.subActivities?.filter((activity) => activity.isCompleted === true).length +
          "/" +
          module.subActivities.length
  }
  // Function to calculate the percentage of completed sub-activities
  const getPercentage = (module) => {
    return (
      (module.subActivities?.filter((activity) => activity.isCompleted === true).length / module.subActivities.length) *
      100
    )
  }

  return (
    <Typography variant="h6">
      <Grid container spacing={0}>
        <Grid lg="auto" item>
          <Box
            className={classes.accordionHeadIcons}
            style={{
              margin: "auto",
              background: tag.filter((x) => x.id === module?.id)[0]?.photo
                ? `url(${tag.filter((x) => x.id === module?.id)[0]?.photo}) center center/contain no-repeat`
                : `url(${InfoIcon}) center center/contain no-repeat`,
            }}
          ></Box>
        </Grid>

        <Grid item xs display="flex" alignItems="center" spacing={0}>
          <Box>
            <Box display="flex" alignItems="center">
              <Typography variant="h6">{module.name}</Typography>
              {module.name !== "Other activities" && module.name !== "Unstarted modules" && (
                <Tooltip
                  title={
                    favoriteIds.includes(module.id)
                      ? "Tap to remove from Favorite Activities"
                      : "Tap to add to Favorite Activities"
                  }
                >
                  <Fab
                    className={`${classes.headerTitleIcon} ${favoriteIds.includes(module.id) ? "active" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleFavoriteClick(module.id)
                    }}
                  >
                    <Icon>star_rounded</Icon>
                  </Fab>
                </Tooltip>
              )}
            </Box>
            {module.name !== "Other activities" && module.name !== "Unstarted modules" && module?.trackProgress && (
              <Grid display="flex" alignItems="center" className={classes.progressDetails}>
                <CircularProgress
                  variant="determinate"
                  thickness={8}
                  className={classes.progressCircle}
                  value={getPercentage(module)}
                />
                <Typography variant="body1">
                  {
                    <span>
                      <span>{getStatus(module)}</span> Sections Complete
                    </span>
                  }
                </Typography>
              </Grid>
            )}
          </Box>
        </Grid>
        <Grid display="flex" alignItems="center" pr={1}>
          <Fab className={classes.arrowForword} onClick={() => handleSubModule(module)}>
            <Icon>arrow_forward_ios</Icon>
          </Fab>
        </Grid>
      </Grid>
    </Typography>
  )
}

//function to create collapsible layout when module activity is selected
const ActivityAccordion = ({
  data,
  type,
  tag,
  handleSubModule,
  participant,
  setFavorites,
  moduleInLocalStorage,
  setModuleInLocalStorage,
}) => {
  const classes = useStyles()
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  useEffect(() => {
    if (!!moduleInLocalStorage) {
      const moduleData = data.find((mod) => mod.id === moduleInLocalStorage)
      if (moduleData) {
        handleSubModule(moduleData)
      }
      setTimeout(() => setModuleInLocalStorage(null), 500)
    }
  }, [moduleInLocalStorage])

  useEffect(() => {
    ;(async () => {
      let tag =
        [await LAMP.Type.getAttachment(participant?.id, "lamp.dashboard.favorite_activities")].map((y: any) =>
          !!y.error ? undefined : y.data
        )[0] ?? []
      setFavoriteIds(tag)
    })()
  }, [])

  const handleFavoriteClick = async (activityId: string) => {
    try {
      const result: any = await LAMP.Type.getAttachment(participant?.id, "lamp.dashboard.favorite_activities")
      let tag: string[] = !!result.error ? [] : result.data ?? []
      const isCurrentlyFavorite = tag.includes(activityId)
      let updatedTag
      if (isCurrentlyFavorite) {
        updatedTag = tag.filter((id) => id !== activityId)
      } else {
        updatedTag = [...tag, activityId]
      }
      await LAMP.Type.setAttachment(participant?.id, "me", "lamp.dashboard.favorite_activities", updatedTag)
      setFavoriteIds(updatedTag)
      setFavorites(updatedTag)
    } catch (error) {
      console.error("Failed to toggle favorite:", error)
    }
  }
  return (
    <div>
      {data.map((module, index) => (
        <>
          <Accordion
            expanded={false}
            onChange={(event, expanded) => {
              event.stopPropagation()
              handleSubModule(module)
            }}
            key={index}
            className={classes.accordionMain}
          >
            {type != "activity" ? (
              <AccordionSummary id={module.id}>
                {moduleAccordianContent(module, classes, tag, favoriteIds, handleFavoriteClick, handleSubModule)}
              </AccordionSummary>
            ) : (
              moduleAccordianContent(module, classes, tag, favoriteIds, handleFavoriteClick, handleSubModule)
            )}
          </Accordion>
        </>
      ))}
    </div>
  )
}

export default ActivityAccordion
