import React, { useState, useEffect } from "react"
import { Box, Chip, Fab, Tooltip, makeStyles, Theme, createStyles } from "@material-ui/core"
// Local Imports
import LAMP, { StudyService } from "lamp-core"
import MultipleSelect from "../../MultipleSelect"
import { useTranslation } from "react-i18next"
import { Service } from "../../DBService/DBService"

export interface NewStudy {
  id?: string
  study_name?: string
}
export interface Study {
  id?: string
  name?: string
}
export interface Researcher {
  id?: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    badgeCount: {
      color: "#6083E7",
      paddingLeft: 10,
    },
    multiselect: {
      border: "1px solid #C6C6C6",
      background: "#FFFFFF",
      color: "rgba(0, 0, 0, 0.4)",
      height: "auto",
      minHeight: "32px",
      paddingTop: "5px",
      paddingBottom: "5px",
      "&:focus": { background: "#FFFFFF !important" },
    },
    multiselectPrimary: {
      background: "#ECF4FF !important",
      border: "1px solid #ECF4FF",
      color: "rgba(0, 0, 0, 0.75)",
      fontWeight: 500,
      "&:focus": { background: "#ECF4FF !important" },
    },
    filterChips: {
      flexWrap: "wrap",
      display: "flex",
      justifyContent: "center",
      maxWidth: 1055,
      margin: "15px auto 0",
      width: "100%",
    },
    chiplabel: { whiteSpace: "break-spaces" },
  })
)

export default function StudyFilterList({
  studies,
  researcher,
  type,
  showFilterStudies,
  setSelectedStudies,
  selectedStudies,
  updateCount,
  setUpdateCount,
  ...props
}: {
  studies?: Array<any>
  researcher?: Researcher
  type?: string
  showFilterStudies?: Boolean
  setSelectedStudies?: Function
  selectedStudies?: Array<string>
  updateCount?: number
  setUpdateCount?: Function
}) {
  const classes = useStyles()
  const { t } = useTranslation()
  const [studiesCount, setStudiesCount] = useState(null)
  const [studs, setStuds] = useState(studies)
  const [allStudies, setAllStudies] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [deSelectAll, setDeselectAll] = useState(false)
  const [researcherId, setResearcherId] = useState(researcher.id)

  useEffect(() => {
    refreshStudies()
  }, [])

  useEffect(() => {
    refreshStudies()
  }, [studies])

  const refreshStudies = () => {
    Service.getAll("studies").then((data: any) => {
      setStuds(data || [])
      let studiesArray = data.map(function (obj) {
        return obj.name
      })
      setAllStudies(studiesArray)
    })
    setUpdateCount(0)
  }

  useEffect(() => {
    let isMounted = true
    refreshStudies()
    return () => {
      isMounted = false
    }
  }, [updateCount])

  useEffect(() => {
    let studiesData = filterStudyData(studs)
    setStudiesCount(studiesData)
  }, [studs])

  const filterStudyData = (dataArray) => {
    return Object.assign(
      {},
      ...dataArray.map((item) => ({
        [item.name]:
          type === "activities" || updateCount === 2
            ? item.activity_count
            : type === "sensors" || updateCount === 3
            ? item.sensor_count
            : item.participant_count,
      }))
    )
  }

  const getFilterTypeStorage = () => {
    return localStorage.getItem("studyFilter_" + researcherId) !== null
      ? JSON.parse(localStorage.getItem("studyFilter_" + researcherId))
      : 0
  }

  return (
    <Box>
      {showFilterStudies === true && (
        <Box mt={1}>
          <Box className={classes.filterChips}>
            {[t("Select All"), t("Deselect All")].map((item) => (
              <Tooltip key={item} style={{ margin: 4 }} title={item}>
                <Chip
                  classes={{
                    root: classes.multiselect,
                    colorPrimary: classes.multiselectPrimary,
                    label: classes.chiplabel,
                  }}
                  label={
                    <section>
                      <b>{t(item)}</b>
                    </section>
                  }
                  color={
                    (getFilterTypeStorage() === 1 && item === "Select All") ||
                    (getFilterTypeStorage() === 2 && item === "Deselect All")
                      ? "primary"
                      : undefined
                  }
                  onClick={(x) => {
                    let allStudiesArray = []
                    let selectAllStudy = false
                    let deselectAllStudy = false
                    let flagData = 0 // 0 = "", 1 = "Select All", 2 = "Deselect All"
                    if (item === "Select All") {
                      allStudiesArray = allStudies
                      selectAllStudy = true
                      deselectAllStudy = false
                      flagData = 1
                    } else if (item === "Deselect All") {
                      selectAllStudy = false
                      deselectAllStudy = true
                      flagData = 2
                    } else {
                      selectAllStudy = false
                      deselectAllStudy = false
                    }
                    setSelectAll(selectAllStudy)
                    setDeselectAll(deselectAllStudy)
                    localStorage.setItem("studies_" + researcherId, JSON.stringify(allStudiesArray))
                    localStorage.setItem("studyFilter_" + researcherId, JSON.stringify(flagData))
                    setSelectedStudies(allStudiesArray)
                  }}
                />
              </Tooltip>
            ))}
          </Box>
          <Box>
            {
              <MultipleSelect
                selected={selectedStudies}
                items={(studs || []).map((x) => `${x.name}`)}
                showZeroBadges={false}
                badges={studiesCount}
                onChange={(x) => {
                  localStorage.setItem("studies_" + researcherId, JSON.stringify(x))
                  setSelectedStudies(x)
                  let flagData = 0 // 0 = "", 1 = "Select All", 2 = "Deselect All"
                  if (allStudies.length !== x.length) {
                    setDeselectAll(false)
                    setSelectAll(false)
                  } else {
                    setSelectAll(true)
                    setDeselectAll(false)
                    flagData = 1
                  }
                  localStorage.setItem("studyFilter_" + researcherId, JSON.stringify(flagData))
                }}
              />
            }
          </Box>
        </Box>
      )}
    </Box>
  )
}
