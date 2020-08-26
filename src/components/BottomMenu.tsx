import React, { useState, useEffect } from "react"
import { makeStyles, Theme, createStyles, withStyles } from "@material-ui/core/styles"
import {
  Box,
  useMediaQuery,
  useTheme,
  Drawer,
  BottomNavigationAction,
  IconButton,
  Typography,
  Link,
  ClickAwayListener,
} from "@material-ui/core"
import { ReactComponent as Feed } from "../icons/Feed.svg"
import { ReactComponent as Learn } from "../icons/Learn.svg"
import { ReactComponent as Assess } from "../icons/Assess.svg"
import { ReactComponent as Manage } from "../icons/Manage.svg"
import { ReactComponent as PreventIcon } from "../icons/Prevent.svg"
import { ReactComponent as Logo } from "../icons/Logo.svg"
import CloseIcon from "@material-ui/icons/Close"
import Tooltip from "@material-ui/core/Tooltip"
import { renderToStaticMarkup } from "react-dom/server"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    navigation: {
      "& svg": { width: 36, height: 36, padding: 6, borderRadius: "50%", opacity: 0.5 },
      [theme.breakpoints.up("md")]: {
        flex: "none",
        minHeight: 125,
      },
      width: "100%",
      minWidth: 75,
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: "rgba(255, 255, 255, 0.75)",
    },
    navigationFeedSelected: {
      "& div": {
        transform: "rotate(45deg)",
        backgroundImage:
          "linear-gradient(45deg, #FFD645, #FFD645 100%), linear-gradient(135deg, #65DEB4, #65DEB4), linear-gradient(225deg, #FE8470, #FE8470) , linear-gradient(225deg, #7DB2FF, #7DB2FF)",
        backgroundSize: "50% 50%",
        backgroundPosition: "0% 0%, 0% 100%, 100% 0%, 100% 100%",
        backgroundRepeat: "no-repeat",
        borderRadius: "50%",
        opacity: "1",
        width: 36,
        height: 36,
        "& svg": { opacity: 1 },
      },
      "& svg": {
        transform: "rotate(-45deg)",
      },
      "& span": { color: "black" },
      width: "100%",
    },
    navigationLearnSelected: {
      "& svg": {
        background: "#FFD645 !important",
        opacity: 1,
      },
      "& span": { color: "black" },
      width: "100%",
    },
    navigationManageSelected: {
      "& svg": {
        background: "#FE8470 !important",
        opacity: 1,
      },
      "& span": { color: "black" },
      width: "100%",
    },
    navigationAssessSelected: {
      "& svg": {
        background: "#65D2AA !important",
        opacity: 1,
      },
      "& span": { color: "black" },
      width: "100%",
    },
    navigationPreventSelected: {
      "& svg": {
        background: "#7DB2FF !important",
        opacity: 1,
      },
      "& span": { color: "black" },
      width: "100%",
    },
    navigationLabel: {
      textTransform: "capitalize",
      fontSize: "12px !important",

      letterSpacing: 0,
      color: "rgba(0, 0, 0, 0.4)",
      width: "100%",
    },
    leftbar: {
      "& div": {
        [theme.breakpoints.up("md")]: {
          backgroundColor: "#F8F8F8",
          border: 0,
        },

        "& a": {
          [theme.breakpoints.down("sm")]: {
            flex: 1,
          },
        },
      },
    },
    leftbarLogo: {
      textAlign: "center",
      paddingTop: 0,
      "&:hover": { backgroundColor: "transparent !important" },
      "& svg": {
        maxWidth: 30,
      },
      [theme.breakpoints.down("sm")]: {
        display: "none",
      },
      width: "100%",
    },
    paper: {
      padding: "25px 20px",
      boxShadow: "none",
      background: "rgba(228, 103, 89, 0.95)",
      borderRadius: 10,
      "& h6": { color: "white", fontWeight: 300, fontSize: 16, "& span": { fontWeight: 500 } },
      "& p": { color: "white", fontWeight: 300, marginTop: 10 },
    },
  })
)

const ManageTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    zIndex: 999,
    padding: "25px 20px",
    boxShadow: "none",
    background: "rgba(228, 103, 89, 0.95)",
    borderRadius: 10,
    maxWidth: 345,
    right: 10,
    "& h6": { color: "white", fontWeight: 300, fontSize: 16, "& span": { fontWeight: 500 } },
    "& p": { color: "white", fontWeight: 300, marginTop: 10 },
    [theme.breakpoints.up("md")]: {
      right: 0,
    },
  },
  arrow: {
    color: "#E56F61",
    fontSize: 15,
    [theme.breakpoints.down("sm")]: {
      marginLeft: "5px !important",
    },
    [theme.breakpoints.down("xs")]: {
      marginLeft: "19px !important",
    },
  },
}))(Tooltip)

const LearnTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    zIndex: 999,
    padding: "25px 20px",
    boxShadow: "none",
    background: "rgba(255, 214, 69, 0.95)",
    borderRadius: 10,
    maxWidth: 345,
    minWidth: 345,
    right: -10,
    "& h6": { color: "#6f5c1b", fontWeight: 300, fontSize: 16, "& span": { fontWeight: 500 } },
    "& p": { color: "#6f5c1b", fontWeight: 300, marginTop: 10 },
    "& svg": { color: "#6f5c1b" },
    [theme.breakpoints.up("md")]: {
      right: 0,
    },
  },
  arrow: {
    color: "rgba(255, 214, 69, 0.95)",
    fontSize: 15,
    [theme.breakpoints.down("sm")]: {
      marginLeft: "-35px !important",
    },
    [theme.breakpoints.down("xs")]: {
      marginLeft: "-10px !important",
    },
  },
}))(Tooltip)

const AssesTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    zIndex: 999,
    padding: "25px 20px",
    boxShadow: "none",
    background: "rgba(101, 210, 170, 0.95)",
    borderRadius: 10,
    maxWidth: 345,
    right: -10,
    "& h6": { color: "white", fontWeight: 300, fontSize: 16, "& span": { fontWeight: 500 } },
    "& p": { color: "white", fontWeight: 300, marginTop: 10 },
    "& svg": { color: "white" },
    [theme.breakpoints.up("md")]: {
      right: 0,
    },
  },
  arrow: {
    color: "rgba(101, 210, 170, 0.95)",
    fontSize: 15,
    [theme.breakpoints.down("sm")]: {
      marginLeft: "-35px !important",
    },
    [theme.breakpoints.down("xs")]: {
      marginLeft: "-10px !important",
    },
  },
}))(Tooltip)

const PreventTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    zIndex: 999,
    padding: "25px 20px",
    boxShadow: "none",
    background: "rgba(125, 178, 255, 0.95)",
    borderRadius: 10,
    maxWidth: 345,
    right: 10,
    "& h6": { color: "white", fontWeight: 300, fontSize: 16, "& span": { fontWeight: 500 } },
    "& p": { color: "white", fontWeight: 300, marginTop: 10 },
    "& svg": { color: "white" },
    [theme.breakpoints.up("md")]: {
      right: 0,
    },
  },
  arrow: {
    color: "rgba(125, 178, 255, 0.95)",
    fontSize: 15,
    [theme.breakpoints.down("sm")]: {
      marginLeft: "0px !important",
    },
    [theme.breakpoints.down("xs")]: {
      marginLeft: "19px !important",
    },
  },
}))(Tooltip)

const FeedTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    zIndex: 999,
    padding: "25px 20px",
    boxShadow: "none",
    background: "rgba(117, 152, 255, 0.95)",
    borderRadius: 10,
    maxWidth: 345,
    minWidth: 345,

    "& h6": { color: "white", fontWeight: 300, fontSize: 16, "& span": { fontWeight: 500 } },
    "& p": { color: "white", fontWeight: 300, marginTop: 10 },
    "& svg": { color: "white" },
    [theme.breakpoints.up("md")]: {
      right: 0,
    },
  },
  arrow: {
    color: "rgba(117, 152, 255, 0.95)",
    fontSize: 15,
    [theme.breakpoints.down("sm")]: {
      marginLeft: "0px !important",
    },
    [theme.breakpoints.down("xs")]: {
      marginLeft: "19px !important",
    },
  },
}))(Tooltip)

