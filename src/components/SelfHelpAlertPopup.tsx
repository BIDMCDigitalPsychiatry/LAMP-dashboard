// Core Imports
import React from "react"
import Typography from "@material-ui/core/Typography"
import Box from "@material-ui/core/Box"
import Dialog from "@material-ui/core/Dialog"
import DialogContent from "@material-ui/core/DialogContent"
import DialogActions from "@material-ui/core/DialogActions"
import makeStyles from "@material-ui/core/styles/makeStyles"
import createStyles from "@material-ui/core/styles/createStyles"
import { Theme } from "@material-ui/core/styles/createTheme" // TypeScript
import { DialogProps } from "@material-ui/core/Dialog" // TypeScript
import Link from "@material-ui/core/Link"
import { useTranslation } from "react-i18next"
import ReactMarkdown from "react-markdown"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    dialogueStyle: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    surveytextarea: {
      padding: "20px 40px 40px",
      "& h4": { fontSize: 16, fontWeight: "bold", marginBottom: 15 },
      [theme.breakpoints.down("lg")]: {
        padding: "20px 20px 10px",
      },
    },
    dialogtitle: { padding: 0 },
    dialogueCurve: { borderRadius: 10, maxWidth: 400, minWidth: 325 },
    backbtnlink: {
      width: 48,
      height: 48,
      color: "white",
      boxShadow: "none",
      background: "rgb(73, 151, 208)",
      borderRadius: "20%",
      padding: 12,
      "&:hover": { background: "#007bff" },
    },
  })
)

export default function SelfHelpAlertPopup({ onSubmit, ...props }: any & DialogProps) {
  const classes = useStyles()
  const { t } = useTranslation()

  return (
    <React.Fragment>
      <Dialog
        {...props}
        maxWidth="xs"
        scroll="paper"
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        classes={{
          root: classes.dialogueStyle,
          paper: classes.dialogueCurve,
        }}
      >
        <DialogContent className={classes.surveytextarea}>
          <Typography variant="body2" component="p">
            <ReactMarkdown
              children={`${t("Disclaimer: User's data will not be saved or monitored for self help mode")}`}
            />
          </Typography>
        </DialogContent>

        <DialogActions>
          <Box textAlign="center" width={1} mt={1} mb={3}>
            <Link href={void 0} underline="none" onClick={() => onSubmit()} className={classes.backbtnlink}>
              {`${t("OK")}`}
            </Link>
          </Box>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}
