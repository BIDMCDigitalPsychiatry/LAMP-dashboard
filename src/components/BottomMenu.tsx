import React, { useState } from "react"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import { Box, useMediaQuery, useTheme, Drawer, BottomNavigationAction, Grid } from "@material-ui/core"
import { ReactComponent as Learn } from "../icons/Learn.svg"
import { ReactComponent as Assess } from "../icons/Assess.svg"
import { ReactComponent as Manage } from "../icons/Manage.svg"
import { ReactComponent as PreventIcon } from "../icons/Prevent.svg"
import { ReactComponent as Logo } from "../icons/Logo.svg"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    navigation: {
      "& svg": { width: 36, height: 36, padding: 6, borderRadius: "50%", opacity: 0.5 },
      [theme.breakpoints.up("md")]: {
        flex: "none",
        minHeight: 125,
      },
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
    leftbarLogo: {
      textAlign: "center",
      "& svg": {
        maxWidth: 30,
      },
      [theme.breakpoints.down("sm")]: {
        display: "none",
      },
    },
  })
)

export default function BottomMenu({ ...props }) {
  const classes = useStyles()
  const supportsSidebar = useMediaQuery(useTheme().breakpoints.up("md"))
  const [tab, _setTab] = useState(props.tabValue)

  const setTab = (newTab) => {
    _setTab(newTab)
    props.activeTab(newTab)
  }

  return (
    <Box clone displayPrint="none">
      <Drawer
        open
        anchor={supportsSidebar ? "left" : "bottom"}
        variant="permanent"
        PaperProps={{
          style: {
            flexDirection: supportsSidebar ? "column" : "row",
            justifyContent: !supportsSidebar ? "center" : undefined,
            height: !supportsSidebar ? 80 : undefined,
            width: supportsSidebar ? 100 : undefined,
            transition: "all 500ms ease-in-out",
            background: "#F8F8F8",
            border: 0,
          },
        }}
      >
        <Grid className={classes.leftbarLogo}>
          <Logo />
        </Grid>
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
          onChange={(_, newTab) => setTab(newTab)}
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
  )
}