export default function BottomMenu({ ...props }) {
  const classes = useStyles()
  const supportsSidebar = useMediaQuery(useTheme().breakpoints.up("md"))
  const [tabVal, _setTab] = useState(props.tabValue)
  const [viewedTabs, setViewedTabs] = useState([1])

  const [openTabs, setOpenTabs] = useState([
    props.tabValue === 0 ? true : false,
    props.tabValue === 1 ? true : false,
    props.tabValue === 2 ? true : false,
    props.tabValue === 3 ? true : false,
    props.tabValue === 4 ? true : false,
  ])

  const setTab = (newTab) => {
    _setTab(newTab)
    //setOpenTabs({ ...openTabs, [newTab]: true, [tabVal]: newTab === tabVal ? true : false })
    props.setShowDemoMessage(false)
    if (viewedTabs.length == 0) setOpenTabs({ ...openTabs, [newTab]: true, [tabVal]: newTab === tabVal ? true : false })
    if (!viewedTabs.includes(newTab)) {
      setViewedTabs(viewedTabs.concat(newTab))
      setOpenTabs({ ...openTabs, [newTab]: true, [tabVal]: newTab === tabVal ? true : false })
    }
    props.activeTab(newTab)
  }

  return (
    <div>
      <Box clone displayPrint="none">
        <Drawer
          open
          className={classes.leftbar}
          anchor={supportsSidebar ? "left" : "bottom"}
          variant="permanent"
          PaperProps={{
            style: {
              flexDirection: supportsSidebar ? "column" : "row",
              justifyContent: !supportsSidebar ? "center" : undefined,
              alignItems: "center",
              height: !supportsSidebar ? 80 : undefined,
              width: supportsSidebar ? 100 : undefined,
              transition: "all 500ms ease-in-out",
            },
          }}
        >
          <ClickAwayListener onClickAway={() => setOpenTabs({ ...openTabs, 4: false })}>
            <FeedTooltip
              open={openTabs[4]}
              interactive={true}
              title={
                <React.Fragment>
                  <IconButton
                    aria-label="close"
                    className={classes.closeButton}
                    onClick={() => setOpenTabs({ ...openTabs, 4: false })}
                  >
                    <CloseIcon />
                  </IconButton>
                  <Typography variant="h6">
                    Welcome to the <Box component="span">Feed</Box> section.
                  </Typography>
                  <Typography variant="body1">Here you can see recent activities.</Typography>
                </React.Fragment>
              }
              arrow={true}
              placement={supportsSidebar ? "right" : "top"}
            >
              <BottomNavigationAction
                showLabel
                selected={tabVal === 4}
                label="Feed"
                value={4}
                classes={{
                  root: classes.navigation,
                  selected: classes.navigationFeedSelected,
                  label: classes.navigationLabel,
                }}
                icon={
                  <Box>
                    <Feed />
                  </Box>
                }
                onChange={(_, newTab) => setTab(newTab)}
              />
            </FeedTooltip>
          </ClickAwayListener>

          <ClickAwayListener onClickAway={() => setOpenTabs({ ...openTabs, 0: false })}>
            <LearnTooltip
              open={openTabs[0]}
              interactive={true}
              title={
                <React.Fragment>
                  <IconButton
                    aria-label="close"
                    className={classes.closeButton}
                    onClick={() => setOpenTabs({ ...openTabs, 0: false })}
                  >
                    <CloseIcon />
                  </IconButton>
                  <Typography variant="h6">
                    Welcome to the <Box component="span">Learn</Box> section.
                  </Typography>
                  <Typography variant="body1">Here you can take steps to refocus, reflect, and recover.</Typography>
                </React.Fragment>
              }
              arrow={true}
              placement={supportsSidebar ? "right" : "top"}
            >
              <BottomNavigationAction
                showLabel
                selected={tabVal === 0}
                label="Learn"
                value={0}
                classes={{
                  root: classes.navigation,
                  selected: classes.navigationLearnSelected,
                  label: classes.navigationLabel,
                }}
                icon={<Learn />}
                onChange={(_, newTab) => setTab(newTab)}
              />
            </LearnTooltip>
          </ClickAwayListener>
          <ClickAwayListener onClickAway={() => setOpenTabs({ ...openTabs, 1: false })}>
            <AssesTooltip
              open={!props.showWelcome && openTabs[1]}
              interactive={true}
              title={
                <React.Fragment>
                  <IconButton
                    aria-label="close"
                    className={classes.closeButton}
                    onClick={() => setOpenTabs({ ...openTabs, 1: false })}
                  >
                    <CloseIcon />
                  </IconButton>
                  <Typography variant="h6">
                    Welcome to the <Box component="span">Assess</Box> section.
                  </Typography>
                  <Typography variant="body1">Here you can take steps to refocus, reflect, and recover.</Typography>
                </React.Fragment>
              }
              arrow={true}
              placement={supportsSidebar ? "right" : "top"}
            >
              <BottomNavigationAction
                showLabel
                selected={tabVal === 1}
                label="Assess"
                value={1}
                classes={{
                  root: classes.navigation,
                  selected: classes.navigationAssessSelected,
                  label: classes.navigationLabel,
                }}
                icon={<Assess />}
                onChange={(_, newTab) => setTab(newTab)}
              />
            </AssesTooltip>
          </ClickAwayListener>
          <ClickAwayListener onClickAway={() => setOpenTabs({ ...openTabs, 2: false })}>
            <ManageTooltip
              open={openTabs[2]}
              interactive={true}
              title={
                <React.Fragment>
                  <IconButton
                    aria-label="close"
                    className={classes.closeButton}
                    onClick={() => setOpenTabs({ ...openTabs, 2: false })}
                  >
                    <CloseIcon />
                  </IconButton>
                  <Typography variant="h6">
                    Welcome to the <Box component="span">Manage</Box> section.
                  </Typography>
                  <Typography variant="body1">Here you can take steps to refocus, reflect, and recover.</Typography>
                </React.Fragment>
              }
              arrow={true}
              placement={supportsSidebar ? "right" : "top"}
            >
              <BottomNavigationAction
                showLabel
                selected={tabVal === 2}
                label="Manage"
                value={2}
                classes={{
                  root: classes.navigation,
                  selected: classes.navigationManageSelected,
                  label: classes.navigationLabel,
                }}
                icon={<Manage />}
                onChange={(_, newTab) => setTab(newTab)}
              />
            </ManageTooltip>
          </ClickAwayListener>
          <ClickAwayListener onClickAway={() => setOpenTabs({ ...openTabs, 3: false })}>
            <PreventTooltip
              open={!props.showWelcome && openTabs[3]}
              interactive={true}
              title={
                <React.Fragment>
                  <IconButton
                    aria-label="close"
                    className={classes.closeButton}
                    onClick={() => setOpenTabs({ ...openTabs, 3: false })}
                  >
                    <CloseIcon />
                  </IconButton>
                  <Typography variant="h6">
                    Welcome to the <Box component="span">Prevent</Box> section.
                  </Typography>
                  <Typography variant="body1">Here you can take steps to refocus, reflect, and recover.</Typography>
                </React.Fragment>
              }
              arrow={true}
              placement={supportsSidebar ? "right" : "top"}
            >
              <BottomNavigationAction
                showLabel
                selected={tabVal === 3}
                label="Prevent"
                value={3}
                classes={{
                  root: classes.navigation,
                  selected: classes.navigationPreventSelected,
                  label: classes.navigationLabel,
                }}
                icon={<PreventIcon />}
                onChange={(_, newTab) => setTab(newTab)}
              />
            </PreventTooltip>
          </ClickAwayListener>
        </Drawer>
      </Box>
    </div>
  )
}
