import React, { useState, useEffect } from "react"
import { Box, Fab } from "@material-ui/core"
// Local Imports
import LAMP from "lamp-core"
import MultipleSelect from "../../MultipleSelect"
import { useTranslation } from "react-i18next"
import { useSnackbar } from "notistack"
import { Service } from "../../DBService/DBService"

export default function StudyFilterList({
  studies,
  researcher,
  type,
  showFilterStudies,
  newAddedStudy,
  newStudyObj,
  setSelectedStudies,
  selectedStudies,
  selDeletedIds,
  selDeletedStudy,
  ...props
}) {
  const { t } = useTranslation()
  const [studiesCount, setStudiesCount] = useState(null)
  const { enqueueSnackbar } = useSnackbar()
  const [studyIds, setStudyIds] = useState([])
  useEffect(() => {
    let studiesData = filterStudyData(studies)
    setStudiesCount(studiesData)
  }, [studies])

  useEffect(() => {
    if (selDeletedIds.length > 0) {
      let studiesData = filterStudyData(studies)
      let studyIdCounts = {}
      selectedStudies.forEach((x) => (studyIdCounts[x] = (studyIdCounts[x] || 0) + 1))
      let a1 = {}
      let newStudies = studiesData
      let studyKeys = Object.keys(studyIdCounts)
    }
  }, [selDeletedIds])

  useEffect(() => {
    console.log(4000, selDeletedStudy)

    if (selDeletedStudy.length > 0) {
      let studyIdCounts = {}
      selDeletedStudy.forEach((x) => (studyIdCounts[x] = (studyIdCounts[x] || 0) + 1))

      console.log(901, studyIdCounts)

      let studiesData = filterStudyData(studies)
      let newStudies = studiesData
      let studyKeys = Object.keys(studyIdCounts)
      for (let [key, value] of Object.entries(studyIdCounts)) {
        //console.log(733, key, value)

        if (studyKeys.includes(key)) {
          //newStudies[key] = studyIdCounts[key] < 0 ? 0 : studiesData[key] - studyIdCounts[key]
          newStudies[key] = studyIdCounts[key] < 0 ? 0 : studiesData[key] - studyIdCounts[key]
        }
      }

      console.log(734, newStudies)

      setStudiesCount(newStudies)

      console.log(735, studiesCount)
    }
  }, [selDeletedStudy])

  useEffect(() => {
    if (newAddedStudy !== null) {
      let studiesData = filterStudyData(studies)
      let newStudyData = studiesData
      newStudyData[newAddedStudy.study_name] = newStudyData[newAddedStudy.study_name] + 1
      setStudiesCount(studiesData)
    }
  }, [newAddedStudy])

  useEffect(() => {
    if (newStudyObj !== null) {
      studies.push(newStudyObj)
    }
  }, [newStudyObj])

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
              selected={selectedStudies}
              items={(studies || []).map((x) => `${x.name}`)}
              showZeroBadges={false}
              badges={studiesCount}
              onChange={(x) => {
                if (x.length > 0) {
                  LAMP.Type.setAttachment(researcher.id, "me", "lamp.selectedStudies", x)
                  setSelectedStudies(x)
                } else {
                  enqueueSnackbar(t("Atleast 1 study should be selected."), {
                    variant: "error",
                  })
                }
              }}
            />
          }
        </Box>
      )}
    </Box>
  )
}
