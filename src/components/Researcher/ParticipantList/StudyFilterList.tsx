import React, { useState, useEffect } from "react"
import { Box, Fab } from "@material-ui/core"
// Local Imports
import LAMP from "lamp-core"
import MultipleSelect from "../../MultipleSelect"
import { useTranslation } from "react-i18next"
import { useSnackbar } from "notistack"

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
}: {
  studies?: Array<any>
  researcher?: Researcher
  type?: string
  showFilterStudies?: Boolean
  newAddedStudy?: NewStudy
  newStudyObj?: any
  setSelectedStudies?: Function
  selectedStudies?: Array<string>
  selDeletedIds?: Array<string>
  selDeletedStudy?: Array<string>
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
    if (selDeletedStudy.length > 0) {
      let studyIdCounts = {}
      selDeletedStudy.forEach((x) => (studyIdCounts[x] = (studyIdCounts[x] || 0) + 1))
      let studiesData = filterStudyData(studies)
      let newStudies = studiesData
      let studyKeys = Object.keys(studyIdCounts)
      for (let [key, value] of Object.entries(studyIdCounts)) {
        if (studyKeys.includes(key)) {
          newStudies[key] = studyIdCounts[key] < 0 ? 0 : studiesData[key] - studyIdCounts[key]
        }
      }
      setStudiesCount(newStudies)
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
  /*
  useEffect(() => {
    if (newStudyObj !== null) {
      studies.push(newStudyObj)
      let studiesData = filterStudyData(studies)
      setStudiesCount(studiesData)
    }
  }, [newStudyObj])
*/

  useEffect(() => {
    if (newStudyObj !== null) {
      let studyIdArray = studies.map(function (obj) {
        return obj.id
      })
      /*
      if (!studyIdArray.includes(newStudyObj.id)) {
        studies.push(newStudyObj)
      }
      */
      studies.push(newStudyObj)
      let studiesData = filterStudyData(studies)
      setStudiesCount(studiesData)
    }
  }, [newStudyObj])

  const filterStudyData = (dataArray) => {
    return Object.assign(
      {},
      ...dataArray.map((item) => ({
        [item.name]:
          type === "activities" ? item.activity_count : type === "sensors" ? item.sensor_count : item.participant_count,
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
