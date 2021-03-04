import React, { useState, useEffect } from "react"
import { Box, Fab } from "@material-ui/core"
// Local Imports
import LAMP from "lamp-core"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import { ReactComponent as Filter } from "../../../icons/Filter.svg"
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown"
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp"
import MultipleSelect from "../../MultipleSelect"
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

export default function StudyFilter({ researcher, studies, type, ...props }) {
  const [showFilter, setShowFilter] = useState(false)
  const classes = useStyles()
  const { t } = useTranslation()
  const [selectedStudies, setSelectedStudies] = useState([])
  const [studiesCount, setStudiesCount] = useState(null)

  useEffect(() => {
    let studiesData = filterStudyData(studies)
    setStudiesCount(studiesData)
    ;(async () => {
      let selectedStudies =
        ((await LAMP.Type.getAttachment(researcher.id, "lamp.selectedStudies")) as any).data ??
        (studies ?? []).map((study) => {
          return study.name
        })
      setSelectedStudies(selectedStudies)
    })()
  }, [])

  const filterStudyData = (dataArray) => {
    return Object.assign(
      {},
      ...dataArray.map((item) => ({
        [item.name]:
          type === "activities"
            ? item.activities_count
            : type === "sensors"
            ? item.sensors_count
            : item.participants_count,
      }))
    )
  }

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
      {showFilter === true && (
        <Box mt={1}>
          {
            <MultipleSelect
              selected={selectedStudies}
              items={(studies || []).map((x) => `${x.name}`)}
              showZeroBadges={false}
              badges={studiesCount}
              onChange={(x) => {
                LAMP.Type.setAttachment(researcher.id, "me", "lamp.selectedStudies", x)
                setSelectedStudies(x)
              }}
            />
          }
        </Box>
      )}
    </Box>
  )
}
