import React, { useState, useEffect } from "react"
import {
  Box,
  Icon,
  useMediaQuery,
  useTheme,
  Drawer,
  BottomNavigationAction,
  IconButton,
  Typography,
  ClickAwayListener,
  makeStyles,
  Theme,
  createStyles,
  withStyles,
  Tooltip,
} from "@material-ui/core"
import { ReactComponent as Feed } from "../icons/Feed.svg"
import { ReactComponent as Learn } from "../icons/Learn.svg"
import { ReactComponent as Assess } from "../icons/Assess.svg"
import { ReactComponent as Manage } from "../icons/Manage.svg"
import { ReactComponent as PreventIcon } from "../icons/Prevent.svg"
import { useTranslation } from "react-i18next"
import LAMP from "lamp-core"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    navigation: {
      "& svg": { width: 36, height: 36, padding: 6, borderRadius: "50%", opacity: 0.5 },
      [theme.breakpoints.up("md")]: {
        flex: "none",
        minHeight: 125,
      },
      width: "100%",
      minWidth: 64,
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
      "& > div": {
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
    logResearcher: {
      "& > div": {
        marginTop: 50,
        height: "calc(100vh - 55px)",
        borderLeft: "#7599FF solid 5px",
        zIndex: 1111,
        [theme.breakpoints.down("sm")]: {
          borderBottom: "#7599FF solid 5px",
          borderRight: "#7599FF solid 5px",
        },
      },
    },
    btnCursor: {
      "&:hover span ": {
        cursor: "pointer !important",
      },
      "&:hover span > div": {
        cursor: "pointer !important",
      },
      "&:hover span > div > svg": {
        cursor: "pointer !important",
      },
      "&:hover span > div > svg > path": {
        cursor: "pointer !important",
      },
      "&:hover span > svg": {
        cursor: "pointer !important",
      },
      "&:hover span > svg > path": {
        cursor: "pointer !important",
      },
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
  const { t } = useTranslation()
  const [viewedTabs, setViewedTabs] = useState([])
  const [tabValues, setTabValues] = useState(
    localStorage.getItem("bottom-menu-tabs" + props.participant.id) !== null
      ? JSON.parse(localStorage.getItem("bottom-menu-tabs" + props.participant.id))
      : []
  )
  const [openTabs, setOpenTabs] = useState([
    props.tabValue === 0 ? true : false,
    props.tabValue === 1 ? true : false,
    props.tabValue === 2 ? true : false,
    props.tabValue === 3 ? true : false,
    props.tabValue === 4 ? true : false,
  ])

  useEffect(() => {
    openTabUpdate()
  }, [])

  const openTabUpdate = () => {
    setOpenTabs([
      tabVal === 0 && typeof tabValues[0] === "undefined" ? true : false,
      tabVal === 1 && typeof tabValues[1] === "undefined" ? true : false,
      tabVal === 2 && typeof tabValues[2] === "undefined" ? true : false,
      tabVal === 3 && typeof tabValues[3] === "undefined" ? true : false,
      tabVal === 4 && typeof tabValues[4] === "undefined" ? true : false,
    ])
  }
  useEffect(() => {
    localStorage.setItem("bottom-menu-tabs" + props.participant.id, JSON.stringify(tabValues))
  }, [tabValues])

  useEffect(() => {
    openTabUpdate()
  }, [tabVal])

  const tabs = ["learn", "assess", "manage", "prevent", "feed"]

  const setTab = (newTab) => {
    _setTab(newTab)
    if (newTab !== tabVal) {
      ;(async () => {
        await LAMP.SensorEvent.create(props.participant.id, {
          timestamp: new Date().getTime(),
          sensor: "lamp.analytics",
          data: {
            type: "open_page",
            page: tabs[tabVal],
            duration:
              new Date().getTime() - JSON.parse(JSON.stringify(localStorage.getItem("lastTab" + props.participant.id))),
          },
        })
        localStorage.setItem("lastTab" + props.participant.id, JSON.stringify(new Date().getTime()))
      })()
    }
    props.setShowDemoMessage(false)
    if (!viewedTabs.includes(newTab)) {
      setViewedTabs(viewedTabs.concat(newTab))
    }
    props.activeTab(newTab)
  }

  return (
    <div>
      <Box clone displayPrint="none">
        <Drawer
          open
          className={classes.leftbar + (LAMP.Auth._type === "participant" ? "" : " " + classes.logResearcher)}
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
              className={classes.btnCursor}
              title={
                <React.Fragment>
                  <IconButton
                    aria-label="close"
                    className={classes.closeButton}
                    onClick={() => {
                      setTabValues({ ...tabValues, 4: false })
                      setOpenTabs({ ...openTabs, 4: false })
                    }}
                  >
                    <Icon>close</Icon>
                  </IconButton>
                  <Typography variant="h6">{t("Welcome to the Feed section")}</Typography>
                  <Typography variant="body1">{t("Review today's activities.")}</Typography>
                </React.Fragment>
              }
              arrow={true}
              placement={supportsSidebar ? "right" : "top"}
            >
              <BottomNavigationAction
                showLabel
                selected={tabVal === 4}
                label={t("Feed")}
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
              className={classes.btnCursor}
              title={
                <React.Fragment>
                  <IconButton
                    aria-label="close"
                    className={classes.closeButton}
                    onClick={() => {
                      setTabValues({ ...tabValues, 0: false })
                      setOpenTabs({ ...openTabs, 0: false })
                    }}
                  >
                    <Icon>close</Icon>
                  </IconButton>
                  <Typography variant="h6">{t("Welcome to the Learn section")}</Typography>
                  <Typography variant="body1">{t("Find useful information and practice healthy habits.")}</Typography>
                </React.Fragment>
              }
              arrow={true}
              placement={supportsSidebar ? "right" : "top"}
            >
              <BottomNavigationAction
                showLabel
                selected={tabVal === 0}
                label={t("Learn")}
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
              open={openTabs[1]}
              interactive={true}
              className={classes.btnCursor}
              title={
                <React.Fragment>
                  <IconButton
                    aria-label="close"
                    className={classes.closeButton}
                    onClick={() => {
                      setTabValues({ ...tabValues, 1: false })
                      setOpenTabs({ ...openTabs, 1: false })
                    }}
                  >
                    <Icon>close</Icon>
                  </IconButton>
                  <Typography variant="h6">{t("Welcome to the Assess section")}</Typography>
                  <Typography variant="body1">{t("Log feelings, behavior, and activity.")}</Typography>
                </React.Fragment>
              }
              arrow={true}
              placement={supportsSidebar ? "right" : "top"}
            >
              <BottomNavigationAction
                showLabel
                selected={tabVal === 1}
                label={t("Assess")}
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
              className={classes.btnCursor}
              title={
                <React.Fragment>
                  <IconButton
                    aria-label="close"
                    className={classes.closeButton}
                    onClick={() => {
                      setTabValues({ ...tabValues, 2: false })
                      setOpenTabs({ ...openTabs, 2: false })
                    }}
                  >
                    <Icon>close</Icon>
                  </IconButton>
                  <Typography variant="h6">{t("Welcome to the Manage section")}</Typography>
                  <Typography variant="body1">{t("Take steps to refocus, reflect, and recover.")}</Typography>
                </React.Fragment>
              }
              arrow={true}
              placement={supportsSidebar ? "right" : "top"}
            >
              <BottomNavigationAction
                showLabel
                selected={tabVal === 2}
                label={t("Manage")}
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
              open={openTabs[3]}
              interactive={true}
              className={classes.btnCursor}
              title={
                <React.Fragment>
                  <IconButton
                    aria-label="close"
                    className={classes.closeButton}
                    onClick={() => {
                      setTabValues({ ...tabValues, 3: false })
                      setOpenTabs({ ...openTabs, 3: false })
                    }}
                  >
                    <Icon>close</Icon>
                  </IconButton>
                  <Typography variant="h6">{t("Welcome to the Prevent section")}</Typography>
                  <Typography variant="body1">{t("Track progress and make connections.")}</Typography>
                </React.Fragment>
              }
              arrow={true}
              placement={supportsSidebar ? "right" : "top"}
            >
              <BottomNavigationAction
                showLabel
                selected={tabVal === 3}
                label={t("Prevent")}
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
