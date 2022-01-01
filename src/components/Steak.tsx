import React, { useEffect, useState } from "react"
import {
  Dialog,
  DialogProps,
  DialogContent,
  DialogTitle,
  Icon,
  IconButton,
  Slide,
  useTheme,
  useMediaQuery,
  makeStyles,
  Theme,
  createStyles,
  Box,
  Typography,
} from "@material-ui/core"
import { ReactComponent as Ribbon } from "../icons/Ribbon.svg"
import { useTranslation } from "react-i18next"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    ribbonText: {
      fontSize: "16px",
      color: "rgba(0, 0, 0, 0.75)",
      fontWeight: 600,
      marginBottom: "30px",
      padding: "0 42px",
    },
    niceWork: {
      paddingBottom: 70,
      "& h5": { fontSize: 25, fontWeight: 600, color: "rgba(0, 0, 0, 0.75)" },
    },
    dialogueStyle: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    dialogueCurve: { borderRadius: 10, maxWidth: 400 },
    MuiDialogPaperScrollPaper: {
      maxHeight: "100% !important",
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    niceWorkbadge: { position: "relative" },
    dayNotification: {
      position: "absolute",
      top: 0,
      width: "100%",
      paddingTop: 50,
      "& h4": { fontSize: 40, fontWeight: 700, color: "#00765C", lineHeight: "38px" },
      "& h6": { color: "#00765C", fontSize: 16, fontWeight: 600 },
    },
  })
)
export default function Steak({
  steak,
  activity,
  ...props
}: {
  steak?: number
  activity?: any
} & DialogProps) {
  const sm = useMediaQuery(useTheme().breakpoints.down("sm"))
  const classes = useStyles()
  const { t } = useTranslation()

  return (
    <Dialog
      {...props}
      scroll="paper"
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
      classes={{
        root: classes.dialogueStyle,
        paper: classes.dialogueCurve,
        paperScrollPaper: classes.MuiDialogPaperScrollPaper,
      }}
    >
      <DialogTitle>
        <IconButton aria-label="close" className={classes.closeButton} onClick={props.onClose as any}>
          <Icon>close</Icon>
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box textAlign="center" pb={4} className={classes.niceWork}>
          <Typography variant="h5" gutterBottom>
            {t(!!activity?.steakTitle && activity?.steakTitle.trim().length > 0 ? activity?.steakTitle : "Nice work!")}
          </Typography>
          <Typography className={classes.ribbonText} component="p">
            {t(
              !!activity?.steakDesc && activity?.steakDesc.trim().length > 0
                ? activity?.steakDesc
                : "You’re on a streak, keep it going"
            )}
          </Typography>
          <Box textAlign="center" className={classes.niceWorkbadge}>
            <Ribbon width="170" height="226" />
            <Box className={classes.dayNotification}>
              <Typography variant="h4"> {steak}</Typography>{" "}
              <Typography variant="h6">{steak > 1 ? " " + t("days") : t("day")}</Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
