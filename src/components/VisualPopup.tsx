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
  DialogActions,
  Button,
  Box,
  Fab,
  Typography,
} from "@material-ui/core"
import { ReactComponent as Ribbon } from "../icons/Ribbon.svg"
import { useTranslation } from "react-i18next"
import ReactMarkdown from "react-markdown"
import emoji from "remark-emoji"
import gfm from "remark-gfm"
import { LinkRenderer } from "./ActivityPopup"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialogueStyle: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    dialogueCurve: { borderRadius: 10, maxWidth: 400 },
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    visualIcon: {
      width: 100,
      height: 100,
      fill: theme.palette.primary.main,
    },
    btnBlue: {
      background: "#7599FF",
      borderRadius: "40px",
      minWidth: 100,
      boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.20)",
      lineHeight: "38px",
      cursor: "pointer",
      textTransform: "capitalize",
      fontSize: "16px",
      color: "#fff",
      "&:hover": { background: "#5680f9" },
    },
    justifyCenter: {
      justifyContent: "center",
      padding: "5px 0 15px",
    },
  })
)

export default function VisualPopup({
  image,
  showStreak,
  ...props
}: {
  image?: any
  showStreak?: Function
} & DialogProps) {
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
      }}
    >
      <DialogContent>
        <Box textAlign="center">
          <Box
            style={{
              margin: "auto",
              height: "400px",
              width: "300px",
              background: `url(${image}) center center/contain no-repeat`,
            }}
          ></Box>
        </Box>
      </DialogContent>
      <DialogActions className={classes.justifyCenter}>
        <Fab
          className={classes.btnBlue}
          aria-label="Save"
          variant="extended"
          onClick={() => {
            showStreak()
          }}
        >
          {`${t("Ok")}`}
        </Fab>
      </DialogActions>
    </Dialog>
  )
}