// Core Imports
import React, { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Fab,
  AppBar,
  Toolbar,
  Icon,
  IconButton,
  Divider,
  makeStyles,
  createStyles,
} from "@material-ui/core"
import { useTranslation } from "react-i18next"
import ResponsiveDialog from "../../ResponsiveDialog"
import PatientProfilePage from "./Profile/PatientProfilePage"

const useStyles = makeStyles((theme) =>
  createStyles({
    toolbardashboard: {
      minHeight: 100,
      padding: "0 10px",
      "& h5": {
        color: "rgba(0, 0, 0, 0.75)",
        textAlign: "left",
        fontWeight: "600",
        fontSize: 30,
        width: "calc(100% - 96px)",
      },
    },
    btnWhite: {
      background: "#fff",
      borderRadius: "40px",
      boxShadow: "none",
      cursor: "pointer",
      textTransform: "capitalize",
      fontSize: "14px",
      color: "#7599FF",
      "& svg": { marginRight: 8 },
      "&:hover": { color: "#5680f9", background: "#fff", boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.20)" },
    },
  })
)

export default function PatientProfile({
  participant,
  studies,
  onClose,
  setUpdateCount,
  openSettings,
  ...props
}: {
  participant: any
  studies: any
  onClose: Function
  setUpdateCount: Function
  openSettings: Function
}) {
  const classes = useStyles()
  const [profileDialog, setProfileDialog] = useState(false)
  const { t } = useTranslation()

  return (
    <Box>
      <Fab
        size="small"
        color="primary"
        className={classes.btnWhite}
        onClick={() => {
          openSettings(true)
          setProfileDialog(true)
        }}
      >
        <Icon>settings</Icon>
      </Fab>
      <ResponsiveDialog fullScreen transient={false} animate open={!!profileDialog}>
        <AppBar position="static" style={{ background: "#FFF", boxShadow: "none" }}>
          <Toolbar className={classes.toolbardashboard}>
            <IconButton
              onClick={() => {
                openSettings(false)
                setProfileDialog(false)
              }}
              color="default"
              aria-label="Menu"
            >
              <Icon>arrow_back</Icon>
            </IconButton>
            <Typography variant="h5">
              {t("Profile")} {participant?.id ?? ""}
            </Typography>
          </Toolbar>
        </AppBar>
        <Divider />
        <Box py={8} px={4}>
          <PatientProfilePage
            participant={participant}
            onClose={(name) => {
              openSettings(false)
              setProfileDialog(false)
              onClose(name)
            }}
            studies={studies}
            setUpdateCount={setUpdateCount}
          />
        </Box>
      </ResponsiveDialog>
    </Box>
  )
}
