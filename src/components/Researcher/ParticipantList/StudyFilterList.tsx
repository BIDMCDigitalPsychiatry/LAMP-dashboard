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

export default function StudyFilterList({
  studies,
  researcher,
  type,
  showFilterStudies,
  filteredStudyArray,
  selectedStudies,
  ...props
}) {
  const classes = useStyles()
  const { t } = useTranslation()
  const [selStudies, setSelStudies]: any = useState([])
  const [studiesCount, setStudiesCount] = useState(null)

  useEffect(() => {
    let studiesData = filterStudyData(studies)
    setStudiesCount(studiesData)
    setSelStudies(selectedStudies)
  }, [])

  useEffect(() => {
    filteredStudyArray(selStudies)
  }, [selStudies])

  const filterStudyData = (dataArray) => {
    return Object.assign(
      {},
      ...dataArray.map((item) => ({
        [item.name]:
          type === "activities"
            ? item.activity_count
            : type === "sensors"
            ? item.sensor_count
            : item.participants_count,
      }))
    )
  }

  return (
    <Box>
      {showFilterStudies === true && (
        <Box mt={1}>
          {
            <MultipleSelect
              selected={selStudies}
              items={(studies || []).map((x) => `${x.name}`)}
              showZeroBadges={false}
              badges={studiesCount}
              onChange={(x) => {
                LAMP.Type.setAttachment(researcher.id, "me", "lamp.selectedStudies", x)
                setSelStudies(x)
              }}
            />
          }
        </Box>
      )}
    </Box>
  )
}
