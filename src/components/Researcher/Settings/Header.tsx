import React from "react"
import { Box, Typography, makeStyles, Theme, createStyles } from "@material-ui/core"
import { useTranslation } from "react-i18next"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      "& h5": {
        fontSize: "30px",
        fontWeight: "bold",
      },
    },
  })
)

export default function Header({ ...props }) {
  const classes = useStyles()
  const { t } = useTranslation()
  return (
    <Box>
      <Box display="flex" className={classes.header}>
        <Box flexGrow={1} pt={1} display="flex">
          <Typography variant="h5">{`${t("Settings")}`}</Typography>
        </Box>
      </Box>
    </Box>
  )
}
