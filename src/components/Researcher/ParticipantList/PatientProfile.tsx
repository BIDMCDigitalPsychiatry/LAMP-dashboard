// Core Imports
import React, { useState } from "react"
import { Box, Typography, Button, AppBar, Toolbar, Icon, IconButton, Divider } from "@material-ui/core"
import { makeStyles, createStyles } from "@material-ui/core/styles"
import { useTranslation } from "react-i18next"
import ResponsiveDialog from "../../ResponsiveDialog"
import PatientProfilePage from "./PatientProfilePage"

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
  })
)

export default function PatientProfile({
  participant,
  onClose,
  studies,
  ...props
}: {
  participant: any
  onClose: Function
  studies: any
}) {
  const classes = useStyles()
  const [profileDialog, setProfileDialog] = useState(false)
  const { t } = useTranslation()

  return (
    <Box>
      <Button
        size="small"
        color="primary"
        onClick={() => {
          setProfileDialog(true)
        }}
      >
        Configure
      </Button>
      <ResponsiveDialog fullScreen transient={false} animate open={!!profileDialog}>
        <AppBar position="static" style={{ background: "#FFF", boxShadow: "none" }}>
          <Toolbar className={classes.toolbardashboard}>
            <IconButton onClick={() => setProfileDialog(false)} color="default" aria-label="Menu">
              <Icon>arrow_back</Icon>
            </IconButton>
            <Typography variant="h5">
              {t("Profile")} {participant?.id ?? ""}
            </Typography>
          </Toolbar>
        </AppBar>
        <Divider />
        <Box py={8} px={4}>
          <PatientProfilePage participant={participant} onClose={() => setProfileDialog(false)} studies={studies} />
        </Box>
      </ResponsiveDialog>
    </Box>
  )
}
