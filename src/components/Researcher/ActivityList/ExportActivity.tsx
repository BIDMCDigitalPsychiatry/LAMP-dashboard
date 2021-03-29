import React, { useState } from "react"
import { Box, Icon, Fab, makeStyles, Theme, createStyles } from "@material-ui/core"
import LAMP from "lamp-core"
import { useSnackbar } from "notistack"
import { useTranslation } from "react-i18next"
import ResponsiveDialog from "../../ResponsiveDialog"
import { spliceActivity, spliceCTActivity } from "../ActivityList/ActivityMethods"
import { saveAs } from "file-saver"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    btnText: {
      background: "transparent",
      borderRadius: "40px",
      minWidth: 100,
      boxShadow: "none",
      cursor: "pointer",
      textTransform: "capitalize",
      paddingLeft: "13px !important",
      paddingRight: "15px !important",
      fontSize: "14px",
      color: "#7599FF",
      "& svg": { marginRight: 8 },
      "&:hover": { color: "#5680f9", background: "#fff" },
      "& span.MuiIcon-root": { fontSize: 20, marginRight: 3 },
      [theme.breakpoints.up("md")]: {
        //position: "absolute",
      },
    },
  })
)

export default function ExportActivity({ activities, ...props }) {
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation()
  const classes = useStyles()
  const downloadActivities = async (activities) => {
    let data = []
    for (let x of activities) {
      delete x["study_id"]
      delete x["study_name"]
      let activityData = await LAMP.Activity.view(x.id)
      x.settings = activityData.settings
      if (x.spec === "lamp.survey") {
        try {
          let res = (await LAMP.Type.getAttachment(x.id, "lamp.dashboard.survey_description")) as any
          let activity = spliceActivity({
            raw: { ...x, tableData: undefined },
            tag: !!res.error ? undefined : res.data,
          })
          data.push(activity)
        } catch (e) {}
      } else if (!["lamp.group", "lamp.survey"].includes(x.spec)) {
        try {
          let res = (await LAMP.Type.getAttachment(x.id, "lamp.dashboard.activity_details")) as any
          let activity = spliceCTActivity({
            raw: { ...x, tableData: undefined },
            tag: !!res.error ? undefined : res.data,
          })
          data.push(activity)
        } catch (e) {}
      } else data.push({ ...x, tableData: undefined })
    }
    _saveFile(data)
    enqueueSnackbar(t("The selected Activities were successfully exported."), {
      variant: "info",
    })
  }

  const _saveFile = (data) =>
    saveAs(
      new Blob([btoa(unescape(encodeURIComponent(JSON.stringify(data))))], {
        type: "text/plain;charset=utf-8",
      }),
      "export.json"
    )

  return (
    <Fab
      variant="extended"
      size="small"
      classes={{ root: classes.btnText }}
      onClick={() => downloadActivities(activities)}
    >
      <Icon>drive_folder_upload</Icon> {t("Export")}
    </Fab>
  )
}
