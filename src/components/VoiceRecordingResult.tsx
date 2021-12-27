import React, { useEffect } from "react"
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
    niceWorkbadge: { position: "relative", "& span": { fontSize: "110px", color: "#2F9D7E" } },
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
export default function VoiceRecordingResult({
  openRecordSuccess,
  setOpenRecordSuccess,
  ...props
}: {
  openRecordSuccess?: boolean
  setOpenRecordSuccess?: Function
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
        <IconButton aria-label="close" className={classes.closeButton} onClick={() => setOpenRecordSuccess(false)}>
          <Icon>close</Icon>
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box textAlign="center" pb={4} className={classes.niceWork}>
          <Typography variant="h5" gutterBottom>
            {t("Success") + "!"}
          </Typography>
          <Typography className={classes.ribbonText} component="p">
            {t("Voice Recorded has been submitted Successfully.")}
          </Typography>
          <Box textAlign="center" className={classes.niceWorkbadge}>
            <Icon>check_circle</Icon>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
