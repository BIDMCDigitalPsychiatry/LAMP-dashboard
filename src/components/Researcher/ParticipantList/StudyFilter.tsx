import React, { useState, useEffect } from "react"
import { Box, Fab } from "@material-ui/core"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import { ReactComponent as Filter } from "../../../icons/Filter.svg"
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown"
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp"
import { useTranslation } from "react-i18next"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tagFilteredBg: {
      color: "#5784EE !important",
      "& path": { fill: "#5784EE !important", fillOpacity: 1 },
    },
    btnFilter: {
      color: "rgba(0, 0, 0, 0.4)",
      fontSize: 14,
      lineHeight: "38px",
      cursor: "pointer",
      textTransform: "capitalize",
      boxShadow: "none",
      background: "transparent",
      margin: "0 15px",
      paddingRight: 0,
      "& svg": { marginRight: 10 },
    },
    filterText: {
      [theme.breakpoints.down("sm")]: {
        display: "none",
      },
    },
  })
)

export interface Researcher {
  id?: string
}
export interface Studies {
  name?: string
}
export default function StudyFilter({ setShowFilterStudies, ...props }) {
  const [showFilter, setShowFilter] = useState(false)
  const classes = useStyles()
  const { t } = useTranslation()

  useEffect(() => {
    setShowFilterStudies(showFilter)
  }, [showFilter])

  return (
    <Box>
      <Fab
        variant="extended"
        className={classes.btnFilter + " " + (showFilter === true ? classes.tagFilteredBg : "")}
        onClick={() => {
          showFilter === true ? setShowFilter(false) : setShowFilter(true)
        }}
      >
        <Filter /> <span className={classes.filterText}>{t("Filter results")}</span>{" "}
        {showFilter === true ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
      </Fab>
    </Box>
  )
}
