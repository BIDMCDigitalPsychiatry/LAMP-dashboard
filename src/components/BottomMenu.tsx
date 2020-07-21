import React, { useState } from "react"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import {
  Box,
  useMediaQuery,
  useTheme,
  Drawer,
  BottomNavigationAction,
  Popover,
  IconButton,
  Typography,
} from "@material-ui/core"
import { ReactComponent as Learn } from "../icons/Learn.svg"
import { ReactComponent as Assess } from "../icons/Assess.svg"
import { ReactComponent as Manage } from "../icons/Manage.svg"
import { ReactComponent as PreventIcon } from "../icons/Prevent.svg"
import { ReactComponent as Logo } from "../icons/Logo.svg"
import CloseIcon from "@material-ui/icons/Close"

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
      color: theme.palette.grey[500],
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
      "&:hover": { backgroundColor: "transparent !important" },
      "& svg": {
        maxWidth: 30,
      },
      [theme.breakpoints.down("sm")]: {
        display: "none",
      },
    },
    popover: {
      pointerEvents: "none",
    },
    paper: {
      padding: theme.spacing(1),
    },
  })
)

export default function BottomMenu({ ...props }) {
  const classes = useStyles()
  const supportsSidebar = useMediaQuery(useTheme().breakpoints.up("md"))
  const [tab, _setTab] = useState(props.tabValue)
  const [open, setOpen] = useState(props.tabValue === 2 ? true : false)
  const [anchorEl, setAnchorEl] = React.useState(null)

  const setTab = (newTab) => {
    _setTab(newTab)
    newTab === 2 ? setOpen(true) : setOpen(false)
    props.activeTab(newTab)
  }
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handlePopoverClose = () => {
    setAnchorEl(null)
  }
  return (
    <div>
      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <IconButton aria-label="close" className={classes.closeButton} onClick={() => setOpen(false)}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h6">Welcome to the Manage section.</Typography>
        <Typography variant="body1">Here you can take steps to refocus, reflect, and recover.</Typography>
      </Popover>

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
          <BottomNavigationAction
            showLabel
            selected={tab === 0}
            label="Learn"
            value={0}
            classes={{
              root: classes.navigation,
              selected: classes.navigationLearnSelected,
              label: classes.navigationLabel,
            }}
            icon={<Learn />}
            onChange={(event, newTab) => {
              setTab(newTab)
              handlePopoverOpen(event)
            }}
          />
          <BottomNavigationAction
            showLabel
            selected={tab === 1}
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
          <BottomNavigationAction
            showLabel
            selected={tab === 2}
            label="Manage"
            value={2}
            classes={{
              root: classes.navigation,
              selected: classes.navigationManageSelected,
              label: classes.navigationLabel,
            }}
            icon={<Manage />}
            onChange={(_, newTab) => setTab(newTab)}
            // onClick={handlePopoverOpen}
          />
          <BottomNavigationAction
            showLabel
            selected={tab === 3}
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
        </Drawer>
      </Box>
    </div>
  )
}
