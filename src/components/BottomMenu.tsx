import React, { useState } from "react"
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
} from "@material-ui/core"
import { ReactComponent as Learn } from "../icons/Learn.svg"
import { ReactComponent as Assess } from "../icons/Assess.svg"
import { ReactComponent as Manage } from "../icons/Manage.svg"
import { ReactComponent as PreventIcon } from "../icons/Prevent.svg"
import { ReactComponent as Logo } from "../icons/Logo.svg"
import CloseIcon from "@material-ui/icons/Close"
import Tooltip from "@material-ui/core/Tooltip"
import { Link as RouterLink } from "react-router-dom"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    navigation: {
      "& svg": { width: 36, height: 36, padding: 6, borderRadius: "50%", opacity: 0.5 },
      [theme.breakpoints.up("md")]: {
        flex: "none",
        minHeight: 125,
      },
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: "rgba(255, 255, 255, 0.75)",
    },
    navigationLearnSelected: {
      "& svg": {
        background: "#FFD645 !important",
        opacity: 1,
      },
      "& span": { color: "black" },
    },
    navigationManageSelected: {
      "& svg": {
        background: "#FE8470 !important",
        opacity: 1,
      },
      "& span": { color: "black" },
    },
    navigationAssessSelected: {
      "& svg": {
        background: "#65D2AA !important",
        opacity: 1,
      },
      "& span": { color: "black" },
    },
    navigationPreventSelected: {
      "& svg": {
        background: "#7DB2FF !important",
        opacity: 1,
      },
      "& span": { color: "black" },
    },
    navigationLabel: {
      textTransform: "capitalize",
      fontSize: "12px !important",

      letterSpacing: 0,
      color: "rgba(0, 0, 0, 0.4)",
    },
    leftbar: {
      "& div": {
        [theme.breakpoints.up("md")]: {
          background: "#F8F8F8",
          border: 0,
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

const HtmlTooltip = withStyles((theme: Theme) => ({
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
  },
  arrow: {
    color: "#E56F61",
    fontSize: 15,
    [theme.breakpoints.down("sm")]: {
      marginLeft: "19px !important",
    },
  },
}))(Tooltip)

export default function BottomMenu({ ...props }) {
  const classes = useStyles()
  const supportsSidebar = useMediaQuery(useTheme().breakpoints.up("md"))
  const [tabVal, _setTab] = useState(props.tabValue)
  const [openTab, setOpenTab] = useState(props.tabValue === 2 ? true : false)
  console.log(props.tabValue)
  const setTab = (newTab) => {
    _setTab(newTab)
    newTab === 2 ? setOpenTab(true) : setOpenTab(false)
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
              height: !supportsSidebar ? 80 : undefined,
              width: supportsSidebar ? 100 : undefined,
              transition: "all 500ms ease-in-out",
            },
          }}
        >
          <IconButton aria-label="logo" className={classes.leftbarLogo}>
            <Logo />
          </IconButton>
          <Link
            component={RouterLink}
            to="/participant/me"
            underline="none"
            // className={classnames(classes.btngreen, classes.linkButton)}
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
          </Link>
          <Link
            component={RouterLink}
            to="/participant/me"
            underline="none"
            // className={classnames(classes.btngreen, classes.linkButton)}
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
          </Link>
          <HtmlTooltip
            open={openTab}
            interactive={true}
            title={
              <React.Fragment>
                <IconButton aria-label="close" className={classes.closeButton} onClick={() => setOpenTab(false)}>
                  <CloseIcon />
                </IconButton>
                <Typography variant="h6">
                  Welcome to the <Box component="span">Manage</Box> section.
                </Typography>
                <Typography variant="body1">Here you can take steps to refocus, reflect, and recovera.</Typography>
              </React.Fragment>
            }
            arrow={true}
            placement={supportsSidebar ? "right" : "top"}
          >
            <Link
              component={RouterLink}
              to="/participant/me"
              underline="none"
              // className={classnames(classes.btngreen, classes.linkButton)}
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
            </Link>
          </HtmlTooltip>
          <Link
            component={RouterLink}
            to="/participant/me"
            underline="none"
            // className={classnames(classes.btngreen, classes.linkButton)}
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
          </Link>
        </Drawer>
      </Box>
    </div>
  )
}
