import React, { useState } from "react"
import { Box, Typography, makeStyles, Theme, createStyles, Fab, Icon } from "@material-ui/core"
import SearchBox from "../SearchBox"
import LAMP from "lamp-core"
import { useSnackbar } from "notistack"
import { useTranslation } from "react-i18next"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      "& h5": {
        fontSize: "30px",
        fontWeight: "bold",
      },
    },
    optionsMain: {
      background: "#ECF4FF",
      borderTop: "1px solid #C7C7C7",

      marginTop: 20,
      width: "99.4vw",
      position: "relative",
      left: "50%",
      right: "50%",
      marginLeft: "-50vw",
      marginRight: "-50vw",
    },
    optionsSub: { width: 1030, maxWidth: "80%", margin: "0 auto", padding: "10px 0" },
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
export default function AddResearcher({ refreshResearchers, ...props }) {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const { t, i18n } = useTranslation()

  const addResearcher = async (newData) => {
    if (((await LAMP.Researcher.create(newData)) as any).error === undefined) {
      enqueueSnackbar(t("Successfully created a new Researcher."), {
        variant: "success",
      })
      refreshResearchers()
    } else
      enqueueSnackbar(t("Failed to create a new Researcher."), {
        variant: "error",
      })
  }

  return (
    <Box>
      <Fab size="small" classes={{ root: classes.btnWhite }} onClick={() => {}}>
        <Icon>add</Icon>
      </Fab>
    </Box>
  )
}
